/**
 * ============================================================
 * Node.js HTTP - Request
 * ============================================================
 *
 * File:
 *
 *     08_http/request.js
 *
 * Built-in module:
 *
 *     node:http
 *
 * ============================================================
 *
 * The `request` object represents the HTTP request sent by
 * the client.
 *
 *
 * Client
 *   │
 *   │ HTTP Request
 *   ↓
 * Node.js
 *   │
 *   ↓
 * request
 *
 *
 * The request object contains:
 *
 *     request.method
 *     request.url
 *     request.headers
 *     request.httpVersion
 *     request.socket
 *
 *
 * The request itself is also a READABLE STREAM.
 *
 * Therefore the request body arrives in chunks.
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. request object
 *     2. HTTP method
 *     3. URL
 *     4. URL parsing
 *     5. query parameters
 *     6. headers
 *     7. cookies
 *     8. content type
 *     9. content length
 *    10. request body
 *    11. request stream
 *    12. POST JSON
 *    13. form data
 *    14. client IP
 *    15. HTTP version
 *    16. abort/disconnect
 *    17. practical request logger
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
 * 2. Create server
 * ============================================================
 */

const server = http.createServer((request, response) => {
  /*
   * Every HTTP request reaches here.
   */

  console.log("\n==============================");

  console.log("New HTTP request");

  console.log("==============================");

  /*
   * Send response.
   */

  response.end("Request received.");
});

/*
 * ============================================================
 * 3. Start server
 * ============================================================
 */

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Request server running at http://localhost:${PORT}`);
});

/*
 * ============================================================
 * 4. request.method
 * ============================================================
 *
 * The HTTP method tells us what the client wants to do.
 *
 *
 * Common methods:
 *
 *
 *     GET
 *     POST
 *     PUT
 *     PATCH
 *     DELETE
 *     OPTIONS
 *     HEAD
 *
 * ============================================================
 */

const method = "GET";

/*
 * In the server:
 *
 *
 *     request.method
 *
 *
 * gives:
 *
 *
 *     "GET"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Inspect method
 * ============================================================
 */

const methodServer = http.createServer((request, response) => {
  console.log("HTTP Method:", request.method);

  response.end("Method received.");
});

/*
 * ============================================================
 * 6. request.url
 * ============================================================
 *
 * Example request:
 *
 *
 *     GET /users
 *
 *
 * request.url:
 *
 *
 *     /users
 *
 *
 * Example:
 *
 *
 *     GET /users?page=2
 *
 *
 * request.url:
 *
 *
 *     /users?page=2
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. URL parsing
 * ============================================================
 *
 * Do not manually split URLs when the WHATWG URL API can
 * handle them.
 *
 * ============================================================
 */

const urlServer = http.createServer((request, response) => {
  const host = request.headers.host || "localhost";

  const url = new URL(request.url || "/", `http://${host}`);

  console.log("Full URL:", url.href);

  console.log("Path:", url.pathname);

  response.end("URL parsed.");
});

/*
 * ============================================================
 * 8. pathname
 * ============================================================
 *
 * pathname contains the path without the query string.
 *
 *
 * Example:
 *
 *
 *     /users?page=2
 *
 *
 * pathname:
 *
 *
 *     /users
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Query parameters
 * ============================================================
 *
 * Example:
 *
 *
 *     /users?page=2&limit=20
 *
 *
 * Query parameters:
 *
 *
 *     page  = 2
 *     limit = 20
 *
 * ============================================================
 */

const queryServer = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://localhost");

  const page = url.searchParams.get("page");

  const limit = url.searchParams.get("limit");

  console.log("Page:", page);

  console.log("Limit:", limit);

  response.end("Query parameters received.");
});

/*
 * ============================================================
 * 10. searchParams
 * ============================================================
 *
 * Useful methods:
 *
 *
 *     get()
 *     getAll()
 *     has()
 *     set()
 *     append()
 *     delete()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Multiple query values
 * ============================================================
 *
 * Example:
 *
 *
 *     /products?tag=node&tag=javascript
 *
 * ============================================================
 */

const tags = new URL("/products?tag=node&tag=javascript", "http://localhost");

console.log("\nAll tags:", tags.searchParams.getAll("tag"));

/*
 * ============================================================
 * 12. request.headers
 * ============================================================
 *
 * HTTP headers provide metadata about the request.
 *
 *
 * Examples:
 *
 *
 *     host
 *     user-agent
 *     accept
 *     content-type
 *     content-length
 *     authorization
 *     cookie
 *
 * ============================================================
 */

const headerServer = http.createServer((request, response) => {
  console.log("\nRequest headers:", request.headers);

  response.end("Headers received.");
});

/*
 * ============================================================
 * 13. Reading a specific header
 * ============================================================
 */

const userAgentServer = http.createServer((request, response) => {
  const userAgent = request.headers["user-agent"];

  console.log("User-Agent:", userAgent);

  response.end("User-Agent received.");
});

/*
 * ============================================================
 * 14. Host header
 * ============================================================
 */

const hostHeaderServer = http.createServer((request, response) => {
  console.log("Host:", request.headers.host);

  response.end("Host received.");
});

/*
 * ============================================================
 * 15. Accept header
 * ============================================================
 */

const acceptServer = http.createServer((request, response) => {
  console.log("Accept:", request.headers.accept);

  response.end("Accept header received.");
});

/*
 * ============================================================
 * 16. Content-Type
 * ============================================================
 *
 * Content-Type tells the server what format the request body
 * uses.
 *
 *
 * Common values:
 *
 *
 *     application/json
 *
 *     application/x-www-form-urlencoded
 *
 *     multipart/form-data
 *
 *     text/plain
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Content-Length
 * ============================================================
 *
 * Indicates the size of the request body when supplied.
 *
 * ============================================================
 */

const bodyMetadataServer = http.createServer((request, response) => {
  console.log("Content-Type:", request.headers["content-type"]);

  console.log("Content-Length:", request.headers["content-length"]);

  response.end("Metadata received.");
});

/*
 * ============================================================
 * 18. Authorization header
 * ============================================================
 *
 * APIs commonly receive credentials through:
 *
 *
 *     Authorization
 *
 *
 * Example:
 *
 *
 *     Authorization: Bearer <token>
 *
 * ============================================================
 */

const authServer = http.createServer((request, response) => {
  const authorization = request.headers["authorization"];

  console.log("Authorization header exists:", Boolean(authorization));

  response.end("Authorization checked.");
});

/*
 * ============================================================
 * 19. NEVER log secrets
 * ============================================================
 *
 * Do not blindly log:
 *
 *
 *     authorization
 *     cookies
 *     passwords
 *     API keys
 *     access tokens
 *
 *
 * Example of what NOT to do:
 *
 *
 *     console.log(
 *       request.headers
 *     );
 *
 *
 * in production.
 *
 * Headers may contain credentials.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Cookies
 * ============================================================
 *
 * Cookies are available through:
 *
 *
 *     request.headers.cookie
 *
 *
 * Example:
 *
 *
 *     sessionId=abc123; theme=dark
 *
 * ============================================================
 */

const cookieServer = http.createServer((request, response) => {
  const cookie = request.headers.cookie;

  console.log("Cookie exists:", Boolean(cookie));

  response.end("Cookie received.");
});

/*
 * ============================================================
 * 21. Request body
 * ============================================================
 *
 * GET requests usually do not contain meaningful request
 * bodies.
 *
 *
 * POST, PUT, and PATCH commonly contain data.
 *
 *
 * Example:
 *
 *
 *     POST /users
 *
 *
 *     {
 *       "name": "Shiva",
 *       "email": "shiva@example.com"
 *     }
 *
 *
 * The body is received as a STREAM.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Request is a readable stream
 * ============================================================
 *
 * This is extremely important.
 *
 *
 * `request` is an IncomingMessage and implements a readable
 * stream.
 *
 *
 * Therefore:
 *
 *
 *     request.on("data", ...)
 *
 *     request.on("end", ...)
 *
 *
 * can be used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Reading raw request body
 * ============================================================
 */

const bodyServer = http.createServer((request, response) => {
  let body = "";

  /*
   * Data arrives in chunks.
   */

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  /*
   * `end` means the complete body has arrived.
   */

  request.on("end", () => {
    console.log("\nRaw request body:", body);

    response.end("Body received.");
  });
});

/*
 * ============================================================
 * 24. Why chunks?
 * ============================================================
 *
 *
 * Client
 *   │
 *   │
 *   │ body chunk 1
 *   ↓
 * request "data"
 *
 *   │
 *   │ body chunk 2
 *   ↓
 * request "data"
 *
 *   │
 *   │ body chunk 3
 *   ↓
 * request "data"
 *
 *   │
 *   ↓
 * request "end"
 *
 *
 * This is stream-based processing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. POST JSON body
 * ============================================================
 */

const jsonBodyServer = http.createServer((request, response) => {
  /*
   * Only process POST requests.
   */

  if (request.method !== "POST") {
    response.statusCode = 405;

    response.end("Method Not Allowed");

    return;
  }

  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", () => {
    try {
      const data = JSON.parse(body);

      console.log("\nParsed JSON:", data);

      response.statusCode = 200;

      response.setHeader("Content-Type", "application/json");

      response.end(
        JSON.stringify({
          success: true,

          received: data,
        }),
      );
    } catch (error) {
      console.error("Invalid JSON:", error.message);

      response.statusCode = 400;

      response.end("Invalid JSON.");
    }
  });
});

/*
 * ============================================================
 * 26. IMPORTANT JSON BODY RULE
 * ============================================================
 *
 * Never assume that request body is valid JSON.
 *
 *
 * Always:
 *
 *
 *     try {
 *
 *       JSON.parse(body);
 *
 *     } catch {
 *
 *       // 400 Bad Request
 *
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Request body size
 * ============================================================
 *
 * A production server should not blindly accumulate unlimited
 * request data into memory.
 *
 *
 * Bad:
 *
 *
 *     let body = "";
 *
 *     request.on(
 *       "data",
 *       chunk => body += chunk
 *     );
 *
 *
 * without any size limit.
 *
 *
 * An attacker could send a huge body.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Body size protection
 * ============================================================
 */

const MAX_BODY_SIZE = 1 * 1024 * 1024;

/*
 * 1 MB.
 */

/*
 * Example helper:
 */

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;

      /*
       * Stop accepting an oversized body.
       */

      if (size > MAX_BODY_SIZE) {
        reject(new Error("Request body too large."));

        request.destroy();

        return;
      }

      body += chunk.toString();
    });

    request.on("end", () => {
      resolve(body);
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

/*
 * ============================================================
 * 29. Using the body helper
 * ============================================================
 */

const safeBodyServer = http.createServer(async (request, response) => {
  try {
    const body = await readRequestBody(request);

    console.log("Body:", body);

    response.statusCode = 200;

    response.end("Body received safely.");
  } catch (error) {
    console.error(error.message);

    response.statusCode = 413;

    response.end("Request body too large.");
  }
});

/*
 * ============================================================
 * 30. HTTP form body
 * ============================================================
 *
 * For:
 *
 *
 *     application/x-www-form-urlencoded
 *
 *
 * Example:
 *
 *
 *     name=Shiva&age=21
 *
 *
 * Use URLSearchParams.
 *
 * ============================================================
 */

const formData = new URLSearchParams("name=Shiva&age=21");

console.log("\nForm name:", formData.get("name"));

console.log("Form age:", formData.get("age"));

/*
 * ============================================================
 * 31. Request HTTP version
 * ============================================================
 */

const versionServer = http.createServer((request, response) => {
  console.log("HTTP version:", request.httpVersion);

  response.end("HTTP version received.");
});

/*
 * ============================================================
 * 32. request.socket
 * ============================================================
 *
 * request.socket represents the underlying network socket.
 *
 *
 * Useful properties include:
 *
 *
 *     remoteAddress
 *     remotePort
 *
 * ============================================================
 */

const socketServer = http.createServer((request, response) => {
  console.log("Remote address:", request.socket.remoteAddress);

  console.log("Remote port:", request.socket.remotePort);

  response.end("Socket information received.");
});

/*
 * ============================================================
 * 33. Client IP
 * ============================================================
 *
 * `request.socket.remoteAddress` gives the peer address seen
 * by the Node.js process.
 *
 *
 * IMPORTANT:
 *
 * If your application is behind a reverse proxy, load balancer,
 * or CDN, the actual client IP may be represented by forwarded
 * headers.
 *
 *
 * Do not blindly trust headers such as:
 *
 *
 *     X-Forwarded-For
 *
 *
 * unless your proxy/trust configuration is controlled and
 * correctly configured.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Request aborted
 * ============================================================
 *
 * Clients can disconnect before sending the complete request.
 *
 * You may need to detect this for expensive operations.
 *
 * ============================================================
 */

const abortServer = http.createServer((request, response) => {
  request.on("aborted", () => {
    console.log("Request was aborted by the client.");
  });

  response.end("Request handled.");
});

/*
 * ============================================================
 * 35. close event
 * ============================================================
 *
 * The request can also expose lifecycle events such as
 * `close`.
 *
 * Be careful about interpreting `close` as "request completed";
 * completion should be determined using the appropriate
 * request/response lifecycle events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Complete request logger
 * ============================================================
 */

function logRequest(request) {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  console.log("\n========== HTTP REQUEST ==========");

  console.log("Method:", request.method);

  console.log("Path:", url.pathname);

  console.log("Query:", url.search);

  console.log("HTTP Version:", request.httpVersion);

  console.log("User-Agent:", request.headers["user-agent"]);

  console.log("Content-Type:", request.headers["content-type"]);

  console.log("==================================");
}

/*
 * ============================================================
 * 37. Logger server
 * ============================================================
 */

const loggerServer = http.createServer((request, response) => {
  logRequest(request);

  response.end("Request logged.");
});

/*
 * ============================================================
 * 38. Request classification
 * ============================================================
 *
 * A common backend pattern:
 *
 *
 *     method
 *       +
 *     pathname
 *       +
 *     headers
 *       +
 *     body
 *       +
 *     query
 *
 *
 * determine what the application should do.
 *
 *
 * Example:
 *
 *
 *     POST /users?page=1
 *
 *
 *     method:
 *       POST
 *
 *     pathname:
 *       /users
 *
 *     query:
 *       page=1
 *
 *     body:
 *       JSON
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Request object mental model
 * ============================================================
 *
 *
 *                    request
 *                       │
 *          ┌────────────┼─────────────┐
 *          ↓            ↓             ↓
 *       method         url         headers
 *          │            │             │
 *          │            ├── pathname  │
 *          │            └── query     │
 *          │                          │
 *          └────────────┬─────────────┘
 *                       ↓
 *                     body
 *                       │
 *                       ↓
 *                    stream
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Request processing pipeline
 * ============================================================
 *
 *
 * Client
 *   │
 *   ↓
 * HTTP Request
 *   │
 *   ↓
 * Node.js
 *   │
 *   ↓
 * request
 *   │
 *   ├── method
 *   │
 *   ├── URL
 *   │    ├── pathname
 *   │    └── query
 *   │
 *   ├── headers
 *   │
 *   ├── socket
 *   │
 *   └── body stream
 *          │
 *          ↓
 *       data chunks
 *          │
 *          ↓
 *          end
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Practical API request handler
 * ============================================================
 */

const practicalServer = http.createServer(async (request, response) => {
  try {
    const url = new URL(
      request.url || "/",
      `http://${request.headers.host || "localhost"}`,
    );

    /*
     * GET /users
     */

    if (request.method === "GET" && url.pathname === "/users") {
      response.statusCode = 200;

      response.setHeader("Content-Type", "application/json; charset=utf-8");

      response.end(
        JSON.stringify({
          users: [],
        }),
      );

      return;
    }

    /*
     * POST /users
     */

    if (request.method === "POST" && url.pathname === "/users") {
      const body = await readRequestBody(request);

      let data;

      try {
        data = JSON.parse(body);
      } catch {
        response.statusCode = 400;

        response.end("Invalid JSON.");

        return;
      }

      response.statusCode = 201;

      response.setHeader("Content-Type", "application/json; charset=utf-8");

      response.end(
        JSON.stringify({
          message: "User created",

          data,
        }),
      );

      return;
    }

    /*
     * Route does not exist.
     */

    response.statusCode = 404;

    response.end("Not Found");
  } catch (error) {
    console.error(error);

    response.statusCode = 500;

    response.end("Internal Server Error");
  }
});

/*
 * ============================================================
 * 42. IMPORTANT: Don't start every example server
 * ============================================================
 *
 * This file contains many examples.
 *
 * Only the main `server` above is listening on port 3001.
 *
 * The other server objects demonstrate APIs without opening
 * additional ports.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Common mistakes
 * ============================================================
 *
 *
 * MISTAKE 1
 *
 * Treating request body as immediately available.
 *
 *
 * WRONG:
 *
 *
 *     console.log(request.body);
 *
 *
 * Native Node.js HTTP does not automatically provide parsed
 * request.body.
 *
 *
 * You must read the stream.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 2
 *
 * Assuming every request is JSON.
 *
 *
 * Check:
 *
 *
 *     request.headers["content-type"]
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 3
 *
 * Ignoring body size limits.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 4
 *
 * Logging authorization headers or cookies.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 5
 *
 * Blindly trusting X-Forwarded-For.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * METHOD
 *
 *     request.method
 *
 *
 * URL
 *
 *     request.url
 *
 *
 * PARSE URL
 *
 *     const url = new URL(
 *       request.url,
 *       "http://localhost"
 *     );
 *
 *
 * PATH
 *
 *     url.pathname
 *
 *
 * QUERY
 *
 *     url.searchParams.get(
 *       "page"
 *     );
 *
 *
 * HEADERS
 *
 *     request.headers
 *
 *
 * SPECIFIC HEADER
 *
 *     request.headers[
 *       "content-type"
 *     ]
 *
 *
 * HTTP VERSION
 *
 *     request.httpVersion
 *
 *
 * CLIENT ADDRESS
 *
 *     request.socket.remoteAddress
 *
 *
 * BODY
 *
 *     request.on(
 *       "data",
 *       chunk => {}
 *     );
 *
 *
 *     request.on(
 *       "end",
 *       () => {}
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *
 *     request
 *        │
 *        ├── method
 *        ├── URL
 *        │    ├── pathname
 *        │    └── query
 *        ├── headers
 *        ├── socket
 *        └── body stream
 *
 *
 * The most important concept is:
 *
 *
 *     HTTP request body = STREAM
 *
 *
 * Node.js receives body data incrementally rather than
 * automatically giving you a parsed object.
 *
 * ============================================================
 */
