import Pagination from "@/components/Pagination";
import { getMyActivity } from "@/data/activity";
import { FilterType } from "@/types";
import ActivityList from "./ActivityList";

type ActivityPaginationedListProps = {
  page?: number;
  keyword?: string;
  type?: FilterType;
};

const LIMIT = 6;

export default async function ActivityPaginationedList({
  page = 1,
  keyword,
  type,
}: ActivityPaginationedListProps) {
  const { totalCount, data } = await getMyActivity(page, LIMIT, keyword, type);

  return (
    <div className="space-y-10">
      <ActivityList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
