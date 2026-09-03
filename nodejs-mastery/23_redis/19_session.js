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
 * Session configuration
 * ============================================================
 */

const SESSION_PREFIX = "session:";

const USER_SESSIONS_PREFIX = "user-sessions:";

/*
 * 30 minutes.
 *
 * In production, choose this according to
 * your application's security requirements.
 */

const SESSION_TTL = 30 * 60;

/*
 * Sliding session:
 *
 * Every successful session access can
 * extend the TTL.
 */

const SLIDING_SESSION = true;

/*
 * Don't refresh TTL on every request if
 * you don't need to.
 *
 * This threshold means:
 *
 * If remaining TTL < 10 minutes,
 * extend it back to 30 minutes.
 */

const REFRESH_THRESHOLD = 10 * 60;

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

function sessionKey(sessionId) {
  return `${SESSION_PREFIX}${sessionId}`;
}

function userSessionsKey(userId) {
  return `${USER_SESSIONS_PREFIX}${userId}`;
}

/*
 * ============================================================
 * Generate cryptographically secure session ID
 * ============================================================
 */

function generateSessionId() {
  return crypto.randomBytes(32).toString("base64url");
}

/*
 * ============================================================
 * Serialize session
 * ============================================================
 */

function serializeSession(session) {
  return JSON.stringify(session);
}

/*
 * ============================================================
 * Deserialize session
 * ============================================================
 */

function deserializeSession(value) {
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("[session] invalid JSON:", error);

    return null;
  }
}

/*
 * ============================================================
 * Create session
 * ============================================================
 *
 * Redis:
 *
 * session:<sessionId>
 *
 * {
 *   userId,
 *   createdAt,
 *   lastAccessedAt,
 *   ip,
 *   userAgent
 * }
 *
 *
 * Also maintain:
 *
 * user-sessions:<userId>
 *
 * SET of session IDs.
 * ============================================================
 */

async function createSession({
  userId,
  ip,
  userAgent,
  ttlSeconds = SESSION_TTL,
}) {
  const sessionId = generateSessionId();

  const now = Date.now();

  const session = {
    sessionId,

    userId,

    createdAt: now,

    lastAccessedAt: now,

    ip: ip ?? null,

    userAgent: userAgent ?? null,
  };

  const pipeline = redis.pipeline();

  /*
   * Store session.
   */

  pipeline.set(
    sessionKey(sessionId),

    serializeSession(session),

    "EX",

    ttlSeconds,
  );

  /*
   * Add session to user's
   * session index.
   */

  pipeline.sadd(
    userSessionsKey(userId),

    sessionId,
  );

  /*
   * Keep the user session index
   * alive.
   */

  pipeline.expire(
    userSessionsKey(userId),

    ttlSeconds,
  );

  await pipeline.exec();

  return session;
}

/*
 * ============================================================
 * Get session
 * ============================================================
 */

async function getSession(sessionId) {
  const value = await redis.get(sessionKey(sessionId));

  return deserializeSession(value);
}

/*
 * ============================================================
 * Get session with TTL
 * ============================================================
 */

async function getSessionWithTTL(sessionId) {
  const key = sessionKey(sessionId);

  const [value, ttl] = await Promise.all([redis.get(key), redis.ttl(key)]);

  const session = deserializeSession(value);

  if (!session) {
    return null;
  }

  return {
    session,

    ttl,
  };
}

/*
 * ============================================================
 * Touch session
 * ============================================================
 *
 * Sliding expiration.
 *
 * Example:
 *
 * TTL = 30 min
 *
 * User keeps using application.
 *
 * Session remains alive.
 * ============================================================
 */

async function touchSession(sessionId, ttlSeconds = SESSION_TTL) {
  const key = sessionKey(sessionId);

  const currentTTL = await redis.ttl(key);

  /*
   * Session does not exist.
   */

  if (currentTTL === -2) {
    return false;
  }

  /*
   * Refresh only when
   * TTL is getting low.
   */

  if (currentTTL <= REFRESH_THRESHOLD) {
    await redis.expire(key, ttlSeconds);
  }

  return true;
}

/*
 * ============================================================
 * Get + touch
 * ============================================================
 */

async function getActiveSession(sessionId) {
  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  /*
   * Update last accessed time.
   */

  session.lastAccessedAt = Date.now();

  /*
   * We only rewrite the JSON when
   * lastAccessedAt needs to be stored.
   *
   * Production alternative:
   * use Redis HASH.
   */

  await redis.set(
    sessionKey(sessionId),

    serializeSession(session),

    "KEEPTTL",
  );

  if (SLIDING_SESSION) {
    await touchSession(sessionId);
  }

  return session;
}

/*
 * ============================================================
 * Update session
 * ============================================================
 */

async function updateSession(sessionId, updates) {
  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  const updatedSession = {
    ...session,

    ...updates,

    sessionId: session.sessionId,

    userId: session.userId,
  };

  /*
   * KEEPTTL prevents accidentally
   * removing the existing expiration.
   */

  await redis.set(
    sessionKey(sessionId),

    serializeSession(updatedSession),

    "KEEPTTL",
  );

  return updatedSession;
}

/*
 * ============================================================
 * Delete session
 * ============================================================
 *
 * Remove:
 *
 * 1. session:<sessionId>
 *
 * 2. session ID from
 *    user-sessions:<userId>
 * ============================================================
 */

async function deleteSession(sessionId) {
  const session = await getSession(sessionId);

  if (!session) {
    return false;
  }

  const pipeline = redis.pipeline();

  pipeline.del(sessionKey(sessionId));

  pipeline.srem(
    userSessionsKey(session.userId),

    sessionId,
  );

  await pipeline.exec();

  return true;
}

/*
 * ============================================================
 * Delete all sessions for user
 * ============================================================
 *
 * Useful for:
 *
 * "Logout from all devices"
 *
 * Password change
 *
 * Security incident
 * ============================================================
 */

async function deleteAllUserSessions(userId) {
  const indexKey = userSessionsKey(userId);

  const sessionIds = await redis.smembers(indexKey);

  if (sessionIds.length === 0) {
    return 0;
  }

  const pipeline = redis.pipeline();

  /*
   * Delete every session.
   */

  for (const sessionId of sessionIds) {
    pipeline.del(sessionKey(sessionId));
  }

  /*
   * Delete index.
   */

  pipeline.del(indexKey);

  await pipeline.exec();

  return sessionIds.length;
}

/*
 * ============================================================
 * List user's sessions
 * ============================================================
 */

async function listUserSessions(userId) {
  const sessionIds = await redis.smembers(userSessionsKey(userId));

  if (sessionIds.length === 0) {
    return [];
  }

  /*
   * MGET avoids one Redis request
   * per session.
   */

  const keys = sessionIds.map(sessionKey);

  const values = await redis.mget(...keys);

  const sessions = [];

  for (let i = 0; i < values.length; i++) {
    const session = deserializeSession(values[i]);

    /*
     * Session expired but the
     * index hasn't been cleaned.
     */

    if (session) {
      sessions.push(session);
    }
  }

  return sessions;
}

/*
 * ============================================================
 * Cleanup stale session indexes
 * ============================================================
 *
 * Redis automatically removes:
 *
 * session:<id>
 *
 * but:
 *
 * user-sessions:<userId>
 *
 * may still contain expired session IDs.
 *
 * This cleans them.
 * ============================================================
 */

async function cleanupUserSessionIndex(userId) {
  const indexKey = userSessionsKey(userId);

  const sessionIds = await redis.smembers(indexKey);

  if (sessionIds.length === 0) {
    return 0;
  }

  const keys = sessionIds.map(sessionKey);

  const values = await redis.mget(...keys);

  const staleIds = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i] === null) {
      staleIds.push(sessionIds[i]);
    }
  }

  if (staleIds.length > 0) {
    await redis.srem(indexKey, ...staleIds);
  }

  return staleIds.length;
}

/*
 * ============================================================
 * Session rotation
 * ============================================================
 *
 * IMPORTANT SECURITY PATTERN
 *
 * Session rotation prevents
 * session fixation.
 *
 *
 * Old:
 *
 * session:A
 *
 *       ↓
 *
 * New:
 *
 * session:B
 *
 *
 * Use after:
 *
 * login
 * privilege escalation
 * password change
 * etc.
 * ============================================================
 */

async function rotateSession(oldSessionId) {
  const oldSession = await getSession(oldSessionId);

  if (!oldSession) {
    return null;
  }

  /*
   * Generate completely new
   * session ID.
   */

  const newSessionId = generateSessionId();

  const now = Date.now();

  const newSession = {
    ...oldSession,

    sessionId: newSessionId,

    createdAt: now,

    lastAccessedAt: now,
  };

  const ttl = await redis.ttl(sessionKey(oldSessionId));

  const pipeline = redis.pipeline();

  /*
   * Create new session.
   */

  pipeline.set(
    sessionKey(newSessionId),

    serializeSession(newSession),

    "EX",

    ttl > 0 ? ttl : SESSION_TTL,
  );

  /*
   * Add new session to
   * user index.
   */

  pipeline.sadd(
    userSessionsKey(oldSession.userId),

    newSessionId,
  );

  /*
   * Remove old session.
   */

  pipeline.del(sessionKey(oldSessionId));

  pipeline.srem(
    userSessionsKey(oldSession.userId),

    oldSessionId,
  );

  await pipeline.exec();

  return newSession;
}

/*
 * ============================================================
 * Session count
 * ============================================================
 */

async function countUserSessions(userId) {
  return redis.scard(userSessionsKey(userId));
}

/*
 * ============================================================
 * Maximum sessions per user
 * ============================================================
 *
 * Example:
 *
 * Maximum 5 devices.
 *
 * When sixth device logs in:
 *
 * remove oldest session.
 * ============================================================
 */

async function enforceSessionLimit(userId, maxSessions = 5) {
  const sessions = await listUserSessions(userId);

  if (sessions.length <= maxSessions) {
    return [];
  }

  /*
   * Oldest first.
   */

  sessions.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);

  const sessionsToDelete = sessions.slice(0, sessions.length - maxSessions);

  for (const session of sessionsToDelete) {
    await deleteSession(session.sessionId);
  }

  return sessionsToDelete;
}

/*
 * ============================================================
 * Create session with limit
 * ============================================================
 */

async function createLimitedSession({
  userId,
  ip,
  userAgent,
  maxSessions = 5,
}) {
  const session = await createSession({
    userId,

    ip,

    userAgent,
  });

  await enforceSessionLimit(userId, maxSessions);

  return session;
}

/*
 * ============================================================
 * Atomic session validation
 * ============================================================
 *
 * Lua allows:
 *
 * GET + TTL refresh
 *
 * to happen atomically.
 *
 * This avoids race conditions between
 * separate commands.
 * ============================================================
 */

const GET_SESSION_SCRIPT = `

local value =
  redis.call(
    "GET",
    KEYS[1]
  )

if not value then
  return false
end

local ttl =
  redis.call(
    "TTL",
    KEYS[1]
  )

if ttl <= tonumber(ARGV[1]) then

  redis.call(
    "EXPIRE",
    KEYS[1],
    ARGV[2]
  )

  ttl =
    tonumber(ARGV[2])

end

return {
  value,
  ttl
}

`;

/*
 * ============================================================
 * Atomic get active session
 * ============================================================
 */

async function getActiveSessionAtomic(
  sessionId,
  refreshThreshold = REFRESH_THRESHOLD,
  refreshTTL = SESSION_TTL,
) {
  const result = await redis.eval(
    GET_SESSION_SCRIPT,

    1,

    sessionKey(sessionId),

    refreshThreshold,

    refreshTTL,
  );

  if (!result) {
    return null;
  }

  const [value, ttl] = result;

  const session = deserializeSession(value);

  if (!session) {
    return null;
  }

  return {
    session,

    ttl: Number(ttl),
  };
}

/*
 * ============================================================
 * Revoke session
 * ============================================================
 *
 * Sometimes you don't want to immediately
 * delete the session.
 *
 * Instead mark it:
 *
 * revoked: true
 *
 * This is useful when you need audit data
 * or controlled invalidation.
 * ============================================================
 */

async function revokeSession(sessionId) {
  return updateSession(sessionId, {
    revoked: true,

    revokedAt: Date.now(),
  });
}

/*
 * ============================================================
 * Validate session
 * ============================================================
 */

async function validateSession(sessionId) {
  const result = await getActiveSessionAtomic(sessionId);

  if (!result) {
    return null;
  }

  if (result.session.revoked) {
    return null;
  }

  return result.session;
}

/*
 * ============================================================
 * Example 1
 * Create session
 * ============================================================
 */

async function createExample() {
  const session = await createSession({
    userId: "user-100",

    ip: "127.0.0.1",

    userAgent: "Chrome",
  });

  console.log("Created session:", session);

  return session;
}

/*
 * ============================================================
 * Example 2
 * Get session
 * ============================================================
 */

async function getExample(sessionId) {
  const session = await getActiveSession(sessionId);

  console.log("Active session:", session);

  return session;
}

/*
 * ============================================================
 * Example 3
 * Update session
 * ============================================================
 */

async function updateExample(sessionId) {
  const session = await updateSession(
    sessionId,

    {
      ip: "192.168.1.100",

      userAgent: "Chrome on Windows",
    },
  );

  console.log("Updated session:", session);

  return session;
}

/*
 * ============================================================
 * Example 4
 * Rotate session
 * ============================================================
 */

async function rotateExample(sessionId) {
  const newSession = await rotateSession(sessionId);

  console.log("Rotated session:", newSession);

  return newSession;
}

/*
 * ============================================================
 * Example 5
 * List devices
 * ============================================================
 */

async function devicesExample(userId) {
  const sessions = await listUserSessions(userId);

  console.log("Active devices:", sessions);

  return sessions;
}

/*
 * ============================================================
 * Example 6
 * Logout one device
 * ============================================================
 */

async function logoutOneDevice(sessionId) {
  const deleted = await deleteSession(sessionId);

  console.log("Logged out:", deleted);

  return deleted;
}

/*
 * ============================================================
 * Example 7
 * Logout all devices
 * ============================================================
 */

async function logoutAllDevices(userId) {
  const deleted = await deleteAllUserSessions(userId);

  console.log("Logged out devices:", deleted);

  return deleted;
}

/*
 * ============================================================
 * Example 8
 * Security event
 * ============================================================
 */

async function passwordChanged(userId) {
  /*
   * Invalidate every existing session.
   */

  await deleteAllUserSessions(userId);

  console.log("All sessions invalidated after password change");
}

/*
 * ============================================================
 * Example 9
 * Security revoke
 * ============================================================
 */

async function revokeExample(sessionId) {
  const session = await revokeSession(sessionId);

  console.log("Revoked:", session);

  return session;
}

/*
 * ============================================================
 * Example 10
 * Cleanup
 * ============================================================
 */

async function cleanupExample(userId) {
  const removed = await cleanupUserSessionIndex(userId);

  console.log("Stale session references removed:", removed);

  return removed;
}

/*
 * ============================================================
 * Session service
 * ============================================================
 */

const sessionService = {
  create: createSession,

  createLimited: createLimitedSession,

  get: getSession,

  getActive: getActiveSessionAtomic,

  validate: validateSession,

  update: updateSession,

  touch: touchSession,

  rotate: rotateSession,

  delete: deleteSession,

  deleteAll: deleteAllUserSessions,

  list: listUserSessions,

  count: countUserSessions,

  revoke: revokeSession,

  cleanup: cleanupUserSessionIndex,

  enforceLimit: enforceSessionLimit,
};

/*
 * ============================================================
 * Session architecture
 * ============================================================
 */

function showArchitecture() {
  console.log(
    `
============================================================
REDIS SESSION ARCHITECTURE
============================================================

Browser
   │
   │ Cookie: sessionId
   ▼
Node.js API
   │
   ▼
Redis
   │
   ├── session:<id>
   │
   └── user-sessions:<userId>
   │
   ▼
Session data


============================================================
LOGIN
============================================================

Login
  │
  ▼
Validate credentials
  │
  ▼
Create session
  │
  ├── Redis SET
  │
  └── User session index
  │
  ▼
Set HttpOnly cookie


============================================================
REQUEST
============================================================

Cookie
  │
  ▼
sessionId
  │
  ▼
Redis GET
  │
  ├── MISS → 401
  │
  └── HIT
       │
       ▼
    Validate
       │
       ▼
    Request


============================================================
LOGOUT
============================================================

Cookie
  │
  ▼
Redis DEL
  │
  ▼
Clear cookie


============================================================
LOGOUT ALL
============================================================

userId
  │
  ▼
user-sessions:<userId>
  │
  ▼
Get all session IDs
  │
  ▼
Delete sessions
  │
  ▼
Delete index


============================================================
SESSION ROTATION
============================================================

Old Session
    │
    ▼
Generate new random ID
    │
    ▼
Create new session
    │
    ▼
Delete old session


============================================================
`,
  );
}

/*
 * ============================================================
 * Production notes
 * ============================================================
 */

function showProductionNotes() {
  console.log(
    `
============================================================
PRODUCTION SESSION RULES
============================================================

1. Generate session IDs using crypto.randomBytes().

2. Never use predictable session IDs.

3. Store session ID in an HttpOnly cookie.

4. Use Secure cookies in HTTPS production.

5. Use SameSite appropriately.

6. Never store passwords inside Redis sessions.

7. Keep sessions short-lived.

8. Use sliding expiration when appropriate.

9. Rotate sessions after authentication.

10. Invalidate sessions after password changes.

11. Support logout from all devices.

12. Use Redis as the session store.

13. Use MGET/pipeline for bulk operations.

14. Use Lua when atomicity matters.

15. Don't use KEYS on large production Redis.

16. Clean stale user-session indexes.

17. Set TTL on every session.

18. Don't put sensitive data into session objects.

============================================================
`,
  );
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    await redis.quit();

    console.log("Redis connection closed");
  } catch (error) {
    console.error("Redis shutdown error:", error);

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

    console.log("\nRedis Session Management");

    /*
     * Create.
     */

    const session = await createExample();

    /*
     * Read.
     */

    await getExample(session.sessionId);

    /*
     * Update.
     */

    await updateExample(session.sessionId);

    /*
     * Validate.
     */

    const validated = await validateSession(session.sessionId);

    console.log("Validated:", validated);

    /*
     * Devices.
     */

    await devicesExample(session.userId);

    /*
     * Cleanup.
     */

    await cleanupExample(session.userId);

    /*
     * Architecture.
     */

    showArchitecture();

    /*
     * Production notes.
     */

    showProductionNotes();

    console.log("\nSession examples completed");
  } catch (error) {
    console.error("\nSession error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
