/**
 * ============================================================
 * HTTP STATUS CODES
 * ============================================================
 *
 * File:
 *     08_http/status_codes.js
 *
 * HTTP status codes communicate the result of an HTTP request.
 *
 * Format:
 *
 *     1xx -> Informational
 *     2xx -> Success
 *     3xx -> Redirection
 *     4xx -> Client error
 *     5xx -> Server error
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1xx INFORMATIONAL
 * ============================================================
 */

const INFORMATIONAL = {
  CONTINUE: 100,

  SWITCHING_PROTOCOLS: 101,

  PROCESSING: 102,

  EARLY_HINTS: 103,
};

/*
 * ============================================================
 * 2xx SUCCESS
 * ============================================================
 */

const SUCCESS = {
  OK: 200,

  CREATED: 201,

  ACCEPTED: 202,

  NON_AUTHORITATIVE_INFORMATION: 203,

  NO_CONTENT: 204,

  RESET_CONTENT: 205,

  PARTIAL_CONTENT: 206,
};

/*
 * ============================================================
 * 3xx REDIRECTION
 * ============================================================
 */

const REDIRECTION = {
  MULTIPLE_CHOICES: 300,

  MOVED_PERMANENTLY: 301,

  FOUND: 302,

  SEE_OTHER: 303,

  NOT_MODIFIED: 304,

  TEMPORARY_REDIRECT: 307,

  PERMANENT_REDIRECT: 308,
};

/*
 * ============================================================
 * 4xx CLIENT ERRORS
 * ============================================================
 */

const CLIENT_ERROR = {
  BAD_REQUEST: 400,

  UNAUTHORIZED: 401,

  FORBIDDEN: 403,

  NOT_FOUND: 404,

  METHOD_NOT_ALLOWED: 405,

  NOT_ACCEPTABLE: 406,

  CONFLICT: 409,

  GONE: 410,

  LENGTH_REQUIRED: 411,

  PRECONDITION_FAILED: 412,

  CONTENT_TOO_LARGE: 413,

  URI_TOO_LONG: 414,

  UNSUPPORTED_MEDIA_TYPE: 415,

  UNPROCESSABLE_CONTENT: 422,

  TOO_MANY_REQUESTS: 429,
};

/*
 * ============================================================
 * 5xx SERVER ERRORS
 * ============================================================
 */

const SERVER_ERROR = {
  INTERNAL_SERVER_ERROR: 500,

  NOT_IMPLEMENTED: 501,

  BAD_GATEWAY: 502,

  SERVICE_UNAVAILABLE: 503,

  GATEWAY_TIMEOUT: 504,
};

/*
 * ============================================================
 * 2xx explained
 * ============================================================
 *
 *
 * 200 OK
 *
 *     Request succeeded.
 *
 *
 * 201 Created
 *
 *     New resource was created.
 *
 *
 * 202 Accepted
 *
 *     Request accepted for processing, but processing may not
 *     be complete yet.
 *
 *
 * 204 No Content
 *
 *     Request succeeded with no response body.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3xx explained
 * ============================================================
 *
 *
 * 301 Moved Permanently
 *
 *     Resource permanently moved.
 *
 *
 * 302 Found
 *
 *     Temporary redirect.
 *
 *
 * 303 See Other
 *
 *     Redirect client to another resource, commonly after a
 *     successful non-GET operation.
 *
 *
 * 304 Not Modified
 *
 *     Client cache can use its existing representation.
 *
 *
 * 307 Temporary Redirect
 *
 *     Temporary redirect while preserving HTTP method.
 *
 *
 * 308 Permanent Redirect
 *
 *     Permanent redirect while preserving HTTP method.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4xx explained
 * ============================================================
 *
 *
 * 400 Bad Request
 *
 *     Request is malformed or invalid.
 *
 *
 * 401 Unauthorized
 *
 *     Authentication is required or invalid.
 *
 *
 * 403 Forbidden
 *
 *     Server understood the request but refuses it.
 *
 *
 * 404 Not Found
 *
 *     Requested resource does not exist.
 *
 *
 * 405 Method Not Allowed
 *
 *     Resource exists, but HTTP method is not supported.
 *
 *
 * 409 Conflict
 *
 *     Request conflicts with current resource state.
 *
 *
 * 415 Unsupported Media Type
 *
 *     Request body format is unsupported.
 *
 *
 * 422 Unprocessable Content
 *
 *     Request format is understood but semantic validation
 *     failed.
 *
 *
 * 429 Too Many Requests
 *
 *     Client has exceeded a rate limit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5xx explained
 * ============================================================
 *
 *
 * 500 Internal Server Error
 *
 *     Unexpected server-side failure.
 *
 *
 * 501 Not Implemented
 *
 *     Server does not support the requested functionality.
 *
 *
 * 502 Bad Gateway
 *
 *     Gateway/proxy received an invalid response upstream.
 *
 *
 * 503 Service Unavailable
 *
 *     Server is temporarily unable to handle the request.
 *
 *
 * 504 Gateway Timeout
 *
 *     Gateway/proxy timed out waiting for upstream service.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Using status codes
 * ============================================================
 */

function sendResponse(response, statusCode, message) {
  response.statusCode = statusCode;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(
    JSON.stringify({
      statusCode,
      message,
    }),
  );
}

/*
 * ============================================================
 * 3. Practical examples
 * ============================================================
 */

/*
 * Successful GET
 */

function getUser(response) {
  sendResponse(response, SUCCESS.OK, "User returned");
}

/*
 * Successful POST
 */

function createUser(response) {
  sendResponse(response, SUCCESS.CREATED, "User created");
}

/*
 * Invalid request
 */

function invalidRequest(response) {
  sendResponse(response, CLIENT_ERROR.BAD_REQUEST, "Invalid request");
}

/*
 * Authentication required
 */

function authenticationRequired(response) {
  sendResponse(response, CLIENT_ERROR.UNAUTHORIZED, "Authentication required");
}

/*
 * Permission denied
 */

function forbidden(response) {
  sendResponse(response, CLIENT_ERROR.FORBIDDEN, "Access denied");
}

/*
 * Resource doesn't exist
 */

function notFound(response) {
  sendResponse(response, CLIENT_ERROR.NOT_FOUND, "Resource not found");
}

/*
 * Server failure
 */

function internalError(response) {
  sendResponse(
    response,
    SERVER_ERROR.INTERNAL_SERVER_ERROR,
    "Internal server error",
  );
}

/*
 * ============================================================
 * 4. HTTP status code decision tree
 * ============================================================
 *
 *
 * Request
 *   │
 *   ↓
 * Is request valid?
 *   │
 *   ├── NO → 400
 *   │
 *   ↓ YES
 *
 * Authentication required?
 *   │
 *   ├── Missing/invalid → 401
 *   │
 *   ↓
 *
 * Permission?
 *   │
 *   ├── Denied → 403
 *   │
 *   ↓
 *
 * Resource exists?
 *   │
 *   ├── NO → 404
 *   │
 *   ↓ YES
 *
 * Method supported?
 *   │
 *   ├── NO → 405
 *   │
 *   ↓ YES
 *
 * Operation successful?
 *   │
 *   ├── Created → 201
 *   ├── Updated → 200 / 204
 *   ├── Deleted → 204
 *   └── Read → 200
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. REST API common mapping
 * ============================================================
 *
 *
 * GET /users
 *
 *     200
 *
 *
 * GET /users/123
 *
 *     200
 *
 *
 * GET /users/999
 *
 *     404
 *
 *
 * POST /users
 *
 *     201
 *
 *
 * PUT /users/123
 *
 *     200
 *     or
 *     204
 *
 *
 * DELETE /users/123
 *
 *     204
 *
 *
 * Invalid JSON
 *
 *     400
 *
 *
 * Missing authentication
 *
 *     401
 *
 *
 * Insufficient permissions
 *
 *     403
 *
 *
 * Unsupported HTTP method
 *
 *     405
 *
 *
 * Rate limit exceeded
 *
 *     429
 *
 *
 * Unexpected server error
 *
 *     500
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Export status groups
 * ============================================================
 *
 * CommonJS module export.
 * ============================================================
 */

module.exports = {
  INFORMATIONAL,

  SUCCESS,

  REDIRECTION,

  CLIENT_ERROR,

  SERVER_ERROR,
};

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * 200 -> OK
 * 201 -> Created
 * 202 -> Accepted
 * 204 -> No Content
 *
 * 301 -> Moved Permanently
 * 302 -> Found
 * 304 -> Not Modified
 * 307 -> Temporary Redirect
 * 308 -> Permanent Redirect
 *
 * 400 -> Bad Request
 * 401 -> Unauthorized
 * 403 -> Forbidden
 * 404 -> Not Found
 * 405 -> Method Not Allowed
 * 409 -> Conflict
 * 415 -> Unsupported Media Type
 * 422 -> Unprocessable Content
 * 429 -> Too Many Requests
 *
 * 500 -> Internal Server Error
 * 501 -> Not Implemented
 * 502 -> Bad Gateway
 * 503 -> Service Unavailable
 * 504 -> Gateway Timeout
 *
 * ============================================================
 */
