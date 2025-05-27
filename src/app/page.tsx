import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GetRoadmapsParams } from "@/data/roadmap";
import RoadmapListSkeleton from "@/features/roadmap/components/RoadmapListSkeleton";
import RoadmapPaginationedList from "@/features/roadmap/components/RoadmapPaginationedList";
import { FilterSearchParamsSchema } from "@/types";

export default async function Home({
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
