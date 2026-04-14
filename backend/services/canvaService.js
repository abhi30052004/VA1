// Canva handoff helper.
// This does NOT claim to be a direct Magic Write integration.
// It gives you a clean extension point for future Canva Connect / Apps SDK work.

export function buildCanvaHandoff({ text, title }) {
  const canvaBase = process.env.CANVA_BASE_URL || "https://www.canva.com";

  return {
    provider: "canva",
    title,
    copiedTextLength: text?.length || 0,
    message:
      "The text is ready for handoff. The app can open Canva in a new tab while the generated text is copied for pasting.",
    url: `${canvaBase}/docs/`
  };
}
