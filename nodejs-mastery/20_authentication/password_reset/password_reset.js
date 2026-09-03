/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/password_reset/password_reset.js
 *
 * Topic:
 *     Password Reset
 *
 * ============================================================
 *
 * PASSWORD RESET FLOW
 *
 * POST /auth/forgot-password
 *          ↓
 * Generate secure random token
 *          ↓
 * Store token HASH
 *          ↓
 * Send reset link
 *
 *
 * POST /auth/reset-password
 *          ↓
 * Receive token + new password
 *          ↓
 * Hash token
 *          ↓
 * Find reset record
 *          ↓
 * Check expiration
 *          ↓
 * Hash new password
 *          ↓
 * Update password
 *          ↓
 * Consume reset token
 *          ↓
 * Revoke existing sessions
 *
 * ============================================================
 */

import express from "express";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * TEMPORARY DATABASE
 * ============================================================
 *
 * In production:
 *
 *     User              → MongoDB
 *     PasswordReset     → MongoDB / Redis
 *     Sessions           → Redis / MongoDB
 *
 * ============================================================
 */

const users = [
  {
    id: "user-123",

    email: "shiva@example.com",

    passwordHash: "$2b$12$example",

    passwordChangedAt: null,
  },
];

/*
 * ============================================================
 * PASSWORD RESET STORE
 * ============================================================
 *
 * IMPORTANT:
 *
 * We store the HASH of the reset token, not the raw token.
 *
 * ============================================================
 */

const passwordResetTokens = new Map();

/*
 * ============================================================
 * ACTIVE SESSIONS
 * ============================================================
 *
 * When a password changes, existing authentication sessions can
 * be revoked.
 *
 * ============================================================
 */

const sessions = new Map();

/*
 * ============================================================
 * 1. GENERATE RESET TOKEN
 * ============================================================
 *
 * crypto.randomBytes() is appropriate for generating
 * unpredictable security tokens.
 *
 * ============================================================
 */

function generateResetToken() {
  return crypto.randomBytes(32).toString("base64url");
}

/*
 * ============================================================
 * 2. HASH RESET TOKEN
 * ============================================================
 *
 * Raw token:
 *
 *     abc123...
 *
 * becomes:
 *
 *     SHA-256(raw token)
 *
 * ============================================================
 */

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
 * ============================================================
 * 3. PASSWORD VALIDATION
 * ============================================================
 *
 * This is intentionally basic.
 *
 * Production applications should use a proper validation
 * schema and password policy.
 *
 * ============================================================
 */

function validatePassword(password) {
  if (typeof password !== "string") {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  return true;
}

/*
 * ============================================================
 * 4. FORGOT PASSWORD
 * ============================================================
 *
 * POST /api/v1/auth/forgot-password
 *
 * Body:
 *
 * {
 *   "email": "shiva@example.com"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/forgot-password", async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  /*
   * --------------------------------------------------------
   * IMPORTANT SECURITY RULE
   * --------------------------------------------------------
   *
   * Don't reveal whether the account exists.
   *
   * Bad:
   *
   *     "No account exists with this email"
   *
   *
   * Better:
   *
   *     "If the account exists, a reset link has been sent."
   *
   * --------------------------------------------------------
   */

  if (!email) {
    return res.status(400).json({
      error: {
        code: "INVALID_EMAIL",

        message: "Invalid email address",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * FIND USER
   * --------------------------------------------------------
   */

  const user = users.find((user) => user.email === email);

  /*
   * --------------------------------------------------------
   * GENERATE TOKEN
   * --------------------------------------------------------
   *
   * Only generate/send a token if the user exists.
   *
   * But return the same external response either way.
   *
   * --------------------------------------------------------
   */

  if (user) {
    const rawToken = generateResetToken();

    const tokenHash = hashResetToken(rawToken);

    /*
     * Reset token lifetime.
     *
     * Example:
     *
     *     15 minutes
     */

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    /*
     * ------------------------------------------------------
     * STORE HASH
     * ------------------------------------------------------
     */

    passwordResetTokens.set(tokenHash, {
      userId: user.id,

      tokenHash,

      expiresAt,

      usedAt: null,

      createdAt: new Date(),
    });

    /*
     * ------------------------------------------------------
     * SEND EMAIL
     * ------------------------------------------------------
     *
     * NEVER log real production reset tokens.
     *
     * This is only a development demonstration.
     *
     * Example reset URL:
     *
     *     https://example.com/reset-password?token=...
     *
     * ------------------------------------------------------
     */

    console.log("DEV ONLY reset token:", rawToken);
  }

  /*
   * --------------------------------------------------------
   * SAME RESPONSE
   * --------------------------------------------------------
   */

  return res.status(202).json({
    data: {
      message: "If the account exists, a password reset link has been sent.",
    },
  });
});

/*
 * ============================================================
 * 5. RESET PASSWORD
 * ============================================================
 *
 * POST /api/v1/auth/reset-password
 *
 * Body:
 *
 * {
 *   "token": "...",
 *   "newPassword": "new-password"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  /*
   * --------------------------------------------------------
   * VALIDATE INPUT
   * --------------------------------------------------------
   */

  if (typeof token !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",

        message: "token and newPassword are required",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * PASSWORD POLICY
   * --------------------------------------------------------
   */

  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      error: {
        code: "INVALID_PASSWORD",

        message: "Password does not satisfy the password policy",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * HASH PRESENTED TOKEN
   * --------------------------------------------------------
   */

  const tokenHash = hashResetToken(token);

  /*
   * --------------------------------------------------------
   * FIND RESET RECORD
   * --------------------------------------------------------
   */

  const resetRecord = passwordResetTokens.get(tokenHash);

  if (!resetRecord) {
    return res.status(400).json({
      error: {
        code: "INVALID_RESET_TOKEN",

        message: "Invalid or expired reset token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CHECK WHETHER TOKEN WAS ALREADY USED
   * --------------------------------------------------------
   */

  if (resetRecord.usedAt) {
    return res.status(400).json({
      error: {
        code: "RESET_TOKEN_ALREADY_USED",

        message: "Invalid or expired reset token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CHECK EXPIRATION
   * --------------------------------------------------------
   */

  if (resetRecord.expiresAt <= new Date()) {
    return res.status(400).json({
      error: {
        code: "RESET_TOKEN_EXPIRED",

        message: "Invalid or expired reset token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * FIND USER
   * --------------------------------------------------------
   */

  const user = users.find((user) => user.id === resetRecord.userId);

  if (!user) {
    return res.status(400).json({
      error: {
        code: "INVALID_RESET_TOKEN",

        message: "Invalid or expired reset token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * HASH NEW PASSWORD
   * --------------------------------------------------------
   *
   * NEVER store:
   *
   *     user.password = newPassword
   *
   *
   * Store:
   *
   *     bcrypt hash
   *
   * --------------------------------------------------------
   */

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  /*
   * --------------------------------------------------------
   * UPDATE PASSWORD
   * --------------------------------------------------------
   */

  user.passwordHash = newPasswordHash;

  user.passwordChangedAt = new Date();

  /*
   * --------------------------------------------------------
   * CONSUME RESET TOKEN
   * --------------------------------------------------------
   *
   * One reset token should be usable only once.
   * --------------------------------------------------------
   */

  resetRecord.usedAt = new Date();

  passwordResetTokens.set(tokenHash, resetRecord);

  /*
   * --------------------------------------------------------
   * REVOKE EXISTING SESSIONS
   * --------------------------------------------------------
   *
   * Password compromise may have occurred.
   *
   * Therefore existing sessions should generally be
   * invalidated after a password reset.
   * --------------------------------------------------------
   */

  revokeUserSessions(user.id);

  /*
   * --------------------------------------------------------
   * SUCCESS
   * --------------------------------------------------------
   */

  return res.status(200).json({
    data: {
      message: "Password reset successful",
    },
  });
});

/*
 * ============================================================
 * 6. REVOKE USER SESSIONS
 * ============================================================
 */

function revokeUserSessions(userId) {
  const now = new Date();

  for (const session of sessions.values()) {
    if (session.userId === userId) {
      session.revokedAt = now;

      sessions.set(session.id, session);
    }
  }
}

/*
 * ============================================================
 * 7. INVALIDATE OTHER RESET TOKENS
 * ============================================================
 *
 * Suppose the user requests multiple reset emails:
 *
 *
 *     Token A
 *     Token B
 *     Token C
 *
 *
 * You may choose to invalidate previous outstanding tokens when
 * creating a new reset request.
 *
 * This reduces the number of simultaneously valid recovery
 * credentials.
 *
 * ============================================================
 */

function invalidateExistingResetTokens(userId) {
  const now = new Date();

  for (const [hash, record] of passwordResetTokens.entries()) {
    if (record.userId === userId && !record.usedAt) {
      record.usedAt = now;

      passwordResetTokens.set(hash, record);
    }
  }
}

/*
 * ============================================================
 * 8. IMPROVED FORGOT-PASSWORD FLOW
 * ============================================================
 *
 * A stronger implementation can do:
 *
 *
 * find user
 *    ↓
 * invalidate old reset tokens
 *    ↓
 * generate new token
 *    ↓
 * store token hash
 *    ↓
 * send email
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. RESET LINK
 * ============================================================
 *
 * The email might contain a link conceptually like:
 *
 *
 *     https://app.example.com/reset-password?token=<token>
 *
 *
 * The frontend reads the token and submits it to:
 *
 *
 *     POST /api/v1/auth/reset-password
 *
 *
 * IMPORTANT:
 *
 * The raw token should be sent only through a secure HTTPS
 * channel.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. WHY HASH RESET TOKENS?
 * ============================================================
 *
 * Imagine the database stores:
 *
 *
 *     resetToken:
 *         abc123
 *
 *
 * If the database is leaked, the attacker may immediately use
 * that token.
 *
 *
 * Instead:
 *
 *
 *     raw token
 *         ↓
 *     SHA-256
 *         ↓
 *     stored hash
 *
 *
 * Database attacker gets the hash rather than the usable
 * credential.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. PASSWORD RESET TOKEN ≠ PASSWORD HASH
 * ============================================================
 *
 * Password:
 *
 *     bcrypt
 *     Argon2
 *     etc.
 *
 *
 * Reset token:
 *
 *     cryptographically random value
 *     + server-side hash
 *
 *
 * They solve different problems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. RESET TOKEN REQUIREMENTS
 * ============================================================
 *
 * A reset token should be:
 *
 *
 *     unpredictable
 *
 *     sufficiently long
 *
 *     short-lived
 *
 *     single-use
 *
 *     securely transmitted
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. DO NOT USE Math.random()
 * ============================================================
 *
 * NEVER generate security tokens with:
 *
 *
 *     Math.random()
 *
 *
 * Use:
 *
 *
 *     crypto.randomBytes()
 *
 *
 * because Node's crypto module provides cryptographically
 * secure random generation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. ACCOUNT ENUMERATION
 * ============================================================
 *
 * User requests:
 *
 *
 *     POST /forgot-password
 *
 *     email = abc@example.com
 *
 *
 * Don't respond:
 *
 *
 *     "Account exists"
 *
 *
 * or:
 *
 *
 *     "Account doesn't exist"
 *
 *
 * Prefer a generic response:
 *
 *
 *     "If the account exists, a reset link has been sent."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. RATE LIMITING
 * ============================================================
 *
 * Password reset endpoints can be abused.
 *
 *
 * Protect:
 *
 *
 *     POST /forgot-password
 *
 *
 * with rate limiting.
 *
 *
 * Also consider:
 *
 *
 *     email delivery throttling
 *
 *     IP controls
 *
 *     abuse detection
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. EMAIL SECURITY
 * ============================================================
 *
 * Don't include:
 *
 *
 *     password
 *
 *     passwordHash
 *
 *     internal database information
 *
 *
 * in reset emails.
 *
 *
 * Send only the recovery link/instructions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. PASSWORD CHANGE AFTER RESET
 * ============================================================
 *
 * After successfully changing the password:
 *
 *
 *     passwordHash updated
 *             ↓
 *     reset token consumed
 *             ↓
 *     existing sessions revoked
 *
 *
 * The user can then perform a fresh login.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. PASSWORD CHANGED AT
 * ============================================================
 *
 * User record:
 *
 *
 * {
 *   passwordChangedAt:
 *       Date
 * }
 *
 *
 * This can help invalidate tokens issued before the password
 * change.
 *
 *
 * Example:
 *
 *
 * JWT:
 *
 *     iat = 100
 *
 *
 * Database:
 *
 *     passwordChangedAt = 200
 *
 *
 * Token:
 *
 *     issued before password change
 *
 * Therefore it can be rejected if your authentication strategy
 * performs this check.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. MONGOOSE SCHEMA
 * ============================================================
 *
 * Conceptually:
 *
 *
 * User:
 *
 *     email
 *     passwordHash
 *     passwordChangedAt
 *
 *
 * PasswordReset:
 *
 *     userId
 *     tokenHash
 *     expiresAt
 *     usedAt
 *     createdAt
 *
 *
 * Indexes:
 *
 *     tokenHash
 *     userId
 *     expiresAt
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. TTL CLEANUP
 * ============================================================
 *
 * Expired reset records don't need to remain forever.
 *
 *
 * MongoDB can use a TTL index on:
 *
 *
 *     expiresAt
 *
 *
 * Redis can use:
 *
 *
 *     SET key value EX 900
 *
 *
 * to automatically expire reset state.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. PASSWORD RESET VS PASSWORD CHANGE
 * ============================================================
 *
 *
 * PASSWORD RESET
 *
 * User forgot password.
 *
 *     email
 *       ↓
 *     recovery token
 *       ↓
 *     new password
 *
 *
 *
 * PASSWORD CHANGE
 *
 * User is already authenticated.
 *
 *     current password
 *            ↓
 *     new password
 *
 *
 * These should be separate endpoints and security flows.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. PASSWORD CHANGE EXAMPLE
 * ============================================================
 *
 * POST /api/v1/auth/change-password
 *
 *
 * Authorization:
 *
 *     Bearer <access-token>
 *
 *
 * Body:
 *
 * {
 *   "currentPassword": "...",
 *   "newPassword": "..."
 * }
 *
 *
 * Flow:
 *
 *
 * authenticate
 *      ↓
 * find user
 *      ↓
 * compare current password
 *      ↓
 * hash new password
 *      ↓
 * update password
 *      ↓
 * revoke sessions if required
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. COMPLETE RECOVERY FLOW
 * ============================================================
 *
 *
 *                 FORGOT PASSWORD
 *                        │
 *                        ▼
 *                  enter email
 *                        │
 *                        ▼
 *                 find account
 *                        │
 *                        ▼
 *             generate random token
 *                        │
 *                        ▼
 *                hash token
 *                        │
 *                        ▼
 *                store token hash
 *                        │
 *                        ▼
 *                  send email
 *                        │
 *                        ▼
 *                user clicks link
 *                        │
 *                        ▼
 *             submit token + password
 *                        │
 *                        ▼
 *                hash submitted token
 *                        │
 *                        ▼
 *                find reset record
 *                        │
 *                  ┌─────┴─────┐
 *                  │           │
 *               invalid       valid
 *                  │           │
 *                 400          ▼
 *                         check expiration
 *                                │
 *                                ▼
 *                         hash new password
 *                                │
 *                                ▼
 *                         update user
 *                                │
 *                                ▼
 *                       consume reset token
 *                                │
 *                                ▼
 *                       revoke sessions
 *                                │
 *                                ▼
 *                              200
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. SECURITY CHECKLIST
 * ============================================================
 *
 * ✓ Use crypto.randomBytes().
 *
 * ✓ Never use Math.random() for reset tokens.
 *
 * ✓ Store a hash of the reset token.
 *
 * ✓ Give reset tokens a short expiration.
 *
 * ✓ Make reset tokens single-use.
 *
 * ✓ Use HTTPS.
 *
 * ✓ Don't reveal whether an account exists.
 *
 * ✓ Rate-limit reset requests.
 *
 * ✓ Don't log production reset tokens.
 *
 * ✓ Don't put passwords in emails or URLs.
 *
 * ✓ Hash the new password before storage.
 *
 * ✓ Revoke existing sessions after password reset.
 *
 * ✓ Consider invalidating older outstanding reset tokens.
 *
 * ✓ Never return passwordHash in API responses.
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Password-reset server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Password reset starts with an email address.
 *
 * 2. Generate a cryptographically secure random token.
 *
 * 3. Store only the token hash.
 *
 * 4. Send the raw token through a secure recovery link.
 *
 * 5. Make reset tokens short-lived.
 *
 * 6. Make reset tokens single-use.
 *
 * 7. Never reveal whether an account exists.
 *
 * 8. Hash the new password using a password-hashing algorithm.
 *
 * 9. Revoke existing authentication sessions after a successful
 *    password reset.
 *
 * 10. Rate-limit the forgot-password endpoint.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     20_authentication/email_verification/
 *
 * We will cover:
 *
 *     email verification token
 *     verification endpoint
 *     token expiration
 *     resend verification
 *     single-use tokens
 *     verifiedAt
 *     account activation flow
 *
 * ============================================================
 */
