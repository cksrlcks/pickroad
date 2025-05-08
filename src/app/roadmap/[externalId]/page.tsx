import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoadmapWithSession } from "@/db/actions/roadmap";
import RoadmapActions from "@/features/roadmap/components/RoadmapActions";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";
import RoadmapInfo from "@/features/roadmap/components/RoadmapInfo";
import RoadmapItems from "@/features/roadmap/components/RoadmapItems";
import RoadmapReview from "@/features/roadmap/components/RoadmapReviews";
import RoadmapTags from "@/features/roadmap/components/RoadmapTags";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const roadmapDetail = await getRoadmapWithSession(externalId);

  if (!roadmapDetail) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-between gap-14 md:flex-row">
      <div className="dark:bg-muted/30 -mx-20 bg-slate-100 py-6 md:mx-0 md:w-full md:max-w-[320px] md:bg-transparent md:py-0 dark:md:bg-transparent">
        <div className="mx-auto max-w-[300px] md:max-w-none">
          <RoadmapCard roadmap={roadmapDetail} />
        </div>
      </div>
      <div className="flex-1">
        <div className="mb-10">
          <RoadmapTags roadmap={roadmapDetail} />
          <RoadmapInfo roadmap={roadmapDetail} />
          <RoadmapActions roadmap={roadmapDetail} />
        </div>

        <Tabs defaultValue="roadmap">
          <TabsList className="w-full">
            <TabsTrigger value="roadmap">로드맵</TabsTrigger>
            <TabsTrigger value="review">리뷰</TabsTrigger>
          </TabsList>
          <TabsContent value="roadmap">
            <RoadmapItems roadmap={roadmapDetail} />
          </TabsContent>
          <TabsContent value="review">
            <RoadmapReview roadmap={roadmapDetail} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
