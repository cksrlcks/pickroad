import { useOptimistic, useTransition } from "react";
import { MutationOption, MutationResult } from "@/types";
import {
  bookmarkRoadmapAction,
  createRoadmapAction,
  deleteRoadmapAction,
  updateRoadmapAction,
  likeRoadmapAction,
  unbookmarkRoadmapAction,
  unlikeRoadmapAction,
} from "../server/action";
import { Roadmap, RoadmapForm, RoadmapFormWithUploadedUrl } from "../type";

type CreateRoadmapPayload = { externalId?: string };

export const useCreateRoadmap = (
  options?: MutationOption<CreateRoadmapPayload>,
): MutationResult<CreateRoadmapPayload, RoadmapForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: RoadmapForm) => {
    startTransition(async () => {
      if (data.thumbnail instanceof File) {
        try {
          const { uploadImageByClient } = await import("@/lib/r2-client");
          const uploadResponse = await uploadImageByClient(data.thumbnail);
          data.thumbnail = uploadResponse;
        } catch (error) {
          console.error("이미지 업로드 실패:", error);

          options?.onError?.({
            success: false,
            message: "이미지 업로드 실패",
          });

          return;
        }
      }

      const response = await createRoadmapAction(
        data as RoadmapFormWithUploadedUrl,
      );

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};

type EditRoadmapPayload = { externalId?: string };

export const useEditRoadmap = (
  options?: MutationOption<EditRoadmapPayload>,
): MutationResult<EditRoadmapPayload, RoadmapForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: RoadmapForm) => {
    startTransition(async () => {
      if (data.thumbnail instanceof File) {
        try {
          const { uploadImageByClient } = await import("@/lib/r2-client");
          const uploadResponse = await uploadImageByClient(data.thumbnail);
          data.thumbnail = uploadResponse;
        } catch (error) {
          console.error("이미지 업로드 실패:", error);

          options?.onError?.({
            success: false,
            message: "이미지 업로드 실패",
          });

          return;
        }
      }

      const response = await updateRoadmapAction(
        data as RoadmapFormWithUploadedUrl,
      );

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};

export const useDeleteRoadmap = (
  roadmap: Roadmap,
  options?: MutationOption,
): MutationResult => {
  const [isPending, startTransition] = useTransition();

  const mutate = async () => {
    startTransition(async () => {
      const response = await deleteRoadmapAction(roadmap.id);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};

type LikeRoadmapPayload = { isLiked: boolean; likeCount: number };

export const useLikeRoadmap = (
  roadmap: Roadmap,
  options?: MutationOption,
): MutationResult<LikeRoadmapPayload> => {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic(
    {
      isLiked: roadmap?.isLiked || false,
      likeCount: roadmap?.likeCount || 0,
    },
    (prev, newState: boolean) => {
      return {
        isLiked: newState,
        likeCount: newState ? prev.likeCount + 1 : prev.likeCount - 1,
      };
    },
  );

  const mutate = async () => {
    startTransition(async () => {
      if (!roadmap) return;

      const nextLike = !state.isLiked;
      setState(nextLike);

      const response = nextLike
        ? await likeRoadmapAction(roadmap.id, roadmap.externalId)
        : await unlikeRoadmapAction(roadmap.id, roadmap.externalId);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        setState(!nextLike);
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
    state,
  };
};

type BookmarkRoadmapPayload = boolean;

export const useBookmarkRoadmap = (
  roadmap: Roadmap,
  options?: MutationOption,
): MutationResult<BookmarkRoadmapPayload> => {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic(
    roadmap?.isBookmarked || false,
    (prev, newState: boolean) => newState,
  );

  const mutate = async () => {
    startTransition(async () => {
      if (!roadmap) return;

      const nextBookmark = !state;
      setState(nextBookmark);

      const response = nextBookmark
        ? await bookmarkRoadmapAction(roadmap.id, roadmap.externalId)
        : await unbookmarkRoadmapAction(roadmap.id, roadmap.externalId);

      if (response.success) {
        options?.onSuccess?.(response);
      } else {
        setState(!nextBookmark);
        options?.onError?.(response);
      }
    });
  };

  return {
    isPending,
    mutate,
    state,
  };
};
