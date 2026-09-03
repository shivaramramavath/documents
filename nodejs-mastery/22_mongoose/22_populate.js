/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_populate.js
 *
 * Topic:
 *     Mongoose Populate
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. ObjectId references
 *     2. ref
 *     3. populate()
 *     4. Single populate
 *     5. Multiple populate
 *     6. Select fields
 *     7. Nested populate
 *     8. Populate match
 *     9. Populate arrays
 *    10. Multiple references
 *    11. Dynamic population
 *    12. Depopulate
 *    13. Populate after create
 *    14. Populate vs $lookup
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
 * 2. DEPARTMENT SCHEMA
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,
  },

  code: {
    type: String,

    required: true,

    unique: true,

    uppercase: true,

    trim: true,
  },
});

/*
 * ============================================================
 * 3. FACULTY SCHEMA
 * ============================================================
 */

const facultySchema = new mongoose.Schema({
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

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "PopulateDepartment",

    required: true,
  },
});

/*
 * ============================================================
 * 4. SUBJECT SCHEMA
 * ============================================================
 */

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,
  },

  code: {
    type: String,

    required: true,

    uppercase: true,

    trim: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "PopulateDepartment",

    required: true,
  },
});

/*
 * ============================================================
 * 5. ROOM SCHEMA
 * ============================================================
 */

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,

    required: true,

    trim: true,
  },

  capacity: {
    type: Number,

    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "PopulateDepartment",
  },
});

/*
 * ============================================================
 * 6. TIMETABLE SCHEMA
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "PopulateDepartment",

    required: true,
  },

  entries: [
    {
      day: {
        type: String,

        required: true,
      },

      startTime: {
        type: String,

        required: true,
      },

      endTime: {
        type: String,

        required: true,
      },

      faculty: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "PopulateFaculty",

        required: true,
      },

      subject: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "PopulateSubject",

        required: true,
      },

      room: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "PopulateRoom",

        required: true,
      },
    },
  ],
});

/*
 * ============================================================
 * 7. MODELS
 * ============================================================
 */

const Department =
  mongoose.models.PopulateDepartment ||
  mongoose.model("PopulateDepartment", departmentSchema);

const Faculty =
  mongoose.models.PopulateFaculty ||
  mongoose.model("PopulateFaculty", facultySchema);

const Subject =
  mongoose.models.PopulateSubject ||
  mongoose.model("PopulateSubject", subjectSchema);

const Room =
  mongoose.models.PopulateRoom || mongoose.model("PopulateRoom", roomSchema);

const Timetable =
  mongoose.models.PopulateTimetable ||
  mongoose.model("PopulateTimetable", timetableSchema);

/*
 * ============================================================
 * 8. CREATE SAMPLE DATA
 * ============================================================
 */

async function createSampleData() {
  await Promise.all([
    Department.deleteMany({}),

    Faculty.deleteMany({}),

    Subject.deleteMany({}),

    Room.deleteMany({}),

    Timetable.deleteMany({}),
  ]);

  /*
   * ----------------------------------------------------------
   * Department
   * ----------------------------------------------------------
   */

  const department = await Department.create({
    name: "Computer Science and Engineering",

    code: "CSE",
  });

  /*
   * ----------------------------------------------------------
   * Faculty
   * ----------------------------------------------------------
   */

  const faculty1 = await Faculty.create({
    name: "Dr. Ravi Kumar",

    email: "ravi@example.com",

    department: department._id,
  });

  const faculty2 = await Faculty.create({
    name: "Dr. Anil Kumar",

    email: "anil@example.com",

    department: department._id,
  });

  /*
   * ----------------------------------------------------------
   * Subjects
   * ----------------------------------------------------------
   */

  const subject1 = await Subject.create({
    name: "Data Structures",

    code: "CS301",

    department: department._id,
  });

  const subject2 = await Subject.create({
    name: "Database Management Systems",

    code: "CS302",

    department: department._id,
  });

  /*
   * ----------------------------------------------------------
   * Rooms
   * ----------------------------------------------------------
   */

  const room1 = await Room.create({
    roomNumber: "ROOM-101",

    capacity: 60,

    department: department._id,
  });

  const room2 = await Room.create({
    roomNumber: "ROOM-102",

    capacity: 40,

    department: department._id,
  });

  /*
   * ----------------------------------------------------------
   * Timetable
   * ----------------------------------------------------------
   */

  const timetable = await Timetable.create({
    name: "CSE Semester 5",

    department: department._id,

    entries: [
      {
        day: "Monday",

        startTime: "09:00",

        endTime: "10:00",

        faculty: faculty1._id,

        subject: subject1._id,

        room: room1._id,
      },

      {
        day: "Monday",

        startTime: "10:00",

        endTime: "11:00",

        faculty: faculty2._id,

        subject: subject2._id,

        room: room2._id,
      },
    ],
  });

  return {
    department,

    faculty1,

    faculty2,

    subject1,

    subject2,

    room1,

    room2,

    timetable,
  };
}

/*
 * ============================================================
 * 9. BASIC POPULATE
 * ============================================================
 */

async function basicPopulate() {
  const timetable = await Timetable.findOne().populate("department").exec();

  console.log("\n===== BASIC POPULATE =====");

  console.log("Department:", timetable?.department);
}

/*
 * ============================================================
 * 10. POPULATE ONE REFERENCE
 * ============================================================
 */

async function populateFaculty() {
  const timetable = await Timetable.findOne()
    .populate("entries.faculty")
    .exec();

  console.log("\n===== FACULTY POPULATE =====");

  console.dir(timetable?.entries, {
    depth: 5,
  });
}

/*
 * ============================================================
 * 11. POPULATE MULTIPLE REFERENCES
 * ============================================================
 */

async function populateMultiple() {
  const timetable = await Timetable.findOne()
    .populate("department")
    .populate("entries.faculty")
    .populate("entries.subject")
    .populate("entries.room")
    .exec();

  console.log("\n===== MULTIPLE POPULATE =====");

  console.dir(timetable, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 12. POPULATE WITH SELECT
 * ============================================================
 *
 * Only retrieve selected fields from referenced documents.
 *
 * ============================================================
 */

async function populateWithSelect() {
  const timetable = await Timetable.findOne()
    .populate({
      path: "entries.faculty",

      select: "name email",
    })
    .populate({
      path: "entries.subject",

      select: "name code",
    })
    .populate({
      path: "entries.room",

      select: "roomNumber capacity",
    })
    .exec();

  console.log("\n===== SELECT FIELDS =====");

  console.dir(timetable?.entries, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 13. POPULATE DEPARTMENT
 * ============================================================
 */

async function populateDepartment() {
  const faculty = await Faculty.findOne()
    .populate({
      path: "department",

      select: "name code",
    })
    .exec();

  console.log("\n===== DEPARTMENT =====");

  console.log(faculty);
}

/*
 * ============================================================
 * 14. NESTED POPULATE
 * ============================================================
 *
 * Timetable
 *      ↓
 * Faculty
 *      ↓
 * Department
 *
 * ============================================================
 */

async function nestedPopulate() {
  const timetable = await Timetable.findOne()
    .populate({
      path: "entries.faculty",

      populate: {
        path: "department",

        select: "name code",
      },
    })
    .exec();

  console.log("\n===== NESTED POPULATE =====");

  console.dir(timetable?.entries, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 15. MULTIPLE NESTED POPULATES
 * ============================================================
 */

async function multipleNestedPopulate() {
  const timetable = await Timetable.findOne()
    .populate({
      path: "entries.faculty",

      select: "name email department",

      populate: {
        path: "department",

        select: "name code",
      },
    })
    .populate({
      path: "entries.subject",

      select: "name code department",

      populate: {
        path: "department",

        select: "name code",
      },
    })
    .exec();

  console.log("\n===== MULTIPLE NESTED =====");

  console.dir(timetable?.entries, {
    depth: 12,
  });
}

/*
 * ============================================================
 * 16. POPULATE WITH MATCH
 * ============================================================
 *
 * Only populate referenced documents satisfying conditions.
 *
 * ============================================================
 */

async function populateWithMatch() {
  const timetable = await Timetable.findOne()
    .populate({
      path: "entries.faculty",

      match: {
        name: {
          $regex: "Ravi",

          $options: "i",
        },
      },
    })
    .exec();

  console.log("\n===== MATCH =====");

  console.dir(timetable?.entries, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 17. POPULATE ARRAY
 * ============================================================
 */

async function populateArray() {
  const timetable = await Timetable.findOne()
    .populate([
      {
        path: "department",

        select: "name code",
      },

      {
        path: "entries.faculty",

        select: "name",
      },

      {
        path: "entries.subject",

        select: "name code",
      },

      {
        path: "entries.room",

        select: "roomNumber",
      },
    ])
    .exec();

  console.log("\n===== ARRAY POPULATE =====");

  console.dir(timetable, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 18. POPULATE AFTER CREATE
 * ============================================================
 */

async function populateAfterCreate() {
  const timetable = await Timetable.create({
    name: "Temporary Timetable",

    department: (await Department.findOne())._id,

    entries: [],
  });

  await timetable.populate("department");

  console.log("\n===== AFTER CREATE =====");

  console.log(timetable.department);

  await Timetable.deleteOne({
    _id: timetable._id,
  });
}

/*
 * ============================================================
 * 19. POPULATE DOCUMENT MANUALLY
 * ============================================================
 */

async function populateDocument() {
  const faculty = await Faculty.findOne();

  if (!faculty) {
    return;
  }

  await faculty.populate({
    path: "department",

    select: "name code",
  });

  console.log("\n===== DOCUMENT POPULATE =====");

  console.log(faculty);
}

/*
 * ============================================================
 * 20. CHECK POPULATED VALUE
 * ============================================================
 */

async function checkPopulated() {
  const timetable = await Timetable.findOne().populate("department").exec();

  if (!timetable) {
    return;
  }

  console.log("\n===== CHECK POPULATED =====");

  console.log("Is populated:", timetable.populated("department"));
}

/*
 * ============================================================
 * 21. DEPOPULATE
 * ============================================================
 */

async function depopulateDemo() {
  const timetable = await Timetable.findOne().populate("department").exec();

  if (!timetable) {
    return;
  }

  console.log("\nBefore depopulate:", timetable.department);

  timetable.depopulate("department");

  console.log("\nAfter depopulate:", timetable.department);
}

/*
 * ============================================================
 * 22. POPULATE WITH LIMIT
 * ============================================================
 */

async function populateWithLimit() {
  const timetable = await Timetable.findOne()
    .populate({
      path: "entries.faculty",

      options: {
        sort: {
          name: 1,
        },
      },
    })
    .exec();

  console.log("\n===== POPULATE OPTIONS =====");

  console.dir(timetable?.entries, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 23. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await createSampleData();

    await basicPopulate();

    await populateFaculty();

    await populateMultiple();

    await populateWithSelect();

    await populateDepartment();

    await nestedPopulate();

    await multipleNestedPopulate();

    await populateWithMatch();

    await populateArray();

    await populateAfterCreate();

    await populateDocument();

    await checkPopulated();

    await depopulateDemo();

    await populateWithLimit();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 24. RUN
 * ============================================================
 */

await main();
