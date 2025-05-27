"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";

type SubPageNavProps = {
  menu: NavItem[];
};
export default function SubPageNav({ menu }: SubPageNavProps) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-row gap-1 md:flex-col">
        {menu.map((item) => {
          const isActive = item.href === pathname;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "hover:bg-muted flex rounded-md px-3 py-2 text-xs opacity-50 transition-[background] md:px-4 md:py-2.5 md:text-sm",
                  isActive && "bg-muted/80 font-semibold opacity-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
