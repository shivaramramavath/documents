/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     09_sorting.js
 *
 * Topic:
 *     Mongoose Sorting
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Ascending sort
 *     2. Descending sort
 *     3. Multiple-field sorting
 *     4. String syntax
 *     5. Sort + filter
 *     6. Sort + projection
 *     7. Sort + pagination
 *     8. Dynamic sorting
 *     9. Sort field whitelist
 *    10. Stable sorting
 *    11. _id as tie-breaker
 *    12. Sorting nested fields
 *    13. Sorting dates
 *    14. Sorting numbers
 *    15. Sorting strings
 *    16. Sorting null/missing fields
 *    17. Query inspection
 *    18. Production API pattern
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

/*
 * ============================================================
 * 1. ENVIRONMENT
 * ============================================================
 */

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/*
 * ============================================================
 * 2. SCHEMA
 * ============================================================
 */

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      lowercase: true,

      trim: true,
    },

    age: {
      type: Number,
    },

    department: {
      type: String,
    },

    semester: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },

    active: {
      type: Boolean,

      default: true,
    },

    address: {
      city: String,

      state: String,
    },
  },

  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 3. MODEL
 * ============================================================
 */

const Student =
  mongoose.models.SortStudent || mongoose.model("SortStudent", studentSchema);

/*
 * ============================================================
 * BASIC SORTING
 * ============================================================
 */

/*
 * ============================================================
 * 4. ASCENDING SORT
 * ============================================================
 *
 * 1 means ascending.
 *
 * Numbers:
 *
 *     10
 *     20
 *     30
 *
 * Strings:
 *
 *     Alice
 *     Bob
 *     Charlie
 *
 * ============================================================
 */

async function sortAscending() {
  return Student.find()

    .sort({
      age: 1,
    })

    .exec();
}

/*
 * ============================================================
 * 5. DESCENDING SORT
 * ============================================================
 *
 * -1 means descending.
 *
 * ============================================================
 */

async function sortDescending() {
  return Student.find()

    .sort({
      age: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 6. SORT BY CGPA DESCENDING
 * ============================================================
 */

async function highestCGPAFirst() {
  return Student.find()

    .sort({
      cgpa: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 7. SORT BY NAME ASCENDING
 * ============================================================
 */

async function sortByName() {
  return Student.find()

    .sort({
      name: 1,
    })

    .exec();
}

/*
 * ============================================================
 * 8. STRING SORT SYNTAX
 * ============================================================
 *
 * Mongoose also supports:
 *
 *     .sort("name")
 *
 * ascending.
 *
 *     .sort("-name")
 *
 * descending.
 *
 * ============================================================
 */

async function stringSortAscending() {
  return Student.find()

    .sort("name")

    .exec();
}

async function stringSortDescending() {
  return Student.find()

    .sort("-name")

    .exec();
}

/*
 * ============================================================
 * MULTIPLE FIELD SORTING
 * ============================================================
 */

/*
 * ============================================================
 * 9. SORT BY DEPARTMENT THEN CGPA
 * ============================================================
 */

async function sortDepartmentThenCGPA() {
  return Student.find()

    .sort({
      department: 1,

      cgpa: -1,
    })

    .exec();
}

/*
 * This means:
 *
 *     1. Department ascending
 *
 *     2. Inside each department:
 *        CGPA descending
 *
 *
 * Example:
 *
 *     CSE  9.2
 *     CSE  8.7
 *     CSE  7.9
 *     ECE  9.5
 *     ECE  8.8
 *     ECE  7.6
 *
 */

/*
 * ============================================================
 * 10. MULTIPLE SORT FIELDS
 * ============================================================
 */

async function multiFieldSort() {
  return Student.find()

    .sort({
      department: 1,

      semester: 1,

      cgpa: -1,

      name: 1,
    })

    .exec();
}

/*
 * ============================================================
 * 11. SORT PRIORITY
 * ============================================================
 *
 * MongoDB evaluates sort fields in the order supplied.
 *
 *     department
 *          ↓
 *     semester
 *          ↓
 *     cgpa
 *          ↓
 *     name
 *
 * ============================================================
 */

/*
 * ============================================================
 * FILTER + SORT
 * ============================================================
 */

async function activeStudentsSorted() {
  return Student.find({
    active: true,
  })

    .sort({
      cgpa: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 12. FILTER + SORT + PROJECTION
 * ============================================================
 */

async function filteredSortedProjected() {
  return Student.find({
    active: true,

    department: "CSE",
  })

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      _id: 1,
    })

    .sort({
      cgpa: -1,
    })

    .exec();
}

/*
 * ============================================================
 * SORT + LIMIT
 * ============================================================
 */

/*
 * ============================================================
 * 13. TOP 10 STUDENTS
 * ============================================================
 */

async function topTenStudents() {
  return Student.find()

    .sort({
      cgpa: -1,
    })

    .limit(10)

    .exec();
}

/*
 * ============================================================
 * SORT + SKIP + LIMIT
 * ============================================================
 */

/*
 * ============================================================
 * 14. PAGINATED SORT
 * ============================================================
 */

async function sortedPage({
  page = 1,

  limit = 20,
}) {
  const skip = (page - 1) * limit;

  return Student.find()

    .sort({
      cgpa: -1,
    })

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * 15. STABLE PAGINATION SORT
 * ============================================================
 *
 * IMPORTANT.
 *
 * Suppose many students have:
 *
 *     cgpa = 8.5
 *
 * Sorting only:
 *
 *     { cgpa: -1 }
 *
 * does not give you a useful deterministic tie-breaker.
 *
 * Add _id:
 *
 *     { cgpa: -1, _id: 1 }
 *
 * ============================================================
 */

async function stablePaginationSort({
  page = 1,

  limit = 20,
}) {
  const skip = (page - 1) * limit;

  return Student.find({
    active: true,
  })

    .sort({
      cgpa: -1,

      _id: 1,
    })

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * WHY _id?
 * ============================================================
 *
 * Imagine:
 *
 *     Student A -> CGPA 9.0
 *     Student B -> CGPA 9.0
 *     Student C -> CGPA 8.5
 *
 * Sort:
 *
 *     { cgpa: -1 }
 *
 * A and B have the same sort value.
 *
 * Adding:
 *
 *     { cgpa: -1, _id: 1 }
 *
 * creates a deterministic ordering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SORTING DATES
 * ============================================================
 */

/*
 * ============================================================
 * 16. NEWEST FIRST
 * ============================================================
 */

async function newestStudentsFirst() {
  return Student.find()

    .sort({
      createdAt: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 17. OLDEST FIRST
 * ============================================================
 */

async function oldestStudentsFirst() {
  return Student.find()

    .sort({
      createdAt: 1,
    })

    .exec();
}

/*
 * ============================================================
 * SORTING STRINGS
 * ============================================================
 */

/*
 * ============================================================
 * 18. ALPHABETICAL ORDER
 * ============================================================
 */

async function alphabeticalStudents() {
  return Student.find()

    .sort({
      name: 1,
    })

    .exec();
}

/*
 * ============================================================
 * 19. REVERSE ALPHABETICAL
 * ============================================================
 */

async function reverseAlphabeticalStudents() {
  return Student.find()

    .sort({
      name: -1,
    })

    .exec();
}

/*
 * ============================================================
 * SORTING NESTED FIELDS
 * ============================================================
 */

/*
 * ============================================================
 * 20. SORT BY CITY
 * ============================================================
 */

async function sortByCity() {
  return Student.find()

    .sort({
      "address.city": 1,
    })

    .exec();
}

/*
 * ============================================================
 * 21. DYNAMIC SORTING
 * ============================================================
 *
 * Imagine the API:
 *
 *     GET /students?sort=cgpa
 *
 * or:
 *
 *     GET /students?sort=-cgpa
 *
 *
 * Client controls the direction.
 *
 * But NEVER blindly trust arbitrary sort fields.
 *
 * ============================================================
 */

async function dynamicSort(sort) {
  return Student.find()

    .sort(sort)

    .exec();
}

/*
 * Example:
 *
 *     dynamicSort({
 *       cgpa: -1
 *     });
 *
 */

/*
 * ============================================================
 * 22. SAFE SORT FIELD WHITELIST
 * ============================================================
 *
 * Production applications should whitelist fields.
 *
 * ============================================================
 */

const ALLOWED_SORT_FIELDS = {
  name: "name",

  age: "age",

  cgpa: "cgpa",

  semester: "semester",

  department: "department",

  createdAt: "createdAt",
};

/*
 * ============================================================
 * 23. BUILD SAFE SORT
 * ============================================================
 */

function buildSort(sortBy = "createdAt", sortOrder = "desc") {
  const field = ALLOWED_SORT_FIELDS[sortBy];

  if (!field) {
    throw new Error(`Invalid sort field: ${sortBy}`);
  }

  const direction = sortOrder === "asc" ? 1 : sortOrder === "desc" ? -1 : null;

  if (direction === null) {
    throw new Error(`Invalid sort order: ${sortOrder}`);
  }

  return {
    [field]: direction,
  };
}

/*
 * ============================================================
 * 24. SAFE DYNAMIC SORT
 * ============================================================
 */

async function safelySortedStudents({
  sortBy = "createdAt",

  sortOrder = "desc",
}) {
  const sort = buildSort(sortBy, sortOrder);

  return Student.find({
    active: true,
  })

    .sort(sort)

    .exec();
}

/*
 * ============================================================
 * 25. SAFE SORT WITH TIE-BREAKER
 * ============================================================
 */

function buildStableSort({
  sortBy = "createdAt",

  sortOrder = "desc",
}) {
  const sort = buildSort(sortBy, sortOrder);

  /*
   * Add deterministic tie-breaker.
   *
   * If the requested field is not _id, use _id as the
   * secondary sort.
   */

  if (!sort._id) {
    sort._id = 1;
  }

  return sort;
}

/*
 * ============================================================
 * 26. STABLE DYNAMIC SORT
 * ============================================================
 */

async function stableDynamicSort({
  sortBy = "cgpa",

  sortOrder = "desc",
}) {
  const sort = buildStableSort({
    sortBy,

    sortOrder,
  });

  return Student.find({
    active: true,
  })

    .sort(sort)

    .exec();
}

/*
 * ============================================================
 * 27. API SORT PARSER
 * ============================================================
 *
 * Common API format:
 *
 *     ?sort=-cgpa
 *
 *     ?sort=name
 *
 *     ?sort=-cgpa,name
 *
 *
 * Meaning:
 *
 *     -cgpa -> descending
 *     name  -> ascending
 *
 * ============================================================
 */

function parseSort(sortQuery) {
  if (!sortQuery) {
    return {
      createdAt: -1,

      _id: 1,
    };
  }

  const fields = sortQuery
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  const sort = {};

  for (const field of fields) {
    const descending = field.startsWith("-");

    const fieldName = descending ? field.slice(1) : field;

    const allowedField = ALLOWED_SORT_FIELDS[fieldName];

    if (!allowedField) {
      throw new Error(`Invalid sort field: ${fieldName}`);
    }

    sort[allowedField] = descending ? -1 : 1;
  }

  /*
   * Always provide a deterministic tie-breaker.
   */

  if (sort._id === undefined) {
    sort._id = 1;
  }

  return sort;
}

/*
 * ============================================================
 * 28. MULTI-SORT API
 * ============================================================
 */

async function apiSortedStudents(sortQuery) {
  const sort = parseSort(sortQuery);

  return Student.find({
    active: true,
  })

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      createdAt: 1,

      _id: 1,
    })

    .sort(sort)

    .lean()

    .exec();
}

/*
 * ============================================================
 * 29. SORT + SEARCH + PAGINATION
 * ============================================================
 *
 * This represents a realistic API query.
 *
 * ============================================================
 */

async function searchAndSortStudents({
  search,

  department,

  page = 1,

  limit = 20,

  sort = "-cgpa",
}) {
  const filter = {
    active: true,
  };

  /*
   * Search
   */

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  /*
   * Department
   */

  if (department) {
    filter.department = department;
  }

  /*
   * Pagination
   */

  const skip = (page - 1) * limit;

  /*
   * Sort
   */

  const sortObject = parseSort(sort);

  return Student.find(filter)

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      _id: 1,
    })

    .sort(sortObject)

    .skip(skip)

    .limit(limit)

    .lean()

    .exec();
}

/*
 * ============================================================
 * 30. QUERY INSPECTION
 * ============================================================
 */

function inspectSortQuery() {
  const query = Student.find({
    active: true,
  })

    .sort({
      cgpa: -1,

      name: 1,

      _id: 1,
    });

  console.log("Filter:", query.getFilter());

  console.log("Options:", query.getOptions());

  return query;
}

/*
 * ============================================================
 * 31. SORT OBJECT EXAMPLE
 * ============================================================
 */

function demonstrateSortObjects() {
  const examples = [
    {
      description: "CGPA ascending",

      sort: {
        cgpa: 1,
      },
    },

    {
      description: "CGPA descending",

      sort: {
        cgpa: -1,
      },
    },

    {
      description: "Department ascending, CGPA descending",

      sort: {
        department: 1,

        cgpa: -1,
      },
    },

    {
      description: "Newest first",

      sort: {
        createdAt: -1,
      },
    },

    {
      description: "Name ascending",

      sort: {
        name: 1,
      },
    },
  ];

  console.log(examples);

  return examples;
}

/*
 * ============================================================
 * 32. PRODUCTION QUERY
 * ============================================================
 */

async function productionStudentQuery({
  search,

  department,

  page = 1,

  limit = 20,

  sort = "-createdAt",
}) {
  const filter = {
    active: true,
  };

  /*
   * Search
   */

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  /*
   * Department
   */

  if (department) {
    filter.department = department;
  }

  /*
   * Pagination
   */

  const skip = (page - 1) * limit;

  /*
   * Safe sort
   */

  const sortObject = parseSort(sort);

  /*
   * Execute query
   */

  return Student.find(filter)

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      createdAt: 1,

      _id: 1,
    })

    .sort(sortObject)

    .skip(skip)

    .limit(limit)

    .lean()

    .exec();
}

/*
 * ============================================================
 * 33. COMPLETE DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Ascending
     * --------------------------------------------------------
     */

    const ascending = await Student.find()

      .sort({
        age: 1,
      })

      .exec();

    console.log("\nAge ascending:", ascending);

    /*
     * --------------------------------------------------------
     * Descending
     * --------------------------------------------------------
     */

    const descending = await Student.find()

      .sort({
        cgpa: -1,
      })

      .exec();

    console.log("\nCGPA descending:", descending);

    /*
     * --------------------------------------------------------
     * Multiple fields
     * --------------------------------------------------------
     */

    const multiple = await Student.find()

      .sort({
        department: 1,

        cgpa: -1,

        _id: 1,
      })

      .exec();

    console.log("\nMultiple sort:", multiple);

    /*
     * --------------------------------------------------------
     * API-style sorting
     * --------------------------------------------------------
     */

    const apiResult = await apiSortedStudents("-cgpa,name");

    console.log("\nAPI sort:", apiResult);

    /*
     * --------------------------------------------------------
     * Search + sort + pagination
     * --------------------------------------------------------
     */

    const result = await searchAndSortStudents({
      search: "shiva",

      department: "CSE",

      page: 1,

      limit: 10,

      sort: "-cgpa,name",
    });

    console.log("\nSearch + sort + pagination:", result);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 34. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
