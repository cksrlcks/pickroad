import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function Inner({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl px-6", className)}>
      {children}
    </div>
  );
}
