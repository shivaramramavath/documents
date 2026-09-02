/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 13_password_security/password_security.js
 *
 * Topic:
 * Password Security
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. NEVER store plain-text passwords
 * ============================================================
 *
 * BAD:
 *
 *     {
 *       email: "user@example.com",
 *       password: "mypassword123"
 *     }
 *
 *
 * If your database is compromised, the attacker immediately
 * gets the user's actual password.
 *
 *
 * NEVER store passwords like this.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Password hashing
 * ============================================================
 *
 * Instead of storing the original password, we create a
 * one-way password hash.
 *
 *
 * Example:
 *
 *     Password
 *        │
 *        ▼
 *     Hash function
 *        │
 *        ▼
 *     Password hash
 *
 *
 * Database stores:
 *
 *     passwordHash
 *
 * NOT:
 *
 *     password
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Hashing is NOT encryption
 * ============================================================
 *
 * Encryption:
 *
 *     plaintext
 *        ↓
 *     encrypted data
 *        ↓
 *     decryption
 *        ↓
 *     plaintext
 *
 *
 * Hashing:
 *
 *     plaintext
 *        ↓
 *     hash
 *
 *
 * There is no normal "decrypt hash" operation.
 *
 *
 * Passwords should be HASHED, not encrypted for storage.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Why normal SHA-256 is not enough for passwords
 * ============================================================
 *
 * You might think:
 *
 *     crypto.createHash("sha256")
 *
 * is enough.
 *
 * It is NOT the recommended approach for password storage.
 *
 *
 * SHA-256 is designed to be extremely fast.
 *
 * Password hashing should deliberately be expensive so that
 * attackers cannot test huge numbers of password guesses
 * quickly.
 *
 *
 * Password-specific hashing algorithms include:
 *
 *     bcrypt
 *     scrypt
 *     Argon2
 *
 *
 * In this section we will learn bcryptjs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. bcryptjs
 * ============================================================
 *
 * `bcryptjs` is a JavaScript implementation of bcrypt.
 *
 * Install it:
 *
 *     npm install bcryptjs
 *
 *
 * Then:
 *
 *     const bcrypt = require("bcryptjs");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Basic bcrypt workflow
 * ============================================================
 *
 *
 * Registration:
 *
 *     User enters password
 *             │
 *             ▼
 *       bcrypt.hash()
 *             │
 *             ▼
 *        passwordHash
 *             │
 *             ▼
 *          Database
 *
 *
 *
 * Login:
 *
 *     User enters password
 *             │
 *             ▼
 *      bcrypt.compare()
 *             │
 *             ▼
 *       true / false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Hash a password
 * ============================================================
 *
 * Example:
 *
 *     const bcrypt = require("bcryptjs");
 *
 *     const password = "myPassword123";
 *
 *     const hash = await bcrypt.hash(password, 12);
 *
 *
 * `12` is the cost factor / number of salt rounds.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Salt rounds
 * ============================================================
 *
 * bcrypt uses a configurable cost factor.
 *
 * Example:
 *
 *     bcrypt.hash(password, 12)
 *
 *
 * Higher cost:
 *
 *     More computational work
 *     More protection against brute-force attacks
 *     More CPU/time required
 *
 *
 * Lower cost:
 *
 *     Faster
 *     Less computational protection
 *
 *
 * The appropriate value should be benchmarked on your
 * production hardware and chosen according to your
 * application's requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Why two identical passwords produce different hashes
 * ============================================================
 *
 * bcrypt automatically uses a random salt.
 *
 *
 * Example:
 *
 *     Password:
 *
 *         hello123
 *
 *
 * First hash:
 *
 *     bcrypt → hash A
 *
 *
 * Second hash:
 *
 *     bcrypt → hash B
 *
 *
 * Even though the password is identical, the hashes can
 * be different because different random salts are used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. What is a salt?
 * ============================================================
 *
 * A salt is random data incorporated into password hashing.
 *
 *
 * Conceptually:
 *
 *     password + random salt
 *              │
 *              ▼
 *          bcrypt
 *              │
 *              ▼
 *          password hash
 *
 *
 * bcrypt stores the information necessary for verification
 * inside its encoded hash string.
 *
 * Therefore you normally do NOT need a separate salt column
 * when using bcrypt.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Verify a password
 * ============================================================
 *
 * During login:
 *
 *     const isValid = await bcrypt.compare(
 *       password,
 *       passwordHash
 *     );
 *
 *
 * Result:
 *
 *     true
 *
 * or:
 *
 *     false
 *
 *
 * You do NOT hash the login password yourself and compare
 * the two strings.
 *
 * Use:
 *
 *     bcrypt.compare()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Correct registration flow
 * ============================================================
 *
 *     Client
 *       │
 *       │ password
 *       ▼
 *     Backend
 *       │
 *       │ bcrypt.hash()
 *       ▼
 *     passwordHash
 *       │
 *       ▼
 *     Database
 *
 *
 * The plain password should not be stored.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Correct login flow
 * ============================================================
 *
 *     Client
 *       │
 *       │ password
 *       ▼
 *     Backend
 *       │
 *       ├── Find user
 *       │
 *       ├── Get passwordHash
 *       │
 *       └── bcrypt.compare()
 *                  │
 *             ┌────┴────┐
 *             │         │
 *           true      false
 *             │         │
 *          Login      Reject
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Never compare hashes manually
 * ============================================================
 *
 * DON'T do:
 *
 *     bcrypt.hash(password) === storedHash
 *
 *
 * Why?
 *
 * `bcrypt.hash()` generates a new salt and therefore can
 * generate a different hash each time.
 *
 *
 * Instead:
 *
 *     bcrypt.compare(password, storedHash)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Never return password hashes to the client
 * ============================================================
 *
 * Database:
 *
 *     {
 *       id: "...",
 *       email: "...",
 *       passwordHash: "..."
 *     }
 *
 *
 * API response should NOT be:
 *
 *     {
 *       id: "...",
 *       email: "...",
 *       passwordHash: "..."
 *     }
 *
 *
 * Return only information the client actually needs.
 *
 * Example:
 *
 *     {
 *       id: "...",
 *       email: "user@example.com"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Password requirements
 * ============================================================
 *
 * Password security also involves password policy.
 *
 * Consider:
 *
 *     - Minimum length
 *     - Maximum length
 *     - Common-password checks
 *     - Password breach checks where appropriate
 *     - Avoiding unnecessarily restrictive composition rules
 *
 *
 * Strong passwords/passphrases are generally preferable to
 * short passwords with arbitrary complexity requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Password validation
 * ============================================================
 *
 * Validation should happen before hashing.
 *
 *
 * Example:
 *
 *     const password = input.password;
 *
 *     if (!password || password.length < 8) {
 *       throw new Error("Invalid password");
 *     }
 *
 *
 * In a real application, use a validation library such as
 * Zod for structured request validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Never log passwords
 * ============================================================
 *
 * NEVER:
 *
 *     console.log(password);
 *
 *
 * NEVER:
 *
 *     logger.info({ password });
 *
 *
 * NEVER put passwords into:
 *
 *     - Logs
 *     - Error messages
 *     - Analytics
 *     - URLs
 *     - Query parameters
 *     - Git commits
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Never put passwords in URLs
 * ============================================================
 *
 * BAD:
 *
 *     /login?email=user@example.com&password=secret123
 *
 *
 * URLs can appear in:
 *
 *     - Browser history
 *     - Proxy logs
 *     - Server logs
 *     - Analytics
 *     - Monitoring systems
 *
 *
 * Send passwords in the request body over HTTPS.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. HTTPS is required
 * ============================================================
 *
 * Password hashing protects the password at rest.
 *
 * HTTPS protects credentials while they travel between
 * client and server.
 *
 *
 * These solve different problems.
 *
 *
 * Password:
 *
 *     Client
 *        │
 *        │ HTTPS
 *        ▼
 *     Server
 *        │
 *        │ bcrypt
 *        ▼
 *     Password hash
 *        │
 *        ▼
 *     Database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Password reset
 * ============================================================
 *
 * A password reset should NOT send the user's existing
 * password.
 *
 * Instead:
 *
 *     User requests reset
 *              │
 *              ▼
 *       Generate random token
 *              │
 *              ▼
 *        Send reset link
 *              │
 *              ▼
 *       User sets new password
 *              │
 *              ▼
 *       bcrypt.hash(newPassword)
 *              │
 *              ▼
 *          Database
 *
 *
 * Reset tokens should be:
 *
 *     - Random
 *     - High entropy
 *     - Short-lived
 *     - Single-use
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Account enumeration
 * ============================================================
 *
 * Authentication systems should avoid revealing whether
 * an account exists when possible.
 *
 *
 * Avoid responses such as:
 *
 *     "Email does not exist."
 *
 * or:
 *
 *     "Password is incorrect."
 *
 * depending on the situation.
 *
 *
 * A generic authentication failure can reduce information
 * available to attackers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Rate limiting
 * ============================================================
 *
 * Password hashing alone does not stop online brute-force
 * attacks.
 *
 *
 * Login endpoints should have appropriate protections such as:
 *
 *     - Rate limiting
 *     - Account-level throttling
 *     - IP/network controls
 *     - CAPTCHA/challenges where appropriate
 *     - Monitoring and alerting
 *
 *
 * We will study rate limiting later in:
 *
 *     25_security/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Password hashing architecture
 * ============================================================
 *
 *
 *             REGISTER
 *                 │
 *                 ▼
 *             Password
 *                 │
 *                 ▼
 *          bcrypt.hash()
 *                 │
 *                 ▼
 *          Password Hash
 *                 │
 *                 ▼
 *             Database
 *
 *
 *
 *              LOGIN
 *                 │
 *                 ▼
 *             Password
 *                 │
 *                 ▼
 *        bcrypt.compare()
 *                 ▲
 *                 │
 *          Password Hash
 *                 │
 *                 ▼
 *          true / false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Password security checklist
 * ============================================================
 *
 * [x] Never store plain-text passwords
 *
 * [x] Use a password-specific hashing algorithm
 *
 * [x] Use a unique salt
 *
 * [x] Use an appropriate cost factor
 *
 * [x] Use bcrypt.compare() during authentication
 *
 * [x] Never log passwords
 *
 * [x] Never put passwords in URLs
 *
 * [x] Use HTTPS
 *
 * [x] Don't return password hashes in API responses
 *
 * [x] Rate-limit authentication endpoints
 *
 * [x] Use secure password reset tokens
 *
 * [x] Invalidate/reset sessions appropriately after
 *     password changes
 *
 * ============================================================
 */

/*
 * ============================================================
 * Files we will study next
 * ============================================================
 *
 *     bcryptjs/
 *     │
 *     ├── hash.js
 *     │
 *     ├── compare.js
 *     │
 *     └── salt_rounds.js
 *
 *
 * Then:
 *
 *     password_security.js
 *
 * will serve as the overall conceptual reference.
 *
 * ============================================================
 */
