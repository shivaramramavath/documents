/**
 * ============================================================
 * 23_references.js
 * ============================================================
 *
 * Mongoose References
 *
 * Topics:
 *
 *  1. ObjectId references
 *  2. One-to-one
 *  3. One-to-many
 *  4. Many-to-many
 *  5. Parent references
 *  6. Child references
 *  7. Bidirectional references
 *  8. Arrays of references
 *  9. References inside subdocuments
 * 10. Multiple references
 * 11. Referencing vs embedding
 * 12. populate()
 * 13. Referential integrity
 * 14. Timetable architecture
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
 * 2. DEPARTMENT
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
 * 3. FACULTY
 *
 * One Department -> Many Faculty
 *
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

  /*
   * Reference to Department.
   */

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ReferenceDepartment",

    required: true,
  },
});

/*
 * ============================================================
 * 4. SUBJECT
 *
 * One Department -> Many Subjects
 *
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

    ref: "ReferenceDepartment",

    required: true,
  },
});

/*
 * ============================================================
 * 5. ROOM
 *
 * One Department -> Many Rooms
 *
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
    min: 1,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ReferenceDepartment",
  },
});

/*
 * ============================================================
 * 6. TIMETABLE
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ReferenceDepartment",

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

      /*
       * Faculty reference
       */

      faculty: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "ReferenceFaculty",

        required: true,
      },

      /*
       * Subject reference
       */

      subject: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "ReferenceSubject",

        required: true,
      },

      /*
       * Room reference
       */

      room: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "ReferenceRoom",

        required: true,
      },
    },
  ],
});

/*
 * ============================================================
 * 7. MANY-TO-MANY EXAMPLE
 *
 * A Faculty member can teach many Subjects.
 *
 * A Subject can be taught by many Faculty members.
 *
 * ============================================================
 */

const facultySubjectSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ReferenceFaculty",

    required: true,
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "ReferenceSubject",
    },
  ],
});

/*
 * ============================================================
 * 8. STUDENT EXAMPLE
 *
 * One Student -> Many Subjects
 *
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "ReferenceSubject",
    },
  ],
});

/*
 * ============================================================
 * 9. ONE-TO-ONE EXAMPLE
 * ============================================================
 */

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
  },

  phone: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ReferenceProfile",

    unique: true,
  },
});

/*
 * ============================================================
 * 10. MODELS
 * ============================================================
 */

const Department =
  mongoose.models.ReferenceDepartment ||
  mongoose.model("ReferenceDepartment", departmentSchema);

const Faculty =
  mongoose.models.ReferenceFaculty ||
  mongoose.model("ReferenceFaculty", facultySchema);

const Subject =
  mongoose.models.ReferenceSubject ||
  mongoose.model("ReferenceSubject", subjectSchema);

const Room =
  mongoose.models.ReferenceRoom || mongoose.model("ReferenceRoom", roomSchema);

const Timetable =
  mongoose.models.ReferenceTimetable ||
  mongoose.model("ReferenceTimetable", timetableSchema);

const FacultySubject =
  mongoose.models.ReferenceFacultySubject ||
  mongoose.model("ReferenceFacultySubject", facultySubjectSchema);

const Student =
  mongoose.models.ReferenceStudent ||
  mongoose.model("ReferenceStudent", studentSchema);

const Profile =
  mongoose.models.ReferenceProfile ||
  mongoose.model("ReferenceProfile", profileSchema);

const User =
  mongoose.models.ReferenceUser || mongoose.model("ReferenceUser", userSchema);

/*
 * ============================================================
 * 11. ONE-TO-MANY DEMO
 * ============================================================
 */

async function oneToManyDemo() {
  const department = await Department.create({
    name: "Computer Science",

    code: `CSE-${Date.now()}`,
  });

  const faculty1 = await Faculty.create({
    name: "Dr. Ravi",

    email: `ravi-${Date.now()}@example.com`,

    department: department._id,
  });

  const faculty2 = await Faculty.create({
    name: "Dr. Anil",

    email: `anil-${Date.now()}@example.com`,

    department: department._id,
  });

  console.log("\n===== ONE TO MANY =====");

  console.log("Department:", department._id);

  console.log("Faculty 1:", faculty1.department);

  console.log("Faculty 2:", faculty2.department);

  /*
   * Find all faculty belonging to department.
   */

  const faculty = await Faculty.find({
    department: department._id,
  });

  console.log("Faculty count:", faculty.length);

  return {
    department,
    faculty1,
    faculty2,
  };
}

/*
 * ============================================================
 * 12. MANY-TO-MANY DEMO
 * ============================================================
 */

async function manyToManyDemo(facultyId, subjectIds) {
  const relation = await FacultySubject.create({
    faculty: facultyId,

    subjects: subjectIds,
  });

  console.log("\n===== MANY TO MANY =====");

  console.log(relation);

  /*
   * Populate both sides of the relation.
   */

  const populated = await FacultySubject.findById(relation._id)
    .populate("faculty")
    .populate("subjects");

  console.dir(populated, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 13. ARRAY OF REFERENCES
 * ============================================================
 */

async function arrayReferenceDemo(subjectIds) {
  const student = await Student.create({
    name: "Shiva Ram",

    rollNumber: `23CSE${Date.now()}`,

    subjects: subjectIds,
  });

  const populated = await Student.findById(student._id).populate({
    path: "subjects",

    select: "name code",
  });

  console.log("\n===== ARRAY REFERENCES =====");

  console.dir(populated, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 14. TIMETABLE REFERENCES
 * ============================================================
 */

async function timetableReferenceDemo(
  departmentId,
  facultyId,
  subjectId,
  roomId,
) {
  const timetable = await Timetable.create({
    name: "CSE Semester 5",

    department: departmentId,

    entries: [
      {
        day: "Monday",

        startTime: "09:00",

        endTime: "10:00",

        faculty: facultyId,

        subject: subjectId,

        room: roomId,
      },
    ],
  });

  /*
   * Populate every reference.
   */

  const populated = await Timetable.findById(timetable._id)
    .populate({
      path: "department",

      select: "name code",
    })
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
    });

  console.log("\n===== TIMETABLE REFERENCES =====");

  console.dir(populated, {
    depth: 12,
  });

  return timetable;
}

/*
 * ============================================================
 * 15. REFERENCE IS ONLY AN OBJECT ID
 * ============================================================
 */

async function inspectRawReference(facultyId) {
  const faculty = await Faculty.findById(facultyId);

  console.log("\n===== RAW REFERENCE =====");

  console.log("Department:", faculty?.department);

  console.log("Type:", faculty?.department?.constructor?.name);
}

/*
 * ============================================================
 * 16. FIND CHILDREN USING PARENT ID
 * ============================================================
 */

async function findChildren(departmentId) {
  const faculty = await Faculty.find({
    department: departmentId,
  });

  const subjects = await Subject.find({
    department: departmentId,
  });

  const rooms = await Room.find({
    department: departmentId,
  });

  console.log("\n===== CHILDREN =====");

  console.log("Faculty:", faculty.length);

  console.log("Subjects:", subjects.length);

  console.log("Rooms:", rooms.length);
}

/*
 * ============================================================
 * 17. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Create department + faculty
     * --------------------------------------------------------
     */

    const { department, faculty1 } = await oneToManyDemo();

    /*
     * --------------------------------------------------------
     * Create subjects
     * --------------------------------------------------------
     */

    const subject1 = await Subject.create({
      name: "Data Structures",

      code: `CS-${Date.now()}-1`,

      department: department._id,
    });

    const subject2 = await Subject.create({
      name: "Database Management Systems",

      code: `CS-${Date.now()}-2`,

      department: department._id,
    });

    /*
     * --------------------------------------------------------
     * Create room
     * --------------------------------------------------------
     */

    const room = await Room.create({
      roomNumber: `ROOM-${Date.now()}`,

      capacity: 60,

      department: department._id,
    });

    /*
     * --------------------------------------------------------
     * Many-to-many
     * --------------------------------------------------------
     */

    await manyToManyDemo(
      faculty1._id,

      [subject1._id, subject2._id],
    );

    /*
     * --------------------------------------------------------
     * Array reference
     * --------------------------------------------------------
     */

    await arrayReferenceDemo([subject1._id, subject2._id]);

    /*
     * --------------------------------------------------------
     * Timetable
     * --------------------------------------------------------
     */

    await timetableReferenceDemo(
      department._id,

      faculty1._id,

      subject1._id,

      room._id,
    );

    /*
     * --------------------------------------------------------
     * Raw reference
     * --------------------------------------------------------
     */

    await inspectRawReference(faculty1._id);

    /*
     * --------------------------------------------------------
     * Find children
     * --------------------------------------------------------
     */

    await findChildren(department._id);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 18. RUN
 * ============================================================
 */

await main();
