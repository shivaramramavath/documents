/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_authorization/roles/roles.js
 *
 * Topic:
 *     Authorization - Roles
 *
 * ============================================================
 *
 * AUTHENTICATION
 * ============================================================
 *
 * Authentication:
 *
 *     "Who are you?"
 *
 * Example:
 *
 *     userId = "user-123"
 *
 *
 * AUTHORIZATION
 * ============================================================
 *
 * Authorization:
 *
 *     "What are you allowed to do?"
 *
 * Example:
 *
 *     role = "admin"
 *
 * ============================================================
 *
 * ROLE
 * ============================================================
 *
 * A role is a logical group of permissions.
 *
 * Examples:
 *
 *     user
 *     moderator
 *     manager
 *     admin
 *
 * ============================================================
 */

import express from "express";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * 1. DEFINE ROLES
 * ============================================================
 *
 * Keep role names centralized.
 *
 * This prevents typos such as:
 *
 *     "Admin"
 *     "admin"
 *     "ADMIN"
 *
 * becoming different values.
 *
 * ============================================================
 */

const ROLES = Object.freeze({
  USER: "user",

  MODERATOR: "moderator",

  MANAGER: "manager",

  ADMIN: "admin",
});

/*
 * ============================================================
 * 2. ROLE HIERARCHY
 * ============================================================
 *
 * A simple hierarchy can be useful:
 *
 *
 *     user
 *       ↓
 *     moderator
 *       ↓
 *     manager
 *       ↓
 *     admin
 *
 *
 * But DON'T assume this hierarchy automatically exists.
 *
 * You must explicitly define the authorization rules.
 *
 * ============================================================
 */

const ROLE_LEVELS = Object.freeze({
  [ROLES.USER]: 10,

  [ROLES.MODERATOR]: 20,

  [ROLES.MANAGER]: 30,

  [ROLES.ADMIN]: 40,
});

/*
 * ============================================================
 * 3. CHECK WHETHER ROLE EXISTS
 * ============================================================
 */

function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/*
 * ============================================================
 * 4. CHECK USER ROLE
 * ============================================================
 *
 * Example:
 *
 *     user.role === "admin"
 *
 * ============================================================
 */

function hasRole(user, role) {
  if (!user || !isValidRole(role)) {
    return false;
  }

  return user.role === role;
}

/*
 * ============================================================
 * 5. CHECK ANY ROLE
 * ============================================================
 *
 * Sometimes an endpoint should allow:
 *
 *
 *     manager OR admin
 *
 * ============================================================
 */

function hasAnyRole(user, allowedRoles) {
  if (!user || !Array.isArray(allowedRoles)) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

/*
 * ============================================================
 * 6. CHECK ROLE LEVEL
 * ============================================================
 *
 * Example:
 *
 *     admin >= manager
 *
 *     manager >= moderator
 *
 *
 * This implements hierarchical authorization.
 *
 * ============================================================
 */

function hasMinimumRole(user, minimumRole) {
  if (!user || !isValidRole(user.role) || !isValidRole(minimumRole)) {
    return false;
  }

  return ROLE_LEVELS[user.role] >= ROLE_LEVELS[minimumRole];
}

/*
 * ============================================================
 * 7. EXAMPLE USERS
 * ============================================================
 */

const users = [
  {
    id: "user-1",

    name: "Regular User",

    role: ROLES.USER,
  },

  {
    id: "user-2",

    name: "Moderator",

    role: ROLES.MODERATOR,
  },

  {
    id: "user-3",

    name: "Manager",

    role: ROLES.MANAGER,
  },

  {
    id: "user-4",

    name: "Administrator",

    role: ROLES.ADMIN,
  },
];

/*
 * ============================================================
 * 8. SIMULATED AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * In a real application, authentication middleware would:
 *
 *
 *     Authorization: Bearer <JWT>
 *
 *                 ↓
 *
 *             verify JWT
 *
 *                 ↓
 *
 *             req.user
 *
 *
 * Here we simulate it using:
 *
 *     x-user-id
 *
 * ============================================================
 */

function authenticate(req, res, next) {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",

        message: "Authentication required",
      },
    });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",

        message: "Invalid authentication",
      },
    });
  }

  /*
   * Attach authenticated user.
   */

  req.user = user;

  next();
}

/*
 * ============================================================
 * 9. ROLE MIDDLEWARE
 * ============================================================
 *
 * Usage:
 *
 *     authorizeRoles(ROLES.ADMIN)
 *
 *
 * or:
 *
 *     authorizeRoles(
 *       ROLES.MANAGER,
 *       ROLES.ADMIN
 *     )
 *
 * ============================================================
 */

function authorizeRoles(...allowedRoles) {
  /*
   * Validate configuration when middleware is created.
   */

  for (const role of allowedRoles) {
    if (!isValidRole(role)) {
      throw new Error(`Invalid role configured: ${role}`);
    }
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!hasAnyRole(req.user, allowedRoles)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "You do not have permission to access this resource",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 10. USER-ONLY ROUTE
 * ============================================================
 */

app.get(
  "/api/v1/user-area",
  authenticate,
  authorizeRoles(ROLES.USER, ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN),
  (req, res) => {
    return res.status(200).json({
      data: {
        message: "User area",

        user: req.user,
      },
    });
  },
);

/*
 * ============================================================
 * 11. MODERATOR ROUTE
 * ============================================================
 */

app.get(
  "/api/v1/moderation",
  authenticate,
  authorizeRoles(ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN),
  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Moderation area",
      },
    });
  },
);

/*
 * ============================================================
 * 12. MANAGER ROUTE
 * ============================================================
 */

app.get(
  "/api/v1/management",
  authenticate,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Management area",
      },
    });
  },
);

/*
 * ============================================================
 * 13. ADMIN ROUTE
 * ============================================================
 */

app.get(
  "/api/v1/admin",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Admin area",
      },
    });
  },
);

/*
 * ============================================================
 * 14. HIERARCHICAL ROLE MIDDLEWARE
 * ============================================================
 *
 * Instead of:
 *
 *     authorizeRoles(
 *       "manager",
 *       "admin"
 *     )
 *
 *
 * We can use:
 *
 *     authorizeMinimumRole("manager")
 *
 *
 * ============================================================
 */

function authorizeMinimumRole(minimumRole) {
  if (!isValidRole(minimumRole)) {
    throw new Error(`Invalid minimum role: ${minimumRole}`);
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!hasMinimumRole(req.user, minimumRole)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Insufficient role",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 15. HIERARCHICAL ROUTE
 * ============================================================
 */

app.delete(
  "/api/v1/management/users/:id",
  authenticate,

  authorizeMinimumRole(ROLES.MANAGER),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "User management operation allowed",
      },
    });
  },
);

/*
 * ============================================================
 * 16. MULTIPLE ROLES
 * ============================================================
 *
 * A user may have more than one role.
 *
 *
 * Example:
 *
 *     roles: [
 *       "moderator",
 *       "manager"
 *     ]
 *
 *
 * In that case the user model becomes:
 *
 *
 *     {
 *       id: "user-1",
 *       roles: [...]
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. MULTI-ROLE CHECK
 * ============================================================
 */

function hasAnyUserRole(user, allowedRoles) {
  if (!user || !Array.isArray(user.roles)) {
    return false;
  }

  return user.roles.some((role) => allowedRoles.includes(role));
}

/*
 * ============================================================
 * 18. MULTI-ROLE MIDDLEWARE
 * ============================================================
 */

function authorizeAnyRole(...allowedRoles) {
  for (const role of allowedRoles) {
    if (!isValidRole(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!hasAnyUserRole(req.user, allowedRoles)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Insufficient role",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 19. ROLE VS PERMISSION
 * ============================================================
 *
 * Role:
 *
 *     admin
 *
 *
 * Permission:
 *
 *     user:create
 *     user:read
 *     user:update
 *     user:delete
 *
 *
 * Role can group permissions.
 *
 *
 * Example:
 *
 *
 * admin
 *     ↓
 *     user:create
 *     user:read
 *     user:update
 *     user:delete
 *
 *
 * This is why the next topics are:
 *
 *     permissions
 *     RBAC
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. ROLE-BASED ACCESS CONTROL
 * ============================================================
 *
 *
 *             USER
 *               │
 *               ▼
 *              ROLE
 *               │
 *               ▼
 *          PERMISSIONS
 *               │
 *               ▼
 *            RESOURCE
 *
 *
 * Example:
 *
 *
 * Shiva
 *   ↓
 * admin
 *   ↓
 * user:delete
 *   ↓
 * DELETE /users/:id
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. DATABASE DESIGN
 * ============================================================
 *
 * Simple application:
 *
 *
 * User
 * ──────────────────
 * id
 * email
 * passwordHash
 * role
 *
 *
 * Example:
 *
 * {
 *   id: "123",
 *   email: "user@example.com",
 *   role: "admin"
 * }
 *
 *
 * This works well when every user has exactly one role.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. MULTI-ROLE DATABASE DESIGN
 * ============================================================
 *
 * User:
 *
 * {
 *   id: "123",
 *
 *   roles: [
 *     "manager",
 *     "moderator"
 *   ]
 * }
 *
 *
 * This is useful when users can hold multiple roles.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. NEVER TRUST ROLE FROM CLIENT
 * ============================================================
 *
 * DON'T:
 *
 *
 * POST /login
 *
 * {
 *   email: "...",
 *   password: "...",
 *   role: "admin"
 * }
 *
 *
 * and then:
 *
 *
 * req.user.role = req.body.role
 *
 *
 * A client can simply send:
 *
 *
 *     role = "admin"
 *
 *
 * Instead:
 *
 *
 *     database → authenticated identity → role
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. JWT ROLE CLAIM
 * ============================================================
 *
 * A JWT may contain:
 *
 *
 * {
 *   "sub": "user-123",
 *   "roles": ["manager"]
 * }
 *
 *
 * But remember:
 *
 * JWT payloads are normally readable by the client.
 *
 * Therefore don't put secrets inside them.
 *
 *
 * Also consider how role changes are propagated.
 *
 * Example:
 *
 *     User is admin
 *
 *     JWT issued
 *
 *     Admin role removed in database
 *
 *     Existing JWT may still contain:
 *
 *         admin
 *
 * until it expires or is otherwise invalidated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. 401 VS 403
 * ============================================================
 *
 * 401:
 *
 *     Not authenticated.
 *
 * Example:
 *
 *     No valid access token.
 *
 *
 * 403:
 *
 *     Authenticated but not authorized.
 *
 * Example:
 *
 *     user role = "user"
 *
 *     requested admin endpoint.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. AUTHORIZATION PIPELINE
 * ============================================================
 *
 *
 * HTTP Request
 *      │
 *      ▼
 * Authentication
 *      │
 *      ▼
 * req.user
 *      │
 *      ▼
 * Authorization
 *      │
 *      ├── allowed ──→ Controller
 *      │
 *      └── denied ───→ 403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. ROLE MIDDLEWARE USAGE
 * ============================================================
 *
 *
 * app.get(
 *
 *   "/admin",
 *
 *   authenticate,
 *
 *   authorizeRoles(
 *     ROLES.ADMIN
 *   ),
 *
 *   controller
 *
 * );
 *
 *
 * The order matters:
 *
 *
 * authenticate
 *       ↓
 * authorize
 *       ↓
 * controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. SECURITY CHECKLIST
 * ============================================================
 *
 * ✓ Never trust role information directly from the client.
 *
 * ✓ Authenticate before authorizing.
 *
 * ✓ Centralize role definitions.
 *
 * ✓ Return 401 for unauthenticated requests.
 *
 * ✓ Return 403 for insufficient authorization.
 *
 * ✓ Keep authorization logic out of controllers where possible.
 *
 * ✓ Validate configured roles.
 *
 * ✓ Consider role changes when designing JWT lifetimes.
 *
 * ✓ Use permissions when role-based checks become too coarse.
 *
 * ============================================================
 */

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(3000, () => {
  console.log("Authorization roles server running on port 3000");
});

/*
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Authentication identifies the user.
 *
 * 2. Authorization determines what the user can do.
 *
 * 3. A role is a group/category used for authorization.
 *
 * 4. Roles should be defined centrally.
 *
 * 5. Authentication must happen before authorization.
 *
 * 6. Never trust roles supplied directly by the client.
 *
 * 7. 401 means authentication is missing/invalid.
 *
 * 8. 403 means authentication succeeded but authorization
 *    failed.
 *
 * 9. Multiple roles can be represented as an array.
 *
 * 10. Permissions provide finer-grained authorization than
 *     roles alone.
 *
 * 11. RBAC connects users → roles → permissions.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     21_authorization/permissions/
 *
 * We will implement:
 *
 *     permission definitions
 *     permission checks
 *     resource:action format
 *     permission middleware
 *     role → permission mapping
 *
 * ============================================================
 */
