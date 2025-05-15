import { Pen } from "lucide-react";
import Author from "@/components/Author";
import { Separator } from "@/components/ui/separator";
import { dateToAgo, formatDate } from "@/lib/utils";
import { Roadmap } from "../type";

type RoadmapInfoProps = {
  roadmap: Roadmap;
};

export default function RoadmapInfo({ roadmap }: RoadmapInfoProps) {
  return (
    <>
      <header className="mb-7 md:mb-3">
        <h2 className="mb-2 text-xl font-semibold md:text-2xl">
          {roadmap.title}
        </h2>
        <p className="text-sm opacity-75 md:text-base">{roadmap.subTitle}</p>
      </header>

      {/* pc */}
      <div className="mb-5 hidden items-center gap-1 text-xs opacity-40 md:flex">
        <Pen size={10} strokeWidth={2} />
        작성일 : {roadmap.createdAt ? formatDate(roadmap.createdAt) : "-"}
      </div>

      {/* mobile */}
      <div className="flex items-center justify-between pb-4 md:hidden">
        {roadmap.author && <Author user={roadmap.author} />}
        <div className="text-xs tracking-tight opacity-60">
          {roadmap.createdAt && dateToAgo(roadmap.createdAt)}
        </div>
      </div>

      <Separator className="bg-muted mb-5 md:mb-7" />

      <div className="mb-6 text-sm whitespace-pre-wrap opacity-75 md:text-base">
        {roadmap.description}
      </div>
      <div className="mb-2 flex w-1/2 min-w-0 items-center gap-1.5"></div>
    </>
  );
}
