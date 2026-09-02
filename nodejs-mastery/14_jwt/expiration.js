/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/expiration.js
 *
 * Topic:
 * JWT Expiration, `exp`, `expiresIn` and `nbf`
 *
 * ============================================================
 *
 * Install:
 *
 *     npm install jsonwebtoken
 *
 * Run:
 *
 *     node .\14_jwt\expiration.js
 *
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 1. JWT secret
 * ============================================================
 *
 * Learning only.
 *
 * In production:
 *
 *     process.env.JWT_SECRET
 *
 * Never commit a real secret to GitHub.
 *
 * ============================================================
 */

const JWT_SECRET = "my-super-secret-key-for-learning";

/*
 * ============================================================
 * 2. Basic payload
 * ============================================================
 */

const payload = {
  sub: "user_123",
  role: "user",
};

/*
 * ============================================================
 * 3. What is token expiration?
 * ============================================================
 *
 * A JWT can have a limited lifetime.
 *
 *
 * Example:
 *
 *     Token created
 *          │
 *          ▼
 *       Valid
 *          │
 *          │ 15 minutes
 *          ▼
 *       Expired
 *
 *
 * After expiration, jwt.verify() should reject the token.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. `expiresIn`
 * ============================================================
 *
 * jsonwebtoken provides:
 *
 *     expiresIn
 *
 *
 * Example:
 *
 *     expiresIn: "15m"
 *
 *
 * This tells jsonwebtoken to calculate an `exp` claim for
 * the token.
 *
 * ============================================================
 */

const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "15m",
});

console.log("JWT:");
console.log(token);

/*
 * ============================================================
 * 5. Inspect expiration
 * ============================================================
 *
 * Decode only for demonstration/inspection.
 *
 * Remember:
 *
 *     decode() does NOT verify the token.
 *
 * ============================================================
 */

const decoded = jwt.decode(token);

console.log("\nDecoded payload:");
console.log(decoded);

/*
 * You should see claims similar to:
 *
 *     {
 *       sub: "user_123",
 *       role: "user",
 *       iat: ........................,
 *       exp: ........................
 *     }
 *
 *
 * `iat`
 *
 *     Issued At
 *
 *
 * `exp`
 *
 *     Expiration Time
 *
 *
 * Both are NumericDate values.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. NumericDate
 * ============================================================
 *
 * JWT time claims such as:
 *
 *     iat
 *     exp
 *     nbf
 *
 * are represented as NumericDate values.
 *
 *
 * They represent a Unix timestamp in seconds.
 *
 *
 * Example:
 *
 *     1760000000
 *
 *
 * NOT milliseconds.
 *
 *
 * JavaScript Date.now():
 *
 *     milliseconds
 *
 *
 * JWT NumericDate:
 *
 *     seconds
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Convert `exp` to JavaScript Date
 * ============================================================
 */

if (decoded && typeof decoded === "object" && "exp" in decoded) {
  const expirationDate = new Date(decoded.exp * 1000);

  console.log("\nExpiration date:");
  console.log(expirationDate);
}

/*
 * ============================================================
 * 8. Convert `iat` to JavaScript Date
 * ============================================================
 */

if (decoded && typeof decoded === "object" && "iat" in decoded) {
  const issuedAtDate = new Date(decoded.iat * 1000);

  console.log("\nIssued-at date:");
  console.log(issuedAtDate);
}

/*
 * ============================================================
 * 9. Verify a valid token
 * ============================================================
 */

try {
  const verified = jwt.verify(token, JWT_SECRET);

  console.log("\nToken is valid.");
  console.log(verified);
} catch (error) {
  console.error("\nToken verification failed:", error.message);
}

/*
 * ============================================================
 * 10. Short expiration for demonstration
 * ============================================================
 *
 * We can create a token that is already expired by setting
 * `expiresIn` to a negative value.
 *
 * This is useful for learning how expiration errors behave.
 *
 * ============================================================
 */

const expiredToken = jwt.sign(payload, JWT_SECRET, {
  expiresIn: -1,
});

console.log("\nExpired JWT:");
console.log(expiredToken);

/*
 * ============================================================
 * 11. Verify expired token
 * ============================================================
 */

try {
  jwt.verify(expiredToken, JWT_SECRET);

  console.log("Expired token accepted.");
} catch (error) {
  console.log("\nExpired token rejected:", error.message);

  console.log("Error name:", error.name);
}

/*
 * Expected:
 *
 *     jwt expired
 *
 *     Error name:
 *     TokenExpiredError
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Handle TokenExpiredError
 * ============================================================
 */

try {
  jwt.verify(expiredToken, JWT_SECRET);
} catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    console.log("\nHandling expired token:", "TokenExpiredError");
  } else if (error instanceof jwt.JsonWebTokenError) {
    console.log("\nHandling invalid JWT:", "JsonWebTokenError");
  } else {
    console.log("\nUnknown JWT error:", error.message);
  }
}

/*
 * ============================================================
 * 13. `nbf` - Not Before
 * ============================================================
 *
 * `nbf` tells the verifier:
 *
 *     "Do not accept this token before this time."
 *
 *
 * We can create one using:
 *
 *     notBefore
 *
 * ============================================================
 */

const futureToken = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "15m",

  /*
   * Token becomes valid after 60 seconds.
   */

  notBefore: "60s",
});

console.log("\nFuture-valid JWT:");
console.log(futureToken);

/*
 * ============================================================
 * 14. Verify token before `nbf`
 * ============================================================
 */

try {
  jwt.verify(futureToken, JWT_SECRET);

  console.log("Future token accepted.");
} catch (error) {
  console.log("\nFuture token rejected:", error.message);

  console.log("Error name:", error.name);
}

/*
 * Expected:
 *
 *     jwt not active
 *
 *     Error name:
 *     NotBeforeError
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. `exp` vs `nbf`
 * ============================================================
 *
 *
 * `nbf`
 *
 *     Token is NOT valid before this time.
 *
 *
 *        nbf
 *         │
 *         ▼
 *     ────────────────►
 *       valid period
 *
 *
 *
 * `exp`
 *
 *     Token is NOT valid after this time.
 *
 *
 *     valid period
 *       │
 *       ▼
 *     ──────────────── exp
 *
 *
 * Together:
 *
 *
 *          nbf                     exp
 *           │                       │
 *           ▼                       ▼
 *     ──────███████████████████████──────
 *           Valid token period
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. `expiresIn` examples
 * ============================================================
 *
 * jsonwebtoken accepts convenient time strings.
 *
 *
 * Examples:
 *
 *     "30s"
 *     "5m"
 *     "15m"
 *     "1h"
 *     "7d"
 *
 *
 * Example:
 *
 *     expiresIn: "15m"
 *
 *
 * means:
 *
 *     token lifetime ≈ 15 minutes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Numeric expiration
 * ============================================================
 *
 * You can also specify a numeric value.
 *
 *
 * IMPORTANT:
 *
 * Be careful with units.
 *
 * jsonwebtoken's numeric `expiresIn` value is interpreted as
 * seconds.
 *
 *
 * Example:
 *
 *     expiresIn: 900
 *
 *
 * means approximately:
 *
 *     900 seconds
 *
 *     = 15 minutes
 *
 * ============================================================
 */

const fifteenMinuteToken = jwt.sign(payload, JWT_SECRET, {
  expiresIn: 900,
});

console.log("\n15-minute token created using seconds:");
console.log(fifteenMinuteToken);

/*
 * ============================================================
 * 18. Why short-lived access tokens?
 * ============================================================
 *
 * Imagine an access token is stolen.
 *
 *
 * If it lasts:
 *
 *     30 days
 *
 * the attacker may have a long period in which the token can
 * potentially be used.
 *
 *
 * If it lasts:
 *
 *     15 minutes
 *
 * the exposure window is much shorter.
 *
 *
 * This is one reason authentication systems commonly use
 * short-lived access tokens.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Access token + refresh token
 * ============================================================
 *
 *
 *                    LOGIN
 *                      │
 *                      ▼
 *             ┌─────────────────┐
 *             │ Authentication  │
 *             │    succeeds     │
 *             └────────┬────────┘
 *                      │
 *             ┌────────┴────────┐
 *             ▼                 ▼
 *       Access Token       Refresh Token
 *       short lifetime      longer lifetime
 *             │                 │
 *             ▼                 ▼
 *          API calls       Get new access
 *
 *
 * We'll implement refresh-token concepts in:
 *
 *     refresh_token.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Do NOT simply make access tokens extremely long-lived
 * ============================================================
 *
 * Bad approach:
 *
 *     expiresIn: "30d"
 *
 * for every access token without a deliberate security design.
 *
 *
 * Longer lifetime can increase the impact of token theft.
 *
 *
 * Better architecture:
 *
 *     short-lived access token
 *
 *             +
 *
 *     properly managed refresh mechanism
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Clock skew
 * ============================================================
 *
 * Different systems can have slightly different clocks.
 *
 *
 * Example:
 *
 *
 * Server A
 *     10:00:00
 *
 *
 * Server B
 *     10:00:03
 *
 *
 * A token close to its expiration boundary can be affected by
 * small clock differences.
 *
 *
 * Verification libraries can provide mechanisms such as
 * `clockTolerance` when your architecture requires it.
 *
 *
 * Example:
 */

try {
  jwt.verify(token, JWT_SECRET, {
    clockTolerance: 5,
  });

  console.log("\nToken verified with 5-second clock tolerance.");
} catch (error) {
  console.log("\nVerification failed:", error.message);
}

/*
 * ============================================================
 * 22. Maximum token age
 * ============================================================
 *
 * Verification can also impose a maximum token age using
 * `maxAge`.
 *
 *
 * Example:
 *
 *     jwt.verify(
 *       token,
 *       JWT_SECRET,
 *       {
 *         maxAge: "15m"
 *       }
 *     );
 *
 *
 * This is different from simply reading the payload.
 *
 * The server actually applies the verification rule.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Example maxAge
 * ============================================================
 */

try {
  const verified = jwt.verify(token, JWT_SECRET, {
    maxAge: "15m",
  });

  console.log("\nmaxAge verification succeeded:", verified.sub);
} catch (error) {
  console.log("\nmaxAge verification failed:", error.message);
}

/*
 * ============================================================
 * 24. Important distinction
 * ============================================================
 *
 *
 * `expiresIn`
 *
 *     Used when CREATING the JWT.
 *
 *
 *     jwt.sign(
 *       payload,
 *       secret,
 *       { expiresIn: "15m" }
 *     );
 *
 *
 *
 * `maxAge`
 *
 *     Used during VERIFICATION to impose a maximum age.
 *
 *
 *     jwt.verify(
 *       token,
 *       secret,
 *       { maxAge: "15m" }
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Never manually trust `exp`
 * ============================================================
 *
 * DON'T do:
 *
 *
 *     const payload = jwt.decode(token);
 *
 *     if (payload.exp > Date.now()) {
 *       allowAccess();
 *     }
 *
 *
 * Problems include:
 *
 *     - decode() doesn't verify signature
 *     - incorrect time units are easy to introduce
 *     - expiration checking is part of a broader verification
 *       process
 *
 *
 * Use:
 *
 *     jwt.verify()
 *
 * with appropriate options.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Authentication middleware concept
 * ============================================================
 *
 *
 * Request
 *    │
 *    ▼
 * Authorization header
 *    │
 *    ▼
 * Extract Bearer token
 *    │
 *    ▼
 * jwt.verify()
 *    │
 *    ├── Expired ────────► 401
 *    │
 *    ├── Invalid ────────► 401
 *    │
 *    └── Valid
 *          │
 *          ▼
 *      req.user
 *          │
 *          ▼
 *       Controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Recommended mental model
 * ============================================================
 *
 *
 * Access Token
 *     │
 *     ├── short lifetime
 *     │
 *     ├── signed
 *     │
 *     ├── verified on protected requests
 *     │
 *     └── contains minimal claims
 *
 *
 * Refresh Token
 *     │
 *     ├── longer lifetime
 *     │
 *     ├── stronger storage/rotation strategy
 *     │
 *     └── used to obtain new access tokens
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Key Takeaways
 * ============================================================
 *
 * 1. `exp` represents expiration time.
 *
 * 2. `expiresIn` can create an `exp` claim automatically.
 *
 * 3. JWT time claims use NumericDate values in seconds.
 *
 * 4. `nbf` means "not valid before".
 *
 * 5. Expired tokens should be rejected by verification.
 *
 * 6. jsonwebtoken throws TokenExpiredError for expired tokens.
 *
 * 7. jsonwebtoken throws NotBeforeError when a token is not
 *    active yet.
 *
 * 8. Short-lived access tokens reduce the useful lifetime of
 *    a stolen token.
 *
 * 9. Refresh tokens can be used to obtain new access tokens.
 *
 * 10. `decode()` should not be used as authentication.
 *
 * 11. Use `jwt.verify()` to validate JWTs.
 *
 * 12. `expiresIn` is primarily a signing-time option.
 *
 * 13. `maxAge` can be used as a verification-time constraint.
 *
 * ============================================================
 */
