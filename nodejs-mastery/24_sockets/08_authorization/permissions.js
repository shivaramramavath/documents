/**
 * ============================================================
 * 08_authorization/permissions.js
 * ============================================================
 *
 * SOCKET.IO AUTHORIZATION - PERMISSIONS
 *
 * Topics:
 *
 * 01. Authentication vs Authorization
 * 02. Permission naming
 * 03. Permission maps
 * 04. User permissions
 * 05. hasPermission()
 * 06. requirePermission()
 * 07. requireAnyPermission()
 * 08. requireAllPermissions()
 * 09. wildcard permissions
 * 10. permission middleware
 * 11. event-level authorization
 * 12. namespace authorization
 * 13. resource ownership
 * 14. admin permissions
 * 15. permission hierarchy
 * 16. permission composition
 * 17. authorization errors
 * 18. production architecture
 *
 * ============================================================
 */

import { createServer } from "node:http";

import { Server } from "socket.io";

/*
 * ============================================================
 * 01. CONFIGURATION
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

/*
 * ============================================================
 * 02. HTTP SERVER
 * ============================================================
 */

const httpServer = createServer();

/*
 * ============================================================
 * 03. SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,

    credentials: true,

    methods: ["GET", "POST"],
  },
});

/*
 * ============================================================
 * 04. AUTHORIZATION ERROR
 * ============================================================
 */

export class AuthorizationError extends Error {
  constructor(
    message = "Permission denied",

    code = "FORBIDDEN",
  ) {
    super(message);

    this.name = "AuthorizationError";

    this.code = code;
  }
}

/*
 * ============================================================
 * 05. PERMISSION CONSTANTS
 * ============================================================
 *
 * Centralizing permission names prevents typos.
 *
 * ============================================================
 */

export const PERMISSIONS = Object.freeze({
  /*
   * Messages
   */

  MESSAGE_READ: "message:read",

  MESSAGE_SEND: "message:send",

  MESSAGE_UPDATE: "message:update",

  MESSAGE_DELETE: "message:delete",

  /*
   * Chat
   */

  CHAT_READ: "chat:read",

  CHAT_SEND: "chat:send",

  CHAT_DELETE: "chat:delete",

  /*
   * Users
   */

  USER_READ: "user:read",

  USER_UPDATE: "user:update",

  USER_DELETE: "user:delete",

  /*
   * Administration
   */

  ADMIN_READ: "admin:read",

  ADMIN_UPDATE: "admin:update",

  ADMIN_DELETE: "admin:delete",

  /*
   * Moderation
   */

  MODERATION_READ: "moderation:read",

  MODERATION_ACTION: "moderation:action",
});

/*
 * ============================================================
 * 06. ROLE → PERMISSION MAP
 * ============================================================
 */

export const ROLE_PERMISSIONS = Object.freeze({
  guest: [PERMISSIONS.MESSAGE_READ, PERMISSIONS.CHAT_READ],

  user: [
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_SEND,

    PERMISSIONS.CHAT_READ,
    PERMISSIONS.CHAT_SEND,

    PERMISSIONS.USER_READ,
  ],

  moderator: [
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_UPDATE,
    PERMISSIONS.MESSAGE_DELETE,

    PERMISSIONS.CHAT_READ,
    PERMISSIONS.CHAT_SEND,
    PERMISSIONS.CHAT_DELETE,

    PERMISSIONS.USER_READ,

    PERMISSIONS.MODERATION_READ,
    PERMISSIONS.MODERATION_ACTION,
  ],

  admin: [
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_UPDATE,
    PERMISSIONS.MESSAGE_DELETE,

    PERMISSIONS.CHAT_READ,
    PERMISSIONS.CHAT_SEND,
    PERMISSIONS.CHAT_DELETE,

    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,

    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_UPDATE,
    PERMISSIONS.ADMIN_DELETE,

    PERMISSIONS.MODERATION_READ,
    PERMISSIONS.MODERATION_ACTION,
  ],
});

/*
 * ============================================================
 * 07. ADMIN SUPER PERMISSION
 * ============================================================
 *
 * "*" means all permissions in this example.
 *
 * Be careful with wildcard permissions in production.
 * ============================================================
 */

export const SUPER_ADMIN_ROLE = "superadmin";

/*
 * ============================================================
 * 08. GET USER PERMISSIONS
 * ============================================================
 */

export function getUserPermissions(user) {
  if (!user) {
    return [];
  }

  /*
   * If permissions are explicitly stored on the
   * user object, use them.
   */

  if (Array.isArray(user.permissions)) {
    return user.permissions;
  }

  /*
   * Otherwise derive permissions from role.
   */

  if (user.role === SUPER_ADMIN_ROLE) {
    return ["*"];
  }

  return ROLE_PERMISSIONS[user.role] ?? [];
}

/*
 * ============================================================
 * 09. BASIC PERMISSION CHECK
 * ============================================================
 */

export function hasPermission(user, requiredPermission) {
  if (!user) {
    return false;
  }

  if (typeof requiredPermission !== "string") {
    return false;
  }

  const permissions = getUserPermissions(user);

  /*
   * Super admin.
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
   * Wildcard support.
   *
   * Example:
   *
   * message:*
   *
   * matches:
   *
   * message:read
   * message:send
   * message:delete
   */

  for (const permission of permissions) {
    if (permission.endsWith(":*")) {
      const prefix = permission.slice(0, -1);

      if (requiredPermission.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
}

/*
 * ============================================================
 * 10. ANY PERMISSION
 * ============================================================
 *
 * User must have at least ONE.
 *
 * ============================================================
 */

export function hasAnyPermission(user, requiredPermissions) {
  if (!Array.isArray(requiredPermissions)) {
    return false;
  }

  return requiredPermissions.some((permission) =>
    hasPermission(user, permission),
  );
}

/*
 * ============================================================
 * 11. ALL PERMISSIONS
 * ============================================================
 *
 * User must have EVERY permission.
 *
 * ============================================================
 */

export function hasAllPermissions(user, requiredPermissions) {
  if (!Array.isArray(requiredPermissions)) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
}

/*
 * ============================================================
 * 12. REQUIRE PERMISSION MIDDLEWARE
 * ============================================================
 *
 * Usage:
 *
 *     requirePermission(
 *       "message:delete"
 *     )
 *
 * ============================================================
 */

export function requirePermission(requiredPermission) {
  return function permissionMiddleware(socket, next) {
    const user = socket.data.user;

    /*
     * Authentication should already
     * have happened.
     */

    if (!user) {
      return next(
        createAuthorizationError(
          "Authentication required",
          "AUTHENTICATION_REQUIRED",
        ),
      );
    }

    if (!hasPermission(user, requiredPermission)) {
      return next(
        createAuthorizationError(
          `Missing permission: ${requiredPermission}`,
          "FORBIDDEN",
        ),
      );
    }

    /*
     * Store authorization information
     * for later handlers.
     */

    socket.data.authorization = {
      checked: true,

      permission: requiredPermission,
    };

    next();
  };
}

/*
 * ============================================================
 * 13. ANY PERMISSION MIDDLEWARE
 * ============================================================
 */

export function requireAnyPermission(requiredPermissions) {
  return function anyPermissionMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthorizationError(
          "Authentication required",
          "AUTHENTICATION_REQUIRED",
        ),
      );
    }

    if (!hasAnyPermission(user, requiredPermissions)) {
      return next(
        createAuthorizationError(
          "None of the required permissions are available",
          "FORBIDDEN",
        ),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 14. ALL PERMISSIONS MIDDLEWARE
 * ============================================================
 */

export function requireAllPermissions(requiredPermissions) {
  return function allPermissionMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthorizationError(
          "Authentication required",
          "AUTHENTICATION_REQUIRED",
        ),
      );
    }

    if (!hasAllPermissions(user, requiredPermissions)) {
      return next(
        createAuthorizationError(
          "Required permissions are missing",
          "FORBIDDEN",
        ),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 15. CREATE AUTHORIZATION ERROR
 * ============================================================
 */

function createAuthorizationError(message, code) {
  const error = new Error(message);

  error.data = {
    code,

    message,
  };

  return error;
}

/*
 * ============================================================
 * 16. ROLE CHECK
 * ============================================================
 */

export function hasRole(user, requiredRole) {
  if (!user) {
    return false;
  }

  return user.role === requiredRole;
}

/*
 * ============================================================
 * 17. REQUIRE ROLE
 * ============================================================
 */

export function requireRole(requiredRole) {
  return function roleMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthorizationError(
          "Authentication required",
          "AUTHENTICATION_REQUIRED",
        ),
      );
    }

    if (!hasRole(user, requiredRole)) {
      return next(
        createAuthorizationError(
          `Role '${requiredRole}' required`,
          "FORBIDDEN",
        ),
      );
    }

    next();
  };
}

/*
 * ============================================================
 * 18. RESOURCE OWNERSHIP
 * ============================================================
 *
 * Example:
 *
 * User can update:
 *
 *     their own profile
 *
 * but not:
 *
 *     another user's profile.
 *
 * ============================================================
 */

export function isOwner(user, resource) {
  if (!user || !resource) {
    return false;
  }

  return String(user.id) === String(resource.userId);
}

/*
 * ============================================================
 * 19. REQUIRE OWNER
 * ============================================================
 */

export function requireOwner(getResource) {
  return async function ownerMiddleware(socket, next) {
    try {
      const user = socket.data.user;

      if (!user) {
        return next(
          createAuthorizationError(
            "Authentication required",
            "AUTHENTICATION_REQUIRED",
          ),
        );
      }

      /*
       * Resource can come from:
       *
       * database
       * Redis
       * service
       * request payload
       *
       * Prefer server-side lookup for
       * sensitive operations.
       */

      const resource = await getResource(socket);

      if (!resource) {
        return next(
          createAuthorizationError("Resource not found", "RESOURCE_NOT_FOUND"),
        );
      }

      if (!isOwner(user, resource)) {
        return next(
          createAuthorizationError("You do not own this resource", "FORBIDDEN"),
        );
      }

      /*
       * Make resource available to
       * subsequent handlers.
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
 * 20. DEMO RESOURCE DATABASE
 * ============================================================
 */

const messages = new Map([
  [
    "message_1",
    {
      id: "message_1",

      userId: "user_1",

      content: "Hello",
    },
  ],

  [
    "message_2",
    {
      id: "message_2",

      userId: "admin_1",

      content: "Admin message",
    },
  ],
]);

/*
 * ============================================================
 * 21. RESOURCE LOADER
 * ============================================================
 */

async function getMessage(socket) {
  /*
   * NEVER trust:
   *
   * payload.userId
   *
   * for ownership.
   *
   * The server looks up the resource.
   */

  const messageId = socket.handshake.auth?.messageId;

  if (!messageId) {
    return null;
  }

  return messages.get(messageId) ?? null;
}

/*
 * ============================================================
 * 22. PUBLIC NAMESPACE
 * ============================================================
 */

const publicNamespace = io.of("/public");

publicNamespace.on("connection", (socket) => {
  socket.emit("public:welcome", {
    message: "Public socket",
  });
});

/*
 * ============================================================
 * 23. AUTHENTICATED DEFAULT NAMESPACE
 * ============================================================
 *
 * DEMO AUTHENTICATION
 *
 * In your real project this should be:
 *
 *     io.use(authenticate)
 *
 * from:
 *
 *     07_authentication/
 *
 * ============================================================
 */

io.use((socket, next) => {
  /*
   * DEMO ONLY.
   *
   * Real authentication should populate:
   *
   * socket.data.user
   */

  socket.data.user = {
    id: "user_1",

    username: "shiva",

    role: "user",

    permissions: [
      PERMISSIONS.MESSAGE_READ,
      PERMISSIONS.MESSAGE_SEND,
      PERMISSIONS.CHAT_READ,
      PERMISSIONS.CHAT_SEND,
      PERMISSIONS.USER_READ,
    ],
  };

  next();
});

/*
 * ============================================================
 * 24. CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.data.user);

  /*
   * --------------------------------------------------------
   * READ MESSAGE
   * --------------------------------------------------------
   */

  socket.on("message:read", (payload, acknowledge) => {
    const user = socket.data.user;

    if (!hasPermission(user, PERMISSIONS.MESSAGE_READ)) {
      return acknowledge?.({
        success: false,

        error: {
          code: "FORBIDDEN",

          message: "message:read permission required",
        },
      });
    }

    acknowledge?.({
      success: true,

      data: {
        message: "Message read",
      },
    });
  });

  /*
   * --------------------------------------------------------
   * SEND MESSAGE
   * --------------------------------------------------------
   */

  socket.on("message:send", (payload, acknowledge) => {
    const user = socket.data.user;

    if (!hasPermission(user, PERMISSIONS.MESSAGE_SEND)) {
      return acknowledge?.({
        success: false,

        error: {
          code: "FORBIDDEN",

          message: "message:send permission required",
        },
      });
    }

    acknowledge?.({
      success: true,

      data: {
        senderId: user.id,

        content: payload?.content,
      },
    });
  });

  /*
   * --------------------------------------------------------
   * DELETE MESSAGE
   * --------------------------------------------------------
   *
   * user_1 does NOT have message:delete.
   * --------------------------------------------------------
   */

  socket.on("message:delete", (payload, acknowledge) => {
    const user = socket.data.user;

    if (!hasPermission(user, PERMISSIONS.MESSAGE_DELETE)) {
      return acknowledge?.({
        success: false,

        error: {
          code: "FORBIDDEN",

          message: "Permission denied",
        },
      });
    }

    /*
     * Delete operation here.
     */

    acknowledge?.({
      success: true,

      message: "Message deleted",
    });
  });
});

/*
 * ============================================================
 * 25. ADMIN NAMESPACE
 * ============================================================
 */

const adminNamespace = io.of("/admin");

/*
 * Authentication should be global.
 *
 * Then authorization:
 */

adminNamespace.use(requireRole("admin"));

adminNamespace.on("connection", (socket) => {
  socket.on("admin:dashboard", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        message: "Admin dashboard",
      },
    });
  });
});

/*
 * ============================================================
 * 26. PERMISSION NAMESPACE
 * ============================================================
 */

const moderationNamespace = io.of("/moderation");

moderationNamespace.use(requirePermission(PERMISSIONS.MODERATION_ACTION));

moderationNamespace.on("connection", (socket) => {
  console.log("Moderator connected:", socket.data.user.id);

  socket.on("moderation:action", (payload, acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        moderator: socket.data.user.id,

        payload,
      },
    });
  });
});

/*
 * ============================================================
 * 27. START
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`Authorization server running on port ${PORT}`);
});

/*
 * ============================================================
 * 28. EXPORTS
 * ============================================================
 */

export { io, httpServer };
