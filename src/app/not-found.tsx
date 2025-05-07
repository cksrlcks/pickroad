import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="-mt-22 flex h-screen flex-col items-center justify-center gap-8">
      <Image src={Logo} alt="Pick Road" className="dark:invert" />
      <div className="text-center">
        <div className="text-md mb-2 font-medium">
          페이지를 찾을 수 없습니다
        </div>
        <div className="text-sm text-neutral-500">
          존재하지 않거나 삭제된 페이지입니다
        </div>
      </div>
      <Button variant="secondary" asChild>
        <Link href="/" replace>
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
