/**
 * ============================================================
 * 37_security.js
 * ============================================================
 *
 * Mongoose + MongoDB Security
 *
 * ============================================================
 *
 * Topics:
 *
 *  1. MongoDB injection
 *  2. Operator injection
 *  3. Query sanitization
 *  4. Strict queries
 *  5. Schema validation
 *  6. Mass assignment
 *  7. Sensitive fields
 *  8. Password fields
 *  9. Projection
 * 10. Regex security
 * 11. ObjectId validation
 * 12. Authorization
 * 13. Safe updates
 * 14. Error handling
 * 15. Security checklist
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

/*
 * ============================================================
 * 1. ENVIRONMENT
 * ============================================================
 */

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/*
 * ============================================================
 * 2. USER SCHEMA
 * ============================================================
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,

      maxlength: 100,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    password: {
      type: String,

      required: true,

      /*
       * Password should not be returned
       * by default in normal queries.
       */

      select: false,
    },

    role: {
      type: String,

      enum: ["student", "faculty", "admin"],

      default: "student",
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "SecurityDepartment",
    },

    active: {
      type: Boolean,

      default: true,
    },

    age: {
      type: Number,

      min: 0,

      max: 120,
    },
  },

  {
    timestamps: true,

    /*
     * Reject fields that are not
     * defined in the schema.
     */

    strict: true,
  },
);

const User =
  mongoose.models.SecurityUser || mongoose.model("SecurityUser", userSchema);

/*
 * ============================================================
 * 3. DEPARTMENT SCHEMA
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,

    maxlength: 100,
  },
});

const Department =
  mongoose.models.SecurityDepartment ||
  mongoose.model("SecurityDepartment", departmentSchema);

/*
 * ============================================================
 * 4. NEVER TRUST CLIENT QUERIES
 * ============================================================
 *
 * BAD:
 *
 * User.find(req.query)
 *
 *
 * Why?
 *
 * The client controls the entire MongoDB
 * filter.
 *
 * ============================================================
 */

async function unsafeQuery(requestQuery) {
  /*
   * DO NOT DO THIS IN PRODUCTION.
   */

  return User.find(requestQuery);
}

/*
 * ============================================================
 * 5. SAFE QUERY
 * ============================================================
 */

async function safeQuery(departmentId, active) {
  const filter = {};

  if (departmentId) {
    filter.departmentId = departmentId;
  }

  if (typeof active === "boolean") {
    filter.active = active;
  }

  return User.find(filter).select("name email role departmentId active").lean();
}

/*
 * ============================================================
 * 6. OPERATOR INJECTION
 * ============================================================
 *
 * MongoDB queries support operators
 * such as:
 *
 * $gt
 * $lt
 * $in
 * $ne
 * $or
 * $where
 *
 * Never blindly pass user-controlled
 * objects into a MongoDB query.
 *
 * ============================================================
 */

/*
 * Example of dangerous conceptual input:
 *
 * {
 *   email: {
 *     $ne: null
 *   }
 * }
 *
 *
 * Instead of checking one email,
 * this can change the meaning of
 * the query.
 */

/*
 * ============================================================
 * 7. SAFE EMAIL QUERY
 * ============================================================
 */

async function findByEmail(email) {
  if (typeof email !== "string") {
    throw new TypeError("email must be a string");
  }

  return User.findOne({
    email: email.trim().toLowerCase(),
  })
    .select("name email role active")
    .lean();
}

/*
 * ============================================================
 * 8. QUERY SANITIZATION
 * ============================================================
 *
 * Mongoose provides query
 * sanitization options that can
 * help prevent query selector
 * injection by removing keys
 * beginning with "$".
 *
 * ============================================================
 */

mongoose.set("sanitizeFilter", true);

/*
 * This is useful defense-in-depth.
 *
 * But don't treat sanitization as a
 * replacement for input validation
 * and authorization.
 */

/*
 * ============================================================
 * 9. STRICT QUERY
 * ============================================================
 */

mongoose.set("strictQuery", true);

/*
 * Unknown query fields can be
 * handled according to strictQuery
 * behavior.
 */

/*
 * ============================================================
 * 10. NEVER USE $WHERE WITH USER INPUT
 * ============================================================
 *
 * Avoid:
 *
 * {
 *   $where: userInput
 * }
 *
 * MongoDB server-side JavaScript features
 * can create serious security and
 * performance risks when misused.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. SCHEMA VALIDATION
 * ============================================================
 */

const secureStudentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,

    minlength: 2,

    maxlength: 100,
  },

  age: {
    type: Number,

    min: 16,

    max: 100,
  },

  email: {
    type: String,

    required: true,

    lowercase: true,

    trim: true,
  },
});

const SecureStudent =
  mongoose.models.SecureStudent ||
  mongoose.model("SecureStudent", secureStudentSchema);

/*
 * ============================================================
 * 12. VALIDATION
 * ============================================================
 */

async function createStudent(data) {
  const student = new SecureStudent({
    name: data.name,

    age: data.age,

    email: data.email,
  });

  return student.save();
}

/*
 * ============================================================
 * 13. MASS ASSIGNMENT
 * ============================================================
 *
 * BAD:
 *
 * User.create(req.body)
 *
 *
 * The client might send:
 *
 * {
 *   name: "Shiva",
 *   role: "admin"
 * }
 *
 *
 * If role should only be changed by
 * privileged code, accepting the
 * entire request body is dangerous.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. SAFE MASS ASSIGNMENT
 * ============================================================
 */

function pickAllowedFields(data) {
  return {
    name: data.name,

    email: data.email,
  };
}

/*
 * ============================================================
 * 15. SAFE USER CREATION
 * ============================================================
 */

async function createUser(data) {
  const allowed = pickAllowedFields(data);

  return User.create(allowed);
}

/*
 * ============================================================
 * 16. ROLE SHOULD NOT COME FROM
 *     NORMAL USER REQUEST
 * ============================================================
 */

async function updateUserProfile(userId, data) {
  const allowedUpdate = {
    ...(data.name !== undefined
      ? {
          name: data.name,
        }
      : {}),

    ...(data.email !== undefined
      ? {
          email: data.email,
        }
      : {}),
  };

  return User.findByIdAndUpdate(
    userId,

    {
      $set: allowedUpdate,
    },

    {
      new: true,

      runValidators: true,
    },
  )
    .select("name email role active")
    .lean();
}

/*
 * ============================================================
 * 17. PRIVILEGED ROLE UPDATE
 * ============================================================
 */

async function updateUserRole(userId, newRole) {
  const allowedRoles = ["student", "faculty", "admin"];

  if (!allowedRoles.includes(newRole)) {
    throw new Error("Invalid role");
  }

  return User.findByIdAndUpdate(
    userId,

    {
      $set: {
        role: newRole,
      },
    },

    {
      new: true,

      runValidators: true,
    },
  );
}

/*
 * ============================================================
 * 18. SENSITIVE FIELD PROTECTION
 * ============================================================
 */

async function getPublicUser(userId) {
  return User.findById(userId).select("name email role active").lean();
}

/*
 * password is excluded because:
 *
 * select: false
 *
 *
 * and we explicitly select only
 * public fields.
 */

/*
 * ============================================================
 * 19. EXPLICIT PASSWORD ACCESS
 * ============================================================
 *
 * Authentication code may explicitly
 * request the password hash when
 * necessary.
 *
 * ============================================================
 */

async function getUserForAuthentication(email) {
  return User.findOne({
    email: email.trim().toLowerCase(),
  })
    .select("+password email role active")
    .lean();
}

/*
 * ============================================================
 * 20. NEVER RETURN PASSWORD
 * ============================================================
 */

async function publicAuthenticationResult(email) {
  const user = await getUserForAuthentication(email);

  if (!user) {
    return null;
  }

  /*
   * Password should remain inside
   * authentication logic and should
   * not be sent to the client.
   */

  return {
    id: user._id,

    email: user.email,

    role: user.role,

    active: user.active,
  };
}

/*
 * ============================================================
 * 21. OBJECTID VALIDATION
 * ============================================================
 */

function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
}

/*
 * ============================================================
 * 22. SAFE FIND BY ID
 * ============================================================
 */

async function findUserById(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  return User.findById(userId).select("name email role active").lean();
}

/*
 * ============================================================
 * 23. REGEX ABUSE
 * ============================================================
 *
 * BAD:
 *
 * User.find({
 *   name: {
 *     $regex: req.query.search
 *   }
 * })
 *
 *
 * An uncontrolled regular expression
 * can cause expensive pattern matching.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. ESCAPE REGEX INPUT
 * ============================================================
 */

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
 * ============================================================
 * 25. SAFE SEARCH
 * ============================================================
 */

async function searchUsers(search) {
  if (typeof search !== "string") {
    throw new TypeError("search must be a string");
  }

  const trimmed = search.trim();

  if (trimmed.length === 0) {
    return [];
  }

  if (trimmed.length > 50) {
    throw new Error("Search term is too long");
  }

  const escaped = escapeRegex(trimmed);

  return User.find({
    name: {
      $regex: escaped,

      $options: "i",
    },
  })
    .select("name email role")
    .limit(20)
    .lean();
}

/*
 * ============================================================
 * 26. SAFE ENUM FILTER
 * ============================================================
 */

async function findByRole(role) {
  const allowedRoles = ["student", "faculty", "admin"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  return User.find({
    role: role,
  })
    .select("name email role")
    .lean();
}

/*
 * ============================================================
 * 27. AUTHENTICATION
 * ============================================================
 */

function authenticate(currentUser) {
  if (!currentUser) {
    throw new Error("Authentication required");
  }

  return true;
}

/*
 * ============================================================
 * 28. AUTHORIZATION
 * ============================================================
 */

function requireAdmin(currentUser) {
  authenticate(currentUser);

  if (currentUser.role !== "admin") {
    throw new Error("Forbidden");
  }

  return true;
}

/*
 * ============================================================
 * 29. AUTHENTICATION VS AUTHORIZATION
 * ============================================================
 *
 * Authentication:
 *
 * "Who are you?"
 *
 *
 * Authorization:
 *
 * "Are you allowed to do this?"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. SECURE ADMIN OPERATION
 * ============================================================
 */

async function deleteUser(currentUser, userId) {
  requireAdmin(currentUser);

  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  return User.deleteOne({
    _id: userId,
  });
}

/*
 * ============================================================
 * 31. ERROR HANDLING
 * ============================================================
 */

function handleMongoError(error) {
  if (error?.code === 11000) {
    return {
      status: 409,

      message: "Resource already exists",
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      status: 400,

      message: "Validation failed",
    };
  }

  return {
    status: 500,

    message: "Database operation failed",
  };
}

/*
 * ============================================================
 * 32. DON'T EXPOSE INTERNAL ERRORS
 * ============================================================
 *
 * BAD RESPONSE:
 *
 * {
 *   error: error.stack
 * }
 *
 *
 * Production APIs should not expose
 * internal database details unnecessarily.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. SAFE UPDATE OPTIONS
 * ============================================================
 */

async function safeUpdate(userId, updates) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  const allowedFields = ["name", "email"];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  }

  return User.findByIdAndUpdate(
    userId,

    {
      $set: safeUpdates,
    },

    {
      new: true,

      runValidators: true,
    },
  )
    .select("name email role active")
    .lean();
}

/*
 * ============================================================
 * 34. AVOID CLIENT-CONTROLLED OPERATORS
 * ============================================================
 *
 * BAD:
 *
 * const update = req.body;
 *
 * await User.updateOne(
 *   { _id: userId },
 *   update
 * );
 *
 *
 * Client could potentially control
 * update operators.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. SAFE UPDATE OPERATOR
 * ============================================================
 */

async function safeSetUpdate(userId, data) {
  const update = {
    $set: {
      name: data.name,

      email: data.email,
    },
  };

  return User.updateOne(
    {
      _id: userId,
    },

    update,

    {
      runValidators: true,
    },
  );
}

/*
 * ============================================================
 * 36. SECURITY INDEX
 * ============================================================
 */

userSchema.index({
  email: 1,
});

/*
 * Unique email index is also
 * important for identity integrity.
 */

/*
 * ============================================================
 * 37. SECURITY CHECKLIST
 * ============================================================
 */

function securityChecklist() {
  console.log(`

  MONGOOSE SECURITY CHECKLIST

  ─────────────────────────────────────

  INPUT

  ✓ Validate input
  ✓ Validate types
  ✓ Validate lengths
  ✓ Validate enums
  ✓ Validate ObjectIds


  QUERY

  ✓ Don't pass req.query directly
  ✓ Don't trust MongoDB operators
  ✓ Enable sanitizeFilter
  ✓ Use strictQuery appropriately
  ✓ Avoid $where with user input
  ✓ Control regex input


  UPDATE

  ✓ Don't blindly use req.body
  ✓ Use allowlists
  ✓ Use explicit $set
  ✓ Use runValidators


  DATA

  ✓ Hide password fields
  ✓ Don't return secrets
  ✓ Use projection
  ✓ Keep sensitive fields minimal


  AUTH

  ✓ Authenticate users
  ✓ Authorize operations
  ✓ Enforce role boundaries
  ✓ Enforce ownership boundaries


  ERRORS

  ✓ Don't expose stack traces
  ✓ Handle duplicate keys
  ✓ Handle validation errors
  ✓ Return safe error messages


  DATABASE

  ✓ Use least-privilege DB users
  ✓ Use TLS in production
  ✓ Protect connection strings
  ✓ Never commit .env
  ✓ Restrict network access


  ─────────────────────────────────────

  `);
}

/*
 * ============================================================
 * 38. CONNECTION
 * ============================================================
 */

async function connectDB() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 39. MAIN
 * ============================================================
 */

async function main() {
  await connectDB();

  securityChecklist();

  /*
   * Uncomment examples.
   */

  // await safeQuery(
  //   "65f123456789012345678901",
  //   true,
  // );

  // await findByEmail(
  //   "user@example.com",
  // );

  // await createStudent({
  //   name: "Shiva",
  //   age: 21,
  //   email: "shiva@example.com",
  // });

  // await createUser({
  //   name: "Shiva",
  //   email: "shiva@example.com",
  //   role: "admin",
  // });

  // await findUserById(
  //   "65f123456789012345678901",
  // );

  // await searchUsers(
  //   "Shiva",
  // );

  // await findByRole(
  //   "student",
  // );

  // await safeUpdate(
  //   "65f123456789012345678901",
  //   {
  //     name: "New Name",
  //     email: "new@example.com",
  //     role: "admin",
  //   },
  // );

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
