import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Basic TTL
 * ============================================================
 */

async function basicTTL() {
  await redis.set("ttl:test", "hello", "EX", 60);

  console.log("TTL:", await redis.ttl("ttl:test"));

  console.log("PTTL:", await redis.pttl("ttl:test"));
}

/*
 * ============================================================
 * EXPIRE
 * ============================================================
 */

async function expire() {
  await redis.set("expire:test", "hello");

  await redis.expire("expire:test", 120);

  console.log("TTL:", await redis.ttl("expire:test"));
}

/*
 * ============================================================
 * PERSIST
 * ============================================================
 */

async function persist() {
  await redis.set("persist:test", "hello", "EX", 60);

  console.log("Before:", await redis.ttl("persist:test"));

  await redis.persist("persist:test");

  console.log("After:", await redis.ttl("persist:test"));
}

/*
 * ============================================================
 * EXPIREAT
 * ============================================================
 */

async function expireAt() {
  await redis.set("expireat:test", "hello");

  const timestamp = Math.floor(Date.now() / 1000) + 60;

  await redis.expireat("expireat:test", timestamp);

  console.log("TTL:", await redis.ttl("expireat:test"));
}

/*
 * ============================================================
 * PX
 * ============================================================
 */

async function milliseconds() {
  await redis.set("px:test", "hello", "PX", 5000);

  console.log("PTTL:", await redis.pttl("px:test"));
}

/*
 * ============================================================
 * Sliding expiration
 * ============================================================
 */

async function slidingExpiration() {
  await redis.set("session:100", "active", "EX", 300);

  /*
   * User activity.
   *
   * Refresh session for another
   * 300 seconds.
   */

  await redis.expire("session:100", 300);

  console.log("Session TTL:", await redis.ttl("session:100"));
}

/*
 * ============================================================
 * NX + EX
 * ============================================================
 */

async function conditionalSet() {
  const result = await redis.set("lock:test", "worker-1", "NX", "EX", 30);

  console.log("Lock result:", result);
}

/*
 * ============================================================
 * TTL Jitter
 * ============================================================
 */

async function ttlJitter() {
  const baseTTL = 300;

  const jitter = Math.floor(Math.random() * 60);

  const ttl = baseTTL + jitter;

  console.log("Calculated TTL:", ttl);

  await redis.set("jitter:test", "hello", "EX", ttl);

  console.log("Redis TTL:", await redis.ttl("jitter:test"));
}

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "ttl:test",
    "expire:test",
    "persist:test",
    "expireat:test",
    "px:test",
    "session:100",
    "lock:test",
    "jitter:test",
  );
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- BASIC TTL ---");

    await basicTTL();

    console.log("\n--- EXPIRE ---");

    await expire();

    console.log("\n--- PERSIST ---");

    await persist();

    console.log("\n--- EXPIREAT ---");

    await expireAt();

    console.log("\n--- MILLISECONDS ---");

    await milliseconds();

    console.log("\n--- SLIDING EXPIRATION ---");

    await slidingExpiration();

    console.log("\n--- NX + EX ---");

    await conditionalSet();

    console.log("\n--- TTL JITTER ---");

    await ttlJitter();
  } catch (error) {
    console.error("Redis TTL error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
