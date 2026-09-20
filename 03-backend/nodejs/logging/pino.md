# Pino --- Node.js Reference

## 1. What is Pino?

**Pino** is a fast, structured logging library for Node.js.

It records application events such as:

-   Requests
-   Errors
-   Database connections
-   Authentication events
-   Background jobs
-   Application startup/shutdown

``` text
Application
     ↓
   Pino
     ↓
Structured logs
```

------------------------------------------------------------------------

## 2. Why Pino?

Instead of:

``` js
console.log("Server started");
console.error("Database failed");
```

Use:

``` js
logger.info("Server started");
logger.error(error, "Database failed");
```

Benefits:

-   Very fast
-   Structured JSON logs
-   Log levels
-   Metadata
-   Production friendly
-   Easy integration with log platforms

------------------------------------------------------------------------

## 3. Install

``` bash
npm install pino
```

For pretty development logs:

``` bash
npm install pino-pretty
```

For Express request logging:

``` bash
npm install pino-http
```

------------------------------------------------------------------------

## 4. Basic Usage

``` js
import pino from "pino";

const logger = pino();

logger.info("Server started");
logger.warn("Low memory");
logger.error("Something went wrong");
```

Output is structured JSON:

``` json
{
  "level": 30,
  "time": 1750000000000,
  "msg": "Server started"
}
```

------------------------------------------------------------------------

## 5. Log Levels

Pino provides standard log levels:

``` text
fatal
error
warn
info
debug
trace
```

Example:

``` js
logger.fatal("Application cannot continue");

logger.error("Database connection failed");

logger.warn("Cache unavailable");

logger.info("Server started");

logger.debug("Processing request");

logger.trace("Detailed execution information");
```

Typical usage:

``` text
fatal → application is about to terminate
error → operation failed
warn  → unusual/problematic situation
info  → normal application events
debug → development/debugging
trace → very detailed debugging
```

------------------------------------------------------------------------

## 6. Structured Logging

One of Pino's biggest advantages is structured data.

Instead of:

``` js
logger.info(`User ${user.id} logged in`);
```

Prefer:

``` js
logger.info(
  { userId: user.id },
  "User logged in"
);
```

Output contains structured metadata:

``` json
{
  "level": 30,
  "userId": "123",
  "msg": "User logged in"
}
```

This makes logs easier to search and analyze.

------------------------------------------------------------------------

## 7. Logging Objects

``` js
logger.info(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
  },
  "User authenticated"
);
```

Avoid unnecessarily logging sensitive information such as:

``` text
password
JWT
refresh token
API secret
credit card information
authorization headers
cookies containing authentication tokens
```

------------------------------------------------------------------------

## 8. Log Level Configuration

``` js
import pino from "pino";

export const logger = pino({
  level: "info",
});
```

Now:

``` js
logger.debug("Debug message");
```

will not normally be emitted when the configured level is `info`.

------------------------------------------------------------------------

## 9. Environment-Based Level

With `envalid`:

``` js
import pino from "pino";
import { env } from "./config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
});
```

`.env`:

``` env
LOG_LEVEL=debug
```

------------------------------------------------------------------------

## 10. Pretty Logs in Development

Install:

``` bash
npm install pino-pretty
```

Configuration:

``` js
import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});
```

Development output becomes easier to read:

``` text
INFO: Server started
INFO: MongoDB connected
WARN: Redis unavailable
```

For production, structured JSON logs are generally preferable.

------------------------------------------------------------------------

## 11. File Logging

Pino can write logs directly to a file.

``` js
import fs from "node:fs";
import pino from "pino";

fs.mkdirSync("./logs", { recursive: true });

const logger = pino(
  pino.destination("./logs/app.log")
);

logger.info("Server started");
logger.warn("Cache unavailable");
logger.error("Database connection failed");
```

The `logs` directory is created by the application and Pino creates the
log file.

Project:

``` text
project/
├── logs/
│   └── app.log
├── src/
│   └── config/
│       └── logger.js
└── package.json
```

### Pretty Terminal + File

``` js
import pino from "pino";

const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          destination: 1,
        },
      },
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: "./logs/app.log",
        },
      },
    ],
  },
});
```

Result:

``` text
Terminal → Pretty logs
File     → logs/app.log
```

------------------------------------------------------------------------

## 12. Multiple Log Destinations

You can send logs to different destinations.

Example:

``` js
import pino from "pino";

const logger = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: "./logs/app.log",
        },
      },
      {
        target: "pino/file",
        level: "error",
        options: {
          destination: "./logs/error.log",
        },
      },
    ],
  },
});
```

Structure:

``` text
logs/
├── app.log
└── error.log
```

`app.log` receives `info` and higher-priority logs.

`error.log` receives `error` and higher-priority logs.

------------------------------------------------------------------------

## 13. Child Logger

Create a logger with persistent metadata:

``` js
const userLogger = logger.child({
  service: "user",
});
```

Then:

``` js
userLogger.info("User created");
userLogger.info("User deleted");
```

Both logs contain:

``` json
{
  "service": "user"
}
```

Useful for:

-   Services
-   Modules
-   Requests
-   Workers

Example:

``` js
const paymentLogger = logger.child({
  service: "payment",
});

paymentLogger.info(
  { orderId },
  "Payment completed"
);
```

------------------------------------------------------------------------

## 14. Error Logging

Use the error object as the first argument:

``` js
try {
  await connectDatabase();
} catch (error) {
  logger.error(error, "Database connection failed");
}
```

Avoid:

``` js
logger.error(error.message);
```

because you lose useful structured error information such as the stack.

Another valid pattern:

``` js
logger.error(
  { err: error },
  "Database connection failed"
);
```

------------------------------------------------------------------------

## 15. HTTP Request Logging

For Express:

``` bash
npm install pino-http
```

Example:

``` js
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
```

Request logs can contain:

``` text
request ID
HTTP method
URL
status code
response time
request information
response information
```

------------------------------------------------------------------------

## 16. Request ID

Request IDs help trace a request across services.

Conceptually:

``` text
Request
   ↓
requestId: abc123
   ↓
Controller
   ↓
Service
   ↓
Database
   ↓
Response
```

Every related log can contain:

``` json
{
  "requestId": "abc123"
}
```

This is extremely useful for production debugging and distributed
systems.

------------------------------------------------------------------------

## 17. Redaction

Never expose secrets in logs.

Pino supports redaction:

``` js
import pino from "pino";

const logger = pino({
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "password",
    "accessToken",
    "refreshToken",
  ],
});
```

With `pino-http`:

``` js
app.use(
  pinoHttp({
    logger,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
    ],
  })
);
```

Common sensitive fields:

``` text
password
access token
refresh token
JWT
authorization header
session cookie
API keys
database credentials
```

### Important

Do not log:

``` js
logger.info({
  password,
  refreshToken,
});
```

Use redaction as an additional safety layer, not as a reason to
intentionally log secrets.

------------------------------------------------------------------------

## 18. Serializers

Serializers control how objects are converted into log data.

Example:

``` js
import pino from "pino";

const logger = pino({
  serializers: {
    user(user) {
      return {
        id: user.id,
        role: user.role,
      };
    },
  },
});
```

Now:

``` js
logger.info(
  { user },
  "User authenticated"
);
```

Only selected user fields are logged.

Serializers are useful for:

-   Removing unnecessary fields
-   Controlling log structure
-   Avoiding sensitive data
-   Standardizing objects

------------------------------------------------------------------------

## 19. Transports

A transport controls where/how logs are processed or displayed.

Development:

``` js
const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});
```

File:

``` js
const logger = pino(
  pino.destination("./logs/app.log")
);
```

Multiple destinations:

``` js
const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
      },
      {
        target: "pino/file",
        options: {
          destination: "./logs/app.log",
        },
      },
    ],
  },
});
```

Concept:

``` text
Application
     ↓
   Pino
     ↓
 Transport
  ↙     ↓     ↘
Console  File  Log platform
```

------------------------------------------------------------------------

## 20. Recommended Logger Structure

For a Node.js backend:

``` text
src/
├── config/
│   ├── env.js
│   └── logger.js
├── controllers/
├── services/
├── routes/
└── app.js

logs/
└── app.log
```

`logger.js`:

``` js
import fs from "node:fs";
import pino from "pino";
import { env } from "./env.js";

fs.mkdirSync("./logs", { recursive: true });

export const logger = pino({
  level: env.LOG_LEVEL,
});
```

Then:

``` js
import { logger } from "./config/logger.js";

logger.info("Application started");
```

------------------------------------------------------------------------

## 21. Pino + Envalid

`.env`:

``` env
LOG_LEVEL=debug
```

`env.js`:

``` js
import "dotenv/config";

import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  LOG_LEVEL: str({
    choices: [
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ],
    default: "info",
  }),
});
```

`logger.js`:

``` js
import fs from "node:fs";
import pino from "pino";
import { env } from "./env.js";

fs.mkdirSync("./logs", { recursive: true });

export const logger = pino({
  level: env.LOG_LEVEL,
});
```

Architecture:

``` text
.env
 ↓
dotenv
 ↓
envalid
 ↓
env.LOG_LEVEL
 ↓
Pino
 ↓
Application logs
```

------------------------------------------------------------------------

## 22. Pino + Express + File Logging

Recommended development setup:

``` js
import fs from "node:fs";
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";

fs.mkdirSync("./logs", { recursive: true });

const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          destination: 1,
        },
      },
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: "./logs/app.log",
        },
      },
    ],
  },
});

const app = express();

app.use(
  pinoHttp({
    logger,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
    ],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
```

Architecture:

``` text
                    ┌──→ Pretty Terminal
                    │
Request → Express → Pino
                    │
                    └──→ logs/app.log
```

------------------------------------------------------------------------

## 23. Production Logging

Development:

``` text
pino-pretty
     ↓
Human-readable logs
```

Production:

``` text
Pino
 ↓
JSON logs
 ↓
Docker / stdout / log collector
 ↓
Loki / ELK / Cloud logging
```

Production logs should generally remain structured JSON.

Example:

``` json
{
  "level": 30,
  "time": 1750000000000,
  "pid": 1234,
  "hostname": "server-01",
  "requestId": "abc123",
  "method": "GET",
  "url": "/users",
  "statusCode": 200,
  "responseTime": 24,
  "msg": "request completed"
}
```

Structured logs are easier for machines to search, filter, aggregate,
and analyze.

------------------------------------------------------------------------

## 24. Understanding `pino-http` Logs

A typical request log may contain:

``` text
level
time
pid
hostname
req
res
responseTime
msg
```

Inside `req`:

``` text
id
method
url
headers
remoteAddress
remotePort
```

Inside `res`:

``` text
statusCode
```

`responseTime` represents how long the request took.

Example:

``` text
GET /users
statusCode: 200
responseTime: 18ms
```

------------------------------------------------------------------------

## 25. `console` vs Pino

  `console`                              Pino
  -------------------------------------- -----------------------------
  Simple                                 Structured
  Basic output                           JSON logs
  Basic methods                          Formal log levels
  Limited metadata                       Rich metadata
  Simple debugging                       Production logging
  Request context requires manual work   Easy request context
  Suitable for small scripts             Suitable for large backends

Use `console.log()` for very simple scripts.

For a serious Node.js backend, use a logging library such as Pino.

------------------------------------------------------------------------

## 26. Common Mistakes

### Logging secrets

``` js
logger.info({
  password,
  jwt,
});
```

❌ Never do this.

### String concatenation everywhere

``` js
logger.info(`User ${id} logged in`);
```

Prefer:

``` js
logger.info(
  { userId: id },
  "User logged in"
);
```

### Logging everything at `info`

Use appropriate levels:

``` text
info  → normal application events
warn  → unusual situations
error → failures
debug → development details
trace → very detailed debugging
```

### Pretty-printing production logs

Pretty logs are mainly useful during development.

Production systems generally benefit from structured JSON.

### Logging entire request objects

Avoid blindly logging:

``` js
logger.info({ req });
```

Requests can contain:

-   Cookies
-   Authorization headers
-   User information
-   Large payloads
-   Sensitive data

Log only the fields you need.

### Creating huge log files

Local file logging can eventually consume disk space.

For production, use:

-   Log rotation
-   Docker logging
-   Cloud logging
-   Loki
-   ELK/OpenSearch
-   Managed logging services

------------------------------------------------------------------------

# Quick Revision

``` text
Pino
│
├── What?
│   └── Fast structured logger for Node.js
│
├── Install
│   ├── npm install pino
│   ├── npm install pino-pretty
│   └── npm install pino-http
│
├── Levels
│   ├── fatal
│   ├── error
│   ├── warn
│   ├── info
│   ├── debug
│   └── trace
│
├── Core
│   ├── logger.info()
│   ├── logger.error()
│   ├── logger.warn()
│   └── logger.debug()
│
├── Structured logging
│   └── logger.info({ userId }, "message")
│
├── Child logger
│   └── logger.child({ service })
│
├── Errors
│   └── logger.error(error, "message")
│
├── Express
│   └── pino-http
│
├── Security
│   └── redact secrets
│
├── Output
│   ├── pino-pretty → development
│   ├── file → local/persistent logs
│   └── JSON → production/log platforms
│
├── Serializers
│   └── control logged object data
│
└── Configuration
    └── dotenv + envalid
```

## One-line Definition

> **Pino is a fast Node.js logger that produces structured logs suitable
> for development and production.**
