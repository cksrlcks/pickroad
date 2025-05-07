import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scrollbar-hide">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <div className="pt-22">
          <Header />
          <div className="px-4">
            <main className="mx-auto w-full max-w-3xl">{children}</main>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
