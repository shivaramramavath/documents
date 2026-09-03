/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     15_unique_constraints.js
 *
 * Topic:
 *     Mongoose Unique Constraints
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. unique: true
 *     2. Unique indexes
 *     3. Duplicate key errors
 *     4. E11000
 *     5. Handling duplicate errors
 *     6. Compound unique indexes
 *     7. Unique combinations
 *     8. Sparse unique indexes
 *     9. Partial unique indexes
 *    10. Case-insensitive uniqueness
 *    11. Normalizing values
 *    12. Checking uniqueness
 *    13. Race conditions
 *    14. Production pattern
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
 * 2. BASIC UNIQUE FIELD
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,

    required: true,

    trim: true,

    unique: true,
  },

  email: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    unique: true,
  },
});

/*
 * ============================================================
 * 3. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseUniqueUser ||
  mongoose.model("MongooseUniqueUser", userSchema);

/*
 * ============================================================
 * 4. WHAT unique: true ACTUALLY DOES
 * ============================================================
 *
 * This:
 *
 *     unique: true
 *
 * is essentially an instruction for creating a unique
 * MongoDB index.
 *
 * It is NOT equivalent to:
 *
 *     validate()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. EXPLICIT UNIQUE INDEX
 * ============================================================
 *
 * Instead of:
 *
 *     email: {
 *       type: String,
 *       unique: true
 *     }
 *
 * you can define:
 *
 *     schema.index(
 *       { email: 1 },
 *       { unique: true }
 *     )
 *
 * ============================================================
 */

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,

    required: true,
  },

  name: String,
});

employeeSchema.index(
  {
    employeeId: 1,
  },

  {
    unique: true,

    name: "unique_employee_id",
  },
);

const Employee =
  mongoose.models.MongooseUniqueEmployee ||
  mongoose.model("MongooseUniqueEmployee", employeeSchema);

/*
 * ============================================================
 * 6. DUPLICATE KEY ERROR
 * ============================================================
 */

async function createUser(username, email) {
  try {
    const user = await User.create({
      username,
      email,
    });

    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      /*
       * Mongoose validation/casting errors.
       */

      console.error("Mongoose error:", error.message);
    }

    throw error;
  }
}

/*
 * ============================================================
 * 7. CHECK FOR E11000
 * ============================================================
 */

function isDuplicateKeyError(error) {
  return (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  );
}

/*
 * ============================================================
 * 8. HANDLE DUPLICATE ERROR
 * ============================================================
 */

async function createUserSafe(username, email) {
  try {
    return await User.create({
      username,
      email,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error("Username or email already exists");
    }

    throw error;
  }
}

/*
 * ============================================================
 * 9. DUPLICATE FIELD EXTRACTION
 * ============================================================
 */

function getDuplicateFields(error) {
  if (!isDuplicateKeyError(error)) {
    return null;
  }

  return error.keyPattern ?? null;
}

/*
 * ============================================================
 * 10. DUPLICATE VALUE EXTRACTION
 * ============================================================
 */

function getDuplicateValues(error) {
  if (!isDuplicateKeyError(error)) {
    return null;
  }

  return error.keyValue ?? null;
}

/*
 * ============================================================
 * 11. COMPOUND UNIQUE INDEX
 * ============================================================
 *
 * Sometimes a single field doesn't need to be globally
 * unique.
 *
 * Instead, a combination must be unique.
 *
 * ============================================================
 */

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Student",

    required: true,
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Subject",

    required: true,
  },

  semester: {
    type: Number,

    required: true,
  },
});

/*
 * ============================================================
 * 12. COMPOUND UNIQUE CONSTRAINT
 * ============================================================
 */

enrollmentSchema.index(
  {
    studentId: 1,

    subjectId: 1,

    semester: 1,
  },

  {
    unique: true,

    name: "unique_student_subject_semester",
  },
);

const Enrollment =
  mongoose.models.MongooseUniqueEnrollment ||
  mongoose.model("MongooseUniqueEnrollment", enrollmentSchema);

/*
 * ============================================================
 * 13. WHAT THIS MEANS
 * ============================================================
 *
 * Allowed:
 *
 *     Student A
 *     Subject X
 *     Semester 1
 *
 *
 * Not allowed again:
 *
 *     Student A
 *     Subject X
 *     Semester 1
 *
 *
 * But this can exist:
 *
 *     Student A
 *     Subject X
 *     Semester 2
 *
 *
 * because the combination is different.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. TIMETABLE UNIQUE CONSTRAINT
 * ============================================================
 *
 * Example:
 *
 * A faculty member cannot have two timetable slots for the
 * same academic context, day and period.
 *
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Department",

    required: true,
  },

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Faculty",

    required: true,
  },

  day: {
    type: String,

    required: true,
  },

  period: {
    type: Number,

    required: true,
  },
});

/*
 * ============================================================
 * 15. UNIQUE TIMETABLE SLOT
 * ============================================================
 */

timetableSchema.index(
  {
    facultyId: 1,

    day: 1,

    period: 1,
  },

  {
    unique: true,

    name: "unique_faculty_timetable_slot",
  },
);

const Timetable =
  mongoose.models.MongooseUniqueTimetable ||
  mongoose.model("MongooseUniqueTimetable", timetableSchema);

/*
 * ============================================================
 * 16. ROOM UNIQUE CONSTRAINT
 * ============================================================
 *
 * Example:
 *
 * A room cannot have two bookings for the same time slot.
 *
 * ============================================================
 */

timetableSchema.index(
  {
    departmentId: 1,

    sectionId: 1,

    day: 1,

    period: 1,
  },

  {
    unique: true,

    name: "unique_section_timetable_slot",
  },
);

/*
 * ============================================================
 * 17. SPARSE UNIQUE INDEX
 * ============================================================
 *
 * Useful when a field is optional.
 *
 * ============================================================
 */

const profileSchema = new mongoose.Schema({
  username: String,

  externalId: String,
});

profileSchema.index(
  {
    externalId: 1,
  },

  {
    unique: true,

    sparse: true,
  },
);

const Profile =
  mongoose.models.MongooseUniqueProfile ||
  mongoose.model("MongooseUniqueProfile", profileSchema);

/*
 * ============================================================
 * 18. WHY SPARSE?
 * ============================================================
 *
 * Suppose:
 *
 *     externalId is optional
 *
 *
 * User A:
 *
 *     externalId = "github-123"
 *
 *
 * User B:
 *
 *     externalId = undefined
 *
 *
 * User C:
 *
 *     externalId = undefined
 *
 *
 * A sparse index excludes documents where the field is
 * missing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. PARTIAL UNIQUE INDEX
 * ============================================================
 *
 * More flexible than sparse indexes.
 *
 * ============================================================
 */

const accountSchema = new mongoose.Schema({
  email: String,

  deleted: Boolean,
});

accountSchema.index(
  {
    email: 1,
  },

  {
    unique: true,

    partialFilterExpression: {
      deleted: false,
    },

    name: "unique_active_email",
  },
);

const Account =
  mongoose.models.MongooseUniqueAccount ||
  mongoose.model("MongooseUniqueAccount", accountSchema);

/*
 * ============================================================
 * 20. CASE-INSENSITIVE UNIQUENESS
 * ============================================================
 *
 * Consider:
 *
 *     Shiva@example.com
 *
 *     shiva@example.com
 *
 *
 * If your application considers these the same user, normalize
 * the value before storage.
 *
 * ============================================================
 */

const normalizedUserSchema = new mongoose.Schema({
  email: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    unique: true,
  },
});

const NormalizedUser =
  mongoose.models.MongooseNormalizedUser ||
  mongoose.model("MongooseNormalizedUser", normalizedUserSchema);

/*
 * ============================================================
 * 21. NORMALIZATION
 * ============================================================
 *
 * With lowercase: true
 *
 *     SHIVA@EXAMPLE.COM
 *
 * becomes:
 *
 *     shiva@example.com
 *
 *
 * before being stored by Mongoose.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. DON'T RELY ONLY ON findOne()
 * ============================================================
 *
 * You might be tempted to do:
 *
 *     const existing =
 *       await User.findOne({ email });
 *
 *     if (existing) {
 *       throw new Error("Already exists");
 *     }
 *
 *     await User.create({ email });
 *
 *
 * This is NOT sufficient for enforcing uniqueness.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. RACE CONDITION
 * ============================================================
 *
 * Request A:
 *
 *     findOne()
 *        ↓
 *     no user
 *
 *
 * Request B:
 *
 *     findOne()
 *        ↓
 *     no user
 *
 *
 * Request A:
 *
 *     insert
 *
 *
 * Request B:
 *
 *     insert
 *
 *
 * Both requests can pass the application-level check.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. DATABASE UNIQUE INDEX SOLVES THIS
 * ============================================================
 *
 * MongoDB is the final authority.
 *
 *     Request A → INSERT → success
 *
 *     Request B → INSERT → E11000
 *
 *
 * Therefore:
 *
 *     Application check = friendly UX
 *
 *     Unique index    = actual enforcement
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. UPSERT + UNIQUE INDEX
 * ============================================================
 */

async function upsertUser(email) {
  return User.findOneAndUpdate(
    {
      email,
    },

    {
      $set: {
        email,
      },
    },

    {
      upsert: true,

      new: true,
    },
  ).exec();
}

/*
 * ============================================================
 * 26. INDEX INSPECTION
 * ============================================================
 */

async function showIndexes() {
  const indexes = await User.collection.indexes();

  console.dir(indexes, {
    depth: null,
  });
}

/*
 * ============================================================
 * 27. ENSURE INDEXES
 * ============================================================
 */

async function ensureIndexes() {
  await User.createIndexes();
}

/*
 * ============================================================
 * 28. PRODUCTION ERROR MAPPER
 * ============================================================
 */

function mapMongoError(error) {
  if (isDuplicateKeyError(error)) {
    return {
      status: 409,

      code: "DUPLICATE_RESOURCE",

      message: "A resource with the same unique value already exists.",

      fields: error.keyPattern,

      values: error.keyValue,
    };
  }

  return {
    status: 500,

    code: "DATABASE_ERROR",

    message: "Database operation failed.",
  };
}

/*
 * ============================================================
 * 29. SERVICE-LEVEL EXAMPLE
 * ============================================================
 */

async function registerUser(username, email) {
  try {
    /*
     * Optional pre-check.
     *
     * Useful for UX but NOT the actual uniqueness guarantee.
     */

    const existing = await User.exists({
      $or: [
        {
          username,
        },

        {
          email,
        },
      ],
    });

    if (existing) {
      throw new Error("Username or email already exists");
    }

    return await User.create({
      username,
      email,
    });
  } catch (error) {
    /*
     * Even after the pre-check, another request may have
     * inserted the same value.
     *
     * Therefore E11000 must still be handled.
     */

    if (isDuplicateKeyError(error)) {
      const mapped = mapMongoError(error);

      const duplicateError = new Error(mapped.message);

      duplicateError.name = "DuplicateResourceError";

      throw duplicateError;
    }

    throw error;
  }
}

/*
 * ============================================================
 * 30. MAIN
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("\nMongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Ensure indexes
     * --------------------------------------------------------
     */

    await User.createIndexes();

    /*
     * --------------------------------------------------------
     * Display indexes
     * --------------------------------------------------------
     */

    const indexes = await User.collection.indexes();

    console.log("\nUser indexes:");

    console.dir(indexes, {
      depth: null,
    });

    /*
     * --------------------------------------------------------
     * Example duplicate handling
     * --------------------------------------------------------
     */

    try {
      await User.create({
        username: "duplicate-demo",

        email: "duplicate@example.com",
      });

      await User.create({
        username: "duplicate-demo-2",

        email: "duplicate@example.com",
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        console.log("\nDuplicate key detected");

        console.log("Fields:", getDuplicateFields(error));

        console.log("Values:", getDuplicateValues(error));
      } else {
        throw error;
      }
    }
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
