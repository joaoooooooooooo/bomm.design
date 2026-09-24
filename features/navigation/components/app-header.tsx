import type { Category, CollectionId } from "@/features/gallery/types";
import { collectionDetails, shellNavGroups } from "../sections";
import { CategoryNav } from "./category-nav";
import { NavGroup } from "./nav-group";

export function AppHeader({ section, categories, activeCategory }: {
  section: CollectionId;
  categories: Category[];
  activeCategory?: string;
}) {
  return (
    <>
      <header className="flex max-w-xl flex-col gap-4 px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-8" data-section-header={section}>
        <h1 className="text-2xl font-normal md:text-3xl">{collectionDetails[section].introduction}</h1>
      </header>
      <div className="sticky top-0 z-20 mb-4 w-full shrink-0 bg-background pt-[env(safe-area-inset-top)] md:pt-0">
        <div className="border-b border-border md:hidden">
          {shellNavGroups.map((group) => <NavGroup key={group.label} {...group} mobile />)}
        </div>
        {section !== "logos" && (
          <div className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 md:px-6">
            <CategoryNav section={section} categories={categories} activeCategory={activeCategory} />
          </div>
        )}
      </div>
    </>
  );
}
