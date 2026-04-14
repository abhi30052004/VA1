import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Undo2,
  Redo2,
  Eraser
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
// It accepts HTML content and also returns plain text for easy API use.
export default function RichTextEditor({ value, onChange }) {
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

  return (
    <div className="tiptap-editor-shell">
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

      <EditorContent editor={editor} />
    </div>
  );
}
