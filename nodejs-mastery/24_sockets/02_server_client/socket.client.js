/**
 * ============================================================
 * 02_server_client/socket.client.js
 * ============================================================
 *
 * Socket.IO Client
 *
 * Topics covered:
 *
 * 1. Creating a Socket.IO client
 * 2. Server URL
 * 3. Client options
 * 4. autoConnect
 * 5. transports
 * 6. reconnection
 * 7. reconnection attempts
 * 8. reconnection delay
 * 9. reconnection delay maximum
 * 10. randomization factor
 * 11. connection timeout
 * 12. authentication
 * 13. query parameters
 * 14. connection event
 * 15. connect_error
 * 16. disconnect
 * 17. socket.id
 * 18. socket.connected
 * 19. socket.disconnected
 * 20. socket.emit()
 * 21. socket.on()
 * 22. socket.once()
 * 23. socket.off()
 * 24. acknowledgements
 * 25. acknowledgement timeout
 * 26. socket.connect()
 * 27. socket.disconnect()
 * 28. socket.io Manager
 * 29. transport inspection
 * 30. transport upgrade
 * 31. graceful shutdown
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
 * Parameters:
 *
 *     url
 *     options
 *
 * ============================================================
 */

const socket = io(SERVER_URL, {
  /*
   * --------------------------------------------------------
   * PATH
   * --------------------------------------------------------
   *
   * Must match the Socket.IO server path.
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
   *     Connect automatically when socket is created.
   *
   * false:
   *
   *     Wait until socket.connect() is called.
   *
   * --------------------------------------------------------
   */

  autoConnect: true,

  /*
   * --------------------------------------------------------
   * TRANSPORTS
   * --------------------------------------------------------
   *
   * Socket.IO can initially use:
   *
   *     polling
   *     websocket
   *
   * With both enabled, the connection can start with
   * polling and upgrade to WebSocket.
   *
   * --------------------------------------------------------
   */

  transports: ["polling", "websocket"],

  /*
   * --------------------------------------------------------
   * RECONNECTION
   * --------------------------------------------------------
   *
   * Automatically reconnect after an unexpected
   * disconnection.
   *
   * true = enabled
   * false = disabled
   * --------------------------------------------------------
   */

  reconnection: true,

  /*
   * --------------------------------------------------------
   * RECONNECTION ATTEMPTS
   * --------------------------------------------------------
   *
   * Number of reconnection attempts.
   *
   * Infinity means keep trying.
   * --------------------------------------------------------
   */

  reconnectionAttempts: Infinity,

  /*
   * --------------------------------------------------------
   * RECONNECTION DELAY
   * --------------------------------------------------------
   *
   * Initial delay between reconnection attempts.
   *
   * milliseconds
   *
   * 1000 = 1 second
   * --------------------------------------------------------
   */

  reconnectionDelay: 1_000,

  /*
   * --------------------------------------------------------
   * RECONNECTION DELAY MAX
   * --------------------------------------------------------
   *
   * Maximum reconnection delay.
   *
   * Socket.IO increases the delay between attempts using
   * exponential backoff.
   *
   * --------------------------------------------------------
   */

  reconnectionDelayMax: 5_000,

  /*
   * --------------------------------------------------------
   * RANDOMIZATION FACTOR
   * --------------------------------------------------------
   *
   * Adds randomness to reconnection delays.
   *
   * This helps prevent many clients from reconnecting at
   * exactly the same time.
   *
   * --------------------------------------------------------
   */

  randomizationFactor: 0.5,

  /*
   * --------------------------------------------------------
   * CONNECTION TIMEOUT
   * --------------------------------------------------------
   *
   * How long a connection attempt can take before failing.
   *
   * milliseconds
   *
   * --------------------------------------------------------
   */

  timeout: 20_000,

  /*
   * --------------------------------------------------------
   * AUTHENTICATION
   * --------------------------------------------------------
   *
   * This object is sent as Socket.IO authentication data
   * during the handshake.
   *
   * Server:
   *
   *     socket.handshake.auth
   *
   * --------------------------------------------------------
   */

  auth: {
    token: "example-jwt-token",

    clientType: "node",

    version: "1.0.0",
  },

  /*
   * --------------------------------------------------------
   * QUERY PARAMETERS
   * --------------------------------------------------------
   *
   * These become handshake query parameters.
   *
   * Server:
   *
   *     socket.handshake.query
   *
   * --------------------------------------------------------
   */

  query: {
    platform: "node",

    version: "1",
  },
});

/*
 * ============================================================
 * CONNECTION
 * ============================================================
 *
 * "connect" fires after the socket successfully connects.
 *
 * ============================================================
 */

socket.on("connect", () => {
  console.log("\n========================================");

  console.log("SOCKET CONNECTED");

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
   * SOCKET AUTH
   * --------------------------------------------------------
   *
   * The client-side auth configuration can be inspected
   * through the socket instance.
   * --------------------------------------------------------
   */

  console.log("Auth:", socket.auth);

  /*
   * --------------------------------------------------------
   * TRANSPORT
   * --------------------------------------------------------
   */

  console.log("Transport:", socket.io.engine.transport.name);
});

/*
 * ============================================================
 * CONNECTION ERROR
 * ============================================================
 *
 * Fired when the connection attempt fails.
 *
 * ============================================================
 */

socket.on("connect_error", (error) => {
  console.error("\n========================================");

  console.error("SOCKET CONNECTION ERROR");

  console.error("========================================");

  console.error("Message:", error.message);

  console.error("Description:", error.description);

  console.error("Context:", error.context);
});

/*
 * ============================================================
 * DISCONNECT
 * ============================================================
 *
 * Fired when the socket disconnects.
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

  console.log("SOCKET DISCONNECTED");

  console.log("========================================");

  console.log("Reason:", reason);

  console.log("Description:", description);

  console.log("Socket ID:", socket.id);

  console.log("Connected:", socket.connected);

  console.log("Disconnected:", socket.disconnected);
});

/*
 * ============================================================
 * SERVER ERROR EVENT
 * ============================================================
 *
 * This listens for application-level "error" events emitted
 * by the server.
 *
 * ============================================================
 */

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

/*
 * ============================================================
 * SERVER MESSAGE EVENT
 * ============================================================
 *
 * Example application event.
 *
 * ============================================================
 */

socket.on("message", (data) => {
  console.log("Received message:", data);
});

/*
 * ============================================================
 * ONE-TIME EVENT
 * ============================================================
 *
 * once() executes only once.
 *
 * ============================================================
 */

socket.once("welcome", (data) => {
  console.log("Welcome event:", data);
});

/*
 * ============================================================
 * EMIT EVENT
 * ============================================================
 *
 * socket.emit(
 *     event,
 *     ...args
 * )
 *
 * ============================================================
 */

function sendMessage() {
  socket.emit("message", {
    messageId: crypto.randomUUID(),

    content: "Hello from Socket.IO client",

    timestamp: Date.now(),
  });
}

/*
 * ============================================================
 * MULTIPLE EVENT PARAMETERS
 * ============================================================
 */

function sendMultipleArguments() {
  socket.emit("message:multiple", "Hello", 123, true, {
    source: "client",
  });
}

/*
 * ============================================================
 * ACKNOWLEDGEMENT
 * ============================================================
 *
 * The server can call the acknowledgement callback after
 * processing the event.
 *
 * Client:
 *
 *     socket.emit(
 *       "message:create",
 *       data,
 *       (response) => {}
 *     );
 *
 * ============================================================
 */

function sendWithAcknowledgement() {
  socket.emit(
    "message:create",
    {
      content: "Message requiring acknowledgement",
    },

    (response) => {
      console.log("Server acknowledgement:", response);
    },
  );
}

/*
 * ============================================================
 * ACKNOWLEDGEMENT WITH TIMEOUT
 * ============================================================
 *
 * timeout(milliseconds)
 *
 * If the server does not acknowledge within the specified
 * time, the acknowledgement callback receives an error.
 *
 * ============================================================
 */

function sendWithAckTimeout() {
  socket.timeout(5_000).emit(
    "message:create",
    {
      content: "Message with timeout",
    },

    (error, response) => {
      if (error) {
        console.error("Acknowledgement timeout:", error);

        return;
      }

      console.log("Acknowledgement:", response);
    },
  );
}

/*
 * ============================================================
 * DYNAMIC AUTH
 * ============================================================
 *
 * socket.auth can be changed before connecting/reconnecting.
 *
 * Useful when authentication credentials change.
 *
 * ============================================================
 */

function updateAuth(token) {
  socket.auth = {
    token,
  };
}

/*
 * ============================================================
 * MANUAL CONNECT
 * ============================================================
 *
 * Normally autoConnect is true.
 *
 * If autoConnect is false:
 *
 *     socket.connect()
 *
 * starts the connection.
 *
 * ============================================================
 */

function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

/*
 * ============================================================
 * MANUAL DISCONNECT
 * ============================================================
 */

function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

/*
 * ============================================================
 * MANUAL RECONNECT
 * ============================================================
 *
 * disconnect()
 * followed by
 * connect()
 *
 * can establish a new connection.
 *
 * ============================================================
 */

function reconnectSocket() {
  socket.disconnect();

  socket.connect();
}

/*
 * ============================================================
 * TRANSPORT INFORMATION
 * ============================================================
 */

function printTransport() {
  if (socket.io.engine) {
    console.log("Current transport:", socket.io.engine.transport.name);
  }
}

/*
 * ============================================================
 * TRANSPORT UPGRADE
 * ============================================================
 *
 * Engine.IO can upgrade the underlying transport.
 *
 * Example:
 *
 *     polling
 *        ↓
 *     websocket
 *
 * ============================================================
 */

function registerTransportUpgradeListener() {
  if (!socket.io.engine) {
    return;
  }

  socket.io.engine.on("upgrade", () => {
    console.log("Transport upgraded:", socket.io.engine.transport.name);
  });
}

/*
 * ============================================================
 * ENGINE CONNECTION ERROR
 * ============================================================
 */

function registerEngineErrorListener() {
  if (!socket.io.engine) {
    return;
  }

  socket.io.engine.on("error", (error) => {
    console.error("Engine.IO error:", error);
  });
}

/*
 * ============================================================
 * MANAGER EVENTS
 * ============================================================
 *
 * socket.io is the Socket.IO Manager.
 *
 * It handles connection management, reconnection and the
 * underlying Engine.IO connection.
 *
 * ============================================================
 */

socket.io.on("reconnect_attempt", (attempt) => {
  console.log("Reconnection attempt:", attempt);
});

socket.io.on("reconnect", (attempt) => {
  console.log("Reconnected after attempts:", attempt);
});

socket.io.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error);
});

socket.io.on("reconnect_failed", () => {
  console.error("Reconnection failed");
});

/*
 * ============================================================
 * CLEANUP
 * ============================================================
 */

function cleanup() {
  console.log("Closing socket client...");

  /*
   * Remove listeners registered by this example.
   *
   * In a real application, remove only listeners that your
   * application owns.
   */

  socket.removeAllListeners();

  /*
   * Close Socket.IO connection.
   */

  socket.disconnect();

  console.log("Socket client closed");
}

/*
 * ============================================================
 * PROCESS SIGNALS
 * ============================================================
 */

process.on("SIGINT", () => {
  cleanup();

  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();

  process.exit(0);
});

/*
 * ============================================================
 * EXAMPLE FUNCTIONS
 * ============================================================
 *
 * Uncomment these individually while learning.
 * ============================================================
 */

// sendMessage();

// sendMultipleArguments();

// sendWithAcknowledgement();

// sendWithAckTimeout();

// printTransport();

// updateAuth("new-jwt-token");

// disconnectSocket();

// connectSocket();

// reconnectSocket();
