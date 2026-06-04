export const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>?/gm, "");
};
