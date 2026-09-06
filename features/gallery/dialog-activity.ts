"use client";

import { createContext, useContext } from "react";

export const GalleryDialogActivityContext = createContext<((active: boolean) => void) | null>(null);

export function useGalleryDialogActivity() {
  const onDialogActiveChange = useContext(GalleryDialogActivityContext);
  if (!onDialogActiveChange) throw new Error("Gallery must be inside NavigationShell");
  return onDialogActiveChange;
}
