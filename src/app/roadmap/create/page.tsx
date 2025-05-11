import { createRoadmap } from "@/actions/roadmap";
import { getCategories } from "@/data/roadmap";
import RoadmapForm from "@/features/roadmap/components/RoadmapForm";

export default async function CreateRoadmapPage() {
  const categories = await getCategories();

  return (
    <RoadmapForm
      initialData={undefined}
      action={createRoadmap}
      categories={categories}
    />
  );
}
