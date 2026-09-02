/**
 * ============================================================
 * Node.js HTTP - JSON
 * ============================================================
 *
 * File:
 *     08_http/json.js
 *
 * JSON = JavaScript Object Notation
 *
 * APIs commonly use JSON for request and response bodies.
 *
 * ============================================================
 */

const http = require("node:http");

/*
 * ============================================================
 * 1. JavaScript object
 * ============================================================
 */

const user = {
  id: 1,
  name: "Shiva",
  role: "student",
};

/*
 * ============================================================
 * 2. Object -> JSON
 * ============================================================
 *
 * JSON.stringify()
 *
 * ============================================================
 */

const jsonUser = JSON.stringify(user);

console.log("JSON:", jsonUser);

/*
 * ============================================================
 * 3. JSON -> Object
 * ============================================================
 *
 * JSON.parse()
 *
 * ============================================================
 */

const parsedUser = JSON.parse(jsonUser);

console.log("Object:", parsedUser);

/*
 * ============================================================
 * 4. JSON response
 * ============================================================
 */

const server = http.createServer((request, response) => {
  const data = {
    success: true,

    data: {
      id: 1,
      name: "Shiva",
    },
  };

  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(JSON.stringify(data));
});

server.listen(3006, () => {
  console.log("JSON server running at http://localhost:3006");
});

/*
 * ============================================================
 * 5. JSON response helper
 * ============================================================
 */

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  response.end(JSON.stringify(data));
}

/*
 * ============================================================
 * 6. Using helper
 * ============================================================
 */

function getUser(request, response) {
  sendJson(response, 200, {
    success: true,

    data: {
      id: 1,
      name: "Shiva",
    },
  });
}

/*
 * ============================================================
 * 7. Error JSON
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
 * ============================================================
 * 8. Different API status responses
 * ============================================================
 */

const apiServer = http.createServer((request, response) => {
  if (request.url === "/success") {
    sendJson(response, 200, {
      success: true,
      message: "Success",
    });

    return;
  }

  if (request.url === "/created") {
    sendJson(response, 201, {
      success: true,
      message: "Created",
    });

    return;
  }

  if (request.url === "/not-found") {
    sendError(response, 404, "Resource not found");

    return;
  }

  sendError(response, 404, "Route not found");
});

/*
 * ============================================================
 * 9. JSON request body
 * ============================================================
 *
 * HTTP request bodies arrive as streams.
 *
 * We collect chunks and then parse JSON.
 *
 * ============================================================
 */

const requestJsonServer = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/users") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      try {
        const data = JSON.parse(body);

        console.log("Received:", data);

        sendJson(response, 201, {
          success: true,

          received: data,
        });
      } catch (error) {
        sendError(response, 400, "Invalid JSON");
      }
    });

    return;
  }

  sendError(response, 404, "Route not found");
});

/*
 * ============================================================
 * 10. JSON request example
 * ============================================================
 *
 * Request:
 *
 *     POST /users
 *
 *     Content-Type: application/json
 *
 *     {
 *       "name": "Shiva",
 *       "age": 21
 *     }
 *
 *
 * Flow:
 *
 *
 * HTTP body
 *     ↓
 * chunks
 *     ↓
 * string
 *     ↓
 * JSON.parse()
 *     ↓
 * JavaScript object
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. JSON response flow
 * ============================================================
 *
 *
 * JavaScript object
 *     ↓
 * JSON.stringify()
 *     ↓
 * JSON string
 *     ↓
 * HTTP response body
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. JSON limitations
 * ============================================================
 *
 * JSON does not represent every JavaScript value directly.
 *
 * Common JSON values:
 *
 *     string
 *     number
 *     boolean
 *     null
 *     array
 *     object
 *
 *
 * Example:
 *
 *     {
 *       "name": "Shiva",
 *       "age": 21,
 *       "active": true,
 *       "skills": ["Node.js", "Python"],
 *       "address": null
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Object -> JSON:
 *
 *     JSON.stringify(object)
 *
 *
 * JSON -> Object:
 *
 *     JSON.parse(json)
 *
 *
 * Response:
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
 * Request:
 *
 *     request.on("data", ...)
 *     request.on("end", ...)
 *
 *
 * ============================================================
 */
