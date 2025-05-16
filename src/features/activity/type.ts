import { Comment } from "../comment/type";
import { Like, Roadmap, RoadmapCompact } from "../roadmap/type";

export type ActivityType = "roadmap" | "comment" | "like";

export type ActivityRoadmap = RoadmapCompact & { type: "roadmap" };
export type ActivityComment = Comment & {
  type: "comment";
  roadmap: {
    title: Roadmap["title"];
    subTitle: Roadmap["subTitle"];
    externalId?: string | null;
    thumbnail?: string | null;
  } | null;
};
export type ActivityLike = Like & {
  type: "like";
  roadmap: {
    title: Roadmap["title"];
    subTitle: Roadmap["subTitle"];
    externalId?: string | null;
    thumbnail?: string | null;
  } | null;
};

export type Activity = ActivityRoadmap | ActivityComment | ActivityLike;
