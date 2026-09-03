/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/refresh_token/refresh_token.js
 *
 * Topic:
 *     Refresh Tokens
 *
 * ============================================================
 *
 * WHY REFRESH TOKENS?
 *
 * Access tokens should generally be short-lived.
 *
 * Example:
 *
 *     Access Token
 *         ↓
 *       15 min
 *
 *
 * If the access token expires, we don't want the user to log
 * in again every 15 minutes.
 *
 * Instead:
 *
 *     Refresh Token
 *         ↓
 *     request new access token
 *
 * ============================================================
 *
 * BASIC FLOW
 *
 * LOGIN
 *   ↓
 * Access Token + Refresh Token
 *   ↓
 * Access Token expires
 *   ↓
 * Client sends Refresh Token
 *   ↓
 * Server validates Refresh Token
 *   ↓
 * Revoke old Refresh Token
 *   ↓
 * Generate new Refresh Token
 *   ↓
 * Generate new Access Token
 *
 * This is called:
 *
 *     Refresh Token Rotation
 *
 * ============================================================
 */

import express from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 *
 * In production these values belong in environment variables
 * or a proper secret-management system.
 *
 * ============================================================
 */

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "development-access-secret";

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "development-refresh-secret";

const JWT_ISSUER = "nodejs-mastery-api";

const JWT_AUDIENCE = "nodejs-mastery-client";

const ACCESS_TOKEN_EXPIRES_IN = "15m";

const REFRESH_TOKEN_EXPIRES_IN = "30d";

/*
 * ============================================================
 * TEMPORARY REFRESH SESSION STORE
 * ============================================================
 *
 * In production this can be:
 *
 *     Redis
 *     MongoDB
 *     PostgreSQL
 *
 * We intentionally keep server-side state because refresh
 * tokens are credentials that need revocation/rotation.
 *
 * ============================================================
 */

const refreshSessions = new Map();

/*
 * ============================================================
 * SESSION MODEL
 * ============================================================
 *
 * Example:
 *
 * {
 *   id,
 *   userId,
 *   tokenFamilyId,
 *   tokenHash,
 *   expiresAt,
 *   revokedAt,
 *   createdAt
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * HASH REFRESH TOKEN
 * ============================================================
 *
 * We don't need to store the raw refresh token.
 *
 * Instead:
 *
 *     raw token
 *          ↓
 *      SHA-256
 *          ↓
 *     tokenHash
 *
 * ============================================================
 */

function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
 * ============================================================
 * 1. CREATE ACCESS TOKEN
 * ============================================================
 */

function createAccessToken(user, sessionId) {
  const payload = {
    /*
     * Subject = user ID
     */

    sub: user.id,

    /*
     * Authorization data.
     *
     * Keep this minimal.
     */

    roles: user.roles,

    /*
     * Session identifier allows the token to be associated
     * with an authentication session if required.
     */

    sid: sessionId,
  };

  return jwt.sign(
    payload,

    JWT_ACCESS_SECRET,

    {
      algorithm: "HS256",

      expiresIn: ACCESS_TOKEN_EXPIRES_IN,

      issuer: JWT_ISSUER,

      audience: JWT_AUDIENCE,

      jwtid: crypto.randomUUID(),
    },
  );
}

/*
 * ============================================================
 * 2. CREATE REFRESH TOKEN
 * ============================================================
 *
 * We use a random opaque token rather than putting lots of
 * information inside a JWT.
 *
 * Example:
 *
 *     random bytes
 *          ↓
 *     base64url
 *          ↓
 *     refresh token
 *
 * ============================================================
 */

function createRefreshToken() {
  return crypto.randomBytes(64).toString("base64url");
}

/*
 * ============================================================
 * 3. CREATE REFRESH SESSION
 * ============================================================
 */

function createRefreshSession(userId) {
  const sessionId = crypto.randomUUID();

  const tokenFamilyId = crypto.randomUUID();

  const refreshToken = createRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const session = {
    id: sessionId,

    userId,

    tokenFamilyId,

    tokenHash,

    expiresAt,

    revokedAt: null,

    createdAt: new Date(),

    lastUsedAt: null,
  };

  refreshSessions.set(sessionId, session);

  return {
    session,
    refreshToken,
  };
}

/*
 * ============================================================
 * 4. LOGIN SIMULATION
 * ============================================================
 *
 * In the real application:
 *
 *     login
 *       ↓
 *     verify password
 *       ↓
 *     createRefreshSession()
 *       ↓
 *     createAccessToken()
 *
 * ============================================================
 */

const demoUser = {
  id: "user-123",

  email: "shiva@example.com",

  roles: ["user"],
};

/*
 * ============================================================
 * LOGIN ENDPOINT
 * ============================================================
 */

app.post("/api/v1/auth/login", (req, res) => {
  /*
   * IMPORTANT:
   *
   * This endpoint is simplified.
   *
   * Real implementation must verify the user's credentials
   * before creating tokens.
   */

  const { session, refreshToken } = createRefreshSession(demoUser.id);

  const accessToken = createAccessToken(demoUser, session.id);

  /*
   * --------------------------------------------------------
   * REFRESH TOKEN COOKIE
   * --------------------------------------------------------
   *
   * A common browser architecture stores refresh tokens in
   * an HttpOnly + Secure cookie.
   *
   * --------------------------------------------------------
   */

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,

    secure: true,

    sameSite: "strict",

    path: "/api/v1/auth",

    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return res.status(200).json({
    data: {
      accessToken,

      tokenType: "Bearer",

      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

/*
 * ============================================================
 * 5. REFRESH TOKEN ENDPOINT
 * ============================================================
 *
 * POST /api/v1/auth/refresh
 *
 * ============================================================
 */

app.post("/api/v1/auth/refresh", async (req, res) => {
  try {
    /*
     * ------------------------------------------------------
     * READ REFRESH TOKEN
     * ------------------------------------------------------
     *
     * If using cookies:
     *
     *     req.cookies.refreshToken
     *
     *
     * For this example we allow a request body too.
     *
     * ------------------------------------------------------
     */

    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    /*
     * ------------------------------------------------------
     * TOKEN REQUIRED
     * ------------------------------------------------------
     */

    if (typeof refreshToken !== "string") {
      return res.status(401).json({
        error: {
          code: "REFRESH_TOKEN_REQUIRED",

          message: "Refresh token required",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * HASH PRESENTED TOKEN
     * ------------------------------------------------------
     */

    const tokenHash = hashRefreshToken(refreshToken);

    /*
     * ------------------------------------------------------
     * FIND SESSION
     * ------------------------------------------------------
     *
     * Our temporary Map is keyed by session ID, so we search
     * through the sessions.
     *
     * A production database should index tokenHash.
     * ------------------------------------------------------
     */

    let session = null;

    for (const candidate of refreshSessions.values()) {
      if (candidate.tokenHash === tokenHash) {
        session = candidate;

        break;
      }
    }

    /*
     * ------------------------------------------------------
     * INVALID TOKEN
     * ------------------------------------------------------
     */

    if (!session) {
      return res.status(401).json({
        error: {
          code: "INVALID_REFRESH_TOKEN",

          message: "Invalid refresh token",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * CHECK REVOCATION
     * ------------------------------------------------------
     */

    if (session.revokedAt) {
      /*
       * ----------------------------------------------------
       * REUSE DETECTION
       * ----------------------------------------------------
       *
       * A previously rotated refresh token was used again.
       *
       * This may indicate token theft/replay.
       *
       * A strong response is to revoke the entire token
       * family.
       *
       * ----------------------------------------------------
       */

      revokeTokenFamily(session.tokenFamilyId);

      return res.status(401).json({
        error: {
          code: "REFRESH_TOKEN_REUSE_DETECTED",

          message: "Refresh token is no longer valid",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * CHECK EXPIRATION
     * ------------------------------------------------------
     */

    if (session.expiresAt <= new Date()) {
      session.revokedAt = new Date();

      refreshSessions.set(session.id, session);

      return res.status(401).json({
        error: {
          code: "REFRESH_TOKEN_EXPIRED",

          message: "Refresh token expired",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * GET USER
     * ------------------------------------------------------
     *
     * Real application:
     *
     *     const user =
     *       await User.findById(
     *         session.userId,
     *       );
     *
     * ------------------------------------------------------
     */

    const user = {
      id: session.userId,

      roles: ["user"],
    };

    /*
     * ------------------------------------------------------
     * ROTATE REFRESH TOKEN
     * ------------------------------------------------------
     *
     * Old token becomes invalid.
     *
     * New token replaces it.
     * ------------------------------------------------------
     */

    session.revokedAt = new Date();

    session.lastUsedAt = new Date();

    refreshSessions.set(session.id, session);

    /*
     * Create new refresh token.
     */

    const newRefreshToken = createRefreshToken();

    const newTokenHash = hashRefreshToken(newRefreshToken);

    /*
     * ------------------------------------------------------
     * CREATE NEW SESSION RECORD
     * ------------------------------------------------------
     *
     * Keep the same token family.
     *
     * ------------------------------------------------------
     */

    const newSessionId = crypto.randomUUID();

    const newSession = {
      id: newSessionId,

      userId: session.userId,

      tokenFamilyId: session.tokenFamilyId,

      tokenHash: newTokenHash,

      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),

      revokedAt: null,

      createdAt: new Date(),

      lastUsedAt: null,
    };

    refreshSessions.set(newSessionId, newSession);

    /*
     * ------------------------------------------------------
     * CREATE NEW ACCESS TOKEN
     * ------------------------------------------------------
     */

    const newAccessToken = createAccessToken(user, newSessionId);

    /*
     * ------------------------------------------------------
     * REPLACE COOKIE
     * ------------------------------------------------------
     */

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,

      secure: true,

      sameSite: "strict",

      path: "/api/v1/auth",

      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    /*
     * ------------------------------------------------------
     * RESPONSE
     * ------------------------------------------------------
     */

    return res.status(200).json({
      data: {
        accessToken: newAccessToken,

        tokenType: "Bearer",

        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",

        message: "Something went wrong",
      },
    });
  }
});

/*
 * ============================================================
 * 6. REVOKE TOKEN FAMILY
 * ============================================================
 *
 * Example token family:
 *
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
 * If RT2 is reused after rotation:
 *
 *
 *     attacker ──→ RT2
 *
 *
 * We can revoke:
 *
 *     RT2
 *     RT3
 *     RT4
 *
 * and terminate the authentication session/family.
 *
 * ============================================================
 */

function revokeTokenFamily(tokenFamilyId) {
  const now = new Date();

  for (const session of refreshSessions.values()) {
    if (session.tokenFamilyId === tokenFamilyId) {
      session.revokedAt = now;

      refreshSessions.set(session.id, session);
    }
  }
}

/*
 * ============================================================
 * 7. LOGOUT
 * ============================================================
 *
 * Logout should revoke the refresh session.
 *
 * The access token may remain valid until it expires if the
 * architecture does not maintain immediate access-token
 * revocation.
 *
 * ============================================================
 */

app.post("/api/v1/auth/logout", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (typeof refreshToken === "string") {
    const tokenHash = hashRefreshToken(refreshToken);

    for (const session of refreshSessions.values()) {
      if (session.tokenHash === tokenHash) {
        session.revokedAt = new Date();

        refreshSessions.set(session.id, session);

        break;
      }
    }
  }

  /*
   * Clear browser cookie.
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
 * 8. REFRESH TOKEN ROTATION
 * ============================================================
 *
 * Without rotation:
 *
 *
 *     RT1
 *      │
 *      ├── refresh → AT2
 *      │
 *      └── refresh → AT3
 *
 *
 * RT1 may remain valid.
 *
 *
 * With rotation:
 *
 *
 *     RT1
 *      │
 *      ▼
 *     RT2
 *      │
 *      ▼
 *     RT3
 *
 *
 * After RT1 is used:
 *
 *     RT1 = revoked
 *
 *
 * After RT2 is used:
 *
 *     RT2 = revoked
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. REPLAY ATTACK
 * ============================================================
 *
 * Suppose:
 *
 *
 * User receives:
 *
 *     RT1
 *
 *
 * Attacker steals:
 *
 *     RT1
 *
 *
 * User refreshes:
 *
 *
 *     RT1 → RT2
 *
 *
 * Therefore:
 *
 *
 *     RT1 = revoked
 *
 *
 * Attacker later tries:
 *
 *
 *     RT1 → ???
 *
 *
 * Server sees:
 *
 *
 *     revoked token reused
 *
 *
 * This can indicate token theft.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. TOKEN FAMILY
 * ============================================================
 *
 * Every refresh-token chain belongs to a family.
 *
 *
 * Example:
 *
 *
 * Family A
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
 * If reuse is detected:
 *
 *
 *     revokeTokenFamily()
 *
 *
 * can invalidate the complete family.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. REFRESH TOKEN STORAGE
 * ============================================================
 *
 * Avoid storing:
 *
 *
 *     {
 *       refreshToken: "raw-token"
 *     }
 *
 *
 * Prefer:
 *
 *
 *     {
 *       tokenHash: "hash",
 *       userId: "...",
 *       tokenFamilyId: "...",
 *       expiresAt: "...",
 *       revokedAt: null
 *     }
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. MONGODB MODEL
 * ============================================================
 *
 * A production Mongoose model could conceptually look like:
 *
 *
 * AuthSession
 *
 *     userId
 *     tokenHash
 *     tokenFamilyId
 *     expiresAt
 *     revokedAt
 *     createdAt
 *     lastUsedAt
 *
 *
 * Useful indexes:
 *
 *
 *     tokenHash
 *
 *     userId
 *
 *     tokenFamilyId
 *
 *     expiresAt
 *
 *
 * An appropriate TTL strategy can remove expired records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. REDIS MODEL
 * ============================================================
 *
 * Redis is useful when authentication state needs very fast
 * lookup and expiration.
 *
 *
 * Example:
 *
 *
 *     auth:refresh:<tokenHash>
 *
 *
 * Value:
 *
 *
 * {
 *   userId,
 *   sessionId,
 *   tokenFamilyId,
 *   expiresAt
 * }
 *
 *
 * Redis TTL automatically expires the key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. COOKIE ARCHITECTURE
 * ============================================================
 *
 * Browser:
 *
 *
 *     Access Token
 *          │
 *          └── memory / appropriate client storage
 *
 *
 *     Refresh Token
 *          │
 *          └── HttpOnly Secure cookie
 *
 *
 *
 * HttpOnly means normal browser JavaScript cannot read the
 * refresh-token cookie.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. WHY NOT KEEP ACCESS TOKEN FOR 30 DAYS?
 * ============================================================
 *
 * Consider:
 *
 *
 *     Access token = 30 days
 *
 *
 * If stolen:
 *
 *     attacker may use it for a long time.
 *
 *
 * Instead:
 *
 *
 *     Access token = short-lived
 *
 *     Refresh token = longer-lived
 *
 *
 * This limits the lifetime of a stolen access token while
 * maintaining a good user experience.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. ACCESS TOKEN + REFRESH TOKEN
 * ============================================================
 *
 *
 *                    LOGIN
 *                      │
 *             ┌────────┴────────┐
 *             ▼                 ▼
 *       Access Token       Refresh Token
 *          short               long
 *             │                 │
 *             ▼                 ▼
 *        API requests       refresh endpoint
 *             │                 │
 *             │                 ▼
 *             │           rotate token
 *             │                 │
 *             │                 ▼
 *             │           new access token
 *             │
 *             ▼
 *           API
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. IMPORTANT DIFFERENCE
 * ============================================================
 *
 * ACCESS TOKEN
 *
 *     Purpose:
 *         access protected resources
 *
 *     Lifetime:
 *         short
 *
 *     Sent:
 *         API requests
 *
 *
 * REFRESH TOKEN
 *
 *     Purpose:
 *         obtain a new access token
 *
 *     Lifetime:
 *         longer
 *
 *     Sent:
 *         refresh endpoint
 *
 *     Storage:
 *         preferably protected from JavaScript in browser
 *         architectures where cookies are appropriate
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. STATUS CODES
 * ============================================================
 *
 * 200
 *     Refresh successful.
 *
 *
 * 401
 *     Missing/invalid/expired/revoked refresh token.
 *
 *
 * 403
 *     Usually authorization-related rather than token
 *     authentication failure.
 *
 *
 * 429
 *     Rate limited.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. SECURITY CHECKLIST
 * ============================================================
 *
 * ✓ Use HTTPS.
 *
 * ✓ Generate refresh tokens using cryptographically secure
 *   randomness.
 *
 * ✓ Don't store raw refresh tokens unnecessarily.
 *
 * ✓ Hash refresh tokens before persistence.
 *
 * ✓ Rotate refresh tokens.
 *
 * ✓ Detect refresh-token reuse.
 *
 * ✓ Revoke the token family on detected replay where
 *   appropriate.
 *
 * ✓ Give refresh tokens an expiration.
 *
 * ✓ Protect cookies with HttpOnly/Secure/SameSite where cookies
 *   are used.
 *
 * ✓ Don't log refresh tokens.
 *
 * ✓ Rate-limit authentication endpoints.
 *
 * ✓ Keep signing keys/secrets outside source code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 *                 AUTH SERVICE
 *                      │
 *                      ▼
 *               Verify credentials
 *                      │
 *             ┌────────┴────────┐
 *             ▼                 ▼
 *        Access Token      Refresh Session
 *             │                 │
 *             ▼                 ▼
 *          Client             Redis/DB
 *             │                 │
 *             │                 │
 *             ▼                 │
 *       Protected API            │
 *                                 │
 *             Access expires      │
 *                    │            │
 *                    ▼            │
 *             POST /refresh ─────┘
 *                    │
 *                    ▼
 *              validate RT
 *                    │
 *                    ▼
 *              rotate RT
 *                    │
 *                    ▼
 *              new AT + RT
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Refresh-token server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Refresh tokens allow users to obtain new access tokens
 *    without logging in repeatedly.
 *
 * 2. Access tokens should generally be short-lived.
 *
 * 3. Refresh tokens should be treated as sensitive credentials.
 *
 * 4. Store a hash of an opaque refresh token rather than the
 *    raw token when server-side persistence is needed.
 *
 * 5. Refresh-token rotation invalidates the previous token.
 *
 * 6. Token families allow replay/reuse detection.
 *
 * 7. Reuse of a revoked refresh token can indicate token theft.
 *
 * 8. A compromised token family can be revoked.
 *
 * 9. Redis or MongoDB can store refresh-session state.
 *
 * 10. Logout should revoke the refresh session and clear the
 *     refresh-token cookie where applicable.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/password_reset/
 *
 * We will cover:
 *
 *     forgot password
 *     reset token generation
 *     token hashing
 *     token expiration
 *     password replacement
 *     invalidating existing sessions
 *
 * ============================================================
 */
