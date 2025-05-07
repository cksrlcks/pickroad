"use client";

import Link from "next/link";

export default function Account() {
  return (
    <ul className="flex items-center gap-5 text-sm font-medium">
      <li>
        <Link
          href="/login"
          className="text-neutral-500 transition-colors hover:text-neutral-700"
        >
          로그인
        </Link>
      </li>
    </ul>
  );
}
