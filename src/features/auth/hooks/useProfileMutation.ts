import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { MutationOption, MutationResult } from "@/types";
import { updateUserProfileAction } from "../server/action";
import { UserProfileForm } from "../type";

export const useEditProfile = (
  options: MutationOption,
): MutationResult<void, UserProfileForm> => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: UserProfileForm) => {
    startTransition(async () => {
      const response = await updateUserProfileAction(data);

      if (response.success) {
        options.onSuccess?.(response);
      } else {
        options.onError?.(response);
      }
    });
  };

  return { isPending, mutate };
};

export const useDeleteProfile = (options: MutationOption) => {
  const [isPending, startTransition] = useTransition();

  const mutate = async () => {
    startTransition(async () => {
      try {
        await authClient.deleteUser();

        options.onSuccess?.({
          success: true,
          message: "회원탈퇴 성공",
        });
      } catch {
        options.onError?.({
          success: false,
          message: "회원탈퇴 실패",
        });
      }
    });
  };

  return {
    isPending,
    mutate,
  };
};
