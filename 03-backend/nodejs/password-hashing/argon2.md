# Argon2 — Node.js Reference

## 1. What is Argon2?

**Argon2** is a password-hashing algorithm designed to securely store user passwords.

Never store passwords directly:

```js
password: "MyPassword123";
```

Instead:

```text
User password
     ↓
   Argon2
     ↓
Password hash
     ↓
Database
```

Argon2 is a **password hashing algorithm**, not encryption.

---

## 2. Why Argon2?

Password hashing should be:

- One-way
- Slow enough to resist brute-force attacks
- Memory-intensive
- Resistant to GPU/ASIC attacks
- Unique for each password

Argon2 is designed specifically for password hashing.

### Hashing vs Encryption

```text
Hashing
Password → Hash
       ↘ cannot be reversed

Encryption
Data → Encrypted data
       ↕
     Decryption
```

Passwords should be **hashed**, not encrypted.

---

## 3. Argon2 Variants

Argon2 has three variants:

```text
Argon2d
Argon2i
Argon2id
```

For password storage, **Argon2id** is generally the preferred variant.

```text
Argon2id
├── Memory-hard
├── Resistant to side-channel attacks
└── Designed for password hashing
```

---

## 4. Install

```bash
npm install argon2
```

---

## 5. Basic Hashing

```js
import argon2 from "argon2";

const password = "MyPassword123";

const hash = await argon2.hash(password);

console.log(hash);
```

Example output:

```text
$argon2id$v=19$m=65536,t=3,p=4$...
```

The resulting hash contains the information required for verification, including the algorithm parameters and salt.

---

## 6. Verify Password

During login, never hash the password manually and compare strings.

Use:

```js
const isValid = await argon2.verify(hash, password);

if (isValid) {
  console.log("Password correct");
} else {
  console.log("Invalid password");
}
```

Flow:

```text
Login password
      ↓
argon2.verify()
      ↓
Stored password hash
      ↓
true / false
```

---

## 7. Registration Flow

```js
import argon2 from "argon2";

const password = req.body.password;

const passwordHash = await argon2.hash(password);

await User.create({
  email: req.body.email,
  password: passwordHash,
});
```

Database:

```text
users
├── email
└── passwordHash
```

Never store:

```text
password
passwordPlainText
```

---

## 8. Login Flow

```js
import argon2 from "argon2";

const user = await User.findOne({
  email: req.body.email,
});

if (!user) {
  throw new Error("Invalid credentials");
}

const valid = await argon2.verify(user.passwordHash, req.body.password);

if (!valid) {
  throw new Error("Invalid credentials");
}

console.log("Login successful");
```

Recommended authentication flow:

```text
Client
  ↓
Email + Password
  ↓
Find user
  ↓
argon2.verify()
  ↓
Valid?
 ├── No  → Reject
 └── Yes → Create session/JWT
```

---

## 9. Salt

A **salt** is random data used during password hashing.

Argon2 automatically generates a salt when using:

```js
await argon2.hash(password);
```

Therefore, normally you do **not** need to generate or store a salt manually.

The salt is encoded inside the resulting Argon2 hash.

Example:

```text
$argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
```

---

## 10. Hash Format

A typical Argon2id hash looks like:

```text
$argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
```

Meaning:

```text
argon2id
   ↓
Algorithm

v=19
   ↓
Argon2 version

m=65536
   ↓
Memory cost

t=3
   ↓
Time/iteration cost

p=4
   ↓
Parallelism

salt
   ↓
Random salt

hash
   ↓
Password hash
```

You store the **complete hash** in the database.

---

## 11. Custom Options

Argon2 allows configuration:

```js
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
});
```

Important parameters:

| Parameter     | Meaning              |
| ------------- | -------------------- |
| `type`        | Argon2 variant       |
| `memoryCost`  | Memory used          |
| `timeCost`    | Number of iterations |
| `parallelism` | Parallel lanes       |

Higher costs generally increase password-hashing work.

---

## 12. Recommended Variant

Explicitly selecting Argon2id:

```js
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
});
```

For production, tune the cost parameters according to your server's CPU and memory resources.

Do not blindly copy expensive parameters without benchmarking your deployment environment.

---

## 13. Password Service

Instead of calling Argon2 everywhere, create a dedicated service.

```text
src/
├── services/
│   └── password.service.js
├── controllers/
├── models/
└── config/
```

`password.service.js`:

```js
import argon2 from "argon2";

export const hashPassword = (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = (hash, password) => {
  return argon2.verify(hash, password);
};
```

Usage:

```js
import { hashPassword, verifyPassword } from "../services/password.service.js";

const passwordHash = await hashPassword(password);

const valid = await verifyPassword(user.passwordHash, password);
```

---

## 14. Password Update

When a user changes their password:

```js
const passwordHash = await argon2.hash(newPassword);

user.passwordHash = passwordHash;

await user.save();
```

Do not update the password with plaintext.

---

## 15. Password Reset

Typical flow:

```text
User requests reset
        ↓
Generate reset token
        ↓
Send email
        ↓
User submits new password
        ↓
Argon2 hash(new password)
        ↓
Store new hash
        ↓
Invalidate reset token
```

The password itself should never be sent through email or stored in the reset-token record.

---

## 16. Password Validation

Argon2 does **not** validate password strength.

Use a separate validation layer:

```js
if (password.length < 8) {
  throw new Error("Password is too short");
}
```

For production applications, use a validation library or an appropriate password policy.

Architecture:

```text
Request
   ↓
Validate password
   ↓
Argon2 hash
   ↓
Database
```

---

## 17. Argon2 + MongoDB

Example Mongoose model:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
```

Registration:

```js
const passwordHash = await argon2.hash(password);

const user = await User.create({
  email,
  passwordHash,
});
```

---

## 18. Never Return Password Hash

Avoid:

```js
res.json(user);
```

if the returned object contains:

```text
passwordHash
```

Prefer selecting only required fields:

```js
const user = await User.findById(userId).select("-passwordHash");
```

Or explicitly construct the response:

```js
res.json({
  id: user.id,
  email: user.email,
});
```

---

## 19. Avoid User Enumeration

For login, use a generic error:

```js
throw new Error("Invalid credentials");
```

Avoid exposing:

```text
User does not exist
```

versus:

```text
Wrong password
```

This prevents attackers from easily determining which email addresses are registered.

---

## 20. Timing Considerations

Password verification is intentionally computationally expensive.

Do not add unnecessary password hashing operations.

Correct:

```js
const valid = await argon2.verify(user.passwordHash, password);
```

If the user doesn't exist, do not attempt to create an authentication success path.

Use a consistent authentication error response.

---

## 21. Argon2 vs bcrypt

| Argon2                             | bcrypt                           |
| ---------------------------------- | -------------------------------- |
| Modern password hashing algorithm  | Older password hashing algorithm |
| Memory-hard                        | Primarily CPU-hard               |
| Argon2id recommended for passwords | Widely supported                 |
| Configurable memory cost           | Configurable work factor         |
| Strong choice for new systems      | Still commonly used              |

For a new Node.js backend, **Argon2id is a strong choice**.

---

## 22. Argon2 vs JWT

These solve completely different problems.

```text
Argon2
   ↓
Password security

JWT
   ↓
Authentication token
```

Typical architecture:

```text
Registration
    ↓
Argon2
    ↓
passwordHash
    ↓
Database

Login
    ↓
Argon2.verify()
    ↓
Valid password
    ↓
JWT / Session
    ↓
Authenticated requests
```

Argon2 does **not** replace JWT or sessions.

---

## 23. Argon2 + JWT Authentication

```text
              Registration
                   ↓
              Argon2.hash()
                   ↓
             passwordHash
                   ↓
               Database


                 Login
                   ↓
             Argon2.verify()
                   ↓
              Valid password
                   ↓
              Create JWT
                   ↓
              Client receives
                   ↓
          Authenticated requests
```

---

## 24. Security Rules

### Never store plaintext passwords

```js
// ❌
password: password;
```

Use:

```js
// ✅
passwordHash: await argon2.hash(password);
```

### Never log passwords

```js
// ❌
logger.info({ password });
```

### Never log password hashes unnecessarily

```js
// ❌
logger.debug({ passwordHash });
```

### Never send password hashes to clients

```js
// ❌
res.json(user);
```

### Never put passwords in JWTs

```js
// ❌
jwt.sign({
  userId,
  password,
});
```

JWT payload should contain only necessary non-secret claims.

---

## 25. Environment Configuration

Argon2 cost parameters can be configured through environment variables when your application needs operational control.

`.env`:

```env
ARGON2_MEMORY_COST=65536
ARGON2_TIME_COST=3
ARGON2_PARALLELISM=4
```

Validate them with `envalid`:

```js
import "dotenv/config";

import { cleanEnv, num } from "envalid";

export const env = cleanEnv(process.env, {
  ARGON2_MEMORY_COST: num({
    default: 65536,
  }),

  ARGON2_TIME_COST: num({
    default: 3,
  }),

  ARGON2_PARALLELISM: num({
    default: 4,
  }),
});
```

Use them:

```js
import argon2 from "argon2";
import { env } from "../config/env.js";

const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: env.ARGON2_MEMORY_COST,
  timeCost: env.ARGON2_TIME_COST,
  parallelism: env.ARGON2_PARALLELISM,
});
```

Benchmark these settings before deploying them.

---

## 26. Recommended Authentication Structure

```text
src/
├── config/
│   ├── env.js
│   └── logger.js
│
├── models/
│   └── user.model.js
│
├── services/
│   └── password.service.js
│
├── controllers/
│   └── auth.controller.js
│
├── routes/
│   └── auth.routes.js
│
└── app.js
```

Flow:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Password Service
   ↓
Argon2
   ↓
MongoDB
```

---

## 27. Complete Password Service

```js
import argon2 from "argon2";

export const hashPassword = async (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (passwordHash, password) => {
  return argon2.verify(passwordHash, password);
};
```

Usage:

```js
const passwordHash = await hashPassword(password);

const isValid = await verifyPassword(user.passwordHash, password);
```

---

# Quick Revision

```text
Argon2
│
├── What?
│   └── Password hashing algorithm
│
├── Install
│   └── npm install argon2
│
├── Recommended
│   └── Argon2id
│
├── Hash
│   └── argon2.hash(password)
│
├── Verify
│   └── argon2.verify(hash, password)
│
├── Security
│   ├── Never store plaintext passwords
│   ├── Never log passwords
│   ├── Never expose password hashes
│   └── Never put passwords in JWTs
│
├── Parameters
│   ├── memoryCost
│   ├── timeCost
│   └── parallelism
│
├── Authentication
│   ├── Registration → hash
│   └── Login → verify
│
└── Architecture
    └── Controller → Password Service → Argon2
```

## One-line Definition

> **Argon2 is a memory-hard password hashing algorithm used to securely store and verify user passwords.**
