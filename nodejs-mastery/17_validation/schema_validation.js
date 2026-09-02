/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     17_validation/schema_validation.js
 *
 * Topic:
 *     Schema Validation Architecture
 *
 * ============================================================
 *
 * WHAT IS SCHEMA VALIDATION?
 * ============================================================
 *
 * A schema defines the expected structure and rules of data.
 *
 * Example:
 *
 *     User
 *       ├── name     → string
 *       ├── email    → valid email
 *       ├── age      → integer
 *       └── role     → user | admin
 *
 *
 * Instead of validating every field independently throughout
 * the application, we define a reusable schema.
 *
 * ============================================================
 *
 * DATA FLOW
 * ============================================================
 *
 *     External Input
 *           ↓
 *        Schema
 *           ↓
 *       Validation
 *           ↓
 *     Parsed Data
 *           ↓
 *    Business Logic
 *           ↓
 *       Database
 *
 * ============================================================
 */

import { z } from "zod";

/*
 * ============================================================
 * 1. Basic schema
 * ============================================================
 */

const UserSchema = z.object({
  name: z.string().trim().min(1).max(100),

  email: z.email(),

  age: z.number().int().min(0),

  role: z.enum(["user", "admin"]),
});

/*
 * ============================================================
 * 2. Valid data
 * ============================================================
 */

const userInput = {
  name: "Shiva",
  email: "shiva@example.com",
  age: 21,
  role: "user",
};

const result = UserSchema.safeParse(userInput);

if (result.success) {
  console.log("Validated user:", result.data);
} else {
  console.log("Validation failed:", result.error.issues);
}

/*
 * ============================================================
 * 3. Schema composition
 * ============================================================
 *
 * Large schemas should be composed from smaller schemas.
 *
 * ============================================================
 */

const NameSchema = z.string().trim().min(1).max(100);

const EmailSchema = z.email();

const PasswordSchema = z.string().min(8).max(128);

const RoleSchema = z.enum(["user", "admin"]);

/*
 * ============================================================
 * 4. Create user schema
 * ============================================================
 */

const CreateUserSchema = z.object({
  name: NameSchema,

  email: EmailSchema,

  password: PasswordSchema,

  role: RoleSchema,
});

/*
 * ============================================================
 * 5. Update user schema
 * ============================================================
 *
 * PATCH requests normally allow partial updates.
 *
 * ============================================================
 */

const UpdateUserSchema = CreateUserSchema.partial();

console.log(
  UpdateUserSchema.parse({
    name: "New Name",
  }),
);

/*
 * ============================================================
 * 6. Login schema
 * ============================================================
 *
 * Login should not reuse CreateUserSchema because the two
 * operations have different requirements.
 *
 * ============================================================
 */

const LoginSchema = z.object({
  email: EmailSchema,

  password: PasswordSchema,
});

/*
 * ============================================================
 * 7. Registration schema
 * ============================================================
 *
 * Registration can have additional fields.
 *
 * ============================================================
 */

const RegisterSchema = z
  .object({
    name: NameSchema,

    email: EmailSchema,

    password: PasswordSchema,

    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

/*
 * ============================================================
 * 8. Request schemas
 * ============================================================
 *
 * An HTTP request can have multiple independent input sources:
 *
 *
 *     req.params
 *     req.query
 *     req.body
 *     req.headers
 *
 *
 * Each can have its own schema.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. URL parameter schema
 * ============================================================
 */

const UserParamsSchema = z.object({
  id: z.string().min(1),
});

console.log(
  UserParamsSchema.parse({
    id: "user_123",
  }),
);

/*
 * ============================================================
 * 10. Query parameter schema
 * ============================================================
 *
 * HTTP query values are usually strings.
 *
 * Example:
 *
 *     ?page=2&limit=20
 *
 * ============================================================
 */

const UserQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),

  search: z.string().trim().optional(),
});

console.log(
  UserQuerySchema.parse({
    page: "2",
    limit: "20",
    search: "Shiva",
  }),
);

/*
 * ============================================================
 * 11. Header schema
 * ============================================================
 */

const HeaderSchema = z.object({
  authorization: z.string().optional(),

  "user-agent": z.string().optional(),
});

/*
 * ============================================================
 * 12. Body schema
 * ============================================================
 */

const CreateUserBodySchema = z.object({
  name: NameSchema,

  email: EmailSchema,

  password: PasswordSchema,
});

/*
 * ============================================================
 * 13. Complete request validation
 * ============================================================
 *
 * We can validate the pieces independently.
 *
 * ============================================================
 */

function validateCreateUserRequest({ params, query, headers, body }) {
  const paramsResult = UserParamsSchema.safeParse(params);

  const queryResult = UserQuerySchema.safeParse(query);

  const headersResult = HeaderSchema.safeParse(headers);

  const bodyResult = CreateUserBodySchema.safeParse(body);

  return {
    params: paramsResult,
    query: queryResult,
    headers: headersResult,
    body: bodyResult,
  };
}

/*
 * ============================================================
 * 14. Separate schemas by operation
 * ============================================================
 *
 * Do NOT create:
 *
 *
 *     UniversalUserSchema
 *
 *
 * and use it everywhere.
 *
 *
 * Different operations have different contracts:
 *
 *
 *     CreateUser
 *     UpdateUser
 *     Login
 *     Register
 *     ChangePassword
 *     ResetPassword
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Password change schema
 * ============================================================
 */

const ChangePasswordSchema = z
  .object({
    currentPassword: PasswordSchema,

    newPassword: PasswordSchema,

    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

/*
 * ============================================================
 * 16. Pagination schema
 * ============================================================
 */

const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),
});

/*
 * ============================================================
 * 17. Sorting schema
 * ============================================================
 */

const SortOrderSchema = z.enum(["asc", "desc"]);

const SortSchema = z.object({
  field: z.string().min(1),

  order: SortOrderSchema.default("asc"),
});

/*
 * ============================================================
 * 18. Filtering schema
 * ============================================================
 */

const UserFilterSchema = z.object({
  role: RoleSchema.optional(),

  active: z.coerce.boolean().optional(),
});

/*
 * ============================================================
 * 19. Combining API schemas
 * ============================================================
 */

const UserListQuerySchema = PaginationSchema.merge(SortSchema)
  .merge(UserFilterSchema)
  .extend({
    search: z.string().trim().optional(),
  });

console.log(
  UserListQuerySchema.parse({
    page: "1",
    limit: "20",
    field: "name",
    order: "asc",
    role: "user",
    search: "Shiva",
  }),
);

/*
 * ============================================================
 * 20. Schema for database IDs
 * ============================================================
 *
 * If the application uses MongoDB ObjectId strings, validate
 * their format at the API boundary.
 *
 * ============================================================
 */

const MongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

console.log(MongoIdSchema.safeParse("507f1f77bcf86cd799439011"));

/*
 * ============================================================
 * 21. UUID schema
 * ============================================================
 */

const UUIDSchema = z.uuid();

console.log(UUIDSchema.safeParse("550e8400-e29b-41d4-a716-446655440000"));

/*
 * ============================================================
 * 22. Date validation
 * ============================================================
 */

const DateSchema = z.coerce.date();

console.log(DateSchema.parse("2026-09-03"));

/*
 * ============================================================
 * 23. Date range validation
 * ============================================================
 */

const DateRangeSchema = z
  .object({
    start: z.coerce.date(),

    end: z.coerce.date(),
  })
  .refine((data) => data.start <= data.end, {
    message: "Start date must be before end date",

    path: ["end"],
  });

/*
 * ============================================================
 * 24. Conditional validation
 * ============================================================
 *
 * Sometimes validation depends on another field.
 *
 * Example:
 *
 *     accountType = "company"
 *
 * then:
 *
 *     companyName is required.
 *
 * ============================================================
 */

const AccountSchema = z
  .object({
    accountType: z.enum(["individual", "company"]),

    name: z.string().min(1),

    companyName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.accountType === "company") {
        return Boolean(data.companyName);
      }

      return true;
    },
    {
      message: "Company name is required for company accounts",

      path: ["companyName"],
    },
  );

/*
 * ============================================================
 * 25. Unknown fields
 * ============================================================
 *
 * APIs must decide how to handle unknown fields.
 *
 * Possible strategies:
 *
 *     strip
 *     strict
 *     preserve
 *
 *
 * For security-sensitive input, explicitly defining the expected
 * contract is important.
 *
 * ============================================================
 */

const StrictCreateUserSchema = CreateUserBodySchema.strict();

const unknownFieldResult = StrictCreateUserSchema.safeParse({
  name: "Shiva",
  email: "shiva@example.com",
  password: "password123",
  isAdmin: true,
});

console.log(unknownFieldResult);

/*
 * ============================================================
 * 26. Transforming validated data
 * ============================================================
 */

const NormalizedEmailSchema = z
  .email()
  .transform((email) => email.trim().toLowerCase());

console.log(NormalizedEmailSchema.parse(" SHIVA@EXAMPLE.COM "));

/*
 * ============================================================
 * 27. Schema + normalization
 * ============================================================
 */

const NormalizedUserSchema = z.object({
  name: z.string().trim().min(1),

  email: NormalizedEmailSchema,
});

const normalizedUser = NormalizedUserSchema.parse({
  name: "  Shiva  ",
  email: " SHIVA@EXAMPLE.COM ",
});

console.log(normalizedUser);

/*
 * ============================================================
 * 28. Validation service
 * ============================================================
 *
 * Centralize common validation behavior.
 * ============================================================
 */

export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,

      errors: result.error.issues,
    };
  }

  return {
    success: true,

    data: result.data,
  };
}

/*
 * ============================================================
 * 29. Using validation service
 * ============================================================
 */

const validation = validate(CreateUserBodySchema, {
  name: "Shiva",
  email: "shiva@example.com",
  password: "password123",
});

console.log(validation);

/*
 * ============================================================
 * 30. Express middleware concept
 * ============================================================
 *
 * A reusable middleware can validate any request source.
 *
 * Concept:
 *
 *
 *     validateBody(CreateUserBodySchema)
 *
 *
 * Request:
 *
 *     req.body
 *       ↓
 *     schema
 *       ↓
 *     validated data
 *       ↓
 *     next()
 *
 * ============================================================
 */

export function validateBody(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",

        details: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
}

/*
 * ============================================================
 * 31. Query middleware
 * ============================================================
 */

export function validateQuery(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid query parameters",

        details: result.error.issues,
      });
    }

    req.query = result.data;

    next();
  };
}

/*
 * ============================================================
 * 32. Parameter middleware
 * ============================================================
 */

export function validateParams(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid URL parameters",

        details: result.error.issues,
      });
    }

    req.params = result.data;

    next();
  };
}

/*
 * ============================================================
 * 33. Controller responsibility
 * ============================================================
 *
 * After validation:
 *
 *
 *     controller
 *         ↓
 *     validated input
 *         ↓
 *     service
 *
 *
 * The controller should not need to repeat basic structural
 * validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Service responsibility
 * ============================================================
 *
 * Services handle business rules.
 *
 * Example:
 *
 *
 *     Validation:
 *
 *         email must be valid
 *
 *
 *     Business rule:
 *
 *         email must not already belong to another user
 *
 *
 * These are different concerns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Database validation
 * ============================================================
 *
 * Even after API validation, the database layer can still reject
 * invalid data.
 *
 *
 * Defense in depth:
 *
 *
 *     API validation
 *          ↓
 *     Business rules
 *          ↓
 *     Database constraints
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Validation error shape
 * ============================================================
 *
 * A consistent API error response is useful.
 *
 * Example:
 *
 *
 * {
 *   "error": "VALIDATION_ERROR",
 *   "message": "Request validation failed",
 *   "details": [
 *     {
 *       "field": "email",
 *       "message": "Invalid email"
 *     }
 *   ]
 * }
 *
 *
 * The exact response contract should be standardized across
 * the API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Avoid leaking internal information
 * ============================================================
 *
 * Validation errors should help the client fix its request.
 *
 * Do not expose:
 *
 *     database credentials
 *     internal file paths
 *     stack traces
 *     secrets
 *     internal implementation details
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Schema organization
 * ============================================================
 *
 * A scalable project might use:
 *
 *
 *     src/
 *     │
 *     ├── schemas/
 *     │   ├── auth/
 *     │   │   ├── login.schema.js
 *     │   │   ├── register.schema.js
 *     │   │   └── password.schema.js
 *     │   │
 *     │   ├── users/
 *     │   │   ├── create-user.schema.js
 *     │   │   ├── update-user.schema.js
 *     │   │   └── user-query.schema.js
 *     │   │
 *     │   └── common/
 *     │       ├── pagination.schema.js
 *     │       └── id.schema.js
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Common reusable schemas
 * ============================================================
 */

const NonEmptyStringSchema = z.string().trim().min(1);

const PositiveIntegerSchema = z.number().int().positive();

const PaginationLimitSchema = z.coerce.number().int().positive().max(100);

/*
 * ============================================================
 * 40. API contract
 * ============================================================
 *
 * A schema effectively describes an API contract:
 *
 *
 *     Client
 *        │
 *        │ request
 *        ↓
 *     API schema
 *        │
 *        │ valid
 *        ↓
 *     Controller
 *
 *
 * This makes the boundary explicit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Schema validation is not only for HTTP
 * ============================================================
 *
 * The same concept can validate:
 *
 *     - HTTP requests
 *     - Environment variables
 *     - Configuration
 *     - Queue messages
 *     - Kafka events
 *     - WebSocket messages
 *     - External API responses
 *     - CLI arguments
 *     - File data
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Event/message validation
 * ============================================================
 *
 * Example Kafka/event payload:
 *
 *
 * {
 *   type: "USER_CREATED",
 *   userId: "123"
 * }
 *
 * Schema:
 */

const UserCreatedEventSchema = z.object({
  type: z.literal("USER_CREATED"),

  userId: z.string().min(1),
});

console.log(
  UserCreatedEventSchema.safeParse({
    type: "USER_CREATED",
    userId: "user_123",
  }),
);

/*
 * ============================================================
 * 43. Why validate events?
 * ============================================================
 *
 * Distributed systems have multiple producers and consumers.
 *
 * Without validation:
 *
 *
 * Producer
 *     ↓
 * malformed message
 *     ↓
 * Consumer
 *     ↓
 * unexpected failure
 *
 *
 * With validation:
 *
 *
 * Producer
 *     ↓
 * message
 *     ↓
 * consumer schema
 *     ↓
 * valid / rejected
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Schema versioning
 * ============================================================
 *
 * APIs and events evolve.
 *
 * Example:
 *
 *
 *     UserCreatedEventV1
 *
 *     UserCreatedEventV2
 *
 *
 * Consumers may need to support multiple versions during
 * migrations.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. Validation boundaries
 * ============================================================
 *
 * Validate when data crosses a trust boundary.
 *
 *
 *     Browser
 *        ↓
 *      API
 *        ↓
 *    Controller
 *        ↓
 *     Service
 *        ↓
 *    Database
 *
 *
 * Also:
 *
 *
 *     Kafka
 *        ↓
 *     Consumer
 *
 *
 *     External API
 *        ↓
 *     Integration layer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Validation vs business rules
 * ============================================================
 *
 * Example:
 *
 *     age must be an integer
 *
 *         → validation
 *
 *
 *     user must be at least 18 to purchase this product
 *
 *         → business rule
 *
 *
 * Keeping these separate makes the architecture easier to
 * maintain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Validation vs authorization
 * ============================================================
 *
 * Example:
 *
 *     role must be "admin" or "user"
 *
 *         → validation
 *
 *
 *     only an admin can create another admin
 *
 *         → authorization
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Validation architecture
 * ============================================================
 *
 *
 *             UNTRUSTED DATA
 *                    │
 *                    ↓
 *             ┌─────────────┐
 *             │   SCHEMA    │
 *             │ VALIDATION  │
 *             └──────┬──────┘
 *                    │
 *              ┌─────┴─────┐
 *              ↓           ↓
 *           VALID        INVALID
 *              │           │
 *              ↓           ↓
 *        parsed data      400
 *              │
 *              ↓
 *       business logic
 *              │
 *              ↓
 *        authorization
 *              │
 *              ↓
 *          database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. Best practices
 * ============================================================
 *
 *     ✓ Validate at boundaries
 *
 *     ✓ Create small reusable schemas
 *
 *     ✓ Compose schemas
 *
 *     ✓ Use operation-specific schemas
 *
 *     ✓ Validate params/query/body separately
 *
 *     ✓ Normalize data carefully
 *
 *     ✓ Keep validation separate from business logic
 *
 *     ✓ Keep validation separate from authorization
 *
 *     ✓ Use consistent validation errors
 *
 *     ✓ Validate messages from external systems
 *
 *     ✓ Validate environment configuration
 *
 *     ✓ Do not expose internal errors
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *              TRUST BOUNDARY
 *                    │
 *                    ↓
 *              ┌───────────┐
 *              │  SCHEMA   │
 *              │ VALIDATOR │
 *              └─────┬─────┘
 *                    │
 *              validated data
 *                    │
 *                    ↓
 *              BUSINESS LOGIC
 *                    │
 *                    ↓
 *               AUTHORIZATION
 *                    │
 *                    ↓
 *                DATABASE
 *
 *
 * Schema validation is the application's first structured
 * defense against malformed or unexpected data.
 *
 * ============================================================
 *
 * 17_validation COMPLETE
 *
 * NEXT:
 *
 *     18_express/app.js
 *
 * ============================================================
 */
