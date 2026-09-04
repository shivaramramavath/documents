/**
 * ============================================================
 * 09_rooms/private-room.js
 * ============================================================
 *
 * PRIVATE ROOMS IN SOCKET.IO
 *
 * Covers:
 *
 * 01. Private room concepts
 * 02. Socket ID vs User ID
 * 03. User rooms
 * 04. Joining a private user room
 * 05. Multiple devices / tabs
 * 06. Conversation rooms
 * 07. Private messaging
 * 08. Authorization
 * 09. Membership validation
 * 10. Sending to one user
 * 11. Sending to multiple users
 * 12. Sending to conversation members
 * 13. Online presence
 * 14. Disconnect handling
 * 15. Room membership inspection
 * 16. Secure room naming
 * 17. Preventing arbitrary room access
 * 18. ACK handling
 * 19. Async handlers
 * 20. Error handling
 * 21. Production patterns
 *
 * ============================================================
 */

/*
 * ============================================================
 * 01. ROOM PREFIXES
 * ============================================================
 *
 * Use predictable namespaces for different types of rooms.
 *
 * Examples:
 *
 *     user:123
 *     conversation:456
 *     team:789
 *     project:100
 *     organization:200
 *
 * ============================================================
 */

export const PRIVATE_ROOM_PREFIX = Object.freeze({
  USER: "user",

  CONVERSATION: "conversation",

  TEAM: "team",

  PROJECT: "project",

  ORGANIZATION: "organization",
});

/*
 * ============================================================
 * 02. ROOM BUILDERS
 * ============================================================
 */

export function userRoom(userId) {
  return `user:${userId}`;
}

export function conversationRoom(conversationId) {
  return `conversation:${conversationId}`;
}

export function teamRoom(teamId) {
  return `team:${teamId}`;
}

export function projectRoom(projectId) {
  return `project:${projectId}`;
}

export function organizationRoom(organizationId) {
  return `organization:${organizationId}`;
}

/*
 * ============================================================
 * 03. VALIDATE IDENTIFIER
 * ============================================================
 */

export function validateId(id, fieldName = "id") {
  if (typeof id !== "string") {
    throw new TypeError(`${fieldName} must be a string`);
  }

  const normalized = id.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }

  if (normalized.length > 200) {
    throw new Error(`${fieldName} is too long`);
  }

  return normalized;
}

/*
 * ============================================================
 * 04. SOCKET USER
 * ============================================================
 *
 * Authentication middleware should normally populate:
 *
 *     socket.data.user
 *
 * Example:
 *
 *     socket.data.user = {
 *
 *       id: "user-123",
 *
 *       role: "user"
 *
 *     }
 *
 * ============================================================
 */

export function getAuthenticatedUser(socket) {
  const user = socket?.data?.user;

  if (!user?.id) {
    throw new Error("Socket is not authenticated");
  }

  return user;
}

/*
 * ============================================================
 * 05. JOIN USER PRIVATE ROOM
 * ============================================================
 *
 * IMPORTANT:
 *
 * The client should NOT decide:
 *
 *     "I want to join user:999"
 *
 * Instead the server determines the user's own room
 * from authenticated identity.
 *
 * ============================================================
 */

export function joinOwnUserRoom(socket) {
  const user = getAuthenticatedUser(socket);

  const room = userRoom(user.id);

  socket.join(room);

  return room;
}

/*
 * ============================================================
 * 06. USER ROOM WITH METADATA
 * ============================================================
 */

export function joinUserRoom(socket) {
  const user = getAuthenticatedUser(socket);

  const room = userRoom(user.id);

  socket.join(room);

  return {
    room,

    userId: user.id,

    socketId: socket.id,

    joinedAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * 07. MULTIPLE CONNECTIONS
 * ============================================================
 *
 * A user can have:
 *
 *     Chrome
 *     Firefox
 *     Mobile
 *     Tablet
 *     Another browser tab
 *
 *
 * All connections can join:
 *
 *     user:123
 *
 *
 * Example:
 *
 *             user:123
 *                 │
 *        ┌────────┼────────┐
 *        │        │        │
 *      tab-1    tab-2    mobile
 *
 * Then:
 *
 *     io.to("user:123").emit(...)
 *
 * reaches all of them.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 08. SEND TO ONE USER
 * ============================================================
 */

export function emitToUser(io, userId, event, data) {
  const validatedUserId = validateId(userId, "userId");

  const room = userRoom(validatedUserId);

  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 09. SEND PRIVATE NOTIFICATION
 * ============================================================
 */

export function notifyUser(io, userId, notification) {
  emitToUser(io, userId, "notification", {
    notification,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 10. SEND TO ONE SPECIFIC SOCKET
 * ============================================================
 *
 * This targets one connection, not all connections
 * belonging to a user.
 *
 * ============================================================
 */

export function emitToSocket(io, socketId, event, data) {
  const validatedSocketId = validateId(socketId, "socketId");

  io.to(validatedSocketId).emit(event, data);
}

/*
 * ============================================================
 * 11. USER VS SOCKET
 * ============================================================
 *
 * Socket:
 *
 *     socket.id
 *
 * identifies ONE CONNECTION.
 *
 *
 * User:
 *
 *     socket.data.user.id
 *
 * identifies the authenticated USER.
 *
 *
 * Therefore:
 *
 *     io.to(socket.id)
 *
 *     -> one connection
 *
 *
 * while:
 *
 *     io.to(userRoom(userId))
 *
 *     -> all active connections for that user
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. SEND TO MULTIPLE USERS
 * ============================================================
 */

export function emitToUsers(io, userIds, event, data) {
  if (!Array.isArray(userIds)) {
    throw new TypeError("userIds must be an array");
  }

  let emitter = io;

  for (const userId of userIds) {
    const validated = validateId(userId, "userId");

    emitter = emitter.to(userRoom(validated));
  }

  emitter.emit(event, data);
}

/*
 * ============================================================
 * 13. PRIVATE CONVERSATION ROOM
 * ============================================================
 */

export function joinConversationRoom(socket, conversationId) {
  const user = getAuthenticatedUser(socket);

  const validatedConversationId = validateId(conversationId, "conversationId");

  const room = conversationRoom(validatedConversationId);

  socket.join(room);

  return {
    room,

    conversationId: validatedConversationId,

    userId: user.id,

    socketId: socket.id,
  };
}

/*
 * ============================================================
 * 14. IMPORTANT SECURITY RULE
 * ============================================================
 *
 * NEVER blindly do:
 *
 *     socket.join(
 *       `conversation:${payload.conversationId}`
 *     );
 *
 * without checking whether the user belongs
 * to that conversation.
 *
 * Correct:
 *
 *     authenticate
 *          ↓
 *     validate
 *          ↓
 *     check membership
 *          ↓
 *     join
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. AUTHORIZED CONVERSATION JOIN
 * ============================================================
 */

export async function joinPrivateConversation(
  socket,
  conversationId,
  { isMember } = {},
) {
  const user = getAuthenticatedUser(socket);

  const validatedConversationId = validateId(conversationId, "conversationId");

  if (typeof isMember !== "function") {
    throw new Error("isMember function is required");
  }

  const allowed = await isMember(user.id, validatedConversationId);

  if (!allowed) {
    throw new Error("You are not a member of this conversation");
  }

  const room = conversationRoom(validatedConversationId);

  socket.join(room);

  return room;
}

/*
 * ============================================================
 * 16. SEND TO CONVERSATION
 * ============================================================
 */

export function emitToConversation(io, conversationId, event, data) {
  const validatedConversationId = validateId(conversationId, "conversationId");

  io.to(conversationRoom(validatedConversationId)).emit(event, data);
}

/*
 * ============================================================
 * 17. PRIVATE MESSAGE
 * ============================================================
 */

export function emitPrivateMessage(
  io,
  { conversationId, messageId, senderId, content, createdAt },
) {
  const payload = {
    messageId,

    conversationId,

    senderId,

    content,

    createdAt,

    timestamp: new Date().toISOString(),
  };

  emitToConversation(io, conversationId, "message:created", payload);
}

/*
 * ============================================================
 * 18. PRIVATE MESSAGE TO USER
 * ============================================================
 *
 * Useful for:
 *
 *     direct notifications
 *     alerts
 *     account updates
 *     security notifications
 *
 * ============================================================
 */

export function sendPrivateEvent(io, userId, event, data) {
  emitToUser(io, userId, event, data);
}

/*
 * ============================================================
 * 19. PRIVATE EVENT WITH ACK
 * ============================================================
 */

export async function sendPrivateRequest(
  socket,
  io,
  { targetUserId, event, data },
) {
  const sender = getAuthenticatedUser(socket);

  const payload = {
    senderId: sender.id,

    data,

    timestamp: new Date().toISOString(),
  };

  io.to(userRoom(targetUserId)).emit(event, payload);
}

/*
 * ============================================================
 * 20. CONVERSATION MEMBERS
 * ============================================================
 *
 * A conversation might have:
 *
 *     Alice
 *     Bob
 *     Charlie
 *
 * If all are joined to:
 *
 *     conversation:100
 *
 * then:
 *
 *     io.to("conversation:100").emit(...)
 *
 * reaches all connected members.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. CHECK WHETHER SOCKET IS IN ROOM
 * ============================================================
 */

export function isSocketInRoom(socket, room) {
  return socket.rooms.has(room);
}

/*
 * ============================================================
 * 22. GET USER ROOM
 * ============================================================
 */

export function getUserRoom(userId) {
  return userRoom(validateId(userId, "userId"));
}

/*
 * ============================================================
 * 23. GET CONVERSATION ROOM
 * ============================================================
 */

export function getConversationRoom(conversationId) {
  return conversationRoom(validateId(conversationId, "conversationId"));
}

/*
 * ============================================================
 * 24. ROOM MEMBERS
 * ============================================================
 */

export function getRoomMembers(io, room) {
  const sockets = io.sockets.adapter.rooms.get(room);

  if (!sockets) {
    return [];
  }

  return [...sockets];
}

/*
 * ============================================================
 * 25. ROOM MEMBER COUNT
 * ============================================================
 */

export function getRoomMemberCount(io, room) {
  return io.sockets.adapter.rooms.get(room)?.size ?? 0;
}

/*
 * ============================================================
 * 26. USER ONLINE CHECK
 * ============================================================
 *
 * A user is considered connected if their user room
 * contains at least one socket.
 *
 * ============================================================
 */

export function isUserOnline(io, userId) {
  const room = userRoom(validateId(userId, "userId"));

  return getRoomMemberCount(io, room) > 0;
}

/*
 * ============================================================
 * 27. USER CONNECTION COUNT
 * ============================================================
 */

export function getUserConnectionCount(io, userId) {
  return getRoomMemberCount(io, userRoom(validateId(userId, "userId")));
}

/*
 * ============================================================
 * 28. PRESENCE EVENT
 * ============================================================
 */

export function emitUserPresence(io, userId, status) {
  emitToUser(io, userId, "presence", {
    userId,

    status,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 29. TYPING TO CONVERSATION
 * ============================================================
 */

export function emitTypingToConversation(socket, conversationId, userId) {
  const room = conversationRoom(validateId(conversationId, "conversationId"));

  socket.to(room).emit("typing:start", {
    conversationId,

    userId,

    timestamp: Date.now(),
  });
}

/*
 * ============================================================
 * 30. STOP TYPING
 * ============================================================
 */

export function emitStoppedTypingToConversation(
  socket,
  conversationId,
  userId,
) {
  const room = conversationRoom(validateId(conversationId, "conversationId"));

  socket.to(room).emit("typing:stop", {
    conversationId,

    userId,

    timestamp: Date.now(),
  });
}

/*
 * ============================================================
 * 31. SECURE JOIN HANDLER
 * ============================================================
 */

export function registerPrivateRoomHandler(socket, { isMember } = {}) {
  socket.on("conversation:join", async (payload, acknowledge) => {
    try {
      if (!payload?.conversationId) {
        throw new Error("conversationId is required");
      }

      const room = await joinPrivateConversation(
        socket,
        payload.conversationId,
        {
          isMember,
        },
      );

      acknowledge?.({
        success: true,

        room,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to join conversation",
      });
    }
  });
}

/*
 * ============================================================
 * 32. PRIVATE MESSAGE HANDLER
 * ============================================================
 */

export function registerPrivateMessageHandler(
  socket,
  io,
  { isMember, saveMessage } = {},
) {
  socket.on("conversation:message", async (payload, acknowledge) => {
    try {
      const user = getAuthenticatedUser(socket);

      if (!payload?.conversationId) {
        throw new Error("conversationId is required");
      }

      if (typeof payload.content !== "string") {
        throw new Error("content must be a string");
      }

      /*
       * Authorization.
       */

      if (typeof isMember !== "function") {
        throw new Error("Membership checker is required");
      }

      const allowed = await isMember(user.id, payload.conversationId);

      if (!allowed) {
        throw new Error("Not authorized");
      }

      /*
       * Persist.
       */

      let message;

      if (typeof saveMessage === "function") {
        message = await saveMessage({
          conversationId: payload.conversationId,

          senderId: user.id,

          content: payload.content,
        });
      } else {
        message = {
          id: crypto.randomUUID(),

          conversationId: payload.conversationId,

          senderId: user.id,

          content: payload.content,

          createdAt: new Date().toISOString(),
        };
      }

      /*
       * Broadcast.
       */

      emitPrivateMessage(io, {
        conversationId: message.conversationId,

        messageId: message.id,

        senderId: message.senderId,

        content: message.content,

        createdAt: message.createdAt,
      });

      /*
       * ACK.
       */

      acknowledge?.({
        success: true,

        messageId: message.id,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Message failed",
      });
    }
  });
}

/*
 * ============================================================
 * 33. PRIVATE NOTIFICATION
 * ============================================================
 */

export function registerNotificationSender(io) {
  return function sendNotification(userId, notification) {
    emitToUser(io, userId, "notification:new", {
      notification,

      timestamp: new Date().toISOString(),
    });
  };
}

/*
 * ============================================================
 * 34. USER ACCOUNT UPDATE
 * ============================================================
 */

export function emitAccountUpdate(io, userId, update) {
  emitToUser(io, userId, "account:updated", {
    update,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 35. LOGOUT ALL DEVICES
 * ============================================================
 *
 * Because all connections are in:
 *
 *     user:${userId}
 *
 * the server can send:
 *
 *     auth:logout
 *
 * to every active connection.
 *
 * ============================================================
 */

export function logoutAllUserConnections(io, userId) {
  emitToUser(io, userId, "auth:logout", {
    reason: "logout_all_devices",

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 36. FORCE DISCONNECT ALL USER CONNECTIONS
 * ============================================================
 *
 * Useful for:
 *
 *     account compromise
 *     administrator action
 *     security event
 *
 * ============================================================
 */

export async function disconnectAllUserConnections(io, userId) {
  const room = userRoom(validateId(userId, "userId"));

  const sockets = await io.in(room).fetchSockets();

  for (const socket of sockets) {
    socket.disconnect(true);
  }
}

/*
 * ============================================================
 * 37. FIND USER CONNECTIONS
 * ============================================================
 */

export async function getUserSockets(io, userId) {
  const room = userRoom(validateId(userId, "userId"));

  return io.in(room).fetchSockets();
}

/*
 * ============================================================
 * 38. GET USER SOCKET IDS
 * ============================================================
 */

export async function getUserSocketIds(io, userId) {
  const sockets = await getUserSockets(io, userId);

  return sockets.map((socket) => socket.id);
}

/*
 * ============================================================
 * 39. PRIVATE ROOM SECURITY
 * ============================================================
 *
 * NEVER trust:
 *
 *     payload.userId
 *
 * for authentication.
 *
 *
 * BAD:
 *
 *     socket.on("private:join", ({ userId }) => {
 *
 *       socket.join(`user:${userId}`);
 *
 *     });
 *
 *
 * An attacker could send:
 *
 *     {
 *       userId: "admin"
 *     }
 *
 *
 * BETTER:
 *
 *     const userId =
 *       socket.data.user.id;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. SECURE PRIVATE USER ROOM
 * ============================================================
 */

export function secureJoinOwnRoom(socket) {
  const user = getAuthenticatedUser(socket);

  const room = userRoom(user.id);

  socket.join(room);

  return {
    userId: user.id,

    room,
  };
}

/*
 * ============================================================
 * 41. ROOM MEMBERSHIP CHECK
 * ============================================================
 */

export async function requireConversationMembership(
  socket,
  conversationId,
  isMember,
) {
  const user = getAuthenticatedUser(socket);

  if (typeof isMember !== "function") {
    throw new Error("Membership checker required");
  }

  const allowed = await isMember(user.id, conversationId);

  if (!allowed) {
    throw new Error("Conversation access denied");
  }

  return true;
}

/*
 * ============================================================
 * 42. SAFE PRIVATE MESSAGE FLOW
 * ============================================================
 *
 * Complete flow:
 *
 * Client
 *   │
 *   │ conversation:message
 *   ▼
 * Authentication
 *   │
 *   ▼
 * Payload validation
 *   │
 *   ▼
 * Authorization
 *   │
 *   ▼
 * Database
 *   │
 *   ▼
 * Commit
 *   │
 *   ▼
 * io.to(conversationRoom)
 *   │
 *   ├── Alice
 *   ├── Bob
 *   └── Charlie
 *   │
 *   ▼
 * ACK sender
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. ROOM NAMING RULES
 * ============================================================
 *
 * GOOD:
 *
 *     user:123
 *     conversation:456
 *     team:789
 *
 *
 * BAD:
 *
 *     123
 *     abc
 *     private
 *
 *
 * Namespaces make debugging and authorization easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. DON'T PUT SENSITIVE DATA IN ROOM NAME
 * ============================================================
 *
 * Avoid:
 *
 *     user:email@example.com
 *
 *     user:phone-number
 *
 *     user:password
 *
 *
 * Prefer:
 *
 *     user:internal-user-id
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. PRIVATE ROOM IS NOT ENCRYPTION
 * ============================================================
 *
 * A room does NOT provide:
 *
 *     end-to-end encryption
 *     database security
 *     authorization automatically
 *     authentication automatically
 *
 *
 * Room security comes from your application logic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. PRIVATE ROOM + AUTHENTICATION
 * ============================================================
 */

export async function initializePrivateRooms(
  socket,
  { loadUserConversations } = {},
) {
  const user = getAuthenticatedUser(socket);

  /*
   * Always join the user's own room.
   */

  joinOwnUserRoom(socket);

  /*
   * Optionally load authorized conversations.
   */

  if (typeof loadUserConversations === "function") {
    const conversations = await loadUserConversations(user.id);

    for (const conversationId of conversations) {
      socket.join(conversationRoom(conversationId));
    }
  }
}

/*
 * ============================================================
 * 47. DISCONNECT INFORMATION
 * ============================================================
 */

export function getUserConnectionState(io, userId) {
  const connectionCount = getUserConnectionCount(io, userId);

  return {
    userId,

    online: connectionCount > 0,

    connectionCount,
  };
}

/*
 * ============================================================
 * 48. USER ONLINE / OFFLINE EVENT
 * ============================================================
 *
 * Be careful with disconnect events.
 *
 * If a user has:
 *
 *     3 connections
 *
 * and one disconnects:
 *
 *     3 → 2
 *
 * the user is STILL online.
 *
 * Only:
 *
 *     1 → 0
 *
 * means all connections disappeared.
 *
 * ============================================================
 */

export async function handleUserDisconnect(
  io,
  userId,
  { onOnlineStateChanged } = {},
) {
  const count = getUserConnectionCount(io, userId);

  const online = count > 0;

  if (typeof onOnlineStateChanged === "function") {
    await onOnlineStateChanged({
      userId,

      online,

      connectionCount: count,
    });
  }

  return {
    online,

    connectionCount: count,
  };
}

/*
 * ============================================================
 * 49. PRIVATE ROOM EVENTS
 * ============================================================
 */

export const PRIVATE_EVENTS = Object.freeze({
  MESSAGE: "private:message",

  NOTIFICATION: "private:notification",

  PRESENCE: "private:presence",

  ACCOUNT_UPDATE: "private:account-update",

  LOGOUT: "private:logout",

  ERROR: "private:error",
});

/*
 * ============================================================
 * 50. PRIVATE EVENT PAYLOAD
 * ============================================================
 */

export function createPrivateEvent({
  eventId,
  type,
  senderId,
  recipientId,
  data,
  requestId,
}) {
  return {
    eventId,

    type,

    senderId,

    recipientId,

    data,

    requestId,

    timestamp: new Date().toISOString(),

    version: 1,
  };
}

/*
 * ============================================================
 * 51. SEND PRIVATE EVENT
 * ============================================================
 */

export function sendPrivateEventWithMetadata(
  io,
  { eventId, type, senderId, recipientId, data, requestId },
) {
  const event = createPrivateEvent({
    eventId,

    type,

    senderId,

    recipientId,

    data,

    requestId,
  });

  emitToUser(io, recipientId, type, event);

  return event;
}

/*
 * ============================================================
 * 52. DEFAULT EXPORT
 * ============================================================
 */

export default {
  PRIVATE_ROOM_PREFIX,

  PRIVATE_EVENTS,

  userRoom,

  conversationRoom,

  teamRoom,

  projectRoom,

  organizationRoom,

  validateId,

  getAuthenticatedUser,

  joinOwnUserRoom,

  joinUserRoom,

  emitToUser,

  notifyUser,

  emitToSocket,

  emitToUsers,

  joinConversationRoom,

  joinPrivateConversation,

  emitToConversation,

  emitPrivateMessage,

  sendPrivateEvent,

  isSocketInRoom,

  getUserRoom,

  getConversationRoom,

  getRoomMembers,

  getRoomMemberCount,

  isUserOnline,

  getUserConnectionCount,

  emitUserPresence,

  emitTypingToConversation,

  emitStoppedTypingToConversation,

  registerPrivateRoomHandler,

  registerPrivateMessageHandler,

  registerNotificationSender,

  emitAccountUpdate,

  logoutAllUserConnections,

  disconnectAllUserConnections,

  getUserSockets,

  getUserSocketIds,

  secureJoinOwnRoom,

  requireConversationMembership,

  initializePrivateRooms,

  getUserConnectionState,

  handleUserDisconnect,

  createPrivateEvent,

  sendPrivateEventWithMetadata,
};
