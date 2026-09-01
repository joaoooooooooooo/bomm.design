"use client";

import { SidebarItem } from "@/app/Features/sidebar/components/sidebar-item";
import { useSidebar } from "@/components/ui/sidebar";
import type {
  PrototypeTabId,
  ShellNavGroup,
} from "@/app/Features/sidebar/libs/shell-data";

export function NavGroup({
  activeItemId,
  items,
  onSelect,
}: ShellNavGroup & {
  activeItemId: PrototypeTabId;
  onSelect: (itemId: PrototypeTabId) => void;
}) {
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
          onClick={() => onSelect(item.id)}
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
