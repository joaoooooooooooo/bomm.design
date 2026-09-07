"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import type { CuratedLogo } from "../logos-data";

const defaultDebug = {
  zoom: 1,
  scale: 1,
  gap: 24,
  rowOffset: 0.5,
  centerRadius: 0.35,
  edgeScale: 0.25,
  edgeRange: 0.9,
  shift: 0.15,
  elasticity: 0.2,
  momentum: 0.25,
};
const debugControls = [
  { key: "zoom", label: "Grid zoom", min: 0.5, max: 2, step: 0.05 },
  { key: "scale", label: "Logo scale", min: 0.5, max: 1.25, step: 0.01 },
  { key: "gap", label: "Gap", min: -60, max: 180, step: 2 },
  { key: "rowOffset", label: "Row offset", min: -1.5, max: 1.5, step: 0.05 },
  { key: "centerRadius", label: "Center radius", min: 0, max: 1.5, step: 0.05 },
  { key: "edgeScale", label: "Edge scale", min: 0, max: 1, step: 0.01 },
  { key: "edgeRange", label: "Edge range", min: 0.1, max: 2, step: 0.05 },
  { key: "shift", label: "Edge shift", min: 0, max: 0.5, step: 0.01 },
  { key: "elasticity", label: "Edge elasticity", min: 0, max: 0.6, step: 0.02 },
  { key: "momentum", label: "Momentum", min: 0, max: 1, step: 0.05 },
] as const;
const columns = 8;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function getGridMetrics(width: number, rows: number, zoom: number, gap: number, rowOffset: number) {
  const baseSize = clamp(width / 6, 104, 176);
  const size = baseSize * zoom;
  const pitch = (baseSize + gap) * zoom;
  const rowShift = pitch * rowOffset;
  const inset = 12 * zoom;

  return {
    inset,
    pitch,
    rowShift,
    size,
    planeWidth: (columns - 1) * pitch + Math.abs(rowShift) + size + inset * 2,
    // Match Motion's Apple Watch example: each row advances by one icon diameter.
    planeHeight: rows * size + inset * 2,
  };
}

/** A finite honeycomb, measured against the gallery viewport rather than a device mockup. */
export function LogosGrid({ items }: { items: readonly CuratedLogo[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const hintId = useId();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [debug, setDebug] = useState(defaultDebug);
  const positionX = useTransform(() => Math.round(x.get()).toString());
  const positionY = useTransform(() => Math.round(y.get()).toString());
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const rows = Math.ceil(items.length / columns);
  const { inset, pitch, rowShift, size, planeWidth, planeHeight } = getGridMetrics(
    bounds.width,
    rows,
    debug.zoom,
    debug.gap,
    debug.rowOffset,
  );
  const cameraLeft = planeWidth > bounds.width
    ? bounds.width / 2 - (planeWidth - inset - size / 2)
    : (bounds.width - planeWidth) / 2;
  const cameraRight = planeWidth > bounds.width
    ? bounds.width / 2 - inset - size / 2
    : cameraLeft;
  const cameraTop = planeHeight > bounds.height
    ? bounds.height / 2 - (planeHeight - inset - size / 2)
    : (bounds.height - planeHeight) / 2;
  const cameraBottom = planeHeight > bounds.height
    ? bounds.height / 2 - inset - size / 2
    : cameraTop;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = getGridMetrics(width, rows, debug.zoom, debug.gap, debug.rowOffset);
      x.stop();
      y.stop();
      x.set(Math.min(0, width - next.planeWidth) / 2);
      y.set(Math.min(0, height - next.planeHeight) / 2);
      setBounds({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [debug.gap, debug.rowOffset, debug.zoom, rows, x, y]);

  function center() {
    x.stop();
    y.stop();
    x.set((cameraLeft + cameraRight) / 2);
    y.set((cameraTop + cameraBottom) / 2);
  }

  function centerOnItem(offsetX: number, offsetY: number) {
    const targetX = clamp(bounds.width / 2 - offsetX - size / 2, cameraLeft, cameraRight);
    const targetY = clamp(bounds.height / 2 - offsetY - size / 2, cameraTop, cameraBottom);
    x.stop();
    y.stop();

    if (reduceMotion) {
      x.set(targetX);
      y.set(targetY);
      return;
    }

    const transition = { type: "spring" as const, duration: 0.45, bounce: 0 };
    animate(x, targetX, transition);
    animate(y, targetY, transition);
  }

  return (
    <section aria-label="Logos collection" className="relative flex w-full flex-1 flex-col border-t border-border" data-logos-collection>
      <div
        ref={viewport}
        role="region"
        aria-label="Explorar logos"
        aria-describedby={hintId}
        tabIndex={0}
        className="relative min-h-[480px] w-full flex-1 touch-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
          event.preventDefault();
          x.stop();
          y.stop();
          if (event.key === "Home") center();
          if (event.key === "ArrowLeft") x.set(clamp(x.get() + pitch, cameraLeft, cameraRight));
          if (event.key === "ArrowRight") x.set(clamp(x.get() - pitch, cameraLeft, cameraRight));
          if (event.key === "ArrowUp") y.set(clamp(y.get() + pitch, cameraTop, cameraBottom));
          if (event.key === "ArrowDown") y.set(clamp(y.get() - pitch, cameraTop, cameraBottom));
        }}
      >
        <span id={hintId} className="sr-only">Use as setas para mover, Tab para escolher um logo e Enter para visitar a fonte. Home centraliza a coleção.</span>
        {bounds.width > 0 && <motion.div
          drag
          dragConstraints={{ left: cameraLeft, right: cameraRight, top: cameraTop, bottom: cameraBottom }}
          dragElastic={reduceMotion ? 0 : debug.elasticity}
          dragMomentum={!reduceMotion}
          dragTransition={{ power: debug.momentum, timeConstant: 280, bounceStiffness: 360, bounceDamping: 32 }}
          onPointerDownCapture={() => { dragged.current = false; }}
          onDragStart={() => { dragged.current = true; }}
          onClickCapture={(event) => {
            if (dragged.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className="absolute left-0 top-0 cursor-grab select-none active:cursor-grabbing"
          style={{ width: planeWidth, height: planeHeight, x, y }}
        >
          {items.map((item, index) => {
            const row = Math.floor(index / columns);
            const offsetX = (index % columns) * pitch + (row % 2) * rowShift - Math.min(0, rowShift) + inset;
            const offsetY = row * size + inset;
            return <LogoItem key={item.id} item={item} size={size} offsetX={offsetX} offsetY={offsetY}
              planeX={x} planeY={y} width={bounds.width} height={bounds.height} reducedMotion={!!reduceMotion} debug={debug}
              onCenter={() => centerOnItem(offsetX, offsetY)}
              onFocus={() => {
                centerOnItem(offsetX, offsetY);
                // The translated field handles visibility; native focus scrolling must not offset the viewport.
                if (viewport.current) { viewport.current.scrollLeft = 0; viewport.current.scrollTop = 0; }
              }} />;
          })}
        </motion.div>}
      </div>
      {process.env.NODE_ENV === "development" && (
        <details className="absolute bottom-4 right-4 z-10 w-64 rounded-xl border border-border bg-background/95 p-3 text-xs shadow-lg" data-logos-debug>
          <summary className="cursor-pointer font-medium">Grid debug</summary>
          <div className="mt-4 flex flex-col gap-3">
            {debugControls.map(({ key, label, min, max, step }) => (
              <label key={key} className="flex flex-col gap-2">
                <span className="flex justify-between"><span>{label}</span><output className="tabular-nums">{debug[key].toFixed(2)}</output></span>
                <input type="range" min={min} max={max} step={step} value={debug[key]} className="w-full accent-teal-500"
                  onChange={(event) => setDebug((current) => ({ ...current, [key]: Number(event.target.value) }))} />
              </label>
            ))}
            <p className="flex gap-3 text-muted-foreground tabular-nums">x <motion.span>{positionX}</motion.span> y <motion.span>{positionY}</motion.span></p>
            <p className="text-muted-foreground">{Math.round(bounds.width)} × {Math.round(bounds.height)} · {items.length} logos{reduceMotion ? " · Reduced motion" : ""}</p>
            <button type="button" className="self-start underline underline-offset-4" onClick={() => setDebug(defaultDebug)}>Reset properties</button>
          </div>
        </details>
      )}
    </section>
  );
}

function LogoItem({ item, size, offsetX, offsetY, planeX, planeY, width, height, reducedMotion, debug, onCenter, onFocus }: {
  item: CuratedLogo; size: number; offsetX: number; offsetY: number;
  planeX: MotionValue<number>; planeY: MotionValue<number>; width: number; height: number;
  debug: typeof defaultDebug; reducedMotion: boolean; onCenter: () => void; onFocus: () => void;
}) {
  const screenX = useTransform(() => planeX.get() + offsetX + size / 2);
  const screenY = useTransform(() => planeY.get() + offsetY + size / 2);
  const edge = Math.min(size * debug.edgeRange, width / 3, height / 3);
  const xScale = useTransform(screenX, [-size / 2, edge, width - edge, width + size / 2], [debug.edgeScale, 1, 1, debug.edgeScale]);
  const yScale = useTransform(screenY, [-size / 2, edge, height - edge, height + size / 2], [debug.edgeScale, 1, 1, debug.edgeScale]);
  const distanceFromCenter = useTransform(() => Math.hypot(
    screenX.get() - width / 2,
    screenY.get() - height / 2,
  ));
  const outerRadius = Math.max(1, Math.hypot(width / 2 + size / 2, height / 2 + size / 2));
  const centerRadius = Math.min(debug.centerRadius * Math.min(width, height), outerRadius - 1);
  const radialScale = useTransform(distanceFromCenter, [centerRadius, outerRadius], [1, debug.edgeScale]);
  const scale = useTransform(() => debug.scale * (
    reducedMotion ? 1 : Math.min(xScale.get(), yScale.get(), radialScale.get())
  ));
  const x = useTransform(screenX, [-size / 2, edge, width - edge, width + size / 2], [size * debug.shift, 0, 0, -size * debug.shift]);
  const y = useTransform(screenY, [-size / 2, edge, height - edge, height + size / 2], [size * debug.shift, 0, 0, -size * debug.shift]);

  return (
    <motion.button
      type="button"
      aria-label={`Centralizar ${item.name}`} title={item.name}
      onClick={onCenter}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) onFocus(); }}
      className="absolute flex items-center justify-center rounded-full bg-white text-center text-sm text-neutral-900 shadow-xs outline outline-1 -outline-offset-1 outline-black/10 hover:ring-2 hover:ring-teal-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      style={{ left: offsetX, top: offsetY, width: size, height: size, scale, x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }}
    />
  );
}
