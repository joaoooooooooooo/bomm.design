"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogPrimitive,
  DialogViewport,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DragHandle } from "@/components/ui/drag-handle";
import { XIcon } from "lucide-react";
import type { Category, GalleryPost } from "../types";
import { MediaCarousel } from "./media-carousel";
import { MediaDialogDetails } from "./media-dialog-details";
import type { VideoHandoff } from "./media-preview";

const CAROUSEL_DETAILS_DRAG_RATIO = 0.2;

function MediaDialogContent({
  categories,
  items,
  onClose,
  selectedIndex,
  videoHandoff,
}: {
  categories: readonly Category[];
  items: readonly GalleryPost[];
  onClose: () => void;
  selectedIndex: number;
  videoHandoff?: VideoHandoff;
}) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const detailsDragRatio = useMotionValue(CAROUSEL_DETAILS_DRAG_RATIO);
  const carouselTranslate = useTransform(() => `${x.get()}px 0px`);
  const detailsTranslate = useTransform(() => `${-x.get() * detailsDragRatio.get()}px 0px`);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsWidthRef = useRef(0);
  useLayoutEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    detailsWidthRef.current = details.offsetWidth;
    const observer = new ResizeObserver(([entry]) => {
      detailsWidthRef.current = entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width;
    });
    observer.observe(details);
    return () => observer.disconnect();
  }, []);
  const isClosing = useRef(false);
  const gesture = useRef({ side: 1, origin: 0, axis: "" });
  const transition = { duration: reduceMotion ? 0 : 0.25 };
  const exitTransition = {
    type: "tween",
    duration: reduceMotion ? 0 : 0.18,
    ease: "easeIn",
  } as const;
  const activeItem = items[activeIndex];

  if (!activeItem) return null;

  return (
    <>
      <DialogBackdrop className="bg-primary-foreground data-ending-style:duration-180 motion-reduce:duration-0" />
      <DialogViewport className="block p-0" render={<motion.div layoutRoot />}>
        <DialogPrimitive.Popup
          className="relative h-full w-full overflow-hidden bg-transparent"
        >
          <motion.div
            className="grid h-full min-h-0 touch-pan-y md:grid-cols-[minmax(0,0.7fr)_minmax(20rem,0.3fr)]"
            onPointerDownCapture={(event) => {
              const target = event.target as Element;
              gesture.current.axis = "";
              gesture.current.side = target.closest("[data-dismiss-details]") ? -1 : 1;
              if (event.button !== 0) gesture.current.side = 0;
              if (target.closest(
                "button, a, input, textarea, select, video[controls], [contenteditable=true], [role=slider]",
              )) gesture.current.side = 0;
            }}
            onPanStart={() => {
              if (!gesture.current.side) return;
              x.stop();
              detailsDragRatio.set(gesture.current.side === 1 ? CAROUSEL_DETAILS_DRAG_RATIO : 1);
              gesture.current.origin = x.get();
            }}
            onPan={(_event, info) => {
              const current = gesture.current;
              if (!current.side || isClosing.current) return;
              if (!current.axis) {
                if (Math.max(Math.abs(info.offset.x), Math.abs(info.offset.y)) < 8) return;
                current.axis = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? "x" : "y";
              }
              if (current.axis === "x") {
                const next = current.origin + info.offset.x * current.side;
                // Both panels move outward for negative x. Resist inward movement.
                x.set(next <= 0 ? next : 32 * (1 - Math.exp(-next / 160)));
                const detailsWidth = detailsWidthRef.current;
                if (detailsWidth && -x.get() * detailsDragRatio.get() >= detailsWidth * 0.1) {
                  isClosing.current = true;
                  onClose();
                }
              }
            }}
            onPanEnd={() => {
              if (!gesture.current.side || isClosing.current) return;
              if (reduceMotion) {
                x.jump(0);
                return;
              }
              void animate(x, 0, {
                type: "spring",
                bounce: 0,
                visualDuration: 0.25,
              });
            }}
          >
            <motion.section
              aria-label="Collection media"
              className="relative z-10 min-h-0"
              style={{ translate: carouselTranslate, willChange: "translate" }}
              initial={false}
              exit={{
                transform: reduceMotion ? "none" : "translateX(-100vw)",
                transition: exitTransition,
              }}
              transition={transition}
            >
              <MediaCarousel
                activeIndex={activeIndex}
                items={items}
                sharedItemId={items[selectedIndex]?.id}
                videoHandoff={videoHandoff}
                onActiveIndexChange={setActiveIndex}
                onDismiss={onClose}
              />
            </motion.section>
            <motion.div
              ref={detailsRef}
              data-dismiss-details
              style={{ translate: detailsTranslate, willChange: "translate" }}
              initial={{ transform: reduceMotion ? "none" : "translateX(48px)" }}
              animate={{ transform: reduceMotion ? "none" : "translateX(0px)" }}
              exit={{
                transform: reduceMotion ? "none" : "translateX(100vw)",
                transition: exitTransition,
              }}
              transition={transition}
              className="relative flex h-full min-h-0 flex-col gap-8 overflow-y-auto bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:border-l md:border-border md:px-10 md:py-10"
            >
              <DragHandle
                className="absolute left-3 top-1/2 -translate-y-1/2"
                orientation="vertical"
              />
              <MediaDialogDetails
                categories={categories}
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
              />
            </motion.div>
          </motion.div>
        </DialogPrimitive.Popup>
      </DialogViewport>
    </>
  );
}

export function MediaCardDialog({
  categories,
  items,
  onExitComplete,
  onOpenChange,
  open,
  selectedIndex,
  videoHandoff,
}: {
  categories: readonly Category[];
  items: readonly GalleryPost[];
  onExitComplete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedIndex: number;
  videoHandoff?: VideoHandoff;
}) {
  const actionsRef = useRef<DialogPrimitive.Root.Actions>(null);

  return (
    <Dialog
      actionsRef={actionsRef}
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen) details.preventUnmountOnClose();
        onOpenChange(nextOpen);
      }}
      open={open}
    >
      <AnimatePresence onExitComplete={() => {
        actionsRef.current?.unmount();
        onExitComplete();
      }}>
        {open ? (
          <DialogPortal keepMounted key={items[selectedIndex]?.id}>
            <MediaDialogContent
              categories={categories}
              items={items}
              onClose={() => actionsRef.current?.close()}
              selectedIndex={selectedIndex}
              videoHandoff={videoHandoff}
            />
          </DialogPortal>
        ) : null}
      </AnimatePresence>
    </Dialog>
  );
}
