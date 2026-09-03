/**
 * ============================================================
 * 04_async/acknowledgements.js
 * ============================================================
 *
 * SOCKET.IO ACKNOWLEDGEMENTS
 *
 * Topics:
 *
 * 01. Basic acknowledgement
 * 02. ACK callback
 * 03. ACK response data
 * 04. Success response
 * 05. Error response
 * 06. Optional ACK
 * 07. Async ACK handler
 * 08. Validation with ACK
 * 09. Database with ACK
 * 10. Broadcast + ACK
 * 11. Server -> client ACK
 * 12. ACK timeout
 * 13. ACK timeout error
 * 14. Typed ACK pattern
 * 15. Multiple response values
 * 16. ACK exactly once
 * 17. Duplicate ACK prevention
 * 18. Error normalization
 * 19. Request/response pattern
 * 20. Production handler
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
});

/*
 * ============================================================
 * FAKE DATABASE
 * ============================================================
 */

const users = new Map();

/*
 * ============================================================
 * DATABASE: CREATE USER
 * ============================================================
 */

async function createUser(data) {
  await delay(200);

  const user = {
    id: `user_${Date.now()}`,

    name: data.name,

    createdAt: new Date().toISOString(),
  };

  users.set(user.id, user);

  return user;
}

/*
 * ============================================================
 * DATABASE: GET USER
 * ============================================================
 */

async function getUser(userId) {
  await delay(100);

  return users.get(userId) ?? null;
}

/*
 * ============================================================
 * DELAY
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
 * ============================================================
 * SOCKET CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  /*
   * ========================================================
   * 01. BASIC ACKNOWLEDGEMENT
   * ========================================================
   *
   * CLIENT:
   *
   * socket.emit(
   *   "hello",
   *   (response) => {
   *     console.log(response);
   *   }
   * );
   *
   * SERVER:
   *
   * socket.on(
   *   "hello",
   *   (acknowledge) => {
   *     acknowledge("Hello client");
   *   }
   * );
   *
   * ========================================================
   */

  socket.on("hello", (acknowledge) => {
    acknowledge?.("Hello from server");
  });

  /*
   * ========================================================
   * 02. ACK WITH OBJECT
   * ========================================================
   */

  socket.on("user:get", async (userId, acknowledge) => {
    try {
      const user = await getUser(userId);

      if (!user) {
        acknowledge?.({
          success: false,

          error: {
            code: "USER_NOT_FOUND",

            message: "User not found",
          },
        });

        return;
      }

      acknowledge?.({
        success: true,

        data: user,
      });
    } catch (error) {
      sendAckError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 03. USER CREATE
   * ========================================================
   */

  socket.on("user:create", async (payload, acknowledge) => {
    try {
      /*
       * Validate.
       */

      if (
        !payload ||
        typeof payload.name !== "string" ||
        payload.name.trim().length === 0
      ) {
        acknowledge?.({
          success: false,

          error: {
            code: "VALIDATION_ERROR",

            message: "name is required",
          },
        });

        return;
      }

      /*
       * Database operation.
       */

      const user = await createUser({
        name: payload.name.trim(),
      });

      /*
       * ACK to requesting client.
       */

      acknowledge?.({
        success: true,

        data: user,
      });

      /*
       * Notify everyone else.
       */

      socket.broadcast.emit("user:created", user);
    } catch (error) {
      sendAckError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 04. OPTIONAL ACK
   * ========================================================
   *
   * The client may emit an event without an ACK callback.
   *
   * Therefore:
   *
   * acknowledge?.(...)
   *
   * is safe.
   *
   * ========================================================
   */

  socket.on("optional-ack", (payload, acknowledge) => {
    acknowledge?.({
      success: true,

      received: payload,
    });
  });

  /*
   * ========================================================
   * 05. MULTIPLE ACK ARGUMENTS
   * ========================================================
   *
   * Socket.IO ACK callbacks can receive multiple arguments.
   *
   * ========================================================
   */

  socket.on("multiple-values", (acknowledge) => {
    acknowledge?.("first", "second", {
      third: true,
    });
  });

  /*
   * ========================================================
   * 06. ACK + BROADCAST
   * ========================================================
   */

  socket.on("message:create", async (payload, acknowledge) => {
    try {
      await delay(100);

      const message = {
        id: `message_${Date.now()}`,

        content: payload.content,

        senderId: socket.id,

        createdAt: new Date().toISOString(),
      };

      /*
       * ACK only the sender.
       */

      acknowledge?.({
        success: true,

        data: message,
      });

      /*
       * Broadcast event to other clients.
       */

      socket.broadcast.emit("message:created", message);
    } catch (error) {
      sendAckError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 07. ACK FROM SERVER TO CLIENT
   * ========================================================
   *
   * ACK is not only useful for:
   *
   * client -> server
   *
   * It can also be used for:
   *
   * server -> client
   *
   * ========================================================
   */

  socket.on("server:request-client", async () => {
    try {
      const response = await emitWithAck(
        socket,
        "client:confirm",
        {
          message: "Are you available?",
        },
        5_000,
      );

      console.log("Client response:", response);
    } catch (error) {
      console.error("Client ACK failed:", error);
    }
  });

  /*
   * ========================================================
   * 08. SOCKET.IO BUILT-IN ACK TIMEOUT
   * ========================================================
   *
   * Modern Socket.IO provides:
   *
   * socket.timeout(milliseconds)
   *
   * ========================================================
   */

  socket.on("request-client-timeout", () => {
    socket.timeout(5_000).emit(
      "client:slow-operation",
      {
        value: "data",
      },
      (error, response) => {
        if (error) {
          console.error("ACK timeout:", error);

          return;
        }

        console.log("Client response:", response);
      },
    );
  });

  /*
   * ========================================================
   * 09. ACK TIMEOUT SIMULATION
   * ========================================================
   */

  socket.on("slow-operation", async (payload, acknowledge) => {
    try {
      await delay(2_000);

      acknowledge?.({
        success: true,

        data: {
          completed: true,
        },
      });
    } catch (error) {
      sendAckError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 10. ACK EXACTLY ONCE
   * ========================================================
   */

  socket.on("exactly-once", async (payload, acknowledge) => {
    try {
      const result = await performOperation(payload);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "OPERATION_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 11. ACK WITH SAFE ERROR
   * ========================================================
   */

  socket.on("error-example", async (payload, acknowledge) => {
    try {
      throw new Error("Internal database failure");
    } catch (error) {
      console.error({
        socketId: socket.id,

        error,
      });

      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",

          message: "Operation failed",
        },
      });
    }
  });

  /*
   * ========================================================
   * 12. PRODUCTION REQUEST HANDLER
   * ========================================================
   */

  socket.on("profile:update", async (payload, acknowledge) => {
    try {
      /*
       * Step 1:
       * Validate request.
       */

      const validated = validateProfilePayload(payload);

      /*
       * Step 2:
       * Perform asynchronous operation.
       */

      const profile = await updateProfile(socket.id, validated);

      /*
       * Step 3:
       * ACK requester.
       */

      acknowledge?.({
        success: true,

        data: profile,
      });

      /*
       * Step 4:
       * Notify interested clients.
       */

      socket.broadcast.emit("profile:updated", profile);
    } catch (error) {
      sendAckError(acknowledge, error);
    }
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * GENERIC ACK ERROR HANDLER
 * ============================================================
 */

function sendAckError(acknowledge, error) {
  console.error(error);

  acknowledge?.({
    success: false,

    error: {
      code: "INTERNAL_ERROR",

      message: "Operation failed",
    },
  });
}

/*
 * ============================================================
 * SOCKET SERVER -> CLIENT ACK HELPER
 * ============================================================
 */

function emitWithAck(socket, event, data, timeoutMs) {
  return new Promise((resolve, reject) => {
    socket.timeout(timeoutMs).emit(event, data, (error, response) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(response);
    });
  });
}

/*
 * ============================================================
 * OPERATION
 * ============================================================
 */

async function performOperation(payload) {
  await delay(100);

  return {
    processed: true,

    payload,
  };
}

/*
 * ============================================================
 * PROFILE VALIDATION
 * ============================================================
 */

function validateProfilePayload(payload) {
  if (!payload || typeof payload.name !== "string") {
    const error = new Error("Invalid profile");

    error.code = "VALIDATION_ERROR";

    throw error;
  }

  return {
    name: payload.name.trim(),
  };
}

/*
 * ============================================================
 * UPDATE PROFILE
 * ============================================================
 */

async function updateProfile(userId, data) {
  await delay(150);

  return {
    userId,

    name: data.name,

    updatedAt: new Date().toISOString(),
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
