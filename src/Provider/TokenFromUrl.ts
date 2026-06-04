"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const TokenFromUrl = () => {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double-processing if the component re-renders
    if (processedRef.current) return;

    const tokenFromUrl = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");

    if (tokenFromUrl) {
      sessionStorage.setItem("urlToken", tokenFromUrl);
      // We also save the email so the Reset Page can use it
      if (emailFromUrl) sessionStorage.setItem("urlEmail", emailFromUrl);

      processedRef.current = true;

      // Clean the URL bar
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        url.searchParams.delete("email");
        window.history.replaceState({}, "", url.pathname + url.search);

        //  Dispatch a custom event to tell the page the data is ready
        window.dispatchEvent(new Event("tokensReady"));
      }
      console.log("URL sanitized. Data preserved in sessionStorage.");
    }
  }, [searchParams]);

  return null;
};

export default TokenFromUrl;
