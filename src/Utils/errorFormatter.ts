// @/Utils/errorFormatter.ts

interface IErrorSource {
  path: string | number | (string | number)[];
  message: string;
}

const formatErrorPath = (
  path: string | number | (string | number)[],
): string => {
  if (Array.isArray(path)) {
    // Handle variants specifically: variants.0.price -> Variant 1: Price
    if (
      path[0] === "variants" &&
      path.length > 2 &&
      typeof path[1] === "number"
    ) {
      const variantIndex = path[1] + 1;
      const fieldName = path[2]
        .toString()
        .replace(/^./, (str) => str.toUpperCase());
      return `Variant ${variantIndex}: ${fieldName}`;
    }
    return path.join(" ").replace(/^./, (str) => str.toUpperCase());
  }
  if (typeof path === "string") {
    return path.replace(/^./, (str) => str.toUpperCase());
  }
  return "Field";
};

export const formatAndBuildErrorList = (
  errorSource: IErrorSource[] | undefined | null,
) => {
  if (!errorSource || !Array.isArray(errorSource)) return "";

  const errorItems: string[] = [];

  // Check for variant image specific error
  const imageError = errorSource.find(
    (error) =>
      error.path === "image" ||
      (Array.isArray(error.path) && error.path.includes("image")),
  );

  if (imageError) {
    const customImageError = `<li><strong>Variant Images:</strong> Please ensure all variants have an image.</li>`;
    errorItems.push(customImageError);
  }

  // Filter out image errors if we handled them to avoid duplicates
  const otherErrors = errorSource.filter(
    (error) =>
      error.path !== "image" &&
      !(Array.isArray(error.path) && error.path.includes("image")),
  );

  const otherErrorList = otherErrors.map(
    (error) =>
      `<li><strong>${formatErrorPath(error.path)}:</strong> ${error.message}</li>`,
  );

  errorItems.push(...otherErrorList);

  return `<ul class="text-left list-disc list-inside mt-4 text-sm">${errorItems.join("")}</ul>`;
};
