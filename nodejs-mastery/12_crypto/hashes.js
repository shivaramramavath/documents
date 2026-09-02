/**
 * ============================================================
 * NODE.JS CRYPTO - HASHES
 * ============================================================
 *
 * File:
 *     12_crypto/hashes.js
 *
 * ============================================================
 *
 * WHAT IS A HASH?
 * ============================================================
 *
 * A cryptographic hash function converts input data into a
 * fixed-size output called a HASH or DIGEST.
 *
 *
 *     Input
 *       ↓
 *   Hash Function
 *       ↓
 *     Digest
 *
 *
 * Example:
 *
 *     "Hello"
 *        ↓
 *      SHA-256
 *        ↓
 * 185f8db32271fe25...
 *
 * ============================================================
 *
 * IMPORTANT PROPERTIES
 * ============================================================
 *
 * 1. Deterministic
 *
 *    Same input → same hash
 *
 *
 * 2. One-way
 *
 *    Hashing is designed to make recovering the original
 *    input computationally infeasible.
 *
 *
 * 3. Fixed-size output
 *
 *    Small and large inputs produce a digest of the algorithm's
 *    fixed output size.
 *
 *
 * 4. Avalanche effect
 *
 *    A tiny input change should produce a substantially different
 *    digest.
 *
 *
 * 5. Collision resistance
 *
 *    It should be computationally difficult to find two different
 *    inputs with the same digest.
 *
 * ============================================================
 *
 * HASHING ≠ ENCRYPTION
 * ============================================================
 *
 * Encryption:
 *
 *     plaintext
 *        ↓
 *      key
 *        ↓
 *    ciphertext
 *        ↓
 *      decrypt
 *        ↓
 *    plaintext
 *
 *
 * Hashing:
 *
 *     data
 *       ↓
 *     hash
 *       ↓
 *    digest
 *
 *
 * There is normally no "decrypt hash" operation.
 *
 * ============================================================
 */

const { createHash } = require("node:crypto");

/*
 * ============================================================
 * 1. Create a SHA-256 hash
 * ============================================================
 */

const hash = createHash("sha256");

/*
 * ============================================================
 * 2. Provide input using update()
 * ============================================================
 */

hash.update("Hello");

/*
 * ============================================================
 * 3. Generate digest
 * ============================================================
 */

const digest = hash.digest("hex");

console.log("SHA-256:", digest);

/*
 * ============================================================
 *
 * IMPORTANT:
 *
 * digest() finalizes the hash.
 *
 * You cannot continue using the same Hash object after
 * digest() has been called.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Hash in one expression
 * ============================================================
 */

const simpleHash = createHash("sha256").update("Hello").digest("hex");

console.log(simpleHash);

/*
 * ============================================================
 * 5. SHA-256
 * ============================================================
 *
 * SHA-256 produces:
 *
 *     256 bits
 *
 * Since:
 *
 *     8 bits = 1 byte
 *
 * therefore:
 *
 *     256 / 8 = 32 bytes
 *
 *
 * Hexadecimal representation:
 *
 *     32 bytes × 2 hex characters
 *     = 64 hex characters
 *
 * ============================================================
 */

console.log("Length:", simpleHash.length);

/*
 * ============================================================
 * 6. SHA-512
 * ============================================================
 */

const sha512 = createHash("sha512").update("Hello").digest("hex");

console.log("SHA-512:", sha512);

console.log("SHA-512 length:", sha512.length);

/*
 * SHA-512:
 *
 *     512 bits
 *     64 bytes
 *     128 hexadecimal characters
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. SHA-384
 * ============================================================
 */

const sha384 = createHash("sha384").update("Hello").digest("hex");

console.log("SHA-384:", sha384);

/*
 * ============================================================
 * 8. SHA-1
 * ============================================================
 *
 * SHA-1 is included here for educational purposes.
 *
 * DO NOT use SHA-1 for new security-sensitive applications.
 *
 * ============================================================
 */

const sha1 = createHash("sha1").update("Hello").digest("hex");

console.log("SHA-1:", sha1);

/*
 * ============================================================
 * 9. MD5
 * ============================================================
 *
 * MD5 is historically important but cryptographically broken.
 *
 * It should NOT be used for security purposes.
 *
 * It may still appear in legacy systems or non-security
 * integrity checks.
 *
 * ============================================================
 */

const md5 = createHash("md5").update("Hello").digest("hex");

console.log("MD5:", md5);

/*
 * ============================================================
 * 10. Compare two hashes
 * ============================================================
 */

const hash1 = createHash("sha256").update("Hello").digest("hex");

const hash2 = createHash("sha256").update("Hello").digest("hex");

console.log("Same:", hash1 === hash2);

/*
 * ============================================================
 * 11. Avalanche effect
 * ============================================================
 */

const helloHash = createHash("sha256").update("Hello").digest("hex");

const hello2Hash = createHash("sha256").update("hello").digest("hex");

console.log("Hello:", helloHash);

console.log("hello:", hello2Hash);

/*
 * Only one character changed:
 *
 *     Hello
 *     hello
 *
 * But the resulting digests are dramatically different.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Hash a Buffer
 * ============================================================
 */

const data = Buffer.from("Hello Node.js");

const bufferHash = createHash("sha256").update(data).digest("hex");

console.log(bufferHash);

/*
 * ============================================================
 * 13. Hash binary data
 * ============================================================
 */

const binary = Buffer.from([0, 1, 2, 3, 4, 255]);

const binaryHash = createHash("sha256").update(binary).digest("hex");

console.log("Binary hash:", binaryHash);

/*
 * ============================================================
 * 14. Different digest encodings
 * ============================================================
 */

const hashObject = createHash("sha256");

hashObject.update("Hello");

const hexDigest = hashObject.digest("hex");

console.log("Hex:", hexDigest);

/*
 * A Hash object is finalized after digest().
 *
 * To obtain another encoding, create another hash.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Digest as Buffer
 * ============================================================
 */

const digestBuffer = createHash("sha256").update("Hello").digest();

console.log(digestBuffer);

console.log("Digest bytes:", digestBuffer.length);

/*
 * SHA-256 digest:
 *
 *     32 bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Digest as Base64
 * ============================================================
 */

const base64Digest = createHash("sha256").update("Hello").digest("base64");

console.log("Base64:", base64Digest);

/*
 * ============================================================
 * 17. Different input types
 * ============================================================
 */

const text = "Hello";

const textHash = createHash("sha256").update(text, "utf8").digest("hex");

console.log(textHash);

/*
 * ============================================================
 * 18. Hash multiple chunks
 * ============================================================
 *
 * update() can be called multiple times before digest().
 *
 * ============================================================
 */

const chunkedHash = createHash("sha256");

chunkedHash.update("Hello ");

chunkedHash.update("Node ");

chunkedHash.update("World");

const chunkedDigest = chunkedHash.digest("hex");

console.log("Chunked:", chunkedDigest);

/*
 * This is equivalent to hashing:
 *
 *     "Hello Node World"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Verify chunked hashing
 * ============================================================
 */

const normalDigest = createHash("sha256")
  .update("Hello Node World")
  .digest("hex");

console.log("Equal:", chunkedDigest === normalDigest);

/*
 * ============================================================
 * 20. Hash a file using a stream
 * ============================================================
 *
 * Large files should generally be processed incrementally
 * rather than loaded entirely into memory.
 *
 * ============================================================
 */

const fs = require("node:fs");

const fileHash = createHash("sha256");

/*
 * Example:
 *
 * Replace "example.txt" with a real file.
 *
 * ============================================================
 */

// const stream = fs.createReadStream(
//   "example.txt",
// );
//
//
// stream.on(
//   "data",
//   (chunk) => {
//
//     fileHash.update(
//       chunk,
//     );
//
//   },
// );
//
//
// stream.on(
//   "end",
//   () => {
//
//     console.log(
//       "File SHA-256:",
//       fileHash.digest("hex"),
//     );
//
//   },
// );

/*
 * ============================================================
 * 21. Why streaming hashes matter
 * ============================================================
 *
 *
 * BAD for a huge file:
 *
 *     read entire file
 *          ↓
 *       Buffer
 *          ↓
 *       hash it
 *
 *
 * Better:
 *
 *     File
 *       ↓
 *     chunk
 *       ↓
 *     hash.update()
 *       ↓
 *     chunk
 *       ↓
 *     hash.update()
 *       ↓
 *     ...
 *       ↓
 *     digest()
 *
 *
 * This reduces memory pressure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Hash a JSON object
 * ============================================================
 *
 * JSON objects must first be serialized into bytes/text.
 *
 * ============================================================
 */

const user = {
  id: 1,
  name: "Shiva",
};

const userJson = JSON.stringify(user);

const userHash = createHash("sha256").update(userJson).digest("hex");

console.log("JSON:", userJson);

console.log("Hash:", userHash);

/*
 * IMPORTANT:
 *
 * Object property order and serialization choices can affect
 * the resulting string and therefore the hash.
 *
 * For canonical hashing of structured data, use a defined
 * canonical serialization strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. File integrity
 * ============================================================
 *
 * A hash can be used to detect whether data changed.
 *
 *
 * Original file:
 *
 *     File
 *       ↓
 *     SHA-256
 *       ↓
 *     expectedHash
 *
 *
 * Downloaded file:
 *
 *     File
 *       ↓
 *     SHA-256
 *       ↓
 *     actualHash
 *
 *
 * Compare:
 *
 *     actualHash === expectedHash
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Example integrity check
 * ============================================================
 */

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

const expected = sha256("Important data");

const received = sha256("Important data");

console.log("Integrity:", expected === received);

/*
 * ============================================================
 * 25. Detect modified data
 * ============================================================
 */

const originalData = "Important data";

const originalDigest = sha256(originalData);

const modifiedDigest = sha256("Important data!");

console.log("Modified:", originalDigest !== modifiedDigest);

/*
 * ============================================================
 * 26. Hashing is deterministic
 * ============================================================
 */

function hashText(text) {
  return createHash("sha256").update(text).digest("hex");
}

console.log(hashText("Node.js"));

console.log(hashText("Node.js"));

console.log(hashText("Node.js"));

/*
 * All three hashes are identical.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Empty input
 * ============================================================
 */

const emptyHash = createHash("sha256").update("").digest("hex");

console.log("Empty SHA-256:", emptyHash);

/*
 * Hash functions are defined for empty input too.
 *
 ============================================================
 */

/*
 * ============================================================
 * 28. Hash length summary
 * ============================================================
 *
 * Algorithm     Digest bits     Digest bytes
 *
 *     MD5           128              16
 *     SHA-1         160              20
 *     SHA-256       256              32
 *     SHA-384       384              48
 *     SHA-512       512              64
 *
 *
 * SHA-256 is a common general-purpose cryptographic hash.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Hashing vs password hashing
 * ============================================================
 *
 * DO NOT store passwords using:
 *
 *     SHA-256(password)
 *
 * by itself.
 *
 * Passwords require password-specific hashing functions that
 * are intentionally expensive and support salts.
 *
 * Examples include:
 *
 *     bcrypt
 *     scrypt
 *     Argon2
 *
 *
 * This repository covers password security separately in:
 *
 *     13_password_security/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Hashing vs HMAC
 * ============================================================
 *
 * Hash:
 *
 *     hash(data)
 *
 *
 * HMAC:
 *
 *     HMAC(secret, data)
 *
 *
 * HMAC proves that a party possessing the secret key could
 * have generated the authentication tag.
 *
 *
 * HMAC is covered in:
 *
 *     12_crypto/hmac.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Common Node.js hashing pattern
 * ============================================================
 */

function createSha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

console.log(createSha256("Node.js Mastery"));

/*
 * ============================================================
 * 32. Practical checksum function
 * ============================================================
 */

function checksum(data) {
  const digest = createHash("sha256").update(data).digest("hex");

  return digest;
}

const checksumValue = checksum("package contents");

console.log("Checksum:", checksumValue);

/*
 * ============================================================
 * 33. Important security warning
 * ============================================================
 *
 * Hashing does NOT automatically provide:
 *
 *     confidentiality
 *     authentication
 *     authorization
 *     password security
 *
 *
 * Hashing is mainly useful for:
 *
 *     integrity
 *     fingerprints
 *     content addressing
 *     cryptographic constructions
 *
 *
 * Passwords require specialized password hashing.
 *
 * Authentication tags can require HMAC or other MACs.
 *
 * Confidentiality requires encryption.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Hash architecture
 * ============================================================
 *
 *
 *              INPUT
 *                │
 *                ↓
 *          ┌─────────────┐
 *          │ SHA-256     │
 *          │ Hash        │
 *          └─────────────┘
 *                │
 *                ↓
 *          256-bit digest
 *                │
 *        ┌───────┼────────┐
 *        ↓       ↓        ↓
 *       HEX    BASE64   BUFFER
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Recommended algorithms
 * ============================================================
 *
 * For general cryptographic hashing:
 *
 *     SHA-256
 *     SHA-384
 *     SHA-512
 *
 *
 * Avoid using:
 *
 *     MD5
 *     SHA-1
 *
 * for security-sensitive cryptographic purposes.
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
 *       createHash
 *     } = require("node:crypto");
 *
 *
 * Create:
 *
 *     const hash =
 *       createHash("sha256");
 *
 *
 * Add data:
 *
 *     hash.update("Hello");
 *
 *
 * Digest:
 *
 *     hash.digest("hex");
 *
 *
 * One-liner:
 *
 *     createHash("sha256")
 *       .update("Hello")
 *       .digest("hex");
 *
 *
 * Buffer input:
 *
 *     hash.update(buffer);
 *
 *
 * Multiple chunks:
 *
 *     hash.update(chunk1);
 *     hash.update(chunk2);
 *     hash.update(chunk3);
 *
 *
 * File hashing:
 *
 *     createReadStream()
 *       ↓
 *     hash.update(chunk)
 *       ↓
 *     hash.digest()
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * A cryptographic hash converts data into a fixed-size
 * fingerprint.
 *
 *
 *     DATA
 *       ↓
 *     HASH
 *       ↓
 *    DIGEST
 *
 *
 * Same input:
 *
 *     same digest
 *
 *
 * Tiny input change:
 *
 *     dramatically different digest
 *
 *
 * Hashing:
 *
 *     one-way
 *     deterministic
 *     fixed-size
 *     collision-resistant
 *
 * ============================================================
 */
