/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/create_token.js
 *
 * Topic:
 * JSON Web Token (JWT) - Creating a Token
 *
 * ============================================================
 *
 * Install:
 *
 *     npm install jsonwebtoken
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import jsonwebtoken
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 2. JWT Secret
 * ============================================================
 *
 * The secret is used to create the JWT signature.
 *
 * IMPORTANT:
 *
 * NEVER hard-code real production secrets in source code.
 *
 * In production:
 *
 *     process.env.JWT_SECRET
 *
 * should be used with proper secret management.
 *
 * This example uses a fake secret only for learning.
 * ============================================================
 */

const JWT_SECRET = "my-super-secret-key-for-learning";

/*
 * ============================================================
 * 3. User data
 * ============================================================
 *
 * Imagine that the user has successfully logged in.
 *
 * Example database user:
 *
 *     {
 *       id: "user_123",
 *       email: "shiva@example.com",
 *       role: "user"
 *     }
 *
 *
 * We generally put only the claims needed by the application
 * into the token.
 *
 * Do NOT put sensitive information such as:
 *
 *     password
 *     passwordHash
 *     OTP
 *     credit card information
 *
 * inside the JWT payload.
 *
 * ============================================================
 */

const user = {
  id: "user_123",
  email: "shiva@example.com",
  role: "user",
};

/*
 * ============================================================
 * 4. Create JWT payload
 * ============================================================
 *
 * The payload contains claims.
 *
 * Example:
 *
 *     {
 *       sub: "user_123",
 *       email: "shiva@example.com",
 *       role: "user"
 *     }
 *
 *
 * `sub` means "subject".
 *
 * It is commonly used to identify the user/entity represented
 * by the token.
 *
 * ============================================================
 */

const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};

/*
 * ============================================================
 * 5. Create the JWT
 * ============================================================
 *
 * Syntax:
 *
 *     jwt.sign(payload, secret)
 *
 * ============================================================
 */

const token = jwt.sign(payload, JWT_SECRET);

/*
 * ============================================================
 * 6. Display the token
 * ============================================================
 */

console.log("JWT:");
console.log(token);

/*
 * ============================================================
 * 7. JWT structure
 * ============================================================
 *
 * A JWT normally looks like:
 *
 *
 *     xxxxx.yyyyy.zzzzz
 *      │      │      │
 *      │      │      └── Signature
 *      │      │
 *      │      └───────── Payload
 *      │
 *      └──────────────── Header
 *
 *
 * Three sections:
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *
 * separated by dots.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. JWT Header
 * ============================================================
 *
 * Conceptually:
 *
 *     {
 *       "alg": "HS256",
 *       "typ": "JWT"
 *     }
 *
 *
 * `alg`
 *
 *     Signing algorithm.
 *
 *
 * `typ`
 *
 *     Token type.
 *
 *
 * jsonwebtoken determines the signing information when
 * creating the token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. JWT Payload
 * ============================================================
 *
 * Our payload contains:
 *
 *     {
 *       "sub": "user_123",
 *       "email": "shiva@example.com",
 *       "role": "user"
 *     }
 *
 *
 * IMPORTANT:
 *
 * JWT payloads are NOT encrypted by default.
 *
 * They are encoded.
 *
 *
 * Therefore:
 *
 *     DO NOT put secrets in the payload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. JWT Signature
 * ============================================================
 *
 * Conceptually, with HMAC:
 *
 *
 *     Header
 *        +
 *     Payload
 *        +
 *     Secret
 *        │
 *        ▼
 *     Signing algorithm
 *        │
 *        ▼
 *     Signature
 *
 *
 * The signature allows the server to detect whether the
 * signed token has been modified.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Authentication flow
 * ============================================================
 *
 *
 *              LOGIN
 *                │
 *                ▼
 *        Verify email/password
 *                │
 *                ▼
 *            bcrypt.compare()
 *                │
 *                ▼
 *             Success
 *                │
 *                ▼
 *            jwt.sign()
 *                │
 *                ▼
 *             JWT Token
 *                │
 *                ▼
 *              Client
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Client sends JWT
 * ============================================================
 *
 * After login, the client can send the access token with
 * protected requests.
 *
 *
 * Common HTTP header:
 *
 *
 *     Authorization: Bearer <token>
 *
 *
 * Example:
 *
 *     Authorization: Bearer eyJhbGciOiJIUzI1Ni...
 *
 *
 * We will handle this properly in `jwt_auth.js`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Server verifies JWT
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ Authorization: Bearer <JWT>
 *   ▼
 * Server
 *   │
 *   ▼
 * jwt.verify()
 *   │
 *   ├── Valid ───────► Continue request
 *   │
 *   └── Invalid ─────► Reject request
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Signing vs verification
 * ============================================================
 *
 * CREATE:
 *
 *     jwt.sign()
 *
 *
 * VERIFY:
 *
 *     jwt.verify()
 *
 *
 * These are two different operations.
 *
 *
 * Login:
 *
 *     jwt.sign()
 *
 *
 * Protected API:
 *
 *     jwt.verify()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Add an expiration time
 * ============================================================
 *
 * Access tokens should generally be short-lived.
 *
 *
 * Example:
 *
 *     jwt.sign(
 *       payload,
 *       JWT_SECRET,
 *       {
 *         expiresIn: "15m"
 *       }
 *     );
 *
 *
 * We will study expiration separately in:
 *
 *     expiration.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Example with expiration
 * ============================================================
 */

const tokenWithExpiration = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "15m",
});

console.log("\nJWT with expiration:");
console.log(tokenWithExpiration);

/*
 * ============================================================
 * 17. Important JWT security concepts
 * ============================================================
 *
 * JWT is NOT:
 *
 *     - A password hash
 *     - Encryption by default
 *     - A database
 *     - A session store
 *
 *
 * JWT is a token containing claims that can be digitally
 * signed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. JWT vs bcrypt
 * ============================================================
 *
 *
 * bcrypt:
 *
 *     Password
 *        │
 *        ▼
 *     Password hash
 *        │
 *        ▼
 *     Database
 *
 *
 *
 * JWT:
 *
 *     Authenticated user
 *             │
 *             ▼
 *         JWT claims
 *             │
 *             ▼
 *        Signed token
 *             │
 *             ▼
 *           Client
 *
 *
 *
 * bcrypt protects stored passwords.
 *
 * JWT represents authenticated identity/claims.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Complete authentication picture
 * ============================================================
 *
 *
 * REGISTER
 *
 *     Password
 *        │
 *        ▼
 *     bcrypt.hash()
 *        │
 *        ▼
 *     passwordHash
 *        │
 *        ▼
 *     Database
 *
 *
 *
 * LOGIN
 *
 *     Password
 *        │
 *        ▼
 *     bcrypt.compare()
 *        │
 *        ▼
 *     Valid
 *        │
 *        ▼
 *     jwt.sign()
 *        │
 *        ▼
 *     Access Token
 *
 *
 *
 * PROTECTED API
 *
 *     Access Token
 *        │
 *        ▼
 *     jwt.verify()
 *        │
 *        ▼
 *     Authenticated request
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. NEVER put password in JWT
 * ============================================================
 *
 * WRONG:
 *
 *     const payload = {
 *       userId: user.id,
 *       password: user.password
 *     };
 *
 *
 * Also avoid:
 *
 *     passwordHash
 *
 * The JWT payload can be decoded by anyone who possesses the
 * token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. JWT is not encrypted
 * ============================================================
 *
 * This is extremely important.
 *
 *
 * JWT:
 *
 *     Encoded + Signed
 *
 *
 * NOT necessarily:
 *
 *     Encrypted
 *
 *
 * Anyone who has the token may be able to decode the payload.
 *
 * The signature protects integrity/authenticity, not secrecy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Secret protection
 * ============================================================
 *
 * Never commit this:
 *
 *     const JWT_SECRET = "real-production-secret";
 *
 *
 * to GitHub.
 *
 *
 * Instead:
 *
 *     const JWT_SECRET = process.env.JWT_SECRET;
 *
 *
 * And configure the secret securely in the environment or
 * your deployment's secret-management system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Common JWT mistakes
 * ============================================================
 *
 * ❌ Putting passwords in payload
 *
 * ❌ Putting sensitive secrets in payload
 *
 * ❌ Committing JWT secrets to Git
 *
 * ❌ Using extremely long-lived access tokens
 *
 * ❌ Accepting tokens without verification
 *
 * ❌ Trusting decoded payload without verifying signature
 *
 * ❌ Using a weak production secret
 *
 * ❌ Treating JWT payload as encrypted data
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Important functions we'll learn
 * ============================================================
 *
 *     jwt.sign()
 *         ↓
 *     Create token
 *
 *
 *     jwt.verify()
 *         ↓
 *     Verify token
 *
 *
 *     jwt.decode()
 *         ↓
 *     Decode token WITHOUT verifying its signature
 *
 *
 * These differences are extremely important.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Run
 * ============================================================
 *
 *     node .\14_jwt\create_token.js
 *
 * ============================================================
 */
