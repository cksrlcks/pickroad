import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { RoadmapCategory } from "@/features/roadmap/type";

export const getCategories = unstable_cache(
  async (): Promise<RoadmapCategory[]> => {
    return await db.query.categories.findMany({
      orderBy: (fields, { asc }) => asc(fields.order),
    });
  },
);
