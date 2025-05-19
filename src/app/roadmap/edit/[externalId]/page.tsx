import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getRoadmapWithSession } from "@/data/roadmap";
import { db } from "@/db";
import RoadmapForm from "@/features/roadmap/components/RoadmapForm";
import { auth } from "@/lib/auth";

export default async function EditRoadmapPage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { externalId } = await params;
  const roadmapDetail = await getRoadmapWithSession(externalId);

  if (!roadmapDetail) {
    notFound();
  }

  const isAuthor = session?.user.id === roadmapDetail.author?.id;

  if (!isAuthor) {
    redirect("/");
  }

  const categories = await db.query.categories.findMany();

  return <RoadmapForm initialData={roadmapDetail} categories={categories} />;
}
