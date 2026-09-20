# Passport.js — Node.js Reference

## 1. What is Passport.js?

**Passport.js** is an authentication middleware for Node.js.

It provides a common interface for implementing authentication strategies such as:

- Username/password
- JWT
- Google OAuth
- GitHub OAuth
- Facebook
- OpenID Connect
- Custom authentication strategies

Architecture:

```text
Client
  ↓
Express
  ↓
Passport
  ↓
Authentication Strategy
  ↓
User
```

---

## 2. Why Passport.js?

Without Passport, you have to implement authentication flows manually.

Passport provides:

- Authentication middleware
- Strategy-based authentication
- Session support
- OAuth integration
- JWT authentication
- `req.user`
- Protected routes
- Pluggable strategies

Important:

> Passport handles authentication workflows; it does not replace password hashing, sessions, JWT libraries, or your user database.

---

## 3. Install

Core:

```bash
npm install passport
```

Express:

```bash
npm install express
```

For local username/password authentication:

```bash
npm install passport-local
```

For JWT:

```bash
npm install passport-jwt
```

For Google OAuth:

```bash
npm install passport-google-oauth20
```

---

# 4. Passport Middleware

Basic setup:

```js
import express from "express";
import passport from "passport";

const app = express();

app.use(passport.initialize());
```

`passport.initialize()` adds Passport's authentication middleware to Express.

---

# 5. Strategies

Passport uses **strategies** to determine how authentication is performed.

Examples:

```text
passport-local
      ↓
Email + Password

passport-jwt
      ↓
JWT

passport-google-oauth20
      ↓
Google OAuth

passport-github2
      ↓
GitHub OAuth
```

Concept:

```text
Passport
   ↓
Strategy
   ↓
Verify credentials
   ↓
User
```

---

# 6. Local Strategy

Install:

```bash
npm install passport-local
```

Example:

```js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        const valid = await verifyPassword(
          user.passwordHash,
          password
        );

        if (!valid) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
```

The strategy verifies the supplied credentials and returns the authenticated user.

---

# 7. `done()` Callback

Passport strategies commonly use:

```js
done(error, user, info)
```

Examples:

```js
return done(null, user);
```

Authentication failed:

```js
return done(null, false);
```

Unexpected error:

```js
return done(error);
```

Optional information:

```js
return done(
  null,
  false,
  { message: "Invalid credentials" }
);
```

Concept:

```text
done(error, user, info)
     ↓
Passport
     ↓
Success / Failure / Error
```

---

# 8. Authenticate a Route

Using Local Strategy:

```js
app.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({
      message: "Login successful",
      user: req.user,
    });
  }
);
```

Passport runs the Local Strategy before the controller.

---

# 9. `req.user`

After successful authentication:

```js
req.user
```

contains the authenticated user.

Example:

```js
app.get("/profile", (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});
```

Do not expose sensitive fields such as:

```text
passwordHash
password
refreshToken
secret keys
```

---

# 10. Sessions

Passport can work with server-side sessions.

Install:

```bash
npm install express-session
```

Setup:

```js
import session from "express-session";
import passport from "passport";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
```

Flow:

```text
Login
  ↓
Passport
  ↓
User authenticated
  ↓
Session created
  ↓
Session ID
  ↓
Client cookie
```

---

# 11. `serializeUser()`

When using sessions, Passport needs to determine what user information should be stored in the session.

```js
passport.serializeUser((user, done) => {
  done(null, user.id);
});
```

Usually, store only a user identifier.

Avoid:

```js
done(null, user);
```

if the entire user object is unnecessarily stored.

---

# 12. `deserializeUser()`

On later requests, Passport uses the stored identifier to retrieve the user.

```js
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
```

Flow:

```text
Session
   ↓
User ID
   ↓
deserializeUser()
   ↓
Database
   ↓
User
   ↓
req.user
```

---

# 13. Session Authentication Flow

```text
Login
  ↓
Passport Local Strategy
  ↓
Argon2.verify()
  ↓
User authenticated
  ↓
serializeUser()
  ↓
Session ID
  ↓
Cookie
  ↓
Future request
  ↓
deserializeUser()
  ↓
req.user
```

---

# 14. `req.isAuthenticated()`

When using Passport sessions:

```js
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.json({
    user: req.user,
  });
});
```

Useful for protecting session-based routes.

---

# 15. Protected Route Middleware

Create reusable middleware:

```js
export const requireAuth = (
  req,
  res,
  next
) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};
```

Use:

```js
app.get(
  "/profile",
  requireAuth,
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);
```

---

# 16. JWT Strategy

Install:

```bash
npm install passport-jwt
```

JWT authentication does not require Passport sessions.

Example:

```js
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";

const opts = {
  jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(
    opts,
    async (payload, done) => {
      try {
        const user = await User.findById(
          payload.sub
        );

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
```

The strategy extracts and verifies the JWT, then uses the payload to identify the user.

---

# 17. JWT + Passport

Typical flow:

```text
Login
  ↓
Verify password
  ↓
Create JWT
  ↓
Client
  ↓
Authorization: Bearer <token>
  ↓
Passport JWT Strategy
  ↓
Verify token
  ↓
Find user
  ↓
req.user
```

---

# 18. JWT Strategy Configuration

Complete example:

```js
import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
} from "passport-jwt";

const options = {
  jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken(),

  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(
    options,
    async (payload, done) => {
      try {
        const user = await User.findById(
          payload.sub
        );

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
```

Protected route:

```js
app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);
```

For JWT APIs, `session: false` is commonly used because the JWT itself carries the authentication state.

---

# 19. Passport + `jose`

Passport's JWT strategy and `jose` solve overlapping parts of JWT authentication.

If using `jose` directly:

```js
import { jwtVerify } from "jose";
```

You can build your own authentication middleware:

```js
const { payload } = await jwtVerify(
  token,
  secret,
  {
    algorithms: ["HS256"],
  }
);
```

Architecture:

```text
Option A

Express
  ↓
Passport
  ↓
passport-jwt
  ↓
JWT verification


Option B

Express
  ↓
Custom middleware
  ↓
jose
  ↓
JWT verification
```

Choose one clear approach rather than duplicating JWT verification.

---

# 20. Passport + Argon2

Passport does not hash passwords.

Use Argon2 inside the Local Strategy:

```js
const valid = await argon2.verify(
  user.passwordHash,
  password
);
```

Architecture:

```text
Passport Local Strategy
          ↓
      Find User
          ↓
   Argon2.verify()
          ↓
    Authentication
```

Responsibilities:

```text
Argon2
→ Password hashing

Passport
→ Authentication workflow

Database
→ User persistence

jose
→ JWT signing/verification
```

---

# 21. Google OAuth

Install:

```bash
npm install passport-google-oauth20
```

Example:

```js
import passport from "passport";
import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "/auth/google/callback",
    },
    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value;

        const user = await findOrCreateUser({
          googleId: profile.id,
          email,
          name: profile.displayName,
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
```

---

# 22. OAuth Flow

```text
User
 ↓
Your Application
 ↓
Google
 ↓
User grants permission
 ↓
Google callback
 ↓
Passport Strategy
 ↓
Find/Create User
 ↓
Authenticated User
```

Route:

```js
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
```

Callback:

```js
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
```

---

# 23. OAuth Credentials

Store provider credentials in environment variables:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Validate them using `envalid`:

```js
GOOGLE_CLIENT_ID: str(),
GOOGLE_CLIENT_SECRET: str(),
```

Never commit secrets to Git.

---

# 24. Multiple Strategies

A single application can have multiple strategies.

```text
Passport
│
├── local
│   └── Email + Password
│
├── jwt
│   └── API authentication
│
├── google
│   └── Google OAuth
│
└── github
    └── GitHub OAuth
```

Routes choose the required strategy:

```js
passport.authenticate("local")
```

or:

```js
passport.authenticate("jwt", {
  session: false,
})
```

or:

```js
passport.authenticate("google")
```

---

# 25. Custom Strategy

Passport allows custom strategies when your authentication mechanism does not fit an existing strategy.

Concept:

```text
Request
  ↓
Custom Strategy
  ↓
Validate credentials
  ↓
Find user
  ↓
done(null, user)
```

Custom strategies are useful for specialized authentication systems.

---

# 26. Session vs JWT

| Session | JWT |
|---|---|
| Server stores session state | Token carries claims |
| Usually cookie-based | Header or cookie |
| Passport session support | Passport JWT strategy |
| Easy server-side revocation | Requires token/revocation design |
| Good for traditional web apps | Common for APIs/distributed systems |
| Requires session store for scaling | Verification can be stateless |

Neither mechanism is universally correct.

Choose based on your application's architecture.

---

# 27. Passport Architecture

Recommended structure:

```text
src/
├── config/
│   ├── env.js
│   └── passport.js
│
├── strategies/
│   ├── local.strategy.js
│   ├── jwt.strategy.js
│   └── google.strategy.js
│
├── middleware/
│   └── auth.middleware.js
│
├── services/
│   ├── password.service.js
│   └── auth.service.js
│
├── controllers/
│   └── auth.controller.js
│
├── routes/
│   └── auth.routes.js
│
└── app.js
```

---

# 28. Recommended Separation of Responsibilities

```text
Argon2
  ↓
Password hashing / verification

Passport
  ↓
Authentication strategies

jose
  ↓
JWT / JOSE operations

Express
  ↓
HTTP middleware and routes

MongoDB
  ↓
User data
```

Avoid putting all authentication logic into one file.

---

# 29. Error Handling

Strategy:

```js
passport.use(
  new LocalStrategy(
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });

        if (!user) {
          return done(null, false);
        }

        const valid =
          await verifyPassword(
            user.passwordHash,
            password
          );

        if (!valid) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
```

Keep authentication errors generic to avoid leaking unnecessary account information.

---

# 30. Security Rules

### Never store plaintext passwords

Use:

```text
Argon2
```

### Never log passwords or tokens

```js
// ❌
logger.info({
  password,
  accessToken,
});
```

### Don't expose password hashes

```js
// ❌
res.json(user);
```

if `user` contains `passwordHash`.

### Use HTTPS

Authentication credentials and tokens should be transmitted over TLS.

### Protect OAuth callbacks

Validate:

- Callback URL
- OAuth state
- Provider configuration
- Redirect behavior

### Secure cookies

When using session authentication, configure cookies appropriately:

```text
HttpOnly
Secure
SameSite
```

### Keep secrets outside source code

Use:

```text
.env
 ↓
dotenv
 ↓
envalid
 ↓
Passport configuration
```

---

# 31. Passport + Pino

Authentication events can be logged with Pino.

```js
import { logger } from "../config/logger.js";

logger.info(
  {
    userId: user.id,
  },
  "User authenticated"
);
```

Do not log:

```text
password
JWT
access token
refresh token
session secret
OAuth client secret
cookies
Authorization header
```

---

# 32. Authentication Stack

A scalable Node.js authentication stack can look like:

```text
                    Authentication
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
       Argon2           Passport           jose
          │                │                │
    Password hash     Strategies        JWT / JOSE
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                        Express
                           ↓
                       Database
```

---

# 33. Complete Authentication Flow

### Registration

```text
Client
  ↓
POST /register
  ↓
Validate input
  ↓
Argon2.hash(password)
  ↓
Store passwordHash
  ↓
Database
```

### Login

```text
Client
  ↓
POST /login
  ↓
Passport Local Strategy
  ↓
Find user
  ↓
Argon2.verify()
  ↓
Authenticated
  ↓
Create session / JWT
  ↓
Client
```

### Protected API

```text
Client
  ↓
Authorization: Bearer token
  ↓
Passport JWT Strategy
  ↓
Verify token
  ↓
Find user
  ↓
req.user
  ↓
Controller
```

### OAuth

```text
Client
  ↓
/auth/google
  ↓
Google
  ↓
Callback
  ↓
Passport Google Strategy
  ↓
Find/Create User
  ↓
Session / Application Token
  ↓
Authenticated
```

---

# 34. Common Mistakes

### Mixing authentication responsibilities

Don't make Passport responsible for password hashing.

```text
Argon2 → passwords
Passport → authentication strategies
jose → JWT/JOSE
```

### Using sessions unintentionally

For JWT APIs:

```js
passport.authenticate("jwt", {
  session: false,
})
```

### Returning complete user objects

Only return safe fields.

### Hard-coding OAuth credentials

Use environment variables.

### Logging credentials

Never log authentication secrets.

### Registering strategies in route files

Prefer a dedicated strategy/configuration layer.

---

# Quick Revision

```text
Passport.js
│
├── What?
│   └── Node.js authentication middleware
│
├── Install
│   ├── npm install passport
│   ├── npm install passport-local
│   ├── npm install passport-jwt
│   └── npm install passport-google-oauth20
│
├── Core
│   ├── passport.initialize()
│   ├── passport.authenticate()
│   ├── req.user
│   └── req.isAuthenticated()
│
├── Sessions
│   ├── serializeUser()
│   └── deserializeUser()
│
├── Strategies
│   ├── Local
│   ├── JWT
│   ├── Google
│   ├── GitHub
│   └── Custom
│
├── Argon2
│   └── Password hashing
│
├── jose
│   └── JWT / JOSE
│
└── Express
    └── Authentication middleware
```

## One-line Definition

> **Passport.js is a Node.js authentication middleware that provides a strategy-based system for implementing local, JWT, OAuth, and other authentication mechanisms.**
