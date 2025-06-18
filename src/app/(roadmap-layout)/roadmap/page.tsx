import { Suspense } from "react";
import { notFound } from "next/navigation";
import RoadmapListSkeleton from "@/features/roadmap/components/RoadmapListSkeleton";
import RoadmapPaginationedList from "@/features/roadmap/components/RoadmapPaginationedList";
import { GetRoadmapsParams } from "@/features/roadmap/type";
import { FilterSearchParamsSchema } from "@/types";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<GetRoadmapsParams>;
}) {
  const safeParsedSearchParams = FilterSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!safeParsedSearchParams.success) {
    notFound();
  }

  return (
    <Suspense fallback={<RoadmapListSkeleton />}>
      <RoadmapPaginationedList
        page={safeParsedSearchParams.data?.page}
        categoryId={safeParsedSearchParams.data?.category}
        keyword={safeParsedSearchParams.data?.keyword}
      />
    </Suspense>
  );
}
