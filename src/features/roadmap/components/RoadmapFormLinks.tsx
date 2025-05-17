import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KeyboardEvent, useTransition } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { getOgData } from "@/actions/roadmap";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, isValidUrl } from "@/lib/utils";
import { RoadmapForm } from "../type";
import DraggableItem from "./DraggableItem";

export default function RoadmapFormLinks() {
  const form = useFormContext<RoadmapForm>();
  const [isPending, startTransition] = useTransition();

  const { fields, append, remove, swap, move } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragDrop = async (e: DragEndEvent) => {
    if (e.active.id === e.over?.id) return;

    const startLinkIndex = fields.findIndex((item) => item.id === e.active.id);
    const dropLinkIndex = fields.findIndex((item) => item.id === e.over?.id);

    swap(startLinkIndex, dropLinkIndex);
  };

  const handleAddItem = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || isPending) return;
    e.preventDefault();

    const url = e.currentTarget.value.trim();

    if (!isValidUrl(url)) {
      toast.error("정확한 url을 입력해주세요");
      return;
    }

    e.currentTarget.value = "";

    startTransition(async () => {
      if (!isValidUrl(url)) {
        toast.error("정확한 url을 입력해주세요");
        return undefined;
      }

      const response = await getOgData(url);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const data = response.payload;

      append({
        url,
        title: data?.title || "",
        description: data?.description || "",
        thumbnail: data?.image || "",
      });
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    move(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === fields.length - 1) return;
    move(index, index + 1);
  };

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          <DndContext
            id="roadmap-links"
            collisionDetection={closestCenter}
            onDragEnd={handleDragDrop}
            sensors={sensors}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <DraggableItem key={field.id} id={field.id}>
                  {({ listeners, isDragging }) => (
                    <motion.div
                      className={cn(
                        "bg-background space-y-4 rounded-xl border p-4",
                        isDragging && "opacity-10",
                      )}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <div className="flex items-center justify-between">
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
                        <div className="flex items-center gap-0.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-8"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp size={14} />
                            <span className="sr-only">위로 이동</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-8"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === fields.length - 1}
                          >
                            <ArrowDown size={14} />
                            <span className="sr-only">아래로 이동</span>
                          </Button>
                        </div>
                      </div>

                      {field.thumbnail && (
                        <figure className="relative mb-4 aspect-video overflow-hidden rounded-sm">
                          {
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={field.thumbnail}
                              alt="preview"
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          }
                        </figure>
                      )}

                      <FormField
                        control={form.control}
                        name={`items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>제목</FormLabel>
                            <FormControl>
                              <Input placeholder="항목 제목" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>설명</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="항목 설명 (선택)"
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
                        name={`items.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="url" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        삭제
                      </Button>
                    </motion.div>
                  )}
                </DraggableItem>
              ))}
            </SortableContext>

            {isPending && (
              <div className="flex justify-center rounded-xl border px-4 py-6">
                <Spinner />
              </div>
            )}
          </DndContext>
        </AnimatePresence>
      </div>

      <FormItem>
        <FormLabel>링크 추가</FormLabel>
        <FormControl>
          <Input
            onKeyDown={handleAddItem}
            placeholder="링크를 붙여넣고 Enter를 눌러 추가"
            disabled={isPending}
          />
        </FormControl>
      </FormItem>
    </>
  );
}
