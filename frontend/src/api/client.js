const API_BASE_URL = "https://va1.onrender.com";

// Generic request helper.
// Keeps fetch logic in one place for easier maintenance.
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Error: Something went wrong while contacting the server.",
    );
  }

  return data;
}

export async function generateContent(payload) {
  return request("/api/ai/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function transformContent(payload) {
  return request("/api/ai/transform", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCanvaHandoff(payload) {
  return request("/api/canva/handoff", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUsageStats() {
  return request("/api/ai/stats");
}

export async function getHistory() {
  return request("/api/ai/history");
}

export async function deleteHistoryItem(id) {
  return request(`/api/ai/history/${id}`, {
    method: "DELETE",
  });
}

export async function clearServerHistory() {
  return request("/api/ai/history", {
    method: "DELETE",
  });
}

export async function getBrand() {
  return request("/api/ai/brand");
}

export async function saveBrand(payload) {
  return request("/api/ai/brand", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteBrand(id) {
  return request(`/api/ai/brand/${id}`, {
    method: "DELETE",
  });
}
