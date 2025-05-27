import { unstable_cache } from "next/cache";
import { asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { RoadmapCategory } from "@/features/category/type";

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
