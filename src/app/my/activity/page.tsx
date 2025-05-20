import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import { ActivityParams } from "@/data/activity";
import { ActivityFilter } from "@/features/activity/components/ActivityFilter";
import { ActivityItemSkeleton } from "@/features/activity/components/ActivityItemSkeleton";
import ActivityPaginationedList from "@/features/activity/components/ActivityPaginationedList";
import { FilterSearchParamsSchema } from "@/types";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<ActivityParams>;
}) {
  const safeParsedSearchParams = FilterSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!safeParsedSearchParams.success) {
    notFound();
  }

  return (
    <FilterProvider basePath="/my/activity">
      <Suspense>
        <div className="mb-6 space-y-4">
          <ActivityFilter />
          <Search placeholder="활동 검색" />
        </div>
      </Suspense>
      <Suspense
        fallback={
          <ul>
            {[...Array(6)].map((_, index) => (
              <ActivityItemSkeleton key={index} />
            ))}
          </ul>
        }
      >
        <ActivityPaginationedList
          page={safeParsedSearchParams.data?.page}
          type={safeParsedSearchParams.data?.type}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
