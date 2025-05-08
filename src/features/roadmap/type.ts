// todo: drizzle schema에서 타입 추출하기

export type Roadmap = {
  id: string;
  title: string;
  subTitle: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  } | null;
  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
  tags:
    | {
        id: number;
        name: string;
      }[]
    | null;
  items:
    | {
        id: number;
        title: string;
        description: string | null;
        thumbnail: string | null;
        url: string;
      }[]
    | null;
  isLiked: boolean | null;
  likeCount: number;
  thumbnail: string | null;
  color: {
    theme: "vibrant" | "muted";
    vibrant: {
      color: string;
      textColor: string;
      darkColor: string;
      darkTextColor: string;
      lightColor: string;
      lightTextColor: string;
    };
    muted: {
      color: string;
      textColor: string;
      darkColor: string;
      darkTextColor: string;
      lightColor: string;
      lightTextColor: string;
    };
  } | null;
};
