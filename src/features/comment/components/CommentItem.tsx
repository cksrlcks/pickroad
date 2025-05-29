"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Author from "@/components/Author";
import { useDeleteComment } from "../hooks/useCommentMutation";
import { Comment } from "../type";
import { CommentContent } from "./CommentContent";
import CommentForm from "./CommentForm";

type CommentItemProps = {
  comment: Comment;
  isCommentAuthor?: boolean;
};
export function CommentItem({ comment, isCommentAuthor }: CommentItemProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const { mutate: remove, isPending: isPendingRemove } = useDeleteComment(
    comment,
    {
      onSuccess: () => {
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  return (
    <div className="space-y-3">
      <Author user={comment.author} />
      <div className="pl-2">
        {isEditMode ? (
          <CommentForm
            initialData={comment}
            targetType="roadmap"
            targetId={comment.targetId}
            onComplete={() => setIsEditMode(false)}
            onCancel={() => setIsEditMode(false)}
          />
        ) : (
          <CommentContent
            comment={comment}
            isCommentAuthor={isCommentAuthor}
            onEdit={() => setIsEditMode(true)}
            onDelete={remove}
            isPendingDelete={isPendingRemove}
          />
        )}
      </div>
    </div>
  );
}
