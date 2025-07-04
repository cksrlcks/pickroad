"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User } from "better-auth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDeleteProfile, useEditProfile } from "../hooks/useProfileMutation";
import { UserProfileForm, userProfileSchema } from "../type";

type ProfileProps = {
  user: Partial<User>;
};

export function Profile({ user }: ProfileProps) {
  const router = useRouter();
  const form = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: user,
  });

  const { mutate: editProfile, isPending: isEditPending } = useEditProfile({
    onSuccess: (response) => {
      router.refresh();
      toast.success(response.message);
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });

  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteProfile({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });

  const handleSubmit = form.handleSubmit(editProfile);

  const isDisabledSubmit = !form.formState.isValid || isEditPending;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline">
                회원탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  회원탈퇴를 하면 다시 복구가 불가능합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteUser}
                  disabled={isDeletePending}
                >
                  탈퇴
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isDisabledSubmit}>
            수정
          </Button>
        </div>
      </form>
    </Form>
  );
}
