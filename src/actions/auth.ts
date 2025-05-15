"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { UserProfileEditForm } from "@/features/auth/type";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";

export const editUserProfileAction = async (
  data: UserProfileEditForm,
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  try {
    const authorId = session.user.id;

    await db
      .update(user)
      .set({
        ...data,
      })
      .where(eq(user.id, authorId));

    revalidatePath("/my");

    return {
      success: true,
      message: "프로필이 수정되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};
