/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_authorization/permissions/permissions.js
 *
 * Topic:
 *     Authorization - Permissions
 *
 * ============================================================
 *
 * ROLE vs PERMISSION
 * ============================================================
 *
 * ROLE:
 *
 *     admin
 *
 *
 * PERMISSION:
 *
 *     user:create
 *     user:read
 *     user:update
 *     user:delete
 *
 *
 * A role is a collection of permissions.
 *
 * ============================================================
 *
 * AUTHORIZATION MODEL
 * ============================================================
 *
 *
 *       USER
 *         │
 *         ▼
 *        ROLE
 *         │
 *         ▼
 *    PERMISSIONS
 *         │
 *         ▼
 *      RESOURCE
 *         │
 *         ▼
 *       ACTION
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

import express from "express";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * 1. RESOURCES
 * ============================================================
 *
 * A resource is something our application manages.
 *
 * Examples:
 *
 *     users
 *     posts
 *     products
 *     orders
 *     timetables
 *
 * ============================================================
 */

const RESOURCES = Object.freeze({
  USER: "user",

  POST: "post",

  PRODUCT: "product",

  ORDER: "order",

  TIMETABLE: "timetable",
});

/*
 * ============================================================
 * 2. ACTIONS
 * ============================================================
 *
 * Common CRUD actions:
 *
 *     create
 *     read
 *     update
 *     delete
 *
 * Additional actions can exist:
 *
 *     publish
 *     approve
 *     export
 *     assign
 *
 * ============================================================
 */

const ACTIONS = Object.freeze({
  CREATE: "create",

  READ: "read",

  UPDATE: "update",

  DELETE: "delete",

  PUBLISH: "publish",

  APPROVE: "approve",

  EXPORT: "export",

  ASSIGN: "assign",
});

/*
 * ============================================================
 * 3. PERMISSION FACTORY
 * ============================================================
 *
 * Instead of manually writing:
 *
 *     "user:create"
 *
 * we can generate it consistently.
 *
 * ============================================================
 */

function createPermission(resource, action) {
  return `${resource}:${action}`;
}

/*
 * ============================================================
 * 4. PERMISSION DEFINITIONS
 * ============================================================
 */

const PERMISSIONS = Object.freeze({
  USER_CREATE: createPermission(RESOURCES.USER, ACTIONS.CREATE),

  USER_READ: createPermission(RESOURCES.USER, ACTIONS.READ),

  USER_UPDATE: createPermission(RESOURCES.USER, ACTIONS.UPDATE),

  USER_DELETE: createPermission(RESOURCES.USER, ACTIONS.DELETE),

  POST_CREATE: createPermission(RESOURCES.POST, ACTIONS.CREATE),

  POST_READ: createPermission(RESOURCES.POST, ACTIONS.READ),

  POST_UPDATE: createPermission(RESOURCES.POST, ACTIONS.UPDATE),

  POST_DELETE: createPermission(RESOURCES.POST, ACTIONS.DELETE),

  POST_PUBLISH: createPermission(RESOURCES.POST, ACTIONS.PUBLISH),

  PRODUCT_READ: createPermission(RESOURCES.PRODUCT, ACTIONS.READ),

  PRODUCT_UPDATE: createPermission(RESOURCES.PRODUCT, ACTIONS.UPDATE),

  ORDER_READ: createPermission(RESOURCES.ORDER, ACTIONS.READ),

  ORDER_UPDATE: createPermission(RESOURCES.ORDER, ACTIONS.UPDATE),

  ORDER_APPROVE: createPermission(RESOURCES.ORDER, ACTIONS.APPROVE),

  TIMETABLE_READ: createPermission(RESOURCES.TIMETABLE, ACTIONS.READ),

  TIMETABLE_CREATE: createPermission(RESOURCES.TIMETABLE, ACTIONS.CREATE),

  TIMETABLE_UPDATE: createPermission(RESOURCES.TIMETABLE, ACTIONS.UPDATE),

  TIMETABLE_DELETE: createPermission(RESOURCES.TIMETABLE, ACTIONS.DELETE),

  TIMETABLE_ASSIGN: createPermission(RESOURCES.TIMETABLE, ACTIONS.ASSIGN),
});

/*
 * ============================================================
 * 5. GET ALL PERMISSIONS
 * ============================================================
 */

const ALL_PERMISSIONS = Object.freeze(Object.values(PERMISSIONS));

/*
 * ============================================================
 * 6. CHECK VALID PERMISSION
 * ============================================================
 */

function isValidPermission(permission) {
  return ALL_PERMISSIONS.includes(permission);
}

/*
 * ============================================================
 * 7. CHECK USER PERMISSION
 * ============================================================
 *
 * User example:
 *
 * {
 *   id: "user-123",
 *   permissions: [
 *     "user:read",
 *     "post:create"
 *   ]
 * }
 *
 * ============================================================
 */

function hasPermission(user, permission) {
  if (!user || !isValidPermission(permission)) {
    return false;
  }

  return (
    Array.isArray(user.permissions) && user.permissions.includes(permission)
  );
}

/*
 * ============================================================
 * 8. CHECK ANY PERMISSION
 * ============================================================
 *
 * Example:
 *
 *     user:read
 *
 * OR
 *
 *     user:update
 *
 * ============================================================
 */

function hasAnyPermission(user, permissions) {
  if (!user || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.some((permission) => hasPermission(user, permission));
}

/*
 * ============================================================
 * 9. CHECK ALL PERMISSIONS
 * ============================================================
 *
 * Example:
 *
 * User must have BOTH:
 *
 *     timetable:update
 *     timetable:assign
 *
 * ============================================================
 */

function hasAllPermissions(user, permissions) {
  if (!user || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.every((permission) => hasPermission(user, permission));
}

/*
 * ============================================================
 * 10. EXAMPLE USERS
 * ============================================================
 */

const users = [
  {
    id: "user-1",

    name: "Regular User",

    permissions: [
      PERMISSIONS.USER_READ,

      PERMISSIONS.POST_READ,

      PERMISSIONS.POST_CREATE,

      PERMISSIONS.ORDER_READ,

      PERMISSIONS.TIMETABLE_READ,
    ],
  },

  {
    id: "user-2",

    name: "Content Manager",

    permissions: [
      PERMISSIONS.USER_READ,

      PERMISSIONS.POST_CREATE,

      PERMISSIONS.POST_READ,

      PERMISSIONS.POST_UPDATE,

      PERMISSIONS.POST_DELETE,

      PERMISSIONS.POST_PUBLISH,
    ],
  },

  {
    id: "user-3",

    name: "Timetable Manager",

    permissions: [
      PERMISSIONS.TIMETABLE_READ,

      PERMISSIONS.TIMETABLE_CREATE,

      PERMISSIONS.TIMETABLE_UPDATE,

      PERMISSIONS.TIMETABLE_DELETE,

      PERMISSIONS.TIMETABLE_ASSIGN,
    ],
  },

  {
    id: "user-4",

    name: "Administrator",

    permissions: ALL_PERMISSIONS,
  },
];

/*
 * ============================================================
 * 11. AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * This is only a demonstration.
 *
 * Real application:
 *
 *     Authorization: Bearer <JWT>
 *
 *     ↓
 *
 *     verify JWT
 *
 *     ↓
 *
 *     req.user
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

  req.user = user;

  next();
}

/*
 * ============================================================
 * 12. PERMISSION MIDDLEWARE
 * ============================================================
 *
 * Usage:
 *
 *     authorizePermission(
 *       PERMISSIONS.USER_DELETE
 *     )
 *
 * ============================================================
 */

function authorizePermission(requiredPermission) {
  /*
   * Validate authorization configuration.
   */

  if (!isValidPermission(requiredPermission)) {
    throw new Error(`Invalid permission configured: ${requiredPermission}`);
  }

  return (req, res, next) => {
    /*
     * Authentication must happen first.
     */

    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    /*
     * Check permission.
     */

    if (!hasPermission(req.user, requiredPermission)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "You do not have the required permission",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 13. ANY-PERMISSION MIDDLEWARE
 * ============================================================
 *
 * User needs at least ONE permission.
 *
 * ============================================================
 */

function authorizeAnyPermission(...requiredPermissions) {
  for (const permission of requiredPermissions) {
    if (!isValidPermission(permission)) {
      throw new Error(`Invalid permission configured: ${permission}`);
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

    if (!hasAnyPermission(req.user, requiredPermissions)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "None of the required permissions are available",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 14. ALL-PERMISSION MIDDLEWARE
 * ============================================================
 *
 * User must have EVERY specified permission.
 *
 * ============================================================
 */

function authorizeAllPermissions(...requiredPermissions) {
  for (const permission of requiredPermissions) {
    if (!isValidPermission(permission)) {
      throw new Error(`Invalid permission configured: ${permission}`);
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

    if (!hasAllPermissions(req.user, requiredPermissions)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "All required permissions are not available",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 15. READ USER
 * ============================================================
 */

app.get(
  "/api/v1/users",
  authenticate,

  authorizePermission(PERMISSIONS.USER_READ),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Users can be read",
      },
    });
  },
);

/*
 * ============================================================
 * 16. DELETE USER
 * ============================================================
 */

app.delete(
  "/api/v1/users/:id",
  authenticate,

  authorizePermission(PERMISSIONS.USER_DELETE),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "User can be deleted",

        userId: req.params.id,
      },
    });
  },
);

/*
 * ============================================================
 * 17. PUBLISH POST
 * ============================================================
 */

app.post(
  "/api/v1/posts/:id/publish",
  authenticate,

  authorizePermission(PERMISSIONS.POST_PUBLISH),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Post can be published",

        postId: req.params.id,
      },
    });
  },
);

/*
 * ============================================================
 * 18. UPDATE TIMETABLE
 * ============================================================
 */

app.patch(
  "/api/v1/timetables/:id",
  authenticate,

  authorizePermission(PERMISSIONS.TIMETABLE_UPDATE),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Timetable can be updated",

        timetableId: req.params.id,
      },
    });
  },
);

/*
 * ============================================================
 * 19. ASSIGN TIMETABLE
 * ============================================================
 *
 * Updating and assigning are different permissions.
 *
 * A manager might be allowed to edit timetable metadata but
 * not assign faculty/resources.
 *
 * ============================================================
 */

app.post(
  "/api/v1/timetables/:id/assign",
  authenticate,

  authorizePermission(PERMISSIONS.TIMETABLE_ASSIGN),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Timetable assignment allowed",

        timetableId: req.params.id,
      },
    });
  },
);

/*
 * ============================================================
 * 20. ANY PERMISSION EXAMPLE
 * ============================================================
 *
 * The user needs either:
 *
 *     post:update
 *
 * OR
 *
 *     post:publish
 *
 * ============================================================
 */

app.patch(
  "/api/v1/posts/:id",
  authenticate,

  authorizeAnyPermission(PERMISSIONS.POST_UPDATE, PERMISSIONS.POST_PUBLISH),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "At least one required permission exists",
      },
    });
  },
);

/*
 * ============================================================
 * 21. ALL PERMISSIONS EXAMPLE
 * ============================================================
 *
 * The user must have BOTH:
 *
 *     timetable:update
 *
 * AND
 *
 *     timetable:assign
 *
 * ============================================================
 */

app.patch(
  "/api/v1/timetables/:id/assignments",
  authenticate,

  authorizeAllPermissions(
    PERMISSIONS.TIMETABLE_UPDATE,
    PERMISSIONS.TIMETABLE_ASSIGN,
  ),

  (req, res) => {
    return res.status(200).json({
      data: {
        message: "Both timetable permissions are available",
      },
    });
  },
);

/*
 * ============================================================
 * 22. WILDCARD PERMISSIONS
 * ============================================================
 *
 * Some systems support:
 *
 *
 *     user:*
 *
 *
 * meaning:
 *
 *
 *     user:create
 *     user:read
 *     user:update
 *     user:delete
 *
 *
 * all become allowed.
 *
 *
 * This can simplify authorization but must be implemented
 * carefully.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. WILDCARD CHECK
 * ============================================================
 */

function hasPermissionWithWildcard(user, permission) {
  if (!user || !Array.isArray(user.permissions)) {
    return false;
  }

  /*
   * Exact permission.
   */

  if (user.permissions.includes(permission)) {
    return true;
  }

  /*
   * Convert:
   *
   *     user:delete
   *
   * into:
   *
   *     user:*
   */

  const separatorIndex = permission.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const resource = permission.slice(0, separatorIndex);

  const wildcard = `${resource}:*`;

  return user.permissions.includes(wildcard);
}

/*
 * ============================================================
 * 24. RESOURCE/ACTION PARSING
 * ============================================================
 */

function parsePermission(permission) {
  const [resource, action] = permission.split(":");

  return {
    resource,
    action,
  };
}

/*
 * Example:
 *
 *
 * parsePermission(
 *   "user:delete"
 * );
 *
 *
 * Result:
 *
 * {
 *   resource: "user",
 *   action: "delete"
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. PERMISSION NAMING CONVENTION
 * ============================================================
 *
 * Recommended:
 *
 *
 *     resource:action
 *
 *
 * Examples:
 *
 *     user:create
 *     user:read
 *     user:update
 *     user:delete
 *
 *     post:create
 *     post:publish
 *
 *     timetable:assign
 *
 *
 * Keep permission names:
 *
 *     predictable
 *     consistent
 *     machine-readable
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. ROLE → PERMISSION
 * ============================================================
 *
 * Permissions normally should not be manually assigned to every
 * user.
 *
 * Instead:
 *
 *
 *     ROLE
 *       │
 *       ▼
 *     PERMISSIONS
 *
 *
 * Example:
 *
 *
 * USER
 * ├── user:read
 * ├── post:read
 * └── order:read
 *
 *
 * MANAGER
 * ├── user:read
 * ├── post:create
 * ├── post:update
 * ├── order:read
 * └── order:approve
 *
 *
 * ADMIN
 * └── all permissions
 *
 *
 * This mapping is the foundation of RBAC.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. DIRECT USER PERMISSIONS
 * ============================================================
 *
 * Sometimes an individual user needs an exception.
 *
 *
 * Example:
 *
 *
 * Role:
 *
 *     user
 *
 *
 * Additional permission:
 *
 *     report:export
 *
 *
 * This can be modeled as:
 *
 *
 * user.roles
 *
 * user.permissions
 *
 *
 * But be careful.
 *
 * Excessive direct permissions can make authorization difficult
 * to understand and audit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. DATABASE DESIGN
 * ============================================================
 *
 * Simple design:
 *
 *
 * User
 * ──────────────────
 * id
 * email
 * role
 *
 *
 * Role
 * ──────────────────
 * id
 * name
 *
 *
 * Permission
 * ──────────────────
 * id
 * resource
 * action
 *
 *
 * RolePermission
 * ──────────────────
 * roleId
 * permissionId
 *
 *
 * Relationship:
 *
 *
 * User
 *   │
 *   ▼
 * Role
 *   │
 *   ▼
 * RolePermission
 *   │
 *   ▼
 * Permission
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. MONGODB-STYLE DOCUMENT
 * ============================================================
 *
 * User:
 *
 * {
 *   "_id": "user-123",
 *   "email": "user@example.com",
 *   "roles": [
 *     "manager"
 *   ]
 * }
 *
 *
 * Role:
 *
 * {
 *   "name": "manager",
 *
 *   "permissions": [
 *     "user:read",
 *     "post:create",
 *     "post:update",
 *     "order:read",
 *     "order:approve"
 *   ]
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. EFFECTIVE PERMISSIONS
 * ============================================================
 *
 * A user's effective permissions can be calculated from all of
 * their roles.
 *
 *
 * Example:
 *
 *
 * User:
 *
 *     roles:
 *       manager
 *       moderator
 *
 *
 * manager permissions:
 *
 *     user:read
 *     order:approve
 *
 *
 * moderator permissions:
 *
 *     post:delete
 *     post:publish
 *
 *
 * Effective permissions:
 *
 *     user:read
 *     order:approve
 *     post:delete
 *     post:publish
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. WHY PERMISSIONS ARE BETTER THAN ONLY ROLES
 * ============================================================
 *
 * Without permissions:
 *
 *
 *     if (user.role === "admin")
 *
 *
 * Controllers become full of role checks.
 *
 *
 * With permissions:
 *
 *
 *     authorizePermission(
 *       PERMISSIONS.USER_DELETE
 *     )
 *
 *
 * The route describes exactly what it requires.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. 401 VS 403
 * ============================================================
 *
 * 401:
 *
 *     User is not authenticated.
 *
 *
 * 403:
 *
 *     User is authenticated but lacks the permission.
 *
 *
 * Example:
 *
 *
 * GET /users
 *
 * No token
 *     → 401
 *
 *
 * Valid token + no user:read
 *     → 403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. AUTHORIZATION PIPELINE
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
 * Permission Check
 *      │
 *      ├── allowed ──→ Controller
 *      │
 *      └── denied ───→ 403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. SECURITY CHECKLIST
 * ============================================================
 *
 * ✓ Never trust permissions sent by the client.
 *
 * ✓ Authenticate before authorizing.
 *
 * ✓ Centralize permission definitions.
 *
 * ✓ Use consistent resource:action naming.
 *
 * ✓ Validate permissions when configuring middleware.
 *
 * ✓ Return 401 when authentication is missing/invalid.
 *
 * ✓ Return 403 when authorization fails.
 *
 * ✓ Avoid excessive direct user permissions.
 *
 * ✓ Audit sensitive permissions such as:
 *
 *       user:delete
 *       role:update
 *       permission:update
 *
 * ✓ Consider caching effective permissions carefully.
 *
 * ✓ Invalidate authorization caches when roles/permissions
 *   change.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. A role is a collection/category of access rules.
 *
 * 2. A permission represents a specific allowed action.
 *
 * 3. Use resource:action naming.
 *
 * 4. Example:
 *
 *       user:delete
 *
 * 5. Authentication identifies the user.
 *
 * 6. Authorization checks permissions.
 *
 * 7. Middleware is a good place to enforce permissions.
 *
 * 8. "ANY" and "ALL" permission checks solve different
 *    authorization requirements.
 *
 * 9. Roles can map to many permissions.
 *
 * 10. Users can have multiple roles.
 *
 * 11. Effective permissions are the union of permissions
 *     provided by the user's roles.
 *
 * 12. Permissions provide finer-grained control than roles.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     21_authorization/rbac/
 *
 * We will combine:
 *
 *     users
 *       ↓
 *     roles
 *       ↓
 *     permissions
 *
 * into a complete RBAC implementation.
 *
 * ============================================================
 */
