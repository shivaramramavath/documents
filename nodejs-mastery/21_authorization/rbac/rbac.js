/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_authorization/rbac/rbac.js
 *
 * Topic:
 *     Role-Based Access Control (RBAC)
 *
 * ============================================================
 *
 * RBAC
 * ============================================================
 *
 * RBAC means:
 *
 *     Role-Based Access Control
 *
 *
 * Instead of assigning permissions directly to every user:
 *
 *
 *     User → Permissions
 *
 *
 * we use:
 *
 *
 *     User → Roles → Permissions
 *
 *
 * Example:
 *
 *
 *     Shiva
 *       ↓
 *     manager
 *       ↓
 *     timetable:update
 *     timetable:assign
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. ROLES
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
 * 2. RESOURCES
 * ============================================================
 */

const RESOURCES = Object.freeze({
  USER: "user",

  POST: "post",

  ORDER: "order",

  TIMETABLE: "timetable",

  FACULTY: "faculty",

  ROOM: "room",
});

/*
 * ============================================================
 * 3. ACTIONS
 * ============================================================
 */

const ACTIONS = Object.freeze({
  CREATE: "create",

  READ: "read",

  UPDATE: "update",

  DELETE: "delete",

  APPROVE: "approve",

  ASSIGN: "assign",

  PUBLISH: "publish",
});

/*
 * ============================================================
 * 4. PERMISSION FACTORY
 * ============================================================
 */

function permission(resource, action) {
  return `${resource}:${action}`;
}

/*
 * ============================================================
 * 5. PERMISSIONS
 * ============================================================
 */

const PERMISSIONS = Object.freeze({
  USER_CREATE: permission(RESOURCES.USER, ACTIONS.CREATE),

  USER_READ: permission(RESOURCES.USER, ACTIONS.READ),

  USER_UPDATE: permission(RESOURCES.USER, ACTIONS.UPDATE),

  USER_DELETE: permission(RESOURCES.USER, ACTIONS.DELETE),

  POST_CREATE: permission(RESOURCES.POST, ACTIONS.CREATE),

  POST_READ: permission(RESOURCES.POST, ACTIONS.READ),

  POST_UPDATE: permission(RESOURCES.POST, ACTIONS.UPDATE),

  POST_DELETE: permission(RESOURCES.POST, ACTIONS.DELETE),

  POST_PUBLISH: permission(RESOURCES.POST, ACTIONS.PUBLISH),

  ORDER_READ: permission(RESOURCES.ORDER, ACTIONS.READ),

  ORDER_UPDATE: permission(RESOURCES.ORDER, ACTIONS.UPDATE),

  ORDER_APPROVE: permission(RESOURCES.ORDER, ACTIONS.APPROVE),

  TIMETABLE_CREATE: permission(RESOURCES.TIMETABLE, ACTIONS.CREATE),

  TIMETABLE_READ: permission(RESOURCES.TIMETABLE, ACTIONS.READ),

  TIMETABLE_UPDATE: permission(RESOURCES.TIMETABLE, ACTIONS.UPDATE),

  TIMETABLE_DELETE: permission(RESOURCES.TIMETABLE, ACTIONS.DELETE),

  TIMETABLE_ASSIGN: permission(RESOURCES.TIMETABLE, ACTIONS.ASSIGN),

  FACULTY_READ: permission(RESOURCES.FACULTY, ACTIONS.READ),

  FACULTY_CREATE: permission(RESOURCES.FACULTY, ACTIONS.CREATE),

  FACULTY_UPDATE: permission(RESOURCES.FACULTY, ACTIONS.UPDATE),

  ROOM_READ: permission(RESOURCES.ROOM, ACTIONS.READ),

  ROOM_CREATE: permission(RESOURCES.ROOM, ACTIONS.CREATE),

  ROOM_UPDATE: permission(RESOURCES.ROOM, ACTIONS.UPDATE),
});

/*
 * ============================================================
 * 6. ROLE → PERMISSIONS
 * ============================================================
 *
 * This is the heart of RBAC.
 *
 *
 * USER
 * └── basic read/create access
 *
 *
 * MODERATOR
 * └── user + post moderation
 *
 *
 * MANAGER
 * └── management operations
 *
 *
 * ADMIN
 * └── everything
 *
 * ============================================================
 */

const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.USER]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.ORDER_READ,

    PERMISSIONS.TIMETABLE_READ,

    PERMISSIONS.FACULTY_READ,

    PERMISSIONS.ROOM_READ,
  ],

  [ROLES.MODERATOR]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.POST_UPDATE,

    PERMISSIONS.POST_DELETE,

    PERMISSIONS.POST_PUBLISH,

    PERMISSIONS.ORDER_READ,

    PERMISSIONS.TIMETABLE_READ,

    PERMISSIONS.FACULTY_READ,

    PERMISSIONS.ROOM_READ,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.USER_UPDATE,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.POST_UPDATE,

    PERMISSIONS.POST_DELETE,

    PERMISSIONS.POST_PUBLISH,

    PERMISSIONS.ORDER_READ,

    PERMISSIONS.ORDER_UPDATE,

    PERMISSIONS.ORDER_APPROVE,

    PERMISSIONS.TIMETABLE_CREATE,

    PERMISSIONS.TIMETABLE_READ,

    PERMISSIONS.TIMETABLE_UPDATE,

    PERMISSIONS.TIMETABLE_ASSIGN,

    PERMISSIONS.FACULTY_READ,

    PERMISSIONS.FACULTY_CREATE,

    PERMISSIONS.FACULTY_UPDATE,

    PERMISSIONS.ROOM_READ,

    PERMISSIONS.ROOM_CREATE,

    PERMISSIONS.ROOM_UPDATE,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),
});

/*
 * ============================================================
 * 7. VALIDATE ROLE
 * ============================================================
 */

function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/*
 * ============================================================
 * 8. GET ROLE PERMISSIONS
 * ============================================================
 */

function getRolePermissions(role) {
  if (!isValidRole(role)) {
    throw new Error(`Invalid role: ${role}`);
  }

  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

/*
 * ============================================================
 * 9. GET EFFECTIVE PERMISSIONS
 * ============================================================
 *
 * A user can have multiple roles.
 *
 *
 * Example:
 *
 *
 * user.roles = [
 *     "manager",
 *     "moderator"
 * ]
 *
 *
 * Effective permissions are the UNION of all permissions.
 *
 * ============================================================
 */

function getEffectivePermissions(user) {
  if (!user || !Array.isArray(user.roles)) {
    return [];
  }

  const permissions = new Set();

  for (const role of user.roles) {
    if (!isValidRole(role)) {
      continue;
    }

    const rolePermissions = getRolePermissions(role);

    for (const permission of rolePermissions) {
      permissions.add(permission);
    }
  }

  return [...permissions];
}

/*
 * ============================================================
 * 10. CHECK EFFECTIVE PERMISSION
 * ============================================================
 */

function hasPermission(user, requiredPermission) {
  const effectivePermissions = getEffectivePermissions(user);

  return effectivePermissions.includes(requiredPermission);
}

/*
 * ============================================================
 * 11. CHECK ANY PERMISSION
 * ============================================================
 */

function hasAnyPermission(user, requiredPermissions) {
  const effectivePermissions = new Set(getEffectivePermissions(user));

  return requiredPermissions.some((permission) =>
    effectivePermissions.has(permission),
  );
}

/*
 * ============================================================
 * 12. CHECK ALL PERMISSIONS
 * ============================================================
 */

function hasAllPermissions(user, requiredPermissions) {
  const effectivePermissions = new Set(getEffectivePermissions(user));

  return requiredPermissions.every((permission) =>
    effectivePermissions.has(permission),
  );
}

/*
 * ============================================================
 * 13. CHECK ROLE
 * ============================================================
 */

function hasRole(user, role) {
  return Array.isArray(user?.roles) && user.roles.includes(role);
}

/*
 * ============================================================
 * 14. CHECK ANY ROLE
 * ============================================================
 */

function hasAnyRole(user, roles) {
  if (!Array.isArray(user?.roles)) {
    return false;
  }

  return roles.some((role) => user.roles.includes(role));
}

/*
 * ============================================================
 * 15. EXAMPLE USERS
 * ============================================================
 */

const users = [
  {
    id: "user-1",

    name: "Regular User",

    roles: [ROLES.USER],
  },

  {
    id: "user-2",

    name: "Moderator",

    roles: [ROLES.MODERATOR],
  },

  {
    id: "user-3",

    name: "Timetable Manager",

    roles: [ROLES.MANAGER],
  },

  {
    id: "user-4",

    name: "Manager + Moderator",

    roles: [ROLES.MANAGER, ROLES.MODERATOR],
  },

  {
    id: "user-5",

    name: "Administrator",

    roles: [ROLES.ADMIN],
  },
];

/*
 * ============================================================
 * 16. DISPLAY EFFECTIVE PERMISSIONS
 * ============================================================
 */

for (const user of users) {
  console.log(`\nUser: ${user.name}`);

  console.log("Roles:", user.roles);

  console.log("Effective permissions:", getEffectivePermissions(user));
}

/*
 * ============================================================
 * 17. EXAMPLE AUTHORIZATION
 * ============================================================
 */

const manager = users.find((user) => user.id === "user-3");

console.log(
  "\nManager can update timetable:",
  hasPermission(manager, PERMISSIONS.TIMETABLE_UPDATE),
);

console.log(
  "Manager can delete user:",
  hasPermission(manager, PERMISSIONS.USER_DELETE),
);

console.log(
  "Manager can assign timetable:",
  hasPermission(manager, PERMISSIONS.TIMETABLE_ASSIGN),
);

/*
 * ============================================================
 * 18. ROLE → PERMISSION RESOLUTION
 * ============================================================
 *
 *
 * manager
 *    │
 *    ├── user:read
 *    ├── user:update
 *    ├── timetable:create
 *    ├── timetable:read
 *    ├── timetable:update
 *    ├── timetable:assign
 *    ├── faculty:read
 *    ├── faculty:create
 *    └── ...
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. MULTIPLE ROLES
 * ============================================================
 *
 * Example:
 *
 *
 * user.roles = [
 *     "manager",
 *     "moderator"
 * ]
 *
 *
 * manager:
 *
 *     user:read
 *     user:update
 *     timetable:update
 *
 *
 * moderator:
 *
 *     post:delete
 *     post:publish
 *
 *
 * Effective:
 *
 *     user:read
 *     user:update
 *     timetable:update
 *     post:delete
 *     post:publish
 *
 *
 * Set() prevents duplicates.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. EXPRESS MIDDLEWARE
 * ============================================================
 */

function requirePermission(requiredPermission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!hasPermission(req.user, requiredPermission)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Insufficient permissions",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 21. REQUIRE ROLE
 * ============================================================
 */

function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!hasRole(req.user, requiredRole)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Required role is missing",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 22. PERMISSION-FIRST AUTHORIZATION
 * ============================================================
 *
 * Prefer:
 *
 *
 *     requirePermission(
 *       PERMISSIONS.TIMETABLE_UPDATE
 *     )
 *
 *
 * instead of:
 *
 *
 *     requireRole(
 *       ROLES.MANAGER
 *     )
 *
 *
 * when the endpoint cares about the actual capability.
 *
 *
 * Why?
 *
 * Suppose:
 *
 *
 * manager
 *     → timetable:update
 *
 * admin
 *     → timetable:update
 *
 *
 * The endpoint doesn't need to know about the roles.
 *
 * It only needs:
 *
 *
 *     timetable:update
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. EXPRESS EXAMPLE
 * ============================================================
 */

import express from "express";

const app = express();

/*
 * Authentication would normally happen before this.
 *
 * Example:
 *
 *     req.user = {
 *       id: "user-3",
 *       roles: ["manager"]
 *     };
 */

/*
 * ============================================================
 * 24. ROLE-BASED ENDPOINT
 * ============================================================
 */

app.get("/api/v1/admin", requireRole(ROLES.ADMIN), (req, res) => {
  res.json({
    message: "Admin endpoint",
  });
});

/*
 * ============================================================
 * 25. PERMISSION-BASED ENDPOINT
 * ============================================================
 */

app.patch(
  "/api/v1/timetables/:id",
  requirePermission(PERMISSIONS.TIMETABLE_UPDATE),
  (req, res) => {
    res.json({
      message: "Timetable updated",
    });
  },
);

/*
 * ============================================================
 * 26. RBAC REQUEST FLOW
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ Authorization: Bearer JWT
 *   ▼
 *
 * Authentication Middleware
 *   │
 *   │ verify token
 *   ▼
 *
 * req.user
 *
 * {
 *   id: "user-3",
 *   roles: ["manager"]
 * }
 *
 *   │
 *   ▼
 *
 * RBAC
 *
 * manager
 *   │
 *   ▼
 *
 * Role Permissions
 *   │
 *   ▼
 *
 * effectivePermissions
 *
 *   │
 *   ▼
 *
 * Check:
 *
 * timetable:update
 *
 *   │
 *   ├── YES → Controller
 *   │
 *   └── NO  → 403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. DON'T PUT ALL AUTHORIZATION IN CONTROLLERS
 * ============================================================
 *
 * BAD:
 *
 *
 * async function updateTimetable(
 *   req,
 *   res,
 * ) {
 *
 *   if (
 *     req.user.role !== "manager" &&
 *     req.user.role !== "admin"
 *   ) {
 *
 *     return res.status(403)...
 *   }
 *
 *   ...
 * }
 *
 *
 * This spreads authorization logic throughout the application.
 *
 *
 * Better:
 *
 *
 * app.patch(
 *   "/timetables/:id",
 *
 *   authenticate,
 *
 *   requirePermission(
 *     "timetable:update"
 *   ),
 *
 *   updateTimetable
 * );
 *
 *
 * Authorization becomes declarative.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. ROLE HIERARCHY IS OPTIONAL
 * ============================================================
 *
 * RBAC does NOT require:
 *
 *
 * admin > manager > user
 *
 *
 * You can have completely independent roles:
 *
 *
 * scheduler
 * accountant
 * auditor
 * support
 *
 *
 * Example:
 *
 *
 * scheduler
 *     → timetable:update
 *
 *
 * accountant
 *     → order:approve
 *
 *
 * auditor
 *     → order:read
 *
 *
 * There is no need for:
 *
 *
 * accountant > scheduler
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. SEPARATION OF CONCERNS
 * ============================================================
 *
 *
 * Authentication
 *     │
 *     └── Who is this?
 *
 *
 * User
 *     │
 *     └── roles
 *
 *
 * RBAC
 *     │
 *     └── role → permissions
 *
 *
 * Authorization
 *     │
 *     └── is permission allowed?
 *
 *
 * Controller
 *     │
 *     └── execute business operation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. DATABASE VERSION
 * ============================================================
 *
 * Production systems commonly store:
 *
 *
 * User
 * ─────────────────────────
 * _id
 * email
 * passwordHash
 * roles: ["manager"]
 *
 *
 * Role
 * ─────────────────────────
 * _id
 * name
 * permissions: [
 *   "timetable:update",
 *   "timetable:assign"
 * ]
 *
 *
 * This allows roles and permissions to be managed without
 * changing application code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CACHE CONSIDERATIONS
 * ============================================================
 *
 * Permission resolution can involve database queries.
 *
 *
 * For example:
 *
 *
 * request
 *   ↓
 * user
 *   ↓
 * roles
 *   ↓
 * role permissions
 *
 *
 * Doing this on every request can be expensive.
 *
 *
 * Redis can cache:
 *
 *
 *     user:123:permissions
 *
 *
 * Example:
 *
 *
 * {
 *   "permissions": [
 *     "user:read",
 *     "timetable:update"
 *   ]
 * }
 *
 *
 * But when permissions change, the cache must be invalidated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. JWT + RBAC
 * ============================================================
 *
 * A JWT might contain:
 *
 *
 * {
 *   "sub": "user-123",
 *   "roles": [
 *     "manager"
 *   ]
 * }
 *
 *
 * Then:
 *
 *
 * JWT
 *  ↓
 * user identity
 *  ↓
 * roles
 *  ↓
 * RBAC
 *  ↓
 * permissions
 *
 *
 * Another approach is putting permissions directly in the JWT.
 *
 *
 * But that increases token size and creates stale-permission
 * concerns when permissions change.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. ROLE REVOCATION PROBLEM
 * ============================================================
 *
 * Example:
 *
 *
 * 10:00
 *
 * User:
 *
 *     role = admin
 *
 *
 * 10:01
 *
 * JWT issued.
 *
 *
 * 10:05
 *
 * Admin role removed.
 *
 *
 * Existing JWT may still contain:
 *
 *     admin
 *
 *
 * Therefore production systems need a strategy for:
 *
 *
 *     token expiration
 *     refresh token rotation
 *     token revocation
 *     authorization cache invalidation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. AUDITING
 * ============================================================
 *
 * Sensitive authorization decisions should often be auditable.
 *
 *
 * Example:
 *
 *
 * user:123
 * action:user:delete
 * resource:user:456
 * result:allowed
 * timestamp:...
 *
 *
 * Especially important for:
 *
 *
 *     user deletion
 *     permission changes
 *     role changes
 *     financial operations
 *     administrative actions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. RBAC VS ACL
 * ============================================================
 *
 * RBAC:
 *
 *     User
 *       ↓
 *     Role
 *       ↓
 *     Permission
 *
 *
 * ACL-style:
 *
 *     User
 *       ↓
 *     Resource
 *       ↓
 *     Access rule
 *
 *
 * RBAC is excellent for organizational roles.
 *
 * ACL/resource-level authorization becomes useful when access
 * depends on the specific resource.
 *
 *
 * Example:
 *
 *
 * Manager can update timetables.
 *
 * But:
 *
 *     Manager A
 *         → can update timetable 1
 *
 *     Manager B
 *         → can update timetable 2
 *
 *
 * This requires more than simple RBAC.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. RBAC LIMITATION
 * ============================================================
 *
 * RBAC answers:
 *
 *
 *     "Does this role have this permission?"
 *
 *
 * It does NOT automatically answer:
 *
 *
 *     "Can this particular user modify THIS particular
 *      timetable?"
 *
 *
 * For that we need resource-level / policy-based checks.
 *
 *
 * Example:
 *
 *
 *     timetable:update
 *
 * AND
 *
 *     timetable.departmentId === user.departmentId
 *
 *
 * This is where more advanced authorization models become useful.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. COMPLETE RBAC ARCHITECTURE
 * ============================================================
 *
 *
 *                    ┌──────────────┐
 *                    │    USER      │
 *                    └──────┬───────┘
 *                           │
 *                           │ roles[]
 *                           ▼
 *                    ┌──────────────┐
 *                    │    ROLES     │
 *                    └──────┬───────┘
 *                           │
 *                           │ permissions[]
 *                           ▼
 *                    ┌──────────────┐
 *                    │ PERMISSIONS  │
 *                    └──────┬───────┘
 *                           │
 *                           ▼
 *                    ┌──────────────┐
 *                    │ AUTHORIZATION│
 *                    └──────┬───────┘
 *                           │
 *                    ┌──────┴───────┐
 *                    ▼              ▼
 *                  ALLOW           DENY
 *                    │              │
 *                    ▼              ▼
 *               Controller         403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. RBAC means Role-Based Access Control.
 *
 * 2. The basic relationship is:
 *
 *       User → Role → Permission
 *
 * 3. A user can have multiple roles.
 *
 * 4. Effective permissions are the union of permissions from
 *    all assigned roles.
 *
 * 5. Set is useful for removing duplicate permissions.
 *
 * 6. Authorization middleware should normally run after
 *    authentication middleware.
 *
 * 7. Prefer permission checks when endpoints care about
 *    capabilities rather than job titles.
 *
 * 8. Role hierarchy is optional.
 *
 * 9. RBAC does not solve every resource-level authorization
 *    problem.
 *
 * 10. Permission caching requires proper invalidation.
 *
 * 11. JWT-based roles/permissions can become stale.
 *
 * 12. Sensitive authorization operations should be auditable.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     21_authorization/middleware.js
 *
 * We will build the reusable authorization middleware layer:
 *
 *     authenticate
 *     requireRole
 *     requireAnyRole
 *     requirePermission
 *     requireAnyPermission
 *     requireAllPermissions
 *
 * ============================================================
 */
