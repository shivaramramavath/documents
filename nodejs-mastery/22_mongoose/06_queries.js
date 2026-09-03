/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     06_queries.js
 *
 * Topic:
 *     Mongoose Queries
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Query objects
 *     2. find()
 *     3. findOne()
 *     4. findById()
 *     5. Query chaining
 *     6. where()
 *     7. Query conditions
 *     8. Query execution
 *     9. await vs exec()
 *    10. Reusable queries
 *    11. Query inspection
 *    12. Query cloning
 *    13. Query options
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

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      lowercase: true,

      trim: true,
    },

    age: {
      type: Number,

      min: 16,

      max: 100,
    },

    department: {
      type: String,

      required: true,
    },

    semester: {
      type: Number,

      min: 1,

      max: 8,
    },

    active: {
      type: Boolean,

      default: true,
    },

    cgpa: {
      type: Number,

      min: 0,

      max: 10,
    },
  },

  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 3. MODEL
 * ============================================================
 */

const Student =
  mongoose.models.QueryStudent || mongoose.model("QueryStudent", studentSchema);

/*
 * ============================================================
 * 4. BASIC QUERY
 * ============================================================
 *
 * Student.find() DOES NOT immediately execute the database
 * operation.
 *
 * It creates a Query object.
 *
 * ============================================================
 */

const query = Student.find({
  department: "CSE",
});

console.log(query);

/*
 * ============================================================
 * 5. EXECUTE QUERY WITH await
 * ============================================================
 */

async function findCSEStudents() {
  const students = await Student.find({
    department: "CSE",
  });

  console.log(students);

  return students;
}

/*
 * ============================================================
 * 6. EXECUTE QUERY WITH exec()
 * ============================================================
 *
 * .exec() explicitly executes the Query.
 *
 * ============================================================
 */

async function findCSEStudentsWithExec() {
  const students = await Student.find({
    department: "CSE",
  }).exec();

  return students;
}

/*
 * ============================================================
 * 7. await VS exec()
 * ============================================================
 *
 *
 * Both work:
 *
 *
 *     await Student.find(...)
 *
 *
 *     await Student.find(...).exec()
 *
 *
 * .exec() makes the execution boundary explicit and gives a
 * real Promise.
 *
 * In larger applications, many teams prefer:
 *
 *     await query.exec();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. FIND ALL
 * ============================================================
 */

async function findAllStudents() {
  return Student.find().exec();
}

/*
 * ============================================================
 * 9. FIND ONE
 * ============================================================
 */

async function findOneStudent() {
  return Student.findOne({
    department: "CSE",
  }).exec();
}

/*
 * ============================================================
 * 10. FIND BY ID
 * ============================================================
 */

async function findStudentById(studentId) {
  return Student.findById(studentId).exec();
}

/*
 * ============================================================
 * 11. QUERY CHAINING
 * ============================================================
 *
 * Mongoose queries can be built step by step.
 *
 * ============================================================
 */

async function findActiveCSEStudents() {
  return Student.find({
    department: "CSE",
  })
    .where("active")
    .equals(true)
    .exec();
}

/*
 * ============================================================
 * 12. WHERE
 * ============================================================
 */

async function findStudentsUsingWhere() {
  return Student.find().where("department").equals("CSE").exec();
}

/*
 * ============================================================
 * 13. MULTIPLE WHERE CONDITIONS
 * ============================================================
 */

async function findStudentsUsingMultipleWhere() {
  return Student.find()
    .where("department")
    .equals("CSE")
    .where("semester")
    .gte(5)
    .where("active")
    .equals(true)
    .exec();
}

/*
 * ============================================================
 * 14. DIRECT FILTER OBJECT
 * ============================================================
 */

async function findStudentsWithFilter() {
  return Student.find({
    department: "CSE",

    semester: {
      $gte: 5,
    },

    active: true,
  }).exec();
}

/*
 * ============================================================
 * 15. QUERY WITH MULTIPLE CONDITIONS
 * ============================================================
 */

async function findMultipleConditions() {
  return Student.find({
    department: "CSE",

    active: true,

    cgpa: {
      $gte: 7,
    },
  }).exec();
}

/*
 * ============================================================
 * 16. SORT
 * ============================================================
 */

async function sortedStudents() {
  return Student.find()
    .sort({
      cgpa: -1,
    })
    .exec();
}

/*
 *     1  → ascending
 *    -1  → descending
 *
 *
 * cgpa: -1
 *
 * highest CGPA first.
 *
 */

/*
 * ============================================================
 * 17. MULTIPLE SORT FIELDS
 * ============================================================
 */

async function multipleSort() {
  return Student.find()
    .sort({
      department: 1,

      cgpa: -1,

      name: 1,
    })
    .exec();
}

/*
 * ============================================================
 * 18. LIMIT
 * ============================================================
 */

async function topStudents() {
  return Student.find()
    .sort({
      cgpa: -1,
    })
    .limit(10)
    .exec();
}

/*
 * ============================================================
 * 19. SKIP
 * ============================================================
 */

async function skipStudents() {
  return Student.find().skip(20).exec();
}

/*
 * ============================================================
 * 20. SKIP + LIMIT
 * ============================================================
 */

async function paginatedStudents(page, limit) {
  const skip = (page - 1) * limit;

  return Student.find().skip(skip).limit(limit).exec();
}

/*
 * ============================================================
 * 21. QUERY PROJECTION
 * ============================================================
 *
 * select() controls which fields are returned.
 *
 * ============================================================
 */

async function selectStudentFields() {
  return Student.find().select("name email department").exec();
}

/*
 * ============================================================
 * 22. EXCLUDE FIELDS
 * ============================================================
 */

async function excludeFields() {
  return Student.find().select("-email -createdAt -updatedAt").exec();
}

/*
 * ============================================================
 * 23. QUERY CHAIN WITH EVERYTHING
 * ============================================================
 */

async function advancedQuery() {
  return Student.find({
    department: "CSE",

    active: true,

    cgpa: {
      $gte: 7,
    },
  })

    .select("name email cgpa semester")

    .sort({
      cgpa: -1,

      name: 1,
    })

    .skip(0)

    .limit(10)

    .exec();
}

/*
 * ============================================================
 * 24. QUERY CONDITIONS
 * ============================================================
 */

/*
 * Equal
 */

async function equalQuery() {
  return Student.find({
    department: "CSE",
  }).exec();
}

/*
 * Greater than
 */

async function greaterThanQuery() {
  return Student.find({
    cgpa: {
      $gt: 8,
    },
  }).exec();
}

/*
 * Greater than or equal
 */

async function greaterThanOrEqualQuery() {
  return Student.find({
    cgpa: {
      $gte: 8,
    },
  }).exec();
}

/*
 * Less than
 */

async function lessThanQuery() {
  return Student.find({
    cgpa: {
      $lt: 6,
    },
  }).exec();
}

/*
 * Less than or equal
 */

async function lessThanOrEqualQuery() {
  return Student.find({
    cgpa: {
      $lte: 6,
    },
  }).exec();
}

/*
 * Not equal
 */

async function notEqualQuery() {
  return Student.find({
    department: {
      $ne: "CSE",
    },
  }).exec();
}

/*
 * ============================================================
 * 25. IN
 * ============================================================
 */

async function inQuery() {
  return Student.find({
    department: {
      $in: ["CSE", "ECE", "EEE"],
    },
  }).exec();
}

/*
 * ============================================================
 * 26. NOT IN
 * ============================================================
 */

async function notInQuery() {
  return Student.find({
    department: {
      $nin: ["CSE", "ECE"],
    },
  }).exec();
}

/*
 * ============================================================
 * 27. EXISTS
 * ============================================================
 */

async function existsQuery() {
  return Student.find({
    cgpa: {
      $exists: true,
    },
  }).exec();
}

/*
 * ============================================================
 * 28. REGEX
 * ============================================================
 */

async function regexQuery(search) {
  return Student.find({
    name: {
      $regex: search,

      $options: "i",
    },
  }).exec();
}

/*
 * ============================================================
 * 29. QUERY USING REGEXP
 * ============================================================
 */

async function regexpQuery() {
  return Student.find({
    name: /^shi/i,
  }).exec();
}

/*
 * ============================================================
 * 30. OR QUERY
 * ============================================================
 */

async function orQuery() {
  return Student.find({
    $or: [
      {
        department: "CSE",
      },

      {
        department: "ECE",
      },
    ],
  }).exec();
}

/*
 * ============================================================
 * 31. AND QUERY
 * ============================================================
 */

async function andQuery() {
  return Student.find({
    $and: [
      {
        active: true,
      },

      {
        cgpa: {
          $gte: 8,
        },
      },
    ],
  }).exec();
}

/*
 * ============================================================
 * 32. NOR QUERY
 * ============================================================
 */

async function norQuery() {
  return Student.find({
    $nor: [
      {
        department: "CSE",
      },

      {
        department: "ECE",
      },
    ],
  }).exec();
}

/*
 * ============================================================
 * 33. NOT
 * ============================================================
 */

async function notQuery() {
  return Student.find({
    cgpa: {
      $not: {
        $gte: 8,
      },
    },
  }).exec();
}

/*
 * ============================================================
 * 34. COUNT
 * ============================================================
 */

async function countQuery() {
  return Student.countDocuments({
    department: "CSE",
  }).exec();
}

/*
 * ============================================================
 * 35. EXISTS
 * ============================================================
 */

async function checkExists(email) {
  return Student.exists({
    email,
  }).exec();
}

/*
 * ============================================================
 * 36. DISTINCT
 * ============================================================
 */

async function distinctDepartments() {
  return Student.distinct("department").exec();
}

/*
 * ============================================================
 * 37. REUSABLE QUERY
 * ============================================================
 *
 * A Query object can be stored and modified before execution.
 *
 * ============================================================
 */

function activeStudentsQuery() {
  return Student.find({
    active: true,
  });
}

async function getActiveStudents() {
  const query = activeStudentsQuery();

  query.sort({
    name: 1,
  });

  query.limit(20);

  return query.exec();
}

/*
 * ============================================================
 * 38. QUERY CLONE
 * ============================================================
 *
 * A Query should not normally be executed multiple times.
 *
 * Use clone() when you need another execution of the same
 * query.
 *
 * ============================================================
 */

async function queryCloneExample() {
  const baseQuery = Student.find({
    active: true,
  });

  const firstQuery = baseQuery.clone().limit(10);

  const secondQuery = baseQuery.clone().limit(20);

  const [first, second] = await Promise.all([
    firstQuery.exec(),

    secondQuery.exec(),
  ]);

  return {
    first,

    second,
  };
}

/*
 * ============================================================
 * 39. QUERY GET FILTER
 * ============================================================
 */

function inspectQuery() {
  const query = Student.find({
    department: "CSE",

    active: true,
  });

  console.log("Filter:", query.getFilter());

  return query;
}

/*
 * ============================================================
 * 40. QUERY GET OPTIONS
 * ============================================================
 */

function inspectQueryOptions() {
  const query = Student.find({
    active: true,
  })
    .limit(10)
    .skip(20);

  console.log("Options:", query.getOptions());

  return query;
}

/*
 * ============================================================
 * 41. QUERY GET UPDATE
 * ============================================================
 *
 * Useful for update queries.
 * ============================================================
 */

function inspectUpdateQuery() {
  const query = Student.updateOne(
    {
      department: "CSE",
    },

    {
      $set: {
        active: true,
      },
    },
  );

  console.log("Filter:", query.getFilter());

  console.log("Update:", query.getUpdate());

  return query;
}

/*
 * ============================================================
 * 42. QUERY ERROR HANDLING
 * ============================================================
 */

async function safeQuery() {
  try {
    const students = await Student.find({
      active: true,
    }).exec();

    return students;
  } catch (error) {
    console.error("Query failed:", error);

    throw error;
  }
}

/*
 * ============================================================
 * 43. QUERY WITH TIMEOUT
 * ============================================================
 *
 * maxTimeMS tells MongoDB how long the server should spend
 * executing the operation.
 *
 * ============================================================
 */

async function queryWithTimeout() {
  return Student.find({
    active: true,
  })
    .maxTimeMS(5_000)
    .exec();
}

/*
 * ============================================================
 * 44. QUERY COMMENT
 * ============================================================
 *
 * Useful for identifying database operations in profiling
 * and observability.
 *
 * ============================================================
 */

async function queryWithComment() {
  return Student.find({
    department: "CSE",
  })
    .comment("Find active CSE students")
    .exec();
}

/*
 * ============================================================
 * 45. READ ONE QUERY
 * ============================================================
 */

async function firstStudent() {
  return Student.findOne().exec();
}

/*
 * ============================================================
 * 46. FIND ONE SORTED
 * ============================================================
 *
 * findOne() + sort()
 *
 * gives the first document according to the sort order.
 *
 * ============================================================
 */

async function highestCGPAStudent() {
  return Student.findOne()
    .sort({
      cgpa: -1,
    })
    .exec();
}

/*
 * ============================================================
 * 47. FIND BY ID
 * ============================================================
 *
 * findById(id)
 *
 * is essentially a convenient way to query _id.
 *
 * Conceptually:
 *
 *     findOne({
 *         _id: id
 *     })
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. QUERY WITH MULTIPLE SORT + FILTER
 * ============================================================
 */

async function advancedStudentSearch() {
  return Student.find({
    active: true,

    department: {
      $in: ["CSE", "ECE"],
    },

    cgpa: {
      $gte: 7,
    },
  })

    .select({
      name: 1,

      email: 1,

      department: 1,

      cgpa: 1,
    })

    .sort({
      cgpa: -1,

      name: 1,
    })

    .limit(20)

    .exec();
}

/*
 * ============================================================
 * 49. QUERY BUILDING FUNCTION
 * ============================================================
 *
 * This pattern becomes useful in APIs.
 *
 * ============================================================
 */

function buildStudentQuery({
  department,

  active,

  minCgpa,

  search,
}) {
  const filter = {};

  if (department) {
    filter.department = department;
  }

  if (active !== undefined) {
    filter.active = active;
  }

  if (minCgpa !== undefined) {
    filter.cgpa = {
      $gte: minCgpa,
    };
  }

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  return Student.find(filter);
}

async function searchStudents() {
  return buildStudentQuery({
    department: "CSE",

    active: true,

    minCgpa: 7,

    search: "shi",
  })
    .sort({
      cgpa: -1,
    })
    .limit(10)
    .exec();
}

/*
 * ============================================================
 * 50. COMPLETE QUERY DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * Basic find
     */

    const students = await Student.find({
      active: true,
    }).exec();

    console.log("\nActive students:", students);

    /*
     * Filter + projection + sort + limit
     */

    const topStudents = await Student.find({
      active: true,

      cgpa: {
        $gte: 7,
      },
    })

      .select("name department cgpa")

      .sort({
        cgpa: -1,
      })

      .limit(5)

      .exec();

    console.log("\nTop students:", topStudents);

    /*
     * Count
     */

    const count = await Student.countDocuments({
      active: true,
    }).exec();

    console.log("\nActive count:", count);

    /*
     * Distinct
     */

    const departments = await Student.distinct("department").exec();

    console.log("\nDepartments:", departments);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 51. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * FINAL QUERY FLOW
 * ============================================================
 *
 *
 * Student.find(filter)
 *          │
 *          ▼
 *      Query object
 *          │
 *          ├── select()
 *          ├── sort()
 *          ├── skip()
 *          ├── limit()
 *          ├── populate()
 *          ├── lean()
 *          │
 *          ▼
 *       exec()
 *          │
 *          ▼
 *      MongoDB
 *          │
 *          ▼
 *       Result
 *
 * ============================================================
 */
