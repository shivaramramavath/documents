import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connected");
});

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("error", (error) => {
  console.error("[redis] error:", error);
});

redis.on("close", () => {
  console.log("[redis] connection closed");
});

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "pipeline:a",
    "pipeline:b",
    "pipeline:c",
    "pipeline:counter",
    "pipeline:user:100",
    "pipeline:user:101",
    "pipeline:user:102",
    "pipeline:timetable:100",
    "pipeline:timetable:101",
    "pipeline:timetable:102",
    "pipeline:ttl",
    "pipeline:error",
  );
}

/*
 * ============================================================
 * 01. Basic pipeline
 * ============================================================
 */

async function basicPipeline() {
  const result = await redis
    .pipeline()
    .set("pipeline:a", "100")
    .set("pipeline:b", "200")
    .set("pipeline:c", "300")
    .get("pipeline:a")
    .get("pipeline:b")
    .get("pipeline:c")
    .exec();

  console.log("Pipeline result:", result);
}

/*
 * ============================================================
 * 02. Pipeline results
 * ============================================================
 *
 * ioredis returns:
 *
 * [
 *   [error, result],
 *   [error, result],
 *   ...
 * ]
 * ============================================================
 */

async function pipelineResults() {
  const result = await redis
    .pipeline()
    .set("pipeline:a", "10")
    .incrby("pipeline:a", 5)
    .get("pipeline:a")
    .exec();

  console.log("Raw result:", result);

  if (result) {
    const setResult = result[0];

    const incrementResult = result[1];

    const getResult = result[2];

    console.log("SET:", setResult);

    console.log("INCRBY:", incrementResult);

    console.log("GET:", getResult);
  }
}

/*
 * ============================================================
 * 03. Build pipeline dynamically
 * ============================================================
 */

async function dynamicPipeline() {
  const pipeline = redis.pipeline();

  const users = [
    {
      id: "100",
      name: "Shiva",
    },

    {
      id: "101",
      name: "Ravi",
    },

    {
      id: "102",
      name: "Kiran",
    },
  ];

  for (const user of users) {
    pipeline.set(`pipeline:user:${user.id}`, JSON.stringify(user));
  }

  const result = await pipeline.exec();

  console.log("Dynamic pipeline:", result);
}

/*
 * ============================================================
 * 04. Bulk GET
 * ============================================================
 */

async function bulkGet() {
  const pipeline = redis.pipeline();

  const userIds = ["100", "101", "102"];

  for (const id of userIds) {
    pipeline.get(`pipeline:user:${id}`);
  }

  const result = await pipeline.exec();

  console.log("Bulk GET:", result);
}

/*
 * ============================================================
 * 05. Bulk SET
 * ============================================================
 */

async function bulkSet() {
  const pipeline = redis.pipeline();

  for (let i = 1; i <= 10; i++) {
    pipeline.set(`pipeline:item:${i}`, `value-${i}`);
  }

  const result = await pipeline.exec();

  console.log("Bulk SET completed:", result.length);

  /*
   * Cleanup temporary keys.
   */

  const cleanupPipeline = redis.pipeline();

  for (let i = 1; i <= 10; i++) {
    cleanupPipeline.del(`pipeline:item:${i}`);
  }

  await cleanupPipeline.exec();
}

/*
 * ============================================================
 * 06. Pipeline + TTL
 * ============================================================
 */

async function pipelineWithTTL() {
  const pipeline = redis.pipeline();

  pipeline.set(
    "pipeline:ttl",
    JSON.stringify({
      userId: "100",
      role: "student",
    }),
  );

  pipeline.expire("pipeline:ttl", 300);

  const result = await pipeline.exec();

  console.log("Pipeline + TTL:", result);

  console.log("TTL:", await redis.ttl("pipeline:ttl"));
}

/*
 * ============================================================
 * 07. Pipeline with hashes
 * ============================================================
 */

async function pipelineHashes() {
  const pipeline = redis.pipeline();

  pipeline.hset(
    "pipeline:user:hash",
    "name",
    "Shiva",
    "role",
    "student",
    "department",
    "CSE",
  );

  pipeline.hget("pipeline:user:hash", "name");

  pipeline.hgetall("pipeline:user:hash");

  const result = await pipeline.exec();

  console.log("Hash pipeline:", result);

  await redis.del("pipeline:user:hash");
}

/*
 * ============================================================
 * 08. Pipeline with sorted sets
 * ============================================================
 */

async function pipelineSortedSet() {
  const pipeline = redis.pipeline();

  pipeline.zadd("pipeline:timetable:priority", 100, "timetable:100");

  pipeline.zadd("pipeline:timetable:priority", 200, "timetable:101");

  pipeline.zadd("pipeline:timetable:priority", 50, "timetable:102");

  pipeline.zrevrange("pipeline:timetable:priority", 0, -1, "WITHSCORES");

  const result = await pipeline.exec();

  console.log("Sorted set pipeline:", result);

  await redis.del("pipeline:timetable:priority");
}

/*
 * ============================================================
 * 09. Pipeline command error
 * ============================================================
 *
 * A command can fail while the rest of the
 * pipeline still executes.
 * ============================================================
 */

async function commandErrorExample() {
  await redis.set("pipeline:error", "hello");

  const result = await redis
    .pipeline()
    .get("pipeline:error")
    .incr("pipeline:error")
    .set("pipeline:error", "world")
    .get("pipeline:error")
    .exec();

  console.log("Pipeline with command error:", result);

  /*
   * INCR on "hello" produces an error.
   *
   * But SET "world" still executes.
   */
}

/*
 * ============================================================
 * 10. Detect pipeline errors
 * ============================================================
 */

async function detectErrors() {
  const result = await redis
    .pipeline()
    .set("pipeline:a", "100")
    .incr("pipeline:a")
    .exec();

  if (result === null) {
    throw new Error("Pipeline execution failed");
  }

  for (const [error, value] of result) {
    if (error) {
      console.error("Pipeline command error:", error);

      continue;
    }

    console.log("Pipeline value:", value);
  }
}

/*
 * ============================================================
 * 11. Pipeline command builder
 * ============================================================
 */

function addUserToPipeline(pipeline, user) {
  pipeline.set(`pipeline:user:${user.id}`, JSON.stringify(user));

  pipeline.expire(`pipeline:user:${user.id}`, 3600);
}

async function commandBuilderExample() {
  const pipeline = redis.pipeline();

  addUserToPipeline(
    pipeline,

    {
      id: "200",

      name: "Shiva Ram",

      role: "student",
    },
  );

  addUserToPipeline(
    pipeline,

    {
      id: "201",

      name: "Ravi",

      role: "faculty",
    },
  );

  const result = await pipeline.exec();

  console.log("Builder result:", result);

  await redis.del("pipeline:user:200", "pipeline:user:201");
}

/*
 * ============================================================
 * 12. Pipeline for cache warming
 * ============================================================
 */

async function cacheWarmingExample() {
  const users = [
    {
      id: "301",
      name: "User 301",
    },

    {
      id: "302",
      name: "User 302",
    },

    {
      id: "303",
      name: "User 303",
    },
  ];

  const pipeline = redis.pipeline();

  for (const user of users) {
    pipeline.set(`pipeline:user:${user.id}`, JSON.stringify(user), "EX", 3600);
  }

  await pipeline.exec();

  console.log("Cache warming completed");

  await redis.del(
    "pipeline:user:301",
    "pipeline:user:302",
    "pipeline:user:303",
  );
}

/*
 * ============================================================
 * 13. Pipeline for timetable cache
 * ============================================================
 */

async function timetableCacheExample() {
  const timetables = [
    {
      id: "100",

      status: "completed",

      version: 1,
    },

    {
      id: "101",

      status: "completed",

      version: 2,
    },

    {
      id: "102",

      status: "generating",

      version: 1,
    },
  ];

  const pipeline = redis.pipeline();

  for (const timetable of timetables) {
    pipeline.set(
      `pipeline:timetable:${timetable.id}`,

      JSON.stringify(timetable),

      "EX",

      3600,
    );
  }

  const result = await pipeline.exec();

  console.log("Timetable cache:", result);

  await redis.del(
    "pipeline:timetable:100",
    "pipeline:timetable:101",
    "pipeline:timetable:102",
  );
}

/*
 * ============================================================
 * 14. Pipeline vs individual commands
 * ============================================================
 */

async function individualCommands() {
  const start = performance.now();

  for (let i = 0; i < 100; i++) {
    await redis.set(`pipeline:individual:${i}`, i);
  }

  const end = performance.now();

  console.log("Individual commands:", `${(end - start).toFixed(2)} ms`);

  const cleanup = redis.pipeline();

  for (let i = 0; i < 100; i++) {
    cleanup.del(`pipeline:individual:${i}`);
  }

  await cleanup.exec();
}

/*
 * ============================================================
 * 15. Pipeline performance
 * ============================================================
 */

async function pipelinePerformance() {
  const start = performance.now();

  const pipeline = redis.pipeline();

  for (let i = 0; i < 100; i++) {
    pipeline.set(`pipeline:performance:${i}`, i);
  }

  await pipeline.exec();

  const end = performance.now();

  console.log("Pipeline:", `${(end - start).toFixed(2)} ms`);

  const cleanup = redis.pipeline();

  for (let i = 0; i < 100; i++) {
    cleanup.del(`pipeline:performance:${i}`);
  }

  await cleanup.exec();
}

/*
 * ============================================================
 * 16. Pipeline chunking
 * ============================================================
 *
 * Don't create one enormous pipeline for
 * millions of commands.
 *
 * Process in chunks.
 * ============================================================
 */

async function chunkedPipeline(items, chunkSize = 100) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    const pipeline = redis.pipeline();

    for (const item of chunk) {
      pipeline.set(item.key, item.value);
    }

    await pipeline.exec();

    console.log(
      `Processed ${Math.min(i + chunkSize, items.length)}/${items.length}`,
    );
  }
}

/*
 * ============================================================
 * 17. Chunked pipeline example
 * ============================================================
 */

async function chunkedPipelineExample() {
  const items = Array.from(
    {
      length: 250,
    },

    (_, index) => ({
      key: `pipeline:chunk:${index}`,

      value: String(index),
    }),
  );

  await chunkedPipeline(items, 50);

  const cleanup = redis.pipeline();

  for (const item of items) {
    cleanup.del(item.key);
  }

  await cleanup.exec();
}

/*
 * ============================================================
 * 18. Pipeline with custom timeout
 * ============================================================
 */

async function pipelineTimeoutExample() {
  const pipeline = redis.pipeline();

  pipeline.set("pipeline:a", "hello");

  pipeline.get("pipeline:a");

  /*
   * exec() accepts normal ioredis
   * command options through the pipeline
   * commands themselves.
   */

  const result = await pipeline.exec();

  console.log("Pipeline result:", result);
}

/*
 * ============================================================
 * 19. Transaction pipeline
 * ============================================================
 *
 * ioredis:
 *
 * multi()
 *
 * is itself implemented using
 * transaction semantics.
 *
 * You can also configure commands
 * inside a transaction.
 * ============================================================
 */

async function transactionPipelineExample() {
  const result = await redis
    .multi()
    .set("pipeline:a", "100")
    .incrby("pipeline:a", 50)
    .get("pipeline:a")
    .exec();

  console.log("Transaction result:", result);
}

/*
 * ============================================================
 * 20. Pipeline API helper
 * ============================================================
 */

async function executePipeline(build) {
  const pipeline = redis.pipeline();

  build(pipeline);

  const result = await pipeline.exec();

  return result;
}

/*
 * ============================================================
 * 21. Helper example
 * ============================================================
 */

async function executePipelineExample() {
  const result = await executePipeline((pipeline) => {
    pipeline.set("pipeline:a", "10");

    pipeline.set("pipeline:b", "20");

    pipeline.incrby("pipeline:a", 5);

    pipeline.get("pipeline:a");
  });

  console.log("Helper pipeline:", result);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- BASIC PIPELINE ---");

    await basicPipeline();

    console.log("\n--- PIPELINE RESULTS ---");

    await pipelineResults();

    console.log("\n--- DYNAMIC PIPELINE ---");

    await dynamicPipeline();

    console.log("\n--- BULK GET ---");

    await bulkGet();

    console.log("\n--- BULK SET ---");

    await bulkSet();

    console.log("\n--- PIPELINE + TTL ---");

    await pipelineWithTTL();

    console.log("\n--- PIPELINE HASHES ---");

    await pipelineHashes();

    console.log("\n--- PIPELINE SORTED SET ---");

    await pipelineSortedSet();

    console.log("\n--- COMMAND ERROR ---");

    await commandErrorExample();

    console.log("\n--- DETECT ERRORS ---");

    await detectErrors();

    console.log("\n--- COMMAND BUILDER ---");

    await commandBuilderExample();

    console.log("\n--- CACHE WARMING ---");

    await cacheWarmingExample();

    console.log("\n--- TIMETABLE CACHE ---");

    await timetableCacheExample();

    console.log("\n--- INDIVIDUAL COMMANDS ---");

    await individualCommands();

    console.log("\n--- PIPELINE PERFORMANCE ---");

    await pipelinePerformance();

    console.log("\n--- CHUNKED PIPELINE ---");

    await chunkedPipelineExample();

    console.log("\n--- PIPELINE TIMEOUT ---");

    await pipelineTimeoutExample();

    console.log("\n--- TRANSACTION ---");

    await transactionPipelineExample();

    console.log("\n--- PIPELINE HELPER ---");

    await executePipelineExample();
  } catch (error) {
    console.error("\nPipeline error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
