import Redis from "ioredis";
import crypto from "node:crypto";

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const STREAM = "timetable:events";

const GROUP = "timetable-workers";

const CONSUMER = `worker-${process.pid}`;

/*
 * ============================================================
 * Redis connections
 * ============================================================
 *
 * Use separate connections for:
 *
 * - normal commands
 * - blocking XREADGROUP
 *
 * A blocking worker connection should be dedicated
 * to consuming.
 * ============================================================
 */

const redis = new Redis(REDIS_URL);

const workerRedis = new Redis(REDIS_URL);

/*
 * ============================================================
 * Redis events
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
    console.log(`[${name}] closed`);
  });

  client.on("reconnecting", (delay) => {
    console.log(`[${name}] reconnecting in ${delay}ms`);
  });
}

registerRedisEvents(redis, "redis");

registerRedisEvents(workerRedis, "worker");

/*
 * ============================================================
 * 01. Create stream if it doesn't exist
 * ============================================================
 *
 * XGROUP CREATE requires the stream to exist unless
 * MKSTREAM is used.
 * ============================================================
 */

async function createStream() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "0-0", "MKSTREAM");

    console.log(`Stream created: ${STREAM}`);
  } catch (error) {
    if (error.message.includes("BUSYGROUP")) {
      console.log(`Consumer group already exists: ${GROUP}`);

      return;
    }

    throw error;
  }
}

/*
 * ============================================================
 * 02. Create consumer group
 * ============================================================
 */

async function createConsumerGroup() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "0-0", "MKSTREAM");

    console.log("Consumer group created");
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
 * 03. Add jobs to stream
 * ============================================================
 */

async function addJob({ type, timetableId, data }) {
  const eventId = crypto.randomUUID();

  const id = await redis.xadd(
    STREAM,
    "*",

    "eventId",
    eventId,

    "type",
    type,

    "timetableId",
    timetableId,

    "data",
    JSON.stringify(data),

    "timestamp",
    new Date().toISOString(),
  );

  console.log("Added job:", id);

  return id;
}

/*
 * ============================================================
 * 04. Add multiple jobs
 * ============================================================
 */

async function seedJobs() {
  for (let i = 1; i <= 10; i++) {
    await addJob({
      type: "TIMETABLE_GENERATE",

      timetableId: `timetable:${i}`,

      data: {
        requestId: crypto.randomUUID(),

        priority: i <= 3 ? "high" : "normal",
      },
    });
  }
}

/*
 * ============================================================
 * 05. XREADGROUP
 * ============================================================
 *
 * Read messages using a consumer group.
 *
 * ">" means:
 *
 * Give me messages that have never been delivered
 * to any consumer in this group.
 * ============================================================
 */

async function readNewMessages() {
  const result = await workerRedis.xreadgroup(
    "GROUP",
    GROUP,
    CONSUMER,

    "COUNT",
    10,

    "STREAMS",
    STREAM,

    ">",
  );

  console.log("New messages:", result);

  return result;
}

/*
 * ============================================================
 * 06. Parse stream response
 * ============================================================
 */

function parseEntry(entry) {
  const [id, fields] = entry;

  const data = {
    id,
  };

  for (let i = 0; i < fields.length; i += 2) {
    data[fields[i]] = fields[i + 1];
  }

  return data;
}

/*
 * ============================================================
 * 07. Process job
 * ============================================================
 */

async function processJob(job) {
  console.log("\nProcessing job:", job.id);

  console.log("Type:", job.type);

  console.log("Timetable:", job.timetableId);

  const data = JSON.parse(job.data);

  console.log("Data:", data);

  /*
   * Simulate work.
   */

  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Job completed:", job.id);
}

/*
 * ============================================================
 * 08. XACK
 * ============================================================
 *
 * Acknowledge successful processing.
 * ============================================================
 */

async function acknowledge(messageId) {
  const result = await redis.xack(STREAM, GROUP, messageId);

  console.log("Acknowledged:", messageId, "result:", result);

  return result;
}

/*
 * ============================================================
 * 09. Consume once
 * ============================================================
 */

async function consumeOnce() {
  const result = await workerRedis.xreadgroup(
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
    console.log("No messages");

    return;
  }

  const [, entries] = result[0];

  for (const entry of entries) {
    const job = parseEntry(entry);

    try {
      await processJob(job);

      await acknowledge(job.id);
    } catch (error) {
      console.error("Job failed:", job.id, error);
    }
  }
}

/*
 * ============================================================
 * 10. Continuous worker
 * ============================================================
 */

let workerRunning = true;

async function workerLoop() {
  console.log(`Worker started: ${CONSUMER}`);

  while (workerRunning) {
    try {
      const result = await workerRedis.xreadgroup(
        "GROUP",
        GROUP,
        CONSUMER,

        "COUNT",
        5,

        "BLOCK",
        5000,

        "STREAMS",
        STREAM,

        ">",
      );

      if (!result) {
        continue;
      }

      const [, entries] = result[0];

      for (const entry of entries) {
        const job = parseEntry(entry);

        try {
          await processJob(job);

          await acknowledge(job.id);
        } catch (error) {
          console.error("Processing failed:", job.id, error);
        }
      }
    } catch (error) {
      console.error("Worker loop error:", error);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("Worker stopped");
}

/*
 * ============================================================
 * 11. XPENDING
 * ============================================================
 *
 * Shows messages delivered to consumers but not
 * acknowledged.
 * ============================================================
 */

async function pendingSummary() {
  const result = await redis.xpending(STREAM, GROUP);

  console.log("\nPending summary:", result);

  return result;
}

/*
 * ============================================================
 * 12. XPENDING range
 * ============================================================
 */

async function pendingMessages() {
  const result = await redis.xpending(
    STREAM,
    GROUP,

    "-",
    "+",

    20,
  );

  console.log("\nPending messages:", result);

  return result;
}

/*
 * ============================================================
 * 13. XPENDING by consumer
 * ============================================================
 */

async function pendingByConsumer() {
  const result = await redis.xpending(
    STREAM,
    GROUP,

    "-",
    "+",

    20,

    CONSUMER,
  );

  console.log("\nPending for consumer:", result);

  return result;
}

/*
 * ============================================================
 * 14. Read own pending messages
 * ============================================================
 *
 * Using "0" instead of ">" reads pending messages
 * previously delivered to this consumer.
 * ============================================================
 */

async function readOwnPending() {
  const result = await workerRedis.xreadgroup(
    "GROUP",
    GROUP,
    CONSUMER,

    "COUNT",
    10,

    "STREAMS",
    STREAM,

    "0",
  );

  console.log("\nOwn pending messages:", result);

  return result;
}

/*
 * ============================================================
 * 15. Demonstrate failure
 * ============================================================
 *
 * We intentionally don't XACK one message.
 * ============================================================
 */

async function createPendingJob() {
  const id = await addJob({
    type: "TEST_PENDING_JOB",

    timetableId: "timetable:pending",

    data: {
      shouldFail: true,
    },
  });

  const result = await workerRedis.xreadgroup(
    "GROUP",
    GROUP,
    CONSUMER,

    "COUNT",
    1,

    "STREAMS",
    STREAM,

    ">",
  );

  console.log("\nPending test result:", result);

  console.log("Intentionally NOT acknowledging:", id);
}

/*
 * ============================================================
 * 16. XCLAIM
 * ============================================================
 *
 * Transfer a pending message from one consumer
 * to another consumer.
 *
 * Useful when a worker dies.
 * ============================================================
 */

async function claimMessage(messageId) {
  const result = await redis.xclaim(
    STREAM,
    GROUP,
    CONSUMER,

    60_000,

    messageId,
  );

  console.log("\nClaimed message:", result);

  return result;
}

/*
 * ============================================================
 * 17. XAUTOCLAIM
 * ============================================================
 *
 * Automatically finds idle pending messages and
 * transfers ownership.
 * ============================================================
 */

async function autoClaimMessages() {
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
 * 18. Consumer information
 * ============================================================
 */

async function consumerInfo() {
  const result = await redis.xinfo("CONSUMERS", STREAM, GROUP);

  console.log("\nConsumers:", result);

  return result;
}

/*
 * ============================================================
 * 19. Group information
 * ============================================================
 */

async function groupInformation() {
  const result = await redis.xinfo("GROUPS", STREAM);

  console.log("\nGroups:", result);

  return result;
}

/*
 * ============================================================
 * 20. Create another consumer
 * ============================================================
 */

async function secondWorkerExample() {
  const secondConsumer = `worker-secondary-${process.pid}`;

  const result = await workerRedis.xreadgroup(
    "GROUP",
    GROUP,
    secondConsumer,

    "COUNT",
    2,

    "STREAMS",
    STREAM,

    ">",
  );

  console.log("\nSecond worker:", secondConsumer);

  console.log("Messages:", result);

  return result;
}

/*
 * ============================================================
 * 21. Delete consumer
 * ============================================================
 */

async function deleteConsumer(consumerName) {
  const result = await redis.xgroup("DELCONSUMER", STREAM, GROUP, consumerName);

  console.log("Deleted consumer:", consumerName);

  console.log("Pending messages removed from consumer:", result);

  return result;
}

/*
 * ============================================================
 * 22. Destroy group
 * ============================================================
 */

async function destroyGroup() {
  const result = await redis.xgroup("DESTROY", STREAM, GROUP);

  console.log("Group destroyed:", result);

  return result;
}

/*
 * ============================================================
 * 23. Set group starting position
 * ============================================================
 */

async function setGroupPosition(id) {
  const result = await redis.xgroup("SETID", STREAM, GROUP, id);

  console.log("Group position changed:", result);

  return result;
}

/*
 * ============================================================
 * 24. Production event publisher
 * ============================================================
 */

async function publishTimetableEvent({ type, timetableId, data }) {
  return addJob({
    type,

    timetableId,

    data,
  });
}

/*
 * ============================================================
 * 25. Production event examples
 * ============================================================
 */

async function publishProductionEvents() {
  await publishTimetableEvent({
    type: "TIMETABLE_REQUESTED",

    timetableId: "timetable:500",

    data: {
      requestedBy: "user:100",
    },
  });

  await publishTimetableEvent({
    type: "TIMETABLE_GENERATING",

    timetableId: "timetable:500",

    data: {
      worker: "langgraph-worker",
    },
  });

  await publishTimetableEvent({
    type: "TIMETABLE_PROGRESS",

    timetableId: "timetable:500",

    data: {
      progress: 75,
    },
  });

  await publishTimetableEvent({
    type: "TIMETABLE_GENERATED",

    timetableId: "timetable:500",

    data: {
      version: 1,

      status: "completed",
    },
  });
}

/*
 * ============================================================
 * 26. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  workerRunning = false;

  try {
    await workerRedis.quit();

    await redis.quit();

    console.log("Redis connections closed");
  } catch (error) {
    console.error("Shutdown error:", error);

    workerRedis.disconnect();

    redis.disconnect();
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
     * Wait for Redis.
     */

    await Promise.all([redis.ping(), workerRedis.ping()]);

    console.log("\nRedis Consumer Groups ready");

    /*
     * Create stream + group.
     */

    await createStream();

    /*
     * Seed jobs.
     */

    console.log("\n--- SEED JOBS ---");

    await seedJobs();

    /*
     * Create consumer group.
     */

    console.log("\n--- CREATE GROUP ---");

    await createConsumerGroup();

    /*
     * Read new messages.
     */

    console.log("\n--- READ NEW MESSAGES ---");

    await readNewMessages();

    /*
     * Add production events.
     */

    console.log("\n--- PRODUCTION EVENTS ---");

    await publishProductionEvents();

    /*
     * Consume once.
     */

    console.log("\n--- CONSUME ONCE ---");

    await consumeOnce();

    /*
     * Consumer information.
     */

    console.log("\n--- CONSUMER INFO ---");

    await consumerInfo();

    /*
     * Group information.
     */

    console.log("\n--- GROUP INFO ---");

    await groupInformation();

    /*
     * Pending summary.
     */

    console.log("\n--- PENDING SUMMARY ---");

    await pendingSummary();

    /*
     * Pending messages.
     */

    console.log("\n--- PENDING MESSAGES ---");

    await pendingMessages();

    /*
     * Pending by consumer.
     */

    console.log("\n--- PENDING BY CONSUMER ---");

    await pendingByConsumer();

    /*
     * Second consumer.
     */

    console.log("\n--- SECOND CONSUMER ---");

    await secondWorkerExample();

    /*
     * Pending test.
     */

    console.log("\n--- CREATE PENDING JOB ---");

    await createPendingJob();

    /*
     * Give message time to become idle.
     */

    await new Promise((resolve) => setTimeout(resolve, 100));

    /*
     * Auto claim.
     */

    console.log("\n--- AUTO CLAIM ---");

    await autoClaimMessages();

    /*
     * Own pending.
     */

    console.log("\n--- OWN PENDING ---");

    await readOwnPending();

    /*
     * Final pending state.
     */

    console.log("\n--- FINAL PENDING ---");

    await pendingSummary();

    console.log("\nConsumer Groups examples completed");
  } catch (error) {
    console.error("\nConsumer Groups error:", error);
  } finally {
    await workerRedis.quit();

    await redis.quit();
  }
}

await main();
