/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 14_jwt/jwt_auth.js
 *
 * Topic:
 * JWT Authentication Middleware
 *
 * ============================================================
 *
 * Flow:
 *
 *     Client
 *       │
 *       │ Authorization: Bearer <token>
 *       ▼
 *     Express
 *       │
 *       ▼
 *     JWT Middleware
 *       │
 *       ▼
 *     jwt.verify()
 *       │
 *       ├── Invalid → 401
 *       │
 *       └── Valid
 *            │
 *            ▼
 *        req.user
 *            │
 *            ▼
 *       Protected Route
 *
 * ============================================================
 *
 * Install:
 *
 *     npm install express jsonwebtoken
 *
 * Run:
 *
 *     node .\14_jwt\jwt_auth.js
 *
 * ============================================================
 */

const express = require("express");
const jwt = require("jsonwebtoken");

/*
 * ============================================================
 * 1. Create Express application
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * 2. Middleware for JSON requests
 * ============================================================
 */

app.use(express.json());

/*
 * ============================================================
 * 3. JWT Secret
 * ============================================================
 *
 * Learning only.
 *
 * Production:
 *
 *     process.env.ACCESS_TOKEN_SECRET
 *
 * Never hard-code production secrets.
 *
 * ============================================================
 */

const JWT_SECRET = "access-secret-learning-only";

/*
 * ============================================================
 * 4. Create a demo user
 * ============================================================
 *
 * Normally this comes from MongoDB.
 *
 * ============================================================
 */

const user = {
  id: "user_123",
  email: "shiva@example.com",
  role: "user",
};

/*
 * ============================================================
 * 5. Login endpoint
 * ============================================================
 *
 * Normally login would:
 *
 *     1. Receive email/password
 *     2. Find user in database
 *     3. bcrypt.compare()
 *     4. Create access token
 *     5. Create refresh token
 *
 * For this learning example, we skip database/password
 * verification.
 *
 * ============================================================
 */

app.post("/login", (req, res) => {
  /*
   * Create access token.
   */

  const accessToken = jwt.sign(
    {
      /*
       * `sub` = user ID
       */
      sub: user.id,

      /*
       * Custom claim.
       */
      role: user.role,
    },

    JWT_SECRET,

    {
      expiresIn: "15m",

      issuer: "my-auth-service",

      audience: "my-api",
    },
  );

  res.json({
    message: "Login successful",

    accessToken,
  });
});

/*
 * ============================================================
 * 6. Extract Bearer token
 * ============================================================
 *
 * Client sends:
 *
 *
 * Authorization: Bearer eyJhbGciOi...
 *
 *
 * We need to extract:
 *
 *
 *     eyJhbGciOi...
 *
 * ============================================================
 */

function extractBearerToken(req) {
  const authorization = req.headers.authorization;

  /*
   * No Authorization header.
   */

  if (!authorization) {
    return null;
  }

  /*
   * Expected format:
   *
   *     Bearer <token>
   *
   */

  const [scheme, token] = authorization.split(" ");

  /*
   * Check scheme.
   *
   * HTTP authentication scheme names are case-insensitive,
   * so we normalize it here.
   */

  if (!scheme || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  /*
   * Make sure a token exists.
   */

  if (!token) {
    return null;
  }

  return token;
}

/*
 * ============================================================
 * 7. JWT Authentication Middleware
 * ============================================================
 *
 * This middleware:
 *
 *     1. Extracts token
 *     2. Verifies token
 *     3. Stores verified claims in req.user
 *     4. Calls next()
 *
 * ============================================================
 */

function authenticateJWT(req, res, next) {
  /*
   * Extract Bearer token.
   */

  const token = extractBearerToken(req);

  /*
   * No token.
   */

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  /*
   * Verify JWT.
   */

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      /*
       * Verify expected issuer.
       */
      issuer: "my-auth-service",

      /*
       * Verify expected audience.
       */
      audience: "my-api",

      /*
       * Restrict accepted algorithm.
       */
      algorithms: ["HS256"],
    });

    /*
     * ========================================================
     * IMPORTANT
     * ========================================================
     *
     * `decoded` is trusted only because jwt.verify()
     * successfully verified the token according to the
     * configured rules.
     *
     * ========================================================
     */

    req.user = decoded;

    /*
     * Continue to the next middleware/route.
     */

    next();
  } catch (error) {
    /*
     * Token is invalid, expired, malformed, etc.
     */

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

/*
 * ============================================================
 * 8. Public route
 * ============================================================
 *
 * This route does NOT require authentication.
 *
 * ============================================================
 */

app.get("/public", (req, res) => {
  res.json({
    message: "This is a public endpoint.",
  });
});

/*
 * ============================================================
 * 9. Protected route
 * ============================================================
 *
 * Middleware is placed BEFORE the controller.
 *
 *
 *     Request
 *        │
 *        ▼
 *     authenticateJWT
 *        │
 *        ▼
 *     /profile
 *
 * ============================================================
 */

app.get("/profile", authenticateJWT, (req, res) => {
  res.json({
    message: "Protected profile",

    /*
     * Information from verified JWT.
     */
    user: req.user,
  });
});

/*
 * ============================================================
 * 10. Another protected route
 * ============================================================
 */

app.get("/dashboard", authenticateJWT, (req, res) => {
  res.json({
    message: "Welcome to your dashboard",

    userId: req.user.sub,

    role: req.user.role,
  });
});

/*
 * ============================================================
 * 11. Authorization middleware
 * ============================================================
 *
 * Authentication:
 *
 *     "Who are you?"
 *
 *
 * Authorization:
 *
 *     "Are you allowed to perform this action?"
 *
 *
 * JWT middleware handles authentication.
 *
 * `requireRole()` can handle a simple authorization rule.
 *
 * ============================================================
 */

function requireRole(requiredRole) {
  return (req, res, next) => {
    /*
     * Authentication middleware should run first.
     */

    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    /*
     * Check role.
     */

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 12. Admin route
 * ============================================================
 *
 * Request flow:
 *
 *
 *     authenticateJWT
 *            │
 *            ▼
 *        req.user
 *            │
 *            ▼
 *       requireRole()
 *            │
 *       ┌────┴────┐
 *       ▼         ▼
 *     admin      user
 *       │         │
 *       ▼         ▼
 *     allow      403
 *
 * ============================================================
 */

app.get("/admin", authenticateJWT, requireRole("admin"), (req, res) => {
  res.json({
    message: "Welcome, administrator.",
  });
});

/*
 * ============================================================
 * 13. Permission middleware
 * ============================================================
 *
 * Roles are useful, but real applications often need
 * permissions.
 *
 *
 * Example:
 *
 *     timetable:read
 *     timetable:create
 *     timetable:update
 *     timetable:delete
 *
 * ============================================================
 */

function requirePermission(requiredPermission) {
  return (req, res, next) => {
    /*
     * Authentication check.
     */

    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    /*
     * Get permissions from JWT.
     *
     * If no permissions exist, use an empty array.
     */

    const permissions = Array.isArray(req.user.permissions)
      ? req.user.permissions
      : [];

    /*
     * Check permission.
     */

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: "Permission denied",
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 14. Permission-protected route
 * ============================================================
 */

app.get(
  "/timetable",
  authenticateJWT,
  requirePermission("timetable:read"),
  (req, res) => {
    res.json({
      message: "Timetable data",
    });
  },
);

/*
 * ============================================================
 * 15. Request flow
 * ============================================================
 *
 *
 * HTTP Request
 *      │
 *      ▼
 * Authorization Header
 *      │
 *      ▼
 * Extract Bearer Token
 *      │
 *      ▼
 * jwt.verify()
 *      │
 *      ├───────────────┐
 *      │               │
 *    invalid          valid
 *      │               │
 *      ▼               ▼
 *     401           req.user
 *                      │
 *                      ▼
 *                Authorization
 *                      │
 *                ┌─────┴─────┐
 *                │           │
 *              allowed     denied
 *                │           │
 *                ▼           ▼
 *            Controller      403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Why use `req.user`?
 * ============================================================
 *
 * After verification:
 *
 *     req.user = decoded;
 *
 *
 * Now every subsequent middleware/controller can access:
 *
 *
 *     req.user.sub
 *
 *     req.user.role
 *
 *     req.user.permissions
 *
 *
 * Example:
 */

app.get("/me", authenticateJWT, (req, res) => {
  res.json({
    userId: req.user.sub,
    role: req.user.role,
  });
});

/*
 * ============================================================
 * 17. NEVER do this
 * ============================================================
 *
 * DON'T:
 *
 *
 *     const user = jwt.decode(token);
 *
 *     req.user = user;
 *
 *
 * Why?
 *
 * Because `decode()` doesn't verify the signature.
 *
 *
 * Correct:
 *
 *
 *     const user = jwt.verify(
 *       token,
 *       secret,
 *       options,
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. 401 vs 403
 * ============================================================
 *
 *
 * 401 Unauthorized
 *
 *     Authentication failed/missing.
 *
 * Examples:
 *
 *     - No token
 *     - Invalid token
 *     - Expired token
 *
 *
 *
 * 403 Forbidden
 *
 *     Authentication succeeded but authorization failed.
 *
 * Example:
 *
 *     Valid user token
 *             │
 *             ▼
 *       Admin endpoint
 *             │
 *             ▼
 *            403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Bearer authentication
 * ============================================================
 *
 * Typical request:
 *
 *
 * GET /profile HTTP/1.1
 * Host: localhost:3000
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 *
 * Express:
 *
 *     req.headers.authorization
 *
 *
 * gives:
 *
 *     Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Token extraction
 * ============================================================
 *
 *
 * Authorization
 *       │
 *       ▼
 * "Bearer TOKEN"
 *       │
 *       ▼
 * split(" ")
 *       │
 *       ├── scheme
 *       │      └── Bearer
 *       │
 *       └── token
 *              └── JWT
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Middleware ordering
 * ============================================================
 *
 *
 * Correct:
 *
 *
 *     app.get(
 *       "/profile",
 *       authenticateJWT,
 *       controller,
 *     );
 *
 *
 *
 * Incorrect:
 *
 *
 *     app.get(
 *       "/profile",
 *       controller,
 *       authenticateJWT,
 *     );
 *
 *
 * The controller would execute before authentication.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Authentication middleware should be reusable
 * ============================================================
 *
 * Instead of duplicating:
 *
 *
 *     jwt.verify(...)
 *
 *
 * in every controller, create one middleware:
 *
 *
 *     authenticateJWT
 *
 *
 * Then:
 *
 *
 *     app.get(
 *       "/users",
 *       authenticateJWT,
 *       usersController,
 *     );
 *
 *
 *     app.post(
 *       "/timetable",
 *       authenticateJWT,
 *       createTimetableController,
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Protect an entire router
 * ============================================================
 *
 * Later with Express Router:
 *
 *
 *     router.use(authenticateJWT);
 *
 *
 * Then every route inside that router requires authentication.
 *
 *
 * Example architecture:
 *
 *
 *     /api
 *       │
 *       ├── public
 *       │
 *       └── protected
 *             │
 *             ├── users
 *             ├── timetable
 *             └── messages
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. JWT authentication architecture
 * ============================================================
 *
 *
 *                 AUTH SERVICE
 *                       │
 *                 Login/Register
 *                       │
 *                       ▼
 *                Access Token
 *                       │
 *                       ▼
 *                    CLIENT
 *                       │
 *              Authorization: Bearer
 *                       │
 *                       ▼
 *                    API
 *                       │
 *                       ▼
 *              authenticateJWT
 *                       │
 *                       ▼
 *                  jwt.verify
 *                       │
 *                  ┌────┴────┐
 *                  │         │
 *               invalid     valid
 *                  │         │
 *                  ▼         ▼
 *                 401     req.user
 *                            │
 *                            ▼
 *                       Authorization
 *                            │
 *                            ▼
 *                        Controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Production considerations
 * ============================================================
 *
 * A production authentication middleware may additionally
 * handle:
 *
 *     - issuer validation
 *     - audience validation
 *     - algorithm restrictions
 *     - expiration
 *     - key rotation
 *     - token revocation/session state
 *     - account status
 *     - tenant validation
 *     - permissions
 *     - rate limiting
 *     - secure cookies
 *     - CSRF protection where applicable
 *     - logging/security auditing
 *
 *
 * These will be covered in later sections of this repository.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Start server
 * ============================================================
 */

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  console.log("\nPublic endpoint:");

  console.log(`http://localhost:${PORT}/public`);

  console.log("\nLogin:");

  console.log(`POST http://localhost:${PORT}/login`);

  console.log("\nProtected endpoint:");

  console.log(`GET http://localhost:${PORT}/profile`);
});

/*
 * ============================================================
 * 27. Test with login
 * ============================================================
 *
 * First:
 *
 *     POST http://localhost:3000/login
 *
 *
 * Response:
 *
 *     {
 *       "message": "Login successful",
 *       "accessToken": "eyJ..."
 *     }
 *
 *
 * Copy the accessToken.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Test protected endpoint
 * ============================================================
 *
 * Send:
 *
 *
 * GET http://localhost:3000/profile
 *
 *
 * Header:
 *
 *
 * Authorization: Bearer YOUR_ACCESS_TOKEN
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Test without token
 * ============================================================
 *
 * Request:
 *
 *
 * GET /profile
 *
 *
 * Response:
 *
 *
 * 401
 *
 * {
 *   "error": "Authentication required"
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Test with invalid token
 * ============================================================
 *
 * Request:
 *
 *
 * Authorization: Bearer invalid-token
 *
 *
 * Response:
 *
 *
 * 401
 *
 * {
 *   "error": "Invalid or expired token"
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Test admin endpoint
 * ============================================================
 *
 * Our demo user has:
 *
 *     role: "user"
 *
 *
 * Therefore:
 *
 *
 * GET /admin
 *
 *
 * will return:
 *
 *
 * 403 Forbidden
 *
 *
 * because:
 *
 *
 *     user !== admin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Complete authentication pipeline
 * ============================================================
 *
 *
 *               REQUEST
 *                  │
 *                  ▼
 *          Authorization Header
 *                  │
 *                  ▼
 *         Extract Bearer Token
 *                  │
 *                  ▼
 *            jwt.verify()
 *                  │
 *          ┌───────┴───────┐
 *          │               │
 *       Invalid           Valid
 *          │               │
 *          ▼               ▼
 *         401          req.user
 *                          │
 *                          ▼
 *                  Authorization
 *                          │
 *                  ┌───────┴───────┐
 *                  │               │
 *               Allowed          Denied
 *                  │               │
 *                  ▼               ▼
 *              Controller         403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Key Takeaways
 * ============================================================
 *
 * 1. JWT authentication is commonly implemented as middleware.
 *
 * 2. Clients commonly send JWTs using:
 *
 *        Authorization: Bearer <token>
 *
 * 3. The server extracts the token.
 *
 * 4. `jwt.verify()` validates it.
 *
 * 5. Verified claims can be attached to `req.user`.
 *
 * 6. Protected routes use the middleware.
 *
 * 7. Missing/invalid authentication commonly results in 401.
 *
 * 8. Authenticated but unauthorized requests commonly result
 *    in 403.
 *
 * 9. Authentication and authorization are different.
 *
 * 10. `jwt.decode()` must not be used to authenticate users.
 *
 * 11. Issuer, audience, and algorithm restrictions can make
 *     verification more explicit.
 *
 * 12. Production authentication usually needs additional
 *     session/refresh-token/security mechanisms.
 *
 * ============================================================
 */
