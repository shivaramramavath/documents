/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 13_password_security/bcryptjs/hash.js
 *
 * Topic:
 * Password Hashing with bcryptjs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Install bcryptjs
 * ============================================================
 *
 * From the project root:
 *
 *     npm install bcryptjs
 *
 *
 * Verify:
 *
 *     npm list bcryptjs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Import bcryptjs
 * ============================================================
 *
 * Because this project currently uses CommonJS:
 *
 *     require()
 *
 * is used.
 *
 * ============================================================
 */

const bcrypt = require("bcryptjs");

/*
 * ============================================================
 * 3. Password
 * ============================================================
 *
 * In a real application, this password would come from a
 * registration request.
 *
 * Example:
 *
 *     const password = req.body.password;
 *
 *
 * NEVER log real user passwords in production.
 *
 * This example uses a fake password for learning.
 *
 * ============================================================
 */

const password = "MyStrongPassword123!";

/*
 * ============================================================
 * 4. Salt rounds
 * ============================================================
 *
 * bcrypt uses a cost factor commonly called "salt rounds".
 *
 * Higher values require more computation.
 *
 * The appropriate value should be benchmarked for your
 * application and infrastructure.
 *
 * ============================================================
 */

const saltRounds = 12;

/*
 * ============================================================
 * 5. Hash the password
 * ============================================================
 *
 * bcrypt.hash() is asynchronous.
 *
 *
 * Syntax:
 *
 *     bcrypt.hash(password, saltRounds)
 *
 *
 * It returns a Promise.
 *
 * ============================================================
 */

async function hashPassword() {
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    /*
     * ========================================================
     * 6. Password vs Password Hash
     * ========================================================
     *
     * Original password:
     *
     *     MyStrongPassword123!
     *
     *
     * Hash:
     *
     *     A completely different encoded string.
     *
     * The database should store the hash, not the original
     * password.
     *
     * ========================================================
     */

    console.log("Password:", password);
    console.log("Password hash:", passwordHash);

    /*
     * ========================================================
     * 7. Hash length
     * ========================================================
     */

    console.log("Hash length:", passwordHash.length);

    /*
     * ========================================================
     * 8. Hashing the same password again
     * ========================================================
     *
     * bcrypt generates a random salt.
     *
     * Therefore, hashing the same password multiple times
     * can produce different hashes.
     *
     * ========================================================
     */

    const secondHash = await bcrypt.hash(password, saltRounds);

    console.log("Second hash:", secondHash);

    /*
     * These should normally be different:
     *
     *     passwordHash !== secondHash
     *
     */

    console.log("Are the hashes identical?", passwordHash === secondHash);

    /*
     * ========================================================
     * 9. Why are they different?
     * ========================================================
     *
     * Conceptually:
     *
     *
     *     Password
     *        │
     *        ├──────── Random Salt A
     *        │
     *        ▼
     *      bcrypt
     *        │
     *        ▼
     *      Hash A
     *
     *
     *     Password
     *        │
     *        ├──────── Random Salt B
     *        │
     *        ▼
     *      bcrypt
     *        │
     *        ▼
     *      Hash B
     *
     *
     * Same password.
     * Different random salt.
     * Different resulting hash.
     *
     * ========================================================
     */

    /*
     * ========================================================
     * 10. Hash format
     * ========================================================
     *
     * A bcrypt hash commonly looks similar to:
     *
     *     $2b$12$.............................................
     *
     *
     * The encoded value contains information needed by bcrypt
     * to verify the password, including the cost factor and
     * salt.
     *
     * Therefore, you normally store the complete bcrypt hash.
     *
     * ========================================================
     */

    console.log("Hash:", passwordHash);

    /*
     * ========================================================
     * 11. Store only the hash
     * ========================================================
     *
     * In a real database:
     *
     *     {
     *       email: "user@example.com",
     *       passwordHash: passwordHash
     *     }
     *
     *
     * NOT:
     *
     *     {
     *       email: "user@example.com",
     *       password: password
     *     }
     *
     * ========================================================
     */

    /*
     * ========================================================
     * 12. Hashing is one-way
     * ========================================================
     *
     * You cannot normally take:
     *
     *     passwordHash
     *
     * and simply "decrypt" it to obtain:
     *
     *     password
     *
     *
     * Password hashing is intentionally designed for
     * verification rather than recovering the original
     * password.
     *
     * ========================================================
     */

    /*
     * ========================================================
     * 13. IMPORTANT: Don't hash the login password and compare
     * ========================================================
     *
     * DON'T do:
     *
     *     const newHash = await bcrypt.hash(password, 12);
     *
     *     newHash === storedHash
     *
     *
     * This can fail because bcrypt uses a new random salt.
     *
     *
     * Instead use:
     *
     *     bcrypt.compare(password, storedHash)
     *
     *
     * We will implement that in:
     *
     *     compare.js
     *
     * ========================================================
     */
  } catch (error) {
    console.error(error);
  }
}

/*
 * ============================================================
 * 14. Execute
 * ============================================================
 */

hashPassword();

/*
 * ============================================================
 * 15. Error handling
 * ============================================================
 *
 * bcrypt.hash() can reject its Promise.
 *
 * That's why the function uses:
 *
 *     try {
 *         ...
 *     } catch (error) {
 *         ...
 *     }
 *
 *
 * In production applications, errors should be handled using
 * your application's centralized error-handling strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Alternative: callback API
 * ============================================================
 *
 * bcryptjs also supports callbacks.
 *
 * Example:
 *
 *     bcrypt.hash(password, saltRounds, (error, hash) => {
 *
 *       if (error) {
 *         console.error(error);
 *         return;
 *       }
 *
 *       console.log(hash);
 *     });
 *
 *
 * However, modern Node.js applications commonly prefer the
 * Promise/async-await style when the library supports it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. bcryptjs is used to hash passwords.
 *
 * 2. Passwords should never be stored as plain text.
 *
 * 3. bcrypt.hash() returns a Promise when used without a
 *    callback.
 *
 * 4. bcrypt uses a random salt.
 *
 * 5. The same password can produce different hashes.
 *
 * 6. Store the complete bcrypt hash in the database.
 *
 * 7. Do not attempt to decrypt password hashes.
 *
 * 8. Do not generate a new hash during login and compare
 *    strings manually.
 *
 * 9. Use bcrypt.compare() to verify passwords.
 *
 * 10. Salt rounds control bcrypt's computational cost.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\13_password_security\bcryptjs\hash.js
 *
 * ============================================================
 */
