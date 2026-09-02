/**
 * ============================================================
 * NODE.JS CRYPTO - AES
 * ============================================================
 *
 * File:
 *     12_crypto/aes.js
 *
 * ============================================================
 *
 * AES = ADVANCED ENCRYPTION STANDARD
 * ============================================================
 *
 * AES is a symmetric-key block cipher.
 *
 * Symmetric encryption means:
 *
 *     The same secret key is used for encryption and
 *     decryption.
 *
 *
 *     Secret Key
 *        │
 *        ├───────────────┐
 *        ↓               ↓
 *   Encryption       Decryption
 *        │               │
 *        ↓               ↓
 *   Ciphertext       Plaintext
 *
 * ============================================================
 *
 * AES KEY SIZES
 * ============================================================
 *
 * AES supports:
 *
 *     AES-128 → 128-bit key → 16 bytes
 *     AES-192 → 192-bit key → 24 bytes
 *     AES-256 → 256-bit key → 32 bytes
 *
 *
 * AES does NOT support arbitrary key lengths.
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * AES itself is a block cipher.
 *
 * To encrypt arbitrary data securely, AES is normally used
 * together with a mode of operation.
 *
 * Examples:
 *
 *     GCM
 *     CBC
 *     CTR
 *
 * For modern application encryption, authenticated modes such
 * as GCM are generally preferred.
 *
 * ============================================================
 */

const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require("node:crypto");

/*
 * ============================================================
 * 1. AES-128
 * ============================================================
 */

const aes128Key = randomBytes(16);

console.log("AES-128 key bytes:", aes128Key.length);

/*
 * 16 bytes × 8 = 128 bits
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. AES-192
 * ============================================================
 */

const aes192Key = randomBytes(24);

console.log("AES-192 key bytes:", aes192Key.length);

/*
 * 24 bytes × 8 = 192 bits
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. AES-256
 * ============================================================
 */

const aes256Key = randomBytes(32);

console.log("AES-256 key bytes:", aes256Key.length);

/*
 * 32 bytes × 8 = 256 bits
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. AES-256-GCM
 * ============================================================
 *
 * GCM = Galois/Counter Mode
 *
 * GCM provides authenticated encryption.
 *
 * This means it protects:
 *
 *     Confidentiality
 *     Integrity
 *     Authentication
 *
 * ============================================================
 */

const algorithm = "aes-256-gcm";

const key = randomBytes(32);

const iv = randomBytes(12);

const plaintext = "AES-256-GCM example";

/*
 * ============================================================
 * 5. Create AES cipher
 * ============================================================
 */

const cipher = createCipheriv(algorithm, key, iv);

/*
 * ============================================================
 * 6. Encrypt
 * ============================================================
 */

const encrypted = Buffer.concat([
  cipher.update(plaintext, "utf8"),

  cipher.final(),
]);

console.log("Ciphertext:", encrypted.toString("hex"));

/*
 * ============================================================
 * 7. Authentication tag
 * ============================================================
 */

const authTag = cipher.getAuthTag();

console.log("Authentication tag:", authTag.toString("hex"));

/*
 * ============================================================
 * 8. Decrypt AES-256-GCM
 * ============================================================
 */

const decipher = createDecipheriv(algorithm, key, iv);

decipher.setAuthTag(authTag);

const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

console.log("Decrypted:", decrypted.toString("utf8"));

/*
 * ============================================================
 * 9. AES key size helper
 * ============================================================
 */

function generateAesKey(bits) {
  const bytes = bits / 8;

  if (![128, 192, 256].includes(bits)) {
    throw new Error("AES key size must be 128, 192, or 256 bits");
  }

  return randomBytes(bytes);
}

const key128 = generateAesKey(128);

const key192 = generateAesKey(192);

const key256 = generateAesKey(256);

console.log("128-bit key:", key128.length);

console.log("192-bit key:", key192.length);

console.log("256-bit key:", key256.length);

/*
 * ============================================================
 * 10. AES key validation
 * ============================================================
 */

function validateAesKey(key) {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError("AES key must be a Buffer");
  }

  if (![16, 24, 32].includes(key.length)) {
    throw new Error("AES key must be 16, 24, or 32 bytes");
  }

  return true;
}

validateAesKey(key256);

/*
 * ============================================================
 * 11. AES-128-GCM
 * ============================================================
 */

function encryptAes128(plaintext, key) {
  validateAesKey(key);

  if (key.length !== 16) {
    throw new Error("AES-128 requires a 16-byte key");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-128-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  return {
    iv,
    ciphertext,
    authTag: cipher.getAuthTag(),
  };
}

const aes128Encrypted = encryptAes128("AES-128 message", aes128Key);

console.log("AES-128 encrypted:", aes128Encrypted.ciphertext.toString("hex"));

/*
 * ============================================================
 * 12. AES-192-GCM
 * ============================================================
 */

function encryptAes192(plaintext, key) {
  if (!Buffer.isBuffer(key) || key.length !== 24) {
    throw new Error("AES-192 requires a 24-byte key");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-192-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  return {
    iv,
    ciphertext,
    authTag: cipher.getAuthTag(),
  };
}

const aes192Encrypted = encryptAes192("AES-192 message", aes192Key);

console.log("AES-192 encrypted:", aes192Encrypted.ciphertext.toString("hex"));

/*
 * ============================================================
 * 13. AES-256-GCM reusable function
 * ============================================================
 */

function encryptAes256(plaintext, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error("AES-256 requires a 32-byte key");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  return {
    iv,
    ciphertext,
    authTag: cipher.getAuthTag(),
  };
}

const aesEncrypted = encryptAes256("AES-256 message", aes256Key);

console.log("AES-256 encrypted:", aesEncrypted.ciphertext.toString("hex"));

/*
 * ============================================================
 * 14. AES-256-GCM decryption
 * ============================================================
 */

function decryptAes256(encryptedData, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error("AES-256 requires a 32-byte key");
  }

  const decipher = createDecipheriv("aes-256-gcm", key, encryptedData.iv);

  decipher.setAuthTag(encryptedData.authTag);

  const plaintext = Buffer.concat([
    decipher.update(encryptedData.ciphertext),

    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

console.log("AES-256 decrypted:", decryptAes256(aesEncrypted, aes256Key));

/*
 * ============================================================
 * 15. IV / NONCE
 * ============================================================
 *
 * IV = Initialization Vector
 *
 * In GCM, it is more precise to call it a nonce.
 *
 * It is not normally a secret.
 *
 * Its critical property is uniqueness for a given key.
 *
 *
 * GOOD:
 *
 *     encryption 1 → IV A
 *     encryption 2 → IV B
 *     encryption 3 → IV C
 *
 *
 * BAD:
 *
 *     encryption 1 → same IV
 *     encryption 2 → same IV
 *     encryption 3 → same IV
 *
 *
 * with the same AES-GCM key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Generate IV
 * ============================================================
 */

const gcmIv = randomBytes(12);

console.log("GCM IV:", gcmIv.toString("hex"));

/*
 * ============================================================
 * 17. Why fresh IVs matter
 * ============================================================
 *
 * Encrypting the same plaintext with the same key and a fresh
 * IV produces different ciphertext.
 *
 * ============================================================
 */

const firstEncryption = encryptAes256("Same message", aes256Key);

const secondEncryption = encryptAes256("Same message", aes256Key);

console.log("Ciphertext 1:", firstEncryption.ciphertext.toString("hex"));

console.log("Ciphertext 2:", secondEncryption.ciphertext.toString("hex"));

console.log(
  "Equal:",
  firstEncryption.ciphertext.equals(secondEncryption.ciphertext),
);

/*
 * ============================================================
 * 18. AES BLOCK SIZE
 * ============================================================
 *
 * AES has a fixed block size:
 *
 *     128 bits
 *
 *     128 / 8 = 16 bytes
 *
 *
 * IMPORTANT:
 *
 * AES key size and AES block size are different concepts.
 *
 *
 * AES-256:
 *
 *     Key = 32 bytes
 *
 * AES block:
 *
 *     16 bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. GCM vs CBC
 * ============================================================
 *
 *
 * AES-GCM:
 *
 *     Authenticated encryption
 *     Provides confidentiality + integrity
 *     Authentication tag
 *
 *
 * AES-CBC:
 *
 *     Encryption mode
 *     Does NOT inherently authenticate ciphertext
 *     Requires separate authentication mechanism if used
 *
 *
 * For new application designs, authenticated encryption such
 * as GCM is generally preferable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. AES-CBC example
 * ============================================================
 *
 * This example is educational.
 *
 * Do not treat CBC alone as authenticated encryption.
 *
 * ============================================================
 */

const cbcAlgorithm = "aes-256-cbc";

const cbcKey = randomBytes(32);

const cbcIv = randomBytes(16);

const cbcCipher = createCipheriv(cbcAlgorithm, cbcKey, cbcIv);

const cbcCiphertext = Buffer.concat([
  cbcCipher.update("AES-CBC example", "utf8"),

  cbcCipher.final(),
]);

console.log("CBC ciphertext:", cbcCiphertext.toString("hex"));

/*
 * ============================================================
 * 21. AES-CBC decryption
 * ============================================================
 */

const cbcDecipher = createDecipheriv(cbcAlgorithm, cbcKey, cbcIv);

const cbcPlaintext = Buffer.concat([
  cbcDecipher.update(cbcCiphertext),

  cbcDecipher.final(),
]);

console.log("CBC plaintext:", cbcPlaintext.toString("utf8"));

/*
 * ============================================================
 * IMPORTANT CBC WARNING
 * ============================================================
 *
 * AES-CBC encryption by itself does NOT provide authentication.
 *
 * If ciphertext can be modified by an attacker, a separate
 * integrity/authentication mechanism is needed.
 *
 * Prefer:
 *
 *     AES-GCM
 *
 * for new application-level encryption unless you have a
 * specific reason to use another construction.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. AES-GCM with AAD
 * ============================================================
 *
 * AAD = Additional Authenticated Data
 *
 * It is authenticated but not encrypted.
 *
 * ============================================================
 */

function encryptGcmWithAad(plaintext, key, aad) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  cipher.setAAD(Buffer.from(aad, "utf8"));

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  return {
    iv,
    ciphertext,
    authTag: cipher.getAuthTag(),
  };
}

const aadEncrypted = encryptGcmWithAad(
  "Private message",
  aes256Key,
  "user:101",
);

console.log("AAD ciphertext:", aadEncrypted.ciphertext.toString("hex"));

/*
 * ============================================================
 * 23. Decrypt GCM with AAD
 * ============================================================
 */

function decryptGcmWithAad(encryptedData, key, aad) {
  const decipher = createDecipheriv("aes-256-gcm", key, encryptedData.iv);

  decipher.setAAD(Buffer.from(aad, "utf8"));

  decipher.setAuthTag(encryptedData.authTag);

  const plaintext = Buffer.concat([
    decipher.update(encryptedData.ciphertext),

    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

console.log(
  "AAD decrypted:",
  decryptGcmWithAad(aadEncrypted, aes256Key, "user:101"),
);

/*
 * ============================================================
 * 24. Wrong AAD
 * ============================================================
 */

try {
  decryptGcmWithAad(aadEncrypted, aes256Key, "user:999");
} catch (error) {
  console.error("Wrong AAD detected:", error.message);
}

/*
 * ============================================================
 * 25. AES algorithm names
 * ============================================================
 *
 * Examples:
 *
 *     aes-128-gcm
 *     aes-192-gcm
 *     aes-256-gcm
 *
 *     aes-128-cbc
 *     aes-192-cbc
 *     aes-256-cbc
 *
 * The number identifies key size.
 *
 * The suffix identifies the mode.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. AES key generated with randomBytes
 * ============================================================
 */

const productionKey = randomBytes(32);

console.log(
  "Production-style AES-256 key generated:",
  productionKey.length,
  "bytes",
);

/*
 * NEVER print or log real production encryption keys.
 *
 * This console.log is only demonstrating the size.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. AES helper class
 * ============================================================
 */

class Aes256Gcm {
  static algorithm = "aes-256-gcm";

  static keySize = 32;

  static ivSize = 12;

  static generateKey() {
    return randomBytes(this.keySize);
  }

  static encrypt(plaintext, key) {
    if (!Buffer.isBuffer(key) || key.length !== this.keySize) {
      throw new Error("Invalid AES-256 key");
    }

    const iv = randomBytes(this.ivSize);

    const cipher = createCipheriv(this.algorithm, key, iv);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),

      cipher.final(),
    ]);

    return {
      iv,
      ciphertext,
      authTag: cipher.getAuthTag(),
    };
  }

  static decrypt(encryptedData, key) {
    if (!Buffer.isBuffer(key) || key.length !== this.keySize) {
      throw new Error("Invalid AES-256 key");
    }

    const decipher = createDecipheriv(this.algorithm, key, encryptedData.iv);

    decipher.setAuthTag(encryptedData.authTag);

    const plaintext = Buffer.concat([
      decipher.update(encryptedData.ciphertext),

      decipher.final(),
    ]);

    return plaintext.toString("utf8");
  }
}

/*
 * ============================================================
 * 28. Use AES helper
 * ============================================================
 */

const serviceKey = Aes256Gcm.generateKey();

const serviceEncrypted = Aes256Gcm.encrypt("Reusable AES service", serviceKey);

console.log(
  "Service decrypted:",
  Aes256Gcm.decrypt(serviceEncrypted, serviceKey),
);

/*
 * ============================================================
 * 29. Encrypt JSON using AES
 * ============================================================
 */

const sensitiveObject = {
  userId: 1001,
  email: "user@example.com",
  privateData: "Confidential",
};

const json = JSON.stringify(sensitiveObject);

const encryptedJson = Aes256Gcm.encrypt(json, serviceKey);

const decryptedJson = Aes256Gcm.decrypt(encryptedJson, serviceKey);

const restoredObject = JSON.parse(decryptedJson);

console.log("Restored object:", restoredObject);

/*
 * ============================================================
 * 30. AES output representation
 * ============================================================
 *
 * Buffers are ideal inside Node.js.
 *
 * For JSON APIs or database documents, encode binary fields:
 *
 *     Base64
 *     Base64URL
 *
 *
 * Example:
 *
 *     {
 *       iv: "...",
 *       ciphertext: "...",
 *       authTag: "..."
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. AES and passwords
 * ============================================================
 *
 * Do NOT directly use a user's password as an AES key.
 *
 *
 * Bad:
 *
 *     AES key = password
 *
 *
 * Passwords usually have:
 *
 *     low entropy
 *     predictable patterns
 *     variable length
 *
 *
 * If you truly need password-based encryption, use an
 * appropriate password-based key derivation function such as:
 *
 *     scrypt
 *
 * with a unique salt and appropriate parameters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. AES key derivation
 * ============================================================
 *
 * Node.js provides key derivation APIs such as:
 *
 *     scrypt()
 *     scryptSync()
 *
 *
 * Conceptually:
 *
 *
 * Password
 *     +
 * Salt
 *     ↓
 * KDF
 *     ↓
 * AES Key
 *
 *
 * This is different from directly using the password as the
 * encryption key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. AES for files
 * ============================================================
 *
 * Small data:
 *
 *     Buffer
 *     ↓
 *     encrypt
 *
 *
 * Large data:
 *
 *     Readable Stream
 *           ↓
 *     Cipher Stream
 *           ↓
 *     Writable Stream
 *
 *
 * This prevents loading an entire large file into memory.
 *
 * See:
 *
 *     10_streams/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. AES security checklist
 * ============================================================
 *
 *     ✓ Use a modern authenticated mode such as GCM
 *     ✓ Use a cryptographically random key
 *     ✓ Use the correct key size
 *     ✓ Generate a fresh unique nonce/IV for each GCM message
 *     ✓ Store IV with ciphertext
 *     ✓ Store authentication tag with ciphertext
 *     ✓ Verify authentication before accepting plaintext
 *     ✓ Protect encryption keys
 *     ✓ Use proper key management
 *     ✓ Never hard-code production secrets
 *     ✓ Never log production encryption keys
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. AES terminology
 * ============================================================
 *
 *
 * AES
 *     Cryptographic block cipher.
 *
 *
 * Key
 *     Secret cryptographic value.
 *
 *
 * Block
 *     Fixed 16-byte AES block.
 *
 *
 * Mode
 *     Defines how AES is applied to data.
 *
 *
 * IV / Nonce
 *     Per-encryption value used by many modes.
 *
 *
 * Ciphertext
 *     Encrypted data.
 *
 *
 * Authentication tag
 *     Integrity/authentication value produced by GCM.
 *
 *
 * AAD
 *     Data authenticated but not encrypted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. AES mental model
 * ============================================================
 *
 *
 *                 SECRET KEY
 *                      │
 *                      ↓
 *                ┌──────────┐
 *                │   AES    │
 *                │   + MODE │
 *                └──────────┘
 *                      ↑
 *                      │
 *                   IV/NONCE
 *
 *
 * Plaintext
 *     │
 *     ↓
 * Encryption
 *     │
 *     ├──────→ Ciphertext
 *     │
 *     └──────→ Authentication Tag
 *
 *
 * During decryption:
 *
 *     Ciphertext
 *     +
 *     IV
 *     +
 *     Auth Tag
 *     +
 *     Secret Key
 *          │
 *          ↓
 *      Decryption
 *          │
 *          ↓
 *       Plaintext
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * AES-128:
 *
 *     16-byte key
 *
 *
 * AES-192:
 *
 *     24-byte key
 *
 *
 * AES-256:
 *
 *     32-byte key
 *
 *
 * AES block size:
 *
 *     16 bytes
 *
 *
 * AES-GCM:
 *
 *     createCipheriv(
 *       "aes-256-gcm",
 *       key,
 *       iv
 *     );
 *
 *
 * Encrypt:
 *
 *     cipher.update(...)
 *     cipher.final()
 *
 *
 * Authentication tag:
 *
 *     cipher.getAuthTag()
 *
 *
 * Decrypt:
 *
 *     createDecipheriv(...)
 *
 *
 * Authentication:
 *
 *     decipher.setAuthTag(...)
 *
 *
 * Final verification:
 *
 *     decipher.final()
 *
 *
 * ============================================================
 *
 * BEST DEFAULT FOR THIS REPOSITORY:
 *
 *     AES-256-GCM
 *
 *
 * Because it provides:
 *
 *     ✓ Encryption
 *     ✓ Integrity
 *     ✓ Authentication
 *
 * ============================================================
 *
 * MOST IMPORTANT RULE:
 *
 *     NEVER REUSE AN AES-GCM NONCE/IV WITH THE SAME KEY.
 *
 * ============================================================
 */
