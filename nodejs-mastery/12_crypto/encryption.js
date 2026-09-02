/**
 * ============================================================
 * NODE.JS CRYPTO - ENCRYPTION
 * ============================================================
 *
 * File:
 *     12_crypto/encryption.js
 *
 * ============================================================
 *
 * WHAT IS ENCRYPTION?
 * ============================================================
 *
 * Encryption converts readable data (plaintext) into
 * unreadable data (ciphertext) using a cryptographic key.
 *
 *
 *     Plaintext
 *         │
 *         │ + Key
 *         ↓
 *     Encryption
 *         │
 *         ↓
 *     Ciphertext
 *
 *
 * Decryption reverses the process:
 *
 *
 *     Ciphertext
 *         │
 *         │ + Key
 *         ↓
 *     Decryption
 *         │
 *         ↓
 *     Plaintext
 *
 * ============================================================
 *
 * ENCRYPTION PROVIDES:
 *
 *     ✓ Confidentiality
 *
 * Depending on the construction, authenticated encryption can
 * also provide:
 *
 *     ✓ Integrity
 *     ✓ Authenticity
 *
 * ============================================================
 *
 * IMPORTANT
 * ============================================================
 *
 * This file demonstrates AES-256-GCM, an authenticated
 * encryption mode.
 *
 * AES-GCM provides:
 *
 *     Confidentiality
 *     Integrity
 *     Authentication of the ciphertext
 *
 * It produces:
 *
 *     ciphertext
 *     authentication tag
 *
 * ============================================================
 */

const { createCipheriv, randomBytes } = require("node:crypto");

/*
 * ============================================================
 * 1. AES-256-GCM
 * ============================================================
 *
 * AES = Advanced Encryption Standard
 *
 * 256:
 *
 *     256-bit encryption key
 *
 * GCM:
 *
 *     Galois/Counter Mode
 *
 * Cipher name:
 *
 *     aes-256-gcm
 *
 * ============================================================
 */

const algorithm = "aes-256-gcm";

/*
 * ============================================================
 * 2. Generate a secure encryption key
 * ============================================================
 *
 * AES-256 requires:
 *
 *     32 bytes
 *
 * because:
 *
 *     32 × 8 = 256 bits
 *
 * ============================================================
 */

const key = randomBytes(32);

console.log("Key:", key.toString("hex"));

/*
 * ============================================================
 * 3. Generate an IV / nonce
 * ============================================================
 *
 * AES-GCM commonly uses a 12-byte IV (nonce).
 *
 * IMPORTANT:
 *
 * Never reuse the same IV with the same key.
 *
 * ============================================================
 */

const iv = randomBytes(12);

console.log("IV:", iv.toString("hex"));

/*
 * ============================================================
 * 4. Plaintext
 * ============================================================
 */

const plaintext = "Hello Node.js encryption";

console.log("Plaintext:", plaintext);

/*
 * ============================================================
 * 5. Create cipher
 * ============================================================
 */

const cipher = createCipheriv(algorithm, key, iv);

/*
 * ============================================================
 * 6. Encrypt the plaintext
 * ============================================================
 */

let ciphertext = cipher.update(plaintext, "utf8", "hex");

ciphertext += cipher.final("hex");

console.log("Ciphertext:", ciphertext);

/*
 * ============================================================
 * 7. Authentication tag
 * ============================================================
 *
 * AES-GCM generates an authentication tag.
 *
 * It is required during decryption to verify that the
 * ciphertext has not been modified.
 *
 * ============================================================
 */

const authTag = cipher.getAuthTag();

console.log("Auth tag:", authTag.toString("hex"));

/*
 * ============================================================
 * 8. Complete encrypted payload
 * ============================================================
 *
 * In a real application you usually need to store/transmit:
 *
 *     IV
 *     ciphertext
 *     authentication tag
 *
 *
 * Example:
 *
 *     {
 *       iv,
 *       ciphertext,
 *       authTag
 *     }
 *
 *
 * The encryption key must remain secret.
 *
 * ============================================================
 */

const encrypted = {
  iv: iv.toString("hex"),

  ciphertext,

  authTag: authTag.toString("hex"),
};

console.log("Encrypted payload:", encrypted);

/*
 * ============================================================
 * 9. Reusable encryption function
 * ============================================================
 */

function encrypt(plaintext, key) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv,
    ciphertext,
    authTag,
  };
}

/*
 * ============================================================
 * 10. Use reusable encrypt()
 * ============================================================
 */

const encryptedData = encrypt("Secret message", key);

console.log("IV:", encryptedData.iv.toString("hex"));

console.log("Ciphertext:", encryptedData.ciphertext.toString("hex"));

console.log("Auth tag:", encryptedData.authTag.toString("hex"));

/*
 * ============================================================
 * 11. Encrypt JSON data
 * ============================================================
 *
 * Encryption works with bytes.
 *
 * JSON can be converted to a string and then encrypted.
 *
 * ============================================================
 */

const user = {
  id: 101,
  name: "Shiva",
  role: "student",
};

const userJson = JSON.stringify(user);

const encryptedUser = encrypt(userJson, key);

console.log("Encrypted user:", encryptedUser.ciphertext.toString("hex"));

/*
 * ============================================================
 * 12. Encrypt sensitive application data
 * ============================================================
 *
 * Examples of data that may need encryption depending on the
 * application's requirements:
 *
 *     - Sensitive documents
 *     - Confidential configuration
 *     - Private application data
 *     - Stored secrets requiring reversible encryption
 *
 * IMPORTANT:
 *
 * Passwords should normally NOT be encrypted.
 *
 * Passwords should normally be hashed using a password hashing
 * algorithm such as bcrypt, scrypt, or Argon2.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Additional authenticated data (AAD)
 * ============================================================
 *
 * AES-GCM supports Additional Authenticated Data.
 *
 * AAD is:
 *
 *     authenticated
 *
 * but NOT:
 *
 *     encrypted
 *
 *
 * Example:
 *
 *     HTTP metadata
 *     record identifiers
 *     protocol version
 *
 *
 * The receiver must provide the same AAD during decryption.
 *
 * ============================================================
 */

function encryptWithAad(plaintext, key, aad) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  cipher.setAAD(Buffer.from(aad, "utf8"));

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv,
    ciphertext,
    authTag,
    aad,
  };
}

const encryptedWithAad = encryptWithAad("Confidential data", key, "record:123");

console.log(
  "AAD encrypted ciphertext:",
  encryptedWithAad.ciphertext.toString("hex"),
);

/*
 * ============================================================
 * 14. Encryption architecture
 * ============================================================
 *
 *
 *                 KEY
 *                  │
 *                  ↓
 *             ┌─────────┐
 * PLAINTEXT → │ AES-GCM │
 *             └─────────┘
 *                  │
 *       ┌──────────┼──────────┐
 *       ↓          ↓          ↓
 *      IV      Ciphertext   Auth Tag
 *
 *
 * Store/transmit:
 *
 *     IV
 *     Ciphertext
 *     Auth Tag
 *
 * Protect:
 *
 *     KEY
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Why IV is not secret
 * ============================================================
 *
 * The IV/nonce normally does not need to be encrypted.
 *
 * It must be:
 *
 *     unique for a given key
 *
 * It can therefore usually be stored next to the ciphertext.
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
 *
 * The encryption key remains secret.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Why authentication tag matters
 * ============================================================
 *
 * If ciphertext is modified:
 *
 *
 *     Ciphertext
 *          ↓
 *      Modified
 *          ↓
 *     Authentication
 *       check fails
 *
 *
 * This protects against undetected modification.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Encryption output as Base64
 * ============================================================
 */

function encryptBase64(plaintext, key) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),

    ciphertext: ciphertext.toString("base64"),

    authTag: authTag.toString("base64"),
  };
}

const base64Encrypted = encryptBase64("Base64 encrypted message", key);

console.log("Base64 payload:", base64Encrypted);

/*
 * ============================================================
 * 18. Encryption output as Base64URL
 * ============================================================
 *
 * Base64URL is useful when encrypted data needs to appear in
 * URL-safe contexts.
 *
 * ============================================================
 */

function encryptBase64Url(plaintext, key) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64url"),

    ciphertext: ciphertext.toString("base64url"),

    authTag: authTag.toString("base64url"),
  };
}

const base64UrlEncrypted = encryptBase64Url("URL-safe encrypted message", key);

console.log("Base64URL payload:", base64UrlEncrypted);

/*
 * ============================================================
 * 19. Encrypt a Buffer
 * ============================================================
 */

function encryptBuffer(data, key) {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return {
    iv,
    ciphertext,
    authTag,
  };
}

const binaryData = Buffer.from([0x01, 0x02, 0x03, 0xff]);

const encryptedBinary = encryptBuffer(binaryData, key);

console.log("Encrypted binary:", encryptedBinary.ciphertext);

/*
 * ============================================================
 * 20. Key validation
 * ============================================================
 *
 * AES-256 requires a 32-byte key.
 *
 * ============================================================
 */

function validateAes256Key(key) {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError("Key must be a Buffer");
  }

  if (key.length !== 32) {
    throw new Error("AES-256 requires a 32-byte key");
  }
}

validateAes256Key(key);

/*
 * ============================================================
 * 21. Safe encrypt function
 * ============================================================
 */

function safeEncrypt(plaintext, key) {
  validateAes256Key(key);

  if (typeof plaintext !== "string") {
    throw new TypeError("Plaintext must be a string");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),

    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    algorithm: "aes-256-gcm",

    iv: iv.toString("base64url"),

    ciphertext: ciphertext.toString("base64url"),

    authTag: authTag.toString("base64url"),
  };
}

const safeEncrypted = safeEncrypt("Production-style encrypted value", key);

console.log(safeEncrypted);

/*
 * ============================================================
 * 22. Different IV → different ciphertext
 * ============================================================
 */

const first = encrypt("Same plaintext", key);

const second = encrypt("Same plaintext", key);

console.log("First ciphertext:", first.ciphertext.toString("hex"));

console.log("Second ciphertext:", second.ciphertext.toString("hex"));

console.log("Same ciphertext:", first.ciphertext.equals(second.ciphertext));

/*
 * Because a fresh IV is generated for each encryption,
 * encrypting the same plaintext with the same key normally
 * produces different ciphertext.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. NEVER reuse an AES-GCM IV with the same key
 * ============================================================
 *
 * This is one of the most important AES-GCM rules.
 *
 *
 * BAD:
 *
 *     const iv = randomBytes(12);
 *
 *     // reuse iv for many encryptions
 *
 *
 * GOOD:
 *
 *     Generate a fresh unique IV for every encryption.
 *
 *
 *     plaintext A + key + IV A
 *     plaintext B + key + IV B
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Encryption vs hashing
 * ============================================================
 *
 *
 * HASHING
 *
 *     plaintext
 *        ↓
 *       hash
 *        ↓
 *     digest
 *
 * One-way operation.
 *
 *
 * ENCRYPTION
 *
 *     plaintext
 *        ↓
 *     encryption
 *        ↓
 *     ciphertext
 *
 * Can be reversed with the correct key.
 *
 *
 * Use hashing when you need:
 *
 *     verification
 *     fingerprints
 *     password storage with password-hashing algorithms
 *
 *
 * Use encryption when you need:
 *
 *     recoverable plaintext
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Encryption vs HMAC
 * ============================================================
 *
 *
 * HMAC:
 *
 *     Data + Secret
 *          ↓
 *        HMAC
 *          ↓
 *        Tag
 *
 *
 * Encryption:
 *
 *     Data + Key
 *          ↓
 *      Encryption
 *          ↓
 *     Ciphertext
 *
 *
 * AES-GCM combines confidentiality and authentication.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Example: encrypt an object
 * ============================================================
 */

function encryptObject(object, key) {
  const plaintext = JSON.stringify(object);

  return encrypt(plaintext, key);
}

const encryptedObject = encryptObject(
  {
    id: 1,
    username: "shiva",
    secret: "private-data",
  },
  key,
);

console.log("Encrypted object:", encryptedObject);

/*
 * ============================================================
 * 27. Example: encrypted database field
 * ============================================================
 *
 * Suppose an application has:
 *
 *     {
 *       name: "Shiva",
 *       encryptedData: ...
 *     }
 *
 *
 * The encrypted field may contain:
 *
 *     IV
 *     ciphertext
 *     authentication tag
 *
 *
 * The encryption key should NOT be stored directly beside
 * the data unless it is protected by an appropriate key
 * management system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Key management
 * ============================================================
 *
 * Encryption is only as secure as the key management.
 *
 * Protect keys using appropriate mechanisms such as:
 *
 *     - Environment/configuration management
 *     - Secret managers
 *     - KMS
 *     - HSM
 *
 *
 * Do NOT:
 *
 *     - Commit production keys to Git
 *     - Put keys in source code
 *     - Log keys
 *     - Send keys with ciphertext
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Encryption workflow
 * ============================================================
 *
 *
 * 1. Generate/provision secret key
 *
 * 2. Generate fresh IV
 *
 * 3. Create AES-GCM cipher
 *
 * 4. Encrypt plaintext
 *
 * 5. Get authentication tag
 *
 * 6. Store/transmit:
 *
 *        IV
 *        ciphertext
 *        authTag
 *
 * 7. Keep key secret
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. What the receiver needs
 * ============================================================
 *
 * To decrypt an AES-GCM payload:
 *
 *     key
 *     IV
 *     ciphertext
 *     authentication tag
 *
 *
 * Without the correct key:
 *
 *     decryption should fail.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Encryption of a file
 * ============================================================
 *
 * For large files, do not normally load the entire file into
 * memory.
 *
 * Use streaming encryption with Node.js streams and an
 * appropriate cipher stream.
 *
 * This will connect with:
 *
 *     10_streams/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Encryption errors
 * ============================================================
 *
 * Possible causes:
 *
 *     - Invalid key size
 *     - Invalid IV
 *     - Corrupted ciphertext
 *     - Wrong key
 *     - Wrong authentication tag
 *     - Incorrect AAD
 *
 *
 * Authenticated encryption should fail closed when
 * authentication verification fails.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Security checklist
 * ============================================================
 *
 *     ✓ Use a modern authenticated encryption mode
 *     ✓ Generate a fresh IV for every AES-GCM encryption
 *     ✓ Keep encryption keys secret
 *     ✓ Use cryptographically secure random data
 *     ✓ Store IV with ciphertext
 *     ✓ Store authentication tag with ciphertext
 *     ✓ Verify authentication before accepting plaintext
 *     ✓ Use a proper key-management strategy
 *     ✓ Never commit keys to Git
 *     ✓ Never log keys
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Complete encryption helper
 * ============================================================
 */

const Encryption = {
  algorithm: "aes-256-gcm",

  keySize: 32,

  ivSize: 12,

  generateKey() {
    return randomBytes(this.keySize);
  },

  encrypt(plaintext, key) {
    validateAes256Key(key);

    const iv = randomBytes(this.ivSize);

    const cipher = createCipheriv(this.algorithm, key, iv);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),

      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
      iv,
      ciphertext,
      authTag,
    };
  },
};

const generatedKey = Encryption.generateKey();

const result = Encryption.encrypt("Reusable encryption service", generatedKey);

console.log("Encrypted result:", {
  iv: result.iv.toString("hex"),

  ciphertext: result.ciphertext.toString("hex"),

  authTag: result.authTag.toString("hex"),
});

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const {
 *       createCipheriv,
 *       randomBytes
 *     } = require("node:crypto");
 *
 *
 * Algorithm:
 *
 *     aes-256-gcm
 *
 *
 * Key:
 *
 *     randomBytes(32)
 *
 *
 * IV:
 *
 *     randomBytes(12)
 *
 *
 * Cipher:
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
 *     cipher.update(data);
 *     cipher.final();
 *
 *
 * Authentication tag:
 *
 *     cipher.getAuthTag();
 *
 *
 * Output:
 *
 *     {
 *       iv,
 *       ciphertext,
 *       authTag
 *     }
 *
 *
 * ============================================================
 * MOST IMPORTANT RULE
 * ============================================================
 *
 * For AES-GCM:
 *
 *     NEVER REUSE THE SAME IV WITH THE SAME KEY.
 *
 *
 * Generate a fresh unique IV for every encryption operation.
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *
 *              Secret Key
 *                   │
 *                   ↓
 * Plaintext → AES-256-GCM
 *                   │
 *          ┌────────┼────────┐
 *          ↓        ↓        ↓
 *         IV    Ciphertext  Tag
 *
 *
 * AES-GCM provides authenticated encryption:
 *
 *     ✓ Confidentiality
 *     ✓ Integrity
 *     ✓ Authentication
 *
 * ============================================================
 */
