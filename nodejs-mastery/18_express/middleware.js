/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/middleware.js
 *
 * Topic:
 *     Express Middleware
 *
 * ============================================================
 *
 * WHAT IS MIDDLEWARE?
 * ============================================================
 *
 * Middleware is a function that runs during the HTTP request
 * lifecycle.
 *
 * It has access to:
 *
 *     req
 *     res
 *     next
 *
 *
 * Basic structure:
 *
 *     (req, res, next) => {
 *         // logic
 *         next();
 *     }
 *
 *
 * Request:
 *
 *     Client
 *       ↓
 *     Middleware
 *       ↓
 *     Middleware
 *       ↓
 *     Route Handler
 *       ↓
 *     Response
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * ============================================================
 * 1. BASIC MIDDLEWARE
 * ============================================================
 */

function basicMiddleware(req, res, next) {
  console.log("Basic middleware executed");

  next();
}

app.use(basicMiddleware);

/*
 * ============================================================
 * 2. next()
 * ============================================================
 *
 * next() tells Express:
 *
 *     "This middleware has finished.
 *      Continue processing the request."
 *
 * Without next(), res.send(), res.json(), res.end(), or another
 * terminating operation, the request can remain pending.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. MIDDLEWARE ORDER
 * ============================================================
 */

app.use((req, res, next) => {
  console.log("Middleware A");

  next();
});

app.use((req, res, next) => {
  console.log("Middleware B");

  next();
});

app.get("/order", (req, res) => {
  console.log("Route handler");

  res.json({
    message: "Request completed",
  });
});

/*
 * Output:
 *
 *     Middleware A
 *     Middleware B
 *     Route handler
 *
 *
 * Express processes middleware in registration order.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. APPLICATION-LEVEL MIDDLEWARE
 * ============================================================
 *
 * app.use() without a path applies to every matching request.
 *
 * ============================================================
 */

app.use((req, res, next) => {
  req.requestTime = new Date();

  next();
});

/*
 * ============================================================
 * 5. PATH-SPECIFIC MIDDLEWARE
 * ============================================================
 */

app.use("/api", (req, res, next) => {
  console.log("API middleware");

  next();
});

/*
 * This middleware applies to:
 *
 *     /api
 *     /api/users
 *     /api/products
 *     /api/orders
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. ROUTE-SPECIFIC MIDDLEWARE
 * ============================================================
 */

function routeMiddleware(req, res, next) {
  console.log("Route middleware");

  next();
}

app.get("/route", routeMiddleware, (req, res) => {
  res.json({
    message: "Route completed",
  });
});

/*
 * ============================================================
 * 7. MULTIPLE MIDDLEWARE
 * ============================================================
 */

function first(req, res, next) {
  console.log("First");

  next();
}

function second(req, res, next) {
  console.log("Second");

  next();
}

function third(req, res) {
  console.log("Third");

  res.json({
    message: "Done",
  });
}

app.get("/multiple", first, second, third);

/*
 * ============================================================
 * 8. MODIFYING req
 * ============================================================
 *
 * Middleware can attach data to req.
 *
 * This is extremely common for:
 *
 *     authentication
 *     authorization
 *     request context
 *     user information
 *     tracing
 *
 * ============================================================
 */

function attachUser(req, res, next) {
  req.user = {
    id: "user_123",

    role: "admin",
  };

  next();
}

app.get("/user-context", attachUser, (req, res) => {
  res.json({
    user: req.user,
  });
});

/*
 * ============================================================
 * 9. AUTHENTICATION MIDDLEWARE
 * ============================================================
 */

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  /*
   * In a real application:
   *
   *     1. Extract token
   *     2. Verify token
   *     3. Load/identify user
   *     4. Attach user to req
   */

  req.user = {
    id: "user_123",
  };

  next();
}

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Protected resource",

    user: req.user,
  });
});

/*
 * ============================================================
 * 10. AUTHORIZATION MIDDLEWARE
 * ============================================================
 *
 * Authentication:
 *
 *     "Who are you?"
 *
 *
 * Authorization:
 *
 *     "Are you allowed to do this?"
 *
 * ============================================================
 */

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
}

app.get("/admin", authenticate, requireAdmin, (req, res) => {
  res.json({
    message: "Admin resource",
  });
});

/*
 * ============================================================
 * 11. FACTORY MIDDLEWARE
 * ============================================================
 *
 * Middleware can accept configuration.
 *
 * ============================================================
 */

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: `Role '${role}' required`,
      });
    }

    next();
  };
}

app.get("/admin-only", authenticate, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin endpoint",
  });
});

/*
 * ============================================================
 * 12. REQUEST LOGGER
 * ============================================================
 */

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log({
      method: req.method,

      path: req.originalUrl,

      status: res.statusCode,

      duration: `${duration}ms`,
    });
  });

  next();
}

app.use(requestLogger);

/*
 * ============================================================
 * 13. JSON PARSER
 * ============================================================
 *
 * express.json() itself is middleware.
 *
 * ============================================================
 */

app.use(express.json());

/*
 * ============================================================
 * 14. URL ENCODED PARSER
 * ============================================================
 */

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
 * ============================================================
 * 15. CORS CONCEPT
 * ============================================================
 *
 * CORS middleware controls which browser origins are allowed
 * to access the API.
 *
 * Example package:
 *
 *     npm install cors
 *
 *
 * Conceptually:
 *
 *     app.use(cors(...))
 *
 *
 * CORS is a browser security mechanism. It does not replace
 * authentication or authorization.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. SECURITY MIDDLEWARE
 * ============================================================
 *
 * Production applications commonly use middleware for:
 *
 *     security headers
 *     CORS
 *     rate limiting
 *     request validation
 *     authentication
 *     authorization
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. VALIDATION MIDDLEWARE
 * ============================================================
 */

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",

        details: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
}

/*
 * Example schema-like object for demonstration.
 *
 * In a real application, use Zod/Joi/Valibot/etc.
 */

const userSchema = {
  safeParse(data) {
    if (typeof data?.name !== "string") {
      return {
        success: false,

        error: {
          issues: [
            {
              path: ["name"],

              message: "Name is required",
            },
          ],
        },
      };
    }

    return {
      success: true,

      data,
    };
  },
};

app.post("/validated-user", validateBody(userSchema), (req, res) => {
  res.status(201).json({
    user: req.body,
  });
});

/*
 * ============================================================
 * 18. ERROR PROPAGATION
 * ============================================================
 *
 * Calling:
 *
 *     next(error)
 *
 * tells Express to skip normal middleware and move toward
 * error-handling middleware.
 *
 * ============================================================
 */

app.get("/error", (req, res, next) => {
  const error = new Error("Something went wrong");

  next(error);
});

/*
 * ============================================================
 * 19. ERROR-HANDLING MIDDLEWARE
 * ============================================================
 *
 * Error middleware has FOUR parameters:
 *
 *     err
 *     req
 *     res
 *     next
 *
 * ============================================================
 */

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

/*
 * ============================================================
 * 20. DO NOT EXPOSE STACK TRACES
 * ============================================================
 *
 * Development:
 *
 *     console.error(err)
 *
 *
 * Production:
 *
 *     return a safe error response
 *
 *
 * Avoid returning:
 *
 *     err.stack
 *
 * to clients in production.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. ASYNC MIDDLEWARE
 * ============================================================
 *
 * Modern Express supports async route/middleware error
 * propagation.
 *
 * ============================================================
 */

app.get("/async", async (req, res) => {
  const data = await Promise.resolve({
    message: "Async middleware/handler",
  });

  res.json(data);
});

/*
 * ============================================================
 * 22. REQUEST TIMEOUT CONCEPT
 * ============================================================
 *
 * Long-running requests can consume resources.
 *
 * Timeout handling can be implemented at:
 *
 *     reverse proxy
 *     HTTP server
 *     framework
 *     application layer
 *
 * Choose limits based on the operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. RATE LIMITING CONCEPT
 * ============================================================
 *
 * Rate limiting middleware can restrict:
 *
 *     requests / IP
 *     requests / user
 *     requests / API key
 *
 *
 * Example:
 *
 *     100 requests / minute
 *
 *
 * Usually backed by Redis in distributed systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. REQUEST ID MIDDLEWARE
 * ============================================================
 *
 * A request ID makes distributed debugging much easier.
 *
 * ============================================================
 */

import crypto from "node:crypto";

function requestId(req, res, next) {
  const id = crypto.randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-ID", id);

  next();
}

app.use(requestId);

/*
 * ============================================================
 * 25. REQUEST CONTEXT
 * ============================================================
 *
 * Middleware can build request context:
 *
 *
 *     req.requestId
 *     req.user
 *     req.startTime
 *     req.traceId
 *
 *
 * Controllers and services can use this context for logging and
 * tracing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. ROUTER-LEVEL MIDDLEWARE
 * ============================================================
 */

const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  console.log("API router middleware");

  next();
});

apiRouter.get("/users", (req, res) => {
  res.json({
    users: [],
  });
});

apiRouter.get("/products", (req, res) => {
  res.json({
    products: [],
  });
});

app.use("/api", apiRouter);

/*
 * ============================================================
 * 27. TERMINATING MIDDLEWARE
 * ============================================================
 *
 * Not every middleware must call next().
 *
 * Middleware can terminate the request.
 *
 * Example:
 *
 *     if (!authorized) {
 *         return res.status(403).json(...);
 *     }
 *
 *
 * Request stops there.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. COMMON MIDDLEWARE PIPELINE
 * ============================================================
 *
 *
 *     Request
 *        │
 *        ↓
 *     Request ID
 *        │
 *        ↓
 *     Logger
 *        │
 *        ↓
 *     CORS
 *        │
 *        ↓
 *     Security
 *        │
 *        ↓
 *     Body Parser
 *        │
 *        ↓
 *     Authentication
 *        │
 *        ↓
 *     Authorization
 *        │
 *        ↓
 *     Validation
 *        │
 *        ↓
 *     Controller
 *        │
 *        ↓
 *     Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. AUTHENTICATION vs AUTHORIZATION vs VALIDATION
 * ============================================================
 *
 *
 * Authentication
 *
 *     Who is the caller?
 *
 *
 * Authorization
 *
 *     What is the caller allowed to do?
 *
 *
 * Validation
 *
 *     Is the supplied data structurally valid?
 *
 *
 * Example:
 *
 *     POST /users
 *
 *     authentication
 *         ↓
 *     identify user
 *
 *     authorization
 *         ↓
 *     check permission
 *
 *     validation
 *         ↓
 *     validate request body
 *
 *     controller
 *         ↓
 *     create user
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. MIDDLEWARE SHOULD HAVE ONE RESPONSIBILITY
 * ============================================================
 *
 * Prefer:
 *
 *     authenticate()
 *     authorize()
 *     validate()
 *     requestLogger()
 *     rateLimit()
 *
 *
 * Instead of:
 *
 *     doEverything()
 *
 *
 * Small middleware is easier to test and reuse.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. MIDDLEWARE ORDER IN PRODUCTION
 * ============================================================
 *
 * A typical application may look like:
 *
 *
 *     app.use(requestId)
 *
 *     app.use(requestLogger)
 *
 *     app.use(securityHeaders)
 *
 *     app.use(cors)
 *
 *     app.use(express.json)
 *
 *     app.use("/api", apiRouter)
 *
 *     app.use(notFound)
 *
 *     app.use(errorHandler)
 *
 *
 * Exact ordering depends on the application's requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. COMMON MISTAKES
 * ============================================================
 *
 * ❌ Forgetting next()
 *
 * ❌ Calling next() after sending a response
 *
 * ❌ Sending two responses
 *
 * ❌ Putting error middleware in the wrong location
 *
 * ❌ Doing database-heavy work in every global middleware
 *
 * ❌ Mixing authentication and authorization
 *
 * ❌ Putting business logic into generic middleware
 *
 * ❌ Logging passwords, tokens, or sensitive request bodies
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. PERFORMANCE CONSIDERATION
 * ============================================================
 *
 * Global middleware runs for many/all requests.
 *
 * Therefore avoid expensive work such as:
 *
 *     unnecessary database queries
 *     large synchronous computations
 *     expensive serialization
 *
 * in global middleware.
 *
 *
 * Put expensive logic only where it is required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. SECURITY CONSIDERATION
 * ============================================================
 *
 * Middleware often operates directly on untrusted input.
 *
 * Never assume:
 *
 *     req.body
 *     req.query
 *     req.params
 *     req.headers
 *
 * are safe.
 *
 * Validate and sanitize according to the application's
 * requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. MIDDLEWARE FACTORY PATTERN
 * ============================================================
 *
 * Many middleware functions are factories:
 *
 *
 *     rateLimit(options)
 *
 *     requireRole("admin")
 *
 *     validateBody(schema)
 *
 *     cors(options)
 *
 *
 * Factory:
 *
 *     configuration
 *          ↓
 *     middleware function
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    REQUEST
 *                       │
 *                       ↓
 *                ┌─────────────┐
 *                │ Middleware  │
 *                └──────┬──────┘
 *                       │
 *                  next()
 *                       │
 *                       ↓
 *                ┌─────────────┐
 *                │ Middleware  │
 *                └──────┬──────┘
 *                       │
 *                  next()
 *                       │
 *                       ↓
 *                ┌─────────────┐
 *                │ Controller  │
 *                └──────┬──────┘
 *                       │
 *                       ↓
 *                   RESPONSE
 *
 *
 * OR:
 *
 *
 * Middleware
 *     │
 *     ├── next()
 *     │     ↓
 *     │   continue
 *     │
 *     └── response
 *           ↓
 *         stop
 *
 *
 * The most important idea:
 *
 *     Middleware is the processing pipeline between the incoming
 *     request and the final response.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/controllers.js
 *
 * ============================================================
 */
