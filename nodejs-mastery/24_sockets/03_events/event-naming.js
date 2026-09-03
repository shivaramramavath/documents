/**
 * ============================================================
 * 03_events/event-naming.js
 * ============================================================
 *
 * SOCKET.IO EVENT NAMING
 *
 * Topics:
 *
 * 01. Why event naming matters
 * 02. Event naming rules
 * 03. Commands vs events
 * 04. CRUD events
 * 05. Lifecycle events
 * 06. User events
 * 07. Authentication events
 * 08. Chat events
 * 09. Room events
 * 10. Presence events
 * 11. Notification events
 * 12. Error events
 * 13. Acknowledgements
 * 14. Namespaces vs event names
 * 15. Reserved Socket.IO events
 * 16. Versioning
 * 17. Central event constants
 * 18. Event catalog
 * 19. Bad naming examples
 * 20. Production architecture
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
 * SOCKET.IO
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * 01. CENTRAL EVENT CONSTANTS
 * ============================================================
 *
 * NEVER scatter event strings everywhere in a large
 * production application.
 *
 * ============================================================
 */

export const SOCKET_EVENTS = {
  /*
   * ----------------------------------------------------------
   * Connection lifecycle
   * ----------------------------------------------------------
   */

  CONNECTION: {
    READY: "connection:ready",

    STATE_CHANGED: "connection:state-changed",
  },

  /*
   * ----------------------------------------------------------
   * Authentication
   * ----------------------------------------------------------
   */

  AUTH: {
    AUTHENTICATED: "auth:authenticated",

    UNAUTHENTICATED: "auth:unauthenticated",

    EXPIRED: "auth:expired",
  },

  /*
   * ----------------------------------------------------------
   * Users
   * ----------------------------------------------------------
   */

  USER: {
    CREATED: "user:created",

    UPDATED: "user:updated",

    DELETED: "user:deleted",

    ONLINE: "user:online",

    OFFLINE: "user:offline",
  },

  /*
   * ----------------------------------------------------------
   * Chat commands
   * ----------------------------------------------------------
   */

  MESSAGE: {
    CREATE: "message:create",

    UPDATE: "message:update",

    DELETE: "message:delete",
  },

  /*
   * ----------------------------------------------------------
   * Chat events
   * ----------------------------------------------------------
   */

  MESSAGE_EVENT: {
    CREATED: "message:created",

    UPDATED: "message:updated",

    DELETED: "message:deleted",
  },

  /*
   * ----------------------------------------------------------
   * Typing
   * ----------------------------------------------------------
   */

  TYPING: {
    START: "typing:start",

    STOP: "typing:stop",

    STARTED: "typing:started",

    STOPPED: "typing:stopped",
  },

  /*
   * ----------------------------------------------------------
   * Rooms
   * ----------------------------------------------------------
   */

  ROOM: {
    JOIN: "room:join",

    LEAVE: "room:leave",

    JOINED: "room:joined",

    LEFT: "room:left",
  },

  /*
   * ----------------------------------------------------------
   * Notifications
   * ----------------------------------------------------------
   */

  NOTIFICATION: {
    NEW: "notification:new",

    READ: "notification:read",

    CLEARED: "notification:cleared",
  },

  /*
   * ----------------------------------------------------------
   * Errors
   * ----------------------------------------------------------
   */

  ERROR: {
    VALIDATION: "error:validation",

    AUTHENTICATION: "error:authentication",

    AUTHORIZATION: "error:authorization",

    RATE_LIMIT: "error:rate-limit",

    INTERNAL: "error:internal",
  },
};

/*
 * ============================================================
 * 02. CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /*
   * ========================================================
   * SERVER → CLIENT EVENT
   * ========================================================
   */

  socket.emit(SOCKET_EVENTS.CONNECTION.READY, {
    socketId: socket.id,

    connectedAt: new Date().toISOString(),
  });

  /*
   * ========================================================
   * CLIENT → SERVER COMMAND
   * ========================================================
   */

  socket.on(SOCKET_EVENTS.MESSAGE.CREATE, (payload, acknowledge) => {
    console.log("Create message command:", payload);

    acknowledge?.({
      success: true,
    });
  });

  /*
   * ========================================================
   * ROOM JOIN COMMAND
   * ========================================================
   */

  socket.on(SOCKET_EVENTS.ROOM.JOIN, async (payload, acknowledge) => {
    const { roomId } = payload;

    if (typeof roomId !== "string") {
      acknowledge?.({
        success: false,

        error: {
          code: "INVALID_ROOM_ID",
        },
      });

      return;
    }

    await socket.join(roomId);

    /*
     * Confirm to sender.
     */

    socket.emit(SOCKET_EVENTS.ROOM.JOINED, {
      roomId,
    });

    /*
     * Notify other members.
     */

    socket.to(roomId).emit(SOCKET_EVENTS.USER.ONLINE, {
      socketId: socket.id,
    });

    acknowledge?.({
      success: true,

      data: {
        roomId,
      },
    });
  });

  /*
   * ========================================================
   * TYPING
   * ========================================================
   */

  socket.on(SOCKET_EVENTS.TYPING.START, (payload) => {
    const { roomId } = payload;

    socket.to(roomId).emit(SOCKET_EVENTS.TYPING.STARTED, {
      roomId,

      socketId: socket.id,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING.STOP, (payload) => {
    const { roomId } = payload;

    socket.to(roomId).emit(SOCKET_EVENTS.TYPING.STOPPED, {
      roomId,

      socketId: socket.id,
    });
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * START
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
