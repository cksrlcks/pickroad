import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { bookmarkRoadmap, unbookmarkRoadmap } from "@/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { Roadmap } from "../type";

// Bookmark roadmap

export function useBookmarkRoadmap(roadmap: Roadmap) {
  const { data: session } = authClient.useSession();
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

  return {
    isPendingBookmark,
    bookmarkState,
    handleToggleBookmark,
  };
}
