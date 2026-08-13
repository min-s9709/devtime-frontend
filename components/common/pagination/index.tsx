"use client";

import ChevronLeft from "@/assets/icons/chevron-left.svg";
import ChevronRight from "@/assets/icons/chevron-right.svg";
import DoubleChevronLeft from "@/assets/icons/double-chevron-left.svg";
import DoubleChevronRight from "@/assets/icons/double-chevron-right.svg";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number; // 한 번에 보여줄 페이지 번호 개수
  className?: string;
}

// currentPage를 중앙에 두고 maxButtons개의 연속된 페이지 번호 창을 만든다.
const buildPageWindow = (
  currentPage: number,
  totalPages: number,
  maxButtons: number,
) => {
  const size = Math.min(maxButtons, totalPages);
  const half = Math.floor(size / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + size - 1);
  start = Math.max(1, end - size + 1); // 끝에 붙었을 때 창 크기를 유지
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const navButton =
  "flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageWindow(currentPage, totalPages, maxButtons);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        className={navButton}
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        aria-label="첫 페이지"
      >
        <DoubleChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-body-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100",
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className={navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={navButton}
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
        aria-label="마지막 페이지"
      >
        <DoubleChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
