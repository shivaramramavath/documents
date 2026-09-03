/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/07_indexes.js
 *
 * Topic:
 *     MongoDB Indexes
 *
 * ============================================================
 *
 * Learn:
 *
 *     1. What is an index?
 *     2. createIndex()
 *     3. Single-field indexes
 *     4. Compound indexes
 *     5. Unique indexes
 *     6. Sparse indexes
 *     7. Partial indexes
 *     8. TTL indexes
 *     9. Multikey indexes
 *    10. Text indexes
 *    11. Index direction
 *    12. ESR rule
 *    13. explain()
 *    14. Covered queries
 *    15. Index design
 *    16. Common mistakes
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
 * 2. WHAT IS AN INDEX?
 * ============================================================
 *
 * Without an index:
 *
 *
 *     MongoDB
 *        ↓
 *     scan document 1
 *     scan document 2
 *     scan document 3
 *     scan document 4
 *     ...
 *
 *
 * This is a COLLECTION SCAN.
 *
 *
 * With an index:
 *
 *
 *     MongoDB
 *        ↓
 *     Index
 *        ↓
 *     matching documents
 *
 *
 * This can dramatically reduce the amount of data MongoDB
 * needs to examine.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. DEFAULT _id INDEX
 * ============================================================
 *
 * MongoDB automatically creates an index on:
 *
 *
 *     _id
 *
 *
 * Therefore:
 *
 *
 *     findOne({ _id: someId })
 *
 *
 * is already indexed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. CREATE SINGLE-FIELD INDEX
 * ============================================================
 */

async function createAgeIndex() {
  await users().createIndex({
    age: 1,
  });
}

/*
 * ============================================================
 * 5. ASCENDING VS DESCENDING
 * ============================================================
 *
 *     1
 *         ascending
 *
 *    -1
 *         descending
 *
 *
 * Example:
 *
 *
 *     { age: 1 }
 *
 *     { createdAt: -1 }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. INDEX FOR DEPARTMENT
 * ============================================================
 */

async function createDepartmentIndex() {
  await users().createIndex({
    department: 1,
  });
}

/*
 * ============================================================
 * 7. INDEX NAMES
 * ============================================================
 *
 * MongoDB generates an index name by default.
 *
 *
 * Example:
 *
 *
 *     department_1
 *
 *
 * You can explicitly name an index:
 *
 * ============================================================
 */

async function namedIndex() {
  await users().createIndex(
    {
      department: 1,
    },

    {
      name: "idx_users_department",
    },
  );
}

/*
 * ============================================================
 * 8. LIST INDEXES
 * ============================================================
 */

async function listIndexes() {
  return users().indexes();
}

/*
 * ============================================================
 * 9. DROP INDEX
 * ============================================================
 */

async function dropIndex() {
  await users().dropIndex("idx_users_department");
}

/*
 * ============================================================
 * 10. UNIQUE INDEX
 * ============================================================
 *
 * A unique index prevents duplicate values.
 *
 *
 * Perfect for:
 *
 *     email
 *     username
 *     employeeCode
 *     registrationNumber
 *
 * ============================================================
 */

async function createUniqueEmailIndex() {
  await users().createIndex(
    {
      email: 1,
    },

    {
      unique: true,

      name: "uniq_users_email",
    },
  );
}

/*
 * ============================================================
 * 11. UNIQUE INDEX BEHAVIOR
 * ============================================================
 *
 * If:
 *
 *
 *     user1.email = "a@example.com"
 *
 *
 * then inserting:
 *
 *
 *     user2.email = "a@example.com"
 *
 *
 * fails with a duplicate-key error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. COMPOUND INDEX
 * ============================================================
 *
 * An index can contain multiple fields.
 *
 * ============================================================
 */

async function createCompoundIndex() {
  await users().createIndex({
    department: 1,

    semester: 1,
  });
}

/*
 * ============================================================
 * 13. COMPOUND INDEX ORDER
 * ============================================================
 *
 * This index:
 *
 *
 *     {
 *       department: 1,
 *       semester: 1
 *     }
 *
 *
 * is primarily ordered by:
 *
 *
 *     department
 *
 *
 * then:
 *
 *
 *     semester
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. INDEX PREFIX
 * ============================================================
 *
 * Index:
 *
 *
 *     {
 *       department: 1,
 *       semester: 1,
 *       section: 1
 *     }
 *
 *
 * can support queries involving:
 *
 *
 *     department
 *
 *     department + semester
 *
 *     department + semester + section
 *
 *
 * But it is not equivalent to having separate indexes for
 * every possible field combination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. TIMETABLE COMPOUND INDEX
 * ============================================================
 *
 * Imagine:
 *
 *
 *     GET /timetables
 *
 *
 * commonly filters by:
 *
 *
 *     organizationId
 *     departmentId
 *     semester
 *
 *
 * and sorts by:
 *
 *
 *     createdAt DESC
 *
 *
 * A possible index:
 *
 * ============================================================
 */

async function createTimetableIndex() {
  const timetables = client.db(DATABASE_NAME).collection("timetables");

  await timetables.createIndex({
    organizationId: 1,

    departmentId: 1,

    semester: 1,

    createdAt: -1,
  });
}

/*
 * ============================================================
 * 16. WHY COMPOUND INDEXES?
 * ============================================================
 *
 * Query:
 *
 *
 *     {
 *       organizationId: A,
 *       departmentId: B,
 *       semester: 5
 *     }
 *
 *
 * sort:
 *
 *
 *     {
 *       createdAt: -1
 *     }
 *
 *
 * An appropriate compound index can allow MongoDB to locate
 * and order matching documents efficiently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. ESR RULE
 * ============================================================
 *
 * A useful MongoDB index-design heuristic is ESR:
 *
 *
 *     E = Equality
 *     S = Sort
 *     R = Range
 *
 *
 * Put equality fields first, followed by sort/range according
 * to the query pattern and MongoDB's current index guidance.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. EQUALITY
 * ============================================================
 *
 * Example:
 *
 *
 *     organizationId = "org1"
 *     departmentId = "cse"
 *
 *
 * These are equality predicates.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. RANGE
 * ============================================================
 *
 * Example:
 *
 *
 *     age >= 18
 *     age <= 30
 *
 *
 * This is a range query.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. SORT
 * ============================================================
 *
 * Example:
 *
 *
 *     sort({
 *       createdAt: -1
 *     })
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. PRACTICAL INDEX
 * ============================================================
 *
 * Query:
 *
 *
 *     find({
 *       organizationId: orgId,
 *       departmentId: deptId,
 *       semester: 5
 *     })
 *
 *
 *     .sort({
 *       createdAt: -1
 *     })
 *
 *
 * Index:
 *
 *
 *     {
 *       organizationId: 1,
 *       departmentId: 1,
 *       semester: 1,
 *       createdAt: -1
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. INDEX DIRECTION
 * ============================================================
 *
 * MongoDB can often use an index for both forward and reverse
 * traversal.
 *
 *
 * For example:
 *
 *
 *     { createdAt: 1 }
 *
 *
 * can support ascending and descending traversal in suitable
 * query shapes.
 *
 *
 * Compound sort patterns are more nuanced: the index ordering
 * must be compatible with the requested sort pattern.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. PARTIAL INDEX
 * ============================================================
 *
 * Index only documents satisfying a condition.
 *
 *
 * Example:
 *
 *
 *     active users only
 *
 * ============================================================
 */

async function createPartialIndex() {
  await users().createIndex(
    {
      email: 1,
    },

    {
      partialFilterExpression: {
        active: true,
      },
    },
  );
}

/*
 * ============================================================
 * 24. WHY PARTIAL INDEX?
 * ============================================================
 *
 * Suppose:
 *
 *
 *     10 million users
 *
 *
 * but only:
 *
 *
 *     2 million active users
 *
 *
 * If your application frequently searches only active users,
 * a partial index can avoid indexing inactive documents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. SPARSE INDEX
 * ============================================================
 *
 * A sparse index contains entries only for documents where the
 * indexed field exists.
 *
 * ============================================================
 */

async function createSparseIndex() {
  await users().createIndex(
    {
      phone: 1,
    },

    {
      sparse: true,
    },
  );
}

/*
 * ============================================================
 * 26. PARTIAL VS SPARSE
 * ============================================================
 *
 *
 * SPARSE:
 *
 *     field must exist
 *
 *
 * PARTIAL:
 *
 *     arbitrary filter condition
 *
 *
 * Partial indexes are generally more expressive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. TTL INDEX
 * ============================================================
 *
 * TTL = Time To Live.
 *
 *
 * MongoDB can automatically remove documents after a specified
 * amount of time.
 *
 *
 * Typical use cases:
 *
 *
 *     sessions
 *     temporary tokens
 *     OTP records
 *     temporary cache data
 *     expiring events
 *
 * ============================================================
 */

async function createTTLIndex() {
  const sessions = client.db(DATABASE_NAME).collection("sessions");

  await sessions.createIndex(
    {
      expiresAt: 1,
    },

    {
      expireAfterSeconds: 0,
    },
  );
}

/*
 * ============================================================
 * 28. TTL DOCUMENT
 * ============================================================
 *
 * Example:
 *
 *
 * {
 *
 *   userId: "...",
 *
 *   token: "...",
 *
 *   expiresAt:
 *     new Date("2026-09-03T12:00:00Z")
 *
 * }
 *
 *
 * MongoDB will eventually remove the document after the
 * expiration time.
 *
 *
 * IMPORTANT:
 *
 * TTL deletion is not an exact real-time timer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. MULTIKEY INDEX
 * ============================================================
 *
 * MongoDB automatically creates multikey index behavior when
 * indexing array fields.
 *
 *
 * Example:
 *
 *
 * {
 *
 *   skills: [
 *     "Python",
 *     "MongoDB",
 *     "Node.js"
 *   ]
 *
 * }
 *
 *
 * Index:
 *
 *
 *     { skills: 1 }
 *
 * ============================================================
 */

async function createSkillsIndex() {
  await users().createIndex({
    skills: 1,
  });
}

/*
 * ============================================================
 * 30. ARRAY OBJECT INDEX
 * ============================================================
 *
 * Example:
 *
 *
 * {
 *
 *   subjects: [
 *
 *     {
 *       code: "CS501",
 *       facultyId: "f1"
 *     }
 *
 *   ]
 *
 * }
 *
 *
 * Index:
 *
 *
 *     {
 *       "subjects.code": 1
 *     }
 *
 * ============================================================
 */

async function createSubjectCodeIndex() {
  await users().createIndex({
    "subjects.code": 1,
  });
}

/*
 * ============================================================
 * 31. TEXT INDEX
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
 * 32. TEXT SEARCH
 * ============================================================
 */

async function textSearch() {
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
 * 33. EXPLAIN()
 * ============================================================
 *
 * NEVER guess about query performance.
 *
 * Use explain().
 *
 * ============================================================
 */

async function explainQuery() {
  return users()
    .find({
      department: "CSE",

      semester: 5,
    })
    .sort({
      createdAt: -1,
    })
    .explain("executionStats");
}

/*
 * ============================================================
 * 34. IMPORTANT explain() METRICS
 * ============================================================
 *
 *
 * executionStats.totalDocsExamined
 *
 *     Number of documents MongoDB examined.
 *
 *
 * executionStats.totalKeysExamined
 *
 *     Number of index keys examined.
 *
 *
 * executionStats.nReturned
 *
 *     Number of documents returned.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. IDEAL EXAMPLE
 * ============================================================
 *
 * Suppose:
 *
 *
 *     nReturned = 20
 *
 *     totalDocsExamined = 20
 *
 *
 * Very good.
 *
 *
 * But:
 *
 *
 *     nReturned = 20
 *
 *     totalDocsExamined = 1,000,000
 *
 *
 * means MongoDB examined a huge number of documents to return
 * only 20.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. COLLSCAN VS IXSCAN
 * ============================================================
 *
 *
 * COLLSCAN
 *
 *     Collection Scan
 *
 * MongoDB scans documents.
 *
 *
 *
 * IXSCAN
 *
 *     Index Scan
 *
 * MongoDB scans an index.
 *
 *
 * In explain output you commonly want to see an IXSCAN rather
 * than an unnecessary COLLSCAN for selective indexed queries.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. COVERED QUERY
 * ============================================================
 *
 * A covered query can be answered using only the index without
 * fetching the full documents.
 *
 *
 * Example index:
 *
 *
 *     {
 *       email: 1,
 *       name: 1
 *     }
 *
 *
 * Query:
 *
 *
 *     find(
 *
 *       { email: "a@example.com" },
 *
 *       {
 *         projection: {
 *           _id: 0,
 *           email: 1,
 *           name: 1
 *         }
 *       }
 *
 *     )
 *
 *
 * If the query shape and index permit it, MongoDB may satisfy
 * the query from the index alone.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. INDEX STORAGE COST
 * ============================================================
 *
 * Indexes are NOT free.
 *
 *
 * More indexes mean:
 *
 *
 *     more disk usage
 *     more memory pressure
 *     slower writes
 *     more index maintenance
 *
 *
 * Therefore:
 *
 *
 *     DON'T CREATE AN INDEX FOR EVERY FIELD.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. WRITE PERFORMANCE
 * ============================================================
 *
 * Insert:
 *
 *
 *     document
 *         ↓
 *     collection
 *
 *
 * plus:
 *
 *
 *     update every relevant index
 *
 *
 * Therefore many unnecessary indexes can make write-heavy
 * systems slower.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. INDEX FOR REAL API
 * ============================================================
 *
 * Suppose:
 *
 *
 *     GET /timetables?
 *       organizationId=org1
 *       departmentId=cse
 *       semester=5
 *
 *
 * and:
 *
 *
 *     sort createdAt DESC
 *
 *
 * Create:
 *
 *
 *     {
 *       organizationId: 1,
 *       departmentId: 1,
 *       semester: 1,
 *       createdAt: -1
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. INDEX FOR FACULTY SEARCH
 * ============================================================
 *
 * Query:
 *
 *
 *     {
 *       organizationId: orgId,
 *       facultyId: facultyId
 *     }
 *
 *
 * Create:
 *
 *
 *     {
 *       organizationId: 1,
 *       facultyId: 1
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. INDEX FOR ROOM AVAILABILITY
 * ============================================================
 *
 * Example query:
 *
 *
 *     {
 *       organizationId: orgId,
 *       roomId: roomId,
 *       day: "Monday",
 *       startTime: {
 *         $lt: requestedEnd
 *       },
 *       endTime: {
 *         $gt: requestedStart
 *       }
 *     }
 *
 *
 * Index design should be based on the actual query workload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. INDEX DESIGN PROCESS
 * ============================================================
 *
 *
 * Step 1:
 *
 *     Identify frequent queries.
 *
 *
 * Step 2:
 *
 *     Identify equality filters.
 *
 *
 * Step 3:
 *
 *     Identify range filters.
 *
 *
 * Step 4:
 *
 *     Identify sort requirements.
 *
 *
 * Step 5:
 *
 *     Design candidate index.
 *
 *
 * Step 6:
 *
 *     Run explain("executionStats").
 *
 *
 * Step 7:
 *
 *     Measure.
 *
 *
 * Step 8:
 *
 *     Remove unnecessary indexes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. BAD APPROACH
 * ============================================================
 *
 *
 * "I'll create indexes on everything."
 *
 *
 * Example:
 *
 *
 *     name
 *     email
 *     age
 *     phone
 *     department
 *     semester
 *     city
 *     country
 *     ...
 *
 *
 * This can create unnecessary storage and write overhead.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. BETTER APPROACH
 * ============================================================
 *
 *
 * Application query:
 *
 *
 *     find({
 *       organizationId,
 *       departmentId,
 *       semester
 *     })
 *
 *     .sort({
 *       createdAt: -1
 *     })
 *
 *
 * Design an index around this actual access pattern.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. INDEX + PAGINATION
 * ============================================================
 *
 * Query:
 *
 *
 *     find({
 *       organizationId: orgId
 *     })
 *
 *     .sort({
 *       createdAt: -1,
 *       _id: -1
 *     })
 *
 *     .limit(20)
 *
 *
 * A suitable index can make this pattern very efficient.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. CURSOR PAGINATION INDEX
 * ============================================================
 *
 * For:
 *
 *
 *     createdAt DESC
 *     _id DESC
 *
 *
 * consider:
 *
 *
 *     {
 *       createdAt: -1,
 *       _id: -1
 *     }
 *
 *
 * When combined with equality filters, put those fields into
 * the compound index according to the actual query workload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. INDEX HINT
 * ============================================================
 *
 * MongoDB normally chooses an index automatically.
 *
 *
 * You can explicitly request one with hint().
 *
 * ============================================================
 */

async function hintExample() {
  return users()
    .find({
      department: "CSE",
    })
    .hint({
      department: 1,
    })
    .toArray();
}

/*
 * ============================================================
 * 49. SHOULD YOU USE hint()?
 * ============================================================
 *
 * Usually:
 *
 *     NO
 *
 *
 * Let MongoDB's query planner choose.
 *
 *
 * Use hint() for:
 *
 *
 *     controlled performance testing
 *     diagnostics
 *     specific operational cases
 *
 *
 * Do not casually hard-code hints everywhere.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. INDEX MANAGEMENT IN PRODUCTION
 * ============================================================
 *
 * Indexes should generally be created as part of your database
 * initialization/migration/deployment process rather than
 * repeatedly every time an application request runs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. COMPLETE INDEX SETUP
 * ============================================================
 */

async function createIndexes() {
  const collection = users();

  await collection.createIndexes([
    {
      key: {
        email: 1,
      },

      name: "uniq_users_email",

      unique: true,
    },

    {
      key: {
        department: 1,

        semester: 1,
      },

      name: "idx_users_department_semester",
    },

    {
      key: {
        createdAt: -1,

        _id: -1,
      },

      name: "idx_users_created_at",
    },
  ]);
}

/*
 * ============================================================
 * 52. QUERY → INDEX THINKING
 * ============================================================
 *
 *
 * Query:
 *
 *     filter
 *       +
 *     sort
 *       +
 *     pagination
 *
 *             ↓
 *
 *     Candidate Index
 *
 *             ↓
 *
 *     explain()
 *
 *             ↓
 *
 *     executionStats
 *
 *             ↓
 *
 *     optimize
 *
 * ============================================================
 */

/*
 * ============================================================
 * 53. IMPORTANT RULES
 * ============================================================
 *
 *
 * 1. Index frequent queries.
 *
 * 2. Don't index every field.
 *
 * 3. Compound indexes should reflect real query patterns.
 *
 * 4. Use unique indexes for uniqueness constraints.
 *
 * 5. Use TTL for expiring data.
 *
 * 6. Use partial indexes when only a subset matters.
 *
 * 7. Use explain() to validate performance.
 *
 * 8. Remember indexes increase write/storage costs.
 *
 * 9. Design indexes together with schema and API queries.
 *
 * 10. Measure instead of guessing.
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

    /*
     * Run during database setup/migration:
     *
     *
     * await createIndexes();
     *
     *
     * Inspect indexes:
     *
     *
     * console.log(
     *   await listIndexes()
     * );
     *
     *
     * Analyze a query:
     *
     *
     * console.dir(
     *   await explainQuery(),
     *   {
     *     depth: null
     *   }
     * );
     */
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

main();
