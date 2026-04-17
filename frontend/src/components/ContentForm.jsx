import React from "react";
import PromptControls from "./PromptControls";
import { TEMPLATE_META } from "../utils/content";

// Main brief form: only the few inputs needed before generation.
export default function ContentForm({ form, onChange, onSubmit, onKeyDown, loading, selectedTemplate, onSelectTemplate }) {
  const templateMeta = TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;

  return (
    <section className="workspace-panel glass-card">
      <PromptControls
        form={form}
        onChange={onChange}
        templateMeta={templateMeta}
        onSelectTemplate={onSelectTemplate}
        selectedTemplate={selectedTemplate}
      />

      <div className="panel-block compact-brief-block">
        <div className="block-heading compact-heading-row">
          <h3>Create {templateMeta.label}</h3>
          <span className="section-badge">{templateMeta.badge}</span>
        </div>

        <div className="grid-two compact-brief-grid">
          <label>
            Audience
            <input
              type="text"
              name="audience"
              value={form.audience}
              onChange={onChange}
              placeholder="startup founders, local customers, followers"
            />
          </label>

          <label>
            Topic
            <input
              type="text"
              name="topic"
              value={form.topic}
              onChange={onChange}
              placeholder="launch, service update, rainy day post"
            />
          </label>

          <label className="full-width">
            Key message
            <textarea
              name="keyMessage"
              rows="5"
              value={form.keyMessage}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder="Main message, offer, service, or content angle..."
            />
          </label>
        </div>

        <div className="form-footer-row compact-form-footer-row">
          <button type="button" className="primary-btn" onClick={onSubmit} disabled={loading}>
            {loading ? "Generating..." : `Generate ${templateMeta.actionLabel}`}
          </button>
        </div>
      </div>
    </section>
  );
}
