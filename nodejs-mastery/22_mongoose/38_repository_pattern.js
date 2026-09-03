/**
 * ============================================================
 * 38_repository_pattern.js
 * ============================================================
 *
 * Mongoose Repository Pattern
 *
 * ============================================================
 *
 * Architecture:
 *
 * Controller
 *     ↓
 * Service
 *     ↓
 * Repository
 *     ↓
 * Mongoose Model
 *     ↓
 * MongoDB
 *
 * ============================================================
 *
 * Topics:
 *
 *  1. Model
 *  2. Repository
 *  3. CRUD repository methods
 *  4. Filters
 *  5. Projection
 *  6. Sorting
 *  7. Pagination
 *  8. Lean
 *  9. Updates
 * 10. Deletes
 * 11. Exists
 * 12. Counts
 * 13. Transactions
 * 14. Service layer
 * 15. Repository responsibilities
 * 16. Service responsibilities
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

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "RepositoryDepartment",
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

const User =
  mongoose.models.RepositoryUser ||
  mongoose.model("RepositoryUser", userSchema);

/*
 * ============================================================
 * 3. REPOSITORY
 * ============================================================
 *
 * Repository is responsible for
 * database operations.
 *
 * It knows:
 *
 * - Mongoose
 * - Models
 * - MongoDB filters
 * - projections
 * - sorting
 * - pagination
 * - database updates
 *
 * It should NOT contain business
 * decisions such as:
 *
 * "Can this faculty modify this timetable?"
 *
 * ============================================================
 */

export const userRepository = {
  /*
   * ==========================================================
   * CREATE
   * ==========================================================
   */

  async create(data) {
    return User.create(data);
  },

  /*
   * ==========================================================
   * FIND BY ID
   * ==========================================================
   */

  async findById(userId, options = {}) {
    let query = User.findById(userId);

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  /*
   * ==========================================================
   * FIND ONE
   * ==========================================================
   */

  async findOne(filter, options = {}) {
    let query = User.findOne(filter);

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  /*
   * ==========================================================
   * FIND MANY
   * ==========================================================
   */

  async findMany(filter = {}, options = {}) {
    let query = User.find(filter);

    /*
     * Projection
     */

    if (options.select) {
      query = query.select(options.select);
    }

    /*
     * Sorting
     */

    if (options.sort) {
      query = query.sort(options.sort);
    }

    /*
     * Skip
     */

    if (options.skip !== undefined) {
      query = query.skip(options.skip);
    }

    /*
     * Limit
     */

    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }

    /*
     * Populate
     */

    if (options.populate) {
      query = query.populate(options.populate);
    }

    /*
     * Lean
     */

    if (options.lean) {
      query = query.lean();
    }

    return query;
  },

  /*
   * ==========================================================
   * FIND PAGINATED
   * ==========================================================
   */

  async findPaginated(filter = {}, options = {}) {
    const page = Math.max(1, options.page ?? 1);

    const limit = Math.min(100, Math.max(1, options.limit ?? 20));

    const skip = (page - 1) * limit;

    const query = User.find(filter)
      .sort(
        options.sort ?? {
          createdAt: -1,
        },
      )
      .skip(skip)
      .limit(limit)
      .lean();

    const [items, total] = await Promise.all([
      query,

      User.countDocuments(filter),
    ]);

    return {
      items,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      hasNextPage: page < Math.ceil(total / limit),

      hasPreviousPage: page > 1,
    };
  },

  /*
   * ==========================================================
   * UPDATE BY ID
   * ==========================================================
   */

  async updateById(userId, update, options = {}) {
    return User.findByIdAndUpdate(
      userId,

      update,

      {
        new: true,

        runValidators: true,

        ...options,
      },
    );
  },

  /*
   * ==========================================================
   * DELETE BY ID
   * ==========================================================
   */

  async deleteById(userId) {
    return User.findByIdAndDelete(userId);
  },

  /*
   * ==========================================================
   * EXISTS
   * ==========================================================
   */

  async exists(filter) {
    return User.exists(filter);
  },

  /*
   * ==========================================================
   * COUNT
   * ==========================================================
   */

  async count(filter = {}) {
    return User.countDocuments(filter);
  },

  /*
   * ==========================================================
   * DISTINCT
   * ==========================================================
   */

  async distinct(field, filter = {}) {
    return User.distinct(field, filter);
  },

  /*
   * ==========================================================
   * BULK WRITE
   * ==========================================================
   */

  async bulkWrite(operations, options = {}) {
    return User.bulkWrite(operations, options);
  },

  /*
   * ==========================================================
   * UPDATE MANY
   * ==========================================================
   */

  async updateMany(filter, update, options = {}) {
    return User.updateMany(
      filter,

      update,

      {
        runValidators: true,

        ...options,
      },
    );
  },

  /*
   * ==========================================================
   * DELETE MANY
   * ==========================================================
   */

  async deleteMany(filter) {
    return User.deleteMany(filter);
  },
};

/*
 * ============================================================
 * 4. SERVICE LAYER
 * ============================================================
 *
 * Service owns business logic.
 *
 * Repository:
 *
 *     "How do I access MongoDB?"
 *
 *
 * Service:
 *
 *     "What should my application do?"
 *
 * ============================================================
 */

export const userService = {
  /*
   * ==========================================================
   * CREATE USER
   * ==========================================================
   */

  async createUser(data) {
    /*
     * Business validation
     */

    if (!data.name || !data.email) {
      throw new Error("Name and email are required");
    }

    /*
     * Normalize
     */

    const email = data.email.trim().toLowerCase();

    /*
     * Business rule:
     *
     * Email must be unique.
     */

    const existing = await userRepository.exists({
      email,
    });

    if (existing) {
      throw new Error("User already exists");
    }

    /*
     * Repository performs
     * actual database insertion.
     */

    return userRepository.create({
      name: data.name.trim(),

      email,

      role: data.role ?? "student",

      departmentId: data.departmentId,
    });
  },

  /*
   * ==========================================================
   * GET USER
   * ==========================================================
   */

  async getUser(userId) {
    const user = await userRepository.findById(
      userId,

      {
        lean: true,

        select: "name email role departmentId active",
      },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  /*
   * ==========================================================
   * LIST USERS
   * ==========================================================
   */

  async listUsers(filters = {}) {
    const filter = {};

    /*
     * Business-level filter
     */

    if (filters.role) {
      filter.role = filters.role;
    }

    if (filters.departmentId) {
      filter.departmentId = filters.departmentId;
    }

    if (filters.active !== undefined) {
      filter.active = filters.active;
    }

    return userRepository.findPaginated(
      filter,

      {
        page: filters.page,

        limit: filters.limit,

        sort: filters.sort,
      },
    );
  },

  /*
   * ==========================================================
   * UPDATE USER
   * ==========================================================
   */

  async updateUser(userId, data) {
    /*
     * Only fields allowed by
     * this business operation.
     */

    const update = {
      $set: {},
    };

    if (data.name !== undefined) {
      update.$set.name = data.name.trim();
    }

    if (data.email !== undefined) {
      update.$set.email = data.email.trim().toLowerCase();
    }

    /*
     * Do not accept role here
     * unless this operation is
     * specifically authorized
     * to change roles.
     */

    return userRepository.updateById(
      userId,

      update,
    );
  },

  /*
   * ==========================================================
   * DELETE USER
   * ==========================================================
   */

  async deleteUser(userId, currentUser) {
    /*
     * Business authorization.
     */

    if (currentUser.role !== "admin") {
      throw new Error("Only admins can delete users");
    }

    return userRepository.deleteById(userId);
  },
};

/*
 * ============================================================
 * 5. CONTROLLER SIMULATION
 * ============================================================
 *
 * In a real application:
 *
 * HTTP Request
 *     ↓
 * Controller
 *     ↓
 * Service
 *     ↓
 * Repository
 *
 * ============================================================
 */

export const userController = {
  async getUser(request) {
    const user = await userService.getUser(request.params.userId);

    return {
      status: 200,

      data: user,
    };
  },

  async createUser(request) {
    const user = await userService.createUser(request.body);

    return {
      status: 201,

      data: user,
    };
  },

  async listUsers(request) {
    const result = await userService.listUsers(request.query);

    return {
      status: 200,

      data: result,
    };
  },
};

/*
 * ============================================================
 * 6. REPOSITORY WITH TRANSACTION
 * ============================================================
 */

async function transactionExample() {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * Repository operation 1
     */

    await User.create(
      [
        {
          name: "User One",

          email: "one@example.com",
        },
      ],

      {
        session,
      },
    );

    /*
     * Repository operation 2
     */

    await User.updateOne(
      {
        email: "one@example.com",
      },

      {
        $set: {
          active: true,
        },
      },

      {
        session,
      },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 7. REPOSITORY + SESSION
 * ============================================================
 *
 * A production repository should
 * be able to accept a session when
 * the service is executing a
 * transaction.
 *
 * Example:
 *
 * repository.create(data, {
 *   session
 * })
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. DATABASE CONNECTION
 * ============================================================
 */

async function connectDB() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 9. DEMONSTRATION
 * ============================================================
 */

async function demonstrateRepository() {
  /*
   * Repository directly
   */

  const user = await userRepository.findOne(
    {
      email: "shiva@example.com",
    },

    {
      lean: true,
    },
  );

  console.log("Repository result:", user);

  /*
   * Service
   */

  /*
   * const result =
   *   await userService.listUsers({
   *
   *     role: "student",
   *
   *     active: true,
   *
   *     page: 1,
   *
   *     limit: 20,
   *
   *   });
   *
   *
   * console.log(result);
   */

  /*
   * Controller
   */

  /*
   * const response =
   *   await userController.listUsers({
   *
   *     query: {
   *
   *       role: "student",
   *
   *       page: 1,
   *
   *       limit: 20,
   *
   *     },
   *
   *   });
   *
   *
   * console.log(response);
   */
}

/*
 * ============================================================
 * 10. ARCHITECTURE EXPLANATION
 * ============================================================
 */

function explainArchitecture() {
  console.log(`

  REPOSITORY PATTERN

  HTTP
   │
   ▼
  Controller
   │
   │ request/response
   ▼
  Service
   │
   │ business logic
   ▼
  Repository
   │
   │ database operations
   ▼
  Mongoose Model
   │
   ▼
  MongoDB


  CONTROLLER

  Responsible for:

  ✓ HTTP request
  ✓ HTTP response
  ✓ params
  ✓ query
  ✓ body
  ✓ status codes


  SERVICE

  Responsible for:

  ✓ business rules
  ✓ authorization decisions
  ✓ workflows
  ✓ orchestration
  ✓ transactions


  REPOSITORY

  Responsible for:

  ✓ MongoDB queries
  ✓ CRUD
  ✓ filtering
  ✓ sorting
  ✓ pagination
  ✓ projections
  ✓ bulk operations
  ✓ database-specific operations


  MODEL

  Responsible for:

  ✓ schema
  ✓ validation
  ✓ indexes
  ✓ middleware
  ✓ Mongoose behavior


  `);
}

/*
 * ============================================================
 * 11. MAIN
 * ============================================================
 */

async function main() {
  await connectDB();

  explainArchitecture();

  // await demonstrateRepository();

  // await transactionExample();

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
