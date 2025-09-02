"use client";

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  limit: number;
  pagiLabel?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  limit,
  pagiLabel,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  // Calculate the range of items displayed
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // const getPageNumbers = () => {
  //   const maxVisibleButtons = 3;
  //   const startPage = Math.max(currentPage - 1, 1);
  //   const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

  //   const pageNumbers = [];
  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(i);
  //   }
  //   return pageNumbers;
  // };
  const getPageNumbers = () => {
    const maxVisibleButtons = 3;
    const startPage = Math.max(currentPage - 1, 1);
    const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    const pageNumbers: number[] = []; // Explicitly type the array as number[]
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center sm:justify-between mt-4 gap-3">
      <div>
        <span className="text-xs sm:text-sm font-medium font-inter">
          {startItem}-{endItem} of {totalItems} {pagiLabel}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {/* First and Previous Buttons */}
        <Button
          variant="outline"
          className={cn(
            "px-2 py-1 bg-slate-200",
            currentPage === 1 &&
              "cursor-not-allowed opacity-50 h-8 sm:h-10 sm:w-10"
          )}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="First Page"
        >
          <DoubleArrowLeftIcon className="w-4" />
        </Button>
        <Button
          variant="outline"
          className={cn(
            "px-2 py-1 bg-slate-200",
            currentPage <= 1 &&
              "cursor-not-allowed opacity-50 h-8 sm:h-10 sm:w-10"
          )}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
        >
          <ChevronLeftIcon className="w-4" />
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant="outline"
            onClick={() => handlePageChange(pageNumber)}
            className={cn(
              "w-10 h-10 sm:w-10 sm:h-10",
              pageNumber == currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            )}
            aria-current={pageNumber == currentPage ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        ))}

        {/* Next and Last Buttons */}
        <Button
          variant="outline"
          className={cn(
            "px-2 py-1 bg-slate-200",
            currentPage >= totalPages &&
              "cursor-not-allowed opacity-50 h-8 sm:h-10 sm:w-10"
          )}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
        >
          <ChevronRightIcon className="w-4" />
        </Button>
        <Button
          variant="outline"
          className={cn(
            "px-2 py-1 bg-slate-200",
            currentPage == totalPages &&
              "cursor-not-allowed opacity-50 h-8 sm:h-10 sm:w-10"
          )}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage == totalPages}
          aria-label="Last Page"
        >
          <DoubleArrowRightIcon className="w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
