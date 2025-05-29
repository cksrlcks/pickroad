import { User } from "better-auth";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { bookmarks } from "@/db/schema/bookmarks";
import { BaseParams } from "@/types";
import { RoadmapCompact } from "../roadmap/type";

export const bookmarkSchema = createSelectSchema(bookmarks);
export type Bookmark = z.infer<typeof bookmarkSchema> & {
  roadmap: Partial<RoadmapCompact> | null;
};

export type BookmarkParams = Partial<BaseParams> & {
  authorId: User["id"];
};
