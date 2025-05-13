"use client";

import { KeyboardEvent, useState, useTransition } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CancelIcon from "@/assets/img/icon-x.svg";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      params.set("keyword", trimmedKeyword);
    } else {
      params.delete("keyword");
    }

    startTransition(() => {
      router.replace(`${pathname}/?${params.toString()}`);
    });
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("keyword");
    setKeyword("");

    router.replace(`${pathname}/?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "bg-muted flex h-10 w-full items-center gap-3 overflow-hidden rounded-md pr-3 text-sm",
        isPending && "opacity-80",
      )}
    >
      <input
        type="text"
        placeholder="로드맵 검색"
        className="h-full flex-1 px-[1em] outline-none"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleTagKeyDown}
      />
      {isPending && <Spinner className="h-4 w-4" />}
      {keyword && (
        <button onClick={handleReset}>
          <Image src={CancelIcon} alt="Cancel" />
        </button>
      )}
    </div>
  );
}
