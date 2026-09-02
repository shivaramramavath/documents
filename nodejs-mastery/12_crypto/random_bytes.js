/**
 * ============================================================
 * NODE.JS CRYPTO - RANDOM BYTES
 * ============================================================
 *
 * File:
 *     12_crypto/random_bytes.js
 *
 * ============================================================
 *
 * WHAT ARE RANDOM BYTES?
 * ============================================================
 *
 * Random bytes are bytes generated using a cryptographically
 * secure random number generator.
 *
 * Node.js provides this through:
 *
 *     crypto.randomBytes()
 *
 * Random bytes are commonly used for:
 *
 *     - Security tokens
 *     - Session IDs
 *     - API keys
 *     - Reset tokens
 *     - Nonces
 *     - Encryption keys
 *     - Authentication secrets
 *     - Temporary identifiers
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * Math.random() is NOT suitable for security-sensitive
 * random values.
 *
 * Use:
 *
 *     crypto.randomBytes()
 *
 * ============================================================
 */

const { randomBytes } = require("node:crypto");

/*
 * ============================================================
 * 1. Generate random bytes
 * ============================================================
 */

const bytes = randomBytes(16);

console.log("Random bytes:", bytes);

/*
 * ============================================================
 * 2. Understand the size
 * ============================================================
 *
 * randomBytes(16)
 *
 * means:
 *
 *     16 bytes
 *
 * Since:
 *
 *     1 byte = 8 bits
 *
 * therefore:
 *
 *     16 × 8 = 128 bits
 *
 * ============================================================
 */

console.log("Number of bytes:", bytes.length);

/*
 * ============================================================
 * 3. Generate hexadecimal output
 * ============================================================
 *
 * Buffer can be converted to hexadecimal.
 *
 * Each byte becomes two hexadecimal characters.
 *
 *     16 bytes
 *        ↓
 *     32 hex characters
 *
 * ============================================================
 */

const hexToken = randomBytes(16).toString("hex");

console.log("Hex token:", hexToken);

console.log("Hex length:", hexToken.length);

/*
 * ============================================================
 * 4. Generate a 32-byte random value
 * ============================================================
 */

const random32 = randomBytes(32);

console.log("32 random bytes:", random32);

/*
 * ============================================================
 * 5. Convert 32 bytes to hex
 * ============================================================
 */

const random32Hex = randomBytes(32).toString("hex");

console.log("32-byte hex:", random32Hex);

console.log("Length:", random32Hex.length);

/*
 * 32 bytes:
 *
 *     256 bits
 *
 * Hex representation:
 *
 *     64 characters
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Generate Base64 random data
 * ============================================================
 */

const base64Token = randomBytes(32).toString("base64");

console.log("Base64 token:", base64Token);

/*
 * ============================================================
 * 7. Generate Base64URL data
 * ============================================================
 *
 * Base64URL is useful when the value needs to safely appear
 * inside URLs or HTTP-related values.
 *
 * Node.js supports:
 *
 *     base64url
 *
 * ============================================================
 */

const base64UrlToken = randomBytes(32).toString("base64url");

console.log("Base64URL token:", base64UrlToken);

/*
 * ============================================================
 * 8. Generate a security token
 * ============================================================
 */

function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

const token = generateToken();

console.log("Security token:", token);

/*
 * ============================================================
 * 9. Generate a custom-size token
 * ============================================================
 */

const smallToken = generateToken(16);

const largeToken = generateToken(64);

console.log("16-byte token:", smallToken);

console.log("64-byte token:", largeToken);

/*
 * ============================================================
 * 10. Why randomBytes() instead of Math.random()?
 * ============================================================
 *
 * Math.random():
 *
 *     Math.random()
 *
 * is designed for general-purpose pseudo-random values.
 *
 * It is NOT a cryptographic random number generator.
 *
 *
 * Example:
 *
 *     const value =
 *       Math.random();
 *
 *
 * DO NOT use this for:
 *
 *     passwords
 *     authentication tokens
 *     session IDs
 *     password reset tokens
 *     encryption keys
 *
 *
 * Use:
 *
 *     randomBytes()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Generate a password reset token
 * ============================================================
 */

function generateResetToken() {
  return randomBytes(32).toString("hex");
}

const resetToken = generateResetToken();

console.log("Reset token:", resetToken);

/*
 * ============================================================
 * 12. Generate an API key
 * ============================================================
 */

function generateApiKey() {
  return "api_" + randomBytes(32).toString("hex");
}

const apiKey = generateApiKey();

console.log("API key:", apiKey);

/*
 * ============================================================
 * 13. Generate a session ID
 * ============================================================
 */

function generateSessionId() {
  return randomBytes(32).toString("hex");
}

const sessionId = generateSessionId();

console.log("Session ID:", sessionId);

/*
 * ============================================================
 * 14. Generate a nonce
 * ============================================================
 *
 * A nonce is a value intended to be used once.
 *
 * Depending on the cryptographic protocol, a nonce may be:
 *
 *     random
 *     unique
 *     counter-based
 *
 * Do not assume that every protocol requires the same type.
 *
 * ============================================================
 */

function generateNonce() {
  return randomBytes(16).toString("hex");
}

const nonce = generateNonce();

console.log("Nonce:", nonce);

/*
 * ============================================================
 * 15. Generate an encryption key
 * ============================================================
 *
 * Cryptographic keys should be generated using a
 * cryptographically secure random source.
 *
 * Example:
 *
 *     32 bytes = 256 bits
 *
 * ============================================================
 */

const encryptionKey = randomBytes(32);

console.log("Encryption key:", encryptionKey.toString("hex"));

/*
 * ============================================================
 * 16. Generate multiple random values
 * ============================================================
 */

for (let i = 0; i < 5; i++) {
  const value = randomBytes(16).toString("hex");

  console.log(`Random ${i + 1}:`, value);
}

/*
 * Every call should produce a different random value.
 *
 * There is no guarantee that values can never collide, but
 * with sufficient random space, the probability can be made
 * extremely small.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Random bytes as a Buffer
 * ============================================================
 */

const buffer = randomBytes(8);

console.log("Buffer:", buffer);

console.log("Array:", [...buffer]);

/*
 * Example output might look like:
 *
 *     <Buffer 4a 91 ...>
 *
 * The exact values are different on every execution.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Convert random bytes to Uint8Array
 * ============================================================
 */

const randomData = randomBytes(8);

const uint8 = new Uint8Array(randomData);

console.log("Uint8Array:", uint8);

/*
 * ============================================================
 * 19. Random integer from random bytes
 * ============================================================
 *
 * randomBytes() itself produces bytes.
 *
 * For secure random integers, Node.js also provides:
 *
 *     crypto.randomInt()
 *
 * This file focuses on randomBytes().
 *
 * randomInt() can be explored later as another crypto
 * primitive when needed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Asynchronous randomBytes()
 * ============================================================
 *
 * randomBytes() supports a callback form.
 *
 * This can be useful when avoiding synchronous work in a
 * performance-sensitive application.
 *
 * ============================================================
 */

randomBytes(16, (error, result) => {
  if (error) {
    console.error("Random generation failed:", error);

    return;
  }

  console.log("Async random bytes:", result.toString("hex"));
});

/*
 * ============================================================
 * 21. Synchronous vs asynchronous
 * ============================================================
 *
 * Synchronous:
 *
 *     randomBytes(32)
 *
 *
 * Asynchronous:
 *
 *     randomBytes(
 *       32,
 *       callback
 *     );
 *
 *
 * Synchronous APIs block the current JavaScript execution
 * until the operation completes.
 *
 * For small random values this is generally straightforward,
 * but application architecture and workload still matter.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Generate a URL-safe token
 * ============================================================
 */

function generateUrlToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

const urlToken = generateUrlToken();

console.log("URL token:", urlToken);

/*
 * ============================================================
 * 23. Generate a verification token
 * ============================================================
 */

function generateVerificationToken() {
  return randomBytes(32).toString("hex");
}

const verificationToken = generateVerificationToken();

console.log("Verification token:", verificationToken);

/*
 * ============================================================
 * 24. Token with prefix
 * ============================================================
 *
 * A prefix can make tokens easier to identify by type.
 *
 * ============================================================
 */

function createPrefixedToken(prefix, bytes = 32) {
  return `${prefix}_` + randomBytes(bytes).toString("hex");
}

const userToken = createPrefixedToken("usr");

const sessionToken = createPrefixedToken("ses");

console.log("User token:", userToken);

console.log("Session token:", sessionToken);

/*
 * ============================================================
 * 25. Random token storage
 * ============================================================
 *
 * Suppose a password reset token is generated:
 *
 *
 *     token
 *       ↓
 *     database
 *
 *
 * A production application should carefully consider how
 * sensitive tokens are stored.
 *
 * One common design is:
 *
 *     raw token
 *         ↓
 *     hash
 *         ↓
 *     store hash
 *
 *
 * Then:
 *
 *     user submits token
 *         ↓
 *     hash submitted token
 *         ↓
 *     compare stored hash
 *
 *
 * This limits exposure if the database is compromised.
 *
 * The exact implementation depends on the application's
 * threat model and token lifecycle.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Generate a one-time token
 * ============================================================
 */

function createOneTimeToken() {
  const token = randomBytes(32).toString("hex");

  return token;
}

const oneTimeToken = createOneTimeToken();

console.log("One-time token:", oneTimeToken);

/*
 * ============================================================
 * 27. Token entropy
 * ============================================================
 *
 * Entropy describes the uncertainty/randomness available to
 * an attacker trying to guess a value.
 *
 *
 * 16 random bytes:
 *
 *     16 × 8 = 128 bits
 *
 *
 * 32 random bytes:
 *
 *     32 × 8 = 256 bits
 *
 *
 * 64 random bytes:
 *
 *     64 × 8 = 512 bits
 *
 *
 * More bytes → larger possible value space.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Hex length calculation
 * ============================================================
 *
 * Every byte becomes two hexadecimal characters.
 *
 *
 *     bytes × 2 = hex characters
 *
 *
 * Examples:
 *
 *     16 bytes → 32 characters
 *     32 bytes → 64 characters
 *     64 bytes → 128 characters
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Base64 vs hexadecimal
 * ============================================================
 *
 * Hex:
 *
 *     Easy to read
 *     Easy to log/debug
 *     Takes more characters
 *
 *
 * Base64:
 *
 *     More compact
 *     Useful for transport/storage
 *
 *
 * Base64URL:
 *
 *     Designed for URL-safe representation
 *
 *
 * Example:
 *
 *     randomBytes(32)
 *       .toString("hex");
 *
 *
 *     randomBytes(32)
 *       .toString("base64");
 *
 *
 *     randomBytes(32)
 *       .toString("base64url");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. NEVER log production secrets
 * ============================================================
 *
 * This file prints tokens for learning purposes.
 *
 * In production:
 *
 *     DO NOT console.log()
 *
 *     API keys
 *     session secrets
 *     reset tokens
 *     encryption keys
 *     authentication secrets
 *
 *
 * Logs may be stored, shipped, indexed, or exposed to other
 * systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Random bytes and UUID
 * ============================================================
 *
 * randomBytes() generates arbitrary random byte sequences.
 *
 *
 * UUID:
 *
 *     randomUUID()
 *
 * generates a standardized UUID representation.
 *
 *
 * Example:
 *
 *     randomBytes(32)
 *
 * gives raw random material.
 *
 *
 *     randomUUID()
 *
 * gives a UUID-formatted identifier.
 *
 *
 * random_uuid.js covers randomUUID().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Random bytes and cryptographic keys
 * ============================================================
 *
 * Example:
 *
 *     32 random bytes
 *
 * can provide 256 bits of random key material.
 *
 *
 *     randomBytes(32)
 *
 *
 * But the correct key size depends on the cryptographic
 * algorithm and protocol.
 *
 * Never arbitrarily reuse one key for unrelated purposes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Random bytes and HMAC
 * ============================================================
 *
 * HMAC needs a secret key.
 *
 * A secure random key can be generated with:
 *
 *     randomBytes()
 *
 *
 * Example:
 *
 *     const secret =
 *       randomBytes(32);
 *
 *
 * Then:
 *
 *     createHmac(
 *       "sha256",
 *       secret
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Random bytes and password reset flow
 * ============================================================
 *
 *
 * User requests password reset
 *              ↓
 *     Generate random token
 *              ↓
 *     Store token/hash + expiry
 *              ↓
 *     Send token to user
 *              ↓
 *     User submits token
 *              ↓
 *       Validate token
 *              ↓
 *       Check expiration
 *              ↓
 *      Allow password reset
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Random bytes and sessions
 * ============================================================
 *
 *
 * Login
 *   ↓
 * Generate random session ID
 *   ↓
 * Store session
 *   ↓
 * Send session identifier
 *   ↓
 * Browser sends it on future requests
 *
 *
 * Session identifiers must be unpredictable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Random bytes and API keys
 * ============================================================
 *
 * A simplified API key generator:
 */

function createApiKey() {
  const randomPart = randomBytes(32).toString("base64url");

  return `api_${randomPart}`;
}

console.log(createApiKey());

/*
 * ============================================================
 * 37. Random bytes and nonces
 * ============================================================
 *
 * Some cryptographic algorithms require nonces.
 *
 * IMPORTANT:
 *
 * The nonce requirements depend on the algorithm.
 *
 * Some require uniqueness.
 *
 * Some protocols use random nonces.
 *
 * Some require counters.
 *
 * Never assume:
 *
 *     "random = automatically correct nonce"
 *
 * Follow the specific algorithm's requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Error handling
 * ============================================================
 */

function safeRandomToken(size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new TypeError("Size must be a positive integer");
  }

  return randomBytes(size).toString("hex");
}

try {
  console.log(safeRandomToken(32));
} catch (error) {
  console.error(error);
}

/*
 * ============================================================
 * 39. Invalid size example
 * ============================================================
 */

try {
  safeRandomToken(-1);
} catch (error) {
  console.error("Invalid size:", error.message);
}

/*
 * ============================================================
 * 40. Practical token generator
 * ============================================================
 */

function generateSecureToken({ bytes = 32, encoding = "base64url" } = {}) {
  return randomBytes(bytes).toString(encoding);
}

console.log("Secure token:", generateSecureToken());

console.log(
  "Hex token:",
  generateSecureToken({
    bytes: 32,
    encoding: "hex",
  }),
);

/*
 * ============================================================
 * 41. Security checklist
 * ============================================================
 *
 * For security-sensitive random values:
 *
 *     ✓ Use crypto.randomBytes()
 *     ✓ Use sufficient random length
 *     ✓ Keep secrets private
 *     ✓ Avoid logging secrets
 *     ✓ Use secure storage
 *     ✓ Expire temporary tokens
 *     ✓ Make one-time tokens single-use
 *     ✓ Consider hashing stored reset tokens
 *     ✓ Follow algorithm-specific nonce requirements
 *
 *
 * Avoid:
 *
 *     ✗ Math.random()
 *     ✗ Date.now() as a secret
 *     ✗ Predictable counters as secrets
 *     ✗ Usernames as secrets
 *     ✗ Hard-coded production keys
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const {
 *       randomBytes
 *     } = require("node:crypto");
 *
 *
 * Generate Buffer:
 *
 *     randomBytes(32);
 *
 *
 * Generate hex:
 *
 *     randomBytes(32)
 *       .toString("hex");
 *
 *
 * Generate Base64:
 *
 *     randomBytes(32)
 *       .toString("base64");
 *
 *
 * Generate Base64URL:
 *
 *     randomBytes(32)
 *       .toString("base64url");
 *
 *
 * Async:
 *
 *     randomBytes(
 *       32,
 *       callback
 *     );
 *
 *
 * ============================================================
 *
 * COMMON SIZES
 * ============================================================
 *
 *     16 bytes = 128 bits
 *     24 bytes = 192 bits
 *     32 bytes = 256 bits
 *     64 bytes = 512 bits
 *
 *
 * ============================================================
 * KEY IDEA
 * ============================================================
 *
 * randomBytes() provides cryptographically strong random
 * bytes for security-sensitive applications.
 *
 *
 *             randomBytes()
 *                   ↓
 *          Secure random bytes
 *                   ↓
 *       ┌───────────┼───────────┐
 *       ↓           ↓           ↓
 *     Tokens      Keys        Nonces
 *       ↓           ↓           ↓
 *    Sessions    Encryption   Protocols
 *
 * ============================================================
 */
