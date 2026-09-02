/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/pagination/pagination_metadata.js
 *
 * Topic:
 *     Reusable Pagination Metadata
 *
 * ============================================================
 *
 * Pagination has two separate responsibilities:
 *
 * 1. Fetch the correct records
 *
 * 2. Tell the client where it is in the collection
 *
 *
 * Example:
 *
 * {
 *   data: [...],
 *
 *   pagination: {
 *     page: 2,
 *     limit: 20,
 *     total: 105,
 *     totalPages: 6,
 *     hasNextPage: true,
 *     hasPreviousPage: true
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. BASIC PAGINATION VALUES
 * ============================================================
 *
 * page:
 *
 *     Current page number.
 *
 *
 * limit:
 *
 *     Number of records per page.
 *
 *
 * total:
 *
 *     Total number of matching records.
 *
 *
 * offset:
 *
 *     Number of records skipped.
 *
 *
 * totalPages:
 *
 *     Total number of available pages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. OFFSET CALCULATION
 * ============================================================
 */

function calculateOffset(page, limit) {
  return (page - 1) * limit;
}

/*
 * Examples:
 *
 *
 * page = 1
 * limit = 10
 *
 * offset = 0
 *
 *
 * page = 2
 * limit = 10
 *
 * offset = 10
 *
 *
 * page = 5
 * limit = 20
 *
 * offset = 80
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. TOTAL PAGES
 * ============================================================
 */

function calculateTotalPages(total, limit) {
  return Math.ceil(total / limit);
}

/*
 * Example:
 *
 *
 * total = 105
 * limit = 20
 *
 *
 * Math.ceil(
 *   105 / 20
 * )
 *
 *
 * = 6
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. NEXT PAGE
 * ============================================================
 */

function calculateNextPage(page, totalPages) {
  if (page >= totalPages) {
    return null;
  }

  return page + 1;
}

/*
 * ============================================================
 * 5. PREVIOUS PAGE
 * ============================================================
 */

function calculatePreviousPage(page) {
  if (page <= 1) {
    return null;
  }

  return page - 1;
}

/*
 * ============================================================
 * 6. HAS NEXT PAGE
 * ============================================================
 */

function hasNextPage(page, totalPages) {
  return page < totalPages;
}

/*
 * ============================================================
 * 7. HAS PREVIOUS PAGE
 * ============================================================
 */

function hasPreviousPage(page) {
  return page > 1;
}

/*
 * ============================================================
 * 8. COMPLETE METADATA FUNCTION
 * ============================================================
 */

function createPaginationMetadata({ page, limit, total }) {
  const totalPages = calculateTotalPages(total, limit);

  return {
    page,

    limit,

    total,

    totalPages,

    hasNextPage: hasNextPage(page, totalPages),

    hasPreviousPage: hasPreviousPage(page),

    nextPage: calculateNextPage(page, totalPages),

    previousPage: calculatePreviousPage(page),
  };
}

/*
 * ============================================================
 * 9. EXAMPLE
 * ============================================================
 */

const metadata = createPaginationMetadata({
  page: 2,

  limit: 20,

  total: 105,
});

console.log(metadata);

/*
 * Output:
 *
 *
 * {
 *   page: 2,
 *   limit: 20,
 *   total: 105,
 *   totalPages: 6,
 *   hasNextPage: true,
 *   hasPreviousPage: true,
 *   nextPage: 3,
 *   previousPage: 1
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. FIRST PAGE
 * ============================================================
 */

const firstPage = createPaginationMetadata({
  page: 1,

  limit: 20,

  total: 105,
});

console.log(firstPage);

/*
 * Result:
 *
 *
 * {
 *   page: 1,
 *   limit: 20,
 *   total: 105,
 *   totalPages: 6,
 *   hasNextPage: true,
 *   hasPreviousPage: false,
 *   nextPage: 2,
 *   previousPage: null
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. LAST PAGE
 * ============================================================
 */

const lastPage = createPaginationMetadata({
  page: 6,

  limit: 20,

  total: 105,
});

console.log(lastPage);

/*
 * Result:
 *
 *
 * {
 *   page: 6,
 *   limit: 20,
 *   total: 105,
 *   totalPages: 6,
 *   hasNextPage: false,
 *   hasPreviousPage: true,
 *   nextPage: null,
 *   previousPage: 5
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. NORMALIZE PAGINATION INPUT
 * ============================================================
 *
 * Query parameters come from the client as strings.
 *
 *
 * Example:
 *
 *
 *     /users?page=2&limit=20
 *
 *
 * Express:
 *
 *
 *     req.query.page
 *
 *
 * may be:
 *
 *
 *     "2"
 *
 *
 * Therefore convert and validate them before using them.
 *
 * ============================================================
 */

function parsePaginationQuery(query) {
  const page = query.page === undefined ? 1 : Number(query.page);

  const limit = query.limit === undefined ? 20 : Number(query.limit);

  /*
   * Validate page.
   */

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("page must be a positive integer");
  }

  /*
   * Validate limit.
   */

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("limit must be a positive integer");
  }

  /*
   * Maximum page size.
   */

  if (limit > 100) {
    throw new Error("limit cannot exceed 100");
  }

  return {
    page,
    limit,
  };
}

/*
 * ============================================================
 * 13. NORMALIZED PAGINATION
 * ============================================================
 */

const pagination = parsePaginationQuery({
  page: "3",
  limit: "25",
});

console.log(pagination);

/*
 * Output:
 *
 *
 * {
 *   page: 3,
 *   limit: 25
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. COMBINE INPUT + OFFSET
 * ============================================================
 */

function createOffsetPagination(query) {
  const { page, limit } = parsePaginationQuery(query);

  const offset = calculateOffset(page, limit);

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
 * createOffsetPagination({
 *   page: "4",
 *   limit: "25",
 * });
 *
 *
 * Result:
 *
 *
 * {
 *   page: 4,
 *   limit: 25,
 *   offset: 75
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. PAGINATION RESPONSE
 * ============================================================
 *
 * Keep the response structure predictable.
 *
 * Recommended:
 *
 *
 * {
 *   data: [],
 *
 *   pagination: {}
 * }
 *
 * ============================================================
 */

function createPaginatedResponse({ data, page, limit, total }) {
  return {
    data,

    pagination: createPaginationMetadata({
      page,
      limit,
      total,
    }),
  };
}

/*
 * ============================================================
 * 16. EXAMPLE RESPONSE
 * ============================================================
 */

const response = createPaginatedResponse({
  data: [
    {
      id: 21,
      name: "User 21",
    },

    {
      id: 22,
      name: "User 22",
    },
  ],

  page: 2,

  limit: 20,

  total: 105,
});

console.log(JSON.stringify(response, null, 2));

/*
 * Output:
 *
 *
 * {
 *   "data": [
 *     {
 *       "id": 21,
 *       "name": "User 21"
 *     },
 *     {
 *       "id": 22,
 *       "name": "User 22"
 *     }
 *   ],
 *
 *   "pagination": {
 *     "page": 2,
 *     "limit": 20,
 *     "total": 105,
 *     "totalPages": 6,
 *     "hasNextPage": true,
 *     "hasPreviousPage": true,
 *     "nextPage": 3,
 *     "previousPage": 1
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. MONGODB EXAMPLE
 * ============================================================
 *
 * In a real application:
 *
 *
 *     const filter = {
 *       active: true,
 *     };
 *
 *
 *     const {
 *       page,
 *       limit,
 *       offset,
 *     } =
 *       createOffsetPagination(
 *         req.query,
 *       );
 *
 *
 *     const [
 *       data,
 *       total,
 *     ] =
 *       await Promise.all([
 *
 *         User.find(filter)
 *           .sort({
 *             createdAt: -1,
 *             _id: -1,
 *           })
 *           .skip(offset)
 *           .limit(limit)
 *           .lean(),
 *
 *         User.countDocuments(
 *           filter,
 *         ),
 *
 *       ]);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. WHY Promise.all?
 * ============================================================
 *
 * We need:
 *
 *
 *     data
 *
 * and:
 *
 *     total
 *
 *
 * These two database operations are independent.
 *
 *
 * Instead of:
 *
 *
 *     const data =
 *       await User.find(...);
 *
 *     const total =
 *       await User.countDocuments(...);
 *
 *
 * we can execute them concurrently:
 *
 *
 *     await Promise.all([
 *       query1,
 *       query2,
 *     ]);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. COMPLETE EXPRESS EXAMPLE
 * ============================================================
 */

import express from "express";

const app = express();

app.get("/users", async (req, res) => {
  try {
    /*
     * Parse query.
     */

    const { page, limit } = parsePaginationQuery(req.query);

    /*
     * Calculate offset.
     */

    const offset = calculateOffset(page, limit);

    /*
     * Example database filter.
     */

    const filter = {};

    /*
     * Database operations.
     *
     * Replace these with actual
     * Mongoose operations.
     */

    const data = [
      {
        id: 1,
        name: "User 1",
      },
    ];

    const total = 105;

    /*
     * Build response.
     */

    return res.status(200).json(
      createPaginatedResponse({
        data,
        page,
        limit,
        total,
      }),
    );
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
});

/*
 * ============================================================
 * 20. RESPONSE LINKS
 * ============================================================
 *
 * Some APIs expose navigation links.
 *
 *
 * Example:
 *
 *
 * {
 *   "pagination": {
 *
 *     "page": 2,
 *
 *     "limit": 20,
 *
 *     "total": 105,
 *
 *     "totalPages": 6,
 *
 *     "next": "/users?page=3&limit=20",
 *
 *     "previous": "/users?page=1&limit=20"
 *
 *   }
 * }
 *
 *
 * This can make frontend navigation easier.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. BUILD PAGE URL
 * ============================================================
 */

function buildPageUrl({ baseUrl, page, limit }) {
  const params = new URLSearchParams({
    page: String(page),

    limit: String(limit),
  });

  return `${baseUrl}?${params.toString()}`;
}

/*
 * Example:
 *
 *
 * buildPageUrl({
 *   baseUrl: "/users",
 *   page: 3,
 *   limit: 20,
 * });
 *
 *
 * Result:
 *
 *
 *     /users?page=3&limit=20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. RESPONSE WITH LINKS
 * ============================================================
 */

function createPaginationLinks({ baseUrl, page, limit, totalPages }) {
  return {
    next:
      page < totalPages
        ? buildPageUrl({
            baseUrl,
            page: page + 1,
            limit,
          })
        : null,

    previous:
      page > 1
        ? buildPageUrl({
            baseUrl,
            page: page - 1,
            limit,
          })
        : null,
  };
}

/*
 * ============================================================
 * 23. EDGE CASE: ZERO RECORDS
 * ============================================================
 *
 * Suppose:
 *
 *
 *     total = 0
 *
 *
 * and:
 *
 *
 *     limit = 20
 *
 *
 * Then:
 *
 *
 *     Math.ceil(
 *       0 / 20
 *     )
 *
 *
 * returns:
 *
 *
 *     0
 *
 *
 * Therefore:
 *
 *
 *     totalPages = 0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. ZERO RECORD RESPONSE
 * ============================================================
 *
 * A common response:
 *
 *
 * {
 *   "data": [],
 *
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 0,
 *     "totalPages": 0,
 *     "hasNextPage": false,
 *     "hasPreviousPage": false
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. PAGE GREATER THAN TOTAL PAGES
 * ============================================================
 *
 * Example:
 *
 *
 *     total = 100
 *     limit = 20
 *
 *     totalPages = 5
 *
 *
 * Client:
 *
 *
 *     ?page=10
 *
 *
 * The API can return:
 *
 *
 *     data: []
 *
 *
 * with:
 *
 *
 *     page: 10
 *
 *     totalPages: 5
 *
 *
 * Another API design may reject it.
 *
 *
 * Pick one behavior and keep it consistent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. DON'T TRUST TOTAL FOR SECURITY
 * ============================================================
 *
 * Pagination metadata is informational.
 *
 * It must not be used to authorize access.
 *
 *
 * Authorization must happen independently:
 *
 *
 *     authenticated user
 *          ↓
 *     authorization
 *          ↓
 *     filter accessible records
 *          ↓
 *     pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. FILTER FIRST
 * ============================================================
 *
 * The correct conceptual order is:
 *
 *
 *     authorization
 *          ↓
 *     filtering
 *          ↓
 *     sorting
 *          ↓
 *     pagination
 *
 *
 * Not:
 *
 *
 *     pagination
 *          ↓
 *     authorization
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. REUSABLE PAGINATION UTILITY
 * ============================================================
 *
 * In a larger project you might create:
 *
 *
 *     src/
 *
 *       utils/
 *
 *         pagination.js
 *
 *
 * Then controllers can simply use:
 *
 *
 *     const pagination =
 *       parsePaginationQuery(
 *         req.query,
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. SERVICE LAYER
 * ============================================================
 *
 * Example:
 *
 *
 *     userService.list({
 *       filter,
 *       page,
 *       limit,
 *     });
 *
 *
 * The service can return:
 *
 *
 *     {
 *       data,
 *       pagination,
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. IMPORTANT SEPARATION
 * ============================================================
 *
 * Keep these concepts separate:
 *
 *
 * Query parsing
 *     ↓
 * Pagination calculation
 *     ↓
 * Database query
 *     ↓
 * Metadata creation
 *     ↓
 * HTTP response
 *
 *
 * This makes the code easier to test and maintain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. OFFSET PAGINATION HELPER
 * ============================================================
 */

function getOffsetPagination({ page = 1, limit = 20, total = 0 }) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Invalid page");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid limit");
  }

  const offset = (page - 1) * limit;

  const totalPages = Math.ceil(total / limit);

  return {
    page,

    limit,

    offset,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
}

/*
 * ============================================================
 * 32. EXAMPLE
 * ============================================================
 */

console.log(
  getOffsetPagination({
    page: 3,

    limit: 20,

    total: 105,
  }),
);

/*
 * Result:
 *
 *
 * {
 *   page: 3,
 *   limit: 20,
 *   offset: 40,
 *   total: 105,
 *   totalPages: 6,
 *   hasNextPage: true,
 *   hasPreviousPage: true
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. CURSOR METADATA
 * ============================================================
 *
 * Cursor pagination does not normally need:
 *
 *
 *     page
 *     totalPages
 *
 *
 * Instead:
 *
 *
 * {
 *   data: [],
 *
 *   pagination: {
 *     limit: 20,
 *     nextCursor: "...",
 *     hasNextPage: true
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. OFFSET METADATA
 * ============================================================
 *
 * Offset pagination:
 *
 *
 * {
 *   page,
 *   limit,
 *   total,
 *   totalPages,
 *   hasNextPage,
 *   hasPreviousPage
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. CURSOR METADATA
 * ============================================================
 *
 * Cursor pagination:
 *
 *
 * {
 *   limit,
 *   nextCursor,
 *   hasNextPage
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. IMPORTANT DESIGN RULE
 * ============================================================
 *
 * Don't return random pagination formats from different
 * endpoints.
 *
 *
 * Prefer a consistent API convention.
 *
 *
 * Example:
 *
 *
 *     /users
 *     /products
 *     /orders
 *     /messages
 *
 *
 * should use predictable pagination semantics.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. FINAL ARCHITECTURE
 * ============================================================
 *
 *
 * HTTP Request
 *
 *     GET /users?page=2&limit=20
 *
 *          ↓
 *
 * Query Parser
 *
 *          ↓
 *
 * {
 *   page: 2,
 *   limit: 20
 * }
 *
 *          ↓
 *
 * Pagination Calculator
 *
 *          ↓
 *
 * {
 *   offset: 20
 * }
 *
 *          ↓
 *
 * Database
 *
 *     skip(20)
 *     limit(20)
 *
 *          ↓
 *
 * Data + total
 *
 *          ↓
 *
 * Metadata Builder
 *
 *          ↓
 *
 * HTTP Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * INPUT
 *
 *     page
 *     limit
 *
 *
 *        ↓
 *
 *
 * CALCULATE
 *
 *     offset
 *     totalPages
 *
 *
 *        ↓
 *
 *
 * QUERY
 *
 *     filter
 *     sort
 *     skip
 *     limit
 *
 *
 *        ↓
 *
 *
 * RESPONSE
 *
 *     data
 *     pagination
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/filtering/
 *
 * We will learn:
 *
 *     query filters
 *     operators
 *     gte
 *     lte
 *     gt
 *     lt
 *     eq
 *     ne
 *     in
 *     multiple filters
 *     MongoDB filter construction
 *
 * ============================================================
 */
