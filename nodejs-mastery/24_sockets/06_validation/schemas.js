/**
 * ============================================================
 * 06_validation/schemas.js
 * ============================================================
 *
 * CENTRAL SOCKET.IO ZOD SCHEMA REGISTRY
 *
 * This file contains reusable schemas for:
 *
 * 01. Common values
 * 02. IDs
 * 03. Pagination
 * 04. Sorting
 * 05. Authentication
 * 06. Users
 * 07. Rooms
 * 08. Messages
 * 09. Typing
 * 10. Presence
 * 11. Notifications
 * 12. Search
 * 13. Generic event payloads
 * 14. ACK responses
 * 15. Errors
 * 16. Cursor pagination
 * 17. Batch operations
 * 18. Client metadata
 * 19. Socket handshake data
 * 20. Schema composition
 *
 * ============================================================
 */

import { z } from "zod";

/*
 * ============================================================
 * 01. COMMON SCHEMAS
 * ============================================================
 */

/**
 * Generic ID.
 *
 * Change this depending on your database.
 *
 * For MongoDB you may instead use:
 *
 * z.string().regex(/^[a-f\d]{24}$/i)
 */
export const idSchema = z
  .string()
  .trim()
  .min(1, "ID is required")
  .max(128, "ID is too long");

/**
 * UUID.
 */
export const uuidSchema = z.uuid("Invalid UUID");

/**
 * Request ID.
 *
 * Useful for idempotency and
 * tracing individual socket requests.
 */
export const requestIdSchema = z.string().trim().min(1).max(128);

/**
 * Username.
 */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must contain at least 3 characters")
  .max(30, "Username must contain at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can contain only letters, numbers and underscore",
  );

/**
 * Display name.
 */
export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Display name is too short")
  .max(100, "Display name is too long");

/**
 * Email.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(254, "Email is too long");

/**
 * Password.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(128, "Password is too long");

/**
 * URL.
 */
export const urlSchema = z.url("Invalid URL");

/**
 * Search text.
 */
export const searchTextSchema = z
  .string()
  .trim()
  .min(1, "Search text cannot be empty")
  .max(200, "Search text is too long");

/*
 * ============================================================
 * 02. PAGINATION
 * ============================================================
 */

/**
 * Page based pagination.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Sorting.
 */
export const sortOrderSchema = z.enum(["asc", "desc"]);

/**
 * Generic sorting.
 *
 * Specific schemas can restrict sortBy.
 */
export const sortingSchema = z.object({
  sortBy: z.string().trim().min(1).max(100).optional(),

  sortOrder: sortOrderSchema.default("asc"),
});

/**
 * Cursor pagination.
 */
export const cursorPaginationSchema = z.object({
  cursor: idSchema.optional(),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/*
 * ============================================================
 * 03. AUTHENTICATION SCHEMAS
 * ============================================================
 */

/**
 * Login.
 */
export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Register.
 */
export const registerSchema = z.object({
  username: usernameSchema,

  email: emailSchema,

  password: passwordSchema,

  displayName: displayNameSchema.optional(),

  requestId: requestIdSchema.optional(),
});

/**
 * Refresh token.
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).max(4096),
});

/**
 * Logout.
 */
export const logoutSchema = z.object({
  requestId: requestIdSchema.optional(),
});

/**
 * Password change.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,

    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",

    path: ["newPassword"],
  });

/*
 * ============================================================
 * 04. USER SCHEMAS
 * ============================================================
 */

/**
 * User role.
 */
export const roleSchema = z.enum(["user", "moderator", "admin"]);

/**
 * User status.
 */
export const userStatusSchema = z.enum([
  "active",
  "inactive",
  "blocked",
  "suspended",
]);

/**
 * Create user.
 */
export const createUserSchema = z.object({
  username: usernameSchema,

  email: emailSchema,

  password: passwordSchema,

  displayName: displayNameSchema.optional(),

  role: roleSchema.default("user"),
});

/**
 * Update user.
 *
 * Every field is optional.
 */
export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),

    email: emailSchema.optional(),

    displayName: displayNameSchema.optional(),

    avatar: urlSchema.nullable().optional(),

    bio: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * User ID payload.
 */
export const userIdSchema = z.object({
  userId: idSchema,
});

/**
 * Public user.
 *
 * Never expose password/hash fields.
 */
export const publicUserSchema = z.object({
  id: idSchema,

  username: usernameSchema,

  displayName: displayNameSchema,

  avatar: urlSchema.nullable(),

  bio: z.string().max(500).nullable(),

  status: userStatusSchema,
});

/*
 * ============================================================
 * 05. ROOM SCHEMAS
 * ============================================================
 */

/**
 * Room type.
 */
export const roomTypeSchema = z.enum(["public", "private", "direct", "group"]);

/**
 * Join room.
 */
export const joinRoomSchema = z.object({
  roomId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Leave room.
 */
export const leaveRoomSchema = z.object({
  roomId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Create room.
 */
export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required")
    .max(100, "Room name is too long"),

  type: roomTypeSchema,

  memberIds: z.array(idSchema).max(100, "Too many members").default([]),

  requestId: requestIdSchema.optional(),
});

/**
 * Add member.
 */
export const addRoomMemberSchema = z.object({
  roomId: idSchema,

  userId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Remove member.
 */
export const removeRoomMemberSchema = z.object({
  roomId: idSchema,

  userId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Room ID only.
 */
export const roomIdSchema = z.object({
  roomId: idSchema,
});

/*
 * ============================================================
 * 06. MESSAGE SCHEMAS
 * ============================================================
 */

/**
 * Message type.
 */
export const messageTypeSchema = z.enum(["text", "image", "file", "system"]);

/**
 * Message content.
 */
export const messageContentSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(5000, "Message is too long");

/**
 * Send message.
 */
export const sendMessageSchema = z.object({
  roomId: idSchema,

  message: messageContentSchema,

  type: messageTypeSchema.default("text"),

  requestId: requestIdSchema.optional(),

  replyTo: idSchema.nullable().optional(),
});

/**
 * Edit message.
 */
export const editMessageSchema = z.object({
  messageId: idSchema,

  message: messageContentSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Delete message.
 */
export const deleteMessageSchema = z.object({
  messageId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * React to message.
 */
export const messageReactionSchema = z.object({
  messageId: idSchema,

  reaction: z.string().trim().min(1).max(20),

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 07. TYPING SCHEMAS
 * ============================================================
 */

/**
 * Typing start/stop.
 */
export const typingSchema = z.object({
  roomId: idSchema,

  isTyping: z.boolean(),
});

/*
 * ============================================================
 * 08. PRESENCE SCHEMAS
 * ============================================================
 */

/**
 * Presence state.
 */
export const presenceStatusSchema = z.enum([
  "online",
  "offline",
  "away",
  "busy",
]);

/**
 * Presence update.
 */
export const presenceUpdateSchema = z.object({
  status: presenceStatusSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * User presence query.
 */
export const presenceQuerySchema = z.object({
  userId: idSchema,
});

/*
 * ============================================================
 * 09. NOTIFICATION SCHEMAS
 * ============================================================
 */

/**
 * Notification type.
 */
export const notificationTypeSchema = z.enum([
  "message",
  "friend_request",
  "mention",
  "system",
  "room_invite",
]);

/**
 * Notification ID.
 */
export const notificationIdSchema = z.object({
  notificationId: idSchema,
});

/**
 * Mark notification read.
 */
export const markNotificationReadSchema = z.object({
  notificationId: idSchema,
});

/**
 * Mark all notifications read.
 */
export const markAllNotificationsReadSchema = z.object({
  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 10. SEARCH SCHEMAS
 * ============================================================
 */

/**
 * User search.
 */
export const searchUsersSchema = z.object({
  query: searchTextSchema,

  page: z.coerce.number().int().min(1).max(10_000).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Message search.
 */
export const searchMessagesSchema = z.object({
  roomId: idSchema.optional(),

  query: searchTextSchema,

  page: z.coerce.number().int().min(1).max(10_000).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/*
 * ============================================================
 * 11. FRIEND / CONNECTION SCHEMAS
 * ============================================================
 */

/**
 * Friend request.
 */
export const friendRequestSchema = z.object({
  userId: idSchema,

  requestId: requestIdSchema.optional(),
});

/**
 * Accept friend request.
 */
export const acceptFriendRequestSchema = z.object({
  requestId: idSchema,
});

/**
 * Reject friend request.
 */
export const rejectFriendRequestSchema = z.object({
  requestId: idSchema,
});

/*
 * ============================================================
 * 12. FILE / MEDIA METADATA
 * ============================================================
 *
 * This validates metadata.
 *
 * Actual binary file handling should have
 * separate size/type restrictions.
 *
 * ============================================================
 */

export const mediaMetadataSchema = z.object({
  filename: z.string().trim().min(1).max(255),

  mimeType: z.string().trim().min(1).max(100),

  size: z
    .number()
    .int()
    .positive()
    .max(50 * 1024 * 1024, "File is too large"),

  url: urlSchema.optional(),
});

/*
 * ============================================================
 * 13. GENERIC EVENT METADATA
 * ============================================================
 */

/**
 * Metadata attached to requests.
 */
export const eventMetadataSchema = z.object({
  requestId: requestIdSchema.optional(),

  clientTimestamp: z.number().int().positive().optional(),
});

/*
 * ============================================================
 * 14. SOCKET CLIENT INFORMATION
 * ============================================================
 */

/**
 * Client information.
 */
export const clientInfoSchema = z.object({
  platform: z
    .enum(["web", "ios", "android", "desktop", "unknown"])
    .default("unknown"),

  version: z.string().max(50).optional(),

  userAgent: z.string().max(1000).optional(),
});

/*
 * ============================================================
 * 15. HANDSHAKE AUTH DATA
 * ============================================================
 *
 * This validates the data provided during
 * the Socket.IO handshake.
 *
 * Authentication itself must still verify
 * the token/session.
 *
 * ============================================================
 */

export const handshakeAuthSchema = z
  .object({
    token: z.string().min(1).max(8192).optional(),

    sessionId: idSchema.optional(),
  })
  .refine((data) => Boolean(data.token || data.sessionId), {
    message: "Authentication token or session ID is required",
  });

/*
 * ============================================================
 * 16. GENERIC ERROR SCHEMA
 * ============================================================
 */

export const errorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "AUTHENTICATION_ERROR",
  "AUTHORIZATION_ERROR",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "TIMEOUT",
  "INTERNAL_ERROR",
]);

export const errorDetailSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),

  message: z.string(),

  code: z.string(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),

  error: z.object({
    code: errorCodeSchema,

    message: z.string(),

    details: z.array(errorDetailSchema).optional(),
  }),
});

/*
 * ============================================================
 * 17. GENERIC SUCCESS RESPONSE
 * ============================================================
 */

/**
 * Generic response factory.
 *
 * Example:
 *
 * createSuccessResponseSchema(
 *   userSchema
 * )
 */
export function createSuccessResponseSchema(dataSchema) {
  return z.object({
    success: z.literal(true),

    data: dataSchema,
  });
}

/*
 * ============================================================
 * 18. PAGINATED RESPONSE FACTORY
 * ============================================================
 */

/**
 * Creates:
 *
 * {
 *   success: true,
 *   data: {
 *     items: [],
 *     page: 1,
 *     limit: 20,
 *     total: 100
 *   }
 * }
 */
export function createPaginatedResponseSchema(itemSchema) {
  return z.object({
    success: z.literal(true),

    data: z.object({
      items: z.array(itemSchema),

      page: z.number().int().positive(),

      limit: z.number().int().positive(),

      total: z.number().int().nonnegative(),

      hasNext: z.boolean(),
    }),
  });
}

/*
 * ============================================================
 * 19. MESSAGE RESPONSE
 * ============================================================
 */

export const messageResponseSchema = z.object({
  id: idSchema,

  roomId: idSchema,

  senderId: idSchema,

  message: messageContentSchema,

  type: messageTypeSchema,

  createdAt: z.string(),

  updatedAt: z.string().optional(),
});

/*
 * ============================================================
 * 20. ROOM RESPONSE
 * ============================================================
 */

export const roomResponseSchema = z.object({
  id: idSchema,

  name: z.string().min(1).max(100),

  type: roomTypeSchema,

  memberCount: z.number().int().nonnegative(),

  createdAt: z.string(),
});

/*
 * ============================================================
 * 21. USER RESPONSE
 * ============================================================
 */

export const userResponseSchema = z.object({
  id: idSchema,

  username: usernameSchema,

  displayName: displayNameSchema,

  email: emailSchema.optional(),

  avatar: urlSchema.nullable(),

  status: userStatusSchema,
});

/*
 * ============================================================
 * 22. BATCH MESSAGE OPERATION
 * ============================================================
 */

/**
 * Batch delete messages.
 */
export const batchDeleteMessagesSchema = z.object({
  messageIds: z
    .array(idSchema)
    .min(1, "At least one message ID is required")
    .max(100, "Maximum 100 messages per request"),

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 23. BATCH ROOM OPERATION
 * ============================================================
 */

export const batchRoomMembersSchema = z.object({
  roomId: idSchema,

  userIds: z.array(idSchema).min(1).max(100),

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 24. DIRECT MESSAGE
 * ============================================================
 */

export const directMessageSchema = z.object({
  recipientId: idSchema,

  message: messageContentSchema,

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 25. BLOCK USER
 * ============================================================
 */

export const blockUserSchema = z.object({
  userId: idSchema,

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 26. UNBLOCK USER
 * ============================================================
 */

export const unblockUserSchema = z.object({
  userId: idSchema,

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 27. READ RECEIPT
 * ============================================================
 */

export const readReceiptSchema = z.object({
  roomId: idSchema,

  messageId: idSchema,

  requestId: requestIdSchema.optional(),
});

/*
 * ============================================================
 * 28. DELIVERY RECEIPT
 * ============================================================
 */

export const deliveryReceiptSchema = z.object({
  messageId: idSchema,

  deliveredAt: z.string().datetime().optional(),
});

/*
 * ============================================================
 * 29. EVENT TYPES
 * ============================================================
 */

/**
 * Useful when you maintain a
 * central event registry.
 */
export const eventNameSchema = z.enum([
  "user:create",
  "user:update",
  "user:delete",

  "room:create",
  "room:join",
  "room:leave",

  "message:send",
  "message:edit",
  "message:delete",

  "typing:start",
  "typing:stop",

  "presence:update",

  "notification:read",

  "search:users",
  "search:messages",
]);

/*
 * ============================================================
 * 30. DISCRIMINATED EVENT PAYLOAD
 * ============================================================
 *
 * Different event types have different payloads.
 *
 * ============================================================
 */

export const socketEventSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("room:join"),

    payload: joinRoomSchema,
  }),

  z.object({
    event: z.literal("room:leave"),

    payload: leaveRoomSchema,
  }),

  z.object({
    event: z.literal("message:send"),

    payload: sendMessageSchema,
  }),

  z.object({
    event: z.literal("message:edit"),

    payload: editMessageSchema,
  }),

  z.object({
    event: z.literal("message:delete"),

    payload: deleteMessageSchema,
  }),
]);

/*
 * ============================================================
 * 31. SCHEMA HELPERS
 * ============================================================
 */

/**
 * Parse schema.
 */
export function parseSchema(schema, payload) {
  return schema.parse(payload);
}

/**
 * Safe parse.
 */
export function safeParseSchema(schema, payload) {
  return schema.safeParse(payload);
}

/**
 * Validate schema and return
 * a normalized result.
 */
export function validateSchema(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,

      data: null,

      errors: result.error.issues,
    };
  }

  return {
    success: true,

    data: result.data,

    errors: [],
  };
}

/*
 * ============================================================
 * 32. EXAMPLE RESPONSE SCHEMAS
 * ============================================================
 */

/**
 * User created response.
 */
export const createUserResponseSchema =
  createSuccessResponseSchema(userResponseSchema);

/**
 * Room created response.
 */
export const createRoomResponseSchema =
  createSuccessResponseSchema(roomResponseSchema);

/**
 * Message response.
 */
export const sendMessageResponseSchema = createSuccessResponseSchema(
  messageResponseSchema,
);

/**
 * User list.
 */
export const userListResponseSchema =
  createPaginatedResponseSchema(userResponseSchema);

/**
 * Message list.
 */
export const messageListResponseSchema = createPaginatedResponseSchema(
  messageResponseSchema,
);

/*
 * ============================================================
 * 33. END
 * ============================================================
 */
