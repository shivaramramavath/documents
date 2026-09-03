/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_static_methods.js
 *
 * Topic:
 *     Mongoose Static Methods
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. What are static methods?
 *     2. schema.statics
 *     3. this inside static methods
 *     4. Static find methods
 *     5. Static create methods
 *     6. Static update methods
 *     7. Static delete methods
 *     8. Static aggregation methods
 *     9. Static existence checks
 *    10. Static pagination
 *    11. Static reusable queries
 *    12. Instance vs static methods
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

const userSchema = new mongoose.Schema({
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

  age: {
    type: Number,

    min: 0,
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
});

/*
 * ============================================================
 * 3. BASIC STATIC METHOD
 * ============================================================
 *
 * schema.statics adds methods to the MODEL.
 *
 * ============================================================
 */

userSchema.statics.findActive = function () {
  return this.find({
    active: true,
  });
};

/*
 * ============================================================
 * 4. FIND INACTIVE USERS
 * ============================================================
 */

userSchema.statics.findInactive = function () {
  return this.find({
    active: false,
  });
};

/*
 * ============================================================
 * 5. FIND BY ROLE
 * ============================================================
 */

userSchema.statics.findByRole = function (role) {
  return this.find({
    role,
  });
};

/*
 * ============================================================
 * 6. FIND BY EMAIL
 * ============================================================
 */

userSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase(),
  });
};

/*
 * ============================================================
 * 7. FIND ACTIVE BY ROLE
 * ============================================================
 */

userSchema.statics.findActiveByRole = function (role) {
  return this.find({
    role,

    active: true,
  });
};

/*
 * ============================================================
 * 8. CHECK EMAIL EXISTS
 * ============================================================
 */

userSchema.statics.emailExists = async function (email) {
  const count = await this.countDocuments({
    email: email.toLowerCase(),
  });

  return count > 0;
};

/*
 * ============================================================
 * 9. CHECK USER EXISTS
 * ============================================================
 */

userSchema.statics.userExists = async function (filter) {
  const user = await this.exists(filter);

  return Boolean(user);
};

/*
 * ============================================================
 * 10. CREATE USER
 * ============================================================
 */

userSchema.statics.createUser = async function (data) {
  const user = await this.create(data);

  return user;
};

/*
 * ============================================================
 * 11. DEACTIVATE USER
 * ============================================================
 */

userSchema.statics.deactivateById = async function (id) {
  return this.findByIdAndUpdate(
    id,

    {
      $set: {
        active: false,
      },
    },

    {
      new: true,
    },
  );
};

/*
 * ============================================================
 * 12. ACTIVATE USER
 * ============================================================
 */

userSchema.statics.activateById = async function (id) {
  return this.findByIdAndUpdate(
    id,

    {
      $set: {
        active: true,
      },
    },

    {
      new: true,
    },
  );
};

/*
 * ============================================================
 * 13. DELETE BY ID
 * ============================================================
 */

userSchema.statics.deleteById = async function (id) {
  return this.findByIdAndDelete(id);
};

/*
 * ============================================================
 * 14. COUNT ACTIVE USERS
 * ============================================================
 */

userSchema.statics.countActive = function () {
  return this.countDocuments({
    active: true,
  });
};

/*
 * ============================================================
 * 15. COUNT BY ROLE
 * ============================================================
 */

userSchema.statics.countByRole = function (role) {
  return this.countDocuments({
    role,
  });
};

/*
 * ============================================================
 * 16. SEARCH USERS
 * ============================================================
 */

userSchema.statics.search = function (searchTerm) {
  return this.find({
    $or: [
      {
        name: {
          $regex: searchTerm,

          $options: "i",
        },
      },

      {
        email: {
          $regex: searchTerm,

          $options: "i",
        },
      },
    ],
  });
};

/*
 * ============================================================
 * 17. PAGINATED USERS
 * ============================================================
 */

userSchema.statics.paginateUsers = async function ({
  page = 1,
  limit = 10,
} = {}) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    this.find({
      active: true,
    })
      .sort({
        name: 1,
      })
      .skip(skip)
      .limit(limit)
      .exec(),

    this.countDocuments({
      active: true,
    }),
  ]);

  return {
    users,

    total,

    page,

    limit,

    totalPages: Math.ceil(total / limit),
  };
};

/*
 * ============================================================
 * 18. SORTED ACTIVE USERS
 * ============================================================
 */

userSchema.statics.findActiveSorted = function (
  sort = {
    name: 1,
  },
) {
  return this.find({
    active: true,
  }).sort(sort);
};

/*
 * ============================================================
 * 19. USERS OLDER THAN
 * ============================================================
 */

userSchema.statics.findOlderThan = function (age) {
  return this.find({
    age: {
      $gt: age,
    },
  });
};

/*
 * ============================================================
 * 20. USERS BETWEEN AGES
 * ============================================================
 */

userSchema.statics.findBetweenAges = function (minAge, maxAge) {
  return this.find({
    age: {
      $gte: minAge,

      $lte: maxAge,
    },
  });
};

/*
 * ============================================================
 * 21. ADMIN USERS
 * ============================================================
 */

userSchema.statics.findAdmins = function () {
  return this.find({
    role: "admin",

    active: true,
  });
};

/*
 * ============================================================
 * 22. AGGREGATION STATIC
 * ============================================================
 */

userSchema.statics.getRoleStatistics = async function () {
  return this.aggregate([
    {
      $match: {
        active: true,
      },
    },

    {
      $group: {
        _id: "$role",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },
  ]);
};

/*
 * ============================================================
 * 23. GET COMPLETE STATISTICS
 * ============================================================
 */

userSchema.statics.getStatistics = async function () {
  const [total, active, inactive] = await Promise.all([
    this.countDocuments(),

    this.countDocuments({
      active: true,
    }),

    this.countDocuments({
      active: false,
    }),
  ]);

  return {
    total,

    active,

    inactive,
  };
};

/*
 * ============================================================
 * 24. BULK DEACTIVATE
 * ============================================================
 */

userSchema.statics.deactivateInactiveCandidates = async function () {
  return this.updateMany(
    {
      active: true,

      age: {
        $lt: 13,
      },
    },

    {
      $set: {
        active: false,
      },
    },
  );
};

/*
 * ============================================================
 * 25. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseStaticUser ||
  mongoose.model("MongooseStaticUser", userSchema);

/*
 * ============================================================
 * 26. CREATE SAMPLE USERS
 * ============================================================
 */

async function createSampleUsers() {
  await User.deleteMany({});

  await User.create([
    {
      name: "Shiva",

      email: "shiva@example.com",

      age: 21,

      role: "student",

      active: true,
    },

    {
      name: "Ravi",

      email: "ravi@example.com",

      age: 24,

      role: "faculty",

      active: true,
    },

    {
      name: "Admin",

      email: "admin@example.com",

      age: 35,

      role: "admin",

      active: true,
    },

    {
      name: "Inactive User",

      email: "inactive@example.com",

      age: 28,

      role: "student",

      active: false,
    },
  ]);
}

/*
 * ============================================================
 * 27. STATIC METHOD DEMO
 * ============================================================
 */

async function staticMethodDemo() {
  /*
   * ----------------------------------------------------------
   * Active users
   * ----------------------------------------------------------
   */

  const activeUsers = await User.findActive().exec();

  console.log("\nActive users:", activeUsers.length);

  /*
   * ----------------------------------------------------------
   * Inactive users
   * ----------------------------------------------------------
   */

  const inactiveUsers = await User.findInactive().exec();

  console.log("Inactive users:", inactiveUsers.length);

  /*
   * ----------------------------------------------------------
   * Find by role
   * ----------------------------------------------------------
   */

  const students = await User.findByRole("student").exec();

  console.log("Students:", students.length);

  /*
   * ----------------------------------------------------------
   * Find by email
   * ----------------------------------------------------------
   */

  const user = await User.findByEmail("shiva@example.com").exec();

  console.log("Found by email:", user?.name);

  /*
   * ----------------------------------------------------------
   * Email exists
   * ----------------------------------------------------------
   */

  const exists = await User.emailExists("shiva@example.com");

  console.log("Email exists:", exists);

  /*
   * ----------------------------------------------------------
   * Search
   * ----------------------------------------------------------
   */

  const searchResults = await User.search("shiva").exec();

  console.log("Search results:", searchResults.length);

  /*
   * ----------------------------------------------------------
   * Age query
   * ----------------------------------------------------------
   */

  const olderUsers = await User.findOlderThan(25).exec();

  console.log("Older than 25:", olderUsers.length);

  /*
   * ----------------------------------------------------------
   * Admins
   * ----------------------------------------------------------
   */

  const admins = await User.findAdmins().exec();

  console.log("Admins:", admins.length);

  /*
   * ----------------------------------------------------------
   * Statistics
   * ----------------------------------------------------------
   */

  const statistics = await User.getStatistics();

  console.log("\nStatistics:", statistics);

  /*
   * ----------------------------------------------------------
   * Role statistics
   * ----------------------------------------------------------
   */

  const roleStatistics = await User.getRoleStatistics();

  console.log("\nRole statistics:", roleStatistics);

  /*
   * ----------------------------------------------------------
   * Pagination
   * ----------------------------------------------------------
   */

  const paginated = await User.paginateUsers({
    page: 1,

    limit: 2,
  });

  console.log("\nPagination:", paginated);

  /*
   * ----------------------------------------------------------
   * Sorted
   * ----------------------------------------------------------
   */

  const sorted = await User.findActiveSorted({
    age: -1,
  }).exec();

  console.log(
    "\nSorted:",
    sorted.map((user) => ({
      name: user.name,

      age: user.age,
    })),
  );

  /*
   * ----------------------------------------------------------
   * Deactivate
   * ----------------------------------------------------------
   */

  if (user) {
    const updated = await User.deactivateById(user._id);

    console.log("\nDeactivated:", updated?.name, updated?.active);
  }
}

/*
 * ============================================================
 * 28. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await createSampleUsers();

    await staticMethodDemo();
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
