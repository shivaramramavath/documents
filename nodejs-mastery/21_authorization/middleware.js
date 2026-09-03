/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_authorization/middleware.js
 *
 * Topic:
 *     Authorization Middleware
 *
 * ============================================================
 *
 * RESPONSIBILITY
 * ============================================================
 *
 * This file provides reusable middleware for:
 *
 *     authentication
 *     role authorization
 *     permission authorization
 *
 *
 * Request flow:
 *
 *
 * Client
 *   │
 *   ▼
 * authenticate
 *   │
 *   ▼
 * req.user
 *   │
 *   ▼
 * authorization middleware
 *   │
 *   ├── allowed ──→ controller
 *   │
 *   └── denied ───→ 403
 *
 * ============================================================
 */

import jwt from "jsonwebtoken";

/*
 * ============================================================
 * 1. ROLE DEFINITIONS
 * ============================================================
 */

export const ROLES = Object.freeze({
  USER: "user",

  MODERATOR: "moderator",

  MANAGER: "manager",

  ADMIN: "admin",
});

/*
 * ============================================================
 * 2. PERMISSION DEFINITIONS
 * ============================================================
 */

export const PERMISSIONS = Object.freeze({
  USER_READ: "user:read",

  USER_CREATE: "user:create",

  USER_UPDATE: "user:update",

  USER_DELETE: "user:delete",

  POST_READ: "post:read",

  POST_CREATE: "post:create",

  POST_UPDATE: "post:update",

  POST_DELETE: "post:delete",

  POST_PUBLISH: "post:publish",

  TIMETABLE_READ: "timetable:read",

  TIMETABLE_CREATE: "timetable:create",

  TIMETABLE_UPDATE: "timetable:update",

  TIMETABLE_DELETE: "timetable:delete",

  TIMETABLE_ASSIGN: "timetable:assign",
});

/*
 * ============================================================
 * 3. ROLE → PERMISSIONS
 * ============================================================
 */

const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.USER]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.TIMETABLE_READ,
  ],

  [ROLES.MODERATOR]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.POST_UPDATE,

    PERMISSIONS.POST_DELETE,

    PERMISSIONS.POST_PUBLISH,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.USER_READ,

    PERMISSIONS.USER_UPDATE,

    PERMISSIONS.POST_READ,

    PERMISSIONS.POST_CREATE,

    PERMISSIONS.POST_UPDATE,

    PERMISSIONS.POST_DELETE,

    PERMISSIONS.POST_PUBLISH,

    PERMISSIONS.TIMETABLE_READ,

    PERMISSIONS.TIMETABLE_CREATE,

    PERMISSIONS.TIMETABLE_UPDATE,

    PERMISSIONS.TIMETABLE_ASSIGN,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),
});

/*
 * ============================================================
 * 4. GET EFFECTIVE PERMISSIONS
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
 * Effective permissions:
 *
 *     manager permissions
 *              +
 *     moderator permissions
 *
 * ============================================================
 */

export function getEffectivePermissions(user) {
  if (!user || !Array.isArray(user.roles)) {
    return [];
  }

  const permissions = new Set();

  for (const role of user.roles) {
    const rolePermissions = ROLE_PERMISSIONS[role];

    if (!rolePermissions) {
      continue;
    }

    for (const permission of rolePermissions) {
      permissions.add(permission);
    }
  }

  return [...permissions];
}

/*
 * ============================================================
 * 5. AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * Authentication answers:
 *
 *     "Who is this user?"
 *
 *
 * Expected header:
 *
 *
 *     Authorization: Bearer <JWT>
 *
 * ============================================================
 */

export function authenticate(req, res, next) {
  try {
    /*
     * Get Authorization header.
     */

    const authorization = req.get("Authorization");

    if (!authorization) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authorization header is required",
        },
      });
    }

    /*
     * Expected:
     *
     *     Bearer eyJ...
     */

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Invalid authorization header",
        },
      });
    }

    /*
     * Verify JWT.
     *
     * NEVER use a secret supplied by the client.
     */

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    /*
     * JWT payload should contain the identity.
     *
     * Example:
     *
     * {
     *   sub: "user-123",
     *   roles: ["manager"]
     * }
     */

    req.user = {
      id: payload.sub,

      roles: Array.isArray(payload.roles) ? payload.roles : [],
    };

    next();
  } catch (error) {
    /*
     * Invalid/expired JWT.
     */

    return res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",

        message: "Invalid or expired access token",
      },
    });
  }
}

/*
 * ============================================================
 * 6. OPTIONAL AUTHENTICATION
 * ============================================================
 *
 * Some endpoints support both:
 *
 *     authenticated users
 *
 * and:
 *
 *     anonymous users
 *
 *
 * Example:
 *
 *     GET /posts
 *
 *
 * If a token exists:
 *
 *     req.user is populated.
 *
 *
 * If no token exists:
 *
 *     request continues without req.user.
 *
 * ============================================================
 */

export function optionalAuthenticate(req, res, next) {
  const authorization = req.get("Authorization");

  if (!authorization) {
    return next();
  }

  try {
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: payload.sub,

      roles: Array.isArray(payload.roles) ? payload.roles : [],
    };

    next();
  } catch {
    /*
     * Optional authentication does not reject the request
     * when authentication fails.
     *
     * The endpoint may still operate anonymously.
     */

    next();
  }
}

/*
 * ============================================================
 * 7. REQUIRE ONE ROLE
 * ============================================================
 *
 * Usage:
 *
 *
 *     requireRole(ROLES.ADMIN)
 *
 * ============================================================
 */

export function requireRole(requiredRole) {
  return (req, res, next) => {
    /*
     * Authentication must already have happened.
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
     * Check role.
     */

    if (
      !Array.isArray(req.user.roles) ||
      !req.user.roles.includes(requiredRole)
    ) {
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
 * 8. REQUIRE ANY ROLE
 * ============================================================
 *
 * User must have at least one of:
 *
 *
 *     manager
 *     admin
 *
 * ============================================================
 */

export function requireAnyRole(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    const hasRole = requiredRoles.some((role) =>
      req.user.roles?.includes(role),
    );

    if (!hasRole) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "None of the required roles are available",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 9. REQUIRE ALL ROLES
 * ============================================================
 *
 * Less common, but sometimes useful.
 *
 *
 * Example:
 *
 *     requireAllRoles(
 *       ROLES.MANAGER,
 *       ROLES.MODERATOR,
 *     )
 *
 *
 * User must have BOTH.
 *
 * ============================================================
 */

export function requireAllRoles(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    const hasAllRoles = requiredRoles.every((role) =>
      req.user.roles?.includes(role),
    );

    if (!hasAllRoles) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "All required roles are not available",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 10. REQUIRE ONE PERMISSION
 * ============================================================
 *
 * This is usually the most useful middleware.
 *
 *
 * Example:
 *
 *
 *     requirePermission(
 *       PERMISSIONS.TIMETABLE_UPDATE
 *     )
 *
 * ============================================================
 */

export function requirePermission(requiredPermission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    const permissions = getEffectivePermissions(req.user);

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "Required permission is missing",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 11. REQUIRE ANY PERMISSION
 * ============================================================
 *
 * User needs at least one permission.
 *
 *
 * Example:
 *
 *
 *     requireAnyPermission(
 *       "post:update",
 *       "post:publish"
 *     )
 *
 * ============================================================
 */

export function requireAnyPermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    const permissions = new Set(getEffectivePermissions(req.user));

    const allowed = requiredPermissions.some((permission) =>
      permissions.has(permission),
    );

    if (!allowed) {
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
 * 12. REQUIRE ALL PERMISSIONS
 * ============================================================
 *
 * User must have every required permission.
 *
 *
 * Example:
 *
 *
 *     requireAllPermissions(
 *       "timetable:update",
 *       "timetable:assign"
 *     )
 *
 * ============================================================
 */

export function requireAllPermissions(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    const permissions = new Set(getEffectivePermissions(req.user));

    const allowed = requiredPermissions.every((permission) =>
      permissions.has(permission),
    );

    if (!allowed) {
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
 * 13. RESOURCE + ACTION MIDDLEWARE
 * ============================================================
 *
 * Instead of:
 *
 *     requirePermission("user:delete")
 *
 *
 * we can use:
 *
 *     requireAction("user", "delete")
 *
 *
 * This can make authorization code easier to read.
 *
 * ============================================================
 */

export function requireAction(resource, action) {
  const requiredPermission = `${resource}:${action}`;

  return requirePermission(requiredPermission);
}

/*
 * ============================================================
 * 14. EXAMPLE EXPRESS ROUTER
 * ============================================================
 */

import express from "express";

const router = express.Router();

/*
 * ============================================================
 * 15. AUTHENTICATED ROUTE
 * ============================================================
 */

router.get(
  "/profile",

  authenticate,

  (req, res) => {
    return res.json({
      data: {
        user: req.user,
      },
    });
  },
);

/*
 * ============================================================
 * 16. ADMIN-ONLY ROUTE
 * ============================================================
 */

router.delete(
  "/users/:id",

  authenticate,

  requireRole(ROLES.ADMIN),

  (req, res) => {
    return res.json({
      message: "User deleted",
    });
  },
);

/*
 * ============================================================
 * 17. PERMISSION-BASED ROUTE
 * ============================================================
 */

router.patch(
  "/timetables/:id",

  authenticate,

  requirePermission(PERMISSIONS.TIMETABLE_UPDATE),

  (req, res) => {
    return res.json({
      message: "Timetable updated",
    });
  },
);

/*
 * ============================================================
 * 18. MULTIPLE ROLE ROUTE
 * ============================================================
 */

router.get(
  "/reports",

  authenticate,

  requireAnyRole(ROLES.MANAGER, ROLES.ADMIN),

  (req, res) => {
    return res.json({
      message: "Reports available",
    });
  },
);

/*
 * ============================================================
 * 19. ANY PERMISSION ROUTE
 * ============================================================
 */

router.post(
  "/posts/:id/action",

  authenticate,

  requireAnyPermission(PERMISSIONS.POST_UPDATE, PERMISSIONS.POST_PUBLISH),

  (req, res) => {
    return res.json({
      message: "Post action allowed",
    });
  },
);

/*
 * ============================================================
 * 20. ALL PERMISSIONS ROUTE
 * ============================================================
 */

router.post(
  "/timetables/:id/assign",

  authenticate,

  requireAllPermissions(
    PERMISSIONS.TIMETABLE_UPDATE,
    PERMISSIONS.TIMETABLE_ASSIGN,
  ),

  (req, res) => {
    return res.json({
      message: "Timetable assignment allowed",
    });
  },
);

/*
 * ============================================================
 * 21. RESOURCE + ACTION ROUTE
 * ============================================================
 */

router.delete(
  "/posts/:id",

  authenticate,

  requireAction("post", "delete"),

  (req, res) => {
    return res.json({
      message: "Post deleted",
    });
  },
);

/*
 * ============================================================
 * 22. MIDDLEWARE ORDER
 * ============================================================
 *
 * CORRECT:
 *
 *
 *     authenticate
 *          ↓
 *     requirePermission
 *          ↓
 *     controller
 *
 *
 *
 * WRONG:
 *
 *
 *     requirePermission
 *          ↓
 *     authenticate
 *
 *
 * Because authorization needs req.user.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. 401 vs 403
 * ============================================================
 *
 *
 * REQUEST
 *    │
 *    ▼
 * Is user authenticated?
 *    │
 *    ├── NO ──→ 401
 *    │
 *    ▼
 * Is user authorized?
 *    │
 *    ├── NO ──→ 403
 *    │
 *    ▼
 * CONTROLLER
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. DON'T LEAK TOO MUCH INFORMATION
 * ============================================================
 *
 * Avoid responses like:
 *
 *
 *     "User does not have timetable:delete because role
 *      manager lacks timetable:delete."
 *
 *
 * This reveals internal authorization structure.
 *
 *
 * Prefer:
 *
 *
 *     403 Forbidden
 *
 *     "You do not have permission to perform this action."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. FAIL CLOSED
 * ============================================================
 *
 * Authorization should fail closed.
 *
 *
 * Meaning:
 *
 *
 * Unknown role
 *     ↓
 * DENY
 *
 *
 * Unknown permission
 *     ↓
 * DENY
 *
 *
 * Missing req.user
 *     ↓
 * DENY
 *
 *
 * Authorization errors should never accidentally result in
 * access being granted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. DON'T TRUST req.body ROLE
 * ============================================================
 *
 * NEVER do:
 *
 *
 * req.user.roles =
 *     req.body.roles;
 *
 *
 * Example malicious request:
 *
 *
 * PATCH /profile
 *
 * {
 *   "roles": ["admin"]
 * }
 *
 *
 * Roles must come from a trusted source:
 *
 *
 *     database
 *     verified identity provider
 *     trusted authorization service
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. DON'T TRUST req.body PERMISSIONS
 * ============================================================
 *
 * NEVER do:
 *
 *
 * req.user.permissions =
 *     req.body.permissions;
 *
 *
 * Otherwise a user could send:
 *
 *
 * {
 *   "permissions": [
 *     "user:delete"
 *   ]
 * }
 *
 *
 * and authorize themselves.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. JWT ROLE STALENESS
 * ============================================================
 *
 * Suppose:
 *
 *
 * 10:00
 *     user = admin
 *
 * 10:01
 *     JWT issued
 *
 * 10:10
 *     admin role removed
 *
 *
 * Existing JWT might still say:
 *
 *
 *     roles: ["admin"]
 *
 *
 * until the token expires.
 *
 *
 * Production strategies include:
 *
 *
 *     short-lived access tokens
 *     refresh token rotation
 *     token revocation
 *     authorization lookup
 *     token versioning
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. TOKEN VERSIONING
 * ============================================================
 *
 * Example user:
 *
 *
 * {
 *   id: "user-123",
 *   tokenVersion: 5
 * }
 *
 *
 * JWT:
 *
 *
 * {
 *   sub: "user-123",
 *   tokenVersion: 5
 * }
 *
 *
 * When authorization changes:
 *
 *
 * database:
 *
 *     tokenVersion = 6
 *
 *
 * Old JWT:
 *
 *     tokenVersion = 5
 *
 *
 * Reject it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. AUTHORIZATION SHOULD BE CENTRALIZED
 * ============================================================
 *
 * Good:
 *
 *
 * routes
 *   ↓
 * authorization middleware
 *   ↓
 * controllers
 *
 *
 * Not:
 *
 *
 * controller A
 *   └── custom authorization
 *
 * controller B
 *   └── custom authorization
 *
 * controller C
 *   └── different authorization
 *
 *
 * Centralization reduces authorization bugs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. UNIT TESTING AUTHORIZATION
 * ============================================================
 *
 * Important cases:
 *
 *
 * ✓ no token → 401
 *
 * ✓ invalid token → 401
 *
 * ✓ expired token → 401
 *
 * ✓ valid user + insufficient role → 403
 *
 * ✓ valid user + required role → allowed
 *
 * ✓ valid user + missing permission → 403
 *
 * ✓ valid user + permission → allowed
 *
 * ✓ multiple roles → union permissions
 *
 * ✓ multiple permissions with ANY → correct behavior
 *
 * ✓ multiple permissions with ALL → correct behavior
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. RECOMMENDED PROJECT STRUCTURE
 * ============================================================
 *
 *
 * 21_authorization/
 *
 * ├── roles/
 * │   └── roles.js
 * │
 * ├── permissions/
 * │   └── permissions.js
 * │
 * ├── rbac/
 * │   └── rbac.js
 * │
 * ├── middleware.js
 * │
 * └── index.js
 *
 *
 * In a larger production project:
 *
 *
 * authorization/
 *
 * ├── constants/
 * │   ├── roles.js
 * │   └── permissions.js
 * │
 * ├── policies/
 * │   └── rbac.policy.js
 * │
 * ├── middleware/
 * │   ├── authenticate.js
 * │   └── authorize.js
 * │
 * ├── services/
 * │   └── authorization.service.js
 * │
 * └── index.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. Middleware is the enforcement layer.
 *
 * 2. Authentication creates req.user.
 *
 * 3. Authorization consumes req.user.
 *
 * 4. requireRole() checks roles.
 *
 * 5. requireAnyRole() checks OR logic.
 *
 * 6. requireAllRoles() checks AND logic.
 *
 * 7. requirePermission() checks one permission.
 *
 * 8. requireAnyPermission() checks OR permission logic.
 *
 * 9. requireAllPermissions() checks AND permission logic.
 *
 * 10. Prefer permission-based checks for capabilities.
 *
 * 11. Authorization should fail closed.
 *
 * 12. Never trust client-provided roles or permissions.
 *
 * 13. JWT authorization data can become stale.
 *
 * 14. Keep authorization centralized and testable.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     21_authorization/resource_authorization/
 *
 * We move beyond simple RBAC and implement:
 *
 *     "Can this user modify THIS specific resource?"
 *
 * Example:
 *
 *     timetable:update
 *
 *     AND
 *
 *     timetable.departmentId === user.departmentId
 *
 * This introduces resource-level authorization and policies.
 *
 * ============================================================
 */
