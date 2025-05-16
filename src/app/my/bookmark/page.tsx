import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import { ActivityItemSkeleton } from "@/features/activity/components/ActivityItemSkeleton";
import ActivityPaginationedList from "@/features/activity/components/ActivityPaginationedList";
import { FilterSearchParamsSchema } from "@/types";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
  }>;
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
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
