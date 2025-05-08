import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ROADMAP_THEMES } from "@/constants";
import { user } from "./users";

export const themeEnum = pgEnum("theme", ROADMAP_THEMES);

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  title: text("title").notNull(),
  subTitle: text("sub_title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  authorId: text("author_id").references(() => user.id, {
    onDelete: "set null",
  }),
  thumbnail: text("thumbnail"),
  theme: themeEnum().default("vibrant"),
  themeVibrantPalette: text("theme_vibrant_color"),
  themeMutedPalette: text("theme_muted_color"),
});

export const roadmapItems = pgTable("roadmap_items", {
  id: serial("id").primaryKey(),
  roadmapId: integer("roadmap_id").references(() => roadmaps.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  order: integer("order").notNull().default(0),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const roadmapTags = pgTable(
  "roadmap_tags",
  {
    roadmapId: integer("roadmap_id").references(() => roadmaps.id, {
      onDelete: "cascade",
    }),
    tagId: integer("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roadmapId, table.tagId] })],
);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const roadmapRelations = relations(roadmaps, ({ one, many }) => ({
  items: many(roadmapItems),
  tags: many(roadmapTags),
  category: one(categories, {
    fields: [roadmaps.categoryId],
    references: [categories.id],
  }),
  author: one(user, {
    fields: [roadmaps.authorId],
    references: [user.id],
  }),
}));

export const roadmapItemRelations = relations(roadmapItems, ({ one }) => ({
  roadmap: one(roadmaps, {
    fields: [roadmapItems.roadmapId],
    references: [roadmaps.id],
  }),
}));

export const roadmapTagsRelations = relations(roadmapTags, ({ one }) => ({
  roadmap: one(roadmaps, {
    fields: [roadmapTags.roadmapId],
    references: [roadmaps.id],
  }),
  tag: one(tags, {
    fields: [roadmapTags.tagId],
    references: [tags.id],
  }),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  roadmaps: many(roadmapTags),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  roadmaps: many(roadmaps),
}));

export const userRelations = relations(user, ({ many }) => ({
  roadmaps: many(roadmaps),
}));
