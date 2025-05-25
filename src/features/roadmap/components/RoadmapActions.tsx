"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  useBookmarkRoadmap,
  useDeleteRoadmap,
  useLikeRoadmap,
} from "../hooks/useRoadmapMutation";
import { useShareRoadmap } from "../hooks/useShareRoadmap";
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

  const { handleKakaoShareClick, handleCopyUrlClick } = useShareRoadmap();

  const {
    mutate: like,
    state: likeState,
    isPending: isLikePending,
  } = useLikeRoadmap(roadmap);

  const {
    mutate: bookmark,
    state: bookmarkState,
    isPending: isBookmarkPending,
  } = useBookmarkRoadmap(roadmap);

  const { mutate: remove, isPending: isRemovePending } = useDeleteRoadmap(
    roadmap,
    {
      onSuccess: () => {
        router.replace("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  return (
    <div className="flex items-center gap-[1px]">
      <RoadmapLikeButton
        likeCount={likeState.likeCount}
        isLiked={likeState.isLiked}
        onToggleLike={like}
        isPending={isLikePending}
      />
      <RoadmapBookmarkButton
        isBookmarked={bookmarkState}
        onToggleBookmark={bookmark}
        isPending={isBookmarkPending}
      />
      <RoadmapShareButton
        onKakaoShareClick={handleKakaoShareClick}
        onCopyUrlClick={handleCopyUrlClick}
      />
      {isAuthor && (
        <>
          <RoadmapEditButton href={`/roadmap/edit/${roadmap.externalId}`} />
          <RoadmapDeleteButton onDelete={remove} isPending={isRemovePending} />
        </>
      )}
    </div>
  );
}
