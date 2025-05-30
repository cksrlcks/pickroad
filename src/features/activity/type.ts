import { User, z } from "better-auth";
import { createSelectSchema } from "drizzle-zod";
import { bookmarks, likes } from "@/db/schema";
import { BaseParams } from "@/types";
import { Comment } from "../comment/type";
import { RoadmapCompact } from "../roadmap/type";

export const bookmarkSchema = createSelectSchema(bookmarks);
export type Bookmark = z.infer<typeof bookmarkSchema> & {
  roadmap: Partial<RoadmapCompact> | null;
};

export const LikeSchema = createSelectSchema(likes);
export type Like = z.infer<typeof LikeSchema>;

export const ACTIVITY_TYPES = {
  ROADMAP: "roadmap",
  COMMENT: "comment",
  LIKE: "like",
  BOOKMARK: "bookmark",
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

export type ActivityBookmark = Bookmark & {
  type: typeof ACTIVITY_TYPES.BOOKMARK;
  roadmap: Partial<RoadmapCompact> | null;
};

export type Activity =
  | ActivityRoadmap
  | ActivityComment
  | ActivityLike
  | ActivityBookmark;

export type ActivityParams = Partial<BaseParams> & {
  type?: ActivityType;
  authorId: User["id"];
};
