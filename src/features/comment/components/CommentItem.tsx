"use client";

import { editRoadmapComment } from "@/actions/comment";
import Author from "@/components/Author";
import useComment from "../hooks/useComment";
import { Comment } from "../type";
import { CommentContent } from "./CommentContent";
import { CommentForm } from "./CommentForm";

type CommentItemProps = {
  comment: Comment;
  isCommentAuthor?: boolean;
};
export function CommentItem({ comment, isCommentAuthor }: CommentItemProps) {
  const { isEditMode, setIsEditMode, isPendingDelete, handleDelete } =
    useComment();

  return (
    <div className="space-y-3">
      <Author user={comment.author} />
      <div className="pl-2">
        {isEditMode ? (
          <CommentForm
            initialData={comment}
            action={editRoadmapComment}
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
            onDelete={handleDelete}
            isPendingDelete={isPendingDelete}
          />
        )}
      </div>
    </div>
  );
}
