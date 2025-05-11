import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./users";

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    targetType: text("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.targetType, table.targetId] }), //중복 제한을 위해 복합 primary key 지정
    index("favorites_target_idx").on(table.targetType, table.targetId),
  ],
);
