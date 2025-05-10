import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type RoadmapLikeButtonProps = {
  likeCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
  isPending: boolean;
};

export function RoadmapLikeButton({
  likeCount,
  isLiked,
  onToggleLike,
  isPending,
}: RoadmapLikeButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "mr-auto -ml-2.5 h-8 rounded-full px-2.5 transition-all hover:bg-pink-100",
        isLiked && "bg-pink-100/80 font-semibold",
      )}
      onClick={onToggleLike}
      disabled={isPending}
    >
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Heart strokeWidth={3} className="w-[14px] text-[#FF7C7C]" />
        {likeCount}
      </div>
    </button>
  );
}
