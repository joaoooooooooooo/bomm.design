"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Agentation } from "agentation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GalleryDialogActivityContext } from "@/features/gallery/dialog-activity";
import { AppSidebar } from "./app-sidebar";

/** Shared by every section; navigation never replaces the sidebar. */
export function NavigationShell({ children }: { children: ReactNode }) {
  const [isDialogActive, setIsDialogActive] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <GalleryDialogActivityContext.Provider value={setIsDialogActive}>
        <SidebarProvider style={{ "--sidebar-width": "216px" } as CSSProperties}>
          <AppSidebar animationPaused={isDialogActive} />
          <SidebarInset className="min-w-0 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0">{children}</SidebarInset>
          {process.env.NODE_ENV === "development" && <Agentation />}
        </SidebarProvider>
      </GalleryDialogActivityContext.Provider>
    </MotionConfig>
  );
}
