import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { likeRoadmap, unlikeRoadmap } from "@/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { Roadmap } from "../type";

// Optimistic like

export function useToggleLikeRoadmap(roadmap: Roadmap) {
  const { data: session } = authClient.useSession();
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

  return {
    isPendingLike,
    likeState,
    handleToggleLike,
  };
}
