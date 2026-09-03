/**
 * ============================================================
 * 03_events/emit.js
 * ============================================================
 *
 * SOCKET.IO EVENTS - EMIT
 *
 * Topics:
 *
 * 1. What is an event?
 * 2. socket.emit()
 * 3. io.emit()
 * 4. socket.broadcast.emit()
 * 5. io.to(room).emit()
 * 6. socket.to(room).emit()
 * 7. io.except(room).emit()
 * 8. socket.broadcast.to(room).emit()
 * 9. Multiple arguments
 * 10. Objects
 * 11. Arrays
 * 12. Strings
 * 13. Numbers
 * 14. Booleans
 * 15. null
 * 16. Nested data
 * 17. Event acknowledgements
 * 18. Timeout acknowledgements
 * 19. Dynamic event names
 * 20. Namespaces
 * 21. Rooms
 * 22. Chaining
 * 23. Reserved events
 * 24. Event design
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * EXPRESS APPLICATION
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
 * SERVER CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  /*
   * ========================================================
   * 1. BASIC SOCKET.EMIT()
   * ========================================================
   *
   * Sends an event to THIS socket.
   *
   * Server:
   *
   *     socket.emit(...)
   *
   * Client receives:
   *
   *     socket.on(...)
   *
   * ========================================================
   */

  socket.emit("welcome", "Welcome to the server");

  /*
   * ========================================================
   * 2. EMIT OBJECT
   * ========================================================
   */

  socket.emit("user:welcome", {
    id: socket.id,

    message: "Welcome",

    timestamp: Date.now(),
  });

  /*
   * ========================================================
   * 3. EMIT MULTIPLE ARGUMENTS
   * ========================================================
   *
   * Socket.IO supports multiple arguments.
   * ========================================================
   */

  socket.emit("data:multiple", "Hello", 100, true, {
    source: "server",
  });

  /*
   * ========================================================
   * 4. EMIT ARRAY
   * ========================================================
   */

  socket.emit("data:array", ["JavaScript", "Node.js", "Socket.IO"]);

  /*
   * ========================================================
   * 5. EMIT NESTED OBJECT
   * ========================================================
   */

  socket.emit("data:nested", {
    user: {
      id: "123",

      profile: {
        name: "Shiva",

        settings: {
          notifications: true,
        },
      },
    },
  });

  /*
   * ========================================================
   * 6. IO.EMIT()
   * ========================================================
   *
   * Sends the event to EVERY connected socket in this
   * namespace.
   *
   * ========================================================
   */

  io.emit("server:announcement", {
    message: "A new user joined",

    timestamp: Date.now(),
  });

  /*
   * ========================================================
   * 7. SOCKET.BROADCAST.EMIT()
   * ========================================================
   *
   * Sends to EVERY socket EXCEPT the current socket.
   *
   * ========================================================
   */

  socket.broadcast.emit("user:joined", {
    socketId: socket.id,
  });

  /*
   * ========================================================
   * 8. JOIN A ROOM
   * ========================================================
   */

  socket.join("general");

  /*
   * ========================================================
   * 9. IO.TO(ROOM).EMIT()
   * ========================================================
   *
   * Sends to everyone in the room.
   *
   * ========================================================
   */

  io.to("general").emit("room:message", {
    room: "general",

    message: "Hello general room",

    sender: socket.id,
  });

  /*
   * ========================================================
   * 10. SOCKET.TO(ROOM).EMIT()
   * ========================================================
   *
   * Sends to everyone in the room EXCEPT the current socket.
   *
   * ========================================================
   */

  socket.to("general").emit("room:user-joined", {
    userId: socket.id,
  });

  /*
   * ========================================================
   * 11. BROADCAST TO ROOM
   * ========================================================
   *
   * Equivalent conceptual pattern:
   *
   *     socket.broadcast.to(room).emit(...)
   *
   * Current socket is excluded.
   *
   * ========================================================
   */

  socket.broadcast.to("general").emit("room:broadcast", {
    message: "Another user sent a message",
  });

  /*
   * ========================================================
   * 12. EXCLUDE ROOM
   * ========================================================
   *
   * Send to everyone except sockets in the specified room.
   *
   * ========================================================
   */

  io.except("general").emit("outside:room", {
    message: "Users outside general",
  });

  /*
   * ========================================================
   * 13. MULTIPLE ROOMS
   * ========================================================
   *
   * Send to sockets that are in at least one of the rooms.
   *
   * ========================================================
   */

  socket.join("room:a");

  socket.join("room:b");

  io.to("room:a", "room:b").emit("multiple:rooms", {
    message: "Message for room A or room B",
  });

  /*
   * ========================================================
   * 14. EVENT WITH ACKNOWLEDGEMENT
   * ========================================================
   *
   * Last argument can be an acknowledgement callback.
   *
   * ========================================================
   */

  socket.emit(
    "server:request",
    {
      action: "initialize",
    },

    (response) => {
      console.log("Client acknowledgement:", response);
    },
  );

  /*
   * ========================================================
   * 15. LISTEN FOR CLIENT EVENT
   * ========================================================
   */

  socket.on("message", (data) => {
    console.log("Received:", data);

    /*
     * Respond to sender.
     */

    socket.emit("message:received", {
      success: true,

      message: data,
    });

    /*
     * Notify everyone else.
     */

    socket.broadcast.emit("message:new", {
      sender: socket.id,

      message: data,
    });
  });

  /*
   * ========================================================
   * 16. CLIENT ACKNOWLEDGEMENT
   * ========================================================
   */

  socket.on("message:create", (data, acknowledge) => {
    console.log("Creating message:", data);

    const result = {
      success: true,

      messageId: crypto.randomUUID(),

      timestamp: Date.now(),
    };

    /*
     * Call acknowledgement callback.
     */

    if (typeof acknowledge === "function") {
      acknowledge(result);
    }
  });

  /*
   * ========================================================
   * 17. EVENT WITH ERROR ACKNOWLEDGEMENT
   * ========================================================
   */

  socket.on("user:create", (data, acknowledge) => {
    try {
      if (!data?.name) {
        if (typeof acknowledge === "function") {
          acknowledge({
            success: false,

            error: {
              code: "VALIDATION_ERROR",

              message: "name is required",
            },
          });
        }

        return;
      }

      if (typeof acknowledge === "function") {
        acknowledge({
          success: true,

          data: {
            name: data.name,
          },
        });
      }
    } catch (error) {
      if (typeof acknowledge === "function") {
        acknowledge({
          success: false,

          error: {
            code: "INTERNAL_ERROR",

            message: "Something went wrong",
          },
        });
      }
    }
  });

  /*
   * ========================================================
   * 18. DYNAMIC EVENT
   * ========================================================
   */

  const eventName = "dynamic:event";

  socket.emit(eventName, {
    message: "Dynamic event",
  });

  /*
   * ========================================================
   * 19. EVENT NAME FROM CONSTANT
   * ========================================================
   */

  const EVENTS = {
    USER_JOINED: "user:joined",

    USER_LEFT: "user:left",

    MESSAGE_CREATED: "message:created",

    MESSAGE_DELETED: "message:deleted",
  };

  socket.emit(EVENTS.USER_JOINED, {
    userId: socket.id,
  });

  /*
   * ========================================================
   * 20. DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on http://localhost:3000");
});
