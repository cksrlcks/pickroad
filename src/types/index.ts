import { z } from "zod";

export type ServerActionResult<T = undefined> =
  | { success: true; message: string; payload?: T }
  | { success: false; message: string };

export type TargetType = "roadmap" | "comment";

export const FilterTypeSchema = z.enum(["roadmap", "comment", "like"]);
export type FilterType = z.infer<typeof FilterTypeSchema>;

export type Filters = {
  category?: number;
  page?: number;
  keyword?: string;
  type?: FilterType;
};

export const FilterSearchParamsSchema = z.object({
  category: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).optional(),
  keyword: z.string().optional(),
  type: FilterTypeSchema.optional(),
});

export type BaseParams = {
  page: number;
  limit: number;
  keyword: string;
};
