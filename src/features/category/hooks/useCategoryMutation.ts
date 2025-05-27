import { useTransition } from "react";
import {
  createCategory,
  deleteCategory,
  editCategory,
  reorderCategories,
} from "@/actions/category";
import { MutationOption, MutationResult } from "@/types";
import { CategoryForm, ReorderCategoriesForm, RoadmapCategory } from "../type";

export const useCreateCategory = (
  options?: MutationOption,
): MutationResult<void, CategoryForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: CategoryForm) => {
    startTransition(async () => {
      const response = await createCategory(data);

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
      const response = await editCategory(data);

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
      const response = await deleteCategory(category.id);

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
      const response = await reorderCategories(data);

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
