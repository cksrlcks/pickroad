import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

/**
 * 테일윈드 classname 병합
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 상대시간 표시
 */
dayjs.extend(relativeTime);
dayjs.locale("ko");
export function dateToAgo(date: string | Date) {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    console.error("Invalid date");
    return null;
  }

  return parsedDate.fromNow();
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string | Date) {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    console.error("Invalid date");
    return null;
  }

  return parsedDate.format("YYYY년 MM월 DD일");
}

/**
 * URL 체크
 */
export function isValidUrl(url: string | null | undefined) {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
