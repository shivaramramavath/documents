/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     17_hooks.js
 *
 * Topic:
 *     Mongoose Hooks & Lifecycle
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Hook lifecycle
 *     2. validate hooks
 *     3. save hooks
 *     4. query hooks
 *     5. update hooks
 *     6. delete hooks
 *     7. aggregate hooks
 *     8. hook execution order
 *     9. this in hooks
 *    10. async hooks
 *    11. next()
 *    12. hook errors
 *    13. error-handling hooks
 *    14. document vs query hooks
 *    15. init hooks
 *    16. practical hook design
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
 * 2. SCHEMA
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

    trim: true,

    lowercase: true,
  },

  age: {
    type: Number,

    min: 0,
  },

  active: {
    type: Boolean,

    default: true,
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },

  updatedAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 3. VALIDATE PRE HOOK
 * ============================================================
 */

userSchema.pre("validate", function (next) {
  console.log("1. pre validate");

  next();
});

/*
 * ============================================================
 * 4. VALIDATE POST HOOK
 * ============================================================
 */

userSchema.post("validate", function (doc) {
  console.log("2. post validate");
});

/*
 * ============================================================
 * 5. SAVE PRE HOOK
 * ============================================================
 */

userSchema.pre("save", function (next) {
  console.log("3. pre save");

  next();
});

/*
 * ============================================================
 * 6. SAVE POST HOOK
 * ============================================================
 */

userSchema.post("save", function (doc) {
  console.log("4. post save");

  console.log("Saved document:", doc._id);
});

/*
 * ============================================================
 * 7. ASYNC PRE HOOK
 * ============================================================
 *
 * If the function is async, Mongoose waits for it.
 *
 * No next() is required.
 *
 * ============================================================
 */

userSchema.pre("save", async function () {
  console.log("Async pre-save started");

  await Promise.resolve();

  console.log("Async pre-save finished");
});

/*
 * ============================================================
 * 8. NORMALIZE EMAIL
 * ============================================================
 */

userSchema.pre("save", function () {
  if (this.isModified("email")) {
    this.email = this.email.trim().toLowerCase();
  }
});

/*
 * ============================================================
 * 9. UPDATED AT
 * ============================================================
 */

userSchema.pre("save", function () {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
});

/*
 * ============================================================
 * 10. QUERY PRE HOOK
 * ============================================================
 */

userSchema.pre("find", function (next) {
  console.log("\npre find");

  console.log("Conditions:", this.getQuery());

  next();
});

/*
 * ============================================================
 * 11. QUERY POST HOOK
 * ============================================================
 */

userSchema.post("find", function (documents) {
  console.log("\npost find");

  console.log("Found:", documents.length);
});

/*
 * ============================================================
 * 12. FINDONE PRE HOOK
 * ============================================================
 */

userSchema.pre("findOne", function () {
  console.log("pre findOne");
});

/*
 * ============================================================
 * 13. FINDONEANDUPDATE PRE HOOK
 * ============================================================
 */

userSchema.pre("findOneAndUpdate", function () {
  console.log("\npre findOneAndUpdate");

  console.log("Filter:", this.getQuery());

  console.log("Update:", this.getUpdate());
});

/*
 * ============================================================
 * 14. FINDONEANDUPDATE POST HOOK
 * ============================================================
 */

userSchema.post("findOneAndUpdate", function (document) {
  console.log("post findOneAndUpdate");

  if (document) {
    console.log("Updated:", document._id);
  }
});

/*
 * ============================================================
 * 15. UPDATEONE HOOK
 * ============================================================
 */

userSchema.pre("updateOne", function () {
  console.log("\npre updateOne");

  console.log("Query:", this.getQuery());

  console.log("Update:", this.getUpdate());
});

/*
 * ============================================================
 * 16. UPDATEMANY HOOK
 * ============================================================
 */

userSchema.pre("updateMany", function () {
  console.log("\npre updateMany");

  console.log("Query:", this.getQuery());

  console.log("Update:", this.getUpdate());
});

/*
 * ============================================================
 * 17. DELETE QUERY HOOK
 * ============================================================
 */

userSchema.pre(
  "deleteOne",
  {
    query: true,

    document: false,
  },
  function () {
    console.log("\npre query deleteOne");

    console.log("Query:", this.getQuery());
  },
);

/*
 * ============================================================
 * 18. DELETE DOCUMENT HOOK
 * ============================================================
 */

userSchema.pre(
  "deleteOne",
  {
    query: false,

    document: true,
  },
  function () {
    console.log("\npre document deleteOne");

    console.log("Document:", this._id);
  },
);

/*
 * ============================================================
 * 19. AGGREGATE PRE HOOK
 * ============================================================
 */

userSchema.pre("aggregate", function () {
  console.log("\npre aggregate");

  console.log("Pipeline:", this.pipeline());
});

/*
 * ============================================================
 * 20. AGGREGATE POST HOOK
 * ============================================================
 */

userSchema.post("aggregate", function (result) {
  console.log("\npost aggregate");

  console.log("Aggregation results:", result.length);
});

/*
 * ============================================================
 * 21. INIT HOOK
 * ============================================================
 *
 * init is a special document lifecycle hook.
 *
 * It runs when Mongoose initializes a document from MongoDB.
 *
 * init hooks are synchronous.
 *
 * ============================================================
 */

userSchema.post("init", function (doc) {
  console.log("\npost init");

  console.log("Hydrated document:", doc._id);
});

/*
 * ============================================================
 * 22. ERROR IN PRE HOOK
 * ============================================================
 */

const guardedSchema = new mongoose.Schema({
  name: String,
});

guardedSchema.pre("save", function () {
  if (this.name === "forbidden") {
    throw new Error("This name is not allowed");
  }
});

/*
 * ============================================================
 * 23. ERROR USING next()
 * ============================================================
 */

guardedSchema.pre("save", function (next) {
  if (this.name === "invalid") {
    return next(new Error("Invalid user"));
  }

  next();
});

/*
 * ============================================================
 * 24. ASYNC HOOK ERROR
 * ============================================================
 */

guardedSchema.pre("save", async function () {
  if (this.name === "blocked") {
    throw new Error("User is blocked");
  }
});

/*
 * ============================================================
 * 25. ERROR HANDLING POST HOOK
 * ============================================================
 */

const uniqueSchema = new mongoose.Schema({
  email: {
    type: String,

    unique: true,
  },
});

uniqueSchema.post("save", function (error, document, next) {
  if (error?.code === 11000) {
    return next(new Error("Email already exists"));
  }

  next(error);
});

/*
 * ============================================================
 * 26. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseHookUser ||
  mongoose.model("MongooseHookUser", userSchema);

const GuardedUser =
  mongoose.models.MongooseGuardedUser ||
  mongoose.model("MongooseGuardedUser", guardedSchema);

const UniqueUser =
  mongoose.models.MongooseHookUniqueUser ||
  mongoose.model("MongooseHookUniqueUser", uniqueSchema);

/*
 * ============================================================
 * 27. CREATE
 * ============================================================
 */

async function createUser() {
  const user = new User({
    name: "Shiva",

    email: "shiva@example.com",

    age: 21,
  });

  return user.save();
}

/*
 * ============================================================
 * 28. FIND
 * ============================================================
 */

async function findUsers() {
  return User.find({
    active: true,
  }).exec();
}

/*
 * ============================================================
 * 29. UPDATE
 * ============================================================
 */

async function updateUser(id) {
  return User.findOneAndUpdate(
    {
      _id: id,
    },

    {
      $set: {
        age: 22,
      },
    },

    {
      new: true,

      runValidators: true,
    },
  ).exec();
}

/*
 * ============================================================
 * 30. AGGREGATION
 * ============================================================
 */

async function aggregateUsers() {
  return User.aggregate([
    {
      $match: {
        active: true,
      },
    },

    {
      $group: {
        _id: null,

        count: {
          $sum: 1,
        },
      },
    },
  ]).exec();
}

/*
 * ============================================================
 * 31. DOCUMENT DELETE
 * ============================================================
 */

async function deleteUserDocument(id) {
  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  return user.deleteOne();
}

/*
 * ============================================================
 * 32. QUERY DELETE
 * ============================================================
 */

async function deleteUserQuery(id) {
  return User.deleteOne({
    _id: id,
  }).exec();
}

/*
 * ============================================================
 * 33. HOOK EXECUTION DEMO
 * ============================================================
 */

async function lifecycleDemo() {
  console.log("\n==============================");

  console.log("DOCUMENT LIFECYCLE");

  console.log("==============================");

  const user = new User({
    name: "Lifecycle User",

    email: "lifecycle@example.com",
  });

  await user.save();
}

/*
 * ============================================================
 * 34. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("\nMongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Lifecycle
     * --------------------------------------------------------
     */

    const user = await createUser();

    console.log("\nCreated:", user._id);

    /*
     * --------------------------------------------------------
     * Find
     * --------------------------------------------------------
     */

    const users = await findUsers();

    console.log("\nUsers:", users.length);

    /*
     * --------------------------------------------------------
     * Update
     * --------------------------------------------------------
     */

    const updated = await updateUser(user._id);

    console.log("\nUpdated:", updated?._id);

    /*
     * --------------------------------------------------------
     * Aggregation
     * --------------------------------------------------------
     */

    const aggregation = await aggregateUsers();

    console.log("\nAggregation:", aggregation);

    /*
     * --------------------------------------------------------
     * Lifecycle demo
     * --------------------------------------------------------
     */

    await lifecycleDemo();
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
