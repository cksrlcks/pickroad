"use client";

import { KeyboardEvent, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import CancelIcon from "@/assets/img/icon-x.svg";
import { cn } from "@/lib/utils";
import { useFilters } from "./FilterProvider";
import Spinner from "./Spinner";

export default function Search() {
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters();
  const [value, setValue] = useState(filters.keyword ?? "");

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const keyword = (e.target as HTMLInputElement).value;
    const trimmedKeyword = keyword.trim();

    startTransition(() => {
      updateFilters({ keyword: trimmedKeyword });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      updateFilters({ keyword: undefined });
    });
  };

  useEffect(() => {
    setValue(filters.keyword ?? "");
  }, [filters.keyword]);

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
        className="h-full flex-1 px-[1em] text-base outline-none md:text-[14px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleTagKeyDown}
      />
      {isPending && <Spinner className="h-4 w-4" />}
      {value && (
        <button onClick={handleReset}>
          <Image src={CancelIcon} alt="Cancel" />
        </button>
      )}
    </div>
  );
}
