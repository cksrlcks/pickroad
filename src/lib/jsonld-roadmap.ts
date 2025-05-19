import { Roadmap } from "@/features/roadmap/type";

export function generateRoadmapJsonLd(roadmap: Roadmap) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: roadmap.title,
    alternateName: roadmap.subTitle,
    description: roadmap.description ?? undefined,
    url: `https://pickroad.com/roadmaps/${roadmap.externalId}`,
    dateCreated: roadmap.createdAt ?? undefined,
    dateModified: roadmap.updatedAt ?? undefined,
    image: roadmap.thumbnail ?? undefined,
    author: roadmap.author
      ? {
          "@type": "Person",
          name: roadmap.author.name,
          email: roadmap.author.email,
          image: roadmap.author.image ?? undefined,
        }
      : undefined,
    keywords: roadmap.tags?.map((tag) => tag.name),
    genre: roadmap.category?.name,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: roadmap.items?.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description ?? undefined,
        url: item.url,
        image: item.thumbnail ?? undefined,
      })),
    },
  };
}
