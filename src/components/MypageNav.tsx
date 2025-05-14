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
      <ul>
        {MY_PAGE_MENU.map((menu) => {
          const isActive = menu.href === pathname;
          return (
            <li key={menu.href} className="mb-2">
              <Link
                href={menu.href}
                className={cn(
                  "text-sm opacity-50",
                  isActive && "font-semibold opacity-100",
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
