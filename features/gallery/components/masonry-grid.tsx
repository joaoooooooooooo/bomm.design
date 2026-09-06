"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { AlertCircle, Inbox } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type MasonryGridKey = string | number | bigint;

export interface MasonryGridProps<T> {
  items: readonly T[];
  getItemKey: (item: T, index: number) => MasonryGridKey;
  renderItem: (item: T, index: number) => ReactNode;
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  /** Exact card height from media metadata; omitted for DOM-measured content. */
  getItemSize?: (item: T, index: number, columnWidth: number) => number;
  emptyState?: ReactNode;
  endState?: ReactNode;
  minColumnWidth?: number;
  maxColumns?: number;
  gap?: number;
  overscan?: number;
  prefetch?: number;
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
}

function useMasonryMetrics({
  elementRef,
  gap,
  maxColumns,
  minColumnWidth,
}: {
  elementRef: React.RefObject<HTMLDivElement | null>;
  gap: number;
  maxColumns: number;
  minColumnWidth: number;
}) {
  const [metrics, setMetrics] = useState({ columns: 1, width: 0 });

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const update = (width: number) => {
      const columns = Math.min(
        maxColumns,
        Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap))),
      );
      setMetrics((current) =>
        current.columns === columns && current.width === width
          ? current
          : { columns, width },
      );
    };

    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, gap, maxColumns, minColumnWidth]);

  return metrics;
}

function DefaultEmptyState() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-foreground">No items yet</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        New items will appear here when they become available.
      </p>
    </div>
  );
}

export function MasonryGrid<T>({
  items,
  getItemKey,
  renderItem,
  onLoadMore,
  hasMore,
  loading = false,
  error,
  onRetry,
  getItemSize,
  emptyState = <DefaultEmptyState />,
  endState,
  minColumnWidth = 208,
  maxColumns = 4,
  gap = 12,
  overscan = 4,
  prefetch = 3,
  ariaLabel = "Infinite masonry feed",
  className,
  contentClassName,
  itemClassName,
}: MasonryGridProps<T>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);
  const loadPendingRef = useRef(false);
  const [scrollMargin, setScrollMargin] = useState(0);
  const { columns, width } = useMasonryMetrics({
    elementRef: contentRef,
    gap,
    maxColumns,
    minColumnWidth,
  });

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!loading) loadPendingRef.current = false;
  }, [loading]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateScrollMargin = () => {
      setScrollMargin(content.getBoundingClientRect().top + window.scrollY);
    };

    updateScrollMargin();
    // Changes to spacer height do not move its origin. Observe the preceding
    // content instead, so pagination does not force a synchronous layout read.
    let frame: number | undefined;
    const schedule = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScrollMargin);
    };
    const observer = new ResizeObserver(schedule);
    let ancestor: Element | null = content;
    while (ancestor && ancestor !== document.body) {
      let sibling = ancestor.previousElementSibling;
      while (sibling) {
        observer.observe(sibling);
        sibling = sibling.previousElementSibling;
      }
      ancestor = ancestor.parentElement;
    }
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

  const hasError = error !== undefined && error !== null;
  const tailCount = hasError ? 1 : 0;
  const columnWidth =
    columns > 0 ? Math.max(0, (width - gap * (columns - 1)) / columns) : 0;
  const getVirtualItemKey = useCallback((index: number) =>
    index < items.length ? getItemKey(items[index], index) : `masonry-tail-${index - items.length}`,
  [getItemKey, items]);
  const virtualizer = useWindowVirtualizer({
    count: items.length + tailCount,
    getItemKey: getVirtualItemKey,
    estimateSize: (index) =>
      index < items.length
        ? getItemSize?.(items[index], index, columnWidth) ?? 240
        : 144,
    gap,
    lanes: columns,
    overscan: overscan * columns,
    scrollMargin,
    useFlushSync: false,
  });

  useLayoutEffect(() => {
    // Metadata or column width changed: invalidate once, without measuring each card.
    virtualizer.measure();
  }, [virtualizer, getItemSize, columnWidth]);

  const virtualItems = virtualizer.getVirtualItems();
  const viewportEnd =
    (virtualizer.scrollOffset ?? 0) + (virtualizer.scrollRect?.height ?? 0);
  const lastVisibleIndex = virtualItems.reduce(
    (lastIndex, item) =>
      item.start < viewportEnd ? Math.max(lastIndex, item.index) : lastIndex,
    -1,
  );

  useEffect(() => {
    if (
      hasError ||
      loading ||
      !hasMore ||
      loadPendingRef.current ||
      lastVisibleIndex < Math.max(0, items.length - prefetch)
    ) {
      return;
    }

    loadPendingRef.current = true;
    void Promise.resolve(loadMoreRef.current()).finally(() => {
      loadPendingRef.current = false;
    });
  }, [hasError, hasMore, items.length, lastVisibleIndex, loading, prefetch]);

  if (items.length === 0 && !hasMore && !loading && !hasError) {
    return (
      <section aria-label={ariaLabel} className={cn("w-full", className)}>
        {emptyState}
      </section>
    );
  }

  return (
    <section
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn("w-full contain-[layout_paint]", className)}
    >
      <div
        ref={contentRef}
        className={cn("relative w-full", contentClassName)}
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((virtualItem) => {
          const isTail = virtualItem.index >= items.length;

          return (
            <div
              key={virtualItem.key}
              ref={isTail || !getItemSize ? virtualizer.measureElement : undefined}
              data-index={virtualItem.index}
              className={cn(
                "absolute left-0 top-0",
                !isTail && itemClassName,
              )}
              style={{
                width: columnWidth,
                transform: `translate3d(${virtualItem.lane * (columnWidth + gap)}px, ${virtualItem.start - scrollMargin}px, 0)`,
              }}
            >
              {isTail ? (
                <div className="flex min-h-36 flex-col items-start justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    <p className="text-sm font-medium">Couldn&apos;t load more</p>
                  </div>
                  <div className="mt-2 text-xs leading-5 text-muted-foreground">{error}</div>
                  {onRetry ? (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-3 min-h-10 rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Try again
                    </button>
                  ) : null}
                </div>
              ) : (
                renderItem(items[virtualItem.index], virtualItem.index)
              )}
            </div>
          );
        })}
      </div>
      {!hasMore && items.length > 0 && endState ? (
        <div className="py-4 text-center text-xs text-muted-foreground">{endState}</div>
      ) : null}
      {(hasMore || loading) && (
        <div role="status" className="flex h-12 items-center justify-center text-xs text-muted-foreground">
          {loading ? "Loading more media..." : null}
        </div>
      )}
    </section>
  );
}
