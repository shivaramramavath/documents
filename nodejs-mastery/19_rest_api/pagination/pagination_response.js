/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/pagination_response.js
 *
 * Topic:
 *     Production-style Pagination Response
 *
 * ============================================================
 *
 * A pagination API should return more than just an array.
 *
 * A good response should clearly communicate:
 *
 *     data
 *     pagination metadata
 *     navigation links
 *
 * Depending on the pagination strategy, metadata can contain:
 *
 *     page
 *     limit
 *     total
 *     totalPages
 *     hasNextPage
 *     hasPreviousPage
 *     nextCursor
 *     previousCursor
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
    length: 53,
  },
  (_, index) => ({
    id: index + 1,

    name: `User ${index + 1}`,

    email: `user${index + 1}@example.com`,
  }),
);

/*
 * ============================================================
 * 1. PAGE-BASED PAGINATION RESPONSE
 * ============================================================
 *
 * Request:
 *
 *     GET /users?page=2&limit=10
 *
 *
 * Response:
 *
 *     {
 *       "data": [...],
 *
 *       "pagination": {
 *         "page": 2,
 *         "limit": 10,
 *         "total": 53,
 *         "totalPages": 6,
 *         "hasNextPage": true,
 *         "hasPreviousPage": true
 *       }
 *     }
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * ========================================================
   * PAGE
   * ========================================================
   */

  const page = Number(req.query.page ?? 1);

  /*
   * ========================================================
   * LIMIT
   * ========================================================
   */

  const limit = Number(req.query.limit ?? 10);

  /*
   * ========================================================
   * VALIDATE PAGE
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

  /*
   * ========================================================
   * VALIDATE LIMIT
   * ========================================================
   */

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
   * MAX LIMIT
   * ========================================================
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
   * TOTAL
   * ========================================================
   */

  const total = users.length;

  /*
   * ========================================================
   * TOTAL PAGES
   * ========================================================
   *
   * Example:
   *
   *     total = 53
   *     limit = 10
   *
   *
   *     Math.ceil(53 / 10)
   *
   *     = 6
   * ========================================================
   */

  const totalPages = Math.ceil(total / limit);

  /*
   * ========================================================
   * CHECK PAGE RANGE
   * ========================================================
   */

  if (page > totalPages && totalPages > 0) {
    return res.status(404).json({
      error: {
        code: "PAGE_OUT_OF_RANGE",

        message: `Page ${page} does not exist`,
      },
    });
  }

  /*
   * ========================================================
   * OFFSET
   * ========================================================
   *
   * Formula:
   *
   *     offset =
   *       (page - 1) * limit
   * ========================================================
   */

  const offset = (page - 1) * limit;

  /*
   * ========================================================
   * GET PAGE DATA
   * ========================================================
   */

  const data = users.slice(offset, offset + limit);

  /*
   * ========================================================
   * NAVIGATION STATE
   * ========================================================
   */

  const hasNextPage = page < totalPages;

  const hasPreviousPage = page > 1;

  /*
   * ========================================================
   * BUILD NEXT URL
   * ========================================================
   */

  const nextUrl = hasNextPage ? `/users?page=${page + 1}&limit=${limit}` : null;

  /*
   * ========================================================
   * BUILD PREVIOUS URL
   * ========================================================
   */

  const previousUrl = hasPreviousPage
    ? `/users?page=${page - 1}&limit=${limit}`
    : null;

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

    links: {
      self: `/users?page=${page}&limit=${limit}`,

      next: nextUrl,

      previous: previousUrl,
    },
  });
});

/*
 * ============================================================
 * 2. RESPONSE STRUCTURE
 * ============================================================
 *
 * A production API commonly separates:
 *
 *     data
 *     pagination
 *     links
 *
 *
 * Example:
 *
 *
 * {
 *   "data": [
 *     {
 *       "id": 11,
 *       "name": "User 11"
 *     }
 *   ],
 *
 *   "pagination": {
 *     "page": 2,
 *     "limit": 10,
 *     "total": 53,
 *     "totalPages": 6,
 *     "hasNextPage": true,
 *     "hasPreviousPage": true
 *   },
 *
 *   "links": {
 *     "self": "/users?page=2&limit=10",
 *     "next": "/users?page=3&limit=10",
 *     "previous": "/users?page=1&limit=10"
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. DATA
 * ============================================================
 *
 * `data` contains the actual resources.
 *
 *
 * Example:
 *
 *     "data": [
 *       {
 *         "id": 11,
 *         "name": "User 11"
 *       }
 *     ]
 *
 *
 * Do not mix pagination metadata into every individual resource.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. PAGINATION METADATA
 * ============================================================
 *
 * Metadata describes the current pagination state.
 *
 *
 * Common fields:
 *
 *     page
 *     limit
 *     total
 *     totalPages
 *     hasNextPage
 *     hasPreviousPage
 *
 *
 * The frontend can use these values to render:
 *
 *     page numbers
 *     next button
 *     previous button
 *     result counters
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. TOTAL
 * ============================================================
 *
 * `total` represents the number of records matching the query.
 *
 *
 * If filtering is applied:
 *
 *     GET /users?role=student
 *
 *
 * then:
 *
 *     total
 *
 * should represent the number of matching students, not the
 * number of all users.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. TOTAL PAGES
 * ============================================================
 *
 * Formula:
 *
 *     totalPages =
 *       Math.ceil(total / limit)
 *
 *
 * Example:
 *
 *     total = 53
 *     limit = 10
 *
 *
 *     totalPages = 6
 *
 *
 * Pages:
 *
 *     1 → 10 records
 *     2 → 10 records
 *     3 → 10 records
 *     4 → 10 records
 *     5 → 10 records
 *     6 → 3 records
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. HAS NEXT PAGE
 * ============================================================
 *
 *     hasNextPage =
 *       page < totalPages
 *
 *
 * Example:
 *
 *     page = 2
 *     totalPages = 6
 *
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. HAS PREVIOUS PAGE
 * ============================================================
 *
 *     hasPreviousPage =
 *       page > 1
 *
 *
 * Example:
 *
 *     page = 1
 *
 *     false
 *
 *
 *     page = 2
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. LINKS
 * ============================================================
 *
 * Links make navigation explicit.
 *
 *
 * Typical links:
 *
 *     self
 *     next
 *     previous
 *
 *
 * Example:
 *
 *     {
 *       "self":
 *         "/users?page=2&limit=10",
 *
 *       "next":
 *         "/users?page=3&limit=10",
 *
 *       "previous":
 *         "/users?page=1&limit=10"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. NULL FOR MISSING LINKS
 * ============================================================
 *
 * First page:
 *
 *     previous = null
 *
 *
 * Last page:
 *
 *     next = null
 *
 *
 * This is clearer than returning an invalid URL.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. EMPTY DATA
 * ============================================================
 *
 * Suppose a filter produces no results.
 *
 *
 * Example:
 *
 *     GET /users?role=admin
 *
 *
 * Response:
 *
 *     {
 *       "data": [],
 *
 *       "pagination": {
 *         "page": 1,
 *         "limit": 10,
 *         "total": 0,
 *         "totalPages": 0,
 *         "hasNextPage": false,
 *         "hasPreviousPage": false
 *       }
 *     }
 *
 *
 * An empty collection is normally not an error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. FILTER + PAGINATION
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?role=student
 *       &page=2
 *       &limit=20
 *
 *
 * Response metadata should describe the filtered collection.
 *
 *
 * Conceptually:
 *
 *     filter
 *       ↓
 *     count filtered records
 *       ↓
 *     sort
 *       ↓
 *     paginate
 *       ↓
 *     response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. SEARCH + PAGINATION
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?search=shiva
 *       &page=1
 *       &limit=10
 *
 *
 * `total` should represent matching search results.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. SORT + PAGINATION
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?sort=createdAt
 *       &order=desc
 *       &page=2
 *       &limit=10
 *
 *
 * The API should apply:
 *
 *     filtering
 *     sorting
 *     pagination
 *
 * in a deterministic way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. PRESERVING QUERY PARAMETERS
 * ============================================================
 *
 * Suppose:
 *
 *     GET /users
 *       ?search=shiva
 *       &role=student
 *       &page=2
 *       &limit=10
 *
 *
 * The next link should preserve relevant filters:
 *
 *
 *     /users
 *       ?search=shiva
 *       &role=student
 *       &page=3
 *       &limit=10
 *
 *
 * Otherwise clicking "next" could unexpectedly remove the user's
 * filters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. CURSOR RESPONSE
 * ============================================================
 *
 * Cursor pagination uses a different metadata structure.
 *
 *
 * Example:
 *
 *     {
 *       "data": [...],
 *
 *       "pagination": {
 *         "limit": 20,
 *         "hasNextPage": true,
 *         "nextCursor": "eyJ..."
 *       },
 *
 *       "links": {
 *         "self":
 *           "/users?limit=20",
 *
 *         "next":
 *           "/users?limit=20&after=eyJ..."
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. PAGE PAGINATION VS CURSOR PAGINATION RESPONSE
 * ============================================================
 *
 *
 * PAGE:
 *
 *     {
 *       "page": 3,
 *       "limit": 20,
 *       "total": 250,
 *       "totalPages": 13
 *     }
 *
 *
 *
 * CURSOR:
 *
 *     {
 *       "limit": 20,
 *       "hasNextPage": true,
 *       "nextCursor": "..."
 *     }
 *
 *
 * Cursor APIs often do not expose:
 *
 *     total
 *     totalPages
 *
 * because exact counts may be unnecessary or expensive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. RESPONSE ENVELOPE
 * ============================================================
 *
 * A response envelope gives the API a consistent structure.
 *
 *
 * Example:
 *
 *     {
 *       "data": [...],
 *       "pagination": {...},
 *       "links": {...}
 *     }
 *
 *
 * Other endpoints might use:
 *
 *     {
 *       "data": {...},
 *       "meta": {...}
 *     }
 *
 *
 * The exact naming is a design decision.
 *
 * The important point is consistency across the API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. SUCCESS RESPONSE
 * ============================================================
 *
 * You generally do not need:
 *
 *     "success": true
 *
 * in every successful HTTP response.
 *
 *
 * HTTP itself already communicates success through:
 *
 *     2xx status codes.
 *
 *
 * Example:
 *
 *     HTTP 200
 *
 *     {
 *       "data": [...]
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. ERROR RESPONSE
 * ============================================================
 *
 * Error responses should also have a consistent structure.
 *
 *
 * Example:
 *
 *     {
 *       "error": {
 *         "code": "INVALID_LIMIT",
 *         "message":
 *           "Limit must be a positive integer"
 *       }
 *     }
 *
 *
 * This allows frontend clients to reliably process errors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. API VERSION
 * ============================================================
 *
 * In a versioned REST API:
 *
 *
 *     GET /api/v1/users
 *
 *
 * Pagination response conventions should remain consistent
 * within that API version.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. MONGOOSE EXAMPLE
 * ============================================================
 *
 * Production-style query:
 *
 *
 *     const [
 *       data,
 *       total,
 *     ] = await Promise.all([
 *
 *       User.find(filter)
 *         .sort(sort)
 *         .skip(offset)
 *         .limit(limit)
 *         .lean(),
 *
 *       User.countDocuments(filter),
 *     ]);
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
 *
 *     const response = {
 *       data,
 *
 *       pagination: {
 *         page,
 *         limit,
 *         total,
 *         totalPages,
 *         hasNextPage:
 *           page < totalPages,
 *         hasPreviousPage:
 *           page > 1,
 *       },
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. WHY .lean()
 * ============================================================
 *
 * With Mongoose:
 *
 *     .lean()
 *
 * returns plain JavaScript objects instead of full Mongoose
 * documents.
 *
 *
 * This can reduce overhead when you only need to send data in
 * an API response.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. REUSABLE PAGINATION HELPER
 * ============================================================
 *
 * Pagination response construction should usually be centralized.
 *
 *
 * Example:
 *
 *
 *     function createPaginationMeta({
 *       page,
 *       limit,
 *       total,
 *     }) {
 *
 *       const totalPages =
 *         Math.ceil(total / limit);
 *
 *       return {
 *         page,
 *         limit,
 *         total,
 *         totalPages,
 *         hasNextPage:
 *           page < totalPages,
 *         hasPreviousPage:
 *           page > 1,
 *       };
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. REUSABLE RESPONSE HELPER
 * ============================================================
 *
 *
 *     function paginatedResponse({
 *       data,
 *       page,
 *       limit,
 *       total,
 *     }) {
 *
 *       return {
 *         data,
 *
 *         pagination:
 *           createPaginationMeta({
 *             page,
 *             limit,
 *             total,
 *           }),
 *       };
 *     }
 *
 *
 * This prevents every controller from implementing slightly
 * different pagination behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. FRONTEND USAGE
 * ============================================================
 *
 * Frontend receives:
 *
 *     hasNextPage
 *
 *
 * It can then:
 *
 *     enable Next button
 *
 *
 * If:
 *
 *     hasNextPage = false
 *
 *
 * disable:
 *
 *     Next
 *
 *
 * Similarly:
 *
 *     hasPreviousPage
 *
 * controls:
 *
 *     Previous
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. RESULT COUNTER
 * ============================================================
 *
 * With page pagination:
 *
 *     page = 2
 *     limit = 10
 *
 *
 * Display:
 *
 *     Showing 11–20 of 53
 *
 *
 * Start:
 *
 *     (page - 1) * limit + 1
 *
 *
 * End:
 *
 *     Math.min(
 *       page * limit,
 *       total,
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. API DESIGN RULE
 * ============================================================
 *
 * Do not expose implementation details unnecessarily.
 *
 *
 * The client needs to know:
 *
 *     what data it received
 *     how much it received
 *     whether another page exists
 *     how to request it
 *
 *
 * The client usually does not need to know:
 *
 *     database execution plan
 *     MongoDB cursor internals
 *     query optimizer details
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. CONSISTENCY
 * ============================================================
 *
 * Prefer the same structure across endpoints.
 *
 *
 * Good:
 *
 *     GET /users
 *     GET /products
 *     GET /orders
 *
 *
 * all return:
 *
 *     data
 *     pagination
 *     links
 *
 *
 * Consistency makes frontend integration much easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                   API REQUEST
 *                        │
 *                        ↓
 *               Parse pagination
 *                        │
 *                        ↓
 *                   Validate
 *                        │
 *                        ↓
 *                Filter / Search
 *                        │
 *                        ↓
 *                      Sort
 *                        │
 *                        ↓
 *                    Paginate
 *                        │
 *                        ↓
 *                  Query database
 *                        │
 *                        ↓
 *                 Build metadata
 *                        │
 *                        ↓
 *                 Build navigation
 *                        │
 *                        ↓
 *                     JSON
 *
 *
 * Response:
 *
 *     {
 *       data,
 *       pagination,
 *       links
 *     }
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/filtering/filter.js
 *
 * We will learn how REST APIs implement:
 *
 *     filters
 *     multiple filters
 *     operators
 *     MongoDB filters
 *     safe query construction
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
