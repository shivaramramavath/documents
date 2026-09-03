/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/02_database.js
 *
 * Topic:
 *     MongoDB Databases & Collections
 *
 * ============================================================
 *
 * MongoDB hierarchy:
 *
 *
 * MongoClient
 *     │
 *     ▼
 * Database
 *     │
 *     ▼
 * Collection
 *     │
 *     ▼
 * Document
 *
 * Example:
 *
 *
 * MongoDB
 *   │
 *   └── timetable
 *         │
 *         ├── users
 *         ├── faculty
 *         ├── subjects
 *         ├── rooms
 *         └── timetables
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. IMPORT
 * ============================================================
 */

import { MongoClient } from "mongodb";

/*
 * ============================================================
 * 2. CONNECTION CONFIGURATION
 * ============================================================
 */

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "timetable";

/*
 * ============================================================
 * 3. CREATE CLIENT
 * ============================================================
 */

const client = new MongoClient(MONGODB_URI);

/*
 * ============================================================
 * 4. MAIN
 * ============================================================
 */

async function main() {
  try {
    /*
     * Connect to MongoDB.
     */

    await client.connect();

    console.log("Connected to MongoDB");

    /*
     * Continue with database examples.
     */

    await databaseExamples();
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    /*
     * Always close this example connection.
     */

    await client.close();
  }
}

/*
 * ============================================================
 * 5. GET DATABASE
 * ============================================================
 *
 * client.db() returns a Db object.
 *
 * It does not necessarily create the database immediately.
 *
 * ============================================================
 */

async function databaseExamples() {
  const db = client.db(DATABASE_NAME);

  console.log("Database:", db.databaseName);
}

/*
 * ============================================================
 * 6. DATABASE DOES NOT NEED EXPLICIT CREATION
 * ============================================================
 *
 * Unlike traditional SQL systems, you usually don't need:
 *
 *
 *     CREATE DATABASE timetable;
 *
 *
 * before using a MongoDB database.
 *
 *
 * You can simply select it:
 *
 *
 *     const db = client.db("timetable");
 *
 *
 * MongoDB creates/persists the database once data is actually
 * written to it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. SELECT DIFFERENT DATABASES
 * ============================================================
 */

const timetableDB = client.db("timetable");

const analyticsDB = client.db("analytics");

const testingDB = client.db("testing");

/*
 * All of these can use the same MongoClient.
 *
 *
 * One client:
 *
 *     MongoClient
 *          │
 *          ├── timetable
 *          ├── analytics
 *          └── testing
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. GET COLLECTION
 * ============================================================
 *
 * A collection is similar conceptually to a SQL table.
 *
 * ============================================================
 */

const users = timetableDB.collection("users");

const faculty = timetableDB.collection("faculty");

const subjects = timetableDB.collection("subjects");

const rooms = timetableDB.collection("rooms");

/*
 * ============================================================
 * 9. COLLECTION HIERARCHY
 * ============================================================
 *
 *
 * client
 *   │
 *   ▼
 * timetable
 *   │
 *   ├── users
 *   ├── faculty
 *   ├── subjects
 *   └── rooms
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. COLLECTIONS ARE CREATED LAZILY
 * ============================================================
 *
 * This:
 *
 *
 *     db.collection("users")
 *
 *
 * gives you a Collection object.
 *
 * It does not necessarily mean a physical collection has
 * already been created on the server.
 *
 *
 * The collection becomes persistent when MongoDB needs to store
 * data/indexes/etc.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. INSERT TO CREATE COLLECTION
 * ============================================================
 */

async function createCollectionByInsert() {
  const db = client.db(DATABASE_NAME);

  const users = db.collection("users");

  await users.insertOne({
    name: "Shiva",

    age: 22,

    department: "CSE",
  });
}

/*
 * ============================================================
 * 12. EXPLICITLY CREATE COLLECTION
 * ============================================================
 *
 * MongoDB also provides:
 *
 *
 *     db.createCollection()
 *
 *
 * ============================================================
 */

async function createUsersCollection() {
  const db = client.db(DATABASE_NAME);

  await db.createCollection("users");
}

/*
 * ============================================================
 * 13. WHEN EXPLICIT CREATION IS USEFUL
 * ============================================================
 *
 * Explicit collection creation is useful when you need to
 * configure collection-level options.
 *
 * Examples:
 *
 *
 *     validation
 *     capped collections
 *     special configuration
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. CREATE COLLECTION WITH VALIDATION
 * ============================================================
 *
 * MongoDB can enforce document validation at the database
 * level.
 *
 * Example:
 */

async function createValidatedCollection() {
  const db = client.db(DATABASE_NAME);

  await db.createCollection("validatedUsers", {
    validator: {
      $jsonSchema: {
        bsonType: "object",

        required: ["name", "email"],

        properties: {
          name: {
            bsonType: "string",
          },

          email: {
            bsonType: "string",
          },
        },
      },
    },
  });
}

/*
 * ============================================================
 * 15. LIST COLLECTIONS
 * ============================================================
 */

async function listCollections() {
  const db = client.db(DATABASE_NAME);

  const collections = await db.listCollections().toArray();

  for (const collection of collections) {
    console.log(collection.name);
  }
}

/*
 * ============================================================
 * 16. LIST COLLECTION NAMES
 * ============================================================
 */

async function getCollectionNames() {
  const db = client.db(DATABASE_NAME);

  const collections = await db.listCollections().toArray();

  return collections.map((collection) => collection.name);
}

/*
 * ============================================================
 * 17. CHECK WHETHER COLLECTION EXISTS
 * ============================================================
 */

async function collectionExists(name) {
  const db = client.db(DATABASE_NAME);

  const collections = await db
    .listCollections({
      name,
    })
    .toArray();

  return collections.length > 0;
}

/*
 * ============================================================
 * 18. EXAMPLE
 * ============================================================
 */

async function checkCollections() {
  console.log(await collectionExists("users"));

  console.log(await collectionExists("doesNotExist"));
}

/*
 * ============================================================
 * 19. COLLECTION METADATA
 * ============================================================
 */

async function collectionMetadata() {
  const db = client.db(DATABASE_NAME);

  const collections = await db.listCollections().toArray();

  for (const collection of collections) {
    console.log({
      name: collection.name,

      type: collection.type,

      options: collection.options,
    });
  }
}

/*
 * ============================================================
 * 20. DATABASE COMMAND
 * ============================================================
 *
 * MongoDB provides database commands for administrative and
 * diagnostic operations.
 *
 * ============================================================
 */

async function pingDatabase() {
  const db = client.db(DATABASE_NAME);

  const result = await db.command({
    ping: 1,
  });

  console.log(result);
}

/*
 * Expected:
 *
 *
 * {
 *   ok: 1
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. DATABASE STATS
 * ============================================================
 */

async function databaseStats() {
  const db = client.db(DATABASE_NAME);

  const stats = await db.command({
    dbStats: 1,
  });

  console.log(stats);
}

/*
 * ============================================================
 * 22. COLLECTION STATS
 * ============================================================
 *
 * Depending on MongoDB version/driver capabilities and
 * privileges, collection statistics can be obtained through
 * database commands.
 *
 * ============================================================
 */

async function collectionStats() {
  const db = client.db(DATABASE_NAME);

  const stats = await db.command({
    collStats: "users",
  });

  console.log(stats);
}

/*
 * ============================================================
 * 23. DATABASE NAMES
 * ============================================================
 *
 * A MongoClient can list databases available to the
 * authenticated user.
 *
 * ============================================================
 */

async function listDatabases() {
  const adminDB = client.db().admin();

  const result = await adminDB.listDatabases();

  for (const database of result.databases) {
    console.log(database.name);
  }
}

/*
 * ============================================================
 * 24. DATABASE SIZE
 * ============================================================
 */

async function printDatabaseSizes() {
  const adminDB = client.db().admin();

  const result = await adminDB.listDatabases();

  for (const database of result.databases) {
    console.log({
      name: database.name,

      sizeOnDisk: database.sizeOnDisk,
    });
  }
}

/*
 * ============================================================
 * 25. DROP COLLECTION
 * ============================================================
 *
 * WARNING:
 *
 * This permanently removes the collection and its documents.
 *
 * ============================================================
 */

async function dropUsersCollection() {
  const db = client.db(DATABASE_NAME);

  const users = db.collection("users");

  await users.drop();
}

/*
 * ============================================================
 * 26. DROP DATABASE
 * ============================================================
 *
 * WARNING:
 *
 * This permanently deletes the database.
 *
 * ============================================================
 */

async function dropDatabase() {
  const db = client.db(DATABASE_NAME);

  await db.dropDatabase();
}

/*
 * ============================================================
 * 27. NEVER RUN DROP DATABASE IN PRODUCTION CASUALLY
 * ============================================================
 *
 * This:
 *
 *
 *     await db.dropDatabase();
 *
 *
 * can destroy the entire application's database.
 *
 * Be especially careful with:
 *
 *
 *     development scripts
 *     migration scripts
 *     tests
 *     deployment scripts
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. DATABASE DESIGN
 * ============================================================
 *
 * A timetable application might have:
 *
 *
 * timetable
 * │
 * ├── organizations
 * ├── departments
 * ├── users
 * ├── faculty
 * ├── subjects
 * ├── rooms
 * ├── nodes
 * ├── edges
 * ├── timetables
 * ├── timetableVersions
 * └── generationJobs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. ONE DATABASE VS MULTIPLE DATABASES
 * ============================================================
 *
 * Most applications start with:
 *
 *
 *     one application
 *         │
 *         ▼
 *     one database
 *
 *
 * Example:
 *
 *
 *     timetable
 *
 *
 * containing:
 *
 *
 *     users
 *     faculty
 *     rooms
 *     subjects
 *     timetables
 *
 *
 * You don't need a separate MongoDB database for every
 * collection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. MULTI-TENANT APPLICATION
 * ============================================================
 *
 * A SaaS application could use:
 *
 *
 * ONE DATABASE
 *
 *     timetable
 *         │
 *         ├── organizations
 *         ├── users
 *         ├── timetables
 *         └── ...
 *
 *
 * with:
 *
 *
 * organizationId
 *
 *
 * on tenant-owned documents.
 *
 *
 * Example:
 */

const timetableDocument = {
  name: "CSE Semester 5",

  organizationId: "ORG-001",

  departmentId: "DEPT-CSE",
};

/*
 * ============================================================
 * 31. DATABASE PER TENANT
 * ============================================================
 *
 * Another architecture is:
 *
 *
 * MongoDB
 *   │
 *   ├── organization_001
 *   ├── organization_002
 *   └── organization_003
 *
 *
 * This can provide stronger isolation but introduces
 * operational complexity.
 *
 *
 * The correct choice depends on:
 *
 *
 *     tenant count
 *     isolation requirements
 *     compliance
 *     operational model
 *     scaling
 *     backup strategy
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. COLLECTION NAMING
 * ============================================================
 *
 * Pick one consistent convention.
 *
 *
 * Example:
 *
 *
 *     users
 *     faculty
 *     subjects
 *     timetables
 *     generationJobs
 *
 *
 * Avoid randomly mixing:
 *
 *
 *     User
 *     users
 *     user_data
 *     USER_COLLECTION
 *
 *
 * Consistency matters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. COLLECTION OBJECT
 * ============================================================
 */

function getCollections() {
  const db = client.db(DATABASE_NAME);

  return {
    users: db.collection("users"),

    faculty: db.collection("faculty"),

    subjects: db.collection("subjects"),

    rooms: db.collection("rooms"),

    timetables: db.collection("timetables"),
  };
}

/*
 * ============================================================
 * 34. USE COLLECTIONS
 * ============================================================
 */

async function exampleRepositoryCall() {
  const { users, timetables } = getCollections();

  const user = await users.findOne({
    email: "shiva@example.com",
  });

  const timetable = await timetables.findOne({
    departmentId: "CSE",
  });

  console.log({
    user,
    timetable,
  });
}

/*
 * ============================================================
 * 35. DATABASE LAYER
 * ============================================================
 *
 * A production application can centralize database access:
 *
 *
 *     src/
 *       database/
 *          mongodb.js
 *          collections.js
 *
 *
 * Example:
 *
 *
 *     mongodb.js
 *         ↓
 *     getDatabase()
 *         ↓
 *     collections.js
 *         ↓
 *     repositories
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. COLLECTION FACTORY
 * ============================================================
 */

function collections() {
  const db = client.db(DATABASE_NAME);

  return {
    users: db.collection("users"),

    faculty: db.collection("faculty"),

    subjects: db.collection("subjects"),

    rooms: db.collection("rooms"),

    timetables: db.collection("timetables"),

    generationJobs: db.collection("generationJobs"),
  };
}

/*
 * ============================================================
 * 37. IMPORTANT DISTINCTION
 * ============================================================
 *
 *
 * DATABASE
 *
 *     timetable
 *
 *
 * COLLECTION
 *
 *     timetables
 *
 *
 * DOCUMENT
 *
 *     {
 *       _id: ...,
 *       departmentId: "CSE"
 *     }
 *
 *
 * FIELD
 *
 *     departmentId
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. MONGODB VS SQL TERMINOLOGY
 * ============================================================
 *
 *
 * MongoDB                 SQL
 * ------------------------------------------------
 * database                database
 * collection              table
 * document                row
 * field                   column
 * _id                     primary key
 * embedded document       nested/related data
 * array                   multi-valued structure
 *
 *
 * But remember:
 *
 * MongoDB documents are not simply SQL rows with different
 * names.
 *
 * MongoDB's document model changes how you should design data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. IMPORTANT CONCEPT
 * ============================================================
 *
 * Don't create collections simply because you have different
 * object types in your application.
 *
 *
 * Ask:
 *
 *
 *     How will this data be queried?
 *
 *     How will it be updated?
 *
 *     Is it bounded?
 *
 *     Is it frequently accessed together?
 *
 *     Does it have an independent lifecycle?
 *
 *
 * These questions drive MongoDB data modeling.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * MongoClient
 *      │
 *      ├───────────────┐
 *      ▼               ▼
 * Database A       Database B
 *      │
 *      ▼
 * timetable
 *      │
 *      ├── users
 *      │     └── documents
 *      │
 *      ├── faculty
 *      │     └── documents
 *      │
 *      ├── subjects
 *      │     └── documents
 *      │
 *      └── timetables
 *            └── documents
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. MongoDB contains databases.
 *
 * 2. Databases contain collections.
 *
 * 3. Collections contain documents.
 *
 * 4. Documents contain fields.
 *
 * 5. client.db("name") selects a database.
 *
 * 6. db.collection("name") selects a collection.
 *
 * 7. Collections can be created implicitly by writes.
 *
 * 8. db.createCollection() allows explicit collection
 *    creation/configuration.
 *
 * 9. listCollections() retrieves collection metadata.
 *
 * 10. listDatabases() retrieves databases accessible to the
 *     authenticated user.
 *
 * 11. A single MongoClient can access multiple databases.
 *
 * 12. Don't create unnecessary databases or collections.
 *
 * 13. Data modeling should be driven by application access
 *     patterns.
 *
 * 14. Be extremely careful with drop() and dropDatabase().
 *
 * ============================================================
 *
 * NEXT:
 *
 *     22_mongodb/03_documents.js
 *
 * We will learn:
 *
 *     documents
 *     BSON types
 *     _id
 *     ObjectId
 *     nested documents
 *     arrays
 *     document size
 *     embedding
 *     document structure
 *     insertOne()
 *     insertMany()
 *
 * ============================================================
 */

main();
