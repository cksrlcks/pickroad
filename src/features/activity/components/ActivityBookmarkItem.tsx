import { formatDate } from "@/lib/utils";
import { ActivityBookmark } from "../type";
import { ActivityItem } from "./ActivityItem";

type ActivityBookmarkItmeProps = {
  item: ActivityBookmark;
};

export default function ActivityBookmarkItem({
  item,
}: ActivityBookmarkItmeProps) {
  return (
    <ActivityItem href={`/roadmap/${item.roadmap?.externalId}`}>
      <ActivityItem.Thumbnail
        src={item.roadmap?.thumbnail || undefined}
        alt={item.roadmap?.title}
      />
      <ActivityItem.Body>
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
      </ActivityItem.Body>
    </ActivityItem>
  );
}
