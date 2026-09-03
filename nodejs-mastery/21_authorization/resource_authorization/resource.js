/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_authorization/resource_authorization/resource.js
 *
 * Topic:
 *     Resource-Level Authorization
 *
 * ============================================================
 *
 * BASIC RBAC
 * ============================================================
 *
 * RBAC:
 *
 *     user
 *       ↓
 *     role
 *       ↓
 *     permission
 *
 *
 * Example:
 *
 *     manager
 *       ↓
 *     timetable:update
 *
 *
 * But RBAC alone doesn't answer:
 *
 *
 *     "Can this manager update THIS timetable?"
 *
 *
 * Resource authorization solves that problem.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. RESOURCE
 * ============================================================
 *
 * Imagine these are documents retrieved from a database.
 *
 * ============================================================
 */

const timetables = [
  {
    id: "tt-101",

    name: "CSE Semester 5",

    departmentId: "cse",

    ownerId: "manager-1",

    status: "draft",
  },

  {
    id: "tt-102",

    name: "ECE Semester 5",

    departmentId: "ece",

    ownerId: "manager-2",

    status: "draft",
  },

  {
    id: "tt-103",

    name: "CSE Semester 7",

    departmentId: "cse",

    ownerId: "manager-3",

    status: "published",
  },
];

/*
 * ============================================================
 * 2. USERS
 * ============================================================
 */

const users = [
  {
    id: "manager-1",

    name: "Manager One",

    roles: ["manager"],

    departmentId: "cse",
  },

  {
    id: "manager-2",

    name: "Manager Two",

    roles: ["manager"],

    departmentId: "ece",
  },

  {
    id: "manager-3",

    name: "Manager Three",

    roles: ["manager"],

    departmentId: "cse",
  },

  {
    id: "admin-1",

    name: "Administrator",

    roles: ["admin"],

    departmentId: null,
  },
];

/*
 * ============================================================
 * 3. RBAC PERMISSION
 * ============================================================
 */

const PERMISSIONS = Object.freeze({
  TIMETABLE_READ: "timetable:read",

  TIMETABLE_UPDATE: "timetable:update",

  TIMETABLE_DELETE: "timetable:delete",

  TIMETABLE_ASSIGN: "timetable:assign",
});

/*
 * ============================================================
 * 4. ROLE → PERMISSION
 * ============================================================
 */

const ROLE_PERMISSIONS = Object.freeze({
  manager: [
    PERMISSIONS.TIMETABLE_READ,

    PERMISSIONS.TIMETABLE_UPDATE,

    PERMISSIONS.TIMETABLE_ASSIGN,
  ],

  admin: Object.values(PERMISSIONS),
});

/*
 * ============================================================
 * 5. EFFECTIVE PERMISSIONS
 * ============================================================
 */

function getEffectivePermissions(user) {
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
 * 6. BASIC PERMISSION CHECK
 * ============================================================
 */

function hasPermission(user, requiredPermission) {
  return getEffectivePermissions(user).includes(requiredPermission);
}

/*
 * ============================================================
 * 7. FIND RESOURCE
 * ============================================================
 */

function findTimetable(timetableId) {
  return timetables.find((timetable) => timetable.id === timetableId);
}

/*
 * ============================================================
 * 8. RESOURCE POLICY
 * ============================================================
 *
 * This function answers:
 *
 *
 *     "Can this user update THIS timetable?"
 *
 *
 * Notice that we check BOTH:
 *
 *
 *     permission
 *
 * AND
 *
 *     resource attributes
 *
 * ============================================================
 */

function canUpdateTimetable(user, timetable) {
  /*
   * No user.
   */

  if (!user) {
    return false;
  }

  /*
   * Resource does not exist.
   */

  if (!timetable) {
    return false;
  }

  /*
   * First layer:
   *
   * RBAC permission.
   */

  if (!hasPermission(user, PERMISSIONS.TIMETABLE_UPDATE)) {
    return false;
  }

  /*
   * Admin bypass.
   *
   * Administrators can operate across departments.
   */

  if (user.roles?.includes("admin")) {
    return true;
  }

  /*
   * Resource-level rule:
   *
   * Manager can only modify timetables belonging to
   * their department.
   */

  if (user.departmentId !== timetable.departmentId) {
    return false;
  }

  /*
   * Additional business rule:
   *
   * Published timetables cannot be edited by ordinary managers.
   */

  if (timetable.status === "published") {
    return false;
  }

  return true;
}

/*
 * ============================================================
 * 9. TEST POLICY
 * ============================================================
 */

const manager1 = users.find((user) => user.id === "manager-1");

const timetable101 = findTimetable("tt-101");

const timetable102 = findTimetable("tt-102");

console.log(
  "Manager 1 → Timetable 101:",
  canUpdateTimetable(manager1, timetable101),
);

console.log(
  "Manager 1 → Timetable 102:",
  canUpdateTimetable(manager1, timetable102),
);

/*
 * Expected:
 *
 *
 * Manager 1 → Timetable 101: true
 *
 * Manager 1 → Timetable 102: false
 *
 *
 * Because:
 *
 *
 * manager-1.departmentId
 *
 *     =
 *
 * cse
 *
 *
 * timetable101.departmentId
 *
 *     =
 *
 * cse
 *
 *
 * But:
 *
 *
 * timetable102.departmentId
 *
 *     =
 *
 * ece
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. POLICY FUNCTIONS
 * ============================================================
 *
 * As your application grows, don't put all authorization rules
 * into one giant function.
 *
 *
 * Prefer:
 *
 *
 * policies/
 *
 * ├── timetable.policy.js
 * ├── user.policy.js
 * ├── order.policy.js
 * └── post.policy.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. TIMETABLE POLICY
 * ============================================================
 */

const timetablePolicy = {
  canRead(user, timetable) {
    if (!user || !timetable) {
      return false;
    }

    if (user.roles?.includes("admin")) {
      return hasPermission(user, PERMISSIONS.TIMETABLE_READ);
    }

    return (
      hasPermission(user, PERMISSIONS.TIMETABLE_READ) &&
      user.departmentId === timetable.departmentId
    );
  },

  canUpdate(user, timetable) {
    if (!user || !timetable) {
      return false;
    }

    if (!hasPermission(user, PERMISSIONS.TIMETABLE_UPDATE)) {
      return false;
    }

    if (user.roles?.includes("admin")) {
      return true;
    }

    return (
      user.departmentId === timetable.departmentId &&
      timetable.status !== "published"
    );
  },

  canDelete(user, timetable) {
    if (!user || !timetable) {
      return false;
    }

    if (!hasPermission(user, PERMISSIONS.TIMETABLE_DELETE)) {
      return false;
    }

    if (user.roles?.includes("admin")) {
      return true;
    }

    return user.departmentId === timetable.departmentId;
  },

  canAssign(user, timetable) {
    if (!user || !timetable) {
      return false;
    }

    if (!hasPermission(user, PERMISSIONS.TIMETABLE_ASSIGN)) {
      return false;
    }

    if (user.roles?.includes("admin")) {
      return true;
    }

    return (
      user.departmentId === timetable.departmentId &&
      timetable.status === "draft"
    );
  },
};

/*
 * ============================================================
 * 12. POLICY USAGE
 * ============================================================
 */

console.log(timetablePolicy.canUpdate(manager1, timetable101));

console.log(timetablePolicy.canUpdate(manager1, timetable102));

/*
 * ============================================================
 * 13. RESOURCE AUTHORIZATION MIDDLEWARE
 * ============================================================
 *
 * Middleware needs the resource before it can evaluate the
 * policy.
 *
 *
 * Request:
 *
 *
 * PATCH /timetables/tt-101
 *
 *
 * Flow:
 *
 *
 * authenticate
 *       ↓
 * req.user
 *       ↓
 * load timetable
 *       ↓
 * req.timetable
 *       ↓
 * policy check
 *       ↓
 * controller
 *
 * ============================================================
 */

function loadTimetable(req, res, next) {
  const timetable = findTimetable(req.params.id);

  if (!timetable) {
    return res.status(404).json({
      error: {
        code: "TIMETABLE_NOT_FOUND",

        message: "Timetable not found",
      },
    });
  }

  req.timetable = timetable;

  next();
}

/*
 * ============================================================
 * 14. RESOURCE POLICY MIDDLEWARE
 * ============================================================
 */

function authorizeResource(policy) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",

          message: "Authentication required",
        },
      });
    }

    if (!req.timetable) {
      return res.status(500).json({
        error: {
          code: "RESOURCE_NOT_LOADED",

          message: "Resource was not loaded before authorization",
        },
      });
    }

    const allowed = policy(req.user, req.timetable);

    if (!allowed) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",

          message: "You are not allowed to perform this action",
        },
      });
    }

    next();
  };
}

/*
 * ============================================================
 * 15. EXPRESS ROUTE
 * ============================================================
 */

import express from "express";

const router = express.Router();

/*
 * Authentication middleware is assumed to exist.
 *
 * ============================================================
 *
 * Route:
 *
 *     PATCH /timetables/:id
 *
 * ============================================================
 */

router.patch(
  "/timetables/:id",

  authenticate,

  loadTimetable,

  authorizeResource(timetablePolicy.canUpdate),

  (req, res) => {
    /*
     * At this point:
     *
     *     req.user
     *     req.timetable
     *
     * have both passed authorization.
     */

    return res.status(200).json({
      data: {
        message: "Timetable update authorized",

        timetable: req.timetable,
      },
    });
  },
);

/*
 * ============================================================
 * 16. AUTHORIZATION FLOW
 * ============================================================
 *
 *
 * PATCH /timetables/tt-101
 *
 *        │
 *        ▼
 *
 * authenticate
 *
 *        │
 *        ▼
 *
 * req.user
 *
 * {
 *   id: "manager-1",
 *   roles: ["manager"],
 *   departmentId: "cse"
 * }
 *
 *        │
 *        ▼
 *
 * loadTimetable
 *
 *        │
 *        ▼
 *
 * req.timetable
 *
 * {
 *   id: "tt-101",
 *   departmentId: "cse",
 *   status: "draft"
 * }
 *
 *        │
 *        ▼
 *
 * timetablePolicy.canUpdate()
 *
 *        │
 *        ├── permission?
 *        │
 *        ├── department?
 *        │
 *        └── status?
 *        │
 *        ▼
 *
 *      ALLOW
 *        │
 *        ▼
 *
 *    Controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. OWNER-BASED AUTHORIZATION
 * ============================================================
 *
 * Another common rule:
 *
 *
 * "Users can edit their own resources."
 *
 *
 * Example:
 *
 *
 * post.ownerId === user.id
 *
 * ============================================================
 */

function isOwner(user, resource) {
  if (!user || !resource) {
    return false;
  }

  return resource.ownerId === user.id;
}

/*
 * ============================================================
 * 18. OWNER + PERMISSION
 * ============================================================
 */

function canUpdateOwnedResource(user, resource, requiredPermission) {
  if (!hasPermission(user, requiredPermission)) {
    return false;
  }

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 19. OWNER OR ADMIN
 * ============================================================
 */

function canModifyOwnedResource(user, resource, requiredPermission) {
  if (!user || !resource) {
    return false;
  }

  if (!hasPermission(user, requiredPermission)) {
    return false;
  }

  if (user.roles?.includes("admin")) {
    return true;
  }

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 20. ATTRIBUTE-BASED AUTHORIZATION
 * ============================================================
 *
 * This is often called:
 *
 *
 *     ABAC
 *
 *
 * Attribute-Based Access Control.
 *
 *
 * Decision can depend on:
 *
 *
 * USER ATTRIBUTES
 *     department
 *     organization
 *     location
 *     clearance
 *
 *
 * RESOURCE ATTRIBUTES
 *     department
 *     owner
 *     status
 *     sensitivity
 *
 *
 * ACTION
 *     read
 *     update
 *     delete
 *
 *
 * ENVIRONMENT
 *     time
 *     IP
 *     device
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. ABAC EXAMPLE
 * ============================================================
 */

function canReadTimetable(user, timetable) {
  if (!user || !timetable) {
    return false;
  }

  /*
   * Admin:
   */

  if (user.roles?.includes("admin")) {
    return true;
  }

  /*
   * Same department:
   */

  if (user.departmentId === timetable.departmentId) {
    return true;
  }

  return false;
}

/*
 * ============================================================
 * 22. MULTI-TENANT AUTHORIZATION
 * ============================================================
 *
 * This is extremely important for SaaS applications.
 *
 *
 * Example:
 *
 *
 * Organization A
 *     └── users
 *     └── timetables
 *
 *
 * Organization B
 *     └── users
 *     └── timetables
 *
 *
 * User from Organization A must NEVER access resources from
 * Organization B.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. TENANT-BASED POLICY
 * ============================================================
 */

function sameTenant(user, resource) {
  return (
    user?.organizationId &&
    resource?.organizationId &&
    user.organizationId === resource.organizationId
  );
}

/*
 * ============================================================
 * 24. TENANT + PERMISSION
 * ============================================================
 */

function canAccessTenantResource(user, resource, requiredPermission) {
  if (!user || !resource) {
    return false;
  }

  /*
   * Permission check.
   */

  if (!hasPermission(user, requiredPermission)) {
    return false;
  }

  /*
   * Tenant isolation.
   */

  if (!sameTenant(user, resource)) {
    return false;
  }

  return true;
}

/*
 * ============================================================
 * 25. CRITICAL DATABASE RULE
 * ============================================================
 *
 * Authorization should ideally be combined with the database
 * query when possible.
 *
 *
 * BAD:
 *
 *
 * find timetable by ID
 *
 * then:
 *
 * if (timetable.departmentId !== user.departmentId)
 *     deny
 *
 *
 * This can work, but you must be careful not to accidentally
 * expose the resource before authorization.
 *
 *
 * Better query:
 *
 *
 * findOne({
 *   _id: timetableId,
 *   departmentId: user.departmentId
 * })
 *
 *
 * Then:
 *
 *
 * null → treat as not accessible/not found according to your
 *       application's information-disclosure policy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. MONGOOSE-STYLE EXAMPLE
 * ============================================================
 *
 * Example:
 *
 *
 * const timetable =
 *   await Timetable.findOne({
 *
 *     _id: timetableId,
 *
 *     organizationId:
 *       req.user.organizationId,
 *
 *     departmentId:
 *       req.user.departmentId,
 *
 *   });
 *
 *
 * This simultaneously enforces resource ownership boundaries
 * at the data-access layer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. NEVER RELY ONLY ON FRONTEND AUTHORIZATION
 * ============================================================
 *
 * Frontend:
 *
 *     hide Delete button
 *
 * is useful for UX.
 *
 *
 * But it is NOT security.
 *
 *
 * A malicious client can still send:
 *
 *
 * DELETE /api/v1/timetables/tt-101
 *
 *
 * Therefore:
 *
 *
 * frontend authorization
 *       ↓
 * UX
 *
 *
 * backend authorization
 *       ↓
 * SECURITY
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. RESOURCE AUTHORIZATION LAYERS
 * ============================================================
 *
 *
 * Layer 1:
 *
 * Authentication
 *
 *     "Who are you?"
 *
 *
 * Layer 2:
 *
 * RBAC
 *
 *     "Do you have timetable:update?"
 *
 *
 * Layer 3:
 *
 * Resource authorization
 *
 *     "Can you update THIS timetable?"
 *
 *
 * Layer 4:
 *
 * Business rules
 *
 *     "Is this timetable currently editable?"
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. COMPLETE DECISION
 * ============================================================
 *
 *
 *             REQUEST
 *                │
 *                ▼
 *         Authentication
 *                │
 *                ▼
 *             req.user
 *                │
 *                ▼
 *               RBAC
 *                │
 *         permission check
 *                │
 *                ▼
 *          Load resource
 *                │
 *                ▼
 *       Resource authorization
 *                │
 *       ┌────────┴────────┐
 *       ▼                 ▼
 *     ALLOW              DENY
 *       │                 │
 *       ▼                 ▼
 *   Business logic       403
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. IMPORTANT SECURITY PRINCIPLE
 * ============================================================
 *
 * Never assume:
 *
 *
 *     "The user has permission"
 *
 *
 * means:
 *
 *
 *     "The user can access every instance of that resource."
 *
 *
 * Example:
 *
 *
 * permission:
 *
 *     timetable:update
 *
 *
 * does NOT necessarily mean:
 *
 *
 *     all timetables can be updated.
 *
 *
 * Resource ownership, tenant, department, organization,
 * lifecycle state, and other attributes may further constrain
 * access.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. RBAC checks capabilities.
 *
 * 2. Resource authorization checks access to a specific
 *    resource.
 *
 * 3. A permission alone may not be sufficient.
 *
 * 4. Policies encapsulate resource-specific authorization.
 *
 * 5. Common rules include:
 *
 *       owner === user
 *       department === user.department
 *       organization === user.organization
 *
 * 6. Admin bypasses should be explicit.
 *
 * 7. Business state can also affect authorization.
 *
 * 8. Multi-tenant systems must enforce tenant isolation.
 *
 * 9. Frontend authorization is UX, not security.
 *
 * 10. Backend authorization is mandatory.
 *
 * 11. When possible, enforce access boundaries directly in
 *     database queries.
 *
 * 12. Authorization can be layered:
 *
 *       Authentication
 *           ↓
 *       RBAC
 *           ↓
 *       Resource policy
 *           ↓
 *       Business rules
 *
 * ============================================================
 *
 * NEXT:
 *
 *     21_authorization/policies/
 *
 * We will build a cleaner policy architecture with:
 *
 *     Policy
 *     Policy Context
 *     can()
 *     cannot()
 *     ownership rules
 *     department rules
 *     tenant rules
 *     action/resource policies
 *
 * ============================================================
 */
