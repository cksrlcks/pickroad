import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import PendingBoundary from "@/components/PendingBoundary";
import { auth } from "@/lib/auth";
import { getMyBookmarks } from "../server/service";
import { BookmarkParams } from "../type";
import BookmarkList from "./BookmarkList";
import BookmarkListSkeleton from "./BookmarkListSkeleton";

type BookmarkPaginationedListProps = Partial<BookmarkParams>;

const LIMIT = 6;

export default async function BookmarkPaginationedList({
  page = 1,
  keyword,
}: BookmarkPaginationedListProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const authorId = session.user.id;

  const { totalCount, data } = await getMyBookmarks({
    page,
    keyword,
    limit: LIMIT,
    authorId,
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
