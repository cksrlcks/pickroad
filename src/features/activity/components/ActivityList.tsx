"use client";

import { useFilters } from "@/components/FilterProvider";
import { Activity, ACTIVITY_TYPES } from "../type";
import { ActivityCommentItem } from "./ActivityCommentItem";
import { ActivityItemSkeleton } from "./ActivityItemSkeleton";
import { ActivityLikeItem } from "./ActivityLikeItem";
import { ActivityRoadmapItem } from "./ActivityRoadmapItem";

type ActivityListProps = {
  data: Activity[];
  keyword?: string | null;
};

export default function ActivityList({ data, keyword }: ActivityListProps) {
  const { isPending } = useFilters();

  if (isPending) {
    return (
      <ul>
        {[...Array(6)].map((_, index) => (
          <ActivityItemSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground px-2 py-20 text-center text-sm">
        {keyword ? (
          <>
            <b className="text-foreground">{keyword}</b> 로 검색된 결과가
            없습니다.
          </>
        ) : (
          "아직 활동한 내용이 없어요."
        )}
      </div>
    );
  }

  const renderItem = (item: Activity) => {
    switch (item.type) {
      case ACTIVITY_TYPES.ROADMAP:
        return (
          <li key={item.id}>
            <ActivityRoadmapItem item={item} />
          </li>
        );
      case ACTIVITY_TYPES.COMMENT:
        return (
          <li key={item.id}>
            <ActivityCommentItem item={item} />
          </li>
        );
      case ACTIVITY_TYPES.LIKE:
        return (
          <li key={`${item.userId}-${item.roadmap?.externalId}`}>
            <ActivityLikeItem item={item} />
          </li>
        );
      default:
        return null;
    }
  };

  return <ul className="space-y-2">{data.map((item) => renderItem(item))}</ul>;
}
