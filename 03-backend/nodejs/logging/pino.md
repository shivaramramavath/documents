# Pino — Reference Guide

## What is Pino?

Pino is a fast, structured logging library for Node.js. Instead of plain text via `console.log`, it emits structured JSON logs with levels and metadata — suitable for both local development and production log platforms.

```js
console.log("Server started"); // ❌ unstructured
logger.info("Server started"); // ✅ structured, leveled
```

## Install

```bash
npm install pino
npm install pino-pretty   # human-readable dev output
npm install pino-http     # Express request logging
```

## Basic usage

```js
import pino from "pino";

const logger = pino();

logger.info("Server started");
logger.warn("Low memory");
logger.error("Something went wrong");
```

Default output is structured JSON:

```json
{ "level": 30, "time": 1750000000000, "msg": "Server started" }
```

## Log levels

```
fatal → error → warn → info → debug → trace
```

| Level   | Use for                          |
| ------- | -------------------------------- |
| `fatal` | App is about to crash/terminate  |
| `error` | An operation failed              |
| `warn`  | Something unusual but not broken |
| `info`  | Normal application events        |
| `debug` | Development-time detail          |
| `trace` | Very fine-grained detail         |

Setting a level filters out anything less severe:

```js
const logger = pino({ level: "info" });
logger.debug("won't be emitted at this level");
```

## Structured logging (the main point of Pino)

Pass metadata as the first argument, message as the second:

```js
// ❌ loses structure
logger.info(`User ${user.id} logged in`);

// ✅ structured — searchable/filterable in log tools
logger.info({ userId: user.id }, "User logged in");
```

```json
{ "level": 30, "userId": "123", "msg": "User logged in" }
```

Never include sensitive fields directly: passwords, JWTs, refresh tokens, API secrets, auth headers, or cookies (see **Redaction** below).

## Error logging

Pass the error object itself, not just its message, so the stack trace is preserved:

```js
try {
  await connectDatabase();
} catch (error) {
  logger.error(error, "Database connection failed");
  // or: logger.error({ err: error }, "Database connection failed");
}
```

```js
logger.error(error.message); // ❌ loses the stack trace
```

## Redaction

Prevent secrets from ever reaching the logs, even by accident:

```js
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

```js
app.use(
  pinoHttp({
    logger,
    redact: ["req.headers.authorization", "req.headers.cookie"],
  }),
);
```

Treat redaction as a safety net, not a reason to intentionally log secrets.

## Serializers

Control exactly what gets logged for a given object, instead of dumping it wholesale:

```js
const logger = pino({
  serializers: {
    user(user) {
      return { id: user.id, role: user.role };
    },
  },
});

logger.info({ user }, "User authenticated"); // only id + role are logged
```

## Child loggers

Attach persistent metadata (service name, module, request) to a scoped logger:

```js
const paymentLogger = logger.child({ service: "payment" });

paymentLogger.info({ orderId }, "Payment completed");
// every log from paymentLogger automatically includes { "service": "payment" }
```

## Express request logging (`pino-http`)

```js
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const logger = pino({ transport: { target: "pino-pretty" } });
const app = express();

app.use(
  pinoHttp({
    logger,
    redact: ["req.headers.authorization", "req.headers.cookie"],
  }),
);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(3000, () => logger.info("Server started on port 3000"));
```

Each request log includes a request ID, method, URL, status code, and response time — useful for tracing a single request through your logs, especially in distributed systems.

## Pretty logs (development) vs JSON (production)

```js
// development — human-readable
const logger = pino({ transport: { target: "pino-pretty" } });

// production — leave as structured JSON (default), shipped to
// stdout/Docker/a log collector (Loki, ELK, cloud logging, etc.)
```

Pretty-printing is for humans reading a terminal; structured JSON is for machines searching, filtering, and aggregating logs at scale. Don't pretty-print in production.

## File logging

```js
import fs from "node:fs";
import pino from "pino";

fs.mkdirSync("./logs", { recursive: true });
const logger = pino(pino.destination("./logs/app.log"));
```

Terminal + file at once:

```js
const logger = pino({
  transport: {
    targets: [
      { target: "pino-pretty", level: "info", options: { destination: 1 } },
      {
        target: "pino/file",
        level: "info",
        options: { destination: "./logs/app.log" },
      },
    ],
  },
});
```

Split by severity into separate files:

```js
const logger = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "info",
        options: { destination: "./logs/app.log" },
      },
      {
        target: "pino/file",
        level: "error",
        options: { destination: "./logs/error.log" },
      },
    ],
  },
});
```

Local file logging can grow unbounded — for production, prefer log rotation, container/stdout logging, or a managed log platform over raw files on disk.

## Configure via `envalid`

```js
// env.js
export const env = cleanEnv(process.env, {
  LOG_LEVEL: str({
    choices: ["fatal", "error", "warn", "info", "debug", "trace"],
    default: "info",
  }),
});
```

```js
// logger.js
import pino from "pino";
import { env } from "./env.js";

export const logger = pino({ level: env.LOG_LEVEL });
```

```env
LOG_LEVEL=debug
```

## Recommended structure

```
src/
├── config/
│   ├── env.js
│   └── logger.js
├── controllers/
├── services/
└── app.js
logs/
└── app.log
```

```js
import { logger } from "./config/logger.js";
logger.info("Application started");
```

## Common mistakes

- **Logging secrets** — `logger.info({ password, jwt })` is never okay; redact instead.
- **String interpolation instead of structured fields** — ``logger.info(`User ${id} logged in`)`` loses searchability; use `logger.info({ userId: id }, "User logged in")`.
- **Everything at `info`** — use `warn`/`error`/`debug` deliberately so filtering by severity is meaningful.
- **Pretty-printing in production** — fine for a dev terminal, wasteful and harder to parse at scale in production.
- **Logging whole request objects** — `logger.info({ req })` can leak cookies, auth headers, and large payloads; log only the fields you need.
- **Passing only `error.message`** — you lose the stack trace; pass the error object itself.

## `console` vs Pino

|                 | `console`              | Pino                          |
| --------------- | ---------------------- | ----------------------------- |
| Output          | Plain text             | Structured JSON               |
| Levels          | None built-in          | `fatal`…`trace`               |
| Metadata        | Manual string building | First-class structured fields |
| Request context | Manual                 | `pino-http` handles it        |
| Best for        | Small scripts          | Production backends           |

## One-line definition

> Pino is a fast Node.js logger that produces structured, leveled logs — human-readable in development via `pino-pretty`, and machine-parseable JSON in production.
