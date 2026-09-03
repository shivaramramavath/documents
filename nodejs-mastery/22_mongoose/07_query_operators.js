/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     07_query_operators.js
 *
 * Topic:
 *     MongoDB Query Operators with Mongoose
 *
 * ============================================================
 *
 * Operator Categories
 *
 *     1. Comparison operators
 *     2. Logical operators
 *     3. Element operators
 *     4. Evaluation operators
 *     5. Array operators
 *     6. Bitwise operators
 *     7. $expr
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
    },

    age: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },

    department: {
      type: String,
    },

    semester: {
      type: Number,
    },

    active: {
      type: Boolean,

      default: true,
    },

    skills: {
      type: [String],

      default: [],
    },

    marks: {
      type: [Number],

      default: [],
    },

    address: {
      city: String,

      state: String,

      pincode: String,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
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
  mongoose.models.OperatorStudent ||
  mongoose.model("OperatorStudent", studentSchema);

/*
 * ============================================================
 * COMPARISON OPERATORS
 * ============================================================
 */

/*
 * ============================================================
 * 4. $eq
 * ============================================================
 *
 * Equal to.
 *
 * ============================================================
 */

async function equalOperator() {
  return Student.find({
    age: {
      $eq: 21,
    },
  }).exec();
}

/*
 * Usually this is simply written as:
 *
 *     { age: 21 }
 *
 */

/*
 * ============================================================
 * 5. $ne
 * ============================================================
 *
 * Not equal to.
 *
 * ============================================================
 */

async function notEqualOperator() {
  return Student.find({
    department: {
      $ne: "CSE",
    },
  }).exec();
}

/*
 * ============================================================
 * 6. $gt
 * ============================================================
 *
 * Greater than.
 *
 * ============================================================
 */

async function greaterThanOperator() {
  return Student.find({
    age: {
      $gt: 20,
    },
  }).exec();
}

/*
 * ============================================================
 * 7. $gte
 * ============================================================
 *
 * Greater than or equal.
 *
 * ============================================================
 */

async function greaterThanOrEqualOperator() {
  return Student.find({
    cgpa: {
      $gte: 8,
    },
  }).exec();
}

/*
 * ============================================================
 * 8. $lt
 * ============================================================
 *
 * Less than.
 *
 * ============================================================
 */

async function lessThanOperator() {
  return Student.find({
    age: {
      $lt: 25,
    },
  }).exec();
}

/*
 * ============================================================
 * 9. $lte
 * ============================================================
 *
 * Less than or equal.
 * ============================================================
 */

async function lessThanOrEqualOperator() {
  return Student.find({
    cgpa: {
      $lte: 6,
    },
  }).exec();
}

/*
 * ============================================================
 * 10. RANGE QUERY
 * ============================================================
 */

async function ageRange() {
  return Student.find({
    age: {
      $gte: 18,

      $lte: 25,
    },
  }).exec();
}

/*
 * ============================================================
 * 11. $in
 * ============================================================
 *
 * Value must match one of the supplied values.
 * ============================================================
 */

async function inOperator() {
  return Student.find({
    department: {
      $in: ["CSE", "ECE", "EEE"],
    },
  }).exec();
}

/*
 * ============================================================
 * 12. $nin
 * ============================================================
 *
 * Value must NOT match any supplied value.
 * ============================================================
 */

async function ninOperator() {
  return Student.find({
    department: {
      $nin: ["CSE", "ECE"],
    },
  }).exec();
}

/*
 * ============================================================
 * LOGICAL OPERATORS
 * ============================================================
 */

/*
 * ============================================================
 * 13. $and
 * ============================================================
 *
 * ALL conditions must be true.
 *
 * ============================================================
 */

async function andOperator() {
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
 * 14. IMPLICIT AND
 * ============================================================
 *
 * Most of the time $and is unnecessary.
 *
 * This:
 *
 *     {
 *       active: true,
 *       cgpa: { $gte: 8 }
 *     }
 *
 * already means:
 *
 *     active == true
 *     AND
 *     cgpa >= 8
 *
 * ============================================================
 */

async function implicitAnd() {
  return Student.find({
    active: true,

    cgpa: {
      $gte: 8,
    },
  }).exec();
}

/*
 * ============================================================
 * 15. $or
 * ============================================================
 *
 * At least ONE condition must be true.
 *
 * ============================================================
 */

async function orOperator() {
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
 * 16. $nor
 * ============================================================
 *
 * NONE of the conditions should be true.
 *
 * ============================================================
 */

async function norOperator() {
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
 * 17. $not
 * ============================================================
 *
 * Negates a condition.
 *
 * ============================================================
 */

async function notOperator() {
  return Student.find({
    age: {
      $not: {
        $gte: 25,
      },
    },
  }).exec();
}

/*
 * ============================================================
 * 18. COMPLEX LOGICAL QUERY
 * ============================================================
 */

async function complexLogicalQuery() {
  return Student.find({
    active: true,

    $or: [
      {
        cgpa: {
          $gte: 8,
        },
      },

      {
        semester: {
          $gte: 7,
        },
      },
    ],
  }).exec();
}

/*
 * ============================================================
 * ELEMENT OPERATORS
 * ============================================================
 */

/*
 * ============================================================
 * 19. $exists
 * ============================================================
 *
 * Checks whether a field exists.
 *
 * ============================================================
 */

async function existsOperator() {
  return Student.find({
    cgpa: {
      $exists: true,
    },
  }).exec();
}

/*
 * Field does not exist:
 */

async function fieldDoesNotExist() {
  return Student.find({
    cgpa: {
      $exists: false,
    },
  }).exec();
}

/*
 * ============================================================
 * 20. $type
 * ============================================================
 *
 * Matches documents where the field has a particular BSON type.
 *
 * ============================================================
 */

async function typeOperator() {
  return Student.find({
    age: {
      $type: "number",
    },
  }).exec();
}

/*
 * ============================================================
 * EVALUATION OPERATORS
 * ============================================================
 */

/*
 * ============================================================
 * 21. $regex
 * ============================================================
 */

async function regexOperator(search) {
  return Student.find({
    name: {
      $regex: search,

      $options: "i",
    },
  }).exec();
}

/*
 * ============================================================
 * 22. REGEX STARTS WITH
 * ============================================================
 */

async function startsWithOperator(prefix) {
  return Student.find({
    name: {
      $regex: `^${prefix}`,

      $options: "i",
    },
  }).exec();
}

/*
 * ============================================================
 * 23. REGEX ENDS WITH
 * ============================================================
 */

async function endsWithOperator(suffix) {
  return Student.find({
    name: {
      $regex: `${suffix}$`,

      $options: "i",
    },
  }).exec();
}

/*
 * ============================================================
 * 24. $text
 * ============================================================
 *
 * Requires a MongoDB text index.
 *
 * Example:
 *
 *     studentSchema.index({
 *       name: "text"
 *     });
 *
 * Then:
 *
 *     {
 *       $text: {
 *         $search: "shiva"
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. $where
 * ============================================================
 *
 * Allows JavaScript expressions on the server.
 *
 * Generally avoid this in application code.
 *
 * It can be slower and is difficult to optimize.
 *
 * ============================================================
 */

/*
 * ============================================================
 * ARRAY OPERATORS
 * ============================================================
 */

/*
 * ============================================================
 * 26. $all
 * ============================================================
 *
 * Array must contain ALL specified values.
 *
 * ============================================================
 */

async function allOperator() {
  return Student.find({
    skills: {
      $all: ["Python", "MongoDB"],
    },
  }).exec();
}

/*
 * ============================================================
 * 27. $size
 * ============================================================
 *
 * Array must have exactly the specified number of elements.
 *
 * ============================================================
 */

async function sizeOperator() {
  return Student.find({
    skills: {
      $size: 3,
    },
  }).exec();
}

/*
 * ============================================================
 * 28. $elemMatch
 * ============================================================
 *
 * Matches at least one array element satisfying ALL conditions.
 *
 * ============================================================
 */

async function elemMatchOperator() {
  return Student.find({
    marks: {
      $elemMatch: {
        $gte: 80,

        $lte: 90,
      },
    },
  }).exec();
}

/*
 * ============================================================
 * 29. ARRAY MATCHING
 * ============================================================
 *
 * Simple array query:
 *
 *     { skills: "Python" }
 *
 * means the array contains "Python".
 *
 * ============================================================
 */

async function arrayContainsValue() {
  return Student.find({
    skills: "Python",
  }).exec();
}

/*
 * ============================================================
 * 30. ARRAY IN
 * ============================================================
 */

async function arrayInOperator() {
  return Student.find({
    skills: {
      $in: ["Python", "JavaScript"],
    },
  }).exec();
}

/*
 * ============================================================
 * 31. ARRAY NIN
 * ============================================================
 */

async function arrayNinOperator() {
  return Student.find({
    skills: {
      $nin: ["Java", "C++"],
    },
  }).exec();
}

/*
 * ============================================================
 * 32. NESTED OBJECT QUERY
 * ============================================================
 */

async function nestedFieldQuery() {
  return Student.find({
    "address.city": "Vijayawada",
  }).exec();
}

/*
 * ============================================================
 * 33. NESTED FIELD RANGE
 * ============================================================
 */

async function nestedFieldRange() {
  return Student.find({
    "address.pincode": {
      $regex: "^52",
    },
  }).exec();
}

/*
 * ============================================================
 * 34. $expr
 * ============================================================
 *
 * Allows aggregation expressions inside a query.
 *
 * Useful when comparing fields with each other.
 *
 * ============================================================
 */

async function exprOperator() {
  return Student.find({
    $expr: {
      $gte: ["$cgpa", 8],
    },
  }).exec();
}

/*
 * ============================================================
 * 35. $expr FIELD COMPARISON
 * ============================================================
 *
 * Example:
 *
 *     Compare two fields.
 *
 * ============================================================
 *
 * Suppose document has:
 *
 *     internalMarks
 *     externalMarks
 *
 * We could compare them using $expr.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. $expr WITH $and
 * ============================================================
 */

async function complexExpr() {
  return Student.find({
    $expr: {
      $and: [
        {
          $gte: ["$cgpa", 7],
        },

        {
          $lte: ["$cgpa", 10],
        },
      ],
    },
  }).exec();
}

/*
 * ============================================================
 * BITWISE OPERATORS
 * ============================================================
 *
 * These operate on integer values at the bit level.
 *
 *     $bitsAllSet
 *     $bitsAnySet
 *     $bitsAllClear
 *     $bitsAnyClear
 *
 * These are advanced operators and are less common in normal
 * CRUD applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. $bitsAllSet
 * ============================================================
 */

async function bitsAllSet() {
  return Student.find({
    flags: {
      $bitsAllSet: 2,
    },
  }).exec();
}

/*
 * ============================================================
 * 38. $bitsAnySet
 * ============================================================
 */

async function bitsAnySet() {
  return Student.find({
    flags: {
      $bitsAnySet: 2,
    },
  }).exec();
}

/*
 * ============================================================
 * 39. $bitsAllClear
 * ============================================================
 */

async function bitsAllClear() {
  return Student.find({
    flags: {
      $bitsAllClear: 2,
    },
  }).exec();
}

/*
 * ============================================================
 * 40. $bitsAnyClear
 * ============================================================
 */

async function bitsAnyClear() {
  return Student.find({
    flags: {
      $bitsAnyClear: 2,
    },
  }).exec();
}

/*
 * ============================================================
 * 41. COMBINING OPERATORS
 * ============================================================
 */

async function combinedQuery() {
  return Student.find({
    age: {
      $gte: 18,

      $lte: 25,
    },

    department: {
      $in: ["CSE", "ECE"],
    },

    cgpa: {
      $gte: 7,
    },

    active: true,

    skills: {
      $all: ["Python"],
    },
  }).exec();
}

/*
 * ============================================================
 * 42. REAL SEARCH QUERY
 * ============================================================
 *
 * This is closer to what you would build in an API.
 *
 * ============================================================
 */

async function searchStudents({
  search,

  departments,

  minAge,

  maxAge,

  minCgpa,

  active,
}) {
  const filter = {};

  /*
   * ----------------------------------------------------------
   * Name search
   * ----------------------------------------------------------
   */

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  /*
   * ----------------------------------------------------------
   * Department filter
   * ----------------------------------------------------------
   */

  if (departments?.length) {
    filter.department = {
      $in: departments,
    };
  }

  /*
   * ----------------------------------------------------------
   * Age range
   * ----------------------------------------------------------
   */

  if (minAge !== undefined || maxAge !== undefined) {
    filter.age = {};

    if (minAge !== undefined) {
      filter.age.$gte = minAge;
    }

    if (maxAge !== undefined) {
      filter.age.$lte = maxAge;
    }
  }

  /*
   * ----------------------------------------------------------
   * CGPA
   * ----------------------------------------------------------
   */

  if (minCgpa !== undefined) {
    filter.cgpa = {
      $gte: minCgpa,
    };
  }

  /*
   * ----------------------------------------------------------
   * Active
   * ----------------------------------------------------------
   */

  if (active !== undefined) {
    filter.active = active;
  }

  return Student.find(filter)
    .sort({
      cgpa: -1,
    })
    .exec();
}

/*
 * ============================================================
 * 43. PAGINATED SEARCH
 * ============================================================
 */

async function paginatedSearch({
  search,

  department,

  page = 1,

  limit = 20,
}) {
  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  if (department) {
    filter.department = department;
  }

  const skip = (page - 1) * limit;

  return Student.find(filter)

    .sort({
      cgpa: -1,

      name: 1,
    })

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * 44. OPERATOR CHEAT SHEET
 * ============================================================
 *
 *
 * COMPARISON
 *
 *     $eq
 *     $ne
 *     $gt
 *     $gte
 *     $lt
 *     $lte
 *     $in
 *     $nin
 *
 *
 * LOGICAL
 *
 *     $and
 *     $or
 *     $nor
 *     $not
 *
 *
 * ELEMENT
 *
 *     $exists
 *     $type
 *
 *
 * EVALUATION
 *
 *     $expr
 *     $regex
 *     $text
 *     $where
 *
 *
 * ARRAY
 *
 *     $all
 *     $elemMatch
 *     $size
 *
 *
 * BITWISE
 *
 *     $bitsAllSet
 *     $bitsAnySet
 *     $bitsAllClear
 *     $bitsAnyClear
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. COMPLETE DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Comparison
     * --------------------------------------------------------
     */

    const students = await Student.find({
      age: {
        $gte: 18,

        $lte: 25,
      },
    }).exec();

    console.log("\nAge 18-25:", students);

    /*
     * --------------------------------------------------------
     * Logical
     * --------------------------------------------------------
     */

    const activeStudents = await Student.find({
      active: true,

      $or: [
        {
          department: "CSE",
        },

        {
          department: "ECE",
        },
      ],
    }).exec();

    console.log("\nActive CSE/ECE:", activeStudents);

    /*
     * --------------------------------------------------------
     * Array
     * --------------------------------------------------------
     */

    const pythonStudents = await Student.find({
      skills: {
        $all: ["Python"],
      },
    }).exec();

    console.log("\nPython students:", pythonStudents);

    /*
     * --------------------------------------------------------
     * Regex
     * --------------------------------------------------------
     */

    const searchedStudents = await Student.find({
      name: {
        $regex: "shiva",

        $options: "i",
      },
    }).exec();

    console.log("\nSearch results:", searchedStudents);

    /*
     * --------------------------------------------------------
     * Nested field
     * --------------------------------------------------------
     */

    const vijayawadaStudents = await Student.find({
      "address.city": "Vijayawada",
    }).exec();

    console.log("\nVijayawada students:", vijayawadaStudents);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 46. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
