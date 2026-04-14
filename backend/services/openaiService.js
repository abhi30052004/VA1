import { ChatOpenAI } from "@langchain/openai";
import { socialMediaPromptTemplate, transformPromptTemplate } from "../prompts/socialMediaPrompt.js";
import { incrementUsage } from "./usageService.js";

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
  const usage = response?.usage_metadata || response?.response_metadata?.tokenUsage || {};

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

  const prompt = await socialMediaPromptTemplate.format(payload);
  const response = await model.invoke(prompt);
  const parsed = safeJsonParse(extractResponseText(response));
  const usageStats = await incrementUsage("generate", extractTokenUsage(response));

  return {
    ...parsed,
    _usage: usageStats
  };
}

export async function transformGeneratedContent(payload) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in backend environment.");
  }

  const prompt = await transformPromptTemplate.format({
    ...payload,
    instruction: payload.instruction || "None"
  });
  const response = await model.invoke(prompt);
  const parsed = safeJsonParse(extractResponseText(response));
  const usageStats = await incrementUsage("transform", extractTokenUsage(response));

  return {
    ...parsed,
    _usage: usageStats
  };
}
