/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     21_getters_setters.js
 *
 * Topic:
 *     Mongoose Getters & Setters
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Schema setters
 *     2. Schema getters
 *     3. trim
 *     4. lowercase
 *     5. uppercase
 *     6. Custom setters
 *     7. Custom getters
 *     8. Getters + setters together
 *     9. update operations
 *    10. Serialization
 *    11. Security considerations
 *    12. Virtual vs getter/setter
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
 * 2. BASIC SETTER
 * ============================================================
 *
 * A setter runs when a value is assigned to a field.
 *
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    set: (value) => value.trim().replace(/\s+/g, " "),
  },

  email: {
    type: String,

    required: true,

    unique: true,

    set: (value) => value.trim().toLowerCase(),
  },

  username: {
    type: String,

    required: true,

    set: (value) => value.trim().toLowerCase(),
  },
});

/*
 * ============================================================
 * 3. BUILT-IN SETTERS
 * ============================================================
 *
 * Mongoose already provides useful options.
 *
 *     trim
 *     lowercase
 *     uppercase
 *
 * ============================================================
 */

const normalizedUserSchema = new mongoose.Schema({
  name: {
    type: String,

    trim: true,
  },

  email: {
    type: String,

    trim: true,

    lowercase: true,
  },

  code: {
    type: String,

    trim: true,

    uppercase: true,
  },
});

/*
 * ============================================================
 * 4. PHONE NUMBER SETTER
 * ============================================================
 */

userSchema.add({
  phone: {
    type: String,

    set: function (value) {
      if (value === undefined) {
        return value;
      }

      return value.replace(/\D/g, "");
    },
  },
});

/*
 * ============================================================
 * 5. TAGS SETTER
 * ============================================================
 *
 * Normalize an array of tags.
 *
 * ============================================================
 */

userSchema.add({
  tags: {
    type: [String],

    set: function (values) {
      if (!Array.isArray(values)) {
        return values;
      }

      return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
    },
  },
});

/*
 * ============================================================
 * 6. CUSTOM GETTER
 * ============================================================
 *
 * Getter runs when the value is read.
 *
 * ============================================================
 */

userSchema.add({
  displayName: {
    type: String,

    get: function (value) {
      if (!value) {
        return value;
      }

      return value.toUpperCase();
    },
  },
});

/*
 * ============================================================
 * 7. GETTER + SETTER
 * ============================================================
 */

userSchema.add({
  city: {
    type: String,

    set: function (value) {
      return value?.trim().toLowerCase();
    },

    get: function (value) {
      if (!value) {
        return value;
      }

      return value.replace(/\b\w/g, (char) => char.toUpperCase());
    },
  },
});

/*
 * ============================================================
 * 8. PRICE SETTER
 * ============================================================
 *
 * Convert incoming numeric strings to numbers.
 *
 * ============================================================
 */

userSchema.add({
  score: {
    type: Number,

    set: function (value) {
      if (value === null || value === undefined) {
        return value;
      }

      return Number(value);
    },
  },
});

/*
 * ============================================================
 * 9. ROUNDING SETTER
 * ============================================================
 */

userSchema.add({
  rating: {
    type: Number,

    min: 0,

    max: 5,

    set: function (value) {
      const number = Number(value);

      if (Number.isNaN(number)) {
        return value;
      }

      return Math.round(number * 10) / 10;
    },
  },
});

/*
 * ============================================================
 * 10. GETTER FOR RATING
 * ============================================================
 */

userSchema.path("rating").get(function (value) {
  if (value === undefined) {
    return value;
  }

  return Number(value.toFixed(1));
});

/*
 * ============================================================
 * 11. BOOLEAN SETTER
 * ============================================================
 */

userSchema.add({
  active: {
    type: Boolean,

    default: true,

    set: function (value) {
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }

      return Boolean(value);
    },
  },
});

/*
 * ============================================================
 * 12. JSON CONFIGURATION
 * ============================================================
 *
 * Getters are not necessarily included in JSON output unless
 * enabled.
 *
 * ============================================================
 */

userSchema.set("toJSON", {
  getters: true,
});

userSchema.set("toObject", {
  getters: true,
});

/*
 * ============================================================
 * 13. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseGetterSetterUser ||
  mongoose.model("MongooseGetterSetterUser", userSchema);

/*
 * ============================================================
 * 14. SETTER DEMO
 * ============================================================
 */

async function setterDemo() {
  const user = new User({
    name: "   Shiva     Ram   ",

    email: "   SHIVA@EXAMPLE.COM   ",

    username: "   SHIVA_RAM   ",

    phone: "+91 98765-43210",

    tags: ["  MongoDB ", "MONGOOSE", " Backend ", " "],

    city: "   vijayawada   ",

    score: "95",

    rating: "4.76",

    active: "true",

    displayName: "shiva ram",
  });

  console.log("\nNormalized name:", user.name);

  console.log("Normalized email:", user.email);

  console.log("Normalized username:", user.username);

  console.log("Normalized phone:", user.phone);

  console.log("Normalized tags:", user.tags);

  console.log(
    "Stored city:",
    user.$get("city", null, {
      getters: false,
    }),
  );

  console.log("Getter city:", user.city);

  console.log("Score:", user.score);

  console.log("Rating:", user.rating);

  console.log("Active:", user.active);

  console.log("Display name:", user.displayName);

  return user;
}

/*
 * ============================================================
 * 15. GETTER DEMO
 * ============================================================
 */

async function getterDemo() {
  const user = new User({
    name: "Shiva",

    email: "shiva@example.com",

    username: "shiva",

    city: "hyderabad",

    displayName: "shiva ram",
  });

  /*
   * Getter executes when reading.
   */

  console.log(
    "\nRaw city from storage:",
    user.$get("city", null, {
      getters: false,
    }),
  );

  console.log("Getter city:", user.city);

  console.log(
    "\nRaw displayName:",
    user.$get("displayName", null, {
      getters: false,
    }),
  );

  console.log("Getter displayName:", user.displayName);
}

/*
 * ============================================================
 * 16. SETTER EXECUTION
 * ============================================================
 */

async function assignmentDemo() {
  const user = new User({
    name: "Shiva",

    email: "shiva@example.com",

    username: "shiva",
  });

  console.log("\nBefore assignment:", user.email);

  user.email = "   NEW@EXAMPLE.COM   ";

  console.log("After assignment:", user.email);

  user.phone = "+91 (987) 654-3210";

  console.log("Normalized phone:", user.phone);

  user.tags = ["MongoDB", " Node.js ", "API"];

  console.log("Normalized tags:", user.tags);
}

/*
 * ============================================================
 * 17. JSON DEMO
 * ============================================================
 */

async function jsonDemo() {
  const user = new User({
    name: "Shiva",

    email: "shiva@example.com",

    username: "shiva",

    city: "vijayawada",

    displayName: "shiva ram",
  });

  const json = user.toJSON();

  console.log("\nJSON output:", json);
}

/*
 * ============================================================
 * 18. UPDATE DEMO
 * ============================================================
 */

async function updateDemo() {
  const user = await User.create({
    name: "Shiva",

    email: `update-${Date.now()}@example.com`,

    username: `update-${Date.now()}`,
  });

  console.log("\nOriginal email:", user.email);

  user.email = "   UPDATED@EXAMPLE.COM   ";

  console.log("After assignment:", user.email);

  await user.save();

  const updated = await User.findById(user._id);

  console.log("After reload:", updated?.email);
}

/*
 * ============================================================
 * 19. TIMETABLE EXAMPLE
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  subjectName: {
    type: String,

    required: true,

    set: (value) => value.trim().replace(/\s+/g, " "),
  },

  roomCode: {
    type: String,

    required: true,

    set: (value) => value.trim().toUpperCase(),
  },

  day: {
    type: String,

    required: true,

    set: (value) => value.trim().toLowerCase(),

    get: (value) => value?.replace(/^\w/, (char) => char.toUpperCase()),
  },

  startTime: {
    type: String,

    required: true,

    set: (value) => value.trim(),
  },

  endTime: {
    type: String,

    required: true,

    set: (value) => value.trim(),
  },
});

/*
 * ============================================================
 * 20. TIMETABLE JSON GETTERS
 * ============================================================
 */

timetableSchema.set("toJSON", {
  getters: true,
});

timetableSchema.set("toObject", {
  getters: true,
});

/*
 * ============================================================
 * 21. TIMETABLE MODEL
 * ============================================================
 */

const Timetable =
  mongoose.models.MongooseGetterSetterTimetable ||
  mongoose.model("MongooseGetterSetterTimetable", timetableSchema);

/*
 * ============================================================
 * 22. TIMETABLE DEMO
 * ============================================================
 */

async function timetableDemo() {
  const timetable = new Timetable({
    subjectName: "   Data     Structures   ",

    roomCode: "   room-101   ",

    day: "   monday   ",

    startTime: " 09:00 ",

    endTime: " 10:00 ",
  });

  console.log("\nSubject:", timetable.subjectName);

  console.log("Room:", timetable.roomCode);

  console.log("Day:", timetable.day);

  console.log("Start:", timetable.startTime);

  console.log("End:", timetable.endTime);

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
    await setterDemo();

    await getterDemo();

    await assignmentDemo();

    await jsonDemo();

    await updateDemo();

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
