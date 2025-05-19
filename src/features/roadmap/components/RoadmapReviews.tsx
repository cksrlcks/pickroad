import { getComments } from "@/data/comment";
import { CommentForm } from "@/features/comment/components/CommentForm";
import CommentList from "@/features/comment/components/CommentList";
import { Roadmap } from "../type";

type RoadmapReviewsProps = {
  roadmap: Roadmap;
};

export default async function RoadmapReview({ roadmap }: RoadmapReviewsProps) {
  const data = await getComments(roadmap.id, "roadmap", 1);

  return (
    <div className="space-y-8 py-3">
      <CommentForm targetType="roadmap" targetId={roadmap.id} />
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <span className="opacity-70">리뷰</span>
        <span className="text-foreground">{data.totalCount}</span>
      </h3>
      <CommentList comments={data} targetType="roadmap" targetId={roadmap.id} />
    </div>
  );
}
