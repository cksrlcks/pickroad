import { getCategories } from "@/features/category/server/db";
import RoadmapForm from "@/features/roadmap/components/RoadmapForm";

export default async function CreateRoadmapPage() {
  const categories = await getCategories();

  return <RoadmapForm categories={categories} />;
}
