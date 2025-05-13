import { Suspense } from "react";
import { notFound } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoadmap, getRoadmapWithSession } from "@/data/roadmap";
import RoadmapActions from "@/features/roadmap/components/RoadmapActions";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";
import RoadmapInfo from "@/features/roadmap/components/RoadmapInfo";
import RoadmapItems from "@/features/roadmap/components/RoadmapItems";
import RoadmapReview from "@/features/roadmap/components/RoadmapReviews";
import RoadmapTags from "@/features/roadmap/components/RoadmapTags";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const roadmap = await getRoadmap(externalId);
  const title = `${roadmap ? roadmap.title + " | " : ""}Pick Road`;
  const description = `${
    roadmap ? roadmap.description : "나만의 로드맵 공유 플랫폼"
  }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pick-road.com/roadmap/${externalId}`,
      siteName: "Pick Road",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Pick Road - 나만의 로드맵 공유 플랫폼",
        },
      ],
    },
  };
}

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
      <div className="dark:bg-muted/30 -mx-6 -mt-8 bg-slate-100 py-6 md:mx-0 md:mt-0 md:w-full md:max-w-[320px] md:bg-transparent md:py-0 dark:md:bg-transparent">
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
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <Spinner />
                </div>
              }
            >
              <RoadmapReview roadmap={roadmapDetail} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
