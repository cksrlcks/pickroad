import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "@/db/schema";

export type RoadmapCategory = z.infer<typeof categorySchema>;
export type RoadmapCategoryWithCount = RoadmapCategory & {
  count?: number;
};

export const categorySchema = createSelectSchema(categories);

export const categoryInsertSchema = createInsertSchema(categories, {
  name: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" })
      .max(10, { message: "10글자 이하로 입력해주세요" }),
});

export type CategoryForm = z.infer<typeof categoryInsertSchema>;

export const reorderCategoriesFormSchema = z.object({
  categories: z.array(categoryInsertSchema),
});

export type ReorderCategoriesForm = z.infer<typeof reorderCategoriesFormSchema>;
