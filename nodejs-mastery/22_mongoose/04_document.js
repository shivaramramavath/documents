/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     04_document.js
 *
 * Topic:
 *     Mongoose Documents
 *
 * ============================================================
 *
 * Schema
 *     ↓
 * Model
 *     ↓
 * Document
 *
 * A Mongoose Document is an instance of a Mongoose Model.
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

const Student = mongoose.model(
  "DocumentStudent",

  studentSchema,
);

/*
 * ============================================================
 * 4. CREATE A DOCUMENT
 * ============================================================
 *
 * new Student()
 *
 * creates a Mongoose Document in memory.
 *
 * It does NOT immediately insert it into MongoDB.
 *
 * ============================================================
 */

const student = new Student({
  name: "Shiva Ram",

  email: "shiva@example.com",

  age: 21,

  department: "CSE",
});

console.log(student);

/*
 * ============================================================
 * 5. isNew
 * ============================================================
 *
 * A newly created document has:
 *
 *     isNew === true
 *
 * until it is successfully saved.
 *
 * ============================================================
 */

console.log("isNew:", student.isNew);

/*
 * Expected:
 *
 *     true
 *
 */

/*
 * ============================================================
 * 6. SAVE DOCUMENT
 * ============================================================
 *
 * save() persists the document to MongoDB.
 *
 * ============================================================
 */

async function saveStudent() {
  await student.save();

  console.log("Student saved");

  console.log("isNew:", student.isNew);
}

/*
 * After successful save:
 *
 *     isNew === false
 *
 */

/*
 * ============================================================
 * 7. DOCUMENT _id
 * ============================================================
 *
 * Mongoose automatically generates an ObjectId for a document
 * unless _id generation has been disabled.
 *
 * ============================================================
 */

console.log("ID:", student._id);

/*
 * ============================================================
 * 8. DOCUMENT ID
 * ============================================================
 *
 * id is generally a string representation of _id.
 *
 * ============================================================
 */

console.log("id:", student.id);

/*
 * Difference:
 *
 *     student._id
 *         → ObjectId
 *
 *     student.id
 *         → string representation
 *
 */

/*
 * ============================================================
 * 9. CREATED AT / UPDATED AT
 * ============================================================
 *
 * Because timestamps: true was enabled:
 *
 *     createdAt
 *     updatedAt
 *
 * are automatically managed.
 *
 * ============================================================
 */

console.log("createdAt:", student.createdAt);

console.log("updatedAt:", student.updatedAt);

/*
 * ============================================================
 * 10. CHECK MODIFIED FIELDS
 * ============================================================
 */

console.log("Modified paths:", student.modifiedPaths());

/*
 * ============================================================
 * 11. IS FIELD MODIFIED?
 * ============================================================
 */

console.log("name modified:", student.isModified("name"));

/*
 * ============================================================
 * 12. CHANGE FIELD
 * ============================================================
 */

student.name = "Shiva Ram Updated";

console.log("name modified:", student.isModified("name"));

/*
 * ============================================================
 * 13. MODIFIED PATHS
 * ============================================================
 */

console.log(student.modifiedPaths());

/*
 * Example:
 *
 *     [
 *       "name"
 *     ]
 *
 */

/*
 * ============================================================
 * 14. IS DIRECT MODIFIED
 * ============================================================
 */

console.log(student.isDirectModified("name"));

/*
 * ============================================================
 * 15. DIRECT MODIFIED VS MODIFIED
 * ============================================================
 *
 * isModified()
 *
 * checks whether a path is considered modified.
 *
 *
 * isDirectModified()
 *
 * checks whether that exact path was directly changed.
 *
 * This distinction becomes important with nested objects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. GET FIELD
 * ============================================================
 *
 * get()
 *
 * retrieves a value from the document.
 *
 * ============================================================
 */

const name = student.get("name");

console.log(name);

/*
 * ============================================================
 * 17. SET FIELD
 * ============================================================
 *
 * set()
 *
 * changes a value.
 *
 * ============================================================
 */

student.set("age", 22);

/*
 * Equivalent:
 *
 *     student.age = 22
 *
 */

/*
 * ============================================================
 * 18. SET MULTIPLE FIELDS
 * ============================================================
 */

student.set({
  name: "Shiva",

  age: 23,
});

/*
 * ============================================================
 * 19. UNSET FIELD
 * ============================================================
 *
 * set(path, undefined)
 *
 * or:
 *
 *     document.set({
 *         field: undefined
 *     })
 *
 * Depending on schema configuration, this can result in the
 * field being removed when persisted.
 *
 * ============================================================
 */

student.set("age", undefined);

/*
 * ============================================================
 * 20. VALIDATE DOCUMENT
 * ============================================================
 *
 * validate()
 *
 * runs schema validation without saving.
 *
 * ============================================================
 */

async function validateStudent() {
  try {
    await student.validate();

    console.log("Document is valid");
  } catch (error) {
    console.error("Validation failed:", error);
  }
}

/*
 * ============================================================
 * 21. VALIDATE ONE FIELD
 * ============================================================
 */

async function validateStudentName() {
  await student.validate("name");
}

/*
 * ============================================================
 * 22. VALIDATE SYNC
 * ============================================================
 *
 * validateSync()
 *
 * performs synchronous validation.
 *
 * ============================================================
 */

const validationError = student.validateSync();

if (validationError) {
  console.error(validationError);
}

/*
 * ============================================================
 * 23. CHECK VALIDATION STATE
 * ============================================================
 */

console.log("Validation errors:", student.errors);

/*
 * ============================================================
 * 24. DOCUMENT TO OBJECT
 * ============================================================
 *
 * Converts the Mongoose Document into a plain JavaScript
 * object.
 *
 * ============================================================
 */

const plainObject = student.toObject();

console.log(plainObject);

/*
 * ============================================================
 * 25. DOCUMENT TO JSON
 * ============================================================
 */

const json = student.toJSON();

console.log(json);

/*
 * ============================================================
 * 26. JSON.stringify()
 * ============================================================
 *
 * Mongoose documents implement JSON conversion.
 *
 * ============================================================
 */

console.log(JSON.stringify(student));

/*
 * ============================================================
 * 27. DOCUMENT INSPECTION
 * ============================================================
 */

console.log(student.inspect());

/*
 * ============================================================
 * 28. GET RAW DOCUMENT DATA
 * ============================================================
 *
 * _doc contains the internal document data.
 *
 * Avoid using _doc directly in application code.
 *
 * Prefer:
 *
 *     toObject()
 *     toJSON()
 *
 * ============================================================
 */

console.log(student._doc);

/*
 * ============================================================
 * 29. DOCUMENT POPULATE
 * ============================================================
 *
 * populate() replaces referenced ObjectIds with the referenced
 * document.
 *
 * It will be covered in detail later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. DOCUMENT DELETE
 * ============================================================
 *
 * deleteOne() deletes this document.
 *
 * ============================================================
 */

async function deleteStudent() {
  await student.deleteOne();
}

/*
 * ============================================================
 * 31. DOCUMENT UPDATE
 * ============================================================
 *
 * Change fields:
 *
 *     student.name = "New Name";
 *
 * Then:
 *
 *     await student.save();
 *
 * ============================================================
 */

async function updateStudent() {
  student.name = "Updated Name";

  student.age = 24;

  await student.save();
}

/*
 * ============================================================
 * 32. SAVE RETURNS DOCUMENT
 * ============================================================
 */

async function createAndSave() {
  const newStudent = new Student({
    name: "Ravi",

    email: "ravi@example.com",

    age: 22,

    department: "ECE",
  });

  const savedStudent = await newStudent.save();

  console.log(savedStudent);
}

/*
 * ============================================================
 * 33. DOCUMENT STATE
 * ============================================================
 */

function printDocumentState(document) {
  console.log({
    isNew: document.isNew,

    isModified: document.isModified(),

    modifiedPaths: document.modifiedPaths(),

    id: document.id,

    objectId: document._id,
  });
}

/*
 * ============================================================
 * 34. RESET MODIFIED STATE
 * ============================================================
 *
 * Mongoose internally tracks modifications.
 *
 * You normally don't need to manipulate this manually.
 *
 * But these APIs are useful to understand:
 *
 *     $markValid()
 *     $markModified()
 *     $isModified()
 *     $isDefault()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. MARK PATH MODIFIED
 * ============================================================
 *
 * Useful when changing Mixed or complex values in a way
 * Mongoose cannot automatically detect.
 *
 * ============================================================
 */

const metadataSchema = new mongoose.Schema({
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const MetadataModel = mongoose.model(
  "DocumentMetadata",

  metadataSchema,
);

const metadataDocument = new MetadataModel({
  metadata: {
    theme: "dark",
  },
});

metadataDocument.metadata.theme = "light";

metadataDocument.markModified("metadata");

/*
 * ============================================================
 * 36. UNMARK MODIFIED
 * ============================================================
 */

metadataDocument.unmarkModified("metadata");

/*
 * ============================================================
 * 37. IS DEFAULT
 * ============================================================
 */

console.log(student.isDefault("active"));

/*
 * ============================================================
 * 38. GET DEFAULT
 * ============================================================
 */

console.log(student.get("active"));

/*
 * ============================================================
 * 39. DOCUMENT POPULATE CHECK
 * ============================================================
 */

console.log(student.populated("departmentId"));

/*
 * ============================================================
 * 40. DOCUMENT CONSTRUCTOR
 * ============================================================
 */

console.log(student.constructor.modelName);

/*
 * ============================================================
 * 41. DOCUMENT INSTANCE CHECK
 * ============================================================
 */

console.log(student instanceof Student);

/*
 * Output:
 *
 *     true
 *
 */

/*
 * ============================================================
 * 42. CREATE DOCUMENT FROM OBJECT
 * ============================================================
 */

const anotherStudent = new Student({
  name: "Anil",

  email: "anil@example.com",

  department: "EEE",
});

printDocumentState(anotherStudent);

/*
 * ============================================================
 * 43. DOCUMENT LIFECYCLE
 * ============================================================
 *
 *
 * new Student(...)
 *        │
 *        ▼
 *   Document created
 *        │
 *        ├── isNew = true
 *        │
 *        ▼
 *   validate()
 *        │
 *        ▼
 *      save()
 *        │
 *        ▼
 *   MongoDB insert
 *        │
 *        ▼
 *   isNew = false
 *        │
 *        ▼
 * Document exists
 *        │
 *        ├── modify fields
 *        │
 *        ▼
 *      save()
 *        │
 *        ▼
 *   MongoDB update
 *        │
 *        ▼
 *   deleteOne()
 *        │
 *        ▼
 *   MongoDB delete
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. DOCUMENT VS PLAIN OBJECT
 * ============================================================
 *
 *
 * Mongoose Document:
 *
 *     {
 *       _id,
 *       name,
 *       email,
 *       save(),
 *       validate(),
 *       populate(),
 *       isModified(),
 *       toObject(),
 *       toJSON(),
 *       ...
 *     }
 *
 *
 * Plain Object:
 *
 *     {
 *       _id,
 *       name,
 *       email
 *     }
 *
 *
 * A plain object does not have Mongoose document methods.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. LEAN
 * ============================================================
 *
 * Queries normally return Mongoose Documents.
 *
 * Using:
 *
 *     .lean()
 *
 * returns plain JavaScript objects.
 *
 * Example:
 *
 *     const students = await Student
 *       .find()
 *       .lean();
 *
 * ============================================================
 *
 * Detailed lean() behavior will be covered later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. CONNECTION + EXAMPLE
 * ============================================================
 */

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    const demoStudent = new Student({
      name: "Document Demo",

      email: `document-${Date.now()}@example.com`,

      age: 21,

      department: "CSE",
    });

    /*
     * Before save
     */

    console.log("\nBefore save:");

    console.log({
      isNew: demoStudent.isNew,

      id: demoStudent._id,

      modifiedPaths: demoStudent.modifiedPaths(),
    });

    /*
     * Validate
     */

    await demoStudent.validate();

    /*
     * Save
     */

    await demoStudent.save();

    /*
     * After save
     */

    console.log("\nAfter save:");

    console.log({
      isNew: demoStudent.isNew,

      id: demoStudent._id,

      createdAt: demoStudent.createdAt,

      updatedAt: demoStudent.updatedAt,
    });

    /*
     * Modify
     */

    demoStudent.name = "Updated Document";

    console.log("\nAfter modification:");

    console.log({
      isModified: demoStudent.isModified(),

      nameModified: demoStudent.isModified("name"),

      modifiedPaths: demoStudent.modifiedPaths(),
    });

    /*
     * Save update
     */

    await demoStudent.save();

    /*
     * Convert to plain object
     */

    const object = demoStudent.toObject();

    console.log("\nPlain object:", object);

    /*
     * Delete
     */

    await demoStudent.deleteOne();

    console.log("\nDocument deleted");
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

/*
 * ============================================================
 * 47. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * CREATE DOCUMENT
 *
 *     const student =
 *       new Student(data);
 *
 *
 * SAVE
 *
 *     await student.save();
 *
 *
 * VALIDATE
 *
 *     await student.validate();
 *
 *
 * SYNC VALIDATE
 *
 *     student.validateSync();
 *
 *
 * GET
 *
 *     student.get("name");
 *
 *
 * SET
 *
 *     student.set("name", "Shiva");
 *
 *
 * MODIFY
 *
 *     student.name = "Shiva";
 *
 *
 * CHECK MODIFICATION
 *
 *     student.isModified("name");
 *
 *
 * MODIFIED PATHS
 *
 *     student.modifiedPaths();
 *
 *
 * OBJECT
 *
 *     student.toObject();
 *
 *
 * JSON
 *
 *     student.toJSON();
 *
 *
 * DELETE
 *
 *     await student.deleteOne();
 *
 *
 * ID
 *
 *     student._id;
 *
 *
 * STRING ID
 *
 *     student.id;
 *
 *
 * NEW DOCUMENT
 *
 *     student.isNew;
 *
 *
 * ============================================================
 */
