import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { comments } from "@/db/schema";
import { Author } from "../auth/type";

export const commentSchema = createSelectSchema(comments);

export type CommentBase = z.infer<typeof commentSchema>;

export type Comment = Omit<CommentBase, "authorId"> & {
  author: Author | null;
};

export const commentBaseInsertSchema = createInsertSchema(comments, {
  content: (schema) =>
    schema
      .min(2, { message: "최소 2자 이상 입력해주세요." })
      .max(100, { message: "최대 100자까지 입력 가능합니다." }),
});

export const commentInsertSchema = commentBaseInsertSchema.omit({
  authorId: true,
  createdAt: true,
  updatedAt: true,
});

export type CommentForm = z.infer<typeof commentInsertSchema>;
