import { getCategories } from "@/data/category";
import RoadmapForm from "@/features/roadmap/components/RoadmapForm";

export default async function CreateRoadmapPage() {
  const categories = await getCategories();

  return <RoadmapForm categories={categories} />;
}
