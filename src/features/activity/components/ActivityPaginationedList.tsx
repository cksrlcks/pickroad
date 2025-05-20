import Pagination from "@/components/Pagination";
import { ActivityParams, getMyActivity } from "@/data/activity";
import ActivityList from "./ActivityList";

type ActivityPaginationedListProps = ActivityParams;

const LIMIT = 6;

export default async function ActivityPaginationedList({
  page = 1,
  keyword,
  type = "roadmap",
}: ActivityPaginationedListProps) {
  const { totalCount, data } = await getMyActivity({
    page,
    keyword,
    type,
    limit: LIMIT,
  });
  return (
    <div className="space-y-10">
      <ActivityList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
