/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/03_documents.js
 *
 * Topic:
 *     MongoDB Documents, BSON, _id and ObjectId
 *
 * ============================================================
 *
 * MongoDB stores data as BSON documents.
 *
 * Conceptually:
 *
 *     Database
 *        │
 *        ▼
 *     Collection
 *        │
 *        ▼
 *     Document
 *        │
 *        ├── field
 *        ├── field
 *        ├── array
 *        └── nested document
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. IMPORT
 * ============================================================
 */

import { MongoClient, ObjectId } from "mongodb";

/*
 * ============================================================
 * 2. CONNECTION
 * ============================================================
 */

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "timetable";

const client = new MongoClient(URI);

/*
 * ============================================================
 * 3. BASIC DOCUMENT
 * ============================================================
 *
 * A MongoDB document looks similar to a JavaScript object.
 *
 * ============================================================
 */

const user = {
  name: "Shiva",

  age: 22,

  department: "CSE",

  active: true,
};

/*
 * ============================================================
 * 4. DOCUMENT IN A COLLECTION
 * ============================================================
 *
 * Example conceptual structure:
 *
 *
 * users collection
 *
 * {
 *   name: "Shiva",
 *   age: 22,
 *   department: "CSE",
 *   active: true
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. BSON
 * ============================================================
 *
 * BSON means:
 *
 *
 *     Binary JSON
 *
 *
 * It is the format MongoDB uses to store documents.
 *
 *
 * BSON supports normal JSON-like values plus additional types:
 *
 *
 *     string
 *     number
 *     boolean
 *     null
 *     object
 *     array
 *     ObjectId
 *     Date
 *     Binary
 *     Decimal128
 *     Int32
 *     Int64
 *     Timestamp
 *     Regex
 *     MinKey
 *     MaxKey
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. STRING
 * ============================================================
 */

const stringExample = {
  name: "Shiva",
};

/*
 * ============================================================
 * 7. NUMBER
 * ============================================================
 */

const numberExample = {
  age: 22,

  score: 95.5,
};

/*
 * ============================================================
 * 8. BOOLEAN
 * ============================================================
 */

const booleanExample = {
  active: true,

  verified: false,
};

/*
 * ============================================================
 * 9. NULL
 * ============================================================
 */

const nullExample = {
  middleName: null,
};

/*
 * ============================================================
 * 10. ARRAY
 * ============================================================
 */

const arrayExample = {
  skills: ["Python", "Node.js", "MongoDB"],
};

/*
 * ============================================================
 * 11. NESTED DOCUMENT
 * ============================================================
 */

const nestedExample = {
  name: "Shiva",

  address: {
    city: "Vijayawada",

    state: "Andhra Pradesh",

    country: "India",
  },
};

/*
 * ============================================================
 * 12. ARRAY OF DOCUMENTS
 * ============================================================
 */

const arrayOfDocuments = {
  name: "CSE",

  subjects: [
    {
      code: "CS501",

      name: "DBMS",
    },

    {
      code: "CS502",

      name: "Operating Systems",
    },
  ],
};

/*
 * ============================================================
 * 13. _id
 * ============================================================
 *
 * MongoDB documents normally have a unique:
 *
 *
 *     _id
 *
 *
 * field.
 *
 * Example:
 *
 *
 * {
 *   _id: ObjectId("..."),
 *   name: "Shiva"
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. AUTOMATIC _id
 * ============================================================
 *
 * If you insert a document without _id:
 *
 *
 *     MongoDB automatically generates one.
 *
 * ============================================================
 */

async function automaticIdExample() {
  const db = client.db(DATABASE_NAME);

  const users = db.collection("users");

  const result = await users.insertOne({
    name: "Shiva",

    department: "CSE",
  });

  console.log(result.insertedId);
}

/*
 * ============================================================
 * 15. ObjectId
 * ============================================================
 *
 * The default MongoDB identifier is commonly ObjectId.
 *
 *
 * Example:
 *
 *
 *     ObjectId("68...")
 *
 *
 * ============================================================
 */

const id = new ObjectId();

console.log(id);

/*
 * ============================================================
 * 16. ObjectId AS A VALUE
 * ============================================================
 */

const faculty = {
  _id: new ObjectId(),

  name: "Dr. Rao",

  department: "CSE",
};

/*
 * ============================================================
 * 17. ObjectId STRING CONVERSION
 * ============================================================
 */

const objectId = new ObjectId();

const stringId = objectId.toString();

console.log(stringId);

/*
 * ============================================================
 * 18. STRING → ObjectId
 * ============================================================
 */

const idString = "507f1f77bcf86cd799439011";

const convertedId = new ObjectId(idString);

console.log(convertedId);

/*
 * ============================================================
 * 19. VALIDATE ObjectId STRING
 * ============================================================
 *
 * API route parameters commonly arrive as strings:
 *
 *
 *     /users/:id
 *
 *
 * Therefore validate before converting.
 *
 * ============================================================
 */

function parseObjectId(value) {
  if (!ObjectId.isValid(value)) {
    throw new Error("Invalid ObjectId");
  }

  return new ObjectId(value);
}

/*
 * ============================================================
 * 20. API EXAMPLE
 * ============================================================
 */

function getUserIdFromRequest(req) {
  return parseObjectId(req.params.id);
}

/*
 * ============================================================
 * 21. ObjectId IS NOT JUST A RANDOM STRING
 * ============================================================
 *
 * ObjectId is a BSON type.
 *
 *
 * These are different:
 *
 *
 * {
 *   _id: ObjectId("...")
 * }
 *
 *
 * and:
 *
 *
 * {
 *   _id: "..."
 * }
 *
 *
 * Even if the textual value looks identical, the BSON types
 * differ.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. IMPORTANT QUERY MISTAKE
 * ============================================================
 *
 * Suppose MongoDB contains:
 *
 *
 * {
 *   _id: ObjectId("507f1f77bcf86cd799439011")
 * }
 *
 *
 * This may NOT match:
 *
 *
 * {
 *   _id: "507f1f77bcf86cd799439011"
 * }
 *
 *
 * because:
 *
 *
 * ObjectId != String
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CORRECT QUERY
 * ============================================================
 */

async function findUserById(idString) {
  const _id = parseObjectId(idString);

  const db = client.db(DATABASE_NAME);

  return db.collection("users").findOne({
    _id,
  });
}

/*
 * ============================================================
 * 24. DATES
 * ============================================================
 *
 * MongoDB supports BSON Date.
 *
 * JavaScript:
 *
 *
 *     new Date()
 *
 *
 * is stored as a BSON date.
 *
 * ============================================================
 */

const documentWithDates = {
  name: "Timetable",

  createdAt: new Date(),

  updatedAt: new Date(),
};

/*
 * ============================================================
 * 25. ALWAYS STORE TIME IN A CONSISTENT FORMAT
 * ============================================================
 *
 * For application timestamps, Date/BSON Date is usually
 * preferable to manually formatted strings.
 *
 *
 * Prefer:
 *
 *
 *     createdAt: new Date()
 *
 *
 * rather than:
 *
 *
 *     createdAt: "03-09-2026"
 *
 *
 * because Date values can be sorted and queried naturally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. NESTED OBJECTS
 * ============================================================
 *
 * MongoDB supports nested documents naturally.
 *
 * ============================================================
 */

const student = {
  name: "Shiva",

  profile: {
    department: "CSE",

    semester: 5,

    section: "A",
  },
};

/*
 * ============================================================
 * 27. QUERY NESTED FIELD
 * ============================================================
 *
 * Dot notation:
 *
 *
 *     "profile.department"
 *
 * ============================================================
 */

async function findCSEStudents() {
  const db = client.db(DATABASE_NAME);

  return db
    .collection("students")
    .find({
      "profile.department": "CSE",
    })
    .toArray();
}

/*
 * ============================================================
 * 28. NESTED ARRAYS
 * ============================================================
 */

const timetable = {
  name: "CSE Semester 5",

  periods: [
    {
      day: "Monday",

      subject: "DBMS",

      faculty: "Dr. Rao",
    },

    {
      day: "Tuesday",

      subject: "OS",

      faculty: "Dr. Kumar",
    },
  ],
};

/*
 * ============================================================
 * 29. ARRAY QUERY
 * ============================================================
 *
 * Find timetables containing a Monday period.
 *
 * ============================================================
 */

async function findMondayTimetables() {
  const db = client.db(DATABASE_NAME);

  return db
    .collection("timetables")
    .find({
      "periods.day": "Monday",
    })
    .toArray();
}

/*
 * ============================================================
 * 30. DOCUMENT REFERENCES
 * ============================================================
 *
 * Instead of embedding:
 *
 *
 * {
 *   subject: {
 *     name: "DBMS",
 *     code: "CS501"
 *   }
 * }
 *
 *
 * you can reference another document:
 *
 *
 * {
 *   subjectId: ObjectId("...")
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. EMBEDDING
 * ============================================================
 *
 * Example:
 */

const embeddedPeriod = {
  day: "Monday",

  time: {
    start: "09:00",

    end: "10:00",
  },

  subject: {
    code: "CS501",

    name: "DBMS",
  },
};

/*
 * ============================================================
 * 32. REFERENCING
 * ============================================================
 */

const referencedPeriod = {
  day: "Monday",

  time: {
    start: "09:00",

    end: "10:00",
  },

  subjectId: new ObjectId(),
};

/*
 * ============================================================
 * 33. EMBED OR REFERENCE?
 * ============================================================
 *
 * EMBED when:
 *
 *     data belongs to parent
 *     data is read together
 *     data has bounded size
 *     child doesn't need independent lifecycle
 *
 *
 * REFERENCE when:
 *
 *     data is shared
 *     data is independently accessed
 *     data changes independently
 *     embedded data would become too large
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. EXAMPLE
 * ============================================================
 *
 * Faculty information:
 *
 *
 * faculty
 * {
 *   _id: ...,
 *   name: "Dr. Rao",
 *   email: "...",
 *   departmentId: ...
 * }
 *
 *
 * timetable:
 *
 * {
 *   _id: ...,
 *   facultyId: ...
 * }
 *
 *
 * Reference is useful because one faculty member can appear
 * in many timetable documents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. DOCUMENT SIZE
 * ============================================================
 *
 * MongoDB documents have a maximum BSON document size.
 *
 *
 * Therefore avoid designing documents with unbounded growth.
 *
 *
 * BAD conceptual design:
 *
 *
 * {
 *   userId: "...",
 *
 *   everyMessageEverSent: [
 *      ...
 *   ]
 * }
 *
 *
 * The array could grow indefinitely.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. UNBOUNDED ARRAYS
 * ============================================================
 *
 * Be careful with:
 *
 *
 *     comments[]
 *     messages[]
 *     logs[]
 *     events[]
 *     history[]
 *
 *
 * if they can grow indefinitely.
 *
 *
 * Instead, consider separate collections:
 *
 *
 * messages
 * events
 * logs
 * history
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. DOCUMENT DESIGN SHOULD FOLLOW ACCESS PATTERNS
 * ============================================================
 *
 * Ask:
 *
 *
 *     What do I read together?
 *
 *     What do I update together?
 *
 *     What grows independently?
 *
 *     What is shared?
 *
 *     What needs separate indexing?
 *
 *
 * These questions determine whether data should be embedded or
 * referenced.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. INSERT ONE DOCUMENT
 * ============================================================
 */

async function insertOneDocument() {
  const db = client.db(DATABASE_NAME);

  const result = await db.collection("students").insertOne({
    name: "Shiva",

    department: "CSE",

    semester: 5,

    active: true,

    createdAt: new Date(),
  });

  console.log({
    insertedId: result.insertedId,
  });
}

/*
 * ============================================================
 * 39. INSERT MANY DOCUMENTS
 * ============================================================
 */

async function insertManyDocuments() {
  const db = client.db(DATABASE_NAME);

  const result = await db.collection("students").insertMany([
    {
      name: "Student One",

      department: "CSE",

      semester: 5,
    },

    {
      name: "Student Two",

      department: "CSE",

      semester: 5,
    },

    {
      name: "Student Three",

      department: "ECE",

      semester: 5,
    },
  ]);

  console.log(result.insertedIds);
}

/*
 * ============================================================
 * 40. MANUAL _id
 * ============================================================
 *
 * You can provide your own identifier.
 *
 * ============================================================
 */

async function manualId() {
  const db = client.db(DATABASE_NAME);

  const id = new ObjectId();

  await db.collection("students").insertOne({
    _id: id,

    name: "Shiva",
  });
}

/*
 * ============================================================
 * 41. CUSTOM STRING ID
 * ============================================================
 *
 * MongoDB does not require _id to be ObjectId.
 *
 * Example:
 */

const customIdDocument = {
  _id: "student-001",

  name: "Shiva",
};

/*
 * ============================================================
 * 42. BUT BE CONSISTENT
 * ============================================================
 *
 * Don't randomly mix:
 *
 *
 * ObjectId
 * UUID
 * string IDs
 * numeric IDs
 *
 *
 * Choose an ID strategy appropriate to the application and use
 * it consistently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. UUID-STYLE IDENTIFIERS
 * ============================================================
 *
 * Some systems use UUIDs instead of ObjectId.
 *
 * Example:
 */

const uuidStyleDocument = {
  _id: crypto.randomUUID(),

  name: "Shiva",
};

/*
 * ============================================================
 * 44. DOCUMENT IMMUTABILITY
 * ============================================================
 *
 * MongoDB documents are mutable.
 *
 *
 * You can update fields after insertion.
 *
 *
 * But _id is special:
 *
 *
 *     _id cannot be changed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. FIELD NAMES
 * ============================================================
 *
 * Use clear field names.
 *
 *
 * Good:
 *
 *     organizationId
 *     departmentId
 *     createdAt
 *     updatedAt
 *
 *
 * Avoid confusing abbreviations:
 *
 *     org
 *     dept
 *     crt
 *     upd
 *
 *
 * unless your project has a deliberate convention.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. TIMETABLE DOCUMENT EXAMPLE
 * ============================================================
 */

const timetableDocument = {
  _id: new ObjectId(),

  organizationId: new ObjectId(),

  departmentId: new ObjectId(),

  name: "CSE Semester 5",

  semester: 5,

  academicYear: "2026-27",

  status: "draft",

  periods: [
    {
      day: "Monday",

      startTime: "09:00",

      endTime: "10:00",

      subjectId: new ObjectId(),

      facultyId: new ObjectId(),

      roomId: new ObjectId(),
    },
  ],

  createdAt: new Date(),

  updatedAt: new Date(),
};

/*
 * ============================================================
 * 47. DOCUMENT VERSIONING
 * ============================================================
 *
 * A document can contain a version:
 */

const versionedDocument = {
  _id: new ObjectId(),

  version: 3,

  status: "draft",

  updatedAt: new Date(),
};

/*
 * This becomes useful for:
 *
 *
 * optimistic concurrency
 * version history
 * timetable generation
 * draft/published workflows
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. OPTIONAL FIELDS
 * ============================================================
 *
 * MongoDB documents in the same collection do not necessarily
 * have identical fields.
 *
 *
 * Document A:
 *
 * {
 *   name: "A",
 *   phone: "123"
 * }
 *
 *
 * Document B:
 *
 * {
 *   name: "B",
 *   email: "b@example.com"
 * }
 *
 *
 * This flexibility is useful, but uncontrolled schema
 * inconsistency can become a problem.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. FLEXIBILITY DOES NOT MEAN NO SCHEMA
 * ============================================================
 *
 * MongoDB allows flexible document structures.
 *
 * But production applications should still define an
 * intentional application schema.
 *
 *
 * You can enforce structure through:
 *
 *
 *     application validation
 *     Mongoose schemas
 *     MongoDB JSON Schema validation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * Document
 * │
 * ├── scalar fields
 * │      ├── string
 * │      ├── number
 * │      ├── boolean
 * │      └── date
 * │
 * ├── nested documents
 * │
 * ├── arrays
 * │
 * ├── references
 * │      └── ObjectId
 * │
 * └── _id
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. MongoDB stores BSON documents.
 *
 * 2. Documents resemble JavaScript objects.
 *
 * 3. MongoDB normally generates an _id automatically.
 *
 * 4. ObjectId is a common BSON identifier type.
 *
 * 5. ObjectId and string IDs are different BSON types.
 *
 * 6. Convert API string IDs to ObjectId when your database uses
 *    ObjectId.
 *
 * 7. BSON supports dates, binary data, Decimal128 and other
 *    types beyond basic JSON.
 *
 * 8. MongoDB supports nested documents.
 *
 * 9. MongoDB supports arrays and arrays of documents.
 *
 * 10. Embedded vs referenced data should be decided from
 *     access patterns.
 *
 * 11. Avoid unbounded arrays.
 *
 * 12. _id cannot be changed after insertion.
 *
 * 13. MongoDB is flexible, but production applications still
 *     need intentional schemas and validation.
 *
 * 14. Consistency in ID and field naming is important.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     22_mongodb/04_crud.js
 *
 * We will build complete CRUD operations:
 *
 *     insertOne()
 *     insertMany()
 *     find()
 *     findOne()
 *     updateOne()
 *     updateMany()
 *     replaceOne()
 *     deleteOne()
 *     deleteMany()
 *
 * ============================================================
 */
