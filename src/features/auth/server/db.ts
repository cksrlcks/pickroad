import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { UserProfileForm } from "../type";

export const updateUserProfile = async (data: UserProfileForm) => {
  return db.update(user).set(data).where(eq(user.id, data.id));
};
