import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { sql, and, eq } from "drizzle-orm";
import {
  Roadmap,
  RoadmapCategory,
  RoadmapCompact,
} from "@/features/roadmap/type";
import { auth } from "@/lib/auth";
import { BaseParams } from "@/types";
import { db } from "../db";
import { likes, roadmaps } from "../db/schema";
import { bookmarks } from "../db/schema/bookmarks";

export type GetRoadmapsParams = Partial<BaseParams> & {
  categoryId?: RoadmapCategory["id"];
};

export const getRoadmaps = unstable_cache(
  async (
    params: GetRoadmapsParams,
  ): Promise<{ totalCount: number; data: RoadmapCompact[] }> => {
    const { page = 1, limit = 10, keyword, categoryId } = params;

    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(roadmaps)
      .where(
        and(
          categoryId ? eq(roadmaps.categoryId, categoryId) : undefined,
          keyword ? sql`${roadmaps.title} ILIKE ${`%${keyword}%`}` : undefined,
        ),
      );

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
      where: and(
        categoryId ? eq(roadmaps.categoryId, categoryId) : undefined,
        keyword ? sql`${roadmaps.title} ILIKE ${`%${keyword}%`}` : undefined,
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

export const getRoadmap = unstable_cache(
  async (externalId: Roadmap["externalId"]): Promise<Roadmap | null> => {
    const roadmap = await db.query.roadmaps.findFirst({
      where: eq(roadmaps.externalId, externalId),
      with: {
        category: true,
        author: true,
        items: true,
        tags: {
          with: { tag: true },
        },
      },
    });

    if (!roadmap) return null;

    const [{ count: likeCount }] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(likes)
      .where(
        and(eq(likes.targetType, "roadmap"), eq(likes.targetId, roadmap.id)),
      );

    return {
      ...roadmap,
      tags: roadmap.tags.map((t) => t.tag as { id: number; name: string }),
      likeCount,
    };
  },
);

export const getRoadmapWithSession = async (
  externalId: Roadmap["externalId"],
): Promise<Roadmap | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const roadmap = await getRoadmap(externalId);

  if (!roadmap) return null;

  let isLiked = false;
  let isBookmarked = false;

  if (session) {
    const row = await db
      .select({
        isLiked: sql<boolean>`EXISTS (
      SELECT * FROM ${likes}
      WHERE ${likes.targetType} = 'roadmap'
        AND ${likes.targetId} = ${roadmap.id}
        AND ${likes.userId} = ${session.user.id}
    )`,
        isBookmarked: sql<boolean>`EXISTS (
      SELECT * FROM ${bookmarks}
      WHERE ${likes.targetType} = 'roadmap'
        AND ${likes.targetId} = ${roadmap.id}
        AND ${likes.userId} = ${session.user.id}
    )`,
      })
      .from(likes)
      .then((res) => res[0]);

    isLiked = row.isLiked || false;
    isBookmarked = row.isBookmarked || false;
  }

  return {
    ...roadmap,
    isLiked,
    isBookmarked,
  };
};

export const getCategories = unstable_cache(
  async (): Promise<RoadmapCategory[]> => {
    return await db.query.categories.findMany({
      orderBy: (fields, { asc }) => asc(fields.id),
    });
  },
);
