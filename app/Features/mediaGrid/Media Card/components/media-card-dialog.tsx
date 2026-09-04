"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogPrimitive,
  DialogViewport,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import type { MediaCardItem } from "./media-card";
import { MediaCarousel } from "./media-carousel";
import { MediaDialogDetails } from "./media-dialog-details";
import { motion } from "motion/react";

function FixedMediaDialogContent({
  items,
  onOpenChange,
  selectedIndex,
}: {
  items: readonly MediaCardItem[];
  onOpenChange: (open: boolean) => void;
  selectedIndex: number;
}) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const activeItem = items[activeIndex];

  if (!activeItem) return null;

  return (
    <>
      <DialogBackdrop className="bg-background/90" />
      <DialogViewport className="block p-0">
        <DialogPrimitive.Popup
          className="relative h-full w-full overflow-hidden bg-background/90 "
          onClick={() => onOpenChange(false)}

        >
          <div className="relative z-10 grid h-full justify-between md:grid-cols-[minmax(0,0.5fr)_minmax(20rem,0.3fr)] md:grid-rows-1">
            <section
              aria-label="Collection media"
              className="min-h-0"
              onClick={(event) => event.stopPropagation()}
            >
              <MediaCarousel
                activeIndex={activeIndex}
                items={items}
                onActiveIndexChange={setActiveIndex}
              />
            </section>
            
            <MediaDialogDetails
              closeControl={
                <DialogClose
                  aria-label="Close"
                  className="absolute end-4 top-4 z-20"
                  render={<Button size="icon" variant="ghost" />}
                >
                  <XIcon />
                </DialogClose>
              }
              item={activeItem}
              position={activeIndex + 1}
              total={items.length}
            />
          </div>
        </DialogPrimitive.Popup>
      </DialogViewport>
    </>
  );
}

export function MediaCardDialog({
  items,
  onOpenChange,
  open,
  selectedIndex,
}: {
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
            items={items}
            key={items[selectedIndex]?.id}
            onOpenChange={onOpenChange}
            selectedIndex={selectedIndex}
          />
        ) : null}
      </DialogPortal>
    </Dialog>
  );
}
