/**
 * ============================================================
 * Node.js HTTP - Response
 * ============================================================
 *
 * File:
 *
 *     08_http/response.js
 *
 * Built-in module:
 *
 *     node:http
 *
 * ============================================================
 *
 * The `response` object represents the HTTP response that
 * Node.js sends back to the client.
 *
 *
 * Client
 *   │
 *   │ HTTP Request
 *   ↓
 * Node.js Server
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
 *
 * Topics:
 *
 *     1. response object
 *     2. statusCode
 *     3. statusMessage
 *     4. setHeader()
 *     5. getHeader()
 *     6. removeHeader()
 *     7. writeHead()
 *     8. write()
 *     9. end()
 *    10. JSON responses
 *    11. HTML responses
 *    12. redirects
 *    13. cookies
 *    14. Content-Length
 *    15. streaming
 *    16. response lifecycle
 *    17. headersSent
 *    18. finished / writableEnded
 *    19. practical API response
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
  console.log("\nIncoming request:", request.method, request.url);

  /*
   * Send a basic response.
   */

  response.end("Hello from the response!");
});

/*
 * ============================================================
 * 3. Start server
 * ============================================================
 */

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`Response server running at http://localhost:${PORT}`);
});

/*
 * ============================================================
 * 4. response.statusCode
 * ============================================================
 *
 * The status code tells the client what happened.
 *
 *
 * Common status codes:
 *
 *
 * 2xx -> Success
 *
 *     200 OK
 *     201 Created
 *     202 Accepted
 *     204 No Content
 *
 *
 * 3xx -> Redirection
 *
 *     301 Moved Permanently
 *     302 Found
 *     304 Not Modified
 *
 *
 * 4xx -> Client error
 *
 *     400 Bad Request
 *     401 Unauthorized
 *     403 Forbidden
 *     404 Not Found
 *     405 Method Not Allowed
 *     409 Conflict
 *     422 Unprocessable Content
 *     429 Too Many Requests
 *
 *
 * 5xx -> Server error
 *
 *     500 Internal Server Error
 *     502 Bad Gateway
 *     503 Service Unavailable
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Set status code
 * ============================================================
 */

const statusServer = http.createServer((request, response) => {
  response.statusCode = 200;

  response.end("Everything is OK.");
});

/*
 * ============================================================
 * 6. 201 Created
 * ============================================================
 */

const createdServer = http.createServer((request, response) => {
  response.statusCode = 201;

  response.end("Resource created.");
});

/*
 * ============================================================
 * 7. 204 No Content
 * ============================================================
 *
 * A 204 response indicates success but contains no response
 * body.
 *
 * ============================================================
 */

const noContentServer = http.createServer((request, response) => {
  response.statusCode = 204;

  response.end();
});

/*
 * ============================================================
 * 8. 404 Not Found
 * ============================================================
 */

const notFoundServer = http.createServer((request, response) => {
  response.statusCode = 404;

  response.end("Resource not found.");
});

/*
 * ============================================================
 * 9. 500 Internal Server Error
 * ============================================================
 */

const errorServer = http.createServer((request, response) => {
  response.statusCode = 500;

  response.end("Internal Server Error.");
});

/*
 * ============================================================
 * 10. response.statusMessage
 * ============================================================
 *
 * Node.js normally supplies the standard reason phrase.
 *
 * You can technically change it:
 * ============================================================
 */

const statusMessageServer = http.createServer((request, response) => {
  response.statusCode = 200;

  response.statusMessage = "Everything Fine";

  response.end("Custom status message.");
});

/*
 * ============================================================
 * 11. Prefer standard status codes
 * ============================================================
 *
 * In APIs, clients generally care about the status code.
 *
 *
 * Prefer:
 *
 *
 *     200
 *     201
 *     204
 *     400
 *     401
 *     403
 *     404
 *     409
 *     422
 *     500
 *
 *
 * rather than relying on custom status messages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Response headers
 * ============================================================
 *
 * Headers contain metadata about the response.
 *
 * ============================================================
 */

const headerServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  response.setHeader("X-Powered-By", "Node.js");

  response.end("Response with headers.");
});

/*
 * ============================================================
 * 13. setHeader()
 * ============================================================
 *
 * Syntax:
 *
 *
 *     response.setHeader(
 *       name,
 *       value
 *     );
 *
 * ============================================================
 */

const customHeaderServer = http.createServer((request, response) => {
  response.setHeader("X-Request-Processed", "true");

  response.end("Custom header sent.");
});

/*
 * ============================================================
 * 14. Multiple values
 * ============================================================
 *
 * Some headers can contain multiple values.
 *
 * Example:
 *
 *
 *     Set-Cookie
 *
 * ============================================================
 */

const multiHeaderServer = http.createServer((request, response) => {
  response.setHeader("Set-Cookie", ["theme=dark", "language=en"]);

  response.end("Multiple headers.");
});

/*
 * ============================================================
 * 15. getHeader()
 * ============================================================
 *
 * Retrieve a header that has been set but not yet sent.
 * ============================================================
 */

const getHeaderServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  console.log("Content-Type:", response.getHeader("Content-Type"));

  response.end("Header inspected.");
});

/*
 * ============================================================
 * 16. removeHeader()
 * ============================================================
 */

const removeHeaderServer = http.createServer((request, response) => {
  response.setHeader("X-Debug", "true");

  response.removeHeader("X-Debug");

  response.end("Header removed.");
});

/*
 * ============================================================
 * 17. writeHead()
 * ============================================================
 *
 * writeHead() sends the status code and headers.
 *
 *
 * Example:
 *
 *
 *     response.writeHead(
 *       200,
 *       {
 *         "Content-Type":
 *           "text/plain"
 *       }
 *     );
 *
 * ============================================================
 */

const writeHeadServer = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",

    "X-Example": "true",
  });

  response.end("Response created with writeHead().");
});

/*
 * ============================================================
 * 18. setHeader() vs writeHead()
 * ============================================================
 *
 *
 * setHeader()
 *
 *     Sets an individual header.
 *
 *
 * writeHead()
 *
 *     Sends the status code and headers.
 *
 *
 * Common style:
 *
 *
 *     response.statusCode = 200;
 *
 *     response.setHeader(
 *       "Content-Type",
 *       "application/json"
 *     );
 *
 *     response.end(...);
 *
 *
 * This is usually easier to read.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. response.write()
 * ============================================================
 *
 * Sends a chunk of the response body.
 *
 * ============================================================
 */

const writeServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain");

  response.write("Chunk 1\n");

  response.write("Chunk 2\n");

  response.write("Chunk 3\n");

  response.end("Final chunk\n");
});

/*
 * ============================================================
 * 20. response.end()
 * ============================================================
 *
 * `end()` finishes the response.
 *
 *
 * You can optionally pass the final body chunk:
 *
 *
 *     response.end(
 *       "Done"
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Important:
 *
 * Don't call response.end() twice.
 * ============================================================
 *
 *
 * WRONG:
 *
 *
 *     response.end(
 *       "Hello"
 *     );
 *
 *
 *     response.end(
 *       "Again"
 *     );
 *
 *
 * The response has already finished.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. JSON response
 * ============================================================
 *
 * APIs commonly return JSON.
 *
 * ============================================================
 */

const jsonServer = http.createServer((request, response) => {
  const data = {
    success: true,

    message: "Request successful",

    data: {
      id: 1,

      name: "Shiva",
    },
  };

  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(JSON.stringify(data));
});

/*
 * ============================================================
 * 23. JSON helper
 * ============================================================
 *
 * In a real backend, repeated response logic should be
 * centralized.
 *
 * ============================================================
 */

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(JSON.stringify(data));
}

/*
 * ============================================================
 * 24. Using sendJson()
 * ============================================================
 */

const helperServer = http.createServer((request, response) => {
  sendJson(response, 200, {
    success: true,

    message: "Hello API",
  });
});

/*
 * ============================================================
 * 25. Error response helper
 * ============================================================
 */

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, {
    success: false,

    error: {
      message,
    },
  });
}

/*
 * Example:
 *
 *
 *     sendError(
 *       response,
 *       404,
 *       "User not found"
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. HTML response
 * ============================================================
 */

const htmlServer = http.createServer((request, response) => {
  response.statusCode = 200;

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

              <p>
                This HTML was sent using ServerResponse.
              </p>

            </body>

          </html>
        `,
  );
});

/*
 * ============================================================
 * 27. Plain text response
 * ============================================================
 */

const textServer = http.createServer((request, response) => {
  response.statusCode = 200;

  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  response.end("Plain text response.");
});

/*
 * ============================================================
 * 28. Redirect
 * ============================================================
 *
 * A redirect response normally contains:
 *
 *
 *     3xx status code
 *
 * and:
 *
 *
 *     Location header
 *
 * ============================================================
 */

const redirectServer = http.createServer((request, response) => {
  response.statusCode = 302;

  response.setHeader("Location", "/new-location");

  response.end();
});

/*
 * ============================================================
 * 29. Permanent redirect
 * ============================================================
 */

const permanentRedirectServer = http.createServer((request, response) => {
  response.statusCode = 301;

  response.setHeader("Location", "https://example.com");

  response.end();
});

/*
 * ============================================================
 * 30. Cookies
 * ============================================================
 *
 * Cookies are sent using:
 *
 *
 *     Set-Cookie
 *
 * ============================================================
 */

const cookieServer = http.createServer((request, response) => {
  response.setHeader("Set-Cookie", [
    "sessionId=abc123; HttpOnly; Path=/",
    "theme=dark; Path=/",
  ]);

  response.end("Cookies set.");
});

/*
 * ============================================================
 * 31. Secure cookie example
 * ============================================================
 *
 * For HTTPS production applications, security-sensitive
 * cookies commonly use:
 *
 *
 *     HttpOnly
 *     Secure
 *     SameSite
 *
 *
 * Example:
 *
 *
 *     sessionId=abc;
 *     HttpOnly;
 *     Secure;
 *     SameSite=Lax;
 *     Path=/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Content-Length
 * ============================================================
 *
 * You can explicitly provide the response body size.
 *
 * ============================================================
 */

const contentLengthServer = http.createServer((request, response) => {
  const body = "Hello Node.js";

  const length = Buffer.byteLength(body, "utf8");

  response.statusCode = 200;

  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  response.setHeader("Content-Length", length);

  response.end(body);
});

/*
 * ============================================================
 * 33. Why Buffer.byteLength()?
 * ============================================================
 *
 * JavaScript string length is not always the same as the number
 * of bytes transmitted.
 *
 *
 * Therefore:
 *
 *
 *     Buffer.byteLength(
 *       body,
 *       "utf8"
 *     )
 *
 *
 * is the appropriate calculation for byte length.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. headersSent
 * ============================================================
 *
 * Tells whether response headers have already been sent.
 * ============================================================
 */

const headerStateServer = http.createServer((request, response) => {
  console.log("Before response:", response.headersSent);

  response.setHeader("Content-Type", "text/plain");

  response.write("Hello");

  console.log("After write:", response.headersSent);

  response.end();
});

/*
 * ============================================================
 * 35. Important rule
 * ============================================================
 *
 * Once headers have been sent, you cannot freely modify them.
 *
 *
 * For example:
 *
 *
 *     response.write("Hello");
 *
 *
 *     response.setHeader(
 *       "X-Test",
 *       "true"
 *     );
 *
 *
 * is too late.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. writableEnded
 * ============================================================
 *
 * Indicates whether response.end() has been called.
 * ============================================================
 */

const writableStateServer = http.createServer((request, response) => {
  console.log("Before end:", response.writableEnded);

  response.end("Done");

  console.log("After end:", response.writableEnded);
});

/*
 * ============================================================
 * 37. finished
 * ============================================================
 *
 * `finished` is an older response lifecycle property.
 *
 * Modern code should generally prefer:
 *
 *
 *     writableEnded
 *
 *
 * or appropriate stream lifecycle events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Streaming response
 * ============================================================
 *
 * Since ServerResponse is writable-stream based, data can be
 * sent progressively.
 *
 * ============================================================
 */

const streamServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  let count = 0;

  const interval = setInterval(() => {
    count += 1;

    response.write(`Message ${count}\n`);

    if (count === 5) {
      clearInterval(interval);

      response.end("Stream complete.\n");
    }
  }, 1000);
});

/*
 * ============================================================
 * 39. Streaming mental model
 * ============================================================
 *
 *
 * Server
 *   │
 *   ├── write()
 *   ↓
 * Client
 *   │
 *   ├── write()
 *   ↓
 * Client
 *   │
 *   ├── write()
 *   ↓
 * Client
 *   │
 *   └── end()
 *
 *
 * The client can receive data progressively.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Response lifecycle
 * ============================================================
 *
 *
 * Create response
 *       │
 *       ↓
 * Set status
 *       │
 *       ↓
 * Set headers
 *       │
 *       ↓
 * write()
 *       │
 *       ↓
 * write()
 *       │
 *       ↓
 * end()
 *       │
 *       ↓
 * Response complete
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. finish event
 * ============================================================
 *
 * The response emits `finish` when the response has been handed
 * off to the underlying system for transmission.
 *
 * ============================================================
 */

const finishServer = http.createServer((request, response) => {
  response.on("finish", () => {
    console.log("Response finished.");
  });

  response.end("Done.");
});

/*
 * ============================================================
 * 42. close event
 * ============================================================
 *
 * `close` indicates the response/underlying connection closed.
 *
 * It can happen in situations where the connection closes
 * before the normal completion path.
 *
 * ============================================================
 */

const closeServer = http.createServer((request, response) => {
  response.on("close", () => {
    console.log("Response connection closed.");
  });

  response.end("Complete.");
});

/*
 * ============================================================
 * 43. Response helper architecture
 * ============================================================
 *
 * In a backend application, centralize response formatting.
 *
 *
 * Example:
 *
 *
 *     sendJson(
 *       response,
 *       200,
 *       {
 *         success: true,
 *         data: users
 *       }
 *     );
 *
 *
 *     sendError(
 *       response,
 *       404,
 *       "User not found"
 *     );
 *
 *
 * This keeps controllers cleaner.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Practical API response
 * ============================================================
 */

const practicalServer = http.createServer((request, response) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  /*
   * GET /users
   */

  if (request.method === "GET" && url.pathname === "/users") {
    sendJson(response, 200, {
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
    });

    return;
  }

  /*
   * GET /health
   */

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, {
      status: "ok",

      uptime: process.uptime(),
    });

    return;
  }

  /*
   * Unknown route.
   */

  sendError(response, 404, "Route not found.");
});

/*
 * ============================================================
 * 45. Preventing duplicate responses
 * ============================================================
 *
 * A common backend bug:
 *
 *
 *     if (something) {
 *
 *       sendJson(...);
 *
 *     }
 *
 *
 *     sendJson(...);
 *
 *
 * Both paths may attempt to respond.
 *
 *
 * Prefer:
 *
 *
 *     if (something) {
 *
 *       sendJson(...);
 *
 *       return;
 *
 *     }
 *
 *
 * Then the function cannot accidentally continue to another
 * response path.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Common response mistakes
 * ============================================================
 *
 *
 * MISTAKE 1
 *
 * Sending headers after the response has started.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 2
 *
 * Calling response.end() more than once.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 3
 *
 * Returning JSON without:
 *
 *
 *     Content-Type: application/json
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 4
 *
 * Sending sensitive information in error responses.
 *
 *
 * Don't expose:
 *
 *
 *     stack traces
 *     database credentials
 *     internal paths
 *     tokens
 *     secrets
 *
 *
 * to clients in production.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * MISTAKE 5
 *
 * Forgetting to end the response.
 *
 *
 * A request can remain pending if no response is completed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Response security basics
 * ============================================================
 *
 * Avoid unnecessary headers that reveal implementation
 * details.
 *
 *
 * Example:
 *
 *
 *     X-Powered-By: Node.js
 *
 *
 * is usually unnecessary.
 *
 *
 * For production applications, security headers are often
 * managed centrally or by a framework/proxy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Response object mental model
 * ============================================================
 *
 *
 *                  response
 *                     │
 *          ┌──────────┼──────────┐
 *          ↓          ↓          ↓
 *       status      headers     body
 *          │          │          │
 *          │          │       write()
 *          │          │          │
 *          │          │       write()
 *          │          │          │
 *          └──────────┼──────────┘
 *                     ↓
 *                    end()
 *                     │
 *                     ↓
 *             HTTP Response sent
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. Request → Response
 * ============================================================
 *
 *
 *                  CLIENT
 *                    │
 *                    ↓
 *              HTTP REQUEST
 *                    │
 *                    ↓
 *                 request
 *                    │
 *                    ↓
 *                ROUTING
 *                    │
 *                    ↓
 *              APPLICATION
 *                 LOGIC
 *                    │
 *                    ↓
 *                response
 *                    │
 *             ┌──────┼──────┐
 *             ↓      ↓      ↓
 *          status  headers  body
 *             │      │      │
 *             └──────┼──────┘
 *                    ↓
 *              HTTP RESPONSE
 *                    │
 *                    ↓
 *                  CLIENT
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * STATUS:
 *
 *     response.statusCode = 200;
 *
 *
 * HEADER:
 *
 *     response.setHeader(
 *       "Content-Type",
 *       "application/json"
 *     );
 *
 *
 * GET HEADER:
 *
 *     response.getHeader(
 *       "Content-Type"
 *     );
 *
 *
 * REMOVE HEADER:
 *
 *     response.removeHeader(
 *       "X-Test"
 *     );
 *
 *
 * STATUS + HEADERS:
 *
 *     response.writeHead(
 *       200,
 *       headers
 *     );
 *
 *
 * WRITE BODY:
 *
 *     response.write(
 *       "chunk"
 *     );
 *
 *
 * FINISH:
 *
 *     response.end(
 *       "final chunk"
 *     );
 *
 *
 * CHECK HEADERS:
 *
 *     response.headersSent
 *
 *
 * CHECK END:
 *
 *     response.writableEnded
 *
 *
 * JSON:
 *
 *     response.setHeader(
 *       "Content-Type",
 *       "application/json"
 *     );
 *
 *     response.end(
 *       JSON.stringify(data)
 *     );
 *
 *
 * REDIRECT:
 *
 *     response.statusCode = 302;
 *
 *     response.setHeader(
 *       "Location",
 *       "/new-path"
 *     );
 *
 *     response.end();
 *
 *
 * COOKIE:
 *
 *     response.setHeader(
 *       "Set-Cookie",
 *       "session=abc; HttpOnly; Path=/"
 *     );
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *
 *     response
 *        │
 *        ├── statusCode
 *        ├── headers
 *        ├── write()
 *        └── end()
 *
 *
 * HTTP response construction:
 *
 *
 *     STATUS
 *       +
 *     HEADERS
 *       +
 *     BODY
 *       =
 *     HTTP RESPONSE
 *
 * ============================================================
 */
