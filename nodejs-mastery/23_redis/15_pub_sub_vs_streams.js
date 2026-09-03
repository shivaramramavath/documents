import Redis from "ioredis";

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const CHANNEL = "app:notifications";

const STREAM = "app:events";

const GROUP = "app-workers";

const CONSUMER = `worker-${process.pid}`;

/*
 * ============================================================
 * Redis clients
 * ============================================================
 *
 * Pub/Sub subscriber needs its own connection.
 *
 * Once a Redis connection enters subscriber mode,
 * it should be dedicated to Pub/Sub operations.
 * ============================================================
 */

const redis = new Redis(REDIS_URL);

const publisher = new Redis(REDIS_URL);

const subscriber = new Redis(REDIS_URL);

const streamWorker = new Redis(REDIS_URL);

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

function registerEvents(client, name) {
  client.on("connect", () => {
    console.log(`[${name}] connected`);
  });

  client.on("ready", () => {
    console.log(`[${name}] ready`);
  });

  client.on("error", (error) => {
    console.error(`[${name}] error:`, error);
  });

  client.on("close", () => {
    console.log(`[${name}] closed`);
  });

  client.on("reconnecting", (delay) => {
    console.log(`[${name}] reconnecting in ${delay}ms`);
  });
}

registerEvents(redis, "redis");

registerEvents(publisher, "publisher");

registerEvents(subscriber, "subscriber");

registerEvents(streamWorker, "stream-worker");

/*
 * ============================================================
 * 01. PUB/SUB PUBLISH
 * ============================================================
 *
 * Pub/Sub is a real-time messaging mechanism.
 *
 * Message is delivered to currently connected subscribers.
 *
 * It is NOT a durable queue.
 * ============================================================
 */

async function publishMessage(channel, message) {
  const receivers = await publisher.publish(channel, message);

  console.log(`Published to ${channel}`);

  console.log("Subscribers receiving message:", receivers);

  return receivers;
}

/*
 * ============================================================
 * 02. PUB/SUB SUBSCRIBE
 * ============================================================
 */

async function subscribeToChannel(channel) {
  await subscriber.subscribe(channel);

  console.log(`Subscribed to ${channel}`);

  subscriber.on("message", (receivedChannel, message) => {
    if (receivedChannel !== channel) {
      return;
    }

    console.log("\nPUB/SUB message received:");

    console.log({
      channel: receivedChannel,

      message,
    });
  });
}

/*
 * ============================================================
 * 03. Publish JSON
 * ============================================================
 */

async function publishJson(channel, event) {
  return publishMessage(channel, JSON.stringify(event));
}

/*
 * ============================================================
 * 04. Pub/Sub example
 * ============================================================
 */

async function pubSubExample() {
  await subscribeToChannel(CHANNEL);

  await new Promise((resolve) => setTimeout(resolve, 100));

  await publishJson(CHANNEL, {
    type: "USER_UPDATED",

    userId: "user:100",

    timestamp: new Date().toISOString(),
  });

  await new Promise((resolve) => setTimeout(resolve, 300));
}

/*
 * ============================================================
 * 05. PSUBSCRIBE
 * ============================================================
 *
 * Pattern subscription.
 *
 * Example:
 *
 * app:*
 *
 * matches:
 *
 * app:user
 * app:timetable
 * app:notification
 * ============================================================
 */

async function patternSubscribe() {
  await subscriber.psubscribe("app:*");

  subscriber.on("pmessage", (pattern, channel, message) => {
    console.log("\nPattern message:", {
      pattern,
      channel,
      message,
    });
  });
}

/*
 * ============================================================
 * 06. Unsubscribe
 * ============================================================
 */

async function unsubscribe(channel) {
  await subscriber.unsubscribe(channel);

  console.log(`Unsubscribed from ${channel}`);
}

/*
 * ============================================================
 * 07. Redis Streams publisher
 * ============================================================
 */

async function streamPublish({ type, data }) {
  const id = await redis.xadd(
    STREAM,

    "MAXLEN",
    "~",
    100_000,

    "*",

    "type",
    type,

    "data",
    JSON.stringify(data),

    "timestamp",
    new Date().toISOString(),
  );

  console.log("\nStream event published:", id);

  return id;
}

/*
 * ============================================================
 * 08. Create consumer group
 * ============================================================
 */

async function createGroup() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "0-0", "MKSTREAM");

    console.log("Consumer group created:", GROUP);
  } catch (error) {
    if (error.message.includes("BUSYGROUP")) {
      console.log("Consumer group already exists");

      return;
    }

    throw error;
  }
}

/*
 * ============================================================
 * 09. Stream consumer
 * ============================================================
 */

async function consumeStreamOnce() {
  const result = await streamWorker.xreadgroup(
    "GROUP",
    GROUP,
    CONSUMER,

    "COUNT",
    10,

    "STREAMS",
    STREAM,

    ">",
  );

  if (!result) {
    console.log("No stream messages");

    return;
  }

  const [, messages] = result[0];

  for (const message of messages) {
    const [id, fields] = message;

    const event = {
      id,
    };

    for (let i = 0; i < fields.length; i += 2) {
      event[fields[i]] = fields[i + 1];
    }

    console.log("\nSTREAM message:", event);

    /*
     * Process first.
     */

    try {
      const data = JSON.parse(event.data);

      await processEvent(event.type, data);

      /*
       * Acknowledge only after
       * successful processing.
       */

      await redis.xack(STREAM, GROUP, id);

      console.log("ACK:", id);
    } catch (error) {
      console.error("Event processing failed:", {
        id,
        error,
      });

      /*
       * Don't XACK.
       *
       * The message remains pending.
       */
    }
  }
}

/*
 * ============================================================
 * 10. Process event
 * ============================================================
 */

async function processEvent(type, data) {
  console.log("Processing:", type);

  console.log("Data:", data);

  /*
   * Simulate application work.
   */

  await new Promise((resolve) => setTimeout(resolve, 300));
}

/*
 * ============================================================
 * 11. Stream pending messages
 * ============================================================
 */

async function getPending() {
  const result = await redis.xpending(STREAM, GROUP);

  console.log("\nPending:", result);

  return result;
}

/*
 * ============================================================
 * 12. Stream worker failure recovery
 * ============================================================
 */

async function autoClaim() {
  const result = await redis.xautoclaim(
    STREAM,
    GROUP,
    CONSUMER,

    60_000,

    "0-0",

    "COUNT",
    10,
  );

  console.log("\nAuto-claimed messages:", result);

  return result;
}

/*
 * ============================================================
 * 13. Compare delivery behavior
 * ============================================================
 */

function compareDelivery() {
  console.log(
    `
============================================================
PUB/SUB
============================================================

Producer
   |
   v
Redis Channel
   |
   +----> Subscriber A
   |
   +----> Subscriber B

If subscriber is offline:
    message is lost.


============================================================
STREAM
============================================================

Producer
   |
   v
Redis Stream
   |
   v
Consumer Group
   |
   +----> Worker A
   |
   +----> Worker B
   |
   +----> Worker C

Message remains in stream.

If processing succeeds:
    XACK

If worker crashes:
    message remains pending

Another worker can:
    XAUTOCLAIM


============================================================
`,
  );
}

/*
 * ============================================================
 * 14. Pub/Sub use cases
 * ============================================================
 */

function pubSubUseCases() {
  console.log(
    `
PUB/SUB USE CASES
-----------------

1. Real-time notifications
2. Cache invalidation
3. Socket.IO coordination
4. Presence updates
5. Live UI updates
6. Short-lived events
7. Broadcast messages
8. Configuration refresh
`,
  );
}

/*
 * ============================================================
 * 15. Streams use cases
 * ============================================================
 */

function streamUseCases() {
  console.log(
    `
STREAM USE CASES
----------------

1. Background jobs
2. AI processing
3. Timetable generation
4. Event processing
5. Reliable worker queues
6. Retry/recovery
7. Audit/event logs
8. Asynchronous workflows
`,
  );
}

/*
 * ============================================================
 * 16. Timetable architecture
 * ============================================================
 */

async function timetableExample() {
  /*
   * Publish a durable event.
   */

  await streamPublish({
    type: "TIMETABLE_REQUESTED",

    data: {
      timetableId: "timetable:123",

      requestedBy: "user:100",
    },
  });

  /*
   * Worker consumes it.
   */

  await consumeStreamOnce();
}

/*
 * ============================================================
 * 17. Real-time timetable notification
 * ============================================================
 */

async function timetableRealtimeNotification() {
  /*
   * This is NOT the durable job.
   *
   * This is only a real-time notification.
   */

  await publishJson("timetable:realtime", {
    type: "TIMETABLE_PROGRESS",

    timetableId: "timetable:123",

    progress: 75,
  });
}

/*
 * ============================================================
 * 18. Hybrid architecture
 * ============================================================
 *
 * The best architecture often uses BOTH.
 * ============================================================
 */

async function hybridExample() {
  /*
   * STEP 1
   *
   * Durable event.
   */

  await streamPublish({
    type: "TIMETABLE_GENERATED",

    data: {
      timetableId: "timetable:123",

      status: "completed",
    },
  });

  /*
   * STEP 2
   *
   * Real-time notification.
   */

  await publishJson("timetable:realtime", {
    type: "TIMETABLE_GENERATED",

    timetableId: "timetable:123",
  });
}

/*
 * ============================================================
 * 19. Decision helper
 * ============================================================
 */

function chooseRedisMechanism({
  needsDurability,
  needsRetry,
  needsWorkerDistribution,
  needsRealtimeBroadcast,
}) {
  if (needsDurability || needsRetry || needsWorkerDistribution) {
    return "Redis Streams + Consumer Groups";
  }

  if (needsRealtimeBroadcast) {
    return "Redis Pub/Sub";
  }

  return "Choose based on application semantics";
}

/*
 * ============================================================
 * 20. Demonstrate decision
 * ============================================================
 */

function decisionExamples() {
  console.log("\nDecision examples:");

  console.log(
    "AI job:",
    chooseRedisMechanism({
      needsDurability: true,

      needsRetry: true,

      needsWorkerDistribution: true,

      needsRealtimeBroadcast: false,
    }),
  );

  console.log(
    "UI notification:",
    chooseRedisMechanism({
      needsDurability: false,

      needsRetry: false,

      needsWorkerDistribution: false,

      needsRealtimeBroadcast: true,
    }),
  );

  console.log(
    "Cache invalidation:",
    chooseRedisMechanism({
      needsDurability: false,

      needsRetry: false,

      needsWorkerDistribution: false,

      needsRealtimeBroadcast: true,
    }),
  );
}

/*
 * ============================================================
 * 21. Clean stream
 * ============================================================
 */

async function cleanStream() {
  await redis.del(STREAM);

  console.log("Stream deleted");
}

/*
 * ============================================================
 * 22. Clean Pub/Sub
 * ============================================================
 *
 * Pub/Sub channels don't need deletion.
 *
 * They don't persist messages.
 * ============================================================
 */

async function cleanPubSub() {
  await subscriber.unsubscribe(CHANNEL);

  console.log("Pub/Sub unsubscribed");
}

/*
 * ============================================================
 * 23. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    await cleanPubSub();

    await Promise.all([
      redis.quit(),

      publisher.quit(),

      subscriber.quit(),

      streamWorker.quit(),
    ]);

    console.log("All Redis connections closed");
  } catch (error) {
    console.error("Shutdown error:", error);
  }

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await Promise.all([
      redis.ping(),

      publisher.ping(),

      subscriber.ping(),

      streamWorker.ping(),
    ]);

    console.log("\nRedis comparison example started");

    /*
     * Comparison.
     */

    compareDelivery();

    pubSubUseCases();

    streamUseCases();

    /*
     * Consumer group.
     */

    await createGroup();

    /*
     * Pub/Sub.
     */

    console.log("\n--- PUB/SUB ---");

    await pubSubExample();

    /*
     * Stream.
     */

    console.log("\n--- STREAM ---");

    await timetableExample();

    /*
     * Realtime notification.
     */

    console.log("\n--- REALTIME ---");

    await timetableRealtimeNotification();

    /*
     * Hybrid.
     */

    console.log("\n--- HYBRID ---");

    await hybridExample();

    /*
     * Pending.
     */

    console.log("\n--- PENDING ---");

    await getPending();

    /*
     * Decision examples.
     */

    decisionExamples();

    console.log("\nRedis Pub/Sub vs Streams completed");
  } catch (error) {
    console.error("\nError:", error);
  } finally {
    await subscriber.unsubscribe(CHANNEL);

    await redis.quit();

    await publisher.quit();

    await subscriber.quit();

    await streamWorker.quit();
  }
}

await main();
