import { Suspense } from "react";
import GridList from "@/components/GridList";
import RoadmapCardSkeleton from "@/features/roadmap/components/RoadmapCardSkeleton";
import RoadmapPaginationedList from "@/features/roadmap/components/RoadmapPaginationedList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    keyword?: string;
  }>;
}) {
  const { page, category, keyword } = await searchParams;

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
          page={Number(page) || 1}
          category={Number(category) || undefined}
          keyword={keyword || undefined}
        />
      </Suspense>
    </>
  );
}
