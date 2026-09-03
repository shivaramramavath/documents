/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     14_indexes.js
 *
 * Topic:
 *     Mongoose Indexes
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. What is an index?
 *     2. Single-field indexes
 *     3. Schema.index()
 *     4. Compound indexes
 *     5. Index ordering
 *     6. Unique indexes
 *     7. Sparse indexes
 *     8. Partial indexes
 *     9. Text indexes
 *    10. TTL indexes
 *    11. Index options
 *    12. Listing indexes
 *    13. Creating indexes
 *    14. Dropping indexes
 *    15. explain()
 *    16. ESR rule
 *    17. Index prefixes
 *    18. Index design
 *    19. Production considerations
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

  age: {
    type: Number,
  },

  department: {
    type: String,
  },

  active: {
    type: Boolean,

    default: true,
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 3. SINGLE-FIELD INDEX
 * ============================================================
 *
 *     1 = ascending
 *    -1 = descending
 *
 * ============================================================
 */

userSchema.index({
  email: 1,
});

/*
 * ============================================================
 * 4. ANOTHER SINGLE-FIELD INDEX
 * ============================================================
 */

userSchema.index({
  age: 1,
});

/*
 * ============================================================
 * 5. COMPOUND INDEX
 * ============================================================
 *
 * Indexes multiple fields together.
 *
 * ============================================================
 */

userSchema.index({
  department: 1,

  age: 1,
});

/*
 * ============================================================
 * 6. COMPOUND INDEX WITH SORTING
 * ============================================================
 */

userSchema.index({
  department: 1,

  createdAt: -1,
});

/*
 * ============================================================
 * 7. UNIQUE INDEX
 * ============================================================
 *
 * Important:
 *
 * unique is implemented using a MongoDB unique index.
 *
 * ============================================================
 */

userSchema.index(
  {
    email: 1,
  },

  {
    unique: true,

    name: "unique_user_email",
  },
);

/*
 * ============================================================
 * 8. PARTIAL INDEX
 * ============================================================
 *
 * Only index documents satisfying the filter.
 *
 * ============================================================
 */

userSchema.index(
  {
    department: 1,

    createdAt: -1,
  },

  {
    partialFilterExpression: {
      active: true,
    },

    name: "active_department_createdAt",
  },
);

/*
 * ============================================================
 * 9. SPARSE INDEX
 * ============================================================
 *
 * Only indexes documents where the indexed field exists.
 *
 * ============================================================
 */

userSchema.index(
  {
    optionalCode: 1,
  },

  {
    sparse: true,
  },
);

/*
 * ============================================================
 * 10. TEXT INDEX
 * ============================================================
 *
 * Used for MongoDB text search.
 *
 * ============================================================
 */

userSchema.index(
  {
    name: "text",

    department: "text",
  },

  {
    name: "user_text_search",
  },
);

/*
 * ============================================================
 * 11. MODEL
 * ============================================================
 */

const User =
  mongoose.models.MongooseIndexUser ||
  mongoose.model("MongooseIndexUser", userSchema);

/*
 * ============================================================
 * 12. BASIC QUERY
 * ============================================================
 */

async function findByEmail(email) {
  return User.findOne({
    email,
  }).exec();
}

/*
 * ============================================================
 * 13. QUERY USING COMPOUND INDEX
 * ============================================================
 */

async function findActiveUsersByDepartment(department) {
  return User.find({
    department,

    active: true,
  })

    .sort({
      createdAt: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 14. TEXT SEARCH
 * ============================================================
 */

async function searchUsers(searchTerm) {
  return User.find({
    $text: {
      $search: searchTerm,
    },
  }).exec();
}

/*
 * ============================================================
 * 15. TEXT SEARCH SCORE
 * ============================================================
 */

async function searchUsersWithScore(searchTerm) {
  return User.find(
    {
      $text: {
        $search: searchTerm,
      },
    },

    {
      score: {
        $meta: "textScore",
      },
    },
  )

    .sort({
      score: {
        $meta: "textScore",
      },
    })

    .exec();
}

/*
 * ============================================================
 * 16. LIST SCHEMA INDEXES
 * ============================================================
 */

function getSchemaIndexes() {
  return userSchema.indexes();
}

/*
 * ============================================================
 * 17. LIST DATABASE INDEXES
 * ============================================================
 */

async function getDatabaseIndexes() {
  return User.collection.indexes();
}

/*
 * ============================================================
 * 18. ENSURE INDEXES
 * ============================================================
 *
 * Creates indexes that don't exist.
 *
 * ============================================================
 */

async function ensureIndexes() {
  return User.createIndexes();
}

/*
 * ============================================================
 * 19. SYNC INDEXES
 * ============================================================
 *
 * syncIndexes() attempts to make the database indexes match
 * the indexes defined by the schema.
 *
 * Be careful in production because synchronization can remove
 * indexes that are not defined in the schema.
 *
 * ============================================================
 */

async function syncIndexes() {
  return User.syncIndexes();
}

/*
 * ============================================================
 * 20. DROP ONE INDEX
 * ============================================================
 */

async function dropIndex(indexName) {
  return User.collection.dropIndex(indexName);
}

/*
 * ============================================================
 * 21. EXPLAIN QUERY
 * ============================================================
 *
 * explain() lets you inspect MongoDB's query plan.
 *
 * ============================================================
 */

async function explainEmailQuery(email) {
  return User.find({
    email,
  }).explain("executionStats");
}

/*
 * ============================================================
 * 22. EXPLAIN COMPOUND QUERY
 * ============================================================
 */

async function explainDepartmentQuery(department) {
  return User.find({
    department,

    active: true,
  })

    .sort({
      createdAt: -1,
    })

    .explain("executionStats");
}

/*
 * ============================================================
 * 23. READ QUERY EXECUTION STATS
 * ============================================================
 */

function printExecutionStats(result) {
  console.log("\nExecution statistics:");

  console.log("Execution time:", result.executionStats?.executionTimeMillis);

  console.log("Documents examined:", result.executionStats?.totalDocsExamined);

  console.log("Keys examined:", result.executionStats?.totalKeysExamined);

  console.log("Documents returned:", result.executionStats?.nReturned);
}

/*
 * ============================================================
 * 24. INDEX TYPES
 * ============================================================
 *
 * MongoDB supports different index patterns.
 *
 * Common ones:
 *
 *     Single field
 *     Compound
 *     Multikey
 *     Text
 *     Geospatial
 *     Hashed
 *     Wildcard
 *     TTL
 *
 * Mongoose exposes these through schema.index().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. TTL INDEX
 * ============================================================
 *
 * TTL = Time To Live
 *
 * MongoDB automatically removes expired documents.
 *
 * Example:
 *
 *     sessions
 *     temporary tokens
 *     temporary records
 *
 * ============================================================
 */

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,

    required: true,
  },

  createdAt: {
    type: Date,

    default: Date.now,

    index: true,
  },
});

/*
 * Expire documents after 3600 seconds.
 */

sessionSchema.index(
  {
    createdAt: 1,
  },

  {
    expireAfterSeconds: 3600,
  },
);

const Session =
  mongoose.models.MongooseIndexSession ||
  mongoose.model("MongooseIndexSession", sessionSchema);

/*
 * ============================================================
 * 26. TTL EXAMPLE
 * ============================================================
 */

async function createSession(token) {
  return Session.create({
    token,
  });
}

/*
 * MongoDB will automatically remove the document after the
 * TTL period has passed.
 */

/*
 * ============================================================
 * 27. MULTIKEY INDEX
 * ============================================================
 *
 * An index on an array field becomes a multikey index.
 *
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  name: String,

  skills: [String],
});

studentSchema.index({
  skills: 1,
});

const Student =
  mongoose.models.MongooseIndexStudent ||
  mongoose.model("MongooseIndexStudent", studentSchema);

/*
 * Query:
 *
 *     Student.find({
 *       skills: "Python"
 *     })
 *
 * can use the skills index.
 */

/*
 * ============================================================
 * 28. INDEX ON OBJECTID
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Department",
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Faculty",
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Subject",
  },
});

/*
 * ============================================================
 * 29. COMPOUND INDEX FOR TIMETABLE
 * ============================================================
 */

timetableSchema.index({
  departmentId: 1,

  facultyId: 1,

  subjectId: 1,
});

const Timetable =
  mongoose.models.MongooseIndexTimetable ||
  mongoose.model("MongooseIndexTimetable", timetableSchema);

/*
 * ============================================================
 * 30. ESR RULE
 * ============================================================
 *
 * ESR:
 *
 *     Equality
 *     Sort
 *     Range
 *
 * A common strategy for compound index design.
 *
 * Example query:
 *
 *     find({
 *       departmentId: X,
 *       active: true,
 *       createdAt: {
 *         $gte: date
 *       }
 *     })
 *
 *     .sort({
 *       priority: -1
 *     })
 *
 *
 * A candidate index could be designed around:
 *
 *     equality fields
 *     → sort fields
 *     → range fields
 *
 * Actual index design should be confirmed with explain().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. INDEX PREFIX
 * ============================================================
 *
 * Suppose:
 *
 *     { department: 1, createdAt: -1 }
 *
 *
 * This index can generally support queries beginning with:
 *
 *     department
 *
 * But an index whose first field is department is not
 * equivalent to an index whose first field is createdAt.
 *
 * Field order matters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. BAD INDEX ASSUMPTION
 * ============================================================
 *
 * Don't create:
 *
 *     50 indexes
 *
 * simply because indexes make reads faster.
 *
 * Every index also has costs:
 *
 *     INSERT → index maintenance
 *     UPDATE → index maintenance
 *     DELETE → index maintenance
 *     Storage → index consumes disk/RAM
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. INDEX SELECTIVITY
 * ============================================================
 *
 * An index is more useful when it can narrow down the result
 * set effectively.
 *
 * Example:
 *
 *     email
 *
 * often has high selectivity.
 *
 *
 * Whereas:
 *
 *     active: true
 *
 * may have poor selectivity if almost every document is active.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. QUERY + INDEX MUST MATCH
 * ============================================================
 *
 * Suppose you have:
 *
 *     { department: 1, createdAt: -1 }
 *
 *
 * Query:
 *
 *     find({
 *       department: "CSE"
 *     })
 *
 *     .sort({
 *       createdAt: -1
 *     })
 *
 * is a natural match.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. INDEX NAME
 * ============================================================
 */

const namedIndexSchema = new mongoose.Schema({
  department: String,

  createdAt: Date,
});

namedIndexSchema.index(
  {
    department: 1,

    createdAt: -1,
  },

  {
    name: "department_createdAt_idx",
  },
);

/*
 * ============================================================
 * 36. BACKGROUND / BUILDING INDEXES
 * ============================================================
 *
 * Modern MongoDB handles index builds differently from old
 * MongoDB versions.
 *
 * Avoid blindly copying old tutorials that recommend legacy
 * background-index options.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. AUTO INDEX
 * ============================================================
 *
 * Mongoose can automatically create indexes defined in the
 * schema depending on configuration/environment.
 *
 * Development:
 *
 *     autoIndex: true
 *
 * Production:
 *
 *     often disabled or managed explicitly
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. SCHEMA AUTO INDEX CONFIGURATION
 * ============================================================
 */

const productionSchema = new mongoose.Schema(
  {
    email: String,

    department: String,
  },

  {
    autoIndex: false,
  },
);

productionSchema.index({
  email: 1,
});

/*
 * ============================================================
 * 39. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(
    MONGODB_URI,

    {
      /*
       * Connection options should normally be configured
       * centrally rather than repeated throughout your models.
       */
    },
  );

  console.log("\nMongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Schema indexes
     * --------------------------------------------------------
     */

    console.log("\nSchema indexes:");

    console.dir(getSchemaIndexes(), {
      depth: null,
    });

    /*
     * --------------------------------------------------------
     * Ensure indexes
     * --------------------------------------------------------
     */

    await ensureIndexes();

    console.log("\nIndexes ensured");

    /*
     * --------------------------------------------------------
     * Database indexes
     * --------------------------------------------------------
     */

    const indexes = await getDatabaseIndexes();

    console.log("\nDatabase indexes:");

    console.dir(indexes, {
      depth: null,
    });

    /*
     * --------------------------------------------------------
     * Explain a query
     * --------------------------------------------------------
     */

    const explainResult = await explainEmailQuery("shiva@example.com");

    printExecutionStats(explainResult);
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
