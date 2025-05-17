import { Skeleton } from "@/components/ui/skeleton";

export function BookmarkItemSkeleton() {
  return (
    <div className="border-muted transition-border flex gap-4 rounded-sm border p-3">
      <figure className="border-muted relative aspect-square w-[120px] overflow-hidden rounded-[4px] border">
        <Skeleton className="h-full w-full" />
      </figure>
      <div className="flex-1 py-1">
        <div className="mb-1">
          <Skeleton className="mb-1 h-4 w-[80%]" />
          <Skeleton className="h-3 w-[60%]" />
        </div>
        <div>
          <Skeleton className="h-3 w-[40%]" />
        </div>
      </div>
    </div>
  );
}
