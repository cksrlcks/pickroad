import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import {
  bookmarkRoadmap,
  createRoadmap,
  deleteRoadmap,
  editRoadmap,
  likeRoadmap,
  unbookmarkRoadmap,
  unlikeRoadmap,
} from "@/actions/roadmap";
import { authClient } from "@/lib/auth-client";
import { uploadImageByClient } from "@/lib/r2-client";
import { Roadmap, RoadmapForm, RoadmapFormWithUploadedUrl } from "../type";

type RoadmapMutationOptions = {
  roadmap?: Roadmap;
  create?: {
    onSuccess?: (externalId?: string) => void;
  };
  edit?: {
    onSuccess?: (externalId?: string) => void;
  };
  remove?: {
    onSuccess?: () => void;
  };
};

export default function useRoadmapMutation(
  options: RoadmapMutationOptions = {},
) {
  const { data: session } = authClient.useSession();

  const [isPendingDelete, startTransitionDelete] = useTransition();

  const [isPendingLike, startTransitionLike] = useTransition();
  const [likeState, setLikeState] = useOptimistic(
    {
      isLiked: options.roadmap?.isLiked || false,
      likeCount: options.roadmap?.likeCount || 0,
    },
    (prev, newState: boolean) => {
      return {
        isLiked: newState,
        likeCount: newState ? prev.likeCount + 1 : prev.likeCount - 1,
      };
    },
  );

  const [isPendingBookmark, startTransitionBookmark] = useTransition();
  const [bookmarkState, setBookmarkState] = useOptimistic(
    options.roadmap?.isBookmarked || false,
    (prev, newState: boolean) => newState,
  );

  const create = async (data: RoadmapForm) => {
    try {
      if (data.thumbnail instanceof File) {
        const uploadResponse = await uploadImageByClient(data.thumbnail);
        data.thumbnail = uploadResponse;
      }

      const response = await createRoadmap(data as RoadmapFormWithUploadedUrl);

      if (response.success) {
        toast.success(response.message);
        options.create?.onSuccess?.(response.payload?.externalId);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        `${error instanceof Error ? error.message : "작성을 실패했습니다."}`,
      );
    }
  };

  const edit = async (data: RoadmapForm) => {
    if (data.thumbnail instanceof File) {
      const uploadResponse = await uploadImageByClient(data.thumbnail);
      data.thumbnail = uploadResponse;
    }

    const response = await editRoadmap(data as RoadmapFormWithUploadedUrl);

    if (response.success) {
      toast.success(response.message);
      options.edit?.onSuccess?.(response.payload?.externalId);
    } else {
      toast.error(response.message);
    }
  };

  const remove = () => {
    startTransitionDelete(async () => {
      if (!options.roadmap) return;

      const response = await deleteRoadmap(options.roadmap.id);

      if (response.success) {
        toast.success(response.message);
        options.remove?.onSuccess?.();
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleToggleLike = async () => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    startTransitionLike(async () => {
      if (!options.roadmap) return;

      const nextLike = !likeState.isLiked;
      setLikeState(nextLike);

      const response = nextLike
        ? await likeRoadmap(options?.roadmap.id, options?.roadmap.externalId)
        : await unlikeRoadmap(options?.roadmap.id, options?.roadmap.externalId);

      if (!response.success) {
        setLikeState(!nextLike);
        toast.error(response.message);
      }
    });
  };

  const handleToggleBookmark = async () => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    startTransitionBookmark(async () => {
      if (!options.roadmap) return;

      const nextBookmark = !bookmarkState;
      setBookmarkState(nextBookmark);

      const response = nextBookmark
        ? await bookmarkRoadmap(
            options?.roadmap.id,
            options?.roadmap.externalId,
          )
        : await unbookmarkRoadmap(
            options?.roadmap.id,
            options?.roadmap.externalId,
          );

      if (!response.success) {
        setBookmarkState(!nextBookmark);
        toast.error(response.message);
      }
    });
  };

  return {
    create,
    edit,
    remove: {
      handle: remove,
      isPending: isPendingDelete,
    },
    like: {
      handle: handleToggleLike,
      isPending: isPendingLike,
      state: likeState,
    },
    bookmark: {
      handle: handleToggleBookmark,
      isPending: isPendingBookmark,
      state: bookmarkState,
    },
  };
}
