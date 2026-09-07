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
import { useMediaQuery } from "@/hooks/use-media-query";
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
  const isMobile = useMediaQuery("(width < 48rem)");
  const dragOffset = useMotionValue(0);
  const detailsDragRatio = useMotionValue(CAROUSEL_DETAILS_DRAG_RATIO);
  const carouselTranslate = useTransform(() => isMobile ? `0px ${dragOffset.get()}px` : `${dragOffset.get()}px 0px`);
  const detailsTranslate = useTransform(() => isMobile ? `0px ${-dragOffset.get() * detailsDragRatio.get()}px` : `${-dragOffset.get() * detailsDragRatio.get()}px 0px`);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsSizeRef = useRef(0);
  useLayoutEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    dragOffset.jump(0);
    detailsSizeRef.current = isMobile ? details.offsetHeight : details.offsetWidth;
    const observer = new ResizeObserver(([entry]) => {
      detailsSizeRef.current = isMobile
        ? entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height
        : entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width;
    });
    observer.observe(details);
    return () => observer.disconnect();
  }, [dragOffset, isMobile]);
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
          className="relative h-dvh w-full overflow-hidden bg-primary-foreground md:h-full md:bg-transparent"
        >
          <motion.div
            className="grid h-full min-h-0 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] touch-pan-y md:grid-cols-[minmax(0,0.7fr)_minmax(20rem,0.3fr)] md:grid-rows-1"
            onPointerDownCapture={(event) => {
              const target = event.target as Element;
              gesture.current.axis = "";
              gesture.current.side = isMobile
                ? target.closest("[data-mobile-dismiss-handle]") ? -1 : 0
                : target.closest("[data-dismiss-details]") ? -1 : 1;
              if (event.button !== 0) gesture.current.side = 0;
              if (target.closest(
                "button, a, input, textarea, select, video[controls], [contenteditable=true], [role=slider]",
              )) gesture.current.side = 0;
            }}
            onPanStart={() => {
              if (!gesture.current.side) return;
              dragOffset.stop();
              detailsDragRatio.set(gesture.current.side === 1 ? CAROUSEL_DETAILS_DRAG_RATIO : 1);
              gesture.current.origin = dragOffset.get();
            }}
            onPan={(_event, info) => {
              const current = gesture.current;
              if (!current.side || isClosing.current) return;
              if (!current.axis) {
                if (Math.max(Math.abs(info.offset.x), Math.abs(info.offset.y)) < 8) return;
                current.axis = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? "x" : "y";
              }
              if (current.axis === (isMobile ? "y" : "x")) {
                const next = current.origin + (isMobile ? info.offset.y : info.offset.x) * current.side;
                // Negative offset separates the panels along the current axis.
                dragOffset.set(next <= 0 ? next : 32 * (1 - Math.exp(-next / 160)));
                const detailsSize = detailsSizeRef.current;
                if (detailsSize && -dragOffset.get() * detailsDragRatio.get() >= (isMobile ? Math.max(48, detailsSize * 0.15) : detailsSize * 0.1)) {
                  isClosing.current = true;
                  onClose();
                }
              }
            }}
            onPanEnd={() => {
              if (!gesture.current.side || isClosing.current) return;
              if (reduceMotion) {
                dragOffset.jump(0);
                return;
              }
              void animate(dragOffset, 0, {
                type: "spring",
                bounce: 0,
                visualDuration: 0.25,
              });
            }}
          >
            <motion.section
              aria-label="Collection media"
              className="relative z-10 min-h-0 pt-[env(safe-area-inset-top)] md:pt-0"
              style={{ translate: carouselTranslate, willChange: "translate" }}
              initial={false}
              exit={{
                transform: reduceMotion ? "none" : isMobile ? "translateY(-100dvh)" : "translateX(-100vw)",
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
              initial={{ transform: reduceMotion ? "none" : isMobile ? "translateY(48px)" : "translateX(48px)" }}
              animate={{ transform: "none" }}
              exit={{
                transform: reduceMotion ? "none" : isMobile ? "translateY(100dvh)" : "translateX(100vw)",
                transition: exitTransition,
              }}
              transition={transition}
              className="relative z-20 flex h-full min-h-0 flex-col rounded-t-2xl border-t border-border bg-background pt-14 text-foreground after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-dvh after:bg-background md:z-auto md:overflow-hidden md:rounded-none md:border-l md:border-t-0 md:pt-10 md:after:hidden"
            >
              <div data-mobile-dismiss-handle className="absolute inset-x-14 top-0 flex h-12 touch-none select-none items-center justify-center md:hidden">
                <DragHandle orientation="horizontal" />
              </div>
              <DragHandle
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 md:block"
                orientation="vertical"
              />
              <DialogClose
                aria-label="Close"
                className="absolute end-4 top-3 z-20 md:top-4"
                render={<Button size="icon" variant="ghost" />}
              >
                <XIcon />
              </DialogClose>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-10 md:pb-10">
                <MediaDialogDetails categories={categories} item={activeItem} />
              </div>
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
