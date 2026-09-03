/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/06_projection_pagination.js
 *
 * Topic:
 *     Projection, Sorting & Pagination
 *
 * ============================================================
 *
 * We will learn:
 *
 *     1. Projection
 *     2. Inclusion / exclusion
 *     3. Sorting
 *     4. Limit
 *     5. Skip
 *     6. Offset pagination
 *     7. Cursor pagination
 *     8. Stable sorting
 *     9. Pagination metadata
 *    10. Production API patterns
 *
 * ============================================================
 */

import { MongoClient, ObjectId } from "mongodb";

/*
 * ============================================================
 * 1. CONNECTION
 * ============================================================
 */

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "timetable";

const client = new MongoClient(URI);

/*
 * ============================================================
 * 2. COLLECTION
 * ============================================================
 */

function users() {
  return client.db(DATABASE_NAME).collection("users");
}

/*
 * ============================================================
 * 3. PROJECTION
 * ============================================================
 *
 * Projection controls which fields MongoDB returns.
 *
 *
 * Example document:
 *
 * {
 *   _id: ...,
 *   name: "Shiva",
 *   email: "shiva@example.com",
 *   passwordHash: "...",
 *   phone: "...",
 *   department: "CSE"
 * }
 *
 *
 * We usually DON'T want to return sensitive/unnecessary fields.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. INCLUSION PROJECTION
 * ============================================================
 *
 * 1 means:
 *
 *     include this field
 *
 * ============================================================
 */

async function includeProjection() {
  return users()
    .find(
      {},

      {
        projection: {
          name: 1,

          email: 1,

          department: 1,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 5. _id SPECIAL CASE
 * ============================================================
 *
 * _id is included by default even when using inclusion
 * projection.
 *
 *
 * If you don't want it:
 *
 *     _id: 0
 *
 * ============================================================
 */

async function includeWithoutId() {
  return users()
    .find(
      {},

      {
        projection: {
          _id: 0,

          name: 1,

          email: 1,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 6. EXCLUSION PROJECTION
 * ============================================================
 *
 * 0 means:
 *
 *     exclude this field
 *
 * ============================================================
 */

async function excludeProjection() {
  return users()
    .find(
      {},

      {
        projection: {
          passwordHash: 0,

          refreshToken: 0,

          internalNotes: 0,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 7. DON'T MIX INCLUSION AND EXCLUSION
 * ============================================================
 *
 * Generally:
 *
 *
 *     include fields
 *
 * OR
 *
 *     exclude fields
 *
 *
 * You cannot arbitrarily mix both.
 *
 *
 * The notable exception is _id.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. NESTED FIELD PROJECTION
 * ============================================================
 */

async function nestedProjection() {
  return users()
    .find(
      {},

      {
        projection: {
          name: 1,

          "profile.department": 1,

          "profile.semester": 1,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 9. PROJECTION WITH FINDONE
 * ============================================================
 */

async function publicUser(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  return users().findOne(
    {
      _id: new ObjectId(id),
    },

    {
      projection: {
        passwordHash: 0,

        refreshToken: 0,
      },
    },
  );
}

/*
 * ============================================================
 * 10. WHY PROJECTION MATTERS
 * ============================================================
 *
 * Projection can:
 *
 *     reduce response size
 *     reduce unnecessary data transfer
 *     avoid exposing sensitive fields
 *     simplify API responses
 *
 *
 * Example:
 *
 *
 * Database document:
 *
 *     20 fields
 *
 *
 * API response:
 *
 *     5 fields
 *
 *
 * Only return what the endpoint needs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. SORTING
 * ============================================================
 *
 * sort():
 *
 *     1  = ascending
 *    -1  = descending
 *
 * ============================================================
 */

async function sortAscending() {
  return users()
    .find({})
    .sort({
      name: 1,
    })
    .toArray();
}

/*
 * ============================================================
 * 12. SORT DESCENDING
 * ============================================================
 */

async function sortDescending() {
  return users()
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();
}

/*
 * ============================================================
 * 13. MULTI-FIELD SORT
 * ============================================================
 */

async function multiFieldSort() {
  return users()
    .find({})
    .sort({
      department: 1,

      name: 1,
    })
    .toArray();
}

/*
 * ============================================================
 * 14. SORT PRIORITY
 * ============================================================
 *
 * Example:
 *
 *
 *     {
 *       department: 1,
 *       age: -1
 *     }
 *
 *
 * Means:
 *
 *     1. department ascending
 *     2. within department, age descending
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. ALWAYS THINK ABOUT STABLE SORTING
 * ============================================================
 *
 * Suppose many documents have:
 *
 *
 *     createdAt: same timestamp
 *
 *
 * Sorting only by createdAt can result in unstable ordering
 * when paginating.
 *
 *
 * Add a unique tie-breaker:
 *
 *
 *     createdAt: -1
 *     _id: -1
 *
 *
 * ============================================================
 */

async function stableSort() {
  return users()
    .find({})
    .sort({
      createdAt: -1,

      _id: -1,
    })
    .toArray();
}

/*
 * ============================================================
 * 16. LIMIT
 * ============================================================
 *
 * limit() controls maximum number of documents returned.
 *
 * ============================================================
 */

async function limitExample() {
  return users().find({}).limit(20).toArray();
}

/*
 * ============================================================
 * 17. SKIP
 * ============================================================
 */

async function skipExample() {
  return users().find({}).skip(20).limit(20).toArray();
}

/*
 * ============================================================
 * 18. OFFSET PAGINATION
 * ============================================================
 *
 * Traditional pagination:
 *
 *
 *     page
 *     limit
 *
 *
 * Example:
 *
 *
 * Page 1:
 *
 *     page = 1
 *     limit = 20
 *     skip = 0
 *
 *
 * Page 2:
 *
 *     page = 2
 *     limit = 20
 *     skip = 20
 *
 *
 * Page 3:
 *
 *     page = 3
 *     limit = 20
 *     skip = 40
 *
 *
 * Formula:
 *
 *
 *     skip = (page - 1) * limit
 *
 * ============================================================
 */

async function offsetPagination(page, limit) {
  const skip = (page - 1) * limit;

  return users()
    .find({})
    .sort({
      createdAt: -1,

      _id: -1,
    })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/*
 * ============================================================
 * 19. OFFSET PAGINATION API
 * ============================================================
 *
 * Example:
 *
 *
 *     GET /users?page=2&limit=20
 *
 *
 * Server:
 *
 *
 *     page = 2
 *     limit = 20
 *
 *
 *     skip = 20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. VALIDATE PAGE AND LIMIT
 * ============================================================
 *
 * NEVER blindly trust:
 *
 *
 *     ?page=-100
 *     ?limit=100000000
 *
 *
 * ============================================================
 */

function parsePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);

  const requestedLimit = Number(query.limit) || 20;

  const limit = Math.min(Math.max(requestedLimit, 1), 100);

  return {
    page,
    limit,
  };
}

/*
 * ============================================================
 * 21. OFFSET PAGINATION WITH COUNT
 * ============================================================
 */

async function paginatedUsers(query) {
  const { page, limit } = parsePagination(query);

  const skip = (page - 1) * limit;

  const collection = users();

  const filter = {};

  const [data, total] = await Promise.all([
    collection
      .find(filter)
      .sort({
        createdAt: -1,

        _id: -1,
      })
      .skip(skip)
      .limit(limit)
      .toArray(),

    collection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,

    pagination: {
      page,

      limit,

      total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    },
  };
}

/*
 * ============================================================
 * 22. OFFSET PAGINATION PROBLEM
 * ============================================================
 *
 * skip() becomes increasingly expensive for very deep pages.
 *
 *
 * Example:
 *
 *
 * page 1
 *     skip 0
 *
 * page 1000
 *     skip 19,980
 *
 * page 100,000
 *     skip 1,999,980
 *
 *
 * For very large collections, cursor/keyset pagination is
 * usually preferable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CURSOR PAGINATION
 * ============================================================
 *
 * Instead of saying:
 *
 *
 *     "give me page 500"
 *
 *
 * say:
 *
 *
 *     "give me documents after this document"
 *
 *
 * Example:
 *
 *
 *     ?cursor=<lastDocumentId>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. SIMPLE ObjectId CURSOR
 * ============================================================
 *
 * If sorting by _id descending:
 *
 *
 *     _id: -1
 *
 *
 * the next page can request:
 *
 *
 *     _id < lastId
 *
 * ============================================================
 */

async function cursorPagination(cursor, limit = 20) {
  const collection = users();

  const filter = {};

  if (cursor) {
    if (!ObjectId.isValid(cursor)) {
      throw new Error("Invalid cursor");
    }

    filter._id = {
      $lt: new ObjectId(cursor),
    };
  }

  return collection
    .find(filter)
    .sort({
      _id: -1,
    })
    .limit(limit + 1)
    .toArray();
}

/*
 * ============================================================
 * 25. WHY LIMIT + 1?
 * ============================================================
 *
 * If the API asks for:
 *
 *
 *     limit = 20
 *
 *
 * fetch:
 *
 *
 *     21 documents
 *
 *
 * If 21 exist:
 *
 *     hasNextPage = true
 *
 *
 * Return only the first 20.
 *
 *
 * The 21st document tells us another page exists.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. PRODUCTION CURSOR PAGINATION
 * ============================================================
 */

async function getUsersCursorPage(cursor, requestedLimit) {
  const limit = Math.min(Math.max(Number(requestedLimit) || 20, 1), 100);

  const collection = users();

  const filter = {};

  if (cursor) {
    if (!ObjectId.isValid(cursor)) {
      throw new Error("Invalid cursor");
    }

    filter._id = {
      $lt: new ObjectId(cursor),
    };
  }

  const documents = await collection
    .find(filter)
    .sort({
      _id: -1,
    })
    .limit(limit + 1)
    .toArray();

  const hasNextPage = documents.length > limit;

  const data = hasNextPage ? documents.slice(0, limit) : documents;

  const nextCursor = hasNextPage ? data[data.length - 1]?._id.toString() : null;

  return {
    data,

    pagination: {
      limit,

      hasNextPage,

      nextCursor,
    },
  };
}

/*
 * ============================================================
 * 27. CURSOR PAGINATION FLOW
 * ============================================================
 *
 *
 * Request 1:
 *
 *     GET /users?limit=20
 *
 *              ↓
 *
 *     return 20 users
 *
 *     nextCursor = "abc..."
 *
 *
 *
 * Request 2:
 *
 *     GET /users?limit=20&cursor=abc...
 *
 *              ↓
 *
 *     return next 20 users
 *
 *     nextCursor = "xyz..."
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. CURSOR PAGINATION WITH createdAt
 * ============================================================
 *
 * In production, you often want:
 *
 *
 *     createdAt DESC
 *     _id DESC
 *
 *
 * This provides a stable ordering.
 *
 *
 * But cursor filtering must account for BOTH fields.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. COMPOUND CURSOR CONDITION
 * ============================================================
 *
 * Suppose last document has:
 *
 *
 *     createdAt = T
 *     _id = ID
 *
 *
 * Next page should contain documents where:
 *
 *
 *     createdAt < T
 *
 * OR
 *
 *     createdAt == T
 *     AND
 *     _id < ID
 *
 * ============================================================
 */

async function stableCursorPagination(cursor, limit = 20) {
  const collection = users();

  const filter = {};

  if (cursor) {
    const decoded = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    );

    const createdAt = new Date(decoded.createdAt);

    const id = new ObjectId(decoded.id);

    filter.$or = [
      {
        createdAt: {
          $lt: createdAt,
        },
      },

      {
        createdAt: createdAt,

        _id: {
          $lt: id,
        },
      },
    ];
  }

  const documents = await collection
    .find(filter)
    .sort({
      createdAt: -1,

      _id: -1,
    })
    .limit(limit + 1)
    .toArray();

  const hasNextPage = documents.length > limit;

  const data = hasNextPage ? documents.slice(0, limit) : documents;

  let nextCursor = null;

  if (hasNextPage && data.length > 0) {
    const last = data[data.length - 1];

    const payload = {
      createdAt: last.createdAt.toISOString(),

      id: last._id.toString(),
    };

    nextCursor = Buffer.from(JSON.stringify(payload)).toString("base64url");
  }

  return {
    data,

    pagination: {
      limit,

      hasNextPage,

      nextCursor,
    },
  };
}

/*
 * ============================================================
 * 30. OFFSET VS CURSOR
 * ============================================================
 *
 *
 * OFFSET:
 *
 *     page=100
 *     skip=1980
 *
 * Advantages:
 *
 *     easy
 *     supports direct page numbers
 *     good for small/moderate datasets
 *
 * Disadvantages:
 *
 *     deep skip can become expensive
 *     inserts/deletes can shift pages
 *
 *
 *
 * CURSOR:
 *
 *     cursor=lastSeenValue
 *
 * Advantages:
 *
 *     efficient for large datasets
 *     stable scrolling
 *     excellent for feeds
 *
 * Disadvantages:
 *
 *     no natural "page 100"
 *     more complex API
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. WHICH SHOULD YOU USE?
 * ============================================================
 *
 *
 * ADMIN DASHBOARD
 *
 *     offset pagination is often fine.
 *
 *
 * SMALL COLLECTION
 *
 *     offset pagination is usually sufficient.
 *
 *
 * LARGE DATASET
 *
 *     cursor pagination.
 *
 *
 * INFINITE SCROLL
 *
 *     cursor pagination.
 *
 *
 * ACTIVITY FEED
 *
 *     cursor pagination.
 *
 *
 * PUBLIC SEARCH RESULTS
 *
 *     depends on search engine/query design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. PROJECTION + SORT + PAGINATION
 * ============================================================
 *
 * These are frequently combined:
 *
 * ============================================================
 */

async function productionListQuery(filter, page, limit) {
  const skip = (page - 1) * limit;

  return users()
    .find(
      filter,

      {
        projection: {
          _id: 1,

          name: 1,

          email: 1,

          department: 1,

          createdAt: 1,
        },
      },
    )
    .sort({
      createdAt: -1,

      _id: -1,
    })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/*
 * ============================================================
 * 33. SEARCH + PAGINATION
 * ============================================================
 */

async function searchUsers(search, page, limit) {
  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  return productionListQuery(filter, page, limit);
}

/*
 * ============================================================
 * 34. WARNING: REGEX + PAGINATION
 * ============================================================
 *
 * A contains-style regex:
 *
 *
 *     /shiva/i
 *
 *
 * can become expensive on large collections.
 *
 *
 * For serious search functionality consider:
 *
 *
 *     appropriate indexes
 *     MongoDB Search
 *     dedicated search systems
 *
 * depending on requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. PAGINATION RESPONSE
 * ============================================================
 *
 * Good API response:
 *
 *
 * {
 *
 *   "data": [
 *      ...
 *   ],
 *
 *   "pagination": {
 *
 *      "page": 2,
 *
 *      "limit": 20,
 *
 *      "total": 145,
 *
 *      "totalPages": 8,
 *
 *      "hasNextPage": true,
 *
 *      "hasPreviousPage": true
 *
 *   }
 *
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. CURSOR RESPONSE
 * ============================================================
 *
 *
 * {
 *
 *   "data": [
 *      ...
 *   ],
 *
 *   "pagination": {
 *
 *      "limit": 20,
 *
 *      "hasNextPage": true,
 *
 *      "nextCursor": "eyJ..."
 *
 *   }
 *
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. API QUERY PARAMETERS
 * ============================================================
 *
 *
 * Offset:
 *
 *     GET /users
 *     GET /users?page=2
 *     GET /users?page=2&limit=50
 *
 *
 * Cursor:
 *
 *     GET /users?limit=20
 *
 *     GET /users?
 *         limit=20&
 *         cursor=abc
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. DON'T ALLOW UNLIMITED LIMIT
 * ============================================================
 *
 * Bad:
 *
 *
 *     ?limit=1000000
 *
 *
 * Better:
 *
 *
 *     maximum limit = 100
 *
 *
 * Example:
 *
 *
 *     limit = Math.min(requestedLimit, 100)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. SORT FIELD WHITELIST
 * ============================================================
 *
 * Never blindly allow arbitrary database fields for sorting.
 *
 *
 * Bad:
 *
 *
 *     sort(req.query.sort)
 *
 *
 * Better:
 *
 *
 *     allowedSortFields = {
 *
 *       name: "name",
 *       createdAt: "createdAt",
 *       age: "age"
 *
 *     }
 *
 * ============================================================
 */

const allowedSortFields = {
  name: "name",

  createdAt: "createdAt",

  age: "age",
};

/*
 * ============================================================
 * 40. BUILD SORT
 * ============================================================
 */

function buildSort(sortField, sortDirection) {
  const field = allowedSortFields[sortField] ?? "createdAt";

  const direction = sortDirection === "asc" ? 1 : -1;

  return {
    [field]: direction,

    _id: -1,
  };
}

/*
 * ============================================================
 * 41. COMPLETE LIST QUERY
 * ============================================================
 */

async function listUsers({
  filter = {},
  page = 1,
  limit = 20,
  sortField = "createdAt",
  sortDirection = "desc",
}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const safePage = Math.max(page, 1);

  const skip = (safePage - 1) * safeLimit;

  const sort = buildSort(sortField, sortDirection);

  const collection = users();

  const [data, total] = await Promise.all([
    collection
      .find(
        filter,

        {
          projection: {
            _id: 1,

            name: 1,

            email: 1,

            department: 1,

            createdAt: 1,
          },
        },
      )
      .sort(sort)
      .skip(skip)
      .limit(safeLimit)
      .toArray(),

    collection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    data,

    pagination: {
      page: safePage,

      limit: safeLimit,

      total,

      totalPages,

      hasNextPage: safePage < totalPages,

      hasPreviousPage: safePage > 1,
    },
  };
}

/*
 * ============================================================
 * 42. TIMETABLE LIST EXAMPLE
 * ============================================================
 *
 * For your timetable generator:
 *
 *
 * GET /timetables?
 *     departmentId=...&
 *     semester=5&
 *     page=1&
 *     limit=20&
 *     sort=createdAt&
 *     order=desc
 *
 *
 * Query pipeline:
 *
 *
 * HTTP
 *   ↓
 * validate query
 *   ↓
 * build filter
 *   ↓
 * build sort
 *   ↓
 * projection
 *   ↓
 * pagination
 *   ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. INDEXING CONNECTION
 * ============================================================
 *
 * If you frequently run:
 *
 *
 *     filter:
 *       organizationId
 *       departmentId
 *
 *
 * and:
 *
 *
 *     sort:
 *       createdAt
 *
 *
 * then your index design should reflect that access pattern.
 *
 *
 * Example conceptual index:
 *
 *
 *     {
 *       organizationId: 1,
 *       departmentId: 1,
 *       createdAt: -1
 *     }
 *
 *
 * Index design is covered separately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. IMPORTANT: SORT + INDEX
 * ============================================================
 *
 * Large collection:
 *
 *
 *     find(filter)
 *     sort(sort)
 *     limit(limit)
 *
 *
 * can be efficient when MongoDB has an appropriate index.
 *
 *
 * Without appropriate indexes, MongoDB may need to scan many
 * documents and/or perform an expensive sort.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. MAIN
 * ============================================================
 */

async function main() {
  try {
    await client.connect();

    console.log("MongoDB connected");

    /*
     * Examples:
     *
     * await includeProjection();
     *
     * await sortDescending();
     *
     * await offsetPagination(
     *   1,
     *   20,
     * );
     *
     * await getUsersCursorPage(
     *   null,
     *   20,
     * );
     */
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

main();
