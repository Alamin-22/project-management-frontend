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
    <div className="sticky top-0 z-20 flex min-w-0 items-center justify-between gap-4 bg-card px-6 py-4 border-b border-border shadow-sm">
      <div className="flex shrink-0 flex-col min-w-0">
        <h1 className="font-bold text-xl text-foreground tracking-tight truncate">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 truncate hidden sm:block">
            {description}
          </p>
        )}
      </div>

      {!isMobile && onSearchChange && (
        <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-md xl:max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-8 bg-background border-input hover:border-primary/50 focus-visible:border-primary transition-colors rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="relative flex shrink-0 items-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
