"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import useRoadmapMutation from "../hooks/useRoadmapMutation";
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
  const { like, bookmark, remove } = useRoadmapMutation({
    roadmap,
    remove: {
      onSuccess: () => {
        router.replace("/");
      },
    },
  });

  return (
    <div className="flex items-center gap-[1px]">
      <RoadmapLikeButton
        likeCount={like.state.likeCount}
        isLiked={like.state.isLiked}
        onToggleLike={like.handle}
        isPending={like.isPending}
      />
      <RoadmapBookmarkButton
        isBookmarked={bookmark.state}
        onToggleBookmark={bookmark.handle}
        isPending={bookmark.isPending}
      />
      <RoadmapShareButton
        onKakaoShareClick={handleKakaoShareClick}
        onCopyUrlClick={handleCopyUrlClick}
      />
      {isAuthor && (
        <>
          <RoadmapEditButton href={`/roadmap/edit/${roadmap.externalId}`} />
          <RoadmapDeleteButton
            onDelete={remove.handle}
            isPending={remove.isPending}
          />
        </>
      )}
    </div>
  );
}
