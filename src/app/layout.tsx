import { Metadata } from "next";
import { Roboto_Serif } from "next/font/google";
import "./globals.css";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-roboto-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pick-road.com"),
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
    <html
      lang="ko"
      className={`scrollbar-hide ${robotoSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
          integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
          crossOrigin="anonymous"
          defer
        ></script>
      </head>
      <body className="group antialiased">{children}</body>
    </html>
  );
}
