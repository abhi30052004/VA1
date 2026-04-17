import { ChatOpenAI } from "@langchain/openai";
import { socialMediaPromptTemplate, transformPromptTemplate } from "../prompts/socialMediaPrompt.js";
import { incrementUsage } from "./usageService.js";
import { saveGeneration } from "./historyService.js";
import { getBrandProfile } from "./brandService.js";

// Shared model instance used for both first-draft generation and refinement.
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  temperature: 0.7
});

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("AI response was not valid JSON. Please try again.");
  }
}

function extractResponseText(response) {
  return typeof response.content === "string" ? response.content : response.content?.[0]?.text || "";
}

// Reads token usage from the different shapes LangChain/OpenAI may return.
function extractTokenUsage(response) {
  // Try usage_metadata first (newer LangChain standardized format)
  if (response?.usage_metadata) {
    const um = response.usage_metadata;
    return {
      inputTokens: um.input_tokens || um.prompt_tokens || 0,
      outputTokens: um.output_tokens || um.completion_tokens || 0,
      totalTokens: um.total_tokens || 0
    };
  }

  // Fallback to response_metadata.tokenUsage (some older LangChain versions)
  const usage = response?.response_metadata?.tokenUsage || response?.response_metadata?.usage || {};

  return {
    inputTokens: Number(usage.input_tokens || usage.promptTokens || usage.prompt_tokens || 0),
    outputTokens: Number(usage.output_tokens || usage.completionTokens || usage.completion_tokens || 0),
    totalTokens: Number(usage.total_tokens || usage.totalTokens || 0)
  };
}

export async function generateStructuredContent(payload) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in backend environment.");
  }

  const brandProfile = await getBrandProfile();
  const brandMemory = brandProfile 
    ? `Company: ${brandProfile.companyName}, Mission: ${brandProfile.mission}. Default Audience: ${brandProfile.audience}`
    : "None";

  // If audience is generic or from client memory, prioritize it if user didn't specify.
  const finalAudience = payload.audience || brandProfile?.audience || "Business professional";

  const prompt = await socialMediaPromptTemplate.format({
    ...payload,
    audience: finalAudience,
    brandMemory
  });
  const response = await model.invoke(prompt);
  const parsed = safeJsonParse(extractResponseText(response));
  const usageStats = await incrementUsage("generate", extractTokenUsage(response));

  const result = {
    ...parsed,
    _usage: usageStats
  };

  // Save to MongoDB history
  await saveGeneration(result, payload);

  return result;
}

export async function transformGeneratedContent(payload) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in backend environment.");
  }

  const brandProfile = await getBrandProfile();
  const brandMemory = brandProfile 
    ? `Company: ${brandProfile.companyName}, Mission: ${brandProfile.mission}. Default Audience: ${brandProfile.audience}`
    : "None";

  const prompt = await transformPromptTemplate.format({
    ...payload,
    instruction: payload.instruction || "None",
    brandMemory
  });
  const response = await model.invoke(prompt);
  const parsed = safeJsonParse(extractResponseText(response));
  const usageStats = await incrementUsage("transform", extractTokenUsage(response));

  return {
    ...parsed,
    _usage: usageStats
  };
}
