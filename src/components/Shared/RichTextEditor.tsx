"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import TiptapWrapper from "./TiptapToolbar/TiptapWrapper";
import { useUploadMediaMutation } from "@/Redux/services/uploaderApi/UploaderApi";
import Swal from "sweetalert2";

interface RichTextEditorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="relative rounded-lg bg-card">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm font-semibold text-primary">
            Uploading...
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      <TiptapWrapper
        value={value}
        onChange={onChange}
        onImageUpload={handleAttachmentClick}
        className="min-h-62.5"
      />
    </div>
  );
};

export default RichTextEditor;
