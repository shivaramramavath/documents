# Node.js Crypto — Daily Used Methods

Node.js has a built-in `crypto` module.

```js
const crypto = require("node:crypto");
```

No installation required.

---

## 1. `randomBytes()`

Used to generate **secure random tokens**.

### Password reset / email verification token

```js
const token = crypto
  .randomBytes(32)
  .toString("hex");

console.log(token);
```

Use it for:

* Reset password token
* Email verification token
* API secret
* Session token

### Hash the token before storing it

```js
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
```

---

## 2. `randomUUID()`

Used to generate a unique UUID.

```js
const id = crypto.randomUUID();

console.log(id);
```

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

Useful for:

* Request IDs
* Resource IDs
* Transaction IDs

---

## 3. `randomInt()`

Used for secure random numbers, especially OTPs.

```js
const otp = crypto.randomInt(100000, 1000000);

console.log(otp);
```

Example:

```text
482931
```

Don't use:

```js
Math.random(); // ❌ for security
```

---

## 4. `createHash()`

Creates a **one-way hash**.

```js
const hash = crypto
  .createHash("sha256")
  .update("hello")
  .digest("hex");

console.log(hash);
```

Commonly used for:

* Reset token hashing
* Email verification token hashing
* File checksums

### Example

```js
const token = crypto.randomBytes(32).toString("hex");

const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
```

Store `tokenHash` in the database, not the original reset token.

> Don't use plain SHA-256 for storing user passwords. Use Argon2id or bcrypt.

---

## 5. `createHmac()`

Creates a hash using a **secret key**.

```js
const signature = crypto
  .createHmac("sha256", process.env.SECRET_KEY)
  .update("hello")
  .digest("hex");

console.log(signature);
```

Used for:

* Webhook verification
* API signatures
* Data integrity

### Simple idea

```text
data + secret
     ↓
   HMAC
     ↓
 signature
```

---

## 6. `timingSafeEqual()`

Used for safely comparing security-sensitive values.

```js
const a = Buffer.from("hello");
const b = Buffer.from("hello");

const result = crypto.timingSafeEqual(a, b);

console.log(result); // true
```

Example with HMAC:

```js
const expected = crypto
  .createHmac("sha256", secret)
  .update(data)
  .digest();

const received = Buffer.from(signature, "hex");

const valid =
  expected.length === received.length &&
  crypto.timingSafeEqual(expected, received);

console.log(valid);
```

---

## 7. `createCipheriv()` — Encryption

Used when you need to **encrypt data** so that it can later be decrypted.

Example using AES-256-GCM:

```js
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv(
  "aes-256-gcm",
  key,
  iv
);

const encrypted = Buffer.concat([
  cipher.update("secret data", "utf8"),
  cipher.final()
]);

const authTag = cipher.getAuthTag();

console.log(encrypted.toString("hex"));
```

You need:

```text
key
iv
encrypted data
authTag
```

Keep the **key secret**.

---

## 8. `createDecipheriv()` — Decryption

Decrypt the data encrypted with `createCipheriv()`.

```js
const decipher = crypto.createDecipheriv(
  "aes-256-gcm",
  key,
  iv
);

decipher.setAuthTag(authTag);

const decrypted = Buffer.concat([
  decipher.update(encrypted),
  decipher.final()
]);

console.log(decrypted.toString());
// secret data
```

---

# Daily Authentication Examples

## Forgot Password

### Step 1 — Generate token

```js
const token = crypto
  .randomBytes(32)
  .toString("hex");
```

### Step 2 — Hash token

```js
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
```

### Step 3 — Store hash

```js
await User.updateOne(
  { email },
  {
    resetTokenHash: tokenHash,
    resetTokenExpires: Date.now() + 15 * 60 * 1000
  }
);
```

### Step 4 — Send original token by email

```text
/reset-password?token=ORIGINAL_TOKEN
```

### Step 5 — User sends token back

Hash it again:

```js
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
```

Find the user using:

```js
{
  resetTokenHash: tokenHash
}
```

---

# OTP

```js
const otp = crypto.randomInt(100000, 1000000);

console.log(otp);
```

Store an appropriately protected representation with an expiry:

```js
{
  otp: "...",
  expiresAt: Date.now() + 5 * 60 * 1000
}
```

Also implement:

* Expiration
* Attempt limits
* Rate limiting
* One-time use

---

# Quick Cheat Sheet

| Method               | Use                 |
| -------------------- | ------------------- |
| `randomBytes()`      | Secure random token |
| `randomUUID()`       | UUID                |
| `randomInt()`        | OTP / random number |
| `createHash()`       | One-way hash        |
| `createHmac()`       | HMAC / signatures   |
| `timingSafeEqual()`  | Secure comparison   |
| `createCipheriv()`   | Encryption          |
| `createDecipheriv()` | Decryption          |

## Remember This

```text
Reset Token
    ↓
randomBytes()
    ↓
createHash()

OTP
    ↓
randomInt()

Webhook
    ↓
createHmac()
    ↓
timingSafeEqual()

Encrypt data
    ↓
createCipheriv()

Decrypt data
    ↓
createDecipheriv()
```

These **8 methods are enough for most day-to-day Node.js backend crypto work**.
