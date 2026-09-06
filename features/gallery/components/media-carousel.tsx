"use client";

import { useEffectEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  type MotionStyle,
  type MotionValue,
  useMotionValue,
  useDragControls,
  useTransform,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import type { GalleryPost } from "../types";
import { MediaPreview, type VideoHandoff } from "./media-preview";

const GAP = 16;
const SLIDE_HEIGHT_RATIO = 0.68;
const MOMENTUM_PROJECTION = 0.35;
const WHEEL_SNAP_THRESHOLD = 36;
const WHEEL_SNAP_COOLDOWN = 180;
const VIRTUAL_SLIDE_OVERSCAN = 2;
const SNAP_TRANSITION = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.24,
} as const;
const DRAG_INERTIA = {
  bounceDamping: 28,
  bounceStiffness: 560,
  power: MOMENTUM_PROJECTION,
  timeConstant: 95,
} as const;

const IMAGE_DRAG = { x: 18, y: 12, elastic: 0.18 } as const;

type MediaCarouselProps = {
  activeIndex: number;
  items: readonly GalleryPost[];
  onActiveIndexChange: (index: number) => void;
  onDismiss: () => void;
  sharedItemId?: string;
  videoHandoff?: VideoHandoff;
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
  top,
  shouldPlay,
  sharedItemId,
  onSharedAnimationComplete,
  isEntering,
  videoHandoff,
}: {
  index: number;
  item: GalleryPost;
  pitch: number;
  slideHeight: number;
  shouldPlay: boolean;
  top: number;
  trackY: MotionValue<number>;
  sharedItemId?: string;
  onSharedAnimationComplete: () => void;
  isEntering: boolean;
  videoHandoff?: VideoHandoff;
}) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const [mediaRatio, setMediaRatio] = useState(item.media.width / item.media.height);
  const safePitch = Math.max(1, pitch);
  const centerOffset = -index * safePitch;
  const range = [
    centerOffset - safePitch,
    centerOffset,
    centerOffset + safePitch,
  ];
  const scale = useTransform(trackY, range, [0.86, 1, 0.86]);
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);

  useEffect(() => {
    if (shouldPlay) return;
    imageX.jump(0);
    imageY.jump(0);
  }, [imageX, imageY, shouldPlay]);

  return (
    <motion.div
      className="absolute left-4 right-4 grid place-items-center [container-type:size]"
      style={{ height: slideHeight, scale: reduceMotion ? 1 : scale, top, "--media-ratio": mediaRatio } as MotionStyle}
    >
      <motion.div
        data-media-image
        className="h-[min(100cqh,calc(100cqw/var(--media-ratio)))] w-[min(100cqw,calc(100cqh*var(--media-ratio)))] cursor-grab rounded-2xl active:cursor-grabbing"
        drag={shouldPlay && !(reduceMotion && item.media.type === "video")}
        dragConstraints={{
          bottom: IMAGE_DRAG.y,
          left: -IMAGE_DRAG.x,
          right: IMAGE_DRAG.x,
          top: -IMAGE_DRAG.y,
        }}
        dragElastic={reduceMotion ? 0 : IMAGE_DRAG.elastic}
        dragMomentum={false}
        dragPropagation
        onDragEnd={() => {
          if (reduceMotion) {
            imageX.jump(0);
            imageY.jump(0);
            return;
          }
          void animate(imageX, 0, SNAP_TRANSITION);
          void animate(imageY, 0, SNAP_TRANSITION);
        }}
        style={{
          x: imageX,
          y: imageY,
          "--media-ratio": mediaRatio,
        } as MotionStyle}
      >
        <motion.div
          layoutId={isEntering && isPresent && !reduceMotion && item.id === sharedItemId ? `media-${item.id}` : undefined}
          layoutCrossfade={false}
          className="relative h-full w-full overflow-hidden rounded-2xl"
          style={{ borderRadius: "var(--radius-2xl)" }}
          transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
          onLayoutAnimationComplete={onSharedAnimationComplete}
        >
        <MediaPreview
          autoPlay={shouldPlay}
          controls={Boolean(reduceMotion && shouldPlay)}
          className="h-full w-full rounded-2xl"
          fit="contain"
          media={item.media}
          videoHandoff={videoHandoff}
          onDimensionsChange={({ width, height }) => {
            if (width > 0 && height > 0) setMediaRatio(width / height);
          }}
          preload="auto"
        />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function MediaCarousel({
  activeIndex,
  items,
  onActiveIndexChange,
  onDismiss,
  sharedItemId,
  videoHandoff,
}: MediaCarouselProps) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const [isEntering, setIsEntering] = useState(true);
  const dragControls = useDragControls();
  const outsidePress = useRef<{ x: number; y: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const initialIndexRef = useRef(activeIndex);
  const hasInitiallyPositionedRef = useRef(false);
  const isMomentumSnapRef = useRef(false);
  const skipNextIndexSyncRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const y = useMotionValue(0);
  const slideHeight = viewportHeight * SLIDE_HEIGHT_RATIO;
  const pitch = slideHeight + GAP;
  const inset = (viewportHeight - slideHeight) / 2;
  const maxOffset = Math.max(0, (items.length - 1) * pitch);
  const firstVisibleIndex = Math.max(0, activeIndex - VIRTUAL_SLIDE_OVERSCAN);
  const lastVisibleIndex = Math.min(
    items.length,
    activeIndex + VIRTUAL_SLIDE_OVERSCAN + 1,
  );
  const visibleItems = items.slice(firstVisibleIndex, lastVisibleIndex);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateHeight = (nextHeight: number) => {
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
    };

    // Position the selected slide before paint; observe subsequent resizes.
    updateHeight(viewport.clientHeight);
    const observer = new ResizeObserver(([entry]) => {
      updateHeight(entry.contentRect.height);
    });

    observer.observe(viewport);
    return () => observer.disconnect();
  }, [y]);

  const snapTo = (index: number) => {
    const nextIndex = clampIndex(index, items.length);
    isMomentumSnapRef.current = false;
    if (nextIndex !== activeIndex) {
      // The index effect owns navigation springs; never start a second one here.
      onActiveIndexChange(nextIndex);
    } else if (reduceMotion) {
      y.jump(-nextIndex * pitch);
    } else {
      void animate(y, -nextIndex * pitch, SNAP_TRANSITION);
    }
  };

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

    event.preventDefault();
    if (wheelLockedRef.current) return;

    wheelDeltaRef.current += event.deltaY;
    if (Math.abs(wheelDeltaRef.current) < WHEEL_SNAP_THRESHOLD) return;

    const direction = Math.sign(wheelDeltaRef.current);
    wheelDeltaRef.current = 0;
    wheelLockedRef.current = true;
    snapTo(activeIndex + direction);

    wheelTimerRef.current = setTimeout(() => {
      wheelLockedRef.current = false;
    }, WHEEL_SNAP_COOLDOWN);
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const onWheel = (event: WheelEvent) => handleWheel(event);
    viewport?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      viewport?.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimerRef.current);
    };
  }, []);

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
    if (reduceMotion) {
      y.jump(-activeIndex * pitch);
      return;
    }
    const animation = animate(y, -activeIndex * pitch, SNAP_TRANSITION);
    return () => animation.stop();
  }, [activeIndex, pitch, reduceMotion, y]);

  return (
    <div
      ref={viewportRef}
      className={`relative h-full min-h-0 cursor-default bg-transparent ${isPresent && !reduceMotion && isEntering && sharedItemId ? "overflow-visible" : "overflow-hidden"}`}
      onPointerDownCapture={(event) => {
        outsidePress.current = null;
        if (event.button !== 0 || (event.target as Element).closest("video[controls], button, a, input")) return;
        if (pitch > 0) dragControls.start(event);
        if (!(event.target as Element).closest("[data-media-image]")) {
          outsidePress.current = { x: event.clientX, y: event.clientY };
        }
      }}
      onPointerMoveCapture={(event) => {
        const start = outsidePress.current;
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) {
          outsidePress.current = null;
        }
      }}
      onPointerCancel={() => { outsidePress.current = null; }}
      onClick={(event) => {
        const start = outsidePress.current;
        outsidePress.current = null;
        if (
          start &&
          Math.hypot(event.clientX - start.x, event.clientY - start.y) <= 5 &&
          !(event.target as Element).closest("[data-media-image]")
        ) onDismiss();
      }}
    >
      <motion.div
        aria-label="Collection media. Drag vertically to browse items."
        aria-roledescription="carousel"
        drag={pitch > 0 ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragDirectionLock
        dragPropagation
        dragConstraints={{ bottom: 0, top: -maxOffset }}
        dragElastic={reduceMotion ? 0 : 0.08}
        dragMomentum={!reduceMotion}
        onDragStart={() => { outsidePress.current = null; }}
        dragTransition={{
          ...DRAG_INERTIA,
          modifyTarget: (target) =>
            -clampIndex(Math.round(-target / pitch), items.length) * pitch,
        }}
        onDragEnd={(_event, info) => {
          if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) return;
          const projectedOffset =
            y.get() + (reduceMotion ? 0 : info.velocity.y * MOMENTUM_PROJECTION);
          const nextIndex = clampIndex(
            Math.round(-projectedOffset / pitch),
            items.length,
          );

          if (reduceMotion) y.jump(-nextIndex * pitch);
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
          if (settledIndex !== activeIndex) {
            isMomentumSnapRef.current = true;
            onActiveIndexChange(settledIndex);
          }
        }}
        onKeyDown={(event) => {
          if ((event.target as Element).closest("video[controls]")) return;
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
          touchAction: "none",
          visibility: isReady ? "visible" : "hidden",
          y,
        }}
        tabIndex={0}
        className="relative h-full w-full"
      >
        {isReady && visibleItems.map((item, offset) => {
          const index = firstVisibleIndex + offset;

          return (
            <CarouselSlide
              index={index}
              sharedItemId={sharedItemId}
              videoHandoff={item.id === sharedItemId ? videoHandoff : undefined}
              isEntering={isEntering}
              onSharedAnimationComplete={() => setIsEntering(false)}
              item={item}
              key={item.id}
              pitch={pitch}
              shouldPlay={index === activeIndex}
              slideHeight={slideHeight}
              top={inset + index * pitch}
              trackY={y}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
