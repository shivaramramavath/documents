/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     19_rest_api/filtering/multiple_filters.js
 *
 * Topic:
 *     Multiple Filters — AND / OR
 *
 * ============================================================
 *
 * Multiple filters allow clients to combine conditions.
 *
 * Example:
 *
 *     GET /users?role=student&active=true
 *
 * Means:
 *
 *     role = student
 *     AND
 *     active = true
 *
 *
 * OR conditions can be represented separately:
 *
 *     role = student
 *     OR
 *     role = developer
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
    salary: 25000,
  },

  {
    id: 2,
    name: "Ravi",
    age: 25,
    role: "developer",
    department: "IT",
    active: true,
    city: "Hyderabad",
    salary: 60000,
  },

  {
    id: 3,
    name: "Anil",
    age: 20,
    role: "student",
    department: "ECE",
    active: false,
    city: "Vijayawada",
    salary: 18000,
  },

  {
    id: 4,
    name: "Priya",
    age: 23,
    role: "developer",
    department: "CSE",
    active: true,
    city: "Guntur",
    salary: 75000,
  },

  {
    id: 5,
    name: "Kiran",
    age: 35,
    role: "admin",
    department: "CSE",
    active: true,
    city: "Bangalore",
    salary: 100000,
  },

  {
    id: 6,
    name: "Rahul",
    age: 22,
    role: "student",
    department: "CSE",
    active: true,
    city: "Guntur",
    salary: 30000,
  },
];

/*
 * ============================================================
 * 1. WHAT IS A MULTIPLE FILTER?
 * ============================================================
 *
 * A multiple filter applies more than one condition.
 *
 *
 * Example:
 *
 *     role = student
 *     active = true
 *
 *
 * A user must satisfy BOTH conditions.
 *
 *
 * Mathematically:
 *
 *
 *     conditionA AND conditionB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. BASIC AND
 * ============================================================
 *
 * Request:
 *
 *     GET /users/and?role=student&active=true
 *
 *
 * Expected:
 *
 *     role === "student"
 *
 *     AND
 *
 *     active === true
 *
 * ============================================================
 */

app.get("/users/and", (req, res) => {
  const { role, active } = req.query;

  let result = users;

  /*
   * --------------------------------------------------------
   * ROLE FILTER
   * --------------------------------------------------------
   */

  if (typeof role === "string") {
    result = result.filter((user) => user.role === role);
  }

  /*
   * --------------------------------------------------------
   * ACTIVE FILTER
   * --------------------------------------------------------
   */

  if (typeof active === "string") {
    if (active !== "true" && active !== "false") {
      return res.status(400).json({
        error: {
          code: "INVALID_ACTIVE",

          message: "active must be true or false",
        },
      });
    }

    const activeValue = active === "true";

    result = result.filter((user) => user.active === activeValue);
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 3. HOW AND WORKS
 * ============================================================
 *
 *
 * users
 *   │
 *   ↓
 * role = student
 *   │
 *   ↓
 * active = true
 *   │
 *   ↓
 * final result
 *
 *
 * Example:
 *
 *
 *     Shiva
 *       ✓ student
 *       ✓ active
 *
 *
 *     Anil
 *       ✓ student
 *       ✗ active
 *
 *
 *     Rahul
 *       ✓ student
 *       ✓ active
 *
 *
 * Result:
 *
 *     Shiva
 *     Rahul
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. MULTIPLE FIELD FILTER
 * ============================================================
 *
 * Example:
 *
 *     GET /users/filters
 *       ?role=student
 *       &department=CSE
 *       &active=true
 *
 *
 * Means:
 *
 *
 *     role = student
 *
 *     AND
 *
 *     department = CSE
 *
 *     AND
 *
 *     active = true
 *
 * ============================================================
 */

app.get("/users/filters", (req, res) => {
  const { role, department, active, city } = req.query;

  let result = users;

  /*
   * ROLE
   */

  if (typeof role === "string") {
    result = result.filter((user) => user.role === role);
  }

  /*
   * DEPARTMENT
   */

  if (typeof department === "string") {
    result = result.filter((user) => user.department === department);
  }

  /*
   * ACTIVE
   */

  if (typeof active === "string") {
    if (active !== "true" && active !== "false") {
      return res.status(400).json({
        error: {
          code: "INVALID_ACTIVE",

          message: "active must be true or false",
        },
      });
    }

    const activeValue = active === "true";

    result = result.filter((user) => user.active === activeValue);
  }

  /*
   * CITY
   */

  if (typeof city === "string") {
    result = result.filter((user) => user.city === city);
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 5. AND USING Array.every()
 * ============================================================
 *
 * Instead of repeatedly calling filter(), we can create a
 * collection of predicates.
 *
 *
 * Example:
 *
 *
 *     [
 *       condition1,
 *       condition2,
 *       condition3
 *     ]
 *
 *
 * Then:
 *
 *
 *     conditions.every(...)
 *
 *
 * means every condition must be true.
 *
 * ============================================================
 */

function matchesAll(user, conditions) {
  return conditions.every((condition) => condition(user));
}

/*
 * ============================================================
 * 6. GENERIC AND FILTER
 * ============================================================
 */

app.get("/users/generic-and", (req, res) => {
  const { role, department, city } = req.query;

  const conditions = [];

  /*
   * Add role condition.
   */

  if (typeof role === "string") {
    conditions.push((user) => user.role === role);
  }

  /*
   * Add department condition.
   */

  if (typeof department === "string") {
    conditions.push((user) => user.department === department);
  }

  /*
   * Add city condition.
   */

  if (typeof city === "string") {
    conditions.push((user) => user.city === city);
  }

  /*
   * Every condition must pass.
   */

  const result = users.filter((user) => matchesAll(user, conditions));

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 7. OR LOGIC
 * ============================================================
 *
 * OR means:
 *
 *
 *     conditionA
 *
 *     OR
 *
 *     conditionB
 *
 *
 * Only one condition needs to be true.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Array.some()
 * ============================================================
 *
 * JavaScript:
 *
 *
 *     conditions.some(...)
 *
 *
 * means:
 *
 *
 *     At least ONE condition must be true.
 *
 * ============================================================
 */

function matchesAny(user, conditions) {
  return conditions.some((condition) => condition(user));
}

/*
 * ============================================================
 * 9. SIMPLE OR EXAMPLE
 * ============================================================
 *
 * Request:
 *
 *     GET /users/or?role=student,developer
 *
 *
 * Means:
 *
 *     role = student
 *
 *     OR
 *
 *     role = developer
 *
 * ============================================================
 */

app.get("/users/or", (req, res) => {
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
 * 10. OR USING PREDICATES
 * ============================================================
 *
 * Example:
 *
 *
 *     student
 *
 *     OR
 *
 *     developer
 *
 * ============================================================
 */

app.get("/users/generic-or", (req, res) => {
  const conditions = [
    (user) => user.role === "student",

    (user) => user.role === "developer",
  ];

  const result = users.filter((user) => matchesAny(user, conditions));

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 11. AND + OR TOGETHER
 * ============================================================
 *
 * Real applications often need expressions such as:
 *
 *
 *     active = true
 *
 *     AND
 *
 *     (
 *       role = student
 *       OR
 *       role = developer
 *     )
 *
 *
 * This is:
 *
 *
 *     active
 *
 *     AND
 *
 *     (student OR developer)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. BUILD CONDITION
 * ============================================================
 */

const activeCondition = (user) => user.active === true;

const studentCondition = (user) => user.role === "student";

const developerCondition = (user) => user.role === "developer";

const studentOrDeveloper = (user) =>
  matchesAny(user, [studentCondition, developerCondition]);

const activeAndStudentOrDeveloper = (user) =>
  matchesAll(user, [activeCondition, studentOrDeveloper]);

/*
 * ============================================================
 * 13. ENDPOINT
 * ============================================================
 */

app.get("/users/and-or", (req, res) => {
  const result = users.filter(activeAndStudentOrDeveloper);

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 14. UNDERSTANDING THE LOGIC
 * ============================================================
 *
 *
 *               active?
 *                  │
 *            ┌─────┴─────┐
 *            │           │
 *           NO          YES
 *            │           │
 *          reject    student OR developer?
 *                        │
 *                  ┌─────┴─────┐
 *                  │           │
 *                 YES          NO
 *                  │           │
 *               accept       reject
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. RANGE + ROLE
 * ============================================================
 *
 * Example:
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
 *     (
 *       role = student
 *       OR
 *       role = developer
 *     )
 *
 * ============================================================
 */

app.get("/users/advanced", (req, res) => {
  const result = users.filter((user) => {
    /*
     * Age condition.
     */

    const validAge = user.age >= 18 && user.age <= 30;

    /*
     * OR condition.
     */

    const validRole = user.role === "student" || user.role === "developer";

    /*
     * Final AND.
     */

    return validAge && validRole;
  });

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 16. JAVASCRIPT LOGICAL OPERATORS
 * ============================================================
 *
 *
 * AND:
 *
 *     &&
 *
 *
 * OR:
 *
 *     ||
 *
 *
 * NOT:
 *
 *     !
 *
 *
 * Example:
 *
 *
 *     user.active &&
 *     user.role === "student"
 *
 *
 * means:
 *
 *     active AND student
 *
 *
 *
 *     user.role === "student" ||
 *     user.role === "developer"
 *
 *
 * means:
 *
 *     student OR developer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. FILTERING WITH req.query
 * ============================================================
 *
 * Example:
 *
 *
 *     GET /users/advanced
 *       ?minAge=18
 *       &maxAge=30
 *       &active=true
 *
 *
 * Convert query values first.
 * ============================================================
 */

app.get("/users/query-expression", (req, res) => {
  const { minAge, maxAge, active } = req.query;

  let result = users;

  /*
   * --------------------------------------------------------
   * MIN AGE
   * --------------------------------------------------------
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
   * --------------------------------------------------------
   * MAX AGE
   * --------------------------------------------------------
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

  /*
   * --------------------------------------------------------
   * ACTIVE
   * --------------------------------------------------------
   */

  if (typeof active === "string") {
    if (active !== "true" && active !== "false") {
      return res.status(400).json({
        error: {
          code: "INVALID_ACTIVE",

          message: "active must be true or false",
        },
      });
    }

    const activeValue = active === "true";

    result = result.filter((user) => user.active === activeValue);
  }

  return res.status(200).json({
    data: result,
  });
});

/*
 * ============================================================
 * 18. MULTIPLE FILTERS IN MONGODB
 * ============================================================
 *
 * MongoDB naturally supports AND conditions.
 *
 *
 * Example:
 *
 *
 *     User.find({
 *       active: true,
 *       role: "student",
 *     });
 *
 *
 * This means:
 *
 *
 *     active = true
 *
 *     AND
 *
 *     role = student
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. MONGODB OR
 * ============================================================
 *
 * MongoDB uses:
 *
 *
 *     $or
 *
 *
 * Example:
 *
 *
 *     User.find({
 *       $or: [
 *         {
 *           role: "student",
 *         },
 *         {
 *           role: "developer",
 *         },
 *       ],
 *     });
 *
 *
 * Meaning:
 *
 *
 *     role = student
 *
 *     OR
 *
 *     role = developer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. MONGODB AND + OR
 * ============================================================
 *
 * Example:
 *
 *
 *     User.find({
 *
 *       active: true,
 *
 *       $or: [
 *         {
 *           role: "student",
 *         },
 *         {
 *           role: "developer",
 *         },
 *       ],
 *
 *     });
 *
 *
 * Meaning:
 *
 *
 *     active = true
 *
 *     AND
 *
 *     (
 *       role = student
 *       OR
 *       role = developer
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. MONGODB RANGE + OR
 * ============================================================
 *
 * Example:
 *
 *
 *     User.find({
 *
 *       age: {
 *         $gte: 18,
 *         $lte: 30,
 *       },
 *
 *       $or: [
 *
 *         {
 *           role: "student",
 *         },
 *
 *         {
 *           role: "developer",
 *         },
 *
 *       ],
 *
 *     });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. FILTER OBJECT
 * ============================================================
 *
 * A clean application architecture builds a filter object
 * before calling the database.
 *
 *
 * Example:
 *
 *
 *     const filter = {
 *
 *       active: true,
 *
 *       age: {
 *         $gte: 18,
 *         $lte: 30,
 *       },
 *
 *       $or: [
 *         {
 *           role: "student",
 *         },
 *         {
 *           role: "developer",
 *         },
 *       ],
 *
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CONTROLLER → SERVICE
 * ============================================================
 *
 *
 * Controller:
 *
 *     reads req.query
 *
 *
 * Service:
 *
 *     validates and builds filter
 *
 *
 * Repository:
 *
 *     executes User.find(filter)
 *
 *
 * This keeps HTTP concerns separate from database concerns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. DO NOT BUILD QUERIES LIKE THIS
 * ============================================================
 *
 *
 * const filter = req.query;
 *
 * User.find(filter);
 *
 *
 * This gives the client too much control.
 *
 *
 * Instead:
 *
 *
 * req.query
 *    ↓
 * validated query
 *    ↓
 * allowed fields
 *    ↓
 * allowed operators
 *    ↓
 * safe filter
 *    ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. FILTER PRECEDENCE
 * ============================================================
 *
 * Be careful with:
 *
 *
 *     A && B || C
 *
 *
 * JavaScript evaluates:
 *
 *
 *     (A && B) || C
 *
 *
 * If you mean:
 *
 *
 *     A && (B || C)
 *
 *
 * use parentheses.
 *
 *
 * Good:
 *
 *
 *     active &&
 *     (
 *       student ||
 *       developer
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. NESTED LOGIC
 * ============================================================
 *
 * Complex search systems may need:
 *
 *
 *     A
 *     AND
 *     (
 *       B
 *       OR
 *       (
 *         C
 *         AND
 *         D
 *       )
 *     )
 *
 *
 * This is essentially a boolean expression tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. BOOLEAN EXPRESSION TREE
 * ============================================================
 *
 *
 *              AND
 *             /   \
 *            A     OR
 *                 /  \
 *                B    AND
 *                    /   \
 *                   C     D
 *
 *
 * This model becomes useful for advanced search/filter
 * builders.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. SIMPLE API DESIGN
 * ============================================================
 *
 * Prefer simple filters for common use cases:
 *
 *
 *     ?role=student
 *
 *     ?active=true
 *
 *     ?department=CSE
 *
 *
 * Then support advanced operators when necessary:
 *
 *
 *     ?age[gte]=18
 *     &age[lte]=30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. FILTER + SORT + PAGINATION
 * ============================================================
 *
 * Production collection endpoint:
 *
 *
 *     GET /api/v1/users
 *
 *       ?active=true
 *       &age[gte]=18
 *       &age[lte]=30
 *       &role[in]=student,developer
 *       &sort=age
 *       &order=desc
 *       &page=1
 *       &limit=20
 *
 *
 * Processing order:
 *
 *
 *     1. Parse
 *     2. Validate
 *     3. Build filters
 *     4. Query database
 *     5. Sort
 *     6. Paginate
 *     7. Return response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. PERFORMANCE
 * ============================================================
 *
 * Filtering in JavaScript:
 *
 *
 *     users.filter(...)
 *
 *
 * is acceptable for learning or small in-memory datasets.
 *
 *
 * For real applications:
 *
 *
 *     Database should perform filtering.
 *
 *
 * Instead of:
 *
 *
 *     SELECT/find everything
 *          ↓
 *     application filters everything
 *
 *
 * prefer:
 *
 *
 *     database filters
 *          ↓
 *     application receives only needed data
 *
 *
 * This reduces:
 *
 *     network transfer
 *     memory usage
 *     CPU usage
 *     latency
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. DATABASE INDEXES
 * ============================================================
 *
 * If filters are frequently used:
 *
 *
 *     active
 *     role
 *     department
 *
 *
 * appropriate indexes may improve query performance.
 *
 *
 * But do not blindly create indexes for every field.
 *
 * Indexes have:
 *
 *     storage cost
 *     write cost
 *     maintenance cost
 *
 * Index based on real query patterns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. SECURITY
 * ============================================================
 *
 * Multiple-filter APIs must still enforce:
 *
 *
 *     field allowlist
 *     operator allowlist
 *     type validation
 *     maximum filter complexity
 *     maximum list size
 *
 *
 * Never allow arbitrary database expressions from clients.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * AND
 *
 *     ALL conditions must pass.
 *
 *
 * JavaScript:
 *
 *     every()
 *
 *
 * MongoDB:
 *
 *     normal fields
 *     $and
 *
 *
 * ------------------------------------------------------------
 *
 * OR
 *
 *     AT LEAST ONE condition must pass.
 *
 *
 * JavaScript:
 *
 *     some()
 *
 *
 * MongoDB:
 *
 *     $or
 *
 *
 * ------------------------------------------------------------
 *
 * NOT
 *
 *     condition must NOT pass.
 *
 *
 * JavaScript:
 *
 *     !
 *
 *
 * MongoDB:
 *
 *     $ne
 *     $nin
 *     $not
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/pagination/
 *
 * We will learn:
 *
 *     page
 *     limit
 *     skip
 *     offset
 *     metadata
 *     total count
 *     MongoDB pagination
 *     cursor pagination
 *
 * ============================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
