/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/crud/read.js
 *
 * Topic:
 *     REST API - READ
 *
 * ============================================================
 *
 * CRUD
 * ============================================================
 *
 * C - Create  → POST
 * R - Read    → GET
 * U - Update  → PUT / PATCH
 * D - Delete  → DELETE
 *
 *
 * READ operations generally use:
 *
 *     GET /users
 *     GET /users/:id
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * ============================================================
 * SAMPLE DATA
 * ============================================================
 *
 * In a real application this data would come from a database.
 *
 * Example:
 *
 *     MongoDB
 *     PostgreSQL
 *     MySQL
 *     Redis
 *
 * ============================================================
 */

const users = [
  {
    id: "1",
    name: "Shiva",
    email: "shiva@example.com",
    role: "student",
  },

  {
    id: "2",
    name: "Ravi",
    email: "ravi@example.com",
    role: "student",
  },

  {
    id: "3",
    name: "Priya",
    email: "priya@example.com",
    role: "teacher",
  },
];

/*
 * ============================================================
 * 1. GET ALL USERS
 * ============================================================
 *
 * HTTP:
 *
 *     GET /users
 *
 *
 * Response:
 *
 *     200 OK
 *
 *     {
 *       "data": [...]
 *     }
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  return res.status(200).json({
    data: users,
  });
});

/*
 * ============================================================
 * 2. GET USER BY ID
 * ============================================================
 *
 * HTTP:
 *
 *     GET /users/1
 *
 *
 * Route:
 *
 *     /users/:id
 *
 *
 * Parameter:
 *
 *     req.params.id
 *
 * ============================================================
 */

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  /*
   * Find user.
   */

  const user = users.find((user) => user.id === id);

  /*
   * ========================================================
   * USER NOT FOUND
   * ========================================================
   *
   * 404 means the requested resource could not be found.
   * ========================================================
   */

  if (!user) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  /*
   * Return user.
   */

  return res.status(200).json({
    data: user,
  });
});

/*
 * ============================================================
 * 3. GET USER WITH QUERY PARAMETERS
 * ============================================================
 *
 * Request:
 *
 *     GET /users?role=student
 *
 *
 * Query:
 *
 *     req.query.role
 *
 * ============================================================
 */

app.get("/search/users", (req, res) => {
  const { role } = req.query;

  let result = users;

  if (typeof role === "string" && role.length > 0) {
    result = users.filter((user) => user.role === role);
  }

  return res.json({
    data: result,
  });
});

/*
 * ============================================================
 * 4. SEARCH BY NAME
 * ============================================================
 *
 * Request:
 *
 *     GET /search/users?name=shiva
 *
 * ============================================================
 */

app.get("/search", (req, res) => {
  const { name } = req.query;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: {
        code: "INVALID_SEARCH",

        message: "Search name is required",
      },
    });
  }

  const searchTerm = name.trim().toLowerCase();

  const result = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm),
  );

  return res.json({
    data: result,
  });
});

/*
 * ============================================================
 * 5. RESOURCE VS COLLECTION
 * ============================================================
 *
 *
 * COLLECTION
 * ────────────────────────────────────────
 *
 * GET /users
 *
 * Means:
 *
 *     "Give me the users collection."
 *
 *
 *
 * RESOURCE
 * ────────────────────────────────────────
 *
 * GET /users/123
 *
 * Means:
 *
 *     "Give me the user whose ID is 123."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. 200 OK
 * ============================================================
 *
 * A successful GET normally returns:
 *
 *     200 OK
 *
 *
 * Example:
 *
 *     GET /users
 *
 *     200
 *
 *
 *     GET /users/1
 *
 *     200
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. 404 NOT FOUND
 * ============================================================
 *
 * Example:
 *
 *     GET /users/999
 *
 *
 * If user 999 does not exist:
 *
 *     404 Not Found
 *
 *
 * Important:
 *
 * 404 means the requested resource was not found.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. EMPTY COLLECTION
 * ============================================================
 *
 * Suppose:
 *
 *     GET /users
 *
 * and there are no users.
 *
 *
 * Usually:
 *
 *     200 OK
 *
 *
 * with:
 *
 *     {
 *       "data": []
 *     }
 *
 *
 * An empty collection is not normally a 404.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. GET IS SAFE
 * ============================================================
 *
 * HTTP GET is intended to retrieve information.
 *
 *
 * Example:
 *
 *     GET /users
 *
 *
 * It should not perform operations such as:
 *
 *     delete user
 *     change password
 *     transfer money
 *
 *
 * Keep read and mutation operations separate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. GET IS IDEMPOTENT
 * ============================================================
 *
 * An idempotent operation can be repeated without changing the
 * intended result beyond the first successful operation.
 *
 *
 * Repeating:
 *
 *     GET /users/1
 *
 *
 * should not modify the user.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. QUERY PARAMETERS
 * ============================================================
 *
 * Query parameters are useful for controlling a collection
 * response.
 *
 *
 * Examples:
 *
 *     GET /users?page=1
 *
 *     GET /users?limit=20
 *
 *     GET /users?role=student
 *
 *     GET /users?search=shiva
 *
 *     GET /users?sort=name
 *
 *
 * They should generally not identify the primary resource.
 *
 *
 * Primary resource:
 *
 *     /users/123
 *
 *
 * Filtering:
 *
 *     /users?role=student
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. BOOLEAN QUERY PARAMETERS
 * ============================================================
 *
 * Query parameters arrive as strings.
 *
 *
 * Request:
 *
 *     ?active=true
 *
 *
 * gives:
 *
 *     req.query.active === "true"
 *
 *
 * NOT:
 *
 *     true
 *
 *
 * Convert and validate explicitly.
 *
 * ============================================================
 */

app.get("/active-users", (req, res) => {
  const { active } = req.query;

  let isActive;

  if (active === "true") {
    isActive = true;
  }

  if (active === "false") {
    isActive = false;
  }

  /*
   * If omitted, return all users.
   */

  if (isActive === undefined) {
    return res.json({
      data: users,
    });
  }

  /*
   * Our sample users do not contain an active field.
   * This demonstrates where validated filtering would happen.
   */

  return res.json({
    data: [],
  });
});

/*
 * ============================================================
 * 13. PROJECTION / RESPONSE SHAPING
 * ============================================================
 *
 * Sometimes the database contains more fields than the client
 * needs.
 *
 *
 * Database object:
 *
 *     {
 *       id,
 *       name,
 *       email,
 *       passwordHash,
 *       role
 *     }
 *
 *
 * Public response:
 *
 *     {
 *       id,
 *       name,
 *       role
 *     }
 *
 *
 * Never expose sensitive fields accidentally.
 *
 * ============================================================
 */

app.get("/safe-users", (req, res) => {
  const safeUsers = users.map(({ id, name, role }) => ({
    id,
    name,
    role,
  }));

  return res.json({
    data: safeUsers,
  });
});

/*
 * ============================================================
 * 14. SELECTIVE RESOURCE RESPONSE
 * ============================================================
 */

app.get("/safe-users/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  const safeUser = {
    id: user.id,

    name: user.name,

    role: user.role,
  };

  return res.json({
    data: safeUser,
  });
});

/*
 * ============================================================
 * 15. API RESPONSE METADATA
 * ============================================================
 *
 * For collection endpoints, metadata can describe the result.
 *
 * Example:
 *
 *     {
 *       "data": [...],
 *       "meta": {
 *         "count": 3
 *       }
 *     }
 *
 * ============================================================
 */

app.get("/users-with-meta", (req, res) => {
  return res.json({
    data: users,

    meta: {
      count: users.length,
    },
  });
});

/*
 * ============================================================
 * 16. DATABASE READ
 * ============================================================
 *
 * In a real application, instead of:
 *
 *     users.find(...)
 *
 *
 * you might have:
 *
 *     User.findById(id)
 *
 *
 * or:
 *
 *     User.find(...)
 *
 *
 * The HTTP/controller layer should not become tightly coupled
 * to database implementation details.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. CONTROLLER → SERVICE → DATABASE
 * ============================================================
 *
 *
 * HTTP
 *   │
 *   ↓
 * Controller
 *   │
 *   ↓
 * Service
 *   │
 *   ↓
 * Repository / Model
 *   │
 *   ↓
 * Database
 *
 *
 * Example:
 *
 *
 * GET /users/123
 *       ↓
 * userController.getById()
 *       ↓
 * userService.getById()
 *       ↓
 * userRepository.findById()
 *       ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. DO NOT PUT DATABASE LOGIC EVERYWHERE
 * ============================================================
 *
 * Avoid:
 *
 *
 * app.get(
 *   "/users/:id",
 *   async (req, res) => {
 *     // 100 lines of database logic
 *   }
 * );
 *
 *
 * Prefer separation:
 *
 *
 * route
 *     ↓
 * controller
 *     ↓
 * service
 *     ↓
 * repository/model
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. INVALID ID VS NOT FOUND
 * ============================================================
 *
 * These can be different situations.
 *
 *
 * Example:
 *
 *     GET /users/abc
 *
 *
 * If your API requires UUIDs and `abc` is invalid:
 *
 *     400 Bad Request
 *
 *
 * If:
 *
 *     GET /users/550e8400-e29b-41d4-a716-446655440000
 *
 *
 * is a valid ID format but no user exists:
 *
 *     404 Not Found
 *
 *
 * The exact contract depends on your API design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. CACHEABLE READS
 * ============================================================
 *
 * GET responses may be cacheable depending on the HTTP headers
 * and application semantics.
 *
 *
 * Possible caching layers:
 *
 *     Browser
 *     CDN
 *     Reverse proxy
 *     Redis
 *     Application cache
 *
 *
 * This becomes important for high-traffic APIs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. CONDITIONAL REQUESTS
 * ============================================================
 *
 * HTTP supports conditional requests using headers such as:
 *
 *     If-None-Match
 *     If-Modified-Since
 *
 *
 * This can allow:
 *
 *     304 Not Modified
 *
 *
 * instead of retransmitting unchanged data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. GET SHOULD NOT CONTAIN SIDE EFFECTS
 * ============================================================
 *
 * BAD:
 *
 *     GET /users/123/delete
 *
 *
 * This is wrong because a GET request should not be used as a
 * destructive operation.
 *
 *
 * Correct:
 *
 *     DELETE /users/123
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. HTTP METHOD SUMMARY
 * ============================================================
 *
 *
 * POST
 *     Create/process
 *
 *
 * GET
 *     Read
 *
 *
 * PUT
 *     Replace resource
 *
 *
 * PATCH
 *     Partially modify resource
 *
 *
 * DELETE
 *     Delete resource
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. COMPLETE READ FLOW
 * ============================================================
 *
 *
 * Client:
 *
 *     GET /users/123
 *
 *             │
 *             ↓
 *
 * Express route:
 *
 *     /users/:id
 *
 *             │
 *             ↓
 *
 *     req.params.id
 *
 *             │
 *             ↓
 *
 *     service
 *
 *             │
 *             ↓
 *
 *     database
 *
 *             │
 *             ↓
 *
 *     user found?
 *       │
 *       ├── NO ──→ 404
 *       │
 *       └── YES
 *             │
 *             ↓
 *
 *         res.json()
 *
 *             │
 *             ↓
 *
 *          Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. LIST ENDPOINT DESIGN
 * ============================================================
 *
 * A typical collection endpoint:
 *
 *
 *     GET /users
 *
 *
 * Later we can add:
 *
 *
 *     GET /users?page=2
 *
 *     GET /users?limit=20
 *
 *     GET /users?role=student
 *
 *     GET /users?sort=name
 *
 *     GET /users?search=shiva
 *
 *
 * These concepts are covered in the next REST API sections:
 *
 *     pagination
 *     filtering
 *     sorting
 *     searching
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. COMMON MISTAKES
 * ============================================================
 *
 * ❌ Returning 404 for an empty collection
 *
 * ❌ Exposing passwordHash
 *
 * ❌ Trusting query parameters without validation
 *
 * ❌ Treating query values as numbers automatically
 *
 * ❌ Performing mutations through GET
 *
 * ❌ Returning huge datasets without pagination
 *
 * ❌ Putting all database logic inside routes
 *
 * ❌ Revealing internal database errors to clients
 *
 * ❌ Returning inconsistent response structures
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * GET /users
 *     ↓
 * Collection
 *     ↓
 * List of resources
 *
 *
 * GET /users/:id
 *     ↓
 * Individual resource
 *     ↓
 * One resource or 404
 *
 *
 * Query parameters:
 *
 *     filtering
 *     sorting
 *     searching
 *     pagination
 *
 *
 * Path parameters:
 *
 *     identify a specific resource
 *
 * ============================================================
 */

/*
 * ============================================================
 * NEXT:
 *
 *     19_rest_api/crud/update.js
 *
 * We will learn:
 *
 *     PUT
 *     PATCH
 *     replacement vs partial update
 *     update validation
 *     404 handling
 *     200 vs 204
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
