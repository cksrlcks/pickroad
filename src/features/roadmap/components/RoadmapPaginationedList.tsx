import Pagination from "@/components/Pagination";
import PendingBoundary from "@/components/PendingBoundary";
import RoadmapList from "@/features/roadmap/components/RoadmapList";
import { getRoadmaps } from "../server/db";
import { GetRoadmapsParams } from "../type";
import RoadmapListSkeleton from "./RoadmapListSkeleton";

type RoadmapPaginationedListProps = GetRoadmapsParams;

const LIMIT = 6;

export default async function RoadmapPaginationedList({
  page = 1,
  keyword,
  categoryId,
}: RoadmapPaginationedListProps) {
  const { totalCount, data } = await getRoadmaps({
    page,
    limit: LIMIT,
    categoryId,
    keyword,
  });

  return (
    <div className="space-y-10">
      <PendingBoundary fallback={<RoadmapListSkeleton />}>
        <RoadmapList data={data} keyword={keyword} />
      </PendingBoundary>
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
