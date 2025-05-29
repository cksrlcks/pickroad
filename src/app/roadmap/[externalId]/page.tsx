import { Suspense } from "react";
import { notFound } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoadmapActions from "@/features/roadmap/components/RoadmapActions";
import RoadmapDisplay from "@/features/roadmap/components/RoadmapDisplay";
import RoadmapInfo from "@/features/roadmap/components/RoadmapInfo";
import RoadmapItems from "@/features/roadmap/components/RoadmapItems";
import RoadmapReviews from "@/features/roadmap/components/RoadmapReviews";
import RoadmapTags from "@/features/roadmap/components/RoadmapTags";
import {
  getRoadmapWithExternalId,
  getRoadmapWithSession,
} from "@/features/roadmap/server/service";
import { Roadmap } from "@/features/roadmap/type";
import { generateRoadmapJsonLd } from "@/lib/jsonld-roadmap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ externalId: Roadmap["externalId"] }>;
}) {
  const defaultTitle = "나만의 로드맵 공유 플랫폼 | Pick Road";
  const { externalId } = await params;
  const roadmap = await getRoadmapWithExternalId(externalId);
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
  params: Promise<{ externalId: Roadmap["externalId"] }>;
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
      <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-10 lg:gap-16">
        <div className="-mx-4 -mt-4 flex-1 md:m-0 md:max-w-[320px]">
          <div className="md:sticky md:top-40">
            <RoadmapDisplay roadmap={roadmapDetail} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
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
                <RoadmapReviews roadmap={roadmapDetail} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
