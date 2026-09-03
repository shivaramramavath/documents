/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/04_crud.js
 *
 * Topic:
 *     MongoDB CRUD Operations
 *
 * ============================================================
 *
 * CRUD
 *
 * C → Create
 * R → Read
 * U → Update
 * D → Delete
 *
 *
 * MongoDB CRUD methods:
 *
 * CREATE
 *     insertOne()
 *     insertMany()
 *
 * READ
 *     find()
 *     findOne()
 *
 * UPDATE
 *     updateOne()
 *     updateMany()
 *     replaceOne()
 *
 * DELETE
 *     deleteOne()
 *     deleteMany()
 *
 * ============================================================
 */

import { MongoClient, ObjectId } from "mongodb";

/*
 * ============================================================
 * 1. CONNECTION
 * ============================================================
 */

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "timetable";

const client = new MongoClient(URI);

/*
 * ============================================================
 * 2. COLLECTION
 * ============================================================
 */

function usersCollection() {
  return client.db(DATABASE_NAME).collection("users");
}

/*
 * ============================================================
 * 3. CREATE — insertOne()
 * ============================================================
 *
 * Inserts one document.
 *
 * ============================================================
 */

async function createUser() {
  const users = usersCollection();

  const user = {
    name: "Shiva",

    email: "shiva@example.com",

    age: 22,

    department: "CSE",

    active: true,

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  const result = await users.insertOne(user);

  console.log("Inserted ID:", result.insertedId);

  return result;
}

/*
 * ============================================================
 * 4. insertMany()
 * ============================================================
 *
 * Inserts multiple documents in one operation.
 * ============================================================
 */

async function createUsers() {
  const users = usersCollection();

  const documents = [
    {
      name: "Student One",

      email: "student1@example.com",

      department: "CSE",

      semester: 5,

      active: true,
    },

    {
      name: "Student Two",

      email: "student2@example.com",

      department: "ECE",

      semester: 5,

      active: true,
    },

    {
      name: "Student Three",

      email: "student3@example.com",

      department: "IT",

      semester: 7,

      active: false,
    },
  ];

  const result = await users.insertMany(documents);

  console.log(result.insertedIds);

  return result;
}

/*
 * ============================================================
 * 5. READ — findOne()
 * ============================================================
 *
 * Returns one matching document.
 *
 * ============================================================
 */

async function findUser() {
  const users = usersCollection();

  const user = await users.findOne({
    email: "shiva@example.com",
  });

  console.log(user);

  return user;
}

/*
 * ============================================================
 * 6. find() — MULTIPLE DOCUMENTS
 * ============================================================
 *
 * find() returns a cursor.
 *
 * ============================================================
 */

async function findUsers() {
  const users = usersCollection();

  const cursor = users.find({
    department: "CSE",
  });

  const documents = await cursor.toArray();

  console.log(documents);

  return documents;
}

/*
 * ============================================================
 * 7. find({}) — ALL DOCUMENTS
 * ============================================================
 */

async function findAllUsers() {
  const users = usersCollection();

  const documents = await users.find({}).toArray();

  return documents;
}

/*
 * ============================================================
 * 8. FILTERING
 * ============================================================
 */

async function findActiveCSEStudents() {
  const users = usersCollection();

  return users
    .find({
      department: "CSE",

      active: true,
    })
    .toArray();
}

/*
 * ============================================================
 * 9. COMPARISON OPERATORS
 * ============================================================
 *
 * $gt  → greater than
 * $gte → greater than or equal
 * $lt  → less than
 * $lte → less than or equal
 * $eq  → equal
 * $ne  → not equal
 *
 * ============================================================
 */

async function findAdults() {
  const users = usersCollection();

  return users
    .find({
      age: {
        $gte: 18,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 10. RANGE QUERY
 * ============================================================
 */

async function findAgeRange() {
  const users = usersCollection();

  return users
    .find({
      age: {
        $gte: 18,

        $lte: 25,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 11. $in
 * ============================================================
 */

async function findDepartments() {
  const users = usersCollection();

  return users
    .find({
      department: {
        $in: ["CSE", "ECE", "IT"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 12. $nin
 * ============================================================
 */

async function findNonCSEUsers() {
  const users = usersCollection();

  return users
    .find({
      department: {
        $nin: ["CSE"],
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 13. $exists
 * ============================================================
 */

async function findUsersWithPhone() {
  const users = usersCollection();

  return users
    .find({
      phone: {
        $exists: true,
      },
    })
    .toArray();
}

/*
 * ============================================================
 * 14. $or
 * ============================================================
 */

async function findCSEOrECE() {
  const users = usersCollection();

  return users
    .find({
      $or: [
        {
          department: "CSE",
        },

        {
          department: "ECE",
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 15. $and
 * ============================================================
 *
 * Usually unnecessary because MongoDB implicitly ANDs
 * different fields.
 *
 *
 * This:
 *
 *     {
 *       department: "CSE",
 *       active: true
 *     }
 *
 *
 * already means:
 *
 *     department == CSE
 *     AND
 *     active == true
 *
 * ============================================================
 */

async function findUsingAnd() {
  const users = usersCollection();

  return users
    .find({
      $and: [
        {
          department: "CSE",
        },

        {
          active: true,
        },
      ],
    })
    .toArray();
}

/*
 * ============================================================
 * 16. UPDATE — updateOne()
 * ============================================================
 *
 * updateOne() updates the first matching document.
 *
 * ============================================================
 */

async function updateUser() {
  const users = usersCollection();

  const result = await users.updateOne(
    {
      email: "shiva@example.com",
    },

    {
      $set: {
        age: 23,

        updatedAt: new Date(),
      },
    },
  );

  console.log({
    matched: result.matchedCount,

    modified: result.modifiedCount,
  });

  return result;
}

/*
 * ============================================================
 * 17. $set
 * ============================================================
 *
 * $set changes only specified fields.
 *
 *
 * Existing:
 *
 * {
 *   name: "Shiva",
 *   age: 22,
 *   department: "CSE"
 * }
 *
 *
 * Update:
 *
 * {
 *   $set: {
 *     age: 23
 *   }
 * }
 *
 *
 * Result:
 *
 * {
 *   name: "Shiva",
 *   age: 23,
 *   department: "CSE"
 * }
 *
 *
 * Other fields remain unchanged.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. $unset
 * ============================================================
 *
 * Removes a field.
 *
 * ============================================================
 */

async function removePhone() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "shiva@example.com",
    },

    {
      $unset: {
        phone: "",
      },
    },
  );
}

/*
 * ============================================================
 * 19. $inc
 * ============================================================
 *
 * Increment a numeric field.
 *
 * ============================================================
 */

async function incrementAge() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "shiva@example.com",
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
 * 20. $mul
 * ============================================================
 *
 * Multiply a numeric field.
 *
 * ============================================================
 */

async function multiplyScore() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "shiva@example.com",
    },

    {
      $mul: {
        score: 1.1,
      },
    },
  );
}

/*
 * ============================================================
 * 21. $min
 * ============================================================
 *
 * Updates the field only if the new value is smaller.
 *
 * ============================================================
 */

async function updateMinimumScore() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "shiva@example.com",
    },

    {
      $min: {
        lowestScore: 50,
      },
    },
  );
}

/*
 * ============================================================
 * 22. $max
 * ============================================================
 */

async function updateMaximumScore() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "shiva@example.com",
    },

    {
      $max: {
        highestScore: 100,
      },
    },
  );
}

/*
 * ============================================================
 * 23. updateMany()
 * ============================================================
 *
 * Updates ALL matching documents.
 *
 * ============================================================
 */

async function deactivateGraduatedUsers() {
  const users = usersCollection();

  const result = await users.updateMany(
    {
      semester: 8,
    },

    {
      $set: {
        active: false,

        updatedAt: new Date(),
      },
    },
  );

  console.log({
    matched: result.matchedCount,

    modified: result.modifiedCount,
  });

  return result;
}

/*
 * ============================================================
 * 24. replaceOne()
 * ============================================================
 *
 * replaceOne() replaces the entire document except for its
 * immutable _id.
 *
 * ============================================================
 */

async function replaceUser(id) {
  const users = usersCollection();

  await users.replaceOne(
    {
      _id: new ObjectId(id),
    },

    {
      name: "Shiva",

      email: "shiva@example.com",

      department: "CSE",

      active: true,

      updatedAt: new Date(),
    },
  );
}

/*
 * ============================================================
 * 25. replaceOne() VS updateOne()
 * ============================================================
 *
 *
 * updateOne()
 *
 *     modifies selected fields.
 *
 *
 * replaceOne()
 *
 *     replaces the entire document.
 *
 *
 * Existing:
 *
 * {
 *   _id: 1,
 *   name: "Shiva",
 *   age: 22,
 *   department: "CSE"
 * }
 *
 *
 * updateOne():
 *
 * {
 *   $set: {
 *     age: 23
 *   }
 * }
 *
 * Result:
 *
 * {
 *   _id: 1,
 *   name: "Shiva",
 *   age: 23,
 *   department: "CSE"
 * }
 *
 *
 * replaceOne():
 *
 * {
 *   name: "Shiva"
 * }
 *
 * Result:
 *
 * {
 *   _id: 1,
 *   name: "Shiva"
 * }
 *
 *
 * Other fields disappear.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. DELETE — deleteOne()
 * ============================================================
 */

async function deleteUser(id) {
  const users = usersCollection();

  const result = await users.deleteOne({
    _id: new ObjectId(id),
  });

  console.log({
    deleted: result.deletedCount,
  });

  return result;
}

/*
 * ============================================================
 * 27. deleteMany()
 * ============================================================
 *
 * Deletes all matching documents.
 *
 * ============================================================
 */

async function deleteInactiveUsers() {
  const users = usersCollection();

  const result = await users.deleteMany({
    active: false,
  });

  console.log({
    deleted: result.deletedCount,
  });

  return result;
}

/*
 * ============================================================
 * 28. BE CAREFUL WITH deleteMany({})
 * ============================================================
 *
 * This:
 *
 *
 *     deleteMany({})
 *
 *
 * matches every document.
 *
 *
 * It effectively deletes all documents from the collection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. COUNT DOCUMENTS
 * ============================================================
 */

async function countUsers() {
  const users = usersCollection();

  return users.countDocuments();
}

/*
 * ============================================================
 * 30. COUNT WITH FILTER
 * ============================================================
 */

async function countCSEUsers() {
  const users = usersCollection();

  return users.countDocuments({
    department: "CSE",
  });
}

/*
 * ============================================================
 * 31. DISTINCT
 * ============================================================
 *
 * Get unique values.
 *
 * ============================================================
 */

async function getDepartments() {
  const users = usersCollection();

  return users.distinct("department");
}

/*
 * ============================================================
 * 32. PROJECTION
 * ============================================================
 *
 * Projection controls which fields are returned.
 *
 * ============================================================
 */

async function getPublicUsers() {
  const users = usersCollection();

  return users
    .find(
      {
        active: true,
      },

      {
        projection: {
          name: 1,

          department: 1,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 33. EXCLUSION PROJECTION
 * ============================================================
 */

async function hideSensitiveFields() {
  const users = usersCollection();

  return users
    .find(
      {},

      {
        projection: {
          password: 0,

          refreshToken: 0,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 34. _id AND PROJECTION
 * ============================================================
 *
 * _id is included by default.
 *
 * If you don't want it:
 *
 * ============================================================
 */

async function usersWithoutId() {
  const users = usersCollection();

  return users
    .find(
      {},

      {
        projection: {
          _id: 0,

          name: 1,

          email: 1,
        },
      },
    )
    .toArray();
}

/*
 * ============================================================
 * 35. SORT
 * ============================================================
 *
 * 1  → ascending
 * -1 → descending
 *
 * ============================================================
 */

async function sortUsers() {
  const users = usersCollection();

  return users
    .find({})
    .sort({
      age: -1,
    })
    .toArray();
}

/*
 * ============================================================
 * 36. MULTI-FIELD SORT
 * ============================================================
 */

async function sortUsersByDepartmentAndAge() {
  const users = usersCollection();

  return users
    .find({})
    .sort({
      department: 1,

      age: -1,
    })
    .toArray();
}

/*
 * ============================================================
 * 37. LIMIT
 * ============================================================
 */

async function firstTenUsers() {
  const users = usersCollection();

  return users.find({}).limit(10).toArray();
}

/*
 * ============================================================
 * 38. SKIP
 * ============================================================
 */

async function skipUsers() {
  const users = usersCollection();

  return users.find({}).skip(10).limit(10).toArray();
}

/*
 * ============================================================
 * 39. PAGINATION
 * ============================================================
 *
 * Page 1:
 *
 *     skip = 0
 *     limit = 10
 *
 * Page 2:
 *
 *     skip = 10
 *     limit = 10
 *
 * Page 3:
 *
 *     skip = 20
 *     limit = 10
 *
 * Formula:
 *
 *
 *     skip =
 *       (page - 1) * limit
 *
 * ============================================================
 */

async function getUsersPage(page, limit) {
  const users = usersCollection();

  const skip = (page - 1) * limit;

  return users
    .find({})
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/*
 * ============================================================
 * 40. findOneAndUpdate()
 * ============================================================
 *
 * Sometimes you want the updated document returned.
 *
 * ============================================================
 */

async function incrementLoginCount(id) {
  const users = usersCollection();

  const result = await users.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },

    {
      $inc: {
        loginCount: 1,
      },

      $set: {
        updatedAt: new Date(),
      },
    },

    {
      returnDocument: "after",
    },
  );

  return result;
}

/*
 * ============================================================
 * 41. UPSERT
 * ============================================================
 *
 * upsert means:
 *
 *
 *     update if document exists
 *     otherwise insert it
 *
 * ============================================================
 */

async function upsertUser() {
  const users = usersCollection();

  await users.updateOne(
    {
      email: "new@example.com",
    },

    {
      $set: {
        name: "New User",

        updatedAt: new Date(),
      },

      $setOnInsert: {
        createdAt: new Date(),
      },
    },

    {
      upsert: true,
    },
  );
}

/*
 * ============================================================
 * 42. $setOnInsert
 * ============================================================
 *
 * $setOnInsert runs only when MongoDB inserts a new document
 * through an upsert.
 *
 *
 * This is useful for:
 *
 *
 *     createdAt
 *     initial values
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. CRUD RESULT COUNTS
 * ============================================================
 *
 *
 * insertOne:
 *
 *     insertedId
 *
 *
 * insertMany:
 *
 *     insertedIds
 *
 *
 * updateOne/updateMany:
 *
 *     matchedCount
 *     modifiedCount
 *     upsertedCount
 *     upsertedId
 *
 *
 * deleteOne/deleteMany:
 *
 *     deletedCount
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. COMPLETE CRUD EXAMPLE
 * ============================================================
 */

async function completeCrudExample() {
  const users = usersCollection();

  /*
   * CREATE
   */

  const createResult = await users.insertOne({
    name: "CRUD User",

    email: "crud@example.com",

    age: 22,

    department: "CSE",

    active: true,

    createdAt: new Date(),

    updatedAt: new Date(),
  });

  const userId = createResult.insertedId;

  console.log("Created:", userId);

  /*
   * READ
   */

  const createdUser = await users.findOne({
    _id: userId,
  });

  console.log("Read:", createdUser);

  /*
   * UPDATE
   */

  await users.updateOne(
    {
      _id: userId,
    },

    {
      $set: {
        age: 23,

        updatedAt: new Date(),
      },
    },
  );

  /*
   * READ AGAIN
   */

  const updatedUser = await users.findOne({
    _id: userId,
  });

  console.log("Updated:", updatedUser);

  /*
   * DELETE
   */

  await users.deleteOne({
    _id: userId,
  });

  /*
   * VERIFY
   */

  const deletedUser = await users.findOne({
    _id: userId,
  });

  console.log("After delete:", deletedUser);
}

/*
 * ============================================================
 * 45. COMPLETE CRUD FLOW
 * ============================================================
 *
 *
 * INSERT
 *   │
 *   ▼
 * DOCUMENT
 *   │
 *   ▼
 * FIND
 *   │
 *   ▼
 * UPDATE
 *   │
 *   ▼
 * FIND
 *   │
 *   ▼
 * DELETE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. ERROR HANDLING
 * ============================================================
 */

async function safeCreateUser(data) {
  try {
    return await usersCollection().insertOne(data);
  } catch (error) {
    console.error("Failed to create user:", error);

    throw error;
  }
}

/*
 * ============================================================
 * 47. REAL BACKEND PATTERN
 * ============================================================
 *
 *
 * Controller
 *     │
 *     ▼
 * Service
 *     │
 *     ▼
 * Repository
 *     │
 *     ▼
 * users.insertOne()
 *
 *
 * Example:
 *
 *
 * POST /users
 *
 *     ↓
 *
 * userController.create()
 *
 *     ↓
 *
 * userService.create()
 *
 *     ↓
 *
 * userRepository.create()
 *
 *     ↓
 *
 * MongoDB insertOne()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. DON'T PUT DATABASE QUERIES EVERYWHERE
 * ============================================================
 *
 * Avoid:
 *
 *
 * controller.js
 *     users.find(...)
 *
 * service.js
 *     users.find(...)
 *
 * route.js
 *     users.update(...)
 *
 *
 * Centralize database operations inside repositories/data
 * access modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. CRUD FOR TIMETABLE APPLICATION
 * ============================================================
 *
 * CREATE:
 *
 *     create timetable
 *
 *
 * READ:
 *
 *     get timetable
 *
 *     list timetables
 *
 *
 * UPDATE:
 *
 *     change timetable
 *
 *
 * DELETE:
 *
 *     delete draft timetable
 *
 *
 * Example:
 *
 *
 * timetableRepository.create()
 * timetableRepository.findById()
 * timetableRepository.findMany()
 * timetableRepository.update()
 * timetableRepository.delete()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. IMPORTANT SAFETY RULE
 * ============================================================
 *
 * NEVER construct database filters directly from untrusted
 * request objects without validating/whitelisting them.
 *
 *
 * For example, don't blindly accept:
 *
 *
 *     req.body.filter
 *
 *
 * as a MongoDB query.
 *
 *
 * Instead define what fields/operators your API permits.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. KEY TAKEAWAYS
 * ============================================================
 *
 * CREATE
 *
 *     insertOne()
 *     insertMany()
 *
 *
 * READ
 *
 *     findOne()
 *     find()
 *     countDocuments()
 *     distinct()
 *
 *
 * UPDATE
 *
 *     updateOne()
 *     updateMany()
 *     replaceOne()
 *     findOneAndUpdate()
 *
 *
 * DELETE
 *
 *     deleteOne()
 *     deleteMany()
 *
 *
 * COMMON OPERATORS
 *
 *     $set
 *     $unset
 *     $inc
 *     $mul
 *     $min
 *     $max
 *     $in
 *     $nin
 *     $exists
 *     $or
 *     $and
 *
 *
 * QUERY FEATURES
 *
 *     projection
 *     sort
 *     skip
 *     limit
 *     pagination
 *     upsert
 *
 * ============================================================
 *
 * NEXT:
 *
 *     22_mongodb/05_query_operators.js
 *
 * We will go deeper into MongoDB querying:
 *
 *     comparison operators
 *     logical operators
 *     array operators
 *     element operators
 *     evaluation operators
 *     regex
 *     $expr
 *     $elemMatch
 *     complex filters
 *
 * ============================================================
 */

async function main() {
  try {
    await client.connect();

    console.log("MongoDB connected");

    // Uncomment examples individually while learning.
    //
    // await createUser();
    // await createUsers();
    // await findUser();
    // await findUsers();
    // await updateUser();
    // await deleteInactiveUsers();
    // await completeCrudExample();
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

main();
