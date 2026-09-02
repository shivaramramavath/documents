/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 13_password_security/bcryptjs/salt_rounds.js
 *
 * Topic:
 * bcrypt Salt, Salt Rounds & Cost Factor
 *
 * ============================================================
 */

const bcrypt = require("bcryptjs");

/*
 * ============================================================
 * 1. What is a salt?
 * ============================================================
 *
 * A salt is random data used during password hashing.
 *
 *
 * Without a salt:
 *
 *     password
 *        │
 *        ▼
 *      hash
 *
 *
 * The same password would always produce the same hash.
 *
 *
 * With a salt:
 *
 *     password + random salt
 *              │
 *              ▼
 *           bcrypt
 *              │
 *              ▼
 *            hash
 *
 *
 * bcrypt automatically generates and incorporates a salt.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Why do we need a salt?
 * ============================================================
 *
 * Suppose two users have the same password:
 *
 *     User A → password123
 *     User B → password123
 *
 *
 * A properly salted password hashing scheme should produce
 * different stored hashes.
 *
 *
 * This prevents an attacker from immediately identifying
 * users who share the same password by simply comparing
 * stored hashes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. bcrypt automatically generates the salt
 * ============================================================
 *
 * You normally do NOT need to manually generate a salt.
 *
 *
 * This:
 *
 *     bcrypt.hash(password, saltRounds)
 *
 *
 * is enough.
 *
 *
 * bcrypt:
 *
 *     1. Generates a random salt
 *     2. Uses the salt during hashing
 *     3. Encodes the necessary salt information into the
 *        resulting bcrypt hash
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Salt rounds
 * ============================================================
 *
 * Example:
 *
 *     bcrypt.hash(password, 12)
 *
 *
 * The `12` is the bcrypt cost factor, commonly called
 * "salt rounds".
 *
 *
 * IMPORTANT:
 *
 * Salt and salt rounds are NOT the same thing.
 *
 *
 * Salt:
 *
 *     Random value used for the hash.
 *
 *
 * Salt rounds / cost factor:
 *
 *     Controls how much computational work bcrypt performs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Cost factor
 * ============================================================
 *
 * bcrypt's cost factor is exponential.
 *
 *
 * Conceptually:
 *
 *     cost = 10
 *         ↓
 *     approximately 2^10 work units
 *
 *
 *     cost = 11
 *         ↓
 *     approximately 2^11 work units
 *
 *
 *     cost = 12
 *         ↓
 *     approximately 2^12 work units
 *
 *
 * Increasing the cost by 1 approximately doubles the amount
 * of bcrypt work.
 *
 * The actual runtime depends on hardware, implementation,
 * system load, and other factors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Higher cost = slower hashing
 * ============================================================
 *
 *
 *       Cost
 *        │
 *        │
 *        │          /
 *        │        /
 *        │      /
 *        │    /
 *        │  /
 *        │/
 *        └──────────────────►
 *             Work
 *
 *
 * Higher cost means:
 *
 *     More CPU work
 *     More time per hash
 *
 *
 * This is intentional.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Why should password hashing be slow?
 * ============================================================
 *
 * Imagine an attacker has obtained a password database.
 *
 * They may try:
 *
 *     password
 *     password123
 *     qwerty
 *     123456
 *     ...
 *
 *
 * This is a password guessing attack.
 *
 *
 * A fast hash function makes testing huge numbers of guesses
 * easier.
 *
 *
 * bcrypt deliberately makes each password computation
 * relatively expensive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. But don't make it TOO slow
 * ============================================================
 *
 * Password hashing happens during registration and password
 * changes.
 *
 * Password verification happens during login.
 *
 *
 * If the cost is extremely high:
 *
 *     ┌──────────────────────────┐
 *     │ Every login consumes     │
 *     │ excessive CPU/time       │
 *     └──────────────────────────┘
 *
 *
 * This can hurt your application and can potentially make
 * CPU-exhaustion attacks easier.
 *
 *
 * Therefore:
 *
 *     Choose a cost that provides strong protection while
 *     keeping authentication responsive on your production
 *     infrastructure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Never blindly copy a recommended number
 * ============================================================
 *
 * You may see:
 *
 *     10
 *     12
 *     14
 *     15
 *
 * recommended in different tutorials.
 *
 *
 * Don't blindly choose one.
 *
 *
 * Benchmark on YOUR infrastructure.
 *
 *
 * Factors include:
 *
 *     - CPU
 *     - Server load
 *     - Number of login requests
 *     - Application latency requirements
 *     - Authentication architecture
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Generate two hashes
 * ============================================================
 *
 * Let's prove that the same password can generate different
 * hashes.
 *
 * ============================================================
 */

async function demonstrateSalt() {
  const password = "MyStrongPassword123!";

  const saltRounds = 12;

  const hash1 = await bcrypt.hash(password, saltRounds);

  const hash2 = await bcrypt.hash(password, saltRounds);

  console.log("Hash 1:");
  console.log(hash1);

  console.log("\nHash 2:");
  console.log(hash2);

  console.log("\nSame hash?", hash1 === hash2);
}

/*
 * Expected:
 *
 *     Same hash? false
 *
 *
 * Even though:
 *
 *     password === password
 *
 * the hashes are different because bcrypt uses different
 * random salts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Verify both hashes
 * ============================================================
 *
 * Different hashes do NOT mean that the password changed.
 *
 * Both should still verify against the original password.
 *
 * ============================================================
 */

async function demonstrateVerification() {
  const password = "MyStrongPassword123!";

  const saltRounds = 12;

  const hash1 = await bcrypt.hash(password, saltRounds);

  const hash2 = await bcrypt.hash(password, saltRounds);

  const result1 = await bcrypt.compare(password, hash1);

  const result2 = await bcrypt.compare(password, hash2);

  console.log("\nHash 1 valid:", result1);
  console.log("Hash 2 valid:", result2);
}

/*
 * Expected:
 *
 *     Hash 1 valid: true
 *     Hash 2 valid: true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Inspect bcrypt hash
 * ============================================================
 *
 * A bcrypt hash commonly looks similar to:
 *
 *     $2b$12$.................................................
 *
 *
 * It contains encoded information including:
 *
 *     - bcrypt version identifier
 *     - cost factor
 *     - salt
 *     - derived hash
 *
 *
 * The exact encoding is handled by bcrypt.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Extract the cost factor
 * ============================================================
 *
 * bcryptjs provides:
 *
 *     bcrypt.getRounds(hash)
 *
 *
 * Example:
 */

async function inspectRounds() {
  const password = "MyStrongPassword123!";

  const saltRounds = 12;

  const hash = await bcrypt.hash(password, saltRounds);

  const rounds = bcrypt.getRounds(hash);

  console.log("\nHash:");
  console.log(hash);

  console.log("\nConfigured rounds:", saltRounds);
  console.log("Rounds stored in hash:", rounds);
}

/*
 * ============================================================
 * 14. Benchmark different costs
 * ============================================================
 *
 * This example measures how long hashing takes at different
 * cost factors.
 *
 *
 * IMPORTANT:
 *
 * The numbers will vary depending on your computer.
 *
 * Don't use these results as universal benchmarks.
 *
 * ============================================================
 */

async function benchmark(rounds) {
  const password = "BenchmarkPassword123!";

  const start = process.hrtime.bigint();

  await bcrypt.hash(password, rounds);

  const end = process.hrtime.bigint();

  const elapsedMilliseconds = Number(end - start) / 1_000_000;

  return elapsedMilliseconds;
}

/*
 * ============================================================
 * 15. Run benchmark
 * ============================================================
 */

async function runBenchmark() {
  const roundsToTest = [8, 10, 12];

  console.log("\nPassword hashing benchmark");
  console.log("--------------------------------");

  for (const rounds of roundsToTest) {
    const milliseconds = await benchmark(rounds);

    console.log(`Rounds: ${rounds} → ${milliseconds.toFixed(2)} ms`);
  }
}

/*
 * ============================================================
 * 16. Why use process.hrtime.bigint()?
 * ============================================================
 *
 * Node.js provides:
 *
 *     process.hrtime.bigint()
 *
 *
 * It gives a high-resolution time value suitable for
 * measuring elapsed time.
 *
 *
 * We use it here to benchmark bcrypt hashing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Don't benchmark inside production login logic
 * ============================================================
 *
 * This:
 *
 *     process.hrtime.bigint()
 *
 * is for our learning benchmark.
 *
 *
 * A production application should simply perform the
 * password verification.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Example configuration
 * ============================================================
 *
 * In a real application, don't scatter:
 *
 *     bcrypt.hash(password, 12)
 *
 * throughout your entire codebase.
 *
 *
 * Prefer centralized configuration:
 *
 *     const BCRYPT_ROUNDS = 12;
 *
 *
 * Then:
 *
 *     bcrypt.hash(password, BCRYPT_ROUNDS);
 *
 *
 * Even better, the value can come from application
 * configuration/environment management where appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Password hashing service
 * ============================================================
 *
 * A production architecture could have:
 *
 *
 *     password.service.js
 *
 *
 *     async function hashPassword(password) {
 *       return bcrypt.hash(password, BCRYPT_ROUNDS);
 *     }
 *
 *
 *     async function verifyPassword(password, hash) {
 *       return bcrypt.compare(password, hash);
 *     }
 *
 *
 * This keeps bcrypt implementation details in one place.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Password security architecture
 * ============================================================
 *
 *
 *                REGISTER
 *                   │
 *                   ▼
 *                Password
 *                   │
 *                   ▼
 *              bcrypt.hash
 *                   │
 *          ┌────────┴────────┐
 *          │                 │
 *       Random salt       Cost factor
 *          │                 │
 *          └────────┬────────┘
 *                   ▼
 *             Password hash
 *                   │
 *                   ▼
 *               Database
 *
 *
 *
 *                 LOGIN
 *                   │
 *                   ▼
 *                Password
 *                   │
 *                   ▼
 *            bcrypt.compare
 *                   ▲
 *                   │
 *             Stored hash
 *                   │
 *                   ▼
 *              true / false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Salt vs salt rounds
 * ============================================================
 *
 * SALT:
 *
 *     Random value.
 *
 *     Purpose:
 *     Make identical passwords produce different hashes.
 *
 *
 * SALT ROUNDS / COST:
 *
 *     Computational cost parameter.
 *
 *     Purpose:
 *     Make password guessing more expensive.
 *
 *
 * They solve different problems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Common mistakes
 * ============================================================
 *
 * ❌ Manually creating a predictable salt.
 *
 * ❌ Using the same salt for every user.
 *
 * ❌ Storing plaintext passwords.
 *
 * ❌ Using plain SHA-256 as password storage.
 *
 * ❌ Comparing bcrypt hashes with `===`.
 *
 * ❌ Using bcrypt.hash() during login instead of
 *    bcrypt.compare().
 *
 * ❌ Choosing an extremely low cost without considering
 *    security.
 *
 * ❌ Choosing an extremely high cost without benchmarking.
 *
 * ❌ Logging passwords.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Execute demonstrations
 * ============================================================
 */

async function main() {
  await demonstrateSalt();

  await demonstrateVerification();

  await inspectRounds();

  await runBenchmark();
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exitCode = 1;
});

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. bcrypt automatically generates a random salt.
 *
 * 2. You normally don't need to manually manage the salt.
 *
 * 3. Salt makes identical passwords produce different hashes.
 *
 * 4. Salt rounds and salt are different concepts.
 *
 * 5. Salt rounds are the bcrypt cost factor.
 *
 * 6. Increasing the cost by one approximately doubles the
 *    computational work.
 *
 * 7. Higher cost makes password guessing more expensive.
 *
 * 8. Excessively high cost can hurt application performance.
 *
 * 9. Benchmark bcrypt on your actual infrastructure.
 *
 * 10. bcrypt hashes contain the information required to verify
 *     the password, including the cost and salt.
 *
 * 11. Use bcrypt.compare() for authentication.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 * ============================================================
 *
 *     node .\13_password_security\bcryptjs\salt_rounds.js
 *
 * ============================================================
 */
