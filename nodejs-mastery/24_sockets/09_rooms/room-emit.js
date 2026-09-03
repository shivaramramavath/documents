/**
 * ============================================================
 * 09_rooms/room-emit.js
 * ============================================================
 *
 * COMPLETE SOCKET.IO ROOM EMITTING / BROADCASTING
 *
 * Covers:
 *
 * 01. io.to(room).emit()
 * 02. socket.to(room).emit()
 * 03. io.in(room).emit()
 * 04. socket.to(room).emit() vs io.to(room).emit()
 * 05. Single room
 * 06. Multiple rooms
 * 07. Broadcasting to everyone except sender
 * 08. Broadcasting to sender + room
 * 09. Broadcasting to multiple rooms
 * 10. Targeted socket emit
 * 11. Room payloads
 * 12. Acknowledgements
 * 13. Async handlers
 * 14. Database + emit
 * 15. Transaction-safe event flow
 * 16. Event metadata
 * 17. Message broadcasting
 * 18. Presence events
 * 19. Typing events
 * 20. Notification events
 * 21. System events
 * 22. Room validation
 * 23. Authorization
 * 24. Excluding sockets
 * 25. Server-side forced broadcasting
 * 26. Error handling
 * 27. Production patterns
 *
 * ============================================================
 */

/*
 * ============================================================
 * 01. EVENT NAMES
 * ============================================================
 */

export const ROOM_EVENTS = Object.freeze({
  MESSAGE: "room:message",

  MESSAGE_CREATED: "room:message-created",

  USER_JOINED: "room:user-joined",

  USER_LEFT: "room:user-left",

  TYPING: "room:typing",

  STOPPED_TYPING: "room:stopped-typing",

  PRESENCE: "room:presence",

  NOTIFICATION: "room:notification",

  SYSTEM: "room:system",

  UPDATE: "room:update",

  DELETE: "room:delete",

  ERROR: "room:error",
});

/*
 * ============================================================
 * 02. BASIC ROOM EMIT
 * ============================================================
 *
 * Sends an event to EVERY socket currently inside the room.
 *
 * Example:
 *
 *     io.to("chat:123").emit(
 *       "room:message",
 *       data
 *     );
 *
 * ============================================================
 */

export function emitToRoom(io, room, event, data) {
  if (!io) {
    throw new Error("io is required");
  }

  if (!room) {
    throw new Error("room is required");
  }

  if (!event) {
    throw new Error("event is required");
  }

  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 03. io.to(room)
 * ============================================================
 *
 * Sends to everyone in the room.
 *
 * If the sender is also inside the room,
 * the sender receives the event.
 *
 * ============================================================
 */

export function emitToRoomIncludingSender(io, room, event, data) {
  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 04. socket.to(room)
 * ============================================================
 *
 * Sends to everyone in the room EXCEPT the sender.
 *
 * ============================================================
 */

export function emitToRoomExceptSender(socket, room, event, data) {
  if (!socket) {
    throw new Error("socket is required");
  }

  socket.to(room).emit(event, data);
}

/*
 * ============================================================
 * 05. io.in(room)
 * ============================================================
 *
 * io.in(room) and io.to(room) are commonly used
 * interchangeably for room targeting.
 *
 * ============================================================
 */

export function emitUsingIn(io, room, event, data) {
  io.in(room).emit(event, data);
}

/*
 * ============================================================
 * 06. IMPORTANT DIFFERENCE
 * ============================================================
 *
 * io.to(room)
 *
 *     sender included
 *
 *
 * socket.to(room)
 *
 *     sender excluded
 *
 *
 * Example:
 *
 * A, B, C are in room.
 *
 * A sends:
 *
 *     socket.to(room).emit(...)
 *
 * Result:
 *
 *     B receives
 *     C receives
 *     A does NOT receive
 *
 *
 * A sends:
 *
 *     io.to(room).emit(...)
 *
 * Result:
 *
 *     A receives
 *     B receives
 *     C receives
 *
 * ============================================================
 */

/*
 * ============================================================
 * 07. MULTIPLE ROOMS
 * ============================================================
 *
 * Socket.IO supports:
 *
 *     io.to(roomA).to(roomB)
 *
 * ============================================================
 */

export function emitToMultipleRooms(io, rooms, event, data) {
  if (!Array.isArray(rooms)) {
    throw new TypeError("rooms must be an array");
  }

  if (rooms.length === 0) {
    return;
  }

  let emitter = io;

  for (const room of rooms) {
    if (typeof room !== "string") {
      continue;
    }

    emitter = emitter.to(room);
  }

  emitter.emit(event, data);
}

/*
 * ============================================================
 * 08. MULTIPLE ROOM EXAMPLE
 * ============================================================
 *
 * User may belong to:
 *
 *     team:10
 *     project:50
 *     organization:100
 *
 * We can target several rooms.
 *
 * ============================================================
 */

export function emitToTeamAndProject(io, teamId, projectId, event, data) {
  emitToMultipleRooms(
    io,
    [`team:${teamId}`, `project:${projectId}`],
    event,
    data,
  );
}

/*
 * ============================================================
 * 09. TARGET ONE SOCKET
 * ============================================================
 */

export function emitToSocket(io, socketId, event, data) {
  if (!socketId) {
    throw new Error("socketId is required");
  }

  io.to(socketId).emit(event, data);
}

/*
 * ============================================================
 * 10. TARGET ONE USER
 * ============================================================
 *
 * Recommended pattern:
 *
 *     user:${userId}
 *
 * Every socket belonging to the user joins
 * the user's private room.
 *
 * Then:
 *
 *     io.to(user:123).emit(...)
 *
 * sends to ALL active connections of that user.
 *
 * ============================================================
 */

export function emitToUser(io, userId, event, data) {
  const room = `user:${userId}`;

  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 11. ROOM DATA
 * ============================================================
 *
 * Keep event payloads structured.
 *
 * BAD:
 *
 *     emit("message", "hello")
 *
 *
 * BETTER:
 *
 *     emit("room:message", {
 *       messageId,
 *       roomId,
 *       senderId,
 *       content,
 *       createdAt
 *     })
 *
 * ============================================================
 */

export function createRoomEventPayload({
  eventId,
  roomId,
  senderId,
  data,
  metadata = {},
}) {
  return {
    eventId,

    roomId,

    senderId,

    data,

    metadata,

    timestamp: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * 12. MESSAGE EVENT
 * ============================================================
 */

export function emitRoomMessage(
  io,
  { roomId, messageId, senderId, content, createdAt },
) {
  const payload = createRoomEventPayload({
    eventId: messageId,

    roomId,

    senderId,

    data: {
      messageId,

      content,

      createdAt,
    },
  });

  emitToRoom(io, roomId, ROOM_EVENTS.MESSAGE_CREATED, payload);
}

/*
 * ============================================================
 * 13. CHAT MESSAGE — EXCLUDE SENDER
 * ============================================================
 *
 * Useful when the sender already updates its UI locally.
 *
 * ============================================================
 */

export function emitMessageToOthers(socket, room, message) {
  socket.to(room).emit(ROOM_EVENTS.MESSAGE_CREATED, message);
}

/*
 * ============================================================
 * 14. CHAT MESSAGE — INCLUDE SENDER
 * ============================================================
 *
 * Useful when the server modifies/normalizes the message.
 *
 * Example:
 *
 * Client sends:
 *
 *     "hello"
 *
 * Server creates:
 *
 *     messageId
 *     createdAt
 *     databaseId
 *
 * Then server broadcasts the authoritative message
 * to everybody INCLUDING sender.
 *
 * ============================================================
 */

export function emitAuthoritativeMessage(io, room, message) {
  io.to(room).emit(ROOM_EVENTS.MESSAGE_CREATED, message);
}

/*
 * ============================================================
 * 15. ACKNOWLEDGEMENT
 * ============================================================
 *
 * IMPORTANT:
 *
 * Acknowledgement belongs to the client-server event
 * interaction.
 *
 * It is NOT a replacement for broadcasting.
 *
 * ============================================================
 */

export function handleRoomMessage(socket, io, { saveMessage }) {
  socket.on(ROOM_EVENTS.MESSAGE, async (payload, acknowledge) => {
    try {
      /*
       * Validate input.
       */

      if (!payload?.roomId) {
        acknowledge?.({
          success: false,

          error: "roomId is required",
        });

        return;
      }

      if (typeof payload.content !== "string") {
        acknowledge?.({
          success: false,

          error: "content must be a string",
        });

        return;
      }

      /*
       * Save first.
       */

      const message = await saveMessage({
        roomId: payload.roomId,

        senderId: socket.data.user.id,

        content: payload.content,
      });

      /*
       * Broadcast authoritative data.
       */

      emitRoomMessage(io, {
        roomId: payload.roomId,

        messageId: message.id,

        senderId: socket.data.user.id,

        content: message.content,

        createdAt: message.createdAt,
      });

      /*
       * ACK sender.
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
 * 16. ASYNC DATABASE + EMIT
 * ============================================================
 *
 * Correct sequence:
 *
 *     validate
 *         ↓
 *     authorize
 *         ↓
 *     database operation
 *         ↓
 *     successful result
 *         ↓
 *     emit
 *
 * Don't broadcast an event saying:
 *
 *     "message created"
 *
 * before the database operation succeeds.
 *
 * ============================================================
 */

export async function createAndBroadcast(io, room, create) {
  const result = await create();

  /*
   * Only emit after success.
   */

  emitToRoom(io, room, ROOM_EVENTS.UPDATE, result);

  return result;
}

/*
 * ============================================================
 * 17. USER JOINED
 * ============================================================
 */

export function emitUserJoined(socket, room, user) {
  socket.to(room).emit(ROOM_EVENTS.USER_JOINED, {
    room,

    user: {
      id: user.id,

      name: user.name,
    },

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 18. USER LEFT
 * ============================================================
 */

export function emitUserLeft(socket, room, user) {
  socket.to(room).emit(ROOM_EVENTS.USER_LEFT, {
    room,

    user: {
      id: user.id,

      name: user.name,
    },

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 19. TYPING INDICATOR
 * ============================================================
 *
 * Typing events usually should NOT be persisted.
 *
 * ============================================================
 */

export function emitTyping(socket, room, userId) {
  socket.to(room).emit(ROOM_EVENTS.TYPING, {
    room,

    userId,

    timestamp: Date.now(),
  });
}

/*
 * ============================================================
 * 20. STOPPED TYPING
 * ============================================================
 */

export function emitStoppedTyping(socket, room, userId) {
  socket.to(room).emit(ROOM_EVENTS.STOPPED_TYPING, {
    room,

    userId,

    timestamp: Date.now(),
  });
}

/*
 * ============================================================
 * 21. PRESENCE
 * ============================================================
 */

export function emitPresence(io, room, { userId, status }) {
  io.to(room).emit(ROOM_EVENTS.PRESENCE, {
    userId,

    status,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 22. SYSTEM MESSAGE
 * ============================================================
 */

export function emitSystemMessage(io, room, message) {
  io.to(room).emit(ROOM_EVENTS.SYSTEM, {
    message,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 23. ROOM UPDATE
 * ============================================================
 */

export function emitRoomUpdate(io, room, update) {
  io.to(room).emit(ROOM_EVENTS.UPDATE, {
    room,

    update,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 24. ROOM DELETE
 * ============================================================
 */

export function emitRoomDelete(io, room, resourceId) {
  io.to(room).emit(ROOM_EVENTS.DELETE, {
    room,

    resourceId,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 25. NOTIFICATION
 * ============================================================
 */

export function emitRoomNotification(io, room, notification) {
  io.to(room).emit(ROOM_EVENTS.NOTIFICATION, {
    notification,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 26. VALIDATE ROOM
 * ============================================================
 */

export function validateRoom(room) {
  if (typeof room !== "string") {
    throw new TypeError("Room must be a string");
  }

  const normalized = room.trim();

  if (normalized.length === 0) {
    throw new Error("Room cannot be empty");
  }

  if (normalized.length > 200) {
    throw new Error("Room name is too long");
  }

  return normalized;
}

/*
 * ============================================================
 * 27. SECURE ROOM EMIT
 * ============================================================
 */

export async function secureEmitToRoom(
  io,
  socket,
  room,
  event,
  data,
  { checkAccess } = {},
) {
  const normalizedRoom = validateRoom(room);

  /*
   * Make sure sender is authenticated.
   */

  if (!socket.data?.user) {
    throw new Error("Authentication required");
  }

  /*
   * Check authorization.
   */

  if (typeof checkAccess === "function") {
    const allowed = await checkAccess(socket.data.user, normalizedRoom, socket);

    if (!allowed) {
      throw new Error("Not authorized for this room");
    }
  }

  /*
   * Emit.
   */

  io.to(normalizedRoom).emit(event, data);
}

/*
 * ============================================================
 * 28. EXCLUDE SOCKET
 * ============================================================
 *
 * Sometimes you want:
 *
 *     everyone in room
 *
 * except:
 *
 *     socket A
 *
 * Use:
 *
 *     socketA.to(room).emit(...)
 *
 * ============================================================
 */

export function emitExceptSocket(socket, room, event, data) {
  socket.to(room).emit(event, data);
}

/*
 * ============================================================
 * 29. BROADCAST TO ROOM EXCEPT SEVERAL SOCKETS
 * ============================================================
 *
 * For more advanced targeting, Socket.IO broadcasting
 * can be composed with socket IDs.
 *
 * ============================================================
 */

export function emitToRoomExceptSockets(
  io,
  room,
  excludedSocketIds,
  event,
  data,
) {
  let emitter = io.to(room);

  if (Array.isArray(excludedSocketIds)) {
    for (const socketId of excludedSocketIds) {
      if (typeof socketId !== "string") {
        continue;
      }

      emitter = emitter.except(socketId);
    }
  }

  emitter.emit(event, data);
}

/*
 * ============================================================
 * 30. BROADCAST TO ROOM EXCEPT USER
 * ============================================================
 *
 * If every user has:
 *
 *     user:${userId}
 *
 * room, it can be used for targeting.
 *
 * ============================================================
 */

export function emitToRoomExceptUser(io, room, userId, event, data) {
  const userRoom = `user:${userId}`;

  io.to(room).except(userRoom).emit(event, data);
}

/*
 * ============================================================
 * 31. SERVER-WIDE EVENT
 * ============================================================
 */

export function emitToEveryone(io, event, data) {
  io.emit(event, data);
}

/*
 * ============================================================
 * 32. SERVER-WIDE EXCEPT SOCKET
 * ============================================================
 */

export function emitToEveryoneExceptSocket(socket, event, data) {
  socket.broadcast.emit(event, data);
}

/*
 * ============================================================
 * 33. ROOM SIZE
 * ============================================================
 *
 * io.sockets.adapter.rooms.get(room)
 *
 * returns a Set of socket IDs.
 *
 * ============================================================
 */

export function getRoomSize(io, room) {
  const members = io.sockets.adapter.rooms.get(room);

  return members?.size ?? 0;
}

/*
 * ============================================================
 * 34. GET SOCKET IDs IN ROOM
 * ============================================================
 */

export function getSocketsInRoom(io, room) {
  const members = io.sockets.adapter.rooms.get(room);

  if (!members) {
    return [];
  }

  return [...members];
}

/*
 * ============================================================
 * 35. ROOM EXISTS
 * ============================================================
 */

export function roomExists(io, room) {
  return io.sockets.adapter.rooms.has(room);
}

/*
 * ============================================================
 * 36. EVENT WITH CORRELATION ID
 * ============================================================
 *
 * Useful for:
 *
 *     logging
 *     tracing
 *     debugging
 *     distributed systems
 *
 * ============================================================
 */

export function createCorrelatedPayload(data, { requestId, eventId } = {}) {
  return {
    requestId,

    eventId,

    data,

    timestamp: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * 37. SAFE EMIT
 * ============================================================
 */

export function safeEmitToRoom(io, room, event, data) {
  try {
    const normalizedRoom = validateRoom(room);

    io.to(normalizedRoom).emit(event, data);

    return {
      success: true,

      room: normalizedRoom,
    };
  } catch (error) {
    console.error("Room emit failed:", error);

    return {
      success: false,

      error: error instanceof Error ? error.message : "Room emit failed",
    };
  }
}

/*
 * ============================================================
 * 38. ASYNC EVENT HANDLER
 * ============================================================
 */

export function registerRoomBroadcastHandler(socket, io, { authorize, save }) {
  socket.on("room:update", async (payload, acknowledge) => {
    try {
      /*
       * 1. Validate
       */

      if (!payload?.roomId) {
        throw new Error("roomId is required");
      }

      /*
       * 2. Authentication
       */

      if (!socket.data?.user) {
        throw new Error("Authentication required");
      }

      /*
       * 3. Authorization
       */

      if (typeof authorize === "function") {
        const allowed = await authorize(socket.data.user, payload.roomId);

        if (!allowed) {
          throw new Error("Not authorized");
        }
      }

      /*
       * 4. Persist
       */

      let result = payload;

      if (typeof save === "function") {
        result = await save(payload, socket.data.user);
      }

      /*
       * 5. Broadcast
       */

      io.to(payload.roomId).emit(ROOM_EVENTS.UPDATE, {
        data: result,

        actor: socket.data.user.id,

        timestamp: new Date().toISOString(),
      });

      /*
       * 6. ACK
       */

      acknowledge?.({
        success: true,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Room update failed",
      });
    }
  });
}

/*
 * ============================================================
 * 39. ROOM EMIT AFTER DATABASE COMMIT
 * ============================================================
 *
 * Production principle:
 *
 *     DB SUCCESS
 *          ↓
 *     COMMIT
 *          ↓
 *     EMIT
 *
 * Not:
 *
 *     EMIT
 *          ↓
 *     DB FAILURE
 *
 * ============================================================
 */

export async function persistThenEmit(io, { room, event, data, persist }) {
  const result = await persist(data);

  /*
   * Persistence succeeded.
   */

  io.to(room).emit(event, result);

  return result;
}

/*
 * ============================================================
 * 40. ROOM EVENT ERROR
 * ============================================================
 */

export function emitRoomError(socket, { code, message, requestId }) {
  socket.emit(ROOM_EVENTS.ERROR, {
    code,

    message,

    requestId,

    timestamp: new Date().toISOString(),
  });
}

/*
 * ============================================================
 * 41. PRODUCTION EVENT FACTORY
 * ============================================================
 */

export function createProductionEvent({
  eventId,
  eventType,
  roomId,
  actorId,
  payload,
  requestId,
}) {
  return {
    eventId,

    eventType,

    roomId,

    actorId,

    requestId,

    payload,

    timestamp: new Date().toISOString(),

    version: 1,
  };
}

/*
 * ============================================================
 * 42. PRODUCTION ROOM EMIT
 * ============================================================
 */

export function productionRoomEmit(
  io,
  { room, eventType, eventId, actorId, payload, requestId },
) {
  const event = createProductionEvent({
    eventId,

    eventType,

    roomId: room,

    actorId,

    payload,

    requestId,
  });

  io.to(room).emit(eventType, event);

  return event;
}

/*
 * ============================================================
 * 43. EXPORTS
 * ============================================================
 */

export default {
  ROOM_EVENTS,

  emitToRoom,

  emitToRoomIncludingSender,

  emitToRoomExceptSender,

  emitUsingIn,

  emitToMultipleRooms,

  emitToTeamAndProject,

  emitToSocket,

  emitToUser,

  createRoomEventPayload,

  emitRoomMessage,

  emitMessageToOthers,

  emitAuthoritativeMessage,

  handleRoomMessage,

  createAndBroadcast,

  emitUserJoined,

  emitUserLeft,

  emitTyping,

  emitStoppedTyping,

  emitPresence,

  emitSystemMessage,

  emitRoomUpdate,

  emitRoomDelete,

  emitRoomNotification,

  validateRoom,

  secureEmitToRoom,

  emitExceptSocket,

  emitToRoomExceptSockets,

  emitToRoomExceptUser,

  emitToEveryone,

  emitToEveryoneExceptSocket,

  getRoomSize,

  getSocketsInRoom,

  roomExists,

  createCorrelatedPayload,

  safeEmitToRoom,

  registerRoomBroadcastHandler,

  persistThenEmit,

  emitRoomError,

  createProductionEvent,

  productionRoomEmit,
};
