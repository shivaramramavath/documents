/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     10_pagination.js
 *
 * Topic:
 *     Mongoose Pagination
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. limit()
 *     2. skip()
 *     3. page + limit
 *     4. offset calculation
 *     5. total count
 *     6. total pages
 *     7. pagination metadata
 *     8. pagination utility
 *     9. pagination + filtering
 *    10. pagination + projection
 *    11. pagination + sorting
 *    12. pagination + lean
 *    13. maximum page size
 *    14. Promise.all()
 *    15. offset pagination limitations
 *    16. cursor pagination
 *    17. cursor pagination with _id
 *    18. cursor pagination with createdAt
 *    19. nextCursor
 *    20. production API pattern
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

    department: {
      type: String,
    },

    semester: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },

    active: {
      type: Boolean,

      default: true,
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
  mongoose.models.PaginationStudent ||
  mongoose.model("PaginationStudent", studentSchema);

/*
 * ============================================================
 * BASIC PAGINATION
 * ============================================================
 */

/*
 * ============================================================
 * 4. limit()
 * ============================================================
 *
 * Return only N documents.
 *
 * ============================================================
 */

async function limitExample() {
  return Student.find()

    .limit(10)

    .exec();
}

/*
 * ============================================================
 * 5. skip()
 * ============================================================
 *
 * Skip the first N documents.
 *
 * ============================================================
 */

async function skipExample() {
  return Student.find()

    .skip(10)

    .exec();
}

/*
 * ============================================================
 * 6. SKIP + LIMIT
 * ============================================================
 */

async function basicPagination() {
  return Student.find()

    .skip(20)

    .limit(10)

    .exec();
}

/*
 * Meaning:
 *
 *     skip 20
 *     limit 10
 *
 * Returns approximately:
 *
 *     documents 21–30
 *
 */

/*
 * ============================================================
 * PAGE-BASED PAGINATION
 * ============================================================
 */

/*
 * ============================================================
 * 7. CALCULATE SKIP
 * ============================================================
 *
 * Formula:
 *
 *     skip = (page - 1) * limit
 *
 * ============================================================
 */

function calculateSkip(page, limit) {
  return (page - 1) * limit;
}

/*
 * Examples:
 *
 * page = 1
 * limit = 20
 *
 * skip = 0
 *
 *
 * page = 2
 * limit = 20
 *
 * skip = 20
 *
 *
 * page = 3
 * limit = 20
 *
 * skip = 40
 *
 */

/*
 * ============================================================
 * 8. PAGE PAGINATION
 * ============================================================
 */

async function pagePagination({
  page = 1,

  limit = 20,
}) {
  const skip = calculateSkip(page, limit);

  return Student.find()

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * 9. PAGINATION WITH SORT
 * ============================================================
 *
 * ALWAYS think carefully about ordering when paginating.
 *
 * ============================================================
 */

async function sortedPagination({
  page = 1,

  limit = 20,
}) {
  const skip = calculateSkip(page, limit);

  return Student.find({
    active: true,
  })

    .sort({
      createdAt: -1,

      _id: -1,
    })

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * 10. PAGINATION + PROJECTION
 * ============================================================
 */

async function projectedPagination({
  page = 1,

  limit = 20,
}) {
  const skip = calculateSkip(page, limit);

  return Student.find({
    active: true,
  })

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      createdAt: 1,

      _id: 1,
    })

    .sort({
      createdAt: -1,

      _id: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean()

    .exec();
}

/*
 * ============================================================
 * PAGINATION METADATA
 * ============================================================
 */

/*
 * ============================================================
 * 11. TOTAL COUNT
 * ============================================================
 */

async function countStudents() {
  return Student.countDocuments({
    active: true,
  })

    .exec();
}

/*
 * ============================================================
 * 12. TOTAL PAGES
 * ============================================================
 *
 * Formula:
 *
 *     totalPages =
 *         Math.ceil(total / limit)
 *
 * ============================================================
 */

function calculateTotalPages(total, limit) {
  return Math.ceil(total / limit);
}

/*
 * ============================================================
 * 13. PAGINATION METADATA
 * ============================================================
 */

function createPaginationMeta({
  page,

  limit,

  total,
}) {
  const totalPages = calculateTotalPages(total, limit);

  return {
    page,

    limit,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
}

/*
 * ============================================================
 * PAGINATED RESULT
 * ============================================================
 */

async function paginatedResult({
  page = 1,

  limit = 20,
}) {
  const skip = calculateSkip(page, limit);

  const filter = {
    active: true,
  };

  /*
   * Execute both operations concurrently.
   */

  const [students, total] = await Promise.all([
    Student.find(filter)

      .select({
        name: 1,

        department: 1,

        semester: 1,

        cgpa: 1,

        createdAt: 1,

        _id: 1,
      })

      .sort({
        createdAt: -1,

        _id: -1,
      })

      .skip(skip)

      .limit(limit)

      .lean()

      .exec(),

    Student.countDocuments(filter)

      .exec(),
  ]);

  return {
    data: students,

    pagination: createPaginationMeta({
      page,

      limit,

      total,
    }),
  };
}

/*
 * ============================================================
 * 14. API RESPONSE EXAMPLE
 * ============================================================
 *
 * {
 *
 *     "data": [
 *
 *         {
 *             "_id": "...",
 *             "name": "Shiva",
 *             "department": "CSE",
 *             "cgpa": 9.2
 *         }
 *
 *     ],
 *
 *     "pagination": {
 *
 *         "page": 2,
 *         "limit": 20,
 *         "total": 147,
 *         "totalPages": 8,
 *         "hasNextPage": true,
 *         "hasPreviousPage": true
 *
 *     }
 *
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * INPUT VALIDATION
 * ============================================================
 */

/*
 * ============================================================
 * 15. NORMALIZE PAGE
 * ============================================================
 */

function normalizePage(value) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

/*
 * ============================================================
 * 16. NORMALIZE LIMIT
 * ============================================================
 *
 * Never allow the client to request:
 *
 *     ?limit=100000000
 *
 * ============================================================
 */

function normalizeLimit(value) {
  const limit = Number(value);

  if (!Number.isInteger(limit) || limit < 1) {
    return 20;
  }

  /*
   * Maximum page size.
   */

  return Math.min(limit, 100);
}

/*
 * ============================================================
 * 17. SAFE PAGINATION INPUT
 * ============================================================
 */

function normalizePagination({
  page,

  limit,
}) {
  return {
    page: normalizePage(page),

    limit: normalizeLimit(limit),
  };
}

/*
 * ============================================================
 * FILTER + PAGINATION
 * ============================================================
 */

/*
 * ============================================================
 * 18. PAGINATION WITH DEPARTMENT
 * ============================================================
 */

async function studentsByDepartment({
  department,

  page = 1,

  limit = 20,
}) {
  const pagination = normalizePagination({
    page,

    limit,
  });

  const skip = calculateSkip(
    pagination.page,

    pagination.limit,
  );

  const filter = {
    active: true,

    department,
  };

  const [students, total] = await Promise.all([
    Student.find(filter)

      .select("name department semester cgpa")

      .sort({
        cgpa: -1,

        _id: 1,
      })

      .skip(skip)

      .limit(pagination.limit)

      .lean()

      .exec(),

    Student.countDocuments(filter)

      .exec(),
  ]);

  return {
    data: students,

    pagination: createPaginationMeta({
      page: pagination.page,

      limit: pagination.limit,

      total,
    }),
  };
}

/*
 * ============================================================
 * SEARCH + SORT + PAGINATION
 * ============================================================
 */

/*
 * ============================================================
 * 19. COMPLETE OFFSET PAGINATION
 * ============================================================
 */

async function searchStudents({
  search,

  department,

  page = 1,

  limit = 20,
}) {
  const pagination = normalizePagination({
    page,

    limit,
  });

  const skip = calculateSkip(
    pagination.page,

    pagination.limit,
  );

  const filter = {
    active: true,
  };

  /*
   * Search by name.
   */

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  /*
   * Filter department.
   */

  if (department) {
    filter.department = department;
  }

  const [students, total] = await Promise.all([
    Student.find(filter)

      .select({
        name: 1,

        email: 1,

        department: 1,

        semester: 1,

        cgpa: 1,

        createdAt: 1,

        _id: 1,
      })

      .sort({
        cgpa: -1,

        _id: 1,
      })

      .skip(skip)

      .limit(pagination.limit)

      .lean()

      .exec(),

    Student.countDocuments(filter)

      .exec(),
  ]);

  return {
    data: students,

    pagination: createPaginationMeta({
      page: pagination.page,

      limit: pagination.limit,

      total,
    }),
  };
}

/*
 * ============================================================
 * OFFSET PAGINATION LIMITATION
 * ============================================================
 *
 * This:
 *
 *     .skip(100000)
 *
 * can become expensive for large datasets.
 *
 * MongoDB still has to work through the skipped portion.
 *
 *
 * Example:
 *
 *     page = 5000
 *     limit = 20
 *
 *     skip = 99,980
 *
 * Deep pages can therefore become increasingly expensive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * CURSOR / KEYSET PAGINATION
 * ============================================================
 *
 * Instead of saying:
 *
 *     "skip the first 10,000 documents"
 *
 * say:
 *
 *     "give me documents after this last document"
 *
 *
 * Example:
 *
 *     lastId = 68xxxxxxxx
 *
 *     _id > lastId
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. CURSOR PAGINATION WITH _id
 * ============================================================
 *
 * Sort:
 *
 *     _id ASC
 *
 * Query:
 *
 *     _id > cursor
 *
 * ============================================================
 */

async function cursorPagination({
  cursor,

  limit = 20,
}) {
  const safeLimit = normalizeLimit(limit);

  const filter = {
    active: true,
  };

  /*
   * If cursor exists, continue after it.
   */

  if (cursor) {
    if (!mongoose.isValidObjectId(cursor)) {
      throw new Error("Invalid cursor");
    }

    filter._id = {
      $gt: new mongoose.Types.ObjectId(cursor),
    };
  }

  /*
   * Request one extra document.
   *
   * This lets us determine whether another page exists.
   */

  const students = await Student.find(filter)

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      _id: 1,
    })

    .sort({
      _id: 1,
    })

    .limit(safeLimit + 1)

    .lean()

    .exec();

  const hasNextPage = students.length > safeLimit;

  if (hasNextPage) {
    students.pop();
  }

  const nextCursor =
    hasNextPage && students.length > 0
      ? String(students[students.length - 1]._id)
      : null;

  return {
    data: students,

    pagination: {
      limit: safeLimit,

      hasNextPage,

      nextCursor,
    },
  };
}

/*
 * ============================================================
 * 21. CURSOR PAGINATION DESCENDING
 * ============================================================
 *
 * Newest first:
 *
 *     _id: -1
 *
 * Continue with:
 *
 *     _id < cursor
 *
 * ============================================================
 */

async function cursorPaginationDescending({
  cursor,

  limit = 20,
}) {
  const safeLimit = normalizeLimit(limit);

  const filter = {
    active: true,
  };

  if (cursor) {
    if (!mongoose.isValidObjectId(cursor)) {
      throw new Error("Invalid cursor");
    }

    filter._id = {
      $lt: new mongoose.Types.ObjectId(cursor),
    };
  }

  const students = await Student.find(filter)

    .select({
      name: 1,

      department: 1,

      cgpa: 1,

      _id: 1,
    })

    .sort({
      _id: -1,
    })

    .limit(safeLimit + 1)

    .lean()

    .exec();

  const hasNextPage = students.length > safeLimit;

  if (hasNextPage) {
    students.pop();
  }

  const nextCursor =
    hasNextPage && students.length > 0
      ? String(students[students.length - 1]._id)
      : null;

  return {
    data: students,

    pagination: {
      limit: safeLimit,

      hasNextPage,

      nextCursor,
    },
  };
}

/*
 * ============================================================
 * CURSOR PAGINATION WITH CREATED DATE
 * ============================================================
 *
 * For real applications, you often want:
 *
 *     createdAt DESC
 *
 * But createdAt may not be unique.
 *
 * Therefore use:
 *
 *     createdAt
 *     _id
 *
 * as a compound ordering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. CREATED_AT CURSOR
 * ============================================================
 *
 * Cursor contains:
 *
 *     createdAt
 *     _id
 *
 * Example:
 *
 *     {
 *       createdAt: "...",
 *       id: "..."
 *     }
 *
 * ============================================================
 */

function encodeCursor({ createdAt, id }) {
  const payload = JSON.stringify({
    createdAt,
    id,
  });

  return Buffer.from(payload, "utf8")

    .toString("base64url");
}

/*
 * ============================================================
 * 23. DECODE CURSOR
 * ============================================================
 */

function decodeCursor(cursor) {
  try {
    const payload = Buffer.from(cursor, "base64url")

      .toString("utf8");

    const parsed = JSON.parse(payload);

    if (!parsed.createdAt || !parsed.id) {
      throw new Error("Invalid cursor");
    }

    if (!mongoose.isValidObjectId(parsed.id)) {
      throw new Error("Invalid cursor id");
    }

    const createdAt = new Date(parsed.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error("Invalid cursor date");
    }

    return {
      createdAt,

      id: new mongoose.Types.ObjectId(parsed.id),
    };
  } catch {
    throw new Error("Invalid cursor");
  }
}

/*
 * ============================================================
 * 24. CREATED_AT CURSOR PAGINATION
 * ============================================================
 */

async function createdAtCursorPagination({
  cursor,

  limit = 20,
}) {
  const safeLimit = normalizeLimit(limit);

  const filter = {
    active: true,
  };

  /*
   * Decode cursor.
   */

  if (cursor) {
    const decoded = decodeCursor(cursor);

    /*
     * Sort:
     *
     *     createdAt DESC
     *     _id DESC
     *
     *
     * We need documents that come AFTER the cursor
     * in this ordering.
     *
     * Therefore:
     *
     *     createdAt < cursor.createdAt
     *
     * OR
     *
     *     createdAt == cursor.createdAt
     *     AND _id < cursor.id
     *
     */

    filter.$or = [
      {
        createdAt: {
          $lt: decoded.createdAt,
        },
      },

      {
        createdAt: decoded.createdAt,

        _id: {
          $lt: decoded.id,
        },
      },
    ];
  }

  /*
   * Fetch one extra.
   */

  const students = await Student.find(filter)

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      createdAt: 1,

      _id: 1,
    })

    .sort({
      createdAt: -1,

      _id: -1,
    })

    .limit(safeLimit + 1)

    .lean()

    .exec();

  const hasNextPage = students.length > safeLimit;

  if (hasNextPage) {
    students.pop();
  }

  let nextCursor = null;

  if (hasNextPage && students.length > 0) {
    const last = students[students.length - 1];

    nextCursor = encodeCursor({
      createdAt: last.createdAt,

      id: last._id,
    });
  }

  return {
    data: students,

    pagination: {
      limit: safeLimit,

      hasNextPage,

      nextCursor,
    },
  };
}

/*
 * ============================================================
 * 25. REUSABLE OFFSET PAGINATION UTILITY
 * ============================================================
 */

async function paginate({
  model,

  filter = {},

  projection = null,

  sort = {
    _id: 1,
  },

  page = 1,

  limit = 20,
}) {
  const pagination = normalizePagination({
    page,

    limit,
  });

  const skip = calculateSkip(
    pagination.page,

    pagination.limit,
  );

  let query = model.find(filter);

  if (projection) {
    query = query.select(projection);
  }

  query = query

    .sort(sort)

    .skip(skip)

    .limit(pagination.limit)

    .lean();

  const [data, total] = await Promise.all([
    query.exec(),

    model

      .countDocuments(filter)

      .exec(),
  ]);

  return {
    data,

    pagination: createPaginationMeta({
      page: pagination.page,

      limit: pagination.limit,

      total,
    }),
  };
}

/*
 * ============================================================
 * 26. REUSABLE PAGINATION EXAMPLE
 * ============================================================
 */

async function reusablePaginationExample() {
  return paginate({
    model: Student,

    filter: {
      active: true,

      department: "CSE",
    },

    projection: {
      name: 1,

      department: 1,

      cgpa: 1,

      _id: 1,
    },

    sort: {
      cgpa: -1,

      _id: 1,
    },

    page: 2,

    limit: 20,
  });
}

/*
 * ============================================================
 * 27. PRODUCTION API FUNCTION
 * ============================================================
 */

async function getStudents({
  search,

  department,

  page,

  limit,
}) {
  const pagination = normalizePagination({
    page,

    limit,
  });

  const filter = {
    active: true,
  };

  /*
   * Search.
   */

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  /*
   * Department filter.
   */

  if (department) {
    filter.department = department;
  }

  return paginate({
    model: Student,

    filter,

    projection: {
      name: 1,

      email: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      createdAt: 1,

      _id: 1,
    },

    sort: {
      cgpa: -1,

      _id: 1,
    },

    page: pagination.page,

    limit: pagination.limit,
  });
}

/*
 * ============================================================
 * 28. COMPLETE DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Page pagination
     * --------------------------------------------------------
     */

    const page = await pagePagination({
      page: 1,

      limit: 10,
    });

    console.log("\nPage 1:", page);

    /*
     * --------------------------------------------------------
     * Full paginated response
     * --------------------------------------------------------
     */

    const result = await paginatedResult({
      page: 1,

      limit: 20,
    });

    console.log("\nPaginated result:", result);

    /*
     * --------------------------------------------------------
     * Search + pagination
     * --------------------------------------------------------
     */

    const searchResult = await searchStudents({
      search: "shiva",

      department: "CSE",

      page: 1,

      limit: 10,
    });

    console.log("\nSearch result:", searchResult);

    /*
     * --------------------------------------------------------
     * Cursor pagination
     * --------------------------------------------------------
     */

    const cursorResult = await cursorPaginationDescending({
      limit: 10,
    });

    console.log("\nCursor result:", cursorResult);

    /*
     * --------------------------------------------------------
     * Next cursor
     * --------------------------------------------------------
     */

    if (cursorResult.pagination.nextCursor) {
      const nextPage = await cursorPaginationDescending({
        cursor: cursorResult.pagination.nextCursor,

        limit: 10,
      });

      console.log("\nCursor next page:", nextPage);
    }
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 29. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
