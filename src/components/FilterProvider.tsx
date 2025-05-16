"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useOptimistic,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterType } from "@/types";

type Filters = {
  category?: number;
  page?: number;
  keyword?: string;
  type?: FilterType;
};

type FilterContextType = {
  filters: Filters | undefined;
  isPending: boolean;
  updateFilters: (_value: Filters) => void;
};

type FilterProviderProps = PropsWithChildren<{
  basePath?: string;
}>;

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

export default function FilterProvider({
  basePath = "/",
  children,
}: FilterProviderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isValidPath = basePath === pathname;

  const filters: Filters | undefined = isValidPath
    ? {
        category: parseInt(searchParams.get("category") || "") || undefined,
        page: parseInt(searchParams.get("page") || "") || undefined,
        keyword: searchParams.get("keyword") || undefined,
        type: (searchParams.get("type") as FilterType) || undefined,
      }
    : undefined;

  const [isPending, startTransition] = useTransition();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters,
    (prevState, newFilters: Filters) => {
      return {
        ...prevState,
        ...newFilters,
      };
    },
  );

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = {
      ...optimisticFilters,
      ...updates,
    };
    const newSearchParams = new URLSearchParams();

    Object.entries(newState).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          newSearchParams.append(key, v);
        });
      } else if (value !== undefined) {
        newSearchParams.set(key, String(value));
      }
    });

    startTransition(() => {
      setOptimisticFilters(updates || {});
      router.push(`${basePath}?${newSearchParams}`, { scroll: false });
    });
  }

  return (
    <FilterContext.Provider
      value={{ filters: optimisticFilters, isPending, updateFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}
