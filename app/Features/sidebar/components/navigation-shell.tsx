"use client";

import { AppSidebar } from "@/app/Features/sidebar/components/app-sidebar";
import type { PrototypeTabId } from "@/app/Features/sidebar/libs/shell-data";

/** Fixed sidebar navigation, composed beside page content. */
export function NavigationShell({
  activeTabId,
  onSelectTab,
}: {
  activeTabId: PrototypeTabId;
  onSelectTab: (itemId: PrototypeTabId) => void;
}) {
  return <AppSidebar activeTabId={activeTabId} onSelectTab={onSelectTab} />;
}
