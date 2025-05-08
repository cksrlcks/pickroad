import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

dayjs.extend(relativeTime);
dayjs.locale("ko");
export function dateToAgo(date: string) {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    throw new Error("Invalid date");
  }

  return parsedDate.fromNow();
}
