"use client";

import dynamic from "next/dynamic";
import { TargetType } from "@/types";
import { Comment as CommentType } from "../type";

type CommentProps = {
  targetId: CommentType["id"];
  targetType: TargetType;
  initialData: {
    totalCount: number;
    data: CommentType[] | null;
  };
};

const CommentForm = dynamic(() => import("./CommentForm"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-[108px] items-center justify-center text-center text-sm">
      리뷰작성 폼을 가져오는중입니다.
    </div>
  ),
});

const CommentList = dynamic(() => import("./CommentList"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground h-5 text-center text-sm">
      리뷰 목록을 가져오는중입니다.
    </div>
  ),
});

export default function Comment({
  targetId,
  targetType,
  initialData,
}: CommentProps) {
  return (
    <div className="space-y-8 py-3">
      <CommentForm targetType={targetType} targetId={targetId} />
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <span className="opacity-70">리뷰</span>
        <span className="text-foreground">{initialData?.totalCount}</span>
      </h3>
      <CommentList
        comments={initialData}
        targetType={targetType}
        targetId={targetId}
      />
    </div>
  );
}
