/**
 * ============================================================
 * 05_errors/validation-errors.js
 * ============================================================
 *
 * SOCKET.IO VALIDATION ERROR HANDLING
 *
 * Topics:
 *
 * 01. Why socket payload validation is required
 * 02. Manual validation
 * 03. Required fields
 * 04. String validation
 * 05. Number validation
 * 06. Boolean validation
 * 07. Enum validation
 * 08. Array validation
 * 09. Nested object validation
 * 10. Optional fields
 * 11. Nullable fields
 * 12. Unknown fields
 * 13. Sanitization
 * 14. Zod validation
 * 15. Zod error formatting
 * 16. Field-level errors
 * 17. Validation middleware
 * 18. ACK error responses
 * 19. Async handlers
 * 20. Production pattern
 *
 * ============================================================
 */

import { z } from "zod";

/*
 * ============================================================
 * 01. SOCKET ERROR
 * ============================================================
 */

class SocketError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = options.name ?? "SocketError";

    this.code = options.code ?? "SOCKET_ERROR";

    this.statusCode = options.statusCode ?? 500;

    this.isOperational = options.isOperational ?? true;

    this.details = options.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * ============================================================
 * 02. VALIDATION ERROR
 * ============================================================
 */

class ValidationError extends SocketError {
  constructor(message = "Validation failed", details = []) {
    super(message, {
      name: "ValidationError",

      code: "VALIDATION_ERROR",

      statusCode: 400,

      isOperational: true,

      details,
    });
  }
}

/*
 * ============================================================
 * 03. SAFE CLIENT ERROR
 * ============================================================
 */

function toClientError(error) {
  if (error instanceof ValidationError) {
    return {
      code: error.code,

      message: error.message,

      details: error.details,
    };
  }

  return {
    code: "INTERNAL_ERROR",

    message: "Internal server error",
  };
}

/*
 * ============================================================
 * 04. ACK SUCCESS
 * ============================================================
 */

function ackSuccess(acknowledge, data) {
  acknowledge?.({
    success: true,

    data,
  });
}

/*
 * ============================================================
 * 05. ACK ERROR
 * ============================================================
 */

function ackError(acknowledge, error) {
  acknowledge?.({
    success: false,

    error: toClientError(error),
  });
}

/*
 * ============================================================
 * 06. MANUAL VALIDATION
 * ============================================================
 */

function validateObject(payload) {
  const errors = [];

  /*
   * Payload itself.
   */

  if (
    payload === null ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    errors.push({
      field: "payload",

      code: "INVALID_TYPE",

      message: "Payload must be an object",
    });

    return errors;
  }

  /*
   * name
   */

  if (typeof payload.name !== "string") {
    errors.push({
      field: "name",

      code: "INVALID_TYPE",

      message: "name must be a string",
    });
  }

  /*
   * email
   */

  if (typeof payload.email !== "string") {
    errors.push({
      field: "email",

      code: "INVALID_TYPE",

      message: "email must be a string",
    });
  }

  /*
   * age
   */

  if (typeof payload.age !== "number") {
    errors.push({
      field: "age",

      code: "INVALID_TYPE",

      message: "age must be a number",
    });
  }

  return errors;
}

/*
 * ============================================================
 * 07. REQUIRED FIELD VALIDATION
 * ============================================================
 */

function requireField(payload, field) {
  if (payload[field] === undefined || payload[field] === null) {
    return {
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    };
  }

  return null;
}

/*
 * ============================================================
 * 08. STRING VALIDATION
 * ============================================================
 */

function validateString(payload, field, options = {}) {
  const errors = [];

  const value = payload[field];

  /*
   * Required.
   */

  if (options.required && (value === undefined || value === null)) {
    errors.push({
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    });

    return errors;
  }

  /*
   * Optional and absent.
   */

  if (value === undefined || value === null) {
    return errors;
  }

  /*
   * Type.
   */

  if (typeof value !== "string") {
    errors.push({
      field,

      code: "INVALID_TYPE",

      message: `${field} must be a string`,
    });

    return errors;
  }

  /*
   * Minimum length.
   */

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push({
      field,

      code: "TOO_SHORT",

      message: `${field} must contain at least ${options.minLength} characters`,
    });
  }

  /*
   * Maximum length.
   */

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors.push({
      field,

      code: "TOO_LONG",

      message: `${field} must contain at most ${options.maxLength} characters`,
    });
  }

  /*
   * Regex.
   */

  if (options.pattern && !options.pattern.test(value)) {
    errors.push({
      field,

      code: "INVALID_FORMAT",

      message: `${field} has an invalid format`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 09. NUMBER VALIDATION
 * ============================================================
 */

function validateNumber(payload, field, options = {}) {
  const errors = [];

  const value = payload[field];

  /*
   * Required.
   */

  if (options.required && (value === undefined || value === null)) {
    errors.push({
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    });

    return errors;
  }

  /*
   * Optional and absent.
   */

  if (value === undefined || value === null) {
    return errors;
  }

  /*
   * Number type.
   */

  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push({
      field,

      code: "INVALID_TYPE",

      message: `${field} must be a finite number`,
    });

    return errors;
  }

  /*
   * Minimum.
   */

  if (options.min !== undefined && value < options.min) {
    errors.push({
      field,

      code: "TOO_SMALL",

      message: `${field} must be at least ${options.min}`,
    });
  }

  /*
   * Maximum.
   */

  if (options.max !== undefined && value > options.max) {
    errors.push({
      field,

      code: "TOO_LARGE",

      message: `${field} must be at most ${options.max}`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 10. BOOLEAN VALIDATION
 * ============================================================
 */

function validateBoolean(payload, field, options = {}) {
  const errors = [];

  const value = payload[field];

  if (options.required && (value === undefined || value === null)) {
    errors.push({
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    });

    return errors;
  }

  if (value === undefined || value === null) {
    return errors;
  }

  if (typeof value !== "boolean") {
    errors.push({
      field,

      code: "INVALID_TYPE",

      message: `${field} must be a boolean`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 11. ENUM VALIDATION
 * ============================================================
 */

function validateEnum(payload, field, allowedValues, options = {}) {
  const errors = [];

  const value = payload[field];

  if (options.required && value === undefined) {
    errors.push({
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    });

    return errors;
  }

  if (value === undefined) {
    return errors;
  }

  if (!allowedValues.includes(value)) {
    errors.push({
      field,

      code: "INVALID_ENUM",

      message: `${field} must be one of: ${allowedValues.join(", ")}`,

      allowedValues,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 12. ARRAY VALIDATION
 * ============================================================
 */

function validateArray(payload, field, options = {}) {
  const errors = [];

  const value = payload[field];

  if (options.required && value === undefined) {
    errors.push({
      field,

      code: "REQUIRED",

      message: `${field} is required`,
    });

    return errors;
  }

  if (value === undefined) {
    return errors;
  }

  if (!Array.isArray(value)) {
    errors.push({
      field,

      code: "INVALID_TYPE",

      message: `${field} must be an array`,
    });

    return errors;
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push({
      field,

      code: "TOO_FEW_ITEMS",

      message: `${field} must contain at least ${options.minLength} items`,
    });
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors.push({
      field,

      code: "TOO_MANY_ITEMS",

      message: `${field} must contain at most ${options.maxLength} items`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 13. ZOD SCHEMA
 * ============================================================
 */

const userUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must contain at most 100 characters"),

  email: z.email(),

  age: z.number().int().min(18).max(120),

  active: z.boolean().optional(),

  role: z.enum(["user", "admin", "moderator"]).optional(),
});

/*
 * ============================================================
 * 14. CREATE USER SCHEMA
 * ============================================================
 */

const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username contains invalid characters"),

  email: z.email(),

  password: z.string().min(8).max(128),

  age: z.number().int().min(13).max(120),
});

/*
 * ============================================================
 * 15. NESTED OBJECT SCHEMA
 * ============================================================
 */

const profileSchema = z.object({
  userId: z.string().min(1),

  profile: z.object({
    firstName: z.string().min(1),

    lastName: z.string().min(1),

    address: z.object({
      city: z.string().min(1),

      country: z.string().min(1),

      postalCode: z.string().min(3),
    }),
  }),
});

/*
 * ============================================================
 * 16. ARRAY SCHEMA
 * ============================================================
 */

const bulkUsersSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string().min(2),

        email: z.email(),
      }),
    )
    .min(1)
    .max(100),
});

/*
 * ============================================================
 * 17. OPTIONAL + NULLABLE
 * ============================================================
 */

const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),

  nickname: z.string().nullable().optional(),
});

/*
 * ============================================================
 * 18. UNKNOWN FIELDS
 * ============================================================
 *
 * Default Zod object behavior strips unknown fields when
 * parsing.
 *
 * Example:
 *
 * {
 *   name: "Shiva",
 *   password: "secret",
 *   maliciousField: "..."
 * }
 *
 * Use .strict() when unknown fields should be rejected.
 *
 * ============================================================
 */

const strictSchema = z
  .object({
    name: z.string(),

    email: z.email(),
  })
  .strict();

/*
 * ============================================================
 * 19. ZOD ERROR FORMATTER
 * ============================================================
 */

function formatZodError(error) {
  return error.issues.map((issue) => {
    return {
      field: issue.path.map(String).join(".") || "payload",

      code: issue.code,

      message: issue.message,
    };
  });
}

/*
 * ============================================================
 * 20. VALIDATE WITH ZOD
 * ============================================================
 */

function validateWithZod(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new ValidationError(
      "Request validation failed",
      formatZodError(result.error),
    );
  }

  return result.data;
}

/*
 * ============================================================
 * 21. SOCKET VALIDATION MIDDLEWARE
 * ============================================================
 */

function validatePayload(schema) {
  return (socket, payload, acknowledge, next) => {
    try {
      const validatedPayload = validateWithZod(schema, payload);

      /*
       * Store validated data.
       */

      socket.data.validatedPayload = validatedPayload;

      /*
       * Continue.
       */

      next(validatedPayload);
    } catch (error) {
      /*
       * ACK error.
       */

      ackError(acknowledge, error);
    }
  };
}

/*
 * ============================================================
 * 22. EVENT VALIDATION HELPER
 * ============================================================
 */

function validateEvent(schema, payload) {
  return validateWithZod(schema, payload);
}

/*
 * ============================================================
 * 23. MANUAL VALIDATION EXAMPLE
 * ============================================================
 */

function manuallyValidateUser(payload) {
  const errors = [];

  errors.push(
    ...validateString(payload, "name", {
      required: true,

      minLength: 2,

      maxLength: 100,
    }),
  );

  errors.push(
    ...validateString(payload, "email", {
      required: true,

      maxLength: 255,
    }),
  );

  errors.push(
    ...validateNumber(payload, "age", {
      required: true,

      min: 18,

      max: 120,
    }),
  );

  errors.push(
    ...validateBoolean(payload, "active", {
      required: false,
    }),
  );

  errors.push(...validateEnum(payload, "role", ["user", "admin", "moderator"]));

  if (errors.length) {
    throw new ValidationError("Request validation failed", errors);
  }

  return payload;
}

/*
 * ============================================================
 * 24. SOCKET.IO REGISTRATION
 * ============================================================
 */

function registerValidationExamples(io) {
  io.on("connection", (socket) => {
    /*
     * ======================================================
     * 01. MANUAL VALIDATION
     * ======================================================
     */

    socket.on("user:update:manual", (payload, acknowledge) => {
      try {
        const data = manuallyValidateUser(payload);

        /*
         * Only validated data reaches
         * your business logic.
         */

        ackSuccess(acknowledge, {
          validated: data,
        });
      } catch (error) {
        console.error(error);

        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 02. ZOD VALIDATION
     * ======================================================
     */

    socket.on("user:update", (payload, acknowledge) => {
      try {
        const data = validateEvent(userUpdateSchema, payload);

        /*
         * Business logic goes here.
         */

        ackSuccess(acknowledge, {
          validated: data,
        });
      } catch (error) {
        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 03. CREATE USER
     * ======================================================
     */

    socket.on("user:create", (payload, acknowledge) => {
      try {
        const data = validateEvent(createUserSchema, payload);

        /*
         * Never log password.
         */

        console.log({
          username: data.username,

          email: data.email,

          age: data.age,
        });

        ackSuccess(acknowledge, {
          created: true,
        });
      } catch (error) {
        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 04. NESTED OBJECT
     * ======================================================
     */

    socket.on("profile:update", (payload, acknowledge) => {
      try {
        const data = validateEvent(profileSchema, payload);

        ackSuccess(acknowledge, data);
      } catch (error) {
        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 05. BULK ARRAY
     * ======================================================
     */

    socket.on("users:bulk", (payload, acknowledge) => {
      try {
        const data = validateEvent(bulkUsersSchema, payload);

        ackSuccess(acknowledge, {
          count: data.users.length,
        });
      } catch (error) {
        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 06. OPTIONAL / NULLABLE
     * ======================================================
     */

    socket.on("settings:update", (payload, acknowledge) => {
      try {
        const data = validateEvent(settingsSchema, payload);

        ackSuccess(acknowledge, data);
      } catch (error) {
        ackError(acknowledge, error);
      }
    });

    /*
     * ======================================================
     * 07. STRICT OBJECT
     * ======================================================
     */

    socket.on("strict:test", (payload, acknowledge) => {
      try {
        const data = validateEvent(strictSchema, payload);

        ackSuccess(acknowledge, data);
      } catch (error) {
        ackError(acknowledge, error);
      }
    });
  });
}

/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

export {
  SocketError,
  ValidationError,
  validateObject,
  requireField,
  validateString,
  validateNumber,
  validateBoolean,
  validateEnum,
  validateArray,
  userUpdateSchema,
  createUserSchema,
  profileSchema,
  bulkUsersSchema,
  settingsSchema,
  strictSchema,
  formatZodError,
  validateWithZod,
  validatePayload,
  validateEvent,
  manuallyValidateUser,
  registerValidationExamples,
  ackSuccess,
  ackError,
  toClientError,
};
