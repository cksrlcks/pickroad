"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RoadmapCategory } from "@/features/roadmap/type";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type NavProps = {
  categories: RoadmapCategory[];
};

export default function Nav({ categories }: NavProps) {
  const searchParams = useSearchParams();
  const currentCategoryId = parseInt(searchParams.get("category") || "9999");

  return (
    <nav className="min-w-0">
      <ul className="scrollbar-hide flex overflow-x-auto pb-1 md:pb-3">
        {categories.map((item) => {
          const isActive = item.id === currentCategoryId;

          return (
            <li key={item.id} className="relative">
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "h-8 gap-2 px-3 text-xs font-medium md:h-9 md:px-4 md:text-sm",
                  isActive &&
                    "before:bg-primary before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:content-[''] md:before:-bottom-3",
                )}
              >
                <Link href={item.id === 9999 ? "/" : `/?category=${item.id}`}>
                  {item.emoji && <span>{item.emoji}</span>}
                  <span className={cn("opacity-60", isActive && "opacity-100")}>
                    {item.name}
                  </span>
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
