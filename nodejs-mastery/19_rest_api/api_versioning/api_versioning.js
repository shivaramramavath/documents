/**
 * ============================================================
 * 19_rest_api/api_versioning/api_versioning.js
 * ============================================================
 *
 * REST API VERSIONING
 *
 * API versioning allows you to evolve an API without suddenly
 * breaking clients that depend on an older contract.
 *
 * ============================================================
 *
 * Example:
 *
 *     /api/v1/users
 *
 *     /api/v2/users
 *
 * ============================================================
 */

import express from "express";

const app = express();

/*
 * ============================================================
 * 1. WHY VERSION APIs?
 * ============================================================
 *
 * Imagine version 1 returns:
 *
 *
 * {
 *   "firstName": "Shiva",
 *   "lastName": "Ram"
 * }
 *
 *
 * Later you want:
 *
 *
 * {
 *   "name": "Shiva Ram"
 * }
 *
 *
 * If you simply change /users, old mobile applications may
 * break.
 *
 *
 * Instead:
 *
 *
 *     /api/v1/users
 *
 * keeps the old contract.
 *
 *
 *     /api/v2/users
 *
 * provides the new contract.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. VERSION IN URL
 * ============================================================
 */

app.get("/api/v1/users", (req, res) => {
  return res.json({
    version: "v1",

    data: [
      {
        firstName: "Shiva",
        lastName: "Ram",
      },
    ],
  });
});

app.get("/api/v2/users", (req, res) => {
  return res.json({
    version: "v2",

    data: [
      {
        name: "Shiva Ram",
      },
    ],
  });
});

/*
 * ============================================================
 * 3. EXPRESS ROUTER VERSIONING
 * ============================================================
 *
 * In a real project, don't put everything in app.js.
 *
 * Use routers.
 *
 * Structure:
 *
 *
 * api/
 *
 *   v1/
 *     routes.js
 *
 *   v2/
 *     routes.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. V1 ROUTER
 * ============================================================
 */

const v1Router = express.Router();

v1Router.get("/users", (req, res) => {
  return res.json({
    version: "v1",

    data: [
      {
        firstName: "Shiva",
        lastName: "Ram",
      },
    ],
  });
});

/*
 * ============================================================
 * 5. V2 ROUTER
 * ============================================================
 */

const v2Router = express.Router();

v2Router.get("/users", (req, res) => {
  return res.json({
    version: "v2",

    data: [
      {
        name: "Shiva Ram",
      },
    ],
  });
});

/*
 * ============================================================
 * 6. MOUNT ROUTERS
 * ============================================================
 */

app.use("/api/v1", v1Router);

app.use("/api/v2", v2Router);

/*
 * ============================================================
 * 7. RESULT
 * ============================================================
 *
 *
 * GET /api/v1/users
 *
 *     ↓
 *
 * v1Router
 *
 *
 * GET /api/v2/users
 *
 *     ↓
 *
 * v2Router
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. VERSION SHOULD REPRESENT API CONTRACT
 * ============================================================
 *
 * Versioning is NOT simply:
 *
 *
 *     "I changed some internal code."
 *
 *
 * Internal implementation changes don't necessarily require
 * a new API version.
 *
 *
 * Version when the externally visible contract changes in a
 * breaking way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. NON-BREAKING CHANGES
 * ============================================================
 *
 * Usually don't require a new major API version:
 *
 *
 *     adding an optional response field
 *
 *     adding a new endpoint
 *
 *     adding an optional query parameter
 *
 *
 * But your compatibility policy should be explicit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. BREAKING CHANGES
 * ============================================================
 *
 * Examples:
 *
 *
 * Removing a response field.
 *
 *
 * Renaming a field.
 *
 *
 * Changing a field's type.
 *
 *
 * Changing authentication requirements.
 *
 *
 * Changing the meaning of an existing field.
 *
 *
 * Changing an endpoint's semantics.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. VERSIONING STRATEGY
 * ============================================================
 *
 * Common choices:
 *
 *
 * 1. URL
 *
 *     /api/v1/users
 *
 *
 * 2. Header
 *
 *     Accept:
 *     application/vnd.myapi.v2+json
 *
 *
 * 3. Query parameter
 *
 *     /users?version=2
 *
 *
 * URL versioning is straightforward and highly visible.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. HEADER VERSIONING
 * ============================================================
 */

app.get("/header-users", (req, res) => {
  const version = req.header("X-API-Version");

  if (version === "2") {
    return res.json({
      version: "v2",
      data: [],
    });
  }

  return res.json({
    version: "v1",
    data: [],
  });
});

/*
 * ============================================================
 * 13. QUERY PARAMETER VERSIONING
 * ============================================================
 *
 *     GET /users?version=2
 *
 * ============================================================
 */

app.get("/query-users", (req, res) => {
  const version = req.query.version;

  if (version === "2") {
    return res.json({
      version: "v2",
      data: [],
    });
  }

  return res.json({
    version: "v1",
    data: [],
  });
});

/*
 * ============================================================
 * 14. DON'T DUPLICATE EVERYTHING
 * ============================================================
 *
 * Versioning should usually happen at the API contract layer.
 *
 *
 * Avoid:
 *
 *
 *     v1UserService
 *
 *     v2UserService
 *
 *     v3UserService
 *
 *
 * if the underlying business logic is identical.
 *
 *
 * Better:
 *
 *
 *     Controller V1
 *          ↓
 *     shared service
 *          ↓
 *     repository
 *
 *
 *     Controller V2
 *          ↓
 *     shared service
 *          ↓
 *     repository
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. CONTROLLER TRANSFORMATION
 * ============================================================
 *
 * Suppose database/service returns:
 *
 *
 * {
 *   firstName: "Shiva",
 *   lastName: "Ram",
 *   email: "shiva@example.com"
 * }
 *
 *
 * V1 response:
 *
 *
 * {
 *   firstName: "Shiva",
 *   lastName: "Ram"
 * }
 *
 *
 * V2 response:
 *
 *
 * {
 *   name: "Shiva Ram",
 *   email: "shiva@example.com"
 * }
 *
 *
 * The service can remain shared.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. VERSION TRANSFORMER
 * ============================================================
 */

function toV1User(user) {
  return {
    firstName: user.firstName,

    lastName: user.lastName,
  };
}

function toV2User(user) {
  return {
    name: `${user.firstName} ${user.lastName}`,

    email: user.email,
  };
}

/*
 * ============================================================
 * 17. SHARED DATA
 * ============================================================
 */

const user = {
  firstName: "Shiva",
  lastName: "Ram",
  email: "shiva@example.com",
};

console.log(toV1User(user));

console.log(toV2User(user));

/*
 * ============================================================
 * 18. VERSION DEPRECATION
 * ============================================================
 *
 * Eventually you may want to retire v1.
 *
 *
 * Example:
 *
 *
 *     v1
 *       ↓
 *     deprecated
 *       ↓
 *     migration period
 *       ↓
 *     sunset
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. DEPRECATION HEADERS
 * ============================================================
 *
 * You can communicate deprecation through HTTP headers.
 *
 *
 * Example:
 *
 *
 *     Deprecation: true
 *
 *
 * or other documented metadata according to your API policy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. VERSION DOCUMENTATION
 * ============================================================
 *
 * Every version should clearly document:
 *
 *
 *     endpoints
 *
 *     request schema
 *
 *     response schema
 *
 *     authentication
 *
 *     errors
 *
 *     pagination
 *
 *     filtering
 *
 *     sorting
 *
 *     deprecation status
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. VERSION DIRECTORY
 * ============================================================
 *
 * Recommended:
 *
 *
 * api/
 *
 *   v1/
 *
 *     routes.js
 *
 *     controllers/
 *
 *
 *   v2/
 *
 *     routes.js
 *
 *     controllers/
 *
 *
 * services/
 *
 * repositories/
 *
 *
 * This keeps the API contract separate from business logic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 * Client
 *   │
 *   ├── /api/v1/users
 *   │
 *   └── /api/v2/users
 *            │
 *            ▼
 *       API Router
 *            │
 *       ┌────┴────┐
 *       ▼         ▼
 *      V1        V2
 *   Controller Controller
 *       │         │
 *       └────┬────┘
 *            ▼
 *         Service
 *            │
 *       Repository
 *            │
 *         MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. VERSIONING + YOUR REST API
 * ============================================================
 *
 * Your eventual API could look like:
 *
 *
 *     /api/v1/users
 *
 *     /api/v1/messages
 *
 *     /api/v1/timetables
 *
 *     /api/v1/faculty
 *
 *
 * Later:
 *
 *
 *     /api/v2/users
 *
 *     /api/v2/messages
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * VERSION
 *
 *     /api/v1
 *         ↓
 *     contract v1
 *
 *
 *     /api/v2
 *         ↓
 *     contract v2
 *
 *
 * Both can share:
 *
 *     business logic
 *     services
 *     repositories
 *     database
 *
 * while exposing different HTTP contracts.
 *
 * ============================================================
 */
