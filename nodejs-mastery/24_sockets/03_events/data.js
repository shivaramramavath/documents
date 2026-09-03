/**
 * ============================================================
 * 03_events/data.js
 * ============================================================
 *
 * SOCKET.IO EVENT DATA / PAYLOADS
 *
 * Topics:
 *
 * 01. String
 * 02. Number
 * 03. Boolean
 * 04. null
 * 05. Array
 * 06. Object
 * 07. Nested object
 * 08. Multiple arguments
 * 09. Array of objects
 * 10. Optional fields
 * 11. Null vs undefined
 * 12. Date
 * 13. JSON serialization
 * 14. Binary data
 * 15. Buffer
 * 16. Typed data
 * 17. Payload validation
 * 18. Payload size
 * 19. Event contracts
 * 20. Versioning
 * 21. Immutable payload design
 * 22. Good vs bad payloads
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * EXPRESS
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * HTTP SERVER
 * ============================================================
 */

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },

  /*
   * Maximum HTTP buffer size for Socket.IO/Engine.IO.
   *
   * Keep this appropriate for your application.
   */

  maxHttpBufferSize: 1e6,
});

/*
 * ============================================================
 * CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 01. STRING
   * ========================================================
   */

  socket.emit("data:string", "Hello Socket.IO");

  /*
   * ========================================================
   * 02. NUMBER
   * ========================================================
   */

  socket.emit("data:number", 100);

  /*
   * ========================================================
   * 03. BOOLEAN
   * ========================================================
   */

  socket.emit("data:boolean", true);

  /*
   * ========================================================
   * 04. NULL
   * ========================================================
   */

  socket.emit("data:null", null);

  /*
   * ========================================================
   * 05. ARRAY
   * ========================================================
   */

  socket.emit("data:array", ["Node.js", "Socket.IO", "Redis"]);

  /*
   * ========================================================
   * 06. OBJECT
   * ========================================================
   */

  socket.emit("data:object", {
    id: "user_123",

    name: "Shiva",

    active: true,
  });

  /*
   * ========================================================
   * 07. NESTED OBJECT
   * ========================================================
   */

  socket.emit("data:nested", {
    user: {
      id: "user_123",

      profile: {
        name: "Shiva",

        address: {
          city: "Hyderabad",

          country: "India",
        },
      },
    },
  });

  /*
   * ========================================================
   * 08. MULTIPLE ARGUMENTS
   * ========================================================
   *
   * Sender:
   *
   *     socket.emit(
   *       "user",
   *       "123",
   *       "Shiva",
   *       21
   *     );
   *
   * Receiver gets:
   *
   *     id
   *     name
   *     age
   *
   * ========================================================
   */

  socket.emit("data:multiple", "user_123", "Shiva", 21, true);

  /*
   * ========================================================
   * 09. ARRAY OF OBJECTS
   * ========================================================
   */

  socket.emit("data:users", [
    {
      id: "1",

      name: "Shiva",
    },

    {
      id: "2",

      name: "Ram",
    },
  ]);

  /*
   * ========================================================
   * 10. OPTIONAL FIELDS
   * ========================================================
   */

  socket.emit("data:optional", {
    id: "123",

    name: "Shiva",

    /*
     * Optional field.
     */

    avatar: null,
  });

  /*
   * ========================================================
   * 11. NULL VS UNDEFINED
   * ========================================================
   */

  socket.emit("data:null-value", {
    value: null,
  });

  /*
   * `undefined` should not be used as an explicit
   * wire-level value.
   *
   * Prefer:
   *
   *     null
   *
   * or omit the property entirely.
   */

  socket.emit("data:optional-field", {
    id: "123",

    /*
     * avatar omitted
     */
  });

  /*
   * ========================================================
   * 12. DATE
   * ========================================================
   *
   * Dates should generally be sent in a well-defined
   * string representation.
   * ========================================================
   */

  socket.emit("data:date", {
    createdAt: new Date().toISOString(),
  });

  /*
   * ========================================================
   * 13. JSON-LIKE DATA
   * ========================================================
   */

  socket.emit("data:json", {
    message: "Hello",

    metadata: {
      source: "server",

      version: 1,
    },

    items: [1, 2, 3],
  });

  /*
   * ========================================================
   * 14. BINARY DATA
   * ========================================================
   *
   * Socket.IO supports binary data.
   * ========================================================
   */

  const binaryData = Buffer.from("Hello Socket.IO");

  socket.emit("data:binary", binaryData);

  /*
   * ========================================================
   * 15. BUFFER INSIDE OBJECT
   * ========================================================
   */

  socket.emit("data:file", {
    fileName: "hello.txt",

    mimeType: "text/plain",

    data: Buffer.from("Hello from Socket.IO"),
  });

  /*
   * ========================================================
   * 16. LISTEN FOR STRING
   * ========================================================
   */

  socket.on("message:string", (message) => {
    if (typeof message !== "string") {
      return;
    }

    console.log("String:", message);
  });

  /*
   * ========================================================
   * 17. LISTEN FOR NUMBER
   * ========================================================
   */

  socket.on("message:number", (value) => {
    if (typeof value !== "number") {
      return;
    }

    console.log("Number:", value);
  });

  /*
   * ========================================================
   * 18. LISTEN FOR BOOLEAN
   * ========================================================
   */

  socket.on("message:boolean", (value) => {
    if (typeof value !== "boolean") {
      return;
    }

    console.log("Boolean:", value);
  });

  /*
   * ========================================================
   * 19. LISTEN FOR OBJECT
   * ========================================================
   */

  socket.on("user:update", (payload) => {
    if (!isPlainObject(payload)) {
      console.error("Invalid object payload");

      return;
    }

    console.log("User ID:", payload.id);

    console.log("Name:", payload.name);
  });

  /*
   * ========================================================
   * 20. MULTIPLE ARGUMENT LISTENER
   * ========================================================
   */

  socket.on("user:multiple", (id, name, age, active) => {
    console.log({
      id,
      name,
      age,
      active,
    });
  });

  /*
   * ========================================================
   * 21. REST PARAMETERS
   * ========================================================
   */

  socket.on("values", (...values) => {
    console.log("Received values:", values);
  });

  /*
   * ========================================================
   * 22. ARRAY OF OBJECTS
   * ========================================================
   */

  socket.on("users:update", (users) => {
    if (!Array.isArray(users)) {
      console.error("users must be an array");

      return;
    }

    for (const user of users) {
      console.log(user.id, user.name);
    }
  });

  /*
   * ========================================================
   * 23. BINARY DATA
   * ========================================================
   */

  socket.on("file:upload", (payload) => {
    if (!payload) {
      return;
    }

    console.log("Received file payload");

    console.log("File name:", payload.fileName);

    console.log("MIME:", payload.mimeType);

    console.log("Data:", payload.data);
  });

  /*
   * ========================================================
   * 24. PAYLOAD SIZE CHECK
   * ========================================================
   */

  socket.on("large:data", (payload) => {
    const serialized = JSON.stringify(payload);

    const bytes = Buffer.byteLength(serialized, "utf8");

    console.log("Payload bytes:", bytes);
  });

  /*
   * ========================================================
   * 25. EVENT CONTRACT
   * ========================================================
   */

  socket.on("message:create", (payload, acknowledge) => {
    /*
     * Expected contract:
     *
     * {
     *   conversationId: string,
     *   text: string,
     *   clientMessageId: string
     * }
     */

    const validation = validateMessagePayload(payload);

    if (!validation.success) {
      acknowledge?.({
        success: false,

        error: {
          code: "VALIDATION_ERROR",

          message: validation.message,
        },
      });

      return;
    }

    acknowledge?.({
      success: true,

      data: {
        received: payload,
      },
    });
  });

  /*
   * ========================================================
   * 26. DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * PLAIN OBJECT CHECK
 * ============================================================
 */

function isPlainObject(value) {
  if (value === null) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
}

/*
 * ============================================================
 * MESSAGE PAYLOAD VALIDATION
 * ============================================================
 */

function validateMessagePayload(payload) {
  if (!isPlainObject(payload)) {
    return {
      success: false,

      message: "Payload must be an object",
    };
  }

  if (typeof payload.conversationId !== "string") {
    return {
      success: false,

      message: "conversationId must be a string",
    };
  }

  if (payload.conversationId.length === 0) {
    return {
      success: false,

      message: "conversationId is required",
    };
  }

  if (typeof payload.text !== "string") {
    return {
      success: false,

      message: "text must be a string",
    };
  }

  if (payload.text.length === 0) {
    return {
      success: false,

      message: "text is required",
    };
  }

  if (payload.text.length > 5_000) {
    return {
      success: false,

      message: "text is too long",
    };
  }

  if (typeof payload.clientMessageId !== "string") {
    return {
      success: false,

      message: "clientMessageId must be a string",
    };
  }

  return {
    success: true,
  };
}

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
