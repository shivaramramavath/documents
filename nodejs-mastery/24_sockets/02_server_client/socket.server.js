/**
 * ============================================================
 * 02_server_client/socket.server.js
 * ============================================================
 *
 * Socket.IO Server
 *
 * This file demonstrates:
 *
 * 1. Creating a Socket.IO server
 * 2. HTTP server integration
 * 3. Socket.IO configuration
 * 4. CORS
 * 5. Transports
 * 6. Connection handling
 * 7. Socket ID
 * 8. Handshake
 * 9. Socket data
 * 10. Socket rooms
 * 11. Transport information
 * 12. Transport upgrade
 * 13. Disconnecting
 * 14. Disconnect
 * 15. Error handling
 * 16. Graceful shutdown
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const PORT = 3000;

const SOCKET_PATH = "/socket.io";

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
 *
 * Socket.IO can attach to an existing HTTP server.
 *
 * Architecture:
 *
 *             HTTP Server
 *                  │
 *          ┌───────┴────────┐
 *          │                │
 *          ▼                ▼
 *       Express         Socket.IO
 *
 * ============================================================
 */

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  /*
   * ----------------------------------------------------------
   * path
   * ----------------------------------------------------------
   *
   * Socket.IO endpoint.
   *
   * Default:
   *
   *     /socket.io/
   *
   * ----------------------------------------------------------
   */

  path: SOCKET_PATH,

  /*
   * ----------------------------------------------------------
   * CORS
   * ----------------------------------------------------------
   *
   * Development example.
   *
   * In production, replace "*" with your actual frontend
   * origin.
   * ----------------------------------------------------------
   */

  cors: {
    origin: "*",

    methods: ["GET", "POST"],

    credentials: false,
  },

  /*
   * ----------------------------------------------------------
   * TRANSPORTS
   * ----------------------------------------------------------
   *
   * Socket.IO can use:
   *
   *     polling
   *     websocket
   *
   * ----------------------------------------------------------
   */

  transports: ["polling", "websocket"],

  /*
   * ----------------------------------------------------------
   * ALLOW UPGRADES
   * ----------------------------------------------------------
   *
   * Allows the connection to upgrade from one transport
   * to another when supported.
   *
   * Typical flow:
   *
   * polling
   *    ↓
   * websocket
   *
   * ----------------------------------------------------------
   */

  allowUpgrades: true,

  /*
   * ----------------------------------------------------------
   * PING INTERVAL
   * ----------------------------------------------------------
   *
   * How frequently the server sends heartbeat pings.
   *
   * Value is milliseconds.
   *
   * ----------------------------------------------------------
   */

  pingInterval: 25_000,

  /*
   * ----------------------------------------------------------
   * PING TIMEOUT
   * ----------------------------------------------------------
   *
   * How long the server waits for the expected pong before
   * considering the connection dead.
   *
   * Value is milliseconds.
   *
   * ----------------------------------------------------------
   */

  pingTimeout: 20_000,

  /*
   * ----------------------------------------------------------
   * MAX HTTP BUFFER SIZE
   * ----------------------------------------------------------
   *
   * Maximum size of a single message handled by Engine.IO.
   *
   * Value is bytes.
   *
   * 1 MB = 1024 * 1024
   * ----------------------------------------------------------
   */

  maxHttpBufferSize: 1e6,

  /*
   * ----------------------------------------------------------
   * CONNECTION STATE RECOVERY
   * ----------------------------------------------------------
   *
   * Allows Socket.IO to recover connection state after some
   * temporary disconnections.
   *
   * This is useful for:
   *
   *     rooms
   *     missed packets
   *     temporary network failures
   *
   * We will study this deeply in the reliability section.
   * ----------------------------------------------------------
   */

  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,

    skipMiddlewares: false,
  },
});

/*
 * ============================================================
 * CONNECTION ERROR
 * ============================================================
 *
 * Errors that occur before a Socket.IO connection is
 * successfully established can be observed here.
 * ============================================================
 */

io.engine.on("connection_error", (error) => {
  console.error("Socket connection error:", {
    message: error.message,

    code: error.code,

    context: error.context,
  });
});

/*
 * ============================================================
 * NEW SOCKET CONNECTION
 * ============================================================
 *
 * "connection" fires whenever a socket successfully connects
 * to this namespace.
 *
 * Parameters:
 *
 *     socket
 *
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("\n========================================");

  console.log("SOCKET CONNECTED");

  console.log("========================================");

  /*
   * ----------------------------------------------------------
   * SOCKET ID
   * ----------------------------------------------------------
   *
   * Unique identifier for this socket connection.
   *
   * IMPORTANT:
   *
   * socket.id is NOT your application's user ID.
   *
   * One user can have multiple sockets.
   * ----------------------------------------------------------
   */

  console.log("Socket ID:", socket.id);

  /*
   * ----------------------------------------------------------
   * SOCKET CONNECTED STATE
   * ----------------------------------------------------------
   */

  console.log("Connected:", socket.connected);

  /*
   * ----------------------------------------------------------
   * SOCKET ROOMS
   * ----------------------------------------------------------
   *
   * Every socket automatically joins a room with its own
   * socket.id.
   * ----------------------------------------------------------
   */

  console.log("Initial rooms:", [...socket.rooms]);

  /*
   * ----------------------------------------------------------
   * SOCKET DATA
   * ----------------------------------------------------------
   *
   * Connection-local server-side data.
   *
   * Authentication middleware will later populate things
   * such as:
   *
   *     socket.data.user
   *     socket.data.userId
   *
   * ----------------------------------------------------------
   */

  console.log("Socket data:", socket.data);

  /*
   * ----------------------------------------------------------
   * HANDSHAKE
   * ----------------------------------------------------------
   *
   * Information received during the connection handshake.
   * ----------------------------------------------------------
   */

  console.log("Handshake:", socket.handshake);

  /*
   * ----------------------------------------------------------
   * HANDSHAKE AUTH
   * ----------------------------------------------------------
   *
   * Example client:
   *
   *     io(URL, {
   *       auth: {
   *         token: "..."
   *       }
   *     });
   *
   * ----------------------------------------------------------
   */

  console.log("Handshake auth:", socket.handshake.auth);

  /*
   * ----------------------------------------------------------
   * HANDSHAKE QUERY
   * ----------------------------------------------------------
   */

  console.log("Handshake query:", socket.handshake.query);

  /*
   * ----------------------------------------------------------
   * HANDSHAKE HEADERS
   * ----------------------------------------------------------
   */

  console.log("Handshake headers:", socket.handshake.headers);

  /*
   * ----------------------------------------------------------
   * CLIENT ADDRESS
   * ----------------------------------------------------------
   */

  console.log("Client address:", socket.handshake.address);

  /*
   * ----------------------------------------------------------
   * TRANSPORT
   * ----------------------------------------------------------
   *
   * Engine.IO transport currently being used.
   *
   * Common values:
   *
   *     polling
   *     websocket
   * ----------------------------------------------------------
   */

  console.log("Transport:", socket.conn.transport.name);

  /*
   * ----------------------------------------------------------
   * ENGINE.IO CONNECTION
   * ----------------------------------------------------------
   *
   * socket.conn represents the lower-level Engine.IO
   * connection.
   * ----------------------------------------------------------
   */

  console.log("Engine connection ID:", socket.conn.id);

  /*
   * ----------------------------------------------------------
   * CONNECTION RECOVERY
   * ----------------------------------------------------------
   *
   * true means Socket.IO recovered the connection state.
   *
   * false means it is a normal/new connection state.
   * ----------------------------------------------------------
   */

  console.log("Recovered:", socket.recovered);

  /*
   * ========================================================
   * TRANSPORT UPGRADE
   * ========================================================
   *
   * Example:
   *
   *     polling
   *        ↓
   *     websocket
   *
   * ========================================================
   */

  socket.conn.on("upgrade", () => {
    console.log("Transport upgraded:", socket.conn.transport.name);
  });

  /*
   * ========================================================
   * TRANSPORT ERROR
   * ========================================================
   */

  socket.conn.on("error", (error) => {
    console.error("Transport error:", error);
  });

  /*
   * ========================================================
   * SOCKET ERROR
   * ========================================================
   *
   * Application-level socket errors can be emitted through
   * the "error" event.
   * ========================================================
   */

  socket.on("error", (error) => {
    console.error("Socket error:", {
      socketId: socket.id,
      error,
    });
  });

  /*
   * ========================================================
   * DISCONNECTING
   * ========================================================
   *
   * IMPORTANT:
   *
   * At this point the socket has NOT completely disconnected
   * yet.
   *
   * Its rooms are still available.
   *
   * This makes this event useful for cleanup/logging.
   * ========================================================
   */

  socket.on("disconnecting", (reason) => {
    console.log("\n----------------------------------------");

    console.log("SOCKET DISCONNECTING");

    console.log("Socket ID:", socket.id);

    console.log("Reason:", reason);

    console.log("Rooms before disconnect:", [...socket.rooms]);

    console.log("----------------------------------------");
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   *
   * Socket has now disconnected.
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("\n========================================");

    console.log("SOCKET DISCONNECTED");

    console.log("Socket ID:", socket.id);

    console.log("Reason:", reason);

    console.log("Connected:", socket.connected);

    console.log("Disconnected:", socket.disconnected);

    console.log("========================================\n");
  });
});

/*
 * ============================================================
 * HTTP SERVER START
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log("========================================");

  console.log("Socket.IO Server Started");

  console.log(`Port: ${PORT}`);

  console.log(`Socket path: ${SOCKET_PATH}`);

  console.log("========================================");
});

/*
 * ============================================================
 * GRACEFUL SHUTDOWN
 * ============================================================
 *
 * Important for:
 *
 *     Docker
 *     Kubernetes
 *     PM2
 *     cloud deployments
 *     rolling deployments
 *
 * ============================================================
 */

const shutdown = (signal) => {
  console.log(`\nReceived ${signal}`);

  /*
   * Stop accepting new Socket.IO connections and close
   * existing Socket.IO connections.
   */

  io.close(() => {
    console.log("Socket.IO server closed");

    /*
     * Close HTTP server.
     */

    httpServer.close((error) => {
      if (error) {
        console.error("HTTP server shutdown error:", error);

        process.exit(1);
      }

      console.log("HTTP server closed");

      console.log("Shutdown complete");

      process.exit(0);
    });
  });
};

/*
 * ============================================================
 * PROCESS SIGNALS
 * ============================================================
 */

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
