"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ServerActionResult } from "@/types";
import { UserProfileForm } from "../type";
import { updateUserProfile } from "./db";

export const updateUserProfileAction = async (
  data: UserProfileForm,
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
    const userId = session.user.id;

    await updateUserProfile({ ...data, id: userId });

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
