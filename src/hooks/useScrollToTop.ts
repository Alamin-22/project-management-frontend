"use client";

import { useEffect } from "react";

type UseScrollToTopOptions = {
  selector?: string;

  /** "smooth" | "auto" (browser support varies for "instant") */
  behavior?: ScrollBehavior;

  /** Useful when browser restores scroll on back/reload */
  disableScrollRestoration?: boolean;
};

/**
 * Scrolls to top on mount and whenever `deps` change.
 * Works for custom overflow scroll containers and falls back to document scroller.
 */
export const useScrollToTop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = [],
  options: UseScrollToTopOptions = {},
) => {
  const {
    selector = "#admin-scroll-container",
    behavior = "smooth",
    disableScrollRestoration = false,
  } = options;

  useEffect(() => {
    if (disableScrollRestoration && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const el =
      (document.querySelector(selector) as HTMLElement | null) ??
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement;

    requestAnimationFrame(() => {
      el.scrollTo({ top: 0, left: 0, behavior });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
