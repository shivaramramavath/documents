/**
 * ============================================================
 * 05_errors/socket.errors.js
 * ============================================================
 *
 * SOCKET.IO ERROR HANDLING
 *
 * Topics:
 *
 * 01. JavaScript Error
 * 02. Custom SocketError
 * 03. Error codes
 * 04. HTTP-like status codes
 * 05. Operational errors
 * 06. Programmer errors
 * 07. Validation errors
 * 08. Authentication errors
 * 09. Authorization errors
 * 10. Not found errors
 * 11. Conflict errors
 * 12. Rate limit errors
 * 13. Timeout errors
 * 14. Internal errors
 * 15. Error normalization
 * 16. Safe client errors
 * 17. ACK error responses
 * 18. Socket error events
 * 19. Async error handling
 * 20. Centralized error handler
 * 21. Logging
 * 22. Error metadata
 * 23. Production error response
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * EXPRESS
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * HTTP SERVER
 * ============================================================
 */

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * BASE SOCKET ERROR
 * ============================================================
 *
 * Every application-specific Socket.IO error extends this.
 *
 * ============================================================
 */

class SocketError extends Error {
  constructor(message, options = {}) {
    super(message);

    /*
     * Error name.
     */

    this.name = options.name ?? "SocketError";

    /*
     * Machine-readable error code.
     */

    this.code = options.code ?? "SOCKET_ERROR";

    /*
     * Status-like numeric code.
     *
     * Useful for categorization even though
     * Socket.IO itself is not HTTP.
     */

    this.statusCode = options.statusCode ?? 500;

    /*
     * Whether this is an expected operational error.
     *
     * true:
     * application can safely handle it.
     *
     * false:
     * unexpected/programmer/system error.
     */

    this.isOperational = options.isOperational ?? true;

    /*
     * Optional metadata.
     *
     * NEVER put secrets here.
     */

    this.details = options.details ?? undefined;

    /*
     * Preserve original error.
     */

    this.cause = options.cause ?? undefined;

    /*
     * Capture stack correctly.
     */

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * ============================================================
 * VALIDATION ERROR
 * ============================================================
 */

class ValidationError extends SocketError {
  constructor(message = "Invalid request", details) {
    super(message, {
      name: "ValidationError",

      code: "VALIDATION_ERROR",

      statusCode: 400,

      isOperational: true,

      details,
    });
  }
}

/*
 * ============================================================
 * AUTHENTICATION ERROR
 * ============================================================
 */

class AuthenticationError extends SocketError {
  constructor(message = "Authentication required") {
    super(message, {
      name: "AuthenticationError",

      code: "AUTHENTICATION_REQUIRED",

      statusCode: 401,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * INVALID TOKEN ERROR
 * ============================================================
 */

class InvalidTokenError extends SocketError {
  constructor(message = "Invalid authentication token") {
    super(message, {
      name: "InvalidTokenError",

      code: "INVALID_TOKEN",

      statusCode: 401,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * FORBIDDEN ERROR
 * ============================================================
 */

class ForbiddenError extends SocketError {
  constructor(message = "You do not have permission") {
    super(message, {
      name: "ForbiddenError",

      code: "FORBIDDEN",

      statusCode: 403,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * NOT FOUND ERROR
 * ============================================================
 */

class NotFoundError extends SocketError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, {
      name: "NotFoundError",

      code: "NOT_FOUND",

      statusCode: 404,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * CONFLICT ERROR
 * ============================================================
 */

class ConflictError extends SocketError {
  constructor(message = "Resource conflict") {
    super(message, {
      name: "ConflictError",

      code: "CONFLICT",

      statusCode: 409,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * RATE LIMIT ERROR
 * ============================================================
 */

class RateLimitError extends SocketError {
  constructor(message = "Too many requests", retryAfter = 1000) {
    super(message, {
      name: "RateLimitError",

      code: "RATE_LIMITED",

      statusCode: 429,

      isOperational: true,

      details: {
        retryAfter,
      },
    });
  }
}

/*
 * ============================================================
 * TIMEOUT ERROR
 * ============================================================
 */

class TimeoutError extends SocketError {
  constructor(message = "Operation timed out") {
    super(message, {
      name: "TimeoutError",

      code: "TIMEOUT",

      statusCode: 408,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * INTERNAL ERROR
 * ============================================================
 */

class InternalError extends SocketError {
  constructor(message = "Internal server error", cause) {
    super(message, {
      name: "InternalError",

      code: "INTERNAL_ERROR",

      statusCode: 500,

      isOperational: false,

      cause,
    });
  }
}

/*
 * ============================================================
 * SERVICE UNAVAILABLE
 * ============================================================
 */

class ServiceUnavailableError extends SocketError {
  constructor(message = "Service temporarily unavailable") {
    super(message, {
      name: "ServiceUnavailableError",

      code: "SERVICE_UNAVAILABLE",

      statusCode: 503,

      isOperational: true,
    });
  }
}

/*
 * ============================================================
 * ERROR FACTORY
 * ============================================================
 */

const SocketErrors = {
  validation(message, details) {
    return new ValidationError(message, details);
  },

  authentication(message) {
    return new AuthenticationError(message);
  },

  invalidToken(message) {
    return new InvalidTokenError(message);
  },

  forbidden(message) {
    return new ForbiddenError(message);
  },

  notFound(resource) {
    return new NotFoundError(resource);
  },

  conflict(message) {
    return new ConflictError(message);
  },

  rateLimit(message, retryAfter) {
    return new RateLimitError(message, retryAfter);
  },

  timeout(message) {
    return new TimeoutError(message);
  },

  internal(message, cause) {
    return new InternalError(message, cause);
  },

  unavailable(message) {
    return new ServiceUnavailableError(message);
  },
};

/*
 * ============================================================
 * ERROR NORMALIZATION
 * ============================================================
 *
 * Convert ANY thrown value into SocketError.
 *
 * ============================================================
 */

function normalizeSocketError(error) {
  /*
   * Already our error.
   */

  if (error instanceof SocketError) {
    return error;
  }

  /*
   * Native Error.
   */

  if (error instanceof Error) {
    return new InternalError("Internal server error", error);
  }

  /*
   * Unknown thrown value.
   *
   * JavaScript allows:
   *
   * throw "hello";
   * throw 123;
   * throw null;
   *
   * Don't assume Error.
   */

  return new InternalError("Internal server error");
}

/*
 * ============================================================
 * SAFE CLIENT ERROR
 * ============================================================
 *
 * Never send:
 *
 * stack
 * cause
 * database errors
 * SQL
 * Redis errors
 * internal file paths
 * secrets
 *
 * ============================================================
 */

function toClientError(error) {
  const normalized = normalizeSocketError(error);

  const response = {
    code: normalized.code,

    message: normalized.message,
  };

  /*
   * Include details only for safe operational errors.
   */

  if (normalized.isOperational && normalized.details) {
    response.details = normalized.details;
  }

  return response;
}

/*
 * ============================================================
 * ACK ERROR RESPONSE
 * ============================================================
 */

function sendErrorAck(acknowledge, error) {
  const clientError = toClientError(error);

  acknowledge?.({
    success: false,

    error: clientError,
  });
}

/*
 * ============================================================
 * SUCCESS ACK
 * ============================================================
 */

function sendSuccessAck(acknowledge, data) {
  acknowledge?.({
    success: true,

    data,
  });
}

/*
 * ============================================================
 * LOG ERROR
 * ============================================================
 */

function logSocketError(socket, error, context = {}) {
  const normalized = normalizeSocketError(error);

  console.error({
    type: "socket_error",

    socketId: socket?.id,

    errorName: normalized.name,

    errorCode: normalized.code,

    message: normalized.message,

    statusCode: normalized.statusCode,

    isOperational: normalized.isOperational,

    context,

    stack: normalized.stack,

    cause: normalized.cause,
  });
}

/*
 * ============================================================
 * CENTRAL SOCKET ERROR HANDLER
 * ============================================================
 */

function handleSocketError(socket, error, options = {}) {
  /*
   * Normalize.
   */

  const normalized = normalizeSocketError(error);

  /*
   * Log.
   */

  logSocketError(socket, normalized, options.context);

  /*
   * Send ACK if supplied.
   */

  if (options.acknowledge) {
    sendErrorAck(options.acknowledge, normalized);
  }

  /*
   * Emit socket-level error event
   * when explicitly requested.
   */

  if (options.emit) {
    socket.emit("error:response", {
      success: false,

      error: toClientError(normalized),
    });
  }
}

/*
 * ============================================================
 * EXAMPLE DATABASE
 * ============================================================
 */

const users = new Map([
  [
    "user_1",
    {
      id: "user_1",

      name: "Shiva",
    },
  ],
]);

/*
 * ============================================================
 * DATABASE FUNCTION
 * ============================================================
 */

async function findUser(userId) {
  await delay(100);

  return users.get(userId) ?? null;
}

/*
 * ============================================================
 * CREATE USER
 * ============================================================
 */

async function createUser(payload) {
  await delay(100);

  if (!payload.email) {
    throw new ValidationError("Email is required", {
      field: "email",
    });
  }

  /*
   * Example conflict.
   */

  if (payload.email === "existing@example.com") {
    throw new ConflictError("Email is already registered");
  }

  const user = {
    id: `user_${Date.now()}`,

    name: payload.name,

    email: payload.email,
  };

  users.set(user.id, user);

  return user;
}

/*
 * ============================================================
 * DELAY
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
 * ============================================================
 * SOCKET CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 01. VALIDATION ERROR
   * ========================================================
   */

  socket.on("user:create", async (payload, acknowledge) => {
    try {
      if (!payload || typeof payload.name !== "string") {
        throw new ValidationError("name is required", {
          field: "name",
        });
      }

      const user = await createUser(payload);

      sendSuccessAck(acknowledge, user);
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "user:create",
        },
      });
    }
  });

  /*
   * ========================================================
   * 02. NOT FOUND
   * ========================================================
   */

  socket.on("user:get", async (userId, acknowledge) => {
    try {
      const user = await findUser(userId);

      if (!user) {
        throw new NotFoundError("User");
      }

      sendSuccessAck(acknowledge, user);
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "user:get",

          userId,
        },
      });
    }
  });

  /*
   * ========================================================
   * 03. AUTHENTICATION
   * ========================================================
   */

  socket.on("private:data", async (payload, acknowledge) => {
    try {
      /*
       * Example authentication.
       */

      if (!socket.data.user) {
        throw new AuthenticationError();
      }

      sendSuccessAck(acknowledge, {
        private: true,
      });
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "private:data",
        },
      });
    }
  });

  /*
   * ========================================================
   * 04. AUTHORIZATION
   * ========================================================
   */

  socket.on("admin:delete", async (payload, acknowledge) => {
    try {
      if (socket.data.role !== "admin") {
        throw new ForbiddenError("Admin permission required");
      }

      sendSuccessAck(acknowledge, {
        deleted: true,
      });
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "admin:delete",
        },
      });
    }
  });

  /*
   * ========================================================
   * 05. RATE LIMIT
   * ========================================================
   */

  socket.on("limited:event", (payload, acknowledge) => {
    try {
      /*
       * Example.
       *
       * Your actual rate limiter will live
       * in the security section.
       */

      const allowed = true;

      if (!allowed) {
        throw new RateLimitError("Too many requests", 2_000);
      }

      sendSuccessAck(acknowledge, {
        accepted: true,
      });
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "limited:event",
        },
      });
    }
  });

  /*
   * ========================================================
   * 06. TIMEOUT
   * ========================================================
   */

  socket.on("slow:event", async (payload, acknowledge) => {
    try {
      await delay(5_000);

      throw new TimeoutError("Operation exceeded allowed time");
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "slow:event",
        },
      });
    }
  });

  /*
   * ========================================================
   * 07. INTERNAL ERROR
   * ========================================================
   */

  socket.on("database:event", async (payload, acknowledge) => {
    try {
      /*
       * Simulate internal database failure.
       */

      throw new Error("MongoDB connection refused");
    } catch (error) {
      handleSocketError(socket, error, {
        acknowledge,

        context: {
          event: "database:event",
        },
      });
    }
  });

  /*
   * ========================================================
   * 08. ERROR EVENT
   * ========================================================
   */

  socket.on("error:event", (payload, acknowledge) => {
    const error = new SocketError("Example socket error", {
      code: "EXAMPLE_ERROR",

      statusCode: 400,

      isOperational: true,
    });

    handleSocketError(socket, error, {
      acknowledge,

      emit: true,

      context: {
        event: "error:event",
      },
    });
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});

/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

export {
  SocketError,
  ValidationError,
  AuthenticationError,
  InvalidTokenError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  TimeoutError,
  InternalError,
  ServiceUnavailableError,
  SocketErrors,
  normalizeSocketError,
  toClientError,
  sendErrorAck,
  sendSuccessAck,
  logSocketError,
  handleSocketError,
};
