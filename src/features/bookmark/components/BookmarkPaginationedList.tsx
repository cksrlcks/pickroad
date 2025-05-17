import Pagination from "@/components/Pagination";
import { getMyBookmarks } from "@/data/bookmark";
import BookmarkList from "./BookmarkList";

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
      <BookmarkList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
