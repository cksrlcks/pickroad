"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import {
  CategoryForm,
  categoryInsertSchema,
  ReorderCategoriesForm,
  reorderCategoriesFormSchema,
  RoadmapCategory,
} from "@/features/category/type";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";

export const createCategory = async (
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
    console.log(parsed.data);
    await db.insert(categories).values({
      name: parsed.data.name,
      emoji: parsed.data.emoji,
      order: sql`(select coalesce(max("order"), 0) + 1 from ${categories})`,
    });

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

export const deleteCategory = async (
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
    await db.delete(categories).where(eq(categories.id, id));

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

export const editCategory = async (
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
    await db
      .update(categories)
      .set({
        name: parsed.data.name,
        emoji: parsed.data.emoji,
      })
      .where(eq(categories.id, parsed.data.id!));

    revalidatePath("/admin");

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

export const reorderCategories = async (
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
    await db.transaction(async (tx) => {
      for (const [index, category] of parsed.data.categories.entries()) {
        await tx
          .update(categories)
          .set({ order: index })
          .where(eq(categories.id, category.id!));
      }
    });

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
