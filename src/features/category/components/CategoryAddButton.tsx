"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";

export default function CategoryAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">추가하기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>카테고리 추가</DialogTitle>
          <DialogDescription>카테고리를 추가합니다.</DialogDescription>
        </DialogHeader>
        <CategoryForm onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
