import { useTransition } from "react";
import { MutationOption, MutationResult } from "@/types";
import {
  createRoadmapCommentAction,
  deleteRoadmapCommentAction,
  updateRoadmapCommentAction,
} from "../server/action";
import { Comment, CommentForm } from "../type";

export const useCreateComment = (
  options?: MutationOption,
): MutationResult<void, CommentForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CommentForm) => {
    startTransition(async () => {
      const response = await createRoadmapCommentAction(data);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};

export const useEditComment = (
  options?: MutationOption,
): MutationResult<void, CommentForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CommentForm) => {
    startTransition(async () => {
      const response = await updateRoadmapCommentAction(data);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};

export const useDeleteComment = (
  comment: Comment,
  options?: MutationOption,
): MutationResult => {
  const [isPending, startTransition] = useTransition();

  const mutate = async () => {
    startTransition(async () => {
      const response = await deleteRoadmapCommentAction(comment.id);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};
