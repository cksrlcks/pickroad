"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FILE_LIMIT_SIZE, ROADMAP_THEMES } from "@/constants";
import useConfirmNavigation from "@/hooks/useConfirmNavigation";
import { authClient } from "@/lib/auth-client";
import { useCreateRoadmap, useEditRoadmap } from "../hooks/useRoadmapMutation";
import {
  Roadmap,
  RoadmapCategory,
  RoadmapCompact,
  RoadmapForm as RoadmapFormType,
  roadmapInsertSchema,
} from "../type";
import { RoadmapCard } from "./RoadmapCard";
import RoadmapFileInput from "./RoadmapFileInput";
import RoadmapFormLinks from "./RoadmapFormLinks";
import RoadmapTagInput from "./RoadmapTagInput";

type RoadmapFormProps = {
  initialData?: Roadmap;
  categories: RoadmapCategory[];
};

const createPreviewData = (
  formData: RoadmapFormType,
  rest: Pick<RoadmapCompact, "thumbnail" | "author" | "category">,
) => {
  return {
    ...formData,
    id: 0,
    externalId: "sample_id",
    createdAt: new Date().toISOString(),
    updatedAt: null,
    theme: formData.theme || null,
    themeVibrantPalette: formData.themeVibrantPalette || null,
    themeMutedPalette: formData.themeMutedPalette || null,
    title: formData.title || "타이틀",
    subTitle: formData.subTitle || "서브타이틀",
    description: formData.description || null,
    ...rest,
  } as RoadmapCompact;
};

export default function RoadmapForm({
  initialData,
  categories,
}: RoadmapFormProps) {
  const router = useRouter();
  const isEditMode = initialData !== undefined;

  const [preview, setPreview] = useState(initialData?.thumbnail || "");
  const { data: session } = authClient.useSession();

  const form = useForm<RoadmapFormType>({
    resolver: zodResolver(roadmapInsertSchema),
    mode: "all",
    defaultValues: isEditMode
      ? {
          ...initialData,
          tags: initialData.tags?.map((item) => item.name),
          items: initialData.items?.map((item) => ({
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
          })),
        }
      : {},
  });

  useConfirmNavigation(form.formState.isDirty);

  const isDisabledSubmit =
    !form.formState.isValid || form.formState.isSubmitting;

  const formData = form.watch();
  const previewData = createPreviewData(formData, {
    thumbnail: preview,
    author: session?.user || null,
    category:
      categories.find((item) => item.id === formData.categoryId) || null,
  });

  const { mutate: create } = useCreateRoadmap({
    onSuccess: (result) => {
      toast.success(result.message);
      if (result.payload?.externalId) {
        router.replace(`/roadmap/${result.payload.externalId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: edit } = useEditRoadmap({
    onSuccess: (result) => {
      toast.success(result.message);
      if (result.payload?.externalId) {
        router.replace(`/roadmap/${result.payload.externalId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const action = isEditMode ? edit : create;

  const handleSubmit = form.handleSubmit(async (data) => {
    await action(data);
  });

  return (
    <div className="flex flex-col justify-between gap-14 md:flex-row">
      <div className="mx-auto w-full max-w-[320px]">
        <figure className="relative aspect-[265/350]">
          <RoadmapCard roadmap={previewData} />
        </figure>
      </div>
      <div className="flex-1">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>카테고리를 선택해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>타이틀</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="타이틀 입력"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>제목을 입력해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서브타이틀</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="서브타이틀 입력"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>부제목을 입력해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="설명 입력"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>설명을 입력해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>썸네일</FormLabel>
                  <FormControl>
                    <RoadmapFileInput
                      onChange={onChange}
                      setPreview={setPreview}
                    />
                  </FormControl>
                  <FormDescription>
                    {FILE_LIMIT_SIZE}MB 이하로 업로드 가능합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewData.thumbnail && (
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>색상 팔레트</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value || "vibrant"}
                        onValueChange={(value) => field.onChange(value)}
                        className="flex gap-1"
                      >
                        {ROADMAP_THEMES.map((item) => {
                          const paletteString =
                            item === "vibrant"
                              ? previewData.themeVibrantPalette
                              : previewData.themeMutedPalette;
                          const [, , darkColor, , lightColor] =
                            paletteString?.split(".") || [];
                          const bgColor = darkColor || "#000";
                          const badgeBgColor = lightColor || "#fff";

                          return (
                            <Label
                              key={item}
                              className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-transparent px-4 py-4 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <RadioGroupItem
                                value={item}
                                className="sr-only"
                              />
                              <div className="flex gap-[1px]">
                                <span
                                  className="h-3 w-3"
                                  style={{ background: bgColor }}
                                ></span>
                                <span
                                  className="h-3 w-3"
                                  style={{ background: badgeBgColor }}
                                ></span>
                              </div>
                              <span className="sr-only">{item}</span>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>태그</FormLabel>
                  <FormControl>
                    <RoadmapTagInput
                      tags={field.value}
                      onChange={field.onChange}
                      placeholder="태그를 작성후 Enter를 눌러 추가"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <RoadmapFormLinks />

            <Separator />

            <Button type="submit" disabled={isDisabledSubmit}>
              {isEditMode ? "수정" : "작성"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
