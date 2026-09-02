/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/page_limit.js
 *
 * Topic:
 *     REST API Pagination
 *
 * ============================================================
 *
 * Pagination
 * ============================================================
 *
 * Pagination means returning a large collection in smaller
 * pieces instead of returning everything at once.
 *
 *
 * Example:
 *
 *     GET /users
 *
 * If there are 100,000 users, returning all 100,000 records
 * in one response is usually inefficient.
 *
 *
 * Instead:
 *
 *     GET /users?page=1&limit=20
 *
 *     GET /users?page=2&limit=20
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
 *
 * In a real application this data would come from a database.
 * ============================================================
 */

const users = Array.from(
  {
    length: 100,
  },
  (_, index) => ({
    id: String(index + 1),

    name: `User ${index + 1}`,

    email: `user${index + 1}@example.com`,
  }),
);

/*
 * ============================================================
 * BASIC PAGINATION
 * ============================================================
 *
 * Endpoint:
 *
 *     GET /users?page=1&limit=10
 *
 *
 * page
 *     Which page should be returned?
 *
 *
 * limit
 *     How many records should be returned per page?
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * Query parameters arrive as strings.
   *
   * Example:
   *
   *     ?page=2&limit=10
   *
   *
   * req.query:
   *
   *     {
   *       page: "2",
   *       limit: "10"
   *     }
   */

  const page = Number(req.query.page ?? 1);

  const limit = Number(req.query.limit ?? 10);

  /*
   * ========================================================
   * VALIDATION
   * ========================================================
   */

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      error: {
        code: "INVALID_PAGE",

        message: "Page must be a positive integer",
      },
    });
  }

  if (!Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({
      error: {
        code: "INVALID_LIMIT",

        message: "Limit must be a positive integer",
      },
    });
  }

  /*
   * ========================================================
   * MAXIMUM LIMIT
   * ========================================================
   *
   * Never allow clients to request an unlimited number of
   * records accidentally.
   *
   * Example:
   *
   *     ?limit=100000000
   *
   * could create a very expensive database operation.
   */

  const MAX_LIMIT = 100;

  if (limit > MAX_LIMIT) {
    return res.status(400).json({
      error: {
        code: "LIMIT_TOO_LARGE",

        message: `Limit cannot exceed ${MAX_LIMIT}`,
      },
    });
  }

  /*
   * ========================================================
   * CALCULATE OFFSET
   * ========================================================
   *
   * Formula:
   *
   *     offset = (page - 1) * limit
   *
   *
   * Example:
   *
   * page = 1
   * limit = 10
   *
   * offset = (1 - 1) * 10
   *        = 0
   *
   *
   * page = 2
   * limit = 10
   *
   * offset = (2 - 1) * 10
   *        = 10
   *
   *
   * page = 3
   * limit = 10
   *
   * offset = (3 - 1) * 10
   *        = 20
   *
   * ========================================================
   */

  const offset = (page - 1) * limit;

  /*
   * ========================================================
   * GET PAGE
   * ========================================================
   *
   * JavaScript:
   *
   *     array.slice(start, end)
   *
   *
   * Example:
   *
   *     slice(10, 20)
   *
   * returns indexes:
   *
   *     10 ... 19
   */

  const data = users.slice(offset, offset + limit);

  /*
   * ========================================================
   * TOTAL
   * ========================================================
   */

  const total = users.length;

  /*
   * ========================================================
   * TOTAL PAGES
   * ========================================================
   *
   * Formula:
   *
   *     Math.ceil(total / limit)
   *
   *
   * Example:
   *
   *     total = 95
   *     limit = 10
   *
   *     totalPages = 10
   *
   * ========================================================
   */

  const totalPages = Math.ceil(total / limit);

  /*
   * ========================================================
   * HAS NEXT / PREVIOUS
   * ========================================================
   */

  const hasNextPage = page < totalPages;

  const hasPreviousPage = page > 1;

  /*
   * ========================================================
   * RESPONSE
   * ========================================================
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
 * EXAMPLE RESPONSE
 * ============================================================
 *
 *
 * GET /users?page=2&limit=10
 *
 *
 * {
 *   "data": [
 *     {
 *       "id": "11",
 *       "name": "User 11",
 *       "email": "user11@example.com"
 *     },
 *     ...
 *     {
 *       "id": "20",
 *       "name": "User 20",
 *       "email": "user20@example.com"
 *     }
 *   ],
 *
 *   "pagination": {
 *     "page": 2,
 *     "limit": 10,
 *     "total": 100,
 *     "totalPages": 10,
 *     "hasNextPage": true,
 *     "hasPreviousPage": true
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. PAGE
 * ============================================================
 *
 * `page` identifies the requested page.
 *
 *
 * Example:
 *
 *     page=1
 *     page=2
 *     page=3
 *
 *
 * Usually page numbering starts at 1 because it is easier for
 * API consumers to understand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. LIMIT
 * ============================================================
 *
 * `limit` controls how many records are returned.
 *
 *
 * Example:
 *
 *     ?limit=10
 *
 * means:
 *
 *     Return at most 10 records.
 *
 *
 * Typical API:
 *
 *     default limit = 20
 *     maximum limit = 100
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. OFFSET
 * ============================================================
 *
 * Offset tells us how many records to skip.
 *
 *
 * Formula:
 *
 *     offset = (page - 1) * limit
 *
 *
 * Table:
 *
 *     Page    Limit    Offset
 *     ───────────────────────
 *      1       10        0
 *      2       10       10
 *      3       10       20
 *      4       10       30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. SLICE
 * ============================================================
 *
 * JavaScript example:
 *
 *     users.slice(20, 30)
 *
 *
 * means:
 *
 *     start at index 20
 *     stop before index 30
 *
 *
 * Therefore:
 *
 *     20 records are skipped
 *     10 records are returned
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. EMPTY PAGE
 * ============================================================
 *
 * Suppose:
 *
 *     total = 100
 *     limit = 10
 *
 * Total pages:
 *
 *     10
 *
 *
 * Request:
 *
 *     GET /users?page=11&limit=10
 *
 *
 * There are no records.
 *
 *
 * One reasonable response:
 *
 *     200 OK
 *
 *     {
 *       "data": [],
 *       "pagination": {
 *         ...
 *       }
 *     }
 *
 *
 * Some APIs may instead return 404 for an invalid page.
 *
 * Define this behavior consistently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. PAGE GREATER THAN TOTAL PAGES
 * ============================================================
 *
 * You can explicitly reject it.
 *
 *
 * Example:
 *
 *     if (
 *       totalPages > 0 &&
 *       page > totalPages
 *     ) {
 *       return res.status(404)...
 *     }
 *
 *
 * But returning an empty collection with 200 can also be a
 * reasonable API design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. LIMIT = 0
 * ============================================================
 *
 * Usually reject:
 *
 *     ?limit=0
 *
 *
 * because:
 *
 *     total / 0
 *
 * is not meaningful for pagination.
 *
 *
 * Return:
 *
 *     400 Bad Request
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. NEGATIVE VALUES
 * ============================================================
 *
 * Reject:
 *
 *     ?page=-1
 *
 *     ?limit=-10
 *
 *
 * Example:
 *
 *     page >= 1
 *     limit >= 1
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. DECIMAL VALUES
 * ============================================================
 *
 * Reject:
 *
 *     ?page=1.5
 *
 *     ?limit=10.5
 *
 *
 * Pagination parameters should normally be integers.
 *
 *
 * Use:
 *
 *     Number.isInteger()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. NaN
 * ============================================================
 *
 * Request:
 *
 *     ?page=hello
 *
 *
 * Then:
 *
 *     Number("hello")
 *
 * becomes:
 *
 *     NaN
 *
 *
 * Therefore validation must check the converted value.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. DATABASE PAGINATION
 * ============================================================
 *
 * With MongoDB, the conceptual equivalent is:
 *
 *
 *     Model.find({})
 *       .skip(offset)
 *       .limit(limit)
 *
 *
 * Example:
 *
 *     const users =
 *       await User.find({})
 *         .skip(offset)
 *         .limit(limit);
 *
 *
 * This is database-side pagination rather than loading every
 * record into Node.js first.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. DO NOT DO THIS IN PRODUCTION
 * ============================================================
 *
 *
 * const allUsers =
 *   await User.find({});
 *
 *
 * const page =
 *   allUsers.slice(
 *     offset,
 *     offset + limit,
 *   );
 *
 *
 * This loads the entire collection into application memory.
 *
 *
 * For large collections:
 *
 *     database should perform pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. COUNT QUERY
 * ============================================================
 *
 * To calculate total pages, you often need:
 *
 *
 *     total = number of matching records
 *
 *
 * MongoDB:
 *
 *     User.countDocuments(filter)
 *
 *
 * Then:
 *
 *     totalPages =
 *       Math.ceil(
 *         total / limit,
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. FILTER + PAGINATION
 * ============================================================
 *
 * Pagination normally comes AFTER filtering.
 *
 *
 * Example:
 *
 *     GET /users?role=student&page=2&limit=20
 *
 *
 * Conceptually:
 *
 *
 *     Database
 *         ↓
 *     filter role=student
 *         ↓
 *     sort
 *         ↓
 *     skip
 *         ↓
 *     limit
 *         ↓
 *     response
 *
 *
 * You do NOT want:
 *
 *     take arbitrary 20 users
 *         ↓
 *     filter them
 *
 * because the page may not contain the expected number of
 * matching records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. SORT + PAGINATION
 * ============================================================
 *
 * Always think carefully about ordering.
 *
 *
 * Example:
 *
 *     GET /users?sort=name&page=2&limit=10
 *
 *
 * Conceptually:
 *
 *     FILTER
 *       ↓
 *     SORT
 *       ↓
 *     PAGINATE
 *
 *
 * Without deterministic ordering, records can move between
 * pages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. WHY SORTING MATTERS
 * ============================================================
 *
 * Imagine records:
 *
 *     A B C D E F G H I J
 *
 *
 * Page 1:
 *
 *     A B C D E
 *
 *
 * A new record is inserted before page 2 is requested.
 *
 * Without stable ordering, the second request can produce
 * duplicate or missing records.
 *
 * This is one reason cursor pagination becomes useful for
 * changing datasets.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. PERFORMANCE PROBLEM WITH LARGE OFFSET
 * ============================================================
 *
 * Offset pagination is simple:
 *
 *     page=1
 *     page=2
 *     page=1000
 *
 *
 * But a very large:
 *
 *     OFFSET
 *
 * can become expensive in some databases because the database
 * may need to walk past many records before returning the
 * requested page.
 *
 *
 * Example:
 *
 *     page=100000
 *     limit=20
 *
 *
 * offset:
 *
 *     1,999,980
 *
 *
 * This can become inefficient for large datasets.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. OFFSET PAGINATION
 * ============================================================
 *
 * Advantages:
 *
 *     - Simple
 *     - Easy for frontend applications
 *     - Easy to understand
 *     - Easy to jump to a page
 *
 *
 * Disadvantages:
 *
 *     - Large offsets can become expensive
 *     - Records can shift between pages
 *     - Poor fit for rapidly changing large datasets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. WHEN PAGE/LIMIT IS GOOD
 * ============================================================
 *
 * Good for:
 *
 *     Admin dashboards
 *     Tables
 *     Search result pages
 *     Moderate datasets
 *     Systems where users need page numbers
 *
 *
 * Example:
 *
 *     Page 1
 *     Page 2
 *     Page 3
 *     ...
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. WHEN CURSOR PAGINATION IS BETTER
 * ============================================================
 *
 * Cursor pagination is often preferable for:
 *
 *     Large datasets
 *     Infinite scrolling
 *     Feeds
 *     Frequently changing data
 *     High-scale APIs
 *
 *
 * Example:
 *
 *     GET /users?limit=20&after=eyJpZCI6...
 *
 *
 * Instead of:
 *
 *     page=50000
 *
 * the cursor identifies where the next page should begin.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. PAGINATION METADATA
 * ============================================================
 *
 * Common fields:
 *
 *
 *     page
 *     limit
 *     total
 *     totalPages
 *     hasNextPage
 *     hasPreviousPage
 *
 *
 * Example:
 *
 *     {
 *       "pagination": {
 *         "page": 2,
 *         "limit": 20,
 *         "total": 153,
 *         "totalPages": 8,
 *         "hasNextPage": true,
 *         "hasPreviousPage": true
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. NEXT PAGE URL
 * ============================================================
 *
 * Some APIs return navigation links.
 *
 *
 * Example:
 *
 *     {
 *       "links": {
 *         "next":
 *           "/users?page=3&limit=20",
 *
 *         "previous":
 *           "/users?page=1&limit=20"
 *       }
 *     }
 *
 *
 * This can make API consumption easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. DEFAULT VALUES
 * ============================================================
 *
 * A production API should usually have defaults.
 *
 *
 * Example:
 *
 *     page = 1
 *     limit = 20
 *
 *
 * Therefore:
 *
 *     GET /users
 *
 *
 * becomes conceptually:
 *
 *     GET /users?page=1&limit=20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. MAXIMUM LIMIT
 * ============================================================
 *
 * Always consider:
 *
 *     MAX_LIMIT
 *
 *
 * Example:
 *
 *     default = 20
 *     maximum = 100
 *
 *
 * Client:
 *
 *     ?limit=1000000
 *
 *
 * Server:
 *
 *     reject request
 *
 *
 * This protects database and application resources.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. PAGINATION WITH AUTHORIZATION
 * ============================================================
 *
 * Important:
 *
 * Pagination must operate on the resources the current user is
 * actually authorized to see.
 *
 *
 * Conceptually:
 *
 *     authorization filter
 *          ↓
 *     application filter
 *          ↓
 *     sort
 *          ↓
 *     pagination
 *
 *
 * Never paginate data first and then accidentally expose records
 * the user is not allowed to access.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. PAGINATION WITH SEARCH
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?search=shiva
 *       &page=1
 *       &limit=20
 *
 *
 * Conceptual database flow:
 *
 *
 *     Search
 *       ↓
 *     Filter
 *       ↓
 *     Sort
 *       ↓
 *     Pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. COMPLETE FLOW
 * ============================================================
 *
 *
 * Client:
 *
 *     GET /users?page=2&limit=20
 *
 *              ↓
 *
 * Parse query parameters
 *
 *              ↓
 *
 * Validate page/limit
 *
 *              ↓
 *
 * Calculate:
 *
 *     offset = (page - 1) * limit
 *
 *              ↓
 *
 * Database:
 *
 *     filter
 *     sort
 *     skip
 *     limit
 *
 *              ↓
 *
 * Count matching records
 *
 *              ↓
 *
 * Calculate totalPages
 *
 *              ↓
 *
 * Return:
 *
 *     data
 *     pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * page
 *     ↓
 * Which page?
 *
 *
 * limit
 *     ↓
 * How many records?
 *
 *
 * offset
 *     ↓
 * How many records to skip?
 *
 *
 * Formula:
 *
 *     offset = (page - 1) * limit
 *
 *
 * Database:
 *
 *     filter
 *     sort
 *     skip
 *     limit
 *
 *
 * Response:
 *
 *     data + pagination metadata
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/offset.js
 *
 * We will go deeper into:
 *
 *     offset pagination
 *     skip()
 *     limit()
 *     database performance
 *     large offsets
 *     filter + sort + pagination
 *     why pagination order matters
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
