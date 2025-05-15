"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MY_PAGE_MENU = [
  {
    name: "나의 정보",
    href: "/my",
  },
  {
    name: "나의 활동",
    href: "/my/activity",
  },
  {
    name: "즐겨찾기",
    href: "/my/bookmark",
  },
];
export default function MypageNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-row gap-1 md:flex-col">
        {MY_PAGE_MENU.map((menu) => {
          const isActive = menu.href === pathname;
          return (
            <li key={menu.href}>
              <Link
                href={menu.href}
                className={cn(
                  "hover:bg-muted flex rounded-md px-3 py-2 text-xs opacity-50 transition-[background] md:px-4 md:py-2.5 md:text-sm",
                  isActive && "bg-muted/80 font-semibold opacity-100",
                )}
              >
                {menu.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
