import { toast } from "sonner";
import { editUserProfileAction } from "@/actions/auth";
import { authClient } from "@/lib/auth-client";
import { UserProfileEditForm } from "../type";

type ProfileMutationOptions = {
  edit?: {
    onSuccess?: () => void;
  };
  remove?: {
    onSuccess?: () => void;
  };
};

export default function useProfileMutation(
  options: ProfileMutationOptions = {},
) {
  const edit = async (data: UserProfileEditForm) => {
    const response = await editUserProfileAction(data);

    if (response.success) {
      toast.success(response.message);
      options.edit?.onSuccess?.();
    } else {
      toast.error(response.message);
    }
  };

  const remove = async () => {
    await authClient.deleteUser();
  };

  return { edit, remove };
}
