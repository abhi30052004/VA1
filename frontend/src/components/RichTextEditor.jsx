import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import SkeletonContent from "./SkeletonContent";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Undo2,
  Redo2,
  Eraser,
  Wand2,
  Scissors,
  Expand,
  Sparkles
} from "lucide-react";

// Toolbar buttons are grouped here so the editor component stays easy to extend.
const toolbarButtons = [
  {
    key: "bold",
    label: "Bold",
    icon: Bold,
    isActive: (editor) => editor.isActive("bold"),
    run: (editor) => editor.chain().focus().toggleBold().run()
  },
  {
    key: "italic",
    label: "Italic",
    icon: Italic,
    isActive: (editor) => editor.isActive("italic"),
    run: (editor) => editor.chain().focus().toggleItalic().run()
  },
  {
    key: "heading",
    label: "Heading",
    icon: Heading2,
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
  },
  {
    key: "bullet-list",
    label: "Bullet list",
    icon: List,
    isActive: (editor) => editor.isActive("bulletList"),
    run: (editor) => editor.chain().focus().toggleBulletList().run()
  },
  {
    key: "ordered-list",
    label: "Numbered list",
    icon: ListOrdered,
    isActive: (editor) => editor.isActive("orderedList"),
    run: (editor) => editor.chain().focus().toggleOrderedList().run()
  },
  {
    key: "blockquote",
    label: "Quote",
    icon: Quote,
    isActive: (editor) => editor.isActive("blockquote"),
    run: (editor) => editor.chain().focus().toggleBlockquote().run()
  },
  {
    key: "clear",
    label: "Clear formatting",
    icon: Eraser,
    isActive: () => false,
    run: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run()
  }
];

// Rich text editor based on Tiptap.
const RichTextEditor = forwardRef(function RichTextEditor({ value, onChange, onTransform, showSkeleton }, ref) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: "Generated content will appear here..."
      })
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tiptap-surface"
      }
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getHTML(), activeEditor.getText());
    }
  });

  useImperativeHandle(ref, () => editor, [editor]);

  useEffect(() => {
    if (!editor) return;

    const incomingValue = value || "";
    const currentValue = editor.getHTML();

    if (incomingValue !== currentValue) {
      editor.commands.setContent(incomingValue || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="editor-loading">Loading editor...</div>;
  }

  const handleContextAction = (action) => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    if (selectedText.trim()) {
      onTransform(action, selectedText);
    }
  };

  return (
    <div className="tiptap-editor-shell">
      {editor && (
        <BubbleMenu
          className="bubble-menu glass-card"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="bubble-menu-inner">
            <button
              type="button"
              className="bubble-btn"
              onClick={() => handleContextAction("improve")}
              title="Improve selection"
            >
              <Wand2 size={14} />
              <span>Fix</span>
            </button>
            <button
              type="button"
              className="bubble-btn"
              onClick={() => handleContextAction("shorten")}
              title="Shorten selection"
            >
              <Scissors size={14} />
              <span>Trim</span>
            </button>
            <button
              type="button"
              className="bubble-btn"
              onClick={() => handleContextAction("expand")}
              title="Expand selection"
            >
              <Expand size={14} />
              <span>Grow</span>
            </button>
            <div className="bubble-divider" />
            <button
              type="button"
              className={`bubble-btn ${editor.isActive("bold") ? "active" : ""}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              className={`bubble-btn ${editor.isActive("italic") ? "active" : ""}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={14} />
            </button>
          </div>
        </BubbleMenu>
      )}

      <div className="editor-toolbar">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          const active = button.isActive(editor);

          return (
            <button
              key={button.key}
              type="button"
              className={`toolbar-btn ${active ? "active" : ""}`}
              onClick={() => button.run(editor)}
              title={button.label}
            >
              <Icon size={16} />
              <span>{button.label}</span>
            </button>
          );
        })}

        <div className="toolbar-spacer" />

        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 size={16} />
          <span>Undo</span>
        </button>

        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 size={16} />
          <span>Redo</span>
        </button>
      </div>

      {showSkeleton ? (
        <div className="editor-skeleton-content">
          <SkeletonContent />
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
});

export default RichTextEditor;
