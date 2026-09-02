/**
 * ============================================================
 * 19_rest_api/sorting/sorting.js
 * ============================================================
 *
 * REST API SORTING
 *
 * Sorting determines the order in which records are returned.
 *
 * Examples:
 *
 *     GET /users?sort=age
 *
 *     GET /users?sort=-age
 *
 *     GET /users?sort=name
 *
 *     GET /users?sort=-createdAt
 *
 * ============================================================
 */

import express from "express";

const app = express();

/*
 * ============================================================
 * SAMPLE DATA
 * ============================================================
 */

const users = [
  {
    id: 1,
    name: "Shiva",
    age: 21,
    createdAt: "2026-01-10",
  },

  {
    id: 2,
    name: "Rahul",
    age: 25,
    createdAt: "2026-02-15",
  },

  {
    id: 3,
    name: "Anil",
    age: 30,
    createdAt: "2026-03-20",
  },

  {
    id: 4,
    name: "Ravi",
    age: 28,
    createdAt: "2026-01-25",
  },
];

/*
 * ============================================================
 * 1. DEFAULT SORT
 * ============================================================
 */

app.get("/users", (req, res) => {
  const data = [...users].sort((a, b) => a.id - b.id);

  return res.json({
    data,
  });
});

/*
 * ============================================================
 * 2. SORT ASCENDING
 * ============================================================
 *
 *     ?sort=age
 *
 * means:
 *
 *     age ASC
 *
 * ============================================================
 */

function sortAscending(data, field) {
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) {
      return -1;
    }

    if (a[field] > b[field]) {
      return 1;
    }

    return 0;
  });
}

/*
 * ============================================================
 * 3. SORT DESCENDING
 * ============================================================
 */

function sortDescending(data, field) {
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) {
      return 1;
    }

    if (a[field] > b[field]) {
      return -1;
    }

    return 0;
  });
}

/*
 * ============================================================
 * 4. PARSE SORT PARAMETER
 * ============================================================
 *
 *     ?sort=age
 *
 *     age
 *
 *
 *     ?sort=-age
 *
 *     -age
 *
 * ============================================================
 */

function parseSort(sort) {
  if (typeof sort !== "string") {
    return {
      field: "id",
      direction: 1,
    };
  }

  if (sort.startsWith("-")) {
    return {
      field: sort.slice(1),

      direction: -1,
    };
  }

  return {
    field: sort,
    direction: 1,
  };
}

/*
 * ============================================================
 * 5. ALLOWED SORT FIELDS
 * ============================================================
 *
 * NEVER allow arbitrary fields from the client.
 *
 * ============================================================
 */

const allowedSortFields = ["id", "name", "age", "createdAt"];

/*
 * ============================================================
 * 6. SAFE SORT PARSER
 * ============================================================
 */

function parseSafeSort(sort) {
  const parsed = parseSort(sort);

  if (!allowedSortFields.includes(parsed.field)) {
    throw new Error("Invalid sort field");
  }

  return parsed;
}

/*
 * ============================================================
 * 7. MULTIPLE SORT FIELDS
 * ============================================================
 *
 * Request:
 *
 *     ?sort=age,-name
 *
 *
 * Means:
 *
 *     age ASC
 *
 *     name DESC
 *
 * ============================================================
 */

function parseMultipleSort(sort) {
  if (typeof sort !== "string") {
    return [
      {
        field: "id",
        direction: 1,
      },
    ];
  }

  return sort
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => parseSafeSort(item));
}

/*
 * ============================================================
 * 8. MONGOOSE SORT OBJECT
 * ============================================================
 *
 * MongoDB/Mongoose:
 *
 *     User.find()
 *       .sort({
 *         age: 1,
 *         name: -1,
 *       });
 *
 *
 * 1  = ascending
 * -1 = descending
 *
 * ============================================================
 */

function createMongoSort(sort) {
  const fields = parseMultipleSort(sort);

  return Object.fromEntries(
    fields.map(({ field, direction }) => [field, direction]),
  );
}

/*
 * ============================================================
 * 9. EXPRESS SORTING
 * ============================================================
 */

app.get("/sorted-users", (req, res) => {
  try {
    const sort = createMongoSort(req.query.sort);

    /*
     * Real MongoDB:
     *
     * const data =
     *   await User.find()
     *     .sort(sort)
     *     .lean();
     */

    /*
     * Demonstration using JavaScript.
     */

    let data = [...users];

    const fields = Object.entries(sort);

    data.sort((a, b) => {
      for (const [field, direction] of fields) {
        if (a[field] < b[field]) {
          return -1 * direction;
        }

        if (a[field] > b[field]) {
          return 1 * direction;
        }
      }

      return 0;
    });

    return res.json({
      data,
      sort,
    });
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
 * IMPORTANT
 * ============================================================
 *
 * Always use deterministic sorting when using pagination.
 *
 * Prefer:
 *
 *     .sort({
 *       createdAt: -1,
 *       _id: -1,
 *     })
 *
 * instead of only:
 *
 *     .sort({
 *       createdAt: -1,
 *     })
 *
 * because records can have identical createdAt values.
 *
 * ============================================================
 */
