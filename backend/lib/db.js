import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    const db = client.db(dbName);

    console.log("Connected to MongoDB");
    return db; // return db instance if needed elsewhere
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

connectDB();
