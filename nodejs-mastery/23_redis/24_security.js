/*
 * ============================================================
 * 24_security.js
 * ============================================================
 *
 * Redis Security with ioredis
 *
 * Topics:
 *
 * 1. Environment secrets
 * 2. TLS
 * 3. Redis authentication
 * 4. Redis ACL
 * 5. Least privilege
 * 6. Key namespaces
 * 7. Input validation
 * 8. Command injection prevention
 * 9. Sensitive data
 * 10. Safe logging
 * 11. TLS certificate verification
 * 12. Production configuration
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Environment configuration
 * ============================================================
 *
 * NEVER hard-code:
 *
 * password
 * username
 * TLS private keys
 * API secrets
 *
 * Use environment variables / secret manager.
 * ============================================================
 */

const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";

const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);

const REDIS_USERNAME = process.env.REDIS_USERNAME ?? "app";

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

/*
 * ============================================================
 * Validate production configuration
 * ============================================================
 */

function validateConfig() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !REDIS_PASSWORD) {
    throw new Error("REDIS_PASSWORD is required in production");
  }
}

/*
 * ============================================================
 * TLS configuration
 * ============================================================
 *
 * If Redis is exposed through a network,
 * TLS protects credentials and data
 * while travelling between application
 * and Redis.
 *
 * ============================================================
 */

function getTLSConfig() {
  const tlsEnabled = process.env.REDIS_TLS === "true";

  if (!tlsEnabled) {
    return undefined;
  }

  /*
   * rejectUnauthorized MUST remain true
   * in production.
   */

  return {
    rejectUnauthorized: true,
  };
}

/*
 * ============================================================
 * Redis connection
 * ============================================================
 */

validateConfig();

const redis = new Redis({
  host: REDIS_HOST,

  port: REDIS_PORT,

  username: REDIS_USERNAME,

  password: REDIS_PASSWORD,

  tls: getTLSConfig(),

  /*
   * Prevent commands from hanging forever.
   */

  connectTimeout: 10000,

  commandTimeout: 5000,

  /*
   * Retry failed connection attempts
   * with bounded backoff.
   */

  retryStrategy(times) {
    return Math.min(times * 200, 5000);
  },

  /*
   * Limit command retries.
   */

  maxRetriesPerRequest: 3,
});

/*
 * ============================================================
 * Connection events
 * ============================================================
 */

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("error", (error) => {
  /*
   * NEVER log passwords.
   */

  console.error("[redis] error:", {
    name: error.name,

    message: error.message,

    code: error.code,
  });
});

/*
 * ============================================================
 * Key namespace
 * ============================================================
 *
 * Don't allow arbitrary application
 * components to write anywhere.
 * ============================================================
 */

const KEY_PREFIX = "myapp";

function userKey(userId) {
  return `${KEY_PREFIX}:user:${userId}`;
}

function sessionKey(sessionId) {
  return `${KEY_PREFIX}:session:${sessionId}`;
}

function cacheKey(resource, id) {
  return `${KEY_PREFIX}:cache:${resource}:${id}`;
}

/*
 * ============================================================
 * Input validation
 * ============================================================
 *
 * Redis commands don't magically make
 * application input safe.
 *
 * Validate IDs before constructing keys.
 * ============================================================
 */

function validateIdentifier(value, fieldName) {
  if (typeof value !== "string") {
    throw new TypeError(`${fieldName} must be a string`);
  }

  /*
   * Example safe identifier:
   *
   * UUID
   * MongoDB ObjectId
   * internal ID
   *
   * Adjust this according to
   * your actual ID format.
   */

  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(value)) {
    throw new Error(`Invalid ${fieldName}`);
  }

  return value;
}

/*
 * ============================================================
 * Safe user key
 * ============================================================
 */

function safeUserKey(userId) {
  const id = validateIdentifier(userId, "userId");

  return userKey(id);
}

/*
 * ============================================================
 * Safe GET
 * ============================================================
 */

async function getUser(userId) {
  const key = safeUserKey(userId);

  return redis.get(key);
}

/*
 * ============================================================
 * Safe SET
 * ============================================================
 */

async function setUser(userId, value, ttl = 300) {
  const key = safeUserKey(userId);

  /*
   * Always set a TTL for temporary
   * cached data.
   */

  return redis.set(key, value, "EX", ttl);
}

/*
 * ============================================================
 * Don't build Redis commands
 * from raw user input.
 * ============================================================
 *
 * BAD:
 *
 * redis.call(userProvidedCommand)
 *
 *
 * NEVER allow clients to choose
 * arbitrary Redis commands.
 * ============================================================
 */

/*
 * ============================================================
 * Allowed operations
 * ============================================================
 */

const ALLOWED_OPERATIONS = new Set(["get", "set", "delete"]);

/*
 * ============================================================
 * Safe operation dispatcher
 * ============================================================
 */

async function executeOperation(operation, key, value) {
  if (!ALLOWED_OPERATIONS.has(operation)) {
    throw new Error("Operation not allowed");
  }

  switch (operation) {
    case "get":
      return redis.get(key);

    case "set":
      return redis.set(key, value, "EX", 300);

    case "delete":
      return redis.del(key);

    default:
      throw new Error("Unsupported operation");
  }
}

/*
 * ============================================================
 * Sensitive data protection
 * ============================================================
 *
 * Avoid storing sensitive data in Redis
 * unless there is a strong reason.
 * ============================================================
 */

async function storeSession(sessionId, userId) {
  const session = sessionKey(validateIdentifier(sessionId, "sessionId"));

  const user = validateIdentifier(userId, "userId");

  /*
   * Store only what is necessary.
   *
   * Don't put passwords,
   * payment information,
   * private keys, etc. here.
   */

  return redis.hset(
    session,

    "userId",
    user,
  );
}

/*
 * ============================================================
 * Session TTL
 * ============================================================
 */

async function expireSession(sessionId, ttlSeconds) {
  const key = sessionKey(validateIdentifier(sessionId, "sessionId"));

  return redis.expire(key, ttlSeconds);
}

/*
 * ============================================================
 * Safe cache serialization
 * ============================================================
 */

function serializeCache(value) {
  /*
   * Don't serialize undefined.
   */

  if (value === undefined) {
    throw new TypeError("Cannot cache undefined");
  }

  return JSON.stringify(value);
}

/*
 * ============================================================
 * Safe JSON cache
 * ============================================================
 */

async function setJsonCache(resource, id, value) {
  const safeId = validateIdentifier(id, "id");

  const key = cacheKey(resource, safeId);

  const serialized = serializeCache(value);

  return redis.set(key, serialized, "EX", 300);
}

/*
 * ============================================================
 * Hash field allowlist
 * ============================================================
 *
 * Don't let clients arbitrarily
 * choose sensitive Redis fields.
 * ============================================================
 */

const ALLOWED_USER_FIELDS = new Set(["name", "role", "status"]);

async function updateUserField(userId, field, value) {
  if (!ALLOWED_USER_FIELDS.has(field)) {
    throw new Error("Field is not allowed");
  }

  const key = safeUserKey(userId);

  return redis.hset(key, field, value);
}

/*
 * ============================================================
 * Safe pattern scanning
 * ============================================================
 *
 * Don't accept arbitrary patterns
 * from an untrusted user.
 * ============================================================
 */

async function scanApplicationKeys() {
  const keys = [];

  let cursor = "0";

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,

      "MATCH",

      `${KEY_PREFIX}:*`,

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
 * ACL health check
 * ============================================================
 */

async function getCurrentUser() {
  /*
   * Redis ACL WHOAMI returns the
   * authenticated Redis username.
   */

  return redis.call("ACL", "WHOAMI");
}

/*
 * ============================================================
 * Redis health check
 * ============================================================
 */

async function healthCheck() {
  try {
    const result = await redis.ping();

    return {
      healthy: result === "PONG",

      redisStatus: redis.status,
    };
  } catch (error) {
    return {
      healthy: false,

      redisStatus: redis.status,
    };
  }
}

/*
 * ============================================================
 * Safe logging
 * ============================================================
 */

function logRedisOperation(operation, key) {
  /*
   * Log key metadata where possible,
   * but don't log sensitive values.
   */

  console.log(
    "[redis]",

    {
      operation,

      key,
    },
  );
}

/*
 * ============================================================
 * Example
 * ============================================================
 */

async function example() {
  /*
   * Safe identifier.
   */

  const userId = "user-100";

  /*
   * Store cache.
   */

  await setUser(
    userId,
    JSON.stringify({
      name: "Shiva",
    }),
    300,
  );

  logRedisOperation("GET", userKey(userId));

  /*
   * Read cache.
   */

  const user = await getUser(userId);

  console.log("User:", user);

  /*
   * Current Redis ACL user.
   */

  console.log("Redis user:", await getCurrentUser());

  /*
   * Health.
   */

  console.log("Health:", await healthCheck());
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
  try {
    await example();
  } catch (error) {
    console.error("[main]", {
      name: error.name,

      message: error.message,
    });
  }
}

await main();
