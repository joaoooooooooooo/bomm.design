"use client";

import { SidebarItem } from "@/features/navigation/components/sidebar-item";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import type {
  ShellNavGroup,
} from "@/features/navigation/sections";

export function NavGroup({ items }: ShellNavGroup) {
  const activeItemId = useSelectedLayoutSegment();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="space-y-1 px-2 py-1">
      {items.map((item) => (
        <SidebarItem
          key={item.title}
          iconName={item.iconName}
          iconVariant={item.iconVariant}
          label={item.title}
          render={<Link href={item.href} />}
          aria-current={item.id === activeItemId ? "page" : undefined}
          state={
            isCollapsed
              ? item.id === activeItemId
                ? "collapsed"
                : "collapsed-inactive"
              : item.id === activeItemId
                ? "active"
                : "inactive"
          }
        />
      ))}
    </div>
  );
}
