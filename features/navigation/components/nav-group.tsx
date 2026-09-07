"use client";

import { TabItem } from "@/components/ui/tab-items";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type {
  ShellNavGroup,
} from "@/features/navigation/sections";

export function NavGroup({ items, label }: ShellNavGroup) {
  const activeItemId = useSelectedLayoutSegment();

  return (
    <nav aria-label={label} className="space-y-1 px-2 py-1">
      {items.map((item) => (
        <TabItem
          key={item.title}
          iconName={item.iconName}
          iconVariant={item.iconVariant}
          label={item.title}
          render={<Link href={item.href} />}
          aria-current={item.id === activeItemId ? "page" : undefined}
          variant={item.id === activeItemId ? "active" : "inactive"}
          className="w-full"
          data-sidebar="menu-button"
        />
      ))}
    </nav>
  );
}
