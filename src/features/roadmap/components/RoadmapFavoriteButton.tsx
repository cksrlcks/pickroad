import { Star } from "lucide-react";

export function RoadmapFavoriteButton() {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
      onClick={() => alert("준비중")}
    >
      <Star strokeWidth={3} className="h-4 w-4" />
      <span className="sr-only">즐겨찾기</span>
    </button>
  );
}
