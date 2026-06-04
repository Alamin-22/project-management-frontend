"use client";

import { Button } from "@/components/ui/button";
import { memo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    // Don't render anything if there's only one page or no pages.
    if (totalPages <= 1) {
      return null;
    }

    const handlePrevious = () => {
      onPageChange(Math.max(currentPage - 1, 1));
    };

    const handleNext = () => {
      onPageChange(Math.min(currentPage + 1, totalPages));
    };

    return (
      <div className="flex justify-center items-center gap-4 my-4">
        <Button
          variant="default"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-md min-w-12">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="default"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
