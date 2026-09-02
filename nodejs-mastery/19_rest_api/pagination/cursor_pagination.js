/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/cursor_pagination.js
 *
 * Topic:
 *     Cursor-Based Pagination
 *
 * ============================================================
 *
 * Offset pagination:
 *
 *     ?page=3&limit=20
 *
 *
 * Cursor pagination:
 *
 *     ?limit=20&after=<cursor>
 *
 *
 * Cursor pagination is commonly used for:
 *
 *     feeds
 *     infinite scrolling
 *     messages
 *     notifications
 *     events
 *     large collections
 *
 * ============================================================
 *
 * CORE IDEA
 * ============================================================
 *
 * Instead of saying:
 *
 *     "skip the first 40 records"
 *
 * we say:
 *
 *     "give me records AFTER this specific record"
 *
 *
 * Example:
 *
 *
 *     Record IDs:
 *
 *     101
 *     102
 *     103
 *     104
 *     105
 *
 *
 * First request:
 *
 *     GET /users?limit=2
 *
 *
 * Response:
 *
 *     101
 *     102
 *
 *     nextCursor = 102
 *
 *
 * Next request:
 *
 *     GET /users?limit=2&after=102
 *
 *
 * Response:
 *
 *     103
 *     104
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
 * In a real application this would be stored in MongoDB.
 *
 * We keep the records ordered by id.
 *
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
 * 1. OFFSET VS CURSOR
 * ============================================================
 *
 * OFFSET:
 *
 *
 *     ?page=5&limit=20
 *
 *
 * means:
 *
 *
 *     skip 80
 *     take 20
 *
 *
 * CURSOR:
 *
 *
 *     ?after=80&limit=20
 *
 *
 * means:
 *
 *
 *     start after record 80
 *     take 20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. BASIC CURSOR PAGINATION
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * --------------------------------------------------------
   * LIMIT
   * --------------------------------------------------------
   */

  const rawLimit = req.query.limit;

  const limit = rawLimit === undefined ? 20 : Number(rawLimit);

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
   * --------------------------------------------------------
   * AFTER CURSOR
   * --------------------------------------------------------
   *
   * Example:
   *
   *     ?after=20
   *
   * means:
   *
   *     start after ID 20.
   *
   * --------------------------------------------------------
   */

  const rawAfter = req.query.after;

  let after = null;

  if (rawAfter !== undefined) {
    if (typeof rawAfter !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_CURSOR",

          message: "after must be a string",
        },
      });
    }

    const parsedAfter = Number(rawAfter);

    if (!Number.isInteger(parsedAfter) || parsedAfter < 1) {
      return res.status(400).json({
        error: {
          code: "INVALID_CURSOR",

          message: "Invalid cursor",
        },
      });
    }

    after = parsedAfter;
  }

  /*
   * --------------------------------------------------------
   * FIND START POSITION
   * --------------------------------------------------------
   */

  let startIndex = 0;

  if (after !== null) {
    const index = users.findIndex((user) => user.id === after);

    /*
     * Cursor does not exist.
     */

    if (index === -1) {
      return res.status(400).json({
        error: {
          code: "CURSOR_NOT_FOUND",

          message: "Cursor does not exist",
        },
      });
    }

    /*
     * Start AFTER the cursor.
     */

    startIndex = index + 1;
  }

  /*
   * --------------------------------------------------------
   * FETCH ONE EXTRA RECORD
   * --------------------------------------------------------
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
   *     limit = 20
   *
   *
   * If we receive:
   *
   *     21 records
   *
   * then we know another page exists.
   *
   *
   * We return only:
   *
   *     20
   *
   * records.
   *
   * ========================================================
   */

  const records = users.slice(startIndex, startIndex + limit + 1);

  /*
   * --------------------------------------------------------
   * CHECK FOR NEXT PAGE
   * --------------------------------------------------------
   */

  const hasNextPage = records.length > limit;

  /*
   * Remove the extra record.
   */

  const data = records.slice(0, limit);

  /*
   * --------------------------------------------------------
   * NEXT CURSOR
   * --------------------------------------------------------
   *
   * The cursor should represent the last returned record.
   * --------------------------------------------------------
   */

  const lastRecord = data[data.length - 1];

  const nextCursor = hasNextPage && lastRecord ? String(lastRecord.id) : null;

  /*
   * --------------------------------------------------------
   * RESPONSE
   * --------------------------------------------------------
   */

  return res.status(200).json({
    data,

    pagination: {
      limit,

      nextCursor,

      hasNextPage,
    },
  });
});

/*
 * ============================================================
 * 3. FIRST REQUEST
 * ============================================================
 *
 * Request:
 *
 *     GET /users?limit=3
 *
 *
 * Result:
 *
 *     User 1
 *     User 2
 *     User 3
 *
 *
 * Response:
 *
 *
 * {
 *   "data": [
 *     {
 *       "id": 1
 *     },
 *     {
 *       "id": 2
 *     },
 *     {
 *       "id": 3
 *     }
 *   ],
 *
 *   "pagination": {
 *     "limit": 3,
 *     "nextCursor": "3",
 *     "hasNextPage": true
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. SECOND REQUEST
 * ============================================================
 *
 * Client uses:
 *
 *
 *     nextCursor = "3"
 *
 *
 * Next request:
 *
 *
 *     GET /users?limit=3&after=3
 *
 *
 * Result:
 *
 *
 *     User 4
 *     User 5
 *     User 6
 *
 *
 * nextCursor:
 *
 *
 *     "6"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. PAGINATION FLOW
 * ============================================================
 *
 *
 * FIRST REQUEST
 *
 *     GET /users?limit=3
 *
 *          ↓
 *
 *     1  2  3
 *
 *          ↓
 *
 *     nextCursor = 3
 *
 *
 * ------------------------------------------------------------
 *
 *
 * SECOND REQUEST
 *
 *     GET /users?limit=3&after=3
 *
 *          ↓
 *
 *     4  5  6
 *
 *          ↓
 *
 *     nextCursor = 6
 *
 *
 * ------------------------------------------------------------
 *
 *
 * THIRD REQUEST
 *
 *     GET /users?limit=3&after=6
 *
 *          ↓
 *
 *     7  8  9
 *
 *          ↓
 *
 *     nextCursor = 9
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. WHY CURSOR PAGINATION?
 * ============================================================
 *
 * Consider:
 *
 *
 *     10,000,000 records
 *
 *
 * Offset request:
 *
 *
 *     ?page=500000&limit=20
 *
 *
 * could require a very large skip.
 *
 *
 * Cursor request:
 *
 *
 *     ?after=<specific-record>&limit=20
 *
 *
 * can use an index on the ordering field.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. MONGODB CURSOR PAGINATION
 * ============================================================
 *
 * Suppose:
 *
 *     createdAt
 *
 * is our ordering field.
 *
 *
 * We want newest records first:
 *
 *
 *     sort:
 *
 *     createdAt: -1
 *
 *
 * A cursor can contain the position of the last record.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. SIMPLE ID-BASED MONGODB EXAMPLE
 * ============================================================
 *
 * If IDs increase monotonically:
 *
 *
 *     _id > cursor
 *
 *
 * can be used for forward pagination.
 *
 *
 * Conceptually:
 *
 *
 *     User.find({
 *       _id: {
 *         $gt: cursor,
 *       },
 *     })
 *
 *     .sort({
 *       _id: 1,
 *     })
 *
 *     .limit(limit + 1);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. IMPORTANT: OBJECTID
 * ============================================================
 *
 * MongoDB ObjectId values contain ordering information based
 * on their generation time.
 *
 *
 * Therefore ObjectId can often be used for cursor pagination.
 *
 *
 * Example concept:
 *
 *
 *     User.find({
 *       _id: {
 *         $gt: cursor,
 *       },
 *     })
 *
 *     .sort({
 *       _id: 1,
 *     });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. CREATED_AT CURSOR
 * ============================================================
 *
 * Sometimes we sort by:
 *
 *
 *     createdAt
 *
 *
 * But timestamps may not be unique.
 *
 *
 * Example:
 *
 *
 *     User A
 *     createdAt = 10:00:00
 *
 *     User B
 *     createdAt = 10:00:00
 *
 *
 * Therefore using only createdAt as the cursor can create
 * ambiguity.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. COMPOUND CURSOR
 * ============================================================
 *
 * A better cursor can contain:
 *
 *
 *     createdAt
 *
 *     AND
 *
 *     _id
 *
 *
 * Example:
 *
 *
 *     {
 *       createdAt:
 *         "2026-09-03T10:00:00.000Z",
 *
 *       id:
 *         "..."
 *     }
 *
 *
 * This provides deterministic ordering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. SORT + CURSOR
 * ============================================================
 *
 * Suppose sorting ascending:
 *
 *
 *     createdAt ASC
 *     _id ASC
 *
 *
 * Next page condition conceptually becomes:
 *
 *
 *     createdAt > cursor.createdAt
 *
 *     OR
 *
 *     (
 *       createdAt =
 *         cursor.createdAt
 *
 *       AND
 *
 *       _id >
 *         cursor._id
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. DESCENDING CURSOR
 * ============================================================
 *
 * For:
 *
 *
 *     createdAt DESC
 *     _id DESC
 *
 *
 * the condition is reversed:
 *
 *
 *     createdAt < cursor.createdAt
 *
 *     OR
 *
 *     (
 *       createdAt =
 *         cursor.createdAt
 *
 *       AND
 *
 *       _id <
 *         cursor._id
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. CURSOR SHOULD NOT BE RAW DATABASE STATE
 * ============================================================
 *
 * Don't necessarily expose internal database values directly.
 *
 *
 * Instead, encode the cursor.
 *
 *
 * Example internal cursor:
 *
 *
 * {
 *   createdAt:
 *     "2026-09-03T10:00:00.000Z",
 *
 *   id:
 *     "66..."
 * }
 *
 *
 * Can become:
 *
 *
 *     eyJjcmVhdGVkQXQiOi...
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. BASE64 CURSOR
 * ============================================================
 *
 * A cursor can be serialized and Base64 encoded.
 *
 *
 * Example:
 *
 *
 *     JSON:
 *
 *     {
 *       id: 50
 *     }
 *
 *
 * becomes:
 *
 *
 *     eyJpZCI6NTB9
 *
 *
 * Important:
 *
 * Base64 is encoding, NOT encryption.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. CURSOR ENCODING
 * ============================================================
 */

function encodeCursor(value) {
  const json = JSON.stringify(value);

  return Buffer.from(json).toString("base64url");
}

/*
 * ============================================================
 * 17. CURSOR DECODING
 * ============================================================
 */

function decodeCursor(cursor) {
  const json = Buffer.from(cursor, "base64url").toString("utf8");

  return JSON.parse(json);
}

/*
 * ============================================================
 * 18. ENCODE EXAMPLE
 * ============================================================
 */

const encoded = encodeCursor({
  id: 50,
});

console.log("Encoded cursor:", encoded);

/*
 * ============================================================
 * 19. DECODE EXAMPLE
 * ============================================================
 */

const decoded = decodeCursor(encoded);

console.log("Decoded cursor:", decoded);

/*
 * ============================================================
 * 20. VALIDATE CURSOR
 * ============================================================
 *
 * A cursor is client input.
 *
 * Therefore it must be treated as untrusted.
 *
 * Validate:
 *
 *     correct format
 *     expected fields
 *     correct types
 *     valid IDs
 *     valid timestamps
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. SIGNED CURSORS
 * ============================================================
 *
 * For sensitive pagination state, a cursor can be signed.
 *
 *
 * Example conceptual structure:
 *
 *
 *     payload.signature
 *
 *
 * The server can verify the signature before trusting the
 * cursor.
 *
 *
 * This prevents clients from modifying pagination state without
 * detection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. CURSOR + FILTER
 * ============================================================
 *
 * Cursor pagination must work together with filters.
 *
 *
 * Example:
 *
 *
 *     GET /users
 *
 *       ?role=developer
 *       &active=true
 *       &limit=20
 *       &after=<cursor>
 *
 *
 * The cursor must represent a position within the SAME
 * filtered/sorted dataset.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CURSOR + SORT
 * ============================================================
 *
 * The cursor is tied to the ordering.
 *
 *
 * If the first request uses:
 *
 *
 *     sort=createdAt
 *
 *
 * and the next request suddenly uses:
 *
 *
 *     sort=name
 *
 *
 * the cursor may no longer be valid.
 *
 *
 * Therefore cursor pagination APIs should either:
 *
 *
 *     encode the sort information
 *
 * or
 *
 *     keep sorting fixed
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. CURSOR + LIMIT
 * ============================================================
 *
 * The client can usually change limit:
 *
 *
 *     ?limit=20&after=...
 *
 *
 *     ?limit=50&after=...
 *
 *
 * But changing the ordering/filter semantics while reusing a
 * cursor can produce invalid pagination.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. PREVIOUS PAGE
 * ============================================================
 *
 * Forward-only cursor pagination is simpler.
 *
 *
 * Example:
 *
 *
 *     after=<cursor>
 *
 *
 * means:
 *
 *
 *     records AFTER cursor
 *
 *
 * Some APIs also support:
 *
 *
 *     before=<cursor>
 *
 *
 * meaning:
 *
 *
 *     records BEFORE cursor
 *
 *
 * Supporting both directions requires careful ordering logic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. AFTER VS BEFORE
 * ============================================================
 *
 *
 * after:
 *
 *     move forward
 *
 *
 * before:
 *
 *     move backward
 *
 *
 * Example:
 *
 *
 *     /messages?after=abc
 *
 *
 *     /messages?before=xyz
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. INFINITE SCROLL
 * ============================================================
 *
 * Cursor pagination is excellent for infinite scrolling.
 *
 *
 * UI:
 *
 *
 *     load first 20
 *          ↓
 *     nextCursor
 *          ↓
 *     scroll
 *          ↓
 *     request next 20
 *          ↓
 *     nextCursor
 *          ↓
 *     scroll
 *          ↓
 *     repeat
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. FEED EXAMPLE
 * ============================================================
 *
 *
 * GET /feed?limit=20
 *
 *
 * Response:
 *
 *
 * {
 *   data: [...],
 *
 *   pagination: {
 *     nextCursor: "...",
 *     hasNextPage: true
 *   }
 * }
 *
 *
 * Next request:
 *
 *
 * GET /feed
 *     ?limit=20
 *     &after=...
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. CURSOR PAGINATION AND INSERTIONS
 * ============================================================
 *
 * This is one of the biggest advantages of cursor pagination.
 *
 *
 * Suppose the user loads:
 *
 *
 *     A
 *     B
 *     C
 *
 *
 * Then a new record X is inserted before A.
 *
 *
 * When the client requests:
 *
 *
 *     after=C
 *
 *
 * it continues from C.
 *
 *
 * The newly inserted X does not shift the cursor boundary.
 *
 *
 * Offset pagination can be affected by such insertions because
 * the numerical offset refers to a moving position.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. OFFSET PROBLEM
 * ============================================================
 *
 * Initial:
 *
 *
 *     A
 *     B
 *     C
 *     D
 *     E
 *
 *
 * Page 1:
 *
 *     A
 *     B
 *
 *
 * New record inserted:
 *
 *     X
 *     A
 *     B
 *     C
 *     D
 *     E
 *
 *
 * Page 2 with offset=2:
 *
 *     B
 *     C
 *
 *
 * B can appear twice.
 *
 *
 * Cursor pagination:
 *
 *
 * Page 1:
 *
 *     A
 *     B
 *
 *
 * cursor = B
 *
 *
 * Page 2:
 *
 *     C
 *     D
 *
 *
 * This is much more stable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CURSOR PAGINATION LIMITATIONS
 * ============================================================
 *
 * Cursor pagination is not automatically better for every use
 * case.
 *
 *
 * Downsides:
 *
 *
 *     harder implementation
 *     no simple "jump to page 50"
 *     cursor management
 *     complex backward navigation
 *     sorting constraints
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. WHEN TO USE OFFSET
 * ============================================================
 *
 * Use offset/page pagination for:
 *
 *
 *     admin tables
 *     reports
 *     small datasets
 *     numbered pages
 *     "go to page 10"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. WHEN TO USE CURSOR
 * ============================================================
 *
 * Use cursor pagination for:
 *
 *
 *     social feeds
 *     chat messages
 *     notifications
 *     event streams
 *     infinite scrolling
 *     very large collections
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. MONGOOSE QUERY
 * ============================================================
 *
 * Conceptual forward cursor query:
 *
 *
 *     const data =
 *       await User.find({
 *         _id: {
 *           $gt: cursor,
 *         },
 *       })
 *       .sort({
 *         _id: 1,
 *       })
 *       .limit(limit + 1)
 *       .lean();
 *
 *
 * Then:
 *
 *
 *     hasNextPage =
 *       data.length > limit;
 *
 *
 * And:
 *
 *
 *     data = data.slice(
 *       0,
 *       limit,
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. INDEX
 * ============================================================
 *
 * Cursor pagination performs best when the cursor/sort fields
 * are appropriately indexed.
 *
 *
 * Example:
 *
 *
 *     { _id: 1 }
 *
 *
 * or for a compound ordering:
 *
 *
 *     {
 *       createdAt: -1,
 *       _id: -1,
 *     }
 *
 *
 * The exact index should match the application's query pattern.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. DON'T USE RANDOM ORDERING
 * ============================================================
 *
 * Cursor pagination requires deterministic ordering.
 *
 *
 * Avoid:
 *
 *
 *     random order
 *
 *
 * because the next request needs to know where the previous
 * request ended.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. CURSOR RESPONSE
 * ============================================================
 *
 * A clean response:
 *
 *
 * {
 *   data: [
 *     ...
 *   ],
 *
 *   pagination: {
 *     nextCursor: "...",
 *     hasNextPage: true
 *   }
 * }
 *
 *
 * You generally don't need:
 *
 *
 *     total
 *     totalPages
 *
 *
 * for cursor-based infinite feeds.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. OFFSET VS CURSOR
 * ============================================================
 *
 *
 * ┌──────────────────┬──────────────────────┐
 * │ OFFSET           │ CURSOR               │
 * ├──────────────────┼──────────────────────┤
 * │ page + limit     │ cursor + limit       │
 * │ easy             │ more complex         │
 * │ numbered pages   │ infinite scrolling   │
 * │ deep pages costly│ better for large data│
 * │ easy total pages │ total less natural   │
 * │ shifting offsets │ stable position      │
 * └──────────────────┴──────────────────────┘
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 *
 * Controller
 *     │
 *     ↓
 * Query validation
 *     │
 *     ↓
 * Decode cursor
 *     │
 *     ↓
 * Build filter
 *     │
 *     ↓
 * Build sort
 *     │
 *     ↓
 * Repository
 *     │
 *     ↓
 * MongoDB
 *     │
 *     ↓
 * Encode next cursor
 *     │
 *     ↓
 * Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. COMPLETE FLOW
 * ============================================================
 *
 *
 * CLIENT
 *
 *     GET /users?limit=20
 *
 *          ↓
 *
 * SERVER
 *
 *     query validation
 *
 *          ↓
 *
 *     database query
 *
 *          ↓
 *
 *     21 records
 *
 *          ↓
 *
 *     return first 20
 *
 *          ↓
 *
 *     encode record 20
 *
 *          ↓
 *
 *     nextCursor
 *
 *
 * ------------------------------------------------------------
 *
 *
 * CLIENT
 *
 *     GET /users
 *       ?limit=20
 *       &after=<nextCursor>
 *
 *          ↓
 *
 * SERVER
 *
 *     decode cursor
 *
 *          ↓
 *
 *     query after cursor
 *
 *          ↓
 *
 *     return next 20
 *
 *          ↓
 *
 *     new nextCursor
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. IMPORTANT RULE
 * ============================================================
 *
 * Cursor pagination is fundamentally:
 *
 *
 *     "continue after this known position"
 *
 *
 * NOT:
 *
 *
 *     "skip N records"
 *
 *
 * That distinction is the most important concept to remember.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * OFFSET:
 *
 *
 *     page
 *       ↓
 *     calculate offset
 *       ↓
 *     skip(offset)
 *       ↓
 *     limit(limit)
 *
 *
 *
 * CURSOR:
 *
 *
 *     cursor
 *       ↓
 *     find position
 *       ↓
 *     query after position
 *       ↓
 *     limit(limit + 1)
 *       ↓
 *     return limit
 *       ↓
 *     generate nextCursor
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/pagination_metadata.js
 *
 * We will build reusable pagination metadata and then combine
 * pagination with filtering and sorting.
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
