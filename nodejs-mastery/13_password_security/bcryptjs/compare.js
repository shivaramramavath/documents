/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 13_password_security/bcryptjs/compare.js
 *
 * Topic:
 * Comparing / Verifying Passwords with bcryptjs
 *
 * ============================================================
 */

const bcrypt = require("bcryptjs");

/*
 * ============================================================
 * 1. Registration
 * ============================================================
 *
 * Imagine the user registered with this password:
 *
 *     MyStrongPassword123!
 *
 * During registration, we hash the password.
 *
 * ============================================================
 */

const originalPassword = "MyStrongPassword123!";

const saltRounds = 12;

/*
 * ============================================================
 * 2. Create a stored password hash
 * ============================================================
 *
 * In a real application, this happens during registration
 * and the resulting hash is stored in the database.
 *
 * ============================================================
 */

async function createStoredHash() {
  const passwordHash = await bcrypt.hash(originalPassword, saltRounds);

  return passwordHash;
}

/*
 * ============================================================
 * 3. Login password verification
 * ============================================================
 *
 * During login, the user enters a password again.
 *
 * Example:
 *
 *     const loginPassword = req.body.password;
 *
 *
 * We compare the entered password against the stored hash.
 *
 * ============================================================
 */

async function verifyPassword(loginPassword, storedHash) {
  const isPasswordCorrect = await bcrypt.compare(loginPassword, storedHash);

  return isPasswordCorrect;
}

/*
 * ============================================================
 * 4. Complete example
 * ============================================================
 */

async function main() {
  /*
   * ----------------------------------------------------------
   * Registration
   * ----------------------------------------------------------
   */

  const storedHash = await createStoredHash();

  console.log("Stored hash:");
  console.log(storedHash);

  /*
   * ----------------------------------------------------------
   * Correct login password
   * ----------------------------------------------------------
   */

  const correctPassword = "MyStrongPassword123!";

  const correctResult = await verifyPassword(correctPassword, storedHash);

  console.log("Correct password:", correctResult);

  /*
   * Expected:
   *
   *     true
   *
   */

  /*
   * ----------------------------------------------------------
   * Incorrect login password
   * ----------------------------------------------------------
   */

  const incorrectPassword = "WrongPassword123!";

  const incorrectResult = await verifyPassword(incorrectPassword, storedHash);

  console.log("Incorrect password:", incorrectResult);

  /*
   * Expected:
   *
   *     false
   *
   */
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exitCode = 1;
});

/*
 * ============================================================
 * 5. Why bcrypt.compare()?
 * ============================================================
 *
 * You might wonder:
 *
 *     "Why don't we just hash the login password again?"
 *
 *
 * Because bcrypt uses a random salt.
 *
 *
 * Example:
 *
 *     Password
 *        │
 *        ▼
 *     bcrypt.hash()
 *        │
 *        ▼
 *     Hash A
 *
 *
 * Login:
 *
 *     Same Password
 *        │
 *        ▼
 *     bcrypt.hash()
 *        │
 *        ▼
 *     Hash B
 *
 *
 * Hash A and Hash B can be different.
 *
 *
 * Therefore:
 *
 *     Hash A === Hash B
 *
 * is NOT the correct verification method.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. What bcrypt.compare() does
 * ============================================================
 *
 * Conceptually:
 *
 *
 *     Login password
 *           │
 *           │
 *           ▼
 *     bcrypt.compare()
 *           ▲
 *           │
 *           │
 *     Stored bcrypt hash
 *           │
 *           ▼
 *      true / false
 *
 *
 * bcrypt extracts the necessary information from the stored
 * hash and performs the appropriate verification.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Real registration flow
 * ============================================================
 *
 *
 * POST /register
 *        │
 *        ▼
 *   Request body
 *        │
 *        ├── email
 *        └── password
 *               │
 *               ▼
 *        bcrypt.hash()
 *               │
 *               ▼
 *        passwordHash
 *               │
 *               ▼
 *           Database
 *
 *
 * Database:
 *
 *     {
 *       email: "user@example.com",
 *       passwordHash: "$2b$12$..."
 *     }
 *
 *
 * Notice:
 *
 *     passwordHash
 *
 * is stored.
 *
 * The original password is not.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Real login flow
 * ============================================================
 *
 *
 * POST /login
 *        │
 *        ▼
 *   Request body
 *        │
 *        ├── email
 *        └── password
 *               │
 *               ▼
 *         Find user
 *               │
 *               ▼
 *       passwordHash
 *               │
 *               ▼
 *      bcrypt.compare()
 *               │
 *          ┌────┴────┐
 *          │         │
 *        true       false
 *          │         │
 *          ▼         ▼
 *        Login     Reject
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Do NOT expose which part failed
 * ============================================================
 *
 * Avoid responses such as:
 *
 *     "Email does not exist"
 *
 * or:
 *
 *     "Password is incorrect"
 *
 * depending on the exact failure.
 *
 *
 * A generic authentication failure can reduce account
 * enumeration information.
 *
 * Example:
 *
 *     "Invalid email or password."
 *
 *
 * We will implement complete authentication later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. bcrypt.compare() returns a boolean
 * ============================================================
 *
 * Correct:
 *
 *     const valid = await bcrypt.compare(
 *       password,
 *       passwordHash,
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
 * ============================================================
 */

/*
 * ============================================================
 * 11. Never compare password hashes with ===
 * ============================================================
 *
 * WRONG:
 *
 *     const hash = await bcrypt.hash(password, 12);
 *
 *     if (hash === storedHash) {
 *       // ...
 *     }
 *
 *
 * Correct:
 *
 *     const valid = await bcrypt.compare(
 *       password,
 *       storedHash,
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Never decrypt a bcrypt hash
 * ============================================================
 *
 * bcrypt hashes are not intended to be decrypted.
 *
 *
 * The authentication process is:
 *
 *     Password
 *        │
 *        ▼
 *     compare
 *        │
 *        ▼
 *     Stored Hash
 *
 *
 * Result:
 *
 *     true / false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Never log user passwords
 * ============================================================
 *
 * Don't do:
 *
 *     console.log(loginPassword);
 *
 *
 * Don't do:
 *
 *     logger.info({
 *       password: loginPassword,
 *     });
 *
 *
 * Passwords are sensitive credentials.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Don't return the password hash
 * ============================================================
 *
 * Bad API response:
 *
 *     {
 *       "id": "123",
 *       "email": "user@example.com",
 *       "passwordHash": "$2b$12$..."
 *     }
 *
 *
 * Better:
 *
 *     {
 *       "id": "123",
 *       "email": "user@example.com"
 *     }
 *
 *
 * Password hashes should be treated as sensitive data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Password verification in a service
 * ============================================================
 *
 * In a real backend, you might have:
 *
 *
 *     auth.service.js
 *
 *
 *     async function login(email, password) {
 *
 *       const user = await userRepository.findByEmail(email);
 *
 *       if (!user) {
 *         throw new AuthenticationError(
 *           "Invalid email or password",
 *         );
 *       }
 *
 *       const valid = await bcrypt.compare(
 *         password,
 *         user.passwordHash,
 *       );
 *
 *       if (!valid) {
 *         throw new AuthenticationError(
 *           "Invalid email or password",
 *         );
 *       }
 *
 *       // Create authentication session/token...
 *     }
 *
 *
 * We will build this properly in the authentication section.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. Use bcrypt.hash() when creating a password hash.
 *
 * 2. Store the resulting hash in the database.
 *
 * 3. Never store the original password.
 *
 * 4. Use bcrypt.compare() during login.
 *
 * 5. bcrypt.compare() returns true or false.
 *
 * 6. Don't hash the login password and compare hash strings.
 *
 * 7. bcrypt hashes contain the information required for
 *    verification.
 *
 * 8. Never log passwords.
 *
 * 9. Never return password hashes unnecessarily.
 *
 * 10. Use generic authentication failure messages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\13_password_security\bcryptjs\compare.js
 *
 * ============================================================
 */
