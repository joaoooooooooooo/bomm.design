import type {
  SidebarItemIconName,
  SidebarItemIconVariant,
} from "@/app/Features/sidebar/components/sidebar-item";

export type PrototypeTabId = "design" | "websites" | "tools";

export type ShellNavItem = {
  id: PrototypeTabId;
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
    label: "Prototype",
    items: [
      {
        id: "design",
        title: "Design",
        href: "#/design",
        iconName: "pen-nib",
        iconVariant: "blue",
      },
      {
        id: "websites",
        title: "Websites",
        href: "#/websites",
        iconName: "globe",
        iconVariant: "orange",
      },
      {
        id: "tools",
        title: "Tools",
        href: "#/tools",
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
