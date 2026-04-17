import { getDb } from "../lib/db.js";

const COLLECTION_NAME = "brand_profile";

export async function getBrandProfiles() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    // Return all saved profiles
    return await collection.find({}).sort({ updatedAt: -1 }).toArray();
  } catch (error) {
    console.error("Error fetching brand profiles from DB:", error);
    return [];
  }
}

export async function saveBrandProfile(data) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const doc = {
      companyName: data.companyName || "Unnamed Brand",
      mission: data.mission || "",
      audience: data.audience || "",
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  } catch (error) {
    console.error("Error saving brand profile to DB:", error);
    throw error;
  }
}

export async function deleteBrandProfile(id) {
  try {
    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteOne({ _id: new ObjectId(id) });
    return true;
  } catch (error) {
    console.error("Error deleting brand profile:", error);
    return false;
  }
}

