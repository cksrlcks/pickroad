import { User } from "better-auth";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "@/db/schema";

export type Author = Pick<User, "id" | "email" | "name" | "image">;

export const userProfileEditSchema = createInsertSchema(user).pick({
  name: true,
});
export type UserProfileEditForm = z.infer<typeof userProfileEditSchema>;
