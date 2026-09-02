/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/app.js
 *
 * Topic:
 *     Express Application Basics
 *
 * ============================================================
 *
 * INSTALLATION
 * ============================================================
 *
 *     npm install express
 *
 *
 * Express is a minimal web framework built on top of Node.js.
 *
 * Node.js HTTP:
 *
 *     http.createServer(...)
 *
 *
 * Express:
 *
 *     express()
 *     app.get(...)
 *     app.post(...)
 *     app.use(...)
 *
 *
 * Express makes routing, middleware, request handling and API
 * development much easier.
 *
 * ============================================================
 *
 * BASIC FLOW
 * ============================================================
 *
 *     Client
 *       │
 *       │ HTTP Request
 *       ↓
 *    Express
 *       │
 *       ├── Middleware
 *       │
 *       ├── Router
 *       │
 *       └── Controller
 *              │
 *              ↓
 *          Response
 *
 * ============================================================
 */

import express from "express";

/*
 * ============================================================
 * 1. Create Express application
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * 2. Application configuration
 * ============================================================
 *
 * Express applications have settings.
 *
 * ============================================================
 */

app.set("case sensitive routing", false);

/*
 * ============================================================
 * 3. Port
 * ============================================================
 *
 * In production, the port normally comes from an environment
 * variable.
 *
 * ============================================================
 */

const PORT = process.env.PORT || 3000;

/*
 * ============================================================
 * 4. JSON body parser
 * ============================================================
 *
 * HTTP request bodies containing JSON need to be parsed before
 * we can access req.body.
 *
 * ============================================================
 */

app.use(express.json());

/*
 * ============================================================
 * 5. URL encoded body parser
 * ============================================================
 *
 * Useful for:
 *
 *     application/x-www-form-urlencoded
 *
 * ============================================================
 */

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
 * ============================================================
 * 6. Basic GET route
 * ============================================================
 */

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

/*
 * ============================================================
 * 7. Health check route
 * ============================================================
 *
 * Health endpoints are commonly used by:
 *
 *     load balancers
 *     Docker
 *     Kubernetes
 *     monitoring systems
 *
 * ============================================================
 */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

/*
 * ============================================================
 * 8. JSON response
 * ============================================================
 */

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello API",
  });
});

/*
 * ============================================================
 * 9. Route parameters
 * ============================================================
 *
 * Example:
 *
 *     GET /users/123
 *
 * ============================================================
 */

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    userId: id,
  });
});

/*
 * ============================================================
 * 10. Query parameters
 * ============================================================
 *
 * Example:
 *
 *     GET /users?page=2&limit=10
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  const { page, limit } = req.query;

  res.json({
    page,
    limit,
  });
});

/*
 * ============================================================
 * 11. POST request
 * ============================================================
 */

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  res.status(201).json({
    message: "User created",

    user: {
      name,
      email,
    },
  });
});

/*
 * ============================================================
 * 12. PUT request
 * ============================================================
 *
 * PUT commonly represents replacement/update of a resource.
 *
 * ============================================================
 */

app.put("/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: "User updated",

    userId: id,

    data: req.body,
  });
});

/*
 * ============================================================
 * 13. PATCH request
 * ============================================================
 *
 * PATCH commonly represents a partial update.
 *
 * ============================================================
 */

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: "User partially updated",

    userId: id,

    changes: req.body,
  });
});

/*
 * ============================================================
 * 14. DELETE request
 * ============================================================
 */

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  res.status(204).send();
});

/*
 * ============================================================
 * 15. Application middleware
 * ============================================================
 *
 * Middleware has access to:
 *
 *     req
 *     res
 *     next
 *
 * ============================================================
 */

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
});

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * Middleware order matters.
 *
 *
 *     app.use(middlewareA);
 *     app.use(middlewareB);
 *     app.get("/", handler);
 *
 *
 * Request flows:
 *
 *
 *     middlewareA
 *          ↓
 *     middlewareB
 *          ↓
 *       handler
 *
 *
 * Express processes middleware/routes in registration order.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Route-specific middleware
 * ============================================================
 */

function logger(req, res, next) {
  console.log("Route middleware:", req.method, req.path);

  next();
}

app.get("/protected-demo", logger, (req, res) => {
  res.json({
    message: "Route middleware executed",
  });
});

/*
 * ============================================================
 * 17. Multiple middleware functions
 * ============================================================
 */

function middlewareOne(req, res, next) {
  console.log("Middleware 1");

  next();
}

function middlewareTwo(req, res, next) {
  console.log("Middleware 2");

  next();
}

app.get("/middleware-demo", middlewareOne, middlewareTwo, (req, res) => {
  res.json({
    message: "All middleware completed",
  });
});

/*
 * ============================================================
 * 18. Request object
 * ============================================================
 *
 * Important properties:
 *
 *     req.method
 *     req.url
 *     req.originalUrl
 *     req.path
 *     req.params
 *     req.query
 *     req.body
 *     req.headers
 *     req.ip
 *
 * ============================================================
 */

app.get("/request-info", (req, res) => {
  res.json({
    method: req.method,

    url: req.originalUrl,

    path: req.path,

    params: req.params,

    query: req.query,

    headers: req.headers,
  });
});

/*
 * ============================================================
 * 19. Response object
 * ============================================================
 *
 * Common response methods:
 *
 *     res.send()
 *     res.json()
 *     res.status()
 *     res.end()
 *     res.redirect()
 *     res.sendStatus()
 *
 * ============================================================
 */

app.get("/response-demo", (req, res) => {
  res.status(200).json({
    message: "Response sent",
  });
});

/*
 * ============================================================
 * 20. Custom response headers
 * ============================================================
 */

app.get("/headers", (req, res) => {
  res.set("X-App-Version", "1.0.0");

  res.json({
    message: "Custom header added",
  });
});

/*
 * ============================================================
 * 21. Status codes
 * ============================================================
 */

app.get("/created", (req, res) => {
  res.status(201).json({
    message: "Resource created",
  });
});

app.get("/bad-request", (req, res) => {
  res.status(400).json({
    error: "Bad request",
  });
});

app.get("/unauthorized", (req, res) => {
  res.status(401).json({
    error: "Authentication required",
  });
});

app.get("/forbidden", (req, res) => {
  res.status(403).json({
    error: "Access denied",
  });
});

app.get("/not-found", (req, res) => {
  res.status(404).json({
    error: "Resource not found",
  });
});

/*
 * ============================================================
 * 22. Catch-all 404 handler
 * ============================================================
 *
 * In modern Express, use a middleware without relying on
 * deprecated wildcard route syntax.
 *
 * ============================================================
 */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",

    path: req.originalUrl,
  });
});

/*
 * ============================================================
 * 23. Error-handling middleware
 * ============================================================
 *
 * Error middleware has FOUR arguments:
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

  res.status(500).json({
    error: "Internal server error",
  });
});

/*
 * ============================================================
 * 24. Starting the server
 * ============================================================
 *
 * app.listen() creates the HTTP server and starts listening.
 *
 * ============================================================
 */

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
 * ============================================================
 * 25. Server reference
 * ============================================================
 *
 * app:
 *
 *     Express application
 *
 *
 * server:
 *
 *     Node.js HTTP server returned by app.listen()
 *
 *
 * Keeping the server reference is useful for:
 *
 *     graceful shutdown
 *     integration testing
 *     closing the server
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Graceful shutdown
 * ============================================================
 *
 * When the process receives SIGTERM/SIGINT, close the server
 * before exiting.
 *
 * ============================================================
 */

function shutdown(signal) {
  console.log(`${signal} received`);

  server.close(() => {
    console.log("HTTP server closed");

    process.exit(0);
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));

process.once("SIGINT", () => shutdown("SIGINT"));

/*
 * ============================================================
 * 27. Export app
 * ============================================================
 *
 * Exporting app separately is useful for testing.
 *
 * ============================================================
 */

export { app, server };

/*
 * ============================================================
 * 28. Typical Express project
 * ============================================================
 *
 *
 *     src/
 *     │
 *     ├── app.js
 *     ├── server.js
 *     │
 *     ├── routes/
 *     │   ├── user.routes.js
 *     │   └── auth.routes.js
 *     │
 *     ├── controllers/
 *     │   ├── user.controller.js
 *     │   └── auth.controller.js
 *     │
 *     ├── services/
 *     │   ├── user.service.js
 *     │   └── auth.service.js
 *     │
 *     ├── middleware/
 *     │   ├── auth.js
 *     │   └── validation.js
 *     │
 *     └── models/
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. app.js vs server.js
 * ============================================================
 *
 * A common production structure is:
 *
 *
 *     app.js
 *
 *         creates Express app
 *         registers middleware
 *         registers routes
 *         registers error handlers
 *
 *
 *     server.js
 *
 *         loads configuration
 *         connects database
 *         starts HTTP server
 *         handles shutdown
 *
 *
 * This separation makes testing easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Example architecture
 * ============================================================
 *
 *
 *                  server.js
 *                      │
 *                      ↓
 *                   app.js
 *                      │
 *             ┌────────┼────────┐
 *             ↓        ↓        ↓
 *        middleware  routes   errors
 *                      │
 *                      ↓
 *                controllers
 *                      │
 *                      ↓
 *                  services
 *                      │
 *                      ↓
 *                  database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Middleware order example
 * ============================================================
 *
 *
 *     app.use(express.json());
 *
 *     app.use(logger);
 *
 *     app.use(auth);
 *
 *     app.use("/api/users", userRouter);
 *
 *     app.use(notFound);
 *
 *     app.use(errorHandler);
 *
 *
 * Order matters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Common mistakes
 * ============================================================
 *
 * ❌ Forgetting express.json()
 *
 *     req.body may not contain parsed JSON.
 *
 *
 * ❌ Forgetting next()
 *
 *     Request may never continue.
 *
 *
 * ❌ Sending multiple responses
 *
 *     res.json(...)
 *     res.json(...)
 *
 *
 * ❌ Registering error middleware incorrectly
 *
 *     (req, res, next) => {}
 *
 * instead of:
 *
 *     (err, req, res, next) => {}
 *
 *
 * ❌ Putting 404 middleware before routes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Express request lifecycle
 * ============================================================
 *
 *
 * Client
 *   │
 *   ↓
 * HTTP server
 *   │
 *   ↓
 * Express
 *   │
 *   ↓
 * JSON parser
 *   │
 *   ↓
 * Logger
 *   │
 *   ↓
 * Authentication
 *   │
 *   ↓
 * Validation
 *   │
 *   ↓
 * Router
 *   │
 *   ↓
 * Controller
 *   │
 *   ↓
 * Service
 *   │
 *   ↓
 * Database
 *   │
 *   ↓
 * Controller
 *   │
 *   ↓
 * Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Express is middleware-driven
 * ============================================================
 *
 * The core concept to remember:
 *
 *
 *     Request
 *        ↓
 *     Middleware
 *        ↓
 *     Middleware
 *        ↓
 *     Route
 *        ↓
 *     Handler
 *        ↓
 *     Response
 *
 *
 * Express applications are essentially pipelines through which
 * HTTP requests travel.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *             EXPRESS APP
 *                  │
 *        ┌─────────┴─────────┐
 *        ↓                   ↓
 *    Middleware            Routes
 *        │                   │
 *        ↓                   ↓
 *   req / res / next      Handler
 *                            │
 *                            ↓
 *                         Response
 *
 *
 * Learn these five concepts well:
 *
 *     1. app
 *     2. middleware
 *     3. routes
 *     4. req/res
 *     5. error handling
 *
 * They form the foundation of almost every Express backend.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/routing.js
 *
 * ============================================================
 */
