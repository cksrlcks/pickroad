import { formatDate } from "@/lib/utils";
import { ActivityLike } from "../type";
import { ActivityItem } from "./ActivityItem";

type ActivityLikeItemProps = {
  item: ActivityLike;
};

export function ActivityLikeItem({ item }: ActivityLikeItemProps) {
  return (
    <ActivityItem
      thumbnail={item.roadmap?.thumbnail}
      title={item.roadmap?.title}
      externalId={item.roadmap?.externalId || undefined}
    >
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
    </ActivityItem>
  );
}
