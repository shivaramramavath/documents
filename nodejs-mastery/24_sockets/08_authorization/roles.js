/**
 * ============================================================
 * 08_authorization/roles.js
 * ============================================================
 *
 * SOCKET.IO ROLE-BASED ACCESS CONTROL (RBAC)
 *
 * Topics:
 *
 * 01. Authentication vs Authorization
 * 02. Roles
 * 03. Role hierarchy
 * 04. Role inheritance
 * 05. Multiple roles
 * 06. Role -> permissions
 * 07. hasRole()
 * 08. hasAnyRole()
 * 09. hasAllRoles()
 * 10. requireRole()
 * 11. requireAnyRole()
 * 12. requireAllRoles()
 * 13. Role hierarchy checks
 * 14. Effective roles
 * 15. Effective permissions
 * 16. Dynamic roles
 * 17. Role middleware
 * 18. Event-level RBAC
 * 19. Namespace-level RBAC
 * 20. Resource + role authorization
 * 21. Preventing privilege escalation
 * 22. Production RBAC architecture
 *
 * ============================================================
 */

/*
 * ============================================================
 * 01. ROLE CONSTANTS
 * ============================================================
 */

export const ROLES = Object.freeze({
  GUEST: "guest",

  USER: "user",

  MODERATOR: "moderator",

  ADMIN: "admin",

  SUPER_ADMIN: "superadmin",
});

/*
 * ============================================================
 * 02. ROLE HIERARCHY
 * ============================================================
 *
 * Higher number = higher privilege.
 *
 * IMPORTANT:
 *
 * This does NOT automatically mean:
 *
 *     admin can perform everything
 *
 * unless your application explicitly defines it.
 *
 * ============================================================
 */

export const ROLE_LEVELS = Object.freeze({
  [ROLES.GUEST]: 0,

  [ROLES.USER]: 10,

  [ROLES.MODERATOR]: 20,

  [ROLES.ADMIN]: 30,

  [ROLES.SUPER_ADMIN]: 100,
});

/*
 * ============================================================
 * 03. ROLE PARENTS
 * ============================================================
 *
 * This defines inheritance.
 *
 * Example:
 *
 * moderator
 *     ↓
 * user
 *
 * admin
 *     ↓
 * moderator
 *
 * superadmin
 *     ↓
 * admin
 *
 * ============================================================
 */

export const ROLE_PARENTS = Object.freeze({
  [ROLES.GUEST]: [],

  [ROLES.USER]: [ROLES.GUEST],

  [ROLES.MODERATOR]: [ROLES.USER],

  [ROLES.ADMIN]: [ROLES.MODERATOR],

  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN],
});

/*
 * ============================================================
 * 04. ROLE PERMISSIONS
 * ============================================================
 *
 * Normally these can be imported from:
 *
 *     ./permissions.js
 *
 * They are written here explicitly so this file can
 * also be understood independently.
 *
 * ============================================================
 */

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.GUEST]: ["chat:read", "message:read"],

  [ROLES.USER]: ["chat:send", "message:send", "user:read"],

  [ROLES.MODERATOR]: [
    "message:update",
    "message:delete",
    "chat:delete",

    "moderation:read",
    "moderation:action",
  ],

  [ROLES.ADMIN]: [
    "user:update",
    "user:delete",

    "admin:read",
    "admin:update",
    "admin:delete",
  ],

  [ROLES.SUPER_ADMIN]: ["*"],
});

/*
 * ============================================================
 * 05. NORMALIZE ROLE INPUT
 * ============================================================
 *
 * Allows:
 *
 *     "admin"
 *
 * or:
 *
 *     ["admin", "moderator"]
 *
 * ============================================================
 */

export function normalizeRoles(roles) {
  if (typeof roles === "string") {
    return [roles];
  }

  if (Array.isArray(roles)) {
    return [...new Set(roles.filter((role) => typeof role === "string"))];
  }

  return [];
}

/*
 * ============================================================
 * 06. GET DIRECT ROLES
 * ============================================================
 */

export function getUserRoles(user) {
  if (!user) {
    return [];
  }

  /*
   * Multiple roles.
   *
   * Example:
   *
   * roles: [
   *   "user",
   *   "moderator"
   * ]
   */

  if (Array.isArray(user.roles)) {
    return normalizeRoles(user.roles);
  }

  /*
   * Single role.
   */

  if (typeof user.role === "string") {
    return [user.role];
  }

  return [];
}

/*
 * ============================================================
 * 07. GET ROLE PARENTS
 * ============================================================
 */

export function getParentRoles(role) {
  return ROLE_PARENTS[role] ?? [];
}

/*
 * ============================================================
 * 08. GET EFFECTIVE ROLES
 * ============================================================
 *
 * Effective roles include inherited roles.
 *
 * Example:
 *
 * admin
 *
 * becomes:
 *
 * admin
 * moderator
 * user
 * guest
 *
 * ============================================================
 */

export function getEffectiveRoles(roles) {
  const directRoles = normalizeRoles(roles);

  const effectiveRoles = new Set();

  const visited = new Set();

  function visit(role) {
    /*
     * Prevent infinite loops if role
     * configuration contains a cycle.
     */

    if (visited.has(role)) {
      return;
    }

    visited.add(role);

    effectiveRoles.add(role);

    const parents = getParentRoles(role);

    for (const parent of parents) {
      visit(parent);
    }
  }

  for (const role of directRoles) {
    visit(role);
  }

  return [...effectiveRoles];
}

/*
 * ============================================================
 * 09. HAS ROLE
 * ============================================================
 *
 * Exact direct role check.
 *
 * Example:
 *
 * user.roles = ["user"]
 *
 * hasRole(user, "user")
 *
 * => true
 *
 * ============================================================
 */

export function hasRole(user, requiredRole) {
  const roles = getUserRoles(user);

  return roles.includes(requiredRole);
}

/*
 * ============================================================
 * 10. HAS EFFECTIVE ROLE
 * ============================================================
 *
 * Checks inherited roles too.
 *
 * Example:
 *
 * admin
 *   ↓
 * moderator
 *   ↓
 * user
 *
 * hasEffectiveRole(
 *   admin,
 *   "user"
 * )
 *
 * => true
 *
 * ============================================================
 */

export function hasEffectiveRole(user, requiredRole) {
  const effectiveRoles = getEffectiveRoles(getUserRoles(user));

  return effectiveRoles.includes(requiredRole);
}

/*
 * ============================================================
 * 11. HAS ANY ROLE
 * ============================================================
 */

export function hasAnyRole(user, requiredRoles) {
  const roles = normalizeRoles(requiredRoles);

  return roles.some((role) => hasEffectiveRole(user, role));
}

/*
 * ============================================================
 * 12. HAS ALL ROLES
 * ============================================================
 */

export function hasAllRoles(user, requiredRoles) {
  const roles = normalizeRoles(requiredRoles);

  return roles.every((role) => hasEffectiveRole(user, role));
}

/*
 * ============================================================
 * 13. GET ROLE LEVEL
 * ============================================================
 */

export function getRoleLevel(role) {
  return ROLE_LEVELS[role] ?? -1;
}

/*
 * ============================================================
 * 14. GET HIGHEST ROLE
 * ============================================================
 */

export function getHighestRole(roles) {
  const normalizedRoles = normalizeRoles(roles);

  if (normalizedRoles.length === 0) {
    return null;
  }

  return normalizedRoles.reduce((highest, current) => {
    if (getRoleLevel(current) > getRoleLevel(highest)) {
      return current;
    }

    return highest;
  });
}

/*
 * ============================================================
 * 15. HAS MINIMUM ROLE LEVEL
 * ============================================================
 *
 * Example:
 *
 * require at least moderator.
 *
 * moderator => true
 * admin     => true
 * superadmin=> true
 * user      => false
 *
 * ============================================================
 */

export function hasMinimumRole(user, minimumRole) {
  const effectiveRoles = getEffectiveRoles(getUserRoles(user));

  const minimumLevel = getRoleLevel(minimumRole);

  if (minimumLevel < 0) {
    return false;
  }

  return effectiveRoles.some((role) => getRoleLevel(role) >= minimumLevel);
}

/*
 * ============================================================
 * 16. GET EFFECTIVE PERMISSIONS
 * ============================================================
 */

export function getEffectivePermissions(user) {
  const roles = getEffectiveRoles(getUserRoles(user));

  const permissions = new Set();

  for (const role of roles) {
    const rolePermissions = ROLE_PERMISSIONS[role] ?? [];

    for (const permission of rolePermissions) {
      permissions.add(permission);
    }
  }

  /*
   * User-specific permissions can be
   * added on top of role permissions.
   */

  if (Array.isArray(user?.permissions)) {
    for (const permission of user.permissions) {
      permissions.add(permission);
    }
  }

  return [...permissions];
}

/*
 * ============================================================
 * 17. HAS PERMISSION THROUGH ROLE
 * ============================================================
 */

export function roleHasPermission(user, requiredPermission) {
  const permissions = getEffectivePermissions(user);

  /*
   * Super permission.
   */

  if (permissions.includes("*")) {
    return true;
  }

  /*
   * Exact permission.
   */

  if (permissions.includes(requiredPermission)) {
    return true;
  }

  /*
   * Wildcard:
   *
   * message:*
   */

  return permissions.some((permission) => {
    if (!permission.endsWith(":*")) {
      return false;
    }

    const prefix = permission.slice(0, -1);

    return requiredPermission.startsWith(prefix);
  });
}

/*
 * ============================================================
 * 18. REQUIRE EXACT ROLE
 * ============================================================
 */

export function requireRole(requiredRole) {
  return function roleMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    if (!hasEffectiveRole(user, requiredRole)) {
      return next(
        createAuthError(`Role '${requiredRole}' required`, "FORBIDDEN"),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 19. REQUIRE ANY ROLE
 * ============================================================
 */

export function requireAnyRole(requiredRoles) {
  return function anyRoleMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    if (!hasAnyRole(user, requiredRoles)) {
      return next(createAuthError("Required role is missing", "FORBIDDEN"));
    }

    next();
  };
}

/*
 * ============================================================
 * 20. REQUIRE ALL ROLES
 * ============================================================
 */

export function requireAllRoles(requiredRoles) {
  return function allRoleMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    if (!hasAllRoles(user, requiredRoles)) {
      return next(
        createAuthError("All required roles are missing", "FORBIDDEN"),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 21. REQUIRE MINIMUM ROLE
 * ============================================================
 */

export function requireMinimumRole(minimumRole) {
  return function minimumRoleMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    if (!hasMinimumRole(user, minimumRole)) {
      return next(
        createAuthError(`Minimum role '${minimumRole}' required`, "FORBIDDEN"),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 22. REQUIRE PERMISSION
 * ============================================================
 *
 * Combines RBAC + permission check.
 *
 * ============================================================
 */

export function requireRolePermission(requiredRole, requiredPermission) {
  return function rolePermissionMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    const roleAllowed = hasEffectiveRole(user, requiredRole);

    const permissionAllowed = roleHasPermission(user, requiredPermission);

    if (!roleAllowed || !permissionAllowed) {
      return next(createAuthError("Role or permission denied", "FORBIDDEN"));
    }

    next();
  };
}

/*
 * ============================================================
 * 23. EVENT AUTHORIZATION WRAPPER
 * ============================================================
 *
 * Useful when authorization needs to happen
 * inside an individual event.
 *
 * ============================================================
 */

export function authorizeEvent(
  socket,
  { roles = [], permissions = [], mode = "any" } = {},
) {
  const user = socket.data.user;

  if (!user) {
    throw new Error("Authentication required");
  }

  const normalizedRoles = normalizeRoles(roles);

  const normalizedPermissions = normalizeRoles(permissions);

  let roleAllowed = true;

  let permissionAllowed = true;

  /*
   * Role check.
   */

  if (normalizedRoles.length > 0) {
    roleAllowed =
      mode === "all"
        ? hasAllRoles(user, normalizedRoles)
        : hasAnyRole(user, normalizedRoles);
  }

  /*
   * Permission check.
   */

  if (normalizedPermissions.length > 0) {
    permissionAllowed =
      mode === "all"
        ? normalizedPermissions.every((permission) =>
            roleHasPermission(user, permission),
          )
        : normalizedPermissions.some((permission) =>
            roleHasPermission(user, permission),
          );
  }

  if (!roleAllowed || !permissionAllowed) {
    throw new Error("Forbidden");
  }

  return true;
}

/*
 * ============================================================
 * 24. CREATE ERROR
 * ============================================================
 */

function createAuthError(message, code) {
  const error = new Error(message);

  error.data = {
    code,

    message,
  };

  return error;
}

/*
 * ============================================================
 * 25. EXAMPLE USERS
 * ============================================================
 */

export const exampleUsers = {
  user: {
    id: "user_1",

    username: "shiva",

    role: ROLES.USER,
  },

  moderator: {
    id: "moderator_1",

    username: "moderator",

    role: ROLES.MODERATOR,
  },

  admin: {
    id: "admin_1",

    username: "admin",

    role: ROLES.ADMIN,
  },

  multiRole: {
    id: "staff_1",

    username: "staff",

    roles: [ROLES.USER, ROLES.MODERATOR],
  },

  superAdmin: {
    id: "root_1",

    username: "root",

    role: ROLES.SUPER_ADMIN,
  },
};

/*
 * ============================================================
 * 26. EXAMPLE ROLE RESOLUTION
 * ============================================================
 */

console.log("Admin roles:", getEffectiveRoles([ROLES.ADMIN]));

/*
 * Expected:
 *
 * [
 *   "admin",
 *   "moderator",
 *   "user",
 *   "guest"
 * ]
 */

/*
 * ============================================================
 * 27. SOCKET.IO DEMO
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",

    credentials: true,
  },
});

/*
 * ============================================================
 * 28. DEMO AUTHENTICATION
 * ============================================================
 *
 * Replace this with your real authentication middleware:
 *
 *     JWT
 *     session
 *     cookie
 *
 * ============================================================
 */

io.use((socket, next) => {
  /*
   * DEMO USER
   */

  socket.data.user = exampleUsers.admin;

  next();
});

/*
 * ============================================================
 * 29. DEFAULT NAMESPACE
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.data.user);

  /*
   * --------------------------------------------------------
   * BASIC ROLE CHECK
   * --------------------------------------------------------
   */

  socket.on("admin:dashboard", (payload, acknowledge) => {
    try {
      authorizeEvent(socket, {
        roles: [ROLES.ADMIN],
      });

      acknowledge?.({
        success: true,

        data: {
          message: "Admin dashboard",

          user: socket.data.user,
        },
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "FORBIDDEN",

          message: error.message,
        },
      });
    }
  });

  /*
   * --------------------------------------------------------
   * MODERATION
   * --------------------------------------------------------
   */

  socket.on("moderation:action", (payload, acknowledge) => {
    try {
      authorizeEvent(socket, {
        roles: [ROLES.MODERATOR, ROLES.ADMIN],

        permissions: ["moderation:action"],

        mode: "any",
      });

      acknowledge?.({
        success: true,

        message: "Moderation action allowed",
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "FORBIDDEN",

          message: error.message,
        },
      });
    }
  });

  /*
   * --------------------------------------------------------
   * ROLE INFORMATION
   * --------------------------------------------------------
   */

  socket.on("auth:roles", (acknowledge) => {
    const user = socket.data.user;

    acknowledge?.({
      success: true,

      data: {
        directRoles: getUserRoles(user),

        effectiveRoles: getEffectiveRoles(getUserRoles(user)),

        highestRole: getHighestRole(getUserRoles(user)),

        permissions: getEffectivePermissions(user),
      },
    });
  });
});

/*
 * ============================================================
 * 30. ADMIN NAMESPACE
 * ============================================================
 */

const adminNamespace = io.of("/admin");

/*
 * Namespace middleware.
 *
 * Every connection to:
 *
 *     /admin
 *
 * must have admin role.
 */

adminNamespace.use(requireRole(ROLES.ADMIN));

adminNamespace.on("connection", (socket) => {
  console.log("Admin namespace:", socket.data.user.id);

  socket.on("admin:users", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        message: "User management",
      },
    });
  });
});

/*
 * ============================================================
 * 31. START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`RBAC Socket.IO server running on port ${PORT}`);
});

/*
 * ============================================================
 * 32. EXPORT
 * ============================================================
 */

export { io, httpServer };
