import "dotenv/config";

import Redis from "ioredis";

/*
 * ============================================================
 * Redis configuration
 * ============================================================
 */

const redisConfig = {
  host: process.env.REDIS_HOST ?? "localhost",

  port: Number(process.env.REDIS_PORT ?? 6379),

  username: process.env.REDIS_USERNAME || undefined,

  password: process.env.REDIS_PASSWORD || undefined,

  db: Number(process.env.REDIS_DB ?? 0),

  /*
   * ----------------------------------------------------------
   * Connection timeout
   * ----------------------------------------------------------
   *
   * Maximum time to establish the
   * TCP connection.
   */

  connectTimeout: 5000,

  /*
   * ----------------------------------------------------------
   * Keep TCP connection alive
   * ----------------------------------------------------------
   */

  keepAlive: 10000,

  /*
   * ----------------------------------------------------------
   * Command retry limit
   * ----------------------------------------------------------
   *
   * Prevent one request from retrying
   * forever.
   */

  maxRetriesPerRequest: 3,

  /*
   * ----------------------------------------------------------
   * Offline queue
   * ----------------------------------------------------------
   *
   * Commands issued while Redis is
   * temporarily disconnected can be
   * queued.
   */

  enableOfflineQueue: true,

  /*
   * ----------------------------------------------------------
   * Reconnection strategy
   * ----------------------------------------------------------
   */

  retryStrategy(retryCount) {
    const delay = Math.min(retryCount * 100, 3000);

    console.log(`Redis retry #${retryCount} in ${delay}ms`);

    return delay;
  },
};

/*
 * ============================================================
 * Create Redis client
 * ============================================================
 */

const redis = new Redis(redisConfig);

/*
 * ============================================================
 * Connection events
 * ============================================================
 */

/*
 * TCP connection has been established.
 */

redis.on("connect", () => {
  console.log("[Redis] connect");
});

/*
 * Redis is ready to receive commands.
 */

redis.on("ready", () => {
  console.log("[Redis] ready");
});

/*
 * Redis connection failed.
 */

redis.on("error", (error) => {
  console.error("[Redis] error:", error.message);
});

/*
 * Redis is reconnecting.
 */

redis.on("reconnecting", (delay) => {
  console.log(`[Redis] reconnecting in ${delay}ms`);
});

/*
 * Connection closed.
 */

redis.on("close", () => {
  console.log("[Redis] close");
});

/*
 * Redis will no longer reconnect.
 */

redis.on("end", () => {
  console.log("[Redis] end");
});

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    /*
     * ioredis connects automatically.
     *
     * Wait until Redis is ready.
     */

    if (redis.status !== "ready") {
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
    }

    /*
     * --------------------------------------------------------
     * Health check
     * --------------------------------------------------------
     */

    const response = await redis.ping();

    console.log("PING:", response);

    /*
     * --------------------------------------------------------
     * Connection information
     * --------------------------------------------------------
     */

    console.log("Redis status:", redis.status);

    console.log("Redis options:", {
      host: redis.options.host,

      port: redis.options.port,

      db: redis.options.db,
    });
  } catch (error) {
    console.error("Redis startup failed:", error);

    process.exitCode = 1;
  }
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`${signal} received`);

  try {
    /*
     * quit()
     *
     * Allows pending Redis commands
     * to finish before closing.
     */

    if (redis.status !== "end") {
      await redis.quit();
    }

    console.log("Redis shutdown complete");

    process.exit(0);
  } catch (error) {
    console.error("Redis shutdown failed:", error);

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * Start application.
 */

await main();
