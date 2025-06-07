import "server-only";
import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schema";
import {
  Comment,
  CommentForm,
  GetCommentsParams,
  LoadmoreCommentParams,
} from "@/features/comment/type";

export const getComments = unstable_cache(
  async (
    params: GetCommentsParams,
  ): Promise<{ totalCount: number; data: Comment[] }> => {
    const { page = 1, limit = 10, targetId, targetType } = params;
    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(
        and(
          eq(comments.targetId, targetId),
          eq(comments.targetType, targetType),
        ),
      );

    const data = await db.query.comments.findMany({
      with: {
        author: true,
      },
      where: and(
        eq(comments.targetId, targetId),
        eq(comments.targetType, targetType),
      ),
      orderBy: (fields, { desc }) => desc(fields.createdAt),
      limit,
      offset: (page - 1) * limit,
    });

    return {
      totalCount: totalCount,
      data,
    };
  },
);

export const getMoreComments = async ({
  targetId,
  targetType,
  page = 1,
  limit = 10,
}: LoadmoreCommentParams) => {
  return db.query.comments.findMany({
    with: {
      author: true,
    },
    where: and(
      eq(comments.targetId, targetId),
      eq(comments.targetType, targetType),
    ),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
    limit,
    offset: (page - 1) * limit,
  });
};

export const getComment = (id: Comment["id"]) => {
  return db.query.comments.findFirst({
    where: and(eq(comments.id, id)),
  });
};

export const createComment = (data: CommentForm) => {
  return db.insert(comments).values(data);
};

export const updateComment = (data: CommentForm) => {
  if (!data.id) {
    throw new Error("Comment ID가 필요합니다.");
  }

  return db
    .update(comments)
    .set({ content: data.content })
    .where(eq(comments.id, data.id));
};

export const deleteComment = (id: Comment["id"]) => {
  return db.delete(comments).where(eq(comments.id, id));
};
