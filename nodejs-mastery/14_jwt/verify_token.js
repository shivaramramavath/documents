/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/verify_token.js
 *
 * Topic:
 * JWT Token Verification
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
 * This must be the same secret that was used to sign the JWT
 * when using an HMAC algorithm such as HS256.
 *
 * In production:
 *
 *     process.env.JWT_SECRET
 *
 * Never commit a real secret to GitHub.
 *
 * ============================================================
 */

const JWT_SECRET = "my-super-secret-key-for-learning";

/*
 * ============================================================
 * 2. Create a token
 * ============================================================
 *
 * Normally the token comes from the client.
 *
 * For this learning example, we create one first.
 * ============================================================
 */

const payload = {
  sub: "user_123",
  email: "shiva@example.com",
  role: "user",
};

const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "15m",
});

console.log("JWT:");
console.log(token);

/*
 * ============================================================
 * 3. Verify the JWT
 * ============================================================
 *
 * Syntax:
 *
 *     jwt.verify(token, secret)
 *
 *
 * If verification succeeds:
 *
 *     decoded payload is returned.
 *
 *
 * If verification fails:
 *
 *     an error is thrown.
 *
 * ============================================================
 */

try {
  const decoded = jwt.verify(token, JWT_SECRET);

  console.log("\nVerified JWT payload:");
  console.log(decoded);
} catch (error) {
  console.error("\nJWT verification failed:");
  console.error(error.message);
}

/*
 * ============================================================
 * 4. What does verification actually check?
 * ============================================================
 *
 * Verification can check things such as:
 *
 *     ✓ Signature
 *     ✓ Token structure
 *     ✓ Expiration
 *     ✓ Not-before time
 *     ✓ Algorithm constraints
 *     ✓ Other registered claims, depending on options
 *
 *
 * The exact checks depend on the token and verification
 * options.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Signature verification
 * ============================================================
 *
 * Conceptually, for an HMAC-signed JWT:
 *
 *
 *     Header
 *        +
 *     Payload
 *        +
 *     Secret
 *        │
 *        ▼
 *     HMAC algorithm
 *        │
 *        ▼
 *     Expected signature
 *
 *
 * The server compares the expected signature with the
 * signature contained in the token.
 *
 *
 * If they don't match:
 *
 *     ❌ Token rejected
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Tampering demonstration
 * ============================================================
 *
 * Let's modify the token.
 *
 * IMPORTANT:
 *
 * This is only a learning demonstration.
 *
 * ============================================================
 */

const parts = token.split(".");

/*
 * JWT has three parts:
 *
 *     header.payload.signature
 *
 */

console.log("\nJWT parts:");
console.log("Header:", parts[0]);
console.log("Payload:", parts[1]);
console.log("Signature:", parts[2]);

/*
 * Modify the payload portion.
 *
 * We are NOT generating a valid new signature.
 */

const tamperedToken = [
  parts[0],

  /*
   * Fake payload.
   *
   * The original payload says:
   *
   *     role: "user"
   *
   * We'll attempt to change it to:
   *
   *     role: "admin"
   *
   */

  Buffer.from(
    JSON.stringify({
      sub: "user_123",
      email: "shiva@example.com",
      role: "admin",
    }),
  ).toString("base64url"),

  parts[2],
].join(".");

console.log("\nTampered JWT:");
console.log(tamperedToken);

/*
 * ============================================================
 * 7. Verify tampered token
 * ============================================================
 */

try {
  const decodedTamperedToken = jwt.verify(tamperedToken, JWT_SECRET);

  console.log("Tampered token accepted:", decodedTamperedToken);
} catch (error) {
  console.log("\nTampered token rejected:", error.message);
}

/*
 * Expected:
 *
 *     Tampered token rejected: invalid signature
 *
 *
 * Why?
 *
 * We changed the payload but didn't generate a matching
 * signature using the secret.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Decode vs Verify
 * ============================================================
 *
 * VERY IMPORTANT:
 *
 *
 *     jwt.decode(token)
 *
 * does NOT verify the token's signature.
 *
 *
 * Whereas:
 *
 *     jwt.verify(token, secret)
 *
 * verifies the token.
 *
 *
 * Therefore:
 *
 *
 *     decode()
 *         ↓
 *     Read token contents
 *
 *
 *     verify()
 *         ↓
 *     Authenticate/trust token claims after verification
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Never authenticate with decode()
 * ============================================================
 *
 * WRONG:
 *
 *     const user = jwt.decode(token);
 *
 *     if (user.role === "admin") {
 *       // Give admin access
 *     }
 *
 *
 * An attacker could modify the payload.
 *
 *
 * Correct:
 *
 *     const user = jwt.verify(
 *       token,
 *       JWT_SECRET,
 *     );
 *
 *     if (user.role === "admin") {
 *       // ...
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Expiration verification
 * ============================================================
 *
 * Our token was created with:
 *
 *     expiresIn: "15m"
 *
 *
 * Once it expires:
 *
 *     jwt.verify()
 *
 * will reject it.
 *
 *
 * Typical error:
 *
 *     TokenExpiredError
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Handle JWT errors
 * ============================================================
 *
 * jsonwebtoken provides different error types.
 *
 *
 * Common ones include:
 *
 *     JsonWebTokenError
 *     TokenExpiredError
 *     NotBeforeError
 *
 *
 * Example:
 */

try {
  jwt.verify(token, JWT_SECRET);
} catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    console.log("Token has expired.");
  } else if (error instanceof jwt.JsonWebTokenError) {
    console.log("Invalid JWT.");
  } else {
    console.log("JWT verification error.");
  }
}

/*
 * ============================================================
 * 12. Wrong secret
 * ============================================================
 *
 * If a token is signed using:
 *
 *     secret-A
 *
 *
 * but verified using:
 *
 *     secret-B
 *
 *
 * verification should fail.
 *
 * ============================================================
 */

try {
  jwt.verify(token, "wrong-secret");

  console.log("Token accepted.");
} catch (error) {
  console.log("\nWrong secret:", error.message);
}

/*
 * Expected:
 *
 *     invalid signature
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. JWT middleware concept
 * ============================================================
 *
 * In an Express application, authentication middleware might
 * conceptually do this:
 *
 *
 *     Request
 *        │
 *        ▼
 *     Authorization header
 *        │
 *        ▼
 *     Extract Bearer token
 *        │
 *        ▼
 *     jwt.verify()
 *        │
 *        ├── Invalid ──► 401 Unauthorized
 *        │
 *        └── Valid
 *             │
 *             ▼
 *        req.user = decoded
 *             │
 *             ▼
 *          next()
 *
 *
 * We'll implement this later in:
 *
 *     20_authentication/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Authorization comes after authentication
 * ============================================================
 *
 *
 * Authentication:
 *
 *     "Who are you?"
 *
 *
 * JWT verification establishes that the token is valid
 * according to the configured verification rules.
 *
 *
 * Authorization:
 *
 *     "Are you allowed to do this?"
 *
 *
 * Example:
 *
 *     JWT:
 *
 *       role: "user"
 *
 *
 * Endpoint:
 *
 *     DELETE /admin/users/123
 *
 *
 * After verifying the token, the server can apply an
 * authorization policy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Don't blindly trust claims
 * ============================================================
 *
 * A verified JWT tells you that the claims were signed by the
 * expected issuer/key under the configured verification rules.
 *
 * It does NOT automatically mean:
 *
 *     - The user still exists
 *     - The user's account is active
 *     - The user's permissions haven't changed
 *     - The token hasn't been revoked
 *
 *
 * Your application architecture determines whether additional
 * database/session checks are required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Restrict algorithms
 * ============================================================
 *
 * In production, explicitly configure accepted algorithms
 * where appropriate.
 *
 *
 * Example:
 */

try {
  const verified = jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });

  console.log("\nVerified with explicit algorithm:", verified);
} catch (error) {
  console.error(error.message);
}

/*
 * ============================================================
 * 17. Complete request flow
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ Authorization: Bearer <token>
 *   ▼
 * Server
 *   │
 *   ▼
 * Extract token
 *   │
 *   ▼
 * jwt.verify()
 *   │
 *   ├───────────────┐
 *   │               │
 * Invalid          Valid
 *   │               │
 *   ▼               ▼
 * 401          decoded claims
 *                   │
 *                   ▼
 *             Authorization
 *                   │
 *             ┌─────┴─────┐
 *             │           │
 *           Allowed     Denied
 *             │           │
 *             ▼           ▼
 *          Controller    403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. HTTP status codes
 * ============================================================
 *
 * Common distinction:
 *
 *
 * 401 Unauthorized
 *
 *     Authentication is missing or invalid.
 *
 *
 * 403 Forbidden
 *
 *     Authentication succeeded, but the authenticated
 *     principal is not allowed to perform the operation.
 *
 *
 * Example:
 *
 *     Invalid JWT → 401
 *
 *     Valid user token attempting admin-only operation → 403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Important security rules
 * ============================================================
 *
 * ❌ Don't trust jwt.decode() for authentication.
 *
 * ❌ Don't skip signature verification.
 *
 * ❌ Don't use a weak production secret.
 *
 * ❌ Don't commit secrets to Git.
 *
 * ❌ Don't accept arbitrary algorithms without a reason.
 *
 * ❌ Don't put passwords in JWT payloads.
 *
 * ❌ Don't assume a valid token means authorization is valid.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Key Takeaways
 * ============================================================
 *
 * 1. jwt.sign() creates a JWT.
 *
 * 2. jwt.verify() verifies a JWT.
 *
 * 3. Verification checks the token according to the supplied
 *    secret/key and verification options.
 *
 * 4. A modified payload should fail signature verification.
 *
 * 5. Expired tokens are rejected by verification.
 *
 * 6. jwt.decode() does NOT verify the signature.
 *
 * 7. Never use decode() as an authentication mechanism.
 *
 * 8. Authentication and authorization are different concepts.
 *
 * 9. Explicitly restrict accepted algorithms where appropriate.
 *
 * 10. Protect JWT signing keys/secrets.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\14_jwt\verify_token.js
 *
 * ============================================================
 */
