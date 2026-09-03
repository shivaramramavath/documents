/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     20_authentication/email_verification/email_verification.js
 *
 * Topic:
 *     Email Verification
 *
 * ============================================================
 *
 * EMAIL VERIFICATION FLOW
 *
 * REGISTER
 *    ↓
 * Create user
 *    ↓
 * emailVerified = false
 *    ↓
 * Generate verification token
 *    ↓
 * Store token HASH
 *    ↓
 * Send verification email
 *    ↓
 * User clicks link
 *    ↓
 * Submit token
 *    ↓
 * Hash token
 *    ↓
 * Find valid token
 *    ↓
 * Mark email as verified
 *    ↓
 * Consume token
 *
 * ============================================================
 */

import express from "express";
import crypto from "node:crypto";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const VERIFICATION_TOKEN_TTL = 24 * 60 * 60 * 1000;

/*
 * ============================================================
 * TEMPORARY USER DATABASE
 * ============================================================
 *
 * Production:
 *
 *     MongoDB + Mongoose
 *
 * ============================================================
 */

const users = [
  {
    id: "user-123",

    email: "shiva@example.com",

    passwordHash: "bcrypt-hash",

    emailVerified: false,

    emailVerifiedAt: null,

    createdAt: new Date(),
  },
];

/*
 * ============================================================
 * EMAIL VERIFICATION TOKEN STORE
 * ============================================================
 *
 * IMPORTANT:
 *
 * Store tokenHash, not the raw token.
 *
 * ============================================================
 */

const verificationTokens = new Map();

/*
 * ============================================================
 * 1. GENERATE VERIFICATION TOKEN
 * ============================================================
 */

function generateVerificationToken() {
  return crypto.randomBytes(32).toString("base64url");
}

/*
 * ============================================================
 * 2. HASH VERIFICATION TOKEN
 * ============================================================
 */

function hashVerificationToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
 * ============================================================
 * 3. CREATE VERIFICATION TOKEN
 * ============================================================
 */

function createVerificationToken(userId) {
  /*
   * Generate random raw token.
   */

  const rawToken = generateVerificationToken();

  /*
   * Hash it before persistence.
   */

  const tokenHash = hashVerificationToken(rawToken);

  /*
   * Expiration:
   *
   * 24 hours
   */

  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL);

  /*
   * Store server-side state.
   */

  verificationTokens.set(tokenHash, {
    userId,

    tokenHash,

    expiresAt,

    usedAt: null,

    createdAt: new Date(),
  });

  /*
   * Return RAW token.
   *
   * This is the token that gets sent to the user's email.
   *
   * Never store this raw value in the database.
   */

  return rawToken;
}

/*
 * ============================================================
 * 4. SEND VERIFICATION EMAIL
 * ============================================================
 *
 * In production use an email provider/service.
 *
 * Example link:
 *
 *     https://app.example.com/verify-email?token=...
 *
 * ============================================================
 */

async function sendVerificationEmail(email, token) {
  const verificationUrl = `https://app.example.com/verify-email?token=${encodeURIComponent(token)}`;

  /*
   * Development demonstration.
   *
   * Do NOT log verification URLs containing real tokens in
   * production.
   */

  console.log("DEV ONLY verification URL:", verificationUrl);

  /*
   * Production:
   *
   * await emailService.send({
   *   to: email,
   *   subject: "Verify your email",
   *   html: ...
   * });
   */
}

/*
 * ============================================================
 * 5. REGISTER USER
 * ============================================================
 *
 * POST /api/v1/auth/register
 *
 * Body:
 *
 * {
 *   "email": "user@example.com",
 *   "password": "password"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/register", async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  /*
   * In a real application the password would be validated and
   * hashed before the user is created.
   */

  if (!email) {
    return res.status(400).json({
      error: {
        code: "INVALID_EMAIL",

        message: "Email is required",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CHECK DUPLICATE EMAIL
   * --------------------------------------------------------
   */

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      error: {
        code: "EMAIL_ALREADY_REGISTERED",

        message: "Email is already registered",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CREATE USER
   * --------------------------------------------------------
   */

  const user = {
    id: crypto.randomUUID(),

    email,

    passwordHash: "bcrypt-hash",

    emailVerified: false,

    emailVerifiedAt: null,

    createdAt: new Date(),
  };

  users.push(user);

  /*
   * --------------------------------------------------------
   * CREATE VERIFICATION TOKEN
   * --------------------------------------------------------
   */

  const token = createVerificationToken(user.id);

  /*
   * --------------------------------------------------------
   * SEND EMAIL
   * --------------------------------------------------------
   */

  await sendVerificationEmail(user.email, token);

  /*
   * --------------------------------------------------------
   * RESPONSE
   * --------------------------------------------------------
   */

  return res.status(201).json({
    data: {
      message: "Account created. Please verify your email.",
    },
  });
});

/*
 * ============================================================
 * 6. VERIFY EMAIL
 * ============================================================
 *
 * POST /api/v1/auth/verify-email
 *
 * Body:
 *
 * {
 *   "token": "..."
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/verify-email", async (req, res) => {
  const { token } = req.body;

  /*
   * --------------------------------------------------------
   * VALIDATE TOKEN
   * --------------------------------------------------------
   */

  if (typeof token !== "string" || !token) {
    return res.status(400).json({
      error: {
        code: "VERIFICATION_TOKEN_REQUIRED",

        message: "Verification token is required",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * HASH TOKEN
   * --------------------------------------------------------
   */

  const tokenHash = hashVerificationToken(token);

  /*
   * --------------------------------------------------------
   * FIND TOKEN
   * --------------------------------------------------------
   */

  const record = verificationTokens.get(tokenHash);

  if (!record) {
    return res.status(400).json({
      error: {
        code: "INVALID_VERIFICATION_TOKEN",

        message: "Invalid or expired verification token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CHECK SINGLE USE
   * --------------------------------------------------------
   */

  if (record.usedAt) {
    return res.status(400).json({
      error: {
        code: "VERIFICATION_TOKEN_ALREADY_USED",

        message: "Invalid or expired verification token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * CHECK EXPIRATION
   * --------------------------------------------------------
   */

  if (record.expiresAt <= new Date()) {
    return res.status(400).json({
      error: {
        code: "VERIFICATION_TOKEN_EXPIRED",

        message: "Invalid or expired verification token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * FIND USER
   * --------------------------------------------------------
   */

  const user = users.find((user) => user.id === record.userId);

  if (!user) {
    return res.status(400).json({
      error: {
        code: "INVALID_VERIFICATION_TOKEN",

        message: "Invalid or expired verification token",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * ALREADY VERIFIED
   * --------------------------------------------------------
   *
   * This can happen if the account was verified through another
   * valid flow.
   *
   * --------------------------------------------------------
   */

  if (user.emailVerified) {
    /*
     * Consume the token anyway.
     */

    record.usedAt = new Date();

    verificationTokens.set(tokenHash, record);

    return res.status(200).json({
      data: {
        message: "Email is already verified",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * MARK EMAIL AS VERIFIED
   * --------------------------------------------------------
   */

  user.emailVerified = true;

  user.emailVerifiedAt = new Date();

  /*
   * --------------------------------------------------------
   * CONSUME TOKEN
   * --------------------------------------------------------
   */

  record.usedAt = new Date();

  verificationTokens.set(tokenHash, record);

  /*
   * --------------------------------------------------------
   * SUCCESS
   * --------------------------------------------------------
   */

  return res.status(200).json({
    data: {
      message: "Email verified successfully",
    },
  });
});

/*
 * ============================================================
 * 7. RESEND VERIFICATION EMAIL
 * ============================================================
 *
 * POST /api/v1/auth/resend-verification
 *
 * Body:
 *
 * {
 *   "email": "user@example.com"
 * }
 *
 * ============================================================
 */

app.post("/api/v1/auth/resend-verification", async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  /*
   * --------------------------------------------------------
   * FIND USER
   * --------------------------------------------------------
   */

  const user = users.find((user) => user.email === email);

  /*
   * --------------------------------------------------------
   * GENERIC RESPONSE
   * --------------------------------------------------------
   *
   * Avoid leaking account information where appropriate.
   *
   * --------------------------------------------------------
   */

  if (!user) {
    return res.status(202).json({
      data: {
        message: "If the account exists, a verification email has been sent.",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * ALREADY VERIFIED
   * --------------------------------------------------------
   */

  if (user.emailVerified) {
    return res.status(202).json({
      data: {
        message:
          "If the account requires verification, a verification email has been sent.",
      },
    });
  }

  /*
   * --------------------------------------------------------
   * INVALIDATE OLD TOKENS
   * --------------------------------------------------------
   */

  invalidateUserVerificationTokens(user.id);

  /*
   * --------------------------------------------------------
   * CREATE NEW TOKEN
   * --------------------------------------------------------
   */

  const token = createVerificationToken(user.id);

  /*
   * --------------------------------------------------------
   * SEND EMAIL
   * --------------------------------------------------------
   */

  await sendVerificationEmail(user.email, token);

  return res.status(202).json({
    data: {
      message:
        "If the account requires verification, a verification email has been sent.",
    },
  });
});

/*
 * ============================================================
 * 8. INVALIDATE OLD VERIFICATION TOKENS
 * ============================================================
 *
 * If the user requests:
 *
 *
 *     Token A
 *     Token B
 *     Token C
 *
 *
 * we can invalidate older outstanding tokens when generating a
 * new one.
 *
 * ============================================================
 */

function invalidateUserVerificationTokens(userId) {
  const now = new Date();

  for (const [hash, record] of verificationTokens.entries()) {
    if (record.userId === userId && !record.usedAt) {
      record.usedAt = now;

      verificationTokens.set(hash, record);
    }
  }
}

/*
 * ============================================================
 * 9. REQUIRE VERIFIED EMAIL
 * ============================================================
 *
 * Some applications should prevent certain operations until
 * email verification is complete.
 *
 * ============================================================
 */

function requireVerifiedEmail(req, res, next) {
  /*
   * Assume authentication middleware has already populated:
   *
   *     req.user
   *
   * --------------------------------------------------------
   */

  const user = users.find((user) => user.id === req.user?.id);

  if (!user) {
    return res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",

        message: "Authentication required",
      },
    });
  }

  if (!user.emailVerified) {
    return res.status(403).json({
      error: {
        code: "EMAIL_NOT_VERIFIED",

        message: "Please verify your email before continuing",
      },
    });
  }

  next();
}

/*
 * ============================================================
 * 10. EXAMPLE PROTECTED ROUTE
 * ============================================================
 *
 * In production this would also have authentication middleware
 * before requireVerifiedEmail.
 *
 * ============================================================
 */

app.get("/api/v1/protected", requireVerifiedEmail, (req, res) => {
  return res.status(200).json({
    data: {
      message: "You have a verified email",
    },
  });
});

/*
 * ============================================================
 * 11. USER MODEL
 * ============================================================
 *
 * Typical Mongoose fields:
 *
 *
 * User
 * ─────────────────────────
 * _id
 * email
 * passwordHash
 * emailVerified
 * emailVerifiedAt
 * createdAt
 * updatedAt
 *
 *
 * EmailVerificationToken
 * ─────────────────────────
 * userId
 * tokenHash
 * expiresAt
 * usedAt
 * createdAt
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. MONGODB INDEXES
 * ============================================================
 *
 * Useful indexes:
 *
 *
 * User:
 *
 *     email: unique
 *
 *
 * EmailVerificationToken:
 *
 *     tokenHash: unique
 *
 *     userId
 *
 *     expiresAt
 *
 *
 * A TTL index can automatically remove expired token records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. REDIS VERSION
 * ============================================================
 *
 * Redis can store:
 *
 *
 *     email:verify:<tokenHash>
 *
 *
 * Example value:
 *
 *
 * {
 *   userId: "user-123"
 * }
 *
 *
 * with:
 *
 *
 *     EX 86400
 *
 *
 * After 24 hours Redis automatically expires the key.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. TOKEN SECURITY
 * ============================================================
 *
 * DON'T:
 *
 *     Math.random()
 *
 *
 * DON'T:
 *
 *     token = userId
 *
 *
 * DON'T:
 *
 *     token = email + timestamp
 *
 *
 * DO:
 *
 *     crypto.randomBytes()
 *
 *
 * Example:
 *
 *
 *     crypto.randomBytes(32)
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. TOKEN HASHING
 * ============================================================
 *
 * Raw token:
 *
 *     XXXXXXXXXXXXXXXXX
 *
 *             │
 *             ▼
 *
 *        SHA-256
 *
 *             │
 *             ▼
 *
 * Token hash stored in DB
 *
 *
 * The raw token exists only while generating/sending the
 * verification email and while the client submits it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. TOKEN EXPIRATION
 * ============================================================
 *
 * Example:
 *
 *
 *     createdAt = 10:00
 *
 *     expiresAt = 10:00 + 24h
 *
 *
 * At:
 *
 *
 *     10:01 next day
 *
 *
 * token becomes invalid.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. SINGLE-USE TOKEN
 * ============================================================
 *
 * First request:
 *
 *
 *     token → valid
 *            ↓
 *        verify email
 *            ↓
 *        usedAt = now
 *
 *
 * Second request:
 *
 *
 *     same token → rejected
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. EMAIL VERIFIED STATE
 * ============================================================
 *
 * Before verification:
 *
 *
 *     emailVerified = false
 *
 *     emailVerifiedAt = null
 *
 *
 * After verification:
 *
 *
 *     emailVerified = true
 *
 *     emailVerifiedAt = Date
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. REGISTRATION + VERIFICATION
 * ============================================================
 *
 *
 *             REGISTER
 *                 │
 *                 ▼
 *            create user
 *                 │
 *                 ▼
 *        emailVerified=false
 *                 │
 *                 ▼
 *       create verification token
 *                 │
 *                 ▼
 *            send email
 *                 │
 *                 ▼
 *          user clicks link
 *                 │
 *                 ▼
 *          submit token
 *                 │
 *                 ▼
 *          validate token
 *                 │
 *                 ▼
 *        emailVerified=true
 *                 │
 *                 ▼
 *          account verified
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. RESEND FLOW
 * ============================================================
 *
 *
 *       resend verification
 *                │
 *                ▼
 *       invalidate old token
 *                │
 *                ▼
 *       generate new token
 *                │
 *                ▼
 *          send email
 *
 *
 * Rate limiting is IMPORTANT here.
 *
 * Otherwise an attacker could repeatedly trigger email
 * delivery.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. RATE LIMITING
 * ============================================================
 *
 * Protect:
 *
 *
 *     POST /forgot-password
 *
 *     POST /resend-verification
 *
 *     POST /verify-email
 *
 *
 * especially against:
 *
 *
 *     brute force
 *
 *     email flooding
 *
 *     automated abuse
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. VERIFICATION TOKEN ≠ ACCESS TOKEN
 * ============================================================
 *
 * Access token:
 *
 *     Used to authorize API requests.
 *
 *
 * Email verification token:
 *
 *     Used only to prove email ownership.
 *
 *
 * Don't mix their purposes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. SHOULD THE VERIFICATION TOKEN BE A JWT?
 * ============================================================
 *
 * It can be implemented as a JWT, but an opaque random token
 * with server-side state is often simpler for one-time
 * credentials because:
 *
 *
 *     revocation
 *     single-use tracking
 *     expiration
 *     token consumption
 *
 *
 * are straightforward.
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
 * ✓ Store token hashes instead of raw tokens.
 *
 * ✓ Give tokens an expiration.
 *
 * ✓ Make tokens single-use.
 *
 * ✓ Use HTTPS.
 *
 * ✓ Don't log real tokens in production.
 *
 * ✓ Rate-limit resend requests.
 *
 * ✓ Don't allow unlimited verification attempts.
 *
 * ✓ Consider invalidating older verification tokens.
 *
 * ✓ Record emailVerifiedAt.
 *
 * ✓ Use a unique index for user email.
 *
 * ✓ Don't expose unnecessary account information.
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Email-verification server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. New accounts normally start with emailVerified=false.
 *
 * 2. Generate a cryptographically secure verification token.
 *
 * 3. Store only its hash.
 *
 * 4. Send the raw token through an HTTPS verification link.
 *
 * 5. Give the token an expiration.
 *
 * 6. Make the token single-use.
 *
 * 7. Store emailVerifiedAt after successful verification.
 *
 * 8. Rate-limit resend verification.
 *
 * 9. Consider invalidating older verification tokens.
 *
 * 10. Use middleware to protect operations that require a
 *     verified email.
 *
 * ============================================================
 *
 * END OF:
 *
 *     20_authentication/email_verification/
 *
 * NEXT SECTION:
 *
 *     21_authorization/
 *
 *     roles/
 *     permissions/
 *     rbac/
 *     middleware.js
 *
 * ============================================================
 */
