"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useOptimistic,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Filters = {
  category?: number;
  page?: number;
  keyword?: string;
};

type FilterContextType = {
  filters: Filters;
  isPending: boolean;
  updateFilters: (_value: Filters) => void;
};

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

export default function FilterProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = {
    category: parseInt(searchParams.get("category") || "") || undefined,
    page: parseInt(searchParams.get("page") || "") || undefined,
    keyword: searchParams.get("keyword") || undefined,
  };

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
      router.push(`/?${newSearchParams}`, { scroll: false });
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
