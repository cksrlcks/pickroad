import { Roadmap } from "../type";

type RoadmapReviewsProps = {
  roadmap: Roadmap;
};

export default function RoadmapReview({ roadmap }: RoadmapReviewsProps) {
  const roadmapId = roadmap.externalId;
  return (
    <div className="px-2 py-6 text-center text-sm opacity-70">
      로드맵 ({roadmapId})의 Review
    </div>
  );
}
