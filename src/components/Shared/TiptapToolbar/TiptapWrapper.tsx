"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import { useEffect } from "react";
import TiptapToolbar from "./TiptapToolbar";
import { CustomImage } from "./tiptap-extensions";

// --- TypeScript Declaration for our custom commands ---
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      // eslint-disable-next-line no-unused-vars
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

// --- Custom Font Size Extension ---
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

interface TiptapWrapperProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
  // onImageUpload: (editor: any) => void;
  className?: string;
}

const TiptapWrapper = ({
  value,
  onChange,
  // onImageUpload,
  className = "",
}: TiptapWrapperProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline.configure({}),
      CustomImage.configure({ inline: true, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      TextStyle.configure({}),
      FontSize.configure({}),

      Color.configure({}),
      Highlight.configure({ multicolor: true }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none p-4 bg-gray-50 rounded-b-md border border-t-0 border-input resize-y overflow-auto ${className}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync content updates
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";

    // Only update if content is actually different to prevent cursor jumping
    if (current !== next) {
      editor.commands.setContent(next);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      <TiptapToolbar
        editor={editor}
        // onImageUpload={() => onImageUpload(editor)}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapWrapper;
