import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

export const getDb = async () => {
  if (!db) await connectDB();
  return db;
};

connectDB();
