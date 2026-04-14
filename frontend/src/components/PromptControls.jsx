import React from "react";
import { SlidersHorizontal } from "lucide-react";

// Small quick-controls block for format, voice, and output size.
export default function PromptControls({ form, onChange, templateMeta }) {
  return (
    <div className="compact-controls panel-block">
      <div className="compact-controls-title compact-heading-row">
        <div className="section-title">
          <SlidersHorizontal size={16} />
          <span>Quick controls</span>
        </div>
      </div>

      <div className="compact-controls-grid quick-controls-grid clean-two-col-controls">
        <label>
          Format
          <div className="quick-control-readonly quick-control-simple">
            <strong>{templateMeta.label}</strong>
          </div>
        </label>

        <label>
          Brand voice
          <select name="brandVoice" value={form.brandVoice} onChange={onChange}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="premium">Premium</option>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold</option>
          </select>
        </label>

        <label>
          Content size
          <select name="length" value={form.length} onChange={onChange}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </label>
      </div>
    </div>
  );
}
