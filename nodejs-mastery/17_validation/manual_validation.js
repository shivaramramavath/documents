/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     17_validation/manual_validation.js
 *
 * Topic:
 *     Manual Input Validation
 *
 * ============================================================
 *
 * WHAT IS VALIDATION?
 * ============================================================
 *
 * Validation checks whether incoming data satisfies the rules
 * expected by our application.
 *
 * Example:
 *
 *     username → must be a string
 *     age      → must be an integer
 *     email    → must have a valid format
 *     password → must have minimum length
 *
 *
 * Flow:
 *
 *     Input
 *       ↓
 *     Validation
 *       ↓
 *     Valid?
 *      / \
 *    yes  no
 *    ↓     ↓
 *  Continue  Reject
 *
 * ============================================================
 *
 * WHY VALIDATE?
 * ============================================================
 *
 * Never blindly trust data coming from:
 *
 *     - HTTP requests
 *     - Users
 *     - Forms
 *     - APIs
 *     - Query parameters
 *     - URL parameters
 *     - Environment variables
 *     - Files
 *     - External services
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Simple validation
 * ============================================================
 */

function isString(value) {
  return typeof value === "string";
}

console.log(isString("Shiva")); // true

console.log(isString(100)); // false

/*
 * ============================================================
 * 2. Number validation
 * ============================================================
 */

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

console.log(isNumber(100)); // true

console.log(isNumber(NaN)); // false

console.log(isNumber("100")); // false

/*
 * ============================================================
 * 3. Integer validation
 * ============================================================
 */

function isInteger(value) {
  return Number.isInteger(value);
}

console.log(isInteger(10)); // true

console.log(isInteger(10.5)); // false

/*
 * ============================================================
 * 4. Required value
 * ============================================================
 *
 * A required value must be present.
 *
 * ============================================================
 */

function isRequired(value) {
  return value !== undefined && value !== null && value !== "";
}

console.log(isRequired("hello")); // true

console.log(isRequired("")); // false

console.log(isRequired(undefined)); // false

console.log(isRequired(null)); // false

/*
 * ============================================================
 * 5. String length
 * ============================================================
 */

function hasMinLength(value, min) {
  return typeof value === "string" && value.length >= min;
}

console.log(hasMinLength("password", 8)); // true

console.log(hasMinLength("abc", 8)); // false

/*
 * ============================================================
 * 6. Maximum length
 * ============================================================
 */

function hasMaxLength(value, max) {
  return typeof value === "string" && value.length <= max;
}

console.log(hasMaxLength("hello", 10)); // true

/*
 * ============================================================
 * 7. Email validation
 * ============================================================
 *
 * This is a basic application-level check.
 *
 * Email validation is more complicated than a simple regex.
 *
 * ============================================================
 */

function isEmail(value) {
  if (typeof value !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
}

console.log(isEmail("user@example.com")); // true

console.log(isEmail("invalid-email")); // false

/*
 * ============================================================
 * 8. Password validation
 * ============================================================
 */

function isValidPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

console.log(isValidPassword("password123")); // true

console.log(isValidPassword("123")); // false

/*
 * ============================================================
 * 9. Enum validation
 * ============================================================
 *
 * Sometimes a value must be one of a predefined set.
 *
 * Example:
 *
 *     role:
 *       user
 *       admin
 *
 * ============================================================
 */

const allowedRoles = ["user", "admin"];

function isValidRole(role) {
  return allowedRoles.includes(role);
}

console.log(isValidRole("admin")); // true

console.log(isValidRole("manager")); // false

/*
 * ============================================================
 * 10. Boolean validation
 * ============================================================
 */

function isBoolean(value) {
  return typeof value === "boolean";
}

console.log(isBoolean(true)); // true

console.log(isBoolean("true")); // false

/*
 * ============================================================
 * 11. Array validation
 * ============================================================
 */

function isArray(value) {
  return Array.isArray(value);
}

console.log(isArray([])); // true

console.log(isArray("[]")); // false

/*
 * ============================================================
 * 12. Object validation
 * ============================================================
 *
 * Note:
 *
 * Arrays are objects in JavaScript.
 *
 * Therefore:
 *
 *     typeof [] === "object"
 *
 * We usually want to exclude arrays.
 *
 * ============================================================
 */

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

console.log(isPlainObject({})); // true

console.log(isPlainObject([])); // false

console.log(isPlainObject(null)); // false

/*
 * ============================================================
 * 13. Combining validations
 * ============================================================
 */

function validateUser(user) {
  return (
    isPlainObject(user) &&
    isRequired(user.name) &&
    isEmail(user.email) &&
    isValidPassword(user.password)
  );
}

const user = {
  name: "Shiva",
  email: "shiva@example.com",
  password: "password123",
};

console.log("User valid:", validateUser(user));

/*
 * ============================================================
 * 14. Validation with errors
 * ============================================================
 *
 * Returning only true/false does not tell us what failed.
 *
 * Better:
 *
 *     return validation errors.
 *
 * ============================================================
 */

function validateUserWithErrors(user) {
  const errors = {};

  if (!isPlainObject(user)) {
    return {
      valid: false,
      errors: {
        body: "Expected an object",
      },
    };
  }

  if (!isRequired(user.name)) {
    errors.name = "Name is required";
  }

  if (!isEmail(user.email)) {
    errors.email = "Invalid email";
  }

  if (!isValidPassword(user.password)) {
    errors.password = "Password must contain at least 8 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,

    errors,
  };
}

console.log(validateUserWithErrors(user));

/*
 * ============================================================
 * 15. Invalid user example
 * ============================================================
 */

const invalidUser = {
  name: "",
  email: "wrong-email",
  password: "123",
};

console.log(validateUserWithErrors(invalidUser));

/*
 * ============================================================
 * 16. Nested validation
 * ============================================================
 */

function validateAddress(address) {
  const errors = {};

  if (!isPlainObject(address)) {
    return {
      valid: false,
      errors: {
        address: "Address must be an object",
      },
    };
  }

  if (!isRequired(address.city)) {
    errors.city = "City is required";
  }

  if (!isRequired(address.country)) {
    errors.country = "Country is required";
  }

  return {
    valid: Object.keys(errors).length === 0,

    errors,
  };
}

const address = {
  city: "Guntur",
  country: "India",
};

console.log(validateAddress(address));

/*
 * ============================================================
 * 17. Validate complete user
 * ============================================================
 */

function validateCompleteUser(user) {
  const errors = {};

  if (!isPlainObject(user)) {
    return {
      valid: false,
      errors: {
        body: "Expected an object",
      },
    };
  }

  if (!isRequired(user.name)) {
    errors.name = "Name is required";
  }

  if (!isEmail(user.email)) {
    errors.email = "Invalid email";
  }

  if (!isValidPassword(user.password)) {
    errors.password = "Password must contain at least 8 characters";
  }

  if (user.address !== undefined) {
    const addressResult = validateAddress(user.address);

    if (!addressResult.valid) {
      errors.address = addressResult.errors;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,

    errors,
  };
}

/*
 * ============================================================
 * 18. Validation of arrays
 * ============================================================
 */

function validateTags(tags) {
  if (!Array.isArray(tags)) {
    return {
      valid: false,
      error: "Tags must be an array",
    };
  }

  for (const tag of tags) {
    if (typeof tag !== "string") {
      return {
        valid: false,
        error: "Every tag must be a string",
      };
    }
  }

  return {
    valid: true,
  };
}

console.log(validateTags(["node", "javascript"]));

/*
 * ============================================================
 * 19. Numeric range validation
 * ============================================================
 */

function isInRange(value, min, max) {
  return isNumber(value) && value >= min && value <= max;
}

console.log(isInRange(20, 18, 60)); // true

console.log(isInRange(70, 18, 60)); // false

/*
 * ============================================================
 * 20. String pattern validation
 * ============================================================
 *
 * Example:
 *
 *     username can contain letters, numbers and underscore.
 *
 * ============================================================
 */

function isValidUsername(username) {
  if (typeof username !== "string") {
    return false;
  }

  return /^[a-zA-Z0-9_]+$/.test(username);
}

console.log(isValidUsername("shiva_123")); // true

console.log(isValidUsername("shiva@123")); // false

/*
 * ============================================================
 * 21. Sanitization vs validation
 * ============================================================
 *
 * Validation:
 *
 *     "Is this value allowed?"
 *
 *
 * Sanitization:
 *
 *     "Can this value be transformed into a safe/normalized
 *      representation?"
 *
 *
 * They are related but different concepts.
 *
 * Example:
 *
 *     "  Shiva  "
 *
 * can be normalized:
 *
 *     "Shiva"
 *
 * ============================================================
 */

function normalizeName(name) {
  if (typeof name !== "string") {
    return null;
  }

  return name.trim();
}

console.log(normalizeName("  Shiva  "));

/*
 * ============================================================
 * 22. Never trust client-provided types
 * ============================================================
 *
 * HTTP query parameters are commonly strings.
 *
 *
 * Example:
 *
 *
 *     ?age=20
 *
 *
 * may arrive as:
 *
 *
 *     "20"
 *
 *
 * not:
 *
 *
 *     20
 *
 *
 * Therefore:
 */

function parseAge(value) {
  const age = Number(value);

  if (!Number.isInteger(age) || age < 0) {
    return null;
  }

  return age;
}

console.log(parseAge("20")); // 20

console.log(parseAge("abc")); // null

/*
 * ============================================================
 * 23. Validation before business logic
 * ============================================================
 *
 *
 * Request
 *   ↓
 * Parse
 *   ↓
 * Validate
 *   ↓
 * Business logic
 *   ↓
 * Database
 *
 *
 * Never:
 *
 *
 * Request
 *   ↓
 * Database
 *
 *
 * without validating expected input.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Manual request validation example
 * ============================================================
 *
 * Imagine:
 *
 *
 * POST /users
 *
 *
 * Request body:
 *
 *
 * {
 *   "name": "Shiva",
 *   "email": "shiva@example.com",
 *   "password": "password123"
 * }
 *
 *
 * Validation:
 */

function validateCreateUserBody(body) {
  const errors = {};

  if (!isPlainObject(body)) {
    return {
      valid: false,
      errors: {
        body: "Request body must be an object",
      },
    };
  }

  if (typeof body.name !== "string" || body.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!isEmail(body.email)) {
    errors.email = "Valid email is required";
  }

  if (typeof body.password !== "string" || body.password.length < 8) {
    errors.password = "Password must contain at least 8 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,

    errors,
  };
}

console.log(
  validateCreateUserBody({
    name: "Shiva",
    email: "shiva@example.com",
    password: "password123",
  }),
);

/*
 * ============================================================
 * 25. Throwing validation errors
 * ============================================================
 *
 * Another approach is to throw an error.
 *
 * ============================================================
 */

class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);

    this.name = "ValidationError";

    this.errors = errors;
  }
}

function assertValidUser(user) {
  const result = validateUserWithErrors(user);

  if (!result.valid) {
    throw new ValidationError("User validation failed", result.errors);
  }
}

try {
  assertValidUser({
    name: "",
    email: "invalid",
    password: "123",
  });
} catch (error) {
  console.log("Validation failed:", error.message);

  console.log("Errors:", error.errors);
}

/*
 * ============================================================
 * 26. Whitelisting fields
 * ============================================================
 *
 * A client might send:
 *
 *
 * {
 *   name: "Shiva",
 *   email: "shiva@example.com",
 *   role: "admin"
 * }
 *
 *
 * If `role` should not be client-controlled during registration,
 * do not blindly copy the entire object.
 *
 *
 * BAD:
 *
 *
 *     const user = {
 *       ...req.body
 *     };
 *
 *
 * Better:
 *
 */

function extractAllowedUserFields(body) {
  return {
    name: body.name,
    email: body.email,
  };
}

console.log(
  extractAllowedUserFields({
    name: "Shiva",
    email: "shiva@example.com",
    role: "admin",
  }),
);

/*
 * ============================================================
 * 27. Allowlist vs blocklist
 * ============================================================
 *
 * Allowlist:
 *
 *     Define what is allowed.
 *
 *
 * Blocklist:
 *
 *     Define what is forbidden.
 *
 *
 * For request fields, allowlisting is usually safer.
 *
 *
 * Example:
 *
 *
 *     allowed:
 *       name
 *       email
 *
 *
 * Instead of:
 *
 *
 *     block:
 *       password
 *       role
 *       isAdmin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Validation should be deterministic
 * ============================================================
 *
 * Given the same input:
 *
 *
 *     validate(input)
 *
 *
 * should consistently produce the same result.
 *
 * Validation should generally not depend on unrelated mutable
 * state.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Manual validation limitations
 * ============================================================
 *
 * Manual validation works well for learning and simple cases.
 *
 * But large applications can become repetitive:
 *
 *
 *     if (...)
 *     if (...)
 *     if (...)
 *     if (...)
 *     if (...)
 *
 *
 * For complex schemas, schema-validation libraries are useful.
 *
 * Examples:
 *
 *
 *     Zod
 *     Joi
 *     Ajv
 *
 *
 * The next file introduces Zod.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Validation layers
 * ============================================================
 *
 *
 *             HTTP Request
 *                   ↓
 *             Input validation
 *                   ↓
 *             Business validation
 *                   ↓
 *             Database constraints
 *
 *
 * These are not always identical.
 *
 *
 * Input validation:
 *
 *     "Is the request structurally valid?"
 *
 *
 * Business validation:
 *
 *     "Is this operation allowed?"
 *
 *
 * Database constraints:
 *
 *     "Can this data be persisted safely?"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Validation is not authorization
 * ============================================================
 *
 * Validation:
 *
 *     "Is role a valid string?"
 *
 *
 * Authorization:
 *
 *     "Is this user allowed to set role=admin?"
 *
 *
 * These are different security concerns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Validation is not sanitization
 * ============================================================
 *
 * Validation:
 *
 *     Reject invalid input.
 *
 *
 * Sanitization/normalization:
 *
 *     Transform input into an accepted representation.
 *
 *
 * Example:
 *
 *     " Shiva "
 *
 *     ↓
 *
 *     "Shiva"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Validation checklist
 * ============================================================
 *
 *     ✓ Check required fields
 *
 *     ✓ Check data types
 *
 *     ✓ Check string lengths
 *
 *     ✓ Check numeric ranges
 *
 *     ✓ Check allowed values
 *
 *     ✓ Check formats
 *
 *     ✓ Validate nested objects
 *
 *     ✓ Validate arrays
 *
 *     ✓ Reject unexpected fields when appropriate
 *
 *     ✓ Do not trust client-provided types
 *
 *     ✓ Keep validation before business logic
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                 UNTRUSTED INPUT
 *                       │
 *                       ↓
 *                 ┌───────────┐
 *                 │ VALIDATE  │
 *                 └─────┬─────┘
 *                       │
 *                 ┌─────┴─────┐
 *                 ↓           ↓
 *               VALID       INVALID
 *                 │           │
 *                 ↓           ↓
 *          Business logic   Reject
 *                 │
 *                 ↓
 *              Database
 *
 *
 * Main principle:
 *
 *     Never trust external input.
 *
 *     Validate it before allowing it to influence application
 *     behavior or persistent data.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     17_validation/zod.js
 *
 * ============================================================
 */
