/**
 * ============================================================
 * 07_authentication/jwt-auth.js
 * ============================================================
 *
 * SOCKET.IO + JWT AUTHENTICATION
 *
 * Authentication:
 *
 *     "Who is this socket?"
 *
 * Authorization:
 *
 *     "What is this socket allowed to do?"
 *
 * Authorization is handled separately.
 *
 * ============================================================
 *
 * JWT:
 *
 *     HEADER.PAYLOAD.SIGNATURE
 *
 * Example:
 *
 *     eyJhbGciOiJIUzI1NiIs...
 *     .
 *     eyJzdWIiOiIxMjMi...
 *     .
 *     abc123...
 *
 * ============================================================
 */

import { createServer } from "node:http";

import { Server } from "socket.io";

import jwt from "jsonwebtoken";

/*
 * ============================================================
 * 01. CONFIGURATION
 * ============================================================
 */

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

/*
 * ============================================================
 * 02. JWT CONFIGURATION
 * ============================================================
 *
 * IMPORTANT:
 *
 * Never hard-code production secrets.
 *
 * Use environment variables or a secret manager.
 *
 * ============================================================
 */

const JWT_SECRET =
  process.env.JWT_SECRET ?? "development-only-secret-change-me";

const JWT_ISSUER = process.env.JWT_ISSUER ?? "my-socket-api";

const JWT_AUDIENCE = process.env.JWT_AUDIENCE ?? "my-socket-client";

/*
 * Allowed signing algorithm.
 *
 * HS256 means:
 *
 *     HMAC + SHA-256
 *
 * For asymmetric production systems you may use:
 *
 *     RS256
 *     ES256
 *
 * depending on your architecture.
 */
const JWT_ALGORITHM = "HS256";

/*
 * ============================================================
 * 03. HTTP SERVER
 * ============================================================
 */

const httpServer = createServer();

/*
 * ============================================================
 * 04. SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,

    credentials: true,

    methods: ["GET", "POST"],
  },

  /*
   * Maximum packet size.
   *
   * Prevents excessively large packets.
   */
  maxHttpBufferSize: 1e6,
});

/*
 * ============================================================
 * 05. AUTHENTICATION ERROR
 * ============================================================
 */

export class JWTAuthenticationError extends Error {
  constructor(message, code = "AUTHENTICATION_ERROR") {
    super(message);

    this.name = "JWTAuthenticationError";

    this.code = code;
  }
}

/*
 * ============================================================
 * 06. JWT CLAIMS
 * ============================================================
 *
 * Standard claims:
 *
 * sub
 * iss
 * aud
 * exp
 * iat
 * nbf
 * jti
 *
 * ============================================================
 */

/**
 * Example JWT payload:
 *
 * {
 *   sub: "user_123",
 *   iss: "my-socket-api",
 *   aud: "my-socket-client",
 *   iat: 1234567890,
 *   exp: 1234571490,
 *   jti: "unique-token-id"
 * }
 */

/*
 * ============================================================
 * 07. CREATE ACCESS TOKEN
 * ============================================================
 */

export function createAccessToken(user) {
  if (!user?.id) {
    throw new Error("User ID is required");
  }

  const payload = {
    /*
     * Subject.
     *
     * Usually the authenticated user's ID.
     */
    sub: String(user.id),

    /*
     * Optional application claims.
     *
     * Do not put sensitive information here.
     */
    username: user.username,

    role: user.role ?? "user",
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    /*
     * Token algorithm.
     */
    algorithm: JWT_ALGORITHM,

    /*
     * Who issued the token.
     */
    issuer: JWT_ISSUER,

    /*
     * Who the token is intended for.
     */
    audience: JWT_AUDIENCE,

    /*
     * Token lifetime.
     *
     * 15 minutes.
     */
    expiresIn: "15m",

    /*
     * Unique JWT ID.
     *
     * Useful for revocation / tracing.
     */
    jwtid: cryptoRandomId(),
  });

  return token;
}

/*
 * ============================================================
 * 08. SIMPLE RANDOM JWT ID
 * ============================================================
 *
 * For production you can use crypto.randomUUID().
 *
 * ============================================================
 */

import { randomUUID } from "node:crypto";

function cryptoRandomId() {
  return randomUUID();
}

/*
 * ============================================================
 * 09. CREATE REFRESH TOKEN
 * ============================================================
 *
 * Refresh tokens are intentionally longer lived.
 *
 * In a real system:
 *
 *     store a hash / identifier server-side
 *
 * and support revocation.
 *
 * ============================================================
 */

export function createRefreshToken(user) {
  if (!user?.id) {
    throw new Error("User ID is required");
  }

  return jwt.sign(
    {
      sub: String(user.id),

      type: "refresh",
    },

    JWT_SECRET,

    {
      algorithm: JWT_ALGORITHM,

      issuer: JWT_ISSUER,

      audience: JWT_AUDIENCE,

      expiresIn: "30d",

      jwtid: cryptoRandomId(),
    },
  );
}

/*
 * ============================================================
 * 10. EXTRACT TOKEN FROM socket.handshake.auth
 * ============================================================
 *
 * Client:
 *
 * io("http://localhost:3000", {
 *
 *   auth: {
 *     token: "JWT"
 *   }
 *
 * });
 *
 * ============================================================
 */

export function getHandshakeToken(socket) {
  const token = socket?.handshake?.auth?.token;

  if (typeof token !== "string") {
    return null;
  }

  const normalized = token.trim();

  if (normalized.length === 0) {
    return null;
  }

  return normalized;
}

/*
 * ============================================================
 * 11. EXTRACT BEARER TOKEN
 * ============================================================
 *
 * Authorization:
 *
 *     Bearer <JWT>
 *
 * ============================================================
 */

export function getAuthorizationToken(socket) {
  const authorization = socket?.handshake?.headers?.authorization;

  if (typeof authorization !== "string") {
    return null;
  }

  const parts = authorization.trim().split(/\s+/);

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (scheme.toLowerCase() !== "bearer") {
    return null;
  }

  if (!token) {
    return null;
  }

  return token;
}

/*
 * ============================================================
 * 12. EXTRACT JWT
 * ============================================================
 *
 * Priority:
 *
 * 1. handshake.auth.token
 * 2. Authorization header
 *
 * ============================================================
 */

export function extractJWT(socket) {
  const handshakeToken = getHandshakeToken(socket);

  if (handshakeToken) {
    return handshakeToken;
  }

  const authorizationToken = getAuthorizationToken(socket);

  if (authorizationToken) {
    return authorizationToken;
  }

  return null;
}

/*
 * ============================================================
 * 13. BASIC JWT FORMAT CHECK
 * ============================================================
 *
 * A JWT normally has:
 *
 *     header.payload.signature
 *
 * This only checks structure.
 *
 * It DOES NOT verify authenticity.
 *
 * ============================================================
 */

export function isJWTFormat(token) {
  if (typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");

  return parts.length === 3;
}

/*
 * ============================================================
 * 14. VERIFY JWT
 * ============================================================
 */

export function verifyAccessToken(token) {
  if (!isJWTFormat(token)) {
    throw new JWTAuthenticationError("Malformed JWT", "INVALID_TOKEN");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      /*
       * NEVER allow arbitrary algorithms.
       */
      algorithms: [JWT_ALGORITHM],

      /*
       * Verify issuer.
       */
      issuer: JWT_ISSUER,

      /*
       * Verify audience.
       */
      audience: JWT_AUDIENCE,
    });

    /*
     * jwt.verify() can return
     * string | JwtPayload.
     *
     * We require an object.
     */

    if (typeof payload !== "object" || payload === null) {
      throw new JWTAuthenticationError("Invalid JWT payload", "INVALID_TOKEN");
    }

    /*
     * Require subject.
     */

    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      throw new JWTAuthenticationError(
        "JWT subject is missing",
        "INVALID_TOKEN",
      );
    }

    return payload;
  } catch (error) {
    /*
     * Preserve our own errors.
     */

    if (error instanceof JWTAuthenticationError) {
      throw error;
    }

    /*
     * JWT expired.
     */

    if (error instanceof jwt.TokenExpiredError) {
      throw new JWTAuthenticationError("JWT has expired", "TOKEN_EXPIRED");
    }

    /*
     * Invalid signature.
     */

    if (error instanceof jwt.JsonWebTokenError) {
      throw new JWTAuthenticationError("Invalid JWT", "INVALID_TOKEN");
    }

    /*
     * Unexpected error.
     */

    throw new JWTAuthenticationError(
      "JWT verification failed",
      "AUTHENTICATION_ERROR",
    );
  }
}

/*
 * ============================================================
 * 15. VERIFY REFRESH TOKEN
 * ============================================================
 */

export function verifyRefreshToken(token) {
  const payload = verifyAccessToken(token);

  if (payload.type !== "refresh") {
    throw new JWTAuthenticationError(
      "Invalid refresh token",
      "INVALID_REFRESH_TOKEN",
    );
  }

  return payload;
}

/*
 * ============================================================
 * 16. CONVERT JWT CLAIMS INTO USER
 * ============================================================
 */

export function claimsToUser(claims) {
  return {
    id: claims.sub,

    username: typeof claims.username === "string" ? claims.username : undefined,

    role: typeof claims.role === "string" ? claims.role : "user",
  };
}

/*
 * ============================================================
 * 17. AUTHENTICATE SOCKET
 * ============================================================
 */

export async function authenticateJWT(socket) {
  /*
   * Extract token.
   */

  const token = extractJWT(socket);

  if (!token) {
    throw new JWTAuthenticationError("JWT is required", "TOKEN_REQUIRED");
  }

  /*
   * Verify signature,
   * expiration,
   * issuer,
   * audience,
   * algorithm.
   */

  const claims = verifyAccessToken(token);

  /*
   * Convert claims into
   * application user.
   */

  const user = claimsToUser(claims);

  /*
   * Store authenticated
   * identity on socket.
   */

  socket.data.user = user;

  /*
   * Store JWT metadata.
   */

  socket.data.jwt = {
    jti: typeof claims.jti === "string" ? claims.jti : undefined,

    issuer: claims.iss,

    audience: claims.aud,

    issuedAt: claims.iat,

    expiresAt: claims.exp,
  };

  socket.data.authenticated = true;

  return user;
}

/*
 * ============================================================
 * 18. SOCKET.IO AUTH MIDDLEWARE
 * ============================================================
 */

export async function jwtMiddleware(socket, next) {
  try {
    await authenticateJWT(socket);

    /*
     * Authentication succeeded.
     */

    next();
  } catch (error) {
    const code =
      error instanceof JWTAuthenticationError
        ? error.code
        : "AUTHENTICATION_ERROR";

    const message =
      error instanceof Error ? error.message : "Authentication failed";

    /*
     * Client receives this
     * through connect_error.
     */

    const authError = new Error(message);

    authError.data = {
      code,

      message,
    };

    next(authError);
  }
}

/*
 * ============================================================
 * 19. REGISTER JWT MIDDLEWARE
 * ============================================================
 */

io.use(jwtMiddleware);

/*
 * ============================================================
 * 20. AUTHENTICATED CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Authenticated socket:", {
    socketId: socket.id,

    userId: socket.data.user.id,

    username: socket.data.user.username,
  });

  /*
   * ========================================================
   * AUTHENTICATED PROFILE EVENT
   * ========================================================
   */

  socket.on("auth:me", (acknowledge) => {
    acknowledge?.({
      success: true,

      data: {
        user: socket.data.user,

        authenticated: socket.data.authenticated,
      },
    });
  });

  /*
   * ========================================================
   * EXAMPLE PROTECTED EVENT
   * ========================================================
   */

  socket.on("private:data", (payload, acknowledge) => {
    /*
     * DO NOT use payload.userId
     * as the authenticated identity.
     */

    const userId = socket.data.user.id;

    console.log("Authenticated user:", userId);

    acknowledge?.({
      success: true,

      data: {
        userId,

        payload,
      },
    });
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", {
      socketId: socket.id,

      userId: socket.data.user?.id,

      reason,
    });
  });
});

/*
 * ============================================================
 * 21. START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
  console.log(`JWT Socket.IO server running on port ${PORT}`);
});

/*
 * ============================================================
 * 22. EXPORTS
 * ============================================================
 */

export { io, httpServer };
