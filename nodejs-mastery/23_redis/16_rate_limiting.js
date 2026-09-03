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

const RATE_LIMIT_PREFIX = "rate-limit:";

/*
 * Default:
 *
 * 100 requests
 * per 60 seconds
 */

const DEFAULT_LIMIT = 100;

const DEFAULT_WINDOW = 60;

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
 * Helper
 * ============================================================
 */

function buildKey(identifier) {
  return `${RATE_LIMIT_PREFIX}${identifier}`;
}

/*
 * ============================================================
 * 01. Basic INCR rate limiter
 * ============================================================
 *
 * Example:
 *
 * 100 requests / 60 seconds
 *
 * First request:
 *
 * INCR → 1
 *
 * Second:
 *
 * INCR → 2
 *
 * ...
 *
 * 101st:
 *
 * INCR → 101
 *
 * Request denied.
 * ============================================================
 */

async function fixedWindowRateLimit({
  identifier,
  limit = DEFAULT_LIMIT,
  windowSeconds = DEFAULT_WINDOW,
}) {
  const key = buildKey(identifier);

  const count = await redis.incr(key);

  /*
   * Set expiration only for the
   * first request.
   */

  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  const ttl = await redis.ttl(key);

  const allowed = count <= limit;

  return {
    allowed,

    limit,

    remaining: Math.max(0, limit - count),

    current: count,

    resetIn: Math.max(0, ttl),
  };
}

/*
 * ============================================================
 * 02. Basic fixed-window example
 * ============================================================
 */

async function fixedWindowExample() {
  const result = await fixedWindowRateLimit({
    identifier: "user:100",

    limit: 5,

    windowSeconds: 10,
  });

  console.log("\nFixed window:", result);
}

/*
 * ============================================================
 * 03. API endpoint limiter
 * ============================================================
 */

async function apiRateLimit({ userId, endpoint }) {
  return fixedWindowRateLimit({
    identifier: `user:${userId}:endpoint:${endpoint}`,

    limit: 100,

    windowSeconds: 60,
  });
}

/*
 * ============================================================
 * 04. IP rate limiter
 * ============================================================
 */

async function ipRateLimit(ip) {
  return fixedWindowRateLimit({
    identifier: `ip:${ip}`,

    limit: 100,

    windowSeconds: 60,
  });
}

/*
 * ============================================================
 * 05. Login rate limiter
 * ============================================================
 *
 * Login should usually have a much stricter limit.
 * ============================================================
 */

async function loginRateLimit(ip) {
  return fixedWindowRateLimit({
    identifier: `login:${ip}`,

    limit: 5,

    windowSeconds: 60,
  });
}

/*
 * ============================================================
 * 06. Expensive AI endpoint limiter
 * ============================================================
 */

async function aiRateLimit(userId) {
  return fixedWindowRateLimit({
    identifier: `ai:${userId}`,

    limit: 10,

    windowSeconds: 60,
  });
}

/*
 * ============================================================
 * 07. Atomic fixed-window Lua script
 * ============================================================
 *
 * Problem with:
 *
 * INCR
 * EXPIRE
 *
 * being separate operations:
 *
 * Process A:
 *   INCR
 *
 * Process crashes
 *
 * EXPIRE never executes.
 *
 * The key can remain forever.
 *
 * Lua makes the operation atomic.
 * ============================================================
 */

const FIXED_WINDOW_SCRIPT = `

local current =
  redis.call(
    "INCR",
    KEYS[1]
  )

if current == 1 then

  redis.call(
    "EXPIRE",
    KEYS[1],
    ARGV[1]
  )

end

local ttl =
  redis.call(
    "TTL",
    KEYS[1]
  )

local limit =
  tonumber(
    ARGV[2]
  )

local allowed =
  0

if current <= limit then

  allowed = 1

end

local remaining =
  limit - current

if remaining < 0 then

  remaining = 0

end

return {

  allowed,

  current,

  remaining,

  ttl,

}

`;

/*
 * ============================================================
 * 08. Production fixed-window limiter
 * ============================================================
 */

async function atomicFixedWindow({ identifier, limit, windowSeconds }) {
  const key = buildKey(identifier);

  const result = await redis.eval(
    FIXED_WINDOW_SCRIPT,

    1,

    key,

    windowSeconds,

    limit,
  );

  const [allowed, current, remaining, ttl] = result;

  return {
    allowed: allowed === 1,

    current: Number(current),

    remaining: Number(remaining),

    resetIn: Number(ttl),

    limit,
  };
}

/*
 * ============================================================
 * 09. HTTP-style rate-limit response
 * ============================================================
 */

function createRateLimitHeaders(result) {
  return {
    "X-RateLimit-Limit": String(result.limit),

    "X-RateLimit-Remaining": String(result.remaining),

    "X-RateLimit-Reset": String(result.resetIn),
  };
}

/*
 * ============================================================
 * 10. 429 response
 * ============================================================
 */

function createRateLimitError(result) {
  const error = new Error("Too many requests");

  error.statusCode = 429;

  error.code = "RATE_LIMIT_EXCEEDED";

  error.retryAfter = result.resetIn;

  error.headers = {
    "Retry-After": String(result.resetIn),

    ...createRateLimitHeaders(result),
  };

  return error;
}

/*
 * ============================================================
 * 11. Express-style middleware
 * ============================================================
 */

function createRateLimiter({
  limit = DEFAULT_LIMIT,
  windowSeconds = DEFAULT_WINDOW,
  keyGenerator,
}) {
  return async function rateLimiter(req, res, next) {
    try {
      const identifier = keyGenerator(req);

      const result = await atomicFixedWindow({
        identifier,

        limit,

        windowSeconds,
      });

      /*
       * Add headers to every response.
       */

      const headers = createRateLimitHeaders({
        ...result,
        limit,
      });

      for (const [name, value] of Object.entries(headers)) {
        res.setHeader(name, value);
      }

      if (!result.allowed) {
        res.setHeader("Retry-After", result.resetIn);

        return res.status(429).json({
          error: "Too many requests",

          code: "RATE_LIMIT_EXCEEDED",

          retryAfter: result.resetIn,
        });
      }

      return next();
    } catch (error) {
      console.error("Rate limiter error:", error);

      /*
       * Fail-open policy.
       *
       * Application continues if Redis is unavailable.
       *
       * For security-sensitive endpoints you may
       * choose fail-closed instead.
       */

      return next();
    }
  };
}

/*
 * ============================================================
 * 12. Sliding-window rate limiter
 * ============================================================
 *
 * Uses Redis Sorted Sets.
 *
 * Score:
 *   timestamp
 *
 * Member:
 *   unique request ID
 *
 * Structure:
 *
 * rate-limit:user:100
 *
 *       Sorted Set
 *
 * timestamp → request
 * timestamp → request
 * timestamp → request
 * ============================================================
 */

const SLIDING_WINDOW_SCRIPT = `

local key =
  KEYS[1]

local now =
  tonumber(
    ARGV[1]
  )

local window =
  tonumber(
    ARGV[2]
  )

local limit =
  tonumber(
    ARGV[3]
  )

local requestId =
  ARGV[4]

local minimum =
  now - window

redis.call(
  "ZREMRANGEBYSCORE",
  key,
  0,
  minimum
)

local current =
  redis.call(
    "ZCARD",
    key
)

local allowed =
  0

if current < limit then

  redis.call(
    "ZADD",
    key,
    now,
    requestId
  )

  allowed = 1

  current = current + 1

end

redis.call(
  "PEXPIRE",
  key,
  window
)

local remaining =
  limit - current

if remaining < 0 then

  remaining = 0

end

return {

  allowed,

  current,

  remaining,

}

`;

/*
 * ============================================================
 * 13. Sliding-window implementation
 * ============================================================
 */

async function slidingWindowRateLimit({
  identifier,
  limit = DEFAULT_LIMIT,
  windowSeconds = DEFAULT_WINDOW,
}) {
  const key = buildKey(`sliding:${identifier}`);

  const now = Date.now();

  const requestId = `${now}:${Math.random()}`;

  const result = await redis.eval(
    SLIDING_WINDOW_SCRIPT,

    1,

    key,

    now,

    windowSeconds * 1000,

    limit,

    requestId,
  );

  const [allowed, current, remaining] = result;

  const ttl = await redis.pttl(key);

  return {
    allowed: allowed === 1,

    current: Number(current),

    remaining: Number(remaining),

    resetIn: Math.ceil(ttl / 1000),

    limit,
  };
}

/*
 * ============================================================
 * 14. Sliding-window example
 * ============================================================
 */

async function slidingWindowExample() {
  const result = await slidingWindowRateLimit({
    identifier: "user:100",

    limit: 5,

    windowSeconds: 10,
  });

  console.log("\nSliding window:", result);
}

/*
 * ============================================================
 * 15. Token Bucket
 * ============================================================
 *
 * Token bucket allows controlled bursts.
 *
 * Example:
 *
 * capacity = 10
 * refill = 2 tokens/sec
 *
 * Bucket:
 *
 * ██████████
 *
 * Each request:
 *
 * tokens - 1
 *
 * Tokens regenerate over time.
 * ============================================================
 */

const TOKEN_BUCKET_SCRIPT = `

local key =
  KEYS[1]

local now =
  tonumber(
    ARGV[1]
  )

local capacity =
  tonumber(
    ARGV[2]
  )

local refillRate =
  tonumber(
    ARGV[3]
  )

local requested =
  tonumber(
    ARGV[4]
  )

local data =
  redis.call(
    "HMGET",
    key,
    "tokens",
    "timestamp"
  )

local tokens =
  tonumber(
    data[1]
  )

local timestamp =
  tonumber(
    data[2]
  )

if tokens == nil then

  tokens = capacity

end

if timestamp == nil then

  timestamp = now

end

local elapsed =
  math.max(
    0,
    now - timestamp
  )

local refill =
  elapsed * refillRate

tokens =
  math.min(
    capacity,
    tokens + refill
  )

local allowed =
  0

if tokens >= requested then

  tokens =
    tokens - requested

  allowed = 1

end

redis.call(
  "HSET",
  key,
  "tokens",
  tokens,
  "timestamp",
  now
)

redis.call(
  "EXPIRE",
  key,
  math.ceil(
    capacity / refillRate
  ) + 60
)

return {

  allowed,

  tokens,

}

`;

/*
 * ============================================================
 * 16. Token bucket implementation
 * ============================================================
 */

async function tokenBucketRateLimit({
  identifier,

  capacity = 10,

  refillRate = 2,

  requested = 1,
}) {
  const key = buildKey(`bucket:${identifier}`);

  const now = Date.now() / 1000;

  const result = await redis.eval(
    TOKEN_BUCKET_SCRIPT,

    1,

    key,

    now,

    capacity,

    refillRate,

    requested,
  );

  const [allowed, tokens] = result;

  return {
    allowed: allowed === 1,

    tokens: Number(tokens),

    capacity,

    refillRate,
  };
}

/*
 * ============================================================
 * 17. Token bucket example
 * ============================================================
 */

async function tokenBucketExample() {
  const result = await tokenBucketRateLimit({
    identifier: "user:100",

    capacity: 10,

    refillRate: 2,

    requested: 1,
  });

  console.log("\nToken bucket:", result);
}

/*
 * ============================================================
 * 18. Multiple request consumption
 * ============================================================
 */

async function consumeTokens(userId, tokens) {
  return tokenBucketRateLimit({
    identifier: `user:${userId}`,

    capacity: 20,

    refillRate: 5,

    requested: tokens,
  });
}

/*
 * ============================================================
 * 19. Different limits for different users
 * ============================================================
 */

const USER_PLANS = {
  free: {
    limit: 60,

    windowSeconds: 60,
  },

  pro: {
    limit: 600,

    windowSeconds: 60,
  },

  enterprise: {
    limit: 5000,

    windowSeconds: 60,
  },
};

/*
 * ============================================================
 * 20. Plan-based limiter
 * ============================================================
 */

async function planRateLimit({ userId, plan }) {
  const config = USER_PLANS[plan] ?? USER_PLANS.free;

  return atomicFixedWindow({
    identifier: `plan:${plan}:user:${userId}`,

    limit: config.limit,

    windowSeconds: config.windowSeconds,
  });
}

/*
 * ============================================================
 * 21. Endpoint-specific limits
 * ============================================================
 */

const ENDPOINT_LIMITS = {
  "/api/login": {
    limit: 5,

    windowSeconds: 60,
  },

  "/api/register": {
    limit: 3,

    windowSeconds: 60,
  },

  "/api/timetable/generate": {
    limit: 10,

    windowSeconds: 60,
  },

  "/api/timetable": {
    limit: 100,

    windowSeconds: 60,
  },
};

/*
 * ============================================================
 * 22. Endpoint limiter
 * ============================================================
 */

async function endpointRateLimit({ userId, endpoint }) {
  const config = ENDPOINT_LIMITS[endpoint] ?? {
    limit: 100,

    windowSeconds: 60,
  };

  return atomicFixedWindow({
    identifier: `endpoint:${endpoint}:user:${userId}`,

    limit: config.limit,

    windowSeconds: config.windowSeconds,
  });
}

/*
 * ============================================================
 * 23. Combined user + IP limiter
 * ============================================================
 */

async function combinedRateLimit({ userId, ip }) {
  const [userLimit, ipLimit] = await Promise.all([
    atomicFixedWindow({
      identifier: `user:${userId}`,

      limit: 100,

      windowSeconds: 60,
    }),

    atomicFixedWindow({
      identifier: `ip:${ip}`,

      limit: 200,

      windowSeconds: 60,
    }),
  ]);

  if (!userLimit.allowed) {
    return {
      allowed: false,

      reason: "USER_LIMIT",

      result: userLimit,
    };
  }

  if (!ipLimit.allowed) {
    return {
      allowed: false,

      reason: "IP_LIMIT",

      result: ipLimit,
    };
  }

  return {
    allowed: true,

    reason: null,

    user: userLimit,

    ip: ipLimit,
  };
}

/*
 * ============================================================
 * 24. Rate limiter service
 * ============================================================
 */

const rateLimiter = {
  fixedWindow: atomicFixedWindow,

  slidingWindow: slidingWindowRateLimit,

  tokenBucket: tokenBucketRateLimit,

  byUser: async (userId, options = {}) =>
    atomicFixedWindow({
      identifier: `user:${userId}`,

      limit: options.limit ?? 100,

      windowSeconds: options.windowSeconds ?? 60,
    }),

  byIP: async (ip, options = {}) =>
    atomicFixedWindow({
      identifier: `ip:${ip}`,

      limit: options.limit ?? 100,

      windowSeconds: options.windowSeconds ?? 60,
    }),

  byEndpoint: endpointRateLimit,

  combined: combinedRateLimit,
};

/*
 * ============================================================
 * 25. Timetable generation limiter
 * ============================================================
 *
 * AI generation is expensive.
 *
 * Don't allow a user to generate unlimited timetables.
 * ============================================================
 */

async function timetableGenerationRateLimit(userId) {
  return atomicFixedWindow({
    identifier: `timetable-generation:${userId}`,

    limit: 10,

    windowSeconds: 60,
  });
}

/*
 * ============================================================
 * 26. Timetable request example
 * ============================================================
 */

async function timetableRequest(userId) {
  const result = await timetableGenerationRateLimit(userId);

  console.log("\nTimetable rate limit:", result);

  if (!result.allowed) {
    throw createRateLimitError(result);
  }

  /*
   * Continue with:
   *
   * Redis Stream
   *      ↓
   * Consumer Group
   *      ↓
   * LangGraph
   */

  console.log("Timetable generation allowed");
}

/*
 * ============================================================
 * 27. Get current counter
 * ============================================================
 */

async function getRateLimitState(identifier) {
  const key = buildKey(identifier);

  const [count, ttl] = await Promise.all([redis.get(key), redis.ttl(key)]);

  return {
    count: count ? Number(count) : 0,

    ttl: Math.max(0, ttl),
  };
}

/*
 * ============================================================
 * 28. Reset rate limit
 * ============================================================
 *
 * Useful for:
 *
 * - Admins
 * - Testing
 * - Support
 * ============================================================
 */

async function resetRateLimit(identifier) {
  const key = buildKey(identifier);

  const result = await redis.del(key);

  console.log("Rate limit reset:", {
    key,
    deleted: result === 1,
  });

  return result === 1;
}

/*
 * ============================================================
 * 29. Remaining time
 * ============================================================
 */

async function getResetTime(identifier) {
  const key = buildKey(identifier);

  const ttl = await redis.ttl(key);

  return Math.max(0, ttl);
}

/*
 * ============================================================
 * 30. Demonstrate rate limiting
 * ============================================================
 */

async function demonstration() {
  const identifier = "demo:user:100";

  await resetRateLimit(identifier);

  for (let i = 1; i <= 7; i++) {
    const result = await atomicFixedWindow({
      identifier,

      limit: 5,

      windowSeconds: 10,
    });

    console.log(`Request ${i}:`, result);
  }
}

/*
 * ============================================================
 * 31. Security example
 * ============================================================
 */

async function securityExample(ip) {
  const result = await loginRateLimit(ip);

  if (!result.allowed) {
    console.error("Login rate limit exceeded");

    throw createRateLimitError(result);
  }

  console.log("Login attempt allowed");
}

/*
 * ============================================================
 * 32. Rate-limit strategy comparison
 * ============================================================
 */

function compareStrategies() {
  console.log(
    `
============================================================
RATE LIMITING STRATEGIES
============================================================

FIXED WINDOW
-------------

100 requests / 60 seconds

Simple and fast.

Redis:
INCR
EXPIRE


SLIDING WINDOW
--------------

100 requests / rolling 60 seconds

More accurate.

Redis:
Sorted Set


TOKEN BUCKET
------------

Allows controlled bursts.

Example:

capacity = 10
refill = 2/sec

Good for APIs where bursts are acceptable.


============================================================
`,
  );
}

/*
 * ============================================================
 * 33. Recommended strategy
 * ============================================================
 */

function recommendedStrategy() {
  console.log(
    `
============================================================
RECOMMENDED
============================================================

Normal API
    ↓
Fixed Window

Strict API protection
    ↓
Sliding Window

High-throughput API
    ↓
Token Bucket

Login
    ↓
Strict IP + account limit

AI generation
    ↓
User + endpoint + plan limit

Public API
    ↓
IP + API key + endpoint limit

============================================================
`,
  );
}

/*
 * ============================================================
 * 34. Graceful shutdown
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

    console.log("\nRedis Rate Limiting examples");

    /*
     * Basic fixed window.
     */

    console.log("\n--- FIXED WINDOW ---");

    await fixedWindowExample();

    /*
     * Atomic fixed window.
     */

    console.log("\n--- ATOMIC FIXED WINDOW ---");

    console.log(
      await atomicFixedWindow({
        identifier: "user:100",

        limit: 100,

        windowSeconds: 60,
      }),
    );

    /*
     * Sliding window.
     */

    console.log("\n--- SLIDING WINDOW ---");

    await slidingWindowExample();

    /*
     * Token bucket.
     */

    console.log("\n--- TOKEN BUCKET ---");

    await tokenBucketExample();

    /*
     * Plan-based.
     */

    console.log("\n--- PLAN LIMIT ---");

    console.log(
      await planRateLimit({
        userId: "user:100",

        plan: "pro",
      }),
    );

    /*
     * Combined.
     */

    console.log("\n--- USER + IP ---");

    console.log(
      await combinedRateLimit({
        userId: "user:100",

        ip: "127.0.0.1",
      }),
    );

    /*
     * Timetable.
     */

    console.log("\n--- TIMETABLE GENERATION ---");

    await timetableRequest("user:100");

    /*
     * Demonstration.
     */

    console.log("\n--- DEMONSTRATION ---");

    await demonstration();

    /*
     * Strategy comparison.
     */

    compareStrategies();

    recommendedStrategy();

    console.log("\nRate limiting examples completed");
  } catch (error) {
    console.error("\nRate limiting error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
