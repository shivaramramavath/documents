/**
 * ============================================================
 * 02_server_client/connection.js
 * ============================================================
 *
 * SOCKET.IO CONNECTION
 *
 * This file focuses ONLY on connection behavior.
 *
 * Topics:
 *
 * 1. Creating a socket
 * 2. autoConnect
 * 3. connect()
 * 4. connect event
 * 5. connect_error
 * 6. connection state
 * 7. socket.id
 * 8. namespace
 * 9. authentication during connection
 * 10. handshake
 * 11. Manager connection events
 * 12. Engine.IO connection
 * 13. transport
 * 14. transport upgrade
 * 15. connection timeout
 * 16. reconnection
 * 17. connection attempts
 * 18. manual reconnect
 * 19. connection cleanup
 *
 * ============================================================
 */

import { io } from "socket.io-client";

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const SERVER_URL = "http://localhost:3000";

const SOCKET_PATH = "/socket.io";

/*
 * ============================================================
 * CREATE SOCKET
 * ============================================================
 *
 * io(url, options)
 *
 * url:
 *     Server URL.
 *
 * options:
 *     Socket.IO client configuration.
 *
 * ============================================================
 */

const socket = io(SERVER_URL, {
  /*
   * --------------------------------------------------------
   * SOCKET.IO PATH
   * --------------------------------------------------------
   *
   * Must match the server.
   *
   * Server:
   *
   *     path: "/socket.io"
   *
   * Client:
   *
   *     path: "/socket.io"
   *
   * --------------------------------------------------------
   */

  path: SOCKET_PATH,

  /*
   * --------------------------------------------------------
   * AUTO CONNECT
   * --------------------------------------------------------
   *
   * true:
   *
   *     Connection starts automatically.
   *
   * false:
   *
   *     You must call socket.connect().
   *
   * --------------------------------------------------------
   */

  autoConnect: false,

  /*
   * --------------------------------------------------------
   * TRANSPORTS
   * --------------------------------------------------------
   *
   * Socket.IO can use:
   *
   *     polling
   *     websocket
   *
   * --------------------------------------------------------
   */

  transports: ["polling", "websocket"],

  /*
   * --------------------------------------------------------
   * CONNECTION TIMEOUT
   * --------------------------------------------------------
   *
   * Maximum amount of time for a connection attempt.
   *
   * Unit:
   *
   *     milliseconds
   *
   * 10_000 = 10 seconds
   *
   * --------------------------------------------------------
   */

  timeout: 10_000,

  /*
   * --------------------------------------------------------
   * RECONNECTION
   * --------------------------------------------------------
   *
   * Automatically try to reconnect after an unexpected
   * disconnection.
   * --------------------------------------------------------
   */

  reconnection: true,

  /*
   * --------------------------------------------------------
   * RECONNECTION ATTEMPTS
   * --------------------------------------------------------
   *
   * Number of attempts.
   *
   * Infinity:
   *
   *     Keep trying.
   *
   * --------------------------------------------------------
   */

  reconnectionAttempts: Infinity,

  /*
   * --------------------------------------------------------
   * INITIAL RECONNECTION DELAY
   * --------------------------------------------------------
   */

  reconnectionDelay: 1_000,

  /*
   * --------------------------------------------------------
   * MAXIMUM RECONNECTION DELAY
   * --------------------------------------------------------
   */

  reconnectionDelayMax: 5_000,

  /*
   * --------------------------------------------------------
   * RANDOMIZATION FACTOR
   * --------------------------------------------------------
   *
   * Adds jitter to reconnection delays.
   * --------------------------------------------------------
   */

  randomizationFactor: 0.5,

  /*
   * --------------------------------------------------------
   * AUTH
   * --------------------------------------------------------
   *
   * Data sent during the Socket.IO handshake.
   *
   * Server can access it through:
   *
   *     socket.handshake.auth
   *
   * --------------------------------------------------------
   */

  auth: {
    token: "example-token",
  },
});

/*
 * ============================================================
 * BEFORE CONNECTION
 * ============================================================
 *
 * Because autoConnect is false, the socket initially isn't
 * connected.
 * ============================================================
 */

console.log("Initial state");

console.log("socket.connected:", socket.connected);

console.log("socket.disconnected:", socket.disconnected);

console.log("socket.id:", socket.id);

/*
 * ============================================================
 * CONNECT EVENT
 * ============================================================
 *
 * Fired when the Socket.IO namespace successfully connects.
 *
 * ============================================================
 */

socket.on("connect", () => {
  console.log("\n========================================");

  console.log("CONNECTED");

  console.log("========================================");

  /*
   * --------------------------------------------------------
   * SOCKET ID
   * --------------------------------------------------------
   */

  console.log("Socket ID:", socket.id);

  /*
   * --------------------------------------------------------
   * CONNECTION STATE
   * --------------------------------------------------------
   */

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);

  /*
   * --------------------------------------------------------
   * MANAGER STATE
   * --------------------------------------------------------
   */

  console.log("Manager readyState:", socket.io.engine?.readyState);

  /*
   * --------------------------------------------------------
   * TRANSPORT
   * --------------------------------------------------------
   */

  console.log("Current transport:", socket.io.engine?.transport.name);
});

/*
 * ============================================================
 * CONNECT_ERROR
 * ============================================================
 *
 * Fired when the connection attempt fails.
 *
 * Common causes:
 *
 *     server unavailable
 *     wrong URL
 *     wrong path
 *     CORS problem
 *     authentication rejection
 *     timeout
 *     transport failure
 *
 * ============================================================
 */

socket.on("connect_error", (error) => {
  console.error("\n========================================");

  console.error("CONNECTION ERROR");

  console.error("========================================");

  console.error("Message:", error.message);

  console.error("Name:", error.name);

  console.error("Description:", error.description);

  console.error("Context:", error.context);
});

/*
 * ============================================================
 * MANAGER: OPEN
 * ============================================================
 *
 * The Manager handles the underlying connection to the
 * Socket.IO server.
 *
 * "open" means the Engine.IO connection has been opened.
 *
 * ============================================================
 */

socket.io.on("open", () => {
  console.log("Manager opened");
});

/*
 * ============================================================
 * MANAGER: ERROR
 * ============================================================
 */

socket.io.on("error", (error) => {
  console.error("Manager error:", error);
});

/*
 * ============================================================
 * MANAGER: RECONNECT_ATTEMPT
 * ============================================================
 *
 * Fired when Socket.IO attempts to reconnect.
 *
 * Parameter:
 *
 *     attempt
 *
 * Example:
 *
 *     1
 *     2
 *     3
 *
 * ============================================================
 */

socket.io.on("reconnect_attempt", (attempt) => {
  console.log("Reconnection attempt:", attempt);
});

/*
 * ============================================================
 * MANAGER: RECONNECT
 * ============================================================
 *
 * Fired when reconnection succeeds.
 *
 * Parameter:
 *
 *     attempt
 *
 * Number of attempts required.
 *
 * ============================================================
 */

socket.io.on("reconnect", (attempt) => {
  console.log("Reconnected");

  console.log("Attempts:", attempt);

  console.log("New socket ID:", socket.id);
});

/*
 * ============================================================
 * MANAGER: RECONNECT_ERROR
 * ============================================================
 *
 * Fired when a reconnection attempt fails.
 *
 * ============================================================
 */

socket.io.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error);
});

/*
 * ============================================================
 * MANAGER: RECONNECT_FAILED
 * ============================================================
 *
 * Fired when all configured reconnection attempts fail.
 *
 * ============================================================
 */

socket.io.on("reconnect_failed", () => {
  console.error("All reconnection attempts failed");
});

/*
 * ============================================================
 * ENGINE.IO CONNECTION
 * ============================================================
 *
 * socket.io.engine becomes available after the underlying
 * Engine.IO connection has been established.
 *
 * ============================================================
 */

function inspectEngineConnection() {
  if (!socket.io.engine) {
    console.log("Engine.IO connection does not exist yet");

    return;
  }

  console.log("Engine.IO connection ID:", socket.io.engine.id);

  console.log("Engine.IO ready state:", socket.io.engine.readyState);

  console.log("Transport:", socket.io.engine.transport.name);
}

/*
 * ============================================================
 * TRANSPORT UPGRADE
 * ============================================================
 *
 * If polling is used initially, Engine.IO can upgrade the
 * connection to WebSocket.
 *
 * Typical:
 *
 *     polling
 *        ↓
 *     websocket
 *
 * ============================================================
 */

function listenForTransportUpgrade() {
  if (!socket.io.engine) {
    return;
  }

  socket.io.engine.on("upgrade", () => {
    console.log("Transport upgraded:", socket.io.engine.transport.name);
  });
}

/*
 * ============================================================
 * ENGINE CONNECTION CLOSE
 * ============================================================
 */

function listenForEngineClose() {
  if (!socket.io.engine) {
    return;
  }

  socket.io.engine.on("close", (reason) => {
    console.log("Engine.IO connection closed:", reason);
  });
}

/*
 * ============================================================
 * ENGINE ERROR
 * ============================================================
 */

function listenForEngineError() {
  if (!socket.io.engine) {
    return;
  }

  socket.io.engine.on("error", (error) => {
    console.error("Engine.IO error:", error);
  });
}

/*
 * ============================================================
 * MANUAL CONNECT
 * ============================================================
 *
 * Starts a Socket.IO connection.
 *
 * Syntax:
 *
 *     socket.connect()
 *
 * Also:
 *
 *     socket.open()
 *
 * ============================================================
 */

function connectSocket() {
  if (socket.connected) {
    console.log("Socket is already connected");

    return;
  }

  console.log("Starting socket connection...");

  socket.connect();
}

/*
 * ============================================================
 * MANUAL DISCONNECT
 * ============================================================
 *
 * Closes the Socket.IO namespace connection.
 *
 * This is different from an unexpected network failure.
 *
 * Manual disconnect normally does not behave like a
 * temporary connection failure requiring automatic recovery.
 *
 * ============================================================
 */

function disconnectSocket() {
  if (!socket.connected) {
    console.log("Socket is already disconnected");

    return;
  }

  console.log("Disconnecting socket...");

  socket.disconnect();
}

/*
 * ============================================================
 * MANUAL RECONNECT
 * ============================================================
 */

function reconnectSocket() {
  console.log("Manually reconnecting...");

  if (socket.connected) {
    socket.disconnect();
  }

  socket.connect();
}

/*
 * ============================================================
 * CHANGE AUTH BEFORE CONNECTING
 * ============================================================
 *
 * Useful when a token changes.
 *
 * ============================================================
 */

function updateAuthentication(token) {
  socket.auth = {
    token,
  };
}

/*
 * ============================================================
 * DISCONNECT EVENT
 * ============================================================
 *
 * Fired when the Socket.IO connection closes.
 *
 * Parameters:
 *
 *     reason
 *     description
 *
 * ============================================================
 */

socket.on("disconnect", (reason, description) => {
  console.log("\n========================================");

  console.log("DISCONNECTED");

  console.log("========================================");

  console.log("Reason:", reason);

  console.log("Description:", description);

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);
});

/*
 * ============================================================
 * START CONNECTION
 * ============================================================
 *
 * autoConnect is false above, therefore we explicitly
 * connect here.
 * ============================================================
 */

connectSocket();

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * These functions require socket.io.engine to exist.
 *
 * Therefore, register them after connection.
 * ============================================================
 */

socket.once("connect", () => {
  inspectEngineConnection();

  listenForTransportUpgrade();

  listenForEngineClose();

  listenForEngineError();
});

/*
 * ============================================================
 * EXAMPLE MANUAL OPERATIONS
 * ============================================================
 *
 * Uncomment one at a time while learning.
 * ============================================================
 */

// disconnectSocket();

// reconnectSocket();

// updateAuthentication(
//   "new-token",
// );

/*
 * ============================================================
 * GRACEFUL PROCESS SHUTDOWN
 * ============================================================
 */

function shutdown(signal) {
  console.log(`Received ${signal}`);

  /*
   * Stop the Socket.IO client connection.
   */

  socket.disconnect();

  console.log("Socket connection closed");

  process.exit(0);
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
