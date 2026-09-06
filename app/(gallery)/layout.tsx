import type { ReactNode } from "react";
import { NavigationShell } from "@/features/navigation/components/navigation-shell";
export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <NavigationShell>{children}</NavigationShell>;
}
