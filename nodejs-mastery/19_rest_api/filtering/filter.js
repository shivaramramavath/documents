/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/filtering/filter.js
 *
 * Topic:
 *     REST API Filtering
 *
 * ============================================================
 *
 * FILTERING
 * ============================================================
 *
 * Filtering means returning only resources that match specific
 * conditions supplied by the client.
 *
 * Example:
 *
 *     GET /users?role=student
 *
 * means:
 *
 *     Return users whose role is "student".
 *
 *
 * Multiple filters:
 *
 *     GET /users?role=student&active=true
 *
 * means:
 *
 *     role = student
 *     AND
 *     active = true
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

const users = [
  {
    id: 1,
    name: "Shiva",
    age: 21,
    role: "student",
    department: "CSE",
    active: true,
    city: "Guntur",
  },

  {
    id: 2,
    name: "Ravi",
    age: 24,
    role: "developer",
    department: "IT",
    active: true,
    city: "Hyderabad",
  },

  {
    id: 3,
    name: "Anil",
    age: 20,
    role: "student",
    department: "ECE",
    active: false,
    city: "Vijayawada",
  },

  {
    id: 4,
    name: "Priya",
    age: 23,
    role: "developer",
    department: "CSE",
    active: true,
    city: "Guntur",
  },

  {
    id: 5,
    name: "Kiran",
    age: 26,
    role: "admin",
    department: "CSE",
    active: true,
    city: "Bangalore",
  },

  {
    id: 6,
    name: "Rahul",
    age: 22,
    role: "student",
    department: "CSE",
    active: true,
    city: "Guntur",
  },
];

/*
 * ============================================================
 * 1. BASIC FILTER
 * ============================================================
 *
 * Request:
 *
 *     GET /users?role=student
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  /*
   * Read role from query parameters.
   */

  const { role } = req.query;

  /*
   * Start with all users.
   */

  let result = users;

  /*
   * ========================================================
   * APPLY ROLE FILTER
   * ========================================================
   */

  if (typeof role === "string" && role.length > 0) {
    result = result.filter((user) => user.role === role);
  }

  /*
   * Return filtered users.
   */

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 2. FILTERING MENTAL MODEL
 * ============================================================
 *
 *
 * Request:
 *
 *     GET /users?role=student
 *
 *                     │
 *                     ↓
 *               req.query.role
 *                     │
 *                     ↓
 *                 "student"
 *                     │
 *                     ↓
 *               Apply filter
 *                     │
 *                     ↓
 *               Matching users
 *                     │
 *                     ↓
 *                  JSON
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. MULTIPLE FILTERS
 * ============================================================
 *
 * Request:
 *
 *     GET /users
 *       ?role=student
 *       &department=CSE
 *
 *
 * Means:
 *
 *     role = student
 *
 *     AND
 *
 *     department = CSE
 *
 * ============================================================
 */

app.get("/users/multiple", (req, res) => {
  const { role, department } = req.query;

  let result = users;

  /*
   * Role filter.
   */

  if (typeof role === "string") {
    result = result.filter((user) => user.role === role);
  }

  /*
   * Department filter.
   */

  if (typeof department === "string") {
    result = result.filter((user) => user.department === department);
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 4. BOOLEAN FILTER
 * ============================================================
 *
 * Query parameters are strings.
 *
 *
 * Therefore:
 *
 *     ?active=true
 *
 *
 * gives:
 *
 *     "true"
 *
 * not:
 *
 *     true
 *
 *
 * You must convert it explicitly.
 * ============================================================
 */

app.get("/users/active", (req, res) => {
  const { active } = req.query;

  let result = users;

  if (typeof active === "string") {
    /*
     * Convert string to boolean.
     */

    if (active === "true") {
      result = result.filter((user) => user.active === true);
    } else if (active === "false") {
      result = result.filter((user) => user.active === false);
    } else {
      return res.status(400).json({
        error: {
          code: "INVALID_BOOLEAN",

          message: "active must be true or false",
        },
      });
    }
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 5. NUMERIC FILTER
 * ============================================================
 *
 * Request:
 *
 *     GET /users?age=21
 *
 *
 * Query string:
 *
 *     "21"
 *
 *
 * Convert:
 *
 *     Number("21")
 *
 * ============================================================
 */

app.get("/users/by-age", (req, res) => {
  const { age } = req.query;

  if (typeof age !== "string") {
    return res.status(400).json({
      error: {
        code: "AGE_REQUIRED",

        message: "age is required",
      },
    });
  }

  const parsedAge = Number(age);

  if (!Number.isInteger(parsedAge)) {
    return res.status(400).json({
      error: {
        code: "INVALID_AGE",

        message: "age must be an integer",
      },
    });
  }

  const result = users.filter((user) => user.age === parsedAge);

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 6. GREATER THAN
 * ============================================================
 *
 * Sometimes an API needs operators.
 *
 *
 * Example:
 *
 *     GET /users?age[gt]=21
 *
 *
 * Conceptually:
 *
 *     age > 21
 *
 * ============================================================
 */

app.get("/users/age-gt", (req, res) => {
  const { age } = req.query;

  /*
   * Express can parse nested query parameters depending on
   * configuration/query parser.
   *
   * For this example we handle the common object shape.
   */

  const ageFilter = typeof age === "object" && age !== null ? age : {};

  const rawGt = ageFilter.gt;

  if (rawGt === undefined) {
    return res.status(400).json({
      error: {
        code: "GT_REQUIRED",

        message: "age[gt] is required",
      },
    });
  }

  const gt = Number(rawGt);

  if (!Number.isFinite(gt)) {
    return res.status(400).json({
      error: {
        code: "INVALID_GT",

        message: "age[gt] must be a number",
      },
    });
  }

  const result = users.filter((user) => user.age > gt);

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 7. COMMON FILTER OPERATORS
 * ============================================================
 *
 * APIs commonly support operators such as:
 *
 *
 *     eq
 *     ne
 *     gt
 *     gte
 *     lt
 *     lte
 *     in
 *     nin
 *
 *
 * Meaning:
 *
 *     eq   → equal
 *     ne   → not equal
 *     gt   → greater than
 *     gte  → greater than or equal
 *     lt   → less than
 *     lte  → less than or equal
 *     in   → included in list
 *     nin  → not included in list
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. RANGE FILTER
 * ============================================================
 *
 * Example:
 *
 *     GET /users?minAge=21&maxAge=25
 *
 *
 * Means:
 *
 *     age >= 21
 *     AND
 *     age <= 25
 *
 * ============================================================
 */

app.get("/users/range", (req, res) => {
  const { minAge, maxAge } = req.query;

  let result = users;

  /*
   * Minimum age.
   */

  if (typeof minAge === "string") {
    const min = Number(minAge);

    if (!Number.isFinite(min)) {
      return res.status(400).json({
        error: {
          code: "INVALID_MIN_AGE",

          message: "minAge must be a number",
        },
      });
    }

    result = result.filter((user) => user.age >= min);
  }

  /*
   * Maximum age.
   */

  if (typeof maxAge === "string") {
    const max = Number(maxAge);

    if (!Number.isFinite(max)) {
      return res.status(400).json({
        error: {
          code: "INVALID_MAX_AGE",

          message: "maxAge must be a number",
        },
      });
    }

    result = result.filter((user) => user.age <= max);
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 9. IN FILTER
 * ============================================================
 *
 * Request:
 *
 *     GET /users?role=student,developer
 *
 *
 * Meaning:
 *
 *     role IN (
 *       student,
 *       developer
 *     )
 *
 * ============================================================
 */

app.get("/users/by-roles", (req, res) => {
  const { role } = req.query;

  if (typeof role !== "string") {
    return res.status(400).json({
      error: {
        code: "ROLE_REQUIRED",

        message: "role is required",
      },
    });
  }

  const roles = role
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (roles.length === 0) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROLE",

        message: "At least one role is required",
      },
    });
  }

  const result = users.filter((user) => roles.includes(user.role));

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 10. CASE-INSENSITIVE FILTER
 * ============================================================
 *
 * Exact equality:
 *
 *     user.city === city
 *
 *
 * Case-insensitive:
 *
 *     user.city.toLowerCase()
 *
 * ============================================================
 */

app.get("/users/by-city", (req, res) => {
  const { city } = req.query;

  if (typeof city !== "string" || city.trim() === "") {
    return res.status(400).json({
      error: {
        code: "CITY_REQUIRED",

        message: "city is required",
      },
    });
  }

  const normalizedCity = city.trim().toLowerCase();

  const result = users.filter(
    (user) => user.city.toLowerCase() === normalizedCity,
  );

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 11. MULTIPLE VALUES
 * ============================================================
 *
 * Some clients may send:
 *
 *     ?role=student&role=developer
 *
 *
 * Depending on the query parser, req.query.role may be:
 *
 *     string
 *
 * or:
 *
 *     string[]
 *
 *
 * Never blindly assume the type.
 *
 * ============================================================
 */

function normalizeToArray(value) {
  if (value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

/*
 * ============================================================
 * 12. GENERIC FILTER HELPERS
 * ============================================================
 *
 * Instead of writing separate filter logic everywhere,
 * reusable functions can be created.
 * ============================================================
 */

function filterByRole(data, role) {
  if (typeof role !== "string" || role.trim() === "") {
    return data;
  }

  return data.filter((user) => user.role === role.trim());
}

function filterByDepartment(data, department) {
  if (typeof department !== "string" || department.trim() === "") {
    return data;
  }

  return data.filter((user) => user.department === department.trim());
}

/*
 * ============================================================
 * 13. FILTER PIPELINE
 * ============================================================
 *
 * A REST API often processes filters sequentially.
 *
 *
 *     all records
 *          ↓
 *     role filter
 *          ↓
 *     department filter
 *          ↓
 *     active filter
 *          ↓
 *     age filter
 *          ↓
 *     sorting
 *          ↓
 *     pagination
 *
 * ============================================================
 */

app.get("/users/filter-pipeline", (req, res) => {
  const { role, department } = req.query;

  let result = users;

  result = filterByRole(result, role);

  result = filterByDepartment(result, department);

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 14. FILTER + PAGINATION
 * ============================================================
 *
 * The typical order is:
 *
 *
 *     FILTER
 *        ↓
 *     SORT
 *        ↓
 *     PAGINATE
 *
 *
 * Example:
 *
 *     GET /users
 *       ?role=student
 *       &page=1
 *       &limit=10
 *
 *
 * You should paginate the filtered result, not paginate first
 * and then filter.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. FILTER + SORT + PAGINATION
 * ============================================================
 *
 * Production API pipeline:
 *
 *
 *     Request
 *       ↓
 *     Parse query
 *       ↓
 *     Validate
 *       ↓
 *     Build filter
 *       ↓
 *     Database query
 *       ↓
 *     Sort
 *       ↓
 *     Pagination
 *       ↓
 *     Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. MONGODB FILTER
 * ============================================================
 *
 * In MongoDB/Mongoose, a filter can look like:
 *
 *
 *     const filter = {
 *       role: "student",
 *       department: "CSE",
 *       active: true,
 *     };
 *
 *
 * Then:
 *
 *
 *     User.find(filter)
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. MONGODB OPERATORS
 * ============================================================
 *
 * Example:
 *
 *
 *     const filter = {
 *       age: {
 *         $gte: 18,
 *         $lte: 25,
 *       },
 *     };
 *
 *
 * Equivalent concept:
 *
 *     18 <= age <= 25
 *
 *
 * Other MongoDB operators include:
 *
 *
 *     $eq
 *     $ne
 *     $gt
 *     $gte
 *     $lt
 *     $lte
 *     $in
 *     $nin
 *     $exists
 *     $regex
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. NEVER TRUST CLIENT FILTERS
 * ============================================================
 *
 * A dangerous approach is:
 *
 *
 *     const filter =
 *       req.query;
 *
 *
 *     User.find(filter);
 *
 *
 * Why?
 *
 * The client can potentially provide fields/operators you did
 * not intend to expose.
 *
 *
 * Better:
 *
 *     explicitly whitelist allowed fields/operators.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. ALLOWLIST
 * ============================================================
 *
 * Example:
 *
 *
 *     const allowedFields = [
 *       "role",
 *       "department",
 *       "city",
 *       "active",
 *     ];
 *
 *
 * Only those fields are converted into a database filter.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. DO NOT ALLOW ARBITRARY DATABASE OPERATORS
 * ============================================================
 *
 * Avoid blindly accepting:
 *
 *
 *     req.query
 *
 *
 * and passing it to MongoDB.
 *
 *
 * Instead:
 *
 *
 *     Client input
 *          ↓
 *     validation
 *          ↓
 *     allowlist
 *          ↓
 *     safe filter object
 *          ↓
 *     MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. FILTER VALIDATION
 * ============================================================
 *
 * Validate:
 *
 *     type
 *     allowed values
 *     range
 *     length
 *     format
 *
 *
 * Example:
 *
 *     role must be one of:
 *
 *       student
 *       developer
 *       admin
 *
 * ============================================================
 */

const ALLOWED_ROLES = new Set(["student", "developer", "admin"]);

function validateRole(role) {
  if (role === undefined) {
    return null;
  }

  if (typeof role !== "string") {
    throw new Error("role must be a string");
  }

  if (!ALLOWED_ROLES.has(role)) {
    throw new Error("Invalid role");
  }

  return role;
}

/*
 * ============================================================
 * 22. FILTER DTO / QUERY DTO
 * ============================================================
 *
 * In larger applications, convert raw query parameters into a
 * validated internal representation.
 *
 *
 * Example:
 *
 *
 *     {
 *       role: "student",
 *       active: true,
 *       minAge: 18,
 *       maxAge: 25
 *     }
 *
 *
 * Controllers should ideally not pass raw req.query directly
 * into the database layer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. FILTERING ARCHITECTURE
 * ============================================================
 *
 *
 * HTTP Request
 *      │
 *      ↓
 * Controller
 *      │
 *      ↓
 * Query validation
 *      │
 *      ↓
 * Filter DTO
 *      │
 *      ↓
 * Service
 *      │
 *      ↓
 * Repository
 *      │
 *      ↓
 * Database filter
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. FILTERING WITH MONGOOSE
 * ============================================================
 *
 * Example:
 *
 *
 *     const filter = {};
 *
 *
 *     if (role) {
 *       filter.role = role;
 *     }
 *
 *
 *     if (department) {
 *       filter.department =
 *         department;
 *     }
 *
 *
 *     if (active !== undefined) {
 *       filter.active = active;
 *     }
 *
 *
 *     const users =
 *       await User.find(filter);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. FILTER + INDEX
 * ============================================================
 *
 * If an endpoint frequently filters by:
 *
 *     role
 *
 *
 * consider an appropriate database index.
 *
 *
 * Example:
 *
 *
 *     db.users.createIndex({
 *       role: 1,
 *     });
 *
 *
 * For compound queries, index design should follow the actual
 * query workload and sort requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. FILTERING IS NOT SEARCHING
 * ============================================================
 *
 * Filtering:
 *
 *     role=student
 *
 * asks for an exact condition.
 *
 *
 * Searching:
 *
 *     search=shiv
 *
 * usually means matching text across one or more fields.
 *
 *
 * These are related but different API capabilities.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. FILTERING IS NOT SORTING
 * ============================================================
 *
 * Filtering answers:
 *
 *     Which records?
 *
 *
 * Sorting answers:
 *
 *     In what order?
 *
 *
 * Pagination answers:
 *
 *     Which portion?
 *
 *
 * Example:
 *
 *
 *     /users
 *       ?role=student
 *       &sort=age
 *       &order=desc
 *       &page=1
 *       &limit=20
 *
 *
 * Filter:
 *
 *     role=student
 *
 * Sort:
 *
 *     age DESC
 *
 * Pagination:
 *
 *     page 1
 *     limit 20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. COMMON API FILTER SYNTAX
 * ============================================================
 *
 * Style 1:
 *
 *     ?role=student
 *
 *
 * Style 2:
 *
 *     ?filter[role]=student
 *
 *
 * Style 3:
 *
 *     ?age[gte]=18
 *
 *
 * Style 4:
 *
 *     ?status=in:active,pending
 *
 *
 * There is no single mandatory syntax.
 *
 * Choose one convention and keep it consistent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. GOOD REST REQUEST
 * ============================================================
 *
 * Example:
 *
 *
 *     GET /api/v1/users
 *       ?role=student
 *       &department=CSE
 *       &active=true
 *       &minAge=18
 *       &maxAge=25
 *       &page=1
 *       &limit=20
 *
 *
 * Processing:
 *
 *
 *     filters
 *        ↓
 *     sorting
 *        ↓
 *     pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * FILTERING
 *
 *     "Give me only records matching these conditions."
 *
 *
 * Example:
 *
 *     role=student
 *
 *
 * MULTIPLE FILTERS
 *
 *     role=student
 *     department=CSE
 *
 *
 * RANGE:
 *
 *     minAge=18
 *     maxAge=25
 *
 *
 * IN:
 *
 *     role=student,developer
 *
 *
 * Production flow:
 *
 *
 *     req.query
 *        ↓
 *     validate
 *        ↓
 *     normalize
 *        ↓
 *     allowlist
 *        ↓
 *     build filter
 *        ↓
 *     database
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/filtering/operators.js
 *
 * We will build a reusable filtering system supporting:
 *
 *     $eq
 *     $ne
 *     $gt
 *     $gte
 *     $lt
 *     $lte
 *     $in
 *     $nin
 *
 * and safely convert API query parameters into MongoDB
 * conditions.
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
