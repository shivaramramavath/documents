/**
 * ============================================================
 * Node.js HTTP - Headers
 * ============================================================
 *
 * File:
 *     08_http/header.js
 *
 * Headers are metadata sent with an HTTP request or response.
 *
 * Examples:
 *
 *     Content-Type
 *     Content-Length
 *     Authorization
 *     Cache-Control
 *     Set-Cookie
 *     Location
 *
 * ============================================================
 */

const http = require("node:http");

/*
 * ============================================================
 * 1. Set response header
 * ============================================================
 */

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  response.end("Hello with headers!");
});

/*
 * ============================================================
 * 2. Multiple headers
 * ============================================================
 */

const multipleHeaderServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  response.setHeader("Cache-Control", "no-cache");

  response.setHeader("X-Request-Id", "12345");

  response.end("Multiple headers.");
});

/*
 * ============================================================
 * 3. getHeader()
 * ============================================================
 */

const inspectServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  console.log(response.getHeader("Content-Type"));

  response.end(
    JSON.stringify({
      message: "Header inspected",
    }),
  );
});

/*
 * ============================================================
 * 4. getHeaders()
 * ============================================================
 *
 * Returns all currently configured outgoing headers.
 *
 * ============================================================
 */

const allHeadersServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  response.setHeader("Cache-Control", "no-store");

  console.log(response.getHeaders());

  response.end("Check server console.");
});

/*
 * ============================================================
 * 5. removeHeader()
 * ============================================================
 */

const removeServer = http.createServer((request, response) => {
  response.setHeader("X-Debug", "true");

  response.removeHeader("X-Debug");

  response.end("Header removed.");
});

/*
 * ============================================================
 * 6. writeHead()
 * ============================================================
 *
 * Sends status code and headers.
 *
 * ============================================================
 */

const writeHeadServer = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",

    "X-Server": "Node.js",
  });

  response.end("Headers sent using writeHead().");
});

/*
 * ============================================================
 * 7. Common HTTP headers
 * ============================================================
 *
 *
 * Content-Type
 *
 *     Describes the body format.
 *
 *
 * Content-Length
 *
 *     Body size in bytes.
 *
 *
 * Authorization
 *
 *     Authentication credentials/token.
 *
 *
 * Cache-Control
 *
 *     Controls caching.
 *
 *
 * Location
 *
 *     Used mainly for redirects.
 *
 *
 * Set-Cookie
 *
 *     Sends cookies to the browser.
 *
 *
 * Allow
 *
 *     Lists supported HTTP methods.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Content-Type
 * ============================================================
 */

const contentTypeServer = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      success: true,
    }),
  );
});

/*
 * ============================================================
 * 9. Redirect using Location
 * ============================================================
 */

const redirectServer = http.createServer((request, response) => {
  response.statusCode = 302;

  response.setHeader("Location", "/login");

  response.end();
});

/*
 * ============================================================
 * 10. Allow header
 * ============================================================
 */

const methodServer = http.createServer((request, response) => {
  response.statusCode = 405;

  response.setHeader("Allow", "GET, POST");

  response.end("Method Not Allowed");
});

/*
 * ============================================================
 * 11. Response headers must be set before the response is sent
 * ============================================================
 */

const lifecycleServer = http.createServer((request, response) => {
  response.setHeader("X-Before", "yes");

  response.write("Response started.");

  /*
   * Headers have now been sent.
   *
   * Changing headers after this point is invalid.
   */

  console.log("Headers sent:", response.headersSent);

  response.end();
});

/*
 * ============================================================
 * 12. Server
 * ============================================================
 *
 * Run this one.
 *
 * ============================================================
 */

server.listen(3005, () => {
  console.log("Header server running at http://localhost:3005");
});

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Set:
 *
 *     response.setHeader(
 *       "Content-Type",
 *       "application/json"
 *     );
 *
 *
 * Get:
 *
 *     response.getHeader(
 *       "Content-Type"
 *     );
 *
 *
 * Get all:
 *
 *     response.getHeaders();
 *
 *
 * Remove:
 *
 *     response.removeHeader(
 *       "X-Test"
 *     );
 *
 *
 * Status + headers:
 *
 *     response.writeHead(
 *       200,
 *       headers
 *     );
 *
 *
 * Check:
 *
 *     response.headersSent
 *
 * ============================================================
 */
