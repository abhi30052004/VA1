import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ContentForm from "./components/ContentForm";
import LiveEditor from "./components/LiveEditor";
import SuggestionPanel from "./components/SuggestionPanel";
import HistoryPanel from "./components/HistoryPanel";
import AnimatedBackground from "./components/AnimatedBackground";
import {
  generateContent,
  transformContent,
  getCanvaHandoff,
  getUsageStats,
  getHistory,
  deleteHistoryItem,
  clearServerHistory
} from "./api/client";
import { stripHtml, textToEditorHtml } from "./utils/content";

const HISTORY_STORAGE_KEY = "social-media-website-support-history";

const initialFormState = {
  brandVoice: "professional",
  length: "medium",
  audience: "business owners and brand managers",
  topic: "Social Media & Website Support",
  keyMessage:
    "AI supports caption drafting, messaging refinement, and website content structure before manual finalization.",
  cta: ""
};

const initialResultState = {
  title: "",
  mainDraft: "",
  altDraft: "",
  cta: "",
  hashtags: [],
  suggestions: []
};

function readStoredHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState("instagram");
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [editorText, setEditorText] = useState("");
  const [history, setHistory] = useState([]);
  const [usageStats, setUsageStats] = useState({
    totalCalls: 0,
    generateCalls: 0,
    transformCalls: 0,
    lastUsedAt: null,
    totalEstimatedCostUsd: 0,
    lastCallCostUsd: 0,
    maxCostUsd: 5,
    overLimit: false
  });
  const [result, setResult] = useState(initialResultState);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    icon: "info"
  });

  const editorSectionRef = useRef(null);
  const streamRunId = useRef(0);
  const toastTimerRef = useRef(null);

  const canGenerate = useMemo(
    () => form.topic.trim() && form.keyMessage.trim(),
    [form]
  );

  useEffect(() => {
    refreshHistory();
    refreshUsageStats();

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message = "Saved!!", icon = "info") {
    setToast({
      show: true,
      message,
      icon
    });

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast({
        show: false,
        message: "",
        icon: "info"
      });
    }, 1800);
  }

  function renderToastIcon(icon) {
    if (icon === "copy") {
      return <span className="toast-icon toast-icon-copy" aria-hidden="true" />;
    }

    if (icon === "success") {
      return (
        <span className="toast-icon toast-icon-badge" aria-hidden="true">
          ✓
        </span>
      );
    }

    if (icon === "warning") {
      return (
        <span className="toast-icon toast-icon-badge" aria-hidden="true">
          !
        </span>
      );
    }

    if (icon === "error") {
      return (
        <span className="toast-icon toast-icon-badge" aria-hidden="true">
          ×
        </span>
      );
    }

    return (
      <span className="toast-icon toast-icon-badge" aria-hidden="true">
        i
      </span>
    );
  }

  function persistHistory(nextHistory) {
    setHistory(nextHistory);
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  }

  async function refreshUsageStats() {
    try {
      const stats = await getUsageStats();
      setUsageStats(stats);
    } catch (_error) {
      // Keep the UI usable even if usage stats fail.
    }
  }

  function showLimitAlert(stats) {
    if (stats?.overLimit) {
      showToast("Max limit exceeded!!", "warning");
    }
  }

  function applyUsageFromResponse(data) {
    if (data?._usage) {
      setUsageStats(data._usage);
      showLimitAlert(data._usage);
    }
  }

  function scrollToEditor() {
    window.requestAnimationFrame(() => {
      editorSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  async function streamContentIntoEditor(nextText) {
    const currentRunId = ++streamRunId.current;
    setStreaming(true);
    setEditorValue("");
    setEditorText("");

    const words = nextText.split(/\s+/).filter(Boolean);
    const chunkSize = words.length > 90 ? 6 : 4;
    let built = "";

    for (let index = 0; index < words.length; index += chunkSize) {
      if (currentRunId !== streamRunId.current) return;

      built = `${built} ${words.slice(index, index + chunkSize).join(" ")}`.trim();
      setEditorText(built);
      
      const htmlContent = textToEditorHtml(built);
      // Inject caret into the last paragraph or append it
      const withCaret = htmlContent.endsWith("</p>") 
        ? htmlContent.replace(/<\/p>$/, '<span class="streaming-caret"></span></p>')
        : htmlContent + '<span class="streaming-caret"></span>';
      
      setEditorValue(withCaret);
      await wait(30);
    }

    setEditorValue(textToEditorHtml(nextText));
    setStreaming(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function saveHistoryEntry(
    data,
    payload,
    nextEditorText,
    nextEditorValue = textToEditorHtml(nextEditorText)
  ) {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      title: data.title,
      topic: payload.topic,
      template: payload.template,
      preview: nextEditorText.slice(0, 130),
      form: {
        brandVoice: payload.brandVoice,
        length: payload.length,
        audience: payload.audience,
        topic: payload.topic,
        keyMessage: payload.keyMessage,
        cta: payload.cta
      },
      result: data,
      editorValue: nextEditorValue,
      editorText: nextEditorText
    };

    persistHistory([newEntry, ...history].slice(0, 30));
  }

  async function handleGenerate() {
    if (!canGenerate) {
      showToast("Enter topic and key message!!", "warning");
      return;
    }

    try {
      setLoading(true);
      streamRunId.current += 1;
      scrollToEditor();

      const payload = {
        ...form,
        template: selectedTemplate,
        platform: selectedTemplate,
        cta: ""
      };

      const data = await generateContent(payload);
      const nextEditorText = stripHtml(data.mainDraft || "");
      const nextEditorValue = textToEditorHtml(data.mainDraft || "");

      setResult(data);
      await streamContentIntoEditor(nextEditorText);
      setEditorValue(nextEditorValue);
      setEditorText(nextEditorText);
      saveHistoryEntry(data, payload, nextEditorText, nextEditorValue);
      applyUsageFromResponse(data);
      await refreshUsageStats();
    } catch (error) {
      showToast(error?.message || "Something went wrong!!", "error");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  async function handleTransform(action, instruction = "") {
    if (!editorText.trim()) return;

    try {
      setLoading(true);
      scrollToEditor();

      const data = await transformContent({
        action,
        instruction,
        platform: selectedTemplate,
        brandVoice: form.brandVoice,
        content: editorText
      });

      const nextText = stripHtml(data.content || "");
      const nextValue = textToEditorHtml(data.content || "");

      await streamContentIntoEditor(nextText);
      setEditorValue(nextValue);
      setEditorText(nextText);
      setResult((previous) => ({
        ...previous,
        mainDraft: nextText,
        hashtags: data.hashtags || previous.hashtags,
        suggestions: data.suggestions || previous.suggestions
      }));
      applyUsageFromResponse(data);
      await refreshUsageStats();
    } catch (error) {
      showToast(error?.message || "Something went wrong!!", "error");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  async function handleCopy() {
    if (!editorText.trim()) return;

    try {
      await navigator.clipboard.writeText(editorText);
      showToast("Copied!!", "copy");
    } catch (error) {
      showToast(error?.message || "Copy failed!!", "error");
    }
  }

  async function handleCanva() {
    try {
      const data = await getCanvaHandoff({
        text: editorText,
        title: result.title || form.topic
      });

      if (editorText.trim()) {
        await navigator.clipboard.writeText(editorText);
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
      showToast("Copied!!", "copy");
    } catch (error) {
      showToast(error?.message || "Something went wrong!!", "error");
    }
  }

  function handleEditorChange(nextHtml, nextText) {
    setEditorValue(nextHtml);
    setEditorText(nextText || stripHtml(nextHtml));
  }

  function handleSelectHistory(item) {
    setSelectedTemplate(item.template || "instagram");
    setForm((previous) => ({
      ...previous,
      ...item.form
    }));
    setResult(item.result || initialResultState);
    setEditorValue(
      item.editorValue || textToEditorHtml(item.result?.mainDraft || "")
    );
    setEditorText(
      item.editorText ||
        stripHtml(item.editorValue || item.result?.mainDraft || "")
    );
    scrollToEditor();
  }

  async function refreshHistory() {
    try {
      const serverHistory = await getHistory();
      setHistory(serverHistory);
    } catch (error) {
      console.warn("Server history fetch failed, using local storage fallback.");
      const saved = JSON.parse(localStorage.getItem("generation_history") || "[]");
      setHistory(saved);
    }
  }

  async function handleRemoveHistory(id) {
    try {
      await deleteHistoryItem(id);
      await refreshHistory();
    } catch (error) {
      // Fallback for purely local items or failed server call
      const updated = history.filter((item) => (item.id || item._id) !== id);
      setHistory(updated);
      localStorage.setItem("generation_history", JSON.stringify(updated.slice(0, 50)));
    }
  }

  async function handleClearHistory() {
    if (!window.confirm("Are you sure you want to clear your entire history?")) return;
    try {
      await clearServerHistory();
      setHistory([]);
      localStorage.removeItem("generation_history");
    } catch (error) {
      setHistory([]);
      localStorage.removeItem("generation_history");
    }
  }

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <div className="page-blur page-blur-one" />
      <div className="page-blur page-blur-two" />

      <Header usageStats={usageStats} selectedTemplate={selectedTemplate} />

      <main className="layout-grid layout-grid-three-column">
        <Sidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />

        <section className="main-column main-column-wide">
          <ContentForm
            form={form}
            onChange={handleChange}
            onSubmit={handleGenerate}
            loading={loading}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          <LiveEditor
            sectionRef={editorSectionRef}
            editorValue={editorValue}
            editorText={editorText}
            onEditorChange={handleEditorChange}
            onCopy={handleCopy}
            onTransform={handleTransform}
            onCanva={handleCanva}
            loading={loading}
            streaming={streaming}
            selectedTemplate={selectedTemplate}
          />
        </section>

        <aside className="right-column-stack">
          <HistoryPanel
            history={history}
            onSelectHistory={handleSelectHistory}
            onDeleteHistory={handleRemoveHistory}
            onClearHistory={handleClearHistory}
          />

          <SuggestionPanel
            suggestions={result.suggestions}
            hashtags={result.hashtags}
            onApplyAction={handleTransform}
            selectedTemplate={selectedTemplate}
          />
        </aside>
      </main>

      {toast.show && (
        <div className="toast-root" aria-live="polite" aria-atomic="true">
          <div className={`custom-toast custom-toast-${toast.icon}`}>
            {renderToastIcon(toast.icon)}
            <span className="custom-toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}