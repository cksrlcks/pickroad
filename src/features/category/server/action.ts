"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  CategoryForm,
  categoryInsertSchema,
  ReorderCategoriesForm,
  reorderCategoriesFormSchema,
  RoadmapCategory,
} from "@/features/category/type";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";
import {
  createCategory,
  deleteCategory,
  reorderCategories,
  updateCategory,
} from "./service";

export const createCategoryAction = async (
  data: CategoryForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = categoryInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    await createCategory(parsed.data);

    revalidatePath("/admin");

    return {
      success: true,
      message: "카테고리가 생성되었습니다.",
    };
  } catch (error) {
    console.error("저장실패:", error);

    return {
      success: false,
      message: "카테고리 생성에 실패했습니다.",
    };
  }
};

export const deleteCategoryAction = async (
  id: RoadmapCategory["id"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  try {
    await deleteCategory(id);

    revalidatePath("/admin");

    return {
      success: true,
      message: "카테고리가 삭제되었습니다.",
    };
  } catch (error) {
    console.error("삭제실패:", error);

    return {
      success: false,
      message: "카테고리 삭제에 실패했습니다.",
    };
  }
};

export const updateCategoryAction = async (
  data: CategoryForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = categoryInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    await updateCategory(parsed.data);

    return {
      success: true,
      message: "카테고리가 수정되었습니다.",
    };
  } catch (error) {
    console.error("저장실패:", error);

    return {
      success: false,
      message: "카테고리 수정에 실패했습니다.",
    };
  }
};

export const reorderCategoriesAction = async (
  data: ReorderCategoriesForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = reorderCategoriesFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    await reorderCategories(parsed.data);

    revalidatePath("/admin/order");

    return {
      success: true,
      message: "카테고리 순서가 변경되었습니다.",
    };
  } catch (error) {
    console.error("저장실패:", error);

    return {
      success: false,
      message: "카테고리 순서 변경에 실패했습니다.",
    };
  }
};
