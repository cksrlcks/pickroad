import GridList from "@/components/GridList";
import RoadmapCardSkeleton from "./RoadmapCardSkeleton";

type RoadmapListSkeletonProps = {
  number?: number;
};

export default function RoadmapListSkeleton({
  number = 6,
}: RoadmapListSkeletonProps) {
  return (
    <GridList
      skeleton
      items={[...Array(number)]}
      renderItem={() => <RoadmapCardSkeleton />}
    />
  );
}
