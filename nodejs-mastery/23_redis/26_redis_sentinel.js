/*
 * ============================================================
 * 26_redis_sentinel.js
 * ============================================================
 *
 * Redis Sentinel + ioredis
 *
 * Topics:
 *
 * 1. Sentinel architecture
 * 2. Connecting with ioredis
 * 3. Master discovery
 * 4. Automatic failover
 * 5. Sentinel authentication
 * 6. Redis authentication
 * 7. Read replicas
 * 8. Retry strategy
 * 9. Error handling
 * 10. Health check
 * 11. Failover behavior
 * 12. Graceful shutdown
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const SENTINEL_NAME = process.env.REDIS_SENTINEL_NAME ?? "mymaster";

const SENTINEL_PASSWORD = process.env.REDIS_SENTINEL_PASSWORD;

const REDIS_USERNAME = process.env.REDIS_USERNAME;

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

/*
 * ============================================================
 * Sentinel nodes
 * ============================================================
 *
 * Normally use 3 Sentinel instances
 * in production.
 *
 * ============================================================
 */

const sentinels = [
  {
    host: process.env.REDIS_SENTINEL_HOST_1 ?? "127.0.0.1",

    port: Number(process.env.REDIS_SENTINEL_PORT_1 ?? 26379),
  },

  {
    host: process.env.REDIS_SENTINEL_HOST_2 ?? "127.0.0.1",

    port: Number(process.env.REDIS_SENTINEL_PORT_2 ?? 26380),
  },

  {
    host: process.env.REDIS_SENTINEL_HOST_3 ?? "127.0.0.1",

    port: Number(process.env.REDIS_SENTINEL_PORT_3 ?? 26381),
  },
];

/*
 * ============================================================
 * Redis connection through Sentinel
 * ============================================================
 */

const redis = new Redis({
  /*
   * Sentinel master name.
   */

  name: SENTINEL_NAME,

  /*
   * Sentinel instances.
   */

  sentinels,

  /*
   * Authentication for Redis itself.
   */

  username: REDIS_USERNAME,

  password: REDIS_PASSWORD,

  /*
   * Authentication for Sentinel.
   *
   * Depending on Redis/Sentinel configuration,
   * this may be required separately.
   */

  sentinelPassword: SENTINEL_PASSWORD,

  /*
   * Connection timeout.
   */

  connectTimeout: 10000,

  /*
   * Command timeout.
   */

  commandTimeout: 5000,

  /*
   * Retry commands.
   */

  maxRetriesPerRequest: 3,

  /*
   * Retry Sentinel connections.
   */

  sentinelRetryStrategy(times) {
    const delay = Math.min(times * 200, 5000);

    console.warn(`[sentinel] retrying in ${delay}ms`);

    return delay;
  },

  /*
   * When master changes,
   * ioredis discovers the new master.
   */

  enableReadyCheck: true,
});

/*
 * ============================================================
 * Connection events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connecting");
});

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("reconnecting", (delay) => {
  console.warn(`[redis] reconnecting in ${delay}ms`);
});

redis.on("close", () => {
  console.warn("[redis] connection closed");
});

redis.on("error", (error) => {
  console.error("[redis] error", {
    message: error.message,

    code: error.code,
  });
});

/*
 * ============================================================
 * SET
 * ============================================================
 */

async function set(key, value) {
  return redis.set(key, value);
}

/*
 * ============================================================
 * GET
 * ============================================================
 */

async function get(key) {
  return redis.get(key);
}

/*
 * ============================================================
 * SET cache
 * ============================================================
 */

async function setCache(key, value, ttl = 300) {
  return redis.set(key, value, "EX", ttl);
}

/*
 * ============================================================
 * DELETE
 * ============================================================
 */

async function remove(key) {
  return redis.del(key);
}

/*
 * ============================================================
 * INCREMENT
 * ============================================================
 */

async function increment(key) {
  return redis.incr(key);
}

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

async function healthCheck() {
  try {
    const result = await redis.ping();

    return {
      healthy: result === "PONG",

      status: redis.status,
    };
  } catch (error) {
    console.error("[redis] health check failed", error.message);

    return {
      healthy: false,

      status: redis.status,
    };
  }
}

/*
 * ============================================================
 * FAILOVER TEST
 * ============================================================
 *
 * IMPORTANT:
 *
 * You normally test failover by stopping
 * the current Redis master.
 *
 * Sentinel should:
 *
 * Master DOWN
 *     ↓
 * Detect failure
 *     ↓
 * Elect/promote replica
 *     ↓
 * New master
 *     ↓
 * ioredis reconnects
 *
 * ============================================================
 */

async function testAfterFailover() {
  console.log("Waiting for Redis...");

  while (true) {
    try {
      const value = await redis.get("failover:test");

      console.log("Redis available:", value);

      break;
    } catch (error) {
      console.warn("Redis unavailable:", error.message);

      await sleep(1000);
    }
  }
}

/*
 * ============================================================
 * Sleep
 * ============================================================
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`[shutdown] ${signal}`);

  try {
    await redis.quit();
  } catch (error) {
    console.error("[shutdown]", error.message);

    redis.disconnect();
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  console.log("Redis Sentinel");

  console.log("Health:", await healthCheck());

  await setCache("demo:key", "hello", 300);

  console.log("GET:", await get("demo:key"));

  console.log("Counter:", await increment("demo:counter"));
}

await main();
