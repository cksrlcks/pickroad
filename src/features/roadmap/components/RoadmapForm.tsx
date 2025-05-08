"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Vibrant } from "node-vibrant/browser";
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
import { DEFAULT_COLORS, FILE_LIMIT_SIZE, ROADMAP_THEMES } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { getColorByString } from "@/lib/color";
import { isUrl } from "@/lib/utils";
import {
  CreateRoadmapForm,
  EditRoadmapForm,
  Roadmap,
  RoadmapCategory,
  roadmapEditSchema,
  roadmapInsertSchema,
} from "../type";
import { RoadmapCard } from "./RoadmapCard";

type MetaData = {
  title: string;
  description: string;
  image: string;
};

type RoadmapFormProps = {
  initialData?: Roadmap;
  action: (data: EditRoadmapForm | CreateRoadmapForm) => Promise<{
    success: boolean;
    message: string | null;
  }>;
  categories: RoadmapCategory[];
};

export default function RoadmapForm({
  initialData,
  action,
  categories,
}: RoadmapFormProps) {
  const router = useRouter();
  const isEditMode = initialData !== undefined;

  const [preview, setPreview] = useState(initialData?.thumbnail ?? "");
  const [isMetaFetching, setIsMetaFetching] = useState(false);
  const { data: session } = authClient.useSession();

  const form = useForm<EditRoadmapForm | CreateRoadmapForm>({
    resolver: zodResolver(isEditMode ? roadmapEditSchema : roadmapInsertSchema),
    mode: "all",
    defaultValues: isEditMode
      ? {
          ...initialData,
          categoryId: initialData.category?.id,
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

  const handleSubmit = form.handleSubmit(async (data) => {
    const response = await action(data);
    if (response.success) {
      toast.success(response.message);
      router.replace("/");
    } else {
      toast.error(response.message);
    }
  });

  const getImageData = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const displayUrl = URL.createObjectURL(e.target.files![0]);
    const palette = await Vibrant.from(displayUrl).getPalette();

    const vibrant_palette = [
      palette.Vibrant?.hex || "#000",
      palette.Vibrant?.bodyTextColor || "#fff",
      palette.DarkVibrant?.hex || "#000",
      palette.DarkVibrant?.bodyTextColor || "#fff",
      palette.LightVibrant?.hex || "#fff",
      palette.LightVibrant?.bodyTextColor || "#000",
    ];

    const muted_palette = [
      palette.Muted?.hex || "#000",
      palette.Muted?.bodyTextColor || "#fff",
      palette.DarkMuted?.hex || "#000",
      palette.DarkMuted?.bodyTextColor || "#fff",
      palette.LightMuted?.hex || "#fff",
      palette.LightMuted?.bodyTextColor || "#000",
    ];

    return {
      file,
      displayUrl,
      palette: {
        vibrant_palette,
        muted_palette,
      },
    };
  };

  const previewData = form.watch();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const getUrlData = async (url: string): Promise<MetaData | undefined> => {
    if (!isUrl(url)) return undefined;
    const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data;
  };

  return (
    <div className="p-4">
      <div className="flex gap-10">
        <div className="w-full max-w-[275px]">
          <figure className="relative aspect-[265/350]" style={{}}>
            <RoadmapCard
              roadmap={{
                ...previewData,
                id: 0,
                externalId: "sample_id",
                createdAt: new Date().toISOString(),
                updatedAt: null,
                theme: previewData.theme || null,
                themeVibrantPalette: previewData.themeVibrantPalette || null,
                themeMutedPalette: previewData.themeMutedPalette || null,
                isLiked: false,
                title: previewData.title || "타이틀",
                subTitle: previewData.subTitle || "서브타이틀",
                description: previewData.description || null,
                thumbnail: preview,
                author: session?.user || null,
                category:
                  categories.find(
                    (item) => item.id === previewData.categoryId,
                  ) ?? null,
              }}
            />
          </figure>
        </div>
        <div className="w-full">
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
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>썸네일</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        placeholder="설명 입력"
                        {...rest}
                        onChange={async (e) => {
                          const { file, displayUrl, palette } =
                            await getImageData(e);

                          form.setValue("theme", "vibrant");
                          form.setValue(
                            "themeVibrantPalette",
                            palette.vibrant_palette.join("."),
                          );
                          form.setValue(
                            "themeMutedPalette",
                            palette.muted_palette.join("."),
                          );
                          setPreview(displayUrl);
                          onChange(file);
                        }}
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
                          {ROADMAP_THEMES.map((item) => (
                            <Label
                              key={item}
                              className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 bg-transparent px-4 py-3 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <RadioGroupItem
                                value={item}
                                className="sr-only"
                              />
                              {item}
                            </Label>
                          ))}
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
                      <Input
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" || e.nativeEvent.isComposing)
                            return;

                          e.stopPropagation();
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();

                          if (value) {
                            const newTags = new Set([
                              ...(field.value || []),
                              value,
                            ]);
                            e.currentTarget.value = "";
                            field.onChange(Array.from(newTags));
                          }
                        }}
                        placeholder="태그를 작성후 Enter를 눌러 추가"
                      />
                    </FormControl>
                    {field.value && (
                      <ul className="flex min-w-0 flex-wrap gap-1">
                        {field.value.map((item) => {
                          const colorCode = getColorByString(
                            item,
                            DEFAULT_COLORS,
                          );

                          return (
                            <li
                              key={item}
                              className="flex min-w-0 items-center gap-1 rounded-sm px-2 py-1 text-[13px] font-semibold"
                              style={{
                                color: colorCode,
                                backgroundColor: `${colorCode}30`,
                              }}
                            >
                              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                #{item}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTags = field.value?.filter(
                                    (tag) => tag !== item,
                                  );
                                  field.onChange(newTags);
                                }}
                              >
                                <X className="h-3 w-3" strokeWidth={3} />
                                <span className="sr-only">삭제</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </FormItem>
                )}
              />

              <Separator />

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded-xl border p-4">
                  {field.thumbnail && (
                    <figure className="relative mb-4 aspect-video overflow-hidden rounded-sm">
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={field.thumbnail}
                          alt="preview"
                          className="h-full w-full object-cover"
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
                </div>
              ))}

              <FormItem>
                <FormLabel>링크 추가</FormLabel>
                <FormControl>
                  <Input
                    onKeyDown={async (e) => {
                      if (e.key !== "Enter" || isMetaFetching) return;
                      e.preventDefault();

                      const url = e.currentTarget.value.trim();
                      e.currentTarget.value = "";

                      if (!url) return;

                      setIsMetaFetching(true);

                      const data = await getUrlData(url);

                      append({
                        url,
                        title: data?.title || "",
                        description: data?.description || "",
                        thumbnail: data?.image || "",
                      });
                      setIsMetaFetching(false);
                    }}
                    placeholder="링크를 붙여넣고 Enter를 눌러 추가"
                  />
                </FormControl>
              </FormItem>

              <Separator />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
