/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     12_schema_types.js
 *
 * Topic:
 *     Mongoose SchemaTypes
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. String
 *     2. Number
 *     3. Boolean
 *     4. Date
 *     5. ObjectId
 *     6. Decimal128
 *     7. Buffer
 *     8. Mixed
 *     9. Map
 *    10. Array
 *    11. Array of Strings
 *    12. Array of Numbers
 *    13. Array of Objects
 *    14. Nested objects
 *    15. Subdocuments
 *    16. Document arrays
 *    17. Mixed vs nested objects
 *    18. ObjectId references
 *    19. Type casting
 *    20. SchemaType options
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
 * 2. STRING
 * ============================================================
 */

const stringSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    maxlength: 100,
  },
});

/*
 * ============================================================
 * STRING EXAMPLE
 * ============================================================
 */

const stringDocument =
  new mongoose.models.StringTypeExample() ||
  mongoose.model("StringTypeExample", stringSchema);

/*
 * ============================================================
 * 3. NUMBER
 * ============================================================
 */

const numberSchema = new mongoose.Schema({
  age: {
    type: Number,

    min: 0,

    max: 150,
  },

  cgpa: {
    type: Number,

    min: 0,

    max: 10,
  },
});

/*
 * ============================================================
 * 4. BOOLEAN
 * ============================================================
 */

const booleanSchema = new mongoose.Schema({
  active: {
    type: Boolean,

    default: true,
  },

  verified: {
    type: Boolean,

    default: false,
  },
});

/*
 * ============================================================
 * 5. DATE
 * ============================================================
 */

const dateSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
  },

  joinedAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * DATE EXAMPLES
 * ============================================================
 */

const dateDocument =
  new mongoose.models.DateTypeExample() ||
  mongoose.model("DateTypeExample", dateSchema);

/*
 * ============================================================
 * 6. OBJECTID
 * ============================================================
 *
 * ObjectId is MongoDB's standard identifier type.
 *
 * ============================================================
 */

const objectIdSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

/*
 * ============================================================
 * 7. OBJECTID REFERENCE
 * ============================================================
 */

const referenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
});

/*
 * ============================================================
 * 8. DECIMAL128
 * ============================================================
 *
 * Useful when exact decimal precision matters.
 *
 * Example:
 *
 *     financial values
 *     precise decimal calculations
 *
 * ============================================================
 */

const decimalSchema = new mongoose.Schema({
  price: {
    type: mongoose.Schema.Types.Decimal128,
  },

  salary: {
    type: mongoose.Schema.Types.Decimal128,
  },
});

/*
 * ============================================================
 * 9. DECIMAL128 EXAMPLE
 * ============================================================
 */

const decimalDocument =
  new mongoose.models.DecimalTypeExample() ||
  mongoose.model("DecimalTypeExample", decimalSchema);

/*
 * ============================================================
 * 10. BUFFER
 * ============================================================
 *
 * Stores binary data.
 *
 * Examples:
 *
 *     binary identifiers
 *     small binary payloads
 *
 * Usually don't store large files directly in MongoDB
 * without understanding the appropriate storage strategy.
 *
 * ============================================================
 */

const bufferSchema = new mongoose.Schema({
  data: {
    type: Buffer,
  },
});

/*
 * ============================================================
 * 11. MIXED
 * ============================================================
 *
 * Mixed means:
 *
 *     "Mongoose does not enforce a particular structure here."
 *
 * ============================================================
 */

const mixedSchema = new mongoose.Schema({
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

/*
 * ============================================================
 * MIXED EXAMPLE
 * ============================================================
 */

const mixedDocument =
  new mongoose.models.MixedTypeExample() ||
  mongoose.model("MixedTypeExample", mixedSchema);

/*
 * You can store:
 *
 *     {
 *       metadata: {
 *         browser: "Chrome",
 *         version: 140
 *       }
 *     }
 *
 *
 * Or:
 *
 *     {
 *       metadata: {
 *         device: {
 *           mobile: true
 *         }
 *       }
 *     }
 *
 *
 * But Mongoose won't know the exact structure.
 */

/*
 * ============================================================
 * 12. MAP
 * ============================================================
 *
 * Map is useful for dynamic key/value structures where the
 * values share a known type.
 *
 * ============================================================
 */

const mapSchema = new mongoose.Schema({
  scores: {
    type: Map,

    of: Number,
  },
});

/*
 * ============================================================
 * MAP EXAMPLE
 * ============================================================
 */

const MapExample =
  mongoose.models.MapTypeExample || mongoose.model("MapTypeExample", mapSchema);

const mapDocument = new MapExample({
  scores: {
    mathematics: 95,

    physics: 88,

    chemistry: 91,
  },
});

/*
 * Access:
 *
 *     mapDocument.scores.get("mathematics")
 *
 */

/*
 * ============================================================
 * 13. ARRAY
 * ============================================================
 *
 * Generic array.
 *
 * ============================================================
 */

const arraySchema = new mongoose.Schema({
  tags: {
    type: Array,
  },
});

/*
 * ============================================================
 * 14. ARRAY OF STRINGS
 * ============================================================
 */

const stringArraySchema = new mongoose.Schema({
  tags: {
    type: [String],
  },
});

/*
 * ============================================================
 * 15. ARRAY OF NUMBERS
 * ============================================================
 */

const numberArraySchema = new mongoose.Schema({
  marks: {
    type: [Number],
  },
});

/*
 * ============================================================
 * 16. ARRAY OF OBJECTIDS
 * ============================================================
 */

const objectIdArraySchema = new mongoose.Schema({
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Subject",
    },
  ],
});

/*
 * ============================================================
 * 17. ARRAY OF OBJECTS
 * ============================================================
 */

const objectArraySchema = new mongoose.Schema({
  addresses: [
    {
      city: String,

      state: String,

      pincode: Number,
    },
  ],
});

/*
 * ============================================================
 * 18. NESTED OBJECT
 * ============================================================
 */

const nestedSchema = new mongoose.Schema({
  profile: {
    firstName: String,

    lastName: String,

    age: Number,
  },
});

/*
 * ============================================================
 * 19. EXPLICIT NESTED SCHEMA
 * ============================================================
 */

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,

      required: true,
    },

    lastName: {
      type: String,

      required: true,
    },

    age: {
      type: Number,

      min: 0,
    },
  },

  {
    _id: false,
  },
);

const explicitNestedSchema = new mongoose.Schema({
  profile: profileSchema,
});

/*
 * ============================================================
 * 20. SUBDOCUMENT
 * ============================================================
 *
 * A subdocument has its own schema.
 *
 * ============================================================
 */

const addressSchema = new mongoose.Schema({
  street: String,

  city: String,

  state: String,

  pincode: Number,
});

const userSchema = new mongoose.Schema({
  name: String,

  address: addressSchema,
});

/*
 * ============================================================
 * 21. DOCUMENT ARRAY
 * ============================================================
 */

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  marks: {
    type: Number,

    min: 0,

    max: 100,
  },
});

const studentSchema = new mongoose.Schema({
  name: String,

  subjects: [subjectSchema],
});

/*
 * ============================================================
 * 22. DOCUMENT ARRAY EXAMPLE
 * ============================================================
 */

const Student =
  mongoose.models.SchemaTypeStudent ||
  mongoose.model("SchemaTypeStudent", studentSchema);

const student = new Student({
  name: "Shiva Ram",

  subjects: [
    {
      name: "Mathematics",

      marks: 95,
    },

    {
      name: "Physics",

      marks: 88,
    },
  ],
});

/*
 * Each subject subdocument gets its own _id by default.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. SUBDOCUMENT _id
 * ============================================================
 */

console.log("Subject ID:", student.subjects[0]._id);

/*
 * ============================================================
 * 24. FIND SUBDOCUMENT
 * ============================================================
 */

const subject = student.subjects.id(student.subjects[0]._id);

console.log("Subject:", subject);

/*
 * ============================================================
 * 25. REMOVE SUBDOCUMENT
 * ============================================================
 */

student.subjects.id(student.subjects[0]._id).deleteOne();

/*
 * ============================================================
 * 26. MIXED VS NESTED
 * ============================================================
 *
 * Nested:
 *
 *     profile: {
 *       name: String,
 *       age: Number
 *     }
 *
 *
 * Mongoose knows the structure.
 *
 *
 * Mixed:
 *
 *     metadata: {
 *       type: Schema.Types.Mixed
 *     }
 *
 *
 * Mongoose does not enforce the internal structure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. TYPE CASTING
 * ============================================================
 *
 * Mongoose automatically casts many values to their schema
 * types.
 * ============================================================
 */

const castingSchema = new mongoose.Schema({
  age: Number,

  active: Boolean,

  joinedAt: Date,
});

const Casting =
  mongoose.models.SchemaTypeCasting ||
  mongoose.model("SchemaTypeCasting", castingSchema);

const castingDocument = new Casting({
  age: "21",

  active: "true",

  joinedAt: "2026-09-03",
});

console.log("Age:", castingDocument.age);

console.log("Age type:", typeof castingDocument.age);

console.log("Active:", castingDocument.active);

console.log("Joined:", castingDocument.joinedAt);

/*
 * ============================================================
 * 28. SCHEMA TYPE OPTIONS
 * ============================================================
 *
 * SchemaTypes can have many options.
 *
 * ============================================================
 */

const optionsSchema = new mongoose.Schema({
  username: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    minlength: 3,

    maxlength: 30,

    match: /^[a-z0-9_]+$/,
  },

  age: {
    type: Number,

    min: 18,

    max: 100,
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

  joinedAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 29. OBJECTID VALIDATION
 * ============================================================
 */

function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
}

console.log(isValidObjectId("507f1f77bcf86cd799439011"));

/*
 * ============================================================
 * 30. DECIMAL128 VALUE
 * ============================================================
 */

const price = new mongoose.Types.Decimal128("999.99");

console.log(price.toString());

/*
 * ============================================================
 * 31. MAP OPERATIONS
 * ============================================================
 */

function mapExample() {
  const example = new MapExample({
    scores: {
      mathematics: 95,

      physics: 88,
    },
  });

  console.log(example.scores.get("mathematics"));

  example.scores.set("chemistry", 91);

  console.log(example.scores);
}

/*
 * ============================================================
 * 32. COMPLETE SCHEMA EXAMPLE
 * ============================================================
 *
 * This combines the important SchemaTypes into a realistic
 * model.
 *
 * ============================================================
 */

const courseSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,
  },

  code: {
    type: String,

    required: true,

    uppercase: true,
  },

  credits: {
    type: Number,

    min: 1,

    max: 10,
  },

  active: {
    type: Boolean,

    default: true,
  },

  startDate: {
    type: Date,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Faculty",
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Student",
    },
  ],

  grades: {
    type: Map,

    of: Number,
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const Course =
  mongoose.models.SchemaTypeCourse ||
  mongoose.model("SchemaTypeCourse", courseSchema);

/*
 * ============================================================
 * 33. CREATE COURSE DOCUMENT
 * ============================================================
 */

const course = new Course({
  name: "Machine Learning",

  code: "cse401",

  credits: 4,

  active: true,

  startDate: new Date(),

  grades: {
    internal: 40,

    external: 60,
  },

  metadata: {
    difficulty: "advanced",

    lab: true,

    room: "LAB-3",
  },
});

console.log(course);

/*
 * ============================================================
 * 34. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * Validate document.
     */

    await course.validate();

    console.log("Course schema types are valid");
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

/*
 * ============================================================
 * 35. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
