"use client";

import { useTransition } from "react";
import { useFilters } from "@/components/FilterProvider";
import { cn } from "@/lib/utils";
import { FilterType } from "@/types";

const FILTERS: { label: string; type: FilterType }[] = [
  {
    label: "작성한 카드",
    type: "roadmap",
  },
  {
    label: "나의 리뷰",
    type: "comment",
  },
  {
    label: "좋아요",
    type: "like",
  },
];

export function ActivityFilter() {
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters();

  const handleFilterClick = (type: FilterType) => {
    startTransition(() => {
      updateFilters({
        type,
        keyword: undefined,
        page: undefined,
      });
    });
  };

  const currentType = filters?.type || "roadmap";

  return (
    <div
      className="border-b-muted flex gap-1 border-b"
      data-pending={isPending ? "" : undefined}
    >
      {FILTERS.map((item) => (
        <button
          key={item.type}
          data-state={currentType === item.type ? "active" : undefined}
          type="button"
          className={cn(
            "data-[state=active]:border-b-primary inline-flex items-center justify-center border-b-2 border-b-transparent px-3 py-3 text-xs whitespace-nowrap opacity-50 data-[state=active]:font-semibold data-[state=active]:opacity-100 md:text-sm",
          )}
          onClick={() => handleFilterClick(item.type)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
