"use client";

import { PropsWithChildren } from "react";
import { useFilters } from "./FilterProvider";
import Spinner from "./Spinner";

type PendingBoundaryProps = PropsWithChildren<{
  fallback?: React.ReactNode;
}>;

export default function PendingBoundary({
  children,
  fallback,
}: PendingBoundaryProps) {
  const { isPending } = useFilters();

  if (isPending) {
    return (
      fallback || (
        <div className="flex w-full justify-center py-10">
          <Spinner />
        </div>
      )
    );
  }

  return children;
}
