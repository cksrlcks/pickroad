import Image from "next/image";
import { getCurrentPalette } from "@/lib/color";
import { RoadmapCompact } from "../type";
import { RoadmapCard } from "./RoadmapCard";

type RoadmapDisplayProps = {
  roadmap: RoadmapCompact;
};

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const { bgColor } = getCurrentPalette(roadmap);

  return (
    <div className="relative">
      <div
        className="absolute top-0 left-0 h-full w-full md:hidden"
        style={{ backgroundColor: bgColor }}
      >
        {roadmap.thumbnail && (
          <Image
            src={roadmap.thumbnail}
            alt={roadmap.title}
            fill
            className="object-cover opacity-50"
          />
        )}
      </div>
      <div className="relative z-1 bg-white/5 p-12 backdrop-blur-xl md:bg-transparent md:p-0 md:blur-none">
        <div className="mx-auto w-[60vw] md:w-full">
          <RoadmapCard roadmap={roadmap} />
        </div>
      </div>
    </div>
  );
}
