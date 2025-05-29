import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { FILE_LIMIT_SIZE } from "@/constants";
import { likes, roadmapItems, roadmaps, tags } from "@/db/schema";
import { BaseParams } from "@/types";
import { Author } from "../auth/type";
import { RoadmapCategory } from "../category/type";

export const roadmapSchema = createSelectSchema(roadmaps);
export const tagSchema = createSelectSchema(tags);
export const roadmapItemSchema = createSelectSchema(roadmapItems);

export type RoadmapBase = z.infer<typeof roadmapSchema>;
export type RoadmapTag = z.infer<typeof tagSchema>;
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type RoadmapItemMetaData = {
  title: string;
  description: string;
  image: string;
};

export type Roadmap = RoadmapBase & {
  category: RoadmapCategory | null;
  author: Author | null;
  tags: RoadmapTag[] | null;
  items: RoadmapItem[] | null;
  isLiked?: boolean | null;
  isBookmarked?: boolean | null;
  likeCount: number;
};

export type RoadmapCompact = Omit<
  Roadmap,
  "items" | "tags" | "likeCount" | "isLiked" | "isBookmarked"
>;

export const roadmapBaseInsertSchema = createInsertSchema(roadmaps, {
  externalId: (schema) => schema.optional(),
  title: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" })
      .max(100, { message: "100글자 이하로 입력해주세요" }),
  subTitle: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" })
      .max(1000, { message: "1000글자 이하로 입력해주세요" }),
  description: () =>
    z
      .string()
      .trim()
      .max(5000, { message: "5000글자 이하로 입력해주세요" })
      .nullable(),
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

export const roadmapTagsInsertSchema = createInsertSchema(tags, {
  name: (schema) =>
    schema
      .trim()
      .min(2, { message: "두글자 이상 적어주세요" })
      .max(20, { message: "20글자 이하로 적어주세요" }),
});

export const roadmapItemsInsertSchema = createInsertSchema(roadmapItems, {
  title: () =>
    z
      .string({ required_error: "필수 입력입니다." })
      .trim()
      .min(2, { message: "2글자 이상 입력해주세요" })
      .max(100, { message: "100글자 이하로 입력해주세요" }),
  description: () =>
    z
      .string()
      .trim()
      .max(1000, { message: "1000글자 이하로 입력해주세요" })
      .nullable(),
});

export const roadmapInsertSchema = roadmapBaseInsertSchema.extend({
  tags: z.array(roadmapTagsInsertSchema.shape.name).optional(),
  items: z.array(roadmapItemsInsertSchema).optional(),
});

export type RoadmapForm = z.infer<typeof roadmapInsertSchema>;
export type RoadmapFormWithUploadedUrl = Omit<RoadmapForm, "thumbnail"> & {
  thumbnail: string | null;
};

export const LikeSchema = createSelectSchema(likes);
export type Like = z.infer<typeof LikeSchema>;

export type GetRoadmapsParams = Partial<BaseParams> & {
  categoryId?: RoadmapCategory["id"];
};
