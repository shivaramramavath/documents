/**
 * ============================================================
 * 09_rooms/join.js
 * ============================================================
 *
 * COMPLETE SOCKET.IO ROOM JOINING
 *
 * Covers:
 *
 * 01. Basic socket.on()
 * 02. socket.join()
 * 03. Payload handling
 * 04. Payload validation
 * 05. Acknowledgements
 * 06. Async handlers
 * 07. Authorization
 * 08. Duplicate joins
 * 09. Multiple rooms
 * 10. Room limits
 * 11. User rooms
 * 12. Conversation rooms
 * 13. Project rooms
 * 14. Team rooms
 * 15. Organization rooms
 * 16. Join notifications
 * 17. Error handling
 * 18. Idempotency
 * 19. Room metadata
 * 20. Production architecture
 *
 * ============================================================
 */

import {
  userRoom,
  conversationRoom,
  projectRoom,
  teamRoom,
  organizationRoom,
  isSocketInRoom,
  getRoomSize,
} from "./socket.rooms.js";

/*
 * ============================================================
 * 01. CONSTANTS
 * ============================================================
 */

const MAX_ROOMS_PER_SOCKET = 50;

const MAX_ROOMS_PER_REQUEST = 10;

/*
 * ============================================================
 * 02. SOCKET.IO EVENT NAMES
 * ============================================================
 */

export const JOIN_EVENTS = Object.freeze({
  JOIN: "room:join",

  JOINED: "room:joined",

  JOIN_FAILED: "room:join-failed",

  USER_JOINED: "room:user-joined",
});

/*
 * ============================================================
 * 03. DEFAULT JOIN OPTIONS
 * ============================================================
 */

const DEFAULT_JOIN_OPTIONS = Object.freeze({
  notify: true,

  acknowledge: true,
});

/*
 * ============================================================
 * 04. GENERIC PAYLOAD VALIDATION
 * ============================================================
 */

export function validateJoinPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      valid: false,

      error: "Payload must be an object",
    };
  }

  if (typeof payload.room !== "string") {
    return {
      valid: false,

      error: "room must be a string",
    };
  }

  const room = payload.room.trim();

  if (room.length === 0) {
    return {
      valid: false,

      error: "room cannot be empty",
    };
  }

  if (room.length > 200) {
    return {
      valid: false,

      error: "room is too long",
    };
  }

  return {
    valid: true,

    room,
  };
}

/*
 * ============================================================
 * 05. CHECK SOCKET ROOM LIMIT
 * ============================================================
 *
 * socket.rooms is a Set.
 *
 * Remember:
 *
 * socket.id itself is normally included.
 *
 * ============================================================
 */

export function canJoinAnotherRoom(socket) {
  const applicationRoomCount = [...socket.rooms].filter(
    (room) => room !== socket.id,
  ).length;

  return applicationRoomCount < MAX_ROOMS_PER_SOCKET;
}

/*
 * ============================================================
 * 06. CHECK DUPLICATE JOIN
 * ============================================================
 */

export function alreadyInRoom(socket, room) {
  return isSocketInRoom(socket, room);
}

/*
 * ============================================================
 * 07. BASIC ROOM JOIN
 * ============================================================
 *
 * The fundamental Socket.IO operation:
 *
 *     socket.join(room)
 *
 * ============================================================
 */

export async function joinRoom(socket, room) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  if (!room) {
    throw new Error("Room is required");
  }

  /*
   * Check maximum rooms.
   */

  if (!canJoinAnotherRoom(socket)) {
    throw new Error("Maximum room limit reached");
  }

  /*
   * Duplicate join.
   *
   * socket.join() is effectively idempotent for
   * membership, but we can detect it explicitly
   * so the application can return useful metadata.
   */

  if (alreadyInRoom(socket, room)) {
    return {
      success: true,

      alreadyMember: true,

      room,
    };
  }

  /*
   * Join the room.
   */

  await socket.join(room);

  return {
    success: true,

    alreadyMember: false,

    room,
  };
}

/*
 * ============================================================
 * 08. BASIC EVENT HANDLER
 * ============================================================
 *
 * Client:
 *
 * socket.emit("room:join", {
 *   room: "conversation:123"
 * });
 *
 * Server:
 *
 * socket.on("room:join", handler)
 *
 * ============================================================
 */

export function registerBasicJoinHandler(socket) {
  socket.on(JOIN_EVENTS.JOIN, async (payload) => {
    try {
      const validation = validateJoinPayload(payload);

      if (!validation.valid) {
        socket.emit(JOIN_EVENTS.JOIN_FAILED, {
          error: validation.error,
        });

        return;
      }

      const result = await joinRoom(socket, validation.room);

      socket.emit(JOIN_EVENTS.JOINED, result);
    } catch (error) {
      socket.emit(JOIN_EVENTS.JOIN_FAILED, {
        error: error instanceof Error ? error.message : "Failed to join room",
      });
    }
  });
}

/*
 * ============================================================
 * 09. ACKNOWLEDGEMENT
 * ============================================================
 *
 * Socket.IO supports:
 *
 * socket.emit(
 *   event,
 *   data,
 *   callback
 * )
 *
 * Server receives:
 *
 * socket.on(
 *   event,
 *   (data, callback) => {}
 * )
 *
 * ============================================================
 */

export function registerAcknowledgementJoinHandler(socket) {
  socket.on(JOIN_EVENTS.JOIN, async (payload, acknowledge) => {
    try {
      const validation = validateJoinPayload(payload);

      if (!validation.valid) {
        acknowledge?.({
          success: false,

          error: validation.error,
        });

        return;
      }

      const result = await joinRoom(socket, validation.room);

      acknowledge?.({
        success: true,

        ...result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to join room",
      });
    }
  });
}

/*
 * ============================================================
 * 10. AUTHENTICATION CHECK
 * ============================================================
 *
 * Authentication should normally happen during
 * Socket.IO connection middleware.
 *
 * Example:
 *
 * socket.data.user
 *
 * ============================================================
 */

export function requireAuthenticatedSocket(socket) {
  if (!socket.data?.user) {
    throw new Error("Authentication required");
  }

  return socket.data.user;
}

/*
 * ============================================================
 * 11. AUTHORIZATION FUNCTION
 * ============================================================
 *
 * This is intentionally abstract.
 *
 * Real application:
 *
 *     database
 *     Redis
 *     permission service
 *     ACL
 *
 * ============================================================
 */

export async function authorizeRoomJoin(socket, room, { checkAccess } = {}) {
  const user = requireAuthenticatedSocket(socket);

  /*
   * If no custom authorization function is provided,
   * reject rather than accidentally allowing access.
   */

  if (typeof checkAccess !== "function") {
    throw new Error("Room authorization function is required");
  }

  const allowed = await checkAccess(user, room, socket);

  if (!allowed) {
    throw new Error("You are not authorized to join this room");
  }

  return true;
}

/*
 * ============================================================
 * 12. SECURE JOIN
 * ============================================================
 */

export async function secureJoinRoom(
  socket,
  room,
  { checkAccess, metadata = {} } = {},
) {
  /*
   * Authentication.
   */

  const user = requireAuthenticatedSocket(socket);

  /*
   * Authorization.
   */

  await authorizeRoomJoin(socket, room, {
    checkAccess,
  });

  /*
   * Room limit.
   */

  if (!canJoinAnotherRoom(socket) && !alreadyInRoom(socket, room)) {
    throw new Error("Maximum room limit reached");
  }

  /*
   * Check whether already joined.
   */

  const alreadyMember = alreadyInRoom(socket, room);

  /*
   * Join.
   */

  if (!alreadyMember) {
    await socket.join(room);
  }

  /*
   * Save optional socket metadata.
   */

  socket.data.lastJoinedRoom = room;

  socket.data.lastRoomJoinAt = Date.now();

  return {
    success: true,

    room,

    userId: user.id,

    alreadyMember,

    metadata,

    joinedAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * 13. SECURE JOIN HANDLER
 * ============================================================
 */

export function registerSecureJoinHandler(
  socket,
  { checkAccess, notify = true } = {},
) {
  socket.on(JOIN_EVENTS.JOIN, async (payload, acknowledge) => {
    try {
      /*
       * Validate payload.
       */

      const validation = validateJoinPayload(payload);

      if (!validation.valid) {
        acknowledge?.({
          success: false,

          error: validation.error,
        });

        return;
      }

      /*
       * Secure join.
       */

      const result = await secureJoinRoom(socket, validation.room, {
        checkAccess,
        metadata: payload.metadata,
      });

      /*
       * Tell joining client.
       */

      acknowledge?.(result);

      /*
       * Notify existing members.
       */

      if (notify && !result.alreadyMember) {
        socket.to(result.room).emit(JOIN_EVENTS.USER_JOINED, {
          room: result.room,

          userId: result.userId,

          joinedAt: result.joinedAt,
        });
      }
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to join room",
      });
    }
  });
}

/*
 * ============================================================
 * 14. USER PRIVATE ROOM
 * ============================================================
 *
 * User room example:
 *
 *     user:123
 *
 * Normally the user ID comes from authenticated
 * socket.data.user.
 *
 * NEVER trust a client-supplied userId for this.
 *
 * ============================================================
 */

export async function joinAuthenticatedUserRoom(socket) {
  const user = requireAuthenticatedSocket(socket);

  const room = userRoom(user.id);

  /*
   * Private user room does not need the client
   * to provide the room name.
   */

  const result = await joinRoom(socket, room);

  return {
    ...result,

    userId: user.id,
  };
}

/*
 * ============================================================
 * 15. REGISTER USER ROOM
 * ============================================================
 */

export function registerUserRoom(socket) {
  socket.on("user:join-room", async (_payload, acknowledge) => {
    try {
      const result = await joinAuthenticatedUserRoom(socket);

      acknowledge?.({
        success: true,

        ...result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error:
          error instanceof Error ? error.message : "Failed to join user room",
      });
    }
  });
}

/*
 * ============================================================
 * 16. CONVERSATION JOIN
 * ============================================================
 */

export async function joinConversationRoom(
  socket,
  conversationId,
  { checkAccess } = {},
) {
  const room = conversationRoom(conversationId);

  await secureJoinRoom(socket, room, {
    checkAccess,
  });

  return room;
}

/*
 * ============================================================
 * 17. CONVERSATION JOIN HANDLER
 * ============================================================
 */

export function registerConversationJoin(socket, { checkAccess } = {}) {
  socket.on("conversation:join", async (payload, acknowledge) => {
    try {
      if (!payload || !payload.conversationId) {
        acknowledge?.({
          success: false,

          error: "conversationId is required",
        });

        return;
      }

      const room = await joinConversationRoom(socket, payload.conversationId, {
        checkAccess,
      });

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
 * 18. PROJECT JOIN
 * ============================================================
 */

export async function joinProjectRoom(socket, projectId, { checkAccess } = {}) {
  const room = projectRoom(projectId);

  const result = await secureJoinRoom(socket, room, {
    checkAccess,
  });

  return result;
}

/*
 * ============================================================
 * 19. PROJECT JOIN HANDLER
 * ============================================================
 */

export function registerProjectJoin(socket, { checkAccess } = {}) {
  socket.on("project:join", async (payload, acknowledge) => {
    try {
      if (!payload || !payload.projectId) {
        acknowledge?.({
          success: false,

          error: "projectId is required",
        });

        return;
      }

      const result = await joinProjectRoom(socket, payload.projectId, {
        checkAccess,
      });

      acknowledge?.(result);
    } catch (error) {
      acknowledge?.({
        success: false,

        error:
          error instanceof Error ? error.message : "Failed to join project",
      });
    }
  });
}

/*
 * ============================================================
 * 20. TEAM JOIN
 * ============================================================
 */

export async function joinTeamRoom(socket, teamId, { checkAccess } = {}) {
  const room = teamRoom(teamId);

  return secureJoinRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 21. ORGANIZATION JOIN
 * ============================================================
 */

export async function joinOrganizationRoom(
  socket,
  organizationId,
  { checkAccess } = {},
) {
  const room = organizationRoom(organizationId);

  return secureJoinRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 22. JOIN MULTIPLE ROOMS
 * ============================================================
 */

export async function joinMultipleRooms(socket, rooms, { checkAccess } = {}) {
  if (!Array.isArray(rooms)) {
    throw new TypeError("rooms must be an array");
  }

  if (rooms.length > MAX_ROOMS_PER_REQUEST) {
    throw new Error(
      `Maximum ${MAX_ROOMS_PER_REQUEST} rooms can be joined per request`,
    );
  }

  const results = [];

  for (const room of rooms) {
    if (typeof room !== "string") {
      results.push({
        success: false,

        room,

        error: "Room must be a string",
      });

      continue;
    }

    try {
      const result = await secureJoinRoom(socket, room, {
        checkAccess,
      });

      results.push(result);
    } catch (error) {
      results.push({
        success: false,

        room,

        error: error instanceof Error ? error.message : "Failed to join room",
      });
    }
  }

  return results;
}

/*
 * ============================================================
 * 23. MULTI-ROOM EVENT HANDLER
 * ============================================================
 */

export function registerMultipleRoomJoin(socket, { checkAccess } = {}) {
  socket.on("rooms:join", async (payload, acknowledge) => {
    try {
      if (!payload || !Array.isArray(payload.rooms)) {
        acknowledge?.({
          success: false,

          error: "rooms must be an array",
        });

        return;
      }

      const results = await joinMultipleRooms(socket, payload.rooms, {
        checkAccess,
      });

      acknowledge?.({
        success: true,

        results,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to join rooms",
      });
    }
  });
}

/*
 * ============================================================
 * 24. ROOM SIZE CHECK
 * ============================================================
 *
 * Useful for:
 *
 *     game lobbies
 *     classrooms
 *     meetings
 *     limited collaboration rooms
 *
 * ============================================================
 */

export function checkRoomCapacity(io, room, maxMembers) {
  const size = getRoomSize(io, room);

  return {
    room,

    current: size,

    maximum: maxMembers,

    available: size < maxMembers,
  };
}

/*
 * ============================================================
 * 25. CAPACITY-AWARE JOIN
 * ============================================================
 */

export async function joinWithCapacity(
  socket,
  io,
  room,
  { maxMembers, checkAccess } = {},
) {
  /*
   * Authorization FIRST.
   */

  await authorizeRoomJoin(socket, room, {
    checkAccess,
  });

  /*
   * If already inside, allow the operation.
   */

  if (alreadyInRoom(socket, room)) {
    return {
      success: true,

      room,

      alreadyMember: true,
    };
  }

  /*
   * Capacity check.
   */

  const capacity = checkRoomCapacity(io, room, maxMembers);

  if (!capacity.available) {
    throw new Error("Room is full");
  }

  /*
   * Join.
   */

  await socket.join(room);

  return {
    success: true,

    room,

    alreadyMember: false,

    capacity,
  };
}

/*
 * ============================================================
 * 26. JOIN WITH METADATA
 * ============================================================
 *
 * socket.data is connection-specific state.
 *
 * Example:
 *
 *     socket.data.roomRole = "editor"
 *
 * Be careful:
 *
 * socket.data is NOT a database.
 *
 * ============================================================
 */

export async function joinWithMetadata(
  socket,
  room,
  { role, checkAccess } = {},
) {
  await secureJoinRoom(socket, room, {
    checkAccess,
  });

  socket.data.roomRole = role ?? null;

  socket.data.currentRoom = room;

  return {
    success: true,

    room,

    role: socket.data.roomRole,
  };
}

/*
 * ============================================================
 * 27. COMPLETE JOIN REGISTRATION
 * ============================================================
 *
 * Call this once when a socket connects.
 *
 * ============================================================
 */

export function registerJoinHandlers(
  socket,
  { checkAccess, notify = true } = {},
) {
  /*
   * Generic room join.
   */

  registerSecureJoinHandler(socket, {
    checkAccess,
    notify,
  });

  /*
   * Private user room.
   */

  registerUserRoom(socket);

  /*
   * Conversation.
   */

  registerConversationJoin(socket, {
    checkAccess,
  });

  /*
   * Project.
   */

  registerProjectJoin(socket, {
    checkAccess,
  });

  /*
   * Multiple rooms.
   */

  registerMultipleRoomJoin(socket, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 28. EXPORTS
 * ============================================================
 */

export default {
  JOIN_EVENTS,

  validateJoinPayload,

  canJoinAnotherRoom,

  alreadyInRoom,

  joinRoom,

  registerBasicJoinHandler,

  registerAcknowledgementJoinHandler,

  requireAuthenticatedSocket,

  authorizeRoomJoin,

  secureJoinRoom,

  registerSecureJoinHandler,

  joinAuthenticatedUserRoom,

  registerUserRoom,

  joinConversationRoom,

  registerConversationJoin,

  joinProjectRoom,

  registerProjectJoin,

  joinTeamRoom,

  joinOrganizationRoom,

  joinMultipleRooms,

  registerMultipleRoomJoin,

  checkRoomCapacity,

  joinWithCapacity,

  joinWithMetadata,

  registerJoinHandlers,
};
