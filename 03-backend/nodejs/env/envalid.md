# envalid — Node.js Reference

## 1. What is envalid?

`envalid` is a Node.js library for **validating and cleaning environment variables**.

It helps ensure that required configuration exists and has the correct type/value.

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

---

## 2. Why use envalid?

Without validation:

```js
const port = process.env.PORT;
```

Problems:

- `PORT` may not exist
- `PORT` may contain invalid data
- Everything from `process.env` is a string
- Errors may appear later during application execution

With `envalid`:

```js
const env = cleanEnv(process.env, {
  PORT: port(),
});
```

Now `env.PORT` is validated and converted to a number.

---

# 3. Install

Using npm:

```bash
npm install envalid
```

Usually combine it with dotenv:

```bash
npm install dotenv envalid
```

---

# 4. Basic Usage

```js
import "dotenv/config";

import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
});

console.log(env.NODE_ENV);
console.log(env.PORT);
```

`.env`:

```env
NODE_ENV=development
PORT=5000
```

Result:

```js
env.NODE_ENV; // "development"
env.PORT; // 5000
```

---

# 5. Main Function — `cleanEnv()`

The most important function:

```js
cleanEnv(process.env, schema);
```

Example:

```js
const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: url(),
  JWT_SECRET: str(),
});
```

Think:

```text
cleanEnv()
   │
   ├── receives process.env
   │
   ├── validates variables
   │
   ├── converts values
   │
   └── returns clean configuration
```

---

# 6. Common Validators

## `str()`

String value:

```js
APP_NAME: str();
```

```env
APP_NAME=MyApp
```

---

## `num()`

Number:

```js
MAX_USERS: num();
```

```env
MAX_USERS=100
```

Result:

```js
env.MAX_USERS; // 100
```

---

## `port()`

Valid TCP port:

```js
PORT: port();
```

```env
PORT=5000
```

---

## `bool()`

Boolean:

```js
ENABLE_CACHE: bool();
```

```env
ENABLE_CACHE=true
```

Result:

```js
env.ENABLE_CACHE; // true
```

---

## `url()`

URL:

```js
DATABASE_URL: url();
```

Example:

```env
DATABASE_URL=mongodb://localhost:27017/app
```

---

## `email()`

Email:

```js
ADMIN_EMAIL: email();
```

```env
ADMIN_EMAIL=admin@example.com
```

---

# 7. Required Variables

By default, validators such as:

```js
JWT_SECRET: str();
```

require the variable to exist.

If:

```env
JWT_SECRET=
```

or it is missing, validation fails.

This is useful for critical configuration.

---

# 8. Default Values

Use `default` when a variable is optional.

```js
PORT: port({
  default: 5000,
});
```

If `PORT` isn't supplied:

```js
env.PORT;
```

becomes:

```text
5000
```

Another example:

```js
LOG_LEVEL: str({
  default: "info",
});
```

---

# 9. Allowed Values — `choices`

Restrict a variable to specific values:

```js
NODE_ENV: str({
  choices: ["development", "test", "production"],
});
```

Valid:

```env
NODE_ENV=production
```

Invalid:

```env
NODE_ENV=hello
```

This is useful for enum-like configuration.

---

# 10. Example: Real Backend Configuration

```js
import "dotenv/config";

import { cleanEnv, port, str, url, bool } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),

  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: url(),

  REDIS_URL: url(),

  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),

  JWT_ACCESS_EXPIRES_IN: str({
    default: "15m",
  }),

  ENABLE_SWAGGER: bool({
    default: false,
  }),

  CORS_ORIGIN: url(),
});
```

Now use:

```js
import { env } from "./config/env.js";

console.log(env.PORT);
console.log(env.DATABASE_URL);
```

---

# 11. Recommended Project Structure

```text
project/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
│
└── src/
    ├── config/
    │   └── env.js
    │
    ├── controllers/
    ├── services/
    ├── routes/
    ├── middlewares/
    ├── app.js
    └── server.js
```

`src/config/env.js`:

```js
import "dotenv/config";

import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),

  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: url(),

  JWT_SECRET: str(),
});
```

---

# 12. Why `cleanEnv`?

Instead of using:

```js
process.env.PORT;
```

throughout your application, use:

```js
env.PORT;
```

This gives you a central configuration boundary:

```text
process.env
     ↓
  envalid
     ↓
  env.js
     ↓
Application
```

Your application only consumes validated configuration.

---

# 13. `process.env` vs `env`

Without envalid:

```js
process.env.PORT;
```

Type/value:

```text
"5000"
```

With envalid:

```js
env.PORT;
```

Type/value:

```text
5000
```

Therefore:

```js
app.listen(env.PORT);
```

is cleaner than repeatedly parsing environment variables.

---

# 14. `devDefault`

Sometimes you want a default only during development.

Example:

```js
PORT: port({
  devDefault: 5000,
});
```

Conceptually:

```text
development → 5000 if missing
production  → required
```

This is useful when local development can use a convenient default but production must explicitly provide the configuration.

---

# 15. `example`

You can provide an example value/documentation:

```js
DATABASE_URL: url({
  example: "mongodb://localhost:27017/myapp",
});
```

This helps communicate what the variable should look like when validation errors are displayed.

---

# 16. `desc`

Add descriptions:

```js
PORT: port({
  desc: "HTTP server port",
  default: 5000,
});
```

Another example:

```js
JWT_SECRET: str({
  desc: "Secret used to sign access tokens",
});
```

Useful for making configuration self-documenting.

---

# 17. Strict Validation

`cleanEnv()` also helps prevent unexpected configuration from silently becoming part of your application's configuration object.

The idea is:

```text
process.env
     ↓
define expected variables
     ↓
validate
     ↓
use only known configuration
```

This makes configuration easier to reason about.

---

# 18. Error Handling

Suppose:

```env
PORT=hello
```

and:

```js
PORT: port();
```

`envalid` detects that the value is invalid and reports a configuration error when the application starts.

This is much better than discovering the problem later.

Think:

```text
Application starts
       ↓
Validate configuration
       ↓
❌ Invalid
       ↓
Fail immediately
```

This is called **fail-fast configuration validation**.

---

# 19. `dotenv` vs `envalid`

| Library       | Responsibility                         |
| ------------- | -------------------------------------- |
| `dotenv`      | Load `.env`                            |
| `envalid`     | Validate environment variables         |
| `process.env` | Node.js environment variable interface |

Architecture:

```text
.env
 ↓
dotenv
 ↓
process.env
 ↓
envalid
 ↓
validated env
```

Remember:

> **dotenv loads. envalid validates.**

---

# 20. Important Validators to Learn

Start with these:

```js
str();
num();
port();
bool();
url();
email();
```

Then learn configuration options:

```js
default
devDefault
choices
desc
example
```

These cover most Node.js backend configuration requirements.

---

# 21. Security

`envalid` validates configuration.

It does **not** encrypt secrets.

Do not:

```js
console.log(env.JWT_SECRET);
```

Do not commit:

```text
.env
```

Use production secret-management solutions when appropriate.

---

# 22. Best Practice

For your Node.js backend:

```text
.env
   ↓
dotenv
   ↓
process.env
   ↓
envalid
   ↓
src/config/env.js
   ↓
Express / MongoDB / Redis / JWT / Pino
```

Use:

```js
env.DATABASE_URL;
env.JWT_SECRET;
env.REDIS_URL;
env.PORT;
```

instead of accessing:

```js
process.env.DATABASE_URL;
process.env.JWT_SECRET;
process.env.REDIS_URL;
process.env.PORT;
```

throughout the application.

```js
import 'dotenv/config';

import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
  MONGODB_URL: str({
    desc: 'MongoDB connection URL',
    example: 'mongodb://localhost:27017/test',
  }),
});
```
Use it:

```js
import { env } from './config/env.js';

console.log(env.MONGODB_URL);
```
---

# Quick Revision

```text
envalid
│
├── What?
│   └── Environment variable validation
│
├── Install
│   └── npm install envalid
│
├── Main function
│   └── cleanEnv()
│
├── Validators
│   ├── str()
│   ├── num()
│   ├── port()
│   ├── bool()
│   ├── url()
│   └── email()
│
├── Options
│   ├── default
│   ├── devDefault
│   ├── choices
│   ├── desc
│   └── example
│
└── Core idea
    └── dotenv = load
        envalid = validate
```

## One-line definition

> **envalid validates, converts, and cleans Node.js environment variables so your application starts with a reliable configuration.**
