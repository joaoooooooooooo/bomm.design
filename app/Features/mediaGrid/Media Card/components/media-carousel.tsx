"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
const WHEEL_SNAP_THRESHOLD = 36;
const WHEEL_SNAP_COOLDOWN = 180;
const VIRTUAL_SLIDE_OVERSCAN = 2;
const SNAP_TRANSITION = { type: "spring", bounce: 0, visualDuration: 0.24 } as const;
const DRAG_INERTIA = {
  bounceDamping: 28,
  bounceStiffness: 560,
  power: MOMENTUM_PROJECTION,
  timeConstant: 95,
} as const;
type ReleaseWaveConfig = {
  bounce: number;
  compression: number;
  duration: number;
  imageElastic: number;
  imageX: number;
  imageY: number;
  noise: number;
  radius: number;
  stagger: number;
};

const DEFAULT_RELEASE_WAVE: ReleaseWaveConfig = {
  bounce: 0.18,
  compression: 0.028,
  duration: 0.26,
  imageElastic: 0.18,
  imageX: 18,
  imageY: 12,
  noise: 0.008,
  radius: 2,
  stagger: 0.032,
};

type ReleaseWave = {
  id: number;
  originIndex: number;
};

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
  top,
  shouldPlay,
  releaseWave,
  releaseWaveConfig,
}: {
  index: number;
  item: MediaCardItem;
  pitch: number;
  slideHeight: number;
  shouldPlay: boolean;
  top: number;
  trackY: MotionValue<number>;
  releaseWave: ReleaseWave | null;
  releaseWaveConfig: ReleaseWaveConfig;
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
  const releaseScale = useMotionValue(1);
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);

  useEffect(() => {
    if (!releaseWave) return;

    const distance = Math.abs(index - releaseWave.originIndex);
    if (distance > releaseWaveConfig.radius) return;

    const noise = ((index * 17 + releaseWave.id * 13) % 10) * releaseWaveConfig.noise / 10;
    const delay = distance * releaseWaveConfig.stagger + noise;
    let animation: ReturnType<typeof animate> | undefined;
    const timer = window.setTimeout(() => {
      releaseScale.jump(1 - releaseWaveConfig.compression / (distance + 1));
      animation = animate(releaseScale, 1, {
        bounce: releaseWaveConfig.bounce,
        type: "spring",
        visualDuration: releaseWaveConfig.duration,
      });
    }, delay * 1000);

    return () => {
      window.clearTimeout(timer);
      animation?.stop();
    };
  }, [index, releaseScale, releaseWave, releaseWaveConfig]);

  useEffect(() => {
    if (shouldPlay) return;
    imageX.jump(0);
    imageY.jump(0);
  }, [imageX, imageY, shouldPlay]);

  return (
    <motion.div
      className="absolute left-4 right-4"
      style={{ height: slideHeight, opacity, scale, top }}
    >
      <motion.div
        className="h-full w-full"
        drag={shouldPlay}
        dragConstraints={{
          bottom: releaseWaveConfig.imageY,
          left: -releaseWaveConfig.imageX,
          right: releaseWaveConfig.imageX,
          top: -releaseWaveConfig.imageY,
        }}
        dragElastic={releaseWaveConfig.imageElastic}
        dragMomentum={false}
        dragPropagation
        onDragEnd={() => {
          void animate(imageX, 0, SNAP_TRANSITION);
          void animate(imageY, 0, SNAP_TRANSITION);
        }}
        style={{ scale: releaseScale, x: imageX, y: imageY }}
      >
        <MediaPreview
          autoPlay={shouldPlay}
          className="rounded-2xl"
          fit="contain"
          media={item.media}
          preload={shouldPlay ? "auto" : "none"}
        />
      </motion.div>
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
  const releaseWaveIdRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [releaseWave, setReleaseWave] = useState<ReleaseWave | null>(null);
  const releaseWaveConfig = DEFAULT_RELEASE_WAVE;
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

  const triggerReleaseWave = (originIndex: number) => {
    releaseWaveIdRef.current += 1;
    setReleaseWave({ id: releaseWaveIdRef.current, originIndex });
  };

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
    if (nextIndex !== activeIndex) {
      triggerReleaseWave(nextIndex);
      onActiveIndexChange(nextIndex);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

    event.preventDefault();
    if (wheelLockedRef.current) return;

    wheelDeltaRef.current += event.deltaY;
    if (Math.abs(wheelDeltaRef.current) < WHEEL_SNAP_THRESHOLD) return;

    const direction = Math.sign(wheelDeltaRef.current);
    wheelDeltaRef.current = 0;
    wheelLockedRef.current = true;
    snapTo(activeIndex + direction);

    window.setTimeout(() => {
      wheelLockedRef.current = false;
    }, WHEEL_SNAP_COOLDOWN);
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
      className="relative h-full min-h-0 overflow-hidden bg-transparent"
    >
      
      <motion.div
        aria-label="Collection media. Drag vertically to browse items."
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
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

          triggerReleaseWave(nextIndex);
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
        onWheel={handleWheel}
        role="group"
        style={{
          touchAction: "pan-x",
          visibility: isReady ? "visible" : "hidden",
          y,
        }}
        tabIndex={0}
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
      >
        {visibleItems.map((item, offset) => {
          const index = firstVisibleIndex + offset;

          return (
          <CarouselSlide
            key={item.id}
            index={index}
            item={item}
            pitch={pitch}
            slideHeight={slideHeight}
            shouldPlay={index === activeIndex}
            top={inset + index * pitch}
            trackY={y}
            releaseWave={releaseWave}
            releaseWaveConfig={releaseWaveConfig}
          />
          );
        })}
      </motion.div>
    </div>
  );
}
