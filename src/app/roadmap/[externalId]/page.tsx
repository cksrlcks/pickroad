import { Suspense } from "react";
import { notFound } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoadmap, getRoadmapWithSession } from "@/data/roadmap";
import RoadmapActions from "@/features/roadmap/components/RoadmapActions";
import { RoadmapCard } from "@/features/roadmap/components/RoadmapCard";
import RoadmapInfo from "@/features/roadmap/components/RoadmapInfo";
import RoadmapItems from "@/features/roadmap/components/RoadmapItems";
import RoadmapMobileWall from "@/features/roadmap/components/RoadmapMobileWall";
import RoadmapReview from "@/features/roadmap/components/RoadmapReviews";
import RoadmapTags from "@/features/roadmap/components/RoadmapTags";
import { generateRoadmapJsonLd } from "@/lib/jsonld-roadmap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const defaultTitle = "나만의 로드맵 공유 플랫폼 | Pick Road";
  const { externalId } = await params;
  const roadmap = await getRoadmap(externalId);
  const title = roadmap?.title ? `${roadmap.title} | Pick Road` : defaultTitle;
  const description = `${roadmap?.subTitle ?? defaultTitle}`;

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

  const jsonLd = generateRoadmapJsonLd(roadmapDetail);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-16">
        {/* pc - cover */}
        <div className="hidden max-w-[320px] flex-1 md:block">
          <div className="sticky top-40">
            <RoadmapCard roadmap={roadmapDetail} />
          </div>
        </div>

        {/* mobile - cover */}
        <div className="-mx-4 -mt-8 md:hidden">
          <RoadmapMobileWall roadmap={roadmapDetail} />
        </div>

        <div className="flex-1">
          <div className="mb-4 md:mb-10">
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
    </>
  );
}
