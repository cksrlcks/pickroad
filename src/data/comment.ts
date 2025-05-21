import "server-only";
import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { Comment } from "@/features/comment/type";
import { BaseParams, TargetType } from "@/types";

type GetCommentsParams = Partial<BaseParams> & {
  targetId: Comment["targetId"];
  targetType: TargetType;
};

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
