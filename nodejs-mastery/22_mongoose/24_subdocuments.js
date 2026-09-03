/**
 * ============================================================
 * 24_subdocuments.js
 * ============================================================
 *
 * Mongoose Subdocuments
 *
 * Topics:
 *
 *  1. Array of subdocuments
 *  2. Single nested subdocuments
 *  3. Subdocument _id
 *  4. Disable subdocument _id
 *  5. Create subdocuments
 *  6. Add subdocuments
 *  7. Find subdocuments
 *  8. Update subdocuments
 *  9. Delete subdocuments
 * 10. parent()
 * 11. ownerDocument()
 * 12. Subdocument validation
 * 13. Subdocument middleware
 * 14. Nested subdocuments
 * 15. References inside subdocuments
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
 * 2. SUBDOCUMENT SCHEMA
 * ============================================================
 */

const entrySchema = new mongoose.Schema({
  day: {
    type: String,

    required: true,

    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  startTime: {
    type: String,

    required: true,
  },

  endTime: {
    type: String,

    required: true,
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "SubdocumentSubject",

    required: true,
  },

  faculty: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "SubdocumentFaculty",

    required: true,
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "SubdocumentRoom",

    required: true,
  },
});

/*
 * ============================================================
 * 3. TIMETABLE SCHEMA
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,

    trim: true,
  },

  semester: {
    type: Number,

    required: true,
  },

  entries: [entrySchema],
});

/*
 * ============================================================
 * 4. SINGLE NESTED SUBDOCUMENT
 * ============================================================
 */

const profileSchema = new mongoose.Schema({
  phone: {
    type: String,
  },

  city: {
    type: String,
  },
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  profile: profileSchema,
});

/*
 * ============================================================
 * 5. SUBDOCUMENT WITHOUT _id
 * ============================================================
 */

const settingsSchema = new mongoose.Schema(
  {
    theme: {
      type: String,

      default: "light",
    },

    language: {
      type: String,

      default: "en",
    },
  },
  {
    _id: false,
  },
);

/*
 * ============================================================
 * 6. MODEL
 * ============================================================
 */

const Timetable =
  mongoose.models.SubdocumentTimetable ||
  mongoose.model("SubdocumentTimetable", timetableSchema);

const Student =
  mongoose.models.SubdocumentStudent ||
  mongoose.model("SubdocumentStudent", studentSchema);

/*
 * ============================================================
 * 7. SUPPORTING MODELS
 * ============================================================
 */

const subjectSchema = new mongoose.Schema({
  name: String,

  code: String,
});

const facultySchema = new mongoose.Schema({
  name: String,
});

const roomSchema = new mongoose.Schema({
  roomNumber: String,
});

const Subject =
  mongoose.models.SubdocumentSubject ||
  mongoose.model("SubdocumentSubject", subjectSchema);

const Faculty =
  mongoose.models.SubdocumentFaculty ||
  mongoose.model("SubdocumentFaculty", facultySchema);

const Room =
  mongoose.models.SubdocumentRoom ||
  mongoose.model("SubdocumentRoom", roomSchema);

/*
 * ============================================================
 * 8. CREATE SUPPORTING DATA
 * ============================================================
 */

async function createReferences() {
  const subject = await Subject.create({
    name: "Data Structures",

    code: "CS301",
  });

  const faculty = await Faculty.create({
    name: "Dr. Ravi",
  });

  const room = await Room.create({
    roomNumber: "ROOM-101",
  });

  return {
    subject,
    faculty,
    room,
  };
}

/*
 * ============================================================
 * 9. CREATE TIMETABLE WITH SUBDOCUMENTS
 * ============================================================
 */

async function createTimetable(references) {
  const timetable = await Timetable.create({
    name: "CSE Semester 5",

    semester: 5,

    entries: [
      {
        day: "Monday",

        startTime: "09:00",

        endTime: "10:00",

        subject: references.subject._id,

        faculty: references.faculty._id,

        room: references.room._id,
      },
    ],
  });

  console.log("\n===== CREATED TIMETABLE =====");

  console.dir(timetable, {
    depth: 8,
  });

  return timetable;
}

/*
 * ============================================================
 * 10. SUBDOCUMENT _id
 * ============================================================
 */

async function subdocumentIdDemo(timetable) {
  const entry = timetable.entries[0];

  console.log("\n===== SUBDOCUMENT ID =====");

  console.log("Entry ID:", entry._id);

  console.log("Entry ID type:", entry._id.constructor.name);
}

/*
 * ============================================================
 * 11. ADD SUBDOCUMENT
 * ============================================================
 */

async function addSubdocument(timetable, references) {
  /*
   * Mongoose creates a subdocument object.
   */

  const entry = timetable.entries.create({
    day: "Tuesday",

    startTime: "10:00",

    endTime: "11:00",

    subject: references.subject._id,

    faculty: references.faculty._id,

    room: references.room._id,
  });

  timetable.entries.push(entry);

  await timetable.save();

  console.log("\n===== ADDED SUBDOCUMENT =====");

  console.log("New entry:", entry);
}

/*
 * ============================================================
 * 12. FIND SUBDOCUMENT BY _id
 * ============================================================
 */

async function findSubdocument(timetable) {
  const entryId = timetable.entries[0]._id;

  const entry = timetable.entries.id(entryId);

  console.log("\n===== FIND SUBDOCUMENT =====");

  console.log(entry);
}

/*
 * ============================================================
 * 13. UPDATE SUBDOCUMENT
 * ============================================================
 */

async function updateSubdocument(timetable) {
  const entry = timetable.entries[0];

  entry.startTime = "08:00";

  entry.endTime = "09:00";

  await timetable.save();

  console.log("\n===== UPDATED SUBDOCUMENT =====");

  console.log(entry);
}

/*
 * ============================================================
 * 14. DELETE SUBDOCUMENT
 * ============================================================
 */

async function deleteSubdocument(timetable) {
  if (timetable.entries.length === 0) {
    return;
  }

  const entryId = timetable.entries[timetable.entries.length - 1]._id;

  timetable.entries.pull(entryId);

  await timetable.save();

  console.log("\n===== DELETED SUBDOCUMENT =====");

  console.log("Remaining entries:", timetable.entries.length);
}

/*
 * ============================================================
 * 15. SUBDOCUMENT parent()
 * ============================================================
 */

async function parentDemo(timetable) {
  const entry = timetable.entries[0];

  const parent = entry.parent();

  console.log("\n===== parent() =====");

  console.log("Parent timetable ID:", parent._id);

  console.log("Parent timetable name:", parent.name);
}

/*
 * ============================================================
 * 16. ownerDocument()
 * ============================================================
 */

async function ownerDocumentDemo(timetable) {
  const entry = timetable.entries[0];

  const owner = entry.ownerDocument();

  console.log("\n===== ownerDocument() =====");

  console.log("Owner ID:", owner._id);

  console.log("Owner name:", owner.name);
}

/*
 * ============================================================
 * 17. SUBDOCUMENT VALIDATION
 * ============================================================
 */

async function validationDemo() {
  const timetable = new Timetable({
    name: "Invalid Timetable",

    semester: 5,

    entries: [
      {
        day: "InvalidDay",

        startTime: "09:00",

        endTime: "10:00",
      },
    ],
  });

  try {
    await timetable.validate();
  } catch (error) {
    console.log("\n===== SUBDOCUMENT VALIDATION =====");

    console.log(error.message);
  }
}

/*
 * ============================================================
 * 18. NESTED SUBDOCUMENT
 * ============================================================
 */

const scheduleSchema = new mongoose.Schema({
  startTime: String,

  endTime: String,
});

const nestedEntrySchema = new mongoose.Schema({
  day: String,

  schedule: scheduleSchema,
});

const nestedTimetableSchema = new mongoose.Schema({
  name: String,

  entries: [nestedEntrySchema],
});

const NestedTimetable =
  mongoose.models.SubdocumentNestedTimetable ||
  mongoose.model("SubdocumentNestedTimetable", nestedTimetableSchema);

/*
 * ============================================================
 * 19. NESTED SUBDOCUMENT DEMO
 * ============================================================
 */

async function nestedSubdocumentDemo() {
  const timetable = await NestedTimetable.create({
    name: "Nested Example",

    entries: [
      {
        day: "Monday",

        schedule: {
          startTime: "09:00",

          endTime: "10:00",
        },
      },
    ],
  });

  console.log("\n===== NESTED SUBDOCUMENT =====");

  console.dir(timetable, {
    depth: 8,
  });

  const entry = timetable.entries[0];

  console.log("Entry ID:", entry._id);

  console.log("Schedule:", entry.schedule);
}

/*
 * ============================================================
 * 20. SUBDOCUMENT WITH REFERENCE
 * ============================================================
 */

async function populateSubdocument(timetable) {
  const populated = await Timetable.findById(timetable._id)
    .populate({
      path: "entries.subject",

      select: "name code",
    })
    .populate({
      path: "entries.faculty",

      select: "name",
    })
    .populate({
      path: "entries.room",

      select: "roomNumber",
    });

  console.log("\n===== POPULATED SUBDOCUMENT =====");

  console.dir(populated, {
    depth: 12,
  });
}

/*
 * ============================================================
 * 21. SUBDOCUMENT MODIFICATION
 * ============================================================
 */

async function modifyNestedValue(timetable) {
  const entry = timetable.entries[0];

  entry.day = "Wednesday";

  await timetable.save();

  console.log("\n===== MODIFIED NESTED VALUE =====");

  console.log("Day:", entry.day);
}

/*
 * ============================================================
 * 22. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    const references = await createReferences();

    const timetable = await createTimetable(references);

    await subdocumentIdDemo(timetable);

    await addSubdocument(timetable, references);

    await findSubdocument(timetable);

    await updateSubdocument(timetable);

    await parentDemo(timetable);

    await ownerDocumentDemo(timetable);

    await deleteSubdocument(timetable);

    await validationDemo();

    await nestedSubdocumentDemo();

    await modifyNestedValue(timetable);

    await populateSubdocument(timetable);
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 23. RUN
 * ============================================================
 */

await main();
