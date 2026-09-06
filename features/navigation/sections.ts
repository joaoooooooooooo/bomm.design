import type {
  SidebarItemIconName,
  SidebarItemIconVariant,
} from "@/features/navigation/components/sidebar-item";

import type { SectionId } from "@/features/gallery/types";

export const defaultSection: SectionId = "design";

export function isSection(value: string): value is SectionId {
  return value === "design" || value === "websites" || value === "tools";
}

export const sectionDetails: Record<SectionId, { title: string; introduction: string }> = {
  design: { title: "Design", introduction: "Curadoria humana e sem compromisso de bons designs do Brasil (e do mundo)" },
  websites: { title: "Websites", introduction: "Sites do Brasil (e do mundo) para explorar e se inspirar" },
  tools: { title: "Tools", introduction: "Ferramentas para criar, experimentar e tirar ideias do papel" },
};

export type ShellNavItem = {
  id: SectionId;
  title: string;
  href: string;
  iconName: SidebarItemIconName;
  iconVariant: SidebarItemIconVariant;
};

export type ShellNavGroup = {
  label: string;
  items: ShellNavItem[];
};

export const shellNavGroups: ShellNavGroup[] = [
  {
    label: "Gallery",
    items: [
      {
        id: "design",
        title: "Design",
        href: "/design",
        iconName: "pen-nib",
        iconVariant: "blue",
      },
      {
        id: "websites",
        title: "Websites",
        href: "/websites",
        iconName: "globe",
        iconVariant: "orange",
      },
      {
        id: "tools",
        title: "Tools",
        href: "/tools",
        iconName: "hammer",
        iconVariant: "pink",
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
