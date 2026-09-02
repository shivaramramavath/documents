/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: error_handling.js
 *
 * Topic:
 * Error Handling
 *
 * ============================================================
 *
 * Why error handling?
 *
 * Real applications can fail because of:
 *
 *     - Invalid user input
 *     - Database failures
 *     - Network failures
 *     - Authentication failures
 *     - Missing files
 *     - API failures
 *     - Programming bugs
 *     - Configuration problems
 *
 * Good error handling prevents the application from becoming
 * unpredictable or crashing unnecessarily.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Basic Error object
 * ============================================================
 */

const error = new Error("Something went wrong");

console.log(error);

/*
 * Error contains useful information such as:
 *
 *     error.name
 *     error.message
 *     error.stack
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Error properties
 * ============================================================
 */

console.log("Name:", error.name);

console.log("Message:", error.message);

console.log("Stack:", error.stack);

/*
 * Example:
 *
 *     Error: Something went wrong
 *         at ...
 *
 * `stack` helps identify where the error originated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. throw
 * ============================================================
 *
 * `throw` creates an exception.
 *
 * Once JavaScript encounters throw, normal execution stops
 * and control moves to an appropriate catch block.
 *
 * ============================================================
 */

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }

  return a / b;
}

console.log(divide(10, 2));

/*
 * Do NOT execute divide(10, 0) here without a try/catch,
 * because it would terminate this script.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. try/catch
 * ============================================================
 */

try {
  const result = divide(10, 0);

  console.log(result);
} catch (error) {
  console.error("Caught error:", error.message);
}

/*
 * Flow:
 *
 *     try
 *      ↓
 *     error
 *      ↓
 *     catch
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. finally
 * ============================================================
 *
 * finally runs whether an error occurs or not.
 * ============================================================
 */

try {
  console.log("Operation started");
} catch (error) {
  console.error(error);
} finally {
  console.log("Cleanup");
}

/*
 * Typical uses:
 *
 *     - Closing resources
 *     - Releasing locks
 *     - Cleaning temporary files
 *     - Closing connections
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. try/catch without an error
 * ============================================================
 */

try {
  const result = divide(20, 5);

  console.log("Result:", result);
} catch (error) {
  console.error(error.message);
} finally {
  console.log("Finished");
}

/*
 * Output:
 *
 *     Result: 4
 *     Finished
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Catching different errors
 * ============================================================
 */

try {
  JSON.parse("invalid json");
} catch (error) {
  console.error("JSON parsing failed:", error.message);
}

/*
 * JSON.parse() throws a SyntaxError for invalid JSON.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Error types
 * ============================================================
 *
 * JavaScript provides several built-in Error types.
 * ============================================================
 */

/*
 * Error
 */

const normalError = new Error("Normal error");

/*
 * TypeError
 *
 * Usually caused by using a value of the wrong type.
 */

const typeError = new TypeError("Invalid type");

/*
 * ReferenceError
 *
 * Usually caused by accessing an identifier that doesn't
 * exist.
 */

const referenceError = new ReferenceError("Variable not found");

/*
 * RangeError
 *
 * Usually caused by a value outside an allowed range.
 */

const rangeError = new RangeError("Value out of range");

console.log(normalError.name);

console.log(typeError.name);

console.log(referenceError.name);

console.log(rangeError.name);

/*
 * ============================================================
 * 9. Throwing specific Error types
 * ============================================================
 */

function setAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }

  if (age < 0 || age > 150) {
    throw new RangeError("Age must be between 0 and 150");
  }

  return age;
}

try {
  setAge("twenty");
} catch (error) {
  console.error(error.name, error.message);
}

/*
 * ============================================================
 * 10. Never throw strings
 * ============================================================
 *
 * ❌ Avoid:
 *
 *     throw "Something went wrong";
 *
 *
 * Prefer:
 *
 *     throw new Error(
 *       "Something went wrong"
 *     );
 *
 *
 * Error objects contain stack information and are much easier
 * to work with.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Custom Error class
 * ============================================================
 *
 * Production applications often define custom error classes.
 * ============================================================
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = "AppError";

    this.statusCode = statusCode;
  }
}

try {
  throw new AppError("User not found", 404);
} catch (error) {
  console.error(error.name);

  console.error(error.message);

  console.error(error.statusCode);
}

/*
 * This pattern becomes extremely useful with Express.
 *
 * Example:
 *
 *     throw new AppError(
 *       "User not found",
 *       404
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Custom NotFoundError
 * ============================================================
 */

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);

    this.name = "NotFoundError";

    this.statusCode = 404;
  }
}

try {
  throw new NotFoundError("User not found");
} catch (error) {
  console.error(error.name, error.statusCode, error.message);
}

/*
 * ============================================================
 * 13. Custom ValidationError
 * ============================================================
 */

class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.name = "ValidationError";

    this.statusCode = 400;
  }
}

try {
  throw new ValidationError("Email is required");
} catch (error) {
  console.error(error.name, error.statusCode, error.message);
}

/*
 * ============================================================
 * 14. Error propagation
 * ============================================================
 *
 * An error can travel upward through function calls.
 * ============================================================
 */

function database() {
  throw new Error("Database connection failed");
}

function service() {
  database();
}

function controller() {
  service();
}

try {
  controller();
} catch (error) {
  console.error("Handled at top level:", error.message);

  /*
   * Flow:
   *
   *     controller()
   *          ↓
   *     service()
   *          ↓
   *     database()
   *          ↓
   *        ERROR
   *          ↓
   *     controller()
   *          ↓
   *     service()
   *          ↓
   *     try/catch
   *
   */
}

/*
 * ============================================================
 * 15. Error propagation with return
 * ============================================================
 */

function getUser() {
  throw new Error("User lookup failed");
}

function getUserService() {
  return getUser();
}

try {
  const user = getUserService();

  console.log(user);
} catch (error) {
  console.error("Service error:", error.message);
}

/*
 * ============================================================
 * 16. Async errors
 * ============================================================
 *
 * Errors inside async functions become rejected Promises.
 * ============================================================
 */

async function asyncFailure() {
  throw new Error("Async operation failed");
}

asyncFailure().catch((error) => {
  console.error("Async error:", error.message);
});

/*
 * ============================================================
 * 17. Async errors with try/catch
 * ============================================================
 */

async function handleAsyncError() {
  try {
    await asyncFailure();
  } catch (error) {
    console.error("Caught async error:", error.message);
  }
}

handleAsyncError();

/*
 * ============================================================
 * 18. Rejected Promise
 * ============================================================
 */

async function rejectedOperation() {
  return Promise.reject(new Error("Promise rejected"));
}

async function executeRejectedOperation() {
  try {
    await rejectedOperation();
  } catch (error) {
    console.error(error.message);
  }
}

executeRejectedOperation();

/*
 * ============================================================
 * 19. Error propagation in async functions
 * ============================================================
 */

async function databaseService() {
  throw new Error("Database failed");
}

async function userService() {
  return databaseService();
}

async function userController() {
  return userService();
}

async function runRequest() {
  try {
    await userController();
  } catch (error) {
    console.error("Request failed:", error.message);
  }
}

runRequest();

/*
 * Real backend architecture:
 *
 *
 *     HTTP Request
 *          ↓
 *     Controller
 *          ↓
 *     Service
 *          ↓
 *     Repository
 *          ↓
 *     Database
 *
 *
 * Error can propagate back upward.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Catching errors from Promise.all()
 * ============================================================
 */

async function multipleOperations() {
  try {
    const results = await Promise.all([
      Promise.resolve("User"),

      Promise.resolve("Posts"),
    ]);

    console.log(results);
  } catch (error) {
    console.error(error.message);
  }
}

multipleOperations();

/*
 * ============================================================
 * 21. Promise.all() with failure
 * ============================================================
 */

async function multipleOperationsWithFailure() {
  try {
    await Promise.all([
      Promise.resolve("User"),

      Promise.reject(new Error("Posts failed")),
    ]);
  } catch (error) {
    console.error("Operation failed:", error.message);
  }
}

multipleOperationsWithFailure();

/*
 * ============================================================
 * 22. allSettled() and errors
 * ============================================================
 */

async function inspectAllResults() {
  const results = await Promise.allSettled([
    Promise.resolve("Success"),

    Promise.reject(new Error("Failed")),
  ]);

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log("Success:", result.value);
    } else {
      console.error("Failure:", result.reason.message);
    }
  }
}

inspectAllResults();

/*
 * ============================================================
 * 23. Handling expected vs unexpected errors
 * ============================================================
 *
 *
 * EXPECTED:
 *
 *     User doesn't exist
 *     Invalid input
 *     Unauthorized request
 *     Resource not found
 *
 *
 * These can normally be converted into appropriate responses.
 *
 *
 *
 * UNEXPECTED:
 *
 *     Programming bug
 *     Corrupted application state
 *     Unexpected database failure
 *
 *
 * These should be logged and investigated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Don't hide errors
 * ============================================================
 *
 * ❌ Bad:
 */

try {
  JSON.parse("invalid");
} catch (error) {
  // Doing nothing hides the problem.
}

/*
 * Better:
 */

try {
  JSON.parse("invalid");
} catch (error) {
  console.error(error);
}

/*
 * ============================================================
 * 25. Preserve original error
 * ============================================================
 *
 * When wrapping an error, preserve the original cause.
 * ============================================================
 */

try {
  JSON.parse("invalid");
} catch (error) {
  throw new Error("Failed to parse configuration", {
    cause: error,
  });
}

/*
 * IMPORTANT:
 *
 * The example above intentionally throws.
 *
 * If this code is reached while executing the complete file,
 * Node.js will terminate because the new error isn't caught.
 *
 * Therefore, in production code, the outer layer should handle
 * it appropriately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Error cause
 * ============================================================
 */

try {
  try {
    throw new Error("Original database error");
  } catch (error) {
    throw new Error("Failed to load user", {
      cause: error,
    });
  }
} catch (error) {
  console.error("Error:", error.message);

  console.error("Original:", error.cause?.message);
}

/*
 * This is useful for maintaining the original cause while
 * providing higher-level context.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. finally with return
 * ============================================================
 *
 * Be careful when returning from finally.
 *
 * Avoid patterns where finally overrides the intended result.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Synchronous errors
 * ============================================================
 */

function synchronousError() {
  throw new Error("Synchronous failure");
}

try {
  synchronousError();
} catch (error) {
  console.error(error.message);
}

/*
 * ============================================================
 * 29. Asynchronous callback errors
 * ============================================================
 *
 * A try/catch around setTimeout() does NOT catch an exception
 * thrown later inside the callback.
 * ============================================================
 *
 * Example of what NOT to do:
 *
 *
 *     try {
 *
 *       setTimeout(() => {
 *
 *         throw new Error("Failed");
 *
 *       }, 1000);
 *
 *     } catch (error) {
 *
 *       // This will NOT catch the timeout error.
 *
 *     }
 *
 *
 * Why?
 *
 * The try/catch finishes before the callback executes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Correct callback error handling
 * ============================================================
 *
 * Handle the error inside the asynchronous callback or use a
 * Promise-based API.
 *
 * Example concept:
 *
 *
 *     setTimeout(() => {
 *
 *       try {
 *         // operation
 *       } catch (error) {
 *         // handle error
 *       }
 *
 *     }, 1000);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Node.js process-level error events
 * ============================================================
 *
 * Node.js provides process-level events for serious situations.
 *
 * These should NOT be treated as normal application flow.
 *
 * ============================================================
 */

/*
 * uncaughtException
 *
 * An exception reached the Node.js process without being caught.
 *
 * Example:
 *
 *
 *     process.on(
 *       "uncaughtException",
 *       (error) => {
 *
 *         console.error(error);
 *
 *         // Perform minimal cleanup.
 *         // Usually terminate the process.
 *
 *       }
 *     );
 *
 *
 * Do not use this as a replacement for normal try/catch.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. unhandledRejection
 * ============================================================
 *
 * A Promise rejection was not properly handled.
 *
 * Example:
 *
 *
 *     process.on(
 *       "unhandledRejection",
 *       (reason) => {
 *
 *         console.error(reason);
 *
 *       }
 *     );
 *
 *
 * Again:
 *
 * This is a safety mechanism, not your primary error-handling
 * strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Production error strategy
 * ============================================================
 *
 *
 *             Request
 *                │
 *                ▼
 *           Controller
 *                │
 *                ▼
 *             Service
 *                │
 *                ▼
 *           Repository
 *                │
 *                ▼
 *            Database
 *                │
 *                │ error
 *                ▼
 *          Error propagates
 *                │
 *                ▼
 *        Global error handler
 *                │
 *        ┌───────┴────────┐
 *        ▼                ▼
 *      Log             Response
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. HTTP error mapping
 * ============================================================
 *
 * In a backend application, application errors can be mapped
 * to HTTP status codes.
 *
 *
 *     ValidationError
 *         ↓
 *       400
 *
 *     AuthenticationError
 *         ↓
 *       401
 *
 *     AuthorizationError
 *         ↓
 *       403
 *
 *     NotFoundError
 *         ↓
 *       404
 *
 *     ConflictError
 *         ↓
 *       409
 *
 *     Internal error
 *         ↓
 *       500
 *
 *
 * We will implement this properly when we reach Express.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Example application error hierarchy
 * ============================================================
 */

class BaseAppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    this.isOperational = true;
  }
}

class BadRequestError extends BaseAppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

class UnauthorizedError extends BaseAppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends BaseAppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class ResourceNotFoundError extends BaseAppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

try {
  throw new ResourceNotFoundError("User does not exist");
} catch (error) {
  console.error({
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    operational: error.isOperational,
  });
}

/*
 * ============================================================
 * 36. Operational vs programming errors
 * ============================================================
 *
 *
 * OPERATIONAL ERROR
 *
 * Expected failure during normal operation.
 *
 * Examples:
 *
 *     User not found
 *     Invalid password
 *     Invalid input
 *     Database temporarily unavailable
 *
 *
 *
 * PROGRAMMING ERROR
 *
 * Bug in application code.
 *
 * Examples:
 *
 *     undefined.foo
 *     Wrong function arguments
 *     Incorrect business logic
 *     Invalid assumptions
 *
 *
 * They should not necessarily be handled in the same way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Don't expose internal errors to clients
 * ============================================================
 *
 * ❌ Bad API response:
 *
 *
 *     {
 *       "error": "...database password...",
 *       "stack": "..."
 *     }
 *
 *
 * Never expose sensitive internal details.
 *
 *
 * Better:
 *
 *
 *     {
 *       "message": "Internal server error"
 *     }
 *
 *
 * Detailed information should go to secure server logs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Logging errors
 * ============================================================
 */

function logError(error) {
  console.error({
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
}

try {
  throw new Error("Example error");
} catch (error) {
  logError(error);
}

/*
 * Later we'll learn structured logging with:
 *
 *     Pino
 *     Winston
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Error handling with async service
 * ============================================================
 */

async function findUser(userId) {
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  if (userId !== 1) {
    throw new ResourceNotFoundError("User not found");
  }

  return {
    id: 1,
    name: "Shiva",
  };
}

async function executeService() {
  try {
    const user = await findUser(2);

    console.log(user);
  } catch (error) {
    console.error({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}

executeService();

/*
 * ============================================================
 * 40. Important rule for backend code
 * ============================================================
 *
 * Don't catch an error just to immediately throw the same error
 * without adding context or handling it.
 *
 *
 * ❌ Usually unnecessary:
 *
 *
 *     try {
 *       await service();
 *     } catch (error) {
 *       throw error;
 *     }
 *
 *
 *
 * If the current layer cannot handle it, let it propagate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Error handling mental model
 * ============================================================
 *
 *
 *             Something fails
 *                    │
 *                    ▼
 *                Error()
 *                    │
 *                    ▼
 *                 throw
 *                    │
 *                    ▼
 *             Error propagates
 *                    │
 *             ┌──────┴──────┐
 *             ▼             ▼
 *          catch()       try/catch
 *             │
 *             ▼
 *         handle/log
 *             │
 *             ▼
 *          response
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Key points
 * ============================================================
 *
 * 1. Use Error objects.
 *
 *     new Error("message")
 *
 *
 * 2. Use throw to raise errors.
 *
 *     throw new Error("Failed")
 *
 *
 * 3. Use try/catch to handle synchronous errors.
 *
 * 4. Use try/catch around await for asynchronous errors.
 *
 * 5. Async function errors become rejected Promises.
 *
 * 6. Use custom error classes for application-specific errors.
 *
 * 7. Preserve the original cause when wrapping errors.
 *
 * 8. Don't expose stack traces or sensitive information to
 *    clients.
 *
 * 9. Don't use process-level handlers as normal error handling.
 *
 * 10. Let errors propagate to the layer responsible for handling
 *     them.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * BASIC:
 *
 *     const error =
 *       new Error("Failed");
 *
 *
 * THROW:
 *
 *     throw error;
 *
 *
 * CATCH:
 *
 *     try {
 *       operation();
 *     } catch (error) {
 *       handle(error);
 *     }
 *
 *
 * ASYNC:
 *
 *     try {
 *       await operation();
 *     } catch (error) {
 *       handle(error);
 *     }
 *
 *
 * CUSTOM:
 *
 *     class NotFoundError
 *       extends Error {}
 *
 *
 * ERROR PROPAGATION:
 *
 *     Controller
 *         ↓
 *     Service
 *         ↓
 *     Repository
 *         ↓
 *     Database
 *         ↓
 *       Error
 *         ↓
 *     Error handler
 *
 *
 * ============================================================
 */
