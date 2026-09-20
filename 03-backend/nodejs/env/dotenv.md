# dotenv — Node.js Reference

## 1. What is dotenv?

`dotenv` is a Node.js library that loads variables from a `.env` file into `process.env`.

```text
.env → dotenv → process.env → Application
```

---

## 2. Why use dotenv?

Keep configuration outside source code.

❌ Hardcoded:

```js
const PORT = 5000;
const JWT_SECRET = "secret";
```

✅ Environment variables:

```env
PORT=5000
JWT_SECRET=my-secret
```

```js
console.log(process.env.PORT);
```

Useful for:

- Database URLs
- API keys
- JWT secrets
- Ports
- Redis URLs
- App configuration

---

## 3. Install

```bash
npm install dotenv
```

---

## 4. Basic Usage

### CommonJS

```js
require("dotenv").config();
```

### ES Modules

```js
import dotenv from "dotenv";

dotenv.config();
```

### Short form

```js
import "dotenv/config";
```

Then:

```js
console.log(process.env.PORT);
```

---

## 5. `.env`

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/app
JWT_SECRET=my-secret
REDIS_URL=redis://localhost:6379
```

---

## 6. Important: Values Are Strings

```env
PORT=5000
DEBUG=true
```

```js
process.env.PORT; // "5000"
process.env.DEBUG; // "true"
```

Convert when necessary:

```js
const port = Number(process.env.PORT);
const debug = process.env.DEBUG === "true";
```

For proper validation/type conversion, use **envalid**.

---

## 7. `.env.example`

Commit an example, not your real secrets:

```env
PORT=
NODE_ENV=
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
```

`.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

---

## 8. Custom `.env` Path

```js
dotenv.config({
  path: ".env.development",
});
```

Example:

```text
.env
.env.development
.env.test
.env.production
```

---

## 9. Override Existing Variables

By default, existing environment variables are not overwritten.

```js
dotenv.config({
  override: true,
});
```

Use this carefully because environment-variable precedence matters.

---

## 10. Recommended Configuration Pattern

Don't access `process.env` everywhere.

Create:

```text
src/
└── config/
    └── env.ts
```

```ts
import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
};
```

Use:

```ts
import { env } from "./config/env.js";

console.log(env.port);
```

---

## 11. dotenv + envalid

`dotenv` **loads**.

`envalid` **validates**.

```text
.env
 ↓
dotenv
 ↓
process.env
 ↓
envalid
 ↓
validated config
 ↓
Application
```

Example:

```ts
import "dotenv/config";
import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  DATABASE_URL: url(),
  JWT_SECRET: str(),
});
```

---

## 12. dotenv vs envalid

| Library   | Purpose                             |
| --------- | ----------------------------------- |
| `dotenv`  | Load `.env`                         |
| `envalid` | Validate/type environment variables |

Remember:

> **dotenv = Load**
> **envalid = Validate**

---

## 13. Security

`dotenv` is **not** a secret manager.

It does not:

- Encrypt secrets
- Validate secrets
- Secure production credentials

Never:

```js
console.log(process.env);
```

Never commit:

```text
.env
```

For production, consider:

- AWS Secrets Manager
- Kubernetes Secrets
- Docker Secrets
- HashiCorp Vault
- Cloud-provider secret managers

---

## 14. Docker

Docker can inject environment variables directly:

```yaml
services:
  server:
    env_file:
      - .env
```

Inside Node:

```js
process.env.DATABASE_URL;
```

---

## 15. Modern Node.js Alternative

Modern Node.js can load `.env` without `dotenv`:

```bash
node --env-file=.env src/server.js
```

So:

```text
dotenv
```

is a popular library-based solution, while:

```text
node --env-file
```

is the native Node.js approach.

---

## 16. Common Mistakes

### Forgetting to load dotenv

```js
import "dotenv/config";
```

### Assuming values have types

```js
process.env.PORT; // "5000"
```

not:

```js
5000;
```

### Committing `.env`

Add:

```gitignore
.env
```

### Accessing environment variables everywhere

Prefer:

```text
process.env
     ↓
config/env.ts
     ↓
application
```

### Expecting dotenv to validate

Use:

```text
dotenv + envalid
```

---

# Quick Revision

```text
dotenv
│
├── What?
│   └── Loads .env → process.env
│
├── Install
│   └── npm install dotenv
│
├── Load
│   ├── dotenv.config()
│   └── import "dotenv/config"
│
├── Important
│   └── Environment values are strings
│
├── Security
│   ├── Don't commit .env
│   └── Don't log secrets
│
├── Configuration
│   └── Centralize in config/env.ts
│
└── With envalid
    ├── dotenv = Load
    └── envalid = Validate
```

## One-line definition

> **dotenv loads environment variables from `.env` into `process.env`.**
