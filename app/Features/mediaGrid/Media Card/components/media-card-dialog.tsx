"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogViewport,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { DialogPrimitive } from "@/components/ui/dialog";
import type { MediaCardItem } from "./media-card";
import { MediaCarousel } from "./media-carousel";
import { MediaDialogDetails } from "./media-dialog-details";

function FixedMediaDialogContent({
  debug,
  items,
  selectedIndex,
}: {
  debug: boolean;
  items: readonly MediaCardItem[];
  selectedIndex: number;
}) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const activeItem = items[activeIndex];

  if (!activeItem) return null;

  return (
    <>
      <DialogBackdrop className="bg-background/95 transition-none" />
      <DialogViewport className="block p-0">
        <DialogPrimitive.Popup
          className="relative h-full w-full overflow-hidden bg-background text-foreground outline-none"
          data-debug={debug || undefined}
          data-slot="media-card-dialog"
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] md:grid-rows-1">
            <section aria-label="Collection media" className="min-h-0">
              <MediaCarousel
                activeIndex={activeIndex}
                items={items}
                onActiveIndexChange={setActiveIndex}
              />
            </section>
            <MediaDialogDetails
              item={activeItem}
              position={activeIndex + 1}
              total={items.length}
            />
          </div>
          <DialogClose
            aria-label="Close"
            className="absolute end-4 top-[max(1rem,env(safe-area-inset-top))] z-20"
            render={<Button size="icon" variant="ghost" />}
          >
            <XIcon />
          </DialogClose>
        </DialogPrimitive.Popup>
      </DialogViewport>
    </>
  );
}

export function MediaCardDialog({
  debug = false,
  items,
  onOpenChange,
  open,
  selectedIndex,
}: {
  debug?: boolean;
  items: readonly MediaCardItem[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedIndex: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {open ? (
          <FixedMediaDialogContent
            debug={debug}
            items={items}
            key={items[selectedIndex]?.id}
            selectedIndex={selectedIndex}
          />
        ) : null}
      </DialogPortal>
    </Dialog>
  );
}
