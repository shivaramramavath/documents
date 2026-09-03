/**
 * ============================================================
 * 07_authentication/middleware-auth.js
 * ============================================================
 *
 * SOCKET.IO AUTHENTICATION MIDDLEWARE
 *
 * Topics:
 *
 * 1. io.use()
 * 2. namespace.use()
 * 3. middleware execution order
 * 4. async middleware
 * 5. authentication middleware
 * 6. authentication context
 * 7. middleware factories
 * 8. middleware composition
 * 9. public/protected namespaces
 * 10. error propagation
 * 11. authentication + validation
 * 12. authentication + authorization
 * 13. socket.data
 * 14. reusable middleware
 * 15. middleware isolation
 *
 * ============================================================
 */

import { createServer } from "node:http";

import { Server } from "socket.io";

import jwt from "jsonwebtoken";

/*
 * ============================================================
 * 01. CONFIGURATION
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret";

const JWT_ISSUER = process.env.JWT_ISSUER ?? "socket-api";

const JWT_AUDIENCE = process.env.JWT_AUDIENCE ?? "socket-client";

const JWT_ALGORITHM = "HS256";

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

  maxHttpBufferSize: 1e6,
});

/*
 * ============================================================
 * 04. CUSTOM AUTH ERROR
 * ============================================================
 */

export class AuthenticationError extends Error {
  constructor(
    message = "Authentication failed",

    code = "AUTHENTICATION_ERROR",
  ) {
    super(message);

    this.name = "AuthenticationError";

    this.code = code;
  }
}

/*
 * ============================================================
 * 05. AUTH ERROR HELPER
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
 * 06. GET TOKEN
 * ============================================================
 */

export function getToken(socket) {
  /*
   * ----------------------------------------------------------
   * Method 1:
   *
   * socket.handshake.auth.token
   * ----------------------------------------------------------
   */

  const authToken = socket?.handshake?.auth?.token;

  if (typeof authToken === "string" && authToken.trim()) {
    return authToken.trim();
  }

  /*
   * ----------------------------------------------------------
   * Method 2:
   *
   * Authorization: Bearer TOKEN
   * ----------------------------------------------------------
   */

  const authorization = socket?.handshake?.headers?.authorization;

  if (typeof authorization === "string") {
    const parts = authorization.trim().split(/\s+/);

    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
  }

  return null;
}

/*
 * ============================================================
 * 07. VERIFY JWT
 * ============================================================
 */

export function verifyToken(token) {
  if (typeof token !== "string") {
    throw new AuthenticationError("Token is required", "TOKEN_REQUIRED");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],

      issuer: JWT_ISSUER,

      audience: JWT_AUDIENCE,
    });

    if (typeof payload !== "object" || payload === null) {
      throw new AuthenticationError("Invalid token payload", "INVALID_TOKEN");
    }

    if (typeof payload.sub !== "string") {
      throw new AuthenticationError(
        "Token subject is missing",
        "INVALID_TOKEN",
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token expired", "TOKEN_EXPIRED");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Invalid token", "INVALID_TOKEN");
    }

    throw new AuthenticationError(
      "Authentication failed",
      "AUTHENTICATION_ERROR",
    );
  }
}

/*
 * ============================================================
 * 08. LOAD USER
 * ============================================================
 *
 * In a real application this would normally query:
 *
 * MongoDB
 * PostgreSQL
 * MySQL
 * Redis
 * another user service
 *
 * ============================================================
 */

export async function loadUser(userId) {
  /*
   * DEMO USER
   */

  const users = new Map([
    [
      "user_1",
      {
        id: "user_1",

        username: "shiva",

        role: "user",

        permissions: ["message:read", "message:send"],
      },
    ],

    [
      "admin_1",
      {
        id: "admin_1",

        username: "admin",

        role: "admin",

        permissions: [
          "message:read",
          "message:send",
          "message:delete",
          "admin:read",
        ],
      },
    ],
  ]);

  const user = users.get(userId);

  if (!user) {
    throw new AuthenticationError("User does not exist", "USER_NOT_FOUND");
  }

  return user;
}

/*
 * ============================================================
 * 09. BASE AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * Signature:
 *
 *     (socket, next)
 *
 * Socket.IO calls:
 *
 *     next()
 *
 * or:
 *
 *     next(error)
 *
 * ============================================================
 */

export async function authenticate(socket, next) {
  try {
    /*
     * Get credentials.
     */

    const token = getToken(socket);

    if (!token) {
      throw new AuthenticationError(
        "Authentication token is required",
        "TOKEN_REQUIRED",
      );
    }

    /*
     * Verify JWT.
     */

    const claims = verifyToken(token);

    /*
     * Load current user.
     */

    const user = await loadUser(claims.sub);

    /*
     * Store authenticated
     * user on socket.
     */

    socket.data.user = user;

    /*
     * Store authentication state.
     */

    socket.data.authenticated = true;

    /*
     * Store token metadata.
     *
     * Do NOT store the raw token
     * unnecessarily.
     */

    socket.data.auth = {
      jti: claims.jti,

      issuedAt: claims.iat,

      expiresAt: claims.exp,
    };

    /*
     * Continue middleware chain.
     */

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";

    const code =
      error instanceof AuthenticationError
        ? error.code
        : "AUTHENTICATION_ERROR";

    next(createAuthError(message, code));
  }
}

/*
 * ============================================================
 * 10. OPTIONAL AUTHENTICATION
 * ============================================================
 *
 * Some applications support:
 *
 *     anonymous user
 *
 * and:
 *
 *     authenticated user
 *
 * ============================================================
 */

export async function optionalAuthentication(socket, next) {
  try {
    const token = getToken(socket);

    /*
     * No token:
     *
     * Continue as anonymous.
     */

    if (!token) {
      socket.data.authenticated = false;

      socket.data.user = null;

      return next();
    }

    /*
     * Token exists:
     *
     * verify it.
     */

    const claims = verifyToken(token);

    const user = await loadUser(claims.sub);

    socket.data.authenticated = true;

    socket.data.user = user;

    return next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";

    const code =
      error instanceof AuthenticationError
        ? error.code
        : "AUTHENTICATION_ERROR";

    return next(createAuthError(message, code));
  }
}

/*
 * ============================================================
 * 11. REQUIRE AUTHENTICATED USER
 * ============================================================
 *
 * This can be used after optionalAuthentication.
 *
 * ============================================================
 */

export function requireAuthenticated(socket, next) {
  if (socket.data.authenticated !== true) {
    return next(
      createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
    );
  }

  if (!socket.data.user) {
    return next(
      createAuthError("Authenticated user is missing", "USER_CONTEXT_MISSING"),
    );
  }

  return next();
}

/*
 * ============================================================
 * 12. AUTHENTICATION LOGGING MIDDLEWARE
 * ============================================================
 */

export function authenticationLogger(socket, next) {
  const startedAt = Date.now();

  console.log("Socket authentication started", {
    socketId: socket.id,

    address: socket.handshake.address,
  });

  try {
    next();
  } finally {
    console.log("Socket authentication middleware completed", {
      socketId: socket.id,

      durationMs: Date.now() - startedAt,
    });
  }
}

/*
 * ============================================================
 * 13. USER CONTEXT MIDDLEWARE
 * ============================================================
 *
 * Makes useful context available to
 * later middleware and handlers.
 * ============================================================
 */

export function userContext(socket, next) {
  if (!socket.data.user) {
    return next(
      createAuthError("User context is missing", "USER_CONTEXT_MISSING"),
    );
  }

  socket.data.context = {
    userId: socket.data.user.id,

    username: socket.data.user.username,

    role: socket.data.user.role,
  };

  next();
}

/*
 * ============================================================
 * 14. ROLE MIDDLEWARE FACTORY
 * ============================================================
 *
 * Middleware factory:
 *
 *     requireRole("admin")
 *
 * returns:
 *
 *     (socket, next) => {}
 *
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

    if (user.role !== requiredRole) {
      return next(createAuthError("Insufficient role", "FORBIDDEN"));
    }

    next();
  };
}

/*
 * ============================================================
 * 15. PERMISSION MIDDLEWARE FACTORY
 * ============================================================
 */

export function requirePermission(requiredPermission) {
  return function permissionMiddleware(socket, next) {
    const user = socket.data.user;

    if (!user) {
      return next(
        createAuthError("Authentication required", "AUTHENTICATION_REQUIRED"),
      );
    }

    const permissions = user.permissions ?? [];

    if (!permissions.includes(requiredPermission)) {
      return next(createAuthError("Permission denied", "FORBIDDEN"));
    }

    next();
  };
}

/*
 * ============================================================
 * 16. REQUEST ID MIDDLEWARE
 * ============================================================
 */

export function requestContext(socket, next) {
  socket.data.requestId = crypto.randomUUID();

  next();
}

/*
 * ============================================================
 * 17. IMPORT CRYPTO
 * ============================================================
 */

import crypto from "node:crypto";

/*
 * ============================================================
 * 18. RATE / CONNECTION CONTEXT
 * ============================================================
 *
 * This isn't a complete rate limiter.
 *
 * It demonstrates where connection metadata
 * can be attached.
 * ============================================================
 */

export function connectionContext(socket, next) {
  socket.data.connectedAt = Date.now();

  socket.data.ip = socket.handshake.address;

  socket.data.transport = socket.conn.transport.name;

  next();
}

/*
 * ============================================================
 * 19. COMPOSE MIDDLEWARE
 * ============================================================
 *
 * Usage:
 *
 * io.use(
 *   compose(
 *     middleware1,
 *     middleware2,
 *     middleware3,
 *   ),
 * );
 *
 * ============================================================
 */

export function compose(middlewares) {
  return function composedMiddleware(socket, finalNext) {
    let index = -1;

    function dispatch(currentIndex) {
      /*
       * Prevent next() from being called twice.
       */

      if (currentIndex <= index) {
        return finalNext(
          createAuthError("next() called multiple times", "MIDDLEWARE_ERROR"),
        );
      }

      index = currentIndex;

      /*
       * All middleware completed.
       */

      if (currentIndex === middlewares.length) {
        return finalNext();
      }

      const middleware = middlewares[currentIndex];

      if (typeof middleware !== "function") {
        return finalNext(
          createAuthError("Invalid middleware", "MIDDLEWARE_ERROR"),
        );
      }

      try {
        middleware(socket, (error) => {
          if (error) {
            return finalNext(error);
          }

          dispatch(currentIndex + 1);
        });
      } catch (error) {
        finalNext(error);
      }
    }

    dispatch(0);
  };
}

/*
 * ============================================================
 * 20. GLOBAL AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * Every namespace using this Server instance
 * is affected by io.use().
 *
 * ============================================================
 */

io.use(authenticate);

/*
 * ============================================================
 * 21. ADDITIONAL GLOBAL MIDDLEWARE
 * ============================================================
 */

io.use(requestContext);

io.use(connectionContext);

/*
 * ============================================================
 * 22. DEFAULT NAMESPACE
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Authenticated connection", {
    socketId: socket.id,

    userId: socket.data.user.id,

    username: socket.data.user.username,

    role: socket.data.user.role,

    requestId: socket.data.requestId,
  });

  socket.on("auth:me", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        user: socket.data.user,

        authenticated: socket.data.authenticated,

        context: socket.data.context,
      },
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected", {
      socketId: socket.id,

      userId: socket.data.user?.id,

      reason,
    });
  });
});

/*
 * ============================================================
 * 23. PROTECTED ADMIN NAMESPACE
 * ============================================================
 */

const adminNamespace = io.of("/admin");

/*
 * Namespace-specific middleware.
 *
 * This executes for connections
 * to /admin.
 */

adminNamespace.use(requireRole("admin"));

adminNamespace.on("connection", (socket) => {
  console.log("Admin connected", {
    socketId: socket.id,

    userId: socket.data.user.id,
  });

  socket.on("dashboard:get", (acknowledge) => {
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
 * 24. CHAT NAMESPACE
 * ============================================================
 */

const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
  console.log("Chat connection", socket.data.user.id);

  socket.on("message:send", (payload, acknowledge) => {
    console.log("Message from:", socket.data.user.id);

    acknowledge?.({
      success: true,

      data: {
        senderId: socket.data.user.id,

        payload,
      },
    });
  });
});

/*
 * ============================================================
 * 25. PUBLIC NAMESPACE
 * ============================================================
 *
 * No authentication middleware.
 *
 * ============================================================
 */

const publicNamespace = io.of("/public");

publicNamespace.on("connection", (socket) => {
  console.log("Public connection:", socket.id);

  socket.emit("public:welcome", {
    message: "Welcome anonymous user",
  });
});

/*
 * ============================================================
 * 26. OPTIONAL AUTH NAMESPACE
 * ============================================================
 */

const optionalNamespace = io.of("/optional");

optionalNamespace.use(optionalAuthentication);

optionalNamespace.on("connection", (socket) => {
  if (socket.data.authenticated) {
    console.log("Authenticated optional user:", socket.data.user.id);
  } else {
    console.log("Anonymous optional connection:", socket.id);
  }
});

/*
 * ============================================================
 * 27. PROTECTED PERMISSION NAMESPACE
 * ============================================================
 */

const messageNamespace = io.of("/messages");

messageNamespace.use(requirePermission("message:send"));

messageNamespace.on("connection", (socket) => {
  socket.on("message:send", (payload, acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        senderId: socket.data.user.id,

        payload,
      },
    });
  });
});

/*
 * ============================================================
 * 28. MULTI-MIDDLEWARE EXAMPLE
 * ============================================================
 *
 * This shows the intended order:
 *
 *     authentication
 *          ↓
 *     user context
 *          ↓
 *     authorization
 *          ↓
 *     handler
 *
 * ============================================================
 */

const secureNamespace = io.of("/secure");

secureNamespace.use(
  compose([
    /*
     * Authentication is already global for
     * the default Server.
     *
     * For demonstration we show reusable
     * middleware concepts here.
     */
  ]),
);

/*
 * ============================================================
 * 29. CONNECTION ERROR HANDLING
 * ============================================================
 */

io.engine.on("connection_error", (error) => {
  console.error("Engine connection error", {
    message: error.message,

    code: error.code,

    context: error.context,
  });
});

/*
 * ============================================================
 * 30. START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`Middleware authentication server running on port ${PORT}`);
});

/*
 * ============================================================
 * 31. EXPORTS
 * ============================================================
 */

export { io, httpServer };
