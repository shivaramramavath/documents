/**
 * ============================================================
 * 07_authentication/session-auth.js
 * ============================================================
 *
 * SOCKET.IO SESSION-BASED AUTHENTICATION
 *
 * Topics:
 *
 * 01. HTTP login
 * 02. Cookie
 * 03. Session ID
 * 04. Server-side session
 * 05. Socket.IO handshake
 * 06. Cookie parsing
 * 07. Session lookup
 * 08. Authentication middleware
 * 09. Session expiration
 * 10. Logout
 * 11. Session revocation
 * 12. Session regeneration
 * 13. Redis-backed sessions
 * 14. Session fixation
 * 15. Secure cookies
 * 16. HttpOnly
 * 17. SameSite
 * 18. Socket.IO authentication
 *
 * ============================================================
 */

import { createServer } from "node:http";

import { Server } from "socket.io";

import crypto from "node:crypto";

/*
 * ============================================================
 * 01. CONFIGURATION
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const SESSION_COOKIE = process.env.SESSION_COOKIE ?? "sid";

/*
 * Session lifetime:
 *
 * 24 hours.
 */

const SESSION_TTL = 1000 * 60 * 60 * 24;

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

  maxHttpBufferSize: 1e6,
});

/*
 * ============================================================
 * 04. SESSION STORE
 * ============================================================
 *
 * DEMO ONLY.
 *
 * This uses memory.
 *
 * Production:
 *
 *     Redis
 *     database
 *     distributed session store
 *
 * Do NOT use an in-memory Map for
 * multi-server production systems.
 *
 * ============================================================
 */

const sessions = new Map();

/*
 * Session structure:
 *
 * {
 *
 *   id,
 *
 *   userId,
 *
 *   createdAt,
 *
 *   expiresAt,
 *
 *   lastAccessedAt,
 *
 *   revoked,
 *
 * }
 */

/*
 * ============================================================
 * 05. DEMO USERS
 * ============================================================
 */

const users = new Map([
  [
    "user_1",
    {
      id: "user_1",

      username: "shiva",

      role: "user",
    },
  ],

  [
    "admin_1",
    {
      id: "admin_1",

      username: "admin",

      role: "admin",
    },
  ],
]);

/*
 * ============================================================
 * 06. GENERATE SESSION ID
 * ============================================================
 */

function generateSessionId() {
  /*
   * 32 random bytes.
   *
   * This produces a cryptographically
   * strong random identifier.
   */

  return crypto.randomBytes(32).toString("hex");
}

/*
 * ============================================================
 * 07. CREATE SESSION
 * ============================================================
 */

export function createSession(userId) {
  const user = users.get(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  const now = Date.now();

  const sessionId = generateSessionId();

  const session = {
    id: sessionId,

    userId: user.id,

    createdAt: now,

    lastAccessedAt: now,

    expiresAt: now + SESSION_TTL,

    revoked: false,
  };

  sessions.set(sessionId, session);

  return session;
}

/*
 * ============================================================
 * 08. GET SESSION
 * ============================================================
 */

export function getSession(sessionId) {
  if (typeof sessionId !== "string") {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  /*
   * Check revocation.
   */

  if (session.revoked) {
    sessions.delete(sessionId);

    return null;
  }

  /*
   * Check expiration.
   */

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);

    return null;
  }

  /*
   * Update access time.
   */

  session.lastAccessedAt = Date.now();

  return session;
}

/*
 * ============================================================
 * 09. REVOKE SESSION
 * ============================================================
 */

export function revokeSession(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    return false;
  }

  session.revoked = true;

  /*
   * Alternatively:
   *
   * sessions.delete(sessionId);
   *
   * Keeping the record temporarily can be
   * useful for audit/revocation logic.
   */

  return true;
}

/*
 * ============================================================
 * 10. DELETE SESSION
 * ============================================================
 */

export function destroySession(sessionId) {
  return sessions.delete(sessionId);
}

/*
 * ============================================================
 * 11. PARSE COOKIES
 * ============================================================
 *
 * Example:
 *
 * Cookie:
 *
 *     sid=abc123; theme=dark; lang=en
 *
 * becomes:
 *
 * {
 *   sid: "abc123",
 *   theme: "dark",
 *   lang: "en"
 * }
 *
 * ============================================================
 */

export function parseCookies(cookieHeader) {
  const cookies = {};

  if (typeof cookieHeader !== "string") {
    return cookies;
  }

  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const index = part.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key = part.slice(0, index).trim();

    const value = part.slice(index + 1).trim();

    if (!key) {
      continue;
    }

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      /*
       * Invalid encoded cookie.
       */

      cookies[key] = value;
    }
  }

  return cookies;
}

/*
 * ============================================================
 * 12. GET SESSION COOKIE
 * ============================================================
 */

export function getSessionIdFromSocket(socket) {
  /*
   * Socket.IO handshake headers.
   *
   * The browser sends:
   *
   * Cookie: sid=abc123
   */

  const cookieHeader = socket?.handshake?.headers?.cookie;

  const cookies = parseCookies(cookieHeader);

  return cookies[SESSION_COOKIE] ?? null;
}

/*
 * ============================================================
 * 13. LOAD USER
 * ============================================================
 */

export async function loadUser(userId) {
  /*
   * In production:
   *
   *     SELECT ...
   *
   * or:
   *
   *     Redis cache
   *
   * or:
   *
   *     user service
   */

  return users.get(userId) ?? null;
}

/*
 * ============================================================
 * 14. AUTHENTICATE SESSION
 * ============================================================
 */

export async function authenticateSession(socket) {
  /*
   * 1. Read session ID.
   */

  const sessionId = getSessionIdFromSocket(socket);

  if (!sessionId) {
    throw new Error("Session cookie is required");
  }

  /*
   * 2. Find session.
   */

  const session = getSession(sessionId);

  if (!session) {
    throw new Error("Invalid or expired session");
  }

  /*
   * 3. Find user.
   */

  const user = await loadUser(session.userId);

  if (!user) {
    throw new Error("Session user does not exist");
  }

  /*
   * 4. Attach authentication context.
   */

  socket.data.authenticated = true;

  socket.data.user = user;

  /*
   * Do not expose the complete session
   * unnecessarily.
   */

  socket.data.session = {
    id: session.id,

    createdAt: session.createdAt,

    expiresAt: session.expiresAt,

    lastAccessedAt: session.lastAccessedAt,
  };

  return user;
}

/*
 * ============================================================
 * 15. SOCKET.IO SESSION MIDDLEWARE
 * ============================================================
 */

export async function sessionMiddleware(socket, next) {
  try {
    await authenticateSession(socket);

    next();
  } catch (error) {
    const authError = new Error(
      error instanceof Error ? error.message : "Authentication failed",
    );

    authError.data = {
      code: "SESSION_AUTH_FAILED",

      message: authError.message,
    };

    next(authError);
  }
}

/*
 * ============================================================
 * 16. REGISTER AUTHENTICATION
 * ============================================================
 */

io.use(sessionMiddleware);

/*
 * ============================================================
 * 17. AUTHENTICATED CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Authenticated socket", {
    socketId: socket.id,

    userId: socket.data.user.id,

    sessionId: socket.data.session.id,
  });

  /*
   * --------------------------------------------------------
   * GET CURRENT USER
   * --------------------------------------------------------
   */

  socket.on("auth:me", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        user: socket.data.user,

        session: socket.data.session,
      },
    });
  });

  /*
   * --------------------------------------------------------
   * LOGOUT
   * --------------------------------------------------------
   */

  socket.on("auth:logout", (acknowledge) => {
    const sessionId = socket.data.session.id;

    revokeSession(sessionId);

    acknowledge?.({
      success: true,

      message: "Session revoked",
    });

    /*
     * Disconnect this socket.
     */

    socket.disconnect(true);
  });

  /*
   * --------------------------------------------------------
   * PROTECTED EVENT
   * --------------------------------------------------------
   */

  socket.on("private:data", (payload, acknowledge) => {
    const user = socket.data.user;

    acknowledge?.({
      success: true,

      data: {
        userId: user.id,

        username: user.username,

        payload,
      },
    });
  });

  /*
   * --------------------------------------------------------
   * DISCONNECT
   * --------------------------------------------------------
   */

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected", {
      socketId: socket.id,

      userId: socket.data.user?.id,

      reason,
    });
  });
});

/*
 * ============================================================
 * 18. HTTP LOGIN EXAMPLE
 * ============================================================
 *
 * This demonstrates how a normal HTTP login could create
 * a session before Socket.IO connects.
 *
 * NOTE:
 *
 * This is intentionally simplified.
 *
 * Production authentication must verify passwords
 * using a secure password-hashing scheme.
 *
 * ============================================================
 */

function sendSessionCookie(response, sessionId) {
  const cookie = [
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,

    /*
     * Prevent JavaScript from reading it.
     */
    "HttpOnly",

    /*
     * Send only over HTTPS in production.
     *
     * Set this dynamically depending on environment.
     */
    process.env.NODE_ENV === "production" ? "Secure" : "",

    /*
     * Controls cross-site cookie behavior.
     */
    "SameSite=Lax",

    /*
     * Cookie available to the whole application.
     */
    "Path=/",

    /*
     * Browser expiration.
     */
    `Max-Age=${Math.floor(SESSION_TTL / 1000)}`,
  ]
    .filter(Boolean)
    .join("; ");

  response.setHeader("Set-Cookie", cookie);
}

/*
 * ============================================================
 * 19. HTTP LOGIN ROUTE
 * ============================================================
 *
 * DEMONSTRATION ONLY.
 *
 * Real login:
 *
 *     POST /login
 *
 *     verify username/password
 *     create session
 *     Set-Cookie
 *
 * ============================================================
 */

function handleLogin(request, response) {
  if (request.method !== "POST" || request.url !== "/login") {
    return false;
  }

  /*
   * DEMO:
   *
   * Always authenticate user_1.
   *
   * Replace this with real credential
   * verification.
   */

  const userId = "user_1";

  const session = createSession(userId);

  sendSessionCookie(response, session.id);

  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json");

  response.end(
    JSON.stringify({
      success: true,

      message: "Logged in",
    }),
  );

  return true;
}

/*
 * ============================================================
 * 20. HTTP LOGOUT
 * ============================================================
 */

function handleLogout(request, response) {
  if (request.method !== "POST" || request.url !== "/logout") {
    return false;
  }

  const cookies = parseCookies(request.headers.cookie);

  const sessionId = cookies[SESSION_COOKIE];

  if (sessionId) {
    revokeSession(sessionId);
  }

  /*
   * Delete browser cookie.
   */

  response.setHeader(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=`,
      "HttpOnly",
      "SameSite=Lax",
      "Path=/",
      "Max-Age=0",
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; "),
  );

  response.statusCode = 200;

  response.end(
    JSON.stringify({
      success: true,

      message: "Logged out",
    }),
  );

  return true;
}

/*
 * ============================================================
 * 21. HTTP REQUEST HANDLING
 * ============================================================
 */

const socketHttpServer = httpServer.listeners("request")[0];

/*
 * Remove the existing request listener
 * created by createServer().
 *
 * We replace it with our own.
 */

if (socketHttpServer) {
  httpServer.removeListener("request", socketHttpServer);
}

httpServer.on("request", (request, response) => {
  if (handleLogin(request, response)) {
    return;
  }

  if (handleLogout(request, response)) {
    return;
  }

  response.statusCode = 404;

  response.setHeader("Content-Type", "application/json");

  response.end(
    JSON.stringify({
      error: "Not found",
    }),
  );
});

/*
 * ============================================================
 * 22. SESSION CLEANUP
 * ============================================================
 *
 * Memory store requires cleanup.
 *
 * Redis/database stores normally have their own
 * expiration mechanisms.
 *
 * ============================================================
 */

const cleanupTimer = setInterval(
  () => {
    const now = Date.now();

    for (const [sessionId, session] of sessions) {
      if (session.revoked || session.expiresAt <= now) {
        sessions.delete(sessionId);
      }
    }
  },

  /*
   * Run every 5 minutes.
   */
  1000 * 60 * 5,
);

/*
 * Don't keep Node.js alive only because of cleanup.
 */

cleanupTimer.unref();

/*
 * ============================================================
 * 23. START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`Session Socket.IO server running on port ${PORT}`);
});

/*
 * ============================================================
 * 24. EXPORTS
 * ============================================================
 */

export { io, httpServer, sessions };
