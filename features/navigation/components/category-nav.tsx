"use client";

import Link from "next/link";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { TabItem } from "@/components/ui/tab-items";
import { getCategoryPresentation } from "../sections";
import type { Category, SectionId } from "@/features/gallery/types";

export function CategoryNav({ section, categories, activeCategory }: {
  section: SectionId;
  categories: Category[];
  activeCategory?: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; scroll: number; lastX: number; time: number; velocity: number } | null>(null);
  const momentum = useRef<{ stop: () => void } | null>(null);
  const reduceMotion = useReducedMotion();
  const overscroll = useMotionValue(0);
  const stopMomentum = useCallback(() => { momentum.current?.stop(); momentum.current = null; overscroll.stop(); overscroll.set(0); }, [overscroll]);
  useLayoutEffect(() => { stopMomentum(); return stopMomentum; }, [section, activeCategory, reduceMotion, stopMomentum]);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [scrollState, setScrollState] = useState({ overflow: false, left: false, right: false });
  const measure = useCallback(() => {
    const nav = navRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!nav || !viewport || !content) return;
    const next = {
      overflow: content.scrollWidth > nav.clientWidth + 1,
      left: viewport.scrollLeft > 1,
      right: viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1,
    };
    setScrollState(previous => previous.overflow === next.overflow && previous.left === next.left && previous.right === next.right ? previous : next);
  }, []);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => { stopMomentum(); measure(); });
    for (const element of [navRef.current, viewportRef.current, contentRef.current]) {
      if (element) observer.observe(element);
    }
    measure();
    return () => observer.disconnect();
  }, [measure, stopMomentum]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const active = contentRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!viewport || !active) return;
    const bounds = viewport.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.left < bounds.left) viewport.scrollLeft += item.left - bounds.left;
    else if (item.right > bounds.right) viewport.scrollLeft += item.right - bounds.right;
    measure();
  }, [section, activeCategory, scrollState.overflow, measure]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    stopMomentum();
    // Touch keeps the browser's native scrolling and momentum.
    if (event.pointerType !== "mouse" || event.button !== 0 || !scrollState.overflow) return;
    event.preventDefault();
    (event.target as HTMLElement).closest<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, lastX: event.clientX, time: event.timeStamp, velocity: 0 };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const distance = event.clientX - current.x;
    if (!suppressClick.current && Math.abs(distance) < 5) return;
    if (!suppressClick.current) {
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    const elapsed = event.timeStamp - current.time;
    if (elapsed > 0) current.velocity = (current.lastX - event.clientX) / elapsed * 1000;
    current.lastX = event.clientX;
    current.time = event.timeStamp;
    event.preventDefault();
    const viewport = event.currentTarget;
    const desired = current.scroll - distance;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const clamped = Math.max(0, Math.min(max, desired));
    viewport.scrollLeft = clamped;
    const excess = clamped - desired;
    overscroll.set(reduceMotion ? 0 : 64 * Math.tanh(excess * 0.2 / 64));
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    const current = drag.current;
    const viewport = event.currentTarget;
    if (overscroll.get() !== 0) {
      animate(overscroll, 0, { type: "spring", stiffness: 350, damping: 30, restDelta: 0.1 });
    } else if (event.type === "pointerup" && suppressClick.current && !reduceMotion && event.timeStamp - current.time < 100) {
      const max = viewport.scrollWidth - viewport.clientWidth;
      momentum.current = animate(viewport.scrollLeft, viewport.scrollLeft + current.velocity * 0.3, {
        type: "inertia",
        velocity: Math.max(-3000, Math.min(3000, current.velocity)),
        power: 0.3,
        timeConstant: 325,
        restDelta: 0.5,
        modifyTarget: target => Math.max(0, Math.min(max, target)),
        onUpdate: value => { viewport.scrollLeft = value; },
      });
    }
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }


  const links = [
    { slug: "", name: "All", href: `/${section}` },
    ...categories.map(({ slug, name }) => ({ slug, name, href: `/${section}?category=${encodeURIComponent(slug)}` })),
  ];
  return (
    <nav ref={navRef} aria-label="Categories" className="flex min-w-0 flex-1 items-center gap-2">
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <motion.div
          style={{ x: overscroll }}
          ref={viewportRef}
          onScroll={measure}
          onWheel={stopMomentum}
          onKeyDown={stopMomentum}
          onFocusCapture={stopMomentum}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={event => { if (event.target === event.currentTarget) endDrag(event); }}
          onPointerLeave={event => { if (!suppressClick.current) endDrag(event); }}
          onDragStart={event => event.preventDefault()}
          onClickCapture={event => {
            if (suppressClick.current && event.detail > 0) {
              event.preventDefault();
              event.stopPropagation();
            }
            suppressClick.current = false;
          }}
          className={`select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${scrollState.overflow ? dragging ? "cursor-grabbing [&_a]:cursor-grabbing" : "cursor-grab [&_a]:cursor-grab" : ""}`}
        >
          <div ref={contentRef} className="flex w-max items-center gap-2 py-1">
      {links.map(({ slug, name, href }) => {
        const active = slug === (activeCategory ?? "");
        return (
          <TabItem
            key={slug}
            label={name}
            {...getCategoryPresentation(section, slug)}
            variant={active ? "active" : "inactive"}
            size="md"
            render={<Link href={href} />}
            aria-current={active ? "page" : undefined}
          />
        );
      })}
          </div>
        </motion.div>
        {scrollState.overflow && scrollState.left && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-l from-transparent to-background" />}
        {scrollState.overflow && scrollState.right && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-background" />}
      </div>
    </nav>
  );
}
