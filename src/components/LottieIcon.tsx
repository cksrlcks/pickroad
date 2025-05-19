"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LottieIconProps = {
  data: object;
  className?: string;
};

export default function LottieIcon({ data, className }: LottieIconProps) {
  return (
    <div className={cn("h-16 w-16", className)}>
      <Lottie animationData={data} loop={true} />
    </div>
  );
}
