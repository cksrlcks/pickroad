"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationedListProps = {
  totalCount: number;
  limit?: number;
};

export default function Pagination({
  totalCount,
  limit = 6,
}: PaginationedListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPage = Math.ceil(totalCount / limit);
  const [isPending, startTransition] = useTransition();
  const [optimisticCurrentPage, setOptimisticCurrentPage] = useOptimistic(
    parseInt(searchParams.get("page") || "1"),
  );

  const handlePaginationClick = (page: number) => {
    const params = new URLSearchParams(searchParams);

    startTransition(() => {
      setOptimisticCurrentPage(page);
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <PaginationComponent data-pending={isPending ? "" : undefined}>
      <PaginationContent className="flex-wrap justify-center">
        {optimisticCurrentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePaginationClick(optimisticCurrentPage - 1)}
            />
          </PaginationItem>
        )}
        {[...Array(totalPage)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index + 1 === optimisticCurrentPage}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {optimisticCurrentPage < totalPage && (
          <>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePaginationClick(optimisticCurrentPage + 1)}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationComponent>
  );
}
