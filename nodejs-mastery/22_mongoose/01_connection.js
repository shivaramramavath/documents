/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     01_connection.js
 *
 * Topic:
 *     Mongoose Connection
 *
 * ============================================================
 *
 * Topics covered:
 *
 *     1. mongoose.connect()
 *     2. mongoose.disconnect()
 *     3. mongoose.connection
 *     4. Connection states
 *     5. Connection events
 *     6. Connection properties
 *     7. Connection pool
 *     8. Connection options
 *     9. Connection health check
 *    10. Graceful shutdown
 *    11. Error handling
 *    12. Reusable connection functions
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";


/*
 * ============================================================
 * 1. LOAD ENVIRONMENT VARIABLES
 * ============================================================
 */

dotenv.config({
  path: new URL("./.env", import.meta.url),
});


/*
 * ============================================================
 * 2. DATABASE URL
 * ============================================================
 */

const MONGODB_URI =
  process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined",
  );
}


/*
 * ============================================================
 * 3. CONNECTION OPTIONS
 * ============================================================
 *
 * These options are passed to the MongoDB driver through
 * Mongoose.
 *
 * ============================================================
 */

const connectionOptions = {

  /*
   * ----------------------------------------------------------
   * Connection Pool
   * ----------------------------------------------------------
   *
   * Maximum number of connections that can exist in the pool.
   *
   * Example:
   *
   *     maxPoolSize: 100
   *
   * means one MongoDB server connection pool can maintain
   * up to approximately 100 concurrent sockets/connections
   * for database operations.
   *
   */

  maxPoolSize: 10,


  /*
   * Minimum number of connections maintained in the pool.
   */

  minPoolSize: 2,


  /*
   * How long an idle connection can remain in the pool before
   * being closed.
   *
   * Value is in milliseconds.
   */

  maxIdleTimeMS: 30_000,


  /*
   * Time allowed for selecting a suitable MongoDB server.
   *
   * Value is in milliseconds.
   */

  serverSelectionTimeoutMS: 5_000,


  /*
   * How long MongoDB operations can wait for a connection from
   * the pool.
   *
   * Value is in milliseconds.
   */

  waitQueueTimeoutMS: 5_000,


  /*
   * How long an individual socket can remain idle before
   * timing out.
   *
   * Value is in milliseconds.
   */

  socketTimeoutMS: 45_000,

};


/*
 * ============================================================
 * 4. MONGOOSE CONNECTION OBJECT
 * ============================================================
 *
 * mongoose.connection represents the default Mongoose
 * connection.
 *
 * ============================================================
 */

const connection =
  mongoose.connection;


/*
 * ============================================================
 * 5. CONNECTION STATES
 * ============================================================
 *
 * Mongoose connection.readyState:
 *
 *
 *     0 → disconnected
 *     1 → connected
 *     2 → connecting
 *     3 → disconnecting
 *
 * ============================================================
 */

function getConnectionState() {

  switch (
    connection.readyState
  ) {

    case 0:
      return "disconnected";

    case 1:
      return "connected";

    case 2:
      return "connecting";

    case 3:
      return "disconnecting";

    default:
      return "unknown";

  }

}


/*
 * ============================================================
 * 6. CONNECTION EVENTS
 * ============================================================
 *
 * Mongoose emits lifecycle events through the connection
 * object.
 *
 * ============================================================
 */


/*
 * ------------------------------------------------------------
 * connected
 * ------------------------------------------------------------
 */

connection.on(
  "connected",
  () => {

    console.log(
      "[MongoDB] connected",
    );

  },
);


/*
 * ------------------------------------------------------------
 * open
 * ------------------------------------------------------------
 *
 * Similar connection lifecycle event.
 *
 * ------------------------------------------------------------
 */

connection.on(
  "open",
  () => {

    console.log(
      "[MongoDB] connection open",
    );

  },
);


/*
 * ------------------------------------------------------------
 * disconnected
 * ------------------------------------------------------------
 */

connection.on(
  "disconnected",
  () => {

    console.warn(
      "[MongoDB] disconnected",
    );

  },
);


/*
 * ------------------------------------------------------------
 * reconnected
 * ------------------------------------------------------------
 */

connection.on(
  "reconnected",
  () => {

    console.log(
      "[MongoDB] reconnected",
    );

  },
);


/*
 * ------------------------------------------------------------
 * error
 * ------------------------------------------------------------
 */

connection.on(
  "error",
  (
    error,
  ) => {

    console.error(
      "[MongoDB] connection error:",
      error,
    );

  },
);


/*
 * ------------------------------------------------------------
 * close
 * ------------------------------------------------------------
 */

connection.on(
  "close",
  () => {

    console.log(
      "[MongoDB] connection closed",
    );

  },
);


/*
 * ------------------------------------------------------------
 * fullsetup
 * ------------------------------------------------------------
 *
 * Relevant when using a replica set / topology where the
 * driver reports a complete replica-set setup.
 *
 * ------------------------------------------------------------
 */

connection.on(
  "fullsetup",
  () => {

    console.log(
      "[MongoDB] full replica-set setup",
    );

  },
);


/*
 * ============================================================
 * 7. CONNECT FUNCTION
 * ============================================================
 */

export async function connectDatabase() {

  /*
   * Already connected.
   */

  if (
    connection.readyState === 1
  ) {

    console.log(
      "[MongoDB] already connected",
    );

    return connection;

  }


  /*
   * Connection currently being established.
   */

  if (
    connection.readyState === 2
  ) {

    console.log(
      "[MongoDB] connection already in progress",
    );

    return connection;

  }


  try {

    await mongoose.connect(

      MONGODB_URI,

      connectionOptions,

    );


    console.log(
      "[MongoDB] database:",
      connection.name,
    );


    return connection;

  } catch (
    error
  ) {

    console.error(
      "[MongoDB] failed to connect:",
      error,
    );

    throw error;

  }

}


/*
 * ============================================================
 * 8. DISCONNECT FUNCTION
 * ============================================================
 */

export async function disconnectDatabase() {

  /*
   * Nothing to disconnect.
   */

  if (
    connection.readyState === 0
  ) {

    console.log(
      "[MongoDB] already disconnected",
    );

    return;

  }


  try {

    await mongoose.disconnect();

    console.log(
      "[MongoDB] disconnected successfully",
    );

  } catch (
    error
  ) {

    console.error(
      "[MongoDB] failed to disconnect:",
      error,
    );

    throw error;

  }

}


/*
 * ============================================================
 * 9. CONNECTION INFORMATION
 * ============================================================
 */

export function getConnectionInfo() {

  return {

    /*
     * Current connection state.
     */

    readyState:
      connection.readyState,

    state:
      getConnectionState(),


    /*
     * MongoDB host.
     */

    host:
      connection.host,


    /*
     * MongoDB port.
     */

    port:
      connection.port,


    /*
     * Database name.
     */

    database:
      connection.name,


    /*
     * Connection object.
     */

    connection:
      connection,

  };

}


/*
 * ============================================================
 * 10. SIMPLE HEALTH CHECK
 * ============================================================
 */

export function isDatabaseConnected() {

  return (
    connection.readyState === 1
  );

}


/*
 * ============================================================
 * 11. DATABASE HEALTH CHECK
 * ============================================================
 *
 * readyState === 1 means Mongoose considers the connection
 * connected.
 *
 * For a stronger health check, ping MongoDB itself.
 *
 * ============================================================
 */

export async function checkDatabaseHealth() {

  if (
    connection.readyState !== 1
  ) {

    return {

      healthy:
        false,

      state:
        getConnectionState(),

    };

  }


  try {

    await connection
      .db
      .admin()
      .ping();


    return {

      healthy:
        true,

      state:
        "connected",

      database:
        connection.name,

    };

  } catch (
    error
  ) {

    return {

      healthy:
        false,

      state:
        getConnectionState(),

      error,

    };

  }

}


/*
 * ============================================================
 * 12. MONGODB DATABASE OBJECT
 * ============================================================
 *
 * connection.db gives access to the underlying MongoDB
 * database object.
 *
 * ============================================================
 */

export function getDatabase() {

  if (
    !connection.db
  ) {

    throw new Error(
      "MongoDB connection is not established",
    );

  }


  return connection.db;

}


/*
 * ============================================================
 * 13. MONGOOSE CONNECTION
 * ============================================================
 *
 * Exporting the connection can be useful for advanced cases.
 * ============================================================
 */

export {
  connection,
};


/*
 * ============================================================
 * 14. GRACEFUL SHUTDOWN
 * ============================================================
 *
 * When Node receives termination signals, close MongoDB
 * cleanly before terminating the process.
 *
 * ============================================================
 */

let shuttingDown = false;


async function gracefulShutdown(
  signal,
) {

  /*
   * Prevent shutdown from running twice.
   */

  if (shuttingDown) {
    return;
  }


  shuttingDown = true;


  console.log(
    `[Application] received ${signal}`,
  );


  try {

    await disconnectDatabase();

    console.log(
      "[Application] shutdown complete",
    );

    process.exit(
      0,
    );

  } catch (
    error
  ) {

    console.error(
      "[Application] shutdown failed:",
      error,
    );

    process.exit(
      1,
    );

  }

}


/*
 * ============================================================
 * 15. PROCESS SIGNALS
 * ============================================================
 */

process.once(
  "SIGINT",
  () => {

    gracefulShutdown(
      "SIGINT",
    );

  },
);


process.once(
  "SIGTERM",
  () => {

    gracefulShutdown(
      "SIGTERM",
    );

  },
);


/*
 * ============================================================
 * 16. UNHANDLED ERROR
 * ============================================================
 *
 * This is a last-resort safety net.
 *
 * Don't use it as a replacement for proper try/catch and
 * error handling.
 *
 * ============================================================
 */

process.on(
  "unhandledRejection",
  (
    reason,
  ) => {

    console.error(
      "[Process] unhandled rejection:",
      reason,
    );

  },
);


/*
 * ============================================================
 * 17. EXAMPLE
 * ============================================================
 *
 * Run:
 *
 *     node 01_connection.js
 *
 * ============================================================
 */

if (
  process.argv[1] ===
  new URL(
    import.meta.url,
  ).pathname
) {

  try {

    await connectDatabase();


    console.log(
      "\nConnection information:",
    );

    console.log(
      getConnectionInfo(),
    );


    console.log(
      "\nHealth check:",
    );

    console.log(
      await checkDatabaseHealth(),
    );


  } catch (
    error
  ) {

    console.error(
      "[Application] startup failed:",
      error,
    );

    process.exit(
      1,
    );

  }

}


/*
 * ============================================================
 * 18. IMPORTANT CONNECTION PROPERTIES
 * ============================================================
 *
 *
 * connection.readyState
 *     Current Mongoose connection state.
 *
 *
 * connection.host
 *     MongoDB host.
 *
 *
 * connection.port
 *     MongoDB port.
 *
 *
 * connection.name
 *     Database name.
 *
 *
 * connection.db
 *     Underlying MongoDB Db instance.
 *
 *
 * connection.client
 *     Underlying MongoDB client.
 *
 *
 * connection.config
 *     Mongoose connection configuration.
 *
 *
 * connection.models
 *     Models registered on this connection.
 *
 *
 * ============================================================
 */


/*
 * ============================================================
 * 19. CONNECTION POOL
 * ============================================================
 *
 *
 * maxPoolSize
 *     Maximum number of connections/sockets in the pool.
 *
 *
 * minPoolSize
 *     Minimum number maintained in the pool.
 *
 *
 * maxIdleTimeMS
 *     Maximum idle time before an idle connection can be
 *     removed.
 *
 *
 * waitQueueTimeoutMS
 *     Maximum time an operation waits for an available
 *     connection from the pool.
 *
 *
 * ============================================================
 */


/*
 * ============================================================
 * 20. IMPORTANT DISTINCTION
 * ============================================================
 *
 *
 * Mongoose connection:
 *
 *     mongoose.connection
 *
 *
 * MongoDB client:
 *
 *     connection.getClient()
 *
 *
 * MongoDB database:
 *
 *     connection.db
 *
 *
 * MongoDB collection:
 *
 *     connection.collection("users")
 *
 *
 * ============================================================
 */


/*
 * ============================================================
 * 21. GET UNDERLYING MONGODB CLIENT
 * ============================================================
 */

export function getMongoClient() {

  return connection
    .getClient();

}


/*
 * ============================================================
 * 22. GET COLLECTION
 * ============================================================
 */

export function getCollection(
  collectionName,
) {

  if (
    !connection.db
  ) {

    throw new Error(
      "MongoDB connection is not established",
    );

  }


  return connection
    .collection(
      collectionName,
    );

}


/*
 * ============================================================
 * 23. FINAL CONNECTION LIFECYCLE
 * ============================================================
 *
 *
 * Application starts
 *        ↓
 * connectDatabase()
 *        ↓
 * MongoDB connection
 *        ↓
 * "connected"
 *        ↓
 * Application running
 *        ↓
 * MongoDB error/disconnect
 *        ↓
 * "error" / "disconnected"
 *        ↓
 * Driver may reconnect depending on topology
 *        ↓
 * "reconnected"
 *        ↓
 * Application continues
 *        ↓
 * SIGINT / SIGTERM
 *        ↓
 * disconnectDatabase()
 *        ↓
 * MongoDB closed
 *        ↓
 * process.exit()
 *
 * ============================================================
 */