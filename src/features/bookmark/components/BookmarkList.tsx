import { Bookmark } from "../type";
import { BookmarkItem } from "./BookmarkItem";

type BookmarkListProps = {
  data: Bookmark[];
  keyword?: string | null;
};

export default function BookmarkList({ data, keyword }: BookmarkListProps) {
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

  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <BookmarkItem
          key={`${item.userId}-${item.roadmap?.externalId}`}
          item={item}
        />
      ))}
    </ul>
  );
}
