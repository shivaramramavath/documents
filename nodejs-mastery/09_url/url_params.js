/**
 * ============================================================
 * Node.js URL - URL Parameters
 * ============================================================
 *
 * File:
 *     09_url/url_params.js
 *
 * URL parameters are dynamic values inside the pathname.
 *
 *
 * Example:
 *
 *     /users/123
 *
 *
 * Route pattern:
 *
 *     /users/:id
 *
 *
 * Parameter:
 *
 *     id = 123
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * Node.js's built-in URL class parses URLs, but it does NOT
 * provide Express-style automatic route parameters.
 *
 *
 * Express:
 *
 *     /users/:id
 *
 *     req.params.id
 *
 *
 * Raw Node.js:
 *
 *     You need to match/extract the parameter yourself.
 *
 * ============================================================
 */

const { URL } = require("node:url");

/*
 * ============================================================
 * 1. Basic pathname
 * ============================================================
 */

const url = new URL("https://example.com/users/123");

console.log("Path:", url.pathname);

/*
 * ============================================================
 * 2. Split pathname
 * ============================================================
 */

const parts = url.pathname.split("/");

console.log(parts);

/*
 * Result:
 *
 *     [
 *       "",
 *       "users",
 *       "123"
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Extract ID
 * ============================================================
 */

const userId = parts[2];

console.log("User ID:", userId);

/*
 * ============================================================
 * 4. Simple route parameter parser
 * ============================================================
 */

function getUserId(pathname) {
  const parts = pathname.split("/");

  if (parts.length === 3 && parts[1] === "users") {
    return parts[2];
  }

  return null;
}

console.log(getUserId("/users/123"));

/*
 * ============================================================
 * 5. Dynamic route:
 *
 *     /users/:id
 * ============================================================
 */

function matchUserRoute(pathname) {
  const parts = pathname.split("/");

  if (parts.length !== 3) {
    return null;
  }

  if (parts[1] !== "users") {
    return null;
  }

  if (!parts[2]) {
    return null;
  }

  return {
    id: decodeURIComponent(parts[2]),
  };
}

console.log(matchUserRoute("/users/123"));

/*
 * ============================================================
 * 6. Multiple parameters
 * ============================================================
 *
 * Route:
 *
 *     /users/:userId/posts/:postId
 *
 *
 * URL:
 *
 *     /users/10/posts/50
 *
 * ============================================================
 */

function matchPostRoute(pathname) {
  const parts = pathname.split("/");

  if (parts.length !== 5) {
    return null;
  }

  if (parts[1] !== "users" || parts[3] !== "posts") {
    return null;
  }

  return {
    userId: decodeURIComponent(parts[2]),

    postId: decodeURIComponent(parts[4]),
  };
}

console.log(matchPostRoute("/users/10/posts/50"));

/*
 * ============================================================
 * 7. Generic route matcher
 * ============================================================
 *
 * This allows:
 *
 *
 *     /users/:id
 *
 *
 * to match:
 *
 *
 *     /users/123
 *
 * ============================================================
 */

function matchRoute(pattern, pathname) {
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
     * Dynamic parameter.
     *
     * Example:
     *
     *     :id
     */

    if (patternPart.startsWith(":")) {
      const parameterName = patternPart.slice(1);

      if (!pathPart) {
        return null;
      }

      params[parameterName] = decodeURIComponent(pathPart);

      continue;
    }

    /*
     * Static route segment.
     */

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

/*
 * ============================================================
 * 8. Test generic matcher
 * ============================================================
 */

console.log(matchRoute("/users/:id", "/users/123"));

/*
 * Result:
 *
 *     {
 *       id: "123"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Multiple parameters
 * ============================================================
 */

console.log(matchRoute("/users/:userId/posts/:postId", "/users/10/posts/50"));

/*
 * Result:
 *
 *     {
 *       userId: "10",
 *       postId: "50"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Parameter with encoded characters
 * ============================================================
 */

console.log(matchRoute("/users/:name", "/users/Shiva%20Ram"));

/*
 * Result:
 *
 *     {
 *       name: "Shiva Ram"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. URL parameters + query parameters
 * ============================================================
 *
 * Example:
 *
 *
 *     /users/123?posts=true&page=2
 *
 *
 * Route parameter:
 *
 *     id = 123
 *
 *
 * Query parameters:
 *
 *     posts = true
 *     page  = 2
 *
 * ============================================================
 */

function parseRequestUrl(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");

  const params = matchRoute("/users/:id", url.pathname);

  if (params === null) {
    return null;
  }

  return {
    params,

    query: {
      posts: url.searchParams.get("posts"),

      page: url.searchParams.get("page"),
    },
  };
}

console.log(parseRequestUrl("/users/123?posts=true&page=2"));

/*
 * ============================================================
 * 12. Route parameter vs query parameter
 * ============================================================
 *
 *
 * URL:
 *
 *     /users/123?active=true
 *
 *
 * Route parameter:
 *
 *     /users/:id
 *
 *     id = 123
 *
 *
 * Query parameter:
 *
 *     active = true
 *
 *
 * Route parameters identify a resource.
 *
 *
 * Query parameters usually control filtering, sorting,
 * searching, pagination, etc.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Common API examples
 * ============================================================
 *
 *
 * GET /users/123
 *
 *     id = 123
 *
 *
 * GET /users/123/posts/50
 *
 *     userId = 123
 *     postId = 50
 *
 *
 * GET /products/10?includeReviews=true
 *
 *     productId = 10
 *     includeReviews = true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Route parameter validation
 * ============================================================
 *
 * Extracting a parameter does not mean it is valid.
 *
 * Example:
 *
 *     /users/abc
 *
 * If user IDs must be numbers, validate them.
 *
 * ============================================================
 */

function getNumericId(pathname) {
  const params = matchRoute("/users/:id", pathname);

  if (params === null) {
    return null;
  }

  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

console.log("Valid ID:", getNumericId("/users/123"));

console.log("Invalid ID:", getNumericId("/users/abc"));

/*
 * ============================================================
 * 15. Raw Node.js HTTP example
 * ============================================================
 */

const http = require("node:http");

const server = http.createServer((request, response) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const params = matchRoute("/users/:id", url.pathname);

  if (request.method === "GET" && params !== null) {
    response.statusCode = 200;

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.end(
      JSON.stringify({
        success: true,

        userId: params.id,
      }),
    );

    return;
  }

  response.statusCode = 404;

  response.end("Not Found");
});

server.listen(3007, () => {
  console.log("URL params server running at http://localhost:3007");
});

/*
 * ============================================================
 * 16. Test
 * ============================================================
 *
 * Browser:
 *
 *     http://localhost:3007/users/123
 *
 *
 * Expected:
 *
 *     {
 *       "success": true,
 *       "userId": "123"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Route matching architecture
 * ============================================================
 *
 *
 * HTTP Request
 *       │
 *       ↓
 *     URL
 *       │
 *       ↓
 *   pathname
 *       │
 *       ↓
 *  route matcher
 *       │
 *       ↓
 *   /users/:id
 *       │
 *       ↓
 *   { id: "123" }
 *       │
 *       ↓
 *   controller
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Parse:
 *
 *     const url = new URL(
 *       request.url,
 *       "http://localhost"
 *     );
 *
 *
 * Path:
 *
 *     url.pathname
 *
 *
 * Query:
 *
 *     url.searchParams
 *
 *
 * Manual parameter:
 *
 *     pathname.split("/")
 *
 *
 * Decode:
 *
 *     decodeURIComponent(value)
 *
 *
 * Route:
 *
 *     /users/:id
 *
 *
 * URL:
 *
 *     /users/123
 *
 *
 * Params:
 *
 *     {
 *       id: "123"
 *     }
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *
 * URL:
 *
 *     /users/123?active=true
 *       └──┬─┘ └──────┬─────┘
 *          │          │
 *       route       query
 *       param       param
 *
 *
 *     id = 123
 *     active = true
 *
 * ============================================================
 */
