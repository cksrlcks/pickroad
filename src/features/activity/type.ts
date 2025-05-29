import { User } from "better-auth";
import { BaseParams } from "@/types";
import { Comment } from "../comment/type";
import { Like, RoadmapCompact } from "../roadmap/type";

export const ACTIVITY_TYPES = {
  ROADMAP: "roadmap",
  COMMENT: "comment",
  LIKE: "like",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export type ActivityRoadmap = RoadmapCompact & {
  type: typeof ACTIVITY_TYPES.ROADMAP;
};
export type ActivityComment = Comment & {
  type: typeof ACTIVITY_TYPES.COMMENT;
  roadmap: Partial<RoadmapCompact> | null;
};
export type ActivityLike = Like & {
  type: typeof ACTIVITY_TYPES.LIKE;
  roadmap: Partial<RoadmapCompact> | null;
};

export type Activity = ActivityRoadmap | ActivityComment | ActivityLike;

export type ActivityParams = Partial<BaseParams> & {
  type?: ActivityType;
  authorId: User["id"];
};
