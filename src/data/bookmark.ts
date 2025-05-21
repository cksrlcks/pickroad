import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, ilike, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, roadmaps } from "@/db/schema";
import { Bookmark } from "@/features/bookmark/type";
import { auth } from "@/lib/auth";
import { ActivityParams } from "./activity";

export const getMyBookmarks = async (
  params: ActivityParams,
): Promise<{ totalCount: number; data: Bookmark[] }> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { page = 1, limit = 10, keyword } = params;
  const authorId = session.user.id;

  const conditions = [
    eq(bookmarks.userId, authorId),
    eq(bookmarks.targetType, "roadmap"),
    keyword ? ilike(roadmaps.title, `%${keyword}%`) : undefined,
    isNotNull(roadmaps.id),
  ].filter(Boolean);

  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookmarks)
    .leftJoin(roadmaps, eq(bookmarks.targetId, roadmaps.id))
    .where(and(...conditions));

  const data = await db
    .select({
      id: bookmarks.targetId,
      userId: bookmarks.userId,
      targetId: bookmarks.targetId,
      targetType: bookmarks.targetType,
      createdAt: bookmarks.createdAt,
      roadmap: {
        title: roadmaps.title,
        subTitle: roadmaps.subTitle,
        externalId: roadmaps.externalId,
        thumbnail: roadmaps.thumbnail,
      },
    })
    .from(bookmarks)
    .leftJoin(roadmaps, eq(bookmarks.targetId, roadmaps.id))
    .where(and(...conditions))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    totalCount: totalCount,
    data,
  };
};
