import { cn } from "@/lib/utils";

type GridListProps<T extends { id: number | string }> = {
  skeleton?: boolean;
  className?: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

export default function GridList<T extends { id: number | string }>({
  skeleton = false,
  className,
  items,
  renderItem,
}: GridListProps<T>) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 md:gap-4 md:gap-x-4 md:gap-y-8",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={skeleton ? index : item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
