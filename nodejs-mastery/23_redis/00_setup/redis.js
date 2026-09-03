import "dotenv/config";

import Redis from "ioredis";

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

/*
 * ============================================================
 * Redis Client
 * ============================================================
 */

export const redis = new Redis(REDIS_URL, {
  /*
   * Database number.
   */

  db: Number(process.env.REDIS_DB ?? 0),

  /*
   * Automatically reconnect.
   *
   * retryCount
   *       ↓
   * calculate delay
   */

  retryStrategy(retryCount) {
    /*
     * Exponential backoff.
     *
     * 100ms
     * 200ms
     * 400ms
     * 800ms
     * ...
     *
     * Maximum 3 seconds.
     */

    return Math.min(retryCount * 100, 3000);
  },

  /*
   * Don't endlessly queue commands
   * while Redis is unavailable.
   *
   * We'll study this carefully later.
   */

  enableOfflineQueue: true,

  /*
   * Connection timeout.
   */

  connectTimeout: 5000,

  /*
   * Command timeout can be
   * configured when required.
   */

  maxRetriesPerRequest: 3,

  /*
   * TCP keep alive.
   */

  keepAlive: 10000,
});

/*
 * ============================================================
 * Events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay}ms...`);
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("end", () => {
  console.log("Redis connection ended");
});

/*
 * ============================================================
 * Connect
 * ============================================================
 */

export async function connectRedis() {
  /*
   * ioredis normally connects automatically
   * when the instance is created.
   *
   * Therefore we wait until it becomes ready.
   */

  if (redis.status === "ready") {
    return redis;
  }

  await new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();

      resolve();
    };

    const onError = (error) => {
      cleanup();

      reject(error);
    };

    const cleanup = () => {
      redis.off("ready", onReady);

      redis.off("error", onError);
    };

    redis.once("ready", onReady);

    redis.once("error", onError);
  });

  return redis;
}

/*
 * ============================================================
 * Disconnect
 * ============================================================
 */

export async function disconnectRedis() {
  if (redis.status === "end") {
    return;
  }

  await redis.quit();
}

/*
 * ============================================================
 * Ping
 * ============================================================
 */

export async function pingRedis() {
  return redis.ping();
}

/*
 * ============================================================
 * Health
 * ============================================================
 */

export function getRedisHealth() {
  return {
    status: redis.status,

    connected: redis.status === "ready",
  };
}
