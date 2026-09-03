/**
 * ============================================================
 * 33_discriminators.js
 * ============================================================
 *
 * Mongoose Discriminators
 *
 * Topics:
 *
 *  1. Base schema
 *  2. Base model
 *  3. Discriminator
 *  4. discriminatorKey
 *  5. Child-specific fields
 *  6. Creating documents
 *  7. Querying child models
 *  8. Querying base model
 *  9. Multiple discriminators
 * 10. Instance methods
 * 11. Static methods
 * 12. Middleware
 * 13. Indexes
 * 14. Nested discriminators
 * 15. Embedded discriminators
 * 16. Discriminator limitations
 * 17. Production structure
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
 * 2. BASE SCHEMA
 * ============================================================
 */

const employeeSchema = new mongoose.Schema(
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
    },

    department: {
      type: String,

      required: true,
    },

    joinedAt: {
      type: Date,

      default: Date.now,
    },
  },

  {
    timestamps: true,

    /*
     * This field tells Mongoose
     * which discriminator created
     * the document.
     */

    discriminatorKey: "employeeType",
  },
);

/*
 * ============================================================
 * 3. BASE MODEL
 * ============================================================
 */

const Employee =
  mongoose.models.DiscriminatorEmployee ||
  mongoose.model("DiscriminatorEmployee", employeeSchema);

/*
 * ============================================================
 * 4. FACULTY DISCRIMINATOR
 * ============================================================
 */

const facultySchema = new mongoose.Schema({
  employeeId: {
    type: String,

    required: true,
  },

  designation: {
    type: String,

    required: true,
  },

  subjects: {
    type: [String],

    default: [],
  },

  experience: {
    type: Number,

    default: 0,
  },
});

const Faculty = Employee.discriminator(
  "Faculty",

  facultySchema,
);

/*
 * ============================================================
 * 5. ADMIN DISCRIMINATOR
 * ============================================================
 */

const administratorSchema = new mongoose.Schema({
  employeeId: {
    type: String,

    required: true,
  },

  permissions: {
    type: [String],

    default: [],
  },

  level: {
    type: Number,

    default: 1,
  },
});

const Administrator = Employee.discriminator(
  "Administrator",

  administratorSchema,
);

/*
 * ============================================================
 * 6. STUDENT DISCRIMINATOR
 * ============================================================
 */

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,

    required: true,
  },

  year: {
    type: Number,

    required: true,
  },

  branch: {
    type: String,

    required: true,
  },
});

const Student = Employee.discriminator(
  "Student",

  studentSchema,
);

/*
 * ============================================================
 * 7. CREATE FACULTY
 * ============================================================
 */

async function createFaculty() {
  const faculty = await Faculty.create({
    name: "Dr. Kumar",

    email: "kumar@example.com",

    department: "CSE",

    employeeId: "FAC001",

    designation: "Professor",

    subjects: ["DBMS", "Operating Systems", "Computer Networks"],

    experience: 12,
  });

  console.log(faculty);

  return faculty;
}

/*
 * ============================================================
 * 8. CREATE ADMINISTRATOR
 * ============================================================
 */

async function createAdministrator() {
  const admin = await Administrator.create({
    name: "Ravi",

    email: "ravi@example.com",

    department: "Administration",

    employeeId: "ADM001",

    permissions: ["USER_READ", "USER_WRITE", "REPORT_READ"],

    level: 2,
  });

  return admin;
}

/*
 * ============================================================
 * 9. CREATE STUDENT
 * ============================================================
 */

async function createStudent() {
  const student = await Student.create({
    name: "Arjun",

    email: "arjun@example.com",

    department: "CSE",

    rollNumber: "23CSE001",

    year: 3,

    branch: "Computer Science",
  });

  return student;
}

/*
 * ============================================================
 * 10. DISCRIMINATOR KEY
 * ============================================================
 */

async function showDiscriminatorKey() {
  const faculty = await Faculty.create({
    name: "Faculty Example",

    email: `faculty-${Date.now()}@example.com`,

    department: "CSE",

    employeeId: `FAC-${Date.now()}`,

    designation: "Assistant Professor",
  });

  console.log(faculty.employeeType);
}

/*
 * ============================================================
 * 11. RAW DOCUMENT
 * ============================================================
 *
 * MongoDB document roughly looks like:
 *
 * {
 *
 *   _id: ...,
 *
 *   name: "Dr. Kumar",
 *
 *   email: "...",
 *
 *   department: "CSE",
 *
 *   employeeId: "FAC001",
 *
 *   designation: "Professor",
 *
 *   employeeType: "Faculty"
 *
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. QUERY FACULTY
 * ============================================================
 */

async function findFaculty() {
  const faculty = await Faculty.find();

  console.log(faculty);

  return faculty;
}

/*
 * ============================================================
 * 13. QUERY STUDENTS
 * ============================================================
 */

async function findStudents() {
  const students = await Student.find();

  return students;
}

/*
 * ============================================================
 * 14. QUERY ALL EMPLOYEES
 * ============================================================
 *
 * Base model can query documents
 * from all discriminators.
 *
 * ============================================================
 */

async function findAllEmployees() {
  const employees = await Employee.find();

  console.log(employees);

  return employees;
}

/*
 * ============================================================
 * 15. QUERY SPECIFIC TYPE USING BASE MODEL
 * ============================================================
 */

async function findFacultyUsingBaseModel() {
  const faculty = await Employee.find({
    employeeType: "Faculty",
  });

  return faculty;
}

/*
 * ============================================================
 * 16. FIND ONE FACULTY
 * ============================================================
 */

async function findOneFaculty(email) {
  return Faculty.findOne({
    email,
  });
}

/*
 * ============================================================
 * 17. UPDATE FACULTY
 * ============================================================
 */

async function updateFaculty(id) {
  return Faculty.findByIdAndUpdate(
    id,

    {
      $inc: {
        experience: 1,
      },
    },

    {
      new: true,

      runValidators: true,
    },
  );
}

/*
 * ============================================================
 * 18. DELETE FACULTY
 * ============================================================
 */

async function deleteFaculty(id) {
  return Faculty.findByIdAndDelete(id);
}

/*
 * ============================================================
 * 19. CHILD INSTANCE METHODS
 * ============================================================
 */

facultySchema.methods.getFacultyInfo = function () {
  return {
    name: this.name,

    designation: this.designation,

    experience: this.experience,
  };
};

/*
 * IMPORTANT:
 *
 * In real code, methods should be
 * defined BEFORE creating the
 * discriminator model.
 *
 * This section demonstrates
 * the concept, but production code
 * should define methods first.
 */

/*
 * ============================================================
 * 20. STATIC METHODS
 * ============================================================
 */

const facultySchemaWithMethods = new mongoose.Schema({
  employeeId: String,

  designation: String,

  experience: Number,
});

facultySchemaWithMethods.statics.findProfessors = function () {
  return this.find({
    designation: "Professor",
  });
};

/*
 * ============================================================
 * 21. DISCRIMINATOR MIDDLEWARE
 * ============================================================
 */

const teacherSchema = new mongoose.Schema({
  teacherCode: String,
});

teacherSchema.pre("save", function (next) {
  console.log("Faculty/teacher pre-save middleware");

  next();
});

/*
 * ============================================================
 * 22. EMBEDDED DISCRIMINATOR
 * ============================================================
 *
 * Discriminators can also be used
 * for subdocuments.
 *
 * ============================================================
 */

const eventSchema = new mongoose.Schema({
  type: String,

  description: String,
});

const meetingSchema = new mongoose.Schema({
  attendees: Number,

  room: String,
});

const examSchema = new mongoose.Schema({
  subject: String,

  duration: Number,
});

/*
 * ============================================================
 * 23. BASE EVENT SCHEMA
 * ============================================================
 */

const scheduleSchema = new mongoose.Schema({
  name: String,

  events: [eventSchema],
});

/*
 * ============================================================
 * 24. EMBEDDED DISCRIMINATORS
 * ============================================================
 */

const eventDiscriminator = scheduleSchema.path("events");

const Meeting = eventDiscriminator.discriminator(
  "Meeting",

  meetingSchema,
);

const Exam = eventDiscriminator.discriminator(
  "Exam",

  examSchema,
);

/*
 * ============================================================
 * 25. SCHEDULE MODEL
 * ============================================================
 */

const Schedule =
  mongoose.models.DiscriminatorSchedule ||
  mongoose.model("DiscriminatorSchedule", scheduleSchema);

/*
 * ============================================================
 * 26. CREATE EMBEDDED DISCRIMINATORS
 * ============================================================
 */

async function createSchedule() {
  const schedule = await Schedule.create({
    name: "CSE Schedule",

    events: [
      {
        type: "Meeting",

        description: "Faculty meeting",

        attendees: 15,

        room: "Seminar Hall",
      },

      {
        type: "Exam",

        description: "DBMS examination",

        subject: "DBMS",

        duration: 180,
      },
    ],
  });

  return schedule;
}

/*
 * ============================================================
 * 27. DISCRIMINATOR WITH INDEX
 * ============================================================
 */

const facultyIndexedSchema = new mongoose.Schema({
  facultyCode: {
    type: String,

    required: true,
  },
});

facultyIndexedSchema.index({
  facultyCode: 1,
});

/*
 * ============================================================
 * 28. DISCRIMINATOR OPTIONS
 * ============================================================
 */

const vehicleSchema = new mongoose.Schema(
  {
    name: String,

    manufacturer: String,
  },

  {
    discriminatorKey: "vehicleType",
  },
);

const Vehicle =
  mongoose.models.DiscriminatorVehicle ||
  mongoose.model("DiscriminatorVehicle", vehicleSchema);

const carSchema = new mongoose.Schema({
  doors: Number,

  fuelType: String,
});

const Car = Vehicle.discriminator(
  "Car",

  carSchema,
);

const bikeSchema = new mongoose.Schema({
  engineCC: Number,

  hasCarrier: Boolean,
});

const Bike = Vehicle.discriminator(
  "Bike",

  bikeSchema,
);

/*
 * ============================================================
 * 29. CREATE CAR
 * ============================================================
 */

async function createCar() {
  return Car.create({
    name: "City",

    manufacturer: "Example Motors",

    doors: 4,

    fuelType: "Petrol",
  });
}

/*
 * ============================================================
 * 30. CREATE BIKE
 * ============================================================
 */

async function createBike() {
  return Bike.create({
    name: "Street",

    manufacturer: "Example Bikes",

    engineCC: 160,

    hasCarrier: true,
  });
}

/*
 * ============================================================
 * 31. DISCRIMINATOR QUERY
 * ============================================================
 */

async function vehicleDemo() {
  await createCar();

  await createBike();

  const cars = await Car.find();

  const bikes = await Bike.find();

  const vehicles = await Vehicle.find();

  console.log("Cars:", cars);

  console.log("Bikes:", bikes);

  console.log("All vehicles:", vehicles);
}

/*
 * ============================================================
 * 32. TYPE CHECKING
 * ============================================================
 */

async function typeCheckDemo() {
  const faculty = await Faculty.findOne();

  if (!faculty) {
    return;
  }

  console.log("Type:", faculty.employeeType);

  console.log("Model:", faculty.constructor.modelName);
}

/*
 * ============================================================
 * 33. BASE MODEL VS DISCRIMINATOR
 * ============================================================
 */

async function comparisonDemo() {
  /*
   * Base model:
   */

  const employees = await Employee.find();

  /*
   * Faculty model:
   */

  const faculty = await Faculty.find();

  /*
   * Student model:
   */

  const students = await Student.find();

  console.log({
    employees,
    faculty,
    students,
  });
}

/*
 * ============================================================
 * 34. PRODUCTION PATTERN
 * ============================================================
 */

const personSchema = new mongoose.Schema(
  {
    name: String,

    email: String,
  },

  {
    discriminatorKey: "role",

    timestamps: true,
  },
);

const Person =
  mongoose.models.DiscriminatorPerson ||
  mongoose.model("DiscriminatorPerson", personSchema);

const teacherSchemaProduction = new mongoose.Schema({
  employeeNumber: String,

  subjects: [String],
});

const Teacher = Person.discriminator(
  "Teacher",

  teacherSchemaProduction,
);

const studentSchemaProduction = new mongoose.Schema({
  rollNumber: String,

  semester: Number,
});

const StudentProduction = Person.discriminator(
  "Student",

  studentSchemaProduction,
);

/*
 * ============================================================
 * 35. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  /*
   * Run examples individually.
   */

  // await createFaculty();

  // await createAdministrator();

  // await createStudent();

  // await findAllEmployees();

  // await findFaculty();

  // await findStudents();

  // await vehicleDemo();

  // await createSchedule();

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
