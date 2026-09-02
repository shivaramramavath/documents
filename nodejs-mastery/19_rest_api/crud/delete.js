/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/crud/delete.js
 *
 * Topic:
 *     REST API - DELETE
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
 * In a real application this would normally be stored in
 * MongoDB, PostgreSQL, MySQL, etc.
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
 * 1. DELETE USER
 * ============================================================
 *
 * HTTP:
 *
 *     DELETE /users/1
 *
 *
 * The server removes the resource identified by the URL.
 *
 * ============================================================
 */

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  /*
   * Find the resource.
   */

  const userIndex = users.findIndex((user) => user.id === id);

  /*
   * ========================================================
   * RESOURCE NOT FOUND
   * ========================================================
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
   * DELETE RESOURCE
   * ========================================================
   */

  users.splice(userIndex, 1);

  /*
   * ========================================================
   * 204 NO CONTENT
   * ========================================================
   *
   * The deletion succeeded.
   *
   * 204 means the server successfully processed the request
   * and is intentionally returning no response body.
   *
   * ========================================================
   */

  return res.status(204).send();
});

/*
 * ============================================================
 * 2. DELETE AND RETURN DELETED RESOURCE
 * ============================================================
 *
 * Another API design is:
 *
 *     DELETE /users/1
 *
 *
 * Response:
 *
 *     200 OK
 *
 *     {
 *       "data": {
 *         "id": "1",
 *         "name": "Shiva"
 *       }
 *     }
 *
 *
 * This can be useful when the client needs confirmation of the
 * deleted representation.
 *
 * ============================================================
 */

app.delete("/users-with-response/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  const [deletedUser] = users.splice(userIndex, 1);

  return res.status(200).json({
    data: deletedUser,
  });
});

/*
 * ============================================================
 * 3. DELETE IS IDEMPOTENT
 * ============================================================
 *
 * DELETE is an idempotent HTTP method.
 *
 *
 * Example:
 *
 *     DELETE /users/1
 *
 *
 * First request:
 *
 *     User exists
 *     ↓
 *     User is deleted
 *
 *
 * Second identical request:
 *
 *     User is already gone
 *
 *
 * The intended server state remains:
 *
 *     User does not exist
 *
 *
 * IMPORTANT:
 *
 * Idempotent does NOT mean that every response must be
 * identical.
 *
 * For example:
 *
 *     First request → 204
 *
 *     Second request → 404
 *
 * can still be consistent with DELETE's idempotent semantics.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. HARD DELETE
 * ============================================================
 *
 * Hard delete means physically removing the record from the
 * primary datastore.
 *
 *
 * Example:
 *
 *     DELETE /users/123
 *
 *
 * Database:
 *
 *     document is removed
 *
 *
 * Advantages:
 *
 *     - Data is actually removed
 *     - Storage is eventually reclaimed
 *
 *
 * Disadvantages:
 *
 *     - Recovery can be difficult
 *     - Audit/history may be lost
 *     - References may need special handling
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. SOFT DELETE
 * ============================================================
 *
 * Soft delete does not physically remove the record.
 *
 *
 * Instead:
 *
 *     deletedAt = current timestamp
 *
 *
 * Example:
 *
 *     {
 *       id: "1",
 *       name: "Shiva",
 *       deletedAt: "2026-09-03T..."
 *     }
 *
 *
 * Normal queries then exclude:
 *
 *     deletedAt != null
 *
 * ============================================================
 */

const usersWithSoftDelete = [
  {
    id: "1",
    name: "Shiva",
    deletedAt: null,
  },

  {
    id: "2",
    name: "Ravi",
    deletedAt: null,
  },
];

app.delete("/soft-users/:id", (req, res) => {
  const user = usersWithSoftDelete.find((user) => user.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      error: {
        code: "USER_NOT_FOUND",

        message: "User not found",
      },
    });
  }

  /*
   * Already deleted.
   */

  if (user.deletedAt !== null) {
    return res.status(204).send();
  }

  /*
   * Mark as deleted.
   */

  user.deletedAt = new Date().toISOString();

  return res.status(204).send();
});

/*
 * ============================================================
 * 6. HARD DELETE VS SOFT DELETE
 * ============================================================
 *
 *
 * HARD DELETE
 * ────────────────────────────────────────
 *
 * DELETE database record
 *
 *
 * SOFT DELETE
 * ────────────────────────────────────────
 *
 * Keep record
 * Set deletedAt
 *
 *
 * Soft delete is commonly useful when:
 *
 *     - audit history matters
 *     - recovery matters
 *     - records must be retained
 *     - relationships depend on historical data
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. SOFT DELETE QUERY
 * ============================================================
 *
 * If using soft deletion, normal queries should usually exclude
 * deleted resources.
 *
 *
 * Example:
 *
 *     GET /users
 *
 *
 * Conceptually:
 *
 *     users where deletedAt IS NULL
 *
 *
 * Otherwise a "deleted" user could accidentally appear in
 * normal API responses.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. REST DELETE URL
 * ============================================================
 *
 * Good:
 *
 *     DELETE /users/123
 *
 *
 * Avoid:
 *
 *     DELETE /deleteUser/123
 *
 *     POST /users/123/delete
 *
 *     GET /users/123/delete
 *
 *
 * The HTTP method already communicates the operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. DELETE SHOULD REQUIRE AUTHORIZATION
 * ============================================================
 *
 * Authentication:
 *
 *     Who is making this request?
 *
 *
 * Authorization:
 *
 *     Are they allowed to delete this resource?
 *
 *
 * Example:
 *
 *     DELETE /users/123
 *
 *
 * A normal user might only be allowed to delete their own
 * account.
 *
 *
 * An administrator might be allowed to delete other users.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. 401 VS 403
 * ============================================================
 *
 *
 * 401 Unauthorized
 *
 *     The client has not successfully authenticated.
 *
 *
 * 403 Forbidden
 *
 *     The client is authenticated but does not have permission.
 *
 *
 * Example:
 *
 *
 * DELETE /users/123
 *
 *        │
 *        ↓
 *
 * Authentication
 *        │
 *        ├── failed → 401
 *        │
 *        ↓
 *
 * Authorization
 *        │
 *        ├── denied → 403
 *        │
 *        ↓
 *
 * Delete
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. CASCADE DELETE
 * ============================================================
 *
 * Consider:
 *
 *
 * User
 *   │
 *   ├── Posts
 *   ├── Comments
 *   ├── Messages
 *   └── Sessions
 *
 *
 * If the user is deleted, what happens to related resources?
 *
 *
 * Options:
 *
 *     1. Delete related records
 *     2. Soft delete related records
 *     3. Keep them
 *     4. Reassign ownership
 *     5. Block deletion
 *
 *
 * This is a data-modeling decision, not merely an HTTP decision.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. DATABASE TRANSACTIONS
 * ============================================================
 *
 * If deleting one resource requires multiple related database
 * changes, a transaction may be appropriate.
 *
 *
 * Example:
 *
 *     Delete user
 *       ↓
 *     Delete sessions
 *       ↓
 *     Delete user-specific records
 *       ↓
 *     Update another collection
 *
 *
 * If one operation fails, a transaction can allow the database
 * changes to be rolled back together.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. FOREIGN REFERENCES
 * ============================================================
 *
 * Suppose:
 *
 *     posts.userId = "123"
 *
 *
 * and:
 *
 *     users.id = "123"
 *
 *
 * Before deleting the user, decide what should happen to posts.
 *
 *
 * Possible strategies:
 *
 *     ON DELETE CASCADE
 *
 *     SET NULL
 *
 *     RESTRICT
 *
 *     application-level cleanup
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. DELETE AND 404
 * ============================================================
 *
 * One common API design:
 *
 *
 * First:
 *
 *     DELETE /users/123
 *
 *     → 204
 *
 *
 * Again:
 *
 *     DELETE /users/123
 *
 *     → 404
 *
 *
 * This explicitly tells the client that the resource does not
 * exist.
 *
 *
 * Another design can treat an already-absent resource as a
 * successful no-op.
 *
 * The important thing is to define the API contract consistently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. DELETE AND CACHES
 * ============================================================
 *
 * If a resource is cached somewhere, deletion may require cache
 * invalidation.
 *
 *
 * Example:
 *
 *     GET /users/123
 *
 *     ↓
 *
 *     Redis cache
 *
 *
 * Then:
 *
 *     DELETE /users/123
 *
 *
 * You may need:
 *
 *     Redis DEL user:123
 *
 *
 * Otherwise the deleted resource could remain visible through
 * stale cache data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. EVENT-DRIVEN DELETE
 * ============================================================
 *
 * In larger systems:
 *
 *
 * DELETE /users/123
 *        │
 *        ↓
 *    User Service
 *        │
 *        ↓
 *     Database
 *        │
 *        ↓
 *     Event:
 *
 *     UserDeleted
 *
 *
 * Other services can react:
 *
 *     Notification Service
 *     Search Service
 *     Analytics Service
 *     Communication Service
 *
 *
 * Kafka, RabbitMQ, or another messaging system can be used
 * depending on architecture.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. ASYNCHRONOUS CLEANUP
 * ============================================================
 *
 * Not every deletion-related task must happen inside the HTTP
 * request.
 *
 *
 * Example:
 *
 *     DELETE user
 *         ↓
 *     Mark user deleted
 *         ↓
 *     Return 204
 *         ↓
 *     Background worker
 *         ↓
 *     Delete files / cleanup data
 *
 *
 * This can reduce request latency.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. SECURITY
 * ============================================================
 *
 * Deletion is destructive.
 *
 * Protect it with:
 *
 *     Authentication
 *     Authorization
 *     Input validation
 *     Ownership checks
 *     Audit logging
 *     Rate limiting
 *     CSRF protection where applicable
 *
 *
 * For especially sensitive operations, additional confirmation
 * or re-authentication may be appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. AUDIT LOGGING
 * ============================================================
 *
 * For important systems, record:
 *
 *     who deleted
 *     what was deleted
 *     when it was deleted
 *     why it was deleted
 *
 *
 * Example audit event:
 *
 *     {
 *       action: "USER_DELETED",
 *       userId: "123",
 *       performedBy: "admin-456",
 *       timestamp: "..."
 *     }
 *
 *
 * Do not put sensitive secrets into logs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. RESPONSE STATUS SUMMARY
 * ============================================================
 *
 *
 * 204 No Content
 *
 *     Delete succeeded.
 *     No response body.
 *
 *
 * 200 OK
 *
 *     Delete succeeded.
 *     Response body may contain information.
 *
 *
 * 400 Bad Request
 *
 *     Invalid request.
 *
 *
 * 401 Unauthorized
 *
 *     Authentication required/failed.
 *
 *
 * 403 Forbidden
 *
 *     Authenticated but not allowed.
 *
 *
 * 404 Not Found
 *
 *     Resource does not exist.
 *
 *
 * 409 Conflict
 *
 *     Deletion conflicts with current resource state.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. DELETE FLOW
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ DELETE /users/123
 *   ↓
 * Router
 *   │
 *   ↓
 * Authentication
 *   │
 *   ↓
 * Authorization
 *   │
 *   ↓
 * Validate ID
 *   │
 *   ↓
 * Find resource
 *   │
 *   ├── missing → 404
 *   │
 *   ↓
 * Delete / Soft Delete
 *   │
 *   ↓
 * Database
 *   │
 *   ↓
 * Cache invalidation
 *   │
 *   ↓
 * Publish event if needed
 *   │
 *   ↓
 * 204
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. COMPLETE CRUD MAP
 * ============================================================
 *
 *
 * CREATE
 *
 *     POST /users
 *     → 201 Created
 *
 *
 * READ
 *
 *     GET /users
 *     → 200 OK
 *
 *     GET /users/:id
 *     → 200 OK / 404
 *
 *
 * UPDATE
 *
 *     PUT /users/:id
 *     → 200 / 204
 *
 *     PATCH /users/:id
 *     → 200 / 204
 *
 *
 * DELETE
 *
 *     DELETE /users/:id
 *     → 204 / 200 / 404
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. REST CRUD MENTAL MODEL
 * ============================================================
 *
 *
 *            /users
 *               │
 *       ┌───────┼────────┐
 *       │       │        │
 *      POST    GET      ...
 *       │       │
 *       ↓       ↓
 *    CREATE   LIST
 *
 *
 *
 *            /users/:id
 *                 │
 *       ┌─────────┼──────────┐
 *       │         │          │
 *      GET       PATCH      DELETE
 *       │         │          │
 *       ↓         ↓          ↓
 *      READ     UPDATE     DELETE
 *
 *
 * PUT is also used for resource replacement.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. NEXT
 * ============================================================
 *
 * CRUD is now complete.
 *
 *
 * Next:
 *
 *     19_rest_api/pagination/
 *
 *
 * We will learn:
 *
 *     page
 *     limit
 *     offset
 *     skip
 *     cursor pagination
 *     total count
 *     next/previous pages
 *     MongoDB pagination
 *     scalable pagination
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
