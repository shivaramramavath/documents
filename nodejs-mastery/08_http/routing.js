/**
 * ============================================================
 * Node.js HTTP - Routing
 * ============================================================
 *
 * File:
 *
 *     08_http/routing.js
 *
 * Built-in module:
 *
 *     node:http
 *
 * ============================================================
 *
 * Routing means deciding which code should handle an incoming
 * HTTP request.
 *
 *
 * Request:
 *
 *     GET /users
 *
 *
 * Router checks:
 *
 *     1. HTTP method
 *     2. URL pathname
 *
 *
 * Then selects a handler.
 *
 *
 * Example:
 *
 *
 *     GET /users
 *          ↓
 *     getUsers()
 *
 *
 *     GET /users/123
 *          ↓
 *     getUserById()
 *
 *
 *     POST /users
 *          ↓
 *     createUser()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import HTTP
 * ============================================================
 */

const http = require("node:http");

/*
 * ============================================================
 * 2. Basic routing
 * ============================================================
 */

const server = http.createServer((request, response) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const method = request.method;

  const pathname = url.pathname;

  /*
   * Route:
   *
   * GET /
   */

  if (method === "GET" && pathname === "/") {
    response.statusCode = 200;

    response.end("Home page");

    return;
  }

  /*
   * Route:
   *
   * GET /users
   */

  if (method === "GET" && pathname === "/users") {
    response.statusCode = 200;

    response.end("Users page");

    return;
  }

  /*
   * Route not found.
   */

  response.statusCode = 404;

  response.end("Route not found");
});

/*
 * ============================================================
 * 3. Start server
 * ============================================================
 */

const PORT = 3003;

server.listen(PORT, () => {
  console.log(`Router running at http://localhost:${PORT}`);
});

/*
 * ============================================================
 * 4. Why use pathname?
 * ============================================================
 *
 * Suppose the client requests:
 *
 *
 *     /users?page=2
 *
 *
 * request.url:
 *
 *
 *     /users?page=2
 *
 *
 * But routing normally cares about:
 *
 *
 *     /users
 *
 *
 * Therefore:
 *
 *
 *     url.pathname
 *
 *
 * gives:
 *
 *
 *     /users
 *
 *
 * while:
 *
 *
 *     url.searchParams
 *
 *
 * handles:
 *
 *
 *     page=2
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Method + pathname
 * ============================================================
 *
 *
 * Route identity:
 *
 *
 *     HTTP method + pathname
 *
 *
 * Examples:
 *
 *
 *     GET    /users
 *     POST   /users
 *     DELETE /users
 *
 *
 * These are different routes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. GET /users
 * ============================================================
 */

function getUsers(request, response) {
  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      success: true,

      data: [
        {
          id: 1,
          name: "Shiva",
        },
        {
          id: 2,
          name: "Ram",
        },
      ],
    }),
  );
}

/*
 * ============================================================
 * 7. POST /users
 * ============================================================
 */

function createUser(request, response) {
  response.statusCode = 201;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      success: true,

      message: "User created",
    }),
  );
}

/*
 * ============================================================
 * 8. DELETE /users
 * ============================================================
 */

function deleteUsers(request, response) {
  response.statusCode = 200;

  response.end("Users deleted");
}

/*
 * ============================================================
 * 9. Method routing
 * ============================================================
 */

function handleUsersRoute(request, response) {
  if (request.method === "GET") {
    getUsers(request, response);

    return;
  }

  if (request.method === "POST") {
    createUser(request, response);

    return;
  }

  if (request.method === "DELETE") {
    deleteUsers(request, response);

    return;
  }

  /*
   * The path exists, but this HTTP method is not supported.
   */

  response.statusCode = 405;

  response.setHeader("Allow", "GET, POST, DELETE");

  response.end("Method Not Allowed");
}

/*
 * ============================================================
 * 10. 404 vs 405
 * ============================================================
 *
 *
 * 404 Not Found
 *
 *     The requested route/path does not exist.
 *
 *
 * 405 Method Not Allowed
 *
 *     The path exists, but the HTTP method is not supported.
 *
 *
 * Example:
 *
 *
 *     GET /users
 *
 * exists.
 *
 *
 *     PATCH /users
 *
 * may therefore return:
 *
 *
 *     405
 *
 * rather than 404.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Route parameters
 * ============================================================
 *
 * Real applications need dynamic routes.
 *
 *
 * Example:
 *
 *
 *     GET /users/123
 *
 *
 * Here:
 *
 *
 *     123
 *
 *
 * is a route parameter.
 *
 *
 * Usually represented as:
 *
 *
 *     /users/:id
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Simple route parameter
 * ============================================================
 */

function getUserById(request, response, userId) {
  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      success: true,

      userId,
    }),
  );
}

/*
 * ============================================================
 * 13. Extract ID manually
 * ============================================================
 */

function matchUserRoute(pathname) {
  const parts = pathname.split("/");

  /*
   * Example:
   *
   *     /users/123
   *
   *
   * split:
   *
   *     ["", "users", "123"]
   */

  if (parts.length === 3 && parts[1] === "users" && parts[2]) {
    return {
      matched: true,

      id: parts[2],
    };
  }

  return {
    matched: false,
  };
}

/*
 * ============================================================
 * 14. Use route parameter
 * ============================================================
 */

const parameterServer = http.createServer((request, response) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const match = matchUserRoute(url.pathname);

  if (request.method === "GET" && match.matched) {
    getUserById(request, response, match.id);

    return;
  }

  response.statusCode = 404;

  response.end("Not Found");
});

/*
 * ============================================================
 * 15. URL decoding
 * ============================================================
 *
 * URL parameters can contain encoded characters.
 *
 *
 * Example:
 *
 *
 *     /users/Shiva%20Ram
 *
 *
 * Use:
 *
 *
 *     decodeURIComponent()
 *
 * when manually extracting encoded path values.
 *
 * ============================================================
 */

const encodedId = "Shiva%20Ram";

console.log("\nDecoded:", decodeURIComponent(encodedId));

/*
 * ============================================================
 * 16. Better route matching
 * ============================================================
 *
 * Instead of writing many `if` statements, create a route
 * table.
 *
 * ============================================================
 */

const routes = [
  {
    method: "GET",

    path: "/",

    handler: (request, response) => {
      response.end("Home");
    },
  },

  {
    method: "GET",

    path: "/users",

    handler: getUsers,
  },

  {
    method: "POST",

    path: "/users",

    handler: createUser,
  },
];

/*
 * ============================================================
 * 17. Route lookup
 * ============================================================
 */

function findRoute(method, pathname) {
  return routes.find((route) => {
    return route.method === method && route.path === pathname;
  });
}

/*
 * ============================================================
 * 18. Router using route table
 * ============================================================
 */

function router(request, response) {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const route = findRoute(request.method, url.pathname);

  if (!route) {
    response.statusCode = 404;

    response.end("Route not found");

    return;
  }

  route.handler(request, response);
}

/*
 * ============================================================
 * 19. Route parameters with a pattern
 * ============================================================
 *
 * We can make route definitions more powerful.
 *
 *
 * Example:
 *
 *
 *     /users/:id
 *
 *
 * should match:
 *
 *
 *     /users/1
 *     /users/25
 *     /users/abc
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Convert route pattern to matcher
 * ============================================================
 */

function matchPath(pattern, pathname) {
  const patternParts = pattern.split("/");

  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];

    const pathPart = pathParts[index];

    /*
     * Dynamic parameter:
     *
     *     :id
     */

    if (patternPart.startsWith(":")) {
      const name = patternPart.slice(1);

      params[name] = decodeURIComponent(pathPart);

      continue;
    }

    /*
     * Static segment.
     */

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

/*
 * ============================================================
 * 21. Test matchPath()
 * ============================================================
 */

console.log("\nRoute params:", matchPath("/users/:id", "/users/123"));

/*
 * Result:
 *
 *
 *     {
 *       id: "123"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Multiple parameters
 * ============================================================
 *
 * Example:
 *
 *
 *     /users/:userId/posts/:postId
 *
 *
 * URL:
 *
 *
 *     /users/10/posts/50
 *
 *
 * Result:
 *
 *
 *     {
 *       userId: "10",
 *       postId: "50"
 *     }
 *
 * ============================================================
 */

console.log(
  "\nMultiple params:",
  matchPath("/users/:userId/posts/:postId", "/users/10/posts/50"),
);

/*
 * ============================================================
 * 23. Dynamic routes
 * ============================================================
 */

const dynamicRoutes = [
  {
    method: "GET",

    path: "/users",

    handler: getUsers,
  },

  {
    method: "GET",

    path: "/users/:id",

    handler: (request, response, params) => {
      response.setHeader("Content-Type", "application/json");

      response.end(
        JSON.stringify({
          success: true,

          userId: params.id,
        }),
      );
    },
  },
];

/*
 * ============================================================
 * 24. Dynamic route finder
 * ============================================================
 */

function findDynamicRoute(method, pathname) {
  for (const route of dynamicRoutes) {
    if (route.method !== method) {
      continue;
    }

    const params = matchPath(route.path, pathname);

    if (params !== null) {
      return {
        route,
        params,
      };
    }
  }

  return null;
}

/*
 * ============================================================
 * 25. Dynamic router
 * ============================================================
 */

function dynamicRouter(request, response) {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const result = findDynamicRoute(request.method, url.pathname);

  if (!result) {
    response.statusCode = 404;

    response.end("Route not found");

    return;
  }

  result.route.handler(request, response, result.params);
}

/*
 * ============================================================
 * 26. Query parameters + route parameters
 * ============================================================
 *
 * Example:
 *
 *
 *     GET /users/123?includePosts=true
 *
 *
 * Route parameter:
 *
 *
 *     id = 123
 *
 *
 * Query parameter:
 *
 *
 *     includePosts = true
 *
 *
 * They are different concepts.
 *
 * ============================================================
 */

const exampleUrl = new URL("/users/123?includePosts=true", "http://localhost");

console.log("\nPath:", exampleUrl.pathname);

console.log("Query:", exampleUrl.searchParams.get("includePosts"));

/*
 * ============================================================
 * 27. Router result
 * ============================================================
 *
 *
 * Request:
 *
 *     GET /users/123?active=true
 *
 *
 * Router:
 *
 *     method = GET
 *
 *     pathname = /users/123
 *
 *
 * Matcher:
 *
 *     /users/:id
 *
 *
 * Params:
 *
 *     {
 *       id: "123"
 *     }
 *
 *
 * Query:
 *
 *     active=true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Method detection
 * ============================================================
 *
 * For a path such as:
 *
 *
 *     /users/123
 *
 *
 * we should distinguish:
 *
 *
 *     GET
 *     PUT
 *     PATCH
 *     DELETE
 *
 *
 * Example route table:
 *
 *
 *     GET    /users/:id
 *     PUT    /users/:id
 *     PATCH  /users/:id
 *     DELETE /users/:id
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Proper 405 handling
 * ============================================================
 */

function findAllowedMethods(pathname) {
  return [
    ...new Set(
      dynamicRoutes
        .filter((route) => matchPath(route.path, pathname) !== null)
        .map((route) => route.method),
    ),
  ];
}

/*
 * ============================================================
 * 30. Router with 404 and 405
 * ============================================================
 */

function productionStyleRouter(request, response) {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const result = findDynamicRoute(request.method, url.pathname);

  /*
   * Matching route.
   */

  if (result) {
    result.route.handler(request, response, result.params);

    return;
  }

  /*
   * Path exists but method does not.
   */

  const allowedMethods = findAllowedMethods(url.pathname);

  if (allowedMethods.length > 0) {
    response.statusCode = 405;

    response.setHeader("Allow", allowedMethods.join(", "));

    response.end("Method Not Allowed");

    return;
  }

  /*
   * Path does not exist.
   */

  response.statusCode = 404;

  response.end("Not Found");
}

/*
 * ============================================================
 * 31. Final router server
 * ============================================================
 */

const routerServer = http.createServer((request, response) => {
  productionStyleRouter(request, response);
});

/*
 * ============================================================
 * 32. Start final router
 * ============================================================
 *
 * Uncomment this if you want to run the complete router.
 *
 * ============================================================
 */

// routerServer.listen(
//   3004,
//   () => {
//
//     console.log(
//       "Final router running at http://localhost:3004",
//     );
//
//   },
// );

/*
 * ============================================================
 * 33. Middleware concept
 * ============================================================
 *
 * Routing is usually not the only thing happening.
 *
 *
 * A backend often has:
 *
 *
 *     Request
 *        │
 *        ↓
 *     Logger
 *        │
 *        ↓
 *     Authentication
 *        │
 *        ↓
 *     Validation
 *        │
 *        ↓
 *     Router
 *        │
 *        ↓
 *     Controller
 *        │
 *        ↓
 *     Service
 *        │
 *        ↓
 *     Database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Router architecture
 * ============================================================
 *
 *
 *                    HTTP REQUEST
 *                         │
 *                         ↓
 *                    request.url
 *                         │
 *                         ↓
 *                    URL parser
 *                         │
 *             ┌───────────┴───────────┐
 *             ↓                       ↓
 *          pathname                query
 *             │
 *             ↓
 *        route matcher
 *             │
 *             ├── method
 *             │
 *             ├── static path
 *             │
 *             └── dynamic params
 *                     │
 *                     ↓
 *                  handler
 *                     │
 *                     ↓
 *                 response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Why frameworks exist
 * ============================================================
 *
 * Raw Node.js routing works, but large applications would
 * become difficult to maintain if every route was manually
 * implemented.
 *
 *
 * Frameworks and routers provide abstractions for:
 *
 *
 *     routing
 *     middleware
 *     validation
 *     body parsing
 *     error handling
 *     authentication
 *     response helpers
 *
 *
 * Understanding raw Node.js routing first makes frameworks
 * much easier to understand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Common mistakes
 * ============================================================
 *
 *
 * MISTAKE 1
 *
 * Comparing request.url directly:
 *
 *
 *     request.url === "/users"
 *
 *
 * This fails for:
 *
 *
 *     /users?page=2
 *
 *
 * Better:
 *
 *
 *     url.pathname === "/users"
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 2
 *
 * Ignoring HTTP method.
 *
 *
 * GET /users
 *
 * and:
 *
 * POST /users
 *
 * are different operations.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 3
 *
 * Returning 404 for every unsupported method.
 *
 *
 * Use 405 when the path exists but the method is unsupported.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 4
 *
 * Not decoding route parameters.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 5
 *
 * Putting all business logic directly inside the router.
 *
 *
 * Router:
 *
 *     decides WHERE.
 *
 *
 * Controller:
 *
 *     handles HTTP-level behavior.
 *
 *
 * Service:
 *
 *     handles business logic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Recommended backend structure
 * ============================================================
 *
 *
 * src/
 *
 *     server.js
 *
 *     routes/
 *         user.routes.js
 *         auth.routes.js
 *
 *     controllers/
 *         user.controller.js
 *         auth.controller.js
 *
 *     services/
 *         user.service.js
 *         auth.service.js
 *
 *     repositories/
 *         user.repository.js
 *
 *
 * Flow:
 *
 *
 *     Route
 *       ↓
 *     Controller
 *       ↓
 *     Service
 *       ↓
 *     Repository
 *       ↓
 *     Database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * URL:
 *
 *     const url = new URL(
 *       request.url,
 *       "http://localhost"
 *     );
 *
 *
 * PATH:
 *
 *     url.pathname
 *
 *
 * QUERY:
 *
 *     url.searchParams.get(
 *       "page"
 *     );
 *
 *
 * METHOD:
 *
 *     request.method
 *
 *
 * STATIC ROUTE:
 *
 *     GET /users
 *
 *
 * DYNAMIC ROUTE:
 *
 *     GET /users/:id
 *
 *
 * PARAMETER:
 *
 *     /users/123
 *
 *     {
 *       id: "123"
 *     }
 *
 *
 * SUCCESS:
 *
 *     200
 *
 *
 * CREATED:
 *
 *     201
 *
 *
 * NOT FOUND:
 *
 *     404
 *
 *
 * METHOD NOT ALLOWED:
 *
 *     405
 *
 *
 * ALLOWED METHODS:
 *
 *     response.setHeader(
 *       "Allow",
 *       "GET, POST"
 *     );
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *
 * ROUTING =
 *
 *     METHOD
 *       +
 *     PATH
 *       +
 *     PARAMETERS
 *       +
 *     HANDLER
 *
 * ============================================================
 */
