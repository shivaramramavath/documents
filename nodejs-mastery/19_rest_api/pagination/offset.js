/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/offset.js
 *
 * Topic:
 *     REST API - OFFSET PAGINATION
 *
 * ============================================================
 *
 * OFFSET PAGINATION
 * ============================================================
 *
 * Offset pagination uses:
 *
 *     offset
 *     limit
 *
 *
 * Example:
 *
 *     GET /users?offset=20&limit=10
 *
 *
 * Meaning:
 *
 *     Skip 20 records
 *     Return the next 10 records
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
 * In production, this data would normally come from a database.
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
 * 1. BASIC OFFSET PAGINATION
 * ============================================================
 *
 * Request:
 *
 *     GET /users?offset=0&limit=10
 *
 *
 * Response:
 *
 *     Users 1 - 10
 *
 *
 * Request:
 *
 *     GET /users?offset=10&limit=10
 *
 *
 * Response:
 *
 *     Users 11 - 20
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * Query parameters are strings.
   */

  const offset = Number(req.query.offset ?? 0);

  const limit = Number(req.query.limit ?? 20);

  /*
   * ========================================================
   * VALIDATE OFFSET
   * ========================================================
   */

  if (!Number.isInteger(offset) || offset < 0) {
    return res.status(400).json({
      error: {
        code: "INVALID_OFFSET",

        message: "Offset must be a non-negative integer",
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
   * MAXIMUM LIMIT
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
   * GET DATA
   * ========================================================
   *
   * JavaScript:
   *
   *     slice(offset, offset + limit)
   *
   *
   * Example:
   *
   *     offset = 20
   *     limit = 10
   *
   *
   *     slice(20, 30)
   *
   * returns indexes:
   *
   *     20 ... 29
   *
   * ========================================================
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
   * NEXT OFFSET
   * ========================================================
   */

  const nextOffset = offset + limit < total ? offset + limit : null;

  /*
   * ========================================================
   * PREVIOUS OFFSET
   * ========================================================
   */

  const previousOffset = offset > 0 ? Math.max(0, offset - limit) : null;

  /*
   * ========================================================
   * RESPONSE
   * ========================================================
   */

  return res.status(200).json({
    data,

    pagination: {
      offset,

      limit,

      total,

      hasNextPage: nextOffset !== null,

      hasPreviousPage: previousOffset !== null,

      nextOffset,

      previousOffset,
    },
  });
});

/*
 * ============================================================
 * 2. EXAMPLE
 * ============================================================
 *
 *
 * Request:
 *
 *     GET /users?offset=20&limit=10
 *
 *
 * Data:
 *
 *     users.slice(20, 30)
 *
 *
 * Returned:
 *
 *     User 21
 *     User 22
 *     ...
 *     User 30
 *
 *
 * Metadata:
 *
 *     {
 *       "offset": 20,
 *       "limit": 10,
 *       "total": 100,
 *       "hasNextPage": true,
 *       "hasPreviousPage": true,
 *       "nextOffset": 30,
 *       "previousOffset": 10
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. OFFSET VS PAGE
 * ============================================================
 *
 *
 * PAGE/LIMIT
 * ────────────────────────────────────────
 *
 *     ?page=3&limit=10
 *
 *
 * Formula:
 *
 *     offset = (page - 1) * limit
 *
 *
 *
 * OFFSET/LIMIT
 * ────────────────────────────────────────
 *
 *     ?offset=20&limit=10
 *
 *
 * Offset directly tells the server how many records to skip.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. CONVERT PAGE TO OFFSET
 * ============================================================
 *
 *
 * Given:
 *
 *     page = 4
 *     limit = 25
 *
 *
 * Calculate:
 *
 *     offset =
 *       (4 - 1) * 25
 *
 *     offset = 75
 *
 *
 * Request becomes:
 *
 *     ?offset=75&limit=25
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. OFFSET = 0
 * ============================================================
 *
 * The first page starts with:
 *
 *     offset=0
 *
 *
 * Example:
 *
 *     GET /users?offset=0&limit=10
 *
 *
 * No records are skipped.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. OFFSET CANNOT BE NEGATIVE
 * ============================================================
 *
 * Invalid:
 *
 *     ?offset=-10
 *
 *
 * Return:
 *
 *     400 Bad Request
 *
 *
 * because there is no meaningful concept of skipping a negative
 * number of records.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. LIMIT PROTECTION
 * ============================================================
 *
 * Never blindly accept:
 *
 *     ?limit=100000000
 *
 *
 * A large limit can cause:
 *
 *     high database load
 *     high memory usage
 *     large response payloads
 *     increased network traffic
 *
 *
 * Therefore:
 *
 *     MAX_LIMIT
 *
 * should normally be enforced.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. DATABASE IMPLEMENTATION
 * ============================================================
 *
 * With MongoDB/Mongoose:
 *
 *
 *     const users =
 *       await User.find({})
 *         .sort({
 *           createdAt: -1,
 *         })
 *         .skip(offset)
 *         .limit(limit);
 *
 *
 * Important:
 *
 *     sort()
 *
 * should generally be deterministic before pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. COUNT
 * ============================================================
 *
 * To know whether another page exists, you may need the total
 * number of matching records.
 *
 *
 * Example:
 *
 *     const total =
 *       await User.countDocuments(filter);
 *
 *
 * Then:
 *
 *     const hasNextPage =
 *       offset + data.length <
 *       total;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. COUNT + FIND
 * ============================================================
 *
 * A common pattern is:
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
 *         .limit(limit),
 *
 *       User.countDocuments(filter),
 *     ]);
 *
 *
 * This allows the two independent database operations to execute
 * concurrently from the application's perspective.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. FILTER + OFFSET
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?role=student
 *       &offset=20
 *       &limit=10
 *
 *
 * Correct conceptual order:
 *
 *
 *     FILTER
 *        ↓
 *     SORT
 *        ↓
 *     OFFSET
 *        ↓
 *     LIMIT
 *
 *
 * Not:
 *
 *     OFFSET
 *        ↓
 *     FILTER
 *
 *
 * because pagination should apply to the filtered result set.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. SEARCH + OFFSET
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?search=shiva
 *       &offset=20
 *       &limit=10
 *
 *
 * Conceptually:
 *
 *
 *     search
 *       ↓
 *     matching records
 *       ↓
 *     sort
 *       ↓
 *     offset
 *       ↓
 *     limit
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. SORT + OFFSET
 * ============================================================
 *
 * Example:
 *
 *     GET /users
 *       ?offset=20
 *       &limit=10
 *       &sort=createdAt
 *
 *
 * The database should establish a stable ordering before
 * applying offset/limit.
 *
 *
 * Example:
 *
 *     .sort({
 *       createdAt: -1,
 *       _id: -1,
 *     })
 *
 *
 * Adding a unique tie-breaker such as `_id` can make ordering
 * deterministic when multiple records have the same timestamp.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. LARGE OFFSET PROBLEM
 * ============================================================
 *
 * Consider:
 *
 *     offset = 1,000,000
 *     limit = 20
 *
 *
 * The database may need to walk through a very large number of
 * records before reaching the requested position.
 *
 *
 * Therefore:
 *
 *     OFFSET pagination
 *
 * can become inefficient for very deep pages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. OFFSET PERFORMANCE
 * ============================================================
 *
 *
 * Small offset:
 *
 *     offset=0
 *     offset=20
 *     offset=100
 *
 * Usually straightforward.
 *
 *
 * Large offset:
 *
 *     offset=1,000,000
 *
 * Potentially expensive.
 *
 *
 * Exact performance depends on:
 *
 *     database
 *     query
 *     indexes
 *     sort
 *     execution plan
 *     dataset size
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. WHY INDEXES MATTER
 * ============================================================
 *
 * Suppose we frequently query:
 *
 *     createdAt
 *
 *
 * An appropriate index can improve filtering/sorting.
 *
 *
 * Example MongoDB concept:
 *
 *     db.users.createIndex({
 *       createdAt: -1
 *     });
 *
 *
 * But indexes do not magically eliminate every cost of deep
 * offset pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. OFFSET AND DATA CHANGES
 * ============================================================
 *
 * Offset pagination can produce inconsistent pages when data is
 * inserted or deleted between requests.
 *
 *
 * Example:
 *
 * Initial data:
 *
 *     A B C D E F G H
 *
 *
 * Page 1:
 *
 *     A B C D
 *
 *
 * A new record X is inserted at the beginning:
 *
 *     X A B C D E F G H
 *
 *
 * Page 2 with offset=4:
 *
 *     D E F G
 *
 *
 * Record D may now appear on both page 1 and page 2 from the
 * client's perspective.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. DELETE CAN ALSO SHIFT DATA
 * ============================================================
 *
 * Initial:
 *
 *     A B C D E F G H
 *
 *
 * Page 1:
 *
 *     A B C D
 *
 *
 * Delete B.
 *
 *
 * Now:
 *
 *     A C D E F G H
 *
 *
 * Page 2:
 *
 *     F G H
 *
 *
 * E may have been skipped depending on the timing and pagination
 * strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. STABLE SORTING
 * ============================================================
 *
 * A stable, deterministic sort reduces some ambiguity.
 *
 *
 * Example:
 *
 *     sort({
 *       createdAt: -1,
 *       _id: -1,
 *     })
 *
 *
 * But stable sorting does not completely solve the fundamental
 * problem of offset pagination over a changing dataset.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. OFFSET PAGINATION FOR ADMIN TABLES
 * ============================================================
 *
 * Offset pagination is often a good choice for admin interfaces.
 *
 *
 * Example:
 *
 *     Users
 *
 *     Page 1  2  3  4  5
 *
 *
 * Administrators may need:
 *
 *     first page
 *     specific page
 *     last page
 *
 *
 * Offset/page pagination is convenient for this use case.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. OFFSET PAGINATION FOR INFINITE SCROLL
 * ============================================================
 *
 * It can work for small/moderate datasets.
 *
 *
 * But for large feeds:
 *
 *     offset=100000
 *
 * becomes less attractive.
 *
 *
 * Cursor pagination is generally a better fit for:
 *
 *     infinite scrolling
 *     activity feeds
 *     social feeds
 *     continuously changing datasets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. OFFSET + LIMIT API DESIGN
 * ============================================================
 *
 * Example:
 *
 *     GET /products?offset=40&limit=20
 *
 *
 * Response:
 *
 *     {
 *       "data": [...],
 *
 *       "pagination": {
 *         "offset": 40,
 *         "limit": 20,
 *         "total": 250,
 *         "hasNextPage": true,
 *         "hasPreviousPage": true,
 *         "nextOffset": 60,
 *         "previousOffset": 20
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. NEXT/PREVIOUS LINKS
 * ============================================================
 *
 * You can also return URLs.
 *
 *
 * Example:
 *
 *     {
 *       "links": {
 *
 *         "next":
 *           "/users?offset=60&limit=20",
 *
 *         "previous":
 *           "/users?offset=20&limit=20"
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. OFFSET PAGINATION HELPER
 * ============================================================
 *
 * In a larger application, pagination logic should not be
 * duplicated in every controller.
 *
 *
 * Example helper:
 *
 *
 *     function parsePagination(query) {
 *
 *       const offset =
 *         Number(query.offset ?? 0);
 *
 *       const limit =
 *         Number(query.limit ?? 20);
 *
 *       return {
 *         offset,
 *         limit,
 *       };
 *     }
 *
 *
 * Then controllers can reuse it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. SEPARATION OF RESPONSIBILITIES
 * ============================================================
 *
 *
 * Controller
 *     Parse request
 *
 *        ↓
 *
 * Pagination utility
 *     Validate offset/limit
 *
 *        ↓
 *
 * Service
 *     Business logic
 *
 *        ↓
 *
 * Repository/Model
 *     Database query
 *
 *
 * This becomes especially useful in larger Node.js applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. SECURITY CONSIDERATIONS
 * ============================================================
 *
 * Pagination parameters are user input.
 *
 *
 * Validate:
 *
 *     offset
 *     limit
 *
 *
 * Also protect against:
 *
 *     excessively large values
 *     unexpected strings
 *     numeric overflow
 *     expensive queries
 *
 *
 * Never assume query parameters are trustworthy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. OFFSET VS CURSOR
 * ============================================================
 *
 *
 * OFFSET
 *
 *     ?offset=100&limit=20
 *
 *
 * Pros:
 *
 *     simple
 *     easy to understand
 *     page jumping
 *     good for tables
 *
 *
 * Cons:
 *
 *     deep offsets can be expensive
 *     shifting data can cause duplicates/skips
 *
 *
 *
 * CURSOR
 *
 *     ?after=<cursor>&limit=20
 *
 *
 * Pros:
 *
 *     efficient for large datasets
 *     good for feeds
 *     handles changing datasets better
 *
 *
 * Cons:
 *
 *     more complex
 *     difficult to jump directly to page 500
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. OFFSET MENTAL MODEL
 * ============================================================
 *
 *
 *             COLLECTION
 *                  │
 *                  ↓
 *              FILTER
 *                  │
 *                  ↓
 *                SORT
 *                  │
 *                  ↓
 *               OFFSET
 *                  │
 *                  ↓
 *                LIMIT
 *                  │
 *                  ↓
 *              RESPONSE
 *
 *
 * Example:
 *
 *     offset = 40
 *     limit = 20
 *
 *
 *     Skip 40
 *        ↓
 *     Take 20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. KEY FORMULAS
 * ============================================================
 *
 *
 * PAGE → OFFSET
 *
 *     offset =
 *       (page - 1) * limit
 *
 *
 *
 * OFFSET → NEXT
 *
 *     nextOffset =
 *       offset + limit
 *
 *
 *
 * OFFSET → PREVIOUS
 *
 *     previousOffset =
 *       max(0, offset - limit)
 *
 *
 *
 * TOTAL PAGES
 *
 *     totalPages =
 *       Math.ceil(total / limit)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. PRODUCTION EXAMPLE
 * ============================================================
 *
 *
 * GET /api/v1/users
 *
 *     ?offset=0
 *     &limit=20
 *     &sort=createdAt
 *     &order=desc
 *
 *
 * Server:
 *
 *     validate query
 *          ↓
 *     authorization
 *          ↓
 *     filter
 *          ↓
 *     sort
 *          ↓
 *     skip
 *          ↓
 *     limit
 *          ↓
 *     database
 *          ↓
 *     response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. WHEN TO USE OFFSET
 * ============================================================
 *
 * Use offset pagination when:
 *
 *     - Dataset is moderate
 *     - Users need page numbers
 *     - Jump-to-page is important
 *     - Dataset does not change extremely frequently
 *     - Query depth is reasonable
 *
 *
 * Consider cursor pagination when:
 *
 *     - Dataset is huge
 *     - Infinite scroll is used
 *     - Data changes frequently
 *     - Deep pagination is common
 *     - High performance is required
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/cursor.js
 *
 * We will learn:
 *
 *     cursor pagination
 *     after/before
 *     cursor encoding
 *     stable ordering
 *     MongoDB range queries
 *     avoiding large skip()
 *     next/previous cursors
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
