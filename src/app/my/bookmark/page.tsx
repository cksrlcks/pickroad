import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import ActivityListSkeleton from "@/features/activity/components/ActivityListSkeleton";
import ActivityPaginationedList from "@/features/activity/components/ActivityPaginationedList";
import { ACTIVITY_TYPES, ActivityParams } from "@/features/activity/type";
import { FilterSearchParamsSchema } from "@/types";

export default async function BookmarksPage({
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
    <FilterProvider basePath="/my/bookmark">
      <Suspense>
        <div className="mb-6">
          <Search placeholder="즐겨찾기 검색" />
        </div>
      </Suspense>
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityPaginationedList
          page={safeParsedSearchParams.data?.page}
          type={ACTIVITY_TYPES.BOOKMARK}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
