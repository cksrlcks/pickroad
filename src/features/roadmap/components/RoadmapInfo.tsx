import { Pen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Roadmap } from "../type";

type RoadmapInfoProps = {
  roadmap: Roadmap;
};

export default function RoadmapInfo({ roadmap }: RoadmapInfoProps) {
  return (
    <>
      <header className="mb-3">
        <h2 className="mb-2 text-2xl font-semibold">{roadmap.title}</h2>
        <p className="opacity-75">{roadmap.subTitle}</p>
      </header>
      <div className="mb-5 flex items-center gap-1 text-xs opacity-40">
        <Pen size={10} strokeWidth={2} />
        작성일 : {roadmap.createdAt ? formatDate(roadmap.createdAt) : "-"}
      </div>
      <div className="mb-6 whitespace-pre-wrap opacity-75">
        {roadmap.description}
      </div>
      <div className="mb-2 flex w-1/2 min-w-0 items-center gap-1.5"></div>
    </>
  );
}
