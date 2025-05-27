import { ActivityItemSkeleton } from "./ActivityItemSkeleton";

type ActivityListSkeletonProps = {
  number?: number;
};

export default function ActivityListSkeleton({
  number = 6,
}: ActivityListSkeletonProps) {
  return (
    <ul>
      {Array.from({ length: number }).map((_, index) => (
        <ActivityItemSkeleton key={index} />
      ))}
    </ul>
  );
}
