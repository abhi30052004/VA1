import React from "react";
import { LayoutTemplate, Brain, Zap } from "lucide-react";
import { TEMPLATE_LIST } from "../utils/content";

// Left sidebar only for platform selection so the layout stays cleaner.
export default function Sidebar({ selectedTemplate, onSelectTemplate, activeTab, onSelectTab }) {
  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${activeTab === "generator" ? "active" : ""}`}
          onClick={() => onSelectTab("generator")}
        >
          <div className="tab-icon"><Zap size={18} /></div>
          <span>Generator</span>
        </button>
        <button 
          className={`sidebar-tab ${activeTab === "brand" ? "active" : ""}`}
          onClick={() => onSelectTab("brand")}
        >
          <div className="tab-icon"><Brain size={18} /></div>
          <span>Brand Memory</span>
        </button>
      </div>

      <div className="sidebar-divider" />

      {activeTab === "generator" ? (
        <>
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
                    <strong>{template.label}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="sidebar-empty-hint">
          <p>Configure your brand details to provide context for AI generations.</p>
        </div>
      )}
    </aside>
  );
}
