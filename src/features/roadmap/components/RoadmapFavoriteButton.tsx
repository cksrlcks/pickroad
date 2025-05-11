import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RoadmapBookmarkButtonProps = {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isPending: boolean;
};

export function RoadmapBookmarkButton({
  isBookmarked,
  onToggleBookmark,
  isPending,
}: RoadmapBookmarkButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-amber-100 hover:text-amber-400",
        isBookmarked && "bg-amber-100/80",
      )}
      onClick={onToggleBookmark}
      disabled={isPending}
    >
      <Star
        strokeWidth={3}
        className={cn("h-4 w-4", isBookmarked && "text-amber-400")}
      />
      <span className="sr-only">즐겨찾기</span>
    </button>
  );
}
