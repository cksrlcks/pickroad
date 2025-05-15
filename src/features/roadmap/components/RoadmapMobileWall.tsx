"use client";

import Image from "next/image";
import PlaceholderImage from "@/assets/img/placeholder.svg";
import { Roadmap } from "../type";

type RoadmapMobileWallProps = {
  roadmap: Roadmap;
};

export default function RoadmapMobileWall({ roadmap }: RoadmapMobileWallProps) {
  const paletteString =
    roadmap.theme === "vibrant"
      ? roadmap.themeVibrantPalette
      : roadmap.themeMutedPalette;
  const [, , darkColor] = paletteString?.split(".") || [];

  const bgColor = darkColor || "#000";

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="relative aspect-video overflow-hidden"
    >
      <Image
        src={roadmap.thumbnail || PlaceholderImage}
        alt={roadmap.title}
        fill
        className="h-full w-full object-cover object-center opacity-0 transition-opacity"
        unoptimized={true}
        quality={100}
        onLoad={(e) => (e.currentTarget.style.opacity = "100")}
      />
    </div>
  );
}
