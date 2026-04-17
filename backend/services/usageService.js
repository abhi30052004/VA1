import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "..", "data");
const statsFilePath = path.join(dataDirectory, "usage-stats.json");

function getCostConfig() {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  
  // Default to gpt-4o-mini prices if not overridden by env
  let inputPer1M = 0.15;
  let outputPer1M = 0.6;

  // Manual model overrides if not explicitly in .env
  if (model.includes("gpt-3.5")) {
    inputPer1M = 0.5;
    outputPer1M = 1.5;
  } else if (model.includes("gpt-4o") && !model.includes("mini")) {
    inputPer1M = 5.0;
    outputPer1M = 15.0;
  }

  return {
    inputPer1M: Number(process.env.OPENAI_COST_INPUT_PER_1M || inputPer1M),
    outputPer1M: Number(process.env.OPENAI_COST_OUTPUT_PER_1M || outputPer1M),
    maxTotalCostUsd: Number(process.env.OPENAI_MAX_TOTAL_COST_USD || 5)
  };
}

function roundCost(value) {
  return Number((value || 0).toFixed(6));
}

function calculateCallCost({ inputTokens = 0, outputTokens = 0 } = {}) {
  const config = getCostConfig();
  const inputCost = (inputTokens / 1_000_000) * config.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * config.outputPer1M;
  return roundCost(inputCost + outputCost);
}

const defaultStats = {
  totalCalls: 0,
  generateCalls: 0,
  transformCalls: 0,
  lastUsedAt: null,
  totalEstimatedCostUsd: 0,
  lastCallCostUsd: 0,
  maxCostUsd: getCostConfig().maxTotalCostUsd,
  overLimit: false
};

async function ensureStatsFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(statsFilePath);
  } catch (_error) {
    await fs.writeFile(statsFilePath, JSON.stringify(defaultStats, null, 2), "utf8");
  }
}

export async function readUsageStats() {
  await ensureStatsFile();

  try {
    const raw = await fs.readFile(statsFilePath, "utf8");
    const parsed = JSON.parse(raw);
    const maxCostUsd = getCostConfig().maxTotalCostUsd;
    const totalEstimatedCostUsd = roundCost(parsed.totalEstimatedCostUsd || 0);

    return {
      ...defaultStats,
      ...parsed,
      maxCostUsd,
      totalEstimatedCostUsd,
      lastCallCostUsd: roundCost(parsed.lastCallCostUsd || 0),
      overLimit: totalEstimatedCostUsd > maxCostUsd
    };
  } catch (_error) {
    return {
      ...defaultStats,
      maxCostUsd: getCostConfig().maxTotalCostUsd
    };
  }
}

// Saves both usage counts and estimated cost so the UI can show a lightweight budget guard.
export async function incrementUsage(type, usage = {}) {
  const currentStats = await readUsageStats();
  const callCostUsd = calculateCallCost(usage);

  currentStats.totalCalls += 1;
  currentStats.lastUsedAt = new Date().toISOString();
  currentStats.lastCallCostUsd = callCostUsd;
  currentStats.totalEstimatedCostUsd = roundCost(currentStats.totalEstimatedCostUsd + callCostUsd);
  currentStats.maxCostUsd = getCostConfig().maxTotalCostUsd;
  currentStats.overLimit = currentStats.totalEstimatedCostUsd > currentStats.maxCostUsd;

  if (type === "generate") {
    currentStats.generateCalls += 1;
  }

  if (type === "transform") {
    currentStats.transformCalls += 1;
  }

  await fs.writeFile(statsFilePath, JSON.stringify(currentStats, null, 2), "utf8");

  console.log(`[Usage] Hit # ${currentStats.totalCalls} (${type}) | Cost: $${callCostUsd} | Total: $${currentStats.totalEstimatedCostUsd} | Tokens: In=${usage.inputTokens}, Out=${usage.outputTokens}`);

  return currentStats;
}
