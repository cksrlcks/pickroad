"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Pencil, Share, Star, Trash } from "lucide-react";
import { toast } from "sonner";
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
import {
  deleteRoadmap,
  likeRoadmap,
  unlikeRoadmap,
} from "@/db/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Roadmap } from "../type";

type RoadmapActionsProps = {
  roadmap: Roadmap;
};

export default function RoadmapActions({ roadmap }: RoadmapActionsProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isAuthor = session?.user.id === roadmap.author?.id;

  const [isPending, startTransition] = useTransition();
  const [likeState, setLikeState] = useOptimistic(
    { isLiked: roadmap.isLiked, likeCount: roadmap.likeCount },
    (prev, newState: boolean) => {
      return {
        isLiked: newState,
        likeCount: newState ? prev.likeCount + 1 : prev.likeCount - 1,
      };
    },
  );

  const handleDelete = async () => {
    const response = await deleteRoadmap(roadmap.id);
    if (response.success) {
      toast.success(response.message);
      router.replace("/");
    } else {
      toast.error(response.message);
    }
  };

  const handleToggleLike = async () => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    startTransition(async () => {
      const nextLike = !likeState.isLiked;
      setLikeState(nextLike);

      const response = nextLike
        ? await likeRoadmap(roadmap.id, roadmap.externalId)
        : await unlikeRoadmap(roadmap.id, roadmap.externalId);

      if (!response.success) {
        setLikeState(!nextLike);
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        className={cn(
          "mr-auto -ml-2.5 h-8 rounded-full px-2.5 transition-all hover:bg-pink-100",
          likeState.isLiked && "bg-pink-100/80 font-semibold",
        )}
        onClick={handleToggleLike}
        disabled={isPending}
      >
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Heart strokeWidth={3} className="w-[14px] text-[#FF7C7C]" />
          {likeState.likeCount}
        </div>
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
        onClick={() => alert("준비중")}
      >
        <Star strokeWidth={3} className="h-4 w-4" />
        <span className="sr-only">즐겨찾기</span>
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
        onClick={() => alert("준비중")}
      >
        <Share strokeWidth={3} className="h-4 w-4" />
        <span className="sr-only">공유하기</span>
      </button>
      {isAuthor && (
        <>
          <Link
            href={`/roadmap/edit/${roadmap.externalId}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
          >
            <Pencil strokeWidth={3} className="h-4 w-4" />
            <span className="sr-only">수정하기</span>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
              >
                <Trash strokeWidth={3} className="h-4 w-4" />
                <span className="sr-only">삭제하기</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  게시물을 삭제하면 다시 복구가 불가능합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
