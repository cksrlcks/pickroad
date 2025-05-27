"use client";

import { ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RevealImage({
  className,
  alt,
  ...props
}: ComponentProps<typeof Image>) {
  return (
    <Image
      {...props}
      alt={alt}
      className={cn("opacity-0 transition-opacity", className)}
      onLoad={(e) => (e.currentTarget.style.opacity = "100")}
    />
  );
}
