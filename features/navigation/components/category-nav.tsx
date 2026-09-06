import Link from "next/link";
import { cn } from "@/lib/utils";
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
    <nav aria-label="Categories" className="flex min-w-0 items-end gap-1 overflow-x-auto">
      {links.map(({ slug, name, href }) => {
        const active = slug === (activeCategory ?? "");
        return (
          <Link key={slug} href={href} aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-13 shrink-0 items-center whitespace-nowrap px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}>
            {name}
            {active && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
