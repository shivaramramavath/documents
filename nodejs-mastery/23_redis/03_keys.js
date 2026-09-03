import Redis from "ioredis";

/*
 * ============================================================
 * Redis connection
 * ============================================================
 */

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * 01. SETUP / CLEANUP
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "user:100",
    "user:101",
    "user:102",

    "cache:user:100",

    "session:100",

    "temporary:key",

    "persistent:key",

    "old:key",

    "new:key",
  );
}

/*
 * ============================================================
 * 02. KEY NAMING
 * ============================================================
 *
 * Redis doesn't enforce a naming convention.
 *
 * We create our own.
 * ============================================================
 */

async function keyNaming() {
  /*
   * Entity based.
   */

  await redis.set("user:100", "Shiva Ram");

  /*
   * More specific namespace.
   */

  await redis.set("user:100:name", "Shiva Ram");

  await redis.set("user:100:email", "shiva@example.com");

  /*
   * Cache namespace.
   */

  await redis.set("cache:user:100", "some cached data");

  /*
   * Session namespace.
   */

  await redis.set("session:100", "session-data");

  console.log("Keys created");
}

/*
 * ============================================================
 * 03. EXISTS
 * ============================================================
 */

async function existsExample() {
  const exists = await redis.exists("user:100");

  console.log("user:100 exists:", exists);

  /*
   * EXISTS returns:
   *
   * 1 → exists
   * 0 → doesn't exist
   */
}

/*
 * ============================================================
 * 04. TYPE
 * ============================================================
 */

async function typeExample() {
  const type = await redis.type("user:100");

  console.log("Type:", type);
}

/*
 * ============================================================
 * 05. TTL
 * ============================================================
 */

async function ttlExample() {
  await redis.set("temporary:key", "hello", "EX", 60);

  const ttl = await redis.ttl("temporary:key");

  console.log("TTL:", ttl);

  /*
   * TTL values:
   *
   * positive → seconds remaining
   *
   * -1 → key exists but has no expiration
   *
   * -2 → key doesn't exist
   */
}

/*
 * ============================================================
 * 06. PTTL
 * ============================================================
 *
 * TTL in milliseconds.
 * ============================================================
 */

async function pttlExample() {
  await redis.set("temporary:key", "hello", "PX", 10000);

  const pttl = await redis.pttl("temporary:key");

  console.log("PTTL:", pttl, "milliseconds");
}

/*
 * ============================================================
 * 07. EXPIRE
 * ============================================================
 *
 * Add expiration to an existing key.
 * ============================================================
 */

async function expireExample() {
  await redis.set("session:100", "active");

  /*
   * Expire after 5 minutes.
   */

  await redis.expire("session:100", 300);

  console.log("Session TTL:", await redis.ttl("session:100"));
}

/*
 * ============================================================
 * 08. EXPIREAT
 * ============================================================
 *
 * Expire at a specific Unix timestamp.
 * ============================================================
 */

async function expireAtExample() {
  await redis.set("temporary:key", "hello");

  /*
   * Current Unix timestamp.
   */

  const now = Math.floor(Date.now() / 1000);

  /*
   * Expire 60 seconds from now.
   */

  await redis.expireat("temporary:key", now + 60);

  console.log("TTL:", await redis.ttl("temporary:key"));
}

/*
 * ============================================================
 * 09. PEXPIRE
 * ============================================================
 *
 * Expiration in milliseconds.
 * ============================================================
 */

async function pexpireExample() {
  await redis.set("temporary:key", "hello");

  await redis.pexpire("temporary:key", 5000);

  console.log("PTTL:", await redis.pttl("temporary:key"));
}

/*
 * ============================================================
 * 10. PERSIST
 * ============================================================
 *
 * Remove expiration.
 * ============================================================
 */

async function persistExample() {
  await redis.set("persistent:key", "important", "EX", 60);

  console.log("Before PERSIST:", await redis.ttl("persistent:key"));

  await redis.persist("persistent:key");

  console.log("After PERSIST:", await redis.ttl("persistent:key"));
}

/*
 * ============================================================
 * 11. DELETE
 * ============================================================
 */

async function deleteExample() {
  await redis.set("user:101", "Test user");

  const deleted = await redis.del("user:101");

  console.log("Deleted:", deleted);

  console.log("Exists:", await redis.exists("user:101"));
}

/*
 * ============================================================
 * 12. UNLINK
 * ============================================================
 *
 * Similar to DEL, but Redis can perform
 * the memory reclamation asynchronously.
 *
 * Useful when deleting large values.
 * ============================================================
 */

async function unlinkExample() {
  await redis.set("user:102", "Large value");

  const result = await redis.unlink("user:102");

  console.log("UNLINK:", result);
}

/*
 * ============================================================
 * 13. RENAME
 * ============================================================
 */

async function renameExample() {
  await redis.set("old:key", "hello");

  await redis.rename("old:key", "new:key");

  console.log("New value:", await redis.get("new:key"));
}

/*
 * ============================================================
 * 14. RENAMENX
 * ============================================================
 *
 * Rename only if destination doesn't exist.
 * ============================================================
 */

async function renameNxExample() {
  await redis.set("old:key", "hello");

  const result = await redis.renamenx("old:key", "new:key");

  console.log("RENAMENX result:", result);
}

/*
 * ============================================================
 * 15. RANDOMKEY
 * ============================================================
 */

async function randomKeyExample() {
  const key = await redis.randomkey();

  console.log("Random key:", key);
}

/*
 * ============================================================
 * 16. DBSIZE
 * ============================================================
 *
 * Number of keys in the current Redis DB.
 * ============================================================
 */

async function dbSizeExample() {
  const size = await redis.dbsize();

  console.log("Database size:", size);
}

/*
 * ============================================================
 * 17. KEYS
 * ============================================================
 *
 * IMPORTANT:
 *
 * Don't use KEYS in production on
 * a large Redis database.
 * ============================================================
 */

async function keysExample() {
  const keys = await redis.keys("user:*");

  console.log("User keys:", keys);
}

/*
 * ============================================================
 * 18. SCAN
 * ============================================================
 *
 * Production-safe alternative to KEYS.
 * ============================================================
 */

async function scanExample() {
  /*
   * Create some keys.
   */

  await redis.set("cache:user:1", "one");

  await redis.set("cache:user:2", "two");

  await redis.set("cache:user:3", "three");

  /*
   * scanStream() allows us to iterate
   * without blocking Redis with one
   * massive KEYS operation.
   */

  const stream = redis.scanStream({
    match: "cache:user:*",

    count: 100,
  });

  const keys = [];

  for await (const batch of stream) {
    keys.push(...batch);
  }

  console.log("SCAN results:", keys);
}

/*
 * ============================================================
 * 19. MEMORY USAGE
 * ============================================================
 */

async function memoryUsageExample() {
  await redis.set("memory:test", "Hello Redis");

  const bytes = await redis.memory("USAGE", "memory:test");

  console.log("Memory usage:", bytes, "bytes");

  await redis.del("memory:test");
}

/*
 * ============================================================
 * 20. OBJECT ENCODING
 * ============================================================
 *
 * Mainly useful for Redis internals
 * and performance investigation.
 * ============================================================
 */

async function objectExample() {
  await redis.set("object:test", "hello");

  const encoding = await redis.object("ENCODING", "object:test");

  console.log("Encoding:", encoding);

  await redis.del("object:test");
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- KEY NAMING ---");

    await keyNaming();

    console.log("\n--- EXISTS ---");

    await existsExample();

    console.log("\n--- TYPE ---");

    await typeExample();

    console.log("\n--- TTL ---");

    await ttlExample();

    console.log("\n--- PTTL ---");

    await pttlExample();

    console.log("\n--- EXPIRE ---");

    await expireExample();

    console.log("\n--- EXPIREAT ---");

    await expireAtExample();

    console.log("\n--- PEXPIRE ---");

    await pexpireExample();

    console.log("\n--- PERSIST ---");

    await persistExample();

    console.log("\n--- DELETE ---");

    await deleteExample();

    console.log("\n--- UNLINK ---");

    await unlinkExample();

    console.log("\n--- RENAME ---");

    await renameExample();

    console.log("\n--- RENAMENX ---");

    await renameNxExample();

    console.log("\n--- RANDOMKEY ---");

    await randomKeyExample();

    console.log("\n--- DBSIZE ---");

    await dbSizeExample();

    console.log("\n--- KEYS ---");

    await keysExample();

    console.log("\n--- SCAN ---");

    await scanExample();

    console.log("\n--- MEMORY ---");

    await memoryUsageExample();

    console.log("\n--- OBJECT ---");

    await objectExample();
  } catch (error) {
    console.error("Redis error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
