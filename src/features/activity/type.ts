import { Comment } from "../comment/type";
import { Like, RoadmapCompact } from "../roadmap/type";

export type ActivityType = "roadmap" | "comment" | "like";

export type ActivityRoadmap = RoadmapCompact & { type: "roadmap" };
export type ActivityComment = Comment & {
  type: "comment";
  roadmap: Partial<RoadmapCompact> | null;
};
export type ActivityLike = Like & {
  type: "like";
  roadmap: Partial<RoadmapCompact> | null;
};

export type Activity = ActivityRoadmap | ActivityComment | ActivityLike;
