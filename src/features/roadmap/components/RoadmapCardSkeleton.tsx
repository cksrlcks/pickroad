import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapCardSkeleton() {
  return (
    <div className="bg-muted/30 flex aspect-[265/380] w-full flex-col justify-end rounded-[14px] p-4 md:rounded-[18px]">
      <div className="mb-6 space-y-2">
        <Skeleton className="flex h-3 w-full" />
        <Skeleton className="flex h-3 w-full" />
      </div>
      <div className="mb-10 space-y-2">
        <Skeleton className="flex h-3 w-[80%]" />
        <Skeleton className="flex h-3 w-[40%]" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="flex h-3 w-[30%]" />
        <Skeleton className="flex h-3 w-[20%]" />
      </div>
    </div>
  );
}
