import React from "react";
import { History, Trash2 } from "lucide-react";
import { formatHistoryDate, TEMPLATE_META } from "../utils/content";

// Compact history list for restoring older drafts and clearing entries.
export default function HistoryPanel({ history, onSelectHistory, onDeleteHistory, onClearHistory }) {
  return (
    <section className="workspace-panel glass-card right-panel-card right-panel-sticky-top">
      <div className="history-header-row">
        <div className="section-title">
          <History size={16} />
          <span>History</span>
        </div>

        <button type="button" className="ghost-btn" onClick={onClearHistory} disabled={!history.length}>
          Delete all
        </button>
      </div>

      <div className="history-list history-list-right history-list-hidden-scrollbar">
        {history.length ? (
          history.map((item) => {
            const itemMeta = TEMPLATE_META[item.template] || TEMPLATE_META.instagram;

            return (
              <div
                key={item.id}
                className="history-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectHistory(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectHistory(item);
                  }
                }}
              >
                <div className="history-card-top">
                  <span className="history-template-tag">{itemMeta.badge}</span>
                  <button
                    type="button"
                    className="history-delete-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteHistory(item.id);
                    }}
                    title="Delete this history item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <strong>{item.title || item.topic}</strong>
                <p>{item.preview || "Open to load this draft again."}</p>
                <span className="history-date">{formatHistoryDate(item.createdAt)}</span>
              </div>
            );
          })
        ) : (
          <div className="history-empty-state">
            <p>No history yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
