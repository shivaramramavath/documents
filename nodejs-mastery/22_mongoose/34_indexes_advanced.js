/**
 * ============================================================
 * 34_indexes_advanced.js
 * ============================================================
 *
 * Advanced MongoDB / Mongoose Indexes
 *
 * Topics:
 *
 *  1. Single-field index
 *  2. Compound index
 *  3. Compound index ordering
 *  4. Unique index
 *  5. Partial index
 *  6. Sparse index
 *  7. TTL index
 *  8. Multikey index
 *  9. Text index
 * 10. Collation
 * 11. Index options
 * 12. explain()
 * 13. Covered queries
 * 14. Index prefixes
 * 15. Index design
 * 16. Production patterns
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
  },

  email: {
    type: String,

    required: true,
  },

  department: {
    type: String,
  },

  status: {
    type: String,

    enum: ["active", "inactive"],

    default: "active",
  },

  age: {
    type: Number,
  },

  tags: {
    type: [String],

    default: [],
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * ============================================================
 * 3. SINGLE FIELD INDEX
 * ============================================================
 */

userSchema.index({
  email: 1,
});

/*
 * 1  = ascending
 * -1 = descending
 */

/*
 * ============================================================
 * 4. COMPOUND INDEX
 * ============================================================
 */

userSchema.index({
  department: 1,

  status: 1,
});

/*
 * Supports queries such as:
 *
 * {
 *   department: "CSE",
 *   status: "active"
 * }
 */

/*
 * ============================================================
 * 5. COMPOUND INDEX WITH SORT
 * ============================================================
 */

userSchema.index({
  department: 1,

  createdAt: -1,
});

/*
 * Useful for:
 *
 * find users in a department
 * sorted by newest first.
 *
 *
 * Example:
 *
 * User.find({
 *   department: "CSE"
 * })
 * .sort({
 *   createdAt: -1
 * });
 */

/*
 * ============================================================
 * 6. UNIQUE INDEX
 * ============================================================
 */

userSchema.index(
  {
    email: 1,
  },

  {
    unique: true,
  },
);

/*
 * ============================================================
 * 7. PARTIAL INDEX
 * ============================================================
 *
 * Index only documents satisfying
 * the partialFilterExpression.
 *
 * ============================================================
 */

userSchema.index(
  {
    email: 1,
  },

  {
    unique: true,

    partialFilterExpression: {
      status: "active",
    },
  },
);

/*
 * This allows:
 *
 * active users:
 *     unique email
 *
 * inactive users:
 *     not included in this index
 */

/*
 * ============================================================
 * 8. SPARSE INDEX
 * ============================================================
 */

const profileSchema = new mongoose.Schema({
  name: String,

  phone: String,
});

profileSchema.index(
  {
    phone: 1,
  },

  {
    sparse: true,
  },
);

/*
 * Sparse index only contains
 * documents where the indexed
 * field exists.
 */

/*
 * ============================================================
 * 9. TTL INDEX
 * ============================================================
 */

const sessionSchema = new mongoose.Schema({
  token: String,

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

sessionSchema.index(
  {
    createdAt: 1,
  },

  {
    expireAfterSeconds: 60 * 60,
  },
);

/*
 * Documents automatically become
 * eligible for removal one hour
 * after createdAt.
 *
 *
 * TTL deletion is handled by
 * MongoDB's TTL monitor.
 */

/*
 * ============================================================
 * 10. MULTIKEY INDEX
 * ============================================================
 */

const courseSchema = new mongoose.Schema({
  name: String,

  tags: {
    type: [String],

    default: [],
  },
});

courseSchema.index({
  tags: 1,
});

/*
 * Because tags is an array,
 * MongoDB creates a multikey index.
 */

/*
 * Query:
 *
 * Course.find({
 *   tags: "mongodb"
 * });
 */

/*
 * ============================================================
 * 11. TEXT INDEX
 * ============================================================
 */

const articleSchema = new mongoose.Schema({
  title: String,

  description: String,

  content: String,
});

articleSchema.index({
  title: "text",

  description: "text",

  content: "text",
});

/*
 * Text search:
 *
 * Article.find({
 *
 *   $text: {
 *     $search: "mongodb mongoose"
 *   }
 *
 * });
 */

/*
 * ============================================================
 * 12. TEXT INDEX WITH WEIGHTS
 * ============================================================
 */

const weightedArticleSchema = new mongoose.Schema({
  title: String,

  content: String,

  tags: [String],
});

weightedArticleSchema.index(
  {
    title: "text",

    content: "text",

    tags: "text",
  },

  {
    weights: {
      title: 10,

      tags: 5,

      content: 1,
    },

    name: "article_text_search",
  },
);

/*
 * Higher weight means
 * greater relevance contribution.
 */

/*
 * ============================================================
 * 13. COLLATION INDEX
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: String,

  code: String,
});

departmentSchema.index(
  {
    name: 1,
  },

  {
    collation: {
      locale: "en",

      strength: 2,
    },
  },
);

/*
 * Collation controls
 * language-aware comparison,
 * including case/diacritic
 * sensitivity.
 */

/*
 * ============================================================
 * 14. INDEX WITH NAME
 * ============================================================
 */

departmentSchema.index(
  {
    code: 1,
  },

  {
    name: "department_code_idx",
  },
);

/*
 * Explicit index names are useful
 * for production database management.
 */

/*
 * ============================================================
 * 15. HIDDEN INDEX
 * ============================================================
 *
 * Hidden indexes are useful for
 * testing index removal without
 * immediately dropping the index.
 *
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  department: String,

  semester: Number,

  year: Number,

  createdAt: Date,
});

timetableSchema.index(
  {
    department: 1,

    semester: 1,
  },

  {
    name: "timetable_department_semester_idx",

    hidden: true,
  },
);

/*
 * ============================================================
 * 16. COMPOUND INDEX ORDER
 * ============================================================
 */

timetableSchema.index({
  department: 1,

  semester: 1,

  year: -1,
});

/*
 * Think:
 *
 * {
 *   department: 1,
 *   semester: 1,
 *   year: -1
 * }
 *
 *
 * Index ordering matters.
 */

/*
 * ============================================================
 * 17. LEFTMOST PREFIX
 * ============================================================
 */

const facultySchema = new mongoose.Schema({
  department: String,

  designation: String,

  experience: Number,
});

facultySchema.index({
  department: 1,

  designation: 1,

  experience: -1,
});

/*
 * This compound index can help with:
 *
 * 1.
 *
 * department
 *
 *
 * 2.
 *
 * department + designation
 *
 *
 * 3.
 *
 * department + designation + experience
 *
 *
 * But generally it is not equivalent
 * to having an index starting with:
 *
 * designation
 *
 * alone.
 */

/*
 * ============================================================
 * 18. INDEX FOR COMMON API QUERY
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  collegeId: mongoose.Schema.Types.ObjectId,

  departmentId: mongoose.Schema.Types.ObjectId,

  semester: Number,

  status: String,

  createdAt: Date,
});

studentSchema.index({
  collegeId: 1,

  departmentId: 1,

  semester: 1,

  createdAt: -1,
});

/*
 * Query:
 *
 * Student.find({
 *
 *   collegeId,
 *
 *   departmentId,
 *
 *   semester,
 *
 * })
 *
 * .sort({
 *   createdAt: -1
 * });
 */

/*
 * ============================================================
 * 19. QUERY EXPLAIN
 * ============================================================
 */

async function explainQuery() {
  const result = await mongoose
    .model("User")
    .find({
      department: "CSE",

      status: "active",
    })
    .explain("executionStats");

  console.log(result);
}

/*
 * ============================================================
 * 20. EXPLAIN QUERY STAGES
 * ============================================================
 *
 * Important values:
 *
 * winningPlan
 * executionStats
 * nReturned
 * totalKeysExamined
 * totalDocsExamined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. QUERY USING INDEX
 * ============================================================
 */

async function explainTimetableQuery(Timetable) {
  const result = await Timetable.find({
    department: "CSE",

    semester: 5,
  })
    .sort({
      year: -1,
    })
    .explain("executionStats");

  console.log(JSON.stringify(result, null, 2));
}

/*
 * ============================================================
 * 22. INDEX INFORMATION
 * ============================================================
 */

async function listIndexes(Model) {
  const indexes = await Model.collection.indexes();

  console.log(indexes);

  return indexes;
}

/*
 * ============================================================
 * 23. CREATE INDEX MANUALLY
 * ============================================================
 */

async function createIndex(Model) {
  const indexName = await Model.collection.createIndex(
    {
      department: 1,

      createdAt: -1,
    },

    {
      name: "department_created_idx",
    },
  );

  console.log(indexName);
}

/*
 * ============================================================
 * 24. DROP INDEX
 * ============================================================
 */

async function dropIndex(Model) {
  await Model.collection.dropIndex("department_created_idx");
}

/*
 * ============================================================
 * 25. HIDE INDEX
 * ============================================================
 */

async function hideIndex(Model) {
  await Model.collection.collMod(
    Model.collection.name,

    {
      index: {
        name: "department_created_idx",

        hidden: true,
      },
    },
  );
}

/*
 * ============================================================
 * 26. UNHIDE INDEX
 * ============================================================
 */

async function unhideIndex(Model) {
  await Model.collection.collMod(
    Model.collection.name,

    {
      index: {
        name: "department_created_idx",

        hidden: false,
      },
    },
  );
}

/*
 * ============================================================
 * 27. COVERED QUERY
 * ============================================================
 */

const facultyDirectorySchema = new mongoose.Schema({
  facultyId: String,

  department: String,

  name: String,
});

facultyDirectorySchema.index({
  department: 1,

  name: 1,
});

const FacultyDirectory =
  mongoose.models.FacultyDirectory ||
  mongoose.model("FacultyDirectory", facultyDirectorySchema);

async function coveredQuery() {
  const result = await FacultyDirectory.find(
    {
      department: "CSE",
    },

    {
      _id: 0,

      name: 1,
    },
  ).explain("executionStats");

  console.log(result);
}

/*
 * ============================================================
 * 28. INDEX SORT ORDER
 * ============================================================
 */

const timetableQuerySchema = new mongoose.Schema({
  department: String,

  createdAt: Date,

  title: String,
});

timetableQuerySchema.index({
  department: 1,

  createdAt: -1,
});

/*
 * This is useful for:
 *
 * find({
 *   department: "CSE"
 * })
 *
 * sort({
 *   createdAt: -1
 * })
 */

/*
 * ============================================================
 * 29. PARTIAL INDEX EXAMPLE
 * ============================================================
 */

const activeFacultySchema = new mongoose.Schema({
  email: String,

  status: String,

  department: String,
});

activeFacultySchema.index(
  {
    email: 1,
  },

  {
    unique: true,

    partialFilterExpression: {
      status: "active",
    },
  },
);

/*
 * ============================================================
 * 30. PARTIAL INDEX FOR TIMETABLE
 * ============================================================
 */

const publishedTimetableSchema = new mongoose.Schema({
  departmentId: mongoose.Schema.Types.ObjectId,

  semester: Number,

  status: String,

  version: Number,
});

publishedTimetableSchema.index(
  {
    departmentId: 1,

    semester: 1,

    version: -1,
  },

  {
    partialFilterExpression: {
      status: "published",
    },
  },
);

/*
 * Only published documents
 * participate in this index.
 */

/*
 * ============================================================
 * 31. MULTIKEY + COMPOUND INDEX
 * ============================================================
 */

const subjectSchema = new mongoose.Schema({
  department: String,

  tags: [String],

  semester: Number,
});

subjectSchema.index({
  department: 1,

  tags: 1,
});

/*
 * tags becomes a multikey
 * component of the index.
 */

/*
 * ============================================================
 * 32. IMPORTANT MULTIKEY LIMITATION
 * ============================================================
 *
 * Avoid designing compound indexes
 * that require multiple array fields
 * in the same document.
 *
 * Example:
 *
 * {
 *   tags: [String],
 *   subjects: [String]
 * }
 *
 * with:
 *
 * {
 *   tags: 1,
 *   subjects: 1
 * }
 *
 * can lead to problematic index
 * design because MongoDB cannot
 * index multiple array paths in
 * the same compound index in the
 * general case.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. INDEX DESIGN HELPER
 * ============================================================
 */

function explainIndexDesign() {
  console.log(`

  INDEX DESIGN CHECKLIST

  1. What queries are frequent?

  2. What fields are filtered?

  3. What fields are sorted?

  4. What fields are ranged?

  5. What fields are projected?

  6. How selective is the index?

  7. How many writes occur?

  8. How large is the collection?

  9. Is the index actually used?

  10. Does explain() confirm the design?

  `);
}

/*
 * ============================================================
 * 34. MODEL DEFINITIONS
 * ============================================================
 */

const User =
  mongoose.models.AdvancedIndexUser ||
  mongoose.model("AdvancedIndexUser", userSchema);

const Profile =
  mongoose.models.AdvancedIndexProfile ||
  mongoose.model("AdvancedIndexProfile", profileSchema);

const Session =
  mongoose.models.AdvancedIndexSession ||
  mongoose.model("AdvancedIndexSession", sessionSchema);

const Course =
  mongoose.models.AdvancedIndexCourse ||
  mongoose.model("AdvancedIndexCourse", courseSchema);

const Article =
  mongoose.models.AdvancedIndexArticle ||
  mongoose.model("AdvancedIndexArticle", articleSchema);

const WeightedArticle =
  mongoose.models.AdvancedIndexWeightedArticle ||
  mongoose.model("AdvancedIndexWeightedArticle", weightedArticleSchema);

const Department =
  mongoose.models.AdvancedIndexDepartment ||
  mongoose.model("AdvancedIndexDepartment", departmentSchema);

const Timetable =
  mongoose.models.AdvancedIndexTimetable ||
  mongoose.model("AdvancedIndexTimetable", timetableSchema);

const Student =
  mongoose.models.AdvancedIndexStudent ||
  mongoose.model("AdvancedIndexStudent", studentSchema);

/*
 * ============================================================
 * 35. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  /*
   * Run examples individually.
   */

  // await listIndexes(User);

  // await explainQuery();

  // await explainTimetableQuery(Timetable);

  // await coveredQuery();

  explainIndexDesign();

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
