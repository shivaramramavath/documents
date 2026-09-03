import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/*
 * ============================================================
 * Connection options
 * ============================================================
 */

const connectionOptions = {
  maxPoolSize: 20,

  minPoolSize: 5,

  serverSelectionTimeoutMS: 5000,

  socketTimeoutMS: 45000,
};

/*
 * ============================================================
 * Connect
 * ============================================================
 */

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  await mongoose.connect(MONGODB_URI, connectionOptions);

  return mongoose.connection;
}

/*
 * ============================================================
 * Disconnect
 * ============================================================
 */

export async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
}

/*
 * ============================================================
 * Database health
 * ============================================================
 */

export function getDatabaseHealth() {
  const states = {
    0: "disconnected",

    1: "connected",

    2: "connecting",

    3: "disconnecting",
  };

  return {
    state: states[mongoose.connection.readyState],

    readyState: mongoose.connection.readyState,

    host: mongoose.connection.host,

    name: mongoose.connection.name,
  };
}
