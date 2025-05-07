"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        <div className="-mt-22 flex h-screen flex-col items-center justify-center gap-6">
          <Image src={Logo} alt="Pick Road" />
          <div className="text-center">
            <div className="text-md mb-2 font-medium">오류가 발생했습니다</div>
            <div className="text-sm text-neutral-500">
              추가 정보: {error?.message}
            </div>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/" replace>
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
