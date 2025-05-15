"use client";

import { useEffect, useTransition } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RoadmapCategory } from "@/features/roadmap/type";
import { cn } from "@/lib/utils";
import { useFilters } from "./FilterProvider";
import { Button } from "./ui/button";

type NavProps = {
  categories: RoadmapCategory[];
};

export default function Nav({ categories }: NavProps) {
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
  });

  const handleCategoryClick = (categoryId: number, index: number) => {
    startTransition(() => {
      updateFilters({
        category: categoryId === 9999 ? undefined : categoryId,
        keyword: undefined,
        page: undefined,
      });
      emblaApi?.scrollTo(index);
    });
  };

  useEffect(() => {
    if (!emblaApi) return;

    const initialIndex = categories.findIndex((item) => {
      if (filters.category) {
        return item.id === filters.category;
      }
      return 0;
    });

    emblaApi?.scrollTo(Math.max(0, initialIndex - 1));
  }, [categories, emblaApi, filters.category]);

  return (
    <nav
      className="relative min-w-0 overflow-hidden pr-10"
      data-pending={isPending ? "" : undefined}
      ref={emblaRef}
    >
      <ul className="flex pb-1 md:pb-3">
        {categories.map((item, index) => {
          const isActive = filters.category
            ? item.id === filters.category
            : item.id === 9999;

          return (
            <li
              key={item.id}
              className="flex-basis-auto relative min-w-0 shrink-0 grow-0"
            >
              <Button
                variant="ghost"
                className={cn(
                  "h-8 gap-2 px-3 text-xs font-medium md:h-9 md:px-4 md:text-sm",
                  isActive &&
                    "before:bg-primary before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:content-[''] md:before:-bottom-3",
                )}
                onClick={() => handleCategoryClick(item.id, index)}
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

      <span className="from-background/0 to-background/100 absolute top-0 right-0 h-full w-8 bg-gradient-to-r"></span>
    </nav>
  );
}
