"use client";

import { useEffect, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  bookmarkRoadmap,
  deleteRoadmap,
  likeRoadmap,
  unbookmarkRoadmap,
  unlikeRoadmap,
} from "@/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { Roadmap } from "../type";
import { RoadmapDeleteButton } from "./RoadmapDeleteButton";
import { RoadmapEditButton } from "./RoadmapEditButton";
import { RoadmapBookmarkButton } from "./RoadmapFavoriteButton";
import { RoadmapLikeButton } from "./RoadmapLikeButton";
import { RoadmapShareButton } from "./RoadmapShareButton";

type RoadmapActionsProps = {
  roadmap: Roadmap;
};

export default function RoadmapActions({ roadmap }: RoadmapActionsProps) {
  const { data: session } = authClient.useSession();
  const isAuthor = session?.user.id === roadmap.author?.id;
  const router = useRouter();

  // Optimistic like
  const [isPendingLike, startTransitionLike] = useTransition();
  const [likeState, setLikeState] = useOptimistic(
    { isLiked: roadmap.isLiked || false, likeCount: roadmap.likeCount },
    (prev, newState: boolean) => {
      return {
        isLiked: newState,
        likeCount: newState ? prev.likeCount + 1 : prev.likeCount - 1,
      };
    },
  );
  const handleToggleLike = async () => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    startTransitionLike(async () => {
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

  // Bookmark roadmap
  const [isPendingBookmark, startTransitionBookmark] = useTransition();
  const [bookmarkState, setBookmarkState] = useOptimistic(
    roadmap.isBookmarked || false,
    (prev, newState: boolean) => newState,
  );
  const handleToggleBookmark = async () => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    startTransitionBookmark(async () => {
      const nextBookmark = !bookmarkState;
      setBookmarkState(nextBookmark);

      const response = nextBookmark
        ? await bookmarkRoadmap(roadmap.id, roadmap.externalId)
        : await unbookmarkRoadmap(roadmap.id, roadmap.externalId);

      if (!response.success) {
        setBookmarkState(!nextBookmark);
        toast.error(response.message);
      }
    });
  };

  // Share roadmap
  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
      }
    }
  }, []);

  const handleKakaoShareClick = () => {
    if (!window.Kakao) {
      toast.error("카카오톡 SDK가 초기화되지 않았습니다.");
      return;
    }

    window.Kakao.Share.sendScrap({
      requestUrl: window.location.href,
      installTalk: true,
    });
  };

  const handleCopyUrlClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL이 복사되었습니다.");
  };

  // Delete roadmap
  const handleDelete = async () => {
    const response = await deleteRoadmap(roadmap.id);
    if (response.success) {
      toast.success(response.message);
      router.replace("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex items-center gap-[1px]">
      <RoadmapLikeButton
        likeCount={likeState.likeCount}
        isLiked={likeState.isLiked}
        onToggleLike={handleToggleLike}
        isPending={isPendingLike}
      />
      <RoadmapBookmarkButton
        isBookmarked={bookmarkState}
        onToggleBookmark={handleToggleBookmark}
        isPending={isPendingBookmark}
      />
      <RoadmapShareButton
        onKakaoShareClick={handleKakaoShareClick}
        onCopyUrlClick={handleCopyUrlClick}
      />
      {isAuthor && (
        <>
          <RoadmapEditButton href={`/roadmap/edit/${roadmap.externalId}`} />
          <RoadmapDeleteButton onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
