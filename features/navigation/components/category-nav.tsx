import Link from "next/link";
import { TabItem } from "@/components/ui/tab-items";
import { sectionDetails } from "../sections";
import type { Category, SectionId } from "@/features/gallery/types";

export function CategoryNav({ section, categories, activeCategory }: {
  section: SectionId;
  categories: Category[];
  activeCategory?: string;
}) {
  const links = [
    { slug: "", name: "All", href: `/${section}` },
    ...categories.map(({ slug, name }) => ({ slug, name, href: `/${section}?category=${encodeURIComponent(slug)}` })),
  ];
  return (
    <nav aria-label="Categories" className="flex min-w-0 items-center gap-2 overflow-x-auto py-1">
      {links.map(({ slug, name, href }) => {
        const active = slug === (activeCategory ?? "");
        return (
          <TabItem
            key={slug}
            label={name}
            iconName="bookmark-simple"
            iconVariant={sectionDetails[section].iconVariant}
            variant={active ? "active" : "inactive"}
            size="md"
            render={<Link href={href} />}
            aria-current={active ? "page" : undefined}
          />
        );
      })}
    </nav>
  );
}
