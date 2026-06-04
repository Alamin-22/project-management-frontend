interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

const serverDataFetcher = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T | null> => {
  const { revalidate = 300, tags = [], ...rest } = options;

  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.INTERNAL_SERVER_API
        : "http://localhost:5000/api/v1";

    if (!baseUrl) {
      throw new Error("CRITICAL: INTERNAL_SERVER_API is missing in ENV.");
    }

    //  Path Sanitization (Handles leading slashes automatically)
    const cleanPath = endpoint.replace(/^\/+/, "");
    const url = `${baseUrl}/${cleanPath}`;

    // Native Fetch with Memoization
    const res = await fetch(url, {
      ...rest,
      next: {
        revalidate,
        // Tags allow for instant cache purging via revalidateTag()
        tags: [...tags, cleanPath.split("/")[0]],
      },
    });

    if (!res.ok) {
      console.error(
        `[SSR_FETCH_ERROR]: ${url} | Status: ${res.status} ${res.statusText}`,
      );
      return null;
    }

    const result = await res.json();

    // Safe Data Extraction: backend wraps everything in { success, data, message }
    // We return exactly the payload (T) for the component to consume.
    return (result?.data as T) ?? null;
  } catch (error) {
    console.error(
      `[SERVER_FETCH_CRITICAL]: Endpoint '${endpoint}' failed.`,
      error,
    );
    return null;
  }
};

export default serverDataFetcher;
