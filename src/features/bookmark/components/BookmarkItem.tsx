import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/assets/img/placeholder.svg";
import { formatDate } from "@/lib/utils";
import { Bookmark } from "../type";

type BookmarkItemProps = {
  item: Bookmark;
};

export function BookmarkItem({ item }: BookmarkItemProps) {
  return (
    <Link
      href={`/roadmap/${item.roadmap?.externalId}`}
      className="border-muted hover:border-foreground/20 transition-border flex gap-4 rounded-sm border p-3"
    >
      <figure className="border-muted relative aspect-square w-[120px] overflow-hidden rounded-[4px] border">
        <Image
          src={item.roadmap?.thumbnail || PlaceholderImage}
          alt={item.roadmap?.title || "thumbnail"}
          fill
          className="object-cover"
        />
      </figure>
      <div className="flex-1 py-1">
        <header className="mb-1">
          <h3 className="text-md mb-1 line-clamp-1 font-medium">
            {item.roadmap?.title}
          </h3>
          <p className="line-clamp-2 text-sm opacity-70">
            {item.roadmap?.subTitle}
          </p>
        </header>
        <div>
          {item.createdAt && (
            <span className="text-[11px] opacity-50">
              {formatDate(item.createdAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
