/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     16_middleware.js
 *
 * Topic:
 *     Mongoose Middleware
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. What is middleware?
 *     2. pre middleware
 *     3. post middleware
 *     4. Document middleware
 *     5. Query middleware
 *     6. Model middleware
 *     7. Aggregate middleware
 *     8. save middleware
 *     9. validate middleware
 *    10. find middleware
 *    11. findOneAndUpdate middleware
 *    12. delete middleware
 *    13. this
 *    14. Async middleware
 *    15. Middleware order
 *    16. Error middleware
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
 * 2. BASIC SCHEMA
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

  password: {
    type: String,

    required: true,
  },

  active: {
    type: Boolean,

    default: true,
  },

  lastLoginAt: Date,
});

/*
 * ============================================================
 * 3. DOCUMENT PRE MIDDLEWARE
 * ============================================================
 *
 * Runs before a document is saved.
 *
 * Important:
 *
 *     this === document
 *
 * ============================================================
 */

userSchema.pre("save", function (next) {
  console.log("\nPRE SAVE middleware");

  console.log("Document:", this._id);

  next();
});

/*
 * ============================================================
 * 4. DOCUMENT POST MIDDLEWARE
 * ============================================================
 *
 * Runs after save succeeds.
 *
 * ============================================================
 */

userSchema.post("save", function (doc) {
  console.log("\nPOST SAVE middleware");

  console.log("Saved document:", doc._id);
});

/*
 * ============================================================
 * 5. PRE VALIDATE
 * ============================================================
 */

userSchema.pre("validate", function (next) {
  console.log("\nPRE VALIDATE");

  next();
});

/*
 * ============================================================
 * 6. POST VALIDATE
 * ============================================================
 */

userSchema.post("validate", function (doc) {
  console.log("\nPOST VALIDATE");

  console.log("Validated:", doc._id);
});

/*
 * ============================================================
 * 7. MIDDLEWARE ORDER
 * ============================================================
 *
 * For save:
 *
 *     pre validate
 *          ↓
 *     post validate
 *          ↓
 *     pre save
 *          ↓
 *     MongoDB save
 *          ↓
 *     post save
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. PASSWORD NORMALIZATION
 * ============================================================
 *
 * Example use case:
 *
 * Normalize a value before saving.
 *
 * NOTE:
 *
 * This is only an educational example.
 * Real password handling should use a password hashing
 * algorithm such as Argon2id or bcrypt.
 *
 * ============================================================
 */

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }

  next();
});

/*
 * ============================================================
 * 9. ASYNC PRE MIDDLEWARE
 * ============================================================
 *
 * You can use async functions instead of next().
 *
 * ============================================================
 */

userSchema.pre("save", async function () {
  console.log("Async pre-save middleware");

  /*
   * Simulate asynchronous work.
   */

  await Promise.resolve();
});

/*
 * ============================================================
 * 10. QUERY MIDDLEWARE
 * ============================================================
 *
 * Query middleware runs when a query is executed.
 *
 * Example:
 *
 *     User.find(...)
 *
 * ============================================================
 */

userSchema.pre("find", function (next) {
  console.log("\nPRE FIND middleware");

  console.log("Query:", this.getQuery());

  next();
});

/*
 * ============================================================
 * 11. POST FIND
 * ============================================================
 */

userSchema.post("find", function (documents) {
  console.log("\nPOST FIND middleware");

  console.log("Documents found:", documents.length);
});

/*
 * ============================================================
 * 12. FINDONE QUERY MIDDLEWARE
 * ============================================================
 */

userSchema.pre("findOne", function (next) {
  console.log("\nPRE FINDONE");

  console.log("Query:", this.getQuery());

  next();
});

/*
 * ============================================================
 * 13. FINDONEANDUPDATE
 * ============================================================
 */

userSchema.pre("findOneAndUpdate", function (next) {
  console.log("\nPRE FINDONEANDUPDATE");

  console.log("Filter:", this.getQuery());

  console.log("Update:", this.getUpdate());

  next();
});

/*
 * ============================================================
 * 14. POST FINDONEANDUPDATE
 * ============================================================
 */

userSchema.post("findOneAndUpdate", function (doc) {
  console.log("\nPOST FINDONEANDUPDATE");

  if (doc) {
    console.log("Updated:", doc._id);
  }
});

/*
 * ============================================================
 * 15. UPDATEONE
 * ============================================================
 */

userSchema.pre("updateOne", function (next) {
  console.log("\nPRE UPDATEONE");

  console.log("Filter:", this.getQuery());

  console.log("Update:", this.getUpdate());

  next();
});

/*
 * ============================================================
 * 16. DELETEONE
 * ============================================================
 */

userSchema.pre("deleteOne", function (next) {
  console.log("\nPRE DELETEONE");

  console.log("Query:", this.getQuery());

  next();
});

/*
 * ============================================================
 * 17. DOCUMENT DELETEONE
 * ============================================================
 *
 * By default, deleteOne middleware is query middleware.
 *
 * You can explicitly register document middleware:
 *
 *     { document: true, query: false }
 *
 * ============================================================
 */

userSchema.pre(
  "deleteOne",
  {
    document: true,

    query: false,
  },
  function (next) {
    console.log("\nDOCUMENT PRE DELETEONE");

    console.log("Document:", this._id);

    next();
  },
);

/*
 * ============================================================
 * 18. QUERY DELETEONE
 * ============================================================
 *
 * Explicitly register query middleware.
 *
 * ============================================================
 */

userSchema.pre(
  "deleteOne",
  {
    document: false,

    query: true,
  },
  function (next) {
    console.log("\nQUERY PRE DELETEONE");

    console.log("Query:", this.getQuery());

    next();
  },
);

/*
 * ============================================================
 * 19. COUNT DOCUMENTS
 * ============================================================
 */

userSchema.pre("countDocuments", function (next) {
  console.log("\nPRE COUNT DOCUMENTS");

  console.log("Query:", this.getQuery());

  next();
});

/*
 * ============================================================
 * 20. AGGREGATE MIDDLEWARE
 * ============================================================
 */

userSchema.pre("aggregate", function (next) {
  console.log("\nPRE AGGREGATE");

  console.log("Pipeline:", this.pipeline());

  next();
});

/*
 * ============================================================
 * 21. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseMiddlewareUser ||
  mongoose.model("MongooseMiddlewareUser", userSchema);

/*
 * ============================================================
 * 22. CREATE USER
 * ============================================================
 */

async function createUser() {
  const user = new User({
    name: "Shiva",

    email: "SHIVA@example.com",

    password: "example-password",
  });

  await user.save();

  return user;
}

/*
 * ============================================================
 * 23. FIND USERS
 * ============================================================
 */

async function findUsers() {
  return User.find({
    active: true,
  }).exec();
}

/*
 * ============================================================
 * 24. FIND ONE
 * ============================================================
 */

async function findUser(email) {
  return User.findOne({
    email,
  }).exec();
}

/*
 * ============================================================
 * 25. UPDATE USER
 * ============================================================
 */

async function updateUser(userId) {
  return User.findOneAndUpdate(
    {
      _id: userId,
    },

    {
      $set: {
        active: false,
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
 * 26. COUNT
 * ============================================================
 */

async function countUsers() {
  return User.countDocuments({
    active: true,
  }).exec();
}

/*
 * ============================================================
 * 27. AGGREGATION
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
 * 28. IMPORTANT: this
 * ============================================================
 *
 * Document middleware:
 *
 *     this === document
 *
 *
 * Query middleware:
 *
 *     this === query
 *
 *
 * Aggregate middleware:
 *
 *     this === aggregate object
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. DOCUMENT MIDDLEWARE EXAMPLE
 * ============================================================
 */

userSchema.pre("save", function () {
  console.log("Document email:", this.email);
});

/*
 * ============================================================
 * 30. QUERY MIDDLEWARE EXAMPLE
 * ============================================================
 */

userSchema.pre("find", function () {
  console.log("Query conditions:", this.getQuery());
});

/*
 * ============================================================
 * 31. QUERY FILTER MODIFICATION
 * ============================================================
 *
 * Example:
 *
 * Automatically exclude inactive users.
 *
 * ============================================================
 */

const filteredUserSchema = new mongoose.Schema({
  name: String,

  active: {
    type: Boolean,

    default: true,
  },
});

filteredUserSchema.pre("find", function () {
  this.where({
    active: true,
  });
});

filteredUserSchema.pre("findOne", function () {
  this.where({
    active: true,
  });
});

const ActiveUser =
  mongoose.models.MongooseActiveUser ||
  mongoose.model("MongooseActiveUser", filteredUserSchema);

/*
 * ============================================================
 * 32. SOFT DELETE PATTERN
 * ============================================================
 */

const softDeleteSchema = new mongoose.Schema({
  name: String,

  deletedAt: Date,
});

softDeleteSchema.pre("find", function () {
  this.where({
    deletedAt: null,
  });
});

softDeleteSchema.pre("findOne", function () {
  this.where({
    deletedAt: null,
  });
});

const SoftDeleteUser =
  mongoose.models.MongooseSoftDeleteUser ||
  mongoose.model("MongooseSoftDeleteUser", softDeleteSchema);

/*
 * ============================================================
 * 33. UPDATED AT MIDDLEWARE
 * ============================================================
 */

const timestampSchema = new mongoose.Schema({
  name: String,

  updatedAt: Date,
});

timestampSchema.pre("findOneAndUpdate", function () {
  this.set({
    updatedAt: new Date(),
  });
});

const TimestampUser =
  mongoose.models.MongooseTimestampUser ||
  mongoose.model("MongooseTimestampUser", timestampSchema);

/*
 * ============================================================
 * 34. UPDATE VALIDATION
 * ============================================================
 *
 * Query updates do not behave exactly like document saves.
 *
 * Use:
 *
 *     runValidators: true
 *
 * when you want schema validators applied to update
 * operations.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. ERROR HANDLING MIDDLEWARE
 * ============================================================
 *
 * Post middleware can also receive errors.
 *
 * A common example is duplicate key handling.
 *
 * ============================================================
 */

const uniqueSchema = new mongoose.Schema({
  email: {
    type: String,

    unique: true,
  },
});

uniqueSchema.post("save", function (error, doc, next) {
  if (error?.code === 11000) {
    return next(new Error("Email already exists"));
  }

  next(error);
});

const UniqueUser =
  mongoose.models.MongooseMiddlewareUniqueUser ||
  mongoose.model("MongooseMiddlewareUniqueUser", uniqueSchema);

/*
 * ============================================================
 * 36. MULTIPLE PRE MIDDLEWARE
 * ============================================================
 */

const orderSchema = new mongoose.Schema({
  name: String,
});

orderSchema.pre("save", function () {
  console.log("PRE SAVE #1");
});

orderSchema.pre("save", function () {
  console.log("PRE SAVE #2");
});

orderSchema.post("save", function () {
  console.log("POST SAVE #1");
});

orderSchema.post("save", function () {
  console.log("POST SAVE #2");
});

/*
 * ============================================================
 * 37. IMPORTANT: DEFINE MIDDLEWARE BEFORE MODEL
 * ============================================================
 *
 * CORRECT:
 *
 *     schema.pre(...)
 *     schema.post(...)
 *     mongoose.model(...)
 *
 *
 * WRONG:
 *
 *     mongoose.model(...)
 *     schema.pre(...)
 *
 * Middleware registered after model compilation may not be
 * applied to that model.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("\nMongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Create
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
     * Find one
     * --------------------------------------------------------
     */

    const found = await findUser("shiva@example.com");

    console.log("\nFound:", found?._id);

    /*
     * --------------------------------------------------------
     * Update
     * --------------------------------------------------------
     */

    const updated = await updateUser(user._id);

    console.log("\nUpdated:", updated?._id);

    /*
     * --------------------------------------------------------
     * Count
     * --------------------------------------------------------
     */

    const count = await countUsers();

    console.log("\nActive users:", count);

    /*
     * --------------------------------------------------------
     * Aggregate
     * --------------------------------------------------------
     */

    const aggregation = await aggregateUsers();

    console.log("\nAggregation:", aggregation);
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
