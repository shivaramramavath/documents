/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/offset_pagination.js
 *
 * Topic:
 *     REST API Offset Pagination
 *
 * ============================================================
 *
 * Pagination means returning a limited portion of a large
 * collection instead of returning every record at once.
 *
 * Without pagination:
 *
 *     GET /users
 *
 * could return:
 *
 *     1,000,000 users
 *
 * With pagination:
 *
 *     GET /users?page=1&limit=20
 *
 * returns only 20 users.
 *
 * ============================================================
 *
 * Important concepts:
 *
 *     page
 *     limit
 *     offset
 *     skip
 *     total
 *     totalPages
 *
 * ============================================================
 */

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * ============================================================
 * SAMPLE DATA
 * ============================================================
 */

const users = Array.from(
  {
    length: 105,
  },
  (_, index) => ({
    id: index + 1,

    name: `User ${index + 1}`,

    email: `user${index + 1}@example.com`,
  }),
);

/*
 * ============================================================
 * 1. WHAT IS PAGINATION?
 * ============================================================
 *
 * Suppose we have:
 *
 *     105 users
 *
 * We don't want to return all 105 records every time.
 *
 * Instead:
 *
 *     page 1 → users 1-10
 *     page 2 → users 11-20
 *     page 3 → users 21-30
 *
 * etc.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. PAGE
 * ============================================================
 *
 * page tells us WHICH page the client wants.
 *
 *
 * Example:
 *
 *     ?page=1
 *
 *     ?page=2
 *
 *     ?page=10
 *
 *
 * Default:
 *
 *     page = 1
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. LIMIT
 * ============================================================
 *
 * limit tells us HOW MANY records should be returned.
 *
 *
 * Example:
 *
 *     ?limit=10
 *
 * means:
 *
 *     return at most 10 records.
 *
 *
 * Default:
 *
 *     limit = 10
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. OFFSET
 * ============================================================
 *
 * Offset tells us how many records should be skipped.
 *
 *
 * Formula:
 *
 *
 *     offset =
 *       (page - 1) * limit
 *
 *
 * Example:
 *
 *
 *     page = 1
 *     limit = 10
 *
 *     offset =
 *       (1 - 1) * 10
 *
 *     offset = 0
 *
 *
 * Page 1:
 *
 *     skip 0
 *
 *
 * ------------------------------------------------------------
 *
 *
 *     page = 2
 *     limit = 10
 *
 *     offset =
 *       (2 - 1) * 10
 *
 *     offset = 10
 *
 *
 * Page 2:
 *
 *     skip 10
 *
 *
 * ------------------------------------------------------------
 *
 *
 *     page = 3
 *     limit = 10
 *
 *     offset =
 *       (3 - 1) * 10
 *
 *     offset = 20
 *
 *
 * Page 3:
 *
 *     skip 20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. SIMPLE PAGINATION
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * Read page.
   *
   * Query parameters arrive as strings.
   */

  const page = Number(req.query.page || 1);

  /*
   * Read limit.
   */

  const limit = Number(req.query.limit || 10);

  /*
   * Validate page.
   */

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      error: {
        code: "INVALID_PAGE",

        message: "page must be a positive integer",
      },
    });
  }

  /*
   * Validate limit.
   */

  if (!Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({
      error: {
        code: "INVALID_LIMIT",

        message: "limit must be a positive integer",
      },
    });
  }

  /*
   * Protect the API from excessively large requests.
   */

  if (limit > 100) {
    return res.status(400).json({
      error: {
        code: "LIMIT_TOO_LARGE",

        message: "limit cannot exceed 100",
      },
    });
  }

  /*
   * Calculate offset.
   */

  const offset = (page - 1) * limit;

  /*
   * Get requested records.
   *
   * Array.slice():
   *
   *     slice(start, end)
   */

  const data = users.slice(offset, offset + limit);

  /*
   * Return response.
   */

  return res.status(200).json({
    data,
  });
});

/*
 * ============================================================
 * 6. PAGE 1
 * ============================================================
 *
 * Request:
 *
 *     GET /users?page=1&limit=10
 *
 *
 * Calculation:
 *
 *
 *     offset =
 *       (1 - 1) * 10
 *
 *     offset = 0
 *
 *
 * Returned:
 *
 *     users 1-10
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. PAGE 2
 * ============================================================
 *
 * Request:
 *
 *     GET /users?page=2&limit=10
 *
 *
 * Calculation:
 *
 *
 *     offset =
 *       (2 - 1) * 10
 *
 *     offset = 10
 *
 *
 * Returned:
 *
 *     users 11-20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. PAGE 3
 * ============================================================
 *
 * Request:
 *
 *     GET /users?page=3&limit=10
 *
 *
 * Calculation:
 *
 *
 *     offset =
 *       (3 - 1) * 10
 *
 *     offset = 20
 *
 *
 * Returned:
 *
 *     users 21-30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. TOTAL RECORDS
 * ============================================================
 *
 * Clients often need to know how many records exist.
 *
 *
 * Example:
 *
 *     total = 105
 *
 *
 * We can calculate:
 *
 *     users.length
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. TOTAL PAGES
 * ============================================================
 *
 * Formula:
 *
 *
 *     totalPages =
 *       Math.ceil(
 *         total / limit
 *       )
 *
 *
 * Example:
 *
 *
 *     total = 105
 *     limit = 10
 *
 *
 *     totalPages =
 *       Math.ceil(105 / 10)
 *
 *
 *     totalPages = 11
 *
 *
 * Why?
 *
 *
 *     10 full pages = 100 records
 *
 *     remaining = 5
 *
 *     therefore:
 *
 *     11 pages
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. COMPLETE PAGINATION RESPONSE
 * ============================================================
 */

app.get("/users/paginated", (req, res) => {
  const page = Number(req.query.page || 1);

  const limit = Number(req.query.limit || 10);

  /*
   * Validate page.
   */

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      error: {
        code: "INVALID_PAGE",

        message: "page must be >= 1",
      },
    });
  }

  /*
   * Validate limit.
   */

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: {
        code: "INVALID_LIMIT",

        message: "limit must be between 1 and 100",
      },
    });
  }

  /*
   * Calculate offset.
   */

  const offset = (page - 1) * limit;

  /*
   * Total records.
   */

  const total = users.length;

  /*
   * Total pages.
   */

  const totalPages = Math.ceil(total / limit);

  /*
   * Current page data.
   */

  const data = users.slice(offset, offset + limit);

  /*
   * Has next page?
   */

  const hasNextPage = page < totalPages;

  /*
   * Has previous page?
   */

  const hasPreviousPage = page > 1;

  /*
   * Return structured response.
   */

  return res.status(200).json({
    data,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  });
});

/*
 * ============================================================
 * 12. EXAMPLE RESPONSE
 * ============================================================
 *
 * Request:
 *
 *     GET /users/paginated?page=2&limit=10
 *
 *
 * Response:
 *
 *
 * {
 *   "data": [
 *     ...
 *   ],
 *
 *   "pagination": {
 *     "page": 2,
 *     "limit": 10,
 *     "total": 105,
 *     "totalPages": 11,
 *     "hasNextPage": true,
 *     "hasPreviousPage": true
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. FIRST PAGE
 * ============================================================
 *
 * page = 1
 *
 *
 * hasPreviousPage:
 *
 *     false
 *
 *
 * hasNextPage:
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. LAST PAGE
 * ============================================================
 *
 * page = 11
 *
 *
 * hasPreviousPage:
 *
 *     true
 *
 *
 * hasNextPage:
 *
 *     false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. PAGE BEYOND LAST PAGE
 * ============================================================
 *
 * Suppose:
 *
 *     total = 105
 *     limit = 10
 *
 *     totalPages = 11
 *
 *
 * Client requests:
 *
 *     ?page=50
 *
 *
 * There are no records.
 *
 *
 * We can either return:
 *
 *     data: []
 *
 *
 * or reject the request with:
 *
 *     404
 *
 *
 * Most collection APIs commonly return:
 *
 *     200
 *     data: []
 *
 *
 * because the collection endpoint itself exists; the requested
 * page simply contains no records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. DATABASE PAGINATION
 * ============================================================
 *
 * In a real application, DON'T load every document first.
 *
 *
 * Bad:
 *
 *
 *     const users =
 *       await User.find();
 *
 *
 *     const data =
 *       users.slice(
 *         offset,
 *         offset + limit,
 *       );
 *
 *
 * This loads all records into application memory.
 *
 *
 * Better:
 *
 *
 *     const data =
 *       await User.find()
 *         .skip(offset)
 *         .limit(limit);
 *
 *
 * MongoDB performs the pagination at the database layer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. MONGOOSE EXAMPLE
 * ============================================================
 *
 *     const data =
 *       await User.find(filter)
 *         .skip(offset)
 *         .limit(limit)
 *         .lean();
 *
 *
 * This means:
 *
 *
 *     filter
 *       ↓
 *     skip
 *       ↓
 *     limit
 *       ↓
 *     documents
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. COUNT DOCUMENTS
 * ============================================================
 *
 * To calculate total pages, we normally need total count.
 *
 *
 * Mongoose:
 *
 *
 *     const total =
 *       await User.countDocuments(
 *         filter,
 *       );
 *
 *
 * Then:
 *
 *
 *     const totalPages =
 *       Math.ceil(
 *         total / limit,
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. PAGINATION WITH FILTERING
 * ============================================================
 *
 * Pagination normally works together with filtering.
 *
 *
 * Example:
 *
 *
 *     GET /users
 *
 *       ?role=developer
 *       &active=true
 *       &page=2
 *       &limit=20
 *
 *
 * Processing:
 *
 *
 *     filter
 *       ↓
 *     count matching records
 *       ↓
 *     skip
 *       ↓
 *     limit
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. IMPORTANT
 * ============================================================
 *
 * The total count must correspond to the FILTERED collection.
 *
 *
 * Example:
 *
 *
 * Total users:
 *
 *     1000
 *
 *
 * Active users:
 *
 *     350
 *
 *
 * Request:
 *
 *
 *     ?active=true
 *
 *
 * Then:
 *
 *
 *     total = 350
 *
 *
 * NOT:
 *
 *
 *     total = 1000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. PAGINATION + FILTER + SORT
 * ============================================================
 *
 * A typical API:
 *
 *
 *     GET /users
 *
 *       ?active=true
 *       &age[gte]=18
 *       &sort=createdAt
 *       &order=desc
 *       &page=1
 *       &limit=20
 *
 *
 * Logical database operation:
 *
 *
 *     find(filter)
 *       ↓
 *     sort()
 *       ↓
 *     skip()
 *       ↓
 *     limit()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. WHY SORT BEFORE PAGINATION?
 * ============================================================
 *
 * Suppose records are:
 *
 *
 *     A
 *     B
 *     C
 *     D
 *     E
 *
 *
 * If you paginate first and sort later, the page boundaries
 * can become incorrect.
 *
 *
 * Conceptually:
 *
 *
 *     FILTER
 *       ↓
 *     SORT
 *       ↓
 *     PAGINATE
 *
 *
 * This gives deterministic pages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. STABLE SORT
 * ============================================================
 *
 * Pagination works best with deterministic ordering.
 *
 *
 * Example:
 *
 *
 *     sort({
 *       createdAt: -1,
 *       _id: -1,
 *     })
 *
 *
 * If many records have the same createdAt value, _id provides
 * a secondary ordering.
 *
 *
 * This becomes especially important when records are inserted
 * while users are navigating pages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. OFFSET PAGINATION FORMULA
 * ============================================================
 *
 *
 *     offset =
 *       (page - 1) * limit
 *
 *
 * Then:
 *
 *
 *     skip(offset)
 *
 *
 *     limit(limit)
 *
 *
 * Example:
 *
 *
 *     page = 5
 *     limit = 20
 *
 *
 *     offset =
 *       (5 - 1) * 20
 *
 *
 *     offset = 80
 *
 *
 * Database:
 *
 *
 *     skip(80)
 *     limit(20)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. OFFSET PAGINATION PROBLEM
 * ============================================================
 *
 * Offset pagination becomes less efficient for very deep pages.
 *
 *
 * Example:
 *
 *
 *     page = 100000
 *     limit = 20
 *
 *
 * offset:
 *
 *
 *     1,999,980
 *
 *
 * The database may need to traverse a large number of records
 * before reaching the requested offset.
 *
 *
 * For large/high-volume datasets, cursor pagination can be a
 * better choice.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. OFFSET PAGINATION IS GOOD FOR
 * ============================================================
 *
 *     admin dashboards
 *     small/medium collections
 *     traditional tables
 *     pages with numbered navigation
 *     reports
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. CURSOR PAGINATION IS GOOD FOR
 * ============================================================
 *
 *     feeds
 *     infinite scrolling
 *     large collections
 *     event streams
 *     high-volume APIs
 *
 *
 * We will learn cursor pagination separately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. API VALIDATION
 * ============================================================
 *
 * Never blindly trust:
 *
 *
 *     ?page=-100
 *
 *     ?page=abc
 *
 *     ?limit=hello
 *
 *     ?limit=999999999
 *
 *
 * Validate:
 *
 *
 *     page >= 1
 *
 *     limit >= 1
 *
 *     limit <= maximum
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. MAXIMUM LIMIT
 * ============================================================
 *
 * A common API rule:
 *
 *
 *     default limit = 20
 *
 *     maximum limit = 100
 *
 *
 * This prevents:
 *
 *
 *     ?limit=1000000
 *
 *
 * from generating unnecessarily large responses.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. RESPONSE DESIGN
 * ============================================================
 *
 * Recommended structure:
 *
 *
 * {
 *   data: [],
 *
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 105,
 *     totalPages: 6,
 *     hasNextPage: true,
 *     hasPreviousPage: false
 *   }
 * }
 *
 *
 * This makes the API easy for frontend applications to consume.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. OFFSET VS PAGE
 * ============================================================
 *
 * Client-facing API:
 *
 *
 *     page
 *     limit
 *
 *
 * Database-facing calculation:
 *
 *
 *     skip
 *     limit
 *
 *
 * Therefore:
 *
 *
 *     page + limit
 *          ↓
 *     offset
 *          ↓
 *     skip + limit
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. CONTROLLER / SERVICE DESIGN
 * ============================================================
 *
 *
 * Controller:
 *
 *     reads req.query
 *
 *
 * Service:
 *
 *     validates pagination
 *     calculates offset
 *
 *
 * Repository:
 *
 *     executes database query
 *
 *
 * Example:
 *
 *
 *     Controller
 *         ↓
 *     Service
 *         ↓
 *     Repository
 *         ↓
 *     MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. PAGINATION SERVICE
 * ============================================================
 */

function createPagination(page, limit) {
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
}

/*
 * Example:
 *
 *
 *     createPagination(
 *       3,
 *       20,
 *     );
 *
 *
 * returns:
 *
 *
 *     {
 *       page: 3,
 *       limit: 20,
 *       offset: 40
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. PAGINATION METADATA HELPER
 * ============================================================
 */

function createPaginationMetadata(page, limit, total) {
  const totalPages = Math.ceil(total / limit);

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
 * 35. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * Client:
 *
 *     ?page=3&limit=20
 *
 *          ↓
 *
 * Validate
 *
 *          ↓
 *
 * Calculate:
 *
 *     offset =
 *       (3 - 1) * 20
 *
 *     offset = 40
 *
 *          ↓
 *
 * Database:
 *
 *     skip(40)
 *     limit(20)
 *
 *          ↓
 *
 * Return:
 *
 *     data
 *     page
 *     limit
 *     total
 *     totalPages
 *     hasNextPage
 *     hasPreviousPage
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/cursor_pagination.js
 *
 * We will learn:
 *
 *     cursor
 *     nextCursor
 *     previousCursor
 *     ObjectId ordering
 *     infinite scrolling
 *     why cursor pagination scales better
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
