import Link from "next/link";
import { DEFAULT_COLORS } from "@/constants";
import { getColorByString } from "@/lib/color";
import { Roadmap } from "../type";

export const BACKGROUND_ALPHA = 30;

type RoadmapTagsProps = {
  roadmap: Roadmap;
};

export default function RoadmapTags({ roadmap }: RoadmapTagsProps) {
  if (!roadmap.tags || roadmap.tags.length === 0) {
    return null;
  }

  return (
    <ul className="mb-6 flex min-w-0 flex-wrap gap-1">
      {roadmap.tags?.map((item) => {
        const colorCode = getColorByString(item.name, DEFAULT_COLORS);

        return (
          <li
            key={item.id}
            className="flex min-w-0 items-center gap-1 rounded-sm px-2 py-1 text-[13px] font-semibold"
            style={{
              color: colorCode,
              backgroundColor: `${colorCode}${BACKGROUND_ALPHA}`,
            }}
          >
            <Link
              href={`/?keyword=${item.name}`}
              className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              #{item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
