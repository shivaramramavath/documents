import Redis from "ioredis";
import crypto from "node:crypto";

/*
 * ============================================================
 * Redis configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

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

redis.on("reconnecting", (delay) => {
  console.log(`[redis] reconnecting in ${delay}ms`);
});

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const LOCK_PREFIX = "lock:";

const DEFAULT_TTL = 10_000;

/*
 * ============================================================
 * Generate unique lock token
 * ============================================================
 *
 * NEVER use a static value as the lock owner.
 *
 * Every worker must have a unique token.
 * ============================================================
 */

function createLockToken() {
  return [process.pid, crypto.randomUUID()].join(":");
}

/*
 * ============================================================
 * Build lock key
 * ============================================================
 */

function getLockKey(resource) {
  return `${LOCK_PREFIX}${resource}`;
}

/*
 * ============================================================
 * 01. Basic lock acquisition
 * ============================================================
 *
 * SET key value NX EX seconds
 *
 * NX:
 *   Only set if key does NOT exist.
 *
 * EX:
 *   Automatically expire after N seconds.
 * ============================================================
 */

async function acquireLock(resource, ttl = DEFAULT_TTL) {
  const key = getLockKey(resource);

  const token = createLockToken();

  const result = await redis.set(
    key,
    token,

    "NX",

    "PX",
    ttl,
  );

  if (result !== "OK") {
    return null;
  }

  console.log("Lock acquired:", {
    resource,
    key,
    token,
    ttl,
  });

  return {
    key,

    token,

    ttl,
  };
}

/*
 * ============================================================
 * 02. Check whether lock exists
 * ============================================================
 */

async function isLocked(resource) {
  const key = getLockKey(resource);

  const value = await redis.get(key);

  return value !== null;
}

/*
 * ============================================================
 * 03. Get lock owner
 * ============================================================
 */

async function getLockOwner(resource) {
  const key = getLockKey(resource);

  return redis.get(key);
}

/*
 * ============================================================
 * 04. UNSAFE release
 * ============================================================
 *
 * DON'T use this in production:
 *
 * DEL lock:key
 *
 * Why?
 *
 * Worker A:
 *
 * acquire lock
 *      |
 *      | TTL expires
 *      |
 *      X
 *
 * Worker B:
 *
 * acquire lock
 *
 * Worker A:
 *
 * DEL lock:key
 *
 * Worker A has now deleted
 * Worker B's lock.
 *
 * Therefore we need token verification.
 * ============================================================
 */

async function unsafeRelease(resource) {
  const key = getLockKey(resource);

  return redis.del(key);
}

/*
 * ============================================================
 * 05. SAFE RELEASE using Lua
 * ============================================================
 *
 * Atomically:
 *
 * IF current owner == my token
 * THEN delete lock
 * ELSE do nothing
 *
 * Lua executes atomically inside Redis.
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

else

  return 0

end

`;

async function releaseLock(lock) {
  if (!lock) {
    return false;
  }

  const result = await redis.eval(
    RELEASE_LOCK_SCRIPT,

    1,

    lock.key,

    lock.token,
  );

  const released = result === 1;

  console.log(released ? "Lock released" : "Lock release rejected");

  return released;
}

/*
 * ============================================================
 * 06. Basic lock example
 * ============================================================
 */

async function basicLockExample() {
  const lock = await acquireLock("timetable:123", 10_000);

  if (!lock) {
    console.log("Could not acquire lock");

    return;
  }

  try {
    console.log("Doing protected work...");

    await new Promise((resolve) => setTimeout(resolve, 2_000));
  } finally {
    await releaseLock(lock);
  }
}

/*
 * ============================================================
 * 07. tryLock
 * ============================================================
 */

async function tryLock(resource, ttl = DEFAULT_TTL) {
  return acquireLock(resource, ttl);
}

/*
 * ============================================================
 * 08. Retry lock acquisition
 * ============================================================
 */

async function acquireLockWithRetry({
  resource,
  ttl = DEFAULT_TTL,
  retries = 10,
  retryDelay = 200,
}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const lock = await tryLock(resource, ttl);

    if (lock) {
      console.log(`Lock acquired on attempt ${attempt}`);

      return lock;
    }

    console.log(`Lock unavailable. Attempt ${attempt}/${retries}`);

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return null;
}

/*
 * ============================================================
 * 09. withLock
 * ============================================================
 *
 * Automatically:
 *
 * acquire
 *   ↓
 * execute
 *   ↓
 * release
 *
 * This is the preferred application-level abstraction.
 * ============================================================
 */

async function withLock(resource, fn, options = {}) {
  const {
    ttl = DEFAULT_TTL,

    retries = 10,

    retryDelay = 200,
  } = options;

  const lock = await acquireLockWithRetry({
    resource,

    ttl,

    retries,

    retryDelay,
  });

  if (!lock) {
    throw new Error(`Could not acquire lock: ${resource}`);
  }

  try {
    return await fn();
  } finally {
    await releaseLock(lock);
  }
}

/*
 * ============================================================
 * 10. withLock example
 * ============================================================
 */

async function withLockExample() {
  const result = await withLock(
    "timetable:123",

    async () => {
      console.log("Inside distributed lock");

      await new Promise((resolve) => setTimeout(resolve, 1_000));

      return {
        success: true,
      };
    },

    {
      ttl: 10_000,

      retries: 5,

      retryDelay: 500,
    },
  );

  console.log("Result:", result);
}

/*
 * ============================================================
 * 11. Lock TTL
 * ============================================================
 */

async function getLockTTL(resource) {
  const key = getLockKey(resource);

  const ttl = await redis.pttl(key);

  console.log("Lock TTL:", ttl);

  return ttl;
}

/*
 * ============================================================
 * 12. Lock expiration
 * ============================================================
 */

async function expirationExample() {
  const lock = await acquireLock("temporary-resource", 3_000);

  if (!lock) {
    console.log("Unable to acquire");

    return;
  }

  console.log("Lock acquired");

  await getLockTTL("temporary-resource");

  console.log("Waiting for expiration...");

  await new Promise((resolve) => setTimeout(resolve, 4_000));

  const locked = await isLocked("temporary-resource");

  console.log("Still locked:", locked);
}

/*
 * ============================================================
 * 13. Lock renewal script
 * ============================================================
 *
 * Only extend the lock if we still own it.
 * ============================================================
 */

const RENEW_LOCK_SCRIPT = `

if redis.call(
  "GET",
  KEYS[1]
) == ARGV[1]
then

  return redis.call(
    "PEXPIRE",
    KEYS[1],
    ARGV[2]
  )

else

  return 0

end

`;

async function renewLock(lock, ttl) {
  const result = await redis.eval(
    RENEW_LOCK_SCRIPT,

    1,

    lock.key,

    lock.token,

    ttl,
  );

  const renewed = result === 1;

  console.log(renewed ? "Lock renewed" : "Lock renewal rejected");

  return renewed;
}

/*
 * ============================================================
 * 14. Lock heartbeat
 * ============================================================
 */

function startLockHeartbeat(lock, ttl) {
  const interval = Math.floor(ttl / 3);

  const timer = setInterval(
    async () => {
      try {
        const renewed = await renewLock(lock, ttl);

        if (!renewed) {
          console.error("Lost distributed lock!");

          clearInterval(timer);
        }
      } catch (error) {
        console.error("Lock heartbeat error:", error);
      }
    },

    interval,
  );

  return () => {
    clearInterval(timer);
  };
}

/*
 * ============================================================
 * 15. Long-running lock
 * ============================================================
 */

async function longRunningTask() {
  const ttl = 5_000;

  const lock = await acquireLock("long-task", ttl);

  if (!lock) {
    console.log("Unable to acquire long-task lock");

    return;
  }

  const stopHeartbeat = startLockHeartbeat(lock, ttl);

  try {
    console.log("Starting long task...");

    /*
     * Simulate a task longer
     * than the original TTL.
     */

    await new Promise((resolve) => setTimeout(resolve, 15_000));

    console.log("Long task completed");
  } finally {
    stopHeartbeat();

    await releaseLock(lock);
  }
}

/*
 * ============================================================
 * 16. Demonstrate lock contention
 * ============================================================
 */

async function worker(workerName) {
  const resource = "shared:timetable";

  console.log(`${workerName} trying to acquire lock`);

  const lock = await acquireLock(resource, 5_000);

  if (!lock) {
    console.log(`${workerName} could not acquire lock`);

    return;
  }

  try {
    console.log(`${workerName} acquired lock`);

    await new Promise((resolve) => setTimeout(resolve, 2_000));

    console.log(`${workerName} completed work`);
  } finally {
    await releaseLock(lock);
  }
}

/*
 * ============================================================
 * 17. Multiple workers
 * ============================================================
 */

async function contentionExample() {
  await Promise.all([
    worker("worker-1"),

    worker("worker-2"),

    worker("worker-3"),
  ]);
}

/*
 * ============================================================
 * 18. Timetable generation lock
 * ============================================================
 */

async function generateTimetable(timetableId) {
  return withLock(
    `timetable:${timetableId}`,

    async () => {
      console.log(`Generating timetable ${timetableId}`);

      /*
       * Expensive generation.
       *
       * LangGraph / AI workflow could run here.
       */

      await new Promise((resolve) => setTimeout(resolve, 3_000));

      console.log(`Timetable ${timetableId} generated`);

      return {
        timetableId,

        status: "completed",
      };
    },

    {
      ttl: 30_000,

      retries: 20,

      retryDelay: 500,
    },
  );
}

/*
 * ============================================================
 * 19. Prevent duplicate timetable generation
 * ============================================================
 */

async function timetableExample() {
  const timetableId = "123";

  const results = await Promise.allSettled([
    generateTimetable(timetableId),

    generateTimetable(timetableId),

    generateTimetable(timetableId),
  ]);

  console.log("\nTimetable results:", results);
}

/*
 * ============================================================
 * 20. User-specific lock
 * ============================================================
 */

async function userLock(userId) {
  return withLock(
    `user:${userId}`,

    async () => {
      console.log(`Updating user ${userId}`);

      await new Promise((resolve) => setTimeout(resolve, 1_000));

      console.log(`User ${userId} updated`);
    },
  );
}

/*
 * ============================================================
 * 21. Resource-specific lock
 * ============================================================
 */

async function resourceLock(resourceType, resourceId) {
  return withLock(
    `${resourceType}:${resourceId}`,

    async () => {
      console.log(`Locked ${resourceType}:${resourceId}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  );
}

/*
 * ============================================================
 * 22. Lock status
 * ============================================================
 */

async function lockStatus(resource) {
  const key = getLockKey(resource);

  const [owner, ttl] = await Promise.all([redis.get(key), redis.pttl(key)]);

  return {
    locked: owner !== null,

    owner,

    ttl,
  };
}

/*
 * ============================================================
 * 23. Safe force cleanup
 * ============================================================
 *
 * Normally don't force-delete locks.
 *
 * Only use controlled administrative cleanup.
 * ============================================================
 */

async function forceDeleteLock(resource) {
  const key = getLockKey(resource);

  const result = await redis.del(key);

  console.log("Force deleted:", {
    key,
    result,
  });

  return result;
}

/*
 * ============================================================
 * 24. Lock namespace cleanup
 * ============================================================
 */

async function cleanupLocks() {
  const keys = await redis.keys(`${LOCK_PREFIX}*`);

  if (keys.length === 0) {
    return;
  }

  await redis.del(...keys);

  console.log("Cleaned locks:", keys);
}

/*
 * ============================================================
 * 25. Production lock abstraction
 * ============================================================
 */

const distributedLock = {
  acquire: acquireLock,

  release: releaseLock,

  renew: renewLock,

  tryAcquire: tryLock,

  acquireWithRetry: acquireLockWithRetry,

  withLock,

  isLocked,

  getOwner: getLockOwner,

  getTTL: getLockTTL,
};

/*
 * ============================================================
 * 26. Show API
 * ============================================================
 */

function showLockAPI() {
  console.log(
    `
============================================================
DISTRIBUTED LOCK API
============================================================

distributedLock.acquire(
  resource,
  ttl
)

distributedLock.release(
  lock
)

distributedLock.renew(
  lock,
  ttl
)

distributedLock.tryAcquire(
  resource,
  ttl
)

distributedLock.acquireWithRetry({
  resource,
  ttl,
  retries,
  retryDelay
})

distributedLock.withLock(
  resource,
  fn,
  options
)

distributedLock.isLocked(
  resource
)

distributedLock.getOwner(
  resource
)

distributedLock.getTTL(
  resource
)

============================================================
`,
  );
}

/*
 * ============================================================
 * 27. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    await redis.quit();

    console.log("Redis connection closed");
  } catch (error) {
    console.error("Shutdown error:", error);

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

    console.log("\nRedis Distributed Lock examples");

    showLockAPI();

    /*
     * Basic lock.
     */

    console.log("\n--- BASIC LOCK ---");

    await basicLockExample();

    /*
     * withLock.
     */

    console.log("\n--- WITH LOCK ---");

    await withLockExample();

    /*
     * Expiration.
     */

    console.log("\n--- EXPIRATION ---");

    await expirationExample();

    /*
     * Contention.
     */

    console.log("\n--- CONTENTION ---");

    await contentionExample();

    /*
     * Timetable.
     */

    console.log("\n--- TIMETABLE LOCK ---");

    await timetableExample();

    /*
     * User lock.
     */

    console.log("\n--- USER LOCK ---");

    await userLock("user:100");

    /*
     * Resource lock.
     */

    console.log("\n--- RESOURCE LOCK ---");

    await resourceLock("room", "room:101");

    /*
     * Status.
     */

    console.log("\n--- LOCK STATUS ---");

    console.log(await lockStatus("timetable:123"));

    /*
     * Heartbeat example is intentionally
     * not run because it takes 15 seconds.
     */

    console.log("\nDistributed lock examples completed");
  } catch (error) {
    console.error("\nDistributed lock error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
