import { z } from "zod";

export type ServerActionResult<T = unknown> =
  | ServerActionSuccess<T>
  | ServerActionFailure;

export type ServerActionSuccess<T> = {
  success: true;
  message: string;
  payload?: T;
};

export type ServerActionFailure = {
  success: false;
  message: string;
};

export type MutationResult<TPayload = unknown, TInput = void> = {
  isPending: boolean;
  mutate: (input: TInput) => void | Promise<void>;
  state?: TPayload;
};

export type MutationOption<T = unknown> = {
  onSuccess?: (response: ServerActionSuccess<T>) => void;
  onError?: (response: ServerActionFailure) => void;
};

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

export type NavItem = {
  label: string;
  href: string;
};
