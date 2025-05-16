import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";
import { ActivityRoadmap } from "@/features/activity/type";
import { auth } from "@/lib/auth";

export const getBookmarks = unstable_cache(
  async (
    authorId: string,
    page: number,
    limit: number,
    keyword?: string,
  ): Promise<{ totalCount: number; data: ActivityRoadmap[] }> => {
    const conditions = [
      eq(roadmaps.authorId, authorId),
      keyword ? ilike(roadmaps.title, `%${keyword}%`) : undefined,
    ].filter(Boolean);

    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(roadmaps)
      .where(and(...conditions));

    const data = await db.query.roadmaps.findMany({
      with: {
        category: true,
        author: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      where: and(...conditions),
      orderBy: (fields, { desc }) => desc(fields.createdAt),
      limit,
      offset: (page - 1) * limit,
    });

    return {
      totalCount: totalCount,
      data: data.map((item) => ({ ...item, type: "roadmap" })),
    };
  },
);

export const getMyBookmarks = async (
  page: number = 1,
  limit: number = 3,
  keyword?: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const authorId = session.user.id;

  return await getBookmarks(authorId, page, limit, keyword);
};
