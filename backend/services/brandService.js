import { getDb } from "../lib/db.js";

const COLLECTION_NAME = "brand_profile";

export async function getBrandProfile() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    // We only store ONE brand profile for now (MVP).
    // In a multi-user app, we'd use a userId filter.
    const profile = await collection.findOne({});
    
    if (!profile) {
      return {
        companyName: "",
        mission: "",
        audience: "",
        updatedAt: null
      };
    }

    return profile;
  } catch (error) {
    console.error("Error fetching brand profile from DB:", error);
    return null;
  }
}

export async function saveBrandProfile(data) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const updateDoc = {
      companyName: data.companyName || "",
      mission: data.mission || "",
      audience: data.audience || "",
      updatedAt: new Date(),
    };

    // Upsert the single profile.
    await collection.updateOne(
      {}, 
      { $set: updateDoc }, 
      { upsert: true }
    );

    return updateDoc;
  } catch (error) {
    console.error("Error saving brand profile to DB:", error);
    throw error;
  }
}
