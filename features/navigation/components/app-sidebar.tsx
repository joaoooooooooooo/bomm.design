"use client";

import { memo } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSelectedLayoutSegment } from "next/navigation";
import { BomboCharacter } from "@/features/navigation/components/bombo-character";
import { LatestChange } from "@/features/navigation/components/latest-change";
import { NavGroup } from "@/features/navigation/components/nav-group";
import { TabItem } from "@/components/ui/tab-items";
import {
  shellNavGroups,
  defaultCollection,
  isCollection,
} from "@/features/navigation/sections";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import type { BomboColorVariant } from "@/features/navigation/components/bombo-character";
import type { TabItemIconVariant } from "@/components/ui/tab-items";
import { shellFooterItems } from "@/features/navigation/sections";

function SidebarFooterLinks() {
  return (
    <div className="border-t border-sidebar-border px-2 py-2">
      <div className="flex flex-col gap-1">
        {shellFooterItems.map((item) => (
          <TabItem
            key={item.title}
            iconName={item.iconName}
            label={item.title}
            variant="inactive"
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}

function getActiveTabVariant(activeTabId: string): BomboColorVariant {
  const activeItem = shellNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === activeTabId);

  const variant = activeItem?.iconVariant as TabItemIconVariant | undefined;

  if (variant === "orange" || variant === "pink" || variant === "teal") {
    return variant;
  }

  return "blue";
}

function SidebarCharacter({ paused }: { paused?: boolean }) {
  const segment = useSelectedLayoutSegment();
  const activeSection = segment && isCollection(segment) ? segment : defaultCollection;
  return (
    <BomboCharacter paused={paused} className="aspect-square size-[120px]" colorVariant={getActiveTabVariant(activeSection)} />
  );
}

export const AppSidebar = memo(function AppSidebar({ animationPaused }: { animationPaused?: boolean }) {
  return (
    <Sidebar className="*:data-[slot=sidebar-inner]:bg-background" collapsible="none" variant="sidebar">
      <SidebarContent className="gap-3 py-2">
        <div className="px-3 pt-2">
          <div className="flex justify-start">
            <SidebarCharacter paused={animationPaused} />
          </div>
        </div>
        {shellNavGroups.map((group) => (
          <NavGroup
            key={group.label}
            {...group}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <LatestChange />
        <SidebarFooterLinks />
        <div className="px-3 pb-3 pt-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
});
