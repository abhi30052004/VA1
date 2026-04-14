function ensureString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string.`);
  }

  return value.trim();
}

// Keeps the backend strict enough for reliable prompting without adding heavy schema code.
export function validateGenerationPayload(body = {}) {
  const payload = {
    platform: ensureString(body.platform || "instagram", "platform"),
    template: ensureString(body.template || "instagram", "template"),
    brandVoice: ensureString(body.brandVoice || "professional", "brandVoice"),
    length: ensureString(body.length || "medium", "length"),
    audience: ensureString(body.audience || "general audience", "audience"),
    topic: ensureString(body.topic || "", "topic"),
    keyMessage: ensureString(body.keyMessage || "", "keyMessage"),
    cta: ensureString(body.cta || "", "cta")
  };

  if (!payload.topic) {
    throw new Error("Topic is required.");
  }

  if (!payload.keyMessage) {
    throw new Error("Key message is required.");
  }

  return payload;
}

// Validates quick improve actions coming from the live editor and suggestions panel.
export function validateTransformPayload(body = {}) {
  const payload = {
    action: ensureString(body.action || "improve", "action"),
    instruction: ensureString(body.instruction || "", "instruction"),
    platform: ensureString(body.platform || "instagram", "platform"),
    brandVoice: ensureString(body.brandVoice || "professional", "brandVoice"),
    content: ensureString(body.content || "", "content")
  };

  if (!payload.content) {
    throw new Error("Content is required.");
  }

  return payload;
}
