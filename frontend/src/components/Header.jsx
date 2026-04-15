import React from "react";
import { Sparkles, Activity } from "lucide-react";
import { TEMPLATE_META } from "../utils/content";

// Top header: selected format chip + simple OpenAI hit counter only.
export default function Header({ usageStats, selectedTemplate }) {
  const templateMeta = TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;

  return (
    <header className="topbar glass-card">
      <div className="brand-wrap">
        <div className="brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <h1>Social Media &amp; Website Support</h1>
          <p>Draft, refine, and edit faster.</p>
        </div>
      </div>

      <div className="topbar-chips">
        <div className="autosave-status">
          <div className="autosave-dot" />
          <span>Cloud Sync Active</span>
        </div>

        <div className="topbar-chip topbar-chip-accent">
          <span>{templateMeta.label}</span>
        </div>

        <div className="topbar-chip">
          <Activity size={16} />
          <span>{usageStats?.totalCalls || 0} OpenAI hits</span>
        </div>

        <div className="topbar-chip">
          <span className="chip-label-dim">Last:</span>
          <strong>${(usageStats?.lastCallCostUsd || 0).toFixed(4)}</strong>
        </div>

        <div className="topbar-chip topbar-chip-accent">
          <span className="chip-label-dim">Total:</span>
          <strong>${(usageStats?.totalEstimatedCostUsd || 0).toFixed(3)}</strong>
        </div>
      </div>
    </header>
  );
}
