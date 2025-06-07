import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import PendingBoundary from "@/components/PendingBoundary";
import { auth } from "@/lib/auth";
import { getMyActivity } from "../server/db";
import { ACTIVITY_TYPES, ActivityParams } from "../type";
import ActivityList from "./ActivityList";
import ActivityListSkeleton from "./ActivityListSkeleton";

type ActivityPaginationedListProps = Partial<ActivityParams>;

const LIMIT = 6;

export default async function ActivityPaginationedList({
  page = 1,
  keyword,
  type = ACTIVITY_TYPES.ROADMAP,
}: ActivityPaginationedListProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const authorId = session.user.id;

  const { totalCount, data } = await getMyActivity({
    page,
    keyword,
    type,
    limit: LIMIT,
    authorId,
  });

  return (
    <div className="space-y-10">
      <PendingBoundary fallback={<ActivityListSkeleton />}>
        <ActivityList data={data} keyword={keyword} />
      </PendingBoundary>
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
