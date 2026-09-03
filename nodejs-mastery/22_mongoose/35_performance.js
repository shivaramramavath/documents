/**
 * ============================================================
 * 35_performance.js
 * ============================================================
 *
 * Mongoose + MongoDB Performance
 *
 * ============================================================
 *
 * Topics:
 *
 *  1. Connection pool configuration
 *  2. Query timeout
 *  3. Query performance measurement
 *  4. Projection
 *  5. lean()
 *  6. Index usage
 *  7. explain()
 *  8. Cursors
 *  9. Batch processing
 * 10. bulkWrite()
 * 11. N+1 query problem
 * 12. populate() performance
 * 13. Counting
 * 14. Pagination
 * 15. Large documents
 * 16. Query logging
 * 17. Performance middleware
 * 18. Concurrent queries
 * 19. Connection pool behavior
 * 20. Production checklist
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
 * 2. CONNECTION POOL
 * ============================================================
 *
 * MongoDB driver maintains a pool
 * of connections for each server.
 *
 * Mongoose uses the MongoDB driver.
 *
 * ============================================================
 */

const connectionOptions = {
  /*
   * Maximum number of connections
   * in the pool.
   */

  maxPoolSize: 20,

  /*
   * Minimum number of connections
   * maintained in the pool.
   */

  minPoolSize: 5,

  /*
   * How long server selection
   * can take before failing.
   */

  serverSelectionTimeoutMS: 5000,

  /*
   * How long a socket can remain
   * idle before being removed.
   */

  maxIdleTimeMS: 60000,

  /*
   * Maximum time allowed for
   * a database operation.
   */

  maxTimeMS: 10000,
};

/*
 * ============================================================
 * 3. CONNECT
 * ============================================================
 */

async function connectDB() {
  await mongoose.connect(
    MONGODB_URI,

    connectionOptions,
  );

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 4. PERFORMANCE SCHEMA
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

    index: true,
  },

  department: {
    type: String,

    index: true,
  },

  status: {
    type: String,

    index: true,
  },

  age: Number,

  skills: {
    type: [String],

    default: [],
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

/*
 * Compound index for a common
 * query pattern.
 */

userSchema.index({
  department: 1,

  status: 1,

  createdAt: -1,
});

const User =
  mongoose.models.PerformanceUser ||
  mongoose.model("PerformanceUser", userSchema);

/*
 * ============================================================
 * 5. BASIC QUERY
 * ============================================================
 */

async function basicQuery() {
  const users = await User.find({
    department: "CSE",
  });

  return users;
}

/*
 * ============================================================
 * 6. PROJECTION
 * ============================================================
 *
 * Don't fetch fields you don't need.
 *
 * ============================================================
 */

async function projectionQuery() {
  const users = await User.find(
    {
      department: "CSE",
    },

    {
      name: 1,

      email: 1,
    },
  );

  return users;
}

/*
 * ============================================================
 * 7. EXPLICIT SELECT
 * ============================================================
 */

async function selectQuery() {
  const users = await User.find({
    department: "CSE",
  }).select("name email");

  return users;
}

/*
 * ============================================================
 * 8. LEAN QUERY
 * ============================================================
 *
 * Mongoose normally converts
 * MongoDB documents into Mongoose
 * document instances.
 *
 * lean() skips hydration.
 *
 * ============================================================
 */

async function leanQuery() {
  const users = await User.find({
    department: "CSE",
  }).lean();

  return users;
}

/*
 * ============================================================
 * 9. LEAN + PROJECTION
 * ============================================================
 */

async function optimizedRead() {
  const users = await User.find(
    {
      department: "CSE",

      status: "active",
    },

    {
      name: 1,

      email: 1,
    },
  ).lean();

  return users;
}

/*
 * ============================================================
 * 10. SORTING
 * ============================================================
 */

async function sortedQuery() {
  return User.find({
    department: "CSE",
  })
    .sort({
      createdAt: -1,
    })
    .limit(20)
    .lean();
}

/*
 * ============================================================
 * 11. LIMIT
 * ============================================================
 */

async function limitedQuery() {
  return User.find({
    status: "active",
  })
    .limit(50)
    .lean();
}

/*
 * ============================================================
 * 12. MAX TIME MS
 * ============================================================
 */

async function queryWithTimeout() {
  return User.find({
    department: "CSE",
  })
    .maxTimeMS(3000)
    .lean();
}

/*
 * ============================================================
 * 13. EXPLAIN
 * ============================================================
 */

async function explainQuery() {
  const result = await User.find({
    department: "CSE",

    status: "active",
  })
    .sort({
      createdAt: -1,
    })
    .limit(20)
    .explain("executionStats");

  console.log(JSON.stringify(result, null, 2));

  return result;
}

/*
 * ============================================================
 * 14. MEASURE QUERY TIME
 * ============================================================
 */

async function measureQuery() {
  const start = process.hrtime.bigint();

  const users = await User.find({
    department: "CSE",
  }).lean();

  const end = process.hrtime.bigint();

  const duration = Number(end - start) / 1_000_000;

  console.log(`Query took ${duration.toFixed(2)} ms`);

  return users;
}

/*
 * ============================================================
 * 15. COUNT DOCUMENTS
 * ============================================================
 */

async function countDocuments() {
  const count = await User.countDocuments({
    department: "CSE",

    status: "active",
  });

  return count;
}

/*
 * ============================================================
 * 16. ESTIMATED DOCUMENT COUNT
 * ============================================================
 *
 * Faster for collection-level
 * approximate counts.
 *
 * ============================================================
 */

async function estimatedCount() {
  const count = await User.estimatedDocumentCount();

  return count;
}

/*
 * ============================================================
 * 17. CURSOR
 * ============================================================
 *
 * Don't load millions of documents
 * into memory at once.
 *
 * ============================================================
 */

async function cursorExample() {
  const cursor = User.find({
    status: "active",
  })
    .lean()
    .cursor();

  for await (const user of cursor) {
    console.log(user.name);
  }
}

/*
 * ============================================================
 * 18. CURSOR BATCH SIZE
 * ============================================================
 */

async function cursorWithBatchSize() {
  const cursor = User.find({
    status: "active",
  })
    .lean()
    .cursor({
      batchSize: 500,
    });

  for await (const user of cursor) {
    // Process user
  }
}

/*
 * ============================================================
 * 19. BATCH PROCESSING
 * ============================================================
 */

async function processUsersInBatches() {
  const cursor = User.find({
    status: "active",
  })
    .lean()
    .cursor({
      batchSize: 500,
    });

  let batch = [];

  for await (const user of cursor) {
    batch.push(user);

    if (batch.length >= 500) {
      await processBatch(batch);

      batch = [];
    }
  }

  if (batch.length > 0) {
    await processBatch(batch);
  }
}

async function processBatch(users) {
  console.log(`Processing ${users.length} users`);
}

/*
 * ============================================================
 * 20. BULK WRITE
 * ============================================================
 */

async function bulkUpdate() {
  const operations = [
    {
      updateOne: {
        filter: {
          department: "CSE",
        },

        update: {
          $set: {
            status: "active",
          },
        },
      },
    },

    {
      updateOne: {
        filter: {
          department: "ECE",
        },

        update: {
          $set: {
            status: "active",
          },
        },
      },
    },
  ];

  const result = await User.bulkWrite(operations);

  return result;
}

/*
 * ============================================================
 * 21. AVOID N+1 QUERIES
 * ============================================================
 *
 * BAD:
 *
 * 1 query to get departments
 *
 * Then one query for each department.
 *
 * ============================================================
 */

async function badNPlusOne(departments) {
  const results = [];

  for (const department of departments) {
    const users = await User.find({
      department: department,
    }).lean();

    results.push(users);
  }

  return results;
}

/*
 * ============================================================
 * 22. BETTER APPROACH
 * ============================================================
 */

async function goodBatchQuery(departments) {
  return User.find({
    department: {
      $in: departments,
    },
  }).lean();
}

/*
 * ============================================================
 * 23. PARALLEL QUERIES
 * ============================================================
 *
 * Independent queries can sometimes
 * run concurrently.
 *
 * ============================================================
 */

async function parallelQueries() {
  const [activeUsers, cseUsers, eceUsers] = await Promise.all([
    User.find({
      status: "active",
    }).lean(),

    User.find({
      department: "CSE",
    }).lean(),

    User.find({
      department: "ECE",
    }).lean(),
  ]);

  return {
    activeUsers,

    cseUsers,

    eceUsers,
  };
}

/*
 * ============================================================
 * 24. DON'T OVERUSE PARALLELISM
 * ============================================================
 *
 * Promise.all() does NOT mean:
 *
 * "more queries = faster forever"
 *
 * Too much concurrency can:
 *
 * - exhaust connection pool
 * - increase CPU
 * - increase memory
 * - increase latency
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. PAGINATION WITH SKIP
 * ============================================================
 */

async function skipPagination(page, limit) {
  const skip = (page - 1) * limit;

  return User.find({
    status: "active",
  })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();
}

/*
 * ============================================================
 * 26. CURSOR-BASED PAGINATION
 * ============================================================
 */

async function cursorPagination(lastCreatedAt, limit = 20) {
  const filter = {
    status: "active",

    ...(lastCreatedAt
      ? {
          createdAt: {
            $lt: lastCreatedAt,
          },
        }
      : {}),
  };

  return User.find(filter)
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .lean();
}

/*
 * ============================================================
 * 27. LARGE DOCUMENT WARNING
 * ============================================================
 *
 * Avoid putting huge arrays inside
 * frequently-read documents.
 *
 * Example:
 *
 * User
 *   └── 1,000,000 messages
 *
 * This creates problems with:
 *
 * - document size
 * - updates
 * - memory
 * - network transfer
 * - locking/contention patterns
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. QUERY LOGGING
 * ============================================================
 */

mongoose.set("debug", function (collection, method, ...args) {
  console.log(
    `[Mongoose] ${collection}.${method}`,

    args,
  );
});

/*
 * ============================================================
 * 29. PERFORMANCE MIDDLEWARE
 * ============================================================
 */

userSchema.pre(/^find/, function () {
  this.__startedAt = process.hrtime.bigint();
});

userSchema.post(/^find/, function () {
  if (!this.__startedAt) {
    return;
  }

  const duration =
    Number(process.hrtime.bigint() - this.__startedAt) / 1_000_000;

  console.log(`[MongoDB] ${this.op} took ${duration.toFixed(2)} ms`);
});

/*
 * ============================================================
 * 30. POOL SIZE INSPECTION
 * ============================================================
 */

function showPoolConfiguration() {
  console.log({
    maxPoolSize: connectionOptions.maxPoolSize,

    minPoolSize: connectionOptions.minPoolSize,

    maxIdleTimeMS: connectionOptions.maxIdleTimeMS,
  });
}

/*
 * ============================================================
 * 31. CONNECTION EVENTS
 * ============================================================
 */

mongoose.connection.on("connected", () => {
  console.log("Mongoose connection established");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

/*
 * ============================================================
 * 32. PERFORMANCE SUMMARY
 * ============================================================
 */

function performanceChecklist() {
  console.log(`

  MONGOOSE PERFORMANCE CHECKLIST

  ─────────────────────────────────────

  READ PERFORMANCE

  ✓ Use indexes
  ✓ Use projection
  ✓ Use lean() when appropriate
  ✓ Limit result size
  ✓ Avoid unnecessary populate()
  ✓ Use explain()
  ✓ Avoid N+1 queries


  WRITE PERFORMANCE

  ✓ Use bulkWrite()
  ✓ Avoid unnecessary indexes
  ✓ Batch large writes
  ✓ Avoid huge documents


  MEMORY

  ✓ Use cursors
  ✓ Use batch processing
  ✓ Don't load millions of documents
    into memory


  PAGINATION

  ✓ Small datasets:
      skip + limit

  ✓ Large datasets:
      cursor/range pagination


  CONNECTIONS

  ✓ Configure maxPoolSize
  ✓ Avoid excessive concurrency
  ✓ Reuse one Mongoose connection


  MONITORING

  ✓ Measure query latency
  ✓ Check executionStats
  ✓ Monitor slow queries
  ✓ Inspect index usage


  ─────────────────────────────────────

  `);
}

/*
 * ============================================================
 * 33. MAIN
 * ============================================================
 */

async function main() {
  await connectDB();

  console.log("Performance examples ready");

  /*
   * Uncomment examples individually.
   */

  // await basicQuery();

  // await projectionQuery();

  // await selectQuery();

  // await leanQuery();

  // await optimizedRead();

  // await sortedQuery();

  // await limitedQuery();

  // await queryWithTimeout();

  // await explainQuery();

  // await measureQuery();

  // await countDocuments();

  // await estimatedCount();

  // await cursorExample();

  // await cursorWithBatchSize();

  // await processUsersInBatches();

  // await bulkUpdate();

  // await parallelQueries();

  // await skipPagination(1, 20);

  // await cursorPagination();

  showPoolConfiguration();

  performanceChecklist();

  await mongoose.disconnect();
}

await main();
