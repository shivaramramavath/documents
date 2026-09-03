import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

export async function connectDatabase() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}
