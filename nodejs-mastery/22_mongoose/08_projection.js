/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     08_projection.js
 *
 * Topic:
 *     Mongoose Projection
 *
 * ============================================================
 *
 * Projection controls which fields MongoDB returns.
 *
 * Main methods:
 *
 *     select()
 *     projection()
 *
 * Projection syntax:
 *
 *     1  -> include
 *     0  -> exclude
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

    phone: {
      type: String,
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

    password: {
      type: String,

      /*
       * This field will not be selected by default.
       *
       * It can still be explicitly requested with:
       *
       *     .select("+password")
       *
       */

      select: false,
    },

    internalNotes: {
      type: String,

      select: false,
    },

    address: {
      city: String,

      state: String,

      pincode: String,
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
  mongoose.models.ProjectionStudent ||
  mongoose.model("ProjectionStudent", studentSchema);

/*
 * ============================================================
 * 4. NO PROJECTION
 * ============================================================
 *
 * Returns all normally selectable fields.
 *
 * password and internalNotes are excluded because their schema
 * has select: false.
 *
 * ============================================================
 */

async function withoutProjection() {
  return Student.find().exec();
}

/*
 * ============================================================
 * 5. INCLUDE FIELDS
 * ============================================================
 *
 * Include only these fields.
 *
 * ============================================================
 */

async function includeFields() {
  return Student.find().select("name email department cgpa").exec();
}

/*
 * Result conceptually:
 *
 * {
 *     name,
 *     email,
 *     department,
 *     cgpa
 * }
 *
 */

/*
 * ============================================================
 * 6. INCLUDE USING OBJECT
 * ============================================================
 */

async function includeUsingObject() {
  return Student.find()
    .select({
      name: 1,

      email: 1,

      department: 1,

      cgpa: 1,
    })
    .exec();
}

/*
 * ============================================================
 * 7. EXCLUDE FIELDS
 * ============================================================
 */

async function excludeFields() {
  return Student.find().select("-email -phone").exec();
}

/*
 * ============================================================
 * 8. EXCLUDE USING OBJECT
 * ============================================================
 */

async function excludeUsingObject() {
  return Student.find()
    .select({
      email: 0,

      phone: 0,

      address: 0,
    })
    .exec();
}

/*
 * ============================================================
 * 9. INCLUDE _id
 * ============================================================
 *
 * _id is included by default.
 *
 * ============================================================
 */

async function includeId() {
  return Student.find()
    .select({
      name: 1,

      email: 1,

      _id: 1,
    })
    .exec();
}

/*
 * ============================================================
 * 10. EXCLUDE _id
 * ============================================================
 */

async function excludeId() {
  return Student.find()
    .select({
      name: 1,

      email: 1,

      _id: 0,
    })
    .exec();
}

/*
 * ============================================================
 * 11. IMPORTANT PROJECTION RULE
 * ============================================================
 *
 * Generally, you cannot mix inclusion and exclusion.
 *
 * DON'T:
 *
 *     {
 *       name: 1,
 *       email: 1,
 *       phone: 0
 *     }
 *
 * The major exception is _id.
 *
 * This is valid:
 *
 *     {
 *       name: 1,
 *       email: 1,
 *       _id: 0
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. SELECT STRING SYNTAX
 * ============================================================
 */

async function stringProjection() {
  return Student.find().select("name email cgpa").exec();
}

/*
 * Exclusion:
 *
 *     "-email -phone"
 *
 */

/*
 * ============================================================
 * 13. PLUS SIGN
 * ============================================================
 *
 * A field with:
 *
 *     select: false
 *
 * is normally hidden.
 *
 * Use +field to explicitly include it.
 *
 * ============================================================
 */

async function includePassword() {
  return Student.findOne().select("+password").exec();
}

/*
 * ============================================================
 * 14. INCLUDE MULTIPLE HIDDEN FIELDS
 * ============================================================
 */

async function includeHiddenFields() {
  return Student.findOne().select("+password +internalNotes").exec();
}

/*
 * ============================================================
 * 15. HIDDEN FIELD WITH NORMAL FIELDS
 * ============================================================
 */

async function includePasswordWithUser() {
  return Student.findOne().select("name email +password").exec();
}

/*
 * ============================================================
 * 16. PROJECTION WITH FILTER
 * ============================================================
 */

async function filteredProjection() {
  return Student.find({
    department: "CSE",

    active: true,
  })

    .select({
      name: 1,

      email: 1,

      cgpa: 1,

      _id: 0,
    })

    .exec();
}

/*
 * ============================================================
 * 17. PROJECTION + SORT
 * ============================================================
 */

async function projectionAndSort() {
  return Student.find({
    active: true,
  })

    .select("name department cgpa")

    .sort({
      cgpa: -1,
    })

    .exec();
}

/*
 * ============================================================
 * 18. PROJECTION + PAGINATION
 * ============================================================
 */

async function projectionPagination({
  page = 1,

  limit = 20,
}) {
  const skip = (page - 1) * limit;

  return Student.find({
    active: true,
  })

    .select("name department semester cgpa")

    .sort({
      cgpa: -1,

      name: 1,
    })

    .skip(skip)

    .limit(limit)

    .exec();
}

/*
 * ============================================================
 * 19. QUERY.projection()
 * ============================================================
 *
 * Returns the current projection.
 *
 * ============================================================
 */

function inspectProjection() {
  const query = Student.find({
    active: true,
  })

    .select({
      name: 1,

      email: 1,

      cgpa: 1,

      _id: 0,
    });

  console.log("Projection:", query.projection());

  return query;
}

/*
 * ============================================================
 * 20. SET PROJECTION WITH projection()
 * ============================================================
 *
 * projection() can also set a projection.
 *
 * ============================================================
 */

async function projectionMethod() {
  return Student.find({
    active: true,
  })

    .projection({
      name: 1,

      department: 1,

      cgpa: 1,

      _id: 0,
    })

    .exec();
}

/*
 * ============================================================
 * 21. NESTED FIELD PROJECTION
 * ============================================================
 */

async function nestedProjection() {
  return Student.find()

    .select({
      name: 1,

      "address.city": 1,

      "address.state": 1,

      _id: 0,
    })

    .exec();
}

/*
 * ============================================================
 * 22. EXCLUDE NESTED FIELD
 * ============================================================
 */

async function excludeNestedField() {
  return Student.find()

    .select({
      "address.pincode": 0,
    })

    .exec();
}

/*
 * ============================================================
 * 23. PROJECTION FOR API RESPONSE
 * ============================================================
 *
 * Imagine:
 *
 *     GET /students
 *
 * The database document may contain:
 *
 *     name
 *     email
 *     phone
 *     password
 *     internalNotes
 *     address
 *     cgpa
 *     timestamps
 *
 * But the frontend may need only:
 *
 *     name
 *     department
 *     cgpa
 *
 * ============================================================
 */

async function apiStudentList() {
  return Student.find({
    active: true,
  })

    .select({
      name: 1,

      department: 1,

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
 * 24. PROJECTION FOR LOGIN
 * ============================================================
 *
 * Normally password is select:false.
 *
 * During authentication, explicitly request it.
 *
 * ============================================================
 */

async function findUserForLogin(email) {
  return Student.findOne({
    email,
  })

    .select("+password")

    .exec();
}

/*
 * ============================================================
 * 25. PROJECTION FOR ADMIN
 * ============================================================
 */

async function adminStudentDetails(studentId) {
  return Student.findById(studentId)

    .select({
      name: 1,

      email: 1,

      phone: 1,

      age: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      active: 1,

      address: 1,

      _id: 1,
    })

    .exec();
}

/*
 * ============================================================
 * 26. PROJECTION + LEAN
 * ============================================================
 *
 * Projection controls fields.
 *
 * lean() controls the returned object type.
 *
 * Projection:
 *
 *     "Which fields?"
 *
 * lean:
 *
 *     "Should Mongoose create Documents?"
 *
 * ============================================================
 */

async function projectionWithLean() {
  return Student.find({
    active: true,
  })

    .select("name department cgpa")

    .lean()

    .exec();
}

/*
 * ============================================================
 * 27. PROJECTION + PAGINATION + LEAN
 * ============================================================
 *
 * This is a common read-query pattern.
 *
 * ============================================================
 */

async function optimizedReadQuery({
  page = 1,

  limit = 20,

  department,
}) {
  const filter = {
    active: true,
  };

  if (department) {
    filter.department = department;
  }

  const skip = (page - 1) * limit;

  return Student.find(filter)

    .select({
      name: 1,

      department: 1,

      semester: 1,

      cgpa: 1,

      _id: 1,
    })

    .sort({
      cgpa: -1,

      _id: 1,
    })

    .skip(skip)

    .limit(limit)

    .lean()

    .exec();
}

/*
 * ============================================================
 * 28. PROJECTION WITH findOne()
 * ============================================================
 */

async function findOneProjection(email) {
  return Student.findOne({
    email,
  })

    .select("name email department cgpa")

    .exec();
}

/*
 * ============================================================
 * 29. PROJECTION WITH findById()
 * ============================================================
 */

async function findByIdProjection(studentId) {
  return Student.findById(studentId)

    .select("name email department cgpa")

    .exec();
}

/*
 * ============================================================
 * 30. PROJECTION AND SECURITY
 * ============================================================
 *
 * NEVER accidentally return sensitive fields.
 *
 * Dangerous:
 *
 *     Student.find()
 *
 * if your schema contains sensitive selectable fields.
 *
 * Better:
 *
 *     Student.find()
 *       .select("name email department")
 *
 * Or mark sensitive schema fields:
 *
 *     select: false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. PROJECTION AND PERFORMANCE
 * ============================================================
 *
 * Projection can reduce:
 *
 *     MongoDB -> Node.js
 *
 * network transfer,
 *
 *     Node.js
 *
 * memory usage,
 *
 * and unnecessary data processing.
 *
 * But:
 *
 * projection alone does NOT guarantee a faster query.
 *
 * Index design is also important.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. COVERED QUERY CONCEPT
 * ============================================================
 *
 * An advanced MongoDB optimization is a covered query.
 *
 * If MongoDB can satisfy both:
 *
 *     filter
 *
 * and
 *
 *     projection
 *
 * entirely from an index, it may not need to read the actual
 * documents.
 *
 * Example index:
 *
 *     { department: 1, cgpa: -1, name: 1 }
 *
 * Query:
 *
 *     filter:
 *         department
 *
 *     projection:
 *         department
 *         cgpa
 *         name
 *
 * This is an advanced indexing topic and will be covered later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. COMMON MISTAKE
 * ============================================================
 *
 * DON'T assume:
 *
 *     select("name email")
 *
 * means:
 *
 *     no _id
 *
 * _id is normally still returned.
 *
 * Use:
 *
 *     select("name email -_id")
 *
 * if you don't want it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. COMMON MISTAKE
 * ============================================================
 *
 * DON'T mix inclusion and exclusion:
 *
 *     {
 *       name: 1,
 *       email: 1,
 *       phone: 0
 *     }
 *
 * Instead choose one mode.
 *
 * INCLUDE:
 *
 *     {
 *       name: 1,
 *       email: 1
 *     }
 *
 * EXCLUDE:
 *
 *     {
 *       phone: 0,
 *       address: 0
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. COMPLETE DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Include projection
     * --------------------------------------------------------
     */

    const students = await Student.find({
      active: true,
    })

      .select("name department cgpa")

      .exec();

    console.log("\nStudents:", students);

    /*
     * --------------------------------------------------------
     * Explicit _id exclusion
     * --------------------------------------------------------
     */

    const studentsWithoutId = await Student.find()

      .select("name email -_id")

      .exec();

    console.log("\nWithout _id:", studentsWithoutId);

    /*
     * --------------------------------------------------------
     * Hidden password
     * --------------------------------------------------------
     */

    const loginUser = await Student.findOne({
      email: "student@example.com",
    })

      .select("+password")

      .exec();

    console.log("\nLogin user:", loginUser);

    /*
     * --------------------------------------------------------
     * Nested projection
     * --------------------------------------------------------
     */

    const addresses = await Student.find()

      .select({
        name: 1,

        "address.city": 1,

        "address.state": 1,

        _id: 0,
      })

      .exec();

    console.log("\nAddresses:", addresses);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 36. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
