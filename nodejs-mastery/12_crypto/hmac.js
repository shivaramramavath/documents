/**
 * ============================================================
 * NODE.JS CRYPTO - HMAC
 * ============================================================
 *
 * File:
 *     12_crypto/hmac.js
 *
 * ============================================================
 *
 * WHAT IS HMAC?
 * ============================================================
 *
 * HMAC = Hash-based Message Authentication Code
 *
 * HMAC combines:
 *
 *     1. A cryptographic hash function
 *     2. A secret key
 *     3. The message/data
 *
 *
 *              Secret Key
 *                   │
 *                   ↓
 * Message ───────→ HMAC
 *                   │
 *                   ↓
 *             Authentication
 *                  Tag
 *
 * ============================================================
 *
 * HMAC provides:
 *
 *     ✓ Integrity
 *     ✓ Authentication
 *
 * It does NOT provide:
 *
 *     ✗ Encryption
 *     ✗ Confidentiality
 *
 * ============================================================
 *
 * HASH vs HMAC
 * ============================================================
 *
 * Hash:
 *
 *     SHA256(data)
 *
 *
 * HMAC:
 *
 *     HMAC(secret, data)
 *
 *
 * Anyone can calculate a normal hash if they know the data.
 *
 * An HMAC requires the secret key.
 *
 * ============================================================
 */

const { createHmac, timingSafeEqual } = require("node:crypto");

/*
 * ============================================================
 * 1. Create an HMAC
 * ============================================================
 */

const secret = "my-super-secret-key";

const message = "Hello Node.js";

const hmac = createHmac("sha256", secret);

/*
 * ============================================================
 * 2. Add message
 * ============================================================
 */

hmac.update(message);

/*
 * ============================================================
 * 3. Generate HMAC
 * ============================================================
 */

const digest = hmac.digest("hex");

console.log("HMAC:", digest);

/*
 * ============================================================
 *
 * digest() finalizes the HMAC object.
 *
 * After digest(), do not call update() again on the same object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. One-line HMAC
 * ============================================================
 */

const simpleHmac = createHmac("sha256", secret).update(message).digest("hex");

console.log(simpleHmac);

/*
 * ============================================================
 * 5. HMAC with SHA-512
 * ============================================================
 */

const sha512Hmac = createHmac("sha512", secret).update(message).digest("hex");

console.log("SHA-512 HMAC:", sha512Hmac);

/*
 * ============================================================
 * 6. HMAC with SHA-384
 * ============================================================
 */

const sha384Hmac = createHmac("sha384", secret).update(message).digest("hex");

console.log("SHA-384 HMAC:", sha384Hmac);

/*
 * ============================================================
 * 7. HMAC with Buffer data
 * ============================================================
 */

const data = Buffer.from("Binary data");

const bufferHmac = createHmac("sha256", secret).update(data).digest("hex");

console.log("Buffer HMAC:", bufferHmac);

/*
 * ============================================================
 * 8. Multiple update() calls
 * ============================================================
 */

const chunked = createHmac("sha256", secret);

chunked.update("Hello ");

chunked.update("Node ");

chunked.update("World");

const chunkedHmac = chunked.digest("hex");

console.log("Chunked HMAC:", chunkedHmac);

/*
 * ============================================================
 * 9. Verify chunked HMAC
 * ============================================================
 */

const normal = createHmac("sha256", secret)
  .update("Hello Node World")
  .digest("hex");

console.log("Equal:", chunkedHmac === normal);

/*
 * ============================================================
 * 10. Different secret produces different HMAC
 * ============================================================
 */

const hmacA = createHmac("sha256", "secret-a").update(message).digest("hex");

const hmacB = createHmac("sha256", "secret-b").update(message).digest("hex");

console.log("HMAC A:", hmacA);

console.log("HMAC B:", hmacB);

/*
 * Even though the message is identical, changing the secret
 * changes the authentication tag.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Different message produces different HMAC
 * ============================================================
 */

const originalMessage = createHmac("sha256", secret)
  .update("Hello")
  .digest("hex");

const modifiedMessage = createHmac("sha256", secret)
  .update("hello")
  .digest("hex");

console.log("Original:", originalMessage);

console.log("Modified:", modifiedMessage);

/*
 * ============================================================
 * 12. Create reusable HMAC function
 * ============================================================
 */

function createSignature(data, secretKey) {
  return createHmac("sha256", secretKey).update(data).digest("hex");
}

const signature = createSignature("Important message", secret);

console.log("Signature:", signature);

/*
 * ============================================================
 * 13. Verify an HMAC
 * ============================================================
 *
 * The receiver calculates an HMAC using:
 *
 *     received message
 *     shared secret
 *
 * Then compares it with the received authentication tag.
 *
 * ============================================================
 */

function verifySignature(data, secretKey, expectedSignature) {
  const actualSignature = createHmac("sha256", secretKey)
    .update(data)
    .digest("hex");

  return actualSignature === expectedSignature;
}

const generated = createSignature("Payment request", secret);

console.log("Valid:", verifySignature("Payment request", secret, generated));

/*
 * ============================================================
 * 14. Invalid message
 * ============================================================
 */

console.log(
  "Valid:",
  verifySignature("Modified payment request", secret, generated),
);

/*
 * ============================================================
 * 15. Invalid secret
 * ============================================================
 */

console.log(
  "Valid:",
  verifySignature("Payment request", "wrong-secret", generated),
);

/*
 * ============================================================
 * 16. Why timing-safe comparison?
 * ============================================================
 *
 * For security-sensitive MAC/signature comparisons, avoid
 * ordinary string comparison when an attacker could observe
 * timing differences.
 *
 * Node.js provides:
 *
 *     timingSafeEqual()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Timing-safe HMAC verification
 * ============================================================
 */

function createHmacBuffer(data, secretKey) {
  return createHmac("sha256", secretKey).update(data).digest();
}

function verifyHmac(data, secretKey, expected) {
  const actual = createHmacBuffer(data, secretKey);

  /*
   * timingSafeEqual() requires Buffers of equal length.
   */

  if (!Buffer.isBuffer(expected)) {
    return false;
  }

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

const expected = createHmacBuffer("Hello", secret);

console.log("Timing-safe verification:", verifyHmac("Hello", secret, expected));

/*
 * ============================================================
 * 18. Invalid HMAC using timingSafeEqual()
 * ============================================================
 */

const invalid = createHmacBuffer("Different message", secret);

console.log("Valid:", verifyHmac("Hello", secret, invalid));

/*
 * ============================================================
 * 19. Hex HMAC → Buffer
 * ============================================================
 */

const hexHmac = createHmac("sha256", secret).update(message).digest("hex");

const expectedBuffer = Buffer.from(hexHmac, "hex");

console.log("Expected bytes:", expectedBuffer);

/*
 * ============================================================
 * 20. Timing-safe comparison of hexadecimal HMAC
 * ============================================================
 */

function verifyHexHmac(data, secretKey, expectedHex) {
  const actual = createHmac("sha256", secretKey).update(data).digest();

  const expected = Buffer.from(expectedHex, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

console.log(verifyHexHmac(message, secret, hexHmac));

/*
 * ============================================================
 * 21. HMAC for API authentication
 * ============================================================
 *
 * A simplified request could contain:
 *
 *
 *     POST /payments
 *
 *     Body:
 *         {"amount":100}
 *
 *     X-Signature:
 *         HMAC(secret, body)
 *
 *
 * Server:
 *
 *     receivedBody
 *          ↓
 *     HMAC(serverSecret, body)
 *          ↓
 *     compare with X-Signature
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. API request signing example
 * ============================================================
 */

const requestBody = JSON.stringify({
  userId: 123,
  amount: 500,
});

const apiSecret = "api-shared-secret";

const requestSignature = createSignature(requestBody, apiSecret);

console.log("Request body:", requestBody);

console.log("Signature:", requestSignature);

/*
 * Server:
 */

const requestIsValid = verifyHexHmac(requestBody, apiSecret, requestSignature);

console.log("Request valid:", requestIsValid);

/*
 * ============================================================
 * 23. HMAC with timestamp
 * ============================================================
 *
 * Real request-signing systems often include freshness data
 * such as:
 *
 *     timestamp
 *     nonce
 *     request body
 *     HTTP method
 *     URL/path
 *
 *
 * Example canonical data:
 *
 *     POST
 *     /payments
 *     1690000000
 *     {"amount":500}
 *
 *
 * Then:
 *
 *     HMAC(secret, canonicalData)
 *
 * This helps prevent replay attacks when combined with
 * appropriate server-side freshness/replay checks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Timestamp signing example
 * ============================================================
 */

const timestamp = Math.floor(Date.now() / 1000);

const canonicalData = ["POST", "/payments", timestamp, requestBody].join("\n");

const timestampSignature = createSignature(canonicalData, apiSecret);

console.log("Canonical data:", canonicalData);

console.log("Timestamp signature:", timestampSignature);

/*
 * ============================================================
 * 25. HMAC is not encryption
 * ============================================================
 *
 * HMAC:
 *
 *     message + secret
 *          ↓
 *        HMAC
 *          ↓
 *        tag
 *
 *
 * The original message remains readable.
 *
 *
 * Encryption:
 *
 *     message + key
 *          ↓
 *       encrypt
 *          ↓
 *     ciphertext
 *
 *
 * The ciphertext is intended to hide the message.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Hash vs HMAC
 * ============================================================
 *
 *
 * HASH
 *
 *     createHash("sha256")
 *       .update(data)
 *       .digest("hex");
 *
 *
 * HMAC
 *
 *     createHmac("sha256", secret)
 *       .update(data)
 *       .digest("hex");
 *
 *
 * Hash:
 *
 *     No secret required.
 *
 *
 * HMAC:
 *
 *     Secret key required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. HMAC architecture
 * ============================================================
 *
 *
 *       Sender
 *          │
 *          │ message
 *          │
 *          ├───────────────┐
 *          │               │
 *          ↓               ↓
 *       message         secret
 *          │               │
 *          └───────┬───────┘
 *                  ↓
 *                HMAC
 *                  ↓
 *                 tag
 *                  │
 *                  ↓
 *             Send message
 *             + HMAC tag
 *
 *
 *
 *       Receiver
 *          │
 *          ├── message
 *          ├── tag
 *          │
 *          ↓
 *        secret
 *          │
 *          ↓
 *        HMAC
 *          │
 *          ↓
 *      calculated tag
 *          │
 *          ↓
 *      timing-safe compare
 *          │
 *      ┌───┴────┐
 *      ↓        ↓
 *    valid    invalid
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Secret key handling
 * ============================================================
 *
 * NEVER hard-code production secrets like:
 *
 *     const secret = "my-password";
 *
 *
 * Instead, load secrets from secure configuration:
 *
 *
 *     process.env.HMAC_SECRET
 *
 *
 * Example:
 *
 *     const secret =
 *       process.env.HMAC_SECRET;
 *
 *
 * Environment/configuration management will be covered later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Key should be sufficiently random
 * ============================================================
 *
 * HMAC security depends on the secret key remaining secret.
 *
 * Prefer a cryptographically random key rather than:
 *
 *     "password123"
 *
 *     "secret"
 *
 *     "my-key"
 *
 *
 * Node.js crypto.randomBytes() can generate random key material.
 *
 * That is covered in:
 *
 *     12_crypto/random_bytes.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. HMAC output formats
 * ============================================================
 *
 * digest():
 *
 *     Buffer
 *
 *
 * digest("hex"):
 *
 *     hexadecimal string
 *
 *
 * digest("base64"):
 *
 *     Base64 string
 *
 *
 * Choose the representation based on the protocol or storage
 * format you are implementing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Base64 HMAC
 * ============================================================
 */

const base64Hmac = createHmac("sha256", secret)
  .update(message)
  .digest("base64");

console.log("Base64 HMAC:", base64Hmac);

/*
 * ============================================================
 * 32. HMAC with binary data
 * ============================================================
 */

const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xff]);

const binaryHmac = createHmac("sha256", secret)
  .update(binaryData)
  .digest("hex");

console.log("Binary HMAC:", binaryHmac);

/*
 * ============================================================
 * 33. Practical reusable signer
 * ============================================================
 */

class HmacSigner {
  constructor(secretKey, algorithm = "sha256") {
    this.secretKey = secretKey;

    this.algorithm = algorithm;
  }

  sign(data) {
    return createHmac(this.algorithm, this.secretKey)
      .update(data)
      .digest("hex");
  }

  verify(data, signature) {
    const actual = createHmac(this.algorithm, this.secretKey)
      .update(data)
      .digest();

    const expected = Buffer.from(signature, "hex");

    if (actual.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(actual, expected);
  }
}

const signer = new HmacSigner(secret);

const signedData = signer.sign("Node.js Mastery");

console.log("Signed:", signedData);

console.log("Verified:", signer.verify("Node.js Mastery", signedData));

console.log(
  "Verified after modification:",
  signer.verify("Node.js mastery", signedData),
);

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const {
 *       createHmac
 *     } = require("node:crypto");
 *
 *
 * Create HMAC:
 *
 *     createHmac(
 *       "sha256",
 *       secret
 *     );
 *
 *
 * Add data:
 *
 *     hmac.update(data);
 *
 *
 * Generate:
 *
 *     hmac.digest("hex");
 *
 *
 * One-liner:
 *
 *     createHmac(
 *       "sha256",
 *       secret
 *     )
 *       .update(data)
 *       .digest("hex");
 *
 *
 * Buffer output:
 *
 *     hmac.digest();
 *
 *
 * Base64:
 *
 *     hmac.digest("base64");
 *
 *
 * Timing-safe comparison:
 *
 *     timingSafeEqual(
 *       actual,
 *       expected
 *     );
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * HMAC proves that data was authenticated by someone who
 * possesses the shared secret key.
 *
 *
 *     DATA + SECRET
 *          ↓
 *        HMAC
 *          ↓
 *       TAG
 *
 *
 * HMAC provides:
 *
 *     ✓ Integrity
 *     ✓ Authentication
 *
 * HMAC does NOT provide:
 *
 *     ✗ Encryption
 *     ✗ Confidentiality
 *
 * ============================================================
 */
