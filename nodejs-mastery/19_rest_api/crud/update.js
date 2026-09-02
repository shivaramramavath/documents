/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/crud/update.js
 *
 * Topic:
 *     REST API - UPDATE
 *
 * ============================================================
 *
 * UPDATE OPERATIONS
 * ============================================================
 *
 * PUT
 *     Replace the resource
 *
 * PATCH
 *     Partially modify the resource
 *
 *
 * Examples:
 *
 *     PUT   /users/:id
 *     PATCH /users/:id
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * Parse JSON request bodies.
 */

app.use(express.json());

/*
 * ============================================================
 * SAMPLE DATA
 * ============================================================
 *
 * In a real application this would be stored in a database.
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
 * 1. PUT VS PATCH
 * ============================================================
 *
 *
 * PUT
 * ─────────────────────────────────────────
 *
 * Replaces the representation of a resource.
 *
 *
 * PATCH
 * ─────────────────────────────────────────
 *
 * Applies a partial modification.
 *
 *
 * Example existing user:
 *
 *     {
 *       id: "1",
 *       name: "Shiva",
 *       email: "shiva@example.com",
 *       role: "student"
 *     }
 *
 *
 * PATCH:
 *
 *     {
 *       "name": "Shiva Ram"
 *     }
 *
 *
 * means:
 *
 *     Change only the name.
 *
 *
 * PUT generally expects the complete representation according
 * to the API contract.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. PATCH - UPDATE ONE OR MORE FIELDS
 * ============================================================
 *
 * Request:
 *
 *     PATCH /users/1
 *
 *
 * Body:
 *
 *     {
 *       "name": "Shiva Ram"
 *     }
 *
 * ============================================================
 */

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;

  /*
   * Find resource.
   */

  const userIndex = users.findIndex((user) => user.id === id);

  /*
   * Resource does not exist.
   */

  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  /*
   * ========================================================
   * EXPLICIT FIELD EXTRACTION
   * ========================================================
   *
   * Do not blindly trust:
   *
   *     req.body
   *
   * and merge every property into your resource.
   */

  const { name, email, role } = req.body;

  /*
   * Current resource.
   */

  const currentUser = users[userIndex];

  /*
   * ========================================================
   * FIELD VALIDATION
   * ========================================================
   */

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: {
          code: "INVALID_NAME",

          message: "Name must be a non-empty string",
        },
      });
    }
  }

  if (email !== undefined) {
    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        error: {
          code: "INVALID_EMAIL",

          message: "Email must be a non-empty string",
        },
      });
    }
  }

  if (role !== undefined) {
    const allowedRoles = ["student", "teacher"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: {
          code: "INVALID_ROLE",

          message: "Invalid role",
        },
      });
    }
  }

  /*
   * ========================================================
   * DUPLICATE EMAIL CHECK
   * ========================================================
   */

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    const duplicate = users.find(
      (user) => user.id !== id && user.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      return res.status(409).json({
        error: {
          code: "EMAIL_ALREADY_EXISTS",

          message: "Email is already in use",
        },
      });
    }
  }

  /*
   * ========================================================
   * APPLY PATCH
   * ========================================================
   *
   * Only fields supplied by the client are changed.
   */

  const updatedUser = {
    ...currentUser,

    ...(name !== undefined
      ? {
          name: name.trim(),
        }
      : {}),

    ...(email !== undefined
      ? {
          email: email.trim().toLowerCase(),
        }
      : {}),

    ...(role !== undefined
      ? {
          role,
        }
      : {}),
  };

  /*
   * Save.
   */

  users[userIndex] = updatedUser;

  /*
   * Return updated resource.
   */

  return res.status(200).json({
    data: updatedUser,
  });
});

/*
 * ============================================================
 * 3. PUT - COMPLETE REPLACEMENT
 * ============================================================
 *
 * Request:
 *
 *     PUT /users/1
 *
 *
 * Body:
 *
 *     {
 *       "name": "Shiva Ram",
 *       "email": "shivaram@example.com",
 *       "role": "student"
 *     }
 *
 *
 * The server treats this as the new representation of the
 * resource, subject to the API's validation and immutable-field
 * rules.
 *
 * ============================================================
 */

app.put("/users/:id", (req, res) => {
  const { id } = req.params;

  /*
   * Find resource.
   */

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  /*
   * ========================================================
   * REQUIRED FIELDS
   * ========================================================
   *
   * Because PUT represents replacement, this API requires
   * the complete mutable representation.
   */

  const { name, email, role } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: {
        code: "INVALID_NAME",

        message: "Name is required",
      },
    });
  }

  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      error: {
        code: "INVALID_EMAIL",

        message: "Email is required",
      },
    });
  }

  const allowedRoles = ["student", "teacher"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROLE",

        message: "Invalid role",
      },
    });
  }

  /*
   * Normalize email.
   */

  const normalizedEmail = email.trim().toLowerCase();

  /*
   * ========================================================
   * DUPLICATE EMAIL
   * ========================================================
   */

  const duplicate = users.find(
    (user) => user.id !== id && user.email.toLowerCase() === normalizedEmail,
  );

  if (duplicate) {
    return res.status(409).json({
      error: {
        code: "EMAIL_ALREADY_EXISTS",

        message: "Email is already in use",
      },
    });
  }

  /*
   * ========================================================
   * REPLACE RESOURCE
   * ========================================================
   *
   * ID remains controlled by the server.
   */

  const updatedUser = {
    id,

    name: name.trim(),

    email: normalizedEmail,

    role,
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    data: updatedUser,
  });
});

/*
 * ============================================================
 * 4. PATCH WITH EMPTY BODY
 * ============================================================
 *
 * Request:
 *
 *     PATCH /users/1
 *
 *     {}
 *
 *
 * Depending on your API contract, you may:
 *
 *     return 400
 *
 * because no changes were requested.
 *
 * ============================================================
 */

app.patch("/users/:id/strict", (req, res) => {
  const keys = Object.keys(req.body);

  if (keys.length === 0) {
    return res.status(400).json({
      error: {
        code: "EMPTY_UPDATE",

        message: "At least one field is required",
      },
    });
  }

  return res.json({
    message: "Update accepted",
  });
});

/*
 * ============================================================
 * 5. PUT IDEMPOTENCY
 * ============================================================
 *
 * PUT is defined as idempotent.
 *
 *
 * Example:
 *
 *     PUT /users/1
 *
 * with:
 *
 *     {
 *       "name": "Shiva",
 *       "email": "shiva@example.com",
 *       "role": "student"
 *     }
 *
 *
 * Sending the same request repeatedly should result in the same
 * intended resource state.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. PATCH IDEMPOTENCY
 * ============================================================
 *
 * PATCH is not inherently required to be idempotent by HTTP.
 *
 * However, a particular PATCH operation can be designed to be
 * idempotent.
 *
 *
 * Example:
 *
 *     PATCH /users/1
 *
 *     {
 *       "name": "Shiva Ram"
 *     }
 *
 *
 * Repeating it results in the same name.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. PUT VS PATCH
 * ============================================================
 *
 *
 *                 PUT              PATCH
 *                 ───              ─────
 *
 * Purpose         Replace         Modify
 *
 * Body            Usually         Partial
 *                 complete        fields
 *
 * Missing fields  Contract        Usually
 *                 dependent       unchanged
 *
 * Idempotent      Yes             Not inherently
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. IMMUTABLE FIELDS
 * ============================================================
 *
 * Some fields should not be changed through a normal update.
 *
 * Examples:
 *
 *     id
 *     createdAt
 *     organizationId
 *
 *
 * Example:
 *
 *     {
 *       "id": "999"
 *     }
 *
 *
 * The server should not simply accept this and change the
 * resource identifier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. SERVER-CONTROLLED FIELDS
 * ============================================================
 *
 * Common server-controlled fields:
 *
 *     id
 *     createdAt
 *     updatedAt
 *
 *
 * Client-controlled fields:
 *
 *     name
 *     email
 *
 *
 * Permission-controlled fields:
 *
 *     role
 *     permissions
 *     organizationId
 *
 *
 * Authorization should determine who can modify sensitive
 * fields.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. UPDATED_AT
 * ============================================================
 *
 * Real applications commonly update:
 *
 *     updatedAt
 *
 * whenever a resource changes.
 *
 *
 * Example:
 *
 *     const updatedUser = {
 *       ...user,
 *       name,
 *       updatedAt:
 *         new Date().toISOString(),
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. NO-OP UPDATE
 * ============================================================
 *
 * Suppose:
 *
 * Current:
 *
 *     {
 *       name: "Shiva"
 *     }
 *
 *
 * PATCH:
 *
 *     {
 *       name: "Shiva"
 *     }
 *
 *
 * The resulting state is unchanged.
 *
 * Your API can still return:
 *
 *     200 OK
 *
 * with the current representation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. 200 VS 204
 * ============================================================
 *
 *
 * 200 OK
 *
 *     Use when returning a response body.
 *
 *
 * 204 No Content
 *
 *     Use when the operation succeeded and there is no response
 *     body.
 *
 *
 * Examples:
 *
 *     PATCH → 200 + updated resource
 *
 *     PATCH → 204 + no body
 *
 *
 * Both can be valid depending on your API contract.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. UPDATE FLOW
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ PATCH /users/123
 *   ↓
 * Express
 *   │
 *   ↓
 * Validate ID
 *   │
 *   ↓
 * Find user
 *   │
 *   ├── not found → 404
 *   │
 *   ↓
 * Validate body
 *   │
 *   ├── invalid → 400
 *   │
 *   ↓
 * Check authorization
 *   │
 *   ├── forbidden → 403
 *   │
 *   ↓
 * Service
 *   │
 *   ↓
 * Database
 *   │
 *   ↓
 * Updated resource
 *   │
 *   ↓
 * 200 / 204
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. AUTHORIZATION
 * ============================================================
 *
 * Authentication answers:
 *
 *     "Who are you?"
 *
 *
 * Authorization answers:
 *
 *     "Are you allowed to update this?"
 *
 *
 * Example:
 *
 *     PATCH /users/123
 *
 *
 * A logged-in student should not automatically be allowed to
 * change:
 *
 *     role = "admin"
 *
 *
 * Authorization belongs around the update operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. DATABASE VERSION
 * ============================================================
 *
 * In MongoDB/Mongoose, the conceptual operation might be:
 *
 *
 *     User.findByIdAndUpdate(
 *       id,
 *       update,
 *       {
 *         new: true,
 *         runValidators: true
 *       }
 *     );
 *
 *
 * But the exact update strategy depends on your schema and
 * application requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. ATOMIC DATABASE UPDATE
 * ============================================================
 *
 * In a real application, prefer database-level atomic update
 * operations when appropriate.
 *
 *
 * Avoid:
 *
 *     read document
 *         ↓
 *     modify in memory
 *         ↓
 *     write document
 *
 *
 * when an atomic database update can safely perform the
 * operation.
 *
 * This helps reduce race-condition problems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. OPTIMISTIC CONCURRENCY
 * ============================================================
 *
 * Consider:
 *
 * User A reads:
 *
 *     version = 5
 *
 *
 * User B reads:
 *
 *     version = 5
 *
 *
 * User A updates:
 *
 *     version = 6
 *
 *
 * User B then attempts to update the old version.
 *
 *
 * A version/updatedAt condition can be used to detect stale
 * updates.
 *
 *
 * This becomes important in collaborative systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. COMMON UPDATE ERRORS
 * ============================================================
 *
 *
 * 400 Bad Request
 *     Invalid input
 *
 *
 * 401 Unauthorized
 *     Authentication required
 *
 *
 * 403 Forbidden
 *     Authenticated but not allowed
 *
 *
 * 404 Not Found
 *     Resource doesn't exist
 *
 *
 * 409 Conflict
 *     Update conflicts with current resource state
 *
 *
 * 422 Unprocessable Content
 *     Sometimes used for semantically invalid input,
 *     depending on the API contract.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. MASS ASSIGNMENT
 * ============================================================
 *
 * Dangerous:
 *
 *     user = {
 *       ...user,
 *       ...req.body
 *     };
 *
 *
 * Client could send:
 *
 *     {
 *       "role": "admin",
 *       "isVerified": true
 *     }
 *
 *
 * if those fields should not be user-controlled.
 *
 *
 * Always define the fields that can be updated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. FIELD-LEVEL AUTHORIZATION
 * ============================================================
 *
 * Different users may have different update permissions.
 *
 *
 * Normal user:
 *
 *     name
 *     profileImage
 *
 *
 * Admin:
 *
 *     role
 *     status
 *     permissions
 *
 *
 * Therefore:
 *
 *     validation
 *
 * and:
 *
 *     authorization
 *
 * are separate concerns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. UPDATE RESPONSE
 * ============================================================
 *
 * Good:
 *
 *     {
 *       "data": {
 *         "id": "1",
 *         "name": "Shiva Ram",
 *         "email": "shiva@example.com",
 *         "role": "student"
 *       }
 *     }
 *
 *
 * Avoid exposing:
 *
 *     passwordHash
 *     internal tokens
 *     secrets
 *     private internal metadata
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. ROUTE DESIGN
 * ============================================================
 *
 * Good:
 *
 *     PATCH /users/:id
 *
 *     PUT /users/:id
 *
 *
 * Avoid:
 *
 *     POST /updateUser
 *
 *     POST /changeUser
 *
 *     GET /users/:id/update
 *
 *
 * Resource-oriented APIs make HTTP semantics clearer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. COMPLETE CRUD MAP
 * ============================================================
 *
 *
 * CREATE
 *
 *     POST /users
 *
 *
 * READ
 *
 *     GET /users
 *
 *     GET /users/:id
 *
 *
 * UPDATE
 *
 *     PUT /users/:id
 *
 *     PATCH /users/:id
 *
 *
 * DELETE
 *
 *     DELETE /users/:id
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * PUT
 *
 *     "Make this resource representation equal to this
 *      representation."
 *
 *
 * PATCH
 *
 *     "Apply these changes to this resource."
 *
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/crud/delete.js
 *
 * We will learn:
 *
 *     DELETE
 *     204 No Content
 *     soft delete
 *     hard delete
 *     idempotency
 *     cascading deletes
 *     deletion authorization
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
