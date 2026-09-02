/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/decode_token.js
 *
 * Topic:
 * JWT Decoding
 *
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 1. JWT Secret
 * ============================================================
 *
 * This is only needed to CREATE the example token.
 *
 * `jwt.decode()` itself does NOT require the secret.
 *
 * ============================================================
 */

const JWT_SECRET = "my-super-secret-key-for-learning";

/*
 * ============================================================
 * 2. Create a sample JWT
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
 * 3. JWT consists of three parts
 * ============================================================
 *
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *
 *
 * Example:
 *
 *
 *     eyJhbGciOiJIUzI1NiJ9
 *     .
 *     eyJzdWIiOiJ1c2VyXzEyMyJ9
 *     .
 *     abc123...
 *
 *
 * The three parts are:
 *
 *     1. Header
 *     2. Payload
 *     3. Signature
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Split the JWT
 * ============================================================
 */

const parts = token.split(".");

console.log("\nNumber of JWT parts:");
console.log(parts.length);

/*
 * Expected:
 *
 *     3
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Get individual parts
 * ============================================================
 */

const headerPart = parts[0];
const payloadPart = parts[1];
const signaturePart = parts[2];

console.log("\nHeader part:");
console.log(headerPart);

console.log("\nPayload part:");
console.log(payloadPart);

console.log("\nSignature part:");
console.log(signaturePart);

/*
 * ============================================================
 * 6. Decode using jwt.decode()
 * ============================================================
 *
 * IMPORTANT:
 *
 * jwt.decode() ONLY decodes the token.
 *
 * It does NOT verify the signature.
 *
 * ============================================================
 */

const decoded = jwt.decode(token);

console.log("\nDecoded payload:");
console.log(decoded);

/*
 * Expected structure is similar to:
 *
 *     {
 *       sub: "user_123",
 *       email: "shiva@example.com",
 *       role: "user",
 *       iat: ........................,
 *       exp: ........................
 *     }
 *
 *
 * `iat`:
 *
 *     Issued At
 *
 *
 * `exp`:
 *
 *     Expiration time
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Decode header
 * ============================================================
 *
 * jsonwebtoken allows:
 *
 *     jwt.decode(token, { complete: true })
 *
 *
 * This gives us:
 *
 *     header
 *     payload
 *     signature
 *
 * ============================================================
 */

const completeDecoded = jwt.decode(token, {
  complete: true,
});

console.log("\nComplete decoded JWT:");
console.log(completeDecoded);

/*
 * The result is conceptually:
 *
 *
 * {
 *   header: {
 *     alg: "HS256",
 *     typ: "JWT"
 *   },
 *
 *   payload: {
 *     sub: "user_123",
 *     email: "shiva@example.com",
 *     role: "user",
 *     iat: ...,
 *     exp: ...
 *   },
 *
 *   signature: "..."
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Header
 * ============================================================
 *
 * The JWT header contains metadata about the token.
 *
 *
 * Common fields:
 *
 *     alg
 *     typ
 *
 *
 * Example:
 *
 *     {
 *       "alg": "HS256",
 *       "typ": "JWT"
 *     }
 *
 *
 * `alg`
 *
 *     The cryptographic algorithm used to sign the token.
 *
 *
 * `typ`
 *
 *     Token type.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Payload
 * ============================================================
 *
 * The payload contains claims.
 *
 *
 * Our custom claims:
 *
 *     sub
 *     email
 *     role
 *
 *
 * jsonwebtoken also added registered claims such as:
 *
 *     iat
 *     exp
 *
 *
 * JWT payloads should contain only the information needed
 * for your authentication/authorization design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Signature
 * ============================================================
 *
 * The signature is used to detect tampering and authenticate
 * the token's origin according to the signing key and
 * algorithm.
 *
 *
 * For an HMAC JWT:
 *
 *
 *     encodedHeader
 *          +
 *     encodedPayload
 *          +
 *     secret
 *          │
 *          ▼
 *        HMAC
 *          │
 *          ▼
 *      signature
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. JWT is Base64URL encoded
 * ============================================================
 *
 * The header and payload are represented using Base64URL
 * encoding.
 *
 *
 * IMPORTANT:
 *
 * Base64URL encoding is NOT encryption.
 *
 *
 * Anyone who has the token can decode the header and payload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Manually decode the payload
 * ============================================================
 *
 * We can demonstrate the encoding directly using Node.js.
 *
 * NOTE:
 *
 * This is for understanding JWT internals.
 *
 * In application code, prefer the JWT library rather than
 * manually parsing tokens.
 *
 * ============================================================
 */

const decodedPayloadBuffer = Buffer.from(payloadPart, "base64url");

const decodedPayloadString = decodedPayloadBuffer.toString("utf8");

console.log("\nManually decoded payload:");
console.log(decodedPayloadString);

/*
 * ============================================================
 * 13. Convert JSON string to JavaScript object
 * ============================================================
 */

const manuallyDecodedPayload = JSON.parse(decodedPayloadString);

console.log("\nJavaScript object:");
console.log(manuallyDecodedPayload);

/*
 * ============================================================
 * 14. Decode header manually
 * ============================================================
 */

const decodedHeaderBuffer = Buffer.from(headerPart, "base64url");

const decodedHeaderString = decodedHeaderBuffer.toString("utf8");

console.log("\nManually decoded header:");
console.log(decodedHeaderString);

/*
 * ============================================================
 * 15. Why Base64URL?
 * ============================================================
 *
 * JWT uses Base64URL-safe encoding so the token can safely
 * travel through common HTTP contexts.
 *
 *
 * Conceptually:
 *
 *     JavaScript object
 *            │
 *            ▼
 *          JSON
 *            │
 *            ▼
 *       Base64URL
 *            │
 *            ▼
 *      JWT component
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. CRITICAL: Decode != Verify
 * ============================================================
 *
 *
 *     jwt.decode(token)
 *
 * means:
 *
 *     "Read the contents of this token."
 *
 *
 *
 *     jwt.verify(token, secret)
 *
 * means:
 *
 *     "Verify this token according to the supplied key and
 *      verification configuration."
 *
 *
 * These are NOT equivalent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Dangerous example
 * ============================================================
 *
 * NEVER do authentication like this:
 *
 *
 *     const user = jwt.decode(token);
 *
 *     if (user.role === "admin") {
 *       allowAdminAccess();
 *     }
 *
 *
 * Why?
 *
 * Because decode() doesn't establish that the claims are
 * authentic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Correct approach
 * ============================================================
 */

try {
  const verifiedUser = jwt.verify(token, JWT_SECRET);

  console.log("\nVerified user:");
  console.log(verifiedUser);
} catch (error) {
  console.error("JWT verification failed:", error.message);
}

/*
 * ============================================================
 * 19. Why decoding is still useful
 * ============================================================
 *
 * Decoding can be useful for:
 *
 *     - Debugging
 *     - Inspecting token structure
 *     - Development tools
 *     - Understanding JWT claims
 *     - Reading metadata when trust is NOT being established
 *
 *
 * But don't use decoded data as authenticated identity unless
 * the token has been properly verified.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. JWT claims
 * ============================================================
 *
 * Claims are pieces of information about the subject/token.
 *
 *
 * Common registered claims:
 *
 *
 *     iss
 *     └── issuer
 *
 *
 *     sub
 *     └── subject
 *
 *
 *     aud
 *     └── audience
 *
 *
 *     exp
 *     └── expiration time
 *
 *
 *     nbf
 *     └── not valid before
 *
 *
 *     iat
 *     └── issued at
 *
 *
 *     jti
 *     └── JWT ID
 *
 *
 * We will study these in more detail later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. JWT example
 * ============================================================
 *
 *
 * HEADER
 *
 *     {
 *       "alg": "HS256",
 *       "typ": "JWT"
 *     }
 *
 *
 * PAYLOAD
 *
 *     {
 *       "sub": "user_123",
 *       "email": "shiva@example.com",
 *       "role": "user",
 *       "iat": 1234567890,
 *       "exp": 1234568790
 *     }
 *
 *
 * SIGNATURE
 *
 *     generated cryptographic signature
 *
 *
 * Final token:
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Never put sensitive information in payload
 * ============================================================
 *
 * DON'T:
 *
 *     {
 *       password: "secret123"
 *     }
 *
 *
 * DON'T:
 *
 *     {
 *       creditCard: "..."
 *     }
 *
 *
 * DON'T:
 *
 *     {
 *       passwordHash: "..."
 *     }
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
 * 23. Token tampering
 * ============================================================
 *
 * Imagine an attacker changes:
 *
 *
 *     role: "user"
 *
 *
 * to:
 *
 *
 *     role: "admin"
 *
 *
 * They can modify the encoded payload representation.
 *
 * But unless they can produce a valid corresponding signature,
 * verification should reject the modified token.
 *
 *
 * Therefore:
 *
 *     decode()
 *         → can read modified contents
 *
 *
 *     verify()
 *         → detects invalid signature
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Authentication flow
 * ============================================================
 *
 *
 *             CLIENT
 *                │
 *                │ JWT
 *                ▼
 *             SERVER
 *                │
 *                ▼
 *          jwt.verify()
 *                │
 *          ┌─────┴─────┐
 *          │           │
 *       invalid       valid
 *          │           │
 *          ▼           ▼
 *         401      verified claims
 *                      │
 *                      ▼
 *                Authorization
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Key Takeaways
 * ============================================================
 *
 * 1. JWT consists of:
 *
 *        Header.Payload.Signature
 *
 *
 * 2. Header contains token metadata.
 *
 * 3. Payload contains claims.
 *
 * 4. Signature protects token integrity/authenticity.
 *
 * 5. JWT payload is Base64URL encoded, not encrypted by
 *    default.
 *
 * 6. Anyone possessing the token can potentially read its
 *    payload.
 *
 * 7. jwt.decode() does NOT verify the signature.
 *
 * 8. jwt.verify() verifies the token.
 *
 * 9. Never use jwt.decode() as authentication.
 *
 * 10. Never put passwords or other secrets in a JWT payload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\14_jwt\decode_token.js
 *
 * ============================================================
 */
