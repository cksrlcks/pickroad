export const FILE_LIMIT_SIZE = 2;

export type HexColor = `#${string}`;
export const DEFAULT_COLORS = [
  "#7AC555", // 연두
  "#760DDE", // 보라
  "#FFA500", // 주황
  "#76A5EA", // 하늘
  "#E876EA", // 핑크
  "#FF6B6B", // 레드
  "#4BC0C0", // 민트
  "#F9CB40", // 노랑
  "#A3A3A3", // 회색
] as const satisfies HexColor[];

export const ROADMAP_THEMES = ["vibrant", "muted"] as const;
export type RoadmapTheme = (typeof ROADMAP_THEMES)[number];

export const DEFAULT_PER_PAGE = 4;
