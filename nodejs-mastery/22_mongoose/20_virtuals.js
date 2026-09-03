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

    trim: true,
  },

  lastName: {
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

  birthYear: {
    type: Number,
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 3. BASIC VIRTUAL
 * ============================================================
 *
 * fullName is NOT stored in MongoDB.
 *
 * It is calculated from:
 *
 *     firstName
 *     lastName
 *
 * ============================================================
 */

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/*
 * ============================================================
 * 4. VIRTUAL AGE
 * ============================================================
 *
 * MongoDB stores birthYear.
 *
 * age is calculated dynamically.
 *
 * ============================================================
 */

userSchema.virtual("age").get(function () {
  if (!this.birthYear) {
    return undefined;
  }

  const currentYear = new Date().getFullYear();

  return currentYear - this.birthYear;
});

/*
 * ============================================================
 * 5. VIRTUAL EMAIL DOMAIN
 * ============================================================
 */

userSchema.virtual("emailDomain").get(function () {
  if (!this.email) {
    return undefined;
  }

  return this.email.split("@")[1];
});

/*
 * ============================================================
 * 6. VIRTUAL PROFILE LABEL
 * ============================================================
 */

userSchema.virtual("profileLabel").get(function () {
  return `${this.fullName} <${this.email}>`;
});

/*
 * ============================================================
 * 7. VIRTUAL WITH SETTER
 * ============================================================
 *
 * A virtual can also have a setter.
 *
 * ============================================================
 */

userSchema
  .virtual("name")
  .get(function () {
    return this.fullName;
  })
  .set(function (value) {
    const parts = value.trim().split(/\s+/);

    this.firstName = parts.shift() || "";

    this.lastName = parts.join(" ");
  });

/*
 * ============================================================
 * 8. VIRTUAL FOR URL
 * ============================================================
 */

userSchema.virtual("profileUrl").get(function () {
  return `/users/${this._id}`;
});

/*
 * ============================================================
 * 9. VIRTUALS IN JSON
 * ============================================================
 *
 * Virtuals are NOT included by default in JSON output.
 *
 * Enable them explicitly.
 *
 * ============================================================
 */

userSchema.set("toJSON", {
  virtuals: true,
});

/*
 * ============================================================
 * 10. VIRTUALS IN OBJECT
 * ============================================================
 */

userSchema.set("toObject", {
  virtuals: true,
});

/*
 * ============================================================
 * 11. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseVirtualUser ||
  mongoose.model("MongooseVirtualUser", userSchema);

/*
 * ============================================================
 * 12. CREATE USER
 * ============================================================
 */

async function createUser() {
  const user = await User.create({
    firstName: "Shiva",

    lastName: "Ram",

    email: `shiva-${Date.now()}@example.com`,

    birthYear: 2004,
  });

  return user;
}

/*
 * ============================================================
 * 13. BASIC VIRTUAL DEMO
 * ============================================================
 */

async function basicVirtualDemo() {
  const user = await createUser();

  console.log("\nFirst name:", user.firstName);

  console.log("Last name:", user.lastName);

  console.log("Full name:", user.fullName);

  console.log("Age:", user.age);

  console.log("Email domain:", user.emailDomain);

  console.log("Profile label:", user.profileLabel);

  console.log("Profile URL:", user.profileUrl);

  console.log("\nJSON:", user.toJSON());

  console.log("\nObject:", user.toObject());
}

/*
 * ============================================================
 * 14. VIRTUAL SETTER DEMO
 * ============================================================
 */

async function virtualSetterDemo() {
  const user = new User({
    firstName: "Old",

    lastName: "Name",

    email: `setter-${Date.now()}@example.com`,
  });

  console.log("\nBefore:", user.fullName);

  /*
   * Setting the virtual property.
   *
   * This changes firstName and lastName.
   */

  user.name = "Shiva Ram";

  console.log("First name:", user.firstName);

  console.log("Last name:", user.lastName);

  console.log("Full name:", user.fullName);
}

/*
 * ============================================================
 * 15. IMPORTANT:
 *     VIRTUALS ARE NOT STORED
 * ============================================================
 */

async function demonstrateStorage() {
  const user = await createUser();

  console.log("\nDocument:", user);

  console.log("\nVirtual fullName:", user.fullName);

  /*
   * Convert to MongoDB-style plain object.
   */

  const object = user.toObject();

  console.log("\nPlain object:", object);

  console.log("\nHas firstName:", Object.hasOwn(object, "firstName"));

  console.log("Has lastName:", Object.hasOwn(object, "lastName"));

  console.log("Has fullName:", Object.hasOwn(object, "fullName"));
}

/*
 * ============================================================
 * 16. TIMETABLE EXAMPLE
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  startTime: {
    type: String,

    required: true,
  },

  endTime: {
    type: String,

    required: true,
  },

  day: {
    type: String,

    required: true,
  },
});

/*
 * ============================================================
 * 17. TIMETABLE DISPLAY LABEL
 * ============================================================
 */

timetableSchema.virtual("displayLabel").get(function () {
  return `${this.day} ${this.startTime}-${this.endTime}`;
});

/*
 * ============================================================
 * 18. TIMETABLE DURATION
 * ============================================================
 */

timetableSchema.virtual("durationMinutes").get(function () {
  const [startHour, startMinute] = this.startTime.split(":").map(Number);

  const [endHour, endMinute] = this.endTime.split(":").map(Number);

  const start = startHour * 60 + startMinute;

  const end = endHour * 60 + endMinute;

  return end - start;
});

/*
 * ============================================================
 * 19. TIMETABLE TIME RANGE
 * ============================================================
 */

timetableSchema.virtual("timeRange").get(function () {
  return `${this.startTime} - ${this.endTime}`;
});

/*
 * ============================================================
 * 20. TIMETABLE JSON CONFIGURATION
 * ============================================================
 */

timetableSchema.set("toJSON", {
  virtuals: true,
});

timetableSchema.set("toObject", {
  virtuals: true,
});

/*
 * ============================================================
 * 21. TIMETABLE MODEL
 * ============================================================
 */

const Timetable =
  mongoose.models.MongooseVirtualTimetable ||
  mongoose.model("MongooseVirtualTimetable", timetableSchema);

/*
 * ============================================================
 * 22. TIMETABLE DEMO
 * ============================================================
 */

async function timetableDemo() {
  const timetable = new Timetable({
    name: "CSE - Data Structures",

    day: "Monday",

    startTime: "09:00",

    endTime: "10:00",
  });

  console.log("\nTimetable name:", timetable.name);

  console.log("Display label:", timetable.displayLabel);

  console.log("Duration:", timetable.durationMinutes, "minutes");

  console.log("Time range:", timetable.timeRange);

  console.log("\nJSON:", timetable.toJSON());
}

/*
 * ============================================================
 * 23. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await basicVirtualDemo();

    await virtualSetterDemo();

    await demonstrateStorage();

    await timetableDemo();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 24. RUN
 * ============================================================
 */

await main();
