# Passport.js — Overview

## 1. Overview

**Passport.js** is an authentication middleware for Node.js applications.

It provides a **strategy-based authentication system**. Instead of implementing every authentication mechanism from scratch, Passport allows an application to plug in different authentication strategies.

Common strategies include:

- Username/password authentication
- JWT authentication
- Google OAuth
- GitHub OAuth
- OAuth 2.0
- OpenID Connect
- Custom authentication mechanisms

Passport is commonly used with Express applications.

### What problem does Passport solve?

Authentication involves several responsibilities:

- Receiving credentials
- Validating credentials
- Identifying the user
- Creating an authenticated request
- Managing sessions when required
- Integrating external identity providers
- Attaching the authenticated user to the request

Passport provides a common middleware and strategy architecture for these workflows.

### Important distinction

Passport **does not replace**:

- Password hashing libraries such as Argon2
- JWT libraries such as `jose`
- Databases such as MongoDB
- Session stores such as Redis
- Input validation libraries
- Authorization systems such as RBAC

Passport primarily provides the **authentication workflow and strategy abstraction**.

---

## 2. Why Passport.js?

Without Passport, an application may need to implement authentication flows manually.

For example, a username/password login might require:

```text
Request
   ↓
Validate input
   ↓
Find user
   ↓
Verify password
   ↓
Create authentication state
   ↓
Attach user
   ↓
Return response
```

Passport provides a standardized place for the authentication logic through strategies.

### Passport provides

- Authentication middleware
- Strategy-based authentication
- Session integration
- OAuth integration
- JWT authentication through strategies
- `req.user`
- Protected routes
- Pluggable authentication mechanisms

### Without Passport

You might implement:

```text
Express
   ↓
Custom authentication middleware
   ↓
Custom credential verification
   ↓
Custom session/JWT handling
```

### With Passport

```text
Express
   ↓
Passport
   ↓
Authentication Strategy
   ↓
Verify credentials
   ↓
User
```

Passport does not eliminate the need to understand authentication. It provides an organized architecture for implementing it.

---

## 3. Where Passport Fits in Node.js

Passport is a **third-party Node.js package**, not a built-in Node.js API.

A typical backend can look like:

```text
                    Client
                       │
                       ▼
                   Express
                       │
                       ▼
               Passport Middleware
                       │
             ┌─────────┼─────────┐
             │         │         │
             ▼         ▼         ▼
           Local      JWT      OAuth
             │         │         │
             └─────────┼─────────┘
                       ▼
                    User
                       │
                       ▼
                   Database
```

Passport sits between the HTTP request and the application's authentication logic.

---

## 4. Prerequisites

### Required

Before learning Passport, understand:

- JavaScript fundamentals
- Node.js fundamentals
- Express middleware
- HTTP requests and responses
- HTTP headers
- Cookies
- Basic authentication concepts
- Async/await
- Promises

### Recommended

For advanced Passport development:

- TypeScript
- MongoDB/Mongoose
- Password hashing
- JWT
- Sessions
- OAuth 2.0
- OpenID Connect
- Redis
- REST API architecture
- CORS
- CSRF
- HTTPS

---

## 5. Authentication vs Authorization

Passport primarily deals with **authentication**.

### Authentication

Authentication answers:

> Who are you?

Example:

```text
User
 ↓
Email + Password
 ↓
Authentication
 ↓
User identified
```

### Authorization

Authorization answers:

> What are you allowed to do?

Example:

```text
Authenticated User
       ↓
      Role
       ↓
   Admin?
    /   \
  Yes    No
   ↓      ↓
Allow    Deny
```

These are different responsibilities.

### Example

```text
Authentication
    ↓
Identify Shiva
    ↓
User ID = 123
    ↓
Authorization
    ↓
Does user 123 have admin permission?
```

Passport can authenticate the user, but your application generally handles authorization separately.

---

## 6. Passport Strategy

The most important Passport concept is the **strategy**.

A strategy defines **how a user should be authenticated**.

Examples:

| Strategy       | Authentication Method               |
| -------------- | ----------------------------------- |
| Local          | Username/password                   |
| JWT            | JWT token                           |
| Google         | Google OAuth                        |
| GitHub         | GitHub OAuth                        |
| OpenID Connect | OIDC provider                       |
| Custom         | Application-specific authentication |

Conceptually:

```text
Passport
   │
   ├── Local Strategy
   │      ↓
   │   Email + Password
   │
   ├── JWT Strategy
   │      ↓
   │   JWT Token
   │
   ├── Google Strategy
   │      ↓
   │   Google OAuth
   │
   └── Custom Strategy
          ↓
      Custom credentials
```

The application chooses the strategy required for a particular authentication flow.

---

## 7. Basic Installation

Install Passport:

```bash
npm install passport
```

For an Express application:

```bash
npm install express
```

A minimal setup:

```ts
import express from "express";
import passport from "passport";

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Important

`passport` and `express` are third-party packages.

Node.js itself does not provide Passport.

---

## 8. `passport.initialize()`

`passport.initialize()` adds Passport's authentication middleware to an Express application.

```ts
app.use(passport.initialize());
```

It prepares the request for Passport authentication.

A simplified request flow is:

```text
HTTP Request
     ↓
Express
     ↓
passport.initialize()
     ↓
passport.authenticate(...)
     ↓
Strategy
     ↓
Authentication
```

Without initializing Passport, Passport authentication middleware will not be properly integrated into the Express request lifecycle.

---

## 9. `passport.use()`

Strategies are registered using:

```ts
passport.use(strategy);
```

Example:

```ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // Authenticate user
  }),
);
```

The strategy becomes available to Passport after registration.

You can also provide a strategy name:

```ts
passport.use("local-login", strategy);
```

Then authenticate using:

```ts
passport.authenticate("local-login");
```

---

## 10. `passport.authenticate()`

`passport.authenticate()` is middleware used to execute a Passport strategy.

Example:

```ts
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Login successful",
    user: req.user,
  });
});
```

The flow is:

```text
POST /login
     ↓
passport.authenticate("local")
     ↓
Local Strategy
     ↓
Verify credentials
     ↓
Authenticated user
     ↓
req.user
     ↓
Route handler
```

If authentication fails, Passport normally stops the request from reaching the next handler according to the strategy and authentication options.

---

## 11. Verify Callback

Most Passport strategies have a verification callback.

For example:

```ts
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUser(username);

      if (!user) {
        return done(null, false);
      }

      const valid = await verifyPassword(password, user.passwordHash);

      if (!valid) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
```

The verification callback is responsible for determining whether the credentials correspond to an authenticated user.

---

## 12. The `done()` Callback

Passport strategies commonly use:

```ts
done(error, user, info);
```

### Successful authentication

```ts
return done(null, user);
```

Meaning:

```text
error = null
user  = authenticated user
```

### Authentication failure

```ts
return done(null, false);
```

Meaning:

```text
error = null
user  = false
```

The credentials were not accepted.

### Unexpected error

```ts
return done(error);
```

Meaning the authentication process encountered an unexpected error.

### Optional information

```ts
return done(null, false, {
  message: "Invalid credentials",
});
```

The `info` object can carry additional authentication information.

### Mental model

```text
done(error, user, info)
        │
        ├── error
        │     ↓
        │   Authentication error
        │
        ├── user
        │     ↓
        │   Authentication success
        │
        └── info
              ↓
          Additional information
```

---

## 13. `req.user`

After successful authentication, Passport can attach the authenticated user to:

```ts
req.user;
```

Example:

```ts
app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  },
);
```

Conceptually:

```text
Authentication
      ↓
Authenticated User
      ↓
req.user
      ↓
Controller
```

### Do not expose sensitive fields

Avoid returning an entire database user object if it contains:

```text
passwordHash
refreshToken
session secrets
private security information
```

Prefer a safe representation:

```ts
res.json({
  id: req.user.id,
  email: req.user.email,
  role: req.user.role,
});
```

---

## 14. Local Strategy

The Local Strategy is commonly used for:

```text
Email + Password
```

Install:

```bash
npm install passport-local
```

Example:

```ts
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
        const user = await findUserByEmail(email);

        if (!user) {
          return done(null, false);
        }

        const valid = await verifyPassword(password, user.passwordHash);

        if (!valid) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
```

Passport Local Strategy itself does not hash passwords.

A password hashing library such as Argon2 should handle password hashing and verification.

---

## 15. JWT Strategy

Passport can authenticate requests using JWTs through `passport-jwt`.

Install:

```bash
npm install passport-jwt
```

Example:

```ts
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload, done) => {
      try {
        const user = await findUserById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);
```

A protected route can use:

```ts
app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  profileController,
);
```

JWT authentication commonly uses:

```text
Client
   ↓
Authorization: Bearer <JWT>
   ↓
Passport JWT Strategy
   ↓
Verify JWT
   ↓
Find User
   ↓
req.user
   ↓
Controller
```

---

## 16. Session Authentication

Passport can also integrate with server-side sessions.

Install:

```bash
npm install express-session
```

Basic setup:

```ts
import session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
```

When using Passport sessions, Passport typically needs:

```ts
passport.serializeUser(...);
passport.deserializeUser(...);
```

The architecture becomes:

```text
Login
  ↓
Passport Strategy
  ↓
Authenticated User
  ↓
serializeUser()
  ↓
Session
  ↓
Session Cookie
  ↓
Future Request
  ↓
deserializeUser()
  ↓
req.user
```

---

## 17. `serializeUser()`

`serializeUser()` determines what user information Passport stores in the session.

Example:

```ts
passport.serializeUser((user, done) => {
  done(null, user.id);
});
```

Usually, only a stable identifier is stored.

For example:

```text
Session
   ↓
userId = 123
```

Instead of:

```text
Session
   ↓
Entire User Object
```

Keeping session data small reduces unnecessary session state.

---

## 18. `deserializeUser()`

`deserializeUser()` retrieves the user from the stored identifier.

Example:

```ts
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
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

## 19. OAuth Strategies

Passport supports authentication through external providers.

Examples include:

- Google
- GitHub
- Facebook
- OAuth 2.0 providers
- OpenID Connect providers

Google OAuth can be installed using:

```bash
npm install passport-google-oauth20
```

Conceptual flow:

```text
User
  ↓
Your Application
  ↓
Google
  ↓
User grants permission
  ↓
Callback
  ↓
Passport Google Strategy
  ↓
Find/Create User
  ↓
Authenticated User
```

Passport handles the strategy integration, while your application still needs to decide how provider identities map to local users.

---

## 20. Multiple Strategies

A single application can register multiple strategies.

For example:

```text
Passport
│
├── local
│      └── Email + Password
│
├── jwt
│      └── API authentication
│
├── google
│      └── Google OAuth
│
└── github
       └── GitHub OAuth
```

Routes can select the required strategy.

Local:

```ts
passport.authenticate("local");
```

JWT:

```ts
passport.authenticate("jwt", {
  session: false,
});
```

Google:

```ts
passport.authenticate("google");
```

This is one of Passport's main architectural benefits.

---

## 21. Passport and Password Hashing

Passport is not a password hashing library.

A common architecture is:

```text
                    Authentication
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          Passport       Argon2      Database
             │            │            │
       Authentication   Password     User data
          workflow       hashing
```

For login:

```text
Email + Password
       ↓
Passport Local Strategy
       ↓
Find User
       ↓
Argon2.verify()
       ↓
Authentication Result
```

For registration:

```text
Plain Password
      ↓
Argon2.hash()
      ↓
passwordHash
      ↓
Database
```

Never store plaintext passwords.

---

## 22. Passport and JWT Libraries

Passport JWT Strategy and a JWT library such as `jose` have different responsibilities.

A possible architecture is:

```text
                    JWT Authentication
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
       Token Creation              Token Authentication
             │                           │
           jose                    passport-jwt
             │                           │
             ↓                           ↓
       Create JWT                  Verify JWT
                                         ↓
                                      User
```

For example:

- `jose` can handle JWT signing and verification.
- `passport-jwt` integrates JWT authentication into Passport's strategy model.

Avoid unnecessarily implementing the same JWT verification logic in multiple places.

---

## 23. Session vs JWT

Passport can be used with both session-based and JWT-based authentication.

| Session                                                       | JWT                                                |
| ------------------------------------------------------------- | -------------------------------------------------- |
| Authentication state is associated with a server-side session | Authentication information is carried in the token |
| Commonly uses cookies                                         | Commonly uses Authorization headers or cookies     |
| Uses `passport.session()`                                     | Commonly uses `session: false`                     |
| Requires session storage                                      | Can be stateless for access-token verification     |
| Server can invalidate sessions centrally                      | Revocation requires an explicit token strategy     |
| Useful for session-oriented applications                      | Common in APIs and distributed systems             |

Neither mechanism is universally appropriate.

The architecture of the application should determine the choice.

---

## 24. Stateless Passport Authentication

A JWT-based Passport route commonly uses:

```ts
passport.authenticate("jwt", {
  session: false,
});
```

Why?

Because the JWT is being used as the authentication credential for that request.

The flow is:

```text
Request
   ↓
Bearer Token
   ↓
JWT Strategy
   ↓
Verify Token
   ↓
Identify User
   ↓
req.user
```

No Passport session needs to be created for the request.

---

## 25. Protected Routes

Passport can be used as route middleware.

Example:

```ts
app.get(
  "/dashboard",
  passport.authenticate("jwt", {
    session: false,
  }),
  dashboardController,
);
```

The middleware chain becomes:

```text
GET /dashboard
      ↓
JWT Authentication
      ↓
Authenticated?
   /       \
 No         Yes
 ↓           ↓
401       Controller
             ↓
          Response
```

This allows authentication to happen before the controller executes.

---

## 26. Passport Middleware vs Authorization Middleware

Authentication:

```text
Passport
   ↓
Who is this user?
```

Authorization:

```text
Authorization Middleware
   ↓
Can this user perform this action?
```

Example:

```ts
app.delete(
  "/users/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  requireAdmin,
  deleteUserController,
);
```

Flow:

```text
Request
   ↓
Passport JWT
   ↓
User authenticated
   ↓
requireAdmin
   ↓
Permission checked
   ↓
Controller
```

Keeping authentication and authorization separate makes the architecture easier to maintain.

---

## 27. Mental Model

A useful mental model for Passport is:

```text
                     HTTP Request
                          │
                          ▼
                    Express Server
                          │
                          ▼
                   Passport Middleware
                          │
                          ▼
                       Strategy
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
           Local         JWT         OAuth
             │            │            │
             └────────────┼────────────┘
                          ▼
                  Verify Authentication
                          │
                          ▼
                   Authenticated User
                          │
                          ▼
                       req.user
                          │
                          ▼
                     Application
```

Passport does not decide everything about authentication.

Instead, it provides the framework through which authentication strategies operate.

---

## 28. How Passport Works

A simplified execution sequence is:

### Step 1 — Register a strategy

```ts
passport.use(
  new LocalStrategy(...),
);
```

### Step 2 — Initialize Passport

```ts
app.use(passport.initialize());
```

### Step 3 — Authenticate a request

```ts
passport.authenticate("local");
```

### Step 4 — Passport executes the strategy

```text
Local Strategy
      ↓
Verify credentials
```

### Step 5 — Strategy calls `done()`

```ts
done(null, user);
```

### Step 6 — Passport authenticates the request

The authenticated user becomes available through Passport's request integration.

### Step 7 — Controller executes

```ts
(req, res) => {
  // authenticated request
};
```

---

## 29. Passport Request Lifecycle

A simplified request lifecycle:

```text
Client
  │
  │ HTTP Request
  ▼
Express
  │
  ▼
passport.initialize()
  │
  ▼
passport.authenticate()
  │
  ▼
Selected Strategy
  │
  ├── Failure ──→ Authentication Failure
  │
  └── Success
        │
        ▼
      User
        │
        ▼
     req.user
        │
        ▼
    Controller
        │
        ▼
    Response
```

For session-based authentication, session handling is added to this lifecycle.

---

## 30. Common Passport Packages

| Package                   | Purpose                          |
| ------------------------- | -------------------------------- |
| `passport`                | Core Passport middleware         |
| `passport-local`          | Username/password authentication |
| `passport-jwt`            | JWT authentication               |
| `passport-google-oauth20` | Google OAuth 2.0                 |
| `passport-github2`        | GitHub authentication            |
| `passport-custom`         | Custom authentication strategy   |
| `express-session`         | Express session management       |
| `connect-redis`           | Redis-backed Express sessions    |

These packages are separate from Node.js built-in APIs.

---

## 31. Recommended Authentication Stack

A practical Node.js authentication stack might look like:

```text
                   Authentication
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Passport        Argon2          jose
          │              │              │
     Strategies     Password Hashing   JWT/JOSE
          │
          ▼
       Express
          │
          ▼
       Services
          │
          ▼
       Database
```

Possible responsibilities:

| Component | Responsibility                            |
| --------- | ----------------------------------------- |
| Express   | HTTP server and middleware                |
| Passport  | Authentication strategy workflow          |
| Argon2    | Password hashing and verification         |
| `jose`    | JWT/JOSE operations                       |
| MongoDB   | User persistence                          |
| Redis     | Sessions, caching, or token-related state |
| Pino      | Application logging                       |
| Envalid   | Environment validation                    |

Each component should have a clear responsibility.

---

## 32. Scalable Folder Structure

A Passport-based Node.js application can use:

```text
src/
├── config/
│   ├── env.ts
│   ├── database.ts
│   └── passport.ts
│
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.routes.ts
│       ├── auth.validation.ts
│       │
│       └── strategies/
│           ├── local.strategy.ts
│           ├── jwt.strategy.ts
│           └── google.strategy.ts
│
├── middleware/
│   ├── authentication.ts
│   └── authorization.ts
│
├── services/
│   ├── password.service.ts
│   └── token.service.ts
│
├── models/
│   └── user.model.ts
│
├── app.ts
└── server.ts
```

### Responsibility

```text
Strategy
   ↓
Authentication

Service
   ↓
Business logic

Model
   ↓
Database

Middleware
   ↓
Request protection

Controller
   ↓
HTTP handling
```

Avoid putting the entire authentication system into one `passport.ts` file.

---

## 33. Production Architecture

A larger authentication system may look like:

```text
                         React Client
                              │
                              ▼
                         API Gateway
                              │
                              ▼
                           Express
                              │
                              ▼
                       Auth Middleware
                              │
                              ▼
                           Passport
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
         Local              JWT              OAuth
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                        Auth Service
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
              MongoDB      Redis        jose
                  │           │
                  ▼           ▼
                Users      Sessions/
                           Temporary State
```

Additional production components may include:

```text
Pino
  ↓
Logging

OpenTelemetry
  ↓
Tracing

Prometheus
  ↓
Metrics

Grafana
  ↓
Monitoring
```

These components are not required by Passport itself. They belong to the broader application architecture.

---

## 34. Security Overview

Authentication systems require careful security design.

### Passwords

Never store plaintext passwords.

Use a password hashing algorithm such as Argon2.

```text
Password
   ↓
Argon2
   ↓
Password Hash
   ↓
Database
```

### Tokens

Do not log:

```text
Access tokens
Refresh tokens
JWT secrets
Session secrets
OAuth client secrets
Authorization headers
Passwords
```

### Cookies

F
