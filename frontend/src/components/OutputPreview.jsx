import React from "react";
import { TEMPLATE_META } from "../utils/content";

// Clean read-only preview block for generated output.
export default function OutputPreview({ title, content, altDraft, selectedTemplate }) {
  const templateMeta = TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;

  return (
    <section className="workspace-panel glass-card">
      <div className="block-heading">
        <h3>Preview</h3>
        <p>Review the main {templateMeta.badge.toLowerCase()} and alternate version before final delivery.</p>
      </div>

      <div className="preview-card">
        <h4>{title || `Generated ${templateMeta.badge.toLowerCase()}`}</h4>
        <p className="preview-text">{content || "Nothing generated yet."}</p>
      </div>

      <div className="preview-card alt-preview">
        <h4>Alternate version</h4>
        <p className="preview-text">{altDraft || "No alternate version yet."}</p>
      </div>
    </section>
  );
}
