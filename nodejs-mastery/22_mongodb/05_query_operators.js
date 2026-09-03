/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/05_query_operators.js
 *
 * Topic:
 *     MongoDB Query Operators
 *
 * ============================================================
 *
 * Query operators allow us to build expressive filters.
 *
 *
 * Categories:
 *
 * 1. Comparison
 * 2. Logical
 * 3. Element
 * 4. Array
 * 5. Evaluation
 * 6. Bitwise
 * 7. Expression
 *
 * ============================================================
 */

import { MongoClient } from "mongodb";

/*
 * ============================================================
 * 1. CONNECTION
 * ============================================================
 */

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "timetable";

const client = new MongoClient(URI);

function users() {
  return client.db(DATABASE_NAME).collection("users");
}

/*
 * ============================================================
 * 2. COMPARISON OPERATORS
 * ============================================================
 *
 * $eq   → equal
 * $ne   → not equal
 * $gt   → greater than
 * $gte  → greater than or equal
 * $lt   → less than
 * $lte  → less than or equal
 * $in   → matches any value
 * $nin  → matches none of the values
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. $eq
 * ============================================================
 */

async function equalExample() {
  return users()
    .find({
      age: {
        $eq: 22,
      },
    })
    .toArray();
}

/*
 * Usually this is simpler:
 *
 *
 *     { age: 22 }
 *
 *
 * which is equivalent to:
 *
 *
 *     { age: { $eq: 22 } }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. $ne
 * ============================================================
 */

async function notEqualExample() {
  return users()
    .find({
      department: {
        $ne: "CSE",
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 5. $gt
 * ============================================================
 */

async function greaterThanExample() {
  return users()
    .find({
      age: {
        $gt: 18,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 6. $gte
 * ============================================================
 */

async function greaterThanOrEqualExample() {
  return users()
    .find({
      age: {
        $gte: 18,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 7. $lt
 * ============================================================
 */

async function lessThanExample() {
  return users()
    .find({
      age: {
        $lt: 25,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 8. $lte
 * ============================================================
 */

async function lessThanOrEqualExample() {
  return users()
    .find({
      age: {
        $lte: 25,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 9. RANGE QUERY
 * ============================================================
 */

async function ageRange() {
  return users()
    .find({
      age: {
        $gte: 18,

        $lte: 25,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 10. $in
 * ============================================================
 *
 * Match any value from an array.
 *
 * ============================================================
 */

async function inExample() {
  return users()
    .find({
      department: {
        $in: ["CSE", "ECE", "IT"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 11. $nin
 * ============================================================
 */

async function ninExample() {
  return users()
    .find({
      department: {
        $nin: ["CSE", "ECE"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 12. COMBINING COMPARISONS
 * ============================================================
 */

async function advancedAgeQuery() {
  return users()
    .find({
      age: {
        $gte: 18,

        $lt: 30,
      },

      active: true,
    })
    .toArray();
}

/*
 * ============================================================
 * 13. LOGICAL OPERATORS
 * ============================================================
 *
 * $and
 * $or
 * $nor
 * $not
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. $and
 * ============================================================
 */

async function andExample() {
  return users()
    .find({
      $and: [
        {
          age: {
            $gte: 18,
          },
        },

        {
          age: {
            $lte: 30,
          },
        },
      ],
    })
    .toArray();
}

/*
 * Usually this is cleaner:
 *
 *
 * {
 *   age: {
 *     $gte: 18,
 *     $lte: 30
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. $or
 * ============================================================
 */

async function orExample() {
  return users()
    .find({
      $or: [
        {
          department: "CSE",
        },

        {
          department: "ECE",
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 16. COMPLEX $or
 * ============================================================
 */

async function complexOr() {
  return users()
    .find({
      $or: [
        {
          age: {
            $lt: 20,
          },
        },

        {
          age: {
            $gt: 30,
          },
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 17. $nor
 * ============================================================
 *
 * Match documents that fail ALL supplied conditions.
 *
 * ============================================================
 */

async function norExample() {
  return users()
    .find({
      $nor: [
        {
          department: "CSE",
        },

        {
          active: false,
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 18. $not
 * ============================================================
 *
 * $not negates another operator expression.
 *
 * ============================================================
 */

async function notExample() {
  return users()
    .find({
      age: {
        $not: {
          $gte: 18,
        },
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 19. ELEMENT OPERATORS
 * ============================================================
 *
 * $exists
 * $type
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. $exists
 * ============================================================
 */

async function existsExample() {
  return users()
    .find({
      phone: {
        $exists: true,
      },
    })
    .toArray();
}

/*
 * Field does not exist:
 *
 *
 *     {
 *       phone: {
 *         $exists: false
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. $type
 * ============================================================
 *
 * Find documents where a field has a particular BSON type.
 *
 * ============================================================
 */

async function typeExample() {
  return users()
    .find({
      age: {
        $type: "number",
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 22. ARRAY OPERATORS
 * ============================================================
 *
 * $all
 * $elemMatch
 * $size
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. ARRAY MATCHING
 * ============================================================
 *
 * Suppose:
 *
 * {
 *   skills: [
 *     "Python",
 *     "Node.js",
 *     "MongoDB"
 *   ]
 * }
 *
 *
 * You can query:
 *
 *
 *     { skills: "Python" }
 *
 *
 * MongoDB matches documents where the array contains Python.
 *
 * ============================================================
 */

async function arrayContainsExample() {
  return users()
    .find({
      skills: "Python",
    })
    .toArray();
}

/*
 * ============================================================
 * 24. $all
 * ============================================================
 *
 * Match arrays containing ALL specified values.
 *
 * ============================================================
 */

async function allExample() {
  return users()
    .find({
      skills: {
        $all: ["Python", "MongoDB"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 25. $size
 * ============================================================
 *
 * Match arrays having exactly N elements.
 *
 * ============================================================
 */

async function sizeExample() {
  return users()
    .find({
      skills: {
        $size: 3,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 26. $elemMatch
 * ============================================================
 *
 * Extremely important for arrays of objects.
 *
 *
 * Example document:
 *
 *
 * {
 *   name: "Shiva",
 *
 *   subjects: [
 *
 *     {
 *       code: "CS501",
 *       marks: 90
 *     },
 *
 *     {
 *       code: "CS502",
 *       marks: 75
 *     }
 *
 *   ]
 * }
 *
 * ============================================================
 */

async function elemMatchExample() {
  return users()
    .find({
      subjects: {
        $elemMatch: {
          code: "CS501",

          marks: {
            $gte: 80,
          },
        },
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 27. WHY $elemMatch MATTERS
 * ============================================================
 *
 * Consider:
 *
 *
 * {
 *   subjects: [
 *
 *     {
 *       code: "CS501",
 *       marks: 90
 *     },
 *
 *     {
 *       code: "CS502",
 *       marks: 50
 *     }
 *
 *   ]
 * }
 *
 *
 * With $elemMatch:
 *
 *
 *     code == CS501
 *     AND
 *     marks >= 80
 *
 *
 * must apply to the SAME array element.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. DOT NOTATION ARRAY QUERY
 * ============================================================
 */

async function arrayDotNotation() {
  return users()
    .find({
      "subjects.code": "CS501",
    })
    .toArray();
}

/*
 * ============================================================
 * 29. $elemMatch VS DOT NOTATION
 * ============================================================
 *
 *
 * DOT NOTATION
 *
 *     "subjects.code": "CS501"
 *
 *
 * Good for simple nested matching.
 *
 *
 * $elemMatch
 *
 *     subjects: {
 *       $elemMatch: {
 *         code: "CS501",
 *         marks: { $gte: 80 }
 *       }
 *     }
 *
 *
 * Required when multiple conditions must match the SAME
 * array element.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. REGEX
 * ============================================================
 *
 * MongoDB supports regular-expression queries.
 *
 * ============================================================
 */

async function regexExample() {
  return users()
    .find({
      name: {
        $regex: "^Shiva",
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 31. CASE-INSENSITIVE REGEX
 * ============================================================
 */

async function caseInsensitiveRegex() {
  return users()
    .find({
      name: {
        $regex: "shiva",

        $options: "i",
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 32. REGEX WARNING
 * ============================================================
 *
 * Regex searches can become expensive.
 *
 *
 * Especially dangerous:
 *
 *
 *     { name: { $regex: "shiva" } }
 *
 *
 * on a very large collection without a suitable strategy.
 *
 *
 * Prefer properly designed indexes/search systems for
 * production search requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. EVALUATION OPERATORS
 * ============================================================
 *
 * $regex
 * $text
 * $where
 *
 *
 * $where should generally be avoided in normal application
 * queries because it executes JavaScript expressions and can
 * have serious performance/security implications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. $text
 * ============================================================
 *
 * $text performs text search using a text index.
 *
 * ============================================================
 */

async function textSearchExample() {
  return users()
    .find({
      $text: {
        $search: "python mongodb",
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 35. TEXT INDEX
 * ============================================================
 *
 * A text search requires an appropriate text index.
 *
 * Example:
 *
 * ============================================================
 */

async function createTextIndex() {
  await users().createIndex({
    name: "text",

    bio: "text",
  });
}

/*
 * ============================================================
 * 36. $expr
 * ============================================================
 *
 * $expr allows aggregation expressions inside a query filter.
 *
 *
 * Example:
 *
 *     compare two fields
 *
 * ============================================================
 */

async function exprExample() {
  return users()
    .find({
      $expr: {
        $gt: ["$maxScore", "$minScore"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 37. $expr USE CASE
 * ============================================================
 *
 * Suppose:
 *
 *
 * {
 *   currentCredits: 25,
 *   maxCredits: 20
 * }
 *
 *
 * Find users whose current credits exceed the maximum:
 *
 * ============================================================
 */

async function creditsExceeded() {
  return users()
    .find({
      $expr: {
        $gt: ["$currentCredits", "$maxCredits"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 38. NESTED FIELD QUERY
 * ============================================================
 */

async function nestedFieldQuery() {
  return users()
    .find({
      "profile.department": "CSE",
    })
    .toArray();
}

/*
 * ============================================================
 * 39. MULTIPLE CONDITIONS
 * ============================================================
 */

async function multipleConditions() {
  return users()
    .find({
      "profile.department": "CSE",

      semester: {
        $gte: 5,
      },

      active: true,
    })
    .toArray();
}

/*
 * ============================================================
 * 40. NULL QUERY
 * ============================================================
 *
 * Important:
 *
 *     { field: null }
 *
 * can match documents where field is null OR where the field
 * does not exist.
 *
 * ============================================================
 */

async function nullExample() {
  return users()
    .find({
      phone: null,
    })
    .toArray();
}

/*
 * If you specifically want null:
 *
 *
 *     {
 *       phone: null,
 *       phone: {
 *         $type: 10
 *       }
 *     }
 *
 *
 * A clearer approach is often to explicitly model your data
 * and use $exists/type conditions as needed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. NEGATION WITH ARRAYS
 * ============================================================
 */

async function noPythonUsers() {
  return users()
    .find({
      skills: {
        $nin: ["Python"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 42. COMPLEX REAL-WORLD FILTER
 * ============================================================
 *
 * Find:
 *
 *     active CSE users
 *     age 18–30
 *     who have Python or MongoDB skill
 *
 * ============================================================
 */

async function complexFilter() {
  return users()
    .find({
      active: true,

      department: "CSE",

      age: {
        $gte: 18,

        $lte: 30,
      },

      skills: {
        $in: ["Python", "MongoDB"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 43. COMPLEX $OR FILTER
 * ============================================================
 *
 * Find:
 *
 *     active CSE users
 *
 * AND:
 *
 *     age < 20
 *     OR
 *     age > 30
 *
 * ============================================================
 */

async function complexLogicalFilter() {
  return users()
    .find({
      active: true,

      department: "CSE",

      $or: [
        {
          age: {
            $lt: 20,
          },
        },

        {
          age: {
            $gt: 30,
          },
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 44. FILTERING BY DATE
 * ============================================================
 */

async function recentUsers() {
  const startDate = new Date("2026-01-01T00:00:00.000Z");

  return users()
    .find({
      createdAt: {
        $gte: startDate,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 45. DATE RANGE
 * ============================================================
 */

async function usersCreatedInPeriod() {
  const start = new Date("2026-01-01T00:00:00.000Z");

  const end = new Date("2027-01-01T00:00:00.000Z");

  return users()
    .find({
      createdAt: {
        $gte: start,

        $lt: end,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 46. ObjectId QUERY
 * ============================================================
 */

async function findById(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  return users().findOne({
    _id: new ObjectId(id),
  });
}

/*
 * ============================================================
 * 47. QUERY BUILDER
 * ============================================================
 *
 * In a real API, filters often come from query parameters:
 *
 *
 *     GET /users?department=CSE&active=true
 *
 *
 * Convert API parameters into a controlled MongoDB filter.
 *
 * ============================================================
 */

function buildUserFilter(query) {
  const filter = {};

  if (typeof query.department === "string") {
    filter.department = query.department;
  }

  if (query.active === "true") {
    filter.active = true;
  } else if (query.active === "false") {
    filter.active = false;
  }

  if (query.minAge) {
    filter.age = {
      ...filter.age,

      $gte: Number(query.minAge),
    };
  }

  if (query.maxAge) {
    filter.age = {
      ...filter.age,

      $lte: Number(query.maxAge),
    };
  }

  return filter;
}

/*
 * ============================================================
 * 48. USE QUERY BUILDER
 * ============================================================
 */

async function searchUsers(query) {
  const filter = buildUserFilter(query);

  return users().find(filter).toArray();
}

/*
 * ============================================================
 * 49. NEVER TRUST QUERY OPERATORS DIRECTLY
 * ============================================================
 *
 * Avoid an API design like:
 *
 *
 *     GET /users?filter[age][$gt]=18
 *
 *
 * followed by blindly passing the request object to MongoDB.
 *
 *
 * Instead:
 *
 *
 * HTTP query
 *      ↓
 * validation
 *      ↓
 * allowed fields
 *      ↓
 * allowed operators
 *      ↓
 * MongoDB filter
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. OPERATOR CHEAT SHEET
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
 * ARRAY
 *
 *     $all
 *     $elemMatch
 *     $size
 *
 *
 * EVALUATION
 *
 *     $regex
 *     $text
 *     $expr
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. HOW TO THINK ABOUT A QUERY
 * ============================================================
 *
 *
 * Example:
 *
 *
 * {
 *
 *   department: "CSE",
 *
 *   age: {
 *     $gte: 18,
 *     $lte: 25
 *   },
 *
 *   skills: {
 *     $in: [
 *       "Python",
 *       "MongoDB"
 *     ]
 *   },
 *
 *   active: true
 *
 * }
 *
 *
 * Read it as:
 *
 *
 * department = CSE
 *
 * AND
 *
 * age >= 18
 *
 * AND
 *
 * age <= 25
 *
 * AND
 *
 * skills contains Python OR MongoDB
 *
 * AND
 *
 * active = true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 52. PERFORMANCE
 * ============================================================
 *
 * A correct query is not automatically a fast query.
 *
 *
 * For production:
 *
 *
 *     query design
 *         +
 *     indexes
 *         +
 *     explain()
 *         +
 *     appropriate data modeling
 *
 *
 * determine performance.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 53. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * Request
 *    │
 *    ▼
 * Query Parameters
 *    │
 *    ▼
 * Validation
 *    │
 *    ▼
 * Filter Builder
 *    │
 *    ▼
 * MongoDB Query
 *    │
 *    ├── comparison
 *    ├── logical
 *    ├── element
 *    ├── array
 *    └── evaluation
 *    │
 *    ▼
 * Index / Query Planner
 *    │
 *    ▼
 * Results
 *
 * ============================================================
 */

/*
 * ============================================================
 * 54. MAIN
 * ============================================================
 */

async function main() {
  try {
    await client.connect();

    console.log("MongoDB connected");

    // Uncomment examples while learning.
    //
    // console.log(await ageRange());
    // console.log(await inExample());
    // console.log(await orExample());
    // console.log(await elemMatchExample());
    // console.log(await complexFilter());
    // console.log(await recentUsers());
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

main();
