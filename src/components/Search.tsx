"use client";

import { KeyboardEvent, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CancelIcon from "@/assets/img/icon-x.svg";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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

    router.replace(`${pathname}/?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("keyword");
    setKeyword("");

    router.replace(`${pathname}/?${params.toString()}`);
  };

  return (
    <div className="bg-muted flex h-10 w-full items-center overflow-hidden rounded-md pr-3 text-sm">
      <input
        type="text"
        placeholder="로드맵 검색"
        className="h-full flex-1 px-[1em] outline-none"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleTagKeyDown}
      />
      {keyword && (
        <button onClick={handleReset}>
          <Image src={CancelIcon} alt="Cancel" />
        </button>
      )}
    </div>
  );
}
