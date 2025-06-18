import { PropsWithChildren } from "react";
import { RoadmapLayout } from "@/components/Layout";

export default function Layout({ children }: PropsWithChildren) {
  return <RoadmapLayout>{children}</RoadmapLayout>;
}
