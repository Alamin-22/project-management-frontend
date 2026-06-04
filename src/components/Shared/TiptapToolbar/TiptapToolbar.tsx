"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Baseline,
  Highlighter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload: () => void;
}

const FONT_SIZES = [
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "24",
  "30",
  "36",
  "48",
  "60",
  "72",
];

const TiptapToolbar = ({ editor, onImageUpload }: ToolbarProps) => {
  if (!editor) return null;

  // eslint-disable-next-line no-unused-vars
  const runCommand = (callback: (chain: any) => any) => {
    const chain = editor.chain().focus();
    callback(chain).run();
  };

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    if (editor.isActive("heading", { level: 4 })) return "4";
    if (editor.isActive("heading", { level: 5 })) return "5";
    if (editor.isActive("heading", { level: 6 })) return "6";
    return "p";
  };

  // Get current font size directly from the editor attributes
  const currentFontSize =
    editor.getAttributes("textStyle").fontSize?.replace("px", "") || "";

  return (
    <div className="border border-input border-b-0 rounded-t-md bg-gray-200 p-1 flex flex-wrap gap-1 items-center">
      {/* 0. Typography Group (Headings & Font Size) */}
      <div className="flex items-center gap-2 mr-1">
        {/* Headings Dropdown */}
        <select
          className="h-8 border border-slate-300 rounded px-2 text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              runCommand((chain) => chain.setParagraph());
            } else {
              runCommand((chain) =>
                chain.toggleHeading({ level: parseInt(val) }),
              );
            }
          }}
          value={getCurrentHeading()}
        >
          <option value="p">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        {/* Font Size Dropdown (Replaced buggy input) */}
        <select
          className="h-8 border border-slate-300 rounded px-2 text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              runCommand((chain) => chain.setFontSize(`${val}px`));
            } else {
              runCommand((chain) => chain.unsetFontSize());
            }
          }}
          // Fallback to "" if the current size isn't in our predefined list
          value={FONT_SIZES.includes(currentFontSize) ? currentFontSize : ""}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-300" />

      {/* 0.5 Color & Highlight Group */}
      <div className="flex items-center gap-1">
        {/* Text Color Picker */}
        <div className="relative flex items-center group">
          <label
            title="Text Color"
            className="flex items-center justify-center h-8 w-8 rounded hover:bg-slate-300 cursor-pointer overflow-hidden relative"
          >
            <Baseline
              className="h-4 w-4 z-10 pointer-events-none"
              style={{
                color: editor.getAttributes("textStyle").color || "#000000",
              }}
            />
            {/* The actual color input is hidden visually but clickable */}
            <input
              type="color"
              className="absolute opacity-0 w-full h-full cursor-pointer"
              onInput={(e) =>
                runCommand((chain) =>
                  chain.setColor((e.target as HTMLInputElement).value),
                )
              }
              value={editor.getAttributes("textStyle").color || "#000000"}
            />
          </label>
        </div>

        {/* Highlight (Background) Color Picker */}
        <div className="relative flex items-center group">
          <label
            title="Highlight Color"
            className="flex items-center justify-center h-8 w-8 rounded hover:bg-slate-300 cursor-pointer overflow-hidden relative"
          >
            <Highlighter
              className="h-4 w-4 z-10 pointer-events-none"
              style={{
                color: editor.getAttributes("highlight").color || "#000000",
              }}
            />
            <input
              type="color"
              className="absolute opacity-0 w-full h-full cursor-pointer"
              onInput={(e) =>
                runCommand((chain) =>
                  chain.setHighlight({
                    color: (e.target as HTMLInputElement).value,
                  }),
                )
              }
              value={editor.getAttributes("highlight").color || "#ffffff"}
            />
          </label>
        </div>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-300" />

      {/* 1. Text Style Group */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => runCommand((chain) => chain.toggleBold())}
          aria-label="Bold"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => runCommand((chain) => chain.toggleItalic())}
          aria-label="Italic"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => runCommand((chain) => chain.toggleUnderline())}
          aria-label="Underline"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => runCommand((chain) => chain.toggleStrike())}
          aria-label="Strikethrough"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-300" />

      {/* 2. Alignment Group */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            runCommand((chain) => chain.setTextAlign("left"))
          }
          aria-label="Align Left"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            runCommand((chain) => chain.setTextAlign("center"))
          }
          aria-label="Align Center"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            runCommand((chain) => chain.setTextAlign("right"))
          }
          aria-label="Align Right"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-300" />

      {/* 3. List Group */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            runCommand((chain) => chain.toggleBulletList())
          }
          aria-label="Bullet List"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            runCommand((chain) => chain.toggleOrderedList())
          }
          aria-label="Ordered List"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-300" />

      {/* 4. Insert Group */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onImageUpload}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          type="button"
          title="Upload Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            runCommand((chain) => chain.toggleBlockquote())
          }
          aria-label="Blockquote"
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>

      {/* 5. History Group (Auto-margin Left) */}
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => runCommand((chain) => chain.undo())}
          disabled={!(editor.can() as any).undo()}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => runCommand((chain) => chain.redo())}
          disabled={!(editor.can() as any).redo()}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TiptapToolbar;
