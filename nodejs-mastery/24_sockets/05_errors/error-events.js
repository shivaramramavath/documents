/**
 * ============================================================
 * 05_errors/error-events.js
 * ============================================================
 *
 * SOCKET.IO ERROR EVENTS
 *
 * Topics:
 *
 * 01. socket.on("error")
 * 02. socket.emit("error")
 * 03. connect_error
 * 04. middleware errors
 * 05. connection errors
 * 06. application error events
 * 07. ACK errors
 * 08. event-level errors
 * 09. async event errors
 * 10. validation errors
 * 11. authentication errors
 * 12. authorization errors
 * 13. safe error payloads
 * 14. centralized error handling
 * 15. client error handling
 * 16. server error handling
 * 17. disconnect after fatal errors
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
 * SOCKET.IO
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * CUSTOM ERROR
 * ============================================================
 */

class SocketError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = options.name ?? "SocketError";

    this.code = options.code ?? "SOCKET_ERROR";

    this.statusCode = options.statusCode ?? 500;

    this.isOperational = options.isOperational ?? true;

    this.details = options.details;

    this.cause = options.cause;

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * ============================================================
 * ERROR TYPES
 * ============================================================
 */

class ValidationError extends SocketError {
  constructor(message = "Invalid request", details) {
    super(message, {
      name: "ValidationError",

      code: "VALIDATION_ERROR",

      statusCode: 400,

      details,
    });
  }
}

class AuthenticationError extends SocketError {
  constructor(message = "Authentication required") {
    super(message, {
      name: "AuthenticationError",

      code: "AUTHENTICATION_REQUIRED",

      statusCode: 401,
    });
  }
}

class ForbiddenError extends SocketError {
  constructor(message = "Forbidden") {
    super(message, {
      name: "ForbiddenError",

      code: "FORBIDDEN",

      statusCode: 403,
    });
  }
}

class NotFoundError extends SocketError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, {
      name: "NotFoundError",

      code: "NOT_FOUND",

      statusCode: 404,
    });
  }
}

/*
 * ============================================================
 * NORMALIZE ERROR
 * ============================================================
 */

function normalizeError(error) {
  if (error instanceof SocketError) {
    return error;
  }

  if (error instanceof Error) {
    return new SocketError("Internal server error", {
      name: "InternalError",

      code: "INTERNAL_ERROR",

      statusCode: 500,

      isOperational: false,

      cause: error,
    });
  }

  return new SocketError("Internal server error", {
    name: "InternalError",

    code: "INTERNAL_ERROR",

    statusCode: 500,

    isOperational: false,
  });
}

/*
 * ============================================================
 * SAFE CLIENT ERROR
 * ============================================================
 */

function toClientError(error) {
  const normalized = normalizeError(error);

  const response = {
    code: normalized.code,

    message: normalized.message,
  };

  /*
   * Only expose safe details.
   */

  if (normalized.isOperational && normalized.details) {
    response.details = normalized.details;
  }

  return response;
}

/*
 * ============================================================
 * ERROR EVENT EMITTER
 * ============================================================
 */

function emitError(socket, error, metadata = {}) {
  const clientError = toClientError(error);

  /*
   * Server-side logging.
   */

  console.error({
    socketId: socket.id,

    code: clientError.code,

    message: clientError.message,

    metadata,

    stack: error?.stack,
  });

  /*
   * Application-level error event.
   */

  socket.emit("error:response", {
    success: false,

    error: clientError,

    meta: metadata,
  });
}

/*
 * ============================================================
 * ACK ERROR
 * ============================================================
 */

function ackError(acknowledge, error) {
  acknowledge?.({
    success: false,

    error: toClientError(error),
  });
}

/*
 * ============================================================
 * ACK SUCCESS
 * ============================================================
 */

function ackSuccess(acknowledge, data) {
  acknowledge?.({
    success: true,

    data,
  });
}

/*
 * ============================================================
 * GLOBAL SOCKET.IO MIDDLEWARE
 * ============================================================
 *
 * Errors thrown or passed to next(error) here are delivered
 * to the client through "connect_error".
 *
 * ============================================================
 */

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  /*
   * Missing token.
   */

  if (!token) {
    return next(new AuthenticationError("Authentication token required"));
  }

  /*
   * Example token validation.
   */

  if (token !== "valid-token") {
    return next(
      new SocketError("Invalid authentication token", {
        name: "AuthenticationError",

        code: "INVALID_TOKEN",

        statusCode: 401,
      }),
    );
  }

  /*
   * Attach authenticated user.
   */

  socket.data.user = {
    id: "user_123",

    role: "user",
  };

  next();
});

/*
 * ============================================================
 * CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /*
   * ========================================================
   * 01. SOCKET ERROR EVENT
   * ========================================================
   *
   * This listens for errors associated with the socket.
   *
   * ========================================================
   */

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  /*
   * ========================================================
   * 02. APPLICATION ERROR EVENT
   * ========================================================
   *
   * Our own application event.
   *
   * ========================================================
   */

  socket.on("application:error", (payload, acknowledge) => {
    const error = new SocketError("Application error example", {
      code: "APPLICATION_ERROR",

      statusCode: 400,

      details: {
        event: "application:error",
      },
    });

    /*
     * You can use ACK.
     */

    ackError(acknowledge, error);
  });

  /*
   * ========================================================
   * 03. EXPLICIT ERROR EVENT
   * ========================================================
   */

  socket.on("error:test", (payload, acknowledge) => {
    try {
      throw new ValidationError("Invalid test payload", {
        field: "payload",
      });
    } catch (error) {
      /*
       * Send using application-level event.
       */

      emitError(socket, error, {
        event: "error:test",
      });

      /*
       * Also ACK if caller supplied one.
       */

      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 04. VALIDATION ERROR
   * ========================================================
   */

  socket.on("user:update", async (payload, acknowledge) => {
    try {
      if (!payload) {
        throw new ValidationError("Payload is required");
      }

      if (typeof payload.name !== "string") {
        throw new ValidationError("name must be a string", {
          field: "name",

          expected: "string",
        });
      }

      ackSuccess(acknowledge, {
        updated: true,
      });
    } catch (error) {
      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 05. AUTHENTICATION ERROR
   * ========================================================
   */

  socket.on("private:data", (payload, acknowledge) => {
    try {
      if (!socket.data.user) {
        throw new AuthenticationError();
      }

      ackSuccess(acknowledge, {
        authenticated: true,
      });
    } catch (error) {
      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 06. AUTHORIZATION ERROR
   * ========================================================
   */

  socket.on("admin:action", (payload, acknowledge) => {
    try {
      if (socket.data.user?.role !== "admin") {
        throw new ForbiddenError("Admin permission required");
      }

      ackSuccess(acknowledge, {
        executed: true,
      });
    } catch (error) {
      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 07. NOT FOUND ERROR
   * ========================================================
   */

  socket.on("user:get", async (userId, acknowledge) => {
    try {
      /*
       * Example lookup.
       */

      const user = null;

      if (!user) {
        throw new NotFoundError("User");
      }

      ackSuccess(acknowledge, user);
    } catch (error) {
      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 08. ASYNC ERROR
   * ========================================================
   */

  socket.on("async:error", async (payload, acknowledge) => {
    try {
      await Promise.resolve();

      /*
       * Simulate async failure.
       */

      throw new Error("Unexpected asynchronous failure");
    } catch (error) {
      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 09. ERROR EVENT WITH METADATA
   * ========================================================
   */

  socket.on("operation", (payload, acknowledge) => {
    try {
      if (payload?.action !== "allowed") {
        throw new ForbiddenError("Operation is not allowed");
      }

      ackSuccess(acknowledge, {
        completed: true,
      });
    } catch (error) {
      emitError(socket, error, {
        event: "operation",

        requestId: payload?.requestId,
      });

      ackError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 10. FATAL ERROR EXAMPLE
   * ========================================================
   */

  socket.on("fatal:test", (payload) => {
    const error = new SocketError("Fatal socket error", {
      code: "FATAL_SOCKET_ERROR",

      statusCode: 500,

      isOperational: false,
    });

    console.error(error);

    /*
     * Notify client before disconnecting.
     */

    socket.emit("error:response", {
      success: false,

      error: {
        code: "FATAL_SOCKET_ERROR",

        message: "Connection cannot continue",
      },
    });

    /*
     * Disconnect this socket.
     */

    socket.disconnect(true);
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log(
      "Socket disconnected:",
      socket.id,

      "reason:",
      reason,
    );
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server listening on port 3000");
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
  ForbiddenError,
  NotFoundError,
  normalizeError,
  toClientError,
  emitError,
  ackError,
  ackSuccess,
};
