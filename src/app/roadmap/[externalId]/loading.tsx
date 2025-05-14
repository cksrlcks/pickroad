import Spinner from "@/components/Spinner";
import RoadmapCardSkeleton from "@/features/roadmap/components/RoadmapCardSkeleton";

export default function loading() {
  return (
    <div className="flex min-h-dvh flex-col justify-between gap-14 md:flex-row">
      <div className="dark:bg-muted/30 -mx-6 -mt-8 bg-slate-100 py-6 md:mx-0 md:mt-0 md:w-full md:max-w-[320px] md:bg-transparent md:py-0 dark:md:bg-transparent">
        <div className="mx-auto max-w-[300px] md:sticky md:top-40 md:max-w-none">
          <RoadmapCardSkeleton />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      </div>
    </div>
  );
}
