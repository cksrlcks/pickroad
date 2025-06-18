import { PropsWithChildren } from "react";
import SubPageNav from "@/components/SubPageNav";
import { Separator } from "@/components/ui/separator";

const MENU = [
  {
    label: "카테고리",
    href: "/admin",
  },
  {
    label: "카테고리 순서",
    href: "/admin/order",
  },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[400px]">
      <header className="pt-4 md:pt-0">
        <h2 className="mb-1 text-lg font-semibold md:text-xl">관리자 페이지</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          카테고리 추가 및 수정을 할 수 있어요
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
