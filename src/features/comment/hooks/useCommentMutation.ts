import { useTransition } from "react";
import {
  createRoadmapComment,
  deleteRoadmapComment,
  editRoadmapComment,
} from "@/actions/comment";
import { MutationOption } from "@/types";
import { Comment, CommentForm } from "../type";

export const useCreateComment = (options?: MutationOption) => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CommentForm) => {
    startTransition(async () => {
      const response = await createRoadmapComment(data);

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

export const useEditComment = (options?: MutationOption) => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CommentForm) => {
    startTransition(async () => {
      const response = await editRoadmapComment(data);

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
) => {
  const [isPending, startTransition] = useTransition();

  const mutate = async () => {
    startTransition(async () => {
      const response = await deleteRoadmapComment(comment.id);

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
