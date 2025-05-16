import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ActivityComment } from "../type";
import { ActivityItem } from "./ActivityItem";

type ActivityCommentItemProps = {
  item: ActivityComment;
};
export function ActivityCommentItem({ item }: ActivityCommentItemProps) {
  return (
    <ActivityItem
      thumbnail={item.roadmap?.thumbnail}
      title={item.roadmap?.title}
      externalId={item.roadmap?.externalId || undefined}
    >
      {item.roadmap?.title && (
        <h3 className="mb-1 line-clamp-1 flex items-center gap-1 text-xs font-medium opacity-40">
          <MessageSquare size={10} />
          {item.roadmap.title}
        </h3>
      )}

      <p className="line-clamp-2 text-sm opacity-70">{item.content}</p>

      {item.createdAt && (
        <span className="text-[11px] opacity-50">
          {formatDate(item.createdAt)}
        </span>
      )}
    </ActivityItem>
  );
}
