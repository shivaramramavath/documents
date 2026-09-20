# Passport.js — Core Concepts

## 1. Overview

Passport.js is built around a small number of core concepts:

- Passport instance
- Strategies
- Strategy registration
- Authentication middleware
- Verify callbacks
- `done()`
- Authentication success and failure
- `req.user`
- Sessions
- Stateless authentication
- Middleware execution order
- Strategy names
- Authentication options

Understanding these concepts makes Local, JWT, OAuth, and custom Passport strategies much easier to learn.

The central idea is:

```text
Request
   ↓
Passport
   ↓
Strategy
   ↓
Verify Authentication
   ↓
Authenticated User
   ↓
req.user
```

---

# 2. Passport Mental Model

Think of Passport as an **authentication coordinator**.

Passport itself does not know how every user should authenticate.

Instead, Passport delegates authentication to a strategy.

```text
                         Passport
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
           Local            JWT           OAuth
             │              │              │
       Email/Password      Token        Provider
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                     Authentication
                            ↓
                          User
```

The strategy performs the mechanism-specific authentication work.

---

# 3. What Is a Passport Strategy?

A **strategy** defines how Passport should authenticate a request.

Examples:

| Strategy        | Purpose                             |
| --------------- | ----------------------------------- |
| Local Strategy  | Username/password                   |
| JWT Strategy    | JWT bearer token                    |
| Google Strategy | Google OAuth                        |
| GitHub Strategy | GitHub authentication               |
| Custom Strategy | Application-specific authentication |

For example:

```text
Local Strategy
     ↓
Email
     +
Password
     ↓
Find User
     ↓
Verify Password
     ↓
Authenticated User
```

JWT:

```text
JWT Strategy
     ↓
Extract Token
     ↓
Verify Token
     ↓
Find User
     ↓
Authenticated User
```

The strategy determines the authentication mechanism.

---

# 4. Passport Strategy Architecture

A strategy normally has two major parts:

```text
Strategy
   │
   ├── Authentication Input
   │
   └── Verify Callback
           ↓
       Find/Verify User
           ↓
          done()
```

For Local Strategy:

```text
Email + Password
       ↓
LocalStrategy
       ↓
Verify Callback
       ↓
Database
       ↓
Password Verification
       ↓
done()
```

For JWT:

```text
Authorization Header
       ↓
JWT Strategy
       ↓
Extract JWT
       ↓
Verify JWT
       ↓
Find User
       ↓
done()
```

---

# 5. Registering a Strategy

Strategies are registered using:

```ts
passport.use(strategy);
```

Example:

```ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const strategy = new LocalStrategy(async (username, password, done) => {
  // Authentication logic
});

passport.use(strategy);
```

Once registered, Passport knows about the strategy.

---

# 6. Naming Strategies

A strategy can have a name.

For example:

```ts
passport.use("local-login", strategy);
```

Then:

```ts
passport.authenticate("local-login");
```

Without an explicit name, the strategy usually provides its default name.

For example:

```ts
new LocalStrategy(...)
```

is commonly used as:

```ts
passport.authenticate("local");
```

### Why names matter

Names allow an application to register multiple strategies of the same general type.

For example:

```ts
passport.use("local-login", loginStrategy);

passport.use("local-admin", adminStrategy);
```

Routes can then select the required strategy:

```ts
passport.authenticate("local-login");
```

or:

```ts
passport.authenticate("local-admin");
```

---

# 7. `passport.initialize()`

Passport needs to be initialized as Express middleware.

```ts
app.use(passport.initialize());
```

Example:

```ts
import express from "express";
import passport from "passport";

const app = express();

app.use(express.json());

app.use(passport.initialize());
```

This integrates Passport with the Express request lifecycle.

---

# 8. What `passport.initialize()` Does

Conceptually:

```text
HTTP Request
     ↓
Express
     ↓
passport.initialize()
     ↓
Passport request integration
     ↓
Next middleware
```

It prepares Passport's functionality for the incoming request.

After initialization, authentication middleware can be used:

```ts
passport.authenticate("local");
```

or:

```ts
passport.authenticate("jwt");
```

---

# 9. `passport.authenticate()`

`passport.authenticate()` is the middleware used to execute a Passport strategy.

Example:

```ts
app.post("/login", passport.authenticate("local"), loginController);
```

The flow is:

```text
POST /login
     ↓
passport.authenticate('local')
     ↓
Local Strategy
     ↓
Verify credentials
     ↓
Authentication result
     ↓
loginController
```

The strategy name tells Passport which registered strategy to execute.

---

# 10. Authentication Middleware

Passport authentication middleware can be placed directly in an Express route.

Example:

```ts
app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  profileController,
);
```

Express executes middleware from left to right.

```text
Request
   ↓
passport.authenticate()
   ↓
profileController
   ↓
Response
```

If authentication fails, the request normally does not continue to the controller.

---

# 11. Middleware Execution Order

Middleware order is important.

Example:

```ts
app.use(express.json());

app.use(passport.initialize());

app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  profileController,
);
```

Conceptually:

```text
Request
  ↓
express.json()
  ↓
passport.initialize()
  ↓
passport.authenticate()
  ↓
profileController
  ↓
Response
```

If Passport middleware is not initialized correctly, authentication middleware cannot operate as intended.

---

# 12. Verify Callback

The verify callback is one of the most important parts of a Passport strategy.

Example:

```ts
passport.use(
  new LocalStrategy(async (email, password, done) => {
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
  }),
);
```

The verify callback answers:

> Given the credentials or authentication information supplied by this strategy, is this request associated with a valid user?

---

# 13. Responsibilities of the Verify Callback

The exact responsibilities depend on the strategy.

For Local authentication:

```text
Receive credentials
       ↓
Find user
       ↓
Verify password
       ↓
Return user
```

For JWT:

```text
Receive decoded JWT payload
       ↓
Identify user
       ↓
Find user
       ↓
Return user
```

For OAuth:

```text
Receive provider profile
       ↓
Find existing account
       ↓
Create/link account if appropriate
       ↓
Return user
```

The verify callback should focus on authentication rather than unrelated application logic.

---

# 14. Understanding `done()`

Passport strategies communicate their result through:

```ts
done(error, user, info);
```

There are three important pieces:

```text
done(
  error,
  user,
  info
);
```

### `error`

Represents an unexpected application or system error.

### `user`

Represents the authenticated user.

### `info`

Optional information about the authentication result.

---

# 15. Successful Authentication

Use:

```ts
return done(null, user);
```

This means:

```text
error = null
user  = authenticated user
```

Example:

```ts
if (validPassword) {
  return done(null, user);
}
```

Flow:

```text
Valid Credentials
       ↓
     done()
       ↓
Authenticated User
       ↓
Passport
```

---

# 16. Authentication Failure

Use:

```ts
return done(null, false);
```

This means:

```text
error = null
user  = false
```

Example:

```ts
if (!user) {
  return done(null, false);
}
```

This is different from an unexpected server error.

The authentication attempt simply did not succeed.

---

# 17. Unexpected Error

Use:

```ts
return done(error);
```

Example:

```ts
try {
  const user = await findUser(email);

  // ...
} catch (error) {
  return done(error);
}
```

This represents an unexpected failure such as:

- Database failure
- Network error
- Unexpected application exception
- External provider failure

---

# 18. `done()` Decision Tree

A useful mental model:

```text
                  Authentication
                        │
                        ▼
                   Is there an
                 unexpected error?
                   /          \
                 Yes           No
                  │             │
                  ▼             ▼
             done(error)     Valid user?
                              /      \
                            Yes       No
                             │         │
                             ▼         ▼
                    done(null,user) done(null,false)
```

This distinction is fundamental to Passport.

---

# 19. `info` Parameter

The third argument can provide additional information.

Example:

```ts
return done(null, false, {
  message: "Invalid credentials",
});
```

The `info` object can communicate authentication-related information to Passport.

Do not use `info` as a replacement for proper application error handling.

---

# 20. Authentication Success Flow

A successful authentication can be visualized as:

```text
Request
   ↓
Passport
   ↓
Strategy
   ↓
Verify Callback
   ↓
Credentials Valid
   ↓
done(null, user)
   ↓
Passport
   ↓
Authenticated Request
   ↓
req.user
   ↓
Controller
```

---

# 21. Authentication Failure Flow

```text
Request
   ↓
Passport
   ↓
Strategy
   ↓
Verify Callback
   ↓
Credentials Invalid
   ↓
done(null, false)
   ↓
Authentication Failure
   ↓
Unauthorized Response
```

The exact HTTP response behavior depends on how the authentication middleware is configured.

---

# 22. `req.user`

After successful authentication, Passport can make the authenticated user available through:

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
Strategy
   ↓
Authenticated User
   ↓
Passport
   ↓
req.user
   ↓
Controller
```

---

# 23. Why `req.user` Matters

`req.user` allows application code to access the authenticated identity.

For example:

```ts
app.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    res.json({
      id: user.id,
      email: user.email,
    });
  },
);
```

The controller does not need to repeat the authentication process.

Passport has already performed it.

---

# 24. `req.user` Is Not Authorization

Having:

```ts
req.user;
```

means the request has an authenticated identity.

It does not automatically mean the user can perform every operation.

For example:

```text
req.user
   ↓
Authenticated
   ↓
Check role
   ↓
Check permission
   ↓
Allow/Deny
```

Authorization should be handled separately.

---

# 25. Authentication vs Authorization

### Authentication

```text
Who is the user?
```

Passport:

```text
Passport
   ↓
Authentication
   ↓
req.user
```

### Authorization

```text
What can the user do?
```

Application middleware:

```text
req.user
   ↓
Role / Permission
   ↓
Allow / Deny
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

---

# 26. Passport Sessions

Passport supports session-based authentication.

A session-based application typically uses:

```ts
app.use(session(...));

app.use(passport.initialize());

app.use(passport.session());
```

The important distinction is:

```text
passport.initialize()
        ↓
Passport request initialization

passport.session()
        ↓
Passport session authentication
```

`passport.session()` is relevant when Passport is being used with persistent login sessions.

---

# 27. `passport.session()`

Example:

```ts
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

The middleware order matters.

Conceptually:

```text
Request
   ↓
Express Session
   ↓
Passport Initialize
   ↓
Passport Session
   ↓
Authenticated User
   ↓
req.user
```

---

# 28. `serializeUser()`

When using Passport sessions:

```ts
passport.serializeUser((user, done) => {
  done(null, user.id);
});
```

Serialization determines what information Passport stores in the session.

A common approach is to store only a user identifier:

```text
Session
   ↓
userId
```

instead of the entire user object.

---

# 29. `deserializeUser()`

On a later request:

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

# 30. Stateless Authentication

Passport does not require sessions for every authentication mechanism.

JWT APIs commonly use:

```ts
passport.authenticate("jwt", {
  session: false,
});
```

The flow becomes:

```text
Request
   ↓
JWT
   ↓
Passport JWT Strategy
   ↓
Verify Token
   ↓
Find User
   ↓
req.user
```

There is no Passport login session for the request.

---

# 31. Session vs `session: false`

### Session authentication

```ts
passport.authenticate("local");
```

with Passport sessions enabled may establish a login session.

### Stateless JWT authentication

```ts
passport.authenticate("jwt", {
  session: false,
});
```

Passport does not establish a session for that request.

### Mental model

```text
Session
   ↓
Server-side authentication state

JWT
   ↓
Token-based authentication state
```

---

# 32. Authentication Options

`passport.authenticate()` accepts options.

Example:

```ts
passport.authenticate("jwt", {
  session: false,
});
```

Common options depend on the strategy and authentication architecture.

Examples include:

- `session`
- `failureRedirect`
- `failureFlash`
- `failureMessage`
- `successRedirect`
- `successMessage`

Do not blindly enable options without understanding their behavior.

---

# 33. `failureRedirect`

A session-oriented web application may use:

```ts
passport.authenticate("local", {
  failureRedirect: "/login",
});
```

If authentication fails, Passport can redirect the user to the specified route.

This pattern is more common in traditional browser-based applications than JSON APIs.

---

# 34. API Authentication vs Browser Authentication

Passport can be used in different application styles.

### Traditional web application

```text
Browser
   ↓
Login Form
   ↓
Passport Local
   ↓
Session
   ↓
Cookie
   ↓
Browser
```

### REST API

```text
React Client
   ↓
Login
   ↓
JWT
   ↓
Authorization Header
   ↓
Passport JWT
   ↓
API
```

The appropriate Passport configuration depends on the application's communication model.

---

# 35. Strategy Selection

Suppose an application has:

```text
local
jwt
google
github
```

Different routes can select different strategies.

### Local

```ts
passport.authenticate("local");
```

### JWT

```ts
passport.authenticate("jwt", {
  session: false,
});
```

### Google

```ts
passport.authenticate("google");
```

### GitHub

```ts
passport.authenticate("github");
```

This allows a single Passport installation to support multiple authentication mechanisms.

---

# 36. Multiple Strategies in One Application

Example architecture:

```text
                         Passport
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
      Local                JWT                OAuth
        │                   │                   │
 Email/Password          API Token          Google/GitHub
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                       Authenticated
                           User
```

The application can choose the strategy based on the endpoint.

---

# 37. Strategy Registration vs Strategy Execution

This distinction is important.

### Registration

```ts
passport.use(
  new LocalStrategy(...),
);
```

Meaning:

> Register this authentication strategy with Passport.

### Execution

```ts
passport.authenticate("local");
```

Meaning:

> Use the registered Local Strategy for this request.

Think:

```text
passport.use()
      ↓
Register

passport.authenticate()
      ↓
Execute
```

---

# 38. Strategy Name Resolution

When you write:

```ts
passport.authenticate("jwt");
```

Passport looks for a strategy registered under:

```text
jwt
```

For example:

```ts
passport.use(
  new JwtStrategy(...),
);
```

The strategy package normally provides its default name.

You can also explicitly name strategies:

```ts
passport.use(
  'api-jwt',
  new JwtStrategy(...),
);
```

Then:

```ts
passport.authenticate("api-jwt", {
  session: false,
});
```

---

# 39. Custom Strategy Names

Explicit names are useful when multiple authentication flows exist.

Example:

```ts
passport.use("user-local", userLocalStrategy);

passport.use("admin-local", adminLocalStrategy);
```

Routes:

```ts
passport.authenticate("user-local");
```

and:

```ts
passport.authenticate("admin-local");
```

This keeps strategy selection explicit.

---

# 40. Authentication Flow with Local Strategy

```text
Client
   │
   │ POST /login
   ▼
Express
   │
   ▼
passport.authenticate("local")
   │
   ▼
LocalStrategy
   │
   ▼
Verify Callback
   │
   ├── Find User
   │
   ├── Verify Password
   │
   └── done()
        │
        ├── Failure
        │
        └── Success
              ↓
            User
              ↓
          req.user
```

---

# 41. Authentication Flow with JWT Strategy

```text
Client
   │
   │ Authorization: Bearer <token>
   ▼
Express
   │
   ▼
passport.authenticate("jwt", {
  session: false
})
   │
   ▼
JWT Strategy
   │
   ▼
Extract Token
   │
   ▼
Verify JWT
   │
   ▼
Find User
   │
   ▼
done(null, user)
   │
   ▼
req.user
   │
   ▼
Controller
```

---

# 42. Authentication Flow with OAuth

```text
Browser
   ↓
/auth/google
   ↓
Passport Google Strategy
   ↓
Google
   ↓
User Consent
   ↓
Callback
   ↓
Passport Strategy
   ↓
Find/Create User
   ↓
Authenticated User
```

The details vary depending on the provider and OAuth/OIDC flow.

---

# 43. Business Logic vs Authentication Logic

Avoid putting large amounts of business logic directly inside a strategy.

### Avoid

```ts
passport.use(
  new LocalStrategy(async (email, password, done) => {
    // 300 lines of business logic
  }),
);
```

Prefer:

```text
Passport Strategy
       ↓
Auth Service
       ↓
User Service
       ↓
Database
```

Example:

```ts
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await authService.authenticateUser(email, password);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
```

The strategy becomes easier to understand and test.

---

# 44. Strategy Responsibility

A strategy should primarily answer:

> Is this request associated with an authenticated user?

It should not become responsible for:

- Sending unrelated emails
- Creating arbitrary business records
- Performing unrelated database updates
- Handling application-wide authorization
- Formatting every API response
- Logging sensitive credentials

Keep responsibilities separated.

---

# 45. Passport and Service Layer

A scalable architecture can be:

```text
Route
  ↓
Passport Strategy
  ↓
Auth Service
  ↓
User Service
  ↓
Repository / Model
  ↓
Database
```

Example:

```ts
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await authService.authenticateUser(email, password);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
```

This separates Passport-specific logic from business logic.

---

# 46. Error Handling

A strategy should distinguish authentication failure from unexpected errors.

Correct:

```ts
try {
  const user = await findUser(email);

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
} catch (error) {
  return done(error);
}
```

Conceptually:

```text
Invalid credentials
        ↓
done(null, false)

Database failure
        ↓
done(error)
```

These are not the same event.

---

# 47. Avoid User Enumeration

Authentication systems should avoid revealing whether a specific account exists.

Instead of responses such as:

```text
Email does not exist
```

and:

```text
Incorrect password
```

many systems use a generic authentication failure response:

```text
Invalid credentials
```

The exact response strategy depends on the application's security requirements.

---

# 48. Passport TypeScript Concept

In TypeScript applications, Passport's user type should be represented correctly.

For example:

```ts
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }
  }
}
```

Then:

```ts
req.user;
```

can be represented as an application-specific user type rather than an unstructured value.

Type augmentation should be placed in a file included by the TypeScript compiler.

---

# 49. Recommended TypeScript Structure

```text
src/
├── types/
│   └── express.d.ts
│
├── config/
│   └── passport.ts
│
├── modules/
│   └── auth/
│       ├── auth.service.ts
│       └── strategies/
│           ├── local.strategy.ts
│           └── jwt.strategy.ts
│
└── app.ts
```

Example:

```ts
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: "user" | "admin";
    }
  }
}

export {};
```

---

# 50. Common Mistakes

## Mistake 1 — Confusing `use()` and `authenticate()`

Incorrect mental model:

```text
use() = authenticate request
```

Correct:

```text
passport.use()
    ↓
Register strategy

passport.authenticate()
    ↓
Execute strategy
```

---

## Mistake 2 — Forgetting `passport.initialize()`

You should initialize Passport before using Passport authentication middleware.

```ts
app.use(passport.initialize());
```

---

## Mistake 3 — Using the wrong strategy name

If you registered:

```ts
passport.use("api-jwt", strategy);
```

then use:

```ts
passport.authenticate("api-jwt");
```

not:

```ts
passport.authenticate("jwt");
```

unless a strategy is also registered under `jwt`.

---

## Mistake 4 — Treating authentication failure as a server error

Incorrect:

```ts
if (!user) {
  return done(new Error("User not found"));
}
```

A missing user is normally an authentication failure rather than an unexpected system error.

A common approach is:

```ts
return done(null, false);
```

---

## Mistake 5 — Returning sensitive information

Avoid putting sensitive values into:

```ts
req.user;
```

or API responses unnecessarily.

---

## Mistake 6 — Putting all business logic in strategies

Avoid large strategies.

Prefer:

```text
Strategy
   ↓
Service
   ↓
Repository
```

---

## Mistake 7 — Forgetting `session: false` for stateless JWT routes

For a stateless JWT API:

```ts
passport.authenticate("jwt", {
  session: false,
});
```

should be used intentionally.

---

# 51. Production Architecture

A production-oriented Passport architecture can look like:

```text
                         Express
                            │
                            ▼
                  passport.initialize()
                            │
                            ▼
                     Authentication
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
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          User DB         Redis          Token
                                          Service
             │              │
             ▼              ▼
           User          Sessions /
                         Temporary State
```

Supporting infrastructure:

```text
Pino
  ↓
Structured Logs

OpenTelemetry
  ↓
Tracing

Prometheus
  ↓
Metrics
```

Passport remains responsible for the authentication strategy layer.

---

# 52. Recommended Separation of Responsibilities

| Component      | Responsibility                            |
| -------------- | ----------------------------------------- |
| Express        | HTTP server and middleware                |
| Passport       | Authentication strategy orchestration     |
| Local Strategy | Credential authentication                 |
| JWT Strategy   | JWT request authentication                |
| OAuth Strategy | External identity-provider authentication |
| Auth Service   | Authentication business logic             |
| User Service   | User-related business logic               |
| Argon2         | Password hashing                          |
| `jose`         | JWT/JOSE operations                       |
| MongoDB        | User persistence                          |
| Redis          | Session or temporary authentication state |
| Pino           | Logging                                   |

This separation prevents authentication code from becoming tightly coupled.

---

# 53. Core Concept Summary

```text
Passport
   │
   ├── initialize()
   │       ↓
   │   Initialize Passport
   │
   ├── use()
   │       ↓
   │   Register Strategy
   │
   ├── authenticate()
   │       ↓
   │   Execute Strategy
   │
   ├── Strategy
   │       ↓
   │   Authentication Mechanism
   │
   ├── done()
   │       ↓
   │   Authentication Result
   │
   └── req.user
           ↓
       Authenticated User
```

---

# 54. Quick Revision

## Key Concepts

- Passport is authentication middleware for Node.js.
- Passport uses strategies.
- `passport.use()` registers strategies.
- `passport.authenticate()` executes strategies.
- `passport.initialize()` initializes Passport.
- A verify callback performs authentication-related verification.
- `done(null, user)` indicates successful authentication.
- `done(null, false)` indicates authentication failure.
- `done(error)` represents an unexpected error.
- `req.user` represents the authenticated user.
- `passport.session()` integrates Passport with sessions.
- `serializeUser()` stores the user's session representation.
- `deserializeUser()` reconstructs the authenticated user.
- `session: false` is commonly used for stateless JWT authentication.
- Authentication and authorization are separate concerns.
- Strategies should remain focused and delegate business logic to services.

## Core API Mental Model

```text
passport.use()
     ↓
Register

passport.initialize()
     ↓
Initialize

passport.authenticate()
     ↓
Execute

Strategy
     ↓
Verify

done()
     ↓
Result

req.user
     ↓
Authenticated User
```

## Most Important APIs

```ts
passport.initialize();

passport.use();

passport.authenticate();

passport.session();

passport.serializeUser();

passport.deserializeUser();
```

## Most Important `done()` Patterns

```ts
// Success
done(null, user);

// Authentication failure
done(null, false);

// Unexpected error
done(error);
```

## Authentication Flow

```text
Request
   ↓
Passport
   ↓
Strategy
   ↓
Verify Callback
   ↓
done()
   ↓
Authenticated User
   ↓
req.user
   ↓
Controller
```

## One-Line Definition

> **Passport's core architecture is based on registering authentication strategies, executing them through middleware, and exposing the authenticated user to the application through the request lifecycle.**
