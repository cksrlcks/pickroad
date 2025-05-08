"use client";

import Image from "next/image";
import PlaceholderImage from "@/assets/img/placeholder.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateToAgo } from "@/lib/utils";
import { RoadmapCompact } from "../type";

type RoadmapCardProps = {
  roadmap: RoadmapCompact;
};

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const paletteString =
    roadmap.theme === "vibrant"
      ? roadmap.themeVibrantPalette
      : roadmap.themeMutedPalette;
  const [, , darkColor, darkTextColor, lightColor, lightTextColor] =
    paletteString?.split(".") || [];

  const bgColor = darkColor || "#000";
  const textColor = darkTextColor || "#fff";
  const badgeBgColor = lightColor || "#fff";
  const badgeTextColor = lightTextColor || "#000";

  return (
    <div
      className="relative aspect-[265/380] w-full overflow-hidden rounded-[18px] p-[2px]"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: `0px 11px 13px ${bgColor}20`,
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-[16px]">
        <Image
          src={roadmap.thumbnail || PlaceholderImage}
          alt={roadmap.title}
          fill
          className="h-full w-full object-cover object-center opacity-0 transition-opacity"
          unoptimized={true}
          quality={100}
          onLoad={(e) => (e.currentTarget.style.opacity = "100")}
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
      <div className="relative z-1 -mt-[100%] flex h-full flex-col justify-end px-5 py-4 md:px-6 md:py-5">
        <div className="mb-2 -ml-[4px]">
          {roadmap.category && (
            <span
              className="inline-flex rounded-full px-[8px] py-[3px] text-[11px] font-semibold whitespace-nowrap"
              style={{
                backgroundColor: badgeBgColor,
                color: badgeTextColor,
              }}
            >
              {roadmap.category.name}
            </span>
          )}
        </div>
        <div className="mb-5">
          <div className="mb-2 line-clamp-2 text-xl leading-tight font-semibold break-all text-shadow-md">
            {roadmap.title}
          </div>
          <div className="line-clamp-2 text-sm break-all opacity-70">
            {roadmap.subTitle}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-1/2 min-w-0 items-center gap-1.5">
            {roadmap.author && (
              <>
                <Avatar className="h-4 w-4">
                  <AvatarImage src={roadmap.author.image || undefined} />
                  <AvatarFallback className="text-foreground text-[10px] font-semibold">
                    {roadmap.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                  {roadmap.author.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs tracking-tight opacity-70">
            <i
              className="inline-block h-1 w-1 rounded-full"
              style={{ background: badgeBgColor }}
            ></i>
            {roadmap.createdAt && dateToAgo(roadmap.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
