export const formatHtml = (htmlString: string | null | undefined): string => {
  if (!htmlString) return "";

  const tab = "  ";
  let result = "";
  let indent = "";

  // 1. Strip existing whitespace between tags to avoid double-spacing
  // This ensures we start with a clean slate: <div></div> instead of <div>   </div>
  const cleanHtml = htmlString.replace(/>\s*</g, "><").trim();

  // 2. Split by tags (<...>)
  // This regex captures the delimiter so we keep the tags in the array
  // Result: ['', '<div>', 'Hello', '</div>', '']
  const parts = cleanHtml.split(/(<[^>]+>)/g).filter(Boolean);

  parts.forEach((element) => {
    // Case A: Closing Tag (e.g. </div>) -> Decrease indent immediately
    if (element.match(/^<\/\w/)) {
      indent = indent.substring(tab.length);
    }

    // Add content with current indentation
    result += indent + element + "\r\n";

    // Case B: Opening Tag (e.g. <div>) -> Increase indent for *next* line
    // We must exclude:
    // 1. Closing tags (handled above)
    // 2. Self-closing tags (e.g. <br /> or <img />)
    // 3. Void tags (e.g. <input>, <hr>, <meta>) that don't technically need />
    const isOpeningTag = element.match(/^<\w/);
    const isSelfClosing = element.match(/\/>$/);
    const isVoidTag = element.match(/^<(input|img|br|hr|meta|link)/i);

    if (isOpeningTag && !isSelfClosing && !isVoidTag) {
      indent += tab;
    }
  });

  return result.trim();
};
