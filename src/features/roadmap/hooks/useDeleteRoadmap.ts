import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRoadmap } from "@/actions/roadmap";
import { Roadmap } from "../type";

// Delete roadmap
export function useDeleteRoadmap(roadmap: Roadmap) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await deleteRoadmap(roadmap.id);
    if (response.success) {
      toast.success(response.message);
      router.replace("/");
    } else {
      toast.error(response.message);
    }
  };

  return { handleDelete };
}
