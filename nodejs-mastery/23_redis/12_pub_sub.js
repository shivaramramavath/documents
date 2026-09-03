import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

/*
 * ============================================================
 * Publisher
 * ============================================================
 *
 * Used for:
 *
 * - PUBLISH
 * - normal Redis commands
 * - SET / GET / etc.
 * ============================================================
 */

const publisher = new Redis(REDIS_URL);

/*
 * ============================================================
 * Subscriber
 * ============================================================
 *
 * Dedicated to:
 *
 * - SUBSCRIBE
 * - PSUBSCRIBE
 * - receiving messages
 * ============================================================
 */

const subscriber = new Redis(REDIS_URL);

/*
 * ============================================================
 * Events
 * ============================================================
 */

function registerRedisEvents(client, name) {
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
    console.log(`[${name}] connection closed`);
  });

  client.on("reconnecting", (delay) => {
    console.log(`[${name}] reconnecting in ${delay}ms`);
  });
}

registerRedisEvents(publisher, "publisher");

registerRedisEvents(subscriber, "subscriber");

/*
 * ============================================================
 * Channel names
 * ============================================================
 */

const CHANNELS = {
  general: "app:events",

  user: "app:user",

  timetable: "app:timetable",

  notification: "app:notifications",
};

/*
 * ============================================================
 * 01. Basic subscribe
 * ============================================================
 */

async function basicSubscribe() {
  await subscriber.subscribe(CHANNELS.general);

  console.log(`Subscribed to ${CHANNELS.general}`);
}

/*
 * ============================================================
 * 02. Receive messages
 * ============================================================
 *
 * subscriber.on("message")
 *
 * receives:
 *
 * channel
 * message
 * ============================================================
 */

function registerMessageListener() {
  subscriber.on("message", (channel, message) => {
    console.log("\n--- MESSAGE RECEIVED ---");

    console.log("Channel:", channel);

    console.log("Message:", message);
  });
}

/*
 * ============================================================
 * 03. Publish a message
 * ============================================================
 */

async function publishMessage(channel, message) {
  const receivers = await publisher.publish(channel, message);

  console.log("Message published");

  console.log("Subscribers reached:", receivers);

  return receivers;
}

/*
 * ============================================================
 * 04. Basic publish example
 * ============================================================
 */

async function basicPublish() {
  await publishMessage(CHANNELS.general, "Hello from Redis Pub/Sub");
}

/*
 * ============================================================
 * 05. JSON message
 * ============================================================
 */

async function publishJson() {
  const event = {
    type: "USER_CREATED",

    timestamp: Date.now(),

    data: {
      userId: "user:100",

      name: "Shiva Ram",
    },
  };

  await publishMessage(
    CHANNELS.general,

    JSON.stringify(event),
  );
}

/*
 * ============================================================
 * 06. Parse JSON messages
 * ============================================================
 */

function registerJsonMessageListener() {
  subscriber.on("messageBuffer", () => {
    /*
     * This listener is intentionally
     * not used for JSON handling.
     *
     * It demonstrates that ioredis
     * also exposes Buffer-based events.
     */
  });
}

/*
 * ============================================================
 * 07. Multiple channels
 * ============================================================
 */

async function subscribeMultipleChannels() {
  await subscriber.subscribe(
    CHANNELS.user,
    CHANNELS.timetable,
    CHANNELS.notification,
  );

  console.log("Subscribed to multiple channels");
}

/*
 * ============================================================
 * 08. Publish to multiple channels
 * ============================================================
 */

async function publishMultipleChannels() {
  await publisher.publish(
    CHANNELS.user,

    JSON.stringify({
      type: "USER_CREATED",

      userId: "user:100",
    }),
  );

  await publisher.publish(
    CHANNELS.timetable,

    JSON.stringify({
      type: "TIMETABLE_GENERATED",

      timetableId: "timetable:100",
    }),
  );

  await publisher.publish(
    CHANNELS.notification,

    JSON.stringify({
      type: "NOTIFICATION",

      userId: "user:100",

      message: "Timetable generated",
    }),
  );
}

/*
 * ============================================================
 * 09. Pattern subscription
 * ============================================================
 *
 * PSUBSCRIBE
 *
 * Example:
 *
 * app:user:*
 *
 * receives:
 *
 * app:user:100
 * app:user:101
 * app:user:102
 * ============================================================
 */

async function patternSubscribe() {
  await subscriber.psubscribe("app:user:*");

  console.log("Pattern subscribed:", "app:user:*");
}

/*
 * ============================================================
 * 10. Pattern message listener
 * ============================================================
 */

function registerPatternListener() {
  subscriber.on("pmessage", (pattern, channel, message) => {
    console.log("\n--- PATTERN MESSAGE ---");

    console.log("Pattern:", pattern);

    console.log("Channel:", channel);

    console.log("Message:", message);
  });
}

/*
 * ============================================================
 * 11. Dynamic user channels
 * ============================================================
 */

function getUserChannel(userId) {
  return `app:user:${userId}`;
}

/*
 * ============================================================
 * 12. User-specific event
 * ============================================================
 */

async function publishUserEvent(userId, event) {
  const channel = getUserChannel(userId);

  return publisher.publish(
    channel,

    JSON.stringify(event),
  );
}

/*
 * ============================================================
 * 13. User event example
 * ============================================================
 */

async function userEventExample() {
  await publishUserEvent(
    "100",

    {
      type: "TIMETABLE_READY",

      timetableId: "timetable:100",

      status: "completed",
    },
  );
}

/*
 * ============================================================
 * 14. Unsubscribe
 * ============================================================
 */

async function unsubscribeGeneral() {
  await subscriber.unsubscribe(CHANNELS.general);

  console.log("Unsubscribed:", CHANNELS.general);
}

/*
 * ============================================================
 * 15. Unsubscribe multiple
 * ============================================================
 */

async function unsubscribeMultiple() {
  await subscriber.unsubscribe(
    CHANNELS.user,
    CHANNELS.timetable,
    CHANNELS.notification,
  );
}

/*
 * ============================================================
 * 16. Unsubscribe pattern
 * ============================================================
 */

async function unsubscribePattern() {
  await subscriber.punsubscribe("app:user:*");

  console.log("Pattern unsubscribed");
}

/*
 * ============================================================
 * 17. Check subscriber count
 * ============================================================
 */

async function checkSubscriberCount() {
  const result = await publisher.pubsub(
    "NUMSUB",
    CHANNELS.general,
    CHANNELS.user,
    CHANNELS.timetable,
  );

  console.log("Subscriber counts:", result);
}

/*
 * ============================================================
 * 18. List active channels
 * ============================================================
 */

async function listActiveChannels() {
  const channels = await publisher.pubsub("CHANNELS", "app:*");

  console.log("Active channels:", channels);
}

/*
 * ============================================================
 * 19. Pub/Sub architecture
 * ============================================================
 */

async function architectureExample() {
  /*
   * Publisher:
   *
   * Application A
   *
   *       │
   *       │ PUBLISH
   *       ▼
   *
   * Redis
   *
   *       │
   *       ├──────────────► Application B
   *       │
   *       ├──────────────► Application C
   *       │
   *       └──────────────► Application D
   */

  await publisher.publish(
    "app:architecture",

    JSON.stringify({
      source: "api-server",

      event: "TIMETABLE_GENERATED",

      timestamp: Date.now(),
    }),
  );
}

/*
 * ============================================================
 * 20. Timetable event system
 * ============================================================
 */

async function timetableEventExample() {
  const event = {
    eventId: `event:${Date.now()}`,

    type: "TIMETABLE_GENERATED",

    timetableId: "timetable:100",

    status: "completed",

    timestamp: Date.now(),
  };

  await publisher.publish(
    CHANNELS.timetable,

    JSON.stringify(event),
  );
}

/*
 * ============================================================
 * 21. Socket event bridge
 * ============================================================
 *
 * Redis Pub/Sub can be used between
 * multiple Node.js servers.
 *
 * Server A:
 *
 * Socket.IO event
 *      ↓
 * Redis PUBLISH
 *
 * Server B:
 *
 * Redis SUBSCRIBE
 *      ↓
 * Socket.IO emit
 * ============================================================
 */

async function socketBridgeExample() {
  const event = {
    type: "TIMETABLE_PROGRESS",

    timetableId: "timetable:100",

    progress: 75,

    timestamp: Date.now(),
  };

  await publisher.publish(
    "socket:events",

    JSON.stringify(event),
  );
}

/*
 * ============================================================
 * 22. Event envelope
 * ============================================================
 *
 * A consistent event structure is useful
 * in production.
 * ============================================================
 */

function createEvent({ type, source, data }) {
  return {
    eventId: crypto.randomUUID(),

    type,

    source,

    timestamp: new Date().toISOString(),

    data,
  };
}

/*
 * ============================================================
 * 23. Publish event envelope
 * ============================================================
 */

async function publishEvent({ channel, type, source, data }) {
  const event = createEvent({
    type,
    source,
    data,
  });

  return publisher.publish(
    channel,

    JSON.stringify(event),
  );
}

/*
 * ============================================================
 * 24. Production-style event
 * ============================================================
 */

async function productionEventExample() {
  await publishEvent({
    channel: CHANNELS.timetable,

    type: "TIMETABLE_GENERATED",

    source: "timetable-service",

    data: {
      timetableId: "timetable:100",

      version: 3,

      status: "completed",
    },
  });
}

/*
 * ============================================================
 * 25. Subscriber event handler
 * ============================================================
 */

function handleEvent(channel, rawMessage) {
  let event;

  try {
    event = JSON.parse(rawMessage);
  } catch (error) {
    console.error("Invalid JSON event:", error);

    return;
  }

  console.log("\nEvent received:");

  console.log("Channel:", channel);

  console.log("Event ID:", event.eventId);

  console.log("Type:", event.type);

  console.log("Source:", event.source);

  console.log("Data:", event.data);
}

/*
 * ============================================================
 * 26. Dedicated event subscriber
 * ============================================================
 */

function registerEventHandler() {
  subscriber.on("message", (channel, message) => {
    if (channel === CHANNELS.timetable) {
      handleEvent(channel, message);
    }
  });
}

/*
 * ============================================================
 * 27. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    /*
     * Stop accepting Pub/Sub work.
     */

    await subscriber.quit();

    /*
     * Close publisher connection.
     */

    await publisher.quit();

    console.log("Redis connections closed");
  } catch (error) {
    console.error("Shutdown error:", error);

    publisher.disconnect();
    subscriber.disconnect();
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
    /*
     * Register listeners first.
     */

    registerMessageListener();

    registerPatternListener();

    registerEventHandler();

    registerJsonMessageListener();

    /*
     * Wait for Redis.
     */

    await Promise.all([publisher.ping(), subscriber.ping()]);

    console.log("\nRedis Pub/Sub ready");

    /*
     * Basic subscription.
     */

    console.log("\n--- BASIC SUBSCRIBE ---");

    await basicSubscribe();

    /*
     * Basic publish.
     */

    console.log("\n--- BASIC PUBLISH ---");

    await basicPublish();

    await new Promise((resolve) => setTimeout(resolve, 100));

    /*
     * JSON event.
     */

    console.log("\n--- JSON EVENT ---");

    await publishJson();

    await new Promise((resolve) => setTimeout(resolve, 100));

    /*
     * Multiple channels.
     */

    console.log("\n--- MULTIPLE CHANNELS ---");

    await subscribeMultipleChannels();

    await publishMultipleChannels();

    await new Promise((resolve) => setTimeout(resolve, 100));

    /*
     * Pattern subscription.
     */

    console.log("\n--- PATTERN SUBSCRIBE ---");

    await patternSubscribe();

    await userEventExample();

    await new Promise((resolve) => setTimeout(resolve, 100));

    /*
     * Subscriber count.
     */

    console.log("\n--- SUBSCRIBER COUNT ---");

    await checkSubscriberCount();

    /*
     * Active channels.
     */

    console.log("\n--- ACTIVE CHANNELS ---");

    await listActiveChannels();

    /*
     * Architecture event.
     */

    console.log("\n--- ARCHITECTURE EVENT ---");

    await architectureExample();

    /*
     * Timetable event.
     */

    console.log("\n--- TIMETABLE EVENT ---");

    await timetableEventExample();

    /*
     * Socket bridge.
     */

    console.log("\n--- SOCKET BRIDGE ---");

    await socketBridgeExample();

    /*
     * Production event.
     */

    console.log("\n--- PRODUCTION EVENT ---");

    await productionEventExample();

    await new Promise((resolve) => setTimeout(resolve, 300));

    /*
     * Unsubscribe.
     */

    console.log("\n--- UNSUBSCRIBE ---");

    await unsubscribeGeneral();

    await unsubscribeMultiple();

    await unsubscribePattern();

    console.log("\nPub/Sub examples completed");
  } catch (error) {
    console.error("\nPub/Sub error:", error);
  } finally {
    await subscriber.quit();

    await publisher.quit();
  }
}

await main();
