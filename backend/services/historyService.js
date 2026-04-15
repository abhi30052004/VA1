import { getDb } from "../lib/db.js";

const COLLECTION_NAME = "generations";

export async function saveGeneration(data, payload) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const document = {
      ...data,
      payload, // including the inputs used to generate it
      createdAt: new Date(),
    };

    const result = await collection.insertOne(document);
    return { ...document, id: result.insertedId };
  } catch (error) {
    console.error("Error saving generation to DB:", error);
    // Don't throw error here to avoid breaking the generation flow
    return null;
  }
}

export async function getHistory(limit = 30) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    return await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error("Error fetching history from DB:", error);
    return [];
  }
}

export async function deleteGeneration(id) {
  try {
    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteOne({ _id: new ObjectId(id) });
    return true;
  } catch (error) {
    console.error("Error deleting generation from DB:", error);
    return false;
  }
}

export async function clearHistory() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteMany({});
    return true;
  } catch (error) {
    console.error("Error clearing history in DB:", error);
    return false;
  }
}
