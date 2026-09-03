/**
 * ============================================================
 * 09_rooms/socket.rooms.js
 * ============================================================
 *
 * SOCKET.IO ROOMS
 *
 * Topics covered:
 *
 * 01. What is a room?
 * 02. Socket joining a room
 * 03. Socket leaving a room
 * 04. Checking socket rooms
 * 05. Room names
 * 06. Dynamic room names
 * 07. User rooms
 * 08. Conversation rooms
 * 09. Project rooms
 * 10. Broadcasting to a room
 * 11. Excluding sender
 * 12. Multiple rooms
 * 13. Leaving multiple rooms
 * 14. Room membership
 * 15. Socket.IO room internals
 * 16. Disconnect cleanup
 * 17. Room authorization
 * 18. Secure room naming
 * 19. Room utility functions
 * 20. Production patterns
 *
 * ============================================================
 */

/*
 * ============================================================
 * 01. ROOM NAME PREFIXES
 * ============================================================
 *
 * Prefixes prevent collisions between different
 * types of rooms.
 *
 * Examples:
 *
 *     user:user_123
 *     conversation:conversation_123
 *     project:project_123
 *     organization:organization_123
 *
 * ============================================================
 */

export const ROOM_PREFIX = Object.freeze({
  USER: "user",

  CONVERSATION: "conversation",

  PROJECT: "project",

  ORGANIZATION: "organization",

  TEAM: "team",

  GAME: "game",

  DOCUMENT: "document",

  NOTIFICATION: "notification",
});

/*
 * ============================================================
 * 02. CREATE ROOM NAME
 * ============================================================
 *
 * Converts:
 *
 *     ("user", "123")
 *
 * into:
 *
 *     "user:123"
 *
 * ============================================================
 */

export function createRoomName(prefix, id) {
  if (!prefix) {
    throw new Error("Room prefix is required");
  }

  if (id === undefined || id === null || id === "") {
    throw new Error("Room ID is required");
  }

  return `${prefix}:${String(id)}`;
}

/*
 * ============================================================
 * 03. USER ROOM
 * ============================================================
 *
 * Every authenticated user can have a private room.
 *
 * Example:
 *
 *     user:user_123
 *
 * Useful for:
 *
 *     notifications
 *     personal events
 *     background jobs
 *     direct server messages
 *
 * ============================================================
 */

export function userRoom(userId) {
  return createRoomName(ROOM_PREFIX.USER, userId);
}

/*
 * ============================================================
 * 04. CONVERSATION ROOM
 * ============================================================
 *
 * Example:
 *
 *     conversation:abc123
 *
 * ============================================================
 */

export function conversationRoom(conversationId) {
  return createRoomName(ROOM_PREFIX.CONVERSATION, conversationId);
}

/*
 * ============================================================
 * 05. PROJECT ROOM
 * ============================================================
 */

export function projectRoom(projectId) {
  return createRoomName(ROOM_PREFIX.PROJECT, projectId);
}

/*
 * ============================================================
 * 06. ORGANIZATION ROOM
 * ============================================================
 */

export function organizationRoom(organizationId) {
  return createRoomName(ROOM_PREFIX.ORGANIZATION, organizationId);
}

/*
 * ============================================================
 * 07. TEAM ROOM
 * ============================================================
 */

export function teamRoom(teamId) {
  return createRoomName(ROOM_PREFIX.TEAM, teamId);
}

/*
 * ============================================================
 * 08. GAME ROOM
 * ============================================================
 */

export function gameRoom(gameId) {
  return createRoomName(ROOM_PREFIX.GAME, gameId);
}

/*
 * ============================================================
 * 09. DOCUMENT ROOM
 * ============================================================
 */

export function documentRoom(documentId) {
  return createRoomName(ROOM_PREFIX.DOCUMENT, documentId);
}

/*
 * ============================================================
 * 10. JOIN ROOM
 * ============================================================
 *
 * Socket.IO API:
 *
 *     socket.join(room)
 *
 * Parameters:
 *
 *     room
 *
 * room can be:
 *
 *     string
 *
 * or:
 *
 *     Set<string>
 *
 * or:
 *
 *     Array<string>
 *
 * depending on Socket.IO version/API usage.
 *
 * The common form is:
 *
 *     socket.join("room-name")
 *
 * ============================================================
 */

export function joinRoom(socket, room) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  if (!room) {
    throw new Error("Room is required");
  }

  socket.join(room);
}

/*
 * ============================================================
 * 11. JOIN MULTIPLE ROOMS
 * ============================================================
 */

export function joinRooms(socket, rooms) {
  if (!Array.isArray(rooms)) {
    throw new TypeError("rooms must be an array");
  }

  for (const room of rooms) {
    joinRoom(socket, room);
  }
}

/*
 * ============================================================
 * 12. LEAVE ROOM
 * ============================================================
 *
 * Socket.IO:
 *
 *     socket.leave(room)
 *
 * ============================================================
 */

export function leaveRoom(socket, room) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  if (!room) {
    throw new Error("Room is required");
  }

  socket.leave(room);
}

/*
 * ============================================================
 * 13. LEAVE MULTIPLE ROOMS
 * ============================================================
 */

export function leaveRooms(socket, rooms) {
  if (!Array.isArray(rooms)) {
    throw new TypeError("rooms must be an array");
  }

  for (const room of rooms) {
    leaveRoom(socket, room);
  }
}

/*
 * ============================================================
 * 14. GET SOCKET ROOMS
 * ============================================================
 *
 * Socket.IO provides:
 *
 *     socket.rooms
 *
 * It is a Set.
 *
 * Example:
 *
 *     Set {
 *       socket.id,
 *       "conversation:123",
 *       "project:456"
 *     }
 *
 * IMPORTANT:
 *
 * socket.id itself is normally included as a room.
 *
 * ============================================================
 */

export function getSocketRooms(socket) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  return new Set(socket.rooms);
}

/*
 * ============================================================
 * 15. GET APPLICATION ROOMS
 * ============================================================
 *
 * IMPORTANT:
 *
 * socket.rooms
 *
 * tells you the rooms THIS SOCKET belongs to.
 *
 * It does NOT give you all rooms in the server.
 *
 * For server-side adapter state:
 *
 *     io.sockets.adapter.rooms
 *
 * can be inspected.
 *
 * ============================================================
 */

export function getServerRooms(io) {
  if (!io) {
    throw new Error("Socket.IO server is required");
  }

  return new Map(io.sockets.adapter.rooms);
}

/*
 * ============================================================
 * 16. CHECK SOCKET MEMBERSHIP
 * ============================================================
 */

export function isSocketInRoom(socket, room) {
  if (!socket || !room) {
    return false;
  }

  return socket.rooms.has(room);
}

/*
 * ============================================================
 * 17. CHECK ROOM EXISTENCE
 * ============================================================
 */

export function roomExists(io, room) {
  if (!io || !room) {
    return false;
  }

  return io.sockets.adapter.rooms.has(room);
}

/*
 * ============================================================
 * 18. ROOM SIZE
 * ============================================================
 */

export function getRoomSize(io, room) {
  if (!io || !room) {
    return 0;
  }

  const members = io.sockets.adapter.rooms.get(room);

  if (!members) {
    return 0;
  }

  return members.size;
}

/*
 * ============================================================
 * 19. GET ROOM MEMBERS
 * ============================================================
 *
 * Returns socket IDs.
 *
 * ============================================================
 */

export function getRoomMembers(io, room) {
  if (!io || !room) {
    return [];
  }

  const members = io.sockets.adapter.rooms.get(room);

  if (!members) {
    return [];
  }

  return [...members];
}

/*
 * ============================================================
 * 20. ROOM MEMBERSHIP DETAILS
 * ============================================================
 */

export function getRoomInfo(io, room) {
  const members = getRoomMembers(io, room);

  return {
    room,

    exists: members.length > 0,

    size: members.length,

    members,
  };
}

/*
 * ============================================================
 * 21. JOIN USER TO PRIVATE ROOM
 * ============================================================
 *
 * Authentication should happen BEFORE this function.
 *
 * ============================================================
 */

export function joinUserRoom(socket, userId) {
  const room = userRoom(userId);

  joinRoom(socket, room);

  return room;
}

/*
 * ============================================================
 * 22. JOIN CONVERSATION
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function should NOT itself decide whether
 * the user is allowed to enter the conversation.
 *
 * Authorization should happen first.
 *
 * ============================================================
 */

export function joinConversation(socket, conversationId) {
  const room = conversationRoom(conversationId);

  joinRoom(socket, room);

  return room;
}

/*
 * ============================================================
 * 23. JOIN PROJECT
 * ============================================================
 */

export function joinProject(socket, projectId) {
  const room = projectRoom(projectId);

  joinRoom(socket, room);

  return room;
}

/*
 * ============================================================
 * 24. JOIN ORGANIZATION
 * ============================================================
 */

export function joinOrganization(socket, organizationId) {
  const room = organizationRoom(organizationId);

  joinRoom(socket, room);

  return room;
}

/*
 * ============================================================
 * 25. BROADCAST TO ROOM
 * ============================================================
 *
 * io.to(room).emit(...)
 *
 * sends an event to sockets in that room.
 *
 * ============================================================
 */

export function emitToRoom(io, room, event, data) {
  if (!io) {
    throw new Error("Socket.IO server is required");
  }

  if (!room) {
    throw new Error("Room is required");
  }

  if (!event) {
    throw new Error("Event is required");
  }

  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 26. BROADCAST TO ROOM EXCEPT SENDER
 * ============================================================
 *
 * socket.to(room).emit(...)
 *
 * sends to the room except this socket.
 *
 * ============================================================
 */

export function emitToRoomExceptSender(socket, room, event, data) {
  if (!socket) {
    throw new Error("Socket is required");
  }

  socket.to(room).emit(event, data);
}

/*
 * ============================================================
 * 27. BROADCAST TO MULTIPLE ROOMS
 * ============================================================
 *
 * Example:
 *
 *     io.to(roomA)
 *       .to(roomB)
 *       .emit(...)
 *
 * Socket.IO handles the union of recipients.
 *
 * ============================================================
 */

export function emitToRooms(io, rooms, event, data) {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    throw new Error("At least one room is required");
  }

  let target = io;

  for (const room of rooms) {
    target = target.to(room);
  }

  target.emit(event, data);
}

/*
 * ============================================================
 * 28. SOCKET TO ROOM
 * ============================================================
 *
 * Example:
 *
 *     socket.to(room).emit(...)
 *
 * Sender does NOT receive it.
 *
 * ============================================================
 */

export function socketEmitToRoom(socket, room, event, data) {
  socket.to(room).emit(event, data);
}

/*
 * ============================================================
 * 29. SOCKET TO ITSELF
 * ============================================================
 *
 * socket.emit(...)
 *
 * sends only to this socket.
 *
 * ============================================================
 */

export function emitToSocket(socket, event, data) {
  socket.emit(event, data);
}

/*
 * ============================================================
 * 30. SERVER TO ALL SOCKETS
 * ============================================================
 *
 * io.emit(...)
 *
 * sends to every connected socket.
 *
 * ============================================================
 */

export function emitToAll(io, event, data) {
  io.emit(event, data);
}

/*
 * ============================================================
 * 31. PRIVATE MESSAGE THROUGH USER ROOM
 * ============================================================
 *
 * Instead of:
 *
 *     find socket ID
 *
 * use:
 *
 *     user:userId
 *
 * This works especially well when a user has
 * multiple browser/device connections.
 *
 * ============================================================
 */

export function emitToUser(io, userId, event, data) {
  const room = userRoom(userId);

  io.to(room).emit(event, data);
}

/*
 * ============================================================
 * 32. NOTIFICATION
 * ============================================================
 */

export function notifyUser(io, userId, notification) {
  emitToUser(io, userId, "notification", notification);
}

/*
 * ============================================================
 * 33. ROOM EVENT
 * ============================================================
 */

export function emitConversationEvent(io, conversationId, event, data) {
  const room = conversationRoom(conversationId);

  emitToRoom(io, room, event, data);
}

/*
 * ============================================================
 * 34. ROOM AUTHORIZATION
 * ============================================================
 *
 * Joining a room is NOT automatically authorization.
 *
 * Correct:
 *
 *     authenticate
 *         ↓
 *     load conversation
 *         ↓
 *     check membership
 *         ↓
 *     socket.join(room)
 *
 * ============================================================
 */

export async function authorizeRoomAccess(
  socket,
  resource,
  {
    userField = "user",

    ownerField = "ownerId",

    organizationField = "organizationId",
  } = {},
) {
  const user = socket.data[userField];

  if (!user) {
    return false;
  }

  if (
    resource[ownerField] &&
    String(resource[ownerField]) === String(user.id)
  ) {
    return true;
  }

  if (
    resource[organizationField] &&
    user[organizationField] &&
    String(resource[organizationField]) === String(user[organizationField])
  ) {
    return true;
  }

  return false;
}

/*
 * ============================================================
 * 35. SAFE ROOM JOIN
 * ============================================================
 */

export async function safeJoinRoom(socket, room, { authorize } = {}) {
  if (typeof authorize !== "function") {
    throw new TypeError("authorize function is required");
  }

  const allowed = await authorize(socket, room);

  if (!allowed) {
    throw new Error("Room access denied");
  }

  socket.join(room);

  return {
    success: true,

    room,
  };
}

/*
 * ============================================================
 * 36. SAFE LEAVE ROOM
 * ============================================================
 */

export function safeLeaveRoom(socket, room) {
  if (!isSocketInRoom(socket, room)) {
    return {
      success: false,

      reason: "NOT_IN_ROOM",

      room,
    };
  }

  socket.leave(room);

  return {
    success: true,

    room,
  };
}

/*
 * ============================================================
 * 37. REMOVE SOCKET FROM APPLICATION ROOMS
 * ============================================================
 *
 * Usually Socket.IO automatically removes the socket
 * from rooms when it disconnects.
 *
 * This function is useful when you want explicit cleanup.
 *
 * ============================================================
 */

export function leaveApplicationRooms(socket, { except = [] } = {}) {
  const excluded = new Set(except);

  const rooms = [...socket.rooms];

  for (const room of rooms) {
    /*
     * socket.id is automatically associated
     * with the socket's own room.
     */

    if (room === socket.id) {
      continue;
    }

    if (excluded.has(room)) {
      continue;
    }

    socket.leave(room);
  }
}

/*
 * ============================================================
 * 38. ROOM NAME VALIDATION
 * ============================================================
 *
 * Never allow arbitrary dangerous room names
 * if your application has naming rules.
 *
 * ============================================================
 */

export function validateRoomName(room) {
  if (typeof room !== "string") {
    return false;
  }

  if (room.length < 1 || room.length > 200) {
    return false;
  }

  /*
   * Example allowed:
   *
   * user:user_123
   * conversation:abc123
   */

  return /^[a-zA-Z0-9:_-]+$/.test(room);
}

/*
 * ============================================================
 * 39. SAFE ROOM NAME
 * ============================================================
 */

export function safeRoomName(prefix, id) {
  const room = createRoomName(prefix, id);

  if (!validateRoomName(room)) {
    throw new Error("Invalid room name");
  }

  return room;
}

/*
 * ============================================================
 * 40. ROOM SNAPSHOT
 * ============================================================
 *
 * Useful for debugging / monitoring.
 *
 * ============================================================
 */

export function getRoomSnapshot(io, room) {
  const members = getRoomMembers(io, room);

  return {
    room,

    exists: members.length > 0,

    memberCount: members.length,

    members,

    timestamp: Date.now(),
  };
}

/*
 * ============================================================
 * 41. ROOM EVENTS
 * ============================================================
 *
 * Standard event names.
 * ============================================================
 */

export const ROOM_EVENTS = Object.freeze({
  JOIN: "room:join",

  JOINED: "room:joined",

  LEAVE: "room:leave",

  LEFT: "room:left",

  MESSAGE: "room:message",

  USER_JOINED: "room:user-joined",

  USER_LEFT: "room:user-left",

  ERROR: "room:error",
});

/*
 * ============================================================
 * 42. ROOM EVENT PAYLOAD
 * ============================================================
 */

export function createRoomEvent(room, event, data) {
  return {
    room,

    event,

    data,

    timestamp: Date.now(),
  };
}

/*
 * ============================================================
 * 43. EXPORT
 * ============================================================
 */

export default {
  ROOM_PREFIX,

  ROOM_EVENTS,

  createRoomName,

  userRoom,

  conversationRoom,

  projectRoom,

  organizationRoom,

  teamRoom,

  gameRoom,

  documentRoom,

  joinRoom,

  joinRooms,

  leaveRoom,

  leaveRooms,

  getSocketRooms,

  getServerRooms,

  isSocketInRoom,

  roomExists,

  getRoomSize,

  getRoomMembers,

  getRoomInfo,

  joinUserRoom,

  joinConversation,

  joinProject,

  joinOrganization,

  emitToRoom,

  emitToRoomExceptSender,

  emitToRooms,

  socketEmitToRoom,

  emitToSocket,

  emitToAll,

  emitToUser,

  notifyUser,

  emitConversationEvent,

  authorizeRoomAccess,

  safeJoinRoom,

  safeLeaveRoom,

  leaveApplicationRooms,

  validateRoomName,

  safeRoomName,

  getRoomSnapshot,

  createRoomEvent,
};
