/**
 * ============================================================
 * 06_validation/payload-validation.js
 * ============================================================
 *
 * SOCKET.IO PAYLOAD VALIDATION
 *
 * Topics:
 *
 * 01. What is payload validation?
 * 02. Why socket payloads are untrusted
 * 03. Required fields
 * 04. Optional fields
 * 05. Type validation
 * 06. String validation
 * 07. Number validation
 * 08. Boolean validation
 * 09. Arrays
 * 10. Objects
 * 11. Enums
 * 12. IDs
 * 13. Pagination
 * 14. Sorting
 * 15. Filtering
 * 16. Nested payloads
 * 17. Unknown fields
 * 18. Payload size
 * 19. Sanitization
 * 20. Validation middleware
 * 21. Validation + ACK
 * 22. Reusable validators
 * 23. Production pattern
 *
 * ============================================================
 */

/*
 * ============================================================
 * VALIDATION ERROR
 * ============================================================
 */

export class ValidationError extends Error {
  constructor(message = "Validation failed", details = []) {
    super(message);

    this.name = "ValidationError";

    this.code = "VALIDATION_ERROR";

    this.statusCode = 400;

    this.details = details;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * ============================================================
 * ERROR RESPONSE
 * ============================================================
 */

export function validationErrorResponse(error) {
  return {
    success: false,

    error: {
      code: error.code ?? "VALIDATION_ERROR",

      message: error.message ?? "Validation failed",

      details: error.details ?? [],
    },
  };
}

/*
 * ============================================================
 * SUCCESS RESPONSE
 * ============================================================
 */

export function successResponse(data) {
  return {
    success: true,

    data,
  };
}

/*
 * ============================================================
 * 01. IS OBJECT
 * ============================================================
 */

export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/*
 * ============================================================
 * 02. REQUIRED FIELD
 * ============================================================
 */

export function required(payload, field) {
  if (payload?.[field] === undefined || payload?.[field] === null) {
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
 * 03. STRING
 * ============================================================
 */

export function string(payload, field, options = {}) {
  const errors = [];

  const value = payload?.[field];

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
   * Optional missing value.
   */

  if (value === undefined) {
    return errors;
  }

  /*
   * Nullable.
   */

  if (value === null) {
    if (options.nullable) {
      return errors;
    }

    errors.push({
      field,

      code: "INVALID_NULL",

      message: `${field} cannot be null`,
    });

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
   * Trim check.
   */

  if (options.nonEmpty && value.trim().length === 0) {
    errors.push({
      field,

      code: "EMPTY_STRING",

      message: `${field} cannot be empty`,
    });
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
   * Pattern.
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
 * 04. EMAIL
 * ============================================================
 */

export function email(payload, field, options = {}) {
  const errors = string(payload, field, {
    ...options,

    required: options.required ?? true,
  });

  if (errors.length) {
    return errors;
  }

  const value = payload[field];

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(value)) {
    errors.push({
      field,

      code: "INVALID_EMAIL",

      message: `${field} must be a valid email address`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 05. NUMBER
 * ============================================================
 */

export function number(payload, field, options = {}) {
  const errors = [];

  const value = payload?.[field];

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
   * Optional.
   */

  if (value === undefined) {
    return errors;
  }

  /*
   * Null.
   */

  if (value === null) {
    if (options.nullable) {
      return errors;
    }

    errors.push({
      field,

      code: "INVALID_NULL",

      message: `${field} cannot be null`,
    });

    return errors;
  }

  /*
   * Number.
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
   * Integer.
   */

  if (options.integer && !Number.isInteger(value)) {
    errors.push({
      field,

      code: "NOT_INTEGER",

      message: `${field} must be an integer`,
    });
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
 * 06. BOOLEAN
 * ============================================================
 */

export function boolean(payload, field, options = {}) {
  const errors = [];

  const value = payload?.[field];

  if (options.required && (value === undefined || value === null)) {
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
 * 07. ENUM
 * ============================================================
 */

export function enumValue(payload, field, allowed, options = {}) {
  const errors = [];

  const value = payload?.[field];

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

  if (!allowed.includes(value)) {
    errors.push({
      field,

      code: "INVALID_ENUM",

      message: `${field} must be one of: ${allowed.join(", ")}`,

      allowed,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 08. ARRAY
 * ============================================================
 */

export function array(payload, field, options = {}) {
  const errors = [];

  const value = payload?.[field];

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
 * 09. OBJECT
 * ============================================================
 */

export function object(payload, field, options = {}) {
  const errors = [];

  const value = payload?.[field];

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

  if (!isPlainObject(value)) {
    errors.push({
      field,

      code: "INVALID_TYPE",

      message: `${field} must be an object`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 10. ID
 * ============================================================
 */

export function id(payload, field = "id", options = {}) {
  return string(payload, field, {
    required: options.required ?? true,

    minLength: options.minLength ?? 1,

    maxLength: options.maxLength ?? 128,
  });
}

/*
 * ============================================================
 * 11. UUID
 * ============================================================
 */

export function uuid(payload, field, options = {}) {
  const errors = string(payload, field, {
    required: options.required ?? true,
  });

  if (errors.length) {
    return errors;
  }

  const value = payload[field];

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(value)) {
    errors.push({
      field,

      code: "INVALID_UUID",

      message: `${field} must be a valid UUID`,
    });
  }

  return errors;
}

/*
 * ============================================================
 * 12. PAGINATION
 * ============================================================
 */

export function pagination(payload) {
  const errors = [];

  errors.push(
    ...number(payload, "page", {
      required: false,

      integer: true,

      min: 1,

      max: 10_000,
    }),
  );

  errors.push(
    ...number(payload, "limit", {
      required: false,

      integer: true,

      min: 1,

      max: 100,
    }),
  );

  return errors;
}

/*
 * ============================================================
 * 13. SORTING
 * ============================================================
 */

export function sorting(payload, allowedFields = []) {
  const errors = [];

  if (payload?.sortBy !== undefined) {
    errors.push(
      ...string(payload, "sortBy", {
        required: false,

        minLength: 1,

        maxLength: 100,
      }),
    );

    if (!errors.some((error) => error.field === "sortBy")) {
      if (!allowedFields.includes(payload.sortBy)) {
        errors.push({
          field: "sortBy",

          code: "INVALID_SORT_FIELD",

          message: "Invalid sorting field",
        });
      }
    }
  }

  errors.push(...enumValue(payload, "sortOrder", ["asc", "desc"]));

  return errors;
}

/*
 * ============================================================
 * 14. UNKNOWN FIELDS
 * ============================================================
 */

export function unknownFields(payload, allowedFields) {
  const errors = [];

  if (!isPlainObject(payload)) {
    return [
      {
        field: "payload",

        code: "INVALID_TYPE",

        message: "Payload must be an object",
      },
    ];
  }

  for (const field of Object.keys(payload)) {
    if (!allowedFields.includes(field)) {
      errors.push({
        field,

        code: "UNKNOWN_FIELD",

        message: `Unknown field: ${field}`,
      });
    }
  }

  return errors;
}

/*
 * ============================================================
 * 15. PAYLOAD OBJECT
 * ============================================================
 */

export function validatePayloadObject(payload) {
  if (!isPlainObject(payload)) {
    throw new ValidationError("Payload must be an object", [
      {
        field: "payload",

        code: "INVALID_TYPE",

        message: "Payload must be a plain object",
      },
    ]);
  }
}

/*
 * ============================================================
 * 16. VALIDATE MANY
 * ============================================================
 */

export function collectErrors(...validators) {
  return validators.flatMap((validator) => {
    const result = validator();

    return Array.isArray(result) ? result : [];
  });
}

/*
 * ============================================================
 * 17. CREATE VALIDATION FUNCTION
 * ============================================================
 */

export function createValidator(validator) {
  return (payload) => {
    validatePayloadObject(payload);

    const errors = validator(payload);

    if (errors.length) {
      throw new ValidationError("Request validation failed", errors);
    }

    return payload;
  };
}

/*
 * ============================================================
 * 18. SANITIZE STRING
 * ============================================================
 */

export function sanitizeString(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
}

/*
 * ============================================================
 * 19. SANITIZE OBJECT
 * ============================================================
 */

export function sanitizeObject(payload, fields = []) {
  const result = {
    ...payload,
  };

  for (const field of fields) {
    if (typeof result[field] === "string") {
      result[field] = sanitizeString(result[field]);
    }
  }

  return result;
}

/*
 * ============================================================
 * 20. MAX PAYLOAD SIZE
 * ============================================================
 */

export function assertPayloadSize(payload, maxBytes = 64 * 1024) {
  let serialized;

  try {
    serialized = JSON.stringify(payload);
  } catch (error) {
    throw new ValidationError("Payload cannot be serialized");
  }

  const bytes = Buffer.byteLength(serialized, "utf8");

  if (bytes > maxBytes) {
    throw new ValidationError("Payload is too large", [
      {
        field: "payload",

        code: "PAYLOAD_TOO_LARGE",

        message: `Payload must not exceed ${maxBytes} bytes`,
      },
    ]);
  }

  return payload;
}

/*
 * ============================================================
 * 21. USER UPDATE VALIDATOR
 * ============================================================
 */

export const validateUserUpdate = createValidator((payload) => {
  const errors = [];

  errors.push(
    ...string(payload, "name", {
      required: true,

      minLength: 2,

      maxLength: 100,
    }),
  );

  errors.push(
    ...email(payload, "email", {
      required: true,
    }),
  );

  errors.push(
    ...number(payload, "age", {
      required: true,

      integer: true,

      min: 18,

      max: 120,
    }),
  );

  errors.push(
    ...boolean(payload, "active", {
      required: false,
    }),
  );

  errors.push(
    ...enumValue(payload, "role", ["user", "admin", "moderator"], {
      required: false,
    }),
  );

  /*
   * Reject unknown fields.
   */

  errors.push(
    ...unknownFields(payload, ["name", "email", "age", "active", "role"]),
  );

  return errors;
});

/*
 * ============================================================
 * 22. CREATE USER VALIDATOR
 * ============================================================
 */

export const validateCreateUser = createValidator((payload) => {
  const errors = [];

  errors.push(
    ...string(payload, "username", {
      required: true,

      minLength: 3,

      maxLength: 30,

      pattern: /^[a-zA-Z0-9_]+$/,
    }),
  );

  errors.push(...email(payload, "email"));

  errors.push(
    ...string(payload, "password", {
      required: true,

      minLength: 8,

      maxLength: 128,
    }),
  );

  errors.push(
    ...number(payload, "age", {
      required: true,

      integer: true,

      min: 13,

      max: 120,
    }),
  );

  errors.push(
    ...unknownFields(payload, ["username", "email", "password", "age"]),
  );

  return errors;
});

/*
 * ============================================================
 * 23. MESSAGE VALIDATOR
 * ============================================================
 */

export const validateMessage = createValidator((payload) => {
  const errors = [];

  errors.push(...id(payload, "roomId"));

  errors.push(
    ...string(payload, "message", {
      required: true,

      nonEmpty: true,

      minLength: 1,

      maxLength: 5_000,
    }),
  );

  errors.push(...unknownFields(payload, ["roomId", "message", "requestId"]));

  return errors;
});

/*
 * ============================================================
 * 24. SEARCH VALIDATOR
 * ============================================================
 */

export const validateSearch = createValidator((payload) => {
  const errors = [];

  errors.push(
    ...string(payload, "query", {
      required: true,

      nonEmpty: true,

      minLength: 1,

      maxLength: 200,
    }),
  );

  errors.push(...pagination(payload));

  errors.push(...sorting(payload, ["name", "createdAt", "updatedAt"]));

  errors.push(
    ...unknownFields(payload, [
      "query",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]),
  );

  return errors;
});

/*
 * ============================================================
 * 25. SOCKET.IO EVENT WRAPPER
 * ============================================================
 */

export function validatedHandler(validator, handler) {
  return async (socket, payload, acknowledge) => {
    try {
      /*
       * Payload size check.
       */

      assertPayloadSize(payload, 64 * 1024);

      /*
       * Validate.
       */

      const validatedPayload = validator(payload);

      /*
       * Execute business logic.
       */

      await handler(socket, validatedPayload, acknowledge);
    } catch (error) {
      /*
       * Validation error.
       */

      if (error instanceof ValidationError) {
        acknowledge?.(validationErrorResponse(error));

        return;
      }

      /*
       * Unexpected error.
       */

      console.error({
        socketId: socket.id,

        error,
      });

      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",

          message: "Internal server error",
        },
      });
    }
  };
}

/*
 * ============================================================
 * 26. EXAMPLE REGISTRATION
 * ============================================================
 */

export function registerValidationEvents(io) {
  io.on("connection", (socket) => {
    /*
     * USER UPDATE
     */

    socket.on(
      "user:update",
      validatedHandler(
        validateUserUpdate,

        async (socket, payload, acknowledge) => {
          /*
           * At this point payload is validated.
           */

          console.log("Validated user update:", payload);

          acknowledge?.(
            successResponse({
              updated: true,
            }),
          );
        },
      ),
    );

    /*
     * CREATE USER
     */

    socket.on(
      "user:create",
      validatedHandler(
        validateCreateUser,

        async (socket, payload, acknowledge) => {
          console.log("Creating user:", {
            username: payload.username,

            email: payload.email,

            age: payload.age,
          });

          acknowledge?.(
            successResponse({
              created: true,
            }),
          );
        },
      ),
    );

    /*
     * CHAT MESSAGE
     */

    socket.on(
      "message:send",
      validatedHandler(
        validateMessage,

        async (socket, payload, acknowledge) => {
          console.log("Sending message:", payload);

          acknowledge?.(
            successResponse({
              sent: true,
            }),
          );
        },
      ),
    );

    /*
     * SEARCH
     */

    socket.on(
      "search",
      validatedHandler(
        validateSearch,

        async (socket, payload, acknowledge) => {
          console.log("Search:", payload);

          acknowledge?.(
            successResponse({
              results: [],
            }),
          );
        },
      ),
    );
  });
}

/*
 * ============================================================
 * END
 * ============================================================
 */
