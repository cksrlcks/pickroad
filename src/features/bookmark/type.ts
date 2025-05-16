import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { bookmarks } from "@/db/schema/bookmarks";
import { RoadmapCompact } from "../roadmap/type";

export const bookmarkSchema = createSelectSchema(bookmarks);
export type Bookmark = z.infer<typeof bookmarkSchema>;

export type ActivityBookmark = Bookmark & {
  roadmap: Partial<RoadmapCompact> | null;
};
