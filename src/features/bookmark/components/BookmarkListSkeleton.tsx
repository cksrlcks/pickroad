import { BookmarkItemSkeleton } from "./BookmarkItemSkeleton";

type BookmarkListSkeletonProps = {
  number?: number;
};

export default function BookmarkListSkeleton({
  number = 6,
}: BookmarkListSkeletonProps) {
  return (
    <ul>
      {Array.from({ length: number }).map((_, index) => (
        <BookmarkItemSkeleton key={index} />
      ))}
    </ul>
  );
}
