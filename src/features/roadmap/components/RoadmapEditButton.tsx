import Link from "next/link";
import { Pencil } from "lucide-react";

type RoadmapEditButtonProps = {
  href: string;
};

export function RoadmapEditButton({ href }: RoadmapEditButtonProps) {
  return (
    <Link
      href={href}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100 dark:hover:text-black"
    >
      <Pencil strokeWidth={3} className="h-4 w-4" />
      <span className="sr-only">수정하기</span>
    </Link>
  );
}
