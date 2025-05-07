"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Account() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="text-secondary-foreground flex items-center text-sm font-medium transition-colors">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full">
            <Avatar>
              <AvatarImage
                src={session.user.image || undefined}
                alt="프로필 이미지"
                className="h-8 w-8"
              />
              <AvatarFallback className="text-xs font-semibold">
                {session.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-200 w-[140px]">
            <DropdownMenuItem asChild>
              <Link
                className="flex h-full w-full cursor-pointer items-center gap-2 font-medium"
                href="/my"
              >
                마이페이지
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className="opacity-60 transition-opacity hover:opacity-100"
        >
          로그인
        </Link>
      )}
    </div>
  );
}
