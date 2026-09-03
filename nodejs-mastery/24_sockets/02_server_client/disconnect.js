/**
 * ============================================================
 * 02_server_client/disconnect.js
 * ============================================================
 *
 * SOCKET.IO DISCONNECTION
 *
 * Topics:
 *
 * 1. socket.disconnect()
 * 2. socket.close()
 * 3. disconnect event
 * 4. disconnecting event
 * 5. disconnect reasons
 * 6. intentional disconnect
 * 7. unexpected disconnect
 * 8. automatic reconnection
 * 9. manual reconnection
 * 10. connection state
 * 11. socket.id after disconnect
 * 12. room state during disconnect
 * 13. Engine.IO close
 * 14. Engine.IO error
 * 15. cleanup
 * 16. graceful shutdown
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

import { io as createClient } from "socket.io-client";

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const PORT = 3000;

const SERVER_URL = `http://localhost:${PORT}`;

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
   * Heartbeat configuration.
   *
   * These values are useful for understanding
   * "ping timeout" disconnects.
   */

  pingInterval: 25_000,

  pingTimeout: 20_000,
});

/*
 * ============================================================
 * SERVER CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("\n========================================");

  console.log("SERVER: SOCKET CONNECTED");

  console.log("========================================");

  console.log("Socket ID:", socket.id);

  /*
   * --------------------------------------------------------
   * DISCONNECTING
   * --------------------------------------------------------
   *
   * This event happens BEFORE the socket is fully
   * disconnected.
   *
   * The socket is still associated with its rooms.
   * --------------------------------------------------------
   */

  socket.on("disconnecting", (reason) => {
    console.log("\n----------------------------------------");

    console.log("SERVER: DISCONNECTING");

    console.log("----------------------------------------");

    console.log("Socket ID:", socket.id);

    console.log("Reason:", reason);

    /*
     * Rooms are still available here.
     */

    console.log("Rooms:", [...socket.rooms]);

    /*
     * Connection state.
     */

    console.log("Connected:", socket.connected);

    console.log("Disconnected:", socket.disconnected);
  });

  /*
   * --------------------------------------------------------
   * DISCONNECT
   * --------------------------------------------------------
   *
   * This event happens AFTER the socket has disconnected.
   *
   * At this point Socket.IO has performed the socket
   * disconnection process.
   * --------------------------------------------------------
   */

  socket.on("disconnect", (reason, description) => {
    console.log("\n----------------------------------------");

    console.log("SERVER: DISCONNECTED");

    console.log("----------------------------------------");

    console.log("Socket ID:", socket.id);

    console.log("Reason:", reason);

    console.log("Description:", description);

    console.log("Connected:", socket.connected);

    console.log("Disconnected:", socket.disconnected);

    /*
     * IMPORTANT:
     *
     * socket.rooms should no longer be treated as the
     * socket's active room membership after disconnect.
     */

    console.log("Rooms:", [...socket.rooms]);
  });

  /*
   * --------------------------------------------------------
   * ENGINE.IO CLOSE
   * --------------------------------------------------------
   *
   * Lower-level connection close.
   * --------------------------------------------------------
   */

  socket.conn.on("close", (reason) => {
    console.log("ENGINE.IO CLOSED:", reason);
  });

  /*
   * --------------------------------------------------------
   * ENGINE.IO ERROR
   * --------------------------------------------------------
   */

  socket.conn.on("error", (error) => {
    console.error("ENGINE.IO ERROR:", error);
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on ${SERVER_URL}`);

  /*
   * Start client after server starts.
   */

  startClient();
});

/*
 * ============================================================
 * CLIENT
 * ============================================================
 *
 * This client exists only so you can experiment with the
 * different disconnection scenarios.
 * ============================================================
 */

const socket = createClient(SERVER_URL, {
  /*
   * Automatic reconnection.
   */

  reconnection: true,

  /*
   * Number of attempts.
   */

  reconnectionAttempts: 5,

  /*
   * Initial retry delay.
   */

  reconnectionDelay: 1_000,

  /*
   * Maximum retry delay.
   */

  reconnectionDelayMax: 5_000,

  /*
   * Connection timeout.
   */

  timeout: 10_000,
});

/*
 * ============================================================
 * CLIENT CONNECT
 * ============================================================
 */

socket.on("connect", () => {
  console.log("\nCLIENT: CONNECTED");

  console.log("Socket ID:", socket.id);

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);
});

/*
 * ============================================================
 * CLIENT CONNECT ERROR
 * ============================================================
 */

socket.on("connect_error", (error) => {
  console.error("CLIENT: CONNECTION ERROR");

  console.error("Message:", error.message);
});

/*
 * ============================================================
 * CLIENT DISCONNECT
 * ============================================================
 */

socket.on("disconnect", (reason, description) => {
  console.log("\n========================================");

  console.log("CLIENT: DISCONNECTED");

  console.log("========================================");

  console.log("Reason:", reason);

  console.log("Description:", description);

  console.log("Socket ID:", socket.id);

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);
});

/*
 * ============================================================
 * MANAGER RECONNECTION EVENTS
 * ============================================================
 *
 * These belong to socket.io Manager.
 * ============================================================
 */

socket.io.on("reconnect_attempt", (attempt) => {
  console.log("RECONNECT ATTEMPT:", attempt);
});

socket.io.on("reconnect", (attempt) => {
  console.log("RECONNECTED");

  console.log("Attempts:", attempt);

  console.log("New Socket ID:", socket.id);
});

socket.io.on("reconnect_error", (error) => {
  console.error("RECONNECT ERROR:", error.message);
});

socket.io.on("reconnect_failed", () => {
  console.error("RECONNECT FAILED");
});

/*
 * ============================================================
 * START CLIENT
 * ============================================================
 */

function startClient() {
  console.log("Starting client...");

  socket.connect();
}

/*
 * ============================================================
 * 1. MANUAL DISCONNECT
 * ============================================================
 *
 * This intentionally disconnects the socket.
 * ============================================================
 */

function manualDisconnect() {
  console.log("Manually disconnecting...");

  socket.disconnect();
}

/*
 * ============================================================
 * 2. CLOSE
 * ============================================================
 *
 * close() is also available for closing the Socket.IO
 * connection.
 * ============================================================
 */

function closeSocket() {
  console.log("Closing socket...");

  socket.close();
}

/*
 * ============================================================
 * 3. MANUAL RECONNECT
 * ============================================================
 */

function manualReconnect() {
  console.log("Manual reconnect...");

  if (socket.connected) {
    socket.disconnect();
  }

  socket.connect();
}

/*
 * ============================================================
 * 4. CHECK CONNECTION STATE
 * ============================================================
 */

function checkConnectionState() {
  console.log("Socket ID:", socket.id);

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);
}

/*
 * ============================================================
 * 5. DISCONNECT WITH A TIMER
 * ============================================================
 *
 * Useful for experimenting.
 * ============================================================
 */

function disconnectAfter(milliseconds) {
  setTimeout(() => {
    console.log(`Disconnecting after ${milliseconds}ms`);

    socket.disconnect();
  }, milliseconds);
}

/*
 * ============================================================
 * 6. RECONNECT WITH A TIMER
 * ============================================================
 */

function reconnectAfter(milliseconds) {
  setTimeout(() => {
    console.log(`Connecting after ${milliseconds}ms`);

    socket.connect();
  }, milliseconds);
}

/*
 * ============================================================
 * 7. GRACEFUL SHUTDOWN
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  /*
   * --------------------------------------------------------
   * Disconnect client.
   * --------------------------------------------------------
   */

  socket.disconnect();

  /*
   * --------------------------------------------------------
   * Close Socket.IO server.
   * --------------------------------------------------------
   */

  io.close(() => {
    console.log("Socket.IO server closed");

    /*
     * ------------------------------------------------------
     * Close HTTP server.
     * ------------------------------------------------------
     */

    httpServer.close((error) => {
      if (error) {
        console.error("HTTP server close error:", error);

        process.exit(1);
      }

      console.log("HTTP server closed");

      console.log("Shutdown complete");

      process.exit(0);
    });
  });
}

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

/*
 * ============================================================
 * EXPERIMENTS
 * ============================================================
 *
 * Uncomment ONE at a time.
 * ============================================================
 */

// manualDisconnect();

// closeSocket();

// manualReconnect();

// checkConnectionState();

// disconnectAfter(5_000);

// reconnectAfter(5_000);
