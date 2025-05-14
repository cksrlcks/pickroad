import Pagination from "@/components/Pagination";
import { getRoadmaps } from "@/data/roadmap";
import RoadmapList from "@/features/roadmap/components/RoadmapList";

const LIMIT = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    keyword?: string;
  }>;
}) {
  const { page, category, keyword } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const currentCategoryId = category ? parseInt(category) : undefined;
  const { totalCount, data } = await getRoadmaps(
    currentPage,
    LIMIT,
    currentCategoryId,
    keyword,
  );

  return (
    <>
      <RoadmapList data={data} className="mb-10" keyword={keyword} />
      <Pagination totalCount={totalCount} limit={LIMIT} />
    </>
  );
}
