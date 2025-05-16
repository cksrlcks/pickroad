import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import PlusIcon from "@/assets/img/icon-plus.svg";
import Logo from "@/assets/img/logo.svg";
import { getCategories } from "@/data/roadmap";
import Account from "./Account";
import Inner from "./Inner";
import MobileNav from "./MobileNav";
import Nav from "./Nav";
import Search from "./Search";
import { Button } from "./ui/button";

export default async function Header() {
  const categories = await getCategories();
  const displayCategories = [
    { id: 9999, name: "전체", emoji: null },
    ...categories,
  ];

  return (
    <div className="bg-background border-foreground/10 sticky top-0 z-10 mb-4 w-full border-b pt-[10px] md:mb-8">
      <Inner>
        <div className="flex flex-wrap items-center gap-3 py-[14px] md:flex-nowrap">
          <Link href="/" className="md:mr-4">
            <Image src={Logo} alt="Pick Road" className="dark:invert" />
          </Link>
          <div className="order-last w-full md:order-none md:w-auto md:flex-1">
            <Suspense>
              <Search placeholder="로드맵 검색" />
            </Suspense>
          </div>
          <div className="hidden md:flex">
            <Account />
          </div>
          <div className="ml-auto md:hidden">
            <MobileNav />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Suspense>
            <Nav categories={displayCategories} />
          </Suspense>
          <Button
            asChild
            variant="ghost"
            className="hidden text-sm md:flex lg:h-10"
          >
            <Link href="/roadmap/create">
              <Image src={PlusIcon} alt="로드맵 카드 만들기" />
              <span className="hidden md:block">로드맵 카드 만들기</span>
            </Link>
          </Button>
        </div>
      </Inner>
    </div>
  );
}
