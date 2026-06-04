"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useRef } from "react";

interface SmartOptimizedLinkProps extends React.ComponentPropsWithoutRef<
  typeof Link
> {
  href: string;
  children: ReactNode;
  className?: string;
}

const SmartOptimizedLink = ({
  href,
  children,
  className,
  onMouseEnter,
  onTouchStart,
  ...props
}: SmartOptimizedLinkProps) => {
  const router = useRouter();

  // Guard to ensure we don't spam the router cache if the user wiggles their mouse
  const hasPrefetched = useRef(false);

  const prefetchPage = () => {
    if (!hasPrefetched.current) {
      router.prefetch(href.toString());
      hasPrefetched.current = true;
    }
  };

  return (
    <Link
      href={href}
      className={className}
      // 1. DISABLE AUTOMATIC PREFETCH (Prevents network/CPU freeze)
      prefetch={false}
      // 2. DESKTOP STRATEGY
      onMouseEnter={(e) => {
        prefetchPage();
        // If you passed an onMouseEnter prop when using this component, don't overwrite it!
        if (onMouseEnter) onMouseEnter(e);
      }}
      // 3. MOBILE STRATEGY
      onTouchStart={(e) => {
        prefetchPage();
        // If you passed an onTouchStart prop, preserve it!
        if (onTouchStart) onTouchStart(e);
      }}
      // Pass any remaining props (like target, onClick, aria-labels) down to the anchor tag
      {...props}
    >
      {children}
    </Link>
  );
};

export default SmartOptimizedLink;
