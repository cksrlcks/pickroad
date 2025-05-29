import Comment from "@/features/comment/components/Comment";
import { getComments } from "@/features/comment/server/service";
import { Roadmap } from "../type";

type RoadmapReviewsProps = {
  roadmap: Roadmap;
};

export default async function RoadmapReviews({ roadmap }: RoadmapReviewsProps) {
  const data = await getComments({
    targetId: roadmap.id,
    targetType: "roadmap",
    page: 1,
  });

  return (
    <Comment
      targetId={roadmap.id}
      targetType="roadmap"
      initialData={{
        totalCount: data.totalCount,
        data: data.data,
      }}
    />
  );
}
