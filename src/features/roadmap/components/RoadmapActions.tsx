"use client";

import { authClient } from "@/lib/auth-client";
import { useBookmarkRoadmap } from "../hooks/useBookmarkRoadmap";
import { useDeleteRoadmap } from "../hooks/useDeleteRoadmap";
import { useShareRoadmap } from "../hooks/useShareRoadmap";
import { useToggleLikeRoadmap } from "../hooks/useToogleLikeRoadmap";
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

  const { likeState, handleToggleLike, isPendingLike } =
    useToggleLikeRoadmap(roadmap);
  const { isPendingBookmark, bookmarkState, handleToggleBookmark } =
    useBookmarkRoadmap(roadmap);
  const { handleKakaoShareClick, handleCopyUrlClick } = useShareRoadmap();
  const { handleDelete } = useDeleteRoadmap(roadmap);

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
