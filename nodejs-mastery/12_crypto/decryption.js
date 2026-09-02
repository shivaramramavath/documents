/**
 * ============================================================
 * NODE.JS CRYPTO - DECRYPTION
 * ============================================================
 *
 * File:
 *     12_crypto/decryption.js
 *
 * ============================================================
 *
 * WHAT IS DECRYPTION?
 * ============================================================
 *
 * Decryption converts encrypted data (ciphertext) back into
 * the original readable data (plaintext).
 *
 *
 *     Ciphertext
 *         │
 *         │ + Secret Key
 *         ↓
 *     Decryption
 *         │
 *         ↓
 *     Plaintext
 *
 *
 * In this example we use:
 *
 *     AES-256-GCM
 *
 * AES-GCM is an authenticated encryption mode.
 *
 * It provides:
 *
 *     ✓ Confidentiality
 *     ✓ Integrity
 *     ✓ Authentication
 *
 * ============================================================
 *
 * REQUIRED FOR DECRYPTION
 * ============================================================
 *
 * You need:
 *
 *     1. Encryption key
 *     2. IV / nonce
 *     3. Ciphertext
 *     4. Authentication tag
 *
 *
 * If the authentication tag does not verify, decryption
 * must fail.
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
 * 1. Encryption algorithm
 * ============================================================
 */

const algorithm = "aes-256-gcm";

/*
 * ============================================================
 * 2. Generate a key
 * ============================================================
 *
 * AES-256 requires a 32-byte key.
 *
 * In a real application this key would normally be securely
 * provisioned rather than generated every time the process
 * starts.
 *
 * ============================================================
 */

const key = randomBytes(32);

/*
 * ============================================================
 * 3. Encrypt some data first
 * ============================================================
 *
 * To demonstrate decryption, we first create an encrypted
 * payload.
 *
 * ============================================================
 */

function encrypt(plaintext, key) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(algorithm, key, iv);

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

const encrypted = encrypt("Hello from encrypted data", key);

console.log("Encrypted:", encrypted.ciphertext.toString("hex"));

/*
 * ============================================================
 * 4. Create decipher
 * ============================================================
 */

const decipher = createDecipheriv(algorithm, key, encrypted.iv);

/*
 * ============================================================
 * 5. Set authentication tag
 * ============================================================
 *
 * The authentication tag is required by AES-GCM to verify
 * that the ciphertext has not been modified.
 *
 * ============================================================
 */

decipher.setAuthTag(encrypted.authTag);

/*
 * ============================================================
 * 6. Decrypt ciphertext
 * ============================================================
 */

const plaintext = Buffer.concat([
  decipher.update(encrypted.ciphertext),

  decipher.final(),
]);

console.log("Decrypted:", plaintext.toString("utf8"));

/*
 * ============================================================
 * 7. Reusable decrypt() function
 * ============================================================
 */

function decrypt(encryptedData, key) {
  const decipher = createDecipheriv(algorithm, key, encryptedData.iv);

  decipher.setAuthTag(encryptedData.authTag);

  const plaintext = Buffer.concat([
    decipher.update(encryptedData.ciphertext),

    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

const decrypted = decrypt(encrypted, key);

console.log("Decrypted value:", decrypted);

/*
 * ============================================================
 * 8. Complete encryption/decryption cycle
 * ============================================================
 *
 *
 * Plaintext
 *     │
 *     ↓
 * Encryption
 *     │
 *     ↓
 * IV + Ciphertext + Auth Tag
 *     │
 *     ↓
 * Decryption + Key
 *     │
 *     ↓
 * Plaintext
 *
 * ============================================================
 */

const original = "Confidential message";

const encryptedMessage = encrypt(original, key);

const decryptedMessage = decrypt(encryptedMessage, key);

console.log("Original:", original);

console.log("Decrypted:", decryptedMessage);

console.log("Match:", original === decryptedMessage);

/*
 * ============================================================
 * 9. Wrong key
 * ============================================================
 *
 * If the wrong key is supplied, authentication should fail.
 *
 * ============================================================
 */

const wrongKey = randomBytes(32);

try {
  decrypt(encryptedMessage, wrongKey);
} catch (error) {
  console.error("Wrong key error:", error.message);
}

/*
 * ============================================================
 * 10. Modified ciphertext
 * ============================================================
 *
 * AES-GCM detects ciphertext tampering.
 *
 * ============================================================
 */

const tampered = {
  iv: Buffer.from(encryptedMessage.iv),

  ciphertext: Buffer.from(encryptedMessage.ciphertext),

  authTag: Buffer.from(encryptedMessage.authTag),
};

/*
 * Modify one byte.
 */

if (tampered.ciphertext.length > 0) {
  tampered.ciphertext[0] ^= 0xff;
}

try {
  decrypt(tampered, key);
} catch (error) {
  console.error("Tampering detected:", error.message);
}

/*
 * ============================================================
 * 11. Modified authentication tag
 * ============================================================
 */

const modifiedTag = {
  iv: Buffer.from(encryptedMessage.iv),

  ciphertext: Buffer.from(encryptedMessage.ciphertext),

  authTag: Buffer.from(encryptedMessage.authTag),
};

modifiedTag.authTag[0] ^= 0xff;

try {
  decrypt(modifiedTag, key);
} catch (error) {
  console.error("Invalid authentication tag:", error.message);
}

/*
 * ============================================================
 * 12. Why decipher.final() is important
 * ============================================================
 *
 * For AES-GCM, authentication is verified when the cipher
 * operation is finalized.
 *
 *
 * Therefore:
 *
 *     decipher.final()
 *
 * must be called.
 *
 *
 * Do NOT assume that:
 *
 *     decipher.update()
 *
 * alone means the data is authenticated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Decrypt JSON
 * ============================================================
 */

function decryptJson(encryptedData, key) {
  const plaintext = decrypt(encryptedData, key);

  return JSON.parse(plaintext);
}

const originalUser = {
  id: 101,
  name: "Shiva",
  role: "student",
};

const encryptedUser = encrypt(JSON.stringify(originalUser), key);

const decryptedUser = decryptJson(encryptedUser, key);

console.log("Decrypted user:", decryptedUser);

/*
 * ============================================================
 * 14. Encrypt and decrypt object helpers
 * ============================================================
 */

function encryptObject(object, key) {
  return encrypt(JSON.stringify(object), key);
}

function decryptObject(encryptedData, key) {
  return JSON.parse(decrypt(encryptedData, key));
}

const data = {
  username: "shiva",
  age: 21,
  active: true,
};

const encryptedData = encryptObject(data, key);

const decryptedData = decryptObject(encryptedData, key);

console.log("Original object:", data);

console.log("Decrypted object:", decryptedData);

/*
 * ============================================================
 * 15. Base64 representation
 * ============================================================
 *
 * Buffers are convenient inside Node.js.
 *
 * For APIs, JSON, databases, or text-based storage,
 * Base64 is often more convenient.
 *
 * ============================================================
 */

function encryptBase64(plaintext, key) {
  const encrypted = encrypt(plaintext, key);

  return {
    iv: encrypted.iv.toString("base64"),

    ciphertext: encrypted.ciphertext.toString("base64"),

    authTag: encrypted.authTag.toString("base64"),
  };
}

const base64Payload = encryptBase64("Base64 encrypted message", key);

console.log("Base64 payload:", base64Payload);

/*
 * ============================================================
 * 16. Decrypt Base64 payload
 * ============================================================
 */

function decryptBase64(encryptedData, key) {
  const data = {
    iv: Buffer.from(encryptedData.iv, "base64"),

    ciphertext: Buffer.from(encryptedData.ciphertext, "base64"),

    authTag: Buffer.from(encryptedData.authTag, "base64"),
  };

  return decrypt(data, key);
}

console.log("Base64 decrypted:", decryptBase64(base64Payload, key));

/*
 * ============================================================
 * 17. Base64URL representation
 * ============================================================
 */

function encryptBase64Url(plaintext, key) {
  const encrypted = encrypt(plaintext, key);

  return {
    iv: encrypted.iv.toString("base64url"),

    ciphertext: encrypted.ciphertext.toString("base64url"),

    authTag: encrypted.authTag.toString("base64url"),
  };
}

function decryptBase64Url(encryptedData, key) {
  const data = {
    iv: Buffer.from(encryptedData.iv, "base64url"),

    ciphertext: Buffer.from(encryptedData.ciphertext, "base64url"),

    authTag: Buffer.from(encryptedData.authTag, "base64url"),
  };

  return decrypt(data, key);
}

const base64UrlPayload = encryptBase64Url("URL-safe secret", key);

console.log("Base64URL payload:", base64UrlPayload);

console.log("Base64URL decrypted:", decryptBase64Url(base64UrlPayload, key));

/*
 * ============================================================
 * 18. Additional Authenticated Data (AAD)
 * ============================================================
 *
 * AES-GCM can authenticate additional data that is not
 * encrypted.
 *
 * During decryption, the EXACT same AAD must be supplied.
 *
 * ============================================================
 */

function encryptWithAad(plaintext, key, aad) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(algorithm, key, iv);

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
  };
}

function decryptWithAad(encryptedData, key, aad) {
  const decipher = createDecipheriv(algorithm, key, encryptedData.iv);

  decipher.setAAD(Buffer.from(aad, "utf8"));

  decipher.setAuthTag(encryptedData.authTag);

  const plaintext = Buffer.concat([
    decipher.update(encryptedData.ciphertext),

    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

const aad = "user-record:123";

const encryptedAad = encryptWithAad("Sensitive user data", key, aad);

console.log("AAD decrypted:", decryptWithAad(encryptedAad, key, aad));

/*
 * ============================================================
 * 19. Wrong AAD
 * ============================================================
 *
 * If the AAD changes, authentication should fail.
 *
 * ============================================================
 */

try {
  decryptWithAad(encryptedAad, key, "user-record:999");
} catch (error) {
  console.error("AAD verification failed:", error.message);
}

/*
 * ============================================================
 * 20. Validate key
 * ============================================================
 */

function validateKey(key) {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError("Encryption key must be a Buffer");
  }

  if (key.length !== 32) {
    throw new Error("AES-256 requires a 32-byte key");
  }
}

/*
 * ============================================================
 * 21. Safe decrypt function
 * ============================================================
 */

function safeDecrypt(encryptedData, key) {
  validateKey(key);

  if (
    !encryptedData ||
    !encryptedData.iv ||
    !encryptedData.ciphertext ||
    !encryptedData.authTag
  ) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = createDecipheriv(algorithm, key, encryptedData.iv);

  decipher.setAuthTag(encryptedData.authTag);

  const plaintext = Buffer.concat([
    decipher.update(encryptedData.ciphertext),

    /*
     * Authentication is finalized here.
     */
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

console.log("Safe decrypt:", safeDecrypt(encrypted, key));

/*
 * ============================================================
 * 22. Handle authentication failure
 * ============================================================
 */

function tryDecrypt(encryptedData, key) {
  try {
    return {
      success: true,

      data: safeDecrypt(encryptedData, key),
    };
  } catch (error) {
    return {
      success: false,
      error: "Unable to decrypt authenticated data",
    };
  }
}

console.log(tryDecrypt(encrypted, key));

console.log(tryDecrypt(encrypted, wrongKey));

/*
 * ============================================================
 * 23. Decryption workflow
 * ============================================================
 *
 *
 * Stored payload:
 *
 *     ┌─────────────────┐
 *     │ IV              │
 *     │ Ciphertext      │
 *     │ Authentication  │
 *     │ Tag             │
 *     └─────────────────┘
 *              │
 *              ↓
 *        Secret Key
 *              │
 *              ↓
 *       createDecipheriv
 *              │
 *              ↓
 *        setAuthTag()
 *              │
 *              ↓
 *       decipher.update()
 *              │
 *              ↓
 *       decipher.final()
 *              │
 *              ↓
 *         Plaintext
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Decryption failure should be handled safely
 * ============================================================
 *
 * Possible reasons:
 *
 *     - Wrong key
 *     - Corrupted ciphertext
 *     - Modified authentication tag
 *     - Incorrect IV
 *     - Incorrect AAD
 *     - Invalid payload
 *
 *
 * Do not return potentially unauthenticated plaintext.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Decryption does NOT recover the key
 * ============================================================
 *
 * Encryption:
 *
 *     plaintext + key
 *         ↓
 *     ciphertext
 *
 *
 * Decryption:
 *
 *     ciphertext + key
 *         ↓
 *     plaintext
 *
 *
 * The key is an independent secret.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Passwords should not normally be decrypted
 * ============================================================
 *
 * This is extremely important.
 *
 * Password storage should normally use password hashing.
 *
 *
 * Example:
 *
 *     password
 *        ↓
 *     Argon2 / bcrypt / scrypt
 *        ↓
 *     password hash
 *
 *
 * You should NOT do:
 *
 *     password
 *        ↓
 *     AES encryption
 *        ↓
 *     encrypted password
 *
 *
 * because an application would then need to protect the
 * decryption key and could recover the original password.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Encryption vs decryption
 * ============================================================
 *
 *
 * ENCRYPTION:
 *
 *     createCipheriv()
 *
 *
 * DECRYPTION:
 *
 *     createDecipheriv()
 *
 *
 * ENCRYPTION:
 *
 *     cipher.update()
 *     cipher.final()
 *     cipher.getAuthTag()
 *
 *
 * DECRYPTION:
 *
 *     decipher.update()
 *     decipher.setAuthTag()
 *     decipher.final()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Large files
 * ============================================================
 *
 * For large files, avoid:
 *
 *     fs.readFile()
 *
 * followed by encrypting/decrypting the entire file in memory.
 *
 *
 * Prefer:
 *
 *     Streams
 *
 * with:
 *
 *     createCipheriv()
 *     createDecipheriv()
 *
 *
 * This connects directly to:
 *
 *     10_streams/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Key management
 * ============================================================
 *
 * The key is more sensitive than:
 *
 *     IV
 *     ciphertext
 *     authentication tag
 *
 *
 * Never:
 *
 *     - Commit encryption keys to Git
 *     - Print keys in production logs
 *     - Put keys directly in source code
 *     - Send secret keys with ciphertext
 *
 *
 * Use proper secret/key-management infrastructure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Do not silently ignore authentication errors
 * ============================================================
 *
 * BAD:
 *
 *     try {
 *       decrypt(...)
 *     } catch {
 *       return "";
 *     }
 *
 *
 * This can hide serious data corruption or security failures.
 *
 *
 * GOOD:
 *
 *     Catch the error at an appropriate application boundary,
 *     record useful non-secret diagnostic information, and
 *     reject the invalid data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Practical encrypted record
 * ============================================================
 */

const recordKey = randomBytes(32);

const record = {
  id: "record-123",
  secret: "Sensitive information",
};

const encryptedRecord = encryptObject(record, recordKey);

const storedRecord = {
  id: record.id,

  iv: encryptedRecord.iv.toString("base64url"),

  ciphertext: encryptedRecord.ciphertext.toString("base64url"),

  authTag: encryptedRecord.authTag.toString("base64url"),
};

console.log("Stored record:", storedRecord);

/*
 * ============================================================
 * 32. Restore stored record
 * ============================================================
 */

const restoredEncryptedRecord = {
  iv: Buffer.from(storedRecord.iv, "base64url"),

  ciphertext: Buffer.from(storedRecord.ciphertext, "base64url"),

  authTag: Buffer.from(storedRecord.authTag, "base64url"),
};

const restoredRecord = decryptObject(restoredEncryptedRecord, recordKey);

console.log("Restored record:", restoredRecord);

/*
 * ============================================================
 * 33. Full practical flow
 * ============================================================
 *
 *
 * APPLICATION
 *     │
 *     │ plaintext
 *     ↓
 * encrypt()
 *     │
 *     ├── IV
 *     ├── ciphertext
 *     └── authTag
 *     │
 *     ↓
 * DATABASE / STORAGE
 *     │
 *     ↓
 * retrieve payload
 *     │
 *     ↓
 * decrypt()
 *     │
 *     ├── verify authentication
 *     │
 *     ↓
 * plaintext
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Security checklist
 * ============================================================
 *
 *     ✓ Use AES-GCM for authenticated encryption
 *     ✓ Use a 32-byte key for AES-256
 *     ✓ Generate a fresh IV for each encryption
 *     ✓ Store IV with ciphertext
 *     ✓ Store authentication tag with ciphertext
 *     ✓ Call decipher.final()
 *     ✓ Reject authentication failures
 *     ✓ Keep keys secret
 *     ✓ Use proper key management
 *     ✓ Never log plaintext secrets unnecessarily
 *     ✓ Never commit encryption keys to source control
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
 *       createDecipheriv
 *     } = require("node:crypto");
 *
 *
 * Create decipher:
 *
 *     const decipher =
 *       createDecipheriv(
 *         "aes-256-gcm",
 *         key,
 *         iv
 *       );
 *
 *
 * Set authentication tag:
 *
 *     decipher.setAuthTag(
 *       authTag
 *     );
 *
 *
 * Decrypt:
 *
 *     const plaintext =
 *       Buffer.concat([
 *         decipher.update(
 *           ciphertext
 *         ),
 *
 *         decipher.final()
 *       ]);
 *
 *
 * Convert to string:
 *
 *     plaintext.toString(
 *       "utf8"
 *     );
 *
 *
 * ============================================================
 * REQUIRED VALUES
 * ============================================================
 *
 *     key
 *     +
 *     iv
 *     +
 *     ciphertext
 *     +
 *     authTag
 *
 *             ↓
 *
 *          decrypt
 *
 *             ↓
 *
 *         plaintext
 *
 * ============================================================
 *
 * MOST IMPORTANT:
 *
 *     decipher.final()
 *
 * performs the final authentication check.
 *
 * If authentication fails, reject the data.
 *
 * ============================================================
 */
