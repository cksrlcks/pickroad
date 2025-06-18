import { PropsWithChildren } from "react";
import { DefaultLayout } from "@/components/Layout";

export default function Layout({ children }: PropsWithChildren) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
