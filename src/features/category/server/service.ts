import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import {
  CategoryForm,
  ReorderCategoriesForm,
  RoadmapCategory,
} from "@/features/category/type";

export const getCategories = unstable_cache(
  async (): Promise<RoadmapCategory[]> => {
    return await db.query.categories.findMany({
      orderBy: (fields, { asc }) => asc(fields.order),
    });
  },
);

export const getCategoriesWithCount = async () => {
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      emoji: categories.emoji,
      order: categories.order,
      count: sql<number>`(select count(*) from roadmaps where categories.id = roadmaps.category_id)`,
    })
    .from(categories)
    .orderBy(asc(categories.order));
};

export const createCategory = (data: CategoryForm) => {
  return db.insert(categories).values({
    ...data,
    order: sql`(select coalesce(max("order"), 0) + 1 from ${categories})`,
  });
};

export const updateCategory = (data: CategoryForm) => {
  if (!data.id) {
    throw new Error("Category ID가 필요합니다.");
  }

  return db.update(categories).set(data).where(eq(categories.id, data.id));
};

export const deleteCategory = (id: RoadmapCategory["id"]) => {
  return db.delete(categories).where(eq(categories.id, id));
};

export const reorderCategories = (data: ReorderCategoriesForm) => {
  return db.transaction(async (tx) => {
    for (const [index, category] of data.categories.entries()) {
      await tx
        .update(categories)
        .set({ order: index })
        .where(eq(categories.id, category.id!));
    }
  });
};
