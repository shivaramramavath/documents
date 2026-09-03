/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_instance_methods.js
 *
 * Topic:
 *     Mongoose Instance Methods
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. What is an instance method?
 *     2. schema.methods
 *     3. this inside instance methods
 *     4. Creating custom methods
 *     5. Reading document data
 *     6. Modifying document data
 *     7. Saving from instance methods
 *     8. Returning values
 *     9. Async instance methods
 *    10. Multiple instance methods
 *    11. Method composition
 *    12. TypeScript typing
 *    13. Timetable example
 *    14. Good vs bad usage
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

  active: {
    type: Boolean,

    default: true,
  },
});

/*
 * ============================================================
 * 3. BASIC INSTANCE METHOD
 * ============================================================
 *
 * schema.methods adds methods to document instances.
 *
 * ============================================================
 */

userSchema.methods.getDisplayName = function () {
  return this.name;
};

/*
 * ============================================================
 * 4. INSTANCE METHOD WITH MULTIPLE FIELDS
 * ============================================================
 */

userSchema.methods.getProfile = function () {
  return {
    id: this._id,

    name: this.name,

    email: this.email,

    age: this.age,

    active: this.active,
  };
};

/*
 * ============================================================
 * 5. BOOLEAN INSTANCE METHOD
 * ============================================================
 */

userSchema.methods.isActive = function () {
  return this.active === true;
};

/*
 * ============================================================
 * 6. INSTANCE METHOD USING DOCUMENT STATE
 * ============================================================
 */

userSchema.methods.isAdult = function () {
  return typeof this.age === "number" && this.age >= 18;
};

/*
 * ============================================================
 * 7. METHOD THAT MODIFIES DOCUMENT
 * ============================================================
 */

userSchema.methods.deactivate = function () {
  this.active = false;

  return this;
};

/*
 * ============================================================
 * 8. METHOD THAT ACTIVATES DOCUMENT
 * ============================================================
 */

userSchema.methods.activate = function () {
  this.active = true;

  return this;
};

/*
 * ============================================================
 * 9. METHOD THAT SAVES DOCUMENT
 * ============================================================
 */

userSchema.methods.deactivateAndSave = async function () {
  this.active = false;

  await this.save();

  return this;
};

/*
 * ============================================================
 * 10. ASYNC INSTANCE METHOD
 * ============================================================
 */

userSchema.methods.refresh = async function () {
  const document = await this.constructor.findById(this._id).exec();

  return document;
};

/*
 * ============================================================
 * 11. INSTANCE METHOD USING MODEL
 * ============================================================
 *
 * this.constructor refers to the model associated with
 * the document.
 *
 * ============================================================
 */

userSchema.methods.findOtherUsers = async function () {
  return this.constructor
    .find({
      _id: {
        $ne: this._id,
      },
    })
    .exec();
};

/*
 * ============================================================
 * 12. INSTANCE METHOD WITH ARGUMENT
 * ============================================================
 */

userSchema.methods.isOlderThan = function (age) {
  return typeof this.age === "number" && this.age > age;
};

/*
 * ============================================================
 * 13. METHOD COMPOSITION
 * ============================================================
 *
 * Instance methods can call other instance methods.
 *
 * ============================================================
 */

userSchema.methods.getStatus = function () {
  if (!this.isActive()) {
    return "inactive";
  }

  if (!this.isAdult()) {
    return "minor";
  }

  return "active-adult";
};

/*
 * ============================================================
 * 14. METHOD FOR SAFE PROFILE DATA
 * ============================================================
 */

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,

    name: this.name,

    email: this.email,
  };
};

/*
 * ============================================================
 * 15. USER MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseInstanceMethodUser ||
  mongoose.model("MongooseInstanceMethodUser", userSchema);

/*
 * ============================================================
 * 16. CREATE USER
 * ============================================================
 */

async function createUser() {
  const user = new User({
    name: "Shiva",

    email: `shiva-${Date.now()}@example.com`,

    age: 21,
  });

  await user.save();

  return user;
}

/*
 * ============================================================
 * 17. INSTANCE METHOD DEMO
 * ============================================================
 */

async function instanceMethodDemo() {
  const user = await createUser();

  /*
   * ----------------------------------------------------------
   * Display name
   * ----------------------------------------------------------
   */

  console.log("\nDisplay name:", user.getDisplayName());

  /*
   * ----------------------------------------------------------
   * Profile
   * ----------------------------------------------------------
   */

  console.log("\nProfile:", user.getProfile());

  /*
   * ----------------------------------------------------------
   * Active?
   * ----------------------------------------------------------
   */

  console.log("\nIs active:", user.isActive());

  /*
   * ----------------------------------------------------------
   * Adult?
   * ----------------------------------------------------------
   */

  console.log("Is adult:", user.isAdult());

  /*
   * ----------------------------------------------------------
   * Older than
   * ----------------------------------------------------------
   */

  console.log("Older than 18:", user.isOlderThan(18));

  /*
   * ----------------------------------------------------------
   * Status
   * ----------------------------------------------------------
   */

  console.log("Status:", user.getStatus());

  /*
   * ----------------------------------------------------------
   * Public JSON
   * ----------------------------------------------------------
   */

  console.log("\nPublic JSON:", user.toPublicJSON());

  /*
   * ----------------------------------------------------------
   * Deactivate
   * ----------------------------------------------------------
   */

  user.deactivate();

  console.log("\nAfter deactivate:", user.isActive());

  /*
   * ----------------------------------------------------------
   * Save manually
   * ----------------------------------------------------------
   */

  await user.save();

  console.log("Saved inactive user");

  return user;
}

/*
 * ============================================================
 * 18. TIMETABLE SCHEMA
 * ============================================================
 *
 * This demonstrates a domain-specific instance method.
 *
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  status: {
    type: String,

    enum: ["draft", "generating", "generated", "published"],

    default: "draft",
  },

  entries: {
    type: [
      {
        day: String,

        startTime: String,

        endTime: String,

        roomId: String,

        facultyId: String,

        subjectId: String,
      },
    ],

    default: [],
  },
});

/*
 * ============================================================
 * 19. TIMETABLE INSTANCE METHOD
 * ============================================================
 */

timetableSchema.methods.isPublished = function () {
  return this.status === "published";
};

/*
 * ============================================================
 * 20. CAN PUBLISH?
 * ============================================================
 */

timetableSchema.methods.canPublish = function () {
  return this.status === "generated" && this.entries.length > 0;
};

/*
 * ============================================================
 * 21. PUBLISH
 * ============================================================
 */

timetableSchema.methods.publish = function () {
  if (!this.canPublish()) {
    throw new Error("Timetable cannot be published");
  }

  this.status = "published";

  return this;
};

/*
 * ============================================================
 * 22. COUNT ENTRIES
 * ============================================================
 */

timetableSchema.methods.getEntryCount = function () {
  return this.entries.length;
};

/*
 * ============================================================
 * 23. FIND FACULTY SCHEDULE
 * ============================================================
 */

timetableSchema.methods.getFacultyEntries = function (facultyId) {
  return this.entries.filter((entry) => entry.facultyId === facultyId);
};

/*
 * ============================================================
 * 24. FIND ROOM SCHEDULE
 * ============================================================
 */

timetableSchema.methods.getRoomEntries = function (roomId) {
  return this.entries.filter((entry) => entry.roomId === roomId);
};

/*
 * ============================================================
 * 25. FIND SUBJECT SCHEDULE
 * ============================================================
 */

timetableSchema.methods.getSubjectEntries = function (subjectId) {
  return this.entries.filter((entry) => entry.subjectId === subjectId);
};

/*
 * ============================================================
 * 26. TIMETABLE MODEL
 * ============================================================
 */

const Timetable =
  mongoose.models.MongooseInstanceMethodTimetable ||
  mongoose.model("MongooseInstanceMethodTimetable", timetableSchema);

/*
 * ============================================================
 * 27. TIMETABLE DEMO
 * ============================================================
 */

async function timetableDemo() {
  const timetable = new Timetable({
    name: "CSE Semester 5",

    status: "generated",

    entries: [
      {
        day: "Monday",

        startTime: "09:00",

        endTime: "10:00",

        roomId: "ROOM-101",

        facultyId: "FAC-001",

        subjectId: "SUB-001",
      },

      {
        day: "Monday",

        startTime: "10:00",

        endTime: "11:00",

        roomId: "ROOM-102",

        facultyId: "FAC-002",

        subjectId: "SUB-002",
      },
    ],
  });

  console.log("\nEntry count:", timetable.getEntryCount());

  console.log("Can publish:", timetable.canPublish());

  console.log("Faculty FAC-001:", timetable.getFacultyEntries("FAC-001"));

  console.log("Room ROOM-101:", timetable.getRoomEntries("ROOM-101"));

  timetable.publish();

  console.log("Published:", timetable.isPublished());

  await timetable.save();
}

/*
 * ============================================================
 * 28. CHAINABLE METHODS
 * ============================================================
 *
 * Returning this allows:
 *
 *     user
 *       .activate()
 *       .deactivate()
 *       .activate();
 *
 * ============================================================
 */

userSchema.methods.setActive = function (value) {
  this.active = Boolean(value);

  return this;
};

/*
 * ============================================================
 * 29. CHECK MODIFIED FIELDS
 * ============================================================
 */

userSchema.methods.hasChanged = function (field) {
  return this.isModified(field);
};

/*
 * ============================================================
 * 30. CHECK NEW DOCUMENT
 * ============================================================
 */

userSchema.methods.isNewDocument = function () {
  return this.isNew;
};

/*
 * ============================================================
 * 31. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("\nMongoDB connected");

  try {
    await instanceMethodDemo();

    await timetableDemo();
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
