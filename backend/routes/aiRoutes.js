import express from "express";
import { validateGenerationPayload, validateTransformPayload } from "../utils/validators.js";
import { generateStructuredContent, transformGeneratedContent } from "../services/openaiService.js";
import { readUsageStats } from "../services/usageService.js";
import { getHistory, deleteGeneration, clearHistory } from "../services/historyService.js";
import { getBrandProfiles, saveBrandProfile, deleteBrandProfile } from "../services/brandService.js";

const router = express.Router();

// Creates a brand-new content package from a short structured brief.
router.post("/generate", async (req, res) => {
  try {
    const payload = validateGenerationPayload(req.body);
    const result = await generateStructuredContent(payload);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to generate content."
    });
  }
});

// Applies one-click edits to the current editor content.
router.post("/transform", async (req, res) => {
  try {
    const payload = validateTransformPayload(req.body);
    const result = await transformGeneratedContent(payload);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to transform content."
    });
  }
});

// Returns current counts and estimated cost values for the header chips.
router.get("/stats", async (_req, res) => {
  try {
    const stats = await readUsageStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to load usage stats."
    });
  }
});

// History routes
router.get("/history", async (_req, res) => {
  try {
    const history = await getHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history." });
  }
});

router.delete("/history/:id", async (req, res) => {
  try {
    await deleteGeneration(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete history item." });
  }
});

router.delete("/history", async (_req, res) => {
  try {
    await clearHistory();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear history." });
  }
});

// Brand memory routes
router.get("/brand", async (_req, res) => {
  try {
    const profiles = await getBrandProfiles();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to load brand profiles." });
  }
});

router.post("/brand", async (req, res) => {
  try {
    const profile = await saveBrandProfile(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to save brand profile." });
  }
});

router.delete("/brand/:id", async (req, res) => {
  try {
    await deleteBrandProfile(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete brand profile." });
  }
});

export default router;
