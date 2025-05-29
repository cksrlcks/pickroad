import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import { ActivityFilter } from "@/features/activity/components/ActivityFilter";
import ActivityListSkeleton from "@/features/activity/components/ActivityListSkeleton";
import ActivityPaginationedList from "@/features/activity/components/ActivityPaginationedList";
import { ActivityParams } from "@/features/activity/type";
import { FilterSearchParamsSchema } from "@/types";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<Partial<ActivityParams>>;
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
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityPaginationedList
          page={safeParsedSearchParams.data?.page}
          type={safeParsedSearchParams.data?.type}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
