import toast from "react-hot-toast";

interface DownloadParams {
  url: string; // e.g. "/transactions/download-invoice/123"
  filename: string; // e.g. "Invoice-123.pdf"
  loadingMessage?: string;
}

export const handleFileDownload = async ({
  url,
  filename,
  loadingMessage,
}: DownloadParams) => {
  const toastId = toast.loading(loadingMessage || "Preparing download...");

  try {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fullUrl = `${baseUrl}${url}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        ...(token && { Authorization: token }),
      },
    });

    // Error Handling: Check if backend returned JSON error instead of Blob
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Download failed");
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    //  Cleanup
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Download complete!", { id: toastId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Download Error:", error);
    toast.error(error.message || "Something went wrong", { id: toastId });
  }
};
