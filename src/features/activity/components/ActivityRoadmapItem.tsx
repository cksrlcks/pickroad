import { formatDate } from "@/lib/utils";
import { ActivityRoadmap } from "../type";
import { ActivityItem } from "./ActivityItem";

type ActivityRoadmapItemProps = {
  item: ActivityRoadmap;
};

export function ActivityRoadmapItem({ item }: ActivityRoadmapItemProps) {
  return (
    <ActivityItem href={`/roadmap/${item.externalId}`}>
      <ActivityItem.Thumbnail
        src={item.thumbnail || undefined}
        alt={item.title}
      />
      <ActivityItem.Body>
        <header className="mb-1">
          <h3 className="text-md mb-1 line-clamp-1 font-medium">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-sm opacity-70">{item.subTitle}</p>
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
