import { Suspense } from "react";
import { notFound } from "next/navigation";
import FilterProvider from "@/components/FilterProvider";
import Search from "@/components/Search";
import BookmarkListSkeleton from "@/features/bookmark/components/BookmarkListSkeleton";
import BookmarkPaginationedList from "@/features/bookmark/components/BookmarkPaginationedList";
import { BookmarkParams } from "@/features/bookmark/type";
import { FilterSearchParamsSchema } from "@/types";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<Partial<BookmarkParams>>;
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
      <Suspense fallback={<BookmarkListSkeleton />}>
        <BookmarkPaginationedList
          page={safeParsedSearchParams.data?.page}
          keyword={safeParsedSearchParams.data?.keyword}
        />
      </Suspense>
    </FilterProvider>
  );
}
