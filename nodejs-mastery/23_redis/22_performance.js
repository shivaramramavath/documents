/*
 * ============================================================
 * 22_performance.js
 * ============================================================
 *
 * Redis Performance with ioredis
 *
 * Topics:
 *
 * 1. Connection reuse
 * 2. GET vs MGET
 * 3. Sequential requests
 * 4. Promise.all
 * 5. Pipeline
 * 6. MULTI
 * 7. Lua
 * 8. Batch operations
 * 9. Pipelining large workloads
 * 10. SCAN instead of KEYS
 * 11. Memory-efficient values
 * 12. Compression concepts
 * 13. TTL
 * 14. Hot keys
 * 15. Connection pools
 * 16. Benchmarking
 * 17. Performance metrics
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Connection
 * ============================================================
 */

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  /*
   * Reuse one long-lived connection.
   */

  enableReadyCheck: true,

  maxRetriesPerRequest: 3,

  connectTimeout: 10000,

  commandTimeout: 5000,

  keepAlive: 10000,
});

/*
 * ============================================================
 * Connection events
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

/*
 * ============================================================
 * Utility
 * ============================================================
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * ============================================================
 * 1. BAD:
 * Sequential Redis requests
 * ============================================================
 */

async function sequentialReads(keys) {
  const results = [];

  for (const key of keys) {
    const value = await redis.get(key);

    results.push(value);
  }

  return results;
}

/*
 * ============================================================
 * 2. BETTER:
 * Promise.all
 * ============================================================
 *
 * Requests can execute concurrently.
 *
 * ============================================================
 */

async function parallelReads(keys) {
  return Promise.all(keys.map((key) => redis.get(key)));
}

/*
 * ============================================================
 * 3. BEST for simple reads:
 * MGET
 * ============================================================
 */

async function multiGet(keys) {
  if (keys.length === 0) {
    return [];
  }

  return redis.mget(...keys);
}

/*
 * ============================================================
 * 4. Sequential writes
 * ============================================================
 */

async function sequentialWrites(items) {
  for (const item of items) {
    await redis.set(item.key, item.value);
  }
}

/*
 * ============================================================
 * 5. Pipeline
 * ============================================================
 *
 * Pipeline groups commands into
 * fewer network round trips.
 * ============================================================
 */

async function pipelineWrites(items) {
  const pipeline = redis.pipeline();

  for (const item of items) {
    pipeline.set(item.key, item.value);
  }

  return pipeline.exec();
}

/*
 * ============================================================
 * 6. Pipeline reads
 * ============================================================
 */

async function pipelineReads(keys) {
  const pipeline = redis.pipeline();

  for (const key of keys) {
    pipeline.get(key);
  }

  const results = await pipeline.exec();

  /*
   * Pipeline result format:
   *
   * [
   *   [error, result],
   *   [error, result]
   * ]
   */

  return results.map(([error, result]) => {
    if (error) {
      throw error;
    }

    return result;
  });
}

/*
 * ============================================================
 * 7. MULTI
 * ============================================================
 *
 * MULTI provides Redis transaction semantics.
 *
 * ============================================================
 */

async function transactionExample(userId) {
  const result = await redis
    .multi()

    .incr(`user:${userId}:requests`)

    .expire(`user:${userId}:requests`, 60)

    .exec();

  return result;
}

/*
 * ============================================================
 * 8. Lua script
 * ============================================================
 *
 * Best when multiple Redis commands
 * must happen atomically.
 * ============================================================
 */

const INCREMENT_SCRIPT = `

local current =
  redis.call(
    "INCR",
    KEYS[1]
  )

if current == 1 then

  redis.call(
    "EXPIRE",
    KEYS[1],
    ARGV[1]
  )

end

return current

`;

/*
 * ============================================================
 * Atomic counter
 * ============================================================
 */

async function incrementCounter(key, ttl) {
  return redis.eval(
    INCREMENT_SCRIPT,

    1,

    key,

    ttl,
  );
}

/*
 * ============================================================
 * 9. Batch GET
 * ============================================================
 *
 * Don't create gigantic MGET commands.
 *
 * Split very large workloads into chunks.
 * ============================================================
 */

function chunks(array, size) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

async function batchMGet(keys, batchSize = 500) {
  const groups = chunks(keys, batchSize);

  const results = [];

  for (const group of groups) {
    const values = await redis.mget(...group);

    results.push(...values);
  }

  return results;
}

/*
 * ============================================================
 * 10. Batch pipeline
 * ============================================================
 */

async function batchPipeline(commands, batchSize = 500) {
  const groups = chunks(commands, batchSize);

  const results = [];

  for (const group of groups) {
    const pipeline = redis.pipeline();

    for (const command of group) {
      pipeline[command.name](...command.args);
    }

    const batchResult = await pipeline.exec();

    results.push(...batchResult);
  }

  return results;
}

/*
 * ============================================================
 * 11. SCAN
 * ============================================================
 *
 * NEVER use:
 *
 * KEYS *
 *
 * on a large production Redis.
 *
 * KEYS can block Redis.
 *
 * Use SCAN.
 * ============================================================
 */

async function scanKeys(pattern) {
  const keys = [];

  let cursor = "0";

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,

      "MATCH",

      pattern,

      "COUNT",

      500,
    );

    cursor = nextCursor;

    keys.push(...batch);
  } while (cursor !== "0");

  return keys;
}

/*
 * ============================================================
 * 12. SCAN + DELETE
 * ============================================================
 */

async function deleteByPattern(pattern) {
  let cursor = "0";

  let deleted = 0;

  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,

      "MATCH",

      pattern,

      "COUNT",

      500,
    );

    cursor = nextCursor;

    if (keys.length > 0) {
      deleted += await redis.del(...keys);
    }
  } while (cursor !== "0");

  return deleted;
}

/*
 * ============================================================
 * 13. Avoid large JSON objects
 * ============================================================
 *
 * BAD:
 *
 * SET user {...huge JSON...}
 *
 *
 * Better:
 *
 * HASH
 *
 * HSET user:1
 *      name Ram
 *      age 22
 *      role student
 * ============================================================
 */

async function createUserHash(userId) {
  return redis.hset(
    `user:${userId}`,

    "name",
    "Shiva",

    "role",
    "student",

    "active",
    "true",
  );
}

async function getUserHash(userId) {
  return redis.hgetall(`user:${userId}`);
}

/*
 * ============================================================
 * 14. Read only required fields
 * ============================================================
 */

async function getUserName(userId) {
  return redis.hget(`user:${userId}`, "name");
}

/*
 * ============================================================
 * 15. TTL
 * ============================================================
 *
 * Always use TTL for temporary data.
 * ============================================================
 */

async function setTemporary(key, value, ttl) {
  await redis.set(key, value, "EX", ttl);
}

/*
 * ============================================================
 * 16. Hot key example
 * ============================================================
 *
 * A hot key receives extremely high traffic.
 *
 * Example:
 *
 * dashboard:global
 *
 * 100,000 requests/sec
 *
 * all hitting one Redis key.
 * ============================================================
 */

async function demonstrateHotKey() {
  const key = "dashboard:global";

  return redis.get(key);
}

/*
 * ============================================================
 * 17. Local cache for hot data
 * ============================================================
 *
 * Very short local cache can reduce
 * Redis traffic.
 * ============================================================
 */

const localCache = new Map();

const LOCAL_CACHE_TTL = 5000;

async function getWithLocalCache(key) {
  const cached = localCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await redis.get(key);

  localCache.set(
    key,

    {
      value,

      expiresAt: Date.now() + LOCAL_CACHE_TTL,
    },
  );

  return value;
}

/*
 * ============================================================
 * 18. Avoid unbounded local cache
 * ============================================================
 */

function clearLocalCache() {
  localCache.clear();
}

/*
 * ============================================================
 * 19. Redis INFO
 * ============================================================
 */

async function getRedisInfo() {
  const info = await redis.info("stats");

  return info;
}

/*
 * ============================================================
 * 20. Redis memory info
 * ============================================================
 */

async function getMemoryInfo() {
  const info = await redis.info("memory");

  return info;
}

/*
 * ============================================================
 * 21. Measure operation latency
 * ============================================================
 */

async function measure(name, operation) {
  const start = process.hrtime.bigint();

  try {
    const result = await operation();

    const end = process.hrtime.bigint();

    const duration = Number(end - start) / 1_000_000;

    console.log(`${name}: ${duration.toFixed(2)} ms`);

    return result;
  } catch (error) {
    const end = process.hrtime.bigint();

    const duration = Number(end - start) / 1_000_000;

    console.error(`${name}: FAILED after ${duration.toFixed(2)} ms`);

    throw error;
  }
}

/*
 * ============================================================
 * 22. Benchmark
 * ============================================================
 */

async function benchmark(operation, iterations = 1000) {
  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    await operation();
  }

  const end = process.hrtime.bigint();

  const milliseconds = Number(end - start) / 1_000_000;

  const average = milliseconds / iterations;

  const throughput = iterations / (milliseconds / 1000);

  return {
    iterations,

    totalMs: milliseconds,

    averageMs: average,

    operationsPerSecond: throughput,
  };
}

/*
 * ============================================================
 * 23. Connection health
 * ============================================================
 */

async function healthCheck() {
  const start = process.hrtime.bigint();

  const result = await redis.ping();

  const end = process.hrtime.bigint();

  return {
    status: result === "PONG" ? "healthy" : "unhealthy",

    latencyMs: Number(end - start) / 1_000_000,
  };
}

/*
 * ============================================================
 * 24. Performance test data
 * ============================================================
 */

async function seedData(count = 1000) {
  const pipeline = redis.pipeline();

  for (let i = 0; i < count; i++) {
    pipeline.set(
      `performance:${i}`,

      `value-${i}`,
    );
  }

  await pipeline.exec();

  console.log(`Seeded ${count} keys`);
}

/*
 * ============================================================
 * 25. Pipeline vs sequential
 * ============================================================
 */

async function compareReads(count = 100) {
  const keys = Array.from(
    {
      length: count,
    },

    (_, index) => `performance:${index}`,
  );

  const sequential = await measure(
    "Sequential GET",

    () => sequentialReads(keys),
  );

  const parallel = await measure(
    "Promise.all GET",

    () => parallelReads(keys),
  );

  const mget = await measure(
    "MGET",

    () => multiGet(keys),
  );

  const pipeline = await measure(
    "Pipeline GET",

    () => pipelineReads(keys),
  );

  return {
    sequential,

    parallel,

    mget,

    pipeline,
  };
}

/*
 * ============================================================
 * 26. Performance rules
 * ============================================================
 */

function printPerformanceRules() {
  console.log(
    `
============================================================
REDIS PERFORMANCE RULES
============================================================

1. Reuse Redis connections.

2. Don't create a Redis connection
   for every request.

3. Prefer MGET for multiple simple reads.

4. Prefer MSET for multiple simple writes.

5. Use pipelines for batches of commands.

6. Use Promise.all when commands are
   independent and MGET is unsuitable.

7. Use Lua when atomic multi-step logic
   is required.

8. Don't use KEYS in production.

9. Use SCAN for large keyspaces.

10. Don't store unnecessarily large JSON.

11. Use hashes when field-level access
    is useful.

12. Always use TTL for temporary data.

13. Avoid hot keys.

14. Keep Redis payloads small.

15. Don't send huge pipelines.

16. Batch large workloads.

17. Monitor Redis latency.

18. Monitor memory.

19. Monitor hit/miss ratio.

20. Monitor commands/sec.

21. Monitor connected clients.

22. Use appropriate maxmemory policy.

23. Don't perform CPU-heavy work inside
    Redis Lua scripts.

24. Keep Lua scripts short.

25. Don't block Redis.

============================================================
`,
  );
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await redis.ping();

    console.log("\nRedis Performance");

    /*
     * Seed.
     */

    await seedData(1000);

    /*
     * Compare reads.
     */

    await compareReads(100);

    /*
     * Atomic counter.
     */

    console.log(
      "Counter:",

      await incrementCounter("performance:counter", 60),
    );

    /*
     * Hash.
     */

    await createUserHash("100");

    console.log(
      "User:",

      await getUserHash("100"),
    );

    /*
     * Health.
     */

    console.log(
      "Health:",

      await healthCheck(),
    );

    /*
     * Metrics.
     */

    console.log(
      "Redis stats:",

      await getRedisInfo(),
    );

    printPerformanceRules();
  } catch (error) {
    console.error("[performance]", error);
  } finally {
    await redis.quit();
  }
}

await main();
