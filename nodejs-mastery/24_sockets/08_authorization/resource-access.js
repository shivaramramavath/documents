/**
 * ============================================================
 * 08_authorization/resource-access.js
 * ============================================================
 *
 * SOCKET.IO RESOURCE-LEVEL AUTHORIZATION
 *
 * This file covers:
 *
 * 01. Authentication vs Authorization
 * 02. Resource authorization
 * 03. Ownership
 * 04. Resource visibility
 * 05. Resource permissions
 * 06. Tenant / organization isolation
 * 07. Parent-child resources
 * 08. Owner checks
 * 09. Admin override
 * 10. Role + permission + ownership
 * 11. Any / all authorization rules
 * 12. Resource middleware
 * 13. Event-level resource authorization
 * 14. Database lookup
 * 15. Preventing IDOR
 * 16. Preventing horizontal privilege escalation
 * 17. Preventing vertical privilege escalation
 * 18. Multi-tenant authorization
 * 19. Policy functions
 * 20. Production authorization flow
 *
 * ============================================================
 */

/*
 * ============================================================
 * 01. ROLES
 * ============================================================
 */

export const ROLES = Object.freeze({
  USER: "user",

  MODERATOR: "moderator",

  ADMIN: "admin",

  SUPER_ADMIN: "superadmin",
});

/*
 * ============================================================
 * 02. PERMISSIONS
 * ============================================================
 */

export const PERMISSIONS = Object.freeze({
  MESSAGE_READ: "message:read",

  MESSAGE_CREATE: "message:create",

  MESSAGE_UPDATE: "message:update",

  MESSAGE_DELETE: "message:delete",

  USER_READ: "user:read",

  USER_UPDATE: "user:update",

  USER_DELETE: "user:delete",

  ADMIN_READ: "admin:read",

  ADMIN_UPDATE: "admin:update",
});

/*
 * ============================================================
 * 03. AUTHORIZATION ERROR
 * ============================================================
 */

export class ResourceAuthorizationError extends Error {
  constructor(
    message = "Resource access denied",

    code = "FORBIDDEN",
  ) {
    super(message);

    this.name = "ResourceAuthorizationError";

    this.code = code;
  }
}

/*
 * ============================================================
 * 04. BASIC OWNERSHIP CHECK
 * ============================================================
 *
 * A resource normally contains something like:
 *
 *     ownerId
 *
 *     userId
 *
 *     createdBy
 *
 * ============================================================
 */

export function isOwner(user, resource) {
  if (!user || !resource) {
    return false;
  }

  if (user.id === undefined || resource.ownerId === undefined) {
    return false;
  }

  return String(user.id) === String(resource.ownerId);
}

/*
 * ============================================================
 * 05. USER-ID OWNERSHIP
 * ============================================================
 *
 * Some resources use:
 *
 *     userId
 *
 * instead of:
 *
 *     ownerId
 *
 * ============================================================
 */

export function belongsToUser(user, resource) {
  if (!user || !resource) {
    return false;
  }

  return String(user.id) === String(resource.userId);
}

/*
 * ============================================================
 * 06. CREATED-BY CHECK
 * ============================================================
 */

export function createdByUser(user, resource) {
  if (!user || !resource) {
    return false;
  }

  return String(user.id) === String(resource.createdBy);
}

/*
 * ============================================================
 * 07. GENERIC OWNER FIELD
 * ============================================================
 */

export function ownsResource(user, resource, ownerField = "ownerId") {
  if (!user || !resource) {
    return false;
  }

  const ownerId = resource[ownerField];

  if (ownerId === undefined || ownerId === null) {
    return false;
  }

  return String(user.id) === String(ownerId);
}

/*
 * ============================================================
 * 08. ORGANIZATION / TENANT CHECK
 * ============================================================
 *
 * Multi-tenant application:
 *
 * User:
 *
 *     organizationId = org_1
 *
 * Resource:
 *
 *     organizationId = org_1
 *
 * Allowed.
 *
 * ============================================================
 */

export function belongsToOrganization(user, resource) {
  if (!user || !resource) {
    return false;
  }

  if (!user.organizationId || !resource.organizationId) {
    return false;
  }

  return String(user.organizationId) === String(resource.organizationId);
}

/*
 * ============================================================
 * 09. TENANT CHECK WITH EXPLICIT IDs
 * ============================================================
 */

export function sameTenant(
  user,
  resource,
  {
    userField = "organizationId",

    resourceField = "organizationId",
  } = {},
) {
  if (!user || !resource) {
    return false;
  }

  return String(user[userField]) === String(resource[resourceField]);
}

/*
 * ============================================================
 * 10. ROLE CHECK
 * ============================================================
 */

export function hasRole(user, role) {
  if (!user) {
    return false;
  }

  /*
   * Support:
   *
   *     user.role
   *
   * and:
   *
   *     user.roles
   */

  if (user.role === role) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.includes(role);
  }

  return false;
}

/*
 * ============================================================
 * 11. ANY ROLE
 * ============================================================
 */

export function hasAnyRole(user, roles) {
  if (!Array.isArray(roles)) {
    return false;
  }

  return roles.some((role) => hasRole(user, role));
}

/*
 * ============================================================
 * 12. PERMISSION CHECK
 * ============================================================
 */

export function hasPermission(user, permission) {
  if (!user) {
    return false;
  }

  /*
   * Direct permissions.
   */

  if (Array.isArray(user.permissions)) {
    if (user.permissions.includes("*")) {
      return true;
    }

    if (user.permissions.includes(permission)) {
      return true;
    }

    /*
     * Wildcard:
     *
     * message:*
     */

    const [resource] = permission.split(":");

    if (user.permissions.includes(`${resource}:*`)) {
      return true;
    }
  }

  /*
   * Super admin.
   */

  if (hasRole(user, ROLES.SUPER_ADMIN)) {
    return true;
  }

  return false;
}

/*
 * ============================================================
 * 13. ADMIN CHECK
 * ============================================================
 */

export function isAdmin(user) {
  return hasRole(user, ROLES.ADMIN) || hasRole(user, ROLES.SUPER_ADMIN);
}

/*
 * ============================================================
 * 14. MODERATOR CHECK
 * ============================================================
 */

export function isModerator(user) {
  return hasAnyRole(user, [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

/*
 * ============================================================
 * 15. ADMIN OVERRIDE
 * ============================================================
 *
 * Some systems allow administrators to access
 * resources regardless of ownership.
 *
 * ============================================================
 */

export function canAdminOverride(user) {
  return hasRole(user, ROLES.ADMIN) || hasRole(user, ROLES.SUPER_ADMIN);
}

/*
 * ============================================================
 * 16. BASIC RESOURCE ACCESS
 * ============================================================
 *
 * User can access resource when:
 *
 *     owner
 *
 * OR:
 *
 *     admin
 *
 * ============================================================
 */

export function canAccessResource(user, resource) {
  if (!user || !resource) {
    return false;
  }

  if (canAdminOverride(user)) {
    return true;
  }

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 17. READ ACCESS
 * ============================================================
 */

export function canReadResource(user, resource) {
  if (!hasPermission(user, PERMISSIONS.MESSAGE_READ)) {
    return false;
  }

  /*
   * Admin can read.
   */

  if (canAdminOverride(user)) {
    return true;
  }

  /*
   * Normal user must own resource.
   */

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 18. UPDATE ACCESS
 * ============================================================
 */

export function canUpdateResource(user, resource) {
  if (!hasPermission(user, PERMISSIONS.MESSAGE_UPDATE)) {
    return false;
  }

  if (canAdminOverride(user)) {
    return true;
  }

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 19. DELETE ACCESS
 * ============================================================
 */

export function canDeleteResource(user, resource) {
  if (!hasPermission(user, PERMISSIONS.MESSAGE_DELETE)) {
    return false;
  }

  if (canAdminOverride(user)) {
    return true;
  }

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 20. ORGANIZATION + OWNERSHIP
 * ============================================================
 *
 * Stronger rule:
 *
 *     same organization
 *
 * AND:
 *
 *     owner
 *
 * OR:
 *
 *     admin
 *
 * ============================================================
 */

export function canAccessOrganizationResource(user, resource) {
  if (!user || !resource) {
    return false;
  }

  /*
   * Tenant isolation must be checked FIRST.
   */

  if (!belongsToOrganization(user, resource)) {
    return false;
  }

  /*
   * Organization admin can access
   * resources in their organization.
   */

  if (isAdmin(user)) {
    return true;
  }

  /*
   * Normal users require ownership.
   */

  return isOwner(user, resource);
}

/*
 * ============================================================
 * 21. PARENT RESOURCE CHECK
 * ============================================================
 *
 * Example:
 *
 * Organization
 *     ↓
 * Project
 *     ↓
 * Room
 *     ↓
 * Message
 *
 * Message must belong to:
 *
 *     correct room
 *
 * and:
 *
 *     correct project
 *
 * and:
 *
 *     correct organization
 *
 * ============================================================
 */

export function belongsToParent(
  resource,
  parent,
  {
    resourceParentField = "parentId",

    parentIdField = "id",
  } = {},
) {
  if (!resource || !parent) {
    return false;
  }

  return (
    String(resource[resourceParentField]) === String(parent[parentIdField])
  );
}

/*
 * ============================================================
 * 22. PARENT-CHILD ACCESS
 * ============================================================
 */

export function canAccessChildResource(user, child, parent) {
  /*
   * First verify that the child actually
   * belongs to the requested parent.
   */

  if (!belongsToParent(child, parent)) {
    return false;
  }

  /*
   * Then authorize the parent.
   */

  return canAccessOrganizationResource(user, parent);
}

/*
 * ============================================================
 * 23. RESOURCE POLICY
 * ============================================================
 *
 * A policy is simply a function:
 *
 *     user + resource -> boolean
 *
 * This is a very useful production pattern.
 *
 * ============================================================
 */

export function createPolicy(policyFunction) {
  if (typeof policyFunction !== "function") {
    throw new TypeError("policyFunction must be a function");
  }

  return function policy(user, resource, context = {}) {
    return Boolean(policyFunction(user, resource, context));
  };
}

/*
 * ============================================================
 * 24. MESSAGE POLICY
 * ============================================================
 */

export const messagePolicy = Object.freeze({
  read: createPolicy((user, message) => canReadResource(user, message)),

  update: createPolicy((user, message) => canUpdateResource(user, message)),

  delete: createPolicy((user, message) => canDeleteResource(user, message)),
});

/*
 * ============================================================
 * 25. GENERIC AUTHORIZE
 * ============================================================
 */

export function authorizeResource(
  user,
  resource,
  {
    permission = null,

    roles = [],

    requireOwner = false,

    requireTenant = false,

    allowAdmin = true,

    policy = null,
  } = {},
) {
  /*
   * ----------------------------------------------------------
   * Authentication
   * ----------------------------------------------------------
   */

  if (!user) {
    return {
      allowed: false,

      code: "AUTHENTICATION_REQUIRED",
    };
  }

  /*
   * ----------------------------------------------------------
   * Permission
   * ----------------------------------------------------------
   */

  if (permission && !hasPermission(user, permission)) {
    return {
      allowed: false,

      code: "MISSING_PERMISSION",
    };
  }

  /*
   * ----------------------------------------------------------
   * Role
   * ----------------------------------------------------------
   */

  if (Array.isArray(roles) && roles.length > 0) {
    if (!hasAnyRole(user, roles)) {
      return {
        allowed: false,

        code: "ROLE_FORBIDDEN",
      };
    }
  }

  /*
   * ----------------------------------------------------------
   * Tenant
   * ----------------------------------------------------------
   */

  if (requireTenant) {
    if (!belongsToOrganization(user, resource)) {
      return {
        allowed: false,

        code: "TENANT_FORBIDDEN",
      };
    }
  }

  /*
   * ----------------------------------------------------------
   * Admin override
   * ----------------------------------------------------------
   */

  if (allowAdmin && canAdminOverride(user)) {
    return {
      allowed: true,

      reason: "admin_override",
    };
  }

  /*
   * ----------------------------------------------------------
   * Ownership
   * ----------------------------------------------------------
   */

  if (requireOwner) {
    if (!isOwner(user, resource)) {
      return {
        allowed: false,

        code: "NOT_OWNER",
      };
    }
  }

  /*
   * ----------------------------------------------------------
   * Custom policy
   * ----------------------------------------------------------
   */

  if (typeof policy === "function") {
    const result = policy(user, resource);

    if (!result) {
      return {
        allowed: false,

        code: "POLICY_DENIED",
      };
    }
  }

  return {
    allowed: true,

    reason: "authorized",
  };
}

/*
 * ============================================================
 * 26. ASSERT RESOURCE ACCESS
 * ============================================================
 *
 * Same logic as authorizeResource(),
 * but throws an error.
 *
 * Useful in async handlers.
 *
 * ============================================================
 */

export function assertResourceAccess(user, resource, options = {}) {
  const result = authorizeResource(user, resource, options);

  if (!result.allowed) {
    throw new ResourceAuthorizationError("Resource access denied", result.code);
  }

  return true;
}

/*
 * ============================================================
 * 27. LOAD RESOURCE FROM SOCKET PAYLOAD
 * ============================================================
 *
 * This demonstrates the correct pattern:
 *
 * client sends resource ID
 *
 * server loads resource
 *
 * server authorizes loaded resource
 *
 * NEVER authorize based only on client-provided
 * ownership fields.
 *
 * ============================================================
 */

export async function loadResource(resourceId, repository) {
  if (!resourceId) {
    throw new ResourceAuthorizationError(
      "Resource ID is required",
      "INVALID_RESOURCE_ID",
    );
  }

  if (!repository || typeof repository.findById !== "function") {
    throw new TypeError("repository.findById() is required");
  }

  const resource = await repository.findById(resourceId);

  if (!resource) {
    throw new ResourceAuthorizationError(
      "Resource not found",
      "RESOURCE_NOT_FOUND",
    );
  }

  return resource;
}

/*
 * ============================================================
 * 28. RESOURCE AUTHORIZATION MIDDLEWARE
 * ============================================================
 *
 * Middleware:
 *
 *     socket
 *       ↓
 *     payload
 *       ↓
 *     database
 *       ↓
 *     authorization
 *       ↓
 *     handler
 *
 * ============================================================
 */

export function resourceMiddleware({
  getResource,

  permission = null,

  roles = [],

  requireOwner = false,

  requireTenant = false,

  allowAdmin = true,

  policy = null,
}) {
  if (typeof getResource !== "function") {
    throw new TypeError("getResource must be a function");
  }

  return async function middleware(socket, payload, next) {
    try {
      const user = socket.data.user;

      /*
       * Load resource using server-side
       * information.
       */

      const resource = await getResource(socket, payload);

      if (!resource) {
        return next(
          new ResourceAuthorizationError(
            "Resource not found",
            "RESOURCE_NOT_FOUND",
          ),
        );
      }

      /*
       * Authorization.
       */

      assertResourceAccess(user, resource, {
        permission,

        roles,

        requireOwner,

        requireTenant,

        allowAdmin,

        policy,
      });

      /*
       * Store verified resource.
       */

      socket.data.resource = resource;

      next();
    } catch (error) {
      next(error);
    }
  };
}

/*
 * ============================================================
 * 29. EVENT AUTHORIZATION HELPER
 * ============================================================
 */

export async function authorizeSocketResource(
  socket,
  payload,
  {
    getResource,

    permission = null,

    roles = [],

    requireOwner = false,

    requireTenant = false,

    allowAdmin = true,

    policy = null,
  },
) {
  if (!socket?.data?.user) {
    throw new ResourceAuthorizationError(
      "Authentication required",
      "AUTHENTICATION_REQUIRED",
    );
  }

  const resource = await getResource(socket, payload);

  if (!resource) {
    throw new ResourceAuthorizationError(
      "Resource not found",
      "RESOURCE_NOT_FOUND",
    );
  }

  assertResourceAccess(socket.data.user, resource, {
    permission,

    roles,

    requireOwner,

    requireTenant,

    allowAdmin,

    policy,
  });

  return resource;
}

/*
 * ============================================================
 * 30. DEMO REPOSITORY
 * ============================================================
 */

const messageRepository = {
  async findById(messageId) {
    const database = {
      message_1: {
        id: "message_1",

        content: "Hello",

        ownerId: "user_1",

        organizationId: "org_1",
      },

      message_2: {
        id: "message_2",

        content: "Private message",

        ownerId: "user_2",

        organizationId: "org_2",
      },
    };

    return database[messageId] ?? null;
  },
};

/*
 * ============================================================
 * 31. DEMO USERS
 * ============================================================
 */

const users = {
  user1: {
    id: "user_1",

    role: ROLES.USER,

    organizationId: "org_1",

    permissions: [PERMISSIONS.MESSAGE_READ, PERMISSIONS.MESSAGE_UPDATE],
  },

  user2: {
    id: "user_2",

    role: ROLES.USER,

    organizationId: "org_2",

    permissions: [PERMISSIONS.MESSAGE_READ, PERMISSIONS.MESSAGE_UPDATE],
  },

  admin: {
    id: "admin_1",

    role: ROLES.ADMIN,

    organizationId: "org_1",

    permissions: [
      PERMISSIONS.MESSAGE_READ,
      PERMISSIONS.MESSAGE_UPDATE,
      PERMISSIONS.MESSAGE_DELETE,
    ],
  },
};

/*
 * ============================================================
 * 32. DEMO TEST
 * ============================================================
 */

async function demo() {
  const message = await messageRepository.findById("message_1");

  /*
   * user_1 owns message_1.
   */

  console.log(
    "User 1:",
    authorizeResource(users.user1, message, {
      permission: PERMISSIONS.MESSAGE_UPDATE,

      requireOwner: true,

      requireTenant: true,
    }),
  );

  /*
   * user_2 does NOT own message_1.
   *
   * Different organization too.
   */

  console.log(
    "User 2:",
    authorizeResource(users.user2, message, {
      permission: PERMISSIONS.MESSAGE_UPDATE,

      requireOwner: true,

      requireTenant: true,
    }),
  );

  /*
   * Admin.
   */

  console.log(
    "Admin:",
    authorizeResource(users.admin, message, {
      permission: PERMISSIONS.MESSAGE_UPDATE,

      requireOwner: true,

      requireTenant: true,

      allowAdmin: true,
    }),
  );
}

/*
 * ============================================================
 * 33. RUN DEMO
 * ============================================================
 */

demo().catch((error) => {
  console.error(error);
});

/*
 * ============================================================
 * 34. EXPORTS
 * ============================================================
 */

export { messageRepository, users };
