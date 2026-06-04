"use client";

import { useRef, useState } from "react";
import { Loader2, FileText, Code } from "lucide-react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import Swal from "sweetalert2";

import TiptapWrapper from "./TiptapToolbar/TiptapWrapper";
import { useUploadMediaMutation } from "@/Redux/services/uploaderApi/UploaderApi";
import { formatHtml } from "@/Utils/formatHtml";

interface RichTextEditorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCodeMode, setIsCodeMode] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeEditor, setActiveEditor] = useState<any>(null);

  // Triggered when the Image/Attachment icon is clicked in the TipTap Toolbar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAttachmentClick = (editor: any) => {
    setActiveEditor(editor);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeEditor) return;

    const formData = new FormData();
    // Support multiple file uploads at once
    Array.from(files).forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const response = await uploadMedia(formData).unwrap();
      const uploadedFiles = response.data;

      // Intelligently insert the media into the editor
      uploadedFiles.forEach((fileRes) => {
        const isImage = fileRes.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

        if (isImage) {
          activeEditor
            .chain()
            .focus()
            .setImage({ src: fileRes.url, "data-id": fileRes.publicId })
            .run();
        } else {
          // If it's a PDF, DOCX, or ZIP, insert it as a clickable link
          const fileName =
            fileRes.url.split("/").pop() || "Download Attachment";
          activeEditor
            .chain()
            .focus()
            .insertContent(
              `<a href="${fileRes.url}" target="_blank" data-id="${fileRes.publicId}">${fileName}</a> `,
            )
            .run();
        }
      });

      // Clear the input
      if (fileInputRef.current) fileInputRef.current.value = "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Upload Failed",
        text: error?.data?.message || "Could not process media attachments.",
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setIsCodeMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded transition-all ${
              !isCodeMode
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3 h-3" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setIsCodeMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded transition-all ${
              isCodeMode
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="w-3 h-3" /> HTML
          </button>
        </div>
      </div>

      {/* --- Editor Container --- */}
      <div className="relative rounded-lg bg-card border border-input shadow-sm overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm font-semibold text-primary">
              Uploading...
            </span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        {isCodeMode ? (
          <div className="p-0">
            <CodeMirror
              value={formatHtml(value || "")}
              height="350px"
              extensions={[html(), EditorView.lineWrapping]}
              theme={vscodeDark}
              onChange={(val) => onChange(val)}
              className="text-sm"
            />
          </div>
        ) : (
          <TiptapWrapper
            value={value}
            onChange={onChange}
            onImageUpload={handleAttachmentClick}
            className="min-h-62.5"
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
