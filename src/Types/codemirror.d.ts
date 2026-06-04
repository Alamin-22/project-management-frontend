/* eslint-disable no-unused-vars */
// src/codemirror.d.ts
declare module "@codemirror/lang-html" {
  import { LanguageSupport } from "@codemirror/language";
  export function html(config?: {
    matchClosingTags?: boolean;
    selfClosingTags?: boolean;
    autoCloseTags?: boolean;
  }): LanguageSupport;
}
