import Pagination from "@/components/Pagination";
import PendingBoundary from "@/components/PendingBoundary";
import { ActivityParams } from "@/data/activity";
import { getMyBookmarks } from "@/data/bookmark";
import BookmarkList from "./BookmarkList";
import BookmarkListSkeleton from "./BookmarkListSkeleton";

type BookmarkPaginationedListProps = ActivityParams;

const LIMIT = 6;

export default async function BookmarkPaginationedList({
  page = 1,
  keyword,
  type = "roadmap",
}: BookmarkPaginationedListProps) {
  const { totalCount, data } = await getMyBookmarks({
    page,
    keyword,
    type,
    limit: LIMIT,
  });

  return (
    <div className="space-y-10">
      <PendingBoundary fallback={<BookmarkListSkeleton />}>
        <BookmarkList data={data} keyword={keyword} />
      </PendingBoundary>
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
