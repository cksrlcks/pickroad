import Pagination from "@/components/Pagination";
import { getRoadmaps, GetRoadmapsParams } from "@/data/roadmap";
import RoadmapList from "@/features/roadmap/components/RoadmapList";

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
      <RoadmapList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
