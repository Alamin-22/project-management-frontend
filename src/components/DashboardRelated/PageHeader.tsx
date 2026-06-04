"use client";

import { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageHeaderProps {
  title: string;
  description?: string;
  searchQuery?: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  searchQuery = "",
  onSearchChange,
  placeholder = "Search...",
  children,
}: PageHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-20 flex min-w-0 items-center justify-between gap-4 bg-white px-4 py-2.5 shadow-sm">
      {/* Page Title & Optional Description */}
      <div className="flex shrink-0 flex-col min-w-0">
        <h1 className="font-bold xl:text-lg text-foreground truncate">
          {title}
        </h1>
        {description && (
          <p className="text-[11px] text-muted-foreground leading-none mt-0.5 truncate hidden sm:block">
            {description}
          </p>
        )}
      </div>

      {/* Search bar (desktop only) */}
      {!isMobile && onSearchChange && (
        <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-md xl:max-w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 bg-slate-50/50 focus-visible:ring-1 border-slate-200"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Action Buttons & Filters Slot */}
      <div className="relative flex shrink-0 items-center gap-2">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
