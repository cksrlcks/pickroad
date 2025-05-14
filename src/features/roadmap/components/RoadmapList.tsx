"use client";

import Link from "next/link";
import { useFilters } from "@/components/FilterProvider";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";
import { cn } from "@/lib/utils";
import { RoadmapCompact } from "../type";
import RoadmapCardSkeleton from "./RoadmapCardSkeleton";

type RoadmapListProps = {
  className?: string;
  data: RoadmapCompact[];
  keyword?: string | null;
};

export default function RoadmapList({
  className,
  data,
  keyword,
}: RoadmapListProps) {
  const { isPending } = useFilters();

  if (isPending) {
    return (
      <ul
        className={cn(
          "grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 md:gap-4 md:gap-x-4 md:gap-y-8",
          className,
        )}
      >
        {[...Array(3)].map((item, index) => (
          <li key={index}>
            <RoadmapCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground px-2 py-20 text-center text-sm">
        {keyword ? (
          <>
            <b className="text-foreground">{keyword}</b> 로 검색된 로드맵이
            없습니다.
          </>
        ) : (
          "작성된 로드맵이 없습니다."
        )}
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 md:gap-4 md:gap-x-4 md:gap-y-8",
        className,
      )}
    >
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/roadmap/${item.externalId}`}>
            <RoadmapCard roadmap={item} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
