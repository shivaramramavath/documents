/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/error_handler.js
 *
 * Topic:
 *     Express Error Handling
 *
 * ============================================================
 *
 * WHY ERROR HANDLING?
 * ============================================================
 *
 * Backend applications can fail because of:
 *
 *     - Invalid input
 *     - Authentication failures
 *     - Authorization failures
 *     - Missing resources
 *     - Database errors
 *     - Network failures
 *     - External API failures
 *     - Programming bugs
 *
 *
 * A production application should have a centralized error
 * handling strategy.
 *
 *
 * Request:
 *
 *     Client
 *       ↓
 *     Middleware
 *       ↓
 *     Controller
 *       ↓
 *     Service
 *       ↓
 *     Error
 *       ↓
 *     Global Error Handler
 *       ↓
 *     HTTP Response
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
 * ============================================================
 * 1. BASIC ERROR HANDLER
 * ============================================================
 *
 * Express error-handling middleware has FOUR parameters:
 *
 *     err
 *     req
 *     res
 *     next
 *
 * ============================================================
 */

function errorHandler(err, req, res, next) {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
}

app.use(errorHandler);

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * Error middleware must have this signature:
 *
 *     (err, req, res, next)
 *
 *
 * The first parameter is what distinguishes it from normal
 * middleware.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. next(error)
 * ============================================================
 *
 * A middleware can forward an error using:
 *
 *     next(error)
 *
 *
 * Express then moves toward error-handling middleware.
 *
 * ============================================================
 */

app.get("/error", (req, res, next) => {
  const error = new Error("Something failed");

  next(error);
});

/*
 * ============================================================
 * 3. ERROR FLOW
 * ============================================================
 *
 *
 *     GET /error
 *          ↓
 *     Route handler
 *          ↓
 *     next(error)
 *          ↓
 *     Error middleware
 *          ↓
 *     500 response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. ERROR HANDLER MUST BE AFTER ROUTES
 * ============================================================
 *
 * Recommended order:
 *
 *
 *     app.use(middleware)
 *
 *     app.get(...)
 *     app.post(...)
 *     app.patch(...)
 *     app.delete(...)
 *
 *     app.use(notFound)
 *
 *     app.use(errorHandler)
 *
 *
 * Error handler should generally be registered after the routes
 * it is expected to handle.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. CUSTOM APPLICATION ERROR
 * ============================================================
 *
 * Built-in Error does not contain HTTP-specific information.
 *
 * We can create an application error class.
 *
 * ============================================================
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);

    this.name = "AppError";

    this.statusCode = statusCode;

    this.code = code;
  }
}

/*
 * ============================================================
 * 6. NOT FOUND ERROR
 * ============================================================
 */

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

/*
 * ============================================================
 * 7. BAD REQUEST ERROR
 * ============================================================
 */

class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}

/*
 * ============================================================
 * 8. UNAUTHORIZED ERROR
 * ============================================================
 */

class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

/*
 * ============================================================
 * 9. FORBIDDEN ERROR
 * ============================================================
 */

class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

/*
 * ============================================================
 * 10. CONFLICT ERROR
 * ============================================================
 */

class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}

/*
 * ============================================================
 * 11. THROWING CUSTOM ERRORS
 * ============================================================
 */

app.get("/not-found", (req, res, next) => {
  next(new NotFoundError("User not found"));
});

app.get("/unauthorized", (req, res, next) => {
  next(new UnauthorizedError());
});

app.get("/forbidden", (req, res, next) => {
  next(new ForbiddenError());
});

app.get("/conflict", (req, res, next) => {
  next(new ConflictError("Email already exists"));
});

/*
 * ============================================================
 * 12. CENTRALIZED ERROR HANDLER
 * ============================================================
 */

function globalErrorHandler(err, req, res, next) {
  console.error({
    name: err.name,

    message: err.message,

    stack: err.stack,
  });

  /*
   * If headers were already sent, delegate to Express's
   * default error handler.
   */

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  const code = err.code || "INTERNAL_ERROR";

  const message = statusCode >= 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({
    success: false,

    error: {
      code,
      message,
    },
  });
}

/*
 * ============================================================
 * 13. 404 HANDLER
 * ============================================================
 *
 * A request that matches no route is not automatically an
 * application error.
 *
 * Create a 404 response after all routes.
 *
 * ============================================================
 */

function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

/*
 * ============================================================
 * Route registration should happen before these:
 *
 *     notFoundHandler
 *     globalErrorHandler
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. ASYNC CONTROLLER
 * ============================================================
 *
 * Database and external API operations are asynchronous.
 *
 * Example:
 * ============================================================
 */

app.get("/async-error", async (req, res, next) => {
  try {
    await Promise.reject(new Error("Async operation failed"));

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

/*
 * ============================================================
 * 15. ASYNC ERROR WRAPPER
 * ============================================================
 *
 * Instead of writing:
 *
 *     try {}
 *     catch(error) {
 *         next(error)
 *     }
 *
 * for every controller, we can create a wrapper.
 *
 * ============================================================
 */

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

/*
 * ============================================================
 * 16. ASYNC HANDLER USAGE
 * ============================================================
 */

app.get(
  "/async-wrapper",
  asyncHandler(async (req, res) => {
    throw new Error("Something failed");
  }),
);

/*
 * ============================================================
 * 17. WHY ASYNC HANDLER?
 * ============================================================
 *
 * Without a wrapper:
 *
 *
 *     app.get(
 *       "/users",
 *       async (req, res, next) => {
 *         try {
 *           ...
 *         } catch (error) {
 *           next(error);
 *         }
 *       }
 *     );
 *
 *
 * With wrapper:
 *
 *
 *     app.get(
 *       "/users",
 *       asyncHandler(
 *         async (req, res) => {
 *           ...
 *         }
 *       )
 *     );
 *
 *
 * This keeps controllers smaller.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. VALIDATION ERROR
 * ============================================================
 */

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, "VALIDATION_ERROR");

    this.details = details;
  }
}

/*
 * ============================================================
 * 19. VALIDATION ERROR RESPONSE
 * ============================================================
 */

app.get("/validation-error", (req, res, next) => {
  next(
    new ValidationError("Invalid request", [
      {
        field: "email",

        message: "Invalid email",
      },
    ]),
  );
});

/*
 * ============================================================
 * 20. ERROR HANDLER WITH DETAILS
 * ============================================================
 */

function advancedErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,

    error: {
      code: err.code || "INTERNAL_ERROR",

      message: statusCode >= 500 ? "Internal server error" : err.message,
    },
  };

  /*
   * Validation details can safely be returned if they contain
   * non-sensitive information.
   */

  if (err instanceof ValidationError) {
    response.error.details = err.details;
  }

  res.status(statusCode).json(response);
}

/*
 * ============================================================
 * 21. DEVELOPMENT vs PRODUCTION
 * ============================================================
 *
 * Development:
 *
 *     Detailed stack traces
 *     Debug logging
 *     Database error details
 *
 *
 * Production:
 *
 *     Safe public messages
 *     Structured logs
 *     No stack traces in API responses
 *     No passwords/tokens/secrets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. DO NOT LEAK INTERNAL ERRORS
 * ============================================================
 *
 * BAD:
 *
 *     res.status(500).json({
 *       error: err.stack
 *     });
 *
 *
 * This can expose:
 *
 *     file paths
 *     implementation details
 *     package information
 *     database information
 *
 *
 * BETTER:
 *
 *     {
 *       "success": false,
 *       "error": {
 *         "code": "INTERNAL_ERROR",
 *         "message": "Internal server error"
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. DATABASE ERROR TRANSLATION
 * ============================================================
 *
 * Low-level database errors should usually be translated into
 * application-level errors.
 *
 *
 * Example:
 *
 *     MongoDB duplicate key
 *             ↓
 *     ConflictError
 *             ↓
 *     HTTP 409
 *
 *
 * The controller should not need to understand every database
 * driver error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. EXTERNAL API ERROR
 * ============================================================
 *
 * Example:
 *
 *     Payment API
 *          ↓
 *     timeout
 *          ↓
 *     ServiceUnavailableError
 *          ↓
 *     HTTP 503
 *
 *
 * Application errors should represent the meaning of the failure
 * rather than simply exposing the raw library exception.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. ERROR CAUSE
 * ============================================================
 *
 * JavaScript supports error causes.
 *
 * Example:
 *
 *
 *     throw new AppError(
 *       "Failed to load user",
 *       500,
 *       "USER_LOAD_FAILED",
 *       {
 *         cause: error
 *       }
 *     );
 *
 *
 * A useful pattern is to preserve the original error internally
 * while exposing only a safe message externally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. ERROR CATEGORIES
 * ============================================================
 *
 *
 * CLIENT ERRORS
 *
 *     400
 *     401
 *     403
 *     404
 *     409
 *     422
 *
 *
 * SERVER ERRORS
 *
 *     500
 *     502
 *     503
 *     504
 *
 *
 * Exact status codes should reflect the application's API
 * contract.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. ERROR CODES
 * ============================================================
 *
 * HTTP status alone is often insufficient.
 *
 * Example:
 *
 *     409
 *
 * could mean:
 *
 *     USER_ALREADY_EXISTS
 *     EMAIL_ALREADY_EXISTS
 *     RESOURCE_VERSION_CONFLICT
 *
 *
 * Therefore APIs often provide stable application error codes.
 *
 * Example:
 *
 *     {
 *       "code": "EMAIL_ALREADY_EXISTS"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. CORRELATION / REQUEST ID
 * ============================================================
 *
 * Error logs should contain a request ID.
 *
 * Example:
 *
 *     requestId:
 *       "req_123"
 *
 *
 * Then:
 *
 *     Client
 *       ↓
 *     HTTP request
 *       ↓
 *     requestId
 *       ↓
 *     Controller
 *       ↓
 *     Service
 *       ↓
 *     Error
 *       ↓
 *     Log
 *
 *
 * This makes debugging distributed systems much easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. LOGGING ERRORS
 * ============================================================
 *
 * Good error log:
 *
 *     {
 *       level: "error",
 *       requestId,
 *       method,
 *       path,
 *       statusCode,
 *       errorCode,
 *       message
 *     }
 *
 *
 * Avoid logging:
 *
 *     passwords
 *     access tokens
 *     refresh tokens
 *     API secrets
 *     sensitive personal data
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. ERROR HANDLING ARCHITECTURE
 * ============================================================
 *
 *
 *             CONTROLLER
 *                  │
 *                  ↓
 *              SERVICE
 *                  │
 *                  ↓
 *             REPOSITORY
 *                  │
 *                  ↓
 *              DATABASE
 *                  │
 *                  ↓
 *                ERROR
 *                  │
 *                  ↓
 *          Translate / Wrap
 *                  │
 *                  ↓
 *          Global Error Handler
 *                  │
 *                  ↓
 *             HTTP Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. BUSINESS ERROR EXAMPLE
 * ============================================================
 */

class InsufficientBalanceError extends AppError {
  constructor() {
    super("Insufficient balance", 409, "INSUFFICIENT_BALANCE");
  }
}

/*
 * Service:
 *
 *
 *     if (balance < amount) {
 *       throw new InsufficientBalanceError();
 *     }
 *
 *
 * Controller:
 *
 *
 *     try {
 *       await paymentService.transfer(...);
 *       res.status(204).send();
 *     } catch (error) {
 *       next(error);
 *     }
 *
 *
 * Global handler:
 *
 *
 *     409 INSUFFICIENT_BALANCE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. NEVER CATCH AND IGNORE
 * ============================================================
 *
 * BAD:
 *
 *
 *     try {
 *       await operation();
 *     } catch (error) {
 *       console.log(error);
 *     }
 *
 *
 * The request may never receive a response.
 *
 *
 * Better:
 *
 *
 *     catch (error) {
 *       next(error);
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. NEVER SEND TWO RESPONSES
 * ============================================================
 *
 * BAD:
 *
 *
 *     if (!user) {
 *       res.status(404).json(...);
 *     }
 *
 *     res.json(user);
 *
 *
 * The second response may cause:
 *
 *     ERR_HTTP_HEADERS_SENT
 *
 *
 * Use:
 *
 *     return res.status(404).json(...);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. HEADERS ALREADY SENT
 * ============================================================
 */

function safeErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,

    error: {
      code: err.code || "INTERNAL_ERROR",

      message:
        err.statusCode && err.statusCode < 500
          ? err.message
          : "Internal server error",
    },
  });
}

/*
 * ============================================================
 * 35. FINAL MIDDLEWARE ORDER
 * ============================================================
 *
 *
 * app.use(requestId)
 *
 * app.use(logger)
 *
 * app.use(express.json())
 *
 * app.use(cors())
 *
 * app.use("/api", routes)
 *
 * app.use(notFoundHandler)
 *
 * app.use(globalErrorHandler)
 *
 *
 * This ordering is important.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. COMPLETE MINI APPLICATION
 * ============================================================
 */

const demoApp = express();

demoApp.use(express.json());

demoApp.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id === "0") {
      throw new NotFoundError("User not found");
    }

    res.json({
      data: {
        id,
        name: "Shiva",
      },
    });
  }),
);

/*
 * 404 middleware
 */

demoApp.use(notFoundHandler);

/*
 * Global error middleware
 */

demoApp.use(globalErrorHandler);

/*
 * ============================================================
 * 37. ERROR RESPONSE FORMAT
 * ============================================================
 *
 * Recommended consistent structure:
 *
 *
 * {
 *   "success": false,
 *
 *   "error": {
 *     "code": "USER_NOT_FOUND",
 *     "message": "User not found"
 *   }
 * }
 *
 *
 * Validation:
 *
 *
 * {
 *   "success": false,
 *
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Invalid request",
 *     "details": []
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. WHAT BELONGS WHERE?
 * ============================================================
 *
 *
 * Middleware
 *     ↓
 *     Request-level concerns
 *
 *
 * Controller
 *     ↓
 *     HTTP concerns
 *
 *
 * Service
 *     ↓
 *     Business rules
 *
 *
 * Repository
 *     ↓
 *     Database operations
 *
 *
 * Error classes
 *     ↓
 *     Application failure representation
 *
 *
 * Global error handler
 *     ↓
 *     Convert errors → HTTP responses
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. PRODUCTION ERROR FLOW
 * ============================================================
 *
 *
 *     Client
 *       │
 *       ↓
 *     Express
 *       │
 *       ↓
 *     Authentication
 *       │
 *       ↓
 *     Validation
 *       │
 *       ↓
 *     Controller
 *       │
 *       ↓
 *     Service
 *       │
 *       ↓
 *     Repository
 *       │
 *       ↓
 *     Database
 *       │
 *       X
 *      ERROR
 *       │
 *       ↓
 *     Application Error
 *       │
 *       ↓
 *     Global Error Handler
 *       │
 *       ├──────────────→ Structured Log
 *       │
 *       ↓
 *     Safe HTTP Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. KEY RULES TO REMEMBER
 * ============================================================
 *
 * 1. Use next(error) to propagate errors.
 *
 * 2. Centralize error-to-HTTP translation.
 *
 * 3. Create meaningful application error classes.
 *
 * 4. Use appropriate HTTP status codes.
 *
 * 5. Use stable application error codes.
 *
 * 6. Never expose internal stack traces in production.
 *
 * 7. Never expose secrets in error messages/logs.
 *
 * 8. Keep business logic out of the global error handler.
 *
 * 9. Put 404 handling before the global error handler.
 *
 * 10. Put the global error handler after application routes.
 *
 * 11. Preserve useful internal error causes for debugging.
 *
 * 12. Keep API error responses consistent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *              ERROR
 *                │
 *                ↓
 *       Application Error
 *                │
 *                ↓
 *       next(error)
 *                │
 *                ↓
 *       Global Error Handler
 *                │
 *        ┌───────┴────────┐
 *        ↓                ↓
 *      Logging       HTTP Response
 *                         │
 *                         ↓
 *                  Safe API Error
 *
 *
 * Remember:
 *
 *     Throw/forward errors internally.
 *
 *     Translate them into safe HTTP responses at the boundary.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/request_response.js
 *
 * ============================================================
 */
