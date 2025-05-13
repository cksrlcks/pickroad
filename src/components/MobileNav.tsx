"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LaptopMinimal, Menu, Moon, Sun, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Inner from "./Inner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Separator } from "./ui/separator";

export default function MobileNav() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          setIsOpen(false);
        },
      },
    });
  };

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <Button variant="ghost" className="ml-auto h-8 w-8">
            <X />
            <span className="sr-only">닫기</span>
          </Button>
          <DrawerTitle className="sr-only">Mobile Navigation</DrawerTitle>
        </DrawerHeader>

        <Inner className="relative">
          <div className="bg-muted mb-4 rounded-md">
            {session ? (
              <div className="flex items-center gap-2 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt="프로필 이미지"
                  />
                  <AvatarFallback className="text-xs font-semibold">
                    {session.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">
                    {session.user.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {session.user.email}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="block py-8 text-center text-sm opacity-40"
                onClick={() => setIsOpen(false)}
              >
                로그인을 해주세요
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-50">Theme</span>
            <div className="flex items-center gap-1">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                <Sun />
                <span className="sr-only">Light mode</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                <Moon />
                <span className="sr-only">Dark mode</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                <LaptopMinimal />
                <span className="sr-only">System mode</span>
              </Button>
            </div>
          </div>

          {session && (
            <>
              <Separator className="my-4" />

              <nav className="pt-4">
                <ul className="flex flex-col gap-4 text-lg font-semibold">
                  <li>
                    <Link
                      href="/roadmap/create"
                      onClick={() => setIsOpen(false)}
                    >
                      로드맵 카드 만들기
                    </Link>
                  </li>
                  <li>
                    <Link href="/my" onClick={() => setIsOpen(false)}>
                      마이페이지
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>로그아웃</button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </Inner>
      </DrawerContent>
    </Drawer>
  );
}
