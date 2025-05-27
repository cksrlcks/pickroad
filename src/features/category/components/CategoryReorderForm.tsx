"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DraggableItem from "@/features/roadmap/components/DraggableItem";
import { cn } from "@/lib/utils";
import { useReorderCategories } from "../hooks/useCategoryMutation";
import {
  ReorderCategoriesForm,
  reorderCategoriesFormSchema,
  RoadmapCategoryWithCount,
} from "../type";

type CategoryFormProps = {
  categories: RoadmapCategoryWithCount[];
};

export default function CategoryReorderForm({ categories }: CategoryFormProps) {
  const router = useRouter();
  const form = useForm<ReorderCategoriesForm>({
    resolver: zodResolver(reorderCategoriesFormSchema),
    defaultValues: {
      categories,
    },
  });

  const { fields, move } = useFieldArray({
    name: "categories",
    control: form.control,
  });

  const { mutate: edit } = useReorderCategories({
    onSuccess: (response) => {
      router.refresh();
      toast.success(response.message);
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await edit(data);
  });

  const handleDragDrop = async (e: DragEndEvent) => {
    if (e.active.id === e.over?.id) return;

    const startLinkIndex = fields.findIndex((item) => item.id === e.active.id);
    const dropLinkIndex = fields.findIndex((item) => item.id === e.over?.id);

    move(startLinkIndex, dropLinkIndex);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-start gap-6">
          <DndContext
            id="categories"
            collisionDetection={closestCenter}
            onDragEnd={handleDragDrop}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 space-y-2">
                {fields.map((field) => (
                  <DraggableItem key={field.id} id={field.id}>
                    {({ listeners, isDragging }) => (
                      <div
                        className={cn(
                          "bg-background border-foreground/10 flex items-center gap-4 rounded-xl border p-2",
                          isDragging && "opacity-40",
                        )}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-8"
                          {...listeners}
                        >
                          <GripVertical size={16} />
                          <span className="sr-only">드래그 이동</span>
                        </Button>
                        <div>{field.emoji}</div>
                        <div className="text-sm font-medium">{field.name}</div>
                      </div>
                    )}
                  </DraggableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="flex justify-end gap-1">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            저장하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
