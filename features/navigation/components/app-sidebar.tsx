"use client";

import { memo, useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetPopup, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSelectedLayoutSegment } from "next/navigation";
import { BomboCharacter } from "@/features/navigation/components/bombo-character";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const content = (mobile: boolean) => (
    <>
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
            mobile={mobile}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <SidebarFooterLinks />
        <div className="px-3 pb-3 pt-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <>
      <Sidebar className="*:data-[slot=sidebar-inner]:bg-background" collapsible="none" variant="sidebar">
        {content(false)}
      </Sidebar>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="fixed inset-x-0 top-0 z-30 border-b border-border bg-background pt-[env(safe-area-inset-top)] md:hidden">
          <div className="flex h-16 items-center px-3">
            <SheetTrigger render={<Button variant="ghost" className="h-11 gap-2 px-3 text-sm font-normal sm:h-11" />}>
              <ListIcon aria-hidden="true" className="size-4" />
              Menu
            </SheetTrigger>
          </div>
        </div>
        <SheetPopup
          side="left"
          showCloseButton={false}
          className="h-dvh w-full max-w-none border-0 bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out data-starting-style:-translate-x-full data-ending-style:-translate-x-full data-starting-style:opacity-100 data-ending-style:opacity-100 motion-reduce:transition-none motion-reduce:data-starting-style:translate-x-0 motion-reduce:data-ending-style:translate-x-0"
        >
          <div className="flex h-16 shrink-0 items-center border-b border-border px-3">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetClose render={<Button variant="ghost" className="h-11 gap-2 px-3 text-sm font-normal sm:h-11" />}>
              <XIcon aria-hidden="true" className="size-4" />
              Close
            </SheetClose>
          </div>
          {content(true)}
        </SheetPopup>
      </Sheet>
    </>
  );
});
