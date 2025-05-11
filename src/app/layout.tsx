import { Metadata } from "next";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pick Road - 나만의 로드맵 공유 플랫폼",
  description:
    "Pick Road는 블로그, 유튜브 등 다양한 링크를 모아 나만의 큐레이션 로드맵으로 정리하고 공유할 수 있는 웹 서비스입니다.",
  openGraph: {
    title: "Pick Road - 나만의 로드맵 공유 플랫폼",
    description:
      "Pick Road는 블로그, 유튜브 등 다양한 링크를 모아 나만의 큐레이션 로드맵으로 정리하고 공유할 수 있는 웹 서비스입니다.",
    url: "https://pick-road.com",
    siteName: "Pick Road",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pick Road - 나만의 로드맵 공유 플랫폼",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scrollbar-hide" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="py-30">
            <Header />
            <div className="px-6 md:px-10">
              <main className="mx-auto w-full max-w-4xl">{children}</main>
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
