/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     22_mongodb/01_connection.js
 *
 * Topic:
 *     MongoDB Connection
 *
 * ============================================================
 *
 * MongoDB connection flow:
 *
 *
 * Node.js Application
 *        │
 *        ▼
 * MongoClient
 *        │
 *        ▼
 * Connection Pool
 *        │
 *        ▼
 * MongoDB Server / Cluster
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. INSTALLATION
 * ============================================================
 *
 * Install the official MongoDB Node.js driver:
 *
 *
 *     npm install mongodb
 *
 *
 * If using Mongoose:
 *
 *
 *     npm install mongoose
 *
 *
 * This file uses the native MongoDB driver first.
 *
 * ============================================================
 */

import { MongoClient } from "mongodb";

/*
 * ============================================================
 * 2. CONNECTION STRING
 * ============================================================
 *
 * Local MongoDB:
 *
 *
 *     mongodb://127.0.0.1:27017
 *
 *
 * MongoDB Atlas:
 *
 *
 *     mongodb+srv://...
 *
 *
 * NEVER hard-code production credentials.
 *
 * Use:
 *
 *
 *     process.env.MONGODB_URI
 *
 * ============================================================
 */

const MONGODB_URI = process.env.MONGODB_URI;

/*
 * ============================================================
 * 3. VALIDATE ENVIRONMENT VARIABLE
 * ============================================================
 */

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

/*
 * ============================================================
 * 4. DATABASE NAME
 * ============================================================
 */

const DATABASE_NAME = process.env.MONGODB_DATABASE ?? "app";

/*
 * ============================================================
 * 5. CREATE MONGODB CLIENT
 * ============================================================
 *
 * MongoClient represents the application's connection to
 * MongoDB.
 *
 *
 * IMPORTANT:
 *
 * Create one client and reuse it.
 *
 *
 * Do NOT create a new MongoClient for every request.
 *
 * ============================================================
 */

const client = new MongoClient(MONGODB_URI);

/*
 * ============================================================
 * 6. CONNECT
 * ============================================================
 */

async function connectMongoDB() {
  await client.connect();

  console.log("MongoDB connected");
}

/*
 * ============================================================
 * 7. GET DATABASE
 * ============================================================
 */

function getDatabase() {
  return client.db(DATABASE_NAME);
}

/*
 * ============================================================
 * 8. GET COLLECTION
 * ============================================================
 */

function getUsersCollection() {
  return getDatabase().collection("users");
}

/*
 * ============================================================
 * 9. BASIC USAGE
 * ============================================================
 */

async function main() {
  await connectMongoDB();

  const db = getDatabase();

  console.log("Database:", db.databaseName);

  const users = getUsersCollection();

  console.log("Collection:", users.collectionName);
}

/*
 * ============================================================
 * 10. START APPLICATION
 * ============================================================
 *
 * In a real application, application startup should happen
 * only after the required infrastructure is ready.
 *
 * ============================================================
 */

main().catch((error) => {
  console.error("Application startup failed:", error);

  process.exit(1);
});

/*
 * ============================================================
 * 11. WHY ONE CLIENT?
 * ============================================================
 *
 * Consider:
 *
 *
 * REQUEST 1
 *     ↓
 * new MongoClient()
 *     ↓
 * connect()
 *
 *
 * REQUEST 2
 *     ↓
 * new MongoClient()
 *     ↓
 * connect()
 *
 *
 * REQUEST 3
 *     ↓
 * new MongoClient()
 *     ↓
 * connect()
 *
 *
 * This is inefficient.
 *
 *
 * Better:
 *
 *
 * Application startup
 *        │
 *        ▼
 *   MongoClient
 *        │
 *        ▼
 * Connection Pool
 *        │
 *        ├── Request 1
 *        ├── Request 2
 *        ├── Request 3
 *        └── Request N
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. CONNECTION POOL
 * ============================================================
 *
 * MongoClient internally manages a pool of database
 * connections.
 *
 *
 * Application
 *       │
 *       ▼
 * MongoClient
 *       │
 *       ▼
 * ┌───────────────────┐
 * │ Connection Pool   │
 * ├───────────────────┤
 * │ Connection 1      │
 * │ Connection 2      │
 * │ Connection 3      │
 * │ Connection ...    │
 * └───────────────────┘
 *       │
 *       ▼
 * MongoDB
 *
 *
 * Multiple requests can reuse the pool.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. CONNECTION OPTIONS
 * ============================================================
 *
 * MongoClient supports many configuration options.
 *
 *
 * Example:
 */

const configuredClient = new MongoClient(MONGODB_URI, {
  /*
   * Maximum number of connections in the pool.
   */

  maxPoolSize: 20,

  /*
   * Minimum number of connections to maintain.
   */

  minPoolSize: 5,

  /*
   * Maximum time a connection can remain idle.
   */

  maxIdleTimeMS: 30_000,

  /*
   * How long the driver waits to establish a connection.
   */

  connectTimeoutMS: 10_000,

  /*
   * How long an operation can wait to select a suitable
   * server.
   */

  serverSelectionTimeoutMS: 5_000,
});

/*
 * ============================================================
 * 14. DON'T CREATE BOTH CLIENTS IN A REAL APP
 * ============================================================
 *
 * The examples above intentionally demonstrate concepts.
 *
 * Your real application should create ONE MongoClient.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. PRODUCTION CONNECTION MODULE
 * ============================================================
 *
 * A cleaner implementation:
 *
 *
 *     database/
 *       mongodb.js
 *
 *
 * Example:
 */

let mongoClient = null;

/*
 * ============================================================
 * 16. CONNECT ONCE
 * ============================================================
 */

async function connectDatabase() {
  if (mongoClient) {
    return mongoClient;
  }

  mongoClient = new MongoClient(MONGODB_URI, {
    maxPoolSize: 20,

    minPoolSize: 5,

    maxIdleTimeMS: 30_000,

    connectTimeoutMS: 10_000,

    serverSelectionTimeoutMS: 5_000,
  });

  await mongoClient.connect();

  console.log("MongoDB connection established");

  return mongoClient;
}

/*
 * ============================================================
 * 17. DATABASE ACCESS
 * ============================================================
 */

function database() {
  if (!mongoClient) {
    throw new Error("MongoDB has not been connected");
  }

  return mongoClient.db(DATABASE_NAME);
}

/*
 * ============================================================
 * 18. COLLECTION ACCESS
 * ============================================================
 */

function usersCollection() {
  return database().collection("users");
}

/*
 * ============================================================
 * 19. DISCONNECT
 * ============================================================
 */

async function disconnectDatabase() {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();

  mongoClient = null;

  console.log("MongoDB connection closed");
}

/*
 * ============================================================
 * 20. GRACEFUL SHUTDOWN
 * ============================================================
 *
 * When Node.js receives:
 *
 *
 *     SIGINT
 *     SIGTERM
 *
 *
 * we should gracefully close resources.
 *
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`${signal} received`);

  try {
    await disconnectDatabase();

    process.exit(0);
  } catch (error) {
    console.error("Shutdown failed:", error);

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * 21. STARTUP
 * ============================================================
 */

async function start() {
  try {
    await connectDatabase();

    console.log("Application can start");
  } catch (error) {
    console.error("MongoDB startup connection failed:", error);

    process.exit(1);
  }
}

/*
 * ============================================================
 * 22. APPLICATION STARTUP ORDER
 * ============================================================
 *
 *
 *             START
 *               │
 *               ▼
 *        Load environment
 *               │
 *               ▼
 *        Connect MongoDB
 *               │
 *          ┌────┴────┐
 *          │         │
 *       success    failure
 *          │         │
 *          ▼         ▼
 *      Start API   Exit
 *
 *
 * This prevents the server from accepting requests when a
 * critical database dependency is unavailable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. EXPRESS APPLICATION
 * ============================================================
 *
 * A common structure:
 *
 *
 *     start()
 *       │
 *       ├── connectDatabase()
 *       │
 *       └── app.listen()
 *
 * ============================================================
 */

import express from "express";

const app = express();

app.use(express.json());

/*
 * Example health endpoint.
 */

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
  });
});

/*
 * ============================================================
 * 24. START HTTP SERVER AFTER DATABASE
 * ============================================================
 */

async function startServer() {
  try {
    await connectDatabase();

    const PORT = Number(process.env.PORT ?? 3000);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    process.exit(1);
  }
}

/*
 * In the real project, call:
 *
 *
 *     startServer();
 *
 *
 * once.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. DATABASE HEALTH CHECK
 * ============================================================
 *
 * A health check can execute:
 *
 *
 *     db.command({
 *       ping: 1
 *     })
 *
 * ============================================================
 */

async function checkDatabaseHealth() {
  const db = database();

  await db.command({
    ping: 1,
  });

  return true;
}

/*
 * ============================================================
 * 26. HEALTH CHECK ENDPOINT
 * ============================================================
 */

app.get("/health/database", async (req, res) => {
  try {
    await checkDatabaseHealth();

    return res.json({
      status: "ok",

      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(503).json({
      status: "error",

      database: "unavailable",
    });
  }
});

/*
 * ============================================================
 * 27. ENVIRONMENT FILE
 * ============================================================
 *
 * Example .env:
 *
 *
 *     MONGODB_URI=mongodb://127.0.0.1:27017
 *     MONGODB_DATABASE=timetable
 *     PORT=3000
 *
 *
 * NEVER commit .env to Git.
 *
 *
 * .gitignore:
 *
 *
 *     .env
 *     .env.*
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. LOCAL MONGODB
 * ============================================================
 *
 * Typical local URI:
 *
 *
 *     mongodb://127.0.0.1:27017
 *
 *
 * Database:
 *
 *
 *     timetable
 *
 *
 * Complete example:
 *
 *
 *     mongodb://127.0.0.1:27017/timetable
 *
 *
 * However, keeping the database name separately in environment
 * configuration is also perfectly valid.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. MONGODB ATLAS
 * ============================================================
 *
 * Cloud MongoDB commonly uses:
 *
 *
 *     mongodb+srv://...
 *
 *
 * The actual connection string should come from your
 * environment/secret manager.
 *
 * Never commit it into Git.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. CONNECTION FAILURE
 * ============================================================
 *
 * Possible causes:
 *
 *
 *     MongoDB server is down
 *
 *     wrong URI
 *
 *     invalid credentials
 *
 *     network failure
 *
 *     DNS failure
 *
 *     TLS configuration problem
 *
 *     firewall restriction
 *
 *     Atlas IP access restriction
 *
 *     incorrect database configuration
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CONNECTION IS NOT THE SAME AS DATABASE
 * ============================================================
 *
 *
 * MongoClient
 *     │
 *     ├── Database A
 *     │
 *     ├── Database B
 *     │
 *     └── Database C
 *
 *
 * A MongoClient represents the client connection infrastructure.
 *
 *
 * db():
 *
 *
 *     client.db("timetable")
 *
 *
 * selects a database.
 *
 *
 * collection():
 *
 *
 *     db.collection("faculty")
 *
 *
 * selects a collection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. HIERARCHY
 * ============================================================
 *
 *
 * MongoClient
 *      │
 *      ▼
 * Database
 *      │
 *      ▼
 * Collection
 *      │
 *      ▼
 * Document
 *
 *
 * Example:
 *
 *
 * MongoClient
 *      │
 *      ▼
 * timetable
 *      │
 *      ├── users
 *      ├── faculty
 *      ├── rooms
 *      ├── subjects
 *      └── timetables
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. IMPORTANT: MONGODB CONNECTION IS ASYNC
 * ============================================================
 *
 * Don't assume:
 *
 *
 *     connectDatabase();
 *     app.listen();
 *
 *
 * means MongoDB is ready.
 *
 *
 * Prefer:
 *
 *
 *     await connectDatabase();
 *     app.listen();
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. DON'T CONNECT PER REQUEST
 * ============================================================
 *
 * BAD:
 */

app.get("/bad", async (req, res) => {
  const client = new MongoClient(MONGODB_URI);

  await client.connect();

  // query...

  await client.close();

  res.json({
    ok: true,
  });
});

/*
 * ============================================================
 * 35. GOOD
 * ============================================================
 *
 * Connect once during application startup.
 *
 *
 * Request
 *    │
 *    ▼
 * Repository
 *    │
 *    ▼
 * database()
 *    │
 *    ▼
 * MongoClient pool
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. REPOSITORY EXAMPLE
 * ============================================================
 */

async function findUserByEmail(email) {
  return usersCollection().findOne({
    email,
  });
}

/*
 * ============================================================
 * 37. APPLICATION LAYERS
 * ============================================================
 *
 *
 * HTTP
 *  │
 *  ▼
 * Controller
 *  │
 *  ▼
 * Service
 *  │
 *  ▼
 * Repository
 *  │
 *  ▼
 * MongoDB
 *
 *
 * Example:
 *
 *
 * GET /users/:id
 *
 * Controller
 *     ↓
 * userService.findById()
 *     ↓
 * userRepository.findById()
 *     ↓
 * MongoDB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. DON'T EXPORT RAW CLIENT EVERYWHERE
 * ============================================================
 *
 * A centralized database module makes it easier to:
 *
 *
 *     test
 *     replace database
 *     manage lifecycle
 *     configure pool
 *     monitor connections
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. CONNECTION POOL SIZING
 * ============================================================
 *
 * Don't blindly set:
 *
 *
 *     maxPoolSize: 1000
 *
 *
 * because your application has many users.
 *
 *
 * Pool sizing depends on:
 *
 *
 *     application concurrency
 *     query latency
 *     number of application instances
 *     MongoDB cluster capacity
 *     workload characteristics
 *
 *
 * Example:
 *
 *
 * 5 Node.js instances
 *
 * each:
 *
 *     maxPoolSize = 20
 *
 *
 * potentially means:
 *
 *
 *     5 × 20 = 100
 *
 *
 * connections.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. DATABASE TIMEOUTS
 * ============================================================
 *
 * Timeouts prevent requests from hanging indefinitely.
 *
 *
 * Common settings include:
 *
 *
 *     connectTimeoutMS
 *     serverSelectionTimeoutMS
 *     maxTimeMS
 *
 *
 * Example query:
 */

async function findUsers() {
  return usersCollection().find({}).maxTimeMS(5_000).toArray();
}

/*
 * ============================================================
 * 41. maxTimeMS
 * ============================================================
 *
 * This limits how long MongoDB should execute an operation.
 *
 *
 * Example:
 *
 *
 *     query
 *       │
 *       ▼
 *     5 seconds
 *       │
 *       ├── completed → result
 *       │
 *       └── exceeded → timeout/error
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. LOGGING
 * ============================================================
 *
 * Don't log credentials or connection strings.
 *
 * BAD:
 *
 *
 * console.log(MONGODB_URI);
 *
 *
 * because it may contain:
 *
 *
 * username
 * password
 * host
 *
 *
 * Prefer:
 *
 */

console.log("MongoDB configured");

/*
 * ============================================================
 * 43. TESTING CONNECTION
 * ============================================================
 */

async function testConnection() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    await client.db(DATABASE_NAME).command({
      ping: 1,
    });

    console.log("MongoDB ping successful");
  } finally {
    await client.close();
  }
}

/*
 * ============================================================
 * 44. TESTING vs APPLICATION CONNECTION
 * ============================================================
 *
 * Tests may create isolated connections depending on the
 * testing architecture.
 *
 *
 * Production application:
 *
 *     reuse long-lived client
 *
 *
 * Test:
 *
 *     connect
 *     run tests
 *     cleanup
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. KEY TAKEAWAYS
 * ============================================================
 *
 * 1. MongoClient represents the MongoDB client connection.
 *
 * 2. Reuse one MongoClient in the application.
 *
 * 3. MongoClient manages a connection pool.
 *
 * 4. Don't connect to MongoDB on every HTTP request.
 *
 * 5. Keep credentials in environment/secret management.
 *
 * 6. Connect before accepting application traffic when
 *    MongoDB is a required dependency.
 *
 * 7. Configure sensible timeout and pool settings.
 *
 * 8. Gracefully close the database during shutdown.
 *
 * 9. Keep database lifecycle management centralized.
 *
 * 10. Separate:
 *
 *       Controller
 *           ↓
 *       Service
 *           ↓
 *       Repository
 *           ↓
 *       MongoDB
 *
 * ============================================================
 *
 * NEXT:
 *
 *     22_mongodb/02_database.js
 *
 * We will learn:
 *
 *     client.db()
 *     database names
 *     collections
 *     database commands
 *     listing databases
 *     database metadata
 *     MongoDB shell concepts
 *
 * ============================================================
 */
