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

const TAG_PREFIX = "cache-tag:";

const VERSION_PREFIX = "cache-version:";

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
 * Key helpers
 * ============================================================
 */

function cacheKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

function tagKey(tag) {
  return `${TAG_PREFIX}${tag}`;
}

function versionKey(resource) {
  return `${VERSION_PREFIX}${resource}`;
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
 * Basic SET
 * ============================================================
 */

async function set(key, value, ttlSeconds = 300) {
  await redis.set(cacheKey(key), serialize(value), "EX", ttlSeconds);
}

/*
 * ============================================================
 * Basic GET
 * ============================================================
 */

async function get(key) {
  const value = await redis.get(cacheKey(key));

  return deserialize(value);
}

/*
 * ============================================================
 * 01. EXPLICIT KEY INVALIDATION
 * ============================================================
 *
 * Remove exactly one cache entry.
 *
 * Example:
 *
 * cache:user:100
 *
 * DELETE
 * ============================================================
 */

async function invalidateKey(key) {
  const deleted = await redis.del(cacheKey(key));

  console.log("[invalidate:key]", {
    key,
    deleted: deleted === 1,
  });

  return deleted === 1;
}

/*
 * ============================================================
 * 02. DELETE-ON-WRITE
 * ============================================================
 *
 * Database changes
 *       ↓
 * Delete cache
 *
 *
 * Example:
 *
 * UPDATE user
 *       ↓
 * DEL cache:user:100
 *
 *
 * Next GET:
 *
 * Redis MISS
 *       ↓
 * MongoDB
 *       ↓
 * Redis SET
 * ============================================================
 */

async function deleteOnWrite({ key, updateDatabase }) {
  /*
   * 1. Update database.
   */

  const result = await updateDatabase();

  /*
   * 2. Invalidate cache.
   */

  await invalidateKey(key);

  return result;
}

/*
 * ============================================================
 * 03. DELETE-ON-WRITE EXAMPLE
 * ============================================================
 */

async function deleteOnWriteExample() {
  const userId = "100";

  const result = await deleteOnWrite({
    key: `user:${userId}`,

    updateDatabase: async () => {
      console.log("Updating MongoDB...");

      return {
        id: userId,

        name: "Updated Shiva",
      };
    },
  });

  console.log("Database result:", result);
}

/*
 * ============================================================
 * 04. UPDATE-ON-WRITE
 * ============================================================
 *
 * Instead of deleting cache:
 *
 * Database
 *    ↓
 * Update cache
 *
 *
 * Advantages:
 *
 * Next read is still a cache HIT.
 * ============================================================
 */

async function updateOnWrite({ key, updateDatabase, ttlSeconds = 300 }) {
  /*
   * 1. Update database.
   */

  const result = await updateDatabase();

  /*
   * 2. Update cache with the
   *    database result.
   */

  await set(key, result, ttlSeconds);

  return result;
}

/*
 * ============================================================
 * 05. UPDATE-ON-WRITE EXAMPLE
 * ============================================================
 */

async function updateOnWriteExample() {
  const userId = "100";

  const result = await updateOnWrite({
    key: `user:${userId}`,

    ttlSeconds: 300,

    updateDatabase: async () => {
      console.log("Updating MongoDB...");

      return {
        id: userId,

        name: "Shiva Ram",

        updatedAt: Date.now(),
      };
    },
  });

  console.log("Updated:", result);
}

/*
 * ============================================================
 * 06. PATTERN INVALIDATION
 * ============================================================
 *
 * Example:
 *
 * cache:user:100
 * cache:user:100:timetable
 * cache:user:100:subjects
 * cache:user:100:rooms
 *
 *
 * We want to delete all:
 *
 * cache:user:100*
 *
 * DON'T use:
 *
 * KEYS cache:user:100*
 *
 * on a large production Redis.
 *
 * Use SCAN.
 * ============================================================
 */

async function invalidatePattern(pattern) {
  let cursor = "0";

  const keys = [];

  do {
    const [nextCursor, matchedKeys] = await redis.scan(
      cursor,

      "MATCH",

      `${CACHE_PREFIX}${pattern}`,

      "COUNT",

      100,
    );

    cursor = nextCursor;

    keys.push(...matchedKeys);
  } while (cursor !== "0");

  if (keys.length === 0) {
    return 0;
  }

  /*
   * Delete in chunks.
   *
   * Avoid huge DEL command.
   */

  const CHUNK_SIZE = 500;

  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunk = keys.slice(i, i + CHUNK_SIZE);

    await redis.del(...chunk);
  }

  console.log("[invalidate:pattern]", {
    pattern,
    deleted: keys.length,
  });

  return keys.length;
}

/*
 * ============================================================
 * 07. PATTERN EXAMPLE
 * ============================================================
 */

async function patternExample() {
  await set("user:100", {
    id: "100",
  });

  await set("user:100:timetable", {
    id: "timetable:1",
  });

  await set("user:100:subjects", ["Math", "Python"]);

  await set("user:200", {
    id: "200",
  });

  const deleted = await invalidatePattern("user:100*");

  console.log("Deleted:", deleted);
}

/*
 * ============================================================
 * 08. TAG-BASED INVALIDATION
 * ============================================================
 *
 * Sometimes you don't know all keys that belong to
 * one resource.
 *
 * Example:
 *
 * User 100:
 *
 * cache:user:100
 * cache:timetable:1
 * cache:subjects:cse
 * cache:dashboard:100
 *
 *
 * We can create a tag:
 *
 * cache-tag:user:100
 *
 * containing all related keys.
 *
 * ============================================================
 */

async function addTagToKey({ tag, key }) {
  await redis.sadd(tagKey(tag), cacheKey(key));
}

/*
 * ============================================================
 * 09. Set cache with tags
 * ============================================================
 */

async function setWithTags({ key, value, tags = [], ttlSeconds = 300 }) {
  const pipeline = redis.pipeline();

  pipeline.set(cacheKey(key), serialize(value), "EX", ttlSeconds);

  for (const tag of tags) {
    pipeline.sadd(tagKey(tag), cacheKey(key));
  }

  await pipeline.exec();
}

/*
 * ============================================================
 * 10. Invalidate tag
 * ============================================================
 */

async function invalidateTag(tag) {
  const key = tagKey(tag);

  const cacheKeys = await redis.smembers(key);

  if (cacheKeys.length === 0) {
    return 0;
  }

  /*
   * Delete cache entries.
   */

  const pipeline = redis.pipeline();

  for (const cacheKeyValue of cacheKeys) {
    pipeline.del(cacheKeyValue);
  }

  /*
   * Delete tag itself.
   */

  pipeline.del(key);

  await pipeline.exec();

  console.log("[invalidate:tag]", {
    tag,
    deleted: cacheKeys.length,
  });

  return cacheKeys.length;
}

/*
 * ============================================================
 * 11. Tag example
 * ============================================================
 */

async function tagExample() {
  await setWithTags({
    key: "user:100",

    value: {
      id: "100",

      name: "Shiva",
    },

    tags: ["user:100"],
  });

  await setWithTags({
    key: "dashboard:100",

    value: {
      userId: "100",

      widgets: [],
    },

    tags: ["user:100"],
  });

  await setWithTags({
    key: "timetable:123",

    value: {
      id: "123",

      userId: "100",
    },

    tags: ["user:100", "timetable:123"],
  });

  /*
   * Invalidate everything
   * related to user 100.
   */

  await invalidateTag("user:100");
}

/*
 * ============================================================
 * 12. VERSIONED CACHE KEYS
 * ============================================================
 *
 * Instead of deleting:
 *
 * cache:user:100
 *
 * use:
 *
 * cache:user:100:v1
 *
 * After invalidation:
 *
 * cache:user:100:v2
 *
 *
 * Old key naturally expires.
 * ============================================================
 */

async function getVersion(resource) {
  const value = await redis.get(versionKey(resource));

  if (value === null) {
    await redis.set(versionKey(resource), "1");

    return 1;
  }

  return Number(value);
}

/*
 * ============================================================
 * 13. Versioned key builder
 * ============================================================
 */

async function versionedKey(resource) {
  const version = await getVersion(resource);

  return `${resource}:v${version}`;
}

/*
 * ============================================================
 * 14. Versioned cache SET
 * ============================================================
 */

async function setVersioned({ resource, value, ttlSeconds = 300 }) {
  const key = await versionedKey(resource);

  await set(key, value, ttlSeconds);

  return key;
}

/*
 * ============================================================
 * 15. Version invalidation
 * ============================================================
 *
 * INCR version.
 *
 * Old cache:
 *
 * user:100:v1
 *
 * New version:
 *
 * user:100:v2
 *
 * Application stops reading v1.
 * ============================================================
 */

async function invalidateVersion(resource) {
  const version = await redis.incr(versionKey(resource));

  console.log("[invalidate:version]", {
    resource,
    version,
  });

  return version;
}

/*
 * ============================================================
 * 16. VERSION EXAMPLE
 * ============================================================
 */

async function versionExample() {
  const resource = "user:100";

  const key1 = await setVersioned({
    resource,

    value: {
      name: "Shiva",
    },
  });

  console.log("Old key:", key1);

  await invalidateVersion(resource);

  const key2 = await setVersioned({
    resource,

    value: {
      name: "Updated Shiva",
    },
  });

  console.log("New key:", key2);
}

/*
 * ============================================================
 * 17. TTL-BASED INVALIDATION
 * ============================================================
 *
 * Simplest strategy:
 *
 * Redis automatically deletes the cache.
 *
 * Example:
 *
 * SET cache:user:100
 * EX 300
 *
 * After 300 seconds:
 *
 * Redis → key disappears.
 * ============================================================
 */

async function ttlInvalidationExample() {
  await set(
    "temporary:user",

    {
      value: "temporary",
    },

    10,
  );

  console.log("Temporary cache created");

  const ttl = await redis.ttl(cacheKey("temporary:user"));

  console.log("TTL:", ttl);
}

/*
 * ============================================================
 * 18. EVENT-DRIVEN INVALIDATION
 * ============================================================
 *
 * Database mutation
 *       ↓
 * Application
 *       ↓
 * Event
 *       ↓
 * Redis invalidation
 *
 *
 * Example:
 *
 * USER_UPDATED
 *
 * {
 *   userId: "100"
 * }
 *
 * Consumer:
 *
 * invalidate user:100
 * ============================================================
 */

async function handleUserUpdatedEvent(event) {
  const userId = event.userId;

  await invalidateTag(`user:${userId}`);

  console.log("User cache invalidated from event:", userId);
}

/*
 * ============================================================
 * 19. TIMETABLE UPDATED EVENT
 * ============================================================
 */

async function handleTimetableUpdatedEvent(event) {
  const timetableId = event.timetableId;

  await invalidateTag(`timetable:${timetableId}`);

  console.log("Timetable cache invalidated:", timetableId);
}

/*
 * ============================================================
 * 20. PUB/SUB INVALIDATION
 * ============================================================
 *
 * IMPORTANT:
 *
 * Redis Pub/Sub messages are not persisted.
 *
 * Subscriber must be online to receive the event.
 *
 * We use a separate Redis connection
 * for subscriber mode.
 * ============================================================
 */

const subscriber = new Redis(REDIS_URL);

/*
 * ============================================================
 * 21. Subscribe to invalidation events
 * ============================================================
 */

async function subscribeToInvalidation() {
  await subscriber.subscribe("cache:invalidation");

  subscriber.on("message", async (channel, message) => {
    if (channel !== "cache:invalidation") {
      return;
    }

    try {
      const event = JSON.parse(message);

      await processInvalidationEvent(event);
    } catch (error) {
      console.error("Invalidation event error:", error);
    }
  });

  console.log("Subscribed to cache invalidation");
}

/*
 * ============================================================
 * 22. Process invalidation event
 * ============================================================
 */

async function processInvalidationEvent(event) {
  switch (event.type) {
    case "USER_UPDATED":
      await handleUserUpdatedEvent(event);

      break;

    case "USER_DELETED":
      await invalidateTag(`user:${event.userId}`);

      break;

    case "TIMETABLE_UPDATED":
      await handleTimetableUpdatedEvent(event);

      break;

    case "TIMETABLE_DELETED":
      await invalidateTag(`timetable:${event.timetableId}`);

      break;

    default:
      console.warn("Unknown invalidation event:", event.type);
  }
}

/*
 * ============================================================
 * 23. Publish invalidation event
 * ============================================================
 */

async function publishInvalidation(event) {
  await redis.publish("cache:invalidation", JSON.stringify(event));
}

/*
 * ============================================================
 * 24. Multi-instance invalidation example
 * ============================================================
 */

async function multiInstanceExample() {
  await publishInvalidation({
    type: "USER_UPDATED",

    userId: "100",
  });

  console.log("Published invalidation event");
}

/*
 * ============================================================
 * 25. Batch invalidation
 * ============================================================
 */

async function invalidateKeys(keys) {
  if (keys.length === 0) {
    return 0;
  }

  const redisKeys = keys.map(cacheKey);

  const CHUNK_SIZE = 500;

  let deleted = 0;

  for (let i = 0; i < redisKeys.length; i += CHUNK_SIZE) {
    const chunk = redisKeys.slice(i, i + CHUNK_SIZE);

    deleted += await redis.del(...chunk);
  }

  return deleted;
}

/*
 * ============================================================
 * 26. MongoDB write + cache invalidation
 * ============================================================
 */

async function updateUser({ userId, updateDatabase }) {
  /*
   * Database is the source of truth.
   */

  const user = await updateDatabase();

  /*
   * Invalidate after successful DB update.
   */

  await invalidateTag(`user:${userId}`);

  /*
   * Publish to other Node.js instances.
   */

  await publishInvalidation({
    type: "USER_UPDATED",

    userId,
  });

  return user;
}

/*
 * ============================================================
 * 27. Write + invalidate example
 * ============================================================
 */

async function updateUserExample() {
  const user = await updateUser({
    userId: "100",

    updateDatabase: async () => {
      console.log("MongoDB update...");

      return {
        id: "100",

        name: "Shiva Ram",

        updatedAt: Date.now(),
      };
    },
  });

  console.log("Updated user:", user);
}

/*
 * ============================================================
 * 28. Cache-aside + invalidation
 * ============================================================
 */

async function getUser(userId) {
  const key = `user:${userId}`;

  /*
   * Cache HIT.
   */

  const cached = await get(key);

  if (cached !== null) {
    return cached;
  }

  /*
   * Cache MISS.
   */

  console.log("User cache miss");

  /*
   * Database.
   */

  const user = {
    id: userId,

    name: "Shiva",
  };

  /*
   * Populate cache.
   */

  await set(key, user, 300);

  return user;
}

/*
 * ============================================================
 * 29. Invalidate then next request
 * ============================================================
 */

async function cacheAsideInvalidationExample() {
  const userId = "100";

  /*
   * First request:
   *
   * MongoDB → Redis
   */

  const first = await getUser(userId);

  console.log("First:", first);

  /*
   * Second request:
   *
   * Redis HIT
   */

  const second = await getUser(userId);

  console.log("Second:", second);

  /*
   * User changes.
   */

  await invalidateTag(`user:${userId}`);

  /*
   * Third request:
   *
   * Redis MISS
   *       ↓
   * MongoDB
   *       ↓
   * Redis
   */

  const third = await getUser(userId);

  console.log("Third:", third);
}

/*
 * ============================================================
 * 30. Cache invalidation service
 * ============================================================
 */

const cacheInvalidation = {
  key: invalidateKey,

  keys: invalidateKeys,

  pattern: invalidatePattern,

  tag: invalidateTag,

  version: invalidateVersion,

  user: async (userId) => invalidateTag(`user:${userId}`),

  timetable: async (timetableId) => invalidateTag(`timetable:${timetableId}`),
};

/*
 * ============================================================
 * 31. Show strategies
 * ============================================================
 */

function showStrategies() {
  console.log(
    `
============================================================
CACHE INVALIDATION STRATEGIES
============================================================

1. EXPLICIT KEY
---------------

DEL cache:user:100


2. DELETE-ON-WRITE
------------------

DB UPDATE
   ↓
DEL CACHE


3. UPDATE-ON-WRITE
------------------

DB UPDATE
   ↓
SET CACHE


4. PATTERN INVALIDATION
-----------------------

SCAN
  ↓
MATCH cache:user:100*
  ↓
DEL


5. TAG INVALIDATION
-------------------

user:100
   │
   ├── user:100
   ├── dashboard:100
   └── timetable:123

Invalidate tag
      ↓
Delete all


6. VERSIONED KEYS
-----------------

v1 → v2

Old cache becomes unused.


7. TTL
-------

SET EX 300

Redis automatically expires.


8. EVENT-DRIVEN
---------------

DB
 ↓
EVENT
 ↓
INVALIDATION


9. PUB/SUB
----------

Instance A
    │
    ▼
 Redis Pub/Sub
    │
 ┌──┴───┐
 ▼      ▼
A      B
invalidate


============================================================
`,
  );
}

/*
 * ============================================================
 * 32. Production recommendations
 * ============================================================
 */

function productionRecommendations() {
  console.log(
    `
============================================================
PRODUCTION RECOMMENDATIONS
============================================================

NORMAL CRUD
    ↓
Delete-on-write

HOT DATA
    ↓
Update-on-write / Refresh-ahead

RELATED DATA
    ↓
Tag invalidation

LARGE KEYSPACE
    ↓
SCAN
NOT KEYS

MULTIPLE NODE.JS INSTANCES
    ↓
Pub/Sub or Redis Streams

CRITICAL EVENTS
    ↓
Redis Streams / Kafka
NOT plain Pub/Sub

SHORT-LIVED DATA
    ↓
TTL

HIGHLY DYNAMIC DATA
    ↓
Explicit invalidation

============================================================
`,
  );
}

/*
 * ============================================================
 * 33. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    await subscriber.quit();

    await redis.quit();

    console.log("Redis connections closed");
  } catch (error) {
    console.error("Shutdown error:", error);

    subscriber.disconnect();

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

    console.log("\nRedis Cache Invalidation");

    /*
     * Explicit invalidation.
     */

    console.log("\n--- EXPLICIT KEY ---");

    await invalidateKey("user:100");

    /*
     * Delete-on-write.
     */

    console.log("\n--- DELETE ON WRITE ---");

    await deleteOnWriteExample();

    /*
     * Update-on-write.
     */

    console.log("\n--- UPDATE ON WRITE ---");

    await updateOnWriteExample();

    /*
     * Pattern invalidation.
     */

    console.log("\n--- PATTERN ---");

    await patternExample();

    /*
     * Tag invalidation.
     */

    console.log("\n--- TAG ---");

    await tagExample();

    /*
     * Version invalidation.
     */

    console.log("\n--- VERSION ---");

    await versionExample();

    /*
     * TTL.
     */

    console.log("\n--- TTL ---");

    await ttlInvalidationExample();

    /*
     * Cache-aside.
     */

    console.log("\n--- CACHE ASIDE ---");

    await cacheAsideInvalidationExample();

    /*
     * Event.
     */

    console.log("\n--- EVENT ---");

    await updateUserExample();

    /*
     * Start subscriber.
     *
     * Uncomment in a real worker/process.
     */

    // await subscribeToInvalidation();

    showStrategies();

    productionRecommendations();

    console.log("\nCache invalidation examples completed");
  } catch (error) {
    console.error("\nCache invalidation error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
