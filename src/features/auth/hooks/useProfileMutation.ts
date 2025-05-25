import { useTransition } from "react";
import { editUserProfileAction } from "@/actions/auth";
import { MutationOption } from "@/types";
import { UserProfileEditForm } from "../type";

export const useProfileEdit = (options: MutationOption) => {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: UserProfileEditForm) => {
    startTransition(async () => {
      const response = await editUserProfileAction(data);

      if (response.success) {
        options.onSuccess?.(response);
      } else {
        options.onError?.(response);
      }
    });
  };

  return { isPending, mutate };
};
