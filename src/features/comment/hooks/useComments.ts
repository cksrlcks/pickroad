import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { loadmoreComment } from "@/actions/comment";
import { TargetType } from "@/types";
import { Comment } from "../type";

type useCommentsProps = {
  initialComments: { totalCount: number; data: Comment[] | null };
  targetType: TargetType;
  targetId: number;
};

export function useComments({
  initialComments,
  targetType,
  targetId,
}: useCommentsProps) {
  const [isPending, setTransition] = useTransition();
  const [comments, setComments] = useState<{
    page: number;
    data: Comment[] | null;
  }>({
    page: 1,
    data: initialComments.data,
  });

  useEffect(() => {
    setComments({
      page: 1,
      data: initialComments.data,
    });
  }, [initialComments.data]);

  const handleLoadmore = async () => {
    setTransition(async () => {
      const response = await loadmoreComment(
        targetId,
        targetType,
        comments.page + 1,
      );
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const fetchedComments = response.payload?.comments;

      setComments((prev) => ({
        page: prev.page + 1,
        data: prev.data
          ? [...prev.data, ...(fetchedComments || [])]
          : fetchedComments || [],
      }));
    });
  };

  const hasMoreComments =
    comments.data && comments.data.length < initialComments.totalCount;

  return {
    comments,
    isPending,
    handleLoadmore,
    hasMoreComments,
  };
}
