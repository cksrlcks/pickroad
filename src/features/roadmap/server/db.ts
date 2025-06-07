import "server-only";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { User } from "better-auth";
import { sql, and, eq, or, ilike, inArray } from "drizzle-orm";
import { ulid } from "ulid";
import { db } from "@/db";
import { likes, roadmapItems, roadmaps, roadmapTags, tags } from "@/db/schema";
import { bookmarks } from "@/db/schema/bookmarks";
import {
  GetRoadmapsParams,
  Roadmap,
  RoadmapCompact,
  RoadmapFormWithUploadedUrl,
} from "@/features/roadmap/type";
import { auth } from "@/lib/auth";

export const getRoadmaps = unstable_cache(
  async (
    params: GetRoadmapsParams,
  ): Promise<{ totalCount: number; data: RoadmapCompact[] }> => {
    const { page = 1, limit = 10, keyword, categoryId } = params;

    const roadmapIdsByTag = keyword
      ? db
          .select({ roadmapId: roadmapTags.roadmapId })
          .from(roadmapTags)
          .innerJoin(tags, eq(roadmapTags.tagId, tags.id))
          .where(ilike(tags.name, `%${keyword}%`))
      : undefined;

    const whereCondition = and(
      categoryId ? eq(roadmaps.categoryId, categoryId) : undefined,
      or(
        keyword ? sql`${roadmaps.title} ILIKE ${`%${keyword}%`}` : undefined,
        roadmapIdsByTag
          ? sql`${roadmaps.id} IN (${roadmapIdsByTag})`
          : undefined,
      ),
    );

    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(distinct ${roadmaps.id})` })
      .from(roadmaps)
      .leftJoin(roadmapTags, eq(roadmaps.id, roadmapTags.roadmapId))
      .leftJoin(tags, eq(roadmapTags.tagId, tags.id))
      .where(whereCondition);

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
      where: whereCondition,
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

export const getRoadmapAuthorId = async (
  id: Roadmap["id"],
): Promise<{ authorId: string | null }> => {
  const authorId = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
    columns: {
      authorId: true,
    },
  });
  return {
    authorId: authorId?.authorId || null,
  };
};

export const getRoadmapExternalId = async (id: Roadmap["id"]) => {
  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
    columns: {
      externalId: true,
    },
  });

  return roadmap?.externalId || null;
};

export const getRoadmapWithExternalId = unstable_cache(
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

  const roadmap = await getRoadmapWithExternalId(externalId);

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

export const createRoadmap = async (
  data: RoadmapFormWithUploadedUrl,
): Promise<{ externalId: string }> => {
  const externalId = ulid();

  await db.transaction(async (tx) => {
    const [newRoadmap] = await tx
      .insert(roadmaps)
      .values({
        ...data,
        externalId,
      })
      .returning();

    if (data.items && data.items.length > 0) {
      await tx.insert(roadmapItems).values(
        data.items.map((item, idx) => ({
          roadmapId: newRoadmap.id,
          order: idx + 1,
          title: item.title,
          description: item.description,
          url: item.url,
          thumbnail: item.thumbnail,
        })),
      );
    }

    if (data.tags && data.tags.length > 0) {
      await tx
        .insert(tags)
        .values(data.tags.map((name) => ({ name })))
        .onConflictDoNothing();

      const tagRecords = await tx
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .where(inArray(tags.name, data.tags));

      await tx //
        .insert(roadmapTags)
        .values(
          tagRecords.map((tag) => ({
            roadmapId: newRoadmap.id,
            tagId: tag.id,
          })),
        );
    }
  });

  return {
    externalId,
  };
};

export const updateRoadmap = async (
  data: RoadmapFormWithUploadedUrl,
): Promise<{ externalId: string }> => {
  if (!data.externalId) {
    throw new Error("externalId가 필요합니다.");
  }

  await db.transaction(async (tx) => {
    await tx.update(roadmaps).set(data).where(eq(roadmaps.id, data.id!));

    // 기존 items를 지우고 다시 삽입
    await tx.delete(roadmapItems).where(eq(roadmapItems.roadmapId, data.id!));
    if (data.items && data.items.length > 0) {
      await tx.insert(roadmapItems).values(
        data.items.map((item, idx) => ({
          roadmapId: data.id!,
          order: idx + 1,
          title: item.title,
          description: item.description,
          url: item.url,
          thumbnail: item.thumbnail,
        })),
      );
    }

    // 기존 태그 테이블 제거
    await tx.delete(roadmapTags).where(eq(roadmapTags.roadmapId, data.id!));

    if (data.tags && data.tags.length > 0) {
      await tx
        .insert(tags)
        .values(data.tags.map((name) => ({ name })))
        .onConflictDoNothing();

      const tagRecords = await tx
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .where(inArray(tags.name, data.tags));

      await tx //
        .insert(roadmapTags)
        .values(
          tagRecords.map((tag) => ({
            roadmapId: data.id,
            tagId: tag.id,
          })),
        );
    }
  });

  return {
    externalId: data.externalId,
  };
};

export const deleteRoadmap = (id: Roadmap["id"]) => {
  return db.delete(roadmaps).where(eq(roadmaps.id, id));
};

export const likeRoadmap = (userId: User["id"], targetId: Roadmap["id"]) => {
  return db.insert(likes).values({
    userId,
    targetType: "roadmap",
    targetId,
  });
};

export const unlikeRoadmap = (userId: User["id"], targetId: Roadmap["id"]) => {
  return db
    .delete(likes)
    .where(
      and(
        eq(likes.targetType, "roadmap"),
        eq(likes.targetId, targetId),
        eq(likes.userId, userId),
      ),
    );
};

export const bookmarkRoadmap = (
  userId: User["id"],
  targetId: Roadmap["id"],
) => {
  return db.insert(bookmarks).values({
    userId,
    targetType: "roadmap",
    targetId,
  });
};

export const unbookmarkRoadmap = (
  userId: User["id"],
  targetId: Roadmap["id"],
) => {
  return db
    .delete(bookmarks)
    .where(
      and(
        eq(bookmarks.targetType, "roadmap"),
        eq(bookmarks.targetId, targetId),
        eq(bookmarks.userId, userId),
      ),
    );
};
