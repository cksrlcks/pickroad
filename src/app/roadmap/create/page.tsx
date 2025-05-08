import { createRoadmap, getCategories } from "@/db/actions/roadmap";
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
