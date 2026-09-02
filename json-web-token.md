🔐 JWT Authentication in Node.js

A practical guide to JSON Web Tokens (JWT) in Node.js using the ""jsonwebtoken"" (https://www.npmjs.com/package/jsonwebtoken) package.

This README covers JWT fundamentals, token creation, verification, decoding, claims, options, errors, Express middleware, access/refresh tokens, and production security practices.

---

📚 Table of Contents

- "What is JWT?" (#what-is-jwt)
- "JWT Structure" (#jwt-structure)
- "Installation" (#installation)
- ""jwt.sign()"" (#jwtsign)
- ""jwt.verify()"" (#jwtverify)
- ""jwt.decode()"" (#jwtdecode)
- "JWT Claims" (#jwt-claims)
- "Sign Options" (#sign-options)
- "Verify Options" (#verify-options)
- "JWT Errors" (#jwt-errors)
- "Express Authentication Middleware" (#express-authentication-middleware)
- "Access Token" (#access-token)
- "Refresh Token" (#refresh-token)
- "Access + Refresh Token Flow" (#access--refresh-token-flow)
- "HS256 vs RS256" (#hs256-vs-rs256)
- "JWT Security" (#jwt-security)
- "Production Structure" (#production-structure)
- "Quick Reference" (#quick-reference)

---

What is JWT?

JWT (JSON Web Token) is a compact token format commonly used for authentication and authorization.

A JWT allows a server to represent claims about a user and verify that the token was signed by a trusted issuer.

Typical authentication flow:

Client
  │
  │ Login
  ▼
Server
  │
  │ Create JWT
  ▼
Client
  │
  │ Authorization: Bearer <token>
  ▼
Server
  │
  │ jwt.verify()
  ▼
Authenticated User

JWTs are commonly used for:

- Authentication
- Authorization
- API access
- Role-based access control
- Service-to-service authentication
- Access tokens
- Refresh tokens

---

JWT Structure

A JWT contains three Base64URL-encoded sections:

HEADER.PAYLOAD.SIGNATURE

Example:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ
.
signature

Conceptually:

┌──────────────┐
│    HEADER    │
├──────────────┤
│   PAYLOAD    │
├──────────────┤
│  SIGNATURE   │
└──────────────┘

Header

Contains metadata about the token.

{
  "alg": "HS256",
  "typ": "JWT"
}

Payload

Contains claims.

{
  "sub": "user_123",
  "role": "admin",
  "iat": 1720000000,
  "exp": 1720000900
}

Signature

The signature allows the server to verify that the token was not modified.

«JWT payloads are encoded, not encrypted. Never put passwords, API secrets, or other sensitive information inside the payload.»

---

Installation

npm install jsonwebtoken

For TypeScript:

npm install -D @types/jsonwebtoken

Import:

import jwt from "jsonwebtoken";

---

"jwt.sign()"

"jwt.sign()" creates a JWT.

jwt.sign(payload, secretOrPrivateKey, options);

Basic example:

const token = jwt.sign(
  {
    sub: user.id,
    role: user.role,
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "15m",
  },
);

---

"jwt.sign()" Payload

The payload is the data stored inside the JWT.

const token = jwt.sign(
  {
    sub: user.id,
    role: "admin",
  },
  secret,
);

Example decoded payload:

{
  "sub": "user_123",
  "role": "admin",
  "iat": 1720000000
}

Avoid storing sensitive information:

// ❌ Don't do this

jwt.sign(
  {
    password: user.password,
    creditCard: user.card,
  },
  secret,
);

Prefer:

// ✅

jwt.sign(
  {
    sub: user.id,
    role: user.role,
  },
  secret,
);

---

"jwt.verify()"

"jwt.verify()" validates a JWT.

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET!,
);

Verification checks things such as:

- JWT structure
- Signature
- Expiration
- "nbf"
- Issuer
- Audience
- Other configured claims

Example:

try {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!,
  );

  console.log(decoded);
} catch (error) {
  console.log("Invalid token");
}

---

"jwt.decode()"

"jwt.decode()" only decodes the token.

const decoded = jwt.decode(token);

Important

"decode()" does NOT verify the signature.

const payload = jwt.decode(token);

// ❌ Do not trust this for authentication

For authentication always use:

jwt.verify(token, secret);

Difference

Method| Purpose| Verifies signature
"sign()"| Create JWT| N/A
"verify()"| Validate JWT| ✅
"decode()"| Read JWT| ❌

---

JWT Claims

JWT claims are values stored in the payload.

"sub"

Subject of the token.

Usually the user ID.

{
  "sub": "user_123"
}

---

"iss"

Issuer.

{
  "iss": "my-api"
}

Example:

jwt.sign(payload, secret, {
  issuer: "my-api",
});

Verify:

jwt.verify(token, secret, {
  issuer: "my-api",
});

---

"aud"

Audience.

Defines who the token is intended for.

{
  "aud": "web-app"
}

Example:

jwt.sign(payload, secret, {
  audience: "web-app",
});

---

"exp"

Expiration time.

{
  "exp": 1720000900
}

Usually you should generate this using:

{
  expiresIn: "15m"
}

instead of manually calculating "exp".

---

"iat"

Issued-at timestamp.

"jsonwebtoken" automatically adds "iat" by default.

Example:

{
  "iat": 1720000000
}

Disable it if necessary:

jwt.sign(payload, secret, {
  noTimestamp: true,
});

---

"nbf"

Not-before timestamp.

The token cannot be accepted before this time.

Example:

jwt.sign(payload, secret, {
  notBefore: "10s",
});

---

"jti"

JWT ID.

Useful for:

- Token revocation
- Refresh-token tracking
- Session management
- Token blacklists

Example:

jwt.sign(payload, secret, {
  jwtid: crypto.randomUUID(),
});

---

Sign Options

Common "jwt.sign()" options:

jwt.sign(payload, secret, {
  algorithm: "HS256",
  expiresIn: "15m",
  notBefore: "0s",
  audience: "web-app",
  issuer: "my-api",
  subject: user.id,
  jwtid: "unique-token-id",
  keyid: "key-1",
  noTimestamp: false,
});

---

"expiresIn"

Controls token lifetime.

expiresIn: "15m"

Examples:

expiresIn: "30s"
expiresIn: "15m"
expiresIn: "1h"
expiresIn: "7d"
expiresIn: "30d"

Numeric values represent seconds:

expiresIn: 60

Prefer explicit strings:

expiresIn: "60s"

---

"algorithm"

Controls the signing algorithm.

Examples:

algorithm: "HS256"

or:

algorithm: "RS256"

Common algorithms:

HS256
HS384
HS512

RS256
RS384
RS512

ES256
ES384
ES512

---

"issuer"

issuer: "my-api"

---

"audience"

audience: "web-app"

---

"subject"

Sets the "sub" claim.

subject: user.id

---

"jwtid"

Sets the "jti" claim.

jwtid: crypto.randomUUID()

---

"keyid"

Sets the "kid" header.

keyid: "key-2026-01"

Useful for key rotation.

---

"header"

Customize JWT headers.

jwt.sign(payload, secret, {
  header: {
    kid: "key-1",
  },
});

---

"noTimestamp"

Disable automatic "iat".

jwt.sign(payload, secret, {
  noTimestamp: true,
});

---

Verify Options

Common verification options:

jwt.verify(token, secret, {
  algorithms: ["HS256"],
  issuer: "my-api",
  audience: "web-app",
  subject: user.id,
  clockTolerance: 5,
  maxAge: "1h",
});

---

"algorithms"

Restrict accepted algorithms.

jwt.verify(token, secret, {
  algorithms: ["HS256"],
});

For RSA:

jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
});

This is an important security practice.

---

"issuer"

jwt.verify(token, secret, {
  issuer: "my-api",
});

---

"audience"

jwt.verify(token, secret, {
  audience: "web-app",
});

---

"subject"

jwt.verify(token, secret, {
  subject: user.id,
});

---

"clockTolerance"

Allows a small clock difference between systems.

jwt.verify(token, secret, {
  clockTolerance: 5,
});

The value is in seconds.

---

"maxAge"

Limits how old a token can be.

jwt.verify(token, secret, {
  maxAge: "1h",
});

---

"complete"

Normally:

const decoded = jwt.verify(token, secret);

returns the payload.

With:

const decoded = jwt.verify(token, secret, {
  complete: true,
});

you receive:

{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    sub: "123",
    role: "admin"
  },
  signature: "..."
}

This is useful when working with "kid".

---

JWT Errors

"jsonwebtoken" provides specific error classes.

---

"TokenExpiredError"

Occurs when the token has expired.

try {
  jwt.verify(token, secret);
} catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    console.log("Token expired");
  }
}

Useful property:

error.expiredAt

---

"JsonWebTokenError"

Used for invalid JWTs.

try {
  jwt.verify(token, secret);
} catch (error) {
  if (error instanceof jwt.JsonWebTokenError) {
    console.log("Invalid JWT");
  }
}

Possible reasons include:

invalid signature
jwt malformed
invalid audience
invalid issuer
jwt subject invalid
jwt id invalid

---

"NotBeforeError"

Occurs when a token is not active yet.

try {
  jwt.verify(token, secret);
} catch (error) {
  if (error instanceof jwt.NotBeforeError) {
    console.log("Token is not active yet");
  }
}

---

Express Authentication Middleware

A typical JWT middleware:

import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = header.slice(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
      {
        algorithms: ["HS256"],
        issuer: "my-api",
        audience: "web-app",
      },
    );

    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = {
      id: decoded.sub!,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Access token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
    });
  }
};

---

Access Token

Access tokens should generally be short-lived.

Example:

const accessToken = jwt.sign(
  {
    sub: user.id,
    role: user.role,
  },
  process.env.JWT_ACCESS_SECRET!,
  {
    expiresIn: "15m",
    issuer: "my-api",
    audience: "web-app",
  },
);

Typical lifetime:

5 minutes
10 minutes
15 minutes
30 minutes

Short expiration reduces the impact of token theft.

---

Refresh Token

Refresh tokens are used to obtain new access tokens.

Example:

const refreshToken = jwt.sign(
  {
    sub: user.id,
    type: "refresh",
  },
  process.env.JWT_REFRESH_SECRET!,
  {
    expiresIn: "30d",
    issuer: "my-api",
    audience: "web-app",
  },
);

Typical architecture:

Access Token
    │
    ├── Short-lived
    ├── Used for API requests
    └── Example: 15 minutes

Refresh Token
    │
    ├── Long-lived
    ├── Used to obtain new access tokens
    └── Example: 30 days

---

Access + Refresh Token Flow

                 LOGIN
                   │
                   ▼
              Verify User
                   │
          ┌────────┴────────┐
          ▼                 ▼
    Access Token       Refresh Token
      15 minutes          30 days
          │                 │
          ▼                 │
      API Requests          │
          │                 │
          ▼                 │
      Token Expired         │
          │                 │
          └──────────────►  │
                            ▼
                    Refresh Endpoint
                            │
                            ▼
                    Verify Refresh Token
                            │
                            ▼
                    New Access Token

---

HS256 vs RS256

HS256

Uses a shared secret.

             SECRET
            /      \
           /        \
       Sign          Verify

Example:

jwt.sign(payload, secret, {
  algorithm: "HS256",
});

Verification:

jwt.verify(token, secret, {
  algorithms: ["HS256"],
});

Good for:

- Single backend
- Monolithic applications
- Simple architectures

---

RS256

Uses public/private keys.

Private Key
     │
     ▼
   Sign
     │
     ▼
   JWT
     │
     ▼
  Public Key
     │
     ▼
  Verify

Example:

jwt.sign(payload, privateKey, {
  algorithm: "RS256",
});

Verification:

jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
});

Useful for:

- Microservices
- Distributed systems
- Multiple API consumers
- Centralized authentication
- Key rotation

---

JWT Security

1. Use strong secrets

Bad:

JWT_SECRET=secret

Better:

JWT_SECRET=<long-random-secret>

Use a cryptographically random secret.

---

2. Use environment variables

Don't hard-code secrets:

// ❌

const secret = "my-secret";

Use:

// ✅

const secret = process.env.JWT_SECRET!;

---

3. Restrict algorithms

jwt.verify(token, secret, {
  algorithms: ["HS256"],
});

---

4. Keep access tokens short-lived

Prefer:

expiresIn: "15m"

rather than:

expiresIn: "30d"

for access tokens.

---

5. Don't store passwords in JWT

Never:

{
  email,
  password
}

Instead:

{
  sub: user.id,
  role: user.role
}

---

6. Validate important claims

For production:

jwt.verify(token, secret, {
  algorithms: ["HS256"],
  issuer: "my-api",
  audience: "web-app",
});

---

7. Use HTTPS

JWTs should be transmitted over HTTPS.

HTTP   ❌
HTTPS  ✅

---

8. Protect refresh tokens

If using cookies, consider:

HttpOnly
Secure
SameSite

For example:

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});

Configure "SameSite" according to your actual frontend/API deployment and cross-site requirements.

---

Production Structure

A large Node.js project can separate JWT logic from authentication middleware.

src/
├── configs/
│   └── env.ts
│
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.repository.ts
│       ├── auth.routes.ts
│       ├── auth.types.ts
│       └── auth.validation.ts
│
├── security/
│   └── jwt/
│       ├── jwt.service.ts
│       ├── jwt.types.ts
│       └── jwt.constants.ts
│
├── middlewares/
│   └── authenticate.ts
│
└── app.ts

Example JWT service:

import jwt from "jsonwebtoken";

export const jwtService = {
  createAccessToken(userId: string, role: string) {
    return jwt.sign(
      {
        sub: userId,
        role,
      },
      process.env.JWT_ACCESS_SECRET!,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "my-api",
        audience: "web-app",
      },
    );
  },

  verifyAccessToken(token: string) {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
      {
        algorithms: ["HS256"],
        issuer: "my-api",
        audience: "web-app",
      },
    );
  },
};

---

TypeScript Payload

Define your application-specific payload:

import type { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload
  extends JwtPayload {
  sub: string;
  role: "admin" | "student" | "faculty";
}

After verification, narrow the returned value before using custom properties.

const decoded = jwt.verify(token, secret);

if (typeof decoded === "string") {
  throw new Error("Invalid JWT payload");
}

console.log(decoded.sub);

---

Quick Reference

Create

jwt.sign(payload, secret, options);

Verify

jwt.verify(token, secret, options);

Decode

jwt.decode(token);

---

Important Sign Options

algorithm
expiresIn
notBefore
audience
issuer
subject
jwtid
keyid
header
noTimestamp
mutatePayload

---

Important Verify Options

algorithms
audience
issuer
subject
jwtid
clockTolerance
maxAge
ignoreExpiration
ignoreNotBefore
complete

---

Important Errors

TokenExpiredError
JsonWebTokenError
NotBeforeError

---

Mental Model

Remember JWT using this simple model:

                 JWT
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Header    Payload   Signature
        │         │         │
     Algorithm   Claims    Integrity
        │         │         │
        └─────────┴─────────┘
                  │
                  ▼
              jwt.verify()
                  │
          ┌───────┴───────┐
          ▼               ▼
        Valid           Invalid
          │               │
          ▼               ▼
       req.user          401

The three methods to remember:

jwt.sign()
    ↓
Create JWT

jwt.verify()
    ↓
Trust/validate JWT

jwt.decode()
    ↓
Read JWT without validating it

---

Recommended Authentication Architecture

For a production Node.js application:

                    ┌─────────────┐
                    │    LOGIN    │
                    └──────┬──────┘
                           │
                           ▼
                    Verify Credentials
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Access Token              Refresh Token
          15 min                    30 days
              │                         │
              ▼                         ▼
          API Calls              Refresh Endpoint
              │                         │
              ▼                         ▼
       jwt.verify()             Rotate / Validate
              │                         │
              ▼                         ▼
          req.user                New Access Token

Recommended principles:

- Short-lived access tokens
- Secure refresh-token handling
- Strong secrets
- Explicit algorithm allowlist
- Validate issuer and audience
- HTTPS
- Never store secrets in JWT payloads
- Rotate/revoke refresh tokens where appropriate
- Use RS256 when asymmetric signing is beneficial
- Keep JWT implementation isolated in a security/auth module

---

📖 Official Documentation

- ""jsonwebtoken" on npm" (https://www.npmjs.com/package/jsonwebtoken)
- "JWT Introduction" (https://jwt.io/introduction)
- "JWT.io" (https://jwt.io/)

---

License

This documentation is provided for learning and reference purposes.