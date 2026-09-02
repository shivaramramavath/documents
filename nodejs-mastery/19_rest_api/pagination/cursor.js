/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/cursor.js
 *
 * Topic:
 *     REST API - CURSOR PAGINATION
 *
 * ============================================================
 *
 * CURSOR PAGINATION
 * ============================================================
 *
 * Cursor pagination is a pagination technique where the client
 * receives a cursor representing a position in the dataset.
 *
 *
 * Instead of:
 *
 *     ?page=1000
 *
 * or:
 *
 *     ?offset=19980
 *
 *
 * the client uses:
 *
 *     ?after=<cursor>
 *
 *
 * Example:
 *
 *     GET /users?limit=10
 *
 *     GET /users?limit=10&after=<cursor>
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
 * We use an increasing numeric ID to make the cursor concept
 * easy to understand.
 *
 * In a real application, this would normally be a database
 * query using an indexed field.
 * ============================================================
 */

const users = Array.from(
  {
    length: 100,
  },
  (_, index) => ({
    id: index + 1,

    name: `User ${index + 1}`,

    email: `user${index + 1}@example.com`,
  }),
);

/*
 * ============================================================
 * 1. BASIC CURSOR PAGINATION
 * ============================================================
 *
 * Request:
 *
 *     GET /users?limit=10
 *
 *
 * First request has no cursor.
 *
 *
 * The server returns:
 *
 *     first 10 users
 *
 * plus:
 *
 *     nextCursor
 *
 *
 * The client uses that cursor for the next request.
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * ========================================================
   * LIMIT
   * ========================================================
   */

  const limit = Number(req.query.limit ?? 10);

  /*
   * Validate limit.
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
   * Protect the API from excessively large requests.
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
   * READ CURSOR
   * ========================================================
   *
   * Example:
   *
   *     ?after=20
   *
   *
   * For this educational example, the cursor itself is simply
   * the last seen user ID.
   *
   * Production systems commonly encode/sign cursors instead.
   * ========================================================
   */

  const after = req.query.after;

  let startIndex = 0;

  /*
   * ========================================================
   * FIRST REQUEST
   * ========================================================
   *
   * No cursor means:
   *
   *     Start from the beginning.
   * ========================================================
   */

  if (after !== undefined) {
    /*
     * Query parameters are strings.
     */

    const cursorId = Number(after);

    /*
     * Validate cursor.
     */

    if (!Number.isInteger(cursorId) || cursorId < 1) {
      return res.status(400).json({
        error: {
          code: "INVALID_CURSOR",

          message: "Invalid cursor",
        },
      });
    }

    /*
     * Find the item represented by the cursor.
     */

    const cursorIndex = users.findIndex((user) => user.id === cursorId);

    /*
     * Cursor does not correspond to a resource.
     */

    if (cursorIndex === -1) {
      return res.status(400).json({
        error: {
          code: "CURSOR_NOT_FOUND",

          message: "Cursor does not represent a valid position",
        },
      });
    }

    /*
     * Start AFTER the cursor.
     *
     * If cursor points to user 20:
     *
     *     cursor = 20
     *
     * next result begins with:
     *
     *     user 21
     */

    startIndex = cursorIndex + 1;
  }

  /*
   * ========================================================
   * FETCH ONE EXTRA RECORD
   * ========================================================
   *
   * We request:
   *
   *     limit + 1
   *
   * records.
   *
   *
   * Why?
   *
   * Suppose:
   *
   *     limit = 10
   *
   *
   * We fetch:
   *
   *     11
   *
   *
   * If 11 records exist:
   *
   *     first 10 → response
   *     11th     → proves another page exists
   *
   *
   * This avoids requiring a separate COUNT query just to
   * determine whether another page exists.
   * ========================================================
   */

  const records = users.slice(startIndex, startIndex + limit + 1);

  /*
   * ========================================================
   * HAS NEXT PAGE
   * ========================================================
   */

  const hasNextPage = records.length > limit;

  /*
   * ========================================================
   * RETURN ONLY REQUESTED LIMIT
   * ========================================================
   */

  const data = records.slice(0, limit);

  /*
   * ========================================================
   * GENERATE NEXT CURSOR
   * ========================================================
   *
   * The cursor should point to the final record returned.
   *
   * Example:
   *
   *     returned IDs:
   *
   *     11 12 13 14 15
   *
   *
   * nextCursor:
   *
   *     15
   *
   *
   * Next request:
   *
   *     ?after=15
   *
   *
   * Result:
   *
   *     16 17 18 19 20
   * ========================================================
   */

  const lastItem = data[data.length - 1];

  const nextCursor = hasNextPage && lastItem ? String(lastItem.id) : null;

  /*
   * ========================================================
   * RESPONSE
   * ========================================================
   */

  return res.status(200).json({
    data,

    pagination: {
      limit,

      hasNextPage,

      nextCursor,
    },
  });
});

/*
 * ============================================================
 * 2. FIRST REQUEST
 * ============================================================
 *
 * Client:
 *
 *     GET /users?limit=5
 *
 *
 * Server:
 *
 *     No cursor
 *
 *     ↓
 *
 *     Start at first record
 *
 *
 * Response:
 *
 *     {
 *       "data": [
 *         { "id": 1 },
 *         { "id": 2 },
 *         { "id": 3 },
 *         { "id": 4 },
 *         { "id": 5 }
 *       ],
 *
 *       "pagination": {
 *         "limit": 5,
 *         "hasNextPage": true,
 *         "nextCursor": "5"
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. SECOND REQUEST
 * ============================================================
 *
 * Client receives:
 *
 *     nextCursor = "5"
 *
 *
 * Then:
 *
 *     GET /users?limit=5&after=5
 *
 *
 * Server:
 *
 *     cursor = 5
 *
 *     ↓
 *
 *     Find user 5
 *
 *     ↓
 *
 *     Start after user 5
 *
 *     ↓
 *
 *     Return:
 *
 *     6 7 8 9 10
 *
 *
 * New cursor:
 *
 *     10
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. THIRD REQUEST
 * ============================================================
 *
 *     GET /users?limit=5&after=10
 *
 *
 * Returns:
 *
 *     11 12 13 14 15
 *
 *
 * nextCursor:
 *
 *     15
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. FINAL PAGE
 * ============================================================
 *
 * Suppose the final records are:
 *
 *     96 97 98 99 100
 *
 *
 * There is no record after 100.
 *
 *
 * Response:
 *
 *     {
 *       "data": [...],
 *
 *       "pagination": {
 *         "limit": 5,
 *         "hasNextPage": false,
 *         "nextCursor": null
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. CURSOR MENTAL MODEL
 * ============================================================
 *
 *
 * FIRST REQUEST
 *
 *     /users?limit=5
 *             │
 *             ↓
 *       start of dataset
 *             │
 *             ↓
 *        1 2 3 4 5
 *             │
 *             ↓
 *        cursor = 5
 *
 *
 *
 * SECOND REQUEST
 *
 *     /users?limit=5&after=5
 *                     │
 *                     ↓
 *                 after 5
 *                     │
 *                     ↓
 *        6 7 8 9 10
 *                     │
 *                     ↓
 *               cursor = 10
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. CURSOR IS NOT A PAGE NUMBER
 * ============================================================
 *
 * Page pagination:
 *
 *     page=5
 *
 *
 * Cursor pagination:
 *
 *     after=some-position
 *
 *
 * The cursor represents a position in an ordered dataset.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. WHY CURSOR PAGINATION
 * ============================================================
 *
 * Cursor pagination is particularly useful when:
 *
 *     - datasets are large
 *     - data changes frequently
 *     - infinite scrolling is used
 *     - deep pagination is common
 *     - stable sequential traversal is needed
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. CURSOR VS OFFSET
 * ============================================================
 *
 *
 * OFFSET:
 *
 *     GET /users?offset=100000&limit=20
 *
 *
 * Conceptually:
 *
 *     skip 100000
 *        ↓
 *     return 20
 *
 *
 *
 * CURSOR:
 *
 *     GET /users?after=<cursor>&limit=20
 *
 *
 * Conceptually:
 *
 *     start after known position
 *        ↓
 *     return 20
 *
 *
 * With a suitable index and query shape, cursor/range-based
 * pagination can avoid the cost associated with very large
 * offsets.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. DATABASE CURSOR QUERY
 * ============================================================
 *
 * Suppose MongoDB documents contain:
 *
 *     _id
 *     createdAt
 *
 *
 * And we want newest-first pagination.
 *
 *
 * Conceptually:
 *
 *
 * First request:
 *
 *     User.find({})
 *       .sort({
 *         createdAt: -1,
 *         _id: -1,
 *       })
 *       .limit(limit + 1);
 *
 *
 * Next request:
 *
 *     User.find({
 *       createdAt: {
 *         $lt: cursor.createdAt,
 *       },
 *     })
 *       .sort({
 *         createdAt: -1,
 *         _id: -1,
 *       })
 *       .limit(limit + 1);
 *
 *
 * The exact range condition must account for the complete sort
 * key when timestamps can tie.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. COMPOSITE CURSOR
 * ============================================================
 *
 * A robust cursor often contains more than one value.
 *
 *
 * Example:
 *
 *     {
 *       "createdAt":
 *         "2026-09-03T10:00:00.000Z",
 *
 *       "id":
 *         "66d..."
 *     }
 *
 *
 * Why?
 *
 * Because multiple records can have the same:
 *
 *     createdAt
 *
 *
 * A unique tie-breaker such as `_id` makes ordering
 * deterministic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. SORT ORDER
 * ============================================================
 *
 * Cursor pagination requires a well-defined ordering.
 *
 *
 * Example:
 *
 *     createdAt DESC
 *     _id DESC
 *
 *
 * Think of the ordering as:
 *
 *
 *     newest
 *       ↓
 *     ...
 *       ↓
 *     oldest
 *
 *
 * The cursor identifies a precise position in that ordering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. CURSOR ENCODING
 * ============================================================
 *
 * In this educational example:
 *
 *     cursor = "20"
 *
 *
 * Production APIs commonly avoid exposing raw database values.
 *
 *
 * Instead, a cursor can encode:
 *
 *     {
 *       createdAt,
 *       id
 *     }
 *
 *
 * Example conceptual cursor:
 *
 *     base64(
 *       JSON.stringify({
 *         createdAt,
 *         id
 *       })
 *     )
 *
 *
 * This is encoding, not encryption.
 *
 * Do not treat Base64 as a security mechanism.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. SIGNED CURSOR
 * ============================================================
 *
 * If clients should not be able to modify cursor contents,
 * the cursor can be authenticated/signed.
 *
 *
 * Conceptually:
 *
 *     payload
 *        +
 *     signature
 *
 *
 * The server verifies the signature before trusting the cursor.
 *
 *
 * This protects cursor integrity.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. CURSOR SHOULD BE OPAQUE
 * ============================================================
 *
 * Ideally clients should treat:
 *
 *     nextCursor
 *
 * as an opaque value.
 *
 *
 * They should not need to understand:
 *
 *     database ID
 *     timestamp
 *     sort key
 *
 *
 * API contract:
 *
 *     Server creates cursor.
 *     Client sends cursor back.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. DO NOT USE ARRAY INDEX AS CURSOR
 * ============================================================
 *
 * Avoid:
 *
 *     cursor = 50
 *
 * meaning:
 *
 *     "array index 50"
 *
 *
 * If records are inserted/deleted, indexes change.
 *
 *
 * Better:
 *
 *     cursor based on a stable ordered field.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. CURSOR BASED ON DATABASE ID
 * ============================================================
 *
 * For an educational dataset with monotonically increasing IDs:
 *
 *
 *     after=50
 *
 *
 * can mean:
 *
 *     id > 50
 *
 *
 * Query concept:
 *
 *     User.find({
 *       id: {
 *         $gt: 50,
 *       },
 *     })
 *
 *
 * with:
 *
 *     sort({ id: 1 })
 *
 *
 * and:
 *
 *     limit(20)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. RANGE QUERY
 * ============================================================
 *
 * This is one of the major advantages of cursor pagination.
 *
 *
 * Instead of:
 *
 *     skip 100000
 *
 *
 * the database can conceptually use:
 *
 *     WHERE id > 100000
 *
 *
 * with an appropriate index.
 *
 *
 * This is commonly called:
 *
 *     keyset pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. CURSOR PAGINATION = KEYSET PAGINATION
 * ============================================================
 *
 * These terms are closely related but can be used with slightly
 * different emphasis.
 *
 *
 * Cursor pagination:
 *
 *     API-level concept
 *
 *
 * Keyset pagination:
 *
 *     Database/query technique using ordered key values
 *
 *
 * A cursor often contains the keyset values needed to continue
 * the query.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. AFTER CURSOR
 * ============================================================
 *
 * Common API style:
 *
 *     ?after=<cursor>
 *
 *
 * Means:
 *
 *     Return records after this cursor.
 *
 *
 * This is common for forward pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. BEFORE CURSOR
 * ============================================================
 *
 * Some APIs support:
 *
 *     ?before=<cursor>
 *
 *
 * Meaning:
 *
 *     Return records before this cursor.
 *
 *
 * This can support backward pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. PREVIOUS PAGE
 * ============================================================
 *
 * A cursor API may return:
 *
 *     nextCursor
 *     previousCursor
 *
 *
 * Example:
 *
 *     {
 *       "pagination": {
 *         "nextCursor": "...",
 *         "previousCursor": "..."
 *       }
 *     }
 *
 *
 * Backward pagination requires careful handling of sort order
 * and boundary conditions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. INFINITE SCROLL
 * ============================================================
 *
 * Cursor pagination works naturally with infinite scrolling.
 *
 *
 * UI:
 *
 *     Load first 20
 *         ↓
 *     nextCursor
 *         ↓
 *     Load next 20
 *         ↓
 *     nextCursor
 *         ↓
 *     Load next 20
 *
 *
 * No page number is required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. SOCIAL FEED EXAMPLE
 * ============================================================
 *
 * Suppose a feed contains:
 *
 *     posts
 *
 *
 * Sorted:
 *
 *     createdAt DESC
 *
 *
 * First request:
 *
 *     GET /posts?limit=20
 *
 *
 * Response:
 *
 *     20 posts
 *     nextCursor
 *
 *
 * Next request:
 *
 *     GET /posts?limit=20&after=<cursor>
 *
 *
 * The server continues from the previous position.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. NEW RECORD INSERTED
 * ============================================================
 *
 * This is where cursor pagination can be very useful.
 *
 *
 * Initial:
 *
 *     A B C D E F
 *
 *
 * Client receives:
 *
 *     A B C
 *
 * cursor points after C.
 *
 *
 * New record X appears:
 *
 *     X A B C D E F
 *
 *
 * Client requests:
 *
 *     after=C
 *
 *
 * It continues:
 *
 *     D E F
 *
 *
 * The new X does not unexpectedly shift the cursor boundary.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. DELETE DURING PAGINATION
 * ============================================================
 *
 * Suppose:
 *
 *     A B C D E F
 *
 *
 * Client receives:
 *
 *     A B C
 *
 *
 * B is deleted.
 *
 *
 * Cursor still represents the boundary after C.
 *
 *
 * Next:
 *
 *     D E F
 *
 *
 * This can be more robust than offset pagination when records
 * change between requests.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. DUPLICATE RECORDS
 * ============================================================
 *
 * Cursor pagination does not automatically guarantee that a
 * badly designed query cannot produce duplicates.
 *
 *
 * You still need:
 *
 *     deterministic ordering
 *     correct boundary comparison
 *     correct cursor construction
 *     appropriate indexes
 *
 *
 * Especially important when sorting by non-unique fields.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. CREATED_AT + ID
 * ============================================================
 *
 * Suppose:
 *
 *     createdAt = 10:00
 *
 * appears on multiple records.
 *
 *
 * Sort:
 *
 *     createdAt DESC
 *     _id DESC
 *
 *
 * Cursor contains:
 *
 *     {
 *       createdAt,
 *       _id
 *     }
 *
 *
 * This gives the server enough information to continue precisely
 * after the last returned record.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. LIMIT + 1 TECHNIQUE
 * ============================================================
 *
 * Very common pattern:
 *
 *
 * Client asks:
 *
 *     limit = 20
 *
 *
 * Server fetches:
 *
 *     21
 *
 *
 * If:
 *
 *     21 returned
 *
 * then:
 *
 *     hasNextPage = true
 *
 *
 * Return:
 *
 *     first 20
 *
 *
 * If:
 *
 *     only 20 or fewer returned
 *
 * then:
 *
 *     hasNextPage = false
 *
 *
 * This avoids an additional count operation in many cursor
 * pagination designs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. COUNT IS OFTEN UNNECESSARY
 * ============================================================
 *
 * Offset pagination frequently returns:
 *
 *     total
 *     totalPages
 *
 *
 * Cursor pagination often avoids these values.
 *
 *
 * Instead it returns:
 *
 *     hasNextPage
 *     nextCursor
 *
 *
 * This can be significantly cheaper for very large datasets
 * because exact total counts may be expensive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CURSOR RESPONSE
 * ============================================================
 *
 * A clean response can look like:
 *
 *
 *     {
 *       "data": [
 *         ...
 *       ],
 *
 *       "pagination": {
 *         "limit": 20,
 *         "hasNextPage": true,
 *         "nextCursor": "eyJ..."
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. CURSOR URL
 * ============================================================
 *
 * You can also return a next URL:
 *
 *
 *     {
 *       "links": {
 *         "next":
 *           "/users?limit=20&after=eyJ..."
 *       }
 *     }
 *
 *
 * This allows the client to simply follow the URL.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. CURSOR SECURITY
 * ============================================================
 *
 * Cursor values should not expose sensitive information.
 *
 *
 * Avoid putting secrets inside:
 *
 *     cursor
 *
 *
 * Remember:
 *
 *     Base64 ≠ encryption
 *
 *
 * If confidentiality is required, use an appropriate protected
 * mechanism rather than simple encoding.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. INDEXING
 * ============================================================
 *
 * Cursor pagination is most effective when the cursor fields
 * match an appropriate database index.
 *
 *
 * Example:
 *
 *     sort:
 *
 *       createdAt DESC
 *       _id DESC
 *
 *
 * Appropriate compound index:
 *
 *     {
 *       createdAt: -1,
 *       _id: -1
 *     }
 *
 *
 * The exact index strategy depends on the query and database.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. CURSOR FLOW
 * ============================================================
 *
 *
 * Client
 *   │
 *   │ GET /users?limit=20
 *   ↓
 * API
 *   │
 *   ↓
 * Query database
 *   │
 *   ↓
 * Sort by stable key
 *   │
 *   ↓
 * Fetch limit + 1
 *   │
 *   ↓
 * Return first limit
 *   │
 *   ↓
 * Create cursor from last item
 *   │
 *   ↓
 * Client receives cursor
 *   │
 *   ↓
 * GET /users?after=<cursor>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. OFFSET VS CURSOR SUMMARY
 * ============================================================
 *
 *
 *                 OFFSET             CURSOR
 *                 ──────             ──────
 *
 * Parameter       offset             after
 *
 * Page numbers    Easy               Difficult
 *
 * Deep pages      Can be expensive   Efficient with keyset query
 *
 * Changing data   Can shift pages     Better boundary behavior
 *
 * Infinite scroll Good               Excellent
 *
 * Implementation  Simple             More complex
 *
 * Total count     Common              Often unnecessary
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. WHEN TO USE CURSOR
 * ============================================================
 *
 * Prefer cursor/keyset pagination for:
 *
 *     Large collections
 *     Feeds
 *     Infinite scrolling
 *     Activity logs
 *     Messages
 *     High-volume event data
 *     Frequently changing datasets
 *
 *
 * Page/offset pagination can remain preferable for:
 *
 *     Admin tables
 *     Search pages
 *     Jump-to-page interfaces
 *     Moderate datasets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 * Controller
 *     │
 *     ↓
 * Validate limit/cursor
 *     │
 *     ↓
 * Decode cursor
 *     │
 *     ↓
 * Service
 *     │
 *     ↓
 * Repository
 *     │
 *     ↓
 * Indexed keyset query
 *     │
 *     ↓
 * Fetch limit + 1
 *     │
 *     ↓
 * Build next cursor
 *     │
 *     ↓
 * Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * OFFSET:
 *
 *     "Skip N records."
 *
 *
 * CURSOR:
 *
 *     "Continue after this known position."
 *
 *
 * Example:
 *
 *     First:
 *
 *         A B C D E
 *
 *         cursor = E
 *
 *
 *     Next:
 *
 *         after E
 *
 *         F G H I J
 *
 *
 * Cursor pagination is fundamentally about continuing from a
 * stable position in an ordered dataset.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/pagination_response.js
 *
 * We will combine pagination concepts into a production-style
 * response structure:
 *
 *     data
 *     metadata
 *     links
 *     page
 *     limit
 *     total
 *     cursors
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
