interface IErrorSource {
  path: string | number | (string | number)[];
  message: string;
}

const formatErrorPath = (
  path: string | number | (string | number)[],
): string => {
  if (!path) return "Field";

  let pathArray = Array.isArray(path) ? path : [path];

  pathArray = pathArray.filter(
    (p) => p !== "body" && p !== "query" && p !== "params",
  );

  const formattedPath = pathArray
    .map((p) => {
      if (typeof p === "number") return `[${p + 1}]`; // Array index handling
      // Convert camelCase to Title Case
      return p
        .toString()
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    })
    .join(" ")
    .replace(/ \[\d+\]/g, (match) => match.trim());

  return formattedPath || "Field";
};

export const formatAndBuildErrorList = (
  errorSource: IErrorSource[] | undefined | null,
): string => {
  if (!errorSource || !Array.isArray(errorSource) || errorSource.length === 0) {
    return "";
  }

  const errorItems = errorSource.map(
    (error) =>
      `<li class="mb-1"><strong>${formatErrorPath(error.path)}:</strong> ${
        error.message
      }</li>`,
  );

  return `<ul class="text-left list-disc list-inside mt-2 text-sm text-destructive">${errorItems.join(
    "",
  )}</ul>`;
};
