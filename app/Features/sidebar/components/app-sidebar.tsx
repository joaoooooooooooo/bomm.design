"use client";

import { BomboCharacter } from "@/app/Features/riveBombo/bombo-character";
import { LatestChange } from "@/app/Features/sidebar/components/latest-change";
import { NavGroup } from "@/app/Features/sidebar/components/nav-group";
import { SidebarItem } from "@/app/Features/sidebar/components/sidebar-item";
import {
  shellNavGroups,
  type PrototypeTabId,
} from "@/app/Features/sidebar/libs/shell-data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import type { BomboColorVariant } from "@/app/Features/riveBombo/bombo-character";
import type { SidebarItemIconVariant } from "@/app/Features/sidebar/components/sidebar-item";
import { shellFooterItems } from "@/app/Features/sidebar/libs/shell-data";
import { cn } from "@/lib/utils";

function SidebarFooterLinks() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="border-t border-sidebar-border px-2 py-2">
      <div className="flex flex-col gap-1">
        {shellFooterItems.map((item) => (
          <SidebarItem
            key={item.title}
            iconName={item.iconName}
            label={item.title}
            state={isCollapsed ? "collapsed-inactive" : "inactive"}
          />
        ))}
      </div>
    </div>
  );
}

function getActiveTabVariant(activeTabId: PrototypeTabId): BomboColorVariant {
  const activeItem = shellNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === activeTabId);

  const variant = activeItem?.iconVariant as SidebarItemIconVariant | undefined;

  if (variant === "orange" || variant === "pink") {
    return variant;
  }

  return "blue";
}

export function AppSidebar({
  activeTabId,
  onSelectTab,
}: {
  activeTabId: PrototypeTabId;
  onSelectTab: (itemId: PrototypeTabId) => void;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="*:data-[slot=sidebar-inner]:bg-card" collapsible="icon" variant="sidebar">
      <SidebarContent className="gap-3 py-2">
        <div className={cn("pt-2", isCollapsed ? "px-2" : "px-3")}>
          <div className={cn("flex", isCollapsed ? "justify-start" : "justify-start")}>
            <BomboCharacter
              className={cn(
                "aspect-square transition-[width,height] duration-200 ease-in-out",
                isCollapsed ? "size-20px" : "size-[120px]",
              )}
              colorVariant={getActiveTabVariant(activeTabId)}
            />
          </div>
        </div>
        {shellNavGroups.map((group) => (
          <NavGroup
            key={group.label}
            {...group}
            activeItemId={activeTabId}
            onSelect={onSelectTab}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <LatestChange />
        <SidebarFooterLinks />
      </SidebarFooter>
    </Sidebar>
  );
}
