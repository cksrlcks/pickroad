import Pagination from "@/components/Pagination";
import { getRoadmaps } from "@/data/roadmap";
import RoadmapList from "@/features/roadmap/components/RoadmapList";

type RoadmapPaginationedListProps = {
  page?: number;
  category?: number;
  keyword?: string;
};

const LIMIT = 6;

export default async function RoadmapPaginationedList({
  page = 1,
  category,
  keyword,
}: RoadmapPaginationedListProps) {
  const { totalCount, data } = await getRoadmaps(
    page,
    LIMIT,
    category,
    keyword,
  );

  return (
    <div className="space-y-10">
      <RoadmapList data={data} keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </div>
  );
}
