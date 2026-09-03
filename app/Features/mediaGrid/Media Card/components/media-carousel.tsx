"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";
import type { MediaCardItem } from "./media-card";
import { MediaPreview } from "./media-preview";

const GAP = 16;
const SLIDE_HEIGHT_RATIO = 0.68;
const MOMENTUM_PROJECTION = 0.35;
const SNAP_TRANSITION = { type: "spring", bounce: 0, visualDuration: 0.24 } as const;
const DRAG_INERTIA = {
  bounceDamping: 28,
  bounceStiffness: 560,
  power: MOMENTUM_PROJECTION,
  timeConstant: 95,
} as const;

type MediaCarouselProps = {
  activeIndex: number;
  items: readonly MediaCardItem[];
  onActiveIndexChange: (index: number) => void;
};

function clampIndex(index: number, itemCount: number) {
  return Math.max(0, Math.min(index, itemCount - 1));
}

function CarouselSlide({
  index,
  item,
  pitch,
  slideHeight,
  trackY,
  shouldPlay,
}: {
  index: number;
  item: MediaCardItem;
  pitch: number;
  slideHeight: number;
  shouldPlay: boolean;
  trackY: MotionValue<number>;
}) {
  const safePitch = Math.max(1, pitch);
  const centerOffset = -index * safePitch;
  const range = [
    centerOffset - safePitch,
    centerOffset,
    centerOffset + safePitch,
  ];
  const scale = useTransform(trackY, range, [0.86, 1, 0.86]);
  const opacity = useTransform(
    trackY,
    range,
    [0.36, 1, 0.36],
  );

  return (
    <motion.div
      className="mx-4 shrink-0 overflow-hidden rounded-2xl outline outline-1 outline-white/10"
      style={{ height: slideHeight, opacity, scale }}
    >
      <MediaPreview
        autoPlay={shouldPlay}
        fit="contain"
        media={item.media}
        preload={shouldPlay ? "auto" : "metadata"}
      />
    </motion.div>
  );
}

export function MediaCarousel({
  activeIndex,
  items,
  onActiveIndexChange,
}: MediaCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const initialIndexRef = useRef(activeIndex);
  const hasInitiallyPositionedRef = useRef(false);
  const isMomentumSnapRef = useRef(false);
  const skipNextIndexSyncRef = useRef(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const y = useMotionValue(0);
  const slideHeight = viewportHeight * SLIDE_HEIGHT_RATIO;
  const pitch = slideHeight + GAP;
  const inset = (viewportHeight - slideHeight) / 2;
  const maxOffset = Math.max(0, (items.length - 1) * pitch);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextHeight = entry.contentRect.height;
      if (!hasInitiallyPositionedRef.current && nextHeight > 0) {
        const initialPitch = nextHeight * SLIDE_HEIGHT_RATIO + GAP;
        y.jump(-initialIndexRef.current * initialPitch);
        hasInitiallyPositionedRef.current = true;
        skipNextIndexSyncRef.current = true;
        setIsReady(true);
      }
      setViewportHeight((current) =>
        Math.abs(current - nextHeight) < 1 ? current : nextHeight,
      );
    });

    observer.observe(viewport);
    return () => observer.disconnect();
  }, [y]);

  const snapTo = (index: number) => {
    const nextIndex = clampIndex(index, items.length);
    void animate(y, -nextIndex * pitch, SNAP_TRANSITION);
    if (nextIndex !== activeIndex) onActiveIndexChange(nextIndex);
  };

  useLayoutEffect(() => {
    if (pitch <= 0 || !hasInitiallyPositionedRef.current) return;
    if (skipNextIndexSyncRef.current) {
      skipNextIndexSyncRef.current = false;
      return;
    }
    if (isMomentumSnapRef.current) {
      isMomentumSnapRef.current = false;
      return;
    }
    void animate(y, -activeIndex * pitch, SNAP_TRANSITION);
  }, [activeIndex, pitch, y]);

  return (
    <div
      ref={viewportRef}
      className="relative h-full min-h-0 overflow-hidden bg-black"
    >
      <motion.div
        aria-label="Collection media. Drag vertically to browse items."
        aria-roledescription="carousel"
        drag={pitch > 0 ? "y" : false}
        dragConstraints={{ bottom: 0, top: -maxOffset }}
        dragElastic={0.08}
        dragMomentum
        dragTransition={{
          ...DRAG_INERTIA,
          modifyTarget: (target) =>
            -clampIndex(Math.round(-target / pitch), items.length) * pitch,
        }}
        onDragEnd={(_event, info) => {
          const projectedOffset =
            y.get() + info.velocity.y * MOMENTUM_PROJECTION;
          const nextIndex = clampIndex(
            Math.round(-projectedOffset / pitch),
            items.length,
          );

          if (nextIndex !== activeIndex) {
            isMomentumSnapRef.current = true;
            onActiveIndexChange(nextIndex);
          }
        }}
        onDragTransitionEnd={() => {
          const settledIndex = clampIndex(
            Math.round(-y.get() / pitch),
            items.length,
          );
          if (settledIndex !== activeIndex) onActiveIndexChange(settledIndex);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            snapTo(activeIndex + 1);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            snapTo(activeIndex - 1);
          }
        }}
        role="group"
        style={{
          paddingBottom: inset,
          paddingTop: inset,
          touchAction: "pan-x",
          visibility: isReady ? "visible" : "hidden",
          y,
        }}
        tabIndex={0}
        className="flex w-full cursor-grab flex-col gap-4 active:cursor-grabbing"
      >
        {items.map((item, index) => (
          <CarouselSlide
            key={item.id}
            index={index}
            item={item}
            pitch={pitch}
            slideHeight={slideHeight}
            shouldPlay={index === activeIndex}
            trackY={y}
          />
        ))}
      </motion.div>
    </div>
  );
}
