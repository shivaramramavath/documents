/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     13_defaults.js
 *
 * Topic:
 *     Mongoose Defaults
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Static defaults
 *     2. Date.now
 *     3. Default functions
 *     4. Dynamic defaults
 *     5. Boolean defaults
 *     6. Array defaults
 *     7. Object defaults
 *     8. Nested defaults
 *     9. Default + required
 *    10. Defaults during save
 *    11. Defaults during upsert
 *    12. setDefaultsOnInsert
 *    13. Defaults with lean
 *    14. Common mistakes
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
 * 2. STATIC DEFAULT
 * ============================================================
 */

const staticDefaultSchema = new mongoose.Schema({
  role: {
    type: String,

    default: "student",
  },

  active: {
    type: Boolean,

    default: true,
  },
});

const StaticDefault =
  mongoose.models.MongooseStaticDefault ||
  mongoose.model("MongooseStaticDefault", staticDefaultSchema);

/*
 * ============================================================
 * 3. STATIC DEFAULT EXAMPLE
 * ============================================================
 */

const user = new StaticDefault({
  role: "admin",
});

const anotherUser = new StaticDefault({});

console.log("Explicit role:", user.role);

console.log("Default role:", anotherUser.role);

/*
 * ============================================================
 * 4. DATE DEFAULT
 * ============================================================
 *
 * IMPORTANT:
 *
 * Use:
 *
 *     default: Date.now
 *
 * NOT:
 *
 *     default: Date.now()
 *
 * ============================================================
 */

const dateSchema = new mongoose.Schema({
  createdAt: {
    type: Date,

    default: Date.now,
  },

  updatedAt: {
    type: Date,

    default: Date.now,
  },
});

const DateDefault =
  mongoose.models.MongooseDateDefault ||
  mongoose.model("MongooseDateDefault", dateSchema);

/*
 * ============================================================
 * 5. DATE DEFAULT EXAMPLE
 * ============================================================
 */

const dateDocument = new DateDefault();

console.log("Created:", dateDocument.createdAt);

console.log("Updated:", dateDocument.updatedAt);

/*
 * ============================================================
 * 6. WHY Date.now AND NOT Date.now()?
 * ============================================================
 *
 * WRONG:
 *
 *     default: Date.now()
 *
 * This evaluates immediately when the schema is created.
 *
 *
 * CORRECT:
 *
 *     default: Date.now
 *
 * Mongoose calls the function when the default is needed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. DEFAULT FUNCTION
 * ============================================================
 */

const functionDefaultSchema = new mongoose.Schema({
  token: {
    type: String,

    default: function () {
      return cryptoRandomToken();
    },
  },
});

/*
 * ============================================================
 * 8. RANDOM TOKEN FUNCTION
 * ============================================================
 */

function cryptoRandomToken() {
  return [Math.random().toString(36).slice(2), Date.now().toString(36)].join(
    "-",
  );
}

/*
 * ============================================================
 * 9. MODEL
 * ============================================================
 */

const FunctionDefault =
  mongoose.models.MongooseFunctionDefault ||
  mongoose.model("MongooseFunctionDefault", functionDefaultSchema);

/*
 * ============================================================
 * 10. FUNCTION DEFAULT EXAMPLE
 * ============================================================
 */

const tokenDocument = new FunctionDefault();

console.log("Generated token:", tokenDocument.token);

/*
 * ============================================================
 * 11. BOOLEAN DEFAULT
 * ============================================================
 */

const statusSchema = new mongoose.Schema({
  active: {
    type: Boolean,

    default: true,
  },

  verified: {
    type: Boolean,

    default: false,
  },

  deleted: {
    type: Boolean,

    default: false,
  },
});

/*
 * ============================================================
 * 12. ARRAY DEFAULT
 * ============================================================
 */

const arraySchema = new mongoose.Schema({
  tags: {
    type: [String],

    default: [],
  },
});

const ArrayDefault =
  mongoose.models.MongooseArrayDefault ||
  mongoose.model("MongooseArrayDefault", arraySchema);

const arrayDocument = new ArrayDefault();

console.log("Tags:", arrayDocument.tags);

/*
 * ============================================================
 * 13. DEFAULT ARRAY FUNCTION
 * ============================================================
 *
 * Another approach:
 *
 *     default: () => []
 *
 * ============================================================
 */

const safeArraySchema = new mongoose.Schema({
  tags: {
    type: [String],

    default: () => [],
  },
});

/*
 * ============================================================
 * 14. OBJECT DEFAULT
 * ============================================================
 */

const settingsSchema = new mongoose.Schema({
  settings: {
    type: {
      theme: String,

      language: String,
    },

    default: {
      theme: "light",

      language: "en",
    },
  },
});

/*
 * ============================================================
 * 15. NESTED DEFAULTS
 * ============================================================
 */

const nestedSchema = new mongoose.Schema({
  profile: {
    name: {
      type: String,

      default: "Unknown",
    },

    age: {
      type: Number,

      default: 18,
    },
  },
});

const NestedDefault =
  mongoose.models.MongooseNestedDefault ||
  mongoose.model("MongooseNestedDefault", nestedSchema);

const nestedDocument = new NestedDefault();

console.log("Profile:", nestedDocument.profile);

/*
 * ============================================================
 * 16. DEFAULT FUNCTION USING OTHER FIELDS
 * ============================================================
 */

const displayNameSchema = new mongoose.Schema({
  firstName: {
    type: String,

    required: true,
  },

  lastName: {
    type: String,

    required: true,
  },

  /*
   * Default functions are evaluated in document context.
   */

  displayName: {
    type: String,

    default: function () {
      if (!this.firstName || !this.lastName) {
        return undefined;
      }

      return `${this.firstName} ${this.lastName}`;
    },
  },
});

const DisplayName =
  mongoose.models.MongooseDisplayName ||
  mongoose.model("MongooseDisplayName", displayNameSchema);

/*
 * ============================================================
 * 17. DEFAULT FUNCTION EXAMPLE
 * ============================================================
 */

const displayUser = new DisplayName({
  firstName: "Shiva",

  lastName: "Ram",
});

console.log("Display name:", displayUser.displayName);

/*
 * ============================================================
 * 18. EXPLICIT VALUE OVERRIDES DEFAULT
 * ============================================================
 */

const explicitDefaultSchema = new mongoose.Schema({
  role: {
    type: String,

    default: "student",
  },
});

const ExplicitDefault =
  mongoose.models.MongooseExplicitDefault ||
  mongoose.model("MongooseExplicitDefault", explicitDefaultSchema);

const explicit = new ExplicitDefault({
  role: "faculty",
});

console.log("Role:", explicit.role);

/*
 * ============================================================
 * 19. DEFAULT ONLY WHEN VALUE IS UNDEFINED
 * ============================================================
 */

const undefinedSchema = new mongoose.Schema({
  role: {
    type: String,

    default: "student",
  },
});

const UndefinedDefault =
  mongoose.models.MongooseUndefinedDefault ||
  mongoose.model("MongooseUndefinedDefault", undefinedSchema);

const undefinedDocument = new UndefinedDefault({
  role: undefined,
});

console.log("Undefined role:", undefinedDocument.role);

/*
 * ============================================================
 * 20. NULL DOES NOT USE DEFAULT
 * ============================================================
 */

const nullDocument = new UndefinedDefault({
  role: null,
});

console.log("Null role:", nullDocument.role);

/*
 * Result:
 *
 *     undefined → default applied
 *
 *     null      → null remains
 *
 */

/*
 * ============================================================
 * 21. DEFAULT + REQUIRED
 * ============================================================
 */

const requiredDefaultSchema = new mongoose.Schema({
  role: {
    type: String,

    required: true,

    default: "student",
  },
});

const RequiredDefault =
  mongoose.models.MongooseRequiredDefault ||
  mongoose.model("MongooseRequiredDefault", requiredDefaultSchema);

const requiredDocument = new RequiredDefault();

console.log("Role:", requiredDocument.role);

/*
 * The default satisfies the required field.
 */

/*
 * ============================================================
 * 22. DEFAULT + ENUM
 * ============================================================
 */

const enumDefaultSchema = new mongoose.Schema({
  role: {
    type: String,

    enum: ["student", "faculty", "admin"],

    default: "student",
  },
});

const EnumDefault =
  mongoose.models.MongooseEnumDefault ||
  mongoose.model("MongooseEnumDefault", enumDefaultSchema);

const enumDocument = new EnumDefault();

console.log("Default enum role:", enumDocument.role);

/*
 * ============================================================
 * 23. TIMESTAMPS
 * ============================================================
 *
 * Mongoose can automatically manage:
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

const Timestamp =
  mongoose.models.MongooseTimestampDefault ||
  mongoose.model("MongooseTimestampDefault", timestampSchema);

const timestampDocument = new Timestamp({
  name: "Shiva",
});

console.log("CreatedAt:", timestampDocument.createdAt);

/*
 * ============================================================
 * 24. UPSERT + DEFAULTS
 * ============================================================
 *
 * When using:
 *
 *     upsert: true
 *
 * Mongoose can apply schema defaults to the inserted
 * document.
 *
 * ============================================================
 */

const upsertSchema = new mongoose.Schema({
  email: {
    type: String,

    required: true,
  },

  role: {
    type: String,

    default: "student",
  },

  active: {
    type: Boolean,

    default: true,
  },
});

const UpsertDefault =
  mongoose.models.MongooseUpsertDefault ||
  mongoose.model("MongooseUpsertDefault", upsertSchema);

/*
 * ============================================================
 * 25. UPSERT WITH DEFAULTS
 * ============================================================
 */

async function upsertWithDefaults(email) {
  return UpsertDefault.findOneAndUpdate(
    {
      email,
    },

    {
      $set: {
        email,
      },
    },

    {
      upsert: true,

      new: true,

      setDefaultsOnInsert: true,
    },
  ).exec();
}

/*
 * ============================================================
 * 26. DISABLE DEFAULTS DURING UPSERT
 * ============================================================
 */

async function upsertWithoutDefaults(email) {
  return UpsertDefault.findOneAndUpdate(
    {
      email,
    },

    {
      $set: {
        email,
      },
    },

    {
      upsert: true,

      new: true,

      setDefaultsOnInsert: false,
    },
  ).exec();
}

/*
 * ============================================================
 * 27. DEFAULTS + LEAN
 * ============================================================
 *
 * lean() returns plain JavaScript objects instead of
 * Mongoose documents.
 *
 * Historically, defaults were not applied by ordinary
 * lean() in the same way as hydrated documents.
 *
 * If you specifically need defaults in lean results,
 * use the appropriate current Mongoose support/plugin
 * for lean defaults rather than assuming hydration behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. DEFAULT FUNCTION SHOULD BE IDEMPOTENT
 * ============================================================
 *
 * A default should normally produce the correct value every
 * time it is evaluated.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. PRODUCTION EXAMPLE
 * ============================================================
 */

const productionUserSchema = new mongoose.Schema({
  username: {
    type: String,

    required: true,

    trim: true,
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

  loginCount: {
    type: Number,

    default: 0,
  },

  tags: {
    type: [String],

    default: () => [],
  },

  preferences: {
    theme: {
      type: String,

      enum: ["light", "dark"],

      default: "light",
    },

    notifications: {
      type: Boolean,

      default: true,
    },
  },

  lastLoginAt: {
    type: Date,

    default: null,
  },
});

const ProductionUser =
  mongoose.models.MongooseProductionUser ||
  mongoose.model("MongooseProductionUser", productionUserSchema);

/*
 * ============================================================
 * 30. PRODUCTION DEFAULT EXAMPLE
 * ============================================================
 */

const productionUser = new ProductionUser({
  username: "shiva",
});

console.log("Production user:", productionUser);

/*
 * ============================================================
 * 31. MAIN
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("\nMongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Create document and inspect defaults
     * --------------------------------------------------------
     */

    const student = new ProductionUser({
      username: "student01",
    });

    console.log("\nBefore save:", student.toObject());

    /*
     * --------------------------------------------------------
     * Save
     * --------------------------------------------------------
     */

    await student.save();

    console.log("\nAfter save:", student.toObject());
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 32. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
