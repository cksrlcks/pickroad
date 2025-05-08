import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { FILE_LIMIT_SIZE } from "@/constants";
import { categories, roadmapItems, roadmaps, tags } from "@/db/schema";
import { Author } from "../auth/type";

export const roadmapSchema = createSelectSchema(roadmaps);
export const categorySchema = createSelectSchema(categories);
export const tagSchema = createSelectSchema(tags);
export const roadmapItemSchema = createSelectSchema(roadmapItems);

export type RoadmapBase = z.infer<typeof roadmapSchema>;
export type RoadmapCategory = z.infer<typeof categorySchema>;
export type RoadmapTag = z.infer<typeof tagSchema>;
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;

export type Roadmap = Omit<RoadmapBase, "categoryId" | "authorId"> & {
  category: RoadmapCategory | null;
  author: Author | null;
  tags: RoadmapTag[] | null;
  items: RoadmapItem[] | null;
  isLiked: boolean | null;
  likeCount: number;
};

export type RoadmapCompact = Omit<
  Roadmap,
  "items" | "tags" | "likeCount" | "isLiked"
>;

export const roadmapBaseInsertSchema = createInsertSchema(roadmaps, {
  externalId: (schema) => schema.optional(),
  title: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" }),
  subTitle: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" }),
  thumbnail: (schema) =>
    z
      .union([
        z
          .instanceof(File)
          .refine(
            (file) =>
              [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/svg+xml",
                "image/webp",
              ].includes(file.type),
            {
              message: "이미지는 jpeg, jpg, png, svg, webp 형식만 허용됩니다.",
            },
          )
          .refine((file) => file.size < FILE_LIMIT_SIZE * 1024 * 1024, {
            message: `${FILE_LIMIT_SIZE}MB이하인 이미지만 등록 가능합니다.`,
          }),
        schema,
      ])
      .optional(),
});
export const roadmapCategoriesInsertSchema = createInsertSchema(categories);
export const roadmapTagsInsertSchema = createInsertSchema(tags, {
  name: (schema) => schema.trim().min(2, { message: "두글자 이상 적어주세요" }),
});
export const roadmapItemsInsertSchema = createInsertSchema(roadmapItems);

export const roadmapInsertSchema = roadmapBaseInsertSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    tags: z.array(roadmapCategoriesInsertSchema.shape.name).optional(),
    items: z.array(roadmapItemsInsertSchema).optional(),
  });
export const roadmapEditSchema = roadmapInsertSchema;

export type CreateRoadmapForm = z.infer<typeof roadmapInsertSchema>;
export type EditRoadmapForm = z.infer<typeof roadmapEditSchema>;
