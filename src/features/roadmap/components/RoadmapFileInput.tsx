import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { FolderUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImagePalette } from "@/lib/color";
import { RoadmapForm } from "../type";

type RoadmapFileInputProps = {
  onChange: (file: File) => void;
  setPreview: (url: string) => void;
};

export default function RoadmapFileInput({
  onChange,
  setPreview,
}: RoadmapFileInputProps) {
  const form = useFormContext<RoadmapForm>();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const displayUrl = URL.createObjectURL(file);
    const palette = await getImagePalette(displayUrl);

    form.setValue("theme", "vibrant");
    form.setValue("themeVibrantPalette", palette.vibrant_palette.join("."));
    form.setValue("themeMutedPalette", palette.muted_palette.join("."));

    setPreview(displayUrl);
    onChange(file);
  };

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <label className="relative flex aspect-square h-full cursor-pointer items-center justify-center">
          <FolderUp size={12} strokeWidth={2} />
          <span className="sr-only">업로드</span>
          <Input
            type="file"
            className="sr-only"
            accept="image/*"
            placeholder="설명 입력"
            onChange={handleFileChange}
          />
        </label>
      </Button>
    </div>
  );
}
