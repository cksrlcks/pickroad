import { useTransition } from "react";
import { MutationOption, MutationResult } from "@/types";
import { updateUserProfileAction } from "../server/action";
import { UserProfileForm } from "../type";

export const useProfileEdit = (
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
