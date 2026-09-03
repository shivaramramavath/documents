/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/access_token/access_token.js
 *
 * Topic:
 *     Access Tokens
 *
 * ============================================================
 *
 * ACCESS TOKEN
 *
 * An access token represents an authenticated authorization
 * context for accessing protected API resources.
 *
 * A common implementation uses a signed JWT.
 *
 * ============================================================
 *
 * FLOW
 *
 * Login
 *   ↓
 * Verify credentials
 *   ↓
 * Create access token
 *   ↓
 * Client
 *   ↓
 * Authorization: Bearer <access-token>
 *   ↓
 * Server verifies token
 *   ↓
 * req.auth
 *   ↓
 * Protected resource
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
 * NEVER hard-code real secrets in source code.
 *
 * Use environment variables:
 *
 *     process.env.JWT_ACCESS_SECRET
 *
 * ============================================================
 */

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "development-only-secret";

/*
 * ============================================================
 * TOKEN CONFIGURATION
 * ============================================================
 */

const ACCESS_TOKEN_EXPIRES_IN = "15m";

const JWT_ISSUER = "nodejs-mastery-api";

const JWT_AUDIENCE = "nodejs-mastery-client";

/*
 * ============================================================
 * 1. USER
 * ============================================================
 *
 * Normally this comes from your database.
 *
 * ============================================================
 */

const user = {
  id: crypto.randomUUID(),

  email: "shiva@example.com",

  roles: ["user"],
};

/*
 * ============================================================
 * 2. CREATE ACCESS TOKEN
 * ============================================================
 */

function createAccessToken(user) {
  /*
   * ----------------------------------------------------------
   * JWT PAYLOAD
   * ----------------------------------------------------------
   *
   * Keep the payload small.
   *
   * Never put:
   *
   *     password
   *     passwordHash
   *     secrets
   *     sensitive unnecessary data
   *
   * inside the JWT.
   */

  const payload = {
    sub: user.id,

    roles: user.roles,
  };

  /*
   * ----------------------------------------------------------
   * SIGN JWT
   * ----------------------------------------------------------
   */

  const token = jwt.sign(
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

  return token;
}

/*
 * ============================================================
 * 3. DECODE VS VERIFY
 * ============================================================
 *
 * IMPORTANT:
 *
 * jwt.decode()
 *
 *     only decodes the token.
 *
 * It does NOT prove that the token is authentic.
 *
 *
 * jwt.verify()
 *
 *     verifies the signature and validates configured claims
 *     such as expiration, issuer and audience.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. VERIFY ACCESS TOKEN
 * ============================================================
 */

function verifyAccessToken(token) {
  return jwt.verify(
    token,

    JWT_ACCESS_SECRET,

    {
      algorithms: ["HS256"],

      issuer: JWT_ISSUER,

      audience: JWT_AUDIENCE,
    },
  );
}

/*
 * ============================================================
 * 5. AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * Every protected route can use this middleware.
 *
 * ============================================================
 */

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  /*
   * ----------------------------------------------------------
   * CHECK HEADER
   * ----------------------------------------------------------
   *
   * Expected:
   *
   * Authorization: Bearer eyJ...
   *
   * ----------------------------------------------------------
   */

  if (!authorization) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",

        message: "Authentication required",
      },
    });
  }

  /*
   * ----------------------------------------------------------
   * PARSE BEARER TOKEN
   * ----------------------------------------------------------
   */

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({
      error: {
        code: "INVALID_AUTHORIZATION_HEADER",

        message: "Invalid authorization header",
      },
    });
  }

  const token = parts[1];

  /*
   * ----------------------------------------------------------
   * VERIFY JWT
   * ----------------------------------------------------------
   */

  try {
    const payload = verifyAccessToken(token);

    /*
     * --------------------------------------------------------
     * ATTACH AUTH CONTEXT
     * --------------------------------------------------------
     *
     * Controllers can now access:
     *
     *     req.auth.userId
     *
     *     req.auth.roles
     *
     * --------------------------------------------------------
     */

    req.auth = {
      userId: payload.sub,

      roles: payload.roles || [],

      jwtId: payload.jti,
    };

    next();
  } catch (error) {
    /*
     * --------------------------------------------------------
     * INVALID / EXPIRED TOKEN
     * --------------------------------------------------------
     */

    return res.status(401).json({
      error: {
        code: "INVALID_ACCESS_TOKEN",

        message: "Invalid or expired access token",
      },
    });
  }
}

/*
 * ============================================================
 * 6. LOGIN → CREATE ACCESS TOKEN
 * ============================================================
 *
 * This is a simplified demonstration.
 *
 * Real login:
 *
 *     verify credentials
 *          ↓
 *     create access token
 *
 * ============================================================
 */

app.post("/api/v1/auth/access-token", (req, res) => {
  /*
   * In a real application, DO NOT trust a user ID supplied
   * by the client to create a token.
   *
   * The authenticated user must come from successfully
   * verified credentials.
   */

  const token = createAccessToken(user);

  return res.status(200).json({
    data: {
      accessToken: token,

      tokenType: "Bearer",

      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

/*
 * ============================================================
 * 7. PROTECTED ROUTE
 * ============================================================
 */

app.get("/api/v1/profile", authenticate, (req, res) => {
  return res.json({
    data: {
      userId: req.auth.userId,

      roles: req.auth.roles,
    },
  });
});

/*
 * ============================================================
 * 8. AUTHORIZATION HEADER
 * ============================================================
 *
 * Client sends:
 *
 *
 * GET /api/v1/profile
 *
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 *
 * Server:
 *
 *     extract token
 *          ↓
 *     verify signature
 *          ↓
 *     verify expiration
 *          ↓
 *     verify issuer
 *          ↓
 *     verify audience
 *          ↓
 *     create req.auth
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. JWT STRUCTURE
 * ============================================================
 *
 * A JWT has three sections:
 *
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *
 *
 * Example:
 *
 *
 *     eyJhbGciOiJIUzI1NiIs...
 *     .
 *     eyJzdWIiOiIxMjMi...
 *     .
 *     abcdef123456...
 *
 *
 * HEADER
 *
 *     algorithm
 *     token type
 *
 *
 * PAYLOAD
 *
 *     claims
 *
 *
 * SIGNATURE
 *
 *     proves the token was signed with the expected key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. COMMON JWT CLAIMS
 * ============================================================
 *
 * sub
 *
 *     Subject.
 *
 *     Usually the user identifier.
 *
 *
 * iss
 *
 *     Issuer.
 *
 *
 * aud
 *
 *     Audience.
 *
 *
 * exp
 *
 *     Expiration timestamp.
 *
 *
 * iat
 *
 *     Issued-at timestamp.
 *
 *
 * jti
 *
 *     JWT identifier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. DON'T TRUST PAYLOAD WITHOUT VERIFICATION
 * ============================================================
 *
 * WRONG:
 *
 *
 * const payload =
 *   jwt.decode(token);
 *
 *
 * if (
 *   payload.role === "admin"
 * ) {
 *
 *   // allow access
 * }
 *
 *
 * `decode()` does not authenticate the token.
 *
 *
 * CORRECT:
 *
 *
 * const payload =
 *   jwt.verify(
 *     token,
 *     secret,
 *   );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. EXPIRATION
 * ============================================================
 *
 * Access tokens should generally have a relatively short
 * lifetime.
 *
 *
 * Example:
 *
 *
 *     15 minutes
 *
 *
 * After expiration:
 *
 *
 *     jwt.verify()
 *
 *
 * will reject the token.
 *
 *
 * Client then uses the refresh-token flow to obtain another
 * access token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. ACCESS TOKEN IS NOT A SESSION DATABASE
 * ============================================================
 *
 * A signed JWT can be verified without querying the database
 * for every request.
 *
 *
 * This can be useful for high-throughput APIs.
 *
 *
 * However, this also means revocation is more complicated.
 *
 *
 * If the JWT is valid:
 *
 *     signature ✓
 *     expiration ✓
 *
 * it may remain accepted until expiration unless your system
 * adds a revocation mechanism.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. JWT REVOCATION
 * ============================================================
 *
 * Possible strategies include:
 *
 *
 *     short access-token lifetime
 *
 *     token denylist
 *
 *     session version
 *
 *     user token version
 *
 *     centralized session state
 *
 *     immediate session checks
 *
 *
 * Each has different scalability and security trade-offs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. TOKEN VERSION STRATEGY
 * ============================================================
 *
 * Example user:
 *
 *
 * {
 *   id: "123",
 *   tokenVersion: 4
 * }
 *
 *
 * JWT:
 *
 *
 * {
 *   sub: "123",
 *   tokenVersion: 4
 * }
 *
 *
 * If you increment the database value:
 *
 *
 *     tokenVersion = 5
 *
 *
 * older tokens containing:
 *
 *
 *     tokenVersion = 4
 *
 *
 * can be rejected.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. ROLE CLAIM
 * ============================================================
 *
 * Example:
 *
 *
 * {
 *   sub: "123",
 *
 *   roles: [
 *     "admin"
 *   ]
 * }
 *
 *
 * Then authorization middleware can check:
 *
 *
 *     req.auth.roles
 *
 *
 * But don't put excessive authorization data in the JWT.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. AUTHENTICATION ≠ AUTHORIZATION
 * ============================================================
 *
 *
 * authenticate()
 *
 *     answers:
 *
 *     "Is this token valid?"
 *
 *
 *
 * authorize()
 *
 *     answers:
 *
 *     "Does this authenticated user have permission?"
 *
 *
 * Example:
 *
 *
 * authenticate
 *      ↓
 * user = Shiva
 *      ↓
 * authorize
 *      ↓
 * role = admin?
 *      ↓
 * yes/no
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. AUTHORIZATION MIDDLEWARE EXAMPLE
 * ============================================================
 */

function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth.roles.includes(role)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Insufficient permissions",
        },
      });
    }

    next();
  };
}

/*
 * Example:
 *
 *
 * app.delete(
 *   "/api/v1/users/:id",
 *
 *   authenticate,
 *
 *   requireRole("admin"),
 *
 *   deleteUserController,
 * );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. SECRET MANAGEMENT
 * ============================================================
 *
 * Development:
 *
 *     .env
 *
 *
 * Production:
 *
 *     secret manager / managed secret storage
 *
 *
 * NEVER commit:
 *
 *     JWT_ACCESS_SECRET=real-secret
 *
 * to Git.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. SYMMETRIC VS ASYMMETRIC SIGNING
 * ============================================================
 *
 *
 * HS256
 *
 *     HMAC
 *
 *     Same secret signs and verifies.
 *
 *
 *     Signer
 *        │
 *        └── shared secret
 *                │
 *              verifier
 *
 *
 *
 * RS256 / ES256
 *
 *     Asymmetric cryptography.
 *
 *
 *     Private key
 *         ↓
 *       signs
 *
 *     Public key
 *         ↓
 *      verifies
 *
 *
 * Asymmetric signing can be useful in distributed systems where
 * many services need to verify tokens but should not possess
 * the private signing key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. MICROSERVICE ARCHITECTURE
 * ============================================================
 *
 *
 * Auth Service
 *      │
 *      │ signs JWT
 *      ▼
 * Access Token
 *      │
 *      ├───────────────┐
 *      ▼               ▼
 * User Service    Message Service
 *      │               │
 *      └──── verify ───┘
 *
 *
 * With asymmetric signing:
 *
 *
 * Auth Service
 *     │
 *     └── private key
 *
 *
 * Other services:
 *
 *     public key
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. DON'T PUT SECRETS IN JWT
 * ============================================================
 *
 * JWT payload is encoded, not encrypted by default.
 *
 *
 * Therefore:
 *
 *
 * ❌ password
 *
 * ❌ passwordHash
 *
 * ❌ API keys
 *
 * ❌ private secrets
 *
 * ❌ unnecessary sensitive information
 *
 *
 * should not be placed in a normal JWT payload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. TOKEN TYPE
 * ============================================================
 *
 * Response can identify the scheme:
 *
 *
 * {
 *   "accessToken": "...",
 *   "tokenType": "Bearer",
 *   "expiresIn": "15m"
 * }
 *
 *
 * Client then sends:
 *
 *
 * Authorization: Bearer <accessToken>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. ERROR HANDLING
 * ============================================================
 *
 * Missing token:
 *
 *     401 Unauthorized
 *
 *
 * Invalid token:
 *
 *     401 Unauthorized
 *
 *
 * Expired token:
 *
 *     401 Unauthorized
 *
 *
 * Valid token but insufficient permission:
 *
 *     403 Forbidden
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. ACCESS TOKEN FLOW
 * ============================================================
 *
 *
 *             LOGIN
 *               │
 *               ▼
 *       verify credentials
 *               │
 *               ▼
 *        create JWT
 *               │
 *               ▼
 *       access token
 *               │
 *               ▼
 *      client sends token
 *               │
 *               ▼
 * Authorization: Bearer ...
 *               │
 *               ▼
 *         authenticate()
 *               │
 *               ▼
 *          jwt.verify()
 *               │
 *          ┌────┴────┐
 *          │         │
 *       invalid    valid
 *          │         │
 *         401       req.auth
 *                    │
 *                    ▼
 *               controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 * POST /auth/login
 *        │
 *        ▼
 * Auth Controller
 *        │
 *        ▼
 * Auth Service
 *        │
 *        ├── verify password
 *        │
 *        └── issue access token
 *                  │
 *                  ▼
 *                Client
 *
 *
 *
 * GET /users
 *        │
 *        ▼
 * authenticate middleware
 *        │
 *        ▼
 * jwt.verify()
 *        │
 *        ▼
 * req.auth
 *        │
 *        ▼
 * authorization middleware
 *        │
 *        ▼
 * controller
 *        │
 *        ▼
 * service
 *        │
 *        ▼
 * repository
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. IMPORTANT SECURITY CHECKLIST
 * ============================================================
 *
 * ✓ Use HTTPS.
 *
 * ✓ Keep access tokens short-lived.
 *
 * ✓ Protect signing keys.
 *
 * ✓ Use strong secrets/keys.
 *
 * ✓ Verify issuer when applicable.
 *
 * ✓ Verify audience when applicable.
 *
 * ✓ Restrict accepted algorithms.
 *
 * ✓ Never trust jwt.decode() for authentication.
 *
 * ✓ Never put passwords/secrets in JWT payloads.
 *
 * ✓ Return 401 for invalid authentication.
 *
 * ✓ Return 403 for insufficient authorization.
 *
 * ✓ Avoid logging tokens.
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Access-token server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Access tokens authenticate API requests.
 *
 * 2. JWT is one possible access-token format.
 *
 * 3. jwt.sign() creates a signed JWT.
 *
 * 4. jwt.verify() validates it.
 *
 * 5. jwt.decode() does NOT authenticate it.
 *
 * 6. Use Authorization: Bearer <token>.
 *
 * 7. Keep access tokens short-lived.
 *
 * 8. Never put passwords or secrets inside JWT payloads.
 *
 * 9. Authentication and authorization are separate middleware
 *    responsibilities.
 *
 * 10. Access-token revocation requires additional architecture
 *     if immediate invalidation is required.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/refresh_token/
 *
 * We will build:
 *
 *     refresh tokens
 *     token rotation
 *     token families
 *     refresh-token storage
 *     replay detection
 *     issuing new access tokens
 *
 * ============================================================
 */
