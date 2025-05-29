import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { comments } from "@/db/schema";
import { BaseParams, TargetType } from "@/types";
import { Author } from "../auth/type";

export const commentSchema = createSelectSchema(comments);

export type CommentBase = z.infer<typeof commentSchema>;

export type Comment = CommentBase & {
  author: Author | null;
};

export const commentInsertSchema = createInsertSchema(comments, {
  content: (schema) =>
    schema
      .min(2, { message: "최소 2자 이상 입력해주세요." })
      .max(100, { message: "최대 100자까지 입력 가능합니다." }),
});

export type CommentForm = z.infer<typeof commentInsertSchema>;

export type GetCommentsParams = Partial<BaseParams> & {
  targetId: Comment["targetId"];
  targetType: TargetType;
};

export type LoadmoreCommentParams = Partial<BaseParams> & {
  targetId: Comment["targetId"];
  targetType: Comment["targetType"];
};
