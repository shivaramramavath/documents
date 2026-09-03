/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/login/login.js
 *
 * Topic:
 *     User Login
 *
 * ============================================================
 *
 * LOGIN FLOW
 *
 * Client
 *   ↓
 * POST /api/v1/auth/login
 *   ↓
 * Validate email + password
 *   ↓
 * Find user
 *   ↓
 * Compare password with passwordHash
 *   ↓
 * Create authenticated session/tokens
 *   ↓
 * Return authentication response
 *
 * ============================================================
 *
 * IMPORTANT
 *
 * Registration:
 *
 *     password
 *         ↓
 *     bcrypt.hash()
 *         ↓
 *     passwordHash
 *
 *
 * Login:
 *
 *     password
 *         ↓
 *     bcrypt.compare()
 *         ↓
 *     passwordHash
 *         ↓
 *     true / false
 *
 * ============================================================
 */

import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * TEMPORARY USERS DATABASE
 * ============================================================
 *
 * In production this will be MongoDB/Mongoose.
 *
 * ============================================================
 */

const users = [];

/*
 * ============================================================
 * TEMPORARY USER CREATION
 * ============================================================
 *
 * This is only for demonstrating login.
 *
 * In a real application the user would already have been
 * created through the registration flow.
 *
 * ============================================================
 */

const passwordHash = await bcrypt.hash("password123", 12);

users.push({
  id: crypto.randomUUID(),

  name: "Shiva Ram",

  email: "shiva@example.com",

  passwordHash,

  emailVerified: true,

  roles: ["user"],
});

/*
 * ============================================================
 * 1. VALIDATE EMAIL
 * ============================================================
 */

function isValidEmail(email) {
  if (typeof email !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*
 * ============================================================
 * 2. LOGIN ROUTE
 * ============================================================
 *
 * POST /api/v1/auth/login
 *
 *
 * Body:
 *
 * {
 *   "email": "shiva@example.com",
 *   "password": "password123"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
     * ------------------------------------------------------
     * Validate required fields
     * ------------------------------------------------------
     */

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",

          message: "email and password are required",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * Validate email
     * ------------------------------------------------------
     */

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: {
          code: "INVALID_EMAIL",

          message: "Invalid email address",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * Normalize email
     * ------------------------------------------------------
     */

    const normalizedEmail = email.trim().toLowerCase();

    /*
     * ------------------------------------------------------
     * FIND USER
     * ------------------------------------------------------
     */

    const user = users.find((user) => user.email === normalizedEmail);

    /*
     * ------------------------------------------------------
     * IMPORTANT SECURITY RULE
     * ------------------------------------------------------
     *
     * Don't tell the attacker whether the email exists.
     *
     * Bad:
     *
     *     "Email does not exist"
     *
     * Better:
     *
     *     "Invalid email or password"
     *
     * This reduces account-enumeration information leakage.
     *
     * ------------------------------------------------------
     */

    if (!user) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",

          message: "Invalid email or password",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * COMPARE PASSWORD
     * ------------------------------------------------------
     *
     * NEVER:
     *
     *     password === user.passwordHash
     *
     *
     * Password hashes are not the original passwords.
     *
     * bcrypt.compare() performs the correct verification.
     */

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",

          message: "Invalid email or password",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * EMAIL VERIFICATION
     * ------------------------------------------------------
     *
     * Depending on your application, unverified users may
     * not be allowed to authenticate fully.
     */

    if (!user.emailVerified) {
      return res.status(403).json({
        error: {
          code: "EMAIL_NOT_VERIFIED",

          message: "Please verify your email address",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * AUTHENTICATION SUCCESSFUL
     * ------------------------------------------------------
     *
     * At this point:
     *
     *     identity verified
     *
     * We can create an authenticated session/token.
     *
     * ------------------------------------------------------
     */

    /*
     * ------------------------------------------------------
     * TEMPORARY SESSION ID
     * ------------------------------------------------------
     *
     * This demonstrates the concept.
     *
     * A production application will normally use a properly
     * designed access-token + refresh-token system or a
     * server-side session architecture.
     */

    const sessionId = crypto.randomUUID();

    /*
     * ------------------------------------------------------
     * RESPONSE
     * ------------------------------------------------------
     *
     * NEVER return:
     *
     *     password
     *
     *     passwordHash
     *
     * ------------------------------------------------------
     */

    return res.status(200).json({
      data: {
        user: {
          id: user.id,

          name: user.name,

          email: user.email,

          roles: user.roles,
        },

        sessionId,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",

        message: "Something went wrong",
      },
    });
  }
});

/*
 * ============================================================
 * 3. MONGOOSE VERSION
 * ============================================================
 *
 * In your real MongoDB application:
 *
 *
 * const user =
 *   await User.findOne({
 *     email: normalizedEmail,
 *   }).select(
 *     "+passwordHash",
 *   );
 *
 *
 * Why `.select("+passwordHash")`?
 *
 * Because the schema can define:
 *
 *
 * passwordHash: {
 *   type: String,
 *   select: false,
 * }
 *
 *
 * This prevents password hashes from accidentally appearing in
 * normal queries.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. MONGOOSE LOGIN SERVICE
 * ============================================================
 *
 * A better architecture is:
 *
 *
 * Controller
 *      ↓
 * Login Service
 *      ↓
 * User Repository
 *      ↓
 * MongoDB
 *
 *
 * Example:
 *
 *
 * async function loginUser({
 *   email,
 *   password,
 * }) {
 *
 *   const normalizedEmail =
 *     email
 *       .trim()
 *       .toLowerCase();
 *
 *
 *   const user =
 *     await User.findOne({
 *       email: normalizedEmail,
 *     }).select(
 *       "+passwordHash",
 *     );
 *
 *
 *   if (!user) {
 *
 *     throw new InvalidCredentialsError();
 *   }
 *
 *
 *   const matches =
 *     await bcrypt.compare(
 *       password,
 *       user.passwordHash,
 *     );
 *
 *
 *   if (!matches) {
 *
 *     throw new InvalidCredentialsError();
 *   }
 *
 *
 *   return user;
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. LOGIN SHOULD NOT RETURN THE PASSWORD HASH
 * ============================================================
 *
 * The service can internally use:
 *
 *
 *     user.passwordHash
 *
 *
 * But the controller should return only:
 *
 *
 * {
 *   id,
 *   name,
 *   email,
 *   roles
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. ACCESS TOKEN
 * ============================================================
 *
 * After successful login, a typical API authentication flow is:
 *
 *
 *     credentials
 *          ↓
 *     verify password
 *          ↓
 *     issue access token
 *          ↓
 *     client uses access token
 *
 *
 * Example:
 *
 *
 *     Authorization:
 *     Bearer <access-token>
 *
 *
 * Access tokens should generally be short-lived.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. REFRESH TOKEN
 * ============================================================
 *
 * The refresh token is used to obtain a new access token when
 * the access token expires.
 *
 *
 * Typical flow:
 *
 *
 * Login
 *   ↓
 * Access token + refresh token
 *   ↓
 * Access token expires
 *   ↓
 * Refresh token
 *   ↓
 * New access token
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. DON'T PUT PASSWORD IN JWT
 * ============================================================
 *
 * NEVER:
 *
 *
 * {
 *   email,
 *   password
 * }
 *
 *
 * inside a JWT.
 *
 *
 * JWT payload should contain only the minimum claims needed by
 * the authentication/authorization system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. POSSIBLE JWT PAYLOAD
 * ============================================================
 *
 * Example:
 *
 *
 * {
 *   sub: "user-id",
 *   roles: ["user"],
 *   iat: 1234567890,
 *   exp: 1234568190
 * }
 *
 *
 * `sub`
 *
 *     Subject / user identity.
 *
 *
 * `iat`
 *
 *     Issued-at time.
 *
 *
 * `exp`
 *
 *     Expiration time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. AUTHENTICATION VS AUTHORIZATION
 * ============================================================
 *
 * LOGIN answers:
 *
 *     "Who is this user?"
 *
 *
 * Authorization answers:
 *
 *     "Can this user perform this operation?"
 *
 *
 * Example:
 *
 *
 * Login:
 *
 *     Shiva → authenticated
 *
 *
 * Authorization:
 *
 *     Shiva → role=user
 *
 *     DELETE /users/123
 *
 *     → forbidden
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. ACCOUNT ENUMERATION
 * ============================================================
 *
 * Avoid different messages such as:
 *
 *
 *     "User doesn't exist"
 *
 *     "Wrong password"
 *
 *
 * Prefer:
 *
 *
 *     "Invalid email or password"
 *
 *
 * for both cases.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. RATE LIMITING
 * ============================================================
 *
 * Login endpoints are high-value brute-force targets.
 *
 *
 * Production systems should consider:
 *
 *
 *     rate limiting
 *
 *     IP-based controls
 *
 *     account-based throttling
 *
 *     monitoring
 *
 *     progressive delays
 *
 *     MFA where appropriate
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. TIMING CONSIDERATIONS
 * ============================================================
 *
 * Authentication systems should avoid unnecessarily revealing
 * whether an account exists through response timing or messages.
 *
 * Use established authentication libraries/patterns rather than
 * inventing cryptographic mechanisms yourself.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. LOGIN RESPONSE
 * ============================================================
 *
 * A typical response may look like:
 *
 *
 * {
 *   "data": {
 *
 *     "user": {
 *       "id": "...",
 *       "name": "Shiva Ram",
 *       "email": "shiva@example.com",
 *       "roles": ["user"]
 *     },
 *
 *     "accessToken": "...",
 *     "expiresIn": 900
 *
 *   }
 * }
 *
 *
 * Refresh-token handling depends on the chosen architecture.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. HTTP STATUS CODES
 * ============================================================
 *
 * 200
 *     Login successful.
 *
 *
 * 400
 *     Invalid request structure.
 *
 *
 * 401
 *     Invalid credentials.
 *
 *
 * 403
 *     Credentials are valid but access is currently forbidden,
 *     such as an application requiring email verification.
 *
 *
 * 429
 *     Too many login attempts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. COMPLETE AUTHENTICATION FLOW
 * ============================================================
 *
 *
 * REGISTER
 *    │
 *    ├── validate
 *    ├── hash password
 *    └── create user
 *
 *             ↓
 *
 * EMAIL VERIFICATION
 *
 *             ↓
 *
 * LOGIN
 *    │
 *    ├── find user
 *    ├── compare password
 *    └── authenticate
 *
 *             ↓
 *
 * ACCESS TOKEN
 *       +
 * REFRESH TOKEN
 *
 *             ↓
 *
 * AUTHENTICATED REQUESTS
 *
 *             ↓
 *
 * ACCESS TOKEN EXPIRES
 *
 *             ↓
 *
 * REFRESH TOKEN
 *
 *             ↓
 *
 * NEW ACCESS TOKEN
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. RECOMMENDED DIRECTORY
 * ============================================================
 *
 * 20_authentication/
 *
 * ├── register/
 * │   ├── register.controller.js
 * │   ├── register.service.js
 * │   └── register.schema.js
 * │
 * ├── login/
 * │   ├── login.controller.js
 *   ├── login.service.js
 *   └── login.schema.js
 * │
 * ├── logout/
 * │
 * ├── access_token/
 * │
 * ├── refresh_token/
 * │
 * ├── password_reset/
 * │
 * └── email_verification/
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Login server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Normalize the email.
 *
 * 2. Find the user.
 *
 * 3. Use bcrypt.compare().
 *
 * 4. Never compare a password directly with its hash.
 *
 * 5. Don't reveal whether an email exists.
 *
 * 6. Never return passwordHash.
 *
 * 7. Protect login with rate limiting.
 *
 * 8. Successful authentication leads to a token/session
 *    mechanism.
 *
 * 9. Authentication and authorization are different.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/logout/
 *
 * We will learn:
 *
 *     session invalidation
 *     refresh-token revocation
 *     cookie clearing
 *     logout-all-devices
 *     token rotation concepts
 *
 * ============================================================
 */
