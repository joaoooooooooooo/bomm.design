import type {
  TabItemIconName,
  TabItemIconVariant,
} from "@/components/ui/tab-items";

import type { CollectionId } from "@/features/gallery/types";

export const defaultCollection: CollectionId = "design";

export function isCollection(value: string): value is CollectionId {
  return value === "design" || value === "websites" || value === "tools" || value === "logos";
}

export const collectionDetails: Record<CollectionId, { title: string; introduction: string; iconVariant: TabItemIconVariant }> = {
  logos: { title: "Logos", introduction: "Marcas que ficam na cabeça. Uma coleção de logos para explorar e se inspirar", iconVariant: "teal" },
  design: { title: "Design", introduction: "Curadoria humana e sem compromisso de bons designs do Brasil (e do mundo)", iconVariant: "blue" },
  websites: { title: "Websites", introduction: "Sites do Brasil (e do mundo) para explorar e se inspirar", iconVariant: "orange" },
  tools: { title: "Tools", introduction: "Ferramentas para criar, experimentar e tirar ideias do papel", iconVariant: "pink" },
};

const designCategoryIcons: Partial<Record<string, TabItemIconName>> = {
  "": "circles-four",
  branding: "copyright",
  print: "printer",
  illustration: "scribble-loop",
  interface: "layout",
  "3d": "cube",
  objects: "chair",
  product: "device-mobile-speaker",
  logos: "square-logo",
  motion: "wave-sine",
};

const websiteCategoryIcons: Partial<Record<string, TabItemIconName>> = {
  "": "circles-four",
  portfolio: "user",
  agency: "users-three",
  saas: "graph",
  blog: "article",
  "e-commerce": "shopping-bag",
  "artificial-intelligence": "sparkle",
  "art-and-design": "palette",
};

const toolsCategoryIcons: Partial<Record<string, TabItemIconName>> = {
  "": "circles-four",
  "web-design-tools": "palette",
  mockups: "signpost",
  "ui-components": "diamonds-four",
  "design-tools": "bounding-box",
  "design-courses": "graduation-cap",
  "icons-and-illustrations": "image",
  "fonts-and-typography": "text-aa",
  books: "book-bookmark",
  inspiration: "lightbulb-filament",
  "dev-tools": "code",
  "design-system": "pencil-circle",
  productivity: "lightning",
  motion: "scribble-loop",
  blogs: "book-open-text",
  community: "users-four",
};

/** Shared presentation for category slugs supplied by the gallery data source. */
export function getCategoryPresentation(section: CollectionId, slug: string) {
  const icons = section === "design" ? designCategoryIcons : section === "websites" ? websiteCategoryIcons : toolsCategoryIcons;
  return {
    iconName: icons[slug] ?? "bookmark-simple",
    iconVariant: collectionDetails[section].iconVariant,
    iconWeight: "regular" as const,
  };
}
export type ShellNavItem = {
  id: CollectionId;
  title: string;
  href: string;
  iconName: TabItemIconName;
  iconVariant: TabItemIconVariant;
};

export type ShellNavGroup = {
  label: string;
  items: ShellNavItem[];
};

export const shellNavGroups: ShellNavGroup[] = [
  {
    label: "Collections",
    items: [
      {
        id: "design",
        title: "Design",
        href: "/design",
        iconName: "pen-nib",
        iconVariant: collectionDetails.design.iconVariant,
      },
      {
        id: "websites",
        title: "Websites",
        href: "/websites",
        iconName: "globe",
        iconVariant: collectionDetails.websites.iconVariant,
      },
      {
        id: "tools",
        title: "Tools",
        href: "/tools",
        iconName: "hammer",
        iconVariant: collectionDetails.tools.iconVariant,
      },
      {
        id: "logos",
        title: "Logos",
        href: "/logos",
        iconName: "square-logo",
        iconVariant: collectionDetails.logos.iconVariant,
      },
    ],
  },
];

export const shellFooterItems: ShellNavItem[] = [
  {
    id: "design",
    title: "Help Center",
    href: "#/help",
    iconName: "question",
    iconVariant: "blue",
  },
  {
    id: "tools",
    title: "Documentation",
    href: "#/documentation",
    iconName: "book-open",
    iconVariant: "pink",
  },
];
