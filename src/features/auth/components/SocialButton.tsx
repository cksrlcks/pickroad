"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SocialButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  icon: string;
  label: string;
};

export function SocialButton({ icon, label, ...props }: SocialButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "border-brand-200 hover:bg-brand-50 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-sm font-medium shadow-sm duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    >
      <Image src={icon} alt={label} className="mr-auto h-4 w-4" />
      <span className="-ml-4 flex-1">{label}</span>
    </button>
  );
}
