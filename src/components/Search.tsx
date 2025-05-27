"use client";

import { KeyboardEvent, useRef, useTransition } from "react";
import Image from "next/image";
import CancelIcon from "@/assets/img/icon-x.svg";
import { cn } from "@/lib/utils";
import { useFilters } from "./FilterProvider";
import Spinner from "./Spinner";

type SearchProps = {
  placeholder?: string;
};

export default function Search({ placeholder }: SearchProps) {
  const [isPending, startTransition] = useTransition();
  const { filters, updateFilters } = useFilters();
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!filters?.keyword) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    startTransition(() => {
      updateFilters({ keyword: undefined });
    });
  };

  return (
    <div
      className={cn(
        "bg-muted flex h-10 w-full items-center gap-3 overflow-hidden rounded-md pr-3 text-sm",
        isPending && "opacity-80",
      )}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "검색"}
        className="h-full flex-1 px-[1em] text-base outline-none md:text-[14px]"
        defaultValue={filters?.keyword}
        onKeyDown={handleTagKeyDown}
      />
      {isPending && <Spinner className="h-4 w-4" />}
      {filters?.keyword && (
        <button onClick={handleReset}>
          <Image src={CancelIcon} alt="Cancel" />
        </button>
      )}
    </div>
  );
}
