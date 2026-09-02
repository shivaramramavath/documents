/**
 * ============================================================
 * NODE.JS CRYPTO - DIGITAL SIGNATURES
 * ============================================================
 *
 * File:
 *     12_crypto/signatures.js
 *
 * ============================================================
 *
 * WHAT IS A DIGITAL SIGNATURE?
 * ============================================================
 *
 * A digital signature allows us to prove:
 *
 *     1. Who created/signed the data
 *     2. That the data was not modified
 *
 *
 * Digital signatures use ASYMMETRIC cryptography.
 *
 *
 * There are two keys:
 *
 *     Private Key
 *         ↓
 *       Signing
 *
 *     Public Key
 *         ↓
 *      Verification
 *
 *
 * The private key must remain secret.
 *
 * The public key can be shared.
 *
 * ============================================================
 *
 * DIGITAL SIGNATURE FLOW
 * ============================================================
 *
 *
 *             PRIVATE KEY
 *                  │
 *                  ↓
 *             ┌─────────┐
 * Data ──────→│  SIGN   │
 *             └─────────┘
 *                  │
 *                  ↓
 *             Signature
 *
 *
 * Verification:
 *
 *             PUBLIC KEY
 *                  │
 *                  ↓
 *          ┌──────────────┐
 * Data ───→│   VERIFY     │←── Signature
 *          └──────────────┘
 *                  │
 *                  ↓
 *             true / false
 *
 * ============================================================
 */

const {
  generateKeyPairSync,
  createSign,
  createVerify,
  sign,
  verify,
} = require("node:crypto");

/*
 * ============================================================
 * 1. Generate RSA key pair
 * ============================================================
 *
 * RSA is an asymmetric cryptographic algorithm.
 *
 * We generate:
 *
 *     privateKey
 *     publicKey
 *
 * ============================================================
 */

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,

  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },

  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

console.log("Private key generated:", Boolean(privateKey));

console.log("Public key generated:", Boolean(publicKey));

/*
 * ============================================================
 * 2. Data to sign
 * ============================================================
 */

const message = "This message is authentic";

/*
 * ============================================================
 * 3. Create signer
 * ============================================================
 *
 * SHA-256 is used as the message digest.
 *
 * ============================================================
 */

const signer = createSign("SHA256");

/*
 * ============================================================
 * 4. Add data
 * ============================================================
 */

signer.update(message);

/*
 * ============================================================
 * 5. Finish signing
 * ============================================================
 */

signer.end();

/*
 * ============================================================
 * 6. Generate signature
 * ============================================================
 *
 * The private key signs the message.
 *
 * ============================================================
 */

const signature = signer.sign(privateKey);

console.log("Signature:", signature.toString("base64"));

/*
 * ============================================================
 * 7. Verify signature
 * ============================================================
 *
 * The public key verifies the signature.
 *
 * ============================================================
 */

const verifier = createVerify("SHA256");

verifier.update(message);

verifier.end();

const isValid = verifier.verify(publicKey, signature);

console.log("Signature valid:", isValid);

/*
 * ============================================================
 * 8. Modify the message
 * ============================================================
 *
 * If the message changes, the signature should fail.
 * ============================================================
 */

const modifiedMessage = "This message was modified";

const modifiedVerifier = createVerify("SHA256");

modifiedVerifier.update(modifiedMessage);

modifiedVerifier.end();

console.log(
  "Modified message valid:",
  modifiedVerifier.verify(publicKey, signature),
);

/*
 * ============================================================
 * 9. Reusable signMessage()
 * ============================================================
 */

function signMessage(message, privateKey) {
  const signer = createSign("SHA256");

  signer.update(message);

  signer.end();

  return signer.sign(privateKey);
}

const newSignature = signMessage("Hello signatures", privateKey);

console.log("New signature:", newSignature.toString("base64"));

/*
 * ============================================================
 * 10. Reusable verifySignature()
 * ============================================================
 */

function verifySignature(message, signature, publicKey) {
  const verifier = createVerify("SHA256");

  verifier.update(message);

  verifier.end();

  return verifier.verify(publicKey, signature);
}

console.log(
  "Reusable verification:",
  verifySignature("Hello signatures", newSignature, publicKey),
);

/*
 * ============================================================
 * 11. Wrong public key
 * ============================================================
 */

const { publicKey: anotherPublicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,

  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },

  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

console.log(
  "Wrong public key valid:",
  verifySignature("Hello signatures", newSignature, anotherPublicKey),
);

/*
 * ============================================================
 * 12. RSA-PSS
 * ============================================================
 *
 * RSA-PSS is a modern RSA signature scheme.
 *
 * It uses probabilistic padding.
 *
 * Node.js supports RSA-PSS through:
 *
 *     padding
 *     saltLength
 *
 * ============================================================
 */

const { privateKey: pssPrivateKey, publicKey: pssPublicKey } =
  generateKeyPairSync("rsa", {
    modulusLength: 2048,

    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },

    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

const pssSigner = createSign("SHA256");

pssSigner.update("RSA-PSS message");

pssSigner.end();

const pssSignature = pssSigner.sign({
  key: pssPrivateKey,

  padding: require("node:crypto").constants.RSA_PKCS1_PSS_PADDING,

  saltLength: require("node:crypto").constants.RSA_PSS_SALTLEN_DIGEST,
});

console.log("RSA-PSS signature:", pssSignature.toString("base64"));

/*
 * ============================================================
 * 13. Verify RSA-PSS
 * ============================================================
 */

const pssVerifier = createVerify("SHA256");

pssVerifier.update("RSA-PSS message");

pssVerifier.end();

const pssValid = pssVerifier.verify(
  {
    key: pssPublicKey,

    padding: require("node:crypto").constants.RSA_PKCS1_PSS_PADDING,

    saltLength: require("node:crypto").constants.RSA_PSS_SALTLEN_DIGEST,
  },

  pssSignature,
);

console.log("RSA-PSS valid:", pssValid);

/*
 * ============================================================
 * 14. ECDSA
 * ============================================================
 *
 * ECDSA = Elliptic Curve Digital Signature Algorithm
 *
 * It uses elliptic-curve cryptography.
 *
 * Compared with RSA, ECC can provide strong security with
 * smaller keys.
 *
 * ============================================================
 */

const { privateKey: ecPrivateKey, publicKey: ecPublicKey } =
  generateKeyPairSync("ec", {
    namedCurve: "prime256v1",

    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },

    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

console.log("EC private key generated:", Boolean(ecPrivateKey));

/*
 * ============================================================
 * 15. Sign using ECDSA
 * ============================================================
 */

const ecSigner = createSign("SHA256");

ecSigner.update("ECDSA message");

ecSigner.end();

const ecSignature = ecSigner.sign(ecPrivateKey);

console.log("ECDSA signature:", ecSignature.toString("base64"));

/*
 * ============================================================
 * 16. Verify ECDSA
 * ============================================================
 */

const ecVerifier = createVerify("SHA256");

ecVerifier.update("ECDSA message");

ecVerifier.end();

console.log("ECDSA valid:", ecVerifier.verify(ecPublicKey, ecSignature));

/*
 * ============================================================
 * 17. Ed25519
 * ============================================================
 *
 * Ed25519 is a modern public-key signature algorithm.
 *
 * Node.js provides a convenient API for it.
 *
 * Unlike createSign/createVerify with a hash name,
 * Ed25519 uses its own algorithm-specific signing operation.
 *
 * ============================================================
 */

const { privateKey: edPrivateKey, publicKey: edPublicKey } =
  generateKeyPairSync("ed25519");

const edMessage = Buffer.from("Ed25519 message");

/*
 * ============================================================
 * 18. Sign with Ed25519
 * ============================================================
 */

const edSignature = sign(null, edMessage, edPrivateKey);

console.log("Ed25519 signature:", edSignature.toString("base64"));

/*
 * ============================================================
 * 19. Verify Ed25519
 * ============================================================
 */

const edValid = verify(null, edMessage, edPublicKey, edSignature);

console.log("Ed25519 valid:", edValid);

/*
 * ============================================================
 * 20. Modified Ed25519 message
 * ============================================================
 */

const modifiedEdMessage = Buffer.from("Modified Ed25519 message");

console.log(
  "Modified Ed25519 valid:",
  verify(null, modifiedEdMessage, edPublicKey, edSignature),
);

/*
 * ============================================================
 * 21. Signing JSON
 * ============================================================
 *
 * Real applications frequently sign structured data.
 *
 * Before signing:
 *
 *     object
 *       ↓
 *     JSON.stringify()
 *       ↓
 *     string / Buffer
 *       ↓
 *     signature
 *
 * ============================================================
 */

const userData = {
  id: 101,
  username: "shiva",
  role: "student",
};

const userJson = JSON.stringify(userData);

const userSignature = signMessage(userJson, privateKey);

console.log("JSON signature:", userSignature.toString("base64"));

console.log("JSON valid:", verifySignature(userJson, userSignature, publicKey));

/*
 * ============================================================
 * 22. IMPORTANT JSON SIGNING PROBLEM
 * ============================================================
 *
 * These two objects may represent the same logical data:
 *
 *
 *     {
 *       "name": "Shiva",
 *       "age": 21
 *     }
 *
 *
 * and:
 *
 *
 *     {
 *       "age": 21,
 *       "name": "Shiva"
 *     }
 *
 *
 * Their JSON strings differ.
 *
 * Therefore their signatures can differ.
 *
 * For protocols requiring interoperable signed JSON, use a
 * canonical serialization format rather than ordinary
 * JSON.stringify() alone.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Signature is NOT encryption
 * ============================================================
 *
 * This distinction is critical.
 *
 *
 * DIGITAL SIGNATURE:
 *
 *     Private key
 *          ↓
 *       Sign data
 *          ↓
 *      Signature
 *
 * Anyone with the public key can verify it.
 *
 *
 * ENCRYPTION:
 *
 *     Plaintext
 *         ↓
 *      Encryption
 *         ↓
 *     Ciphertext
 *
 * Only an authorized holder of the decryption key should be
 * able to recover the plaintext.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Signing does not hide the message
 * ============================================================
 *
 * Suppose:
 *
 *     message = "Pay Shiva 100"
 *
 * Signing it does NOT turn the message into secret data.
 *
 * You still have:
 *
 *     message
 *     +
 *     signature
 *
 *
 * If confidentiality is required, encryption is a separate
 * concern.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Signature + encryption
 * ============================================================
 *
 * Systems can combine:
 *
 *     Authentication
 *     +
 *     Integrity
 *     +
 *     Confidentiality
 *
 *
 * But the exact construction matters.
 *
 * Do not invent your own cryptographic protocol.
 *
 * Use established standards and libraries.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Signature verification failure
 * ============================================================
 */

function safeVerify(message, signature, publicKey) {
  try {
    return verifySignature(message, signature, publicKey);
  } catch (error) {
    console.error("Signature verification error:", error.message);

    return false;
  }
}

console.log(
  "Safe verification:",
  safeVerify("Hello signatures", newSignature, publicKey),
);

/*
 * ============================================================
 * 27. Signature encoding
 * ============================================================
 *
 * Signatures are binary data.
 *
 * Node.js returns them as Buffer objects.
 *
 *
 * Common representations:
 *
 *     Buffer
 *     hex
 *     base64
 *     base64url
 *
 * ============================================================
 */

const signatureBase64 = newSignature.toString("base64");

const signatureHex = newSignature.toString("hex");

const signatureBase64Url = newSignature.toString("base64url");

console.log("Base64:", signatureBase64);

console.log("Hex:", signatureHex);

console.log("Base64URL:", signatureBase64Url);

/*
 * ============================================================
 * 28. Convert Base64 back to Buffer
 * ============================================================
 */

const restoredSignature = Buffer.from(signatureBase64, "base64");

console.log(
  "Restored signature valid:",
  verifySignature("Hello signatures", restoredSignature, publicKey),
);

/*
 * ============================================================
 * 29. Public key distribution
 * ============================================================
 *
 * A public key can be distributed to verification parties.
 *
 * Example:
 *
 *
 * Server A:
 *
 *     private key → kept secret
 *
 *
 * Server B:
 *
 *     public key → used for verification
 *
 *
 * Server A signs:
 *
 *     data + private key
 *
 *
 * Server B verifies:
 *
 *     data + signature + public key
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Real-world example
 * ============================================================
 *
 * Imagine an API response:
 *
 *     {
 *       "userId": 101,
 *       "role": "admin"
 *     }
 *
 *
 * Server signs the response.
 *
 *
 * Client receives:
 *
 *     data
 *     signature
 *
 *
 * Client verifies:
 *
 *     public key
 *     +
 *     data
 *     +
 *     signature
 *
 *
 * If verification succeeds:
 *
 *     ✓ Signature corresponds to the data
 *     ✓ Data was not modified after signing
 *
 *
 * Assuming the public key is trusted, the verifier can also
 * attribute the signature to the holder of the corresponding
 * private key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Digital signature properties
 * ============================================================
 *
 * DIGITAL SIGNATURES PROVIDE:
 *
 *     ✓ Integrity
 *     ✓ Authentication / origin assurance
 *     ✓ Non-repudiation in some legal/protocol contexts
 *
 *
 * They do NOT automatically provide:
 *
 *     ✗ Confidentiality
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Private key security
 * ============================================================
 *
 * The private key is the critical secret.
 *
 * Never:
 *
 *     - Commit it to Git
 *     - Put it in frontend JavaScript
 *     - Send it to clients
 *     - Log it
 *     - Store it in plain source code
 *
 *
 * Production systems should use appropriate secret/key
 * management mechanisms.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Public key security
 * ============================================================
 *
 * Public keys do not need to be secret.
 *
 * However:
 *
 *     PUBLIC KEY TRUST
 *
 * is still important.
 *
 *
 * An attacker who replaces your trusted public key with their
 * own could potentially make their signatures appear valid.
 *
 * Therefore applications need a trusted mechanism for
 * distributing or pinning the correct public key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Signature algorithm comparison
 * ============================================================
 *
 *
 * RSA
 * ─────────────────────────────────────────
 * Mature
 * Widely supported
 * Larger keys/signatures
 *
 *
 * ECDSA
 * ─────────────────────────────────────────
 * Elliptic-curve based
 * Smaller keys
 * Widely used
 *
 *
 * Ed25519
 * ─────────────────────────────────────────
 * Modern
 * Fast
 * Simple API
 * Small keys/signatures
 *
 *
 * The correct choice depends on protocol compatibility,
 * ecosystem support, and operational requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Hashing vs HMAC vs Signature
 * ============================================================
 *
 *
 * HASH
 *
 *     data
 *       ↓
 *     SHA-256
 *       ↓
 *     digest
 *
 * No secret key.
 *
 *
 * HMAC
 *
 *     data + secret key
 *          ↓
 *         HMAC
 *          ↓
 *     authentication
 *
 * Shared secret.
 *
 *
 * DIGITAL SIGNATURE
 *
 *     data + private key
 *          ↓
 *       signature
 *          ↓
 *     verify with public key
 *
 * Asymmetric cryptography.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Streaming signature
 * ============================================================
 *
 * createSign() supports incremental updates.
 *
 * This is useful when data is processed in chunks.
 *
 * ============================================================
 */

const streamingSigner = createSign("SHA256");

streamingSigner.update("Part 1");

streamingSigner.update("Part 2");

streamingSigner.update("Part 3");

streamingSigner.end();

const streamingSignature = streamingSigner.sign(privateKey);

console.log(
  "Streaming signature valid:",
  verifySignature("Part 1Part 2Part 3", streamingSignature, publicKey),
);

/*
 * ============================================================
 * 37. Signing a file concept
 * ============================================================
 *
 * Large files can be signed incrementally.
 *
 *
 *     File
 *       │
 *       ↓
 *   Read chunks
 *       │
 *       ↓
 * signer.update(chunk)
 *       │
 *       ↓
 * signer.sign(privateKey)
 *
 *
 * This avoids loading the entire file into memory.
 *
 * Node.js streams can be used for this pattern.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Do not confuse hashing with signing
 * ============================================================
 *
 * SHA-256:
 *
 *     createHash()
 *
 * creates a digest.
 *
 *
 * Digital signature:
 *
 *     createSign()
 *     sign()
 *
 * uses a private key.
 *
 *
 * A hash alone cannot prove who generated the data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Verify before trusting signed data
 * ============================================================
 */

const trustedMessage = "Transfer amount: 100";

const trustedSignature = signMessage(trustedMessage, privateKey);

const trusted = verifySignature(trustedMessage, trustedSignature, publicKey);

if (trusted) {
  console.log("Trusted signed message:", trustedMessage);
} else {
  console.error("Signature verification failed");
}

/*
 * ============================================================
 * 40. Security checklist
 * ============================================================
 *
 *     ✓ Keep private keys secret
 *     ✓ Verify signatures before trusting data
 *     ✓ Protect the public-key trust/distribution mechanism
 *     ✓ Use established algorithms and protocols
 *     ✓ Use SHA-256 or stronger approved hash algorithms
 *     ✓ Prefer modern signature schemes where compatible
 *     ✓ Encode signatures carefully when transporting them
 *     ✓ Do not assume signing provides encryption
 *     ✓ Do not invent custom cryptographic protocols
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. COMPLETE SIGN + VERIFY EXAMPLE
 * ============================================================
 */

function createSignatureService(privateKey, publicKey) {
  return {
    sign(data) {
      const signer = createSign("SHA256");

      signer.update(data);

      signer.end();

      return signer.sign(privateKey);
    },

    verify(data, signature) {
      const verifier = createVerify("SHA256");

      verifier.update(data);

      verifier.end();

      return verifier.verify(publicKey, signature);
    },
  };
}

const signatureService = createSignatureService(privateKey, publicKey);

const serviceMessage = "Secure Node.js message";

const serviceSignature = signatureService.sign(serviceMessage);

console.log(
  "Service verification:",
  signatureService.verify(serviceMessage, serviceSignature),
);

/*
 * ============================================================
 * 42. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *             PRIVATE KEY
 *                  │
 *                  ↓
 *             ┌─────────┐
 * Data ──────→│  SIGN   │
 *             └─────────┘
 *                  │
 *                  ↓
 *              SIGNATURE
 *
 *
 *
 *             PUBLIC KEY
 *                  │
 *                  ↓
 *          ┌──────────────┐
 * Data ───→│   VERIFY     │←── Signature
 *          └──────────────┘
 *                  │
 *                  ↓
 *             true / false
 *
 *
 * ============================================================
 *
 * SIGNATURE:
 *
 *     Private key → sign
 *
 *     Public key  → verify
 *
 *
 * ENCRYPTION:
 *
 *     Encryption key → encrypt
 *
 *     Decryption key → decrypt
 *
 *
 * HASH:
 *
 *     Data → digest
 *
 *
 * HMAC:
 *
 *     Data + shared secret → MAC
 *
 * ============================================================
 *
 * NEXT TOPIC:
 *
 *     13_password_security/
 *
 * ============================================================
 */
