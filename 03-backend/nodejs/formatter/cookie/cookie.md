# Cookies — Local vs Production Configuration

A reference for configuring cookies (auth/session cookies especially) so they work correctly in local development **and** in production, without silently breaking when you deploy.

## Why this needs separate config

Browsers apply stricter rules to cookies over HTTPS and across different domains (e.g. frontend on `app.example.com`, API on `api.example.com`). A cookie setup that works on `localhost` over plain HTTP often silently fails once deployed, because the flags that make cross-site cookies work in production (`Secure`, `SameSite=None`) require HTTPS — which `localhost` usually doesn't have.

## Key cookie attributes

| Attribute            | Purpose                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `httpOnly`           | Prevents JavaScript (`document.cookie`) from reading the cookie — mitigates XSS token theft. Almost always `true` for auth cookies.                                  |
| `secure`             | Cookie is only sent over HTTPS. Required in production; usually `false` in local HTTP dev.                                                                           |
| `sameSite`           | Controls cross-site sending. `"lax"` (default-friendly), `"strict"` (never cross-site), or `"none"` (needed for cross-origin frontend/API, requires `secure: true`). |
| `domain`             | Which host(s) the cookie is sent to. Omit for same-origin; set explicitly to share across subdomains.                                                                |
| `maxAge` / `expires` | How long the cookie persists. Omit for a session-only cookie that clears when the browser closes.                                                                    |
| `path`               | URL path scope, usually `/`.                                                                                                                                         |

## The core rule

```
SameSite=None  →  requires Secure=true  →  requires HTTPS
```

If your frontend and backend are on **different origins** in production (different domains or ports), you need `sameSite: "none"` + `secure: true`, and both must be served over HTTPS — browsers reject `SameSite=None` cookies sent over plain HTTP.

## Environment-based config (Node/Express example)

```js
import { env } from "./config/env.js"; // e.g. from envalid, NODE_ENV: "development" | "production"

const isProduction = env.NODE_ENV === "production";

res.cookie("token", jwt, {
  httpOnly: true,
  secure: isProduction, // false on localhost (HTTP), true in prod (HTTPS)
  sameSite: isProduction ? "none" : "lax", // "none" for cross-origin prod, "lax" for same-origin local dev
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});
```

|                     | Local development                                                | Production                                                 |
| ------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Protocol            | HTTP                                                             | HTTPS                                                      |
| Frontend/API origin | Usually same (`localhost:5173` proxying to `:5000`) or same-site | Often different domains                                    |
| `secure`            | `false`                                                          | `true`                                                     |
| `sameSite`          | `"lax"`                                                          | `"none"` (cross-origin) or `"lax"` (same-site)             |
| `domain`            | Omit                                                             | Set only if sharing across subdomains, e.g. `.example.com` |

## express-session example

```js
import session from "express-session";

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);
```

## Common local-dev pitfalls

- **Cookie not being set at all in the browser** — usually `sameSite: "none"` without `secure: true`, or trying to use `secure: true` over plain `http://localhost`. Browsers silently drop the cookie in this case.
- **CORS blocking cookies cross-origin** — cookies won't be sent cross-origin unless the request is made with credentials and the server allows it:

  ```js
  // client (fetch/axios)
  fetch(url, { credentials: "include" });

  // server (cors middleware)
  app.use(
    cors({
      origin: env.CORS_ORIGIN, // exact origin, not "*"
      credentials: true,
    }),
  );
  ```

  `credentials: true` on the server cannot be combined with a wildcard `origin: "*"` — you must specify the exact allowed origin.

- **Cookie set on the wrong domain** — if the frontend runs on `localhost:5173` and the API on `localhost:5000`, they're different origins even though the hostname matches; make sure `sameSite`/`credentials` handle that, or proxy API requests through the frontend dev server to keep everything same-origin locally.

## Production checklist

- [ ] Site is served over HTTPS (required for `secure` and `SameSite=None` cookies)
- [ ] `secure: true`, `httpOnly: true` on all auth/session cookies
- [ ] `sameSite` set deliberately (`"none"` only if genuinely cross-origin, with CORS `credentials: true` and an explicit `origin`)
- [ ] `domain` only set if you need cross-subdomain sharing — otherwise omit it
- [ ] Reasonable `maxAge`, and a way to invalidate/rotate the cookie value server-side (e.g. on logout)

## One-line takeaway

> Cookies that work on `localhost` won't automatically work in production — switch `secure`/`sameSite` based on environment (`NODE_ENV` or similar), and remember `SameSite=None` always requires `Secure` + HTTPS.
