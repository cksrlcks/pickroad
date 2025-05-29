import { useTransition } from "react";
import { MutationOption, MutationResult } from "@/types";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  reorderCategoriesAction,
} from "../server/action";
import { CategoryForm, ReorderCategoriesForm, RoadmapCategory } from "../type";

export const useCreateCategory = (
  options?: MutationOption,
): MutationResult<void, CategoryForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CategoryForm) => {
    startTransition(async () => {
      const response = await createCategoryAction(data);

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

export const useEditCategory = (
  options?: MutationOption,
): MutationResult<void, CategoryForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CategoryForm) => {
    startTransition(async () => {
      const response = await updateCategoryAction(data);

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

export const useDeleteCategory = (
  category: RoadmapCategory,
  options?: MutationOption,
): MutationResult => {
  const [isPending, startTransition] = useTransition();

  const mutate = async () => {
    startTransition(async () => {
      const response = await deleteCategoryAction(category.id);

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

export const useReorderCategories = (
  options?: MutationOption,
): MutationResult<void, ReorderCategoriesForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: ReorderCategoriesForm) => {
    startTransition(async () => {
      const response = await reorderCategoriesAction(data);

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
