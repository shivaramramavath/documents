/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/logout/logout.js
 *
 * Topic:
 *     User Logout
 *
 * ============================================================
 *
 * LOGOUT FLOW
 *
 * Client
 *   ↓
 * POST /api/v1/auth/logout
 *   ↓
 * Authenticate request
 *   ↓
 * Identify session / refresh token
 *   ↓
 * Revoke authentication state
 *   ↓
 * Clear cookie if applicable
 *   ↓
 * Return success
 *
 * ============================================================
 */

import express from "express";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * TEMPORARY SESSION STORE
 * ============================================================
 *
 * In production:
 *
 *     Redis
 *     MongoDB
 *     PostgreSQL
 *     dedicated session/token store
 *
 * depending on your architecture.
 *
 * ============================================================
 */

const sessions = new Map();

/*
 * ============================================================
 * EXAMPLE SESSION
 * ============================================================
 */

sessions.set("session-123", {
  id: "session-123",

  userId: "user-123",

  refreshTokenHash: "stored-hash",

  revoked: false,

  createdAt: new Date(),

  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

/*
 * ============================================================
 * 1. AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * This is a simplified example.
 *
 * A real application would verify the access token.
 *
 * ============================================================
 */

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  /*
   * Expected:
   *
   * Authorization: Bearer <access-token>
   */

  if (!authorization) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",

        message: "Authentication required",
      },
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: {
        code: "INVALID_AUTHORIZATION_HEADER",

        message: "Invalid authorization header",
      },
    });
  }

  /*
   * Normally:
   *
   *     verifyAccessToken(token)
   *
   *
   * would return claims such as:
   *
   * {
   *   sub: "user-123",
   *   sessionId: "session-123"
   * }
   */

  req.auth = {
    userId: "user-123",

    sessionId: "session-123",
  };

  next();
}

/*
 * ============================================================
 * 2. LOGOUT
 * ============================================================
 *
 * POST /api/v1/auth/logout
 *
 * ============================================================
 */

app.post("/api/v1/auth/logout", authenticate, async (req, res) => {
  /*
   * --------------------------------------------------------
   * Find current session
   * --------------------------------------------------------
   */

  const session = sessions.get(req.auth.sessionId);

  /*
   * --------------------------------------------------------
   * Session may already be revoked or expired.
   * --------------------------------------------------------
   *
   * Logout should generally be idempotent.
   *
   * Calling logout twice should not produce an error such
   * as "session does not exist".
   *
   * --------------------------------------------------------
   */

  if (session) {
    session.revoked = true;

    session.revokedAt = new Date();

    sessions.set(session.id, session);
  }

  /*
   * --------------------------------------------------------
   * Clear authentication cookie
   * --------------------------------------------------------
   *
   * If refresh tokens are stored in HttpOnly cookies:
   *
   *     res.clearCookie(...)
   *
   *
   * Cookie attributes must match the cookie configuration.
   * --------------------------------------------------------
   */

  res.clearCookie("refreshToken", {
    httpOnly: true,

    secure: true,

    sameSite: "strict",

    path: "/api/v1/auth",
  });

  /*
   * --------------------------------------------------------
   * SUCCESS
   * --------------------------------------------------------
   */

  return res.status(204).send();
});

/*
 * ============================================================
 * 3. LOGOUT USING A REFRESH TOKEN
 * ============================================================
 *
 * Another common architecture:
 *
 *
 * POST /api/v1/auth/logout
 *
 * Body:
 *
 * {
 *   "refreshToken": "..."
 * }
 *
 *
 * Server:
 *
 *     hash refresh token
 *            ↓
 *     find token/session
 *            ↓
 *     revoke session
 *
 *
 * The server should NOT need to store the raw refresh token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. HASH REFRESH TOKEN
 * ============================================================
 *
 * Refresh tokens are credentials.
 *
 * Treat them like sensitive secrets.
 *
 * Instead of storing:
 *
 *     refreshToken: "eyJ..."
 *
 *
 * store something like:
 *
 *     refreshTokenHash: "..."
 *
 *
 * Then hash the presented token and compare/find it.
 *
 * ============================================================
 */

import crypto from "node:crypto";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
 * ============================================================
 * 5. REVOCATION
 * ============================================================
 */

function revokeSession(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    return;
  }

  session.revoked = true;

  session.revokedAt = new Date();

  sessions.set(sessionId, session);
}

/*
 * ============================================================
 * 6. LOGOUT ALL DEVICES
 * ============================================================
 *
 * A user may be logged in on:
 *
 *
 *     Laptop
 *     Phone
 *     Tablet
 *     Browser
 *
 *
 * "Logout" normally means:
 *
 *     logout current session
 *
 *
 * "Logout all devices" means:
 *
 *     revoke every active session belonging to the user.
 *
 * ============================================================
 */

function logoutAllDevices(userId) {
  for (const session of sessions.values()) {
    if (session.userId === userId) {
      session.revoked = true;

      session.revokedAt = new Date();
    }
  }
}

/*
 * ============================================================
 * 7. CURRENT SESSION VS ALL SESSIONS
 * ============================================================
 *
 *
 * POST /auth/logout
 *
 *     ↓
 *
 * revoke current session
 *
 *
 *
 * POST /auth/logout-all
 *
 *     ↓
 *
 * revoke all user sessions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. LOGOUT-ALL ROUTE
 * ============================================================
 */

app.post("/api/v1/auth/logout-all", authenticate, async (req, res) => {
  logoutAllDevices(req.auth.userId);

  /*
   * Clear current refresh-token cookie too.
   */

  res.clearCookie("refreshToken", {
    httpOnly: true,

    secure: true,

    sameSite: "strict",

    path: "/api/v1/auth",
  });

  return res.status(204).send();
});

/*
 * ============================================================
 * 9. JWT LOGOUT PROBLEM
 * ============================================================
 *
 * Suppose:
 *
 *     Access Token
 *
 * is a self-contained JWT.
 *
 *
 * Server verifies:
 *
 *     signature
 *     expiration
 *
 *
 * After logout:
 *
 *     token may still technically be valid until exp.
 *
 *
 * Therefore:
 *
 *
 * LOGOUT
 *    ↓
 * revoke refresh session
 *
 *
 * does not necessarily mean:
 *
 *    instantly invalidate every already-issued access JWT.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. ACCESS TOKEN SHORT LIFETIME
 * ============================================================
 *
 * A common architecture is:
 *
 *
 * Access token:
 *
 *     short-lived
 *
 *
 * Refresh token:
 *
 *     longer-lived
 *
 *
 * Example conceptual lifetime:
 *
 *
 *     Access token
 *         ↓
 *     minutes
 *
 *
 *     Refresh token
 *         ↓
 *     days/weeks
 *
 *
 * Exact values depend on your threat model and application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. TOKEN ROTATION
 * ============================================================
 *
 * A stronger refresh-token architecture uses rotation.
 *
 *
 * Initial:
 *
 *     RT1
 *
 *
 * Refresh:
 *
 *     RT1 → RT2
 *
 *
 * Refresh:
 *
 *     RT2 → RT3
 *
 *
 * RT1 becomes invalid after being used.
 *
 *
 * If an old refresh token is reused unexpectedly, the server
 * can treat this as a potential token theft/replay signal and
 * revoke the associated token family/session.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. TOKEN FAMILY
 * ============================================================
 *
 * Example:
 *
 *
 * Session A
 *
 *     RT1
 *      ↓
 *     RT2
 *      ↓
 *     RT3
 *      ↓
 *     RT4
 *
 *
 * These tokens belong to the same refresh-token family.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. COOKIE-BASED REFRESH TOKEN
 * ============================================================
 *
 * If using cookies, important attributes include:
 *
 *
 *     HttpOnly
 *
 * Prevents normal JavaScript from reading the cookie.
 *
 *
 *     Secure
 *
 * Sends the cookie over HTTPS.
 *
 *
 *     SameSite
 *
 * Helps control cross-site cookie sending.
 *
 *
 *     Path
 *
 * Limits where the cookie is sent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. DO NOT LOG TOKENS
 * ============================================================
 *
 * Avoid:
 *
 *
 *     console.log(accessToken);
 *
 *
 *     console.log(refreshToken);
 *
 *
 *     logger.info({
 *       token,
 *     });
 *
 *
 * Tokens are credentials.
 *
 * Logging them creates a serious secret-leak risk.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. LOGOUT IS NOT "DELETE USER"
 * ============================================================
 *
 * Logout:
 *
 *     revoke authentication state
 *
 *
 * Account deletion:
 *
 *     permanently remove/deactivate account according to
 *     application policy.
 *
 *
 * They are completely different operations.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. LOGOUT IDEMPOTENCY
 * ============================================================
 *
 * Good:
 *
 *
 *     first logout → 204
 *
 *     second logout → 204
 *
 *
 * The client should not need to know whether the session was
 * already revoked.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. REDIS ARCHITECTURE
 * ============================================================
 *
 * Since your later roadmap includes Redis, a production
 * authentication system can use Redis for session/token state.
 *
 *
 * Example:
 *
 *
 *     Redis
 *       │
 *       └── auth:session:<sessionId>
 *
 *
 * Value:
 *
 *     {
 *       userId,
 *       tokenFamilyId,
 *       revoked,
 *       expiresAt
 *     }
 *
 *
 * TTL can automatically remove expired session records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. DATABASE ARCHITECTURE
 * ============================================================
 *
 * Another approach is an authentication-session collection:
 *
 *
 * AuthSession
 * ├── userId
 * ├── tokenHash
 * ├── tokenFamilyId
 * ├── expiresAt
 * ├── revokedAt
 * ├── createdAt
 * └── lastUsedAt
 *
 *
 * MongoDB TTL indexes can be useful for expiration cleanup.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. COMPLETE AUTHENTICATION LIFECYCLE
 * ============================================================
 *
 *
 * REGISTER
 *      ↓
 * USER CREATED
 *      ↓
 * EMAIL VERIFIED
 *      ↓
 * LOGIN
 *      ↓
 * ACCESS TOKEN
 *      +
 * REFRESH TOKEN
 *      ↓
 * API REQUESTS
 *      ↓
 * ACCESS TOKEN EXPIRES
 *      ↓
 * REFRESH
 *      ↓
 * NEW ACCESS TOKEN
 *      ↓
 * LOGOUT
 *      ↓
 * REVOKE SESSION
 *      ↓
 * CLEAR COOKIE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. AUTHENTICATION DIRECTORY
 * ============================================================
 *
 * 20_authentication/
 *
 * ├── register/
 * │
 * ├── login/
 * │
 * ├── logout/
 * │   └── logout.js
 * │
 * ├── access_token/
 * │
 * ├── refresh_token/
 * │
 * ├── password_reset/
 * │
 * └── email_verification/
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Logout server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Logout should invalidate authentication state.
 *
 * 2. Revoke the current refresh-token session.
 *
 * 3. Clear refresh-token cookies when cookies are used.
 *
 * 4. Don't store raw refresh tokens unnecessarily.
 *
 * 5. Don't log access or refresh tokens.
 *
 * 6. Logout should generally be idempotent.
 *
 * 7. "Logout" and "logout all devices" are different operations.
 *
 * 8. A self-contained JWT may remain valid until expiration
 *    unless you introduce a revocation mechanism.
 *
 * 9. Refresh-token rotation provides stronger replay protection.
 *
 * 10. Redis or a database can maintain server-side session
 *     state.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/access_token/
 *
 * We will build:
 *
 *     JWT creation
 *     JWT claims
 *     signing
 *     expiration
 *     Authorization: Bearer
 *     access-token middleware
 *
 * ============================================================
 */
