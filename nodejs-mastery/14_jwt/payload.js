/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/payload.js
 *
 * Topic:
 * JWT Payload & Claims
 *
 * ============================================================
 *
 * Install:
 *
 *     npm install jsonwebtoken
 *
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 1. JWT Secret
 * ============================================================
 *
 * Learning only.
 *
 * In production:
 *
 *     process.env.JWT_SECRET
 *
 * should be used.
 *
 * Never commit real secrets to GitHub.
 *
 * ============================================================
 */

const JWT_SECRET = "my-super-secret-key-for-learning";

/*
 * ============================================================
 * 2. What is a JWT payload?
 * ============================================================
 *
 * The payload is the second part of a JWT:
 *
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *             ▲
 *             │
 *          Payload
 *
 *
 * The payload contains claims.
 *
 *
 * Example:
 *
 *     {
 *       "sub": "user_123",
 *       "role": "user"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. What is a claim?
 * ============================================================
 *
 * A claim is a statement/information contained in a JWT.
 *
 *
 * Example:
 *
 *     {
 *       "sub": "user_123"
 *     }
 *
 *
 * This makes the claim:
 *
 *     "The subject of this token is user_123."
 *
 *
 * Claims are commonly divided into:
 *
 *     1. Registered claims
 *     2. Public claims
 *     3. Private/custom claims
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Registered claims
 * ============================================================
 *
 * JWT defines commonly used registered claim names.
 *
 *
 * Important ones:
 *
 *     iss
 *     sub
 *     aud
 *     exp
 *     nbf
 *     iat
 *     jti
 *
 *
 * These have standardized meanings.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. `sub` - Subject
 * ============================================================
 *
 * `sub` means:
 *
 *     Subject
 *
 *
 * It identifies the principal/entity represented by the JWT.
 *
 *
 * For authentication:
 *
 *     sub = user ID
 *
 *
 * Example:
 *
 *     sub: "user_123"
 *
 * ============================================================
 */

const payloadWithSubject = {
  sub: "user_123",
};

/*
 * ============================================================
 * 6. `iss` - Issuer
 * ============================================================
 *
 * `iss` means:
 *
 *     Issuer
 *
 *
 * It identifies the entity that issued the token.
 *
 *
 * Example:
 *
 *     iss: "my-api"
 *
 *
 * In a larger architecture:
 *
 *     Authentication Service
 *             │
 *             ▼
 *          issues JWT
 *             │
 *             ▼
 *           API
 *
 * The API can verify that the expected issuer issued the
 * token when issuer validation is configured.
 *
 * ============================================================
 */

const payloadWithIssuer = {
  sub: "user_123",
  iss: "my-api",
};

/*
 * ============================================================
 * 7. `aud` - Audience
 * ============================================================
 *
 * `aud` means:
 *
 *     Audience
 *
 *
 * It identifies the intended recipient(s) of the token.
 *
 *
 * Example:
 *
 *     aud: "timetable-api"
 *
 *
 * This is especially useful when multiple services exist.
 *
 *
 * Example:
 *
 *
 *       Auth Service
 *            │
 *            │ JWT
 *            ▼
 *       Timetable API
 *
 *
 * The token can specify:
 *
 *     aud: "timetable-api"
 *
 *
 * A different service should not automatically accept a
 * token intended for another audience.
 *
 * ============================================================
 */

const payloadWithAudience = {
  sub: "user_123",
  iss: "auth-service",
  aud: "timetable-api",
};

/*
 * ============================================================
 * 8. `iat` - Issued At
 * ============================================================
 *
 * `iat` means:
 *
 *     Issued At
 *
 *
 * It represents the time the JWT was issued.
 *
 *
 * jsonwebtoken commonly adds `iat` automatically when signing
 * a token unless configured otherwise.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. `exp` - Expiration Time
 * ============================================================
 *
 * `exp` means:
 *
 *     Expiration Time
 *
 *
 * After the expiration time, the token should not be accepted.
 *
 *
 * Example:
 *
 *     expiresIn: "15m"
 *
 *
 * jsonwebtoken will create an appropriate `exp` claim.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. `nbf` - Not Before
 * ============================================================
 *
 * `nbf` means:
 *
 *     Not Before
 *
 *
 * It specifies a time before which the token should not be
 * accepted.
 *
 *
 * Example concept:
 *
 *
 *     Token created
 *          │
 *          ▼
 *       waiting
 *          │
 *          ▼
 *     nbf reached
 *          │
 *          ▼
 *       Valid token
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. `jti` - JWT ID
 * ============================================================
 *
 * `jti` means:
 *
 *     JWT ID
 *
 *
 * It gives a unique identifier to the JWT.
 *
 *
 * Example:
 *
 *     jti: "token_8f2a..."
 *
 *
 * This can be useful for:
 *
 *     - Token tracking
 *     - Revocation systems
 *     - Refresh-token rotation
 *     - Security auditing
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Custom claims
 * ============================================================
 *
 * Applications can add application-specific claims.
 *
 *
 * Example:
 *
 *     {
 *       sub: "user_123",
 *       role: "admin",
 *       department: "engineering"
 *     }
 *
 *
 * `role` and `department` are application-specific claims.
 *
 * ============================================================
 */

const customPayload = {
  sub: "user_123",
  role: "admin",
  department: "engineering",
};

/*
 * ============================================================
 * 13. Create a complete payload
 * ============================================================
 */

const payload = {
  /*
   * Registered claims
   */

  sub: "user_123",
  iss: "my-auth-service",
  aud: "my-api",

  /*
   * Custom claims
   */

  role: "user",
  permissions: ["profile:read", "profile:update"],
};

/*
 * ============================================================
 * 14. Sign the JWT
 * ============================================================
 */

const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "15m",
  jwtid: "token_123",
});

console.log("JWT:");
console.log(token);

/*
 * ============================================================
 * 15. Decode the token
 * ============================================================
 *
 * This is only for inspecting the token in this learning
 * example.
 *
 * Authentication must use jwt.verify().
 *
 * ============================================================
 */

const decoded = jwt.decode(token);

console.log("\nDecoded payload:");
console.log(decoded);

/*
 * ============================================================
 * 16. What jsonwebtoken adds
 * ============================================================
 *
 * Because we used:
 *
 *     expiresIn: "15m"
 *
 *
 * jsonwebtoken creates:
 *
 *     exp
 *
 *
 * It also normally creates:
 *
 *     iat
 *
 *
 * Because we used:
 *
 *     jwtid: "token_123"
 *
 *
 * the token contains:
 *
 *     jti
 *
 *
 * So the resulting payload will be conceptually similar to:
 *
 *     {
 *       sub: "user_123",
 *       iss: "my-auth-service",
 *       aud: "my-api",
 *       role: "user",
 *       permissions: [...],
 *       iat: ...,
 *       exp: ...,
 *       jti: "token_123"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Verify issuer
 * ============================================================
 *
 * When verifying a token, you can specify the expected issuer.
 *
 * ============================================================
 */

try {
  const verified = jwt.verify(token, JWT_SECRET, {
    issuer: "my-auth-service",
  });

  console.log("\nIssuer verification successful:");
  console.log(verified);
} catch (error) {
  console.error("\nIssuer verification failed:", error.message);
}

/*
 * ============================================================
 * 18. Verify audience
 * ============================================================
 */

try {
  const verified = jwt.verify(token, JWT_SECRET, {
    issuer: "my-auth-service",
    audience: "my-api",
  });

  console.log("\nIssuer + audience verification successful:");
  console.log(verified);
} catch (error) {
  console.error("\nIssuer/audience verification failed:", error.message);
}

/*
 * ============================================================
 * 19. Wrong audience
 * ============================================================
 *
 * Let's intentionally use the wrong audience.
 * ============================================================
 */

try {
  jwt.verify(token, JWT_SECRET, {
    audience: "another-api",
  });

  console.log("Token accepted.");
} catch (error) {
  console.log("\nWrong audience rejected:", error.message);
}

/*
 * ============================================================
 * 20. Why audience matters
 * ============================================================
 *
 *
 * Imagine:
 *
 *
 *                    Auth Service
 *                         │
 *              ┌──────────┴──────────┐
 *              │                     │
 *              ▼                     ▼
 *       Timetable API           Payment API
 *
 *
 * A token intended for:
 *
 *     aud: "timetable-api"
 *
 *
 * should not automatically be accepted by:
 *
 *     payment-api
 *
 *
 * Audience validation helps establish this boundary.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Don't put too much data in a JWT
 * ============================================================
 *
 * JWTs are often sent with requests.
 *
 *
 * If you put a huge amount of information inside the token:
 *
 *
 *     Client
 *        │
 *        │ Huge JWT
 *        ▼
 *      Server
 *
 *
 * Every request may carry that additional data.
 *
 *
 * Keep access-token payloads relatively small.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Don't put sensitive information in payload
 * ============================================================
 *
 * NEVER put:
 *
 *     password
 *     passwordHash
 *     OTP
 *     API secret
 *     private key
 *     credit card data
 *
 * in a normal JWT payload.
 *
 *
 * Remember:
 *
 *     JWT payload ≠ encrypted storage.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Don't use role alone as your entire authorization model
 * ============================================================
 *
 * This is acceptable for simple systems:
 *
 *     role: "admin"
 *
 *
 * But real systems can require:
 *
 *     roles
 *     permissions
 *     resource ownership
 *     tenant restrictions
 *     account status
 *
 *
 * Example:
 *
 *     {
 *       sub: "user_123",
 *       role: "teacher"
 *     }
 *
 *
 * This does not automatically mean:
 *
 *     teacher can modify every resource.
 *
 *
 * Authorization logic must still be enforced by the server.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Example authorization
 * ============================================================
 */

function canDeleteUser(verifiedUser) {
  return verifiedUser.role === "admin";
}

try {
  const verifiedUser = jwt.verify(token, JWT_SECRET, {
    issuer: "my-auth-service",
    audience: "my-api",
  });

  if (canDeleteUser(verifiedUser)) {
    console.log("\nUser can delete users.");
  } else {
    console.log("\nUser cannot delete users.");
  }
} catch (error) {
  console.log("\nAuthentication failed:", error.message);
}

/*
 * ============================================================
 * 25. Authentication vs Authorization
 * ============================================================
 *
 *
 * AUTHENTICATION
 *
 *     Who are you?
 *
 *     JWT verification
 *            │
 *            ▼
 *       user_123
 *
 *
 *
 * AUTHORIZATION
 *
 *     What are you allowed to do?
 *
 *     user_123
 *        │
 *        ▼
 *      role
 *        │
 *        ▼
 *    permissions
 *        │
 *        ▼
 *      allow/deny
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Complete claim example
 * ============================================================
 *
 * Example payload:
 *
 *
 * {
 *   "iss": "auth-service",
 *   "sub": "user_123",
 *   "aud": "timetable-api",
 *   "exp": 1760000000,
 *   "nbf": 1759999000,
 *   "iat": 1759999000,
 *   "jti": "token_123",
 *
 *   "role": "teacher",
 *   "permissions": [
 *     "timetable:read",
 *     "timetable:update"
 *   ]
 * }
 *
 *
 * Registered claims:
 *
 *     iss
 *     sub
 *     aud
 *     exp
 *     nbf
 *     iat
 *     jti
 *
 *
 * Application claims:
 *
 *     role
 *     permissions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Recommended access-token payload
 * ============================================================
 *
 * A simple application might use:
 *
 *
 * {
 *   "sub": "user_123",
 *   "role": "user"
 * }
 *
 *
 * with registered claims such as:
 *
 *     iss
 *     aud
 *     iat
 *     exp
 *     jti
 *
 *
 * Keep it minimal.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Important security rule
 * ============================================================
 *
 * NEVER do:
 *
 *     const payload = jwt.decode(token);
 *
 *     if (payload.role === "admin") {
 *       // admin operation
 *     }
 *
 *
 * Correct:
 *
 *     const payload = jwt.verify(
 *       token,
 *       JWT_SECRET,
 *       options,
 *     );
 *
 *     if (payload.role === "admin") {
 *       // authorization check
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Key Takeaways
 * ============================================================
 *
 * 1. JWT payload contains claims.
 *
 * 2. `sub` identifies the subject.
 *
 * 3. `iss` identifies the issuer.
 *
 * 4. `aud` identifies the intended audience.
 *
 * 5. `iat` represents issued-at time.
 *
 * 6. `exp` represents expiration time.
 *
 * 7. `nbf` represents not-before time.
 *
 * 8. `jti` identifies a particular JWT.
 *
 * 9. Custom claims can represent application data such as
 *    roles and permissions.
 *
 * 10. Keep JWT payloads small.
 *
 * 11. Never put passwords or secrets into the payload.
 *
 * 12. Verify issuer and audience when your architecture
 *     requires them.
 *
 * 13. Authentication and authorization are separate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\14_jwt\payload.js
 *
 * ============================================================
 */
