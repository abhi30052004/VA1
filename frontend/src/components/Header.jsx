import React from "react";
import { PenTool, Activity } from "lucide-react";
import { TEMPLATE_META } from "../utils/content";

// Top header: selected format chip + simple OpenAI hit counter only.
export default function Header({ usageStats, selectedTemplate }) {
  const templateMeta =
    TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;

  return (
    <header className="topbar glass-card">
      <div className="brand-wrap">
        <div className="brand-icon">
          <PenTool size={20} />
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

        {/* <div className="topbar-chip topbar-chip-accent">
          <span>{templateMeta.label}</span>
        </div> */}

        <div className="topbar-chip">
          <Activity size={16} />
          <span>{usageStats?.totalCalls || 0} OpenAI hits</span>
        </div>

        <div className="topbar-chip">
          <span className="chip-label-dim">Last:</span>
          <strong>${(usageStats?.lastCallCostUsd || 0).toFixed(5)}</strong>
        </div>

        <div className="topbar-chip topbar-chip-accent cost-chip">
          <div className="cost-chip-main">
            <span className="chip-label-dim">Total:</span>
            <strong>
              ${(usageStats?.totalEstimatedCostUsd || 0).toFixed(5)}
            </strong>
          </div>
          <div
            className="cost-progress-wrap"
            title={`Budget: ${usageStats?.maxCostUsd}$`}
          >
            <div
              className="cost-progress-bar"
              style={{
                width: `${Math.min(((usageStats?.totalEstimatedCostUsd || 0) / (usageStats?.maxCostUsd || 5)) * 100, 100)}%`,
                background:
                  (usageStats?.totalEstimatedCostUsd || 0) >
                  (usageStats?.maxCostUsd || 5) * 0.8
                    ? "#ff4d4d"
                    : "#4de6ff",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
