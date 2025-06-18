import { PropsWithChildren, Suspense } from "react";
import { Toaster } from "sonner";
import FilterProvider from "@/components/FilterProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Inner from "@/components/Inner";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <FilterProvider basePath="/roadmap">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Inner className="pb-10">
            <main>{children}</main>
          </Inner>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </FilterProvider>
    </Suspense>
  );
}
