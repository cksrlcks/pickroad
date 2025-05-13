"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { RoadmapCategory } from "@/features/roadmap/type";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type NavProps = {
  categories: RoadmapCategory[];
};

export default function Nav({ categories }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticCategories, setOptimisticCategories] = useOptimistic(
    searchParams.get("category"),
  );

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams(searchParams);

    if (categoryId === 9999) {
      params.delete("category");
    } else {
      params.set("category", categoryId.toString());
    }

    startTransition(() => {
      setOptimisticCategories(categoryId.toString());
      router.replace(`${pathname}/?${params.toString()}`);
    });
  };

  return (
    <nav className="min-w-0" data-pending={isPending ? "" : undefined}>
      <ul className="scrollbar-hide flex overflow-x-auto pb-1 md:pb-3">
        {categories.map((item) => {
          const isActive = item.id === parseInt(optimisticCategories || "9999");

          return (
            <li key={item.id} className="relative">
              <Button
                variant="ghost"
                className={cn(
                  "h-8 gap-2 px-3 text-xs font-medium md:h-9 md:px-4 md:text-sm",
                  isActive &&
                    "before:bg-primary before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:content-[''] md:before:-bottom-3",
                )}
                onClick={() => handleCategoryClick(item.id)}
              >
                {item.emoji && <span>{item.emoji}</span>}
                <span className={cn("opacity-60", isActive && "opacity-100")}>
                  {item.name}
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
