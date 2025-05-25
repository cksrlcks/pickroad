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
import { uploadImageByClient } from "@/lib/r2-client";
import { MutationOption, MutationResult } from "@/types";
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
          const uploadResponse = await uploadImageByClient(data.thumbnail);
          data.thumbnail = uploadResponse;
        } catch (error) {
          toast.error(
            `${error instanceof Error ? error.message : "이미지 업로드 실패"}`,
          );
          return;
        }
      }

      const response = await createRoadmap(data as RoadmapFormWithUploadedUrl);

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
          const uploadResponse = await uploadImageByClient(data.thumbnail);
          data.thumbnail = uploadResponse;
        } catch (error) {
          toast.error(
            `${error instanceof Error ? error.message : "이미지 업로드 실패"}`,
          );
          return;
        }
      }

      const response = await editRoadmap(data as RoadmapFormWithUploadedUrl);

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
      const response = await deleteRoadmap(roadmap.id);

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
        ? await likeRoadmap(roadmap.id, roadmap.externalId)
        : await unlikeRoadmap(roadmap.id, roadmap.externalId);

      if (!response.success) {
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
        ? await bookmarkRoadmap(roadmap.id, roadmap.externalId)
        : await unbookmarkRoadmap(roadmap.id, roadmap.externalId);

      if (!response.success) {
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
