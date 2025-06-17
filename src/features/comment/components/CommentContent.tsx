import { Pen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { dateToAgo } from "@/lib/utils";
import { Comment } from "../type";

type CommentContentProps = {
  comment: Comment;
  isCommentAuthor?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isPendingDelete: boolean;
};

export function CommentContent({
  comment,
  isCommentAuthor,
  onEdit,
  onDelete,
  isPendingDelete,
}: CommentContentProps) {
  return (
    <div className="border-l-muted border-l-3 pb-1.5 pl-5">
      <p className="mb-5 text-sm whitespace-pre-wrap">{comment.content}</p>
      <div className="flex h-2.5 items-center gap-1.5">
        {comment.createdAt && (
          <div className="flex items-center gap-1.5 text-xs opacity-40">
            <Pen size={10} strokeWidth={2} />
            {dateToAgo(comment.createdAt)}
          </div>
        )}
        {isCommentAuthor && (
          <>
            <Separator orientation="vertical" className="mx-1" />
            <button
              type="button"
              className="text-xs opacity-70 hover:opacity-100"
              onClick={onEdit}
            >
              수정
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  삭제
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    리뷰를 삭제하면 다시 복구가 불가능합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isPendingDelete}
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
