/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/crud/create.js
 *
 * Topic:
 *     REST API - CREATE
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
 * REST APIs use HTTP methods to represent operations on
 * resources.
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
 * IN-MEMORY DATA
 * ============================================================
 *
 * Normally this would be MongoDB/PostgreSQL/etc.
 *
 * We use an array here only to understand the HTTP/API layer.
 * ============================================================
 */

const users = [];

/*
 * ============================================================
 * CREATE USER
 * ============================================================
 *
 * HTTP:
 *
 *     POST /users
 *
 *
 * Request:
 *
 *     {
 *       "name": "Shiva",
 *       "email": "shiva@example.com"
 *     }
 *
 *
 * Response:
 *
 *     201 Created
 *
 *     {
 *       "data": {
 *         "id": "...",
 *         "name": "Shiva",
 *         "email": "shiva@example.com"
 *       }
 *     }
 *
 * ============================================================
 */

app.post("/users", (req, res) => {
  /*
   * Extract input.
   */

  const { name, email } = req.body;

  /*
   * ========================================================
   * VALIDATION
   * ========================================================
   */

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

  /*
   * ========================================================
   * DUPLICATE CHECK
   * ========================================================
   */

  const existingUser = users.find((user) => user.email === email.trim());

  if (existingUser) {
    return res.status(409).json({
      error: {
        code: "EMAIL_ALREADY_EXISTS",

        message: "A user with this email already exists",
      },
    });
  }

  /*
   * ========================================================
   * CREATE RESOURCE
   * ========================================================
   *
   * In a real application the database normally generates
   * the identifier.
   */

  const user = {
    id: crypto.randomUUID(),

    name: name.trim(),

    email: email.trim(),

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  /*
   * Save resource.
   */

  users.push(user);

  /*
   * ========================================================
   * 201 CREATED
   * ========================================================
   *
   * 201 means:
   *
   *     The server successfully created a resource.
   *
   * ========================================================
   */

  return res.status(201).location(`/users/${user.id}`).json({
    data: user,
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*
 * ============================================================
 * IMPORTANT REST CONCEPTS
 * ============================================================
 *
 * POST /users
 *
 * means:
 *
 *     "Create a user under the /users collection."
 *
 *
 * Successful creation:
 *
 *     HTTP 201 Created
 *
 *
 * Invalid client input:
 *
 *     HTTP 400 Bad Request
 *
 *
 * Duplicate resource/conflict:
 *
 *     HTTP 409 Conflict
 *
 * ============================================================
 */

/*
 * ============================================================
 * REST RESOURCE MODEL
 * ============================================================
 *
 * Collection:
 *
 *     /users
 *
 *
 * Individual resource:
 *
 *     /users/:id
 *
 *
 * CREATE:
 *
 *     POST /users
 *
 *
 * READ:
 *
 *     GET /users
 *     GET /users/:id
 *
 *
 * UPDATE:
 *
 *     PUT /users/:id
 *     PATCH /users/:id
 *
 *
 * DELETE:
 *
 *     DELETE /users/:id
 *
 * ============================================================
 */

/*
 * ============================================================
 * WHY POST FOR CREATE?
 * ============================================================
 *
 * POST is generally used when the server creates the resource
 * identifier or otherwise processes the request as a creation
 * operation on a collection.
 *
 *
 * Example:
 *
 *     POST /users
 *
 *
 * Server:
 *
 *     creates user_123
 *
 *
 * Response:
 *
 *     Location: /users/user_123
 *
 * ============================================================
 */

/*
 * ============================================================
 * DO NOT TRUST req.body
 * ============================================================
 *
 * Client can send:
 *
 *     {
 *       "name": 123,
 *       "email": true,
 *       "admin": true,
 *       "password": "..."
 *     }
 *
 *
 * Your API should explicitly decide which fields are accepted.
 *
 * Do not simply save:
 *
 *     req.body
 *
 * directly to your database.
 *
 * ============================================================
 */

/*
 * ============================================================
 * MASS ASSIGNMENT PROBLEM
 * ============================================================
 *
 * Dangerous:
 *
 *     const user = {
 *       ...req.body
 *     };
 *
 *
 * A malicious client could send:
 *
 *     {
 *       "name": "Shiva",
 *       "role": "admin"
 *     }
 *
 *
 * If `role` should not be client-controlled, this becomes a
 * security issue.
 *
 *
 * Better:
 *
 *     const {
 *       name,
 *       email
 *     } = req.body;
 *
 *
 * Then construct the database object explicitly.
 *
 * ============================================================
 */

/*
 * ============================================================
 * RESPONSE DESIGN
 * ============================================================
 *
 * A consistent API might use:
 *
 *     {
 *       "data": {...}
 *     }
 *
 *
 * Errors:
 *
 *     {
 *       "error": {
 *         "code": "INVALID_EMAIL",
 *         "message": "Email is required"
 *       }
 *     }
 *
 *
 * Consistency is more important than the exact envelope
 * structure chosen by your project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * NEXT:
 *
 *     19_rest_api/crud/read.js
 *
 * We will learn:
 *
 *     GET /users
 *     GET /users/:id
 *
 * collection resources
 * individual resources
 * 404 Not Found
 * response filtering
 * ============================================================
 */
