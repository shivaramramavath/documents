/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     17_validation/zod.js
 *
 * Topic:
 *     Schema Validation with Zod
 *
 * ============================================================
 *
 * INSTALLATION
 * ============================================================
 *
 *     npm install zod
 *
 *
 * Zod is a TypeScript-first schema validation library.
 *
 * It can also be used directly in JavaScript projects.
 *
 * ============================================================
 *
 * WHY ZOD?
 * ============================================================
 *
 * Manual validation:
 *
 *     if (typeof user.name !== "string") ...
 *     if (!user.email) ...
 *     if (user.password.length < 8) ...
 *
 *
 * Zod:
 *
 *     const UserSchema = z.object({
 *       name: z.string(),
 *       email: z.email(),
 *       password: z.string().min(8),
 *     });
 *
 *
 * Schema:
 *
 *     Input
 *       ↓
 *     Zod
 *       ↓
 *     Valid → parsed data
 *     Invalid → validation errors
 *
 * ============================================================
 */

import { z } from "zod";

/*
 * ============================================================
 * 1. Basic string schema
 * ============================================================
 */

const NameSchema = z.string();

console.log(NameSchema.parse("Shiva"));

/*
 * ============================================================
 * 2. Invalid input
 * ============================================================
 *
 * parse() throws a ZodError when validation fails.
 *
 * ============================================================
 */

try {
  NameSchema.parse(123);
} catch (error) {
  console.log("Validation failed");
}

/*
 * ============================================================
 * 3. Safe parsing
 * ============================================================
 *
 * safeParse() does not throw.
 *
 * It returns:
 *
 *     {
 *       success: true,
 *       data: ...
 *     }
 *
 *
 * or:
 *
 *     {
 *       success: false,
 *       error: ...
 *     }
 *
 * ============================================================
 */

const result = NameSchema.safeParse("Shiva");

console.log(result);

/*
 * ============================================================
 * 4. Invalid safeParse
 * ============================================================
 */

const invalidResult = NameSchema.safeParse(123);

console.log(invalidResult);

/*
 * ============================================================
 * 5. Object schema
 * ============================================================
 */

const UserSchema = z.object({
  name: z.string(),

  email: z.email(),

  age: z.number().int().min(0),
});

/*
 * ============================================================
 * 6. Valid user
 * ============================================================
 */

const user = {
  name: "Shiva",
  email: "shiva@example.com",
  age: 21,
};

const parsedUser = UserSchema.parse(user);

console.log("Parsed user:", parsedUser);

/*
 * ============================================================
 * 7. Invalid user
 * ============================================================
 */

const invalidUser = {
  name: "Shiva",
  email: "invalid-email",
  age: -5,
};

const userResult = UserSchema.safeParse(invalidUser);

console.log("User validation:", userResult);

/*
 * ============================================================
 * 8. String constraints
 * ============================================================
 */

const UsernameSchema = z.string().min(3).max(20);

console.log(UsernameSchema.parse("shiva123"));

/*
 * ============================================================
 * 9. String trimming
 * ============================================================
 */

const TrimmedNameSchema = z.string().trim().min(1);

console.log(TrimmedNameSchema.parse("  Shiva  "));

/*
 * ============================================================
 * 10. Email
 * ============================================================
 */

const EmailSchema = z.email();

console.log(EmailSchema.parse("shiva@example.com"));

/*
 * ============================================================
 * 11. URL
 * ============================================================
 */

const UrlSchema = z.url();

console.log(UrlSchema.parse("https://example.com"));

/*
 * ============================================================
 * 12. Number constraints
 * ============================================================
 */

const AgeSchema = z.number().int().min(18).max(100);

console.log(AgeSchema.parse(21));

/*
 * ============================================================
 * 13. Boolean
 * ============================================================
 */

const ActiveSchema = z.boolean();

console.log(ActiveSchema.parse(true));

/*
 * ============================================================
 * 14. Arrays
 * ============================================================
 */

const TagsSchema = z.array(z.string());

console.log(TagsSchema.parse(["node", "javascript", "backend"]));

/*
 * ============================================================
 * 15. Array constraints
 * ============================================================
 */

const SkillsSchema = z.array(z.string()).min(1).max(10);

console.log(SkillsSchema.parse(["Node.js", "MongoDB"]));

/*
 * ============================================================
 * 16. Nested objects
 * ============================================================
 */

const AddressSchema = z.object({
  city: z.string().min(1),

  country: z.string().min(1),
});

const UserWithAddressSchema = z.object({
  name: z.string().min(1),

  email: z.email(),

  address: AddressSchema,
});

const userWithAddress = UserWithAddressSchema.parse({
  name: "Shiva",

  email: "shiva@example.com",

  address: {
    city: "Guntur",
    country: "India",
  },
});

console.log(userWithAddress);

/*
 * ============================================================
 * 17. Optional fields
 * ============================================================
 */

const ProfileSchema = z.object({
  name: z.string(),

  bio: z.string().optional(),
});

console.log(
  ProfileSchema.parse({
    name: "Shiva",
  }),
);

console.log(
  ProfileSchema.parse({
    name: "Shiva",
    bio: "Node.js learner",
  }),
);

/*
 * ============================================================
 * 18. Nullable fields
 * ============================================================
 *
 * optional:
 *
 *     undefined is allowed.
 *
 *
 * nullable:
 *
 *     null is allowed.
 *
 * ============================================================
 */

const MiddleNameSchema = z.string().nullable();

console.log(MiddleNameSchema.parse(null));

console.log(MiddleNameSchema.parse("Ram"));

/*
 * ============================================================
 * 19. Optional + nullable
 * ============================================================
 */

const NicknameSchema = z.string().nullable().optional();

console.log(NicknameSchema.parse(undefined));

console.log(NicknameSchema.parse(null));

/*
 * ============================================================
 * 20. Default values
 * ============================================================
 */

const SettingsSchema = z.object({
  theme: z.string().default("light"),

  notifications: z.boolean().default(true),
});

console.log(SettingsSchema.parse({}));

/*
 * ============================================================
 * 21. Enum
 * ============================================================
 */

const RoleSchema = z.enum(["user", "admin", "moderator"]);

console.log(RoleSchema.parse("admin"));

/*
 * ============================================================
 * 22. Enum validation failure
 * ============================================================
 */

const roleResult = RoleSchema.safeParse("superadmin");

console.log(roleResult);

/*
 * ============================================================
 * 23. Literal values
 * ============================================================
 */

const StatusSchema = z.literal("active");

console.log(StatusSchema.parse("active"));

/*
 * ============================================================
 * 24. Union
 * ============================================================
 *
 * A union accepts one of multiple schemas.
 *
 * ============================================================
 */

const IdSchema = z.union([z.string(), z.number()]);

console.log(IdSchema.parse("abc123"));

console.log(IdSchema.parse(123));

/*
 * ============================================================
 * 25. Discriminated union
 * ============================================================
 *
 * Useful when different object types have a known discriminator.
 *
 * Example:
 *
 *     type = "student"
 *     type = "teacher"
 *
 * ============================================================
 */

const StudentSchema = z.object({
  type: z.literal("student"),

  name: z.string(),

  rollNumber: z.string(),
});

const TeacherSchema = z.object({
  type: z.literal("teacher"),

  name: z.string(),

  employeeId: z.string(),
});

const PersonSchema = z.discriminatedUnion("type", [
  StudentSchema,
  TeacherSchema,
]);

console.log(
  PersonSchema.parse({
    type: "student",
    name: "Shiva",
    rollNumber: "23A01",
  }),
);

/*
 * ============================================================
 * 26. Object strictness
 * ============================================================
 *
 * APIs often need to decide what happens when clients send
 * unknown fields.
 *
 * ============================================================
 */

const StrictUserSchema = z
  .object({
    name: z.string(),
    email: z.email(),
  })
  .strict();

const strictResult = StrictUserSchema.safeParse({
  name: "Shiva",
  email: "shiva@example.com",
  role: "admin",
});

console.log(strictResult);

/*
 * ============================================================
 * 27. Pick fields
 * ============================================================
 */

const PublicUserSchema = UserSchema.pick({
  name: true,
  email: true,
});

console.log(
  PublicUserSchema.parse({
    name: "Shiva",
    email: "shiva@example.com",
  }),
);

/*
 * ============================================================
 * 28. Omit fields
 * ============================================================
 */

const UserWithoutAgeSchema = UserSchema.omit({
  age: true,
});

console.log(
  UserWithoutAgeSchema.parse({
    name: "Shiva",
    email: "shiva@example.com",
  }),
);

/*
 * ============================================================
 * 29. Partial
 * ============================================================
 *
 * Useful for PATCH requests.
 *
 * POST:
 *
 *     all required fields
 *
 *
 * PATCH:
 *
 *     only fields being changed
 *
 * ============================================================
 */

const UpdateUserSchema = UserSchema.partial();

console.log(
  UpdateUserSchema.parse({
    name: "New Name",
  }),
);

/*
 * ============================================================
 * 30. Password schema
 * ============================================================
 */

const PasswordSchema = z.string().min(8).max(128);

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(100),

  email: z.email(),

  password: PasswordSchema,
});

/*
 * ============================================================
 * 31. Register request
 * ============================================================
 */

const registerData = {
  name: "Shiva",
  email: "shiva@example.com",
  password: "strongpassword",
};

const registerResult = RegisterSchema.safeParse(registerData);

if (registerResult.success) {
  console.log("Registration data:", registerResult.data);
} else {
  console.log("Registration errors:", registerResult.error);
}

/*
 * ============================================================
 * 32. Transform
 * ============================================================
 *
 * Zod can transform validated data.
 *
 * ============================================================
 */

const TrimNameSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase());

console.log(TrimNameSchema.parse("  SHIVA  "));

/*
 * ============================================================
 * 33. Coercion
 * ============================================================
 *
 * HTTP input frequently arrives as strings.
 *
 * Example:
 *
 *     ?page=10
 *
 * page may arrive as:
 *
 *     "10"
 *
 *
 * Zod can coerce it into a number.
 *
 * ============================================================
 */

const PageSchema = z.coerce.number().int().positive();

console.log(PageSchema.parse("10"));

/*
 * ============================================================
 * 34. Query parameters
 * ============================================================
 */

const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),
});

console.log(
  PaginationSchema.parse({
    page: "2",
    limit: "50",
  }),
);

/*
 * ============================================================
 * 35. Custom validation with refine
 * ============================================================
 */

const EvenNumberSchema = z.number().refine((value) => value % 2 === 0, {
  message: "Number must be even",
});

console.log(EvenNumberSchema.safeParse(10));

console.log(EvenNumberSchema.safeParse(11));

/*
 * ============================================================
 * 36. Password confirmation
 * ============================================================
 */

const PasswordConfirmationSchema = z
  .object({
    password: z.string().min(8),

    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

console.log(
  PasswordConfirmationSchema.safeParse({
    password: "password123",
    confirmPassword: "password123",
  }),
);

/*
 * ============================================================
 * 37. Error handling
 * ============================================================
 */

const invalidRegister = RegisterSchema.safeParse({
  name: "",
  email: "wrong",
  password: "123",
});

if (!invalidRegister.success) {
  console.log(invalidRegister.error.issues);
}

/*
 * ============================================================
 * 38. Format validation errors
 * ============================================================
 *
 * Zod provides structured error information.
 *
 * ============================================================
 */

if (!invalidRegister.success) {
  for (const issue of invalidRegister.error.issues) {
    console.log({
      path: issue.path,
      message: issue.message,
    });
  }
}

/*
 * ============================================================
 * 39. HTTP request body validation
 * ============================================================
 *
 * Express example:
 *
 *
 *     const result =
 *       RegisterSchema.safeParse(req.body);
 *
 *
 *     if (!result.success) {
 *       return res.status(400).json({
 *         error: "Invalid request",
 *         details: result.error.issues,
 *       });
 *     }
 *
 *
 *     const data = result.data;
 *
 *
 * Now `data` has passed schema validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Reusable validation function
 * ============================================================
 */

function validateRegisterInput(input) {
  const result = RegisterSchema.safeParse(input);

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

console.log(validateRegisterInput(registerData));

/*
 * ============================================================
 * 41. Validation middleware concept
 * ============================================================
 *
 *
 *             HTTP REQUEST
 *                   ↓
 *             req.body
 *                   ↓
 *            Zod schema
 *                   ↓
 *             ┌─────┴─────┐
 *             ↓           ↓
 *          VALID        INVALID
 *             ↓           ↓
 *       next()          400
 *             ↓
 *        controller
 *
 *
 * This pattern becomes especially useful in Express APIs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Do not confuse validation with authentication
 * ============================================================
 *
 * Zod can verify:
 *
 *     email is valid
 *     password is a string
 *     role is an allowed value
 *
 *
 * Zod cannot determine:
 *
 *     whether the password belongs to the user
 *     whether a JWT is valid
 *     whether a user has permission
 *
 *
 * Those are authentication/authorization concerns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Do not trust validated input blindly
 * ============================================================
 *
 * Schema validation tells us that data satisfies the schema.
 *
 * It does NOT automatically mean:
 *
 *     - business operation is allowed
 *     - user is authorized
 *     - database operation cannot fail
 *     - external API is safe
 *
 *
 * Example:
 *
 *
 *     role = "admin"
 *
 *
 * may be structurally valid.
 *
 * But that does not mean the current user is allowed to assign
 * the admin role.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Validation architecture
 * ============================================================
 *
 *
 *        External Input
 *              ↓
 *        Zod Schema
 *              ↓
 *       Validated Data
 *              ↓
 *       Business Rules
 *              ↓
 *        Authorization
 *              ↓
 *          Database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. parse vs safeParse
 * ============================================================
 *
 *
 * parse()
 *
 *     Valid   → returns data
 *     Invalid → throws error
 *
 *
 * safeParse()
 *
 *     Valid   → { success: true, data }
 *     Invalid → { success: false, error }
 *
 *
 * For HTTP request handling, safeParse() is often convenient
 * because invalid user input is an expected outcome rather than
 * an exceptional programming failure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Manual validation vs Zod
 * ============================================================
 *
 *
 * MANUAL:
 *
 *     if (...)
 *     if (...)
 *     if (...)
 *
 *
 * ZOD:
 *
 *     schema
 *        ↓
 *     parse
 *        ↓
 *     validated data
 *
 *
 * Zod makes validation rules:
 *
 *     centralized
 *     reusable
 *     composable
 *     structured
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Important production principle
 * ============================================================
 *
 * Define schemas close to the boundary where data enters the
 * application.
 *
 *
 * Examples:
 *
 *     CreateUserSchema
 *     UpdateUserSchema
 *     LoginSchema
 *     PaginationSchema
 *     QuerySchema
 *
 *
 * Avoid one enormous schema for the entire application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Typical project structure
 * ============================================================
 *
 *
 *     src/
 *
 *     ├── schemas/
 *     │   ├── user.schema.js
 *     │   ├── auth.schema.js
 *     │   └── pagination.schema.js
 *     │
 *     ├── controllers/
 *     ├── services/
 *     ├── models/
 *     └── routes/
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. Validation checklist
 * ============================================================
 *
 *     ✓ Define schemas
 *
 *     ✓ Validate external input
 *
 *     ✓ Use safeParse when appropriate
 *
 *     ✓ Return useful validation errors
 *
 *     ✓ Validate nested structures
 *
 *     ✓ Validate arrays
 *
 *     ✓ Validate enums
 *
 *     ✓ Validate query parameters
 *
 *     ✓ Use coercion when input arrives as strings
 *
 *     ✓ Use transformations carefully
 *
 *     ✓ Separate validation from authorization
 *
 *     ✓ Separate validation from business rules
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                UNTRUSTED DATA
 *                      │
 *                      ↓
 *                ┌──────────┐
 *                │   ZOD    │
 *                │  SCHEMA  │
 *                └────┬─────┘
 *                     │
 *              ┌──────┴──────┐
 *              ↓             ↓
 *           VALID          INVALID
 *              │             │
 *              ↓             ↓
 *       parsed/typed       reject
 *           data
 *              │
 *              ↓
 *       business logic
 *              │
 *              ↓
 *          database
 *
 *
 * Main principle:
 *
 *     Validate data at the application boundary before allowing
 *     it to enter business logic.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     17_validation/schema_validation.js
 *
 * ============================================================
 */
