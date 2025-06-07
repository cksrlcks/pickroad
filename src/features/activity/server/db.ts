import "server-only";
import { and, desc, eq, ilike, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, comments, likes, roadmaps, user } from "@/db/schema";
import {
  ACTIVITY_TYPES,
  ActivityBookmark,
  ActivityComment,
  ActivityLike,
  ActivityParams,
  ActivityRoadmap,
} from "@/features/activity/type";

export const getMyRoadmaps = async (
  params: ActivityParams,
): Promise<{ totalCount: number; data: ActivityRoadmap[] }> => {
  const { page = 1, limit = 10, keyword, authorId } = params;

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
    data: data.map((item) => ({ ...item, type: ACTIVITY_TYPES.ROADMAP })),
  };
};

export const getMyComments = async (
  params: ActivityParams,
): Promise<{
  totalCount: number;
  data: ActivityComment[];
}> => {
  const { page = 1, limit = 10, keyword, authorId } = params;

  const conditions = [
    eq(comments.authorId, authorId),
    keyword ? ilike(comments.content, `%${keyword}%`) : undefined,
    isNotNull(roadmaps.id),
  ].filter(Boolean);

  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(comments)
    .leftJoin(roadmaps, eq(comments.targetId, roadmaps.id))
    .where(and(...conditions));

  const data = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      targetType: comments.targetType,
      targetId: comments.targetId,
      authorId: comments.authorId,
      author: {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      },
      roadmap: {
        title: roadmaps.title,
        subTitle: roadmaps.subTitle,
        externalId: roadmaps.externalId,
        thumbnail: roadmaps.thumbnail,
      },
    })
    .from(comments)
    .leftJoin(roadmaps, eq(comments.targetId, roadmaps.id))
    .leftJoin(user, eq(comments.authorId, user.id))
    .where(and(...conditions))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    totalCount,
    data: data.map((item) => ({ ...item, type: ACTIVITY_TYPES.COMMENT })),
  };
};

export const getMyLikes = async (
  params: ActivityParams,
): Promise<{
  totalCount: number;
  data: ActivityLike[];
}> => {
  const { page = 1, limit = 10, keyword, authorId } = params;

  const conditions = [
    eq(likes.userId, authorId),
    eq(likes.targetType, "roadmap"),
    keyword ? ilike(roadmaps.title, `%${keyword}%`) : undefined,
    isNotNull(roadmaps.id),
  ].filter(Boolean);

  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(likes)
    .leftJoin(roadmaps, eq(likes.targetId, roadmaps.id))
    .where(and(...conditions));

  const data = await db
    .select({
      id: likes.targetId,
      userId: likes.userId,
      targetId: likes.targetId,
      targetType: likes.targetType,
      createdAt: likes.createdAt,
      roadmap: {
        title: roadmaps.title,
        subTitle: roadmaps.subTitle,
        externalId: roadmaps.externalId,
        thumbnail: roadmaps.thumbnail,
      },
    })
    .from(likes)
    .leftJoin(roadmaps, eq(likes.targetId, roadmaps.id))
    .where(and(...conditions))
    .orderBy(desc(likes.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    totalCount,
    data: data.map((item) => ({ ...item, type: ACTIVITY_TYPES.LIKE })),
  };
};

export const getMyBookmarks = async (
  params: ActivityParams,
): Promise<{ totalCount: number; data: ActivityBookmark[] }> => {
  const { page = 1, limit = 10, keyword, authorId } = params;

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
    totalCount,
    data: data.map((item) => ({ ...item, type: ACTIVITY_TYPES.BOOKMARK })),
  };
};

export const getMyActivity = async (params: ActivityParams) => {
  const {
    page = 1,
    limit = 10,
    keyword,
    type = ACTIVITY_TYPES.ROADMAP,
    authorId,
  } = params;

  switch (type) {
    case ACTIVITY_TYPES.ROADMAP:
      return await getMyRoadmaps({ page, limit, keyword, authorId });
    case ACTIVITY_TYPES.COMMENT:
      return await getMyComments({ page, limit, keyword, authorId });
    case ACTIVITY_TYPES.LIKE:
      return await getMyLikes({ page, limit, keyword, authorId });
    case ACTIVITY_TYPES.BOOKMARK:
      return await getMyBookmarks({ page, limit, keyword, authorId });
    default:
      throw new Error("Invalid activity type.");
  }
};
