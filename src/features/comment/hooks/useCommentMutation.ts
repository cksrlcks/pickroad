import { useTransition } from "react";
import { toast } from "sonner";
import {
  createRoadmapComment,
  deleteRoadmapComment,
  editRoadmapComment,
} from "@/actions/comment";
import { Comment, CommentForm } from "../type";

type CommentMutationOptions = {
  comment?: Comment;
  create?: {
    onSuccess?: () => void;
  };
  edit?: {
    onSuccess?: () => void;
  };
  remove?: {
    onSuccess?: () => void;
  };
};

export default function useCommentMutation(
  options: CommentMutationOptions = {},
) {
  const [isPendingDelete, startTransitionDelete] = useTransition();

  const create = async (data: CommentForm) => {
    const response = await createRoadmapComment(data);

    if (response.success) {
      toast.success(response.message);
      options.create?.onSuccess?.();
    } else {
      toast.error(response.message);
    }
  };

  const edit = async (data: CommentForm) => {
    const response = await editRoadmapComment(data);

    if (response.success) {
      toast.success(response.message);
      options.edit?.onSuccess?.();
    } else {
      toast.error(response.message);
    }
  };

  const remove = () => {
    startTransitionDelete(async () => {
      if (!options.comment) return;

      const response = await deleteRoadmapComment(options.comment.id);

      if (response.success) {
        toast.success(response.message);
        options.remove?.onSuccess?.();
      } else {
        toast.error(response.message);
      }
    });
  };

  return {
    create,
    edit,
    remove: {
      handle: remove,
      isPending: isPendingDelete,
    },
  };
}
