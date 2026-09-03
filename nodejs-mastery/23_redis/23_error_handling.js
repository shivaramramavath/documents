/*
 * ============================================================
 * 23_error_handling.js
 * ============================================================
 *
 * Production Redis Error Handling
 * using ioredis
 *
 * ============================================================
 *
 * Topics:
 *
 * 1. Connection errors
 * 2. Reconnection
 * 3. Retry strategy
 * 4. Command timeout
 * 5. Safe Redis operations
 * 6. Cache fail-open
 * 7. Critical Redis fail-closed
 * 8. Error classification
 * 9. Logging
 * 10. Health check
 * 11. Graceful shutdown
 * 12. Retry storm prevention
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

/*
 * ============================================================
 * Redis connection
 * ============================================================
 */

const redis = new Redis(REDIS_URL, {
  /*
   * Enable Redis readiness checks.
   */

  enableReadyCheck: true,

  /*
   * Maximum number of times a
   * command is automatically retried
   * before failing.
   */

  maxRetriesPerRequest: 3,

  /*
   * Connection timeout.
   */

  connectTimeout: 10000,

  /*
   * Command timeout.
   *
   * Prevent requests from hanging
   * indefinitely.
   */

  commandTimeout: 5000,

  /*
   * TCP keep-alive.
   */

  keepAlive: 10000,

  /*
   * Reconnection strategy.
   *
   * IMPORTANT:
   *
   * Do not reconnect immediately
   * forever with zero delay.
   */

  retryStrategy(times) {
    /*
     * Exponential backoff.
     *
     * 100ms
     * 200ms
     * 400ms
     * 800ms
     * ...
     */

    const delay = Math.min(times * 200, 5000);

    console.warn(`[redis] reconnecting in ${delay}ms`);

    return delay;
  },
});

/*
 * ============================================================
 * Connection state
 * ============================================================
 */

let redisReady = false;

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connecting");
});

redis.on("ready", () => {
  redisReady = true;

  console.log("[redis] ready");
});

redis.on("close", () => {
  redisReady = false;

  console.warn("[redis] connection closed");
});

redis.on("reconnecting", (delay) => {
  redisReady = false;

  console.warn(`[redis] reconnecting in ${delay}ms`);
});

redis.on("end", () => {
  redisReady = false;

  console.warn("[redis] connection ended");
});

redis.on("error", (error) => {
  redisReady = false;

  console.error("[redis] connection error", {
    name: error.name,

    message: error.message,

    code: error.code,
  });
});

/*
 * ============================================================
 * Error types
 * ============================================================
 */

class RedisApplicationError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = "RedisApplicationError";

    this.code = options.code ?? "REDIS_ERROR";

    this.cause = options.cause;
  }
}

/*
 * ============================================================
 * Redis availability
 * ============================================================
 */

function isRedisAvailable() {
  return redisReady && redis.status === "ready";
}

/*
 * ============================================================
 * Error classification
 * ============================================================
 */

function classifyRedisError(error) {
  if (!error) {
    return "unknown";
  }

  const code = error.code ?? "";

  const message = String(error.message ?? "").toLowerCase();

  /*
   * Connection errors.
   */

  if (
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    message.includes("connection")
  ) {
    return "connection";
  }

  /*
   * Timeout.
   */

  if (message.includes("timeout")) {
    return "timeout";
  }

  /*
   * Redis command errors.
   */

  if (message.startsWith("err")) {
    return "command";
  }

  return "unknown";
}

/*
 * ============================================================
 * Logging helper
 * ============================================================
 */

function logRedisError(operation, error) {
  console.error(
    "[redis:error]",

    {
      operation,

      category: classifyRedisError(error),

      message: error?.message,

      code: error?.code,

      name: error?.name,
    },
  );
}

/*
 * ============================================================
 * Safe GET
 * ============================================================
 *
 * Cache reads are usually allowed
 * to fail open.
 *
 * Application continues without cache.
 *
 * ============================================================
 */

async function safeGet(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    logRedisError(`GET ${key}`, error);

    /*
     * FAIL OPEN
     *
     * Return null.
     *
     * Application can fetch data
     * from MongoDB/database instead.
     */

    return null;
  }
}

/*
 * ============================================================
 * Safe SET
 * ============================================================
 */

async function safeSet(key, value, ttl) {
  try {
    if (ttl) {
      await redis.set(key, value, "EX", ttl);
    } else {
      await redis.set(key, value);
    }

    return true;
  } catch (error) {
    logRedisError(`SET ${key}`, error);

    /*
     * Cache failure should normally
     * not crash the application.
     */

    return false;
  }
}

/*
 * ============================================================
 * Safe DELETE
 * ============================================================
 */

async function safeDelete(key) {
  try {
    await redis.del(key);

    return true;
  } catch (error) {
    logRedisError(`DEL ${key}`, error);

    return false;
  }
}

/*
 * ============================================================
 * Critical Redis operation
 * ============================================================
 *
 * Sometimes Redis is not optional.
 *
 * Example:
 *
 * Distributed lock
 * Idempotency
 * Rate limit
 * Session storage
 *
 * In these cases we may need FAIL CLOSED.
 * ============================================================
 */

async function criticalGet(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    logRedisError(`CRITICAL GET ${key}`, error);

    throw new RedisApplicationError(
      "Critical Redis operation failed",

      {
        code: "CRITICAL_REDIS_FAILURE",

        cause: error,
      },
    );
  }
}

/*
 * ============================================================
 * Redis health check
 * ============================================================
 */

async function healthCheck() {
  const start = process.hrtime.bigint();

  try {
    const result = await redis.ping();

    const end = process.hrtime.bigint();

    const latency = Number(end - start) / 1_000_000;

    return {
      healthy: result === "PONG",

      latencyMs: Number(latency.toFixed(2)),

      status: redis.status,
    };
  } catch (error) {
    logRedisError("PING", error);

    return {
      healthy: false,

      latencyMs: null,

      status: redis.status,

      error: error.message,
    };
  }
}

/*
 * ============================================================
 * Retry helper
 * ============================================================
 *
 * Use application-level retry carefully.
 *
 * Don't retry everything.
 * ============================================================
 */

async function retry(operation, options = {}) {
  const {
    attempts = 3,

    baseDelay = 100,

    maxDelay = 2000,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      /*
       * Don't retry programming /
       * command errors.
       */

      const category = classifyRedisError(error);

      if (category === "command") {
        throw error;
      }

      if (attempt === attempts) {
        break;
      }

      /*
       * Exponential backoff.
       */

      const delay = Math.min(
        baseDelay * 2 ** (attempt - 1),

        maxDelay,
      );

      /*
       * Small jitter prevents
       * synchronized retry storms.
       */

      const jitter = Math.random() * 100;

      await sleep(delay + jitter);
    }
  }

  throw lastError;
}

/*
 * ============================================================
 * Retry GET
 * ============================================================
 */

async function retryGet(key) {
  return retry(
    () => redis.get(key),

    {
      attempts: 3,

      baseDelay: 100,

      maxDelay: 1000,
    },
  );
}

/*
 * ============================================================
 * Pipeline with error handling
 * ============================================================
 */

async function safePipeline(commands) {
  try {
    const pipeline = redis.pipeline();

    for (const command of commands) {
      pipeline[command.name](...command.args);
    }

    const results = await pipeline.exec();

    return results.map(([error, result]) => {
      if (error) {
        throw error;
      }

      return result;
    });
  } catch (error) {
    logRedisError("PIPELINE", error);

    throw new RedisApplicationError(
      "Redis pipeline failed",

      {
        code: "REDIS_PIPELINE_FAILURE",

        cause: error,
      },
    );
  }
}

/*
 * ============================================================
 * Transaction error handling
 * ============================================================
 */

async function safeTransaction(key) {
  try {
    const result = await redis
      .multi()

      .incr(key)

      .expire(key, 60)

      .exec();

    if (!result) {
      throw new Error("Redis transaction returned no result");
    }

    return result;
  } catch (error) {
    logRedisError("MULTI/EXEC", error);

    throw error;
  }
}

/*
 * ============================================================
 * JSON cache helper
 * ============================================================
 */

async function getJson(key) {
  const value = await safeGet(key);

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    /*
     * Corrupted cache data.
     *
     * Delete it and allow application
     * to regenerate it.
     */

    console.error("[redis] invalid JSON cache:", {
      key,
      error: error.message,
    });

    await safeDelete(key);

    return null;
  }
}

/*
 * ============================================================
 * JSON SET
 * ============================================================
 */

async function setJson(key, value, ttl) {
  try {
    const serialized = JSON.stringify(value);

    return await safeSet(key, serialized, ttl);
  } catch (error) {
    logRedisError(`JSON SET ${key}`, error);

    return false;
  }
}

/*
 * ============================================================
 * Redis error middleware pattern
 * ============================================================
 *
 * Useful in Express/Fastify style APIs.
 * ============================================================
 */

function redisErrorResponse(error) {
  const category = classifyRedisError(error);

  switch (category) {
    case "timeout":
      return {
        status: 503,

        body: {
          error: "Redis timeout",
        },
      };

    case "connection":
      return {
        status: 503,

        body: {
          error: "Redis temporarily unavailable",
        },
      };

    default:
      return {
        status: 500,

        body: {
          error: "Redis operation failed",
        },
      };
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
 * Example cache-aside pattern
 * ============================================================
 */

async function getUser(userId, database) {
  const key = `user:${userId}`;

  /*
   * 1. Try Redis.
   */

  const cached = await getJson(key);

  if (cached) {
    return {
      source: "redis",

      user: cached,
    };
  }

  /*
   * 2. Redis failed OR cache miss.
   *
   * Continue to database.
   */

  const user = await database.findUser(userId);

  if (!user) {
    return null;
  }

  /*
   * 3. Try populating cache.
   *
   * Cache failure does not fail
   * the request.
   */

  await setJson(key, user, 300);

  return {
    source: "database",

    user,
  };
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`[shutdown] ${signal}`);

  try {
    /*
     * Stop accepting application work
     * before closing Redis.
     *
     * Your HTTP server should normally
     * be closed before this point.
     */

    await redis.quit();

    console.log("[shutdown] redis closed");
  } catch (error) {
    console.error("[shutdown] redis error", error);

    /*
     * Last resort.
     */

    redis.disconnect();
  } finally {
    process.exit(0);
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
  try {
    /*
     * Initial health check.
     */

    console.log("Health:", await healthCheck());

    /*
     * Safe cache write.
     */

    await safeSet(
      "demo:user",
      JSON.stringify({
        name: "Shiva",
      }),
      60,
    );

    /*
     * Safe cache read.
     */

    console.log("Value:", await safeGet("demo:user"));

    /*
     * Retry example.
     */

    console.log("Retry result:", await retryGet("demo:user"));
  } catch (error) {
    console.error("[main]", error);
  }
}

await main();
