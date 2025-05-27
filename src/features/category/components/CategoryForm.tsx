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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MutationOption } from "@/types";
import {
  useCreateCategory,
  useEditCategory,
} from "../hooks/useCategoryMutation";
import {
  CategoryForm as CategoryFormType,
  categoryInsertSchema,
  RoadmapCategory,
} from "../type";
import CategoryDeleteButton from "./CategoryDeleteButton";

type CategoryFormProps = {
  initialData?: RoadmapCategory;
  onComplete?: () => void;
};

export default function CategoryForm({
  initialData,
  onComplete,
}: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = initialData !== undefined;

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryInsertSchema),
    defaultValues: initialData,
  });

  const mutateOptions: MutationOption = {
    onSuccess: (response) => {
      form.reset();
      router.refresh();
      toast.success(response.message);
      onComplete?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  };

  const { mutate: create } = useCreateCategory(mutateOptions);
  const { mutate: edit } = useEditCategory(mutateOptions);

  const action = isEditMode ? edit : create;

  const handleSubmit = form.handleSubmit(async (data) => {
    await action(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="카테고리 이름"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이모지</FormLabel>
              <FormControl>
                <Input
                  placeholder="카테고리 이모지"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-1">
          {isEditMode && <CategoryDeleteButton category={initialData} />}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            저장
          </Button>
        </div>
      </form>
    </Form>
  );
}
