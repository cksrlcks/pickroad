"use client";

import { useTransition } from "react";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextGroup,
  PaginationPrevious,
  PaginationPreviousGroup,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination";
import { useFilters } from "./FilterProvider";

type PaginationedListProps = {
  totalCount: number;
  limit?: number;
  visibleCount?: number;
};

export default function Pagination({
  totalCount,
  limit = 6,
  visibleCount = 5,
}: PaginationedListProps) {
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters();
  const currentPage = filters?.page || 1;

  const handlePaginationClick = (page: number) => {
    startTransition(() => {
      updateFilters({ page });
    });
  };

  const {
    pageNumbers,
    isPrevDisabled,
    isNextDisabled,
    isPrevGroupDisabled,
    isNextGroupDisabled,
    handleNextClick,
    handlePrevClick,
    handleNextGroupClick,
    handlePrevGroupClick,
  } = usePagination({
    currentPage,
    totalCount,
    limit,
    visibleCount,
    onChangePage: handlePaginationClick,
  });

  return (
    <PaginationComponent data-pending={isPending ? "" : undefined}>
      <PaginationContent className="flex-wrap justify-center">
        {!isPrevGroupDisabled && (
          <PaginationItem>
            <PaginationPreviousGroup onClick={handlePrevGroupClick} />
          </PaginationItem>
        )}
        {!isPrevDisabled && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePrevClick} />
          </PaginationItem>
        )}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === currentPage}
              onClick={() => handlePaginationClick(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!isNextDisabled && (
          <PaginationItem>
            <PaginationNext onClick={handleNextClick} />
          </PaginationItem>
        )}
        {!isNextGroupDisabled && (
          <PaginationItem>
            <PaginationNextGroup onClick={handleNextGroupClick} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationComponent>
  );
}
