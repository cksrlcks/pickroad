import { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/assets/img/placeholder.svg";
import { RoadmapCompact } from "@/features/roadmap/type";

type ActivityItemProps = PropsWithChildren<
  Partial<Pick<RoadmapCompact, "thumbnail" | "title" | "externalId">>
>;

export function ActivityItem({
  thumbnail,
  title,
  externalId,
  children,
}: ActivityItemProps) {
  return (
    <Link
      href={externalId ? `/roadmap/${externalId}` : "#"}
      className="border-muted hover:border-foreground/20 transition-border flex gap-4 rounded-sm border p-3"
    >
      <figure className="border-muted relative aspect-square w-[120px] overflow-hidden rounded-[4px] border">
        <Image
          src={thumbnail || PlaceholderImage}
          alt={title || "thumbnail"}
          fill
          className="object-cover"
        />
      </figure>
      <div className="flex-1 py-1">{children}</div>
    </Link>
  );
}
