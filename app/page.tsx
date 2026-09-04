"use client";

import * as React from "react";
import { AppHeader } from "@/app/Features/sidebar/components/app-header";
import { NavigationShell } from "@/app/Features/sidebar/components/navigation-shell";
import {
  shellNavGroups,
  type PrototypeTabId,
} from "@/app/Features/sidebar/libs/shell-data";
import { InfiniteMasonryPreview } from "@/app/MediaGrid";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Agentation } from "agentation";

const initialTabId: PrototypeTabId = shellNavGroups[0]?.items[0]?.id ?? "design";

function getActiveTabTitle(activeTabId: PrototypeTabId): string {
  return (
    shellNavGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === activeTabId)?.title ?? "Design"
  );
}

export default function Home() {
  const [activeTabId, setActiveTabId] =
    React.useState<PrototypeTabId>(initialTabId);

  return (
    <SidebarProvider>
      <NavigationShell
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
      />
      <SidebarInset>
        <AppHeader page={getActiveTabTitle(activeTabId)} />
        <main className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full">
            <InfiniteMasonryPreview />
          </div>
        </main>
      </SidebarInset>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </SidebarProvider>
  );
}
