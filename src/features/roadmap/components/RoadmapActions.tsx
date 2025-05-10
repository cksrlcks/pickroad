"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteRoadmap,
  likeRoadmap,
  unlikeRoadmap,
} from "@/db/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { Roadmap } from "../type";
import { RoadmapDeleteButton } from "./RoadmapDeleteButton";
import { RoadmapEditButton } from "./RoadmapEditButton";
import { RoadmapFavoriteButton } from "./RoadmapFavoriteButton";
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

  // TODO : Favorite roadmap

  // TODO : Share roadmap

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
    <div className="flex items-center">
      <RoadmapLikeButton
        likeCount={likeState.likeCount}
        isLiked={likeState.isLiked}
        onToggleLike={handleToggleLike}
        isPending={isPendingLike}
      />
      <RoadmapFavoriteButton />
      <RoadmapShareButton />
      {isAuthor && (
        <>
          <RoadmapEditButton href={`/roadmap/edit/${roadmap.externalId}`} />
          <RoadmapDeleteButton onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
