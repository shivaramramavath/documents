/**
 * ============================================================
 * 39_service_pattern.js
 * ============================================================
 *
 * Mongoose Service Pattern
 *
 * ============================================================
 *
 * Architecture:
 *
 * Controller
 *      ↓
 * Service
 *      ↓
 * Repository
 *      ↓
 * Mongoose Model
 *      ↓
 * MongoDB
 *
 * ============================================================
 *
 * Topics:
 *
 *  1. What is a service?
 *  2. Repository vs service
 *  3. Business logic
 *  4. Validation
 *  5. Authorization
 *  6. Service methods
 *  7. Transactions
 *  8. Multiple repositories
 *  9. Error handling
 * 10. Dependency injection
 * 11. Service composition
 * 12. Timetable example
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
 * 2. SCHEMAS
 * ============================================================
 */

/*
 * ------------------------------------------------------------
 * User
 * ------------------------------------------------------------
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    role: {
      type: String,

      enum: ["student", "faculty", "admin"],

      default: "student",
    },

    active: {
      type: Boolean,

      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ------------------------------------------------------------
 * Faculty
 * ------------------------------------------------------------
 */

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,

      ref: "ServiceDepartment",
    },

    active: {
      type: Boolean,

      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ------------------------------------------------------------
 * Subject
 * ------------------------------------------------------------
 */

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,

      required: true,

      uppercase: true,

      trim: true,
    },

    name: {
      type: String,

      required: true,

      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,

      ref: "ServiceDepartment",
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ------------------------------------------------------------
 * Timetable
 * ------------------------------------------------------------
 */

const timetableSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,

      ref: "ServiceDepartment",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,

      ref: "ServiceUser",
    },

    status: {
      type: String,

      enum: ["draft", "generating", "published"],

      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const User =
  mongoose.models.ServiceUser || mongoose.model("ServiceUser", userSchema);

const Faculty =
  mongoose.models.ServiceFaculty ||
  mongoose.model("ServiceFaculty", facultySchema);

const Subject =
  mongoose.models.ServiceSubject ||
  mongoose.model("ServiceSubject", subjectSchema);

const Timetable =
  mongoose.models.ServiceTimetable ||
  mongoose.model("ServiceTimetable", timetableSchema);

/*
 * ============================================================
 * 3. REPOSITORIES
 * ============================================================
 *
 * Repositories contain database access.
 *
 * They don't decide application rules.
 * ============================================================
 */

/*
 * ------------------------------------------------------------
 * User Repository
 * ------------------------------------------------------------
 */

const userRepository = {
  async findById(userId, options = {}) {
    let query = User.findById(userId);

    if (options.session) {
      query = query.session(options.session);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  async findByEmail(email, options = {}) {
    let query = User.findOne({
      email,
    });

    if (options.session) {
      query = query.session(options.session);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  async create(data, options = {}) {
    const users = await User.create([data], {
      session: options.session,
    });

    return users[0];
  },

  async updateById(userId, update, options = {}) {
    return User.findByIdAndUpdate(
      userId,

      update,

      {
        new: true,

        runValidators: true,

        session: options.session,
      },
    );
  },

  async deleteById(userId, options = {}) {
    return User.findByIdAndDelete(
      userId,

      {
        session: options.session,
      },
    );
  },
};

/*
 * ------------------------------------------------------------
 * Faculty Repository
 * ------------------------------------------------------------
 */

const facultyRepository = {
  async findById(facultyId, options = {}) {
    let query = Faculty.findById(facultyId);

    if (options.session) {
      query = query.session(options.session);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  async findByEmail(email, options = {}) {
    let query = Faculty.findOne({
      email,
    });

    if (options.session) {
      query = query.session(options.session);
    }

    return query;
  },

  async create(data, options = {}) {
    const faculty = await Faculty.create([data], {
      session: options.session,
    });

    return faculty[0];
  },

  async count(filter, options = {}) {
    let query = Faculty.countDocuments(filter);

    if (options.session) {
      query = query.session(options.session);
    }

    return query;
  },
};

/*
 * ------------------------------------------------------------
 * Subject Repository
 * ------------------------------------------------------------
 */

const subjectRepository = {
  async findById(subjectId, options = {}) {
    let query = Subject.findById(subjectId);

    if (options.session) {
      query = query.session(options.session);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  async findByCode(code, options = {}) {
    let query = Subject.findOne({
      code,
    });

    if (options.session) {
      query = query.session(options.session);
    }

    return query;
  },

  async create(data, options = {}) {
    const subjects = await Subject.create([data], {
      session: options.session,
    });

    return subjects[0];
  },
};

/*
 * ------------------------------------------------------------
 * Timetable Repository
 * ------------------------------------------------------------
 */

const timetableRepository = {
  async findById(timetableId, options = {}) {
    let query = Timetable.findById(timetableId);

    if (options.session) {
      query = query.session(options.session);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  async create(data, options = {}) {
    const timetables = await Timetable.create([data], {
      session: options.session,
    });

    return timetables[0];
  },

  async updateById(timetableId, update, options = {}) {
    return Timetable.findByIdAndUpdate(
      timetableId,

      update,

      {
        new: true,

        runValidators: true,

        session: options.session,
      },
    );
  },
};

/*
 * ============================================================
 * 4. CUSTOM SERVICE ERRORS
 * ============================================================
 *
 * Services should not throw random
 * strings everywhere.
 *
 * Use meaningful application errors.
 * ============================================================
 */

class ServiceError extends Error {
  constructor(message, statusCode = 400, code = "SERVICE_ERROR") {
    super(message);

    this.name = "ServiceError";

    this.statusCode = statusCode;

    this.code = code;
  }
}

class NotFoundError extends ServiceError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends ServiceError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

class ForbiddenError extends ServiceError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

/*
 * ============================================================
 * 5. USER SERVICE
 * ============================================================
 *
 * This is where business rules live.
 * ============================================================
 */

const userService = {
  /*
   * ==========================================================
   * CREATE USER
   * ==========================================================
   */

  async createUser(data) {
    if (!data.name || !data.email) {
      throw new ServiceError(
        "Name and email are required",
        400,
        "INVALID_USER",
      );
    }

    const email = data.email.trim().toLowerCase();

    /*
     * Business rule:
     *
     * Email must be unique.
     */

    const existing = await userRepository.findByEmail(email, {
      lean: true,
    });

    if (existing) {
      throw new ConflictError("User email already exists");
    }

    /*
     * Do NOT allow normal callers
     * to choose arbitrary privileged
     * roles.
     */

    const role = data.role === "faculty" ? "faculty" : "student";

    return userRepository.create({
      name: data.name.trim(),

      email,

      role,

      active: true,
    });
  },

  /*
   * ==========================================================
   * GET USER
   * ==========================================================
   */

  async getUser(userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ServiceError("Invalid user ID", 400, "INVALID_ID");
    }

    const user = await userRepository.findById(
      userId,

      {
        lean: true,
      },
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  /*
   * ==========================================================
   * DELETE USER
   * ==========================================================
   */

  async deleteUser(userId, currentUser) {
    /*
     * Authorization belongs here.
     */

    if (currentUser.role !== "admin") {
      throw new ForbiddenError("Only administrators can delete users");
    }

    const user = await userRepository.findById(userId, {
      lean: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return userRepository.deleteById(userId);
  },
};

/*
 * ============================================================
 * 6. FACULTY SERVICE
 * ============================================================
 */

const facultyService = {
  /*
   * ==========================================================
   * CREATE FACULTY
   * ==========================================================
   */

  async createFaculty(data, currentUser) {
    /*
     * Authorization.
     */

    if (currentUser.role !== "admin") {
      throw new ForbiddenError("Only administrators can create faculty");
    }

    if (!data.name || !data.email || !data.departmentId) {
      throw new ServiceError("Name, email and department are required");
    }

    if (!mongoose.isValidObjectId(data.departmentId)) {
      throw new ServiceError(
        "Invalid department ID",
        400,
        "INVALID_DEPARTMENT_ID",
      );
    }

    const email = data.email.trim().toLowerCase();

    const existing = await facultyRepository.findByEmail(email);

    if (existing) {
      throw new ConflictError("Faculty email already exists");
    }

    return facultyRepository.create({
      name: data.name.trim(),

      email,

      departmentId: data.departmentId,

      active: true,
    });
  },
};

/*
 * ============================================================
 * 7. SUBJECT SERVICE
 * ============================================================
 */

const subjectService = {
  async createSubject(data, currentUser) {
    if (currentUser.role !== "admin") {
      throw new ForbiddenError("Only administrators can create subjects");
    }

    if (!data.code || !data.name || !data.departmentId) {
      throw new ServiceError("Code, name and department are required");
    }

    const code = data.code.trim().toUpperCase();

    const existing = await subjectRepository.findByCode(code);

    if (existing) {
      throw new ConflictError("Subject code already exists");
    }

    return subjectRepository.create({
      code,

      name: data.name.trim(),

      departmentId: data.departmentId,
    });
  },
};

/*
 * ============================================================
 * 8. TIMETABLE SERVICE
 * ============================================================
 *
 * This is where the pattern becomes
 * particularly useful.
 *
 * A timetable operation can involve:
 *
 * - User
 * - Faculty
 * - Subjects
 * - Rooms
 * - Timetable
 *
 * One service can orchestrate
 * multiple repositories.
 * ============================================================
 */

const timetableService = {
  /*
   * ==========================================================
   * CREATE TIMETABLE
   * ==========================================================
   */

  async createTimetable(data, currentUser) {
    /*
     * --------------------------------------------
     * 1. Authorization
     * --------------------------------------------
     */

    if (!["admin", "faculty"].includes(currentUser.role)) {
      throw new ForbiddenError("You cannot create a timetable");
    }

    /*
     * --------------------------------------------
     * 2. Validate IDs
     * --------------------------------------------
     */

    if (!mongoose.isValidObjectId(data.departmentId)) {
      throw new ServiceError("Invalid department ID");
    }

    /*
     * --------------------------------------------
     * 3. Business rules
     * --------------------------------------------
     */

    if (!data.name || data.name.trim().length < 3) {
      throw new ServiceError(
        "Timetable name must contain at least 3 characters",
      );
    }

    /*
     * --------------------------------------------
     * 4. Create timetable
     * --------------------------------------------
     */

    return timetableRepository.create({
      name: data.name.trim(),

      departmentId: data.departmentId,

      createdBy: currentUser._id,

      status: "draft",
    });
  },

  /*
   * ==========================================================
   * START GENERATION
   * ==========================================================
   */

  async startGeneration(timetableId, currentUser) {
    /*
     * --------------------------------------------
     * Authentication / authorization
     * --------------------------------------------
     */

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    /*
     * --------------------------------------------
     * Find timetable
     * --------------------------------------------
     */

    const timetable = await timetableRepository.findById(
      timetableId,

      {
        lean: true,
      },
    );

    if (!timetable) {
      throw new NotFoundError("Timetable not found");
    }

    /*
     * --------------------------------------------
     * Ownership / authorization
     * --------------------------------------------
     */

    const isAdmin = currentUser.role === "admin";

    const isOwner = String(timetable.createdBy) === String(currentUser._id);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenError("You cannot generate this timetable");
    }

    /*
     * --------------------------------------------
     * State transition
     * --------------------------------------------
     *
     * Business rule:
     *
     * published
     *     ↓
     * cannot start generation
     *
     * draft
     *     ↓
     * generating
     *
     * --------------------------------------------
     */

    if (timetable.status === "published") {
      throw new ServiceError(
        "Published timetable cannot be regenerated",
        409,
        "INVALID_STATE",
      );
    }

    /*
     * --------------------------------------------
     * Update state
     * --------------------------------------------
     */

    return timetableRepository.updateById(
      timetableId,

      {
        $set: {
          status: "generating",
        },
      },
    );
  },
};

/*
 * ============================================================
 * 9. TRANSACTIONAL SERVICE
 * ============================================================
 *
 * Transactions belong at the
 * business workflow level.
 *
 * Example:
 *
 * Create user
 * +
 * Create faculty
 *
 * Both succeed
 * OR
 * both fail.
 * ============================================================
 */

async function createFacultyWithUser(data, currentUser) {
  /*
   * Authorization.
   */

  if (currentUser.role !== "admin") {
    throw new ForbiddenError("Only admins can create faculty");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * 1. Create user
     */

    const user = await userRepository.create(
      {
        name: data.name,

        email: data.email.trim().toLowerCase(),

        role: "faculty",

        active: true,
      },

      {
        session,
      },
    );

    /*
     * 2. Create faculty
     */

    const faculty = await facultyRepository.create(
      {
        name: data.name,

        email: data.email.trim().toLowerCase(),

        departmentId: data.departmentId,

        active: true,
      },

      {
        session,
      },
    );

    /*
     * 3. Commit
     */

    await session.commitTransaction();

    return {
      user,

      faculty,
    };
  } catch (error) {
    /*
     * Rollback everything.
     */

    await session.abortTransaction();

    throw error;
  } finally {
    /*
     * Always close session.
     */

    await session.endSession();
  }
}

/*
 * ============================================================
 * 10. DEPENDENCY INJECTION
 * ============================================================
 *
 * Instead of hard-coding repositories
 * inside services, we can inject them.
 *
 * This makes testing much easier.
 * ============================================================
 */

function createUserService({ userRepository }) {
  return {
    async getUser(userId) {
      const user = await userRepository.findById(
        userId,

        {
          lean: true,
        },
      );

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    },
  };
}

/*
 * ============================================================
 * 11. MOCK REPOSITORY
 * ============================================================
 *
 * Useful for testing.
 * ============================================================
 */

const fakeUserRepository = {
  async findById() {
    return {
      _id: "123",

      name: "Test User",
    };
  },
};

const testUserService = createUserService({
  userRepository: fakeUserRepository,
});

/*
 * ============================================================
 * 12. SERVICE COMPOSITION
 * ============================================================
 *
 * A larger service can depend on
 * multiple services.
 * ============================================================
 */

function createTimetableService({
  timetableRepository,
  facultyRepository,
  subjectRepository,
}) {
  return {
    async validateGenerationData(timetableId) {
      const timetable = await timetableRepository.findById(timetableId, {
        lean: true,
      });

      if (!timetable) {
        throw new NotFoundError("Timetable not found");
      }

      /*
       * Additional repositories
       * can be called here.
       *
       * Example:
       *
       * facultyRepository
       * subjectRepository
       */

      return {
        timetable,
      };
    },
  };
}

/*
 * ============================================================
 * 13. ERROR TRANSLATION
 * ============================================================
 */

function translateDatabaseError(error) {
  /*
   * Duplicate key.
   */

  if (error?.code === 11000) {
    throw new ConflictError("Resource already exists");
  }

  /*
   * Mongoose validation.
   */

  if (error instanceof mongoose.Error.ValidationError) {
    throw new ServiceError(
      "Database validation failed",
      400,
      "VALIDATION_ERROR",
    );
  }

  /*
   * Unknown error.
   */

  throw error;
}

/*
 * ============================================================
 * 14. SAFE SERVICE EXECUTION
 * ============================================================
 */

async function executeService(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    translateDatabaseError(error);
  }
}

/*
 * ============================================================
 * 15. CONTROLLER SIMULATION
 * ============================================================
 */

const userController = {
  async getUser(request) {
    try {
      const user = await executeService(() =>
        userService.getUser(request.params.userId),
      );

      return {
        status: 200,

        data: user,
      };
    } catch (error) {
      return {
        status: error.statusCode ?? 500,

        error: {
          code: error.code ?? "INTERNAL_ERROR",

          message: error.message,
        },
      };
    }
  },
};

/*
 * ============================================================
 * 16. DATABASE CONNECTION
 * ============================================================
 */

async function connectDB() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 17. EXPLANATION
 * ============================================================
 */

function explainServicePattern() {
  console.log(`

  ============================================================
  SERVICE PATTERN
  ============================================================


  CONTROLLER
  ------------------------------------------------------------

  Responsible for:

  - HTTP
  - request
  - response
  - status code
  - params
  - body
  - query


                     ↓


  SERVICE
  ------------------------------------------------------------

  Responsible for:

  - business rules
  - authorization
  - workflows
  - validation
  - state transitions
  - transactions
  - orchestration


                     ↓


  REPOSITORY
  ------------------------------------------------------------

  Responsible for:

  - find
  - findOne
  - create
  - update
  - delete
  - aggregate
  - bulkWrite
  - database queries


                     ↓


  MONGOOSE MODEL
  ------------------------------------------------------------

  Responsible for:

  - schema
  - validation
  - indexes
  - middleware
  - model behavior


                     ↓


  MONGODB
  ------------------------------------------------------------


  `);
}

/*
 * ============================================================
 * 18. MAIN
 * ============================================================
 */

async function main() {
  await connectDB();

  explainServicePattern();

  /*
   * Example:
   */

  /*
  const user =
    await userService.getUser(
      "65f123456789012345678901",
    );

  console.log(user);
  */

  /*
   * Example service call:
   */

  /*
  const timetable =
    await timetableService.createTimetable(

      {
        name:
          "CSE Semester 5",

        departmentId:
          "65f123456789012345678901",
      },

      {
        _id:
          "65f123456789012345678902",

        role:
          "admin",
      },

    );

  console.log(timetable);
  */

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
