"use client";

import { useEffect, useRef } from "react";

type UsePageTitleOptions = {
  suffix?: string;
  /** If true, restore previous title when component unmounts */
  restoreOnUnmount?: boolean;
};

export const usePageTitle = (
  title: string | undefined | null,
  options: UsePageTitleOptions = {},
) => {
  const { suffix = "Admin Panel", restoreOnUnmount = false } = options;

  const prevTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (restoreOnUnmount && prevTitleRef.current === null) {
      prevTitleRef.current = document.title;
    }

    const t = (title ?? "").trim();
    document.title = t ? `${t} | ${suffix}` : suffix;

    return () => {
      if (restoreOnUnmount && prevTitleRef.current !== null) {
        document.title = prevTitleRef.current;
        prevTitleRef.current = null;
      }
    };
  }, [title, suffix, restoreOnUnmount]);
};
