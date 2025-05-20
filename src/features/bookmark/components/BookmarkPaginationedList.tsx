import Pagination from "@/components/Pagination";
import { ActivityParams } from "@/data/activity";
import { getMyBookmarks } from "@/data/bookmark";
import BookmarkList from "./BookmarkList";

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
      <BookmarkList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
