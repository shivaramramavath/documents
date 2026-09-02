/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/filtering/operators.js
 *
 * Topic:
 *     REST API Filter Operators
 *
 * ============================================================
 *
 * Operators allow clients to express conditions such as:
 *
 *     age > 18
 *     age >= 18
 *     age < 60
 *     age <= 60
 *     role IN ["student", "developer"]
 *
 * Common operators:
 *
 *     eq   → equal
 *     ne   → not equal
 *     gt   → greater than
 *     gte  → greater than or equal
 *     lt   → less than
 *     lte  → less than or equal
 *     in   → included in a list
 *     nin  → not included in a list
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * Never blindly convert arbitrary client input into a MongoDB
 * query.
 *
 * The API should:
 *
 *     request
 *       ↓
 *     validate
 *       ↓
 *     normalize
 *       ↓
 *     allowlist
 *       ↓
 *     build database filter
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
    salary: 25000,
    active: true,
  },

  {
    id: 2,
    name: "Ravi",
    age: 25,
    role: "developer",
    salary: 60000,
    active: true,
  },

  {
    id: 3,
    name: "Anil",
    age: 17,
    role: "student",
    salary: 10000,
    active: false,
  },

  {
    id: 4,
    name: "Priya",
    age: 30,
    role: "developer",
    salary: 85000,
    active: true,
  },

  {
    id: 5,
    name: "Kiran",
    age: 40,
    role: "admin",
    salary: 100000,
    active: true,
  },
];

/*
 * ============================================================
 * 1. EQUALITY OPERATOR
 * ============================================================
 *
 * API:
 *
 *     GET /users?age[eq]=21
 *
 *
 * Meaning:
 *
 *     age === 21
 *
 * ============================================================
 */

function equal(value, expected) {
  return value === expected;
}

/*
 * ============================================================
 * 2. NOT EQUAL
 * ============================================================
 *
 *     age[ne]=21
 *
 *
 * Means:
 *
 *     age !== 21
 *
 * ============================================================
 */

function notEqual(value, expected) {
  return value !== expected;
}

/*
 * ============================================================
 * 3. GREATER THAN
 * ============================================================
 *
 *     age[gt]=21
 *
 *
 * Means:
 *
 *     age > 21
 *
 * ============================================================
 */

function greaterThan(value, expected) {
  return value > expected;
}

/*
 * ============================================================
 * 4. GREATER THAN OR EQUAL
 * ============================================================
 *
 *     age[gte]=21
 *
 *
 * Means:
 *
 *     age >= 21
 *
 * ============================================================
 */

function greaterThanOrEqual(value, expected) {
  return value >= expected;
}

/*
 * ============================================================
 * 5. LESS THAN
 * ============================================================
 *
 *     age[lt]=21
 *
 *
 * Means:
 *
 *     age < 21
 *
 * ============================================================
 */

function lessThan(value, expected) {
  return value < expected;
}

/*
 * ============================================================
 * 6. LESS THAN OR EQUAL
 * ============================================================
 *
 *     age[lte]=21
 *
 *
 * Means:
 *
 *     age <= 21
 *
 * ============================================================
 */

function lessThanOrEqual(value, expected) {
  return value <= expected;
}

/*
 * ============================================================
 * 7. IN OPERATOR
 * ============================================================
 *
 *     role[in]=student,developer
 *
 *
 * Means:
 *
 *     role is student
 *     OR
 *     role is developer
 *
 * ============================================================
 */

function isIn(value, values) {
  return values.includes(value);
}

/*
 * ============================================================
 * 8. NOT IN
 * ============================================================
 *
 *     role[nin]=admin
 *
 *
 * Means:
 *
 *     role !== admin
 *
 * ============================================================
 */

function isNotIn(value, values) {
  return !values.includes(value);
}

/*
 * ============================================================
 * 9. OPERATOR ALLOWLIST
 * ============================================================
 *
 * Only operators explicitly supported by the API should be
 * accepted.
 * ============================================================
 */

const ALLOWED_OPERATORS = new Set([
  "eq",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "nin",
]);

/*
 * ============================================================
 * 10. FIELD ALLOWLIST
 * ============================================================
 *
 * Do not allow clients to filter arbitrary database fields.
 * ============================================================
 */

const ALLOWED_FIELDS = new Set(["age", "salary", "role", "active"]);

/*
 * ============================================================
 * 11. NUMERIC FIELDS
 * ============================================================
 */

const NUMERIC_FIELDS = new Set(["age", "salary"]);

/*
 * ============================================================
 * 12. BOOLEAN FIELDS
 * ============================================================
 */

const BOOLEAN_FIELDS = new Set(["active"]);

/*
 * ============================================================
 * 13. STRING FIELDS
 * ============================================================
 */

const STRING_FIELDS = new Set(["role"]);

/*
 * ============================================================
 * 14. PARSE BOOLEAN
 * ============================================================
 */

function parseBoolean(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error("Expected true or false");
}

/*
 * ============================================================
 * 15. PARSE NUMBER
 * ============================================================
 */

function parseNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("Expected a valid number");
  }

  return number;
}

/*
 * ============================================================
 * 16. PARSE FIELD VALUE
 * ============================================================
 *
 * Convert query-string values into the correct JavaScript type.
 * ============================================================
 */

function parseValue(field, value) {
  if (NUMERIC_FIELDS.has(field)) {
    return parseNumber(value);
  }

  if (BOOLEAN_FIELDS.has(field)) {
    return parseBoolean(value);
  }

  if (STRING_FIELDS.has(field)) {
    return value;
  }

  throw new Error(`Unsupported field: ${field}`);
}

/*
 * ============================================================
 * 17. PARSE IN / NIN VALUES
 * ============================================================
 *
 * Example:
 *
 *     role[in]=student,developer
 *
 *
 * becomes:
 *
 *     [
 *       "student",
 *       "developer"
 *     ]
 *
 * ============================================================
 */

function parseList(field, value) {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/*
 * ============================================================
 * 18. OPERATOR APPLICATION
 * ============================================================
 */

function applyOperator(fieldValue, operator, rawExpected, field) {
  /*
   * Validate operator.
   */

  if (!ALLOWED_OPERATORS.has(operator)) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  /*
   * ========================================================
   * IN
   * ========================================================
   */

  if (operator === "in") {
    const values = parseList(field, rawExpected).map((value) =>
      parseValue(field, value),
    );

    return isIn(fieldValue, values);
  }

  /*
   * ========================================================
   * NIN
   * ========================================================
   */

  if (operator === "nin") {
    const values = parseList(field, rawExpected).map((value) =>
      parseValue(field, value),
    );

    return isNotIn(fieldValue, values);
  }

  /*
   * For all other operators, parse one value.
   */

  const expected = parseValue(field, rawExpected);

  switch (operator) {
    case "eq":
      return equal(fieldValue, expected);

    case "ne":
      return notEqual(fieldValue, expected);

    case "gt":
      return greaterThan(fieldValue, expected);

    case "gte":
      return greaterThanOrEqual(fieldValue, expected);

    case "lt":
      return lessThan(fieldValue, expected);

    case "lte":
      return lessThanOrEqual(fieldValue, expected);

    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

/*
 * ============================================================
 * 19. GENERIC FILTER OBJECT
 * ============================================================
 *
 * We can represent:
 *
 *
 *     age[gte]=18
 *
 *
 * internally as:
 *
 *
 *     {
 *       age: {
 *         gte: "18"
 *       }
 *     }
 *
 *
 * After validation:
 *
 *
 *     {
 *       age: {
 *         gte: 18
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. APPLY FILTER OBJECT
 * ============================================================
 */

function matchesFilter(user, filters) {
  for (const [field, operators] of Object.entries(filters)) {
    /*
     * Field allowlist.
     */

    if (!ALLOWED_FIELDS.has(field)) {
      throw new Error(`Filtering by ${field} is not allowed`);
    }

    /*
     * Ensure operators is an object.
     */

    if (
      typeof operators !== "object" ||
      operators === null ||
      Array.isArray(operators)
    ) {
      throw new Error(`Invalid operators for ${field}`);
    }

    /*
     * Every operator on the same field must match.
     *
     * Example:
     *
     *     age[gte]=18
     *     age[lte]=30
     *
     * means:
     *
     *     age >= 18
     *     AND
     *     age <= 30
     */

    for (const [operator, expected] of Object.entries(operators)) {
      if (typeof expected !== "string") {
        throw new Error("Filter value must be a string");
      }

      const matched = applyOperator(user[field], operator, expected, field);

      if (!matched) {
        return false;
      }
    }
  }

  return true;
}

/*
 * ============================================================
 * 21. EXPRESS QUERY EXAMPLE
 * ============================================================
 *
 * Request:
 *
 *     GET /users/operators
 *       ?age[gte]=18
 *       &age[lte]=30
 *
 *
 * Depending on the Express query parser, nested query
 * parameters can become an object such as:
 *
 *
 *     req.query = {
 *       age: {
 *         gte: "18",
 *         lte: "30"
 *       }
 *     }
 *
 * ============================================================
 */

app.get("/users/operators", (req, res) => {
  try {
    /*
     * In this educational example we take req.query as the
     * filter object.
     *
     * In a production application, validate and normalize it
     * with a dedicated schema before reaching this layer.
     */

    const filters = req.query;

    const result = users.filter((user) => matchesFilter(user, filters));

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        code: "INVALID_FILTER",

        message: error instanceof Error ? error.message : "Invalid filter",
      },
    });
  }
});

/*
 * ============================================================
 * 22. EXAMPLES
 * ============================================================
 *
 *
 * EQUAL:
 *
 *     /users/operators?age[eq]=21
 *
 *
 *     age === 21
 *
 *
 *
 * NOT EQUAL:
 *
 *     /users/operators?role[ne]=admin
 *
 *
 *     role !== "admin"
 *
 *
 *
 * GREATER THAN:
 *
 *     /users/operators?age[gt]=21
 *
 *
 *     age > 21
 *
 *
 *
 * GREATER THAN OR EQUAL:
 *
 *     /users/operators?age[gte]=21
 *
 *
 *     age >= 21
 *
 *
 *
 * LESS THAN:
 *
 *     /users/operators?age[lt]=30
 *
 *
 *     age < 30
 *
 *
 *
 * LESS THAN OR EQUAL:
 *
 *     /users/operators?age[lte]=30
 *
 *
 *     age <= 30
 *
 *
 *
 * IN:
 *
 *     /users/operators?role[in]=student,developer
 *
 *
 *     role IN (
 *       "student",
 *       "developer"
 *     )
 *
 *
 *
 * NOT IN:
 *
 *     /users/operators?role[nin]=admin
 *
 *
 *     role NOT IN (
 *       "admin"
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. RANGE QUERY
 * ============================================================
 *
 * One of the most useful patterns:
 *
 *
 *     ?age[gte]=18&age[lte]=30
 *
 *
 * becomes:
 *
 *
 *     {
 *       age: {
 *         gte: "18",
 *         lte: "30"
 *       }
 *     }
 *
 *
 * Meaning:
 *
 *     age >= 18
 *
 *     AND
 *
 *     age <= 30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. MULTIPLE FIELDS
 * ============================================================
 *
 * Request:
 *
 *
 *     /users/operators
 *       ?age[gte]=18
 *       &age[lte]=30
 *       &salary[gte]=25000
 *       &active[eq]=true
 *
 *
 * Means:
 *
 *
 *     age >= 18
 *
 *     AND
 *
 *     age <= 30
 *
 *     AND
 *
 *     salary >= 25000
 *
 *     AND
 *
 *     active === true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. OPERATOR MAPPING
 * ============================================================
 *
 * The API-level operators can map to MongoDB operators.
 *
 *
 * API:
 *
 *     eq
 *
 * MongoDB:
 *
 *     $eq
 *
 *
 * API:
 *
 *     ne
 *
 * MongoDB:
 *
 *     $ne
 *
 *
 * API:
 *
 *     gt
 *
 * MongoDB:
 *
 *     $gt
 *
 *
 * API:
 *
 *     gte
 *
 * MongoDB:
 *
 *     $gte
 *
 *
 * API:
 *
 *     lt
 *
 * MongoDB:
 *
 *     $lt
 *
 *
 * API:
 *
 *     lte
 *
 * MongoDB:
 *
 *     $lte
 *
 *
 * API:
 *
 *     in
 *
 * MongoDB:
 *
 *     $in
 *
 *
 * API:
 *
 *     nin
 *
 * MongoDB:
 *
 *     $nin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. BUILDING A MONGODB FILTER
 * ============================================================
 *
 * Instead of filtering an in-memory array, a real application
 * can translate the validated API filter into MongoDB syntax.
 *
 *
 * Example API request:
 *
 *
 *     ?age[gte]=18
 *     &age[lte]=30
 *
 *
 * Internal MongoDB filter:
 *
 *
 *     {
 *       age: {
 *         $gte: 18,
 *         $lte: 30
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. OPERATOR MAP
 * ============================================================
 */

const MONGO_OPERATOR_MAP = {
  eq: "$eq",
  ne: "$ne",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  in: "$in",
  nin: "$nin",
};

/*
 * ============================================================
 * 28. BUILD MONGODB FILTER
 * ============================================================
 *
 * This function converts our safe API representation into a
 * MongoDB filter.
 *
 * ============================================================
 */

function buildMongoFilter(filters) {
  const mongoFilter = {};

  for (const [field, operators] of Object.entries(filters)) {
    /*
     * Field allowlist.
     */

    if (!ALLOWED_FIELDS.has(field)) {
      throw new Error(`Field not allowed: ${field}`);
    }

    mongoFilter[field] = {};

    for (const [operator, rawValue] of Object.entries(operators)) {
      /*
       * Operator allowlist.
       */

      if (!ALLOWED_OPERATORS.has(operator)) {
        throw new Error(`Operator not allowed: ${operator}`);
      }

      const mongoOperator = MONGO_OPERATOR_MAP[operator];

      if (operator === "in" || operator === "nin") {
        const values = parseList(field, rawValue).map((value) =>
          parseValue(field, value),
        );

        mongoFilter[field][mongoOperator] = values;
      } else {
        mongoFilter[field][mongoOperator] = parseValue(field, rawValue);
      }
    }
  }

  return mongoFilter;
}

/*
 * ============================================================
 * 29. MONGOOSE EXAMPLE
 * ============================================================
 *
 * Example:
 *
 *
 *     const filter =
 *       buildMongoFilter(
 *         req.query,
 *       );
 *
 *
 *     const users =
 *       await User.find(
 *         filter,
 *       );
 *
 *
 * The important part is that the filter has already passed:
 *
 *     field allowlist
 *     operator allowlist
 *     type conversion
 *     validation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. NEVER DO THIS
 * ============================================================
 *
 *
 *     User.find(
 *       req.query,
 *     );
 *
 *
 * Why?
 *
 * Because the API has delegated database-query construction to
 * the client.
 *
 *
 * Better:
 *
 *
 *     req.query
 *        ↓
 *     schema validation
 *        ↓
 *     allowed fields
 *        ↓
 *     allowed operators
 *        ↓
 *     type conversion
 *        ↓
 *     MongoDB filter
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. QUERY PARAMETER TYPE
 * ============================================================
 *
 * Query parameters originate from HTTP.
 *
 *
 * Therefore:
 *
 *
 *     ?age[gte]=18
 *
 *
 * initially represents text:
 *
 *
 *     "18"
 *
 *
 * It is the application's responsibility to convert it into:
 *
 *
 *     18
 *
 *
 * before comparing it as a number.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. VALIDATION
 * ============================================================
 *
 * You should reject:
 *
 *
 *     age[gte]=hello
 *
 *
 *     age[lte]=abc
 *
 *
 *     active[eq]=maybe
 *
 *
 *     unknownField[eq]=123
 *
 *
 *     age[unknown]=20
 *
 *
 * rather than silently producing incorrect database queries.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. VALUE LIMITS
 * ============================================================
 *
 * Production APIs should also consider:
 *
 *
 *     maximum number of filters
 *     maximum list length
 *     maximum string length
 *     numeric ranges
 *     allowed enum values
 *
 *
 * Example:
 *
 *
 *     role[in]=
 *       student,
 *       developer,
 *       admin
 *
 *
 * can be limited to a reasonable number of values.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. ENUM FILTER
 * ============================================================
 */

const ALLOWED_ROLES = new Set(["student", "developer", "admin"]);

/*
 * Example helper:
 */

function validateRole(role) {
  if (!ALLOWED_ROLES.has(role)) {
    throw new Error(`Invalid role: ${role}`);
  }

  return role;
}

/*
 * ============================================================
 * 35. OPERATOR SEMANTICS
 * ============================================================
 *
 * Equality:
 *
 *     eq
 *
 * means:
 *
 *     exactly equal
 *
 *
 * Range:
 *
 *     gt
 *     gte
 *     lt
 *     lte
 *
 *
 * Membership:
 *
 *     in
 *     nin
 *
 *
 * This vocabulary gives clients a predictable filtering API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. FILTERING PIPELINE
 * ============================================================
 *
 *
 * HTTP
 *  │
 *  ↓
 * req.query
 *  │
 *  ↓
 * Parse
 *  │
 *  ↓
 * Validate
 *  │
 *  ↓
 * Normalize
 *  │
 *  ↓
 * Allowlist
 *  │
 *  ↓
 * Build MongoDB filter
 *  │
 *  ↓
 * Repository
 *  │
 *  ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. FILTER + SORT + PAGINATION
 * ============================================================
 *
 * A real collection endpoint often combines all three.
 *
 *
 * Example:
 *
 *
 *     GET /users
 *       ?age[gte]=18
 *       &age[lte]=30
 *       &role[in]=student,developer
 *       &sort=age
 *       &order=desc
 *       &page=1
 *       &limit=20
 *
 *
 * Processing:
 *
 *
 *     FILTER
 *       ↓
 *     SORT
 *       ↓
 *     PAGINATION
 *
 *
 * This is the foundation of a powerful REST collection endpoint.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. FILTERING WITH MONGOOSE
 * ============================================================
 *
 * Conceptual repository:
 *
 *
 *     async function findUsers({
 *       filter,
 *       sort,
 *       skip,
 *       limit,
 *     }) {
 *
 *       return User.find(filter)
 *         .sort(sort)
 *         .skip(skip)
 *         .limit(limit)
 *         .lean();
 *     }
 *
 *
 * The controller should not contain raw database details.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. ARCHITECTURE
 * ============================================================
 *
 *
 * Controller
 *      │
 *      │ req.query
 *      ↓
 * Query Validator
 *      │
 *      ↓
 * Filter Builder
 *      │
 *      ↓
 * Service
 *      │
 *      ↓
 * Repository
 *      │
 *      ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. IMPORTANT SECURITY CONCEPT
 * ============================================================
 *
 * User-controlled query parameters are untrusted input.
 *
 *
 * Treat:
 *
 *     req.query
 *
 * as external input.
 *
 *
 * Never assume:
 *
 *     correct type
 *     correct field
 *     correct operator
 *     safe value
 *
 *
 * Validate everything that affects the database query.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * API:
 *
 *     age[gte]=18
 *     age[lte]=30
 *
 *
 * means:
 *
 *
 *     age >= 18
 *     AND
 *     age <= 30
 *
 *
 * API:
 *
 *     role[in]=student,developer
 *
 *
 * means:
 *
 *
 *     role IN [
 *       student,
 *       developer
 *     ]
 *
 *
 * Then convert safely:
 *
 *
 *     API operator
 *          ↓
 *     validated operator
 *          ↓
 *     MongoDB operator
 *
 *
 *     gte → $gte
 *     lte → $lte
 *     in  → $in
 *     nin → $nin
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/filtering/multiple_filters.js
 *
 * We will build a reusable collection endpoint that combines:
 *
 *     filtering
 *     operators
 *     sorting
 *     pagination
 *
 * while preserving a clean controller/service/repository
 * architecture.
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
