import { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DEFAULT_COLORS } from "@/constants";
import { getColorByString } from "@/lib/color";

type RoadmapTagInputProps = {
  tags: string[] | undefined;
  onChange: (tags: string[] | undefined) => void;
  placeholder?: string;
};

export default function RoadmapTagInput({
  tags,
  onChange,
  placeholder,
}: RoadmapTagInputProps) {
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;

    e.stopPropagation();
    e.preventDefault();

    const value = e.currentTarget.value.trim();
    if (value) {
      const newTags = new Set([...(tags || []), value]);
      e.currentTarget.value = "";
      onChange(Array.from(newTags));
    }
  };

  const handleTagRemove = (tag: string) => {
    const newTags = tags?.filter((item) => item !== tag) || [];
    onChange(newTags);
  };

  return (
    <>
      <Input onKeyDown={handleTagKeyDown} placeholder={placeholder} />
      {tags && (
        <ul className="flex min-w-0 flex-wrap gap-1">
          {tags.map((item) => {
            const colorCode = getColorByString(item, DEFAULT_COLORS);

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
                <button type="button" onClick={() => handleTagRemove(item)}>
                  <X className="h-3 w-3" strokeWidth={3} />
                  <span className="sr-only">삭제</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
