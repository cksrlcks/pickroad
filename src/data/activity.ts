import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "better-auth";
import { and, desc, eq, ilike, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, likes, roadmaps, user } from "@/db/schema";
import {
  ACTIVITY_TYPES,
  ActivityComment,
  ActivityLike,
  ActivityRoadmap,
  ActivityType,
} from "@/features/activity/type";
import { auth } from "@/lib/auth";
import { BaseParams } from "@/types";

export type ActivityParams = Partial<BaseParams> & {
  type?: ActivityType;
};

export type ActivityParamsWithSession = ActivityParams & {
  authorId: User["id"];
};

export const getMyRoadmaps = async (
  params: ActivityParamsWithSession,
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
  params: ActivityParamsWithSession,
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
  params: ActivityParamsWithSession,
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

export const getMyActivity = async (params: ActivityParams) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const authorId = session.user.id;

  switch (params.type || ACTIVITY_TYPES.ROADMAP) {
    case ACTIVITY_TYPES.ROADMAP:
      return await getMyRoadmaps({ ...params, authorId });
    case ACTIVITY_TYPES.COMMENT:
      return await getMyComments({ ...params, authorId });
    case ACTIVITY_TYPES.LIKE:
      return await getMyLikes({ ...params, authorId });
    default:
      throw new Error("Invalid activity type.");
  }
};
