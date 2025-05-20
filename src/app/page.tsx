import { Suspense } from "react";
import { notFound } from "next/navigation";
import GridList from "@/components/GridList";
import { GetRoadmapsParams } from "@/data/roadmap";
import RoadmapCardSkeleton from "@/features/roadmap/components/RoadmapCardSkeleton";
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
    <>
      <Suspense
        fallback={
          <GridList
            skeleton
            items={[...Array(6)]}
            renderItem={() => <RoadmapCardSkeleton />}
          />
        }
      >
        <RoadmapPaginationedList
          page={safeParsedSearchParams.data?.page}
          categoryId={safeParsedSearchParams.data?.category}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </>
  );
}
