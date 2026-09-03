/**
 * ============================================================
 * 36_lean.js
 * ============================================================
 *
 * Mongoose lean()
 *
 * Topics:
 *
 *  1. Normal Mongoose query
 *  2. lean()
 *  3. Mongoose Document vs POJO
 *  4. Document methods
 *  5. save()
 *  6. change tracking
 *  7. getters
 *  8. setters
 *  9. virtuals
 * 10. defaults
 * 11. populate() + lean()
 * 12. projection + lean()
 * 13. aggregation
 * 14. performance measurement
 * 15. memory comparison
 * 16. when to use lean()
 * 17. when NOT to use lean()
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
  firstName: {
    type: String,

    required: true,
  },

  lastName: {
    type: String,

    required: true,
  },

  email: {
    type: String,

    required: true,

    index: true,
  },

  age: {
    type: Number,
  },

  status: {
    type: String,

    enum: ["active", "inactive"],

    default: "active",
  },

  salary: {
    type: Number,
  },
});

/*
 * ============================================================
 * 3. INSTANCE METHOD
 * ============================================================
 */

userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

/*
 * ============================================================
 * 4. VIRTUAL
 * ============================================================
 */

userSchema.virtual("displayName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/*
 * ============================================================
 * 5. GETTER
 * ============================================================
 */

userSchema.path("email").get(function (value) {
  if (!value) {
    return value;
  }

  return value.toLowerCase();
});

/*
 * ============================================================
 * 6. MODEL
 * ============================================================
 */

const User = mongoose.models.LeanUser || mongoose.model("LeanUser", userSchema);

/*
 * ============================================================
 * 7. NORMAL QUERY
 * ============================================================
 */

async function normalQuery() {
  const user = await User.findOne({
    email: "user@example.com",
  });

  console.log(user);

  return user;
}

/*
 * ============================================================
 * 8. NORMAL QUERY RETURNS MONGOOSE DOCUMENT
 * ============================================================
 */

async function checkDocument() {
  const user = await User.findOne();

  console.log(user instanceof mongoose.Document);

  console.log(typeof user.save);

  console.log(typeof user.getFullName);
}

/*
 * ============================================================
 * 9. LEAN QUERY
 * ============================================================
 */

async function leanQuery() {
  const user = await User.findOne().lean();

  console.log(user);

  return user;
}

/*
 * ============================================================
 * 10. LEAN RETURNS POJO
 * ============================================================
 */

async function checkLeanObject() {
  const user = await User.findOne().lean();

  console.log(user instanceof mongoose.Document);

  console.log(typeof user.save);

  console.log(typeof user.getFullName);
}

/*
 * ============================================================
 * 11. DOCUMENT VS LEAN
 * ============================================================
 */

async function compareObjects() {
  const document = await User.findOne();

  const plainObject = await User.findOne().lean();

  console.log("Document:", document);

  console.log("Lean:", plainObject);

  console.log(
    "Document instanceof Mongoose Document:",
    document instanceof mongoose.Document,
  );

  console.log(
    "Lean instanceof Mongoose Document:",
    plainObject instanceof mongoose.Document,
  );
}

/*
 * ============================================================
 * 12. DOCUMENT METHODS
 * ============================================================
 */

async function documentMethodExample() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  console.log(user.getFullName());
}

/*
 * ============================================================
 * 13. LEAN DOES NOT HAVE INSTANCE METHODS
 * ============================================================
 */

async function leanMethodExample() {
  const user = await User.findOne().lean();

  if (!user) {
    return;
  }

  /*
   * This would fail:
   *
   * user.getFullName();
   *
   * because user is a plain object.
   */

  console.log({
    fullName: `${user.firstName} ${user.lastName}`,
  });
}

/*
 * ============================================================
 * 14. SAVE() WITH NORMAL DOCUMENT
 * ============================================================
 */

async function saveDocument() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  user.age = (user.age ?? 0) + 1;

  await user.save();
}

/*
 * ============================================================
 * 15. LEAN CANNOT SAVE DIRECTLY
 * ============================================================
 */

async function saveLeanObject() {
  const user = await User.findOne().lean();

  if (!user) {
    return;
  }

  /*
   * There is no:
   *
   * await user.save();
   *
   *
   * Instead use an explicit update:
   */

  await User.updateOne(
    {
      _id: user._id,
    },

    {
      $inc: {
        age: 1,
      },
    },
  );
}

/*
 * ============================================================
 * 16. CHANGE TRACKING
 * ============================================================
 */

async function changeTracking() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  user.age = 30;

  console.log(user.isModified("age"));

  await user.save();
}

/*
 * ============================================================
 * 17. LEAN DOES NOT TRACK CHANGES
 * ============================================================
 */

async function leanChangeTracking() {
  const user = await User.findOne().lean();

  if (!user) {
    return;
  }

  user.age = 30;

  /*
   * There is no:
   *
   * user.isModified()
   *
   *
   * because this is just
   * a JavaScript object.
   */
}

/*
 * ============================================================
 * 18. GETTERS
 * ============================================================
 */

async function normalGetter() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  console.log(user.email);
}

/*
 * ============================================================
 * 19. LEAN GETTERS
 * ============================================================
 *
 * Depending on the Mongoose version,
 * lean options can enable selected
 * Mongoose features.
 *
 * ============================================================
 */

async function leanWithGetters() {
  const user = await User.findOne().lean({
    getters: true,
  });

  console.log(user?.email);
}

/*
 * ============================================================
 * 20. VIRTUALS
 * ============================================================
 */

async function normalVirtual() {
  const user = await User.findOne();

  console.log(user?.displayName);
}

/*
 * ============================================================
 * 21. LEAN VIRTUALS
 * ============================================================
 */

async function leanWithVirtuals() {
  const user = await User.findOne().lean({
    virtuals: true,
  });

  console.log(user?.displayName);
}

/*
 * ============================================================
 * 22. DEFAULTS
 * ============================================================
 */

async function normalDefaults() {
  const user = await User.findOne();

  console.log(user?.status);
}

/*
 * ============================================================
 * 23. LEAN DEFAULTS
 * ============================================================
 */

async function leanWithDefaults() {
  const user = await User.findOne().lean({
    defaults: true,
  });

  console.log(user?.status);
}

/*
 * ============================================================
 * 24. PROJECTION + LEAN
 * ============================================================
 */

async function optimizedQuery() {
  const users = await User.find(
    {
      status: "active",
    },

    {
      firstName: 1,

      lastName: 1,

      email: 1,
    },
  ).lean();

  return users;
}

/*
 * ============================================================
 * 25. LEAN + SORT + LIMIT
 * ============================================================
 */

async function apiQuery() {
  return User.find({
    status: "active",
  })
    .select("firstName lastName email")
    .sort({
      createdAt: -1,
    })
    .limit(20)
    .lean();
}

/*
 * ============================================================
 * 26. POPULATE + LEAN
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: String,
});

const Department =
  mongoose.models.LeanDepartment ||
  mongoose.model("LeanDepartment", departmentSchema);

userSchema.add({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "LeanDepartment",
  },
});

/*
 * ============================================================
 * 27. LEAN + POPULATE
 * ============================================================
 */

async function leanPopulate() {
  const users = await User.find({
    status: "active",
  })
    .populate({
      path: "departmentId",

      select: "name",
    })
    .lean();

  return users;
}

/*
 * ============================================================
 * 28. POPULATE WITH LEAN
 * ============================================================
 *
 * The populated documents are also
 * generally returned as plain objects
 * when using lean().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. AGGREGATION
 * ============================================================
 */

async function aggregationExample() {
  const result = await User.aggregate([
    {
      $match: {
        status: "active",
      },
    },

    {
      $project: {
        firstName: 1,

        email: 1,
      },
    },

    {
      $limit: 20,
    },
  ]);

  return result;
}

/*
 * ============================================================
 * 30. AGGREGATION AND LEAN
 * ============================================================
 *
 * Aggregation results are already
 * plain JavaScript objects rather
 * than normal hydrated Mongoose
 * documents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. MEASURE NORMAL QUERY
 * ============================================================
 */

async function measureNormalQuery() {
  const start = process.hrtime.bigint();

  const users = await User.find({
    status: "active",
  }).limit(1000);

  const end = process.hrtime.bigint();

  const duration = Number(end - start) / 1_000_000;

  console.log(`Normal query: ${duration.toFixed(2)} ms`);

  return users;
}

/*
 * ============================================================
 * 32. MEASURE LEAN QUERY
 * ============================================================
 */

async function measureLeanQuery() {
  const start = process.hrtime.bigint();

  const users = await User.find({
    status: "active",
  })
    .limit(1000)
    .lean();

  const end = process.hrtime.bigint();

  const duration = Number(end - start) / 1_000_000;

  console.log(`Lean query: ${duration.toFixed(2)} ms`);

  return users;
}

/*
 * ============================================================
 * 33. MEMORY CONCEPT
 * ============================================================
 *
 * Hydrated document:
 *
 * MongoDB result
 *      ↓
 * Mongoose hydration
 *      ↓
 * Document instance
 *      ↓
 * methods
 * getters
 * setters
 * change tracking
 * internal state
 *
 *
 * Lean:
 *
 * MongoDB result
 *      ↓
 * plain JavaScript object
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. API READ PATTERN
 * ============================================================
 */

async function getUsersForAPI() {
  return User.find({
    status: "active",
  })
    .select({
      firstName: 1,

      lastName: 1,

      email: 1,

      departmentId: 1,
    })
    .limit(50)
    .lean();
}

/*
 * ============================================================
 * 35. BUSINESS LOGIC PATTERN
 * ============================================================
 *
 * If you need:
 *
 * - document methods
 * - change tracking
 * - save()
 * - validation on save
 * - middleware behavior associated
 *   with document operations
 *
 * normal Mongoose documents may
 * be more appropriate.
 *
 * ============================================================
 */

async function businessLogicExample() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  user.age = 25;

  console.log(user.isModified("age"));

  await user.save();
}

/*
 * ============================================================
 * 36. READ-ONLY SERVICE
 * ============================================================
 */

async function readOnlyService() {
  const users = await User.find({
    department: "CSE",
  })
    .select("firstName lastName email")
    .lean();

  /*
   * Treat result as read-only.
   */

  return users;
}

/*
 * ============================================================
 * 37. DON'T MUTATE AND EXPECT DB UPDATE
 * ============================================================
 */

async function mutationWarning() {
  const user = await User.findOne().lean();

  if (!user) {
    return;
  }

  user.age = 100;

  /*
   * Database is NOT updated.
   *
   * user is only a plain object.
   */

  console.log("Changed local object only");
}

/*
 * ============================================================
 * 38. EXPLAIN LEAN
 * ============================================================
 */

function explainLean() {
  console.log(`

  MONGOOSE DOCUMENT

  MongoDB
      ↓
  MongoDB Driver
      ↓
  Mongoose Hydration
      ↓
  Mongoose Document
      ↓
  Methods
  Getters
  Setters
  Virtuals
  Change Tracking
  save()


  LEAN

  MongoDB
      ↓
  MongoDB Driver
      ↓
  Plain JavaScript Object


  LEAN IS BEST FOR

  ✓ Read-only APIs
  ✓ Lists
  ✓ Search results
  ✓ Dashboards
  ✓ Reports
  ✓ High-volume reads
  ✓ Data transformation


  NORMAL DOCUMENT IS USEFUL FOR

  ✓ save()
  ✓ document methods
  ✓ change tracking
  ✓ document-oriented business logic
  ✓ operations requiring hydrated documents

  `);
}

/*
 * ============================================================
 * 39. CONNECTION
 * ============================================================
 */

async function connectDB() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 40. MAIN
 * ============================================================
 */

async function main() {
  await connectDB();

  explainLean();

  /*
   * Uncomment examples.
   */

  // await normalQuery();

  // await checkDocument();

  // await leanQuery();

  // await checkLeanObject();

  // await compareObjects();

  // await documentMethodExample();

  // await leanMethodExample();

  // await saveDocument();

  // await saveLeanObject();

  // await changeTracking();

  // await leanChangeTracking();

  // await normalGetter();

  // await leanWithGetters();

  // await normalVirtual();

  // await leanWithVirtuals();

  // await normalDefaults();

  // await leanWithDefaults();

  // await optimizedQuery();

  // await apiQuery();

  // await leanPopulate();

  // await aggregationExample();

  // await measureNormalQuery();

  // await measureLeanQuery();

  // await getUsersForAPI();

  // await businessLogicExample();

  // await readOnlyService();

  // await mutationWarning();

  await mongoose.disconnect();
}

await main();
