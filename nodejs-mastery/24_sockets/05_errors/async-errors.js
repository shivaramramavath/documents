/**
 * ============================================================
 * 05_errors/async-errors.js
 * ============================================================
 *
 * SOCKET.IO ASYNC ERROR HANDLING
 *
 * Topics:
 *
 * 01. async/await errors
 * 02. Promise rejection
 * 03. try/catch
 * 04. async handler wrapper
 * 05. ACK error propagation
 * 06. socket error events
 * 07. service errors
 * 08. database errors
 * 09. external API errors
 * 10. timeout errors
 * 11. Promise.all errors
 * 12. Promise.allSettled
 * 13. sequential async operations
 * 14. parallel async operations
 * 15. error normalization
 * 16. operational errors
 * 17. unexpected errors
 * 18. centralized error handling
 * 19. request IDs
 * 20. safe production responses
 *
 * ============================================================
 */

/*
 * ============================================================
 * CUSTOM SOCKET ERROR
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
 * ERROR NORMALIZER
 * ============================================================
 */

function normalizeError(error) {
  /*
   * Already a SocketError.
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
   */

  return new InternalError("Internal server error");
}

/*
 * ============================================================
 * SAFE CLIENT ERROR
 * ============================================================
 */

function toClientError(error) {
  const normalized = normalizeError(error);

  const result = {
    code: normalized.code,

    message: normalized.message,
  };

  /*
   * Only expose explicitly safe details.
   */

  if (normalized.isOperational && normalized.details) {
    result.details = normalized.details;
  }

  return result;
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
 * LOG ERROR
 * ============================================================
 */

function logError(socket, error, context = {}) {
  const normalized = normalizeError(error);

  console.error({
    socketId: socket?.id,

    code: normalized.code,

    message: normalized.message,

    statusCode: normalized.statusCode,

    operational: normalized.isOperational,

    context,

    stack: normalized.stack,

    cause: normalized.cause,
  });
}

/*
 * ============================================================
 * CENTRAL ASYNC ERROR HANDLER
 * ============================================================
 */

function handleAsyncError(socket, error, acknowledge, context = {}) {
  /*
   * Normalize.
   */

  const normalized = normalizeError(error);

  /*
   * Log server-side details.
   */

  logError(socket, normalized, context);

  /*
   * Send safe response.
   */

  ackError(acknowledge, normalized);
}

/*
 * ============================================================
 * ASYNC HANDLER WRAPPER
 * ============================================================
 *
 * Instead of writing:
 *
 * try {
 *   await handler();
 * } catch (error) {
 *   ...
 * }
 *
 * for every event, we can wrap the handler.
 *
 * ============================================================
 */

function asyncSocketHandler(handler) {
  return async (socket, payload, acknowledge) => {
    try {
      await handler(socket, payload, acknowledge);
    } catch (error) {
      handleAsyncError(socket, error, acknowledge);
    }
  };
}

/*
 * ============================================================
 * EXAMPLE ASYNC SERVICE
 * ============================================================
 */

async function findUser(userId) {
  await delay(100);

  if (userId === "missing") {
    throw new NotFoundError("User");
  }

  return {
    id: userId,

    name: "Shiva",
  };
}

/*
 * ============================================================
 * DATABASE SERVICE EXAMPLE
 * ============================================================
 */

async function databaseOperation() {
  await delay(100);

  /*
   * Simulate database failure.
   */

  throw new Error("Database connection failed");
}

/*
 * ============================================================
 * EXTERNAL API EXAMPLE
 * ============================================================
 */

async function externalApiCall() {
  await delay(100);

  /*
   * Simulate external API failure.
   */

  throw new Error("Payment service unavailable");
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
 * TIMEOUT WRAPPER
 * ============================================================
 *
 * Race an operation against a timeout.
 *
 * ============================================================
 */

async function withTimeout(promise, milliseconds) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${milliseconds}ms`));
    }, milliseconds);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

/*
 * ============================================================
 * SOCKET.IO EXAMPLE
 * ============================================================
 *
 * Assumes:
 *
 * io.on("connection", socket => {
 *
 * ============================================================
 */

function registerAsyncErrorExamples(io) {
  io.on("connection", (socket) => {
    /*
     * ======================================================
     * 01. BASIC ASYNC ERROR
     * ======================================================
     */

    socket.on("user:get", async (payload, acknowledge) => {
      try {
        const user = await findUser(payload.userId);

        ackSuccess(acknowledge, user);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "user:get",
        });
      }
    });

    /*
     * ======================================================
     * 02. ASYNC HANDLER WRAPPER
     * ======================================================
     */

    socket.on(
      "user:get:wrapped",
      asyncSocketHandler(async (socket, payload, acknowledge) => {
        const user = await findUser(payload.userId);

        ackSuccess(acknowledge, user);
      }),
    );

    /*
     * ======================================================
     * 03. DATABASE ERROR
     * ======================================================
     */

    socket.on("database:test", async (payload, acknowledge) => {
      try {
        const result = await databaseOperation();

        ackSuccess(acknowledge, result);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "database:test",

          operation: "databaseOperation",
        });
      }
    });

    /*
     * ======================================================
     * 04. EXTERNAL API ERROR
     * ======================================================
     */

    socket.on("external-api:test", async (payload, acknowledge) => {
      try {
        const result = await externalApiCall();

        ackSuccess(acknowledge, result);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "external-api:test",

          service: "external-api",
        });
      }
    });

    /*
     * ======================================================
     * 05. ASYNC TIMEOUT
     * ======================================================
     */

    socket.on("timeout:test", async (payload, acknowledge) => {
      try {
        const result = await withTimeout(delay(5_000), 1_000);

        ackSuccess(acknowledge, result);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "timeout:test",
        });
      }
    });

    /*
     * ======================================================
     * 06. PROMISE REJECTION
     * ======================================================
     */

    socket.on("promise:test", (payload, acknowledge) => {
      Promise.reject(new ValidationError("Promise rejected"))
        .then((result) => {
          ackSuccess(acknowledge, result);
        })
        .catch((error) => {
          handleAsyncError(socket, error, acknowledge, {
            event: "promise:test",
          });
        });
    });

    /*
     * ======================================================
     * 07. PROMISE.ALL
     * ======================================================
     */

    socket.on("parallel:test", async (payload, acknowledge) => {
      try {
        const results = await Promise.all([
          findUser("user_1"),

          findUser("user_2"),

          findUser("user_3"),
        ]);

        ackSuccess(acknowledge, results);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "parallel:test",
        });
      }
    });

    /*
     * ======================================================
     * 08. PROMISE.ALLSETTLED
     * ======================================================
     */

    socket.on("parallel:safe", async (payload, acknowledge) => {
      try {
        const results = await Promise.allSettled([
          findUser("user_1"),

          findUser("missing"),

          findUser("user_3"),
        ]);

        ackSuccess(acknowledge, results);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "parallel:safe",
        });
      }
    });

    /*
     * ======================================================
     * 09. MULTIPLE ASYNC OPERATIONS
     * ======================================================
     */

    socket.on("profile:load", async (payload, acknowledge) => {
      try {
        /*
         * Run independent operations
         * concurrently.
         */

        const [user, notifications] = await Promise.all([
          findUser(payload.userId),

          loadNotifications(payload.userId),
        ]);

        ackSuccess(acknowledge, {
          user,

          notifications,
        });
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "profile:load",
        });
      }
    });

    /*
     * ======================================================
     * 10. SEQUENTIAL OPERATIONS
     * ======================================================
     */

    socket.on("workflow", async (payload, acknowledge) => {
      try {
        const user = await findUser(payload.userId);

        const profile = await loadProfile(user.id);

        ackSuccess(acknowledge, {
          user,

          profile,
        });
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "workflow",
        });
      }
    });

    /*
     * ======================================================
     * 11. VALIDATION + ASYNC SERVICE
     * ======================================================
     */

    socket.on("validated-operation", async (payload, acknowledge) => {
      try {
        if (!payload) {
          throw new ValidationError("Payload is required");
        }

        if (typeof payload.userId !== "string") {
          throw new ValidationError("userId must be a string", {
            field: "userId",
          });
        }

        const user = await findUser(payload.userId);

        ackSuccess(acknowledge, user);
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "validated-operation",
        });
      }
    });

    /*
     * ======================================================
     * 12. ERROR WITH REQUEST ID
     * ======================================================
     */

    socket.on("request:test", async (payload, acknowledge) => {
      const requestId = payload?.requestId ?? `req_${Date.now()}`;

      try {
        throw new Error("Something failed");
      } catch (error) {
        handleAsyncError(socket, error, acknowledge, {
          event: "request:test",

          requestId,
        });
      }
    });
  });
}

/*
 * ============================================================
 * NOTIFICATION SERVICE
 * ============================================================
 */

async function loadNotifications(userId) {
  await delay(100);

  return [
    {
      id: "notification_1",

      userId,

      read: false,
    },
  ];
}

/*
 * ============================================================
 * PROFILE SERVICE
 * ============================================================
 */

async function loadProfile(userId) {
  await delay(100);

  return {
    userId,

    bio: "Example profile",
  };
}

/*
 * ============================================================
 * UNHANDLED REJECTION MONITOR
 * ============================================================
 *
 * This is a process-level safety net.
 *
 * It should NOT replace proper try/catch handling.
 *
 * ============================================================
 */

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION", {
    reason,

    promise,
  });
});

/*
 * ============================================================
 * UNCAUGHT EXCEPTION MONITOR
 * ============================================================
 *
 * An uncaught exception can leave the process in an unsafe
 * state.
 *
 * Production applications should normally perform graceful
 * shutdown rather than blindly continuing.
 *
 * ============================================================
 */

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION", error);
});

/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

export {
  SocketError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  InternalError,
  normalizeError,
  toClientError,
  ackSuccess,
  ackError,
  logError,
  handleAsyncError,
  asyncSocketHandler,
  withTimeout,
  registerAsyncErrorExamples,
};
