/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/request_response.js
 *
 * Topic:
 *     Express Request & Response
 *
 * ============================================================
 *
 * HTTP FLOW
 * ============================================================
 *
 *     Client
 *       │
 *       │ HTTP Request
 *       ↓
 *     Express
 *       │
 *       ├── req
 *       │
 *       ↓
 *     Middleware / Controller
 *       │
 *       ├── res
 *       │
 *       ↓
 *     HTTP Response
 *       │
 *       ↓
 *     Client
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * Parse JSON request bodies.
 *
 * This is important for:
 *
 *     POST
 *     PUT
 *     PATCH
 *
 * requests containing JSON.
 */

app.use(express.json());

/*
 * Parse application/x-www-form-urlencoded bodies.
 */

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
 * ============================================================
 * 1. REQUEST OBJECT
 * ============================================================
 *
 * Express's `req` object represents the incoming HTTP request.
 *
 * Common properties:
 *
 *     req.method
 *     req.url
 *     req.originalUrl
 *     req.path
 *     req.params
 *     req.query
 *     req.body
 *     req.headers
 *     req.cookies
 *     req.ip
 *     req.protocol
 *     req.hostname
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. req.method
 * ============================================================
 */

app.get("/method", (req, res) => {
  res.json({
    method: req.method,
  });
});

/*
 * Example:
 *
 *     GET /method
 *
 * Response:
 *
 *     {
 *       "method": "GET"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. req.url
 * ============================================================
 */

app.get("/request-url", (req, res) => {
  res.json({
    url: req.url,
  });
});

/*
 * ============================================================
 * 4. req.originalUrl
 * ============================================================
 *
 * Particularly useful when routers are mounted.
 *
 * Example:
 *
 *     app.use("/api", router)
 *
 *
 * Request:
 *
 *     /api/users
 *
 *
 * req.originalUrl:
 *
 *     /api/users
 *
 * ============================================================
 */

app.get("/original-url", (req, res) => {
  res.json({
    originalUrl: req.originalUrl,
  });
});

/*
 * ============================================================
 * 5. req.path
 * ============================================================
 *
 * Returns the URL path without the query string.
 *
 * Request:
 *
 *     /users?page=2
 *
 *
 * req.path:
 *
 *     /users
 *
 * ============================================================
 */

app.get("/path", (req, res) => {
  res.json({
    path: req.path,
  });
});

/*
 * ============================================================
 * 6. ROUTE PARAMETERS
 * ============================================================
 */

app.get("/users/:id", (req, res) => {
  res.json({
    id: req.params.id,
  });
});

/*
 * Request:
 *
 *     GET /users/123
 *
 *
 * req.params:
 *
 *     {
 *       id: "123"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. MULTIPLE ROUTE PARAMETERS
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
 * 8. QUERY PARAMETERS
 * ============================================================
 *
 * Request:
 *
 *     /products?page=2&limit=10
 *
 * ============================================================
 */

app.get("/query", (req, res) => {
  const { page, limit } = req.query;

  res.json({
    page,
    limit,
  });
});

/*
 * IMPORTANT:
 *
 * Query parameters are strings by default.
 *
 *     ?page=2
 *
 * gives:
 *
 *     page === "2"
 *
 *
 * Convert explicitly when needed:
 *
 *     Number(page)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. REQUEST BODY
 * ============================================================
 *
 * JSON:
 *
 *     {
 *       "name": "Shiva",
 *       "age": 21
 *     }
 *
 *
 * Access:
 *
 *     req.body
 *
 * ============================================================
 */

app.post("/body", (req, res) => {
  const { name, age } = req.body;

  res.json({
    name,
    age,
  });
});

/*
 * ============================================================
 * 10. HEADERS
 * ============================================================
 *
 * Request headers contain metadata sent by the client.
 *
 * Examples:
 *
 *     Authorization
 *     Content-Type
 *     Accept
 *     User-Agent
 *     X-Request-ID
 *
 * ============================================================
 */

app.get("/headers", (req, res) => {
  res.json({
    authorization: req.headers.authorization,

    contentType: req.headers["content-type"],

    userAgent: req.headers["user-agent"],
  });
});

/*
 * ============================================================
 * 11. req.get()
 * ============================================================
 *
 * Express provides:
 *
 *     req.get("Header-Name")
 *
 * ============================================================
 */

app.get("/header", (req, res) => {
  const userAgent = req.get("User-Agent");

  res.json({
    userAgent,
  });
});

/*
 * ============================================================
 * 12. AUTHORIZATION HEADER
 * ============================================================
 */

app.get("/authorization", (req, res) => {
  const authorization = req.get("Authorization");

  if (!authorization) {
    return res.status(401).json({
      error: "Authorization header required",
    });
  }

  res.json({
    authorization,
  });
});

/*
 * ============================================================
 * 13. IP ADDRESS
 * ============================================================
 */

app.get("/ip", (req, res) => {
  res.json({
    ip: req.ip,
  });
});

/*
 * ============================================================
 * 14. PROTOCOL
 * ============================================================
 */

app.get("/protocol", (req, res) => {
  res.json({
    protocol: req.protocol,

    secure: req.secure,
  });
});

/*
 * ============================================================
 * 15. HOSTNAME
 * ============================================================
 */

app.get("/hostname", (req, res) => {
  res.json({
    hostname: req.hostname,
  });
});

/*
 * ============================================================
 * 16. TRUST PROXY
 * ============================================================
 *
 * In production, your Express application may run behind:
 *
 *     Nginx
 *     AWS Load Balancer
 *     Cloudflare
 *     Kubernetes Ingress
 *     API Gateway
 *
 *
 * Then request information such as IP/protocol may depend on
 * proxy configuration.
 *
 * Example:
 *
 *     app.set("trust proxy", 1);
 *
 *
 * Configure this according to your actual infrastructure.
 *
 * Do NOT blindly trust arbitrary forwarded headers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. CONTENT TYPE
 * ============================================================
 */

app.get("/accept", (req, res) => {
  res.json({
    accept: req.get("Accept"),

    contentType: req.get("Content-Type"),
  });
});

/*
 * ============================================================
 * 18. RESPONSE OBJECT
 * ============================================================
 *
 * Express's `res` object represents the outgoing HTTP response.
 *
 * Common methods:
 *
 *     res.status()
 *     res.send()
 *     res.json()
 *     res.end()
 *     res.set()
 *     res.header()
 *     res.type()
 *     res.redirect()
 *     res.cookie()
 *     res.clearCookie()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. res.status()
 * ============================================================
 */

app.get("/status", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

/*
 * ============================================================
 * 20. res.json()
 * ============================================================
 *
 * Sends a JSON response.
 *
 * This is the most common response type for REST APIs.
 *
 * ============================================================
 */

app.get("/json", (req, res) => {
  res.json({
    id: 123,

    name: "Shiva",

    active: true,
  });
});

/*
 * ============================================================
 * 21. res.send()
 * ============================================================
 *
 * Can send:
 *
 *     string
 *     Buffer
 *     object
 *     array
 *     etc.
 *
 * For APIs, res.json() is often clearer when returning JSON.
 *
 * ============================================================
 */

app.get("/send", (req, res) => {
  res.send("Hello from Express");
});

/*
 * ============================================================
 * 22. res.end()
 * ============================================================
 *
 * Ends the response without sending a response body.
 *
 * ============================================================
 */

app.get("/end", (req, res) => {
  res.end();
});

/*
 * ============================================================
 * 23. 204 NO CONTENT
 * ============================================================
 */

app.delete("/users/:id", (req, res) => {
  /*
   * Resource deleted.
   *
   * No response body.
   */

  res.status(204).send();
});

/*
 * ============================================================
 * 24. RESPONSE HEADERS
 * ============================================================
 */

app.get("/response-headers", (req, res) => {
  res.set("X-App-Version", "1.0.0");

  res.set("X-Request-Processed", "true");

  res.json({
    message: "Headers set",
  });
});

/*
 * ============================================================
 * 25. res.header()
 * ============================================================
 *
 * Alias of res.set().
 *
 * ============================================================
 */

app.get("/response-header", (req, res) => {
  res.header("X-Custom-Header", "hello");

  res.json({
    message: "Header added",
  });
});

/*
 * ============================================================
 * 26. MULTIPLE HEADERS
 * ============================================================
 */

app.get("/multiple-response-headers", (req, res) => {
  res.set({
    "X-App-Version": "1.0.0",

    "X-Environment": "development",
  });

  res.json({
    message: "Multiple headers",
  });
});

/*
 * ============================================================
 * 27. CONTENT TYPE
 * ============================================================
 */

app.get("/content-type", (req, res) => {
  res.type("json");

  res.send(
    JSON.stringify({
      message: "JSON response",
    }),
  );
});

/*
 * Better:
 *
 *     res.json({
 *       message: "JSON response"
 *     });
 *
 *
 * Express automatically sets the appropriate content type.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. REDIRECT
 * ============================================================
 */

app.get("/old-page", (req, res) => {
  res.redirect("/new-page");
});

app.get("/new-page", (req, res) => {
  res.json({
    message: "New page",
  });
});

/*
 * ============================================================
 * 29. EXPLICIT REDIRECT STATUS
 * ============================================================
 */

app.get("/temporary-redirect", (req, res) => {
  res.redirect(302, "/new-page");
});

/*
 * ============================================================
 * 30. RESPONSE COOKIES
 * ============================================================
 *
 * Express can set cookies using res.cookie().
 *
 * ============================================================
 */

app.get("/cookie", (req, res) => {
  res.cookie("sessionId", "example-session", {
    httpOnly: true,

    secure: true,

    sameSite: "lax",

    maxAge: 60 * 60 * 1000,
  });

  res.json({
    message: "Cookie set",
  });
});

/*
 * IMPORTANT:
 *
 * Do not store sensitive authentication material in cookies
 * without understanding:
 *
 *     HttpOnly
 *     Secure
 *     SameSite
 *     CSRF
 *     expiration
 *     domain
 *     path
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CLEAR COOKIE
 * ============================================================
 */

app.post("/logout", (req, res) => {
  res.clearCookie("sessionId");

  res.status(204).send();
});

/*
 * ============================================================
 * 32. RESPONSE LOCATION
 * ============================================================
 *
 * Location header is commonly used with redirects and resource
 * creation patterns.
 *
 * ============================================================
 */

app.post("/resource", (req, res) => {
  const id = "resource_123";

  res.status(201).location(`/resource/${id}`).json({
    id,
  });
});

/*
 * ============================================================
 * 33. RESPONSE STATUS + JSON
 * ============================================================
 *
 * Common pattern:
 *
 *     res
 *       .status(201)
 *       .json(data);
 *
 * ============================================================
 */

app.post("/create", (req, res) => {
  const resource = {
    id: "123",

    ...req.body,
  };

  res.status(201).json({
    data: resource,
  });
});

/*
 * ============================================================
 * 34. CHECKING RESPONSE STATE
 * ============================================================
 *
 * res.headersSent tells whether HTTP headers have already been
 * sent.
 *
 * ============================================================
 */

app.get("/response-state", (req, res) => {
  console.log("Before response:", res.headersSent);

  res.json({
    message: "Response sent",
  });

  console.log("After response:", res.headersSent);
});

/*
 * ============================================================
 * 35. DO NOT SEND TWO RESPONSES
 * ============================================================
 *
 * BAD:
 *
 *     if (!user) {
 *       res.status(404).json(...);
 *     }
 *
 *     res.json(user);
 *
 *
 * Better:
 *
 *     if (!user) {
 *       return res.status(404).json(...);
 *     }
 *
 * ============================================================
 */

app.get("/single-response", (req, res) => {
  const exists = false;

  if (!exists) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  return res.json({
    message: "Resource found",
  });
});

/*
 * ============================================================
 * 36. REQUEST + RESPONSE TOGETHER
 * ============================================================
 */

app.post("/echo", (req, res) => {
  res.json({
    request: {
      method: req.method,

      path: req.path,

      params: req.params,

      query: req.query,

      body: req.body,
    },

    response: {
      status: 200,
    },
  });
});

/*
 * ============================================================
 * 37. REQUEST LIFECYCLE
 * ============================================================
 *
 *
 * Client
 *   │
 *   │
 *   ↓
 * HTTP Request
 *   │
 *   ↓
 * Express
 *   │
 *   ├── req.method
 *   ├── req.params
 *   ├── req.query
 *   ├── req.headers
 *   └── req.body
 *   │
 *   ↓
 * Middleware
 *   │
 *   ↓
 * Controller
 *   │
 *   ├── res.status()
 *   ├── res.set()
 *   ├── res.cookie()
 *   └── res.json()
 *   │
 *   ↓
 * HTTP Response
 *   │
 *   ↓
 * Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. REQUEST DATA SOURCES
 * ============================================================
 *
 *
 * URL:
 *
 *     /users/123
 *
 *         ↓
 *
 *     req.params.id
 *
 *
 * Query:
 *
 *     /users?page=2
 *
 *         ↓
 *
 *     req.query.page
 *
 *
 * Body:
 *
 *     {"name":"Shiva"}
 *
 *         ↓
 *
 *     req.body.name
 *
 *
 * Headers:
 *
 *     Authorization: Bearer ...
 *
 *         ↓
 *
 *     req.headers.authorization
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. REQUEST VALIDATION
 * ============================================================
 *
 * Never assume client input is valid.
 *
 * Validate:
 *
 *     req.params
 *     req.query
 *     req.body
 *     relevant headers
 *
 *
 * Example:
 *
 *     GET /users/:id
 *
 * Validate that:
 *
 *     id
 *
 * is actually a valid identifier before passing it to the
 * service/database layer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. QUERY PARAMETER CONVERSION
 * ============================================================
 */

app.get("/pagination", (req, res) => {
  const page = Number(req.query.page || 1);

  const limit = Number(req.query.limit || 20);

  res.json({
    page,
    limit,
  });
});

/*
 * In production, also validate:
 *
 *     NaN
 *     negative values
 *     excessively large limits
 *
 *
 * Example:
 *
 *     ?limit=999999999
 *
 * should not automatically cause an expensive database query.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. CONTENT NEGOTIATION
 * ============================================================
 *
 * The client can specify what response formats it accepts.
 *
 * Example:
 *
 *     Accept: application/json
 *
 * ============================================================
 */

app.get("/negotiation", (req, res) => {
  const acceptsJson = req.accepts("json");

  if (!acceptsJson) {
    return res.status(406).send("JSON response required");
  }

  res.json({
    message: "JSON accepted",
  });
});

/*
 * ============================================================
 * 42. RESPONSE TYPE
 * ============================================================
 */

app.get("/type", (req, res) => {
  res.type("text");

  res.send("Plain text");
});

/*
 * ============================================================
 * 43. STREAMING RESPONSE
 * ============================================================
 *
 * Responses do not always need to be generated as one giant
 * object.
 *
 * Node.js supports streaming data.
 *
 * This becomes important for:
 *
 *     large files
 *     server-sent events
 *     generated data
 *     large exports
 *
 * ============================================================
 */

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/plain");

  res.write("First chunk\n");

  res.write("Second chunk\n");

  res.end("Final chunk\n");
});

/*
 * ============================================================
 * 44. RESPONSE EVENTS
 * ============================================================
 *
 * Node's response object emits lifecycle events.
 *
 * `finish` occurs when the response has been handed off to the
 * underlying system.
 *
 * Useful for:
 *
 *     logging
 *     metrics
 *     request duration
 *
 * ============================================================
 */

app.get("/response-event", (req, res) => {
  res.on("finish", () => {
    console.log("Response finished");
  });

  res.json({
    message: "Done",
  });
});

/*
 * ============================================================
 * 45. ABORTED REQUESTS
 * ============================================================
 *
 * Clients can disconnect before the server finishes.
 *
 * Long-running operations should consider request lifecycle and
 * cancellation where appropriate.
 *
 * ============================================================
 */

app.get("/lifecycle", (req, res) => {
  req.on("aborted", () => {
    console.log("Request aborted by client");
  });

  res.json({
    message: "Request completed",
  });
});

/*
 * ============================================================
 * 46. COMMON API RESPONSE FORMAT
 * ============================================================
 *
 * A project can standardize responses.
 *
 * Success:
 *
 *     {
 *       "success": true,
 *       "data": {...}
 *     }
 *
 *
 * Error:
 *
 *     {
 *       "success": false,
 *       "error": {
 *         "code": "NOT_FOUND",
 *         "message": "User not found"
 *       }
 *     }
 *
 *
 * Consistency makes frontend integration easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. REST CREATE RESPONSE
 * ============================================================
 */

app.post("/users-response", (req, res) => {
  const user = {
    id: "user_123",

    name: req.body.name,
  };

  res.status(201).location(`/users-response/${user.id}`).json({
    data: user,
  });
});

/*
 * ============================================================
 * 48. REST UPDATE RESPONSE
 * ============================================================
 */

app.patch("/users-response/:id", (req, res) => {
  const user = {
    id: req.params.id,

    ...req.body,
  };

  res.json({
    data: user,
  });
});

/*
 * ============================================================
 * 49. REST DELETE RESPONSE
 * ============================================================
 */

app.delete("/users-response/:id", (req, res) => {
  /*
   * No response body.
   */

  res.status(204).send();
});

/*
 * ============================================================
 * 50. HEAD REQUEST
 * ============================================================
 *
 * HEAD is similar to GET but does not return a response body.
 *
 * Express can handle HEAD requests associated with GET routes.
 *
 * ============================================================
 */

app.head("/health", (req, res) => {
  res.status(200).end();
});

/*
 * ============================================================
 * 51. REQUEST / RESPONSE TYPES
 * ============================================================
 *
 * In TypeScript, Express provides types such as:
 *
 *
 *     Request
 *     Response
 *     NextFunction
 *
 *
 * Example:
 *
 *
 *     import type {
 *       Request,
 *       Response,
 *       NextFunction,
 *     } from "express";
 *
 *
 *     function handler(
 *       req: Request,
 *       res: Response,
 *       next: NextFunction,
 *     ) {
 *       ...
 *     }
 *
 *
 * TypeScript becomes especially useful for:
 *
 *     req.params
 *     req.body
 *     req.query
 *     req.user
 *
 * ============================================================
 */

/*
 * ============================================================
 * 52. SECURITY RULES
 * ============================================================
 *
 * Never blindly trust:
 *
 *     req.body
 *     req.query
 *     req.params
 *     req.headers
 *     cookies
 *
 *
 * Validate input.
 *
 *
 * Never return:
 *
 *     passwords
 *     password hashes
 *     access tokens
 *     refresh tokens
 *     API keys
 *     internal secrets
 *
 * unless there is a very specific and secure reason.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 53. COMMON MISTAKES
 * ============================================================
 *
 * ❌ Forgetting express.json()
 *
 * ❌ Treating query parameters as numbers without conversion
 *
 * ❌ Trusting client input
 *
 * ❌ Sending two responses
 *
 * ❌ Forgetting return after an early response
 *
 * ❌ Exposing internal database objects
 *
 * ❌ Exposing secrets through headers/responses
 *
 * ❌ Blindly trusting proxy headers
 *
 * ❌ Using huge pagination limits
 *
 * ❌ Performing expensive synchronous work inside handlers
 *
 * ============================================================
 */

/*
 * ============================================================
 * 54. REQUEST VS RESPONSE
 * ============================================================
 *
 *
 * REQUEST
 * ─────────────────────────────────────────
 *
 * req.method
 *     HTTP method
 *
 * req.params
 *     Route parameters
 *
 * req.query
 *     Query parameters
 *
 * req.body
 *     Request body
 *
 * req.headers
 *     Request headers
 *
 * req.ip
 *     Client/proxy-derived IP information
 *
 *
 * RESPONSE
 * ─────────────────────────────────────────
 *
 * res.status()
 *     HTTP status
 *
 * res.json()
 *     JSON response
 *
 * res.send()
 *     General response
 *
 * res.set()
 *     Response headers
 *
 * res.cookie()
 *     Set cookie
 *
 * res.redirect()
 *     Redirect
 *
 * res.end()
 *     End response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 55. COMPLETE REQUEST → RESPONSE EXAMPLE
 * ============================================================
 */

app.post("/api/users/:id", (req, res) => {
  /*
   * 1. Route parameter
   */

  const { id } = req.params;

  /*
   * 2. Query parameter
   */

  const { notify } = req.query;

  /*
   * 3. Request body
   */

  const { name, email } = req.body;

  /*
   * 4. Request header
   */

  const authorization = req.get("Authorization");

  /*
   * 5. Example response
   */

  res.status(200).json({
    data: {
      id,
      name,
      email,
    },

    meta: {
      notify,
      authenticated: Boolean(authorization),
    },
  });
});

/*
 * ============================================================
 * 56. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *              HTTP REQUEST
 *                    │
 *                    ↓
 *             ┌─────────────┐
 *             │    req      │
 *             ├─────────────┤
 *             │ method      │
 *             │ params      │
 *             │ query       │
 *             │ body        │
 *             │ headers     │
 *             │ cookies     │
 *             └──────┬──────┘
 *                    │
 *                    ↓
 *              CONTROLLER
 *                    │
 *                    ↓
 *             ┌─────────────┐
 *             │    res      │
 *             ├─────────────┤
 *             │ status      │
 *             │ headers     │
 *             │ cookies     │
 *             │ body        │
 *             └──────┬──────┘
 *                    │
 *                    ↓
 *              HTTP RESPONSE
 *                    │
 *                    ↓
 *                 CLIENT
 *
 * ============================================================
 *
 * CORE IDEA:
 *
 *     req = what the client sent
 *
 *     res = what the server sends back
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/static_files.js
 *
 * ============================================================
 */
