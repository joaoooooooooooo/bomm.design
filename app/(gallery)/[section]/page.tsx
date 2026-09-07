import { notFound } from "next/navigation";
import { Gallery } from "@/features/gallery/components/gallery";
import { LogosGrid } from "@/features/gallery/components/logos-grid";
import { curatedLogos } from "@/features/gallery/logos-data";
import { getCategories, getGalleryPosts } from "@/features/gallery/queries";
import { AppHeader } from "@/features/navigation/components/app-header";
import { isCollection } from "@/features/navigation/sections";

export default async function CollectionPage({ params, searchParams }: PageProps<"/[section]">) {
  const [{ section }, filters] = await Promise.all([params, searchParams]);
  if (!isCollection(section)) notFound();
  if (section === "logos") return (
    <>
      <AppHeader section={section} categories={[]} />
      <div className="flex flex-1 flex-col" data-home-page>
        <LogosGrid items={curatedLogos} />
      </div>
    </>
  );
  const category = typeof filters.category === "string" ? filters.category || undefined : undefined;
  const [categories, initialPage] = await Promise.all([
    getCategories(section),
    getGalleryPosts({ section, category }),
  ]);
  if (category && !categories.some((item) => item.slug === category)) notFound();
  return (
    <>
      <AppHeader section={section} categories={categories} activeCategory={category} />
      <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6" data-home-page>
        <Gallery key={`${section}:${category ?? "all"}`} section={section} category={category} categories={categories} initialPage={initialPage} />
      </div>
    </>
  );
}
