import Pagination from "@/components/Pagination";
import { getMyBookmarks } from "@/data/bookmark";
import ActivityList from "@/features/activity/components/ActivityList";

type BookmarkPaginationedListProps = {
  page?: number;
  keyword?: string;
};

const LIMIT = 6;

export default async function BookmarkPaginationedList({
  page = 1,
  keyword,
}: BookmarkPaginationedListProps) {
  const { totalCount, data } = await getMyBookmarks(page, LIMIT, keyword);

  return (
    <div className="space-y-10">
      <ActivityList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
