import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { DEFAULT_PER_PAGE } from "@/constants";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { Comment } from "@/features/comment/type";
import { TargetType } from "@/types";

export const getComments = unstable_cache(
  async (
    targetId: number,
    targetType: TargetType,
    page: number = 1,
    limit: number = DEFAULT_PER_PAGE,
  ): Promise<{ totalCount: number; data: Comment[] }> => {
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
