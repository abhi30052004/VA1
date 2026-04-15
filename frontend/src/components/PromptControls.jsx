import React from "react";
import { 
  SlidersHorizontal, 
  Briefcase, 
  Smile, 
  Crown, 
  Zap, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignJustify,
  Layers
} from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { TEMPLATE_LIST } from "../utils/content";

const VOICE_OPTIONS = [
  { value: "professional", label: "Professional", icon: Briefcase, description: "Formal and authority-focused" },
  { value: "friendly", label: "Friendly", icon: Smile, description: "Warm and conversational" },
  { value: "premium", label: "Premium", icon: Crown, description: "Elegant and sophisticated" },
  { value: "minimal", label: "Minimal", icon: Type, description: "Clear and direct" },
  { value: "bold", label: "Bold", icon: Zap, description: "Punchy and energetic" },
];

const SIZE_OPTIONS = [
  { value: "short", label: "Short", icon: AlignLeft, description: "~50-100 words" },
  { value: "medium", label: "Medium", icon: AlignCenter, description: "~150-300 words" },
  { value: "long", label: "Long", icon: AlignJustify, description: "400+ words" },
];

export default function PromptControls({ form, onChange, templateMeta, onSelectTemplate, selectedTemplate }) {
  const handleDropdownChange = (name, value) => {
    onChange({
      target: { name, value }
    });
  };

  const formatOptions = TEMPLATE_LIST.map(t => ({
    value: t.id,
    label: t.label,
    icon: t.icon,
    description: t.badge
  }));

  return (
    <div className="compact-controls panel-block">
      <div className="compact-controls-title compact-heading-row">
        <div className="section-title">
          <SlidersHorizontal size={16} />
          <span>Quick controls</span>
        </div>
      </div>

      <div className="compact-controls-grid quick-controls-grid three-col-grid clean-two-col-controls">
        <CustomDropdown
          label="Format"
          value={selectedTemplate}
          options={formatOptions}
          onChange={onSelectTemplate}
          icon={Layers}
        />

        <CustomDropdown
          label="Brand voice"
          value={form.brandVoice}
          options={VOICE_OPTIONS}
          onChange={(val) => handleDropdownChange("brandVoice", val)}
          icon={Smile}
        />

        <CustomDropdown
          label="Content size"
          value={form.length}
          options={SIZE_OPTIONS}
          onChange={(val) => handleDropdownChange("length", val)}
          icon={AlignLeft}
        />
      </div>
    </div>
  );
}
