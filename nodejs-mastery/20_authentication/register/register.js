/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/register/register.js
 *
 * Topic:
 *     User Registration
 *
 * ============================================================
 *
 * REGISTRATION FLOW
 *
 * Client
 *   ↓
 * POST /api/v1/auth/register
 *   ↓
 * Validate input
 *   ↓
 * Check existing user
 *   ↓
 * Hash password
 *   ↓
 * Create user
 *   ↓
 * Return safe response
 *
 * ============================================================
 */

import express from "express";
import bcrypt from "bcryptjs";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * 1. TEMPORARY DATABASE
 * ============================================================
 *
 * In a real application this will be MongoDB.
 *
 * Example:
 *
 *     User.create(...)
 *
 * ============================================================
 */

const users = [];

/*
 * ============================================================
 * 2. PASSWORD RULES
 * ============================================================
 *
 * Never store plain-text passwords.
 *
 * WRONG:
 *
 *     password: "mypassword"
 *
 *
 * CORRECT:
 *
 *     passwordHash: "$2b$..."
 *
 * ============================================================
 */

const MIN_PASSWORD_LENGTH = 8;

/*
 * ============================================================
 * 3. EMAIL VALIDATION
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
 * 4. PASSWORD VALIDATION
 * ============================================================
 */

function isValidPassword(password) {
  if (typeof password !== "string") {
    return false;
  }

  return password.length >= MIN_PASSWORD_LENGTH;
}

/*
 * ============================================================
 * 5. REGISTER ROUTE
 * ============================================================
 *
 * Request:
 *
 * POST /api/v1/auth/register
 *
 *
 * Body:
 *
 * {
 *   "name": "Shiva Ram",
 *   "email": "shiva@example.com",
 *   "password": "strongpassword"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /*
     * ------------------------------------------------------
     * Validate required fields
     * ------------------------------------------------------
     */

    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",

          message: "name, email and password are required",
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
     * Validate password
     * ------------------------------------------------------
     */

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: {
          code: "INVALID_PASSWORD",

          message: `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`,
        },
      });
    }

    /*
     * ------------------------------------------------------
     * Normalize email
     * ------------------------------------------------------
     *
     * Email comparison should normally be case-insensitive
     * according to your application's chosen policy.
     */

    const normalizedEmail = email.trim().toLowerCase();

    /*
     * ------------------------------------------------------
     * Check existing user
     * ------------------------------------------------------
     */

    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: "EMAIL_ALREADY_EXISTS",

          message: "An account already exists",
        },
      });
    }

    /*
     * ------------------------------------------------------
     * HASH PASSWORD
     * ------------------------------------------------------
     *
     * bcrypt does NOT encrypt the password.
     *
     * It creates a one-way password hash.
     *
     * The original password cannot be recovered from it.
     */

    const passwordHash = await bcrypt.hash(password, 12);

    /*
     * ------------------------------------------------------
     * CREATE USER
     * ------------------------------------------------------
     */

    const user = {
      id: crypto.randomUUID(),

      name: name.trim(),

      email: normalizedEmail,

      passwordHash,

      createdAt: new Date(),
    };

    users.push(user);

    /*
     * ------------------------------------------------------
     * NEVER RETURN passwordHash
     * ------------------------------------------------------
     */

    return res.status(201).json({
      data: {
        id: user.id,

        name: user.name,

        email: user.email,

        createdAt: user.createdAt,
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
 * 6. IMPORTANT: UNIQUE EMAIL INDEX
 * ============================================================
 *
 * The JavaScript `find()` check above is NOT sufficient in a
 * production system.
 *
 * Two requests could arrive simultaneously:
 *
 *
 * Request A ──┐
 *             ├── both check → email doesn't exist
 * Request B ──┘
 *
 *
 * Both could then create the same email.
 *
 *
 * MongoDB should enforce uniqueness with an index.
 *
 *
 * Mongoose:
 *
 *
 * userSchema.index(
 *   { email: 1 },
 *   { unique: true }
 * );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. MONGOOSE MODEL EXAMPLE
 * ============================================================
 *
 * import mongoose from "mongoose";
 *
 *
 * const userSchema =
 *   new mongoose.Schema(
 *     {
 *       name: {
 *         type: String,
 *         required: true,
 *         trim: true,
 *       },
 *
 *       email: {
 *         type: String,
 *         required: true,
 *         lowercase: true,
 *         trim: true,
 *         unique: true,
 *       },
 *
 *       passwordHash: {
 *         type: String,
 *         required: true,
 *         select: false,
 *       },
 *     },
 *     {
 *       timestamps: true,
 *     },
 *   );
 *
 *
 * export const User =
 *   mongoose.model(
 *     "User",
 *     userSchema,
 *   );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. WHY `select: false`?
 * ============================================================
 *
 * If:
 *
 *     passwordHash: {
 *       select: false
 *     }
 *
 *
 * then normal queries don't automatically return the hash.
 *
 *
 * When authentication needs it:
 *
 *
 *     User.findOne({
 *       email,
 *     }).select(
 *       "+passwordHash",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. REAL MONGOOSE REGISTRATION
 * ============================================================
 *
 * Example service:
 *
 *
 * async function registerUser(
 *   data,
 * ) {
 *
 *   const {
 *     name,
 *     email,
 *     password,
 *   } = data;
 *
 *
 *   const normalizedEmail =
 *     email
 *       .trim()
 *       .toLowerCase();
 *
 *
 *   const passwordHash =
 *     await bcrypt.hash(
 *       password,
 *       12,
 *     );
 *
 *
 *   const user =
 *     await User.create({
 *       name,
 *       email:
 *         normalizedEmail,
 *       passwordHash,
 *     });
 *
 *
 *   return {
 *     id: user.id,
 *     name: user.name,
 *     email: user.email,
 *   };
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. AUTHENTICATION VS AUTHORIZATION
 * ============================================================
 *
 * Authentication:
 *
 *     "Who are you?"
 *
 *
 * Registration + login establish identity.
 *
 *
 * Authorization:
 *
 *     "What are you allowed to do?"
 *
 *
 * Example:
 *
 *
 * Authentication
 *       ↓
 *      User
 *       ↓
 * Authorization
 *       ↓
 *   admin permission
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. REGISTRATION DOES NOT MEAN AUTHENTICATED
 * ============================================================
 *
 * Depending on the application, after registration you may:
 *
 *
 * Option A:
 *
 *     require email verification
 *     ↓
 *     then allow login
 *
 *
 * Option B:
 *
 *     automatically authenticate
 *     ↓
 *     issue access + refresh tokens
 *
 *
 * Your security requirements determine the flow.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. PASSWORD HASHING
 * ============================================================
 *
 * Password:
 *
 *     "mypassword"
 *
 *          ↓
 *
 * bcrypt
 *
 *          ↓
 *
 * passwordHash
 *
 *
 * During login:
 *
 *
 * password entered
 *       ↓
 * bcrypt.compare()
 *       ↓
 * stored hash
 *       ↓
 * true / false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. NEVER DO THIS
 * ============================================================
 *
 * ❌
 *
 *     {
 *       email,
 *       password
 *     }
 *
 * stored in MongoDB.
 *
 *
 * ❌
 *
 *     console.log(password);
 *
 *
 * ❌
 *
 *     return res.json({
 *       passwordHash,
 *     });
 *
 *
 * ❌
 *
 *     create JWT containing password.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. USER DOCUMENT
 * ============================================================
 *
 * A production user document might contain:
 *
 *
 * {
 *   _id,
 *
 *   name,
 *
 *   email,
 *
 *   passwordHash,
 *
 *   emailVerified,
 *
 *   roles,
 *
 *   createdAt,
 *
 *   updatedAt
 * }
 *
 *
 * Authentication tokens should generally NOT be stored as
 * plain text fields on the user document.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. COMPLETE REGISTRATION FLOW
 * ============================================================
 *
 *
 * POST /api/v1/auth/register
 *
 *             ↓
 *
 * Parse JSON
 *
 *             ↓
 *
 * Validate body
 *
 *             ↓
 *
 * Normalize email
 *
 *             ↓
 *
 * Check unique email
 *
 *             ↓
 *
 * Hash password
 *
 *             ↓
 *
 * Create user
 *
 *             ↓
 *
 * Email verification
 *
 *             ↓
 *
 * Safe response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. HTTP STATUS CODES
 * ============================================================
 *
 * 201 Created
 *
 *     Registration successful.
 *
 *
 * 400 Bad Request
 *
 *     Invalid request data.
 *
 *
 * 409 Conflict
 *
 *     Account already exists.
 *
 *
 * 500 Internal Server Error
 *
 *     Unexpected server failure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 * Controller
 *     ↓
 * Validation
 *     ↓
 * Auth Service
 *     ↓
 * User Repository
 *     ↓
 * MongoDB
 *
 *
 * Password hashing belongs in the authentication/service layer,
 * not directly inside your HTTP route when building a larger
 * application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. RECOMMENDED STRUCTURE
 * ============================================================
 *
 * 20_authentication/
 *
 *     register/
 *
 *         register.controller.js
 *         register.service.js
 *         register.schema.js
 *
 *     login/
 *
 *     logout/
 *
 *     access_token/
 *
 *     refresh_token/
 *
 *     password_reset/
 *
 *     email_verification/
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Authentication server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Validate input.
 *
 * 2. Normalize email.
 *
 * 3. Enforce unique email in the DATABASE.
 *
 * 4. Hash passwords with a password-hashing algorithm.
 *
 * 5. Never store plain-text passwords.
 *
 * 6. Never return passwordHash.
 *
 * 7. Registration and authentication are separate concepts.
 *
 * 8. Keep authentication logic in a service layer in a
 *    production application.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/login/
 *
 * We will implement:
 *
 *     email lookup
 *     password verification
 *     bcrypt.compare()
 *     access token
 *     refresh token
 *     authentication response
 *
 * ============================================================
 */
