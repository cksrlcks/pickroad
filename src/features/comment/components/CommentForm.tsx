"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { MutationOption } from "@/types";
import { useCreateComment, useEditComment } from "../hooks/useCommentMutation";
import {
  Comment,
  CommentForm as CommentFormType,
  commentInsertSchema,
} from "../type";

type CommentFormProps = {
  initialData?: Comment;
  targetType: string;
  targetId: number;
  onComplete?: () => void;
  onCancel?: () => void;
};

export default function CommentForm({
  initialData,
  targetId,
  targetType,
  onComplete,
  onCancel,
}: CommentFormProps) {
  const { data: session } = authClient.useSession();
  const isEditMode = initialData !== undefined;
  const router = useRouter();

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentInsertSchema),
    mode: "onSubmit",
    defaultValues: isEditMode
      ? initialData
      : {
          targetId,
          targetType,
        },
  });

  const mutateOptions: MutationOption = {
    onSuccess: () => {
      form.reset();
      router.refresh();
      onComplete?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  };

  const { mutate: create } = useCreateComment(mutateOptions);
  const { mutate: edit } = useEditComment(mutateOptions);

  const action = isEditMode ? edit : create;

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!session) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    await action(data);
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const isDisabledSubmit =
    !form.formState.isValid || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="리뷰를 작성해주세요"
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-1">
          <div className="mr-auto text-xs opacity-40"></div>
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isDisabledSubmit}>
            작성
          </Button>
        </div>
      </form>
    </Form>
  );
}
