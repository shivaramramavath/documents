/**
 * ============================================================
 * 09_rooms/leave.js
 * ============================================================
 *
 * COMPLETE SOCKET.IO ROOM LEAVING
 *
 * Covers:
 *
 * 01. socket.leave()
 * 02. socket.on()
 * 03. Payload validation
 * 04. Acknowledgements
 * 05. Authentication
 * 06. Authorization
 * 07. Duplicate leave / idempotency
 * 08. Leave one room
 * 09. Leave multiple rooms
 * 10. Leave user room
 * 11. Leave conversation room
 * 12. Leave project room
 * 13. Leave team room
 * 14. Protected rooms
 * 15. Forced leave
 * 16. Leave all application rooms
 * 17. Notifications
 * 18. Async handlers
 * 19. Cleanup
 * 20. Production patterns
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
} from "./socket.rooms.js";

/*
 * ============================================================
 * 01. CONSTANTS
 * ============================================================
 */

const MAX_ROOMS_PER_REQUEST = 10;

/*
 * ============================================================
 * 02. EVENTS
 * ============================================================
 */

export const LEAVE_EVENTS = Object.freeze({
  LEAVE: "room:leave",

  LEFT: "room:left",

  LEAVE_FAILED: "room:leave-failed",

  USER_LEFT: "room:user-left",
});

/*
 * ============================================================
 * 03. PROTECTED ROOM TYPES
 * ============================================================
 *
 * Example:
 *
 * user:user123
 *
 * should generally NOT be left by a client manually.
 *
 * It represents the authenticated user's private channel.
 *
 * ============================================================
 */

export const PROTECTED_ROOM_PREFIXES = Object.freeze(["user:"]);

/*
 * ============================================================
 * 04. CHECK PROTECTED ROOM
 * ============================================================
 */

export function isProtectedRoom(room) {
  if (typeof room !== "string") {
    return false;
  }

  return PROTECTED_ROOM_PREFIXES.some((prefix) => room.startsWith(prefix));
}

/*
 * ============================================================
 * 05. AUTHENTICATION
 * ============================================================
 */

export function requireAuthenticatedSocket(socket) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  if (!socket.data?.user) {
    throw new Error("Authentication required");
  }

  return socket.data.user;
}

/*
 * ============================================================
 * 06. PAYLOAD VALIDATION
 * ============================================================
 */

export function validateLeavePayload(payload) {
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
 * 07. CHECK MEMBERSHIP
 * ============================================================
 */

export function isMember(socket, room) {
  return isSocketInRoom(socket, room);
}

/*
 * ============================================================
 * 08. BASIC LEAVE
 * ============================================================
 *
 * Fundamental API:
 *
 *     socket.leave(room)
 *
 * ============================================================
 */

export async function leaveRoom(socket, room) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  if (!room) {
    throw new Error("Room is required");
  }

  /*
   * Check membership first.
   */

  const wasMember = isMember(socket, room);

  /*
   * socket.leave() is safe to call when the socket
   * is not currently a member, but detecting this
   * allows us to return meaningful information.
   */

  if (!wasMember) {
    return {
      success: true,

      room,

      wasMember: false,

      alreadyLeft: true,
    };
  }

  /*
   * Leave the room.
   */

  await socket.leave(room);

  return {
    success: true,

    room,

    wasMember: true,

    alreadyLeft: false,
  };
}

/*
 * ============================================================
 * 09. LEAVE WITH AUTHORIZATION
 * ============================================================
 *
 * The authorization function determines whether
 * the socket is allowed to leave this room.
 *
 * Usually leaving is less sensitive than joining,
 * but some applications still need authorization.
 *
 * ============================================================
 */

export async function authorizeRoomLeave(socket, room, { checkAccess } = {}) {
  const user = requireAuthenticatedSocket(socket);

  if (typeof checkAccess !== "function") {
    /*
     * If no authorization function exists,
     * allow normal application rooms.
     *
     * Protected rooms are handled separately.
     */

    return true;
  }

  const allowed = await checkAccess(user, room, socket);

  if (!allowed) {
    throw new Error("You are not authorized to leave this room");
  }

  return true;
}

/*
 * ============================================================
 * 10. SAFE LEAVE
 * ============================================================
 */

export async function safeLeaveRoom(
  socket,
  room,
  { checkAccess, allowProtected = false } = {},
) {
  const user = requireAuthenticatedSocket(socket);

  /*
   * Prevent clients from leaving their private
   * user room unless explicitly permitted.
   */

  if (isProtectedRoom(room) && !allowProtected) {
    throw new Error("This room cannot be manually left");
  }

  /*
   * Authorization.
   */

  await authorizeRoomLeave(socket, room, {
    checkAccess,
  });

  /*
   * Leave.
   */

  const result = await leaveRoom(socket, room);

  return {
    ...result,

    userId: user.id,
  };
}

/*
 * ============================================================
 * 11. REGISTER BASIC LEAVE HANDLER
 * ============================================================
 */

export function registerBasicLeaveHandler(socket) {
  socket.on(LEAVE_EVENTS.LEAVE, async (payload) => {
    try {
      const validation = validateLeavePayload(payload);

      if (!validation.valid) {
        socket.emit(LEAVE_EVENTS.LEAVE_FAILED, {
          success: false,

          error: validation.error,
        });

        return;
      }

      const result = await leaveRoom(socket, validation.room);

      socket.emit(LEAVE_EVENTS.LEFT, result);
    } catch (error) {
      socket.emit(LEAVE_EVENTS.LEAVE_FAILED, {
        success: false,

        error: error instanceof Error ? error.message : "Failed to leave room",
      });
    }
  });
}

/*
 * ============================================================
 * 12. ACKNOWLEDGEMENT LEAVE HANDLER
 * ============================================================
 *
 * Client:
 *
 * socket.emit(
 *   "room:leave",
 *   { room },
 *   callback
 * );
 *
 * Server:
 *
 * socket.on(
 *   "room:leave",
 *   (payload, acknowledge) => {}
 * );
 *
 * ============================================================
 */

export function registerAcknowledgementLeaveHandler(socket) {
  socket.on(LEAVE_EVENTS.LEAVE, async (payload, acknowledge) => {
    try {
      const validation = validateLeavePayload(payload);

      if (!validation.valid) {
        acknowledge?.({
          success: false,

          error: validation.error,
        });

        return;
      }

      const result = await leaveRoom(socket, validation.room);

      acknowledge?.(result);
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to leave room",
      });
    }
  });
}

/*
 * ============================================================
 * 13. SECURE LEAVE HANDLER
 * ============================================================
 */

export function registerSecureLeaveHandler(
  socket,
  {
    checkAccess,
    notify = true,

    allowProtected = false,
  } = {},
) {
  socket.on(LEAVE_EVENTS.LEAVE, async (payload, acknowledge) => {
    try {
      /*
       * Validate.
       */

      const validation = validateLeavePayload(payload);

      if (!validation.valid) {
        acknowledge?.({
          success: false,

          error: validation.error,
        });

        return;
      }

      const room = validation.room;

      /*
       * Secure leave.
       */

      const result = await safeLeaveRoom(socket, room, {
        checkAccess,
        allowProtected,
      });

      /*
       * Tell sender.
       */

      acknowledge?.(result);

      /*
       * Notify remaining room members.
       *
       * Important:
       *
       * We call socket.to(room) AFTER leave().
       *
       * Therefore the sender is no longer a member
       * and cannot receive this notification anyway.
       */

      if (notify && result.wasMember) {
        socket.to(room).emit(LEAVE_EVENTS.USER_LEFT, {
          room,

          userId: result.userId,

          leftAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to leave room",
      });
    }
  });
}

/*
 * ============================================================
 * 14. LEAVE USER ROOM
 * ============================================================
 *
 * Normally clients should NOT use this.
 *
 * The user room is usually created from
 * authenticated identity.
 *
 * This function exists mainly for server-side
 * connection management.
 *
 * ============================================================
 */

export async function leaveAuthenticatedUserRoom(socket) {
  const user = requireAuthenticatedSocket(socket);

  const room = userRoom(user.id);

  /*
   * Explicitly allow leaving the protected room.
   */

  return leaveRoom(socket, room);
}

/*
 * ============================================================
 * 15. LEAVE CONVERSATION
 * ============================================================
 */

export async function leaveConversationRoom(
  socket,
  conversationId,
  { checkAccess } = {},
) {
  const room = conversationRoom(conversationId);

  return safeLeaveRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 16. CONVERSATION LEAVE HANDLER
 * ============================================================
 */

export function registerConversationLeave(socket, { checkAccess } = {}) {
  socket.on("conversation:leave", async (payload, acknowledge) => {
    try {
      if (!payload || !payload.conversationId) {
        acknowledge?.({
          success: false,

          error: "conversationId is required",
        });

        return;
      }

      const result = await leaveConversationRoom(
        socket,
        payload.conversationId,
        {
          checkAccess,
        },
      );

      acknowledge?.(result);
    } catch (error) {
      acknowledge?.({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to leave conversation",
      });
    }
  });
}

/*
 * ============================================================
 * 17. LEAVE PROJECT
 * ============================================================
 */

export async function leaveProjectRoom(
  socket,
  projectId,
  { checkAccess } = {},
) {
  const room = projectRoom(projectId);

  return safeLeaveRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 18. PROJECT LEAVE HANDLER
 * ============================================================
 */

export function registerProjectLeave(socket, { checkAccess } = {}) {
  socket.on("project:leave", async (payload, acknowledge) => {
    try {
      if (!payload || !payload.projectId) {
        acknowledge?.({
          success: false,

          error: "projectId is required",
        });

        return;
      }

      const result = await leaveProjectRoom(socket, payload.projectId, {
        checkAccess,
      });

      acknowledge?.(result);
    } catch (error) {
      acknowledge?.({
        success: false,

        error:
          error instanceof Error ? error.message : "Failed to leave project",
      });
    }
  });
}

/*
 * ============================================================
 * 19. LEAVE TEAM
 * ============================================================
 */

export async function leaveTeamRoom(socket, teamId, { checkAccess } = {}) {
  const room = teamRoom(teamId);

  return safeLeaveRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 20. LEAVE ORGANIZATION
 * ============================================================
 */

export async function leaveOrganizationRoom(
  socket,
  organizationId,
  { checkAccess } = {},
) {
  const room = organizationRoom(organizationId);

  return safeLeaveRoom(socket, room, {
    checkAccess,
  });
}

/*
 * ============================================================
 * 21. LEAVE MULTIPLE ROOMS
 * ============================================================
 */

export async function leaveMultipleRooms(
  socket,
  rooms,
  { checkAccess, allowProtected = false } = {},
) {
  if (!Array.isArray(rooms)) {
    throw new TypeError("rooms must be an array");
  }

  if (rooms.length > MAX_ROOMS_PER_REQUEST) {
    throw new Error(
      `Maximum ${MAX_ROOMS_PER_REQUEST} rooms can be left per request`,
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
      const result = await safeLeaveRoom(socket, room, {
        checkAccess,
        allowProtected,
      });

      results.push(result);
    } catch (error) {
      results.push({
        success: false,

        room,

        error: error instanceof Error ? error.message : "Failed to leave room",
      });
    }
  }

  return results;
}

/*
 * ============================================================
 * 22. MULTI-ROOM LEAVE HANDLER
 * ============================================================
 */

export function registerMultipleRoomLeave(
  socket,
  { checkAccess, allowProtected = false } = {},
) {
  socket.on("rooms:leave", async (payload, acknowledge) => {
    try {
      if (!payload || !Array.isArray(payload.rooms)) {
        acknowledge?.({
          success: false,

          error: "rooms must be an array",
        });

        return;
      }

      const results = await leaveMultipleRooms(socket, payload.rooms, {
        checkAccess,
        allowProtected,
      });

      acknowledge?.({
        success: true,

        results,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: error instanceof Error ? error.message : "Failed to leave rooms",
      });
    }
  });
}

/*
 * ============================================================
 * 23. LEAVE ALL APPLICATION ROOMS
 * ============================================================
 *
 * IMPORTANT:
 *
 * Do NOT simply clear socket.rooms.
 *
 * socket.rooms is a Set managed by Socket.IO.
 *
 * Use socket.leave(room).
 *
 * ============================================================
 */

export async function leaveAllApplicationRooms(
  socket,
  { except = [], allowProtected = false } = {},
) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  const excluded = new Set(except);

  const rooms = [...socket.rooms];

  const results = [];

  for (const room of rooms) {
    /*
     * Skip socket's own private room.
     */

    if (room === socket.id) {
      continue;
    }

    /*
     * Skip explicitly excluded rooms.
     */

    if (excluded.has(room)) {
      continue;
    }

    /*
     * Protected rooms.
     */

    if (isProtectedRoom(room) && !allowProtected) {
      results.push({
        success: false,

        room,

        skipped: true,

        reason: "PROTECTED_ROOM",
      });

      continue;
    }

    /*
     * Leave.
     */

    const result = await leaveRoom(socket, room);

    results.push(result);
  }

  return results;
}

/*
 * ============================================================
 * 24. FORCE LEAVE
 * ============================================================
 *
 * Server-side administrators/services may need
 * to remove a socket from a room.
 *
 * Examples:
 *
 *     user removed from team
 *     banned from chat
 *     meeting ended
 *     project access revoked
 *
 * ============================================================
 */

export async function forceLeaveRoom(
  socket,
  room,
  {
    reason = "FORCED_LEAVE",

    notify = true,
  } = {},
) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  const wasMember = isMember(socket, room);

  if (!wasMember) {
    return {
      success: true,

      room,

      wasMember: false,

      forced: true,
    };
  }

  /*
   * Leave first.
   */

  await socket.leave(room);

  /*
   * Tell the affected socket.
   */

  if (notify) {
    socket.emit("room:forced-leave", {
      room,

      reason,

      timestamp: new Date().toISOString(),
    });

    /*
     * Notify remaining members.
     */

    socket.to(room).emit(LEAVE_EVENTS.USER_LEFT, {
      room,

      userId: socket.data?.user?.id,

      reason,

      forced: true,

      timestamp: new Date().toISOString(),
    });
  }

  return {
    success: true,

    room,

    wasMember: true,

    forced: true,

    reason,
  };
}

/*
 * ============================================================
 * 25. REMOVE FROM ALL ROOMS
 * ============================================================
 *
 * Server-side forced cleanup.
 * ============================================================
 */

export async function forceLeaveAllRooms(
  socket,
  {
    reason = "FORCED_CLEANUP",

    notify = true,
  } = {},
) {
  const rooms = [...socket.rooms];

  const results = [];

  for (const room of rooms) {
    /*
     * Skip socket's own room.
     */

    if (room === socket.id) {
      continue;
    }

    const result = await forceLeaveRoom(socket, room, {
      reason,
      notify,
    });

    results.push(result);
  }

  return results;
}

/*
 * ============================================================
 * 26. DISCONNECT CLEANUP
 * ============================================================
 *
 * Normally Socket.IO automatically removes a socket
 * from its rooms during disconnect.
 *
 * Therefore, you usually do NOT need:
 *
 *     socket.on("disconnect", () => {
 *
 *       for (...) {
 *         socket.leave(...)
 *       }
 *
 *     });
 *
 * Socket.IO handles the membership cleanup.
 *
 * What YOU may need to clean:
 *
 *     presence
 *     database state
 *     Redis state
 *     application metadata
 *     typing state
 *     user online status
 *
 * ============================================================
 */

export function registerDisconnectCleanup(socket, { cleanup } = {}) {
  socket.on("disconnect", async (reason) => {
    try {
      if (typeof cleanup === "function") {
        await cleanup(socket, reason);
      }
    } catch (error) {
      console.error("Socket disconnect cleanup failed:", error);
    }
  });
}

/*
 * ============================================================
 * 27. GET APPLICATION ROOMS
 * ============================================================
 */

export function getApplicationRooms(socket) {
  return [...socket.rooms].filter((room) => room !== socket.id);
}

/*
 * ============================================================
 * 28. GET ROOM COUNT
 * ============================================================
 */

export function getApplicationRoomCount(socket) {
  return getApplicationRooms(socket).length;
}

/*
 * ============================================================
 * 29. CLEAN CONNECTION STATE
 * ============================================================
 */

export function clearRoomConnectionState(socket) {
  /*
   * Only clear fields your application owns.
   */

  delete socket.data.currentRoom;

  delete socket.data.lastJoinedRoom;

  delete socket.data.lastRoomJoinAt;

  delete socket.data.roomRole;
}

/*
 * ============================================================
 * 30. COMPLETE REGISTRATION
 * ============================================================
 */

export function registerLeaveHandlers(
  socket,
  {
    checkAccess,

    notify = true,

    allowProtected = false,
  } = {},
) {
  /*
   * Generic room leave.
   */

  registerSecureLeaveHandler(socket, {
    checkAccess,
    notify,
    allowProtected,
  });

  /*
   * Conversation leave.
   */

  registerConversationLeave(socket, {
    checkAccess,
  });

  /*
   * Project leave.
   */

  registerProjectLeave(socket, {
    checkAccess,
  });

  /*
   * Multiple rooms.
   */

  registerMultipleRoomLeave(socket, {
    checkAccess,
    allowProtected,
  });

  /*
   * Disconnect cleanup.
   */

  registerDisconnectCleanup(socket, {
    cleanup: async (currentSocket, reason) => {
      clearRoomConnectionState(currentSocket);

      /*
       * Your application-specific cleanup
       * can be added here.
       */

      console.log(`Socket ${currentSocket.id} disconnected: ${reason}`);
    },
  });
}

/*
 * ============================================================
 * 31. EXPORTS
 * ============================================================
 */

export default {
  LEAVE_EVENTS,

  PROTECTED_ROOM_PREFIXES,

  isProtectedRoom,

  requireAuthenticatedSocket,

  validateLeavePayload,

  isMember,

  leaveRoom,

  authorizeRoomLeave,

  safeLeaveRoom,

  registerBasicLeaveHandler,

  registerAcknowledgementLeaveHandler,

  registerSecureLeaveHandler,

  leaveAuthenticatedUserRoom,

  leaveConversationRoom,

  registerConversationLeave,

  leaveProjectRoom,

  registerProjectLeave,

  leaveTeamRoom,

  leaveOrganizationRoom,

  leaveMultipleRooms,

  registerMultipleRoomLeave,

  leaveAllApplicationRooms,

  forceLeaveRoom,

  forceLeaveAllRooms,

  registerDisconnectCleanup,

  getApplicationRooms,

  getApplicationRoomCount,

  clearRoomConnectionState,

  registerLeaveHandlers,
};
