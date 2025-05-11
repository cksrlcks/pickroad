"use client";

import { Link, MessageCircle, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RoadmapshareButtonProps = {
  onKakaoShareClick: () => void;
  onCopyUrlClick: () => void;
};

export function RoadmapShareButton({
  onKakaoShareClick,
  onCopyUrlClick,
}: RoadmapshareButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
          onClick={() => alert("준비중")}
        >
          <Share strokeWidth={3} className="h-4 w-4" />
          <span className="sr-only">공유하기</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-200">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={onKakaoShareClick}
        >
          <MessageCircle />
          카카오톡 공유하기
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onCopyUrlClick}>
          <Link /> URL 복사하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
