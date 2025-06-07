"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  Comment,
  CommentForm,
  commentInsertSchema,
  LoadmoreCommentParams,
} from "@/features/comment/type";
import { getRoadmapExternalId } from "@/features/roadmap/server/db";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";
import {
  createComment,
  deleteComment,
  getComment,
  getMoreComments,
  updateComment,
} from "./db";

export const createRoadmapCommentAction = async (
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
    const externalId = await getRoadmapExternalId(data.targetId);
    if (!externalId) {
      return {
        success: false,
        message: "로드맵이 존재하지 않습니다.",
      };
    }

    await createComment({ ...parsed.data, authorId });

    revalidatePath(`/roadmap/${externalId}`);

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

export const updateRoadmapCommentAction = async (
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
    const externalId = await getRoadmapExternalId(data.targetId);
    if (!externalId) {
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

    const comment = await getComment(data.id);

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

    await updateComment(data);

    revalidatePath(`/roadmap/${externalId}`);

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

export const deleteRoadmapCommentAction = async (
  commentId: Comment["id"],
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
    const comment = await getComment(commentId);
    if (!comment) {
      return {
        success: false,
        message: "댓글이 존재하지 않습니다.",
      };
    }

    const externalId = await getRoadmapExternalId(comment.targetId);

    if (!externalId) {
      return {
        success: false,
        message: "로드맵이 존재하지 않습니다.",
      };
    }

    if (comment?.authorId !== authorId) {
      return {
        success: false,
        message: "권한이 없습니다.",
      };
    }

    await deleteComment(commentId);
    revalidatePath(`/roadmap/${externalId}`);

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

export const loadmoreCommentAction = async (
  params: LoadmoreCommentParams,
): Promise<ServerActionResult<{ comments: Comment[] }>> => {
  try {
    const data = await getMoreComments(params);

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
