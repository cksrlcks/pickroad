"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { DEFAULT_PER_PAGE } from "@/constants";
import { db } from "@/db";
import { comments, roadmaps } from "@/db/schema";
import {
  Comment,
  CommentForm,
  commentInsertSchema,
} from "@/features/comment/type";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";

export const createRoadmapComment = async (
  data: CommentForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = commentInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const authorId = session.user.id;
    const roadmap = await db.query.roadmaps.findFirst({
      where: eq(roadmaps.id, data.targetId),
    });

    if (!roadmap) {
      return {
        success: false,
        message: "로드맵이 존재하지 않습니다.",
      };
    }

    await db.insert(comments).values({
      ...parsed.data,
      authorId,
    });

    revalidatePath(`/roadmap/${roadmap.externalId}`);

    return {
      success: true,
      message: "댓글이 등록되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const editRoadmapComment = async (
  data: CommentForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = commentInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const authorId = session.user.id;
    const roadmap = await db.query.roadmaps.findFirst({
      where: eq(roadmaps.id, data.targetId),
    });

    if (!roadmap) {
      return {
        success: false,
        message: "로드맵이 존재하지 않습니다.",
      };
    }

    if (data.id === undefined) {
      return {
        success: false,
        message: "댓글 ID가 없습니다.",
      };
    }

    const comment = await db.query.comments.findFirst({
      where: and(eq(comments.id, data.id)),
    });

    if (!comment) {
      return {
        success: false,
        message: "댓글이 존재하지 않습니다.",
      };
    }

    if (comment?.authorId !== authorId) {
      return {
        success: false,
        message: "권한이 없습니다.",
      };
    }

    await db
      .update(comments)
      .set({
        content: parsed.data.content,
      })
      .where(and(eq(comments.id, data.id!), eq(comments.authorId, authorId)));

    revalidatePath(`/roadmap/${roadmap.externalId}`);

    return {
      success: true,
      message: "댓글이 수정되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const deleteRoadmapComment = async (
  commentId: number,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  try {
    const authorId = session.user.id;
    const comment = await db.query.comments.findFirst({
      where: and(eq(comments.id, commentId)),
    });

    if (!comment) {
      return {
        success: false,
        message: "댓글이 존재하지 않습니다.",
      };
    }

    if (comment?.authorId !== authorId) {
      return {
        success: false,
        message: "권한이 없습니다.",
      };
    }

    const roadmap = await db.query.roadmaps.findFirst({
      where: eq(roadmaps.id, comment.targetId),
    });

    if (!roadmap) {
      return {
        success: false,
        message: "로드맵이 존재하지 않습니다.",
      };
    }

    await db.delete(comments).where(eq(comments.id, commentId));
    revalidatePath(`/roadmap/${roadmap.externalId}`);

    return {
      success: true,
      message: "댓글이 삭제되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const loadmoreComment = async (
  targetId: number,
  targetType: string,
  page: number,
  limit: number = DEFAULT_PER_PAGE,
): Promise<ServerActionResult<{ comments: Comment[] }>> => {
  try {
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
      success: true,
      message: "댓글을 불러왔습니다.",
      payload: {
        comments: data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};
