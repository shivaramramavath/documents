/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/routing.js
 *
 * Topic:
 *     Express Routing
 *
 * ============================================================
 *
 * ROUTING
 * ============================================================
 *
 * Routing determines:
 *
 *     HTTP Method + URL
 *              ↓
 *          Handler
 *
 *
 * Example:
 *
 *     GET /users
 *          ↓
 *     getUsers()
 *
 *     POST /users
 *          ↓
 *     createUser()
 *
 *     GET /users/:id
 *          ↓
 *     getUserById()
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * JSON request body parser
 */
app.use(express.json());

/*
 * ============================================================
 * 1. BASIC ROUTE
 * ============================================================
 */

app.get("/", (req, res) => {
  res.json({
    message: "Home route",
  });
});

/*
 * ============================================================
 * 2. HTTP METHODS
 * ============================================================
 *
 * Common Express methods:
 *
 *     app.get()
 *     app.post()
 *     app.put()
 *     app.patch()
 *     app.delete()
 *     app.options()
 *     app.head()
 *
 * ============================================================
 */

/*
 * GET
 */

app.get("/products", (req, res) => {
  res.json({
    message: "Get products",
  });
});

/*
 * POST
 */

app.post("/products", (req, res) => {
  res.status(201).json({
    message: "Create product",

    data: req.body,
  });
});

/*
 * PUT
 */

app.put("/products/:id", (req, res) => {
  res.json({
    message: "Replace product",

    id: req.params.id,

    data: req.body,
  });
});

/*
 * PATCH
 */

app.patch("/products/:id", (req, res) => {
  res.json({
    message: "Update product",

    id: req.params.id,

    changes: req.body,
  });
});

/*
 * DELETE
 */

app.delete("/products/:id", (req, res) => {
  res.status(204).send();
});

/*
 * ============================================================
 * 3. ROUTE PARAMETERS
 * ============================================================
 *
 * Route:
 *
 *     /users/:id
 *
 *
 * Request:
 *
 *     /users/123
 *
 *
 * Result:
 *
 *     req.params.id === "123"
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
 * 4. MULTIPLE PARAMETERS
 * ============================================================
 *
 *     /users/:userId/posts/:postId
 *
 * ============================================================
 */

app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;

  res.json({
    userId,
    postId,
  });
});

/*
 * ============================================================
 * 5. QUERY PARAMETERS
 * ============================================================
 *
 * Request:
 *
 *     /products?page=2&limit=20
 *
 *
 * Access:
 *
 *     req.query.page
 *     req.query.limit
 *
 * ============================================================
 */

app.get("/products-list", (req, res) => {
  const { page, limit } = req.query;

  res.json({
    page,
    limit,
  });
});

/*
 * ============================================================
 * 6. PATH + QUERY
 * ============================================================
 *
 * Request:
 *
 *     /users/123?includePosts=true
 *
 * ============================================================
 */

app.get("/users/:id/details", (req, res) => {
  res.json({
    id: req.params.id,

    includePosts: req.query.includePosts,
  });
});

/*
 * ============================================================
 * 7. ROUTE HANDLERS
 * ============================================================
 *
 * The handler receives:
 *
 *     req
 *     res
 *
 * ============================================================
 */

function getProducts(req, res) {
  res.json({
    products: [],
  });
}

app.get("/handler-demo", getProducts);

/*
 * ============================================================
 * 8. MULTIPLE ROUTE HANDLERS
 * ============================================================
 *
 * Middleware can run before the final handler.
 *
 * ============================================================
 */

function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
}

function checkSomething(req, res, next) {
  console.log("Second middleware");

  next();
}

function finalHandler(req, res) {
  res.json({
    message: "Final handler",
  });
}

app.get("/multiple-handlers", requestLogger, checkSomething, finalHandler);

/*
 * ============================================================
 * 9. ROUTER
 * ============================================================
 *
 * express.Router() creates a modular router.
 *
 * Instead of putting every route in app.js:
 *
 *
 *     app.get(...)
 *     app.post(...)
 *     app.delete(...)
 *
 *
 * we can organize routes into separate modules.
 *
 * ============================================================
 */

const userRouter = express.Router();

/*
 * GET /users
 */

userRouter.get("/", (req, res) => {
  res.json({
    message: "List users",
  });
});

/*
 * POST /users
 */

userRouter.post("/", (req, res) => {
  res.status(201).json({
    message: "Create user",
  });
});

/*
 * GET /users/:id
 */

userRouter.get("/:id", (req, res) => {
  res.json({
    id: req.params.id,
  });
});

/*
 * DELETE /users/:id
 */

userRouter.delete("/:id", (req, res) => {
  res.status(204).send();
});

/*
 * ============================================================
 * 10. MOUNT ROUTER
 * ============================================================
 *
 *     app.use("/users", userRouter)
 *
 *
 * Router:
 *
 *     "/"
 *     "/:id"
 *
 *
 * Final routes:
 *
 *     /users
 *     /users/:id
 *
 * ============================================================
 */

app.use("/users", userRouter);

/*
 * ============================================================
 * 11. API ROUTER
 * ============================================================
 */

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

apiRouter.get("/version", (req, res) => {
  res.json({
    version: "1.0.0",
  });
});

app.use("/api", apiRouter);

/*
 * Final routes:
 *
 *     GET /api/health
 *     GET /api/version
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. API VERSIONING
 * ============================================================
 *
 * Common approaches:
 *
 *     /api/v1/users
 *     /api/v2/users
 *
 * ============================================================
 */

const v1Router = express.Router();

v1Router.get("/users", (req, res) => {
  res.json({
    version: "v1",
  });
});

const v2Router = express.Router();

v2Router.get("/users", (req, res) => {
  res.json({
    version: "v2",
  });
});

app.use("/api/v1", v1Router);

app.use("/api/v2", v2Router);

/*
 * ============================================================
 * 13. ROUTE-SPECIFIC MIDDLEWARE
 * ============================================================
 */

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  next();
}

app.get("/private", authenticate, (req, res) => {
  res.json({
    message: "Private resource",
  });
});

/*
 * ============================================================
 * 14. MULTIPLE ROUTES USING SAME MIDDLEWARE
 * ============================================================
 */

app.use("/admin", authenticate);

app.get("/admin/dashboard", (req, res) => {
  res.json({
    message: "Admin dashboard",
  });
});

app.get("/admin/users", (req, res) => {
  res.json({
    message: "Admin users",
  });
});

/*
 * ============================================================
 * 15. ROUTER-LEVEL MIDDLEWARE
 * ============================================================
 */

const productRouter = express.Router();

productRouter.use((req, res, next) => {
  console.log("Product router middleware");

  next();
});

productRouter.get("/", (req, res) => {
  res.json({
    products: [],
  });
});

productRouter.get("/:id", (req, res) => {
  res.json({
    productId: req.params.id,
  });
});

app.use("/products-api", productRouter);

/*
 * ============================================================
 * 16. mergeParams
 * ============================================================
 *
 * Parent route:
 *
 *     /users/:userId
 *
 *
 * Child router:
 *
 *     /posts
 *
 *
 * To access userId inside the child router, use:
 *
 *     express.Router({
 *       mergeParams: true
 *     })
 *
 * ============================================================
 */

const postRouter = express.Router({
  mergeParams: true,
});

postRouter.get("/", (req, res) => {
  res.json({
    userId: req.params.userId,

    posts: [],
  });
});

app.use("/users/:userId/posts", postRouter);

/*
 * Final route:
 *
 *     GET /users/123/posts
 *
 *
 * Inside postRouter:
 *
 *     req.params.userId
 *
 *     → "123"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Route constraints
 * ============================================================
 *
 * Route patterns should generally remain simple and explicit.
 *
 * Complex input validation is better handled with a validation
 * library such as Zod.
 *
 *
 * Example:
 *
 *     /users/:id
 *
 *
 * Then validate:
 *
 *     id
 *
 * with:
 *
 *     Zod
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Route naming
 * ============================================================
 *
 * Prefer resource-oriented routes.
 *
 *
 * GOOD:
 *
 *     GET    /users
 *     GET    /users/:id
 *     POST   /users
 *     PATCH  /users/:id
 *     DELETE /users/:id
 *
 *
 * Instead of:
 *
 *     GET /getUsers
 *     POST /createUser
 *     POST /deleteUser
 *
 *
 * HTTP method already communicates the operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Nested resources
 * ============================================================
 *
 * Example:
 *
 *     GET /users/:userId/orders
 *
 *     GET /users/:userId/orders/:orderId
 *
 *
 * Useful when the relationship is meaningful.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Route ordering
 * ============================================================
 *
 * Route registration order matters.
 *
 *
 * Put specific routes before parameter routes when necessary.
 *
 *
 * Example:
 *
 *     /users/me
 *     /users/:id
 *
 *
 * "me" is a literal route.
 *
 * Keep it before a generic parameter route when route matching
 * could otherwise interpret "me" as an ID.
 *
 * ============================================================
 */

app.get("/special-users/me", (req, res) => {
  res.json({
    user: "current-user",
  });
});

app.get("/special-users/:id", (req, res) => {
  res.json({
    userId: req.params.id,
  });
});

/*
 * ============================================================
 * 21. Router organization
 * ============================================================
 *
 *
 *     routes/
 *
 *     ├── user.routes.js
 *     ├── auth.routes.js
 *     ├── product.routes.js
 *     └── order.routes.js
 *
 *
 * Each router should focus on a resource/domain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Example route file
 * ============================================================
 *
 *
 *     // user.routes.js
 *
 *     import express from "express";
 *
 *     const router = express.Router();
 *
 *     router.get("/", listUsers);
 *     router.get("/:id", getUser);
 *     router.post("/", createUser);
 *     router.patch("/:id", updateUser);
 *     router.delete("/:id", deleteUser);
 *
 *     export default router;
 *
 *
 * Then in app.js:
 *
 *
 *     app.use(
 *       "/api/users",
 *       userRouter
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Route → Controller
 * ============================================================
 *
 * Avoid putting large business logic directly inside routes.
 *
 *
 * BAD:
 *
 *     router.post(
 *       "/users",
 *       async (req, res) => {
 *         // hundreds of lines
 *       }
 *     );
 *
 *
 * BETTER:
 *
 *     router.post(
 *       "/users",
 *       createUser
 *     );
 *
 *
 *     route
 *       ↓
 *     controller
 *       ↓
 *     service
 *       ↓
 *     repository/model
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Complete route pipeline
 * ============================================================
 *
 *
 *     HTTP Request
 *          ↓
 *     app middleware
 *          ↓
 *     router middleware
 *          ↓
 *     authentication
 *          ↓
 *     validation
 *          ↓
 *     controller
 *          ↓
 *     service
 *          ↓
 *     database
 *          ↓
 *     response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. 404 handler
 * ============================================================
 *
 * Put this AFTER all valid routes.
 *
 * ============================================================
 */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/*
 * ============================================================
 * 26. Error handler
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
 * 27. Start server
 * ============================================================
 */

const server = app.listen(PORT, () => {
  console.log(`Routing demo running on port ${PORT}`);
});

/*
 * ============================================================
 * 28. Graceful shutdown
 * ============================================================
 */

function shutdown(signal) {
  console.log(`${signal} received`);

  server.close(() => {
    console.log("Server closed");

    process.exit(0);
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));

process.once("SIGINT", () => shutdown("SIGINT"));

/*
 * ============================================================
 * 29. IMPORTANT ROUTING CONCEPTS
 * ============================================================
 *
 *     app.get()
 *         → GET route
 *
 *     app.post()
 *         → POST route
 *
 *     app.put()
 *         → replacement update
 *
 *     app.patch()
 *         → partial update
 *
 *     app.delete()
 *         → deletion
 *
 *     req.params
 *         → path parameters
 *
 *     req.query
 *         → query parameters
 *
 *     req.body
 *         → request body
 *
 *     express.Router()
 *         → modular routes
 *
 *     app.use()
 *         → mount middleware/router
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    EXPRESS
 *                       │
 *                       ↓
 *                   app.use()
 *                       │
 *                       ↓
 *                    Router
 *                       │
 *            ┌──────────┼──────────┐
 *            ↓          ↓          ↓
 *           GET        POST       PATCH
 *            │          │          │
 *            ↓          ↓          ↓
 *       Controller  Controller  Controller
 *            │          │          │
 *            └──────────┼──────────┘
 *                       ↓
 *                    Service
 *                       ↓
 *                    Database
 *
 *
 * The key idea:
 *
 *     ROUTE = HTTP method + path + middleware + handler
 *
 *
 * Keep routing focused on HTTP concerns.
 * Keep business logic in services/controllers.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/middleware.js
 *
 * ============================================================
 */
