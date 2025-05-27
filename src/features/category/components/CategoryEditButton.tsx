"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoadmapCategory } from "../type";
import CategoryForm from "./CategoryForm";

type CategoryEditButtonProps = {
  category: RoadmapCategory;
};

export default function CategoryEditButton({
  category,
}: CategoryEditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <Pencil strokeWidth={3} className="h-4 w-4" />
          <span className="sr-only">수정하기</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>카테고리 수정</DialogTitle>
          <DialogDescription>
            카테고리의 이름을 수정하거나, 삭제를 합니다.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={category}
          onComplete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
