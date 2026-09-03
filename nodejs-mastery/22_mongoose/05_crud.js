/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     05_crud.js
 *
 * Topic:
 *     Mongoose CRUD Operations
 *
 * ============================================================
 *
 * CRUD
 *
 *     C → Create
 *     R → Read
 *     U → Update
 *     D → Delete
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

      trim: true,

      lowercase: true,
    },

    age: {
      type: Number,

      min: 16,

      max: 100,
    },

    department: {
      type: String,

      required: true,
    },

    active: {
      type: Boolean,

      default: true,
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
  mongoose.models.CRUDStudent || mongoose.model("CRUDStudent", studentSchema);

/*
 * ============================================================
 * CREATE
 * ============================================================
 *
 * There are multiple ways to create documents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. CREATE USING new + save
 * ============================================================
 *
 * This is the Document approach.
 * ============================================================
 */

async function createWithSave() {
  const student = new Student({
    name: "Shiva Ram",

    email: `shiva-${Date.now()}@example.com`,

    age: 21,

    department: "CSE",
  });

  const savedStudent = await student.save();

  console.log("Created using save:", savedStudent);

  return savedStudent;
}

/*
 * ============================================================
 * 5. CREATE USING Model.create()
 * ============================================================
 *
 * Model.create() creates and saves the document.
 * ============================================================
 */

async function createWithCreate() {
  const student = await Student.create({
    name: "Ravi",

    email: `ravi-${Date.now()}@example.com`,

    age: 22,

    department: "ECE",
  });

  console.log("Created using create:", student);

  return student;
}

/*
 * ============================================================
 * 6. CREATE MULTIPLE DOCUMENTS
 * ============================================================
 *
 * Model.create() can also receive an array.
 * ============================================================
 */

async function createMultiple() {
  const students = await Student.create([
    {
      name: "Anil",

      email: `anil-${Date.now()}@example.com`,

      age: 20,

      department: "EEE",
    },

    {
      name: "Kiran",

      email: `kiran-${Date.now()}@example.com`,

      age: 23,

      department: "MECH",
    },
  ]);

  console.log("Created multiple:", students);

  return students;
}

/*
 * ============================================================
 * 7. INSERT MANY
 * ============================================================
 *
 * insertMany() is designed for inserting multiple documents.
 *
 * ============================================================
 */

async function insertManyStudents() {
  const students = await Student.insertMany([
    {
      name: "Student One",

      email: `one-${Date.now()}@example.com`,

      age: 20,

      department: "CSE",
    },

    {
      name: "Student Two",

      email: `two-${Date.now()}@example.com`,

      age: 21,

      department: "ECE",
    },
  ]);

  console.log("Inserted many:", students);

  return students;
}

/*
 * ============================================================
 * READ
 * ============================================================
 */

/*
 * ============================================================
 * 8. FIND ALL
 * ============================================================
 */

async function findAll() {
  const students = await Student.find();

  console.log("All students:", students);

  return students;
}

/*
 * ============================================================
 * 9. FIND WITH FILTER
 * ============================================================
 */

async function findByDepartment() {
  const students = await Student.find({
    department: "CSE",
  });

  return students;
}

/*
 * ============================================================
 * 10. FIND ONE
 * ============================================================
 */

async function findOneStudent() {
  const student = await Student.findOne({
    department: "CSE",
  });

  console.log("First CSE student:", student);

  return student;
}

/*
 * ============================================================
 * 11. FIND BY ID
 * ============================================================
 */

async function findById(studentId) {
  const student = await Student.findById(studentId);

  console.log("Student:", student);

  return student;
}

/*
 * ============================================================
 * 12. FIND ONE BY EMAIL
 * ============================================================
 */

async function findByEmail(email) {
  const student = await Student.findOne({
    email,
  });

  return student;
}

/*
 * ============================================================
 * 13. COUNT DOCUMENTS
 * ============================================================
 */

async function countStudents() {
  const count = await Student.countDocuments();

  console.log("Student count:", count);

  return count;
}

/*
 * ============================================================
 * 14. EXISTS
 * ============================================================
 *
 * Check whether at least one document matches.
 * ============================================================
 */

async function studentExists(email) {
  const exists = await Student.exists({
    email,
  });

  console.log("Exists:", exists);

  return exists;
}

/*
 * ============================================================
 * UPDATE
 * ============================================================
 */

/*
 * ============================================================
 * 15. UPDATE ONE
 * ============================================================
 */

async function updateOneStudent(studentId) {
  const result = await Student.updateOne(
    {
      _id: studentId,
    },

    {
      $set: {
        active: false,
      },
    },
  );

  console.log("Update result:", result);

  return result;
}

/*
 * ============================================================
 * 16. UPDATE MANY
 * ============================================================
 */

async function updateManyStudents() {
  const result = await Student.updateMany(
    {
      department: "CSE",
    },

    {
      $set: {
        active: true,
      },
    },
  );

  console.log("Update many result:", result);

  return result;
}

/*
 * ============================================================
 * 17. FIND ONE AND UPDATE
 * ============================================================
 */

async function findOneAndUpdate(email) {
  const student = await Student.findOneAndUpdate(
    {
      email,
    },

    {
      $set: {
        active: false,
      },
    },

    {
      new: true,
    },
  );

  console.log("Updated student:", student);

  return student;
}

/*
 * ============================================================
 * 18. FIND BY ID AND UPDATE
 * ============================================================
 */

async function findByIdAndUpdate(studentId) {
  const student = await Student.findByIdAndUpdate(
    studentId,

    {
      $set: {
        age: 25,
      },
    },

    {
      new: true,
    },
  );

  return student;
}

/*
 * ============================================================
 * 19. IMPORTANT: new: true
 * ============================================================
 *
 * By default, findOneAndUpdate() and findByIdAndUpdate()
 * return the document BEFORE the update.
 *
 * new: true
 *
 * returns the document AFTER the update.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. RETURN DOCUMENT + RAW RESULT
 * ============================================================
 *
 * includeResultMetadata can be used when you need additional
 * result metadata.
 *
 * ============================================================
 */

/*
 * ============================================================
 * DELETE
 * ============================================================
 */

/*
 * ============================================================
 * 21. DELETE ONE
 * ============================================================
 */

async function deleteOneStudent(studentId) {
  const result = await Student.deleteOne({
    _id: studentId,
  });

  console.log("Delete result:", result);

  return result;
}

/*
 * ============================================================
 * 22. DELETE MANY
 * ============================================================
 */

async function deleteManyStudents() {
  const result = await Student.deleteMany({
    active: false,
  });

  console.log("Delete many result:", result);

  return result;
}

/*
 * ============================================================
 * 23. FIND ONE AND DELETE
 * ============================================================
 */

async function findOneAndDelete(email) {
  const deletedStudent = await Student.findOneAndDelete({
    email,
  });

  console.log("Deleted student:", deletedStudent);

  return deletedStudent;
}

/*
 * ============================================================
 * 24. FIND BY ID AND DELETE
 * ============================================================
 */

async function findByIdAndDelete(studentId) {
  const deletedStudent = await Student.findByIdAndDelete(studentId);

  return deletedStudent;
}

/*
 * ============================================================
 * 25. REPLACE ONE
 * ============================================================
 *
 * replaceOne() replaces the matched document rather than
 * modifying selected fields.
 *
 * ============================================================
 */

async function replaceStudent(studentId) {
  const result = await Student.replaceOne(
    {
      _id: studentId,
    },

    {
      name: "Completely Replaced",

      email: `replace-${Date.now()}@example.com`,

      age: 30,

      department: "CSE",

      active: true,
    },
  );

  return result;
}

/*
 * ============================================================
 * 26. UPDATE OPERATORS
 * ============================================================
 *
 * Common operators:
 *
 *     $set
 *     $unset
 *     $inc
 *     $mul
 *     $min
 *     $max
 *     $rename
 *
 * Detailed operators are covered in:
 *
 *     07_query_operators.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. INCREMENT FIELD
 * ============================================================
 */

async function incrementAge(studentId) {
  return Student.updateOne(
    {
      _id: studentId,
    },

    {
      $inc: {
        age: 1,
      },
    },
  );
}

/*
 * ============================================================
 * 28. UNSET FIELD
 * ============================================================
 */

async function removeField(studentId) {
  return Student.updateOne(
    {
      _id: studentId,
    },

    {
      $unset: {
        age: "",
      },
    },
  );
}

/*
 * ============================================================
 * 29. UPSERT
 * ============================================================
 *
 * If a matching document exists:
 *
 *     update it
 *
 * If it doesn't exist:
 *
 *     create it
 *
 * ============================================================
 */

async function upsertStudent(email) {
  const student = await Student.findOneAndUpdate(
    {
      email,
    },

    {
      $set: {
        name: "Upsert Student",

        department: "CSE",
      },
    },

    {
      upsert: true,

      new: true,
    },
  );

  return student;
}

/*
 * ============================================================
 * 30. RETURNING ONLY RESULT
 * ============================================================
 *
 * updateOne() returns a write result, not the updated
 * document.
 *
 * Typical information:
 *
 *     acknowledged
 *     matchedCount
 *     modifiedCount
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. UPDATE RESULT
 * ============================================================
 *
 * Example:
 *
 *     {
 *       acknowledged: true,
 *       matchedCount: 1,
 *       modifiedCount: 1
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. DELETE RESULT
 * ============================================================
 *
 * Example:
 *
 *     {
 *       acknowledged: true,
 *       deletedCount: 1
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. CRUD COMPARISON
 * ============================================================
 *
 * CREATE
 *
 *     new Student(data)
 *     await document.save()
 *
 *     OR
 *
 *     Student.create(data)
 *
 *     OR
 *
 *     Student.insertMany(data)
 *
 *
 * READ
 *
 *     Student.find()
 *     Student.findOne()
 *     Student.findById()
 *
 *
 * UPDATE
 *
 *     Student.updateOne()
 *     Student.updateMany()
 *     Student.findOneAndUpdate()
 *     Student.findByIdAndUpdate()
 *     Student.replaceOne()
 *
 *
 * DELETE
 *
 *     Student.deleteOne()
 *     Student.deleteMany()
 *     Student.findOneAndDelete()
 *     Student.findByIdAndDelete()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. DOCUMENT VS MODEL CRUD
 * ============================================================
 *
 *
 * DOCUMENT
 *
 *     const student = new Student(data);
 *
 *     await student.save();
 *
 *     await student.deleteOne();
 *
 *
 * MODEL
 *
 *     await Student.create(data);
 *
 *     await Student.find();
 *
 *     await Student.updateOne(...);
 *
 *     await Student.deleteOne(...);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. COMPLETE CRUD DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * CREATE
     * --------------------------------------------------------
     */

    const created = await Student.create({
      name: "CRUD Demo",

      email: `crud-${Date.now()}@example.com`,

      age: 21,

      department: "CSE",
    });

    console.log("\nCREATE:", created);

    /*
     * --------------------------------------------------------
     * READ
     * --------------------------------------------------------
     */

    const found = await Student.findById(created._id);

    console.log("\nREAD:", found);

    /*
     * --------------------------------------------------------
     * UPDATE
     * --------------------------------------------------------
     */

    const updated = await Student.findByIdAndUpdate(
      created._id,

      {
        $set: {
          name: "CRUD Updated",

          age: 22,
        },
      },

      {
        new: true,
      },
    );

    console.log("\nUPDATE:", updated);

    /*
     * --------------------------------------------------------
     * DELETE
     * --------------------------------------------------------
     */

    const deleted = await Student.findByIdAndDelete(created._id);

    console.log("\nDELETE:", deleted);
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
 * FINAL CRUD FLOW
 * ============================================================
 *
 *
 *                 MODEL
 *                   │
 *       ┌───────────┼───────────┐
 *       │           │           │
 *       ▼           ▼           ▼
 *    CREATE        READ       UPDATE
 *       │           │           │
 *       │           │           │
 *       └───────────┼───────────┘
 *                   │
 *                   ▼
 *                 DELETE
 *
 *
 * CREATE:
 *
 *     create()
 *     save()
 *     insertMany()
 *
 *
 * READ:
 *
 *     find()
 *     findOne()
 *     findById()
 *
 *
 * UPDATE:
 *
 *     updateOne()
 *     updateMany()
 *     findOneAndUpdate()
 *     findByIdAndUpdate()
 *     replaceOne()
 *
 *
 * DELETE:
 *
 *     deleteOne()
 *     deleteMany()
 *     findOneAndDelete()
 *     findByIdAndDelete()
 *
 * ============================================================
 */
