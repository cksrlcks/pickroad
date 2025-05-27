import PlaceholderImage from "@/assets/img/placeholder.svg";
import Author from "@/components/Author";
import RevealImage from "@/components/RevealImage";
import { getCurrentPalette } from "@/lib/color";
import { dateToAgo } from "@/lib/utils";
import { RoadmapCompact } from "../type";

type RoadmapCardProps = {
  roadmap: RoadmapCompact;
};

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const { bgColor, textColor, badgeBgColor, badgeTextColor } =
    getCurrentPalette(roadmap);

  return (
    <div
      className="w-full overflow-hidden rounded-[12px] p-[2px] md:rounded-[18px]"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: `0px 11px 13px ${bgColor}20`,
      }}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 aspect-square w-full overflow-hidden rounded-t-[10px] md:rounded-t-[16px]">
          <RevealImage
            src={roadmap.thumbnail || PlaceholderImage}
            alt={roadmap.title}
            fill
            className="h-full w-full object-cover object-center"
            quality={100}
          />
          <div
            className="absolute bottom-0 left-0 z-1 h-[60%] w-full"
            style={{
              background: `linear-gradient(
            180deg,
            ${bgColor}00 0%,
            ${bgColor}FF 100%
          )`,
            }}
          />
        </div>
        <div className="relative z-1 flex aspect-[265/380] flex-col justify-end p-3.5 md:p-6">
          <div className="mb-2 -ml-[4px]">
            {roadmap.category && (
              <span
                className="inline-flex origin-bottom-left scale-[0.85] rounded-full px-[8px] py-[3px] text-[11px] font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: badgeBgColor,
                  color: badgeTextColor,
                }}
              >
                {roadmap.category.name}
              </span>
            )}
          </div>
          <div className="mb-3 md:mb-5">
            <div className="text-2lg mb-2 line-clamp-2 leading-tight font-semibold break-all text-shadow-md md:text-xl">
              {roadmap.title}
            </div>
            <div className="line-clamp-1 text-xs break-all opacity-70 md:line-clamp-2 md:text-sm">
              {roadmap.subTitle}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-1/2 min-w-0 items-center gap-1.5">
              {roadmap.author && <Author user={roadmap.author} />}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] tracking-tight opacity-70 md:text-xs">
              <i
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: badgeBgColor }}
              ></i>
              {roadmap.createdAt && dateToAgo(roadmap.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
