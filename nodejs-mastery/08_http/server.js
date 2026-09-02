/**
 * ============================================================
 * Node.js HTTP - Server
 * ============================================================
 *
 * File:
 *
 *     08_http/server.js
 *
 * Built-in module:
 *
 *     node:http
 *
 * ============================================================
 *
 * Node.js can create an HTTP server without Express,
 * Fastify, NestJS, or any other framework.
 *
 *
 * The basic flow is:
 *
 *
 *     Client
 *       │
 *       │ HTTP Request
 *       ↓
 *     Node.js HTTP Server
 *       │
 *       ├── request
 *       ├── response
 *       └── routing
 *       │
 *       ↓
 *     Client
 *
 * ============================================================
 *
 * We will learn:
 *
 *     1. node:http
 *     2. createServer()
 *     3. request
 *     4. response
 *     5. URL
 *     6. HTTP methods
 *     7. status codes
 *     8. headers
 *     9. response body
 *    10. server.listen()
 *    11. request lifecycle
 *    12. graceful shutdown
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import the HTTP module
 * ============================================================
 */

const http = require("node:http");

/*
 * ============================================================
 * 2. Create an HTTP server
 * ============================================================
 *
 * createServer() accepts a request listener.
 *
 *
 *     http.createServer(
 *       requestListener
 *     );
 *
 *
 * The listener receives:
 *
 *
 *     request
 *     response
 *
 * ============================================================
 */

const server = http.createServer((request, response) => {
  /*
   * This function runs whenever the server receives an
   * HTTP request.
   */

  console.log("\nIncoming request");
});

/*
 * ============================================================
 * 3. Start the server
 * ============================================================
 *
 * listen() starts accepting network connections.
 *
 * ============================================================
 */

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/*
 * ============================================================
 * 4. Request object
 * ============================================================
 *
 * The first argument is:
 *
 *
 *     request
 *
 *
 * It contains information about the incoming HTTP request.
 *
 *
 * Important properties:
 *
 *
 *     request.method
 *     request.url
 *     request.headers
 *     request.httpVersion
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. HTTP method
 * ============================================================
 *
 * Examples:
 *
 *
 *     GET
 *     POST
 *     PUT
 *     PATCH
 *     DELETE
 *
 * ============================================================
 */

const methodExample = http.createServer((request, response) => {
  console.log("Method:", request.method);

  /*
   * Send a response.
   */

  response.end("Request received.");
});

/*
 * NOTE:
 *
 * Do NOT call methodExample.listen() here because the main
 * server above is already running on port 3000.
 *
 * This object is only included to demonstrate the API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. URL
 * ============================================================
 *
 * request.url contains the path requested by the client.
 *
 *
 * Example:
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
 * 7. Inspect request URL
 * ============================================================
 *
 * Update the main server logic by understanding:
 *
 *
 *     request.url
 *
 *
 * In a real application we normally parse it using URL.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Response object
 * ============================================================
 *
 * The second argument is:
 *
 *
 *     response
 *
 *
 * It is used to send data back to the client.
 *
 *
 * Important methods:
 *
 *
 *     response.writeHead()
 *     response.setHeader()
 *     response.write()
 *     response.end()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. response.end()
 * ============================================================
 *
 * Every request should eventually receive a response.
 *
 *
 * The simplest response:
 *
 *
 *     response.end(
 *       "Hello"
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. A complete minimal server
 * ============================================================
 *
 * The most important example in this file:
 *
 * ============================================================
 */

const simpleServer = http.createServer((request, response) => {
  response.end("Hello from Node.js HTTP server!");
});

/*
 * We don't start simpleServer because server on port 3000 is
 * already running.
 *
 *
 * To run this server independently, use:
 *
 *
 *     simpleServer.listen(3000);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Status code
 * ============================================================
 *
 * HTTP responses contain a status code.
 *
 *
 * Common codes:
 *
 *
 *     200 -> OK
 *     201 -> Created
 *     204 -> No Content
 *     400 -> Bad Request
 *     401 -> Unauthorized
 *     403 -> Forbidden
 *     404 -> Not Found
 *     409 -> Conflict
 *     500 -> Internal Server Error
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Set statusCode
 * ============================================================
 */

const statusServer = http.createServer((request, response) => {
  response.statusCode = 200;

  response.end("Success");
});

/*
 * ============================================================
 * 13. writeHead()
 * ============================================================
 *
 * writeHead() can set the status code and response headers.
 *
 *
 * Example:
 *
 *
 *     response.writeHead(
 *       200,
 *       {
 *         "Content-Type": "text/plain"
 *       }
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Response headers
 * ============================================================
 *
 * Headers contain metadata about the response.
 *
 *
 * Common headers:
 *
 *
 *     Content-Type
 *     Content-Length
 *     Cache-Control
 *     Location
 *     Set-Cookie
 *
 * ============================================================
 */

const headerServer = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  response.end("Hello with headers!");
});

/*
 * ============================================================
 * 15. setHeader()
 * ============================================================
 *
 * Another way to set headers:
 * ============================================================
 */

const jsonServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.statusCode = 200;

  response.end(
    JSON.stringify({
      message: "Hello JSON",
    }),
  );
});

/*
 * ============================================================
 * 16. JSON response
 * ============================================================
 *
 * APIs normally return JSON.
 *
 *
 * JavaScript object:
 *
 *
 *     {
 *       message: "Hello"
 *     }
 *
 *
 * must be converted to a string:
 *
 *
 *     JSON.stringify(...)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. URL parsing
 * ============================================================
 *
 * Node.js provides the WHATWG URL API.
 *
 *
 * Example:
 *
 *
 *     /users?page=2&limit=10
 *
 * ============================================================
 */

const urlServer = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  console.log("\nPath:", url.pathname);

  console.log("Search params:", url.searchParams);

  console.log("Page:", url.searchParams.get("page"));

  response.end("URL parsed.");
});

/*
 * ============================================================
 * 18. IMPORTANT
 * ============================================================
 *
 * request.url can be undefined according to the Node.js type
 * definition.
 *
 * In production TypeScript applications, validate or safely
 * handle request.url before passing it to URL().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. HTTP routing
 * ============================================================
 *
 * Without Express, we can manually route requests.
 *
 *
 * Example:
 *
 *
 *     GET /
 *     GET /users
 *     GET /about
 *
 * ============================================================
 */

const routeServer = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  /*
   * GET /
   */

  if (request.method === "GET" && url.pathname === "/") {
    response.statusCode = 200;

    response.end("Home page");

    return;
  }

  /*
   * GET /users
   */

  if (request.method === "GET" && url.pathname === "/users") {
    response.statusCode = 200;

    response.end("Users page");

    return;
  }

  /*
   * Unknown route
   */

  response.statusCode = 404;

  response.end("Route not found");
});

/*
 * ============================================================
 * 20. HTTP method + path
 * ============================================================
 *
 * A route is commonly identified by:
 *
 *
 *     METHOD + PATH
 *
 *
 * Examples:
 *
 *
 *     GET    /users
 *     POST   /users
 *     GET    /users/10
 *     PATCH  /users/10
 *     DELETE /users/10
 *
 *
 * These are different endpoints.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Request headers
 * ============================================================
 *
 * Client request headers are available through:
 *
 *
 *     request.headers
 *
 * ============================================================
 */

const requestHeaderServer = http.createServer((request, response) => {
  console.log("\nRequest headers:", request.headers);

  console.log("User-Agent:", request.headers["user-agent"]);

  console.log("Accept:", request.headers["accept"]);

  response.end("Headers received.");
});

/*
 * ============================================================
 * 22. Host
 * ============================================================
 */

const hostServer = http.createServer((request, response) => {
  console.log("Host:", request.headers.host);

  response.end("Host received.");
});

/*
 * ============================================================
 * 23. HTTP request lifecycle
 * ============================================================
 *
 *
 * Client
 *   │
 *   │
 *   │ HTTP request
 *   ↓
 * Node HTTP Server
 *   │
 *   ↓
 * request listener
 *   │
 *   ├── method
 *   ├── URL
 *   ├── headers
 *   └── body
 *   │
 *   ↓
 * application logic
 *   │
 *   ↓
 * response
 *   │
 *   ├── status code
 *   ├── headers
 *   └── body
 *   │
 *   ↓
 * Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. response.write()
 * ============================================================
 *
 * You can send response data in multiple chunks.
 *
 * ============================================================
 */

const streamingResponseServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain");

  response.write("First chunk\n");

  response.write("Second chunk\n");

  response.write("Third chunk\n");

  response.end("Final chunk\n");
});

/*
 * ============================================================
 * 25. response.write() vs response.end()
 * ============================================================
 *
 *
 * write()
 *
 *     Sends a chunk.
 *
 *
 * end()
 *
 *     Finishes the response.
 *
 *
 * Example:
 *
 *
 *     response.write("A");
 *     response.write("B");
 *     response.end("C");
 *
 *
 * Client receives:
 *
 *
 *     ABC
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Content-Type
 * ============================================================
 *
 * Always send the appropriate Content-Type.
 *
 *
 * Plain text:
 *
 *
 *     text/plain
 *
 *
 * HTML:
 *
 *
 *     text/html
 *
 *
 * JSON:
 *
 *
 *     application/json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. HTML response
 * ============================================================
 */

const htmlServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");

  response.end(
    `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Node.js</title>
            </head>

            <body>
              <h1>Hello Node.js</h1>
              <p>Raw HTTP server.</p>
            </body>
          </html>
        `,
  );
});

/*
 * ============================================================
 * 28. JSON API response
 * ============================================================
 */

const apiServer = http.createServer((request, response) => {
  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  const data = {
    success: true,

    message: "API request successful",

    timestamp: new Date().toISOString(),
  };

  response.end(JSON.stringify(data));
});

/*
 * ============================================================
 * 29. 404 response
 * ============================================================
 */

const notFoundServer = http.createServer((request, response) => {
  response.statusCode = 404;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      success: false,

      message: "Resource not found",
    }),
  );
});

/*
 * ============================================================
 * 30. 500 response
 * ============================================================
 */

const errorServer = http.createServer((request, response) => {
  try {
    /*
     * Application logic.
     */

    throw new Error("Something failed.");
  } catch (error) {
    console.error(error);

    response.statusCode = 500;

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.end(
      JSON.stringify({
        success: false,

        message: "Internal Server Error",
      }),
    );
  }
});

/*
 * ============================================================
 * 31. Server events
 * ============================================================
 *
 * HTTP Server itself is an EventEmitter.
 *
 *
 * This means:
 *
 *
 *     server.on(...)
 *
 *
 * can be used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. "request" event
 * ============================================================
 *
 * createServer() internally uses the request event.
 *
 *
 * These two approaches are conceptually similar:
 *
 *
 *     http.createServer(
 *       handler
 *     );
 *
 *
 * and:
 *
 *
 *     const server =
 *       http.createServer();
 *
 *
 *     server.on(
 *       "request",
 *       handler
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Server error event
 * ============================================================
 */

server.on("error", (error) => {
  console.error("HTTP server error:", error);
});

/*
 * ============================================================
 * 34. Listening event
 * ============================================================
 */

server.on("listening", () => {
  const address = server.address();

  console.log("Server is listening:", address);
});

/*
 * ============================================================
 * 35. Connection event
 * ============================================================
 *
 * The HTTP server also exposes lower-level connection events.
 *
 * ============================================================
 */

server.on("connection", (socket) => {
  console.log("TCP connection established.");
});

/*
 * ============================================================
 * 36. Graceful shutdown
 * ============================================================
 *
 * Production applications should handle termination signals.
 *
 *
 * Example:
 *
 *
 *     Ctrl + C
 *
 *         ↓
 *
 *     SIGINT
 *
 *         ↓
 *
 *     server.close()
 *
 *
 * ============================================================
 */

process.on("SIGINT", () => {
  console.log("\nSIGINT received.");

  console.log("Shutting down HTTP server...");

  server.close(() => {
    console.log("HTTP server closed.");

    process.exit(0);
  });
});

/*
 * ============================================================
 * 37. SIGTERM
 * ============================================================
 *
 * SIGTERM is commonly used by:
 *
 *
 *     Docker
 *     Kubernetes
 *     process managers
 *     cloud platforms
 *
 *
 * to request graceful application shutdown.
 *
 * ============================================================
 */

process.on("SIGTERM", () => {
  console.log("SIGTERM received.");

  server.close(() => {
    console.log("HTTP server closed gracefully.");

    process.exit(0);
  });
});

/*
 * ============================================================
 * 38. IMPORTANT: Only one server is listening
 * ============================================================
 *
 * This file creates several server objects to demonstrate
 * different APIs.
 *
 * Only the first `server` actually listens on port 3000.
 *
 *
 * In a real application you normally have one HTTP server:
 *
 *
 *     const server =
 *       http.createServer(
 *         handler
 *       );
 *
 *
 *     server.listen(
 *       3000
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Complete practical server
 * ============================================================
 *
 * Here is the pattern you will use frequently before using a
 * framework such as Express or Fastify.
 *
 * ============================================================
 */

/*
 * Example architecture:
 *
 *
 *     Client
 *       │
 *       ↓
 *     HTTP Server
 *       │
 *       ↓
 *     Router
 *       │
 *       ↓
 *     Controller
 *       │
 *       ↓
 *     Service
 *       │
 *       ↓
 *     Database
 *
 *
 * We will build this architecture in later files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Request data you should know
 * ============================================================
 *
 *
 * request.method
 *
 *     HTTP method.
 *
 *
 * request.url
 *
 *     Requested URL.
 *
 *
 * request.headers
 *
 *     Request headers.
 *
 *
 * request.httpVersion
 *
 *     HTTP version.
 *
 *
 * request.socket
 *
 *     Underlying network socket.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Response data you should know
 * ============================================================
 *
 *
 * response.statusCode
 *
 *     HTTP status code.
 *
 *
 * response.setHeader()
 *
 *     Set one response header.
 *
 *
 * response.writeHead()
 *
 *     Set status and headers.
 *
 *
 * response.write()
 *
 *     Write response chunk.
 *
 *
 * response.end()
 *
 *     Finish response.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. HTTP server mental model
 * ============================================================
 *
 *
 *             HTTP REQUEST
 *                   │
 *                   ↓
 *       ┌─────────────────────┐
 *       │     Node HTTP       │
 *       │       Server        │
 *       └─────────────────────┘
 *                   │
 *                   ↓
 *              request
 *                   │
 *          ┌────────┼────────┐
 *          ↓        ↓        ↓
 *        method     URL    headers
 *                   │
 *                   ↓
 *               routing
 *                   │
 *                   ↓
 *             application
 *                logic
 *                   │
 *                   ↓
 *              response
 *                   │
 *          ┌────────┼────────┐
 *          ↓        ↓        ↓
 *       status    headers    body
 *          │        │        │
 *          └────────┼────────┘
 *                   ↓
 *             HTTP RESPONSE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const http =
 *       require("node:http");
 *
 *
 * Create server:
 *
 *     const server =
 *       http.createServer(
 *         (request, response) => {
 *
 *         }
 *       );
 *
 *
 * Start:
 *
 *     server.listen(
 *       3000
 *     );
 *
 *
 * Request method:
 *
 *     request.method
 *
 *
 * Request URL:
 *
 *     request.url
 *
 *
 * Request headers:
 *
 *     request.headers
 *
 *
 * Status:
 *
 *     response.statusCode = 200;
 *
 *
 * Header:
 *
 *     response.setHeader(
 *       "Content-Type",
 *       "application/json"
 *     );
 *
 *
 * Body:
 *
 *     response.write(
 *       "Hello"
 *     );
 *
 *
 * Finish:
 *
 *     response.end(
 *       "Done"
 *     );
 *
 *
 * JSON:
 *
 *     response.end(
 *       JSON.stringify(
 *         data
 *       )
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Node.js HTTP is built on streams and events.
 *
 *
 *     HTTP Request
 *          ↓
 *     request object
 *          ↓
 *     application logic
 *          ↓
 *     response object
 *          ↓
 *     HTTP Response
 *
 * ============================================================
 */
