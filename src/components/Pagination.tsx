"use client";

import { useTransition } from "react";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFilters } from "./FilterProvider";

type PaginationedListProps = {
  totalCount: number;
  limit?: number;
};

export default function Pagination({
  totalCount,
  limit = 6,
}: PaginationedListProps) {
  const totalPage = Math.ceil(totalCount / limit);
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters(); // Use the nearest Filter context

  const currentPage = filters.page || 1;
  const handlePaginationClick = (page: number) => {
    startTransition(() => {
      updateFilters({ page });
    });
  };

  return (
    <PaginationComponent data-pending={isPending ? "" : undefined}>
      <PaginationContent className="flex-wrap justify-center">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePaginationClick(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {[...Array(totalPage)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index + 1 === currentPage}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPage && (
          <>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePaginationClick(currentPage + 1)}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationComponent>
  );
}
