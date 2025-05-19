"use client";

import { useState } from "react";
import Author from "@/components/Author";
import useCommentMutation from "../hooks/useCommentMutation";
import { Comment } from "../type";
import { CommentContent } from "./CommentContent";
import { CommentForm } from "./CommentForm";

type CommentItemProps = {
  comment: Comment;
  isCommentAuthor?: boolean;
};
export function CommentItem({ comment, isCommentAuthor }: CommentItemProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { remove } = useCommentMutation({ comment });

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
            onDelete={remove.handle}
            isPendingDelete={remove.isPending}
          />
        )}
      </div>
    </div>
  );
}
