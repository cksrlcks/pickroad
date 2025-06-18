import { PropsWithChildren } from "react";
import SubPageNav from "@/components/SubPageNav";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "@/types";

const MENU: NavItem[] = [
  {
    label: "나의 정보",
    href: "/my",
  },
  {
    label: "나의 활동",
    href: "/my/activity",
  },
  {
    label: "즐겨찾기",
    href: "/my/bookmark",
  },
];

export default function MypageLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[400px]">
      <header className="pt-4 md:pt-0">
        <h2 className="mb-1 text-lg font-semibold md:text-xl">마이페이지</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          회원정보 수정 및 나의 활동을 확인할 수 있어요
        </p>
      </header>
      <Separator className="bg-muted my-4 md:my-8" />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="md:w-[200px]">
          <SubPageNav menu={MENU} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
