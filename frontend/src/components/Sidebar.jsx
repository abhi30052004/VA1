import React from "react";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATE_LIST } from "../utils/content";

// Left sidebar only for platform selection so the layout stays cleaner.
export default function Sidebar({ selectedTemplate, onSelectTemplate }) {
  return (
    <aside className="sidebar glass-card">
      <div className="section-title">
        <LayoutTemplate size={16} />
        <span>Platforms</span>
      </div>

      <div className="platform-list-vertical compact-platform-list">
        {TEMPLATE_LIST.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              type="button"
              className={`platform-card platform-card-clean ${selectedTemplate === template.id ? "active" : ""}`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="template-icon bubble-icon">
                <Icon size={18} />
              </div>

              <div className="platform-copy compact-platform-copy">
                <div className="platform-title-row">
                  <strong>{template.label}</strong>
                  <span className="history-template-tag platform-tag-inline">{template.badge}</span>
                </div>
                <p>{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
