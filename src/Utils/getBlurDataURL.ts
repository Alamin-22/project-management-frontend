import { cache } from "react";

export const getBlurDataURL = cache(
  async (imageUrl?: string | null): Promise<string | undefined> => {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
      // Return undefined if the URL is invalid or not a Cloudinary URL
      return undefined;
    }

    try {
      // 1. Create the placeholder URL with optimized Cloudinary transformations.
      //    - w_30: width of 30px (very small)
      //    - q_auto:low: lowest possible quality for the smallest file size
      //    - e_blur:200: a moderate blur effect
      const placeholderUrl = imageUrl.replace(
        "/upload/",
        "/upload/w_30,q_auto:low,e_blur:200/",
      );

      // 2. Fetch the tiny, blurred image from Cloudinary.
      const response = await fetch(placeholderUrl);

      if (!response.ok) {
        console.warn(
          `Failed to fetch blur placeholder for ${imageUrl}. Status: ${response.status}`,
        );
        return undefined; // Gracefully fail without breaking the page
      }

      // 3. Convert the image buffer to a base64 string.
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      // 4. Get the mime type and format the data URL.
      const mimeType = response.headers.get("content-type") || "image/webp";
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      // Log the error for debugging but don't crash the build/request.
      if (error instanceof Error) {
        console.error(
          `Error generating blurDataURL for ${imageUrl}:`,
          error.message,
        );
      }
      return undefined;
    }
  },
);
