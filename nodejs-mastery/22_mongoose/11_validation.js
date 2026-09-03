/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     11_validation.js
 *
 * Topic:
 *     Mongoose Validation
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. required
 *     2. trim
 *     3. lowercase
 *     4. min
 *     5. max
 *     6. minlength
 *     7. maxlength
 *     8. enum
 *     9. match
 *    10. validate
 *    11. custom validators
 *    12. validation errors
 *    13. ValidationError
 *    14. CastError
 *    15. validate before save
 *    16. validate()
 *    17. validateSync()
 *    18. update validators
 *    19. runValidators
 *    20. validation context
 *    21. validation messages
 *    22. conditional validation
 *    23. async validation
 *    24. production error handling
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
    /*
     * ------------------------------------------------------
     * REQUIRED
     * ------------------------------------------------------
     */

    name: {
      type: String,

      required: [true, "Student name is required"],

      trim: true,

      minlength: [2, "Name must contain at least 2 characters"],

      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    /*
     * ------------------------------------------------------
     * EMAIL
     * ------------------------------------------------------
     */

    email: {
      type: String,

      required: [true, "Email is required"],

      trim: true,

      lowercase: true,

      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

        "Please provide a valid email address",
      ],
    },

    /*
     * ------------------------------------------------------
     * AGE
     * ------------------------------------------------------
     */

    age: {
      type: Number,

      required: [true, "Age is required"],

      min: [16, "Age must be at least 16"],

      max: [100, "Age cannot exceed 100"],
    },

    /*
     * ------------------------------------------------------
     * CGPA
     * ------------------------------------------------------
     */

    cgpa: {
      type: Number,

      min: [0, "CGPA cannot be negative"],

      max: [10, "CGPA cannot exceed 10"],
    },

    /*
     * ------------------------------------------------------
     * SEMESTER
     * ------------------------------------------------------
     */

    semester: {
      type: Number,

      min: [1, "Semester must be at least 1"],

      max: [12, "Semester cannot exceed 12"],

      validate: {
        validator: Number.isInteger,

        message: "Semester must be an integer",
      },
    },

    /*
     * ------------------------------------------------------
     * DEPARTMENT
     * ------------------------------------------------------
     */

    department: {
      type: String,

      required: [true, "Department is required"],

      enum: {
        values: ["CSE", "ECE", "EEE", "ME", "CE", "IT"],

        message: "{VALUE} is not a valid department",
      },
    },

    /*
     * ------------------------------------------------------
     * PHONE
     * ------------------------------------------------------
     */

    phone: {
      type: String,

      trim: true,

      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"],
    },

    /*
     * ------------------------------------------------------
     * PASSWORD
     * ------------------------------------------------------
     *
     * This is only demonstrating validation.
     *
     * Never store a plain-text password.
     *
     */

    password: {
      type: String,

      minlength: [8, "Password must contain at least 8 characters"],

      maxlength: [128, "Password cannot exceed 128 characters"],
    },

    /*
     * ------------------------------------------------------
     * ACTIVE
     * ------------------------------------------------------
     */

    active: {
      type: Boolean,

      default: true,
    },

    /*
     * ------------------------------------------------------
     * DATE OF BIRTH
     * ------------------------------------------------------
     */

    dateOfBirth: {
      type: Date,

      validate: {
        validator: function (value) {
          if (!value) {
            return true;
          }

          return value < new Date();
        },

        message: "Date of birth must be in the past",
      },
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
  mongoose.models.ValidationStudent ||
  mongoose.model("ValidationStudent", studentSchema);

/*
 * ============================================================
 * REQUIRED
 * ============================================================
 */

/*
 * ============================================================
 * 4. REQUIRED FIELD
 * ============================================================
 */

async function requiredExample() {
  try {
    const student = new Student({
      age: 20,

      department: "CSE",
    });

    await student.save();
  } catch (error) {
    console.log("Validation failed:", error.message);
  }
}

/*
 * name and email are missing.
 *
 * Mongoose will reject the document.
 */

/*
 * ============================================================
 * 5. REQUIRED STRING
 * ============================================================
 */

async function requiredStringExample() {
  const student = new Student({
    name: "",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error);
  }
}

/*
 * ============================================================
 * TRIM
 * ============================================================
 */

async function trimExample() {
  const student = new Student({
    name: "   Shiva Ram   ",

    email: "   SHIVA@EXAMPLE.COM   ",

    age: 21,

    department: "CSE",
  });

  console.log(student.name);

  console.log(student.email);
}

/*
 * Output:
 *
 *     Shiva Ram
 *     shiva@example.com
 *
 */

/*
 * ============================================================
 * LOWERCASE
 * ============================================================
 */

async function lowercaseExample() {
  const student = new Student({
    name: "Shiva",

    email: "SHIVA@EXAMPLE.COM",

    age: 21,

    department: "CSE",
  });

  console.log(student.email);
}

/*
 * ============================================================
 * MIN / MAX
 * ============================================================
 */

/*
 * ============================================================
 * 6. NUMBER MINIMUM
 * ============================================================
 */

async function minExample() {
  const student = new Student({
    name: "Shiva",

    email: "shiva@example.com",

    age: 12,

    department: "CSE",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * 7. NUMBER MAXIMUM
 * ============================================================
 */

async function maxExample() {
  const student = new Student({
    name: "Shiva",

    email: "shiva@example.com",

    age: 150,

    department: "CSE",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * MINLENGTH / MAXLENGTH
 * ============================================================
 */

/*
 * ============================================================
 * 8. STRING LENGTH
 * ============================================================
 */

async function stringLengthExample() {
  const student = new Student({
    name: "A",

    email: "a@example.com",

    age: 20,

    department: "CSE",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * ENUM
 * ============================================================
 */

/*
 * ============================================================
 * 9. ENUM VALIDATION
 * ============================================================
 */

async function enumExample() {
  const student = new Student({
    name: "Shiva",

    email: "shiva@example.com",

    age: 21,

    department: "MEDICAL",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * MATCH
 * ============================================================
 */

/*
 * ============================================================
 * 10. REGEX VALIDATION
 * ============================================================
 */

async function matchExample() {
  const student = new Student({
    name: "Shiva",

    email: "not-an-email",

    age: 21,

    department: "CSE",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * CUSTOM VALIDATOR
 * ============================================================
 */

/*
 * ============================================================
 * 11. CUSTOM VALIDATOR
 * ============================================================
 */

const facultyCodeSchema = new mongoose.Schema({
  code: {
    type: String,

    validate: {
      validator: function (value) {
        return /^FAC-\d{4}$/.test(value);
      },

      message: "Faculty code must be in FAC-1234 format",
    },
  },
});

const FacultyCode =
  mongoose.models.ValidationFacultyCode ||
  mongoose.model("ValidationFacultyCode", facultyCodeSchema);

async function customValidatorExample() {
  const faculty = new FacultyCode({
    code: "INVALID",
  });

  try {
    await faculty.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * 12. VALIDATOR FUNCTION WITH THIS
 * ============================================================
 */

const scholarshipSchema = new mongoose.Schema({
  percentage: {
    type: Number,

    min: 0,

    max: 100,

    validate: {
      validator: function (value) {
        /*
         * Example:
         *
         * Scholarship percentage must be
         * a multiple of 5.
         */

        return value % 5 === 0;
      },

      message: "Scholarship percentage must be a multiple of 5",
    },
  },
});

const Scholarship =
  mongoose.models.ValidationScholarship ||
  mongoose.model("ValidationScholarship", scholarshipSchema);

/*
 * ============================================================
 * 13. ASYNC VALIDATOR
 * ============================================================
 *
 * Validators can also return a Promise.
 *
 * ============================================================
 */

const usernameSchema = new mongoose.Schema({
  username: {
    type: String,

    validate: {
      validator: async function (value) {
        /*
         * Simulated asynchronous operation.
         *
         * In a real application this could check
         * another collection or external service.
         */

        await new Promise((resolve) => setTimeout(resolve, 10));

        return value !== "admin";
      },

      message: "This username is reserved",
    },
  },
});

const Username =
  mongoose.models.ValidationUsername ||
  mongoose.model("ValidationUsername", usernameSchema);

/*
 * ============================================================
 * 14. ASYNC VALIDATOR EXAMPLE
 * ============================================================
 */

async function asyncValidatorExample() {
  const user = new Username({
    username: "admin",
  });

  try {
    await user.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * VALIDATION ERROR
 * ============================================================
 */

/*
 * ============================================================
 * 15. VALIDATION ERROR STRUCTURE
 * ============================================================
 */

async function validationErrorExample() {
  const student = new Student({
    name: "A",

    email: "invalid",

    age: 10,

    department: "INVALID",
  });

  try {
    await student.validate();
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.log("ValidationError");

      console.log("Message:", error.message);

      console.log("Errors:", error.errors);
    }
  }
}

/*
 * ============================================================
 * 16. FIELD-LEVEL ERRORS
 * ============================================================
 */

async function fieldErrorsExample() {
  const student = new Student({
    name: "A",

    email: "invalid",

    age: 10,

    department: "INVALID",
  });

  try {
    await student.validate();
  } catch (error) {
    for (const [field, validationError] of Object.entries(error.errors)) {
      console.log({
        field,

        message: validationError.message,

        kind: validationError.kind,

        value: validationError.value,

        path: validationError.path,
      });
    }
  }
}

/*
 * ============================================================
 * 17. ERROR KINDS
 * ============================================================
 *
 * Common values:
 *
 *     required
 *     min
 *     max
 *     minlength
 *     maxlength
 *     enum
 *     regexp
 *     user defined
 *
 * ============================================================
 */

/*
 * ============================================================
 * validate()
 * ============================================================
 */

/*
 * ============================================================
 * 18. ASYNC VALIDATION
 * ============================================================
 */

async function validateExample() {
  const student = new Student({
    name: "Shiva Ram",

    email: "shiva@example.com",

    age: 21,

    department: "CSE",

    semester: 6,

    cgpa: 8.9,
  });

  await student.validate();

  console.log("Document is valid");
}

/*
 * ============================================================
 * validateSync()
 * ============================================================
 */

/*
 * ============================================================
 * 19. SYNCHRONOUS VALIDATION
 * ============================================================
 */

function validateSyncExample() {
  const student = new Student({
    name: "A",

    email: "invalid",

    age: 10,

    department: "INVALID",
  });

  const error = student.validateSync();

  if (error) {
    console.log("Validation failed");

    console.log(error.errors);
  }
}

/*
 * ============================================================
 * validate() vs validateSync()
 * ============================================================
 *
 * validate()
 *
 *     asynchronous
 *
 *
 * validateSync()
 *
 *     synchronous
 *
 *
 * Use validate() when async validators may be involved.
 *
 */

/*
 * ============================================================
 * SAVE VALIDATION
 * ============================================================
 */

/*
 * ============================================================
 * 20. SAVE AUTOMATICALLY VALIDATES
 * ============================================================
 */

async function saveValidationExample() {
  const student = new Student({
    name: "A",

    email: "invalid",

    age: 10,

    department: "INVALID",
  });

  try {
    await student.save();
  } catch (error) {
    console.log("Save failed because validation failed");
  }
}

/*
 * ============================================================
 * UPDATE VALIDATION
 * ============================================================
 *
 * Important:
 *
 * Validation behavior during update is different from
 * validation during document creation.
 *
 * For update validators, use:
 *
 *     runValidators: true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. UPDATE WITHOUT runValidators
 * ============================================================
 */

async function updateWithoutValidators(studentId) {
  return Student.findByIdAndUpdate(
    studentId,

    {
      cgpa: 500,
    },

    {
      new: true,
    },
  ).exec();
}

/*
 * Depending on the operation/schema, update validation is
 * not automatically equivalent to document save validation.
 *
 */

/*
 * ============================================================
 * 22. UPDATE WITH runValidators
 * ============================================================
 */

async function updateWithValidators(studentId) {
  return Student.findByIdAndUpdate(
    studentId,

    {
      cgpa: 500,
    },

    {
      new: true,

      runValidators: true,
    },
  ).exec();
}

/*
 * Now:
 *
 *     cgpa = 500
 *
 * violates:
 *
 *     max = 10
 *
 * and Mongoose will reject the update.
 */

/*
 * ============================================================
 * 23. updateOne WITH VALIDATION
 * ============================================================
 */

async function updateOneWithValidation(studentId) {
  return Student.updateOne(
    {
      _id: studentId,
    },

    {
      $set: {
        cgpa: 500,
      },
    },

    {
      runValidators: true,
    },
  ).exec();
}

/*
 * ============================================================
 * CONDITIONAL VALIDATION
 * ============================================================
 */

/*
 * ============================================================
 * 24. CONDITIONAL REQUIRED
 * ============================================================
 */

const conditionalSchema = new mongoose.Schema({
  type: {
    type: String,

    enum: ["student", "faculty"],

    required: true,
  },

  studentId: {
    type: String,

    required: function () {
      return this.type === "student";
    },
  },

  employeeId: {
    type: String,

    required: function () {
      return this.type === "faculty";
    },
  },
});

const Conditional =
  mongoose.models.ValidationConditional ||
  mongoose.model("ValidationConditional", conditionalSchema);

/*
 * ============================================================
 * 25. CONDITIONAL VALIDATION EXAMPLE
 * ============================================================
 */

async function conditionalValidationExample() {
  const student = new Conditional({
    type: "student",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.message);
  }
}

/*
 * ============================================================
 * CAST ERROR
 * ============================================================
 *
 * Validation and casting are related but different.
 *
 * ============================================================
 */

async function castErrorExample() {
  const student = new Student({
    name: "Shiva",

    email: "shiva@example.com",

    age: "not-a-number",

    department: "CSE",
  });

  try {
    await student.validate();
  } catch (error) {
    console.log(error.errors.age);
  }
}

/*
 * ============================================================
 * VALIDATION + API ERROR HANDLING
 * ============================================================
 */

/*
 * ============================================================
 * 26. CONVERT MONGOOSE ERROR TO API ERROR
 * ============================================================
 */

function formatValidationError(error) {
  if (!(error instanceof mongoose.Error.ValidationError)) {
    return null;
  }

  const fields = {};

  for (const [field, fieldError] of Object.entries(error.errors)) {
    fields[field] = {
      message: fieldError.message,

      value: fieldError.value,

      kind: fieldError.kind,
    };
  }

  return {
    code: "VALIDATION_ERROR",

    message: "Request validation failed",

    fields,
  };
}

/*
 * ============================================================
 * 27. PRODUCTION-SAFE VALIDATION HANDLER
 * ============================================================
 */

function handleMongooseError(error) {
  if (error instanceof mongoose.Error.ValidationError) {
    return {
      statusCode: 400,

      body: formatValidationError(error),
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      statusCode: 400,

      body: {
        code: "INVALID_VALUE",

        message: `Invalid value for ${error.path}`,
      },
    };
  }

  return {
    statusCode: 500,

    body: {
      code: "INTERNAL_SERVER_ERROR",

      message: "Internal server error",
    },
  };
}

/*
 * ============================================================
 * 28. VALIDATE BEFORE DATABASE OPERATION
 * ============================================================
 */

async function createStudent(data) {
  const student = new Student(data);

  /*
   * Explicit validation.
   */

  await student.validate();

  /*
   * Only save after validation succeeds.
   */

  return student.save();
}

/*
 * ============================================================
 * 29. VALIDATION HELPER
 * ============================================================
 */

async function validateStudent(data) {
  const student = new Student(data);

  try {
    await student.validate();

    return {
      valid: true,

      errors: null,
    };
  } catch (error) {
    return {
      valid: false,

      errors: formatValidationError(error),
    };
  }
}

/*
 * ============================================================
 * 30. DEMO
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    /*
     * --------------------------------------------------------
     * Valid document
     * --------------------------------------------------------
     */

    const validStudent = await validateStudent({
      name: "Shiva Ram",

      email: "SHIVA@EXAMPLE.COM",

      age: 21,

      department: "CSE",

      semester: 6,

      cgpa: 8.9,

      phone: "9876543210",
    });

    console.log("\nValid student:", validStudent);

    /*
     * --------------------------------------------------------
     * Invalid document
     * --------------------------------------------------------
     */

    const invalidStudent = await validateStudent({
      name: "A",

      email: "wrong-email",

      age: 10,

      department: "MEDICAL",

      semester: 20,

      cgpa: 50,
    });

    console.log("\nInvalid student:", invalidStudent);

    /*
     * --------------------------------------------------------
     * validateSync()
     * --------------------------------------------------------
     */

    validateSyncExample();

    /*
     * --------------------------------------------------------
     * Custom validator
     * --------------------------------------------------------
     */

    await customValidatorExample();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 31. RUN
 * ============================================================
 */

await main();

/*
 * ============================================================
 * END
 * ============================================================
 */
