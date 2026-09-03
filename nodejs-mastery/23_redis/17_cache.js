import Redis from "ioredis";

/*
 * ============================================================
 * Redis configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const CACHE_PREFIX = "cache:";

const DEFAULT_TTL = 60;

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
  console.log("[redis] closed");
});

/*
 * ============================================================
 * Key helper
 * ============================================================
 */

function cacheKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

/*
 * ============================================================
 * Serialization
 * ============================================================
 */

function serialize(value) {
  return JSON.stringify(value);
}

/*
 * ============================================================
 * Deserialization
 * ============================================================
 */

function deserialize(value) {
  if (value === null) {
    return null;
  }

  return JSON.parse(value);
}

/*
 * ============================================================
 * 01. Basic SET
 * ============================================================
 */

async function set(key, value, ttl = DEFAULT_TTL) {
  try {
    await redis.set(cacheKey(key), serialize(value), "EX", ttl);

    return true;
  } catch (error) {
    console.error("[cache] SET failed:", error);

    return false;
  }
}

/*
 * ============================================================
 * 02. Basic GET
 * ============================================================
 */

async function get(key) {
  try {
    const value = await redis.get(cacheKey(key));

    return deserialize(value);
  } catch (error) {
    console.error("[cache] GET failed:", error);

    return null;
  }
}

/*
 * ============================================================
 * 03. DELETE
 * ============================================================
 */

async function del(key) {
  try {
    return (await redis.del(cacheKey(key))) > 0;
  } catch (error) {
    console.error("[cache] DELETE failed:", error);

    return false;
  }
}

/*
 * ============================================================
 * 04. EXISTS
 * ============================================================
 */

async function exists(key) {
  try {
    return (await redis.exists(cacheKey(key))) === 1;
  } catch (error) {
    console.error("[cache] EXISTS failed:", error);

    return false;
  }
}

/*
 * ============================================================
 * 05. TTL
 * ============================================================
 */

async function ttl(key) {
  try {
    return redis.ttl(cacheKey(key));
  } catch (error) {
    console.error("[cache] TTL failed:", error);

    return -1;
  }
}

/*
 * ============================================================
 * 06. CACHE-ASIDE
 * ============================================================
 *
 * Application controls the cache.
 *
 * READ:
 *
 * Application
 *     │
 *     ▼
 * Redis
 *     │
 *     ├── HIT ──► return
 *     │
 *     └── MISS
 *           │
 *           ▼
 *        Database
 *           │
 *           ▼
 *        Redis SET
 *           │
 *           ▼
 *         return
 *
 * This is the most commonly used strategy.
 * ============================================================
 */

async function cacheAside({
  key,
  fetchFromDatabase,
  ttlSeconds = DEFAULT_TTL,
}) {
  /*
   * 1. Try cache.
   */

  const cached = await get(key);

  if (cached !== null) {
    console.log("[cache-aside] HIT:", key);

    return cached;
  }

  /*
   * 2. Cache miss.
   */

  console.log("[cache-aside] MISS:", key);

  /*
   * 3. Database.
   */

  const data = await fetchFromDatabase();

  /*
   * 4. Don't cache null/undefined.
   */

  if (data === null || data === undefined) {
    return data;
  }

  /*
   * 5. Populate cache.
   */

  await set(key, data, ttlSeconds);

  return data;
}

/*
 * ============================================================
 * 07. Cache-aside example
 * ============================================================
 */

async function cacheAsideExample() {
  const user = await cacheAside({
    key: "user:100",

    ttlSeconds: 300,

    fetchFromDatabase: async () => {
      console.log("MongoDB query...");

      return {
        id: "100",

        name: "Shiva",

        role: "student",
      };
    },
  });

  console.log("User:", user);
}

/*
 * ============================================================
 * 08. READ-THROUGH
 * ============================================================
 *
 * Application asks CACHE for data.
 *
 * Cache itself knows how to load
 * missing data from the database.
 *
 *
 * Application
 *      │
 *      ▼
 * Cache Layer
 *      │
 *      ├── HIT ──► return
 *      │
 *      └── MISS
 *            │
 *            ▼
 *         Database
 *            │
 *            ▼
 *         Cache
 *            │
 *            ▼
 *          return
 *
 * Difference:
 *
 * Cache-aside:
 *
 * Application explicitly manages cache.
 *
 * Read-through:
 *
 * Cache abstraction manages cache + DB loading.
 * ============================================================
 */

async function readThrough({ key, loader, ttlSeconds = DEFAULT_TTL }) {
  const cached = await get(key);

  if (cached !== null) {
    console.log("[read-through] HIT:", key);

    return cached;
  }

  console.log("[read-through] MISS:", key);

  const data = await loader();

  if (data === null || data === undefined) {
    return data;
  }

  await set(key, data, ttlSeconds);

  return data;
}

/*
 * ============================================================
 * 09. Read-through example
 * ============================================================
 */

async function readThroughExample() {
  const timetable = await readThrough({
    key: "timetable:123",

    ttlSeconds: 600,

    loader: async () => {
      console.log("Loading timetable from MongoDB...");

      return {
        id: "123",

        name: "CSE Timetable",

        status: "published",
      };
    },
  });

  console.log("Timetable:", timetable);
}

/*
 * ============================================================
 * 10. WRITE-THROUGH
 * ============================================================
 *
 * Every write updates:
 *
 * Database
 *    +
 * Cache
 *
 *
 * Application
 *      │
 *      ▼
 * Write-through layer
 *      │
 *      ├──────────► Database
 *      │
 *      └──────────► Redis
 *
 * Next read:
 *
 * Redis HIT
 *
 * Good when cached data should immediately
 * reflect successful database writes.
 * ============================================================
 */

async function writeThrough({
  key,
  value,
  saveToDatabase,
  ttlSeconds = DEFAULT_TTL,
}) {
  /*
   * 1. Write database first.
   */

  const saved = await saveToDatabase(value);

  /*
   * Only update cache after
   * successful database write.
   */

  await set(key, saved, ttlSeconds);

  return saved;
}

/*
 * ============================================================
 * 11. Write-through example
 * ============================================================
 */

async function writeThroughExample() {
  const user = {
    id: "100",

    name: "Shiva",

    role: "student",
  };

  const saved = await writeThrough({
    key: `user:${user.id}`,

    value: user,

    ttlSeconds: 300,

    saveToDatabase: async (data) => {
      console.log("Saving user to MongoDB...");

      /*
       * Example:
       *
       * await UserModel.findByIdAndUpdate(...)
       */

      return data;
    },
  });

  console.log("Saved:", saved);
}

/*
 * ============================================================
 * 12. WRITE-BEHIND / WRITE-BACK
 * ============================================================
 *
 * Application writes to cache FIRST.
 *
 * Database is updated asynchronously later.
 *
 *
 * Application
 *      │
 *      ▼
 * Redis
 *      │
 *      │ immediate response
 *      ▼
 * Application
 *
 * Redis
 *      │
 *      ▼
 * Queue / Worker
 *      │
 *      ▼
 * Database
 *
 *
 * Advantage:
 *
 * Very fast writes.
 *
 * Disadvantage:
 *
 * More complexity.
 *
 * Potential data loss if Redis/data pipeline fails
 * before persistence.
 * ============================================================
 */

/*
 * Simple in-memory queue for demonstration.
 *
 * Production:
 *
 * Redis Streams
 * BullMQ
 * Kafka
 * etc.
 */

const writeBehindQueue = [];

let writeBehindWorkerRunning = false;

/*
 * ============================================================
 * 13. Queue write-behind operation
 * ============================================================
 */

function enqueueWriteBehind(job) {
  writeBehindQueue.push(job);
}

/*
 * ============================================================
 * 14. Write-behind worker
 * ============================================================
 */

async function processWriteBehindQueue() {
  if (writeBehindWorkerRunning) {
    return;
  }

  writeBehindWorkerRunning = true;

  try {
    while (writeBehindQueue.length > 0) {
      const job = writeBehindQueue.shift();

      try {
        await job.saveToDatabase(job.value);

        console.log("[write-behind] DB persisted:", job.key);
      } catch (error) {
        console.error("[write-behind] DB failure:", error);

        /*
         * Production system:
         *
         * retry
         * dead-letter queue
         * exponential backoff
         */
      }
    }
  } finally {
    writeBehindWorkerRunning = false;
  }
}

/*
 * ============================================================
 * 15. Write-behind implementation
 * ============================================================
 */

async function writeBehind({
  key,
  value,
  saveToDatabase,
  ttlSeconds = DEFAULT_TTL,
}) {
  /*
   * 1. Update Redis immediately.
   */

  await set(key, value, ttlSeconds);

  /*
   * 2. Queue DB persistence.
   */

  enqueueWriteBehind({
    key,

    value,

    saveToDatabase,
  });

  /*
   * 3. Return immediately.
   */

  return value;
}

/*
 * ============================================================
 * 16. Write-behind example
 * ============================================================
 */

async function writeBehindExample() {
  const timetable = {
    id: "123",

    status: "generating",

    progress: 80,
  };

  const result = await writeBehind({
    key: "timetable:123",

    value: timetable,

    ttlSeconds: 600,

    saveToDatabase: async (data) => {
      console.log("Persisting timetable to MongoDB...");

      await new Promise((resolve) => setTimeout(resolve, 1_000));

      console.log("MongoDB persistence completed");
    },
  });

  console.log("Returned immediately:", result);

  /*
   * Worker processes asynchronously.
   */

  await processWriteBehindQueue();
}

/*
 * ============================================================
 * 17. REFRESH-AHEAD
 * ============================================================
 *
 * Cache is refreshed BEFORE expiration.
 *
 *
 * Normal:
 *
 * Cache
 *   │
 *   ├── fresh ──► return
 *   │
 *   └── expired ──► DB
 *
 *
 * Refresh-ahead:
 *
 * Cache
 *   │
 *   ├── fresh ──► return
 *   │
 *   └── near expiry
 *          │
 *          ├── return current value
 *          │
 *          └── refresh asynchronously
 *
 *
 * This prevents users from experiencing
 * cache misses on hot data.
 * ============================================================
 */

/*
 * ============================================================
 * 18. Refresh-ahead implementation
 * ============================================================
 */

async function refreshAhead({
  key,
  loader,
  ttlSeconds = 300,
  refreshThresholdSeconds = 30,
}) {
  const cached = await get(key);

  /*
   * Cache miss.
   */

  if (cached === null) {
    console.log("[refresh-ahead] MISS:", key);

    const data = await loader();

    if (data !== null && data !== undefined) {
      await set(key, data, ttlSeconds);
    }

    return data;
  }

  /*
   * Cache exists.
   */

  const remainingTTL = await ttl(key);

  /*
   * Refresh before expiration.
   */

  if (remainingTTL > 0 && remainingTTL <= refreshThresholdSeconds) {
    console.log("[refresh-ahead] refreshing:", key);

    /*
     * Don't make the user wait.
     */

    void refreshCacheInBackground({
      key,

      loader,

      ttlSeconds,
    });
  }

  return cached;
}

/*
 * ============================================================
 * 19. Background refresh
 * ============================================================
 */

async function refreshCacheInBackground({ key, loader, ttlSeconds }) {
  try {
    const freshData = await loader();

    if (freshData === null || freshData === undefined) {
      return;
    }

    await set(key, freshData, ttlSeconds);

    console.log("[refresh-ahead] refreshed:", key);
  } catch (error) {
    console.error("[refresh-ahead] refresh failed:", error);
  }
}

/*
 * ============================================================
 * 20. Refresh-ahead example
 * ============================================================
 */

async function refreshAheadExample() {
  const data = await refreshAhead({
    key: "timetable:123",

    ttlSeconds: 300,

    refreshThresholdSeconds: 30,

    loader: async () => {
      console.log("Loading fresh timetable...");

      return {
        id: "123",

        status: "published",

        updatedAt: Date.now(),
      };
    },
  });

  console.log("Returned:", data);
}

/*
 * ============================================================
 * 21. CACHE STAMPEDE PROTECTION
 * ============================================================
 *
 * Problem:
 *
 * Cache expires.
 *
 * 100 requests arrive simultaneously.
 *
 *
 * Request 1 ──► DB
 * Request 2 ──► DB
 * Request 3 ──► DB
 * ...
 * Request 100 ► DB
 *
 *
 * This is a cache stampede.
 *
 * We use a Redis lock.
 * ============================================================
 */

async function acquireCacheLock(key, ttlSeconds = 10) {
  const lockKey = `cache-lock:${key}`;

  const token = `${process.pid}:${Date.now()}:${Math.random()}`;

  const result = await redis.set(lockKey, token, "NX", "EX", ttlSeconds);

  if (result !== "OK") {
    return null;
  }

  return {
    lockKey,

    token,
  };
}

/*
 * ============================================================
 * 22. Release cache lock safely
 * ============================================================
 */

const RELEASE_LOCK_SCRIPT = `

if redis.call(
  "GET",
  KEYS[1]
) == ARGV[1]
then

  return redis.call(
    "DEL",
    KEYS[1]
  )

end

return 0

`;

async function releaseCacheLock(lock) {
  if (!lock) {
    return;
  }

  await redis.eval(
    RELEASE_LOCK_SCRIPT,

    1,

    lock.lockKey,

    lock.token,
  );
}

/*
 * ============================================================
 * 23. Stampede-safe cache-aside
 * ============================================================
 */

async function stampedeSafeCacheAside({
  key,
  loader,
  ttlSeconds = DEFAULT_TTL,
}) {
  /*
   * First cache check.
   */

  const cached = await get(key);

  if (cached !== null) {
    return cached;
  }

  /*
   * Try to become the
   * cache population worker.
   */

  const lock = await acquireCacheLock(key, 10);

  if (lock) {
    try {
      /*
       * Double-check cache.
       *
       * Another process might have
       * populated it between the
       * first GET and LOCK.
       */

      const secondCheck = await get(key);

      if (secondCheck !== null) {
        return secondCheck;
      }

      /*
       * Only one worker reaches DB.
       */

      const data = await loader();

      if (data !== null && data !== undefined) {
        await set(key, data, ttlSeconds);
      }

      return data;
    } finally {
      await releaseCacheLock(lock);
    }
  }

  /*
   * Another worker is loading
   * the data.
   *
   * Briefly wait and check cache.
   */

  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const retry = await get(key);

    if (retry !== null) {
      return retry;
    }
  }

  /*
   * Last-resort fallback.
   */

  return loader();
}

/*
 * ============================================================
 * 24. Cache stampede example
 * ============================================================
 */

async function stampedeExample() {
  const results = await Promise.all([
    stampedeSafeCacheAside({
      key: "expensive:data",

      ttlSeconds: 60,

      loader: async () => {
        console.log("EXPENSIVE DATABASE QUERY");

        await new Promise((resolve) => setTimeout(resolve, 1_000));

        return {
          value: "expensive result",
        };
      },
    }),

    stampedeSafeCacheAside({
      key: "expensive:data",

      ttlSeconds: 60,

      loader: async () => {
        console.log("EXPENSIVE DATABASE QUERY");

        return {
          value: "expensive result",
        };
      },
    }),

    stampedeSafeCacheAside({
      key: "expensive:data",

      ttlSeconds: 60,

      loader: async () => {
        console.log("EXPENSIVE DATABASE QUERY");

        return {
          value: "expensive result",
        };
      },
    }),
  ]);

  console.log("Stampede results:", results);
}

/*
 * ============================================================
 * 25. Multi-get
 * ============================================================
 *
 * Avoid N Redis network round trips.
 *
 * BAD:
 *
 * GET
 * GET
 * GET
 * GET
 *
 * GOOD:
 *
 * MGET
 * ============================================================
 */

async function getMany(keys) {
  if (keys.length === 0) {
    return [];
  }

  const redisKeys = keys.map(cacheKey);

  const values = await redis.mget(...redisKeys);

  return values.map(deserialize);
}

/*
 * ============================================================
 * 26. Multi-set
 * ============================================================
 */

async function setMany(entries, ttlSeconds = DEFAULT_TTL) {
  if (entries.length === 0) {
    return;
  }

  const pipeline = redis.pipeline();

  for (const { key, value } of entries) {
    pipeline.set(cacheKey(key), serialize(value), "EX", ttlSeconds);
  }

  await pipeline.exec();
}

/*
 * ============================================================
 * 27. Pipeline cache loading
 * ============================================================
 */

async function pipelineExample() {
  await setMany(
    [
      {
        key: "user:1",

        value: {
          id: 1,

          name: "User 1",
        },
      },

      {
        key: "user:2",

        value: {
          id: 2,

          name: "User 2",
        },
      },

      {
        key: "user:3",

        value: {
          id: 3,

          name: "User 3",
        },
      },
    ],

    300,
  );

  const users = await getMany(["user:1", "user:2", "user:3"]);

  console.log("Users:", users);
}

/*
 * ============================================================
 * 28. Cache invalidation
 * ============================================================
 */

async function invalidateUser(userId) {
  await del(`user:${userId}`);

  console.log("Invalidated user cache:", userId);
}

/*
 * ============================================================
 * 29. Pattern invalidation
 * ============================================================
 *
 * NEVER use KEYS("*") on a huge production database.
 *
 * SCAN is safer.
 * ============================================================
 */

async function deleteByPattern(pattern) {
  let cursor = "0";

  const keys = [];

  do {
    const [nextCursor, matchedKeys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );

    cursor = nextCursor;

    keys.push(...matchedKeys);
  } while (cursor !== "0");

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return keys.length;
}

/*
 * ============================================================
 * 30. Cache service
 * ============================================================
 */

const cache = {
  get,

  set,

  del,

  exists,

  ttl,

  getMany,

  setMany,

  cacheAside,

  readThrough,

  writeThrough,

  writeBehind,

  refreshAhead,

  stampedeSafeCacheAside,

  invalidateUser,

  deleteByPattern,
};

/*
 * ============================================================
 * 31. Strategy comparison
 * ============================================================
 */

function showStrategies() {
  console.log(
    `
============================================================
REDIS CACHE STRATEGIES
============================================================

1. CACHE-ASIDE
---------------

Application → Cache
                │
                ├── HIT → return
                │
                └── MISS → DB → Cache


2. READ-THROUGH
---------------

Application → Cache Layer
                    │
                    ├── HIT → return
                    │
                    └── MISS → DB → Cache


3. WRITE-THROUGH
----------------

Application
     │
     ├──► Database
     │
     └──► Cache


4. WRITE-BEHIND
---------------

Application
     │
     ▼
   Cache
     │
     ▼
 Queue / Worker
     │
     ▼
 Database


5. REFRESH-AHEAD
----------------

Application
     │
     ▼
   Cache
     │
     ├── fresh → return
     │
     └── near expiry
              │
              ├── return old
              │
              └── refresh background


============================================================
EXTRA PRODUCTION PATTERN
============================================================

CACHE STAMPEDE PROTECTION

Many requests
      │
      ▼
 Redis Lock
      │
      ├── One worker → DB
      │
      └── Others → wait
      │
      ▼
    Cache


============================================================
`,
  );
}

/*
 * ============================================================
 * 32. Strategy examples
 * ============================================================
 */

async function runExamples() {
  console.log("\n--- CACHE ASIDE ---");

  await cacheAsideExample();

  console.log("\n--- READ THROUGH ---");

  await readThroughExample();

  console.log("\n--- WRITE THROUGH ---");

  await writeThroughExample();

  console.log("\n--- WRITE BEHIND ---");

  await writeBehindExample();

  console.log("\n--- REFRESH AHEAD ---");

  await refreshAheadExample();

  console.log("\n--- STAMPEDE PROTECTION ---");

  await stampedeExample();

  console.log("\n--- PIPELINE ---");

  await pipelineExample();

  showStrategies();
}

/*
 * ============================================================
 * 33. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    await redis.quit();

    console.log("Redis connection closed");
  } catch (error) {
    console.error("Redis shutdown error:", error);

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
    await redis.ping();

    console.log("\nRedis Cache Examples");

    await runExamples();

    console.log("\nCache examples completed");
  } catch (error) {
    console.error("\nCache error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
