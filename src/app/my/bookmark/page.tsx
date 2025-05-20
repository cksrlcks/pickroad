import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import { ActivityParams } from "@/data/activity";
import { ActivityItemSkeleton } from "@/features/activity/components/ActivityItemSkeleton";
import BookmarkPaginationedList from "@/features/bookmark/components/BookmarkPaginationedList";
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
      <Suspense
        fallback={
          <ul>
            {[...Array(6)].map((_, index) => (
              <ActivityItemSkeleton key={index} />
            ))}
          </ul>
        }
      >
        <BookmarkPaginationedList
          page={safeParsedSearchParams.data?.page}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
