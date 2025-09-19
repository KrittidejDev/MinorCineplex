import React from "react";
import ExpandLeftLight from "../Icons/ExpandLeftLight";
import ExpandRightLight from "../Icons/ExpandRightLight";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "page" | "carat" | "pagination";
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "pagination",
  className = "",
}) => {
  // Generate page numbers array
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show first 5 pages, then ellipsis, then last page
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, then last 5 pages
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  // Render different variants
  if (variant === "carat") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
        >
          <ExpandLeftLight width={16} height={16} color="currentColor" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
        >
          <ExpandRightLight width={16} height={16} color="currentColor" />
        </button>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
        >
          <ExpandLeftLight width={16} height={16} color="currentColor" />
        </button>
        <button
          onClick={() => handlePageClick(1)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors border-none outline-none text-fm-14 ${
            currentPage === 1 
              ? "bg-gray-g63f text-white-wfff" 
              : "bg-gray-gc1b text-gray-g3b0 hover:bg-gray-g63f hover:text-white-wfff"
          }`}
        >
          1
        </button>
        <button
          onClick={() => handlePageClick(1)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors border-none outline-none text-fm-14 ${
            currentPage === 1 
              ? "bg-gray-g63f text-white-wfff" 
              : "bg-gray-gc1b text-gray-g3b0 hover:bg-gray-g63f hover:text-white-wfff"
          }`}
        >
          1
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
        >
          <ExpandRightLight width={16} height={16} color="currentColor" />
        </button>
      </div>
    );
  }

  // Default "pagination" variant
  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
      >
        <ExpandLeftLight width={16} height={16} color="currentColor" />
      </button>
      
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors border-none outline-none text-fm-14 ${
            page === "..."
              ? "bg-gray-gc1b text-gray-g3b0 cursor-default"
              : page === currentPage
              ? "bg-gray-g63f text-white-wfff"
              : "bg-gray-gc1b text-gray-g3b0 hover:bg-gray-g63f hover:text-white-wfff"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded text-white-wfff hover:text-gray-g3b0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none"
      >
        <ExpandRightLight width={16} height={16} color="currentColor" />
      </button>
    </div>
  );
};

export default Pagination;
