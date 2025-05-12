import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRoadmapComment } from "@/actions/comment";

export default function useComment() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPendingDelete, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      const response = await deleteRoadmapComment(id);
      if (response.success) {
        toast("댓글이 삭제되었습니다.");
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  };

  return {
    isEditMode,
    setIsEditMode,
    isPendingDelete,
    handleDelete,
  };
}
