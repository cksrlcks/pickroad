import { User } from "better-auth";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "@/db/schema";

export type Author = Pick<User, "id" | "email" | "name" | "image">;

export const userProfileSchema = createInsertSchema(user);
export type UserProfileForm = z.infer<typeof userProfileSchema>;
