/**
 * ============================================================
 * 25_embedded_documents.js
 * ============================================================
 *
 * Mongoose Embedded Documents
 *
 * Topics:
 *
 *  1. Embedded objects
 *  2. Embedded arrays
 *  3. Nested embedding
 *  4. Embedding vs references
 *  5. Atomic updates
 *  6. $set
 *  7. $push
 *  8. $pull
 *  9. $inc
 * 10. Positional operator $
 * 11. $[]
 * 12. arrayFilters
 * 13. Document growth
 * 14. MongoDB document limit
 * 15. Timetable modeling
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
 * 2. BASIC EMBEDDED OBJECT
 * ============================================================
 *
 * address is stored directly inside User.
 *
 * There is NO separate Address collection.
 *
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  address: {
    street: String,

    city: String,

    state: String,

    pincode: String,
  },
});

/*
 * ============================================================
 * 3. EMBEDDED ARRAY
 * ============================================================
 */

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  items: [
    {
      productName: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

/*
 * ============================================================
 * 4. NESTED EMBEDDING
 * ============================================================
 */

const collegeSchema = new mongoose.Schema({
  name: String,

  address: {
    location: {
      city: String,

      state: String,
    },

    contact: {
      phone: String,

      email: String,
    },
  },
});

/*
 * ============================================================
 * 5. TIMETABLE EMBEDDED CONFIGURATION
 * ============================================================
 *
 * These values belong to the timetable itself.
 *
 * They don't need separate collections.
 *
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  academicYear: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  section: {
    type: String,
    required: true,
  },

  settings: {
    workingDays: [String],

    workingHours: {
      start: String,

      end: String,
    },

    slotDuration: {
      type: Number,

      default: 60,
    },

    break: {
      start: String,

      end: String,
    },
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
       * These are deliberately embedded.
       */

      subject: {
        name: String,

        code: String,
      },

      faculty: {
        name: String,

        employeeId: String,
      },

      room: {
        number: String,

        capacity: Number,
      },
    },
  ],
});

/*
 * ============================================================
 * 6. EMBEDDED ATTENDANCE DATA
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  name: String,

  rollNumber: String,

  attendance: [
    {
      subjectCode: String,

      totalClasses: {
        type: Number,

        default: 0,
      },

      attendedClasses: {
        type: Number,

        default: 0,
      },
    },
  ],
});

/*
 * ============================================================
 * 7. MODELS
 * ============================================================
 */

const User =
  mongoose.models.EmbeddedUser || mongoose.model("EmbeddedUser", userSchema);

const Order =
  mongoose.models.EmbeddedOrder || mongoose.model("EmbeddedOrder", orderSchema);

const College =
  mongoose.models.EmbeddedCollege ||
  mongoose.model("EmbeddedCollege", collegeSchema);

const Timetable =
  mongoose.models.EmbeddedTimetable ||
  mongoose.model("EmbeddedTimetable", timetableSchema);

const Student =
  mongoose.models.EmbeddedStudent ||
  mongoose.model("EmbeddedStudent", studentSchema);

/*
 * ============================================================
 * 8. CREATE EMBEDDED DOCUMENT
 * ============================================================
 */

async function createEmbeddedUser() {
  const user = await User.create({
    name: "Shiva Ram",

    email: "shiva@example.com",

    address: {
      street: "Main Road",

      city: "Vijayawada",

      state: "Andhra Pradesh",

      pincode: "520001",
    },
  });

  console.log("\n===== EMBEDDED USER =====");

  console.dir(user, {
    depth: 8,
  });

  return user;
}

/*
 * ============================================================
 * 9. EMBEDDED ARRAY
 * ============================================================
 */

async function createOrder() {
  const order = await Order.create({
    customerName: "Shiva Ram",

    items: [
      {
        productName: "Keyboard",

        quantity: 1,

        price: 1500,
      },

      {
        productName: "Mouse",

        quantity: 2,

        price: 700,
      },
    ],
  });

  console.log("\n===== EMBEDDED ARRAY =====");

  console.dir(order, {
    depth: 8,
  });

  return order;
}

/*
 * ============================================================
 * 10. NESTED EMBEDDED OBJECT
 * ============================================================
 */

async function createCollege() {
  const college = await College.create({
    name: "ABC Engineering College",

    address: {
      location: {
        city: "Vijayawada",

        state: "Andhra Pradesh",
      },

      contact: {
        phone: "9999999999",

        email: "admin@example.com",
      },
    },
  });

  console.log("\n===== NESTED EMBEDDING =====");

  console.dir(college, {
    depth: 10,
  });

  return college;
}

/*
 * ============================================================
 * 11. CREATE TIMETABLE
 * ============================================================
 */

async function createTimetable() {
  const timetable = await Timetable.create({
    name: "CSE Semester 5 - A",

    academicYear: "2026-27",

    semester: 5,

    section: "A",

    settings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

      workingHours: {
        start: "09:00",

        end: "16:00",
      },

      slotDuration: 60,

      break: {
        start: "13:00",

        end: "14:00",
      },
    },

    entries: [
      {
        day: "Monday",

        startTime: "09:00",

        endTime: "10:00",

        subject: {
          name: "Data Structures",

          code: "CS301",
        },

        faculty: {
          name: "Dr. Ravi",

          employeeId: "FAC001",
        },

        room: {
          number: "R101",

          capacity: 60,
        },
      },
    ],
  });

  console.log("\n===== EMBEDDED TIMETABLE =====");

  console.dir(timetable, {
    depth: 15,
  });

  return timetable;
}

/*
 * ============================================================
 * 12. $SET
 * ============================================================
 *
 * Update an embedded field without loading the document.
 *
 * ============================================================
 */

async function setEmbeddedField(userId) {
  const result = await User.updateOne(
    {
      _id: userId,
    },

    {
      $set: {
        "address.city": "Guntur",

        "address.pincode": "522001",
      },
    },
  );

  console.log("\n===== $SET =====");

  console.log(result);
}

/*
 * ============================================================
 * 13. $PUSH
 * ============================================================
 *
 * Add an element to an embedded array.
 *
 * ============================================================
 */

async function pushOrderItem(orderId) {
  const result = await Order.updateOne(
    {
      _id: orderId,
    },

    {
      $push: {
        items: {
          productName: "Monitor",

          quantity: 1,

          price: 12000,
        },
      },
    },
  );

  console.log("\n===== $PUSH =====");

  console.log(result);
}

/*
 * ============================================================
 * 14. $PULL
 * ============================================================
 *
 * Remove matching elements from an embedded array.
 *
 * ============================================================
 */

async function pullOrderItem(orderId) {
  const result = await Order.updateOne(
    {
      _id: orderId,
    },

    {
      $pull: {
        items: {
          productName: "Monitor",
        },
      },
    },
  );

  console.log("\n===== $PULL =====");

  console.log(result);
}

/*
 * ============================================================
 * 15. $INC
 * ============================================================
 *
 * Increment embedded numeric fields.
 *
 * ============================================================
 */

async function incrementAttendance(studentId) {
  const result = await Student.updateOne(
    {
      _id: studentId,

      "attendance.subjectCode": "CS301",
    },

    {
      $inc: {
        "attendance.$.totalClasses": 1,

        "attendance.$.attendedClasses": 1,
      },
    },
  );

  console.log("\n===== $INC =====");

  console.log(result);
}

/*
 * ============================================================
 * 16. POSITIONAL OPERATOR $
 * ============================================================
 *
 * Update the first matching embedded array element.
 *
 * ============================================================
 */

async function updateTimetableEntry(timetableId) {
  const result = await Timetable.updateOne(
    {
      _id: timetableId,

      "entries.day": "Monday",
    },

    {
      $set: {
        "entries.$.startTime": "10:00",

        "entries.$.endTime": "11:00",
      },
    },
  );

  console.log("\n===== POSITIONAL $ =====");

  console.log(result);
}

/*
 * ============================================================
 * 17. $[]
 * ============================================================
 *
 * Update every element in an array.
 *
 * ============================================================
 */

async function updateAllAttendance(studentId) {
  const result = await Student.updateOne(
    {
      _id: studentId,
    },

    {
      $inc: {
        "attendance.$[].totalClasses": 1,
      },
    },
  );

  console.log("\n===== $[] =====");

  console.log(result);
}

/*
 * ============================================================
 * 18. ARRAY FILTERS
 * ============================================================
 *
 * Update only matching embedded documents.
 *
 * ============================================================
 */

async function updateSpecificAttendance(studentId) {
  const result = await Student.updateOne(
    {
      _id: studentId,
    },

    {
      $inc: {
        "attendance.$[subject].totalClasses": 1,
      },
    },

    {
      arrayFilters: [
        {
          "subject.subjectCode": "CS301",
        },
      ],
    },
  );

  console.log("\n===== ARRAY FILTERS =====");

  console.log(result);
}

/*
 * ============================================================
 * 19. QUERY EMBEDDED FIELD
 * ============================================================
 */

async function queryEmbeddedUser() {
  const users = await User.find({
    "address.city": "Guntur",
  });

  console.log("\n===== QUERY EMBEDDED FIELD =====");

  console.dir(users, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 20. QUERY ARRAY OF EMBEDDED DOCUMENTS
 * ============================================================
 */

async function queryOrderItems() {
  const orders = await Order.find({
    "items.productName": "Keyboard",
  });

  console.log("\n===== QUERY EMBEDDED ARRAY =====");

  console.dir(orders, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 21. $elemMatch
 * ============================================================
 *
 * Match multiple conditions against the SAME
 * array element.
 *
 * ============================================================
 */

async function elemMatchDemo() {
  const orders = await Order.find({
    items: {
      $elemMatch: {
        productName: "Mouse",

        quantity: {
          $gte: 2,
        },
      },
    },
  });

  console.log("\n===== $elemMatch =====");

  console.dir(orders, {
    depth: 8,
  });
}

/*
 * ============================================================
 * 22. EMBEDDED DOCUMENT UPDATE
 * ============================================================
 */

async function updateTimetableSettings(timetableId) {
  const result = await Timetable.updateOne(
    {
      _id: timetableId,
    },

    {
      $set: {
        "settings.slotDuration": 50,

        "settings.workingHours.end": "17:00",
      },
    },
  );

  console.log("\n===== EMBEDDED SETTINGS UPDATE =====");

  console.log(result);
}

/*
 * ============================================================
 * 23. ADD TIMETABLE ENTRY
 * ============================================================
 */

async function addTimetableEntry(timetableId) {
  const result = await Timetable.updateOne(
    {
      _id: timetableId,
    },

    {
      $push: {
        entries: {
          day: "Tuesday",

          startTime: "10:00",

          endTime: "11:00",

          subject: {
            name: "Database Management Systems",

            code: "CS302",
          },

          faculty: {
            name: "Dr. Anil",

            employeeId: "FAC002",
          },

          room: {
            number: "R102",

            capacity: 60,
          },
        },
      },
    },
  );

  console.log("\n===== ADD TIMETABLE ENTRY =====");

  console.log(result);
}

/*
 * ============================================================
 * 24. REMOVE TIMETABLE ENTRY
 * ============================================================
 */

async function removeTimetableEntry(timetableId) {
  const result = await Timetable.updateOne(
    {
      _id: timetableId,
    },

    {
      $pull: {
        entries: {
          day: "Tuesday",
        },
      },
    },
  );

  console.log("\n===== REMOVE TIMETABLE ENTRY =====");

  console.log(result);
}

/*
 * ============================================================
 * 25. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    const user = await createEmbeddedUser();

    const order = await createOrder();

    await createCollege();

    const timetable = await createTimetable();

    await setEmbeddedField(user._id);

    await pushOrderItem(order._id);

    await pullOrderItem(order._id);

    await updateTimetableEntry(timetable._id);

    await updateTimetableSettings(timetable._id);

    await addTimetableEntry(timetable._id);

    await removeTimetableEntry(timetable._id);

    await queryEmbeddedUser();

    await queryOrderItems();

    await elemMatchDemo();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 26. RUN
 * ============================================================
 */

await main();
