import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getRoadmaps } from "@/data/roadmap";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";

const LIMIT = 24;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page: string | undefined;
    category: string | undefined;
  }>;
}) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const { totalCount, data } = await getRoadmaps(currentPage, LIMIT);
  const totalPage = Math.ceil(totalCount / LIMIT);

  if (!data || data.length === 0) {
    return (
      <div className="px-2 py-6 text-center text-sm opacity-70">
        작성된 로드맵이 없습니다.
      </div>
    );
  }

  return (
    <>
      <ul className="mb-10 grid grid-cols-2 gap-2 md:grid-cols-3 md:flex-row">
        {data.map((item) => (
          <li key={item.id} className="mx-auto w-full">
            <Link href={`/roadmap/${item.externalId}`}>
              <RoadmapCard roadmap={item} />
            </Link>
          </li>
        ))}
      </ul>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?page=${currentPage - 1}`} />
            </PaginationItem>
          )}
          {[...Array(totalPage)].map((_, index) => (
            <PaginationLink
              key={index}
              isActive={index + 1 === currentPage}
              href={`?page=${index + 1}`}
            >
              {index + 1}
            </PaginationLink>
          ))}
          {currentPage < totalPage && (
            <>
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
