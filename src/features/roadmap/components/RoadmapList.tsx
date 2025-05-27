import Link from "next/link";
import GridList from "@/components/GridList";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";
import { RoadmapCompact } from "../type";

type RoadmapListProps = {
  data: RoadmapCompact[];
  keyword?: string | null;
};

export default function RoadmapList({ data, keyword }: RoadmapListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground px-2 py-20 text-center text-sm">
        {keyword ? (
          <>
            <b className="text-foreground">{keyword}</b> 로 검색된 로드맵이
            없습니다.
          </>
        ) : (
          "작성된 로드맵이 없습니다."
        )}
      </div>
    );
  }

  return (
    <GridList
      items={data}
      renderItem={(item) => (
        <Link href={`/roadmap/${item.externalId}`}>
          <RoadmapCard roadmap={item} />
        </Link>
      )}
    />
  );
}
