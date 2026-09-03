/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     03_model.js
 *
 * Topic:
 *     Mongoose Models
 *
 * ============================================================
 *
 * Schema:
 *     Defines the structure and behavior of documents.
 *
 * Model:
 *     A compiled JavaScript class created from a Schema.
 *
 * Model:
 *     - creates documents
 *     - finds documents
 *     - updates documents
 *     - deletes documents
 *     - accesses a MongoDB collection
 *
 * ============================================================
 */

import mongoose from "mongoose";

/*
 * ============================================================
 * 1. CREATE A SCHEMA
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
 * 2. COMPILE SCHEMA INTO MODEL
 * ============================================================
 *
 * mongoose.model()
 *
 *     mongoose.model(
 *         modelName,
 *         schema
 *     )
 *
 * ============================================================
 */

const Student = mongoose.model(
  "Student",

  studentSchema,
);

/*
 * ============================================================
 * 3. MODEL NAME
 * ============================================================
 */

console.log(Student.modelName);

/*
 * Output:
 *
 *     Student
 *
 */

/*
 * ============================================================
 * 4. COLLECTION NAME
 * ============================================================
 *
 * Mongoose normally converts:
 *
 *     Student
 *
 * into:
 *
 *     students
 *
 * ============================================================
 */

console.log(Student.collection.name);

/*
 * Output:
 *
 *     students
 *
 */

/*
 * ============================================================
 * 5. MODEL NAME VS COLLECTION NAME
 * ============================================================
 *
 *
 * JavaScript:
 *
 *     Student
 *
 *
 * Mongoose model name:
 *
 *     "Student"
 *
 *
 * MongoDB collection:
 *
 *     "students"
 *
 *
 * Flow:
 *
 *
 *     "Student"
 *         ↓
 *     Mongoose pluralization
 *         ↓
 *     "students"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. EXPLICIT COLLECTION NAME
 * ============================================================
 *
 * If you don't want Mongoose to determine the collection name,
 * specify it in the Schema.
 * ============================================================
 */

const facultySchema = new mongoose.Schema(
  {
    name: String,

    department: String,
  },

  {
    collection: "faculty",
  },
);

const Faculty = mongoose.model(
  "Faculty",

  facultySchema,
);

console.log(Faculty.modelName);

console.log(Faculty.collection.name);

/*
 * Output:
 *
 *     Faculty
 *     faculty
 *
 */

/*
 * ============================================================
 * 7. MODEL IS A CLASS
 * ============================================================
 *
 * You can create a Mongoose document using:
 *
 *     new Student()
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
 * 8. MODEL STATIC METHODS
 * ============================================================
 *
 * Models provide static database operations.
 *
 * Examples:
 *
 *     Student.find()
 *     Student.findOne()
 *     Student.findById()
 *     Student.create()
 *     Student.updateOne()
 *     Student.deleteOne()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. MODEL DOCUMENT METHODS
 * ============================================================
 *
 * A document created from a Model provides instance methods.
 *
 * Examples:
 *
 *     student.save()
 *     student.deleteOne()
 *     student.validate()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. MODEL COLLECTION
 * ============================================================
 *
 * Model.collection gives access to the underlying Mongoose
 * collection wrapper.
 *
 * ============================================================
 */

console.log(Student.collection.name);

/*
 * ============================================================
 * 11. MODEL SCHEMA
 * ============================================================
 *
 * You can access the schema used by the model.
 * ============================================================
 */

console.log(Student.schema);

/*
 * ============================================================
 * 12. MODEL CONNECTION
 * ============================================================
 */

console.log(Student.db.name);

/*
 * ============================================================
 * 13. MODEL DB CONNECTION
 * ============================================================
 *
 * Student.db refers to the Mongoose Connection used by the
 * model.
 *
 * ============================================================
 */

console.log(Student.db.readyState);

/*
 * ============================================================
 * 14. MODEL COLLECTION ACCESS
 * ============================================================
 */

const studentsCollection = Student.collection;

/*
 * ============================================================
 * 15. CREATE A SECOND MODEL
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  code: {
    type: String,

    required: true,

    uppercase: true,
  },
});

const Department = mongoose.model(
  "Department",

  departmentSchema,
);

/*
 * ============================================================
 * 16. MODEL RELATIONSHIP
 * ============================================================
 *
 * A schema can reference another Model.
 *
 * ============================================================
 */

const facultyWithDepartmentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Department",

    required: true,
  },
});

const FacultyWithDepartment = mongoose.model(
  "FacultyWithDepartment",

  facultyWithDepartmentSchema,
);

/*
 * ============================================================
 * 17. MODEL REGISTRY
 * ============================================================
 *
 * Mongoose keeps track of registered models.
 *
 * ============================================================
 */

console.log(mongoose.modelNames());

/*
 * Example output:
 *
 *     [
 *       "Student",
 *       "Faculty",
 *       "Department",
 *       "FacultyWithDepartment"
 *     ]
 *
 */

/*
 * ============================================================
 * 18. mongoose.model()
 * ============================================================
 *
 * Retrieve an already registered model.
 *
 * ============================================================
 */

const ExistingStudent = mongoose.model("Student");

console.log(ExistingStudent === Student);

/*
 * Output:
 *
 *     true
 *
 */

/*
 * ============================================================
 * 19. mongoose.modelNames()
 * ============================================================
 */

const modelNames = mongoose.modelNames();

console.log(modelNames);

/*
 * ============================================================
 * 20. CHECK WHETHER MODEL EXISTS
 * ============================================================
 */

function modelExists(modelName) {
  return mongoose.modelNames().includes(modelName);
}

console.log(modelExists("Student"));

/*
 * ============================================================
 * 21. SAFE MODEL RETRIEVAL
 * ============================================================
 *
 * Useful when working with modules that may be loaded more
 * than once.
 *
 * ============================================================
 */

function getStudentModel() {
  if (mongoose.models.Student) {
    return mongoose.models.Student;
  }

  return mongoose.model("Student", studentSchema);
}

const SafeStudent = getStudentModel();

console.log(SafeStudent.modelName);

/*
 * ============================================================
 * 22. WHY mongoose.models EXISTS
 * ============================================================
 *
 * In some environments such as:
 *
 *     development
 *     hot reload
 *     serverless
 *     testing
 *
 * the same module can potentially be evaluated multiple times.
 *
 * Calling:
 *
 *     mongoose.model("Student", studentSchema)
 *
 * repeatedly can result in:
 *
 *     OverwriteModelError
 *
 *
 * Safer pattern:
 *
 *     mongoose.models.Student ||
 *     mongoose.model("Student", studentSchema)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. MODEL DISCRIMINATION
 * ============================================================
 *
 * Models can be based on the same base schema using
 * discriminators.
 *
 * This topic gets its own file:
 *
 *     33_discriminators.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. MODEL STATIC METHODS
 * ============================================================
 *
 * A Schema can define custom static methods.
 *
 * Example:
 *
 *     studentSchema.statics.findActive = function () {
 *
 *         return this.find({
 *             active: true
 *         });
 *
 *     };
 *
 *
 * Then:
 *
 *     Student.findActive()
 *
 * ============================================================
 *
 * Custom statics will be covered in:
 *
 *     19_static_methods.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. MODEL INSTANCE METHODS
 * ============================================================
 *
 * A Schema can define instance methods.
 *
 * Example:
 *
 *     studentSchema.methods.getDisplayName = function () {
 *
 *         return this.name;
 *
 *     };
 *
 *
 * Then:
 *
 *     student.getDisplayName()
 *
 * ============================================================
 *
 * Custom instance methods will be covered in:
 *
 *     18_instance_methods.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. MODEL MIDDLEWARE
 * ============================================================
 *
 * Middleware belongs to the Schema but affects operations
 * performed through the Model.
 *
 * Example:
 *
 *     studentSchema.pre(
 *         "save",
 *         function () {
 *             // ...
 *         }
 *     );
 *
 * ============================================================
 *
 * Covered later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. MODEL VS SCHEMA
 * ============================================================
 *
 *
 * SCHEMA
 *
 *     Defines:
 *
 *         structure
 *         types
 *         validation
 *         defaults
 *         indexes
 *         middleware
 *         methods
 *         statics
 *         virtuals
 *
 *
 * MODEL
 *
 *     Provides:
 *
 *         create
 *         find
 *         findOne
 *         findById
 *         update
 *         delete
 *         count
 *         aggregate
 *         populate
 *
 *
 * DOCUMENT
 *
 *     Represents one MongoDB document.
 *
 *     Example:
 *
 *         const student =
 *             new Student({
 *                 name: "Shiva"
 *             });
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. COMPLETE RELATIONSHIP
 * ============================================================
 *
 *
 * Schema
 *     │
 *     │ mongoose.model()
 *     ▼
 * Model
 *     │
 *     ├── Student.find()
 *     ├── Student.create()
 *     ├── Student.updateOne()
 *     ├── Student.deleteOne()
 *     │
 *     │ new Student()
 *     ▼
 * Document
 *     │
 *     ├── document.save()
 *     ├── document.validate()
 *     ├── document.deleteOne()
 *     └── document.populate()
 *     │
 *     ▼
 * MongoDB
 *     │
 *     ▼
 * students collection
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. EXPORT
 * ============================================================
 */

export {
  studentSchema,
  Student,
  facultySchema,
  Faculty,
  departmentSchema,
  Department,
  FacultyWithDepartment,
};
