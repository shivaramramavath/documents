# JWT (JSON Web Tokens) — Reference Guide

## What is a JWT?

A JWT is a compact, signed token used to prove identity/claims between parties — most commonly for authenticating API requests. It has three Base64URL-encoded parts separated by dots:

```
header.payload.signature
```

- **Header** — algorithm and token type, e.g. `{ "alg": "HS256", "typ": "JWT" }`
- **Payload** — claims (data), e.g. `{ "sub": "user123", "role": "admin", "iat": ..., "exp": ... }`
- **Signature** — proves the token wasn't tampered with; verified using a secret (HMAC) or a public/private key pair (RSA/EC)

A JWT is **signed, not encrypted** — anyone can decode and read the payload. Never put secrets or sensitive data (passwords, card numbers) in the payload.

## Install

```bash
npm install jsonwebtoken
```

```bash
npm install -D @types/jsonwebtoken   # if using TypeScript
```

## Signing a token

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { sub: user.id, role: user.role },
  env.JWT_ACCESS_SECRET,
  { expiresIn: "15m" },
);
```

## Verifying a token

```js
try {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  console.log(payload.sub, payload.role);
} catch (err) {
  if (err.name === "TokenExpiredError") {
    // token expired
  } else {
    // invalid signature / malformed token
  }
}
```

## Access token + refresh token pattern

A single long-lived token is risky — if it leaks, it's valid until it expires. The common pattern uses two tokens:

| Token             | Lifetime              | Purpose                             | Stored                                        |
| ----------------- | --------------------- | ----------------------------------- | --------------------------------------------- |
| **Access token**  | Short (e.g. 15 min)   | Sent with every API request         | Memory or short-lived cookie                  |
| **Refresh token** | Long (e.g. 7–30 days) | Used only to get a new access token | `httpOnly` secure cookie or server-side store |

```js
function issueTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN ?? "15m" },
  );

  const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  });

  return { accessToken, refreshToken };
}
```

Refresh endpoint:

```js
app.post("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ sub: payload.sub }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});
```

## Where to store tokens on the client

| Storage                           | XSS risk                               | CSRF risk                   | Notes                                                  |
| --------------------------------- | -------------------------------------- | --------------------------- | ------------------------------------------------------ |
| `localStorage` / `sessionStorage` | High — readable by any injected script | None                        | Common but not recommended for sensitive tokens        |
| In-memory (JS variable)           | Low                                    | None                        | Lost on page refresh; pair with a refresh-token cookie |
| `httpOnly` cookie                 | Low — JS can't read it                 | Yes — needs CSRF protection | Generally the safer choice for the refresh token       |

A common combo: **access token in memory**, **refresh token in an `httpOnly`, `secure` cookie**.

## Express middleware to protect routes

```js
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
```

```js
app.get("/profile", requireAuth, (req, res) => {
  res.json({ userId: req.user.sub });
});
```

## Local vs production

|                       | Local development                                  | Production                                                                                                  |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Secrets               | Distinct dev secrets in `.env`, still random/long  | Long, random, unique per environment — from a secrets manager, not committed                                |
| Token transport       | `Authorization: Bearer` header or cookie over HTTP | Same, but cookie must be `secure: true` (HTTPS) if used                                                     |
| Expiry                | Can be longer for convenience while testing        | Keep access tokens short (5–15 min); rely on refresh flow                                                   |
| Refresh token storage | `httpOnly` cookie, `sameSite: "lax"`               | `httpOnly` cookie, `sameSite: "none"` + `secure: true` if frontend/API are cross-origin (see cookie config) |
| Clock skew            | Rarely an issue                                    | Ensure server clocks are synced (NTP) — `exp`/`iat` checks are time-sensitive                               |

Generating strong secrets for `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use **different secrets** for the access token and refresh token, and different secrets per environment (dev/staging/prod) so a leaked dev secret can't be used against production.

## Validating with envalid

```js
export const env = cleanEnv(process.env, {
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES_IN: str({ default: "15m" }),
  JWT_REFRESH_EXPIRES_IN: str({ default: "7d" }),
});
```

## Common mistakes

- **Storing sensitive data in the payload** — it's readable by anyone, it's just signed, not encrypted.
- **Using one long-lived token for everything** — no way to revoke it short of waiting for expiry or maintaining a blocklist.
- **Weak or reused secrets** — use long random secrets, different per token type and per environment.
- **Not checking `err.name`** — `jwt.verify` throws different error types (`TokenExpiredError`, `JsonWebTokenError`); handling them separately gives clearer client-facing errors.
- **Skipping `expiresIn`** — a token with no expiry is valid forever once issued.
- **Mismatched `sameSite`/`secure` in production** — see the cookie reference; `SameSite=None` requires `Secure` + HTTPS.

## One-line definition

> A JWT is a signed (not encrypted) token carrying claims, verified with a secret or key pair — use short-lived access tokens plus a longer-lived refresh token, and keep secrets long, random, and environment-specific.
