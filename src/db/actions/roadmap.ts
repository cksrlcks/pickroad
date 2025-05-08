"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath, unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { inArray, sql, and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { RoadmapForm, roadmapInsertSchema } from "@/features/roadmap/type";
import { auth } from "@/lib/auth";
import { r2 } from "@/lib/r2-client";
import { db } from "..";
import { likes, roadmapItems, roadmaps, roadmapTags, tags } from "../schema";

export const getRoadmaps = unstable_cache(
  async (page: number = 1, limit: number = 3) => {
    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(roadmaps);

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

export const getRoadmap = unstable_cache(async (externalId: string) => {
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
    .select({ count: sql<number>`count(*)` })
    .from(likes)
    .where(
      and(eq(likes.targetType, "roadmap"), eq(likes.targetId, roadmap.id)),
    );

  return {
    ...roadmap,
    tags: roadmap.tags.map((t) => t.tag as { id: number; name: string }),
    likeCount,
  };
});

export const getRoadmapWithSession = async (externalId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const roadmap = await getRoadmap(externalId);

  if (!roadmap) return null;

  let isLiked = false;

  if (session) {
    const row = await db
      .select({
        exists: sql<boolean>`EXISTS (
          SELECT * FROM ${likes}
          WHERE ${likes.targetType} = 'roadmap'
          AND ${likes.targetId} = ${roadmap.id}
          AND ${likes.userId} = ${session.user.id}
        )`,
      })
      .from(likes)
      .then((res) => res[0]);

    isLiked = row?.exists ?? false;
  }

  return {
    ...roadmap,
    isLiked,
  };
};

export const uploadToR2 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const key = `uploads/${Date.now()}`;
  const bucket = process.env.R2_BUCEKT_NAME;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  });

  await r2.send(command);

  return `${process.env.R2_CDN_URL}/${key}`;
};

export async function createRoadmap(form: RoadmapForm) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = roadmapInsertSchema.safeParse(form);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const thumbnailUrl = form.thumbnail
      ? typeof form.thumbnail === "string"
        ? form.thumbnail
        : await uploadToR2(form.thumbnail)
      : null;

    await db.transaction(async (tx) => {
      const [newRoadmap] = await tx
        .insert(roadmaps)
        .values({
          ...form,
          externalId: ulid(),
          thumbnail: thumbnailUrl,
          authorId: session.session.userId,
        })
        .returning();

      if (form.items && form.items.length > 0) {
        await tx.insert(roadmapItems).values(
          form.items.map((item, idx) => ({
            roadmapId: newRoadmap.id,
            order: idx + 1,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
          })),
        );
      }

      if (form.tags && form.tags.length > 0) {
        await tx
          .insert(tags)
          .values(form.tags.map((name) => ({ name })))
          .onConflictDoNothing();

        const tagRecords = await tx
          .select({ id: tags.id, name: tags.name })
          .from(tags)
          .where(inArray(tags.name, form.tags));

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

    revalidatePath("/");

    return {
      success: true,
      message: "성공적으로 작성했습니다.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
}

export async function editRoadmap(form: RoadmapForm) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  if (form?.authorId !== session.user.id) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = roadmapInsertSchema.safeParse(form);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const thumbnailUrl = form.thumbnail
      ? typeof form.thumbnail === "string"
        ? form.thumbnail
        : await uploadToR2(form.thumbnail)
      : null;

    await db.transaction(async (tx) => {
      await tx
        .update(roadmaps)
        .set({
          ...form,
          thumbnail: thumbnailUrl,
        })
        .where(eq(roadmaps.id, form.id!));

      // 기존 items를 지우고 다시 삽입
      await tx.delete(roadmapItems).where(eq(roadmapItems.roadmapId, form.id!));
      if (form.items && form.items.length > 0) {
        await tx.insert(roadmapItems).values(
          form.items.map((item, idx) => ({
            roadmapId: form.id!,
            order: idx + 1,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
          })),
        );
      }

      // 기존 태그 테이블 제거
      await tx.delete(roadmapTags).where(eq(roadmapTags.roadmapId, form.id!));

      if (form.tags && form.tags.length > 0) {
        await tx
          .insert(tags)
          .values(form.tags.map((name) => ({ name })))
          .onConflictDoNothing();

        const tagRecords = await tx
          .select({ id: tags.id, name: tags.name })
          .from(tags)
          .where(inArray(tags.name, form.tags));

        await tx //
          .insert(roadmapTags)
          .values(
            tagRecords.map((tag) => ({
              roadmapId: form.id,
              tagId: tag.id,
            })),
          );
      }
    });

    revalidatePath("/");
    revalidatePath(`/roadmap/${form.externalId}`);

    return {
      success: true,
      message: "성공적으로 수정되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
}

export async function deleteRoadmap(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
    columns: {
      authorId: true,
    },
  });

  if (roadmap?.authorId !== session.user.id) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  try {
    await db.delete(roadmaps).where(eq(roadmaps.id, id));

    revalidatePath("/");

    return {
      success: true,
      message: "성공적으로 삭제했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
}

export const getCategories = unstable_cache(async () => {
  return await db.query.categories.findMany();
});
