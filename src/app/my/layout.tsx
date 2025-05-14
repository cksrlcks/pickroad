import { PropsWithChildren } from "react";
import MypageNav from "@/components/MypageNav";

export default function MypageLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-[400px] gap-4">
      <div className="w-[200px]">
        <MypageNav />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
