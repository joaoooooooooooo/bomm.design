"use client";
import { useState, type ReactNode } from "react";
import { Agentation } from "agentation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GalleryDialogActivityContext } from "@/features/gallery/dialog-activity";
import { AppSidebar } from "./app-sidebar";

/** Shared by every section; navigation never replaces the sidebar. */
export function NavigationShell({ children }: { children: ReactNode }) {
  const [isDialogActive, setIsDialogActive] = useState(false);
  return (
    <GalleryDialogActivityContext.Provider value={setIsDialogActive}>
      <SidebarProvider>
        <AppSidebar animationPaused={isDialogActive} />
        <SidebarInset>{children}</SidebarInset>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </SidebarProvider>
    </GalleryDialogActivityContext.Provider>
  );
}
