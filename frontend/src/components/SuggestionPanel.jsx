import React from "react";
import { Sparkles, Hash, Scissors, Briefcase, Zap , Smile, Lightbulb} from "lucide-react";
import { TEMPLATE_META } from "../utils/content";

const quickActionButtons = [
  { label: "Shorter", action: "shorten", icon: Scissors },
  { label: "Professional", action: "professional", icon: Briefcase },
  { label: "Engaging", action: "engaging", icon: Sparkles },
  { label: "Hashtags", action: "add_hashtags", icon: Hash },
  { label: "Emoji", action: "add_emoji", icon: Smile },
  { label: "Catchy", action: "add_hook", icon: Lightbulb }
];

// Compact action panel: less text, more one-click refinement.
export default function SuggestionPanel({ suggestions, onApplyAction, selectedTemplate }) {
  const templateMeta = TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;
  const compactIdeas = (suggestions?.length ? suggestions : [""]).slice(0, 0);

  return (
    <section className="workspace-panel glass-card right-panel-card suggestion-panel-compact">
      <div className="block-heading compact-heading-row">
        <h3>Quick actions</h3>
        <span className="section-badge">{templateMeta.badge}</span>
      </div>

      <div className="quick-suggestion-actions compact-action-grid">
        {quickActionButtons.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.action}
              type="button"
              className="suggestion-chip suggestion-chip-block"
              onClick={() => onApplyAction(item.action)}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="idea-chip-wrap">
        {compactIdeas.map((item, index) => (
          <div key={`${item}-${index}`} className="idea-chip">
            <Zap size={13} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
