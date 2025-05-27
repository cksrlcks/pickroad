import { RoadmapCategoryWithCount } from "../type";
import CategoryEditButton from "./CategoryEditButton";

type CategoryListProps = {
  categories: RoadmapCategoryWithCount[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li
          key={category.id}
          className="border-foreground/10 flex items-center gap-4 rounded-lg border p-2 pl-6"
        >
          <div className="flex h-4 w-4 items-center justify-center">
            {category.emoji}
          </div>
          <div className="flex items-center gap-1 font-medium">
            {category.name}
            <span className="text-xs opacity-50">({category.count})</span>
          </div>
          <div className="ml-auto">
            <CategoryEditButton category={category} />
          </div>
        </li>
      ))}
    </ul>
  );
}
