import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB_URL;
const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};

async function connectMongo() {
  console.log("Checking if MONGO_URI is set...");
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  console.log("Checking if connection is already cached...");
  if (cached.connection) {
    console.log("Using cached connection...");
    return cached.connection;
  }

  console.log("No cached connection found, creating new promise...");
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    console.log("Awaiting MongoDB connection...");
    cached.connection = await cached.promise;
    console.log("MongoDB connection established.");
  } catch (e) {
    console.log("MongoDB connection failed:", e);
    cached.promise = undefined;
    throw e;
  }

  return cached.connection;
}

export default connectMongo;
