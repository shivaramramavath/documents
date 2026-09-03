/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     02_schema.js
 *
 * Topic:
 *     Mongoose Schema
 *
 * ============================================================
 *
 * A Schema defines:
 *
 *     - document structure
 *     - field types
 *     - validation rules
 *     - default values
 *     - required fields
 *     - indexes
 *     - timestamps
 *     - immutable fields
 *     - aliases
 *     - getters / setters
 *     - virtuals
 *     - middleware
 *     - nested structures
 *     - arrays
 *     - references
 *
 * ============================================================
 */

import mongoose from "mongoose";

/*
 * ============================================================
 * 1. BASIC SCHEMA
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  name: String,

  age: Number,

  email: String,

  active: Boolean,
});

/*
 * ============================================================
 * 2. SCHEMATYPE
 * ============================================================
 *
 * Mongoose supports many SchemaTypes.
 *
 * Common:
 *
 *     String
 *     Number
 *     Boolean
 *     Date
 *     ObjectId
 *     Array
 *     Map
 *     Mixed
 *     Buffer
 *
 * ============================================================
 */

const schemaTypesExample = new mongoose.Schema({
  name: {
    type: String,
  },

  age: {
    type: Number,
  },

  isActive: {
    type: Boolean,
  },

  dateOfBirth: {
    type: Date,
  },

  profileImage: {
    type: Buffer,
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },

  settings: {
    type: Map,

    of: String,
  },
});

/*
 * ============================================================
 * 3. STRING OPTIONS
 * ============================================================
 */

const stringSchema = new mongoose.Schema({
  username: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    uppercase: false,

    minlength: 3,

    maxlength: 30,

    enum: ["student", "teacher", "admin"],
  },
});

/*
 * ============================================================
 * 4. STRING MATCH VALIDATION
 * ============================================================
 */

const emailSchema = new mongoose.Schema({
  email: {
    type: String,

    required: true,

    trim: true,

    lowercase: true,

    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
});

/*
 * ============================================================
 * 5. NUMBER OPTIONS
 * ============================================================
 */

const numberSchema = new mongoose.Schema({
  age: {
    type: Number,

    required: true,

    min: 16,

    max: 100,
  },

  semester: {
    type: Number,

    min: 1,

    max: 8,
  },
});

/*
 * ============================================================
 * 6. BOOLEAN
 * ============================================================
 */

const booleanSchema = new mongoose.Schema({
  active: {
    type: Boolean,

    default: true,
  },
});

/*
 * ============================================================
 * 7. DATE
 * ============================================================
 */

const dateSchema = new mongoose.Schema({
  joiningDate: {
    type: Date,

    required: true,
  },

  graduationDate: {
    type: Date,
  },
});

/*
 * ============================================================
 * 8. OBJECTID
 * ============================================================
 *
 * ObjectId is commonly used to reference another document.
 *
 * ============================================================
 */

const referenceSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Department",

    required: true,
  },
});

/*
 * ============================================================
 * 9. DEFAULT VALUES
 * ============================================================
 */

const defaultSchema = new mongoose.Schema({
  active: {
    type: Boolean,

    default: true,
  },

  role: {
    type: String,

    default: "student",
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 10. IMMUTABLE
 * ============================================================
 *
 * Once created, this field should not normally be changed.
 *
 * ============================================================
 */

const immutableSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,

    immutable: true,
  },
});

/*
 * ============================================================
 * 11. SELECT
 * ============================================================
 *
 * select: false
 *
 * means the field is excluded from normal queries.
 *
 * Useful for:
 *
 *     passwordHash
 *     refreshToken
 *     internal secrets
 *
 * ============================================================
 */

const secureSchema = new mongoose.Schema({
  email: {
    type: String,

    required: true,
  },

  passwordHash: {
    type: String,

    required: true,

    select: false,
  },
});

/*
 * ============================================================
 * 12. ALIAS
 * ============================================================
 */

const aliasSchema = new mongoose.Schema({
  firstName: {
    type: String,

    alias: "first",
  },
});

/*
 * ============================================================
 * 13. ARRAY OF STRINGS
 * ============================================================
 */

const skillsSchema = new mongoose.Schema({
  skills: [String],
});

/*
 * ============================================================
 * 14. ARRAY OF OBJECTS
 * ============================================================
 */

const subjectsSchema = new mongoose.Schema({
  subjects: [
    {
      name: {
        type: String,

        required: true,
      },

      credits: {
        type: Number,

        min: 1,
      },
    },
  ],
});

/*
 * ============================================================
 * 15. NESTED OBJECT
 * ============================================================
 */

const addressSchema = new mongoose.Schema({
  name: String,

  address: {
    street: String,

    city: String,

    state: String,

    country: String,

    pincode: String,
  },
});

/*
 * ============================================================
 * 16. NESTED SCHEMA
 * ============================================================
 *
 * Sometimes you want a reusable sub-schema.
 *
 * ============================================================
 */

const addressSubSchema = new mongoose.Schema(
  {
    street: String,

    city: String,

    state: String,

    pincode: String,
  },

  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema({
  name: String,

  address: addressSubSchema,
});

/*
 * ============================================================
 * 17. MAP
 * ============================================================
 *
 * Map is useful for dynamic key/value data.
 *
 * ============================================================
 */

const mapSchema = new mongoose.Schema({
  preferences: {
    type: Map,

    of: String,
  },
});

/*
 * Example:
 *
 * preferences:
 *
 *     {
 *       theme: "dark",
 *       language: "en",
 *       timezone: "Asia/Kolkata"
 *     }
 *
 */

/*
 * ============================================================
 * 18. MIXED
 * ============================================================
 *
 * Mixed allows almost any structure.
 *
 * Use carefully because Mongoose cannot fully understand
 * the internal structure.
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
 * 19. SCHEMA OPTIONS
 * ============================================================
 */

const optionsSchema = new mongoose.Schema(
  {
    name: String,

    email: String,
  },

  {
    /*
     * Automatically creates:
     *
     *     createdAt
     *     updatedAt
     */

    timestamps: true,

    /*
     * Automatically add _id to documents.
     */

    _id: true,

    /*
     * Version key.
     *
     * Default:
     *
     *     __v
     */

    versionKey: true,

    /*
     * Strict mode prevents fields not defined in the
     * schema from being persisted.
     */

    strict: true,
  },
);

/*
 * ============================================================
 * 20. TIMESTAMPS
 * ============================================================
 *
 * timestamps: true
 *
 * automatically manages:
 *
 *     createdAt
 *     updatedAt
 *
 * ============================================================
 */

const timestampSchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 21. CUSTOM TIMESTAMP NAMES
 * ============================================================
 */

const customTimestampSchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    timestamps: {
      createdAt: "created_at",

      updatedAt: "updated_at",
    },
  },
);

/*
 * ============================================================
 * 22. VERSION KEY
 * ============================================================
 *
 * Mongoose normally adds:
 *
 *     __v
 *
 * to documents.
 *
 * ============================================================
 */

const versionSchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    versionKey: true,
  },
);

/*
 * Disable __v:
 *
 *     versionKey: false
 *
 *
 * But don't disable it blindly in production.
 */

/*
 * ============================================================
 * 23. STRICT MODE
 * ============================================================
 */

const strictSchema = new mongoose.Schema(
  {
    name: String,

    email: String,
  },

  {
    strict: true,
  },
);

/*
 * If strict is true:
 *
 *     {
 *       name: "Shiva",
 *       unknownField: "hello"
 *     }
 *
 * unknownField won't normally be persisted.
 */

/*
 * ============================================================
 * 24. STRICT QUERY
 * ============================================================
 *
 * Controls unknown fields used in queries.
 *
 * ============================================================
 */

const strictQuerySchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    strictQuery: true,
  },
);

/*
 * ============================================================
 * 25. COLLECTION NAME
 * ============================================================
 */

const collectionSchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    collection: "students",
  },
);

/*
 * ============================================================
 * 26. TOJSON
 * ============================================================
 *
 * Controls how a Mongoose document is converted to JSON.
 *
 * ============================================================
 */

const jsonSchema = new mongoose.Schema(
  {
    name: String,

    passwordHash: String,
  },

  {
    toJSON: {
      virtuals: true,
    },
  },
);

/*
 * ============================================================
 * 27. TO OBJECT
 * ============================================================
 */

const objectSchema = new mongoose.Schema(
  {
    name: String,
  },

  {
    toObject: {
      virtuals: true,
    },
  },
);

/*
 * ============================================================
 * 28. DISABLE AUTOMATIC _ID
 * ============================================================
 *
 * Usually useful for subdocuments that don't need their own
 * identity.
 *
 * ============================================================
 */

const itemSchema = new mongoose.Schema(
  {
    name: String,

    quantity: Number,
  },

  {
    _id: false,
  },
);

/*
 * ============================================================
 * 29. REALISTIC STUDENT SCHEMA
 * ============================================================
 */

const realisticStudentSchema = new mongoose.Schema(
  {
    /*
     * ------------------------------------------------------
     * Identity
     * ------------------------------------------------------
     */

    name: {
      type: String,

      required: true,

      trim: true,

      minlength: 2,

      maxlength: 100,
    },

    email: {
      type: String,

      required: true,

      trim: true,

      lowercase: true,

      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    /*
     * ------------------------------------------------------
     * Academic information
     * ------------------------------------------------------
     */

    rollNumber: {
      type: String,

      required: true,

      trim: true,

      uppercase: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Department",

      required: true,
    },

    semester: {
      type: Number,

      required: true,

      min: 1,

      max: 8,
    },

    /*
     * ------------------------------------------------------
     * Status
     * ------------------------------------------------------
     */

    active: {
      type: Boolean,

      default: true,
    },

    /*
     * ------------------------------------------------------
     * Address
     * ------------------------------------------------------
     */

    address: {
      city: String,

      state: String,

      country: {
        type: String,

        default: "India",
      },
    },

    /*
     * ------------------------------------------------------
     * Skills
     * ------------------------------------------------------
     */

    skills: [
      {
        type: String,

        trim: true,
      },
    ],
  },

  {
    timestamps: true,

    strict: true,
  },
);

/*
 * ============================================================
 * 30. SCHEMA METHODS
 * ============================================================
 *
 * A schema itself can define:
 *
 *     methods
 *     statics
 *     virtuals
 *     middleware
 *     indexes
 *
 * These will be covered in separate files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. EXPORT
 * ============================================================
 */

export {
  studentSchema,
  schemaTypesExample,
  stringSchema,
  emailSchema,
  numberSchema,
  booleanSchema,
  dateSchema,
  referenceSchema,
  defaultSchema,
  immutableSchema,
  secureSchema,
  aliasSchema,
  skillsSchema,
  subjectsSchema,
  addressSchema,
  addressSubSchema,
  userSchema,
  mapSchema,
  mixedSchema,
  optionsSchema,
  timestampSchema,
  customTimestampSchema,
  versionSchema,
  strictSchema,
  strictQuerySchema,
  collectionSchema,
  jsonSchema,
  objectSchema,
  itemSchema,
  realisticStudentSchema,
};
