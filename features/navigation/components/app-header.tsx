import type { Category, SectionId } from "@/features/gallery/types";
import { sectionDetails } from "../sections";
import { CategoryNav } from "./category-nav";

export function AppHeader({ section, categories, activeCategory }: {
  section: SectionId;
  categories: Category[];
  activeCategory?: string;
}) {
  return (
    <>
      <header className="flex max-w-xl flex-col gap-4 px-4 pb-12 pt-8 md:px-6" data-section-header={section}>
        <h1 className="font-normal text-3xl">{sectionDetails[section].introduction}</h1>
      </header>
      <div className="sticky top-0 z-20 mb-4 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6">
        <CategoryNav section={section} categories={categories} activeCategory={activeCategory} />
      </div>
    </>
  );
}
