import React from "react";
import { Copy, ExternalLink, Wand2, Scissors, Expand, Sparkles, ClipboardPen } from "lucide-react";
import SkeletonContent from "./SkeletonContent";
import RichTextEditor from "./RichTextEditor";
import { TEMPLATE_META } from "../utils/content";

// Live editor wrapper: quick actions, typing indicator, and Canva handoff.
export default function LiveEditor({
  sectionRef,
  editorValue,
  editorText,
  onEditorChange,
  onCopy,
  onTransform,
  onCanva,
  loading,
  streaming,
  selectedTemplate
}) {
  const templateMeta = TEMPLATE_META[selectedTemplate] || TEMPLATE_META.instagram;
  const isBusy = loading || streaming;
  const showSkeleton = loading && !streaming && !editorText.trim();

  return (
    <section ref={sectionRef} className="workspace-panel glass-card editor-panel-shell">
      <div className="block-heading editor-heading">
        <div>
          <div className="editor-heading-topline">
            <h3>Live editor</h3>
            <span className="section-badge">{templateMeta.label}</span>
            {isBusy ? (
              <span className="streaming-pill">
                <Sparkles size={14} />
                AI writing
                <span className="typing-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="quick-actions">
          <button type="button" className="icon-btn" onClick={() => onTransform("improve")} disabled={isBusy}>
            <Wand2 size={16} />
            Improve
          </button>
          <button type="button" className="icon-btn" onClick={() => onTransform("shorten")} disabled={isBusy}>
            <Scissors size={16} />
            Shorter
          </button>
          <button type="button" className="icon-btn" onClick={() => onTransform("expand")} disabled={isBusy}>
            <Expand size={16} />
            Expand
          </button>
          <button type="button" className="icon-btn" onClick={onCopy} disabled={isBusy}>
            <Copy size={16} />
            Copy
          </button>
          <button type="button" className="icon-btn primary-icon-btn" onClick={onCanva} disabled={isBusy}>
            <ExternalLink size={16} />
            Canva
          </button>
        </div>
      </div>

      <div className="editor-relative-container">
        {showSkeleton && (
          <div className="editor-skeleton-overlay">
            <SkeletonContent />
          </div>
        )}
        <RichTextEditor value={editorValue} onChange={onEditorChange} onTransform={onTransform} />
      </div>

      <div className="editor-footer compact-editor-footer">
        <div className="editor-stat-row compact-editor-stats">
          <span>{editorText.length} chars</span>
          <span>{editorText.trim() ? editorText.trim().split(/\s+/).length : 0} words</span>
        </div>

        <div className="canva-helper-pill compact-helper-pill">
          <ClipboardPen size={15} />
          <span>Canva opens after copying the current editor text.</span>
        </div>
      </div>
    </section>
  );
}
