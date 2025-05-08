/* eslint-disable @next/next/no-img-element */
import { Roadmap } from "../type";

type RoadmapItemsProps = {
  roadmap: Roadmap;
};

export default function RoadmapItems({ roadmap }: RoadmapItemsProps) {
  if (!roadmap.items || roadmap.items.length === 0) {
    return (
      <div className="px-2 py-6 text-center text-sm opacity-70">
        작성된 로드맵 카드가 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-1 py-4">
      {roadmap.items?.map((item) => (
        <li
          key={item.id}
          className="dark:bg-muted/30 rounded-xs bg-slate-100 p-6"
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="dark:bg-muted bg-background bg:border-muted dark:border-muted mx-auto block w-full max-w-sm overflow-hidden rounded-sm border border-gray-100"
          >
            {item.thumbnail && (
              <figure className="aspect-video">
                <img
                  src={item.thumbnail}
                  alt={item.description || "thumbnail"}
                  className="h-full w-full object-cover"
                />
              </figure>
            )}
            <div className="p-6">
              <h2 className="mb-1 font-semibold">{item.title}</h2>
              <p className="mb-2 line-clamp-2 text-sm wrap-break-word">
                {item.description}
              </p>
              <div className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-400">
                {item.url}
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
