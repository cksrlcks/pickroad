import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import Inner from "./Inner";

export default function Footer() {
  return (
    <footer className="mb-10">
      <Inner>
        <Image
          src={Logo}
          alt="Pick Road"
          className="mb-3 h-4 w-auto dark:invert"
        />
        <div className="mb-4 text-xs opacity-60">
          링크를 모으고 공유하고, 영감을 얻으세요
        </div>
        <nav>
          <ul className="flex items-center gap-3 text-xs">
            <li>
              <Link href="/privacy" className="font-semibold hover:underline">
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                서비스 소개
              </Link>
            </li>
            <li>
              <a
                href="mailto:pickroad.master@gmail.com"
                className="hover:underline"
              >
                문의
              </a>
            </li>
          </ul>
        </nav>
      </Inner>
    </footer>
  );
}
