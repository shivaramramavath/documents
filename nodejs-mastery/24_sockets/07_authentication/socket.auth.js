/**
 * ============================================================
 * 07_authentication/socket.auth.js
 * ============================================================
 *
 * SOCKET.IO AUTHENTICATION
 *
 * Authentication answers:
 *
 *     "WHO IS THIS SOCKET?"
 *
 * It does NOT answer:
 *
 *     "WHAT IS THIS SOCKET ALLOWED TO DO?"
 *
 * Authorization handles that later.
 *
 * ============================================================
 *
 * Authentication flow:
 *
 * Client
 *   │
 *   │ credentials
 *   ▼
 * Socket.IO handshake
 *   │
 *   ▼
 * io.use()
 *   │
 *   ▼
 * Extract credentials
 *   │
 *   ▼
 * Verify credentials
 *   │
 *   ├── invalid ──────► reject connection
 *   │
 *   └── valid
 *         │
 *         ▼
 *      socket.data.user
 *         │
 *         ▼
 *      connection
 *
 * ============================================================
 */

import { Server } from "socket.io";

import { createServer } from "node:http";

/*
 * ============================================================
 * 01. CONFIGURATION
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

/*
 * ============================================================
 * 02. HTTP SERVER
 * ============================================================
 */

const httpServer = createServer();

/*
 * ============================================================
 * 03. SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,

    credentials: true,

    methods: ["GET", "POST"],
  },

  /*
   * Maximum incoming packet size.
   *
   * This is a transport-level protection.
   */
  maxHttpBufferSize: 1e6,
});

/*
 * ============================================================
 * 04. AUTHENTICATION ERROR CLASS
 * ============================================================
 */

export class SocketAuthenticationError extends Error {
  constructor(message = "Authentication failed") {
    super(message);

    this.name = "SocketAuthenticationError";
  }
}

/*
 * ============================================================
 * 05. CREDENTIAL TYPES
 * ============================================================
 *
 * A client can provide credentials through:
 *
 * 1. socket.handshake.auth
 * 2. Authorization header
 * 3. Cookie/session
 *
 * ============================================================
 */

/**
 * Extract token from handshake.auth
 *
 * Client:
 *
 * io(url, {
 *   auth: {
 *     token: "..."
 *   }
 * })
 */
export function getAuthToken(socket) {
  const token = socket?.handshake?.auth?.token;

  if (typeof token === "string" && token.length > 0) {
    return token;
  }

  return null;
}

/*
 * ============================================================
 * 06. EXTRACT BEARER TOKEN
 * ============================================================
 *
 * Authorization:
 *
 * Authorization: Bearer <token>
 *
 * ============================================================
 */

export function getBearerToken(socket) {
  const authorization = socket?.handshake?.headers?.authorization;

  if (typeof authorization !== "string") {
    return null;
  }

  const [scheme, token] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer") {
    return null;
  }

  if (!token) {
    return null;
  }

  return token;
}

/*
 * ============================================================
 * 07. COOKIE EXTRACTION
 * ============================================================
 */

export function getCookie(socket, cookieName) {
  const cookieHeader = socket?.handshake?.headers?.cookie;

  if (typeof cookieHeader !== "string") {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex);

    const value = cookie.slice(separatorIndex + 1);

    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

/*
 * ============================================================
 * 08. EXTRACT SESSION ID
 * ============================================================
 */

export function getSessionId(socket) {
  return getCookie(socket, "sessionId");
}

/*
 * ============================================================
 * 09. EXTRACT ALL POSSIBLE CREDENTIALS
 * ============================================================
 */

export function extractCredentials(socket) {
  const authToken = getAuthToken(socket);

  const bearerToken = getBearerToken(socket);

  const sessionId = getSessionId(socket);

  return {
    authToken,

    bearerToken,

    sessionId,
  };
}

/*
 * ============================================================
 * 10. SELECT TOKEN
 * ============================================================
 *
 * Priority:
 *
 * 1. handshake.auth.token
 * 2. Authorization: Bearer
 *
 * ============================================================
 */

export function extractToken(socket) {
  const authToken = getAuthToken(socket);

  if (authToken) {
    return authToken;
  }

  const bearerToken = getBearerToken(socket);

  if (bearerToken) {
    return bearerToken;
  }

  return null;
}

/*
 * ============================================================
 * 11. BASIC TOKEN STRUCTURE CHECK
 * ============================================================
 *
 * This does NOT verify a JWT.
 *
 * It only verifies that something was supplied.
 *
 * Actual JWT verification comes in:
 *
 *     jwt-auth.js
 *
 * ============================================================
 */

export function requireToken(socket) {
  const token = extractToken(socket);

  if (!token) {
    throw new SocketAuthenticationError("Authentication token is required");
  }

  return token;
}

/*
 * ============================================================
 * 12. DEMO TOKEN VERIFICATION
 * ============================================================
 *
 * IMPORTANT:
 *
 * This is deliberately NOT real JWT verification.
 *
 * Replace this function with the implementation
 * from jwt-auth.js.
 *
 * ============================================================
 */

export async function verifyCredentials(socket) {
  const credentials = extractCredentials(socket);

  /*
   * Token authentication.
   */

  if (credentials.authToken || credentials.bearerToken) {
    const token = credentials.authToken ?? credentials.bearerToken;

    /*
     * Demo only.
     *
     * Never use this comparison in production.
     */

    if (token === "demo-valid-token") {
      return {
        id: "user_123",

        username: "demo-user",
      };
    }

    throw new SocketAuthenticationError("Invalid authentication token");
  }

  /*
   * Session authentication.
   *
   * Actual session lookup will be implemented
   * in session-auth.js.
   */

  if (credentials.sessionId) {
    /*
     * Demo session.
     */

    if (credentials.sessionId === "demo-session") {
      return {
        id: "user_123",

        username: "demo-user",
      };
    }

    throw new SocketAuthenticationError("Invalid session");
  }

  throw new SocketAuthenticationError(
    "Authentication credentials are required",
  );
}

/*
 * ============================================================
 * 13. SOCKET AUTHENTICATION MIDDLEWARE
 * ============================================================
 *
 * io.use() executes before connection.
 *
 * ============================================================
 */

export async function authenticateSocket(socket, next) {
  try {
    /*
     * Verify credentials.
     */

    const user = await verifyCredentials(socket);

    /*
     * Store authenticated identity.
     *
     * socket.data is server-side socket state.
     */

    socket.data.user = user;

    /*
     * Useful authentication metadata.
     */

    socket.data.authenticated = true;

    socket.data.authenticatedAt = new Date();

    /*
     * Continue connection.
     */

    next();
  } catch (error) {
    /*
     * Authentication failed.
     */

    const message =
      error instanceof Error ? error.message : "Authentication failed";

    /*
     * Socket.IO middleware errors
     * are sent to the client as
     * connect_error.
     */

    const authError = new Error(message);

    authError.data = {
      code: "AUTHENTICATION_ERROR",

      message,
    };

    next(authError);
  }
}

/*
 * ============================================================
 * 14. REGISTER AUTH MIDDLEWARE
 * ============================================================
 */

io.use(authenticateSocket);

/*
 * ============================================================
 * 15. CONNECTION HANDLER
 * ============================================================
 */

io.on("connection", (socket) => {
  /*
   * Authentication has already completed.
   *
   * Therefore:
   *
   * socket.data.user
   *
   * is available here.
   */

  console.log("Authenticated socket connected", {
    socketId: socket.id,

    user: socket.data.user,
  });

  /*
   * Example authenticated event.
   */

  socket.on("profile:get", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: socket.data.user,
    });
  });

  /*
   * Disconnect.
   */

  socket.on("disconnect", (reason) => {
    console.log("Authenticated socket disconnected", {
      socketId: socket.id,

      userId: socket.data.user?.id,

      reason,
    });
  });
});

/*
 * ============================================================
 * 16. CONNECTION ERROR
 * ============================================================
 */

io.engine.on("connection_error", (error) => {
  console.error("Engine connection error:", error.message);
});

/*
 * ============================================================
 * 17. START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`Socket.IO authentication server running on port ${PORT}`);
});

/*
 * ============================================================
 * 18. EXPORT
 * ============================================================
 */

export { io, httpServer };
