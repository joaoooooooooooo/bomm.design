"use client";

import * as React from "react";

import { AppHeader } from "@/app/Features/sidebar/components/app-header";
import { AppSidebar } from "@/app/Features/sidebar/components/app-sidebar";
import {
  shellNavGroups,
  type PrototypeTabId,
} from "@/app/Features/sidebar/libs/shell-data";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const initialTabId: PrototypeTabId = shellNavGroups[0]?.items[0]?.id ?? "design";
function getActiveTabTitle(activeTabId: PrototypeTabId): string {
  return (
    shellNavGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === activeTabId)?.title ?? "Design"
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeTabId, setActiveTabId] =
    React.useState<PrototypeTabId>(initialTabId);

  return (
    <SidebarProvider>
      <AppSidebar
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
      />
      <SidebarInset>
        <AppHeader page={getActiveTabTitle(activeTabId)} />
        <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
