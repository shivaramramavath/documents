/**
 * ============================================================
 * 04_async/async-handler.js
 * ============================================================
 *
 * SOCKET.IO ASYNC EVENT HANDLERS
 *
 * Topics:
 *
 * 01. Synchronous handler
 * 02. Async handler
 * 03. async/await
 * 04. Promise
 * 05. Database-style operation
 * 06. Multiple awaits
 * 07. try/catch
 * 08. Central async wrapper
 * 09. Error propagation
 * 10. Acknowledgements
 * 11. Async validation
 * 12. Parallel operations
 * 13. Sequential operations
 * 14. Promise.all
 * 15. Promise.allSettled
 * 16. Timeout
 * 17. AbortController
 * 18. Preventing duplicate operations
 * 19. Cleanup
 * 20. Production pattern
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
 *
 * This simulates an asynchronous database.
 *
 * In a real application this could be:
 *
 * MongoDB
 * PostgreSQL
 * MySQL
 * Redis
 * etc.
 *
 * ============================================================
 */

const users = new Map();

/*
 * ============================================================
 * FAKE ASYNC DATABASE FUNCTIONS
 * ============================================================
 */

async function findUserById(userId) {
  await delay(100);

  return users.get(userId) ?? null;
}

async function createUser(data) {
  await delay(100);

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
 * DELAY HELPER
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
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 01. SYNCHRONOUS HANDLER
   * ========================================================
   */

  socket.on("sync:event", (payload) => {
    console.log("Synchronous event:", payload);
  });

  /*
   * ========================================================
   * 02. ASYNC HANDLER
   * ========================================================
   */

  socket.on("async:event", async (payload) => {
    console.log("Started async operation");

    await delay(1000);

    console.log("Async operation completed", payload);
  });

  /*
   * ========================================================
   * 03. ASYNC/AWAIT
   * ========================================================
   */

  socket.on("user:get", async (userId, acknowledge) => {
    try {
      const user = await findUserById(userId);

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
      console.error("user:get failed:", error);

      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",

          message: "Failed to fetch user",
        },
      });
    }
  });

  /*
   * ========================================================
   * 04. ASYNC USER CREATION
   * ========================================================
   */

  socket.on("user:create", async (payload, acknowledge) => {
    try {
      if (!payload || typeof payload.name !== "string") {
        acknowledge?.({
          success: false,

          error: {
            code: "VALIDATION_ERROR",

            message: "name is required",
          },
        });

        return;
      }

      const user = await createUser(payload);

      acknowledge?.({
        success: true,

        data: user,
      });

      /*
       * Notify other clients after successful
       * database operation.
       */

      socket.broadcast.emit("user:created", user);
    } catch (error) {
      console.error("user:create failed:", error);

      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",

          message: "Could not create user",
        },
      });
    }
  });

  /*
   * ========================================================
   * 05. SEQUENTIAL ASYNC OPERATIONS
   * ========================================================
   *
   * Operation B depends on operation A.
   *
   * ========================================================
   */

  socket.on("sequential", async (payload, acknowledge) => {
    try {
      const user = await findUserById(payload.userId);

      if (!user) {
        acknowledge?.({
          success: false,

          error: {
            code: "USER_NOT_FOUND",
          },
        });

        return;
      }

      /*
       * This operation depends on user.
       */

      const result = await performOperation(user);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 06. PARALLEL ASYNC OPERATIONS
   * ========================================================
   *
   * These operations don't depend on each other.
   *
   * ========================================================
   */

  socket.on("parallel", async (payload, acknowledge) => {
    try {
      const [user, profile, settings] = await Promise.all([
        findUserById(payload.userId),

        getProfile(payload.userId),

        getSettings(payload.userId),
      ]);

      acknowledge?.({
        success: true,

        data: {
          user,
          profile,
          settings,
        },
      });
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 07. PROMISE.ALLSETTLED
   * ========================================================
   *
   * Useful when you want the result of every operation,
   * even when some operations fail.
   *
   * ========================================================
   */

  socket.on("parallel:safe", async (payload, acknowledge) => {
    try {
      const results = await Promise.allSettled([
        findUserById(payload.userId),

        getProfile(payload.userId),

        getSettings(payload.userId),
      ]);

      acknowledge?.({
        success: true,

        data: results,
      });
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 08. ASYNC VALIDATION
   * ========================================================
   *
   * Sometimes validation itself requires I/O.
   *
   * Example:
   *
   * Check whether username already exists.
   *
   * ========================================================
   */

  socket.on("user:validate", async (payload, acknowledge) => {
    try {
      const available = await isUsernameAvailable(payload.username);

      acknowledge?.({
        success: true,

        data: {
          available,
        },
      });
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 09. ASYNC ERROR
   * ========================================================
   */

  socket.on("error:test", async (payload, acknowledge) => {
    try {
      await operationThatFails();

      acknowledge?.({
        success: true,
      });
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 10. ASYNC HANDLER WITH ACK
   * ========================================================
   */

  socket.on("task:create", async (payload, acknowledge) => {
    try {
      const task = await createTask(payload);

      /*
       * Acknowledge the command.
       */

      acknowledge?.({
        success: true,

        data: task,
      });

      /*
       * Broadcast the resulting event.
       */

      socket.broadcast.emit("task:created", task);
    } catch (error) {
      handleSocketError(socket, acknowledge, error);
    }
  });

  /*
   * ========================================================
   * 11. CLEANUP ON DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * CENTRAL SOCKET ERROR HANDLER
 * ============================================================
 */

function handleSocketError(socket, acknowledge, error) {
  console.error({
    socketId: socket.id,

    error,
  });

  acknowledge?.({
    success: false,

    error: {
      code: "INTERNAL_ERROR",

      message: "An unexpected error occurred",
    },
  });
}

/*
 * ============================================================
 * GENERIC ASYNC OPERATION
 * ============================================================
 */

async function performOperation(user) {
  await delay(100);

  return {
    userId: user.id,

    processed: true,
  };
}

/*
 * ============================================================
 * PROFILE
 * ============================================================
 */

async function getProfile(userId) {
  await delay(100);

  return {
    userId,

    bio: "Example profile",
  };
}

/*
 * ============================================================
 * SETTINGS
 * ============================================================
 */

async function getSettings(userId) {
  await delay(100);

  return {
    userId,

    notifications: true,
  };
}

/*
 * ============================================================
 * USERNAME AVAILABILITY
 * ============================================================
 */

async function isUsernameAvailable(username) {
  await delay(100);

  if (typeof username !== "string") {
    throw new Error("Invalid username");
  }

  return username !== "admin";
}

/*
 * ============================================================
 * INTENTIONALLY FAILING OPERATION
 * ============================================================
 */

async function operationThatFails() {
  await delay(100);

  throw new Error("Something failed");
}

/*
 * ============================================================
 * TASK CREATION
 * ============================================================
 */

async function createTask(payload) {
  await delay(200);

  return {
    id: `task_${Date.now()}`,

    title: payload.title,

    createdAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
