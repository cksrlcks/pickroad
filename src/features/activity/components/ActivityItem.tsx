import { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/assets/img/placeholder.svg";

type ActivityItemProps = PropsWithChildren<{
  href: string;
}>;

export function ActivityItem({ children, href }: ActivityItemProps) {
  return (
    <Link
      href={href}
      className="border-muted hover:border-foreground/20 transition-border flex gap-4 rounded-sm border p-3"
    >
      {children}
    </Link>
  );
}

type ActivityItemThumbnailProps = {
  src?: string;
  alt?: string;
};

export function ActivityItemThumbnail({
  src,
  alt,
}: ActivityItemThumbnailProps) {
  return (
    <figure className="border-muted relative aspect-square w-[120px] overflow-hidden rounded-[4px] border">
      <Image
        src={src || PlaceholderImage}
        alt={alt || "thumbnail"}
        fill
        className="object-cover"
      />
    </figure>
  );
}

export function ActivityItemBody({ children }: PropsWithChildren) {
  return <div className="flex-1 py-1">{children}</div>;
}

ActivityItem.Thumbnail = ActivityItemThumbnail;
ActivityItem.Body = ActivityItemBody;
