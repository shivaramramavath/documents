/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/refresh_token.js
 *
 * Topic:
 * Access Token + Refresh Token
 *
 * ============================================================
 *
 * Install:
 *
 *     npm install jsonwebtoken
 *
 * Run:
 *
 *     node .\14_jwt\refresh_token.js
 *
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 1. Secrets
 * ============================================================
 *
 * Learning only.
 *
 * In production, use environment variables or a proper
 * secret/key management system.
 *
 * Example:
 *
 *     process.env.ACCESS_TOKEN_SECRET
 *     process.env.REFRESH_TOKEN_SECRET
 *
 * ============================================================
 */

const ACCESS_TOKEN_SECRET = "access-secret-learning-only";

const REFRESH_TOKEN_SECRET = "refresh-secret-learning-only";

/*
 * ============================================================
 * 2. User
 * ============================================================
 *
 * Normally this information comes from MongoDB/database.
 * ============================================================
 */

const user = {
  id: "user_123",
  email: "shiva@example.com",
  role: "user",
};

/*
 * ============================================================
 * 3. Access Token
 * ============================================================
 *
 * Access tokens should generally be short-lived.
 *
 * Example:
 *
 *     15 minutes
 *
 *
 * They are sent with API requests.
 *
 * ============================================================
 */

function createAccessToken(user) {
  return jwt.sign(
    {
      /*
       * `sub` = subject
       *
       * Usually the user ID.
       */
      sub: user.id,

      /*
       * Application-specific claim.
       */
      role: user.role,
    },

    ACCESS_TOKEN_SECRET,

    {
      /*
       * Access token lifetime.
       */
      expiresIn: "15m",

      /*
       * Identify the service that issued the token.
       */
      issuer: "my-auth-service",

      /*
       * Identify the intended API.
       */
      audience: "my-api",
    },
  );
}

/*
 * ============================================================
 * 4. Refresh Token
 * ============================================================
 *
 * Refresh tokens are used to obtain new access tokens.
 *
 * They normally have a much longer lifetime.
 *
 * Example:
 *
 *     7 days
 *
 *     30 days
 *
 *     etc.
 *
 * ============================================================
 */

function createRefreshToken(user) {
  return jwt.sign(
    {
      /*
       * Keep the refresh-token payload minimal.
       */
      sub: user.id,
    },

    REFRESH_TOKEN_SECRET,

    {
      expiresIn: "7d",

      issuer: "my-auth-service",

      audience: "my-refresh-endpoint",
    },
  );
}

/*
 * ============================================================
 * 5. Generate tokens after login
 * ============================================================
 */

const accessToken = createAccessToken(user);

const refreshToken = createRefreshToken(user);

console.log("Access Token:");
console.log(accessToken);

console.log("\nRefresh Token:");
console.log(refreshToken);

/*
 * ============================================================
 * 6. Why two tokens?
 * ============================================================
 *
 *
 * Without refresh tokens:
 *
 *
 * Access Token
 *     │
 *     └── 7 days
 *
 *
 * If stolen:
 *
 *     attacker potentially has a long-lived credential.
 *
 *
 *
 * With refresh tokens:
 *
 *
 * Access Token
 *     │
 *     └── 15 minutes
 *
 *
 * Refresh Token
 *     │
 *     └── 7 days
 *
 *
 * The access token is used frequently.
 *
 * The refresh token is used only to obtain a new access token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Verify access token
 * ============================================================
 */

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET, {
    issuer: "my-auth-service",
    audience: "my-api",
  });
}

/*
 * ============================================================
 * 8. Verify refresh token
 * ============================================================
 */

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET, {
    issuer: "my-auth-service",
    audience: "my-refresh-endpoint",
  });
}

/*
 * ============================================================
 * 9. Verify the access token
 * ============================================================
 */

try {
  const decodedAccessToken = verifyAccessToken(accessToken);

  console.log("\nAccess token verified:");

  console.log(decodedAccessToken);
} catch (error) {
  console.error("\nAccess token verification failed:", error.message);
}

/*
 * ============================================================
 * 10. Verify the refresh token
 * ============================================================
 */

try {
  const decodedRefreshToken = verifyRefreshToken(refreshToken);

  console.log("\nRefresh token verified:");

  console.log(decodedRefreshToken);
} catch (error) {
  console.error("\nRefresh token verification failed:", error.message);
}

/*
 * ============================================================
 * 11. Refresh flow
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ access token
 *   ▼
 * API
 *   │
 *   ├── valid ───────► request succeeds
 *   │
 *   └── expired
 *          │
 *          ▼
 *    refresh endpoint
 *          │
 *          │ refresh token
 *          ▼
 *     verify refresh token
 *          │
 *          ▼
 *     create new access token
 *          │
 *          ▼
 *        Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Refresh access token
 * ============================================================
 */

function refreshAccessToken(refreshToken) {
  /*
   * Verify the refresh token FIRST.
   */
  const decoded = verifyRefreshToken(refreshToken);

  /*
   * The subject identifies the user.
   */
  const userId = decoded.sub;

  /*
   * In a real application, you may query the database here.
   *
   * Example:
   *
   *     const user = await User.findById(userId);
   *
   *
   * You can check:
   *
   *     - user exists
   *     - account active
   *     - refresh token/session still valid
   *     - token family not revoked
   */

  /*
   * For this learning example:
   */
  const user = {
    id: userId,
    role: "user",
  };

  /*
   * Create a NEW access token.
   */
  return createAccessToken(user);
}

try {
  const newAccessToken = refreshAccessToken(refreshToken);

  console.log("\nNew access token:");

  console.log(newAccessToken);
} catch (error) {
  console.error("\nRefresh failed:", error.message);
}

/*
 * ============================================================
 * 13. Refresh tokens should NOT be used for normal API calls
 * ============================================================
 *
 * WRONG:
 *
 *     GET /users
 *
 *     Authorization: Bearer <refresh-token>
 *
 *
 * Generally:
 *
 *     API requests
 *          ↓
 *     Access Token
 *
 *
 *     Token refresh
 *          ↓
 *     Refresh Token
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Refresh endpoint
 * ============================================================
 *
 * Conceptual Express endpoint:
 *
 *
 *     POST /auth/refresh
 *
 *
 * Client sends:
 *
 *     refresh token
 *
 *
 * Server:
 *
 *     1. Extract refresh token
 *     2. Verify signature
 *     3. Check expiration
 *     4. Validate issuer/audience
 *     5. Check token/session state
 *     6. Create new access token
 *     7. Optionally rotate refresh token
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Refresh Token Rotation
 * ============================================================
 *
 * A stronger design is:
 *
 *
 *     Old Refresh Token
 *            │
 *            ▼
 *         /refresh
 *            │
 *            ▼
 *     Verify + consume
 *            │
 *       ┌────┴────┐
 *       ▼         ▼
 *   New Access  New Refresh
 *      Token       Token
 *
 *
 * The old refresh token is no longer accepted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Why rotation?
 * ============================================================
 *
 * Imagine:
 *
 *     Refresh Token A
 *
 * gets stolen.
 *
 *
 * Client uses:
 *
 *     Token A
 *
 *
 * Server returns:
 *
 *     Access Token B
 *     Refresh Token C
 *
 *
 * Token A is now considered used/replaced.
 *
 *
 * If an attacker later tries to use Token A again,
 * the server can detect reuse.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Refresh token database
 * ============================================================
 *
 * In a production application, you generally need server-side
 * state for robust refresh-token management.
 *
 *
 * Example MongoDB document:
 *
 *
 * {
 *   userId: "user_123",
 *   tokenId: "refresh_abc",
 *   tokenHash: "...",
 *   familyId: "family_xyz",
 *   expiresAt: "...",
 *   revokedAt: null
 * }
 *
 *
 * IMPORTANT:
 *
 * Don't necessarily store raw refresh tokens in your database.
 *
 * A common design is to store a hash/fingerprint that allows
 * the server to identify and revoke the credential.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Refresh Token ID
 * ============================================================
 *
 * A JWT can have a `jti` claim.
 *
 * `jti` = JWT ID.
 *
 *
 * Example:
 *
 *     jti: "refresh_123"
 *
 *
 * This gives the server an identifier for the token.
 *
 * ============================================================
 */

function createRefreshTokenWithId(user) {
  const tokenId = `refresh_${cryptoRandomId()}`;

  return jwt.sign(
    {
      sub: user.id,
    },

    REFRESH_TOKEN_SECRET,

    {
      expiresIn: "7d",
      jwtid: tokenId,
      issuer: "my-auth-service",
      audience: "my-refresh-endpoint",
    },
  );
}

/*
 * ============================================================
 * 19. Simple random ID for demonstration
 * ============================================================
 *
 * In our dedicated crypto lessons we'll use Node's `crypto`
 * module properly.
 *
 * ============================================================
 */

function cryptoRandomId() {
  return Math.random().toString(36).slice(2);
}

const refreshTokenWithId = createRefreshTokenWithId(user);

console.log("\nRefresh token with jti:");

console.log(refreshTokenWithId);

console.log("\nDecoded refresh token:");

console.log(jwt.decode(refreshTokenWithId));

/*
 * ============================================================
 * 20. Token family
 * ============================================================
 *
 * Refresh-token rotation can use a token family.
 *
 *
 * Login:
 *
 *     Family A
 *        │
 *        ▼
 *     Token A
 *        │
 *      refresh
 *        ▼
 *     Token B
 *        │
 *      refresh
 *        ▼
 *     Token C
 *
 *
 * All tokens belong to the same family.
 *
 *
 * If reuse of an old token is detected:
 *
 *
 *     Token A reused
 *          │
 *          ▼
 *     Suspicious activity
 *          │
 *          ▼
 *     Revoke family
 *
 *
 * This can invalidate the attacker's refresh-token chain and
 * the legitimate session associated with that family.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Refresh token revocation
 * ============================================================
 *
 * JWTs are normally self-contained.
 *
 * Once signed, they don't automatically disappear from the
 * world when you want to revoke them.
 *
 *
 * Therefore refresh-token systems commonly maintain server-side
 * state.
 *
 *
 * Example:
 *
 *
 *     Logout
 *       │
 *       ▼
 *     Revoke refresh session
 *       │
 *       ▼
 *     Refresh request
 *       │
 *       ▼
 *     Rejected
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Access-token revocation
 * ============================================================
 *
 * Short-lived access tokens are often allowed to naturally
 * expire instead of maintaining a database lookup for every
 * request.
 *
 *
 * If immediate revocation is required, the architecture may
 * introduce additional mechanisms such as:
 *
 *     - token denylist
 *     - session state
 *     - token version
 *     - introspection
 *
 *
 * There is a performance/security trade-off.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Browser storage
 * ============================================================
 *
 * For browser applications, token storage requires careful
 * security design.
 *
 *
 * A common approach is to use secure cookies with attributes
 * such as:
 *
 *     HttpOnly
 *     Secure
 *     SameSite
 *
 *
 * The exact design depends on your frontend architecture,
 * CSRF strategy, domain structure, and deployment.
 *
 *
 * We'll cover secure cookies and CSRF later in:
 *
 *     25_security/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Don't put refresh tokens in URLs
 * ============================================================
 *
 * DON'T:
 *
 *     /auth/refresh?token=VERY_SECRET_TOKEN
 *
 *
 * Tokens in URLs can leak through:
 *
 *     - logs
 *     - browser history
 *     - analytics
 *     - referrer-related mechanisms
 *
 *
 * Use an appropriate request mechanism instead.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Access vs Refresh Token
 * ============================================================
 *
 *
 * ┌──────────────────┬──────────────────────────────┐
 * │ Access Token     │ Refresh Token                │
 * ├──────────────────┼──────────────────────────────┤
 * │ Short-lived      │ Longer-lived                 │
 * │ API requests     │ Token renewal                │
 * │ Sent frequently  │ Sent less frequently         │
 * │ JWT              │ JWT or opaque token           │
 * │ Usually stateless│ Usually server-managed       │
 * └──────────────────┴──────────────────────────────┘
 *
 *
 * The refresh token does NOT have to be a JWT.
 *
 * An opaque random token can also be an excellent design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. JWT refresh architecture
 * ============================================================
 *
 *
 *                    LOGIN
 *                      │
 *                      ▼
 *              Verify credentials
 *                      │
 *                      ▼
 *               ┌─────────────┐
 *               │             │
 *               ▼             ▼
 *          Access Token   Refresh Token
 *           short-lived     long-lived
 *               │             │
 *               │             │
 *               ▼             ▼
 *            API calls      /refresh
 *               │             │
 *               │             ▼
 *               │       Verify + validate
 *               │             │
 *               │             ▼
 *               │       New access token
 *               │
 *               ▼
 *             API
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Production refresh flow
 * ============================================================
 *
 *
 * POST /auth/login
 *       │
 *       ▼
 * Verify email/password
 *       │
 *       ▼
 * Create session
 *       │
 *       ├── access token
 *       │
 *       └── refresh token
 *
 *
 *
 * POST /auth/refresh
 *       │
 *       ▼
 * Verify refresh token
 *       │
 *       ▼
 * Check session/token state
 *       │
 *       ▼
 * Rotate refresh token
 *       │
 *       ├── new access token
 *       │
 *       └── new refresh token
 *
 *
 *
 * POST /auth/logout
 *       │
 *       ▼
 * Revoke refresh session
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Important security rules
 * ============================================================
 *
 * ❌ Don't use the refresh token for normal API authorization.
 *
 * ❌ Don't make access tokens unnecessarily long-lived.
 *
 * ❌ Don't put passwords inside JWT payloads.
 *
 * ❌ Don't expose refresh tokens through URLs.
 *
 * ❌ Don't blindly trust a decoded refresh token.
 *
 * ❌ Don't skip signature/claim validation.
 *
 * ❌ Don't assume JWT automatically supports revocation.
 *
 *
 * ✓ Verify refresh tokens.
 *
 * ✓ Consider refresh-token rotation.
 *
 * ✓ Track refresh sessions/tokens server-side when needed.
 *
 * ✓ Keep access tokens short-lived.
 *
 * ✓ Use secure storage and cookie settings appropriate to
 *   your browser architecture.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Key Takeaways
 * ============================================================
 *
 * 1. Access tokens are normally short-lived.
 *
 * 2. Refresh tokens are used to obtain new access tokens.
 *
 * 3. Refresh tokens should be treated as highly sensitive
 *    credentials.
 *
 * 4. Refresh tokens can be rotated.
 *
 * 5. Rotation can help detect token reuse.
 *
 * 6. Server-side refresh-session state makes revocation and
 *    reuse detection possible.
 *
 * 7. `jti` can identify an individual JWT.
 *
 * 8. A refresh token does not have to be a JWT.
 *
 * 9. Access-token and refresh-token secrets can be separated.
 *
 * 10. Issuer and audience validation should be configured as
 *     appropriate for the architecture.
 *
 * ============================================================
 */
