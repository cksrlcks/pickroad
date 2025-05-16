"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { TargetType } from "@/types";
import { useComments } from "../hooks/useComments";
import { Comment } from "../type";
import { CommentItem } from "./CommentItem";

type CommentListProps = {
  comments: { totalCount: number; data: Comment[] | null };
  targetType: TargetType;
  targetId: number;
};

export default function CommentList({
  comments: initialComments,
  targetType,
  targetId,
}: CommentListProps) {
  const { data: session } = authClient.useSession();
  const { comments, hasMoreComments, isPending, handleLoadmore } = useComments({
    initialComments,
    targetType,
    targetId,
  });

  if (comments.data?.length === 0) {
    return (
      <div className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          리뷰가 없습니다. 첫 리뷰를 남겨보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="mb-4 space-y-1">
        {comments.data?.map((comment) => (
          <li key={comment.id} className="mb-6 pb-6">
            <CommentItem
              comment={comment}
              isCommentAuthor={session?.user.id === comment.author?.id}
            />
          </li>
        ))}
      </ul>

      {hasMoreComments && !isPending && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={handleLoadmore}
            size="sm"
            className="text-xs"
          >
            더보기
          </Button>
        </div>
      )}

      {isPending && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
