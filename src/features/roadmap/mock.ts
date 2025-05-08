import { Roadmap } from "./type";

export const MOCK_ROADMAP_LIST = [
  {
    id: "1746543420000QYOHR78DN7",
    title: "test",
    subTitle: "test",
    description: "test",
    thumbnail: null,
    createdAt: "2025-05-06T14:57:05.140Z",
    updatedAt: "2025-05-06T14:57:05.140Z",
    category: null,
    author: {
      id: "itQLRNe07qOEl6v07QK2KFqQIGlvzRgP",
      name: "김찬기",
      email: "chanki.kim89@gmail.com",
      emailVerified: true,
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocJBUQanwQqBt0DZmVwDC_QqovMuvNHV5lBnGu-0GeIruGTZxyUXXQ=s96-c",
    },
    tags: [],
    likeCount: 0,
    isLiked: null,
    items: null,
    color: null,
  },
  {
    id: "1746542760000UQ4TS9POAU",
    title: "test",
    subTitle: "test",
    description: "test",
    thumbnail: "https://cdn.pick-road.com/uploads/1746541877955",
    createdAt: "2025-05-06T14:31:18.536Z",
    updatedAt: "2025-05-06T14:46:29.007Z",
    category: {
      id: 1,
      name: "개발",
    },
    author: {
      id: "OxjegAgQE513XKS9SV7YebrZL8H9yQP5",
      name: "찬기",
      email: "changistory@naver.com",
      image:
        "http://k.kakaocdn.net/dn/heR4n/btsMAIqX3el/WfSSi4EdxWSU4JRI42ZiH0/img_640x640.jpg",
    },
    tags: [
      {
        id: 8,
        name: "test",
      },
    ],
    likeCount: 0,
    isLiked: null,
    items: null,
    color: {
      theme: "vibrant",
      vibrant: {
        color: "#c49343",
        textColor: "#000000",
        darkColor: "#704b24",
        darkTextColor: "#ffffff",
        lightColor: "#e4b45c",
        lightTextColor: "#000000",
      },
      muted: {
        color: "#a06f57",
        textColor: "#ffffff",
        darkColor: "#513727",
        darkTextColor: "#ffffff",
        lightColor: "#c8b5a8",
        lightTextColor: "#000000",
      },
    },
  },
  {
    id: "1746538980000JCSYZ0HDI2",
    title: "마비노기 공략모음23마비노기 공략모음23마비노기 공략모음23",
    subTitle:
      "히든퀘스트 공략집 마비노기 공략모음23마비노기 공략모음23마비노기 공략모음23",
    description: "히든퀘스트 공략집을 모았습니다.",
    thumbnail: "https://cdn.pick-road.com/uploads/1746539005447",
    createdAt: "2025-05-06T13:43:26.279Z",
    updatedAt: "2025-05-06T14:29:57.159Z",
    category: {
      id: 2,
      name: "게임",
    },
    author: {
      id: "itQLRNe07qOEl6v07QK2KFqQIGlvzRgP",
      name: "김찬기",
      email: "chanki.kim89@gmail.com",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocJBUQanwQqBt0DZmVwDC_QqovMuvNHV5lBnGu-0GeIruGTZxyUXXQ=s96-c",
    },
    tags: [
      {
        id: 8,
        name: "test",
      },
    ],
    likeCount: 0,
    isLiked: null,
    items: null,
    color: {
      theme: "vibrant",
      vibrant: {
        color: "#3161ba",
        textColor: "#ffffff",
        darkColor: "#133168",
        darkTextColor: "#ffffff",
        lightColor: "#73b6de",
        lightTextColor: "#000000",
      },
      muted: {
        color: "#85b85c",
        textColor: "#000000",
        darkColor: "#334d34",
        darkTextColor: "#ffffff",
        lightColor: "#e1dcd3",
        lightTextColor: "#000000",
      },
    },
  },
] as Roadmap[];
