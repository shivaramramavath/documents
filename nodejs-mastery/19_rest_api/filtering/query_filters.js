/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/filtering/query_filters.js
 *
 * Topic:
 *     REST API Query Filtering
 *
 * ============================================================
 *
 * Filtering allows the client to request only records matching
 * specific conditions.
 *
 * Example:
 *
 *     GET /users?role=admin
 *
 *     GET /users?active=true
 *
 *     GET /users?age=20
 *
 *     GET /users?role=admin&active=true
 *
 * ============================================================
 *
 * BASIC FLOW
 *
 *     HTTP Query
 *          ↓
 *     Parse query parameters
 *          ↓
 *     Validate input
 *          ↓
 *     Build filter
 *          ↓
 *     Database query
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
    active: true,
    city: "Guntur",
  },

  {
    id: 2,
    name: "Rahul",
    age: 25,
    role: "developer",
    active: true,
    city: "Hyderabad",
  },

  {
    id: 3,
    name: "Anil",
    age: 30,
    role: "admin",
    active: false,
    city: "Vijayawada",
  },

  {
    id: 4,
    name: "Ravi",
    age: 28,
    role: "developer",
    active: true,
    city: "Guntur",
  },

  {
    id: 5,
    name: "Kiran",
    age: 35,
    role: "manager",
    active: true,
    city: "Hyderabad",
  },
];

/*
 * ============================================================
 * 1. NO FILTER
 * ============================================================
 *
 * Request:
 *
 *     GET /users
 *
 *
 * No query parameters means:
 *
 *     return all users
 *
 * ============================================================
 */

app.get("/users", (req, res) => {
  return res.status(200).json({
    data: users,
  });
});

/*
 * ============================================================
 * 2. FILTER BY EXACT VALUE
 * ============================================================
 *
 * Request:
 *
 *     GET /users?role=developer
 *
 *
 * Query:
 *
 *     req.query.role
 *
 *
 * value:
 *
 *     "developer"
 *
 * ============================================================
 */

app.get("/users/by-role", (req, res) => {
  const role = req.query.role;

  const data = users.filter((user) => user.role === role);

  return res.status(200).json({
    data,
  });
});

/*
 * ============================================================
 * 3. MULTIPLE FILTERS
 * ============================================================
 *
 * Request:
 *
 *     GET /users?role=developer&active=true
 *
 *
 * This means:
 *
 *     role MUST be developer
 *
 *     AND
 *
 *     active MUST be true
 *
 * ============================================================
 */

app.get("/users/filter", (req, res) => {
  const { role, active, city } = req.query;

  const data = users.filter((user) => {
    /*
     * Start with true.
     *
     * Each supplied filter can turn the result
     * into false.
     */

    let matches = true;

    /*
     * Role filter.
     */

    if (role !== undefined) {
      matches = matches && user.role === role;
    }

    /*
     * Active filter.
     */

    if (active !== undefined) {
      const activeValue = active === "true";

      matches = matches && user.active === activeValue;
    }

    /*
     * City filter.
     */

    if (city !== undefined) {
      matches = matches && user.city === city;
    }

    return matches;
  });

  return res.status(200).json({
    data,
  });
});

/*
 * ============================================================
 * 4. STRING VALUES
 * ============================================================
 *
 * Query parameters are strings.
 *
 *
 * Request:
 *
 *     ?age=25
 *
 *
 * req.query.age:
 *
 *
 *     "25"
 *
 *
 * NOT:
 *
 *     25
 *
 *
 * Therefore:
 *
 *
 *     user.age === req.query.age
 *
 *
 * will fail because:
 *
 *
 *     25 !== "25"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. NUMBER CONVERSION
 * ============================================================
 */

app.get("/users/by-age", (req, res) => {
  const age = Number(req.query.age);

  if (!Number.isInteger(age)) {
    return res.status(400).json({
      error: {
        code: "INVALID_AGE",

        message: "age must be an integer",
      },
    });
  }

  const data = users.filter((user) => user.age === age);

  return res.status(200).json({
    data,
  });
});

/*
 * ============================================================
 * 6. BOOLEAN CONVERSION
 * ============================================================
 *
 * Query:
 *
 *     ?active=true
 *
 *
 * req.query.active:
 *
 *     "true"
 *
 *
 * We need:
 *
 *     true
 *
 * ============================================================
 */

function parseBoolean(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error("Invalid boolean value");
}

/*
 * ============================================================
 * 7. USING BOOLEAN PARSER
 * ============================================================
 */

app.get("/users/active", (req, res) => {
  try {
    const active = parseBoolean(req.query.active);

    const data = users.filter((user) => user.active === active);

    return res.status(200).json({
      data,
    });
  } catch {
    return res.status(400).json({
      error: {
        code: "INVALID_ACTIVE",

        message: "active must be true or false",
      },
    });
  }
});

/*
 * ============================================================
 * 8. GENERIC FILTER BUILDER
 * ============================================================
 *
 * Instead of writing:
 *
 *     if (role) ...
 *     if (city) ...
 *     if (active) ...
 *
 * for every route, we can build a filter object.
 *
 * ============================================================
 */

function buildUserFilter(query) {
  const filter = {};

  if (query.role !== undefined) {
    filter.role = query.role;
  }

  if (query.city !== undefined) {
    filter.city = query.city;
  }

  if (query.active !== undefined) {
    filter.active = parseBoolean(query.active);
  }

  if (query.age !== undefined) {
    const age = Number(query.age);

    if (!Number.isInteger(age)) {
      throw new Error("Invalid age");
    }

    filter.age = age;
  }

  return filter;
}

/*
 * ============================================================
 * 9. MONGODB FILTER OBJECT
 * ============================================================
 *
 * The same concept maps directly to MongoDB.
 *
 *
 * Example:
 *
 *
 * Request:
 *
 *     GET /users
 *       ?role=developer
 *       &active=true
 *
 *
 * Filter:
 *
 *
 * {
 *   role: "developer",
 *   active: true
 * }
 *
 *
 * Mongoose:
 *
 *
 *     User.find(filter)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. MONGOOSE EXAMPLE
 * ============================================================
 *
 * Example:
 *
 *
 * const filter = {
 *   role: "developer",
 *   active: true,
 * };
 *
 *
 * const users =
 *   await User.find(filter);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. EQUALITY
 * ============================================================
 *
 * MongoDB equality:
 *
 *
 *     {
 *       role: "developer"
 *     }
 *
 *
 * Means:
 *
 *
 *     role equals developer
 *
 *
 * HTTP:
 *
 *
 *     GET /users?role=developer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. GREATER THAN
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       age: {
 *         $gt: 25
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     age > 25
 *
 *
 * HTTP design:
 *
 *
 *     GET /users?age[gt]=25
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. GREATER THAN OR EQUAL
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       age: {
 *         $gte: 25
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     age >= 25
 *
 *
 * HTTP:
 *
 *
 *     GET /users?age[gte]=25
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. LESS THAN
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       age: {
 *         $lt: 30
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     age < 30
 *
 *
 * HTTP:
 *
 *
 *     GET /users?age[lt]=30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. LESS THAN OR EQUAL
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       age: {
 *         $lte: 30
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     age <= 30
 *
 *
 * HTTP:
 *
 *
 *     GET /users?age[lte]=30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. NOT EQUAL
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       role: {
 *         $ne: "admin"
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     role != admin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. IN
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       role: {
 *         $in: [
 *           "admin",
 *           "developer"
 *         ]
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     role is admin
 *
 *     OR
 *
 *     role is developer
 *
 *
 * HTTP:
 *
 *
 *     GET /users?role=admin,developer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. NOT IN
 * ============================================================
 *
 * MongoDB:
 *
 *
 *     {
 *       role: {
 *         $nin: [
 *           "admin",
 *           "manager"
 *         ]
 *       }
 *     }
 *
 *
 * Means:
 *
 *
 *     role is neither admin nor manager.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. RANGE FILTER
 * ============================================================
 *
 * Request:
 *
 *
 *     GET /users
 *       ?age[gte]=20
 *       &age[lte]=30
 *
 *
 * MongoDB:
 *
 *
 * {
 *   age: {
 *     $gte: 20,
 *     $lte: 30
 *   }
 * }
 *
 *
 * Meaning:
 *
 *
 *     20 <= age <= 30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. BUILD RANGE FILTER
 * ============================================================
 */

function buildAgeFilter(query) {
  const ageFilter = {};

  if (query.age?.gt !== undefined) {
    ageFilter.$gt = Number(query.age.gt);
  }

  if (query.age?.gte !== undefined) {
    ageFilter.$gte = Number(query.age.gte);
  }

  if (query.age?.lt !== undefined) {
    ageFilter.$lt = Number(query.age.lt);
  }

  if (query.age?.lte !== undefined) {
    ageFilter.$lte = Number(query.age.lte);
  }

  if (Object.keys(ageFilter).length === 0) {
    return undefined;
  }

  return ageFilter;
}

/*
 * ============================================================
 * 21. IMPORTANT SECURITY RULE
 * ============================================================
 *
 * NEVER blindly copy client query parameters into MongoDB.
 *
 *
 * Dangerous pattern:
 *
 *
 *     User.find(req.query)
 *
 *
 * Why?
 *
 * The client controls the query object.
 *
 *
 * A client could potentially provide fields/operators that the
 * API never intended to expose.
 *
 *
 * Better:
 *
 *
 *     explicitly whitelist supported fields/operators.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. FIELD WHITELIST
 * ============================================================
 */

const allowedFilterFields = ["role", "city", "active", "age"];

/*
 * ============================================================
 * 23. CHECK ALLOWED FIELD
 * ============================================================
 */

function isAllowedFilterField(field) {
  return allowedFilterFields.includes(field);
}

/*
 * ============================================================
 * 24. UNKNOWN FILTER
 * ============================================================
 *
 * Request:
 *
 *
 *     GET /users?password=123
 *
 *
 * The API should NOT automatically turn that into:
 *
 *
 *     {
 *       password: "123"
 *     }
 *
 *
 * Only explicitly supported fields should be accepted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. FILTERING + PAGINATION
 * ============================================================
 *
 * These concepts work together.
 *
 *
 * Request:
 *
 *
 *     GET /users
 *       ?role=developer
 *       &active=true
 *       &page=1
 *       &limit=20
 *
 *
 * Processing:
 *
 *
 *     parse filters
 *          ↓
 *     validate filters
 *          ↓
 *     database filter
 *          ↓
 *     sort
 *          ↓
 *     pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. FILTERING + SORTING
 * ============================================================
 *
 * Example:
 *
 *
 *     GET /users
 *       ?role=developer
 *       &sort=age
 *       &order=desc
 *
 *
 * Means:
 *
 *
 *     role = developer
 *
 *     sort by age
 *
 *     descending
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. FILTERING + SEARCHING
 * ============================================================
 *
 * Filtering:
 *
 *
 *     ?role=developer
 *
 *
 * Searching:
 *
 *
 *     ?search=shiva
 *
 *
 * These are related but different concepts.
 *
 *
 * Filtering usually checks structured fields.
 *
 *
 * Searching looks for text matches.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. ARRAY FILTER
 * ============================================================
 *
 * Request:
 *
 *
 *     ?role=admin,developer
 *
 *
 * Convert:
 *
 *
 *     "admin,developer"
 *
 *
 * into:
 *
 *
 *     [
 *       "admin",
 *       "developer"
 *     ]
 *
 *
 * Then:
 *
 *
 *     {
 *       role: {
 *         $in: [
 *           "admin",
 *           "developer"
 *         ]
 *       }
 *     }
 *
 * ============================================================
 */

function parseCsv(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/*
 * ============================================================
 * 29. CSV EXAMPLE
 * ============================================================
 */

const roles = parseCsv("admin, developer, manager");

console.log(roles);

/*
 * Output:
 *
 *
 * [
 *   "admin",
 *   "developer",
 *   "manager"
 * ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. DATE FILTERING
 * ============================================================
 *
 * Dates should be converted into actual Date values before
 * sending them to MongoDB.
 *
 *
 * Example:
 *
 *
 *     ?createdAt[gte]=2026-01-01
 *
 *
 * MongoDB:
 *
 *
 * {
 *   createdAt: {
 *     $gte: new Date("2026-01-01")
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. NULL FILTERING
 * ============================================================
 *
 * MongoDB supports:
 *
 *
 *     {
 *       field: null
 *     }
 *
 *
 * But null semantics require care because MongoDB matching
 * behavior includes missing fields in some query forms.
 *
 *
 * Define your API semantics explicitly.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. NESTED FIELDS
 * ============================================================
 *
 * MongoDB supports nested paths.
 *
 *
 * Example:
 *
 *
 *     {
 *       "address.city":
 *         "Guntur"
 *     }
 *
 *
 * HTTP:
 *
 *
 *     ?address.city=Guntur
 *
 *
 * However, don't allow arbitrary paths without validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. COMPLETE FILTER BUILDER
 * ============================================================
 */

function buildMongoFilter(query) {
  const filter = {};

  /*
   * ----------------------------------------------------------
   * ROLE
   * ----------------------------------------------------------
   */

  if (query.role !== undefined) {
    const roles = parseCsv(query.role);

    if (roles.length === 1) {
      filter.role = roles[0];
    } else if (roles.length > 1) {
      filter.role = {
        $in: roles,
      };
    }
  }

  /*
   * ----------------------------------------------------------
   * CITY
   * ----------------------------------------------------------
   */

  if (query.city !== undefined) {
    filter.city = query.city;
  }

  /*
   * ----------------------------------------------------------
   * ACTIVE
   * ----------------------------------------------------------
   */

  if (query.active !== undefined) {
    filter.active = parseBoolean(query.active);
  }

  /*
   * ----------------------------------------------------------
   * AGE
   * ----------------------------------------------------------
   */

  if (query.age !== undefined) {
    /*
     * Simple:
     *
     * ?age=25
     */

    if (typeof query.age === "string") {
      const age = Number(query.age);

      if (!Number.isInteger(age)) {
        throw new Error("Invalid age");
      }

      filter.age = age;
    }

    /*
     * Operators:
     *
     * ?age[gte]=20
     * ?age[lte]=30
     */

    if (typeof query.age === "object") {
      const ageFilter = buildAgeFilter(query);

      if (ageFilter) {
        filter.age = ageFilter;
      }
    }
  }

  return filter;
}

/*
 * ============================================================
 * 34. EXAMPLE FILTER
 * ============================================================
 *
 * Request:
 *
 *
 *     GET /users
 *       ?role=developer
 *       &active=true
 *       &age[gte]=20
 *       &age[lte]=30
 *
 *
 * Result:
 *
 *
 * {
 *   role: "developer",
 *
 *   active: true,
 *
 *   age: {
 *     $gte: 20,
 *     $lte: 30
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. MONGOOSE
 * ============================================================
 *
 * Then:
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
 * ============================================================
 */

/*
 * ============================================================
 * 36. FILTER + PAGINATION QUERY
 * ============================================================
 *
 * Production-style example:
 *
 *
 *     const filter =
 *       buildMongoFilter(
 *         req.query,
 *       );
 *
 *
 *     const data =
 *       await User.find(filter)
 *         .sort({
 *           createdAt: -1,
 *           _id: -1,
 *         })
 *         .skip(offset)
 *         .limit(limit)
 *         .lean();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. COUNT THE FILTERED RESULTS
 * ============================================================
 *
 * Important:
 *
 *
 *     countDocuments()
 *
 *
 * must use the SAME filter.
 *
 *
 * Example:
 *
 *
 *     const total =
 *       await User.countDocuments(
 *         filter,
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. COMPLETE QUERY PIPELINE
 * ============================================================
 *
 *
 * req.query
 *     ↓
 * parse
 *     ↓
 * validate
 *     ↓
 * whitelist
 *     ↓
 * build MongoDB filter
 *     ↓
 * sort
 *     ↓
 * skip
 *     ↓
 * limit
 *     ↓
 * response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. FILTERING IS NOT AUTHORIZATION
 * ============================================================
 *
 * This is extremely important.
 *
 *
 * Client says:
 *
 *
 *     ?userId=123
 *
 *
 * That does NOT mean the client is allowed to access user 123.
 *
 *
 * Authorization must determine what records the user is allowed
 * to access.
 *
 *
 * Then filtering can narrow those authorized records further.
 *
 *
 * Correct:
 *
 *
 *     authentication
 *          ↓
 *     authorization scope
 *          ↓
 *     client filters
 *          ↓
 *     database query
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. DON'T EXPOSE SENSITIVE FIELDS
 * ============================================================
 *
 * Even when filtering is allowed, the response should not
 * automatically return sensitive database fields.
 *
 *
 * Example:
 *
 *
 *     passwordHash
 *     refreshToken
 *     internalSecrets
 *
 *
 * should not be exposed simply because they exist in MongoDB.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. FILTERING WITH PROJECTION
 * ============================================================
 *
 * Mongoose:
 *
 *
 *     User.find(filter)
 *       .select(
 *         "name email role",
 *       )
 *
 *
 * This controls which fields are returned.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. FILTER VALIDATION
 * ============================================================
 *
 * Validate:
 *
 *
 *     types
 *     ranges
 *     allowed fields
 *     allowed operators
 *     maximum array size
 *     maximum query complexity
 *
 *
 * Never assume query parameters are safe merely because they
 * came through Express.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. QUERY EXAMPLE
 * ============================================================
 *
 * Request:
 *
 *
 *     GET /users
 *
 *       ?role=developer
 *       &city=Guntur
 *       &active=true
 *
 *
 * Filter:
 *
 *
 * {
 *   role: "developer",
 *   city: "Guntur",
 *   active: true
 * }
 *
 *
 * Database:
 *
 *
 *     User.find(filter)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. RANGE EXAMPLE
 * ============================================================
 *
 * Request:
 *
 *
 *     GET /users
 *
 *       ?age[gte]=20
 *       &age[lt]=30
 *
 *
 * Filter:
 *
 *
 * {
 *   age: {
 *     $gte: 20,
 *     $lt: 30
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. MULTIPLE OPERATORS
 * ============================================================
 *
 * Example:
 *
 *
 *     ?age[gte]=20
 *     &age[lte]=30
 *
 *
 * becomes:
 *
 *
 * {
 *   age: {
 *     $gte: 20,
 *     $lte: 30
 *   }
 * }
 *
 *
 * This represents:
 *
 *
 *     20 <= age <= 30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. COMMON OPERATORS
 * ============================================================
 *
 *
 * $eq
 *     equals
 *
 *
 * $ne
 *     not equal
 *
 *
 * $gt
 *     greater than
 *
 *
 * $gte
 *     greater than or equal
 *
 *
 * $lt
 *     less than
 *
 *
 * $lte
 *     less than or equal
 *
 *
 * $in
 *     matches one of the values
 *
 *
 * $nin
 *     matches none of the values
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. AND LOGIC
 * ============================================================
 *
 * MongoDB object fields normally behave like AND conditions.
 *
 *
 * {
 *   role: "developer",
 *   active: true
 * }
 *
 *
 * means:
 *
 *
 *     role = developer
 *
 *     AND
 *
 *     active = true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. OR LOGIC
 * ============================================================
 *
 * MongoDB:
 *
 *
 * {
 *   $or: [
 *
 *     {
 *       role: "admin"
 *     },
 *
 *     {
 *       role: "manager"
 *     }
 *
 *   ]
 * }
 *
 *
 * means:
 *
 *
 *     role = admin
 *
 *     OR
 *
 *     role = manager
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. API DESIGN FOR OR
 * ============================================================
 *
 * One possible API:
 *
 *
 *     ?role=admin,manager
 *
 *
 * interpreted as:
 *
 *
 *     role IN [
 *       admin,
 *       manager
 *     ]
 *
 *
 * This is often simpler than exposing arbitrary $or syntax.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. DON'T EXPOSE RAW MONGODB OPERATORS
 * ============================================================
 *
 * Avoid an API where clients can directly send arbitrary:
 *
 *
 *     $where
 *     $expr
 *     $function
 *
 *
 * or arbitrary MongoDB query objects.
 *
 *
 * Instead create a controlled API vocabulary.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * Client:
 *
 *     GET /users
 *       ?role=developer
 *       &active=true
 *       &age[gte]=20
 *
 *             ↓
 *
 * Express:
 *
 *     req.query
 *
 *             ↓
 *
 * Validate
 *
 *             ↓
 *
 * Whitelist
 *
 *             ↓
 *
 * Convert types
 *
 *             ↓
 *
 * Build filter
 *
 *             ↓
 *
 * MongoDB:
 *
 *     User.find({
 *
 *       role: "developer",
 *
 *       active: true,
 *
 *       age: {
 *         $gte: 20
 *       }
 *
 *     })
 *
 *             ↓
 *
 *     results
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/filtering/operators.js
 *
 * We will go deeper into:
 *
 *     $eq
 *     $ne
 *     $gt
 *     $gte
 *     $lt
 *     $lte
 *     $in
 *     $nin
 *     $and
 *     $or
 *     $exists
 *     $regex
 *     nested filters
 *     safe operator whitelisting
 *
 * ============================================================
 */
