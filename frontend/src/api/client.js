const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Generic request helper.
// Keeps fetch logic in one place for easier maintenance.
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong while contacting the server.");
  }

  return data;
}

export async function generateContent(payload) {
  return request("/api/ai/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function transformContent(payload) {
  return request("/api/ai/transform", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getCanvaHandoff(payload) {
  return request("/api/canva/handoff", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getUsageStats() {
  return request("/api/ai/stats");
}
