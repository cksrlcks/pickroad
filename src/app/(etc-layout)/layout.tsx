import { PropsWithChildren } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Inner from "@/components/Inner";
import { Button } from "@/components/ui/button";

export default function EtcLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Inner className="pb-10">
        <header className="border-foreground/10 my-8 flex border-b py-3">
          <Button asChild variant="ghost">
            <Link href="/roadmap">
              <ArrowLeft />
              돌아가기
            </Link>
          </Button>
        </header>
        <main>{children}</main>
      </Inner>
      <Footer />
    </>
  );
}
