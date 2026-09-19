# jose — Node.js Reference

## 1. What is `jose`?

**`jose`** is a JavaScript library implementing standards for **JSON Object Signing and Encryption (JOSE)**.

It provides APIs for:

- JWT
- JWS — JSON Web Signature
- JWE — JSON Web Encryption
- JWK — JSON Web Key
- JWKS — JSON Web Key Set
- Signing
- Verification
- Encryption
- Decryption

Architecture:

```text
Application
     ↓
   jose
     ↓
JWT / JWS / JWE
     ↓
Authentication / Security
```

---

## 2. Install

```bash
npm install jose
```

---

# 3. JWT

A JWT commonly contains:

```text
Header.Payload.Signature
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

JWT is commonly used to carry authenticated claims between a client and server.

Typical flow:

```text
Login
  ↓
Verify password with Argon2
  ↓
Create JWT
  ↓
Client
  ↓
Authenticated request
  ↓
Verify JWT
  ↓
Access protected resource
```

---

# 4. Create a Secret

For symmetric JWT signing such as `HS256`:

```js
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
```

The secret should come from environment configuration.

Never hard-code production secrets:

```js
// ❌
const secret = "my-secret";
```

---

# 5. Sign a JWT

```js
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const token = await new SignJWT({
  userId: "123",
  role: "user",
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);

console.log(token);
```

The JWT contains:

```text
Header
Payload
Signature
```

---

# 6. JWT Claims

Common claims:

```text
iss → issuer
sub → subject
aud → audience
exp → expiration time
iat → issued at
nbf → not before
jti → JWT ID
```

Example:

```js
const token = await new SignJWT({
  role: "user",
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(user.id)
  .setIssuer("my-api")
  .setAudience("my-client")
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);
```

---

# 7. Verify JWT

Use `jwtVerify()`:

```js
import { jwtVerify } from "jose";

const { payload } = await jwtVerify(token, secret);

console.log(payload);
```

Verification checks the token's cryptographic signature and registered claims according to the supplied verification options.

---

# 8. Verify Issuer and Audience

For stronger validation:

```js
const { payload } = await jwtVerify(token, secret, {
  issuer: "my-api",
  audience: "my-client",
});
```

This helps ensure that the token was intended for your application.

---

# 9. Verify Expected Algorithm

Don't blindly accept arbitrary algorithms.

Example:

```js
const { payload } = await jwtVerify(token, secret, {
  algorithms: ["HS256"],
});
```

The expected algorithm should be explicitly defined by your application.

---

# 10. Decode JWT vs Verify JWT

These are different operations.

### Decode

Reading JWT contents does **not** prove authenticity.

### Verify

Cryptographic verification proves that the token was signed by a party possessing the expected key and that verification constraints are satisfied.

Never authenticate a user using only decoded JWT data.

Concept:

```text
decode
  ↓
Read data

verify
  ↓
Validate authenticity
```

---

# 11. `decodeJwt()`

You can decode a JWT:

```js
import { decodeJwt } from "jose";

const payload = decodeJwt(token);

console.log(payload);
```

This is useful for inspecting token contents, but **do not use it as authentication**.

Wrong:

```js
const payload = decodeJwt(token);

// ❌ Do not trust payload for authorization
if (payload.role === "admin") {
  // ...
}
```

Correct:

```js
const { payload } = await jwtVerify(token, secret);
```

Then use the verified payload.

---

# 12. Access Token

A typical access token should be short-lived.

Example:

```js
const accessToken = await new SignJWT({
  role: user.role,
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);
```

Typical architecture:

```text
Access Token
     ↓
Short lifetime
     ↓
API authorization
```

---

# 13. Refresh Token

A refresh token is used to obtain a new access token.

Conceptually:

```text
Access Token
   ↓
Short-lived

Refresh Token
   ↓
Longer-lived
   ↓
Obtain new access token
```

A common architecture:

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Client
  ↓
Access token expires
  ↓
Refresh token
  ↓
New access token
```

Refresh-token design requires additional considerations such as rotation, revocation, storage, and reuse detection.

---

# 14. Access + Refresh Token Example

Access token:

```js
const accessToken = await new SignJWT({
  role: user.role,
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);
```

Refresh token:

```js
const refreshToken = await new SignJWT({})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(secret);
```

For production systems, use a separate key or signing strategy for different token purposes when appropriate.

---

# 15. JWT Authentication Middleware

Express example:

```js
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

Protected route:

```js
app.get("/profile", authenticate, (req, res) => {
  res.json({
    userId: req.user.sub,
  });
});
```

---

# 16. Better Authorization

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

Example:

```js
if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Forbidden" });
}
```

Architecture:

```text
JWT verification
      ↓
Authentication
      ↓
User identity
      ↓
Authorization
      ↓
Resource access
```

---

# 17. HS256 vs RS256 vs ES256

JWT signing algorithms include different key models.

| Algorithm | Key Type           | Model      |
| --------- | ------------------ | ---------- |
| HS256     | Shared secret      | Symmetric  |
| RS256     | RSA keys           | Asymmetric |
| ES256     | EC keys            | Asymmetric |
| EdDSA     | Ed25519/Ed448 keys | Asymmetric |

### HS256

```text
Secret
  ↕
Sign + Verify
```

Same secret is used by both sides.

### RS256 / ES256 / EdDSA

```text
Private Key
    ↓
  Sign

Public Key
    ↓
 Verify
```

Asymmetric signing is useful when multiple services need to verify tokens without possessing the private signing key.

---

# 18. Generate a Key Pair

For asymmetric algorithms:

```js
import { generateKeyPair } from "jose";

const { publicKey, privateKey } = await generateKeyPair("RS256");
```

You can use:

```text
privateKey → signing
publicKey  → verification
```

Never expose the private key.

---

# 19. Sign with RSA

```js
import { SignJWT, generateKeyPair } from "jose";

const { privateKey } = await generateKeyPair("RS256");

const token = await new SignJWT({
  userId: "123",
})
  .setProtectedHeader({
    alg: "RS256",
  })
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(privateKey);
```

Verify:

```js
import { jwtVerify } from "jose";

const { payload } = await jwtVerify(token, publicKey, {
  algorithms: ["RS256"],
});
```

---

# 20. JWK

**JWK = JSON Web Key**

It represents a cryptographic key as JSON.

Example concept:

```json
{
  "kty": "RSA",
  "n": "...",
  "e": "AQAB",
  "alg": "RS256",
  "use": "sig"
}
```

JWK is useful for representing and distributing keys in a standardized format.

---

# 21. JWKS

**JWKS = JSON Web Key Set**

A JWKS contains multiple JWKs.

Concept:

```text
JWKS
│
├── Key 1
├── Key 2
└── Key 3
```

Typical endpoint:

```text
/.well-known/jwks.json
```

Services can retrieve public keys and use them to verify signed tokens.

---

# 22. Key Rotation

Key rotation means periodically replacing signing keys.

Example:

```text
Old Key
   ↓
Still verify existing tokens

New Key
   ↓
Sign new tokens
```

A JWKS can expose both keys during the transition:

```text
JWKS
├── kid: old-key
└── kid: new-key
```

JWT header:

```json
{
  "alg": "RS256",
  "kid": "new-key"
}
```

The `kid` identifies the key used for signing.

---

# 23. `kid` — Key ID

When using multiple signing keys:

```js
const token = await new SignJWT({
  userId: user.id,
})
  .setProtectedHeader({
    alg: "RS256",
    kid: "key-2026-01",
  })
  .sign(privateKey);
```

The verifier can use the `kid` to select the corresponding public key.

---

# 24. JWS

**JWS = JSON Web Signature**

JWS provides integrity and authenticity through digital signatures or MACs.

Concept:

```text
Payload
   ↓
Sign
   ↓
JWS
```

JWT is commonly represented as a compact JWS when it is signed.

---

# 25. JWE

**JWE = JSON Web Encryption**

JWE provides confidentiality by encrypting data.

Concept:

```text
Sensitive data
      ↓
   Encrypt
      ↓
     JWE
      ↓
   Decrypt
```

Important distinction:

```text
JWS → integrity + authenticity

JWE → confidentiality
```

A signed JWT does **not** automatically hide its payload.

---

# 26. JWT Payload Is Not Secret

Do not put sensitive information into a normal signed JWT expecting it to be hidden.

For example:

```js
// ❌ Avoid sensitive information
new SignJWT({
  password: "secret",
  bankAccount: "...",
});
```

A normal JWT payload can be decoded by anyone holding the token.

Use minimal claims:

```js
new SignJWT({
  role: "user",
});
```

---

# 27. Token Expiration

Always use an expiration for access tokens:

```js
.setExpirationTime("15m")
```

Examples:

```js
.setExpirationTime("15m")
.setExpirationTime("1h")
.setExpirationTime("7d")
```

Short-lived access tokens reduce the useful lifetime of a stolen token.

---

# 28. Issuer and Audience

Use standard claims:

```js
const token = await new SignJWT({
  role: "user",
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(user.id)
  .setIssuer("my-api")
  .setAudience("my-client")
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);
```

Verify:

```js
await jwtVerify(token, secret, {
  issuer: "my-api",
  audience: "my-client",
  algorithms: ["HS256"],
});
```

---

# 29. JWT ID

`jti` identifies a particular JWT.

```js
const token = await new SignJWT({
  role: "user",
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setJti(crypto.randomUUID())
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret);
```

Useful for:

- Token tracking
- Revocation systems
- Refresh-token rotation
- Replay detection

---

# 30. Cookies vs Authorization Header

JWTs can be transported in different ways.

### Authorization Header

```http
Authorization: Bearer <token>
```

Common for APIs.

### HttpOnly Cookie

```http
Set-Cookie: accessToken=...
```

Useful for browser-based applications.

For sensitive authentication cookies, commonly consider:

```text
HttpOnly
Secure
SameSite
```

Cookie configuration should match your application's deployment and cross-site requirements.

---

# 31. `jose` + Argon2

These libraries solve different problems.

```text
Argon2
  ↓
Password hashing

jose
  ↓
JWT signing / verification
```

Complete authentication flow:

```text
Registration
     ↓
Password
     ↓
Argon2.hash()
     ↓
passwordHash
     ↓
Database


Login
     ↓
Password
     ↓
Argon2.verify()
     ↓
Valid
     ↓
jose SignJWT
     ↓
Access Token
     ↓
Client
```

---

# 32. Recommended Auth Structure

```text
src/
├── config/
│   ├── env.js
│   └── logger.js
│
├── services/
│   ├── password.service.js
│   └── token.service.js
│
├── middleware/
│   └── authenticate.js
│
├── controllers/
│   └── auth.controller.js
│
├── routes/
│   └── auth.routes.js
│
└── app.js
```

`password.service.js`:

```js
import argon2 from "argon2";

export const hashPassword = (password) =>
  argon2.hash(password, {
    type: argon2.argon2id,
  });

export const verifyPassword = (hash, password) => argon2.verify(hash, password);
```

`token.service.js`:

```js
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const createAccessToken = async (user) => {
  return new SignJWT({
    role: user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
};
```

---

# 33. Centralize JWT Configuration

Don't repeat JWT configuration throughout the application.

```js
import { TextEncoder } from "node:util";

export const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
```

Better:

```text
.env
 ↓
dotenv
 ↓
envalid
 ↓
JWT configuration
 ↓
jose
```

---

# 34. Error Handling

JWT verification can fail because of:

```text
expired token
invalid signature
invalid claims
wrong issuer
wrong audience
wrong algorithm
malformed token
```

Handle authentication failures safely:

```js
try {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  req.user = payload;

  next();
} catch {
  return res.status(401).json({
    message: "Invalid or expired token",
  });
}
```

Don't expose unnecessary cryptographic details to clients.

Log detailed errors internally when appropriate.

---

# 35. Security Rules

### Never trust decoded JWTs

```js
// ❌
const payload = decodeJwt(token);
```

for authentication.

Use:

```js
// ✅
const { payload } = await jwtVerify(token, secret);
```

### Never hard-code secrets

```js
// ❌
const secret = "secret123";
```

Use environment/configuration management.

### Never put passwords in JWTs

```js
// ❌
new SignJWT({
  password,
});
```

### Keep access tokens short-lived

```js
.setExpirationTime("15m")
```

### Validate expected algorithms

```js
{
  algorithms: ["HS256"];
}
```

### Use minimal claims

Don't put unnecessary sensitive information in tokens.

---

# 36. Common Mistakes

### Mistake 1 — Decode instead of verify

```js
const payload = decodeJwt(token);
```

❌ Decoding doesn't establish authenticity.

### Mistake 2 — No expiration

```js
new SignJWT(payload);
```

without an expiration.

Prefer:

```js
.setExpirationTime("15m")
```

### Mistake 3 — Trusting client claims

Never assume:

```js
{
  role: "admin";
}
```

is trustworthy until the token has been cryptographically verified.

### Mistake 4 — Weak secret

Use a strong randomly generated secret for symmetric signing.

### Mistake 5 — Logging tokens

```js
logger.info({ token });
```

❌ Never log access or refresh tokens.

### Mistake 6 — Storing sensitive data in JWT payloads

Signed JWT payloads are readable.

### Mistake 7 — Accepting arbitrary algorithms

Explicitly configure expected algorithms.

---

# 37. `jose` vs `jsonwebtoken`

| `jose`                     | `jsonwebtoken`           |
| -------------------------- | ------------------------ |
| Modern JOSE implementation | Older/common JWT library |
| JWT                        | JWT                      |
| JWS                        | Limited JWT/JWS focus    |
| JWE                        | Not its primary focus    |
| JWK                        | Not its primary focus    |
| JWKS                       | Not its primary focus    |
| Web Crypto-oriented APIs   | Traditional Node.js APIs |
| Strong standards focus     | Common legacy choice     |

For a new Node.js authentication system where you want broader JOSE functionality, `jose` is a strong choice.

---

# Quick Revision

```text
jose
│
├── What?
│   └── JavaScript JOSE implementation
│
├── Install
│   └── npm install jose
│
├── JWT
│   ├── SignJWT
│   ├── jwtVerify
│   └── decodeJwt
│
├── JOSE
│   ├── JWS → signing
│   ├── JWE → encryption
│   ├── JWK → key
│   └── JWKS → key set
│
├── Algorithms
│   ├── HS256
│   ├── RS256
│   ├── ES256
│   └── EdDSA
│
├── Claims
│   ├── iss
│   ├── sub
│   ├── aud
│   ├── exp
│   ├── iat
│   ├── nbf
│   └── jti
│
├── Authentication
│   ├── Argon2 → password
│   ├── jose → tokens
│   └── Express middleware → verification
│
└── Security
    ├── Verify before trusting
    ├── Short expiration
    ├── Minimal claims
    ├── Strong keys
    ├── Expected algorithms
    └── Never log tokens
```

## One-line Definition

> **`jose` is a JavaScript library for implementing JWT, JWS, JWE, JWK, JWKS, signing, verification, encryption, and related JOSE standards.**
