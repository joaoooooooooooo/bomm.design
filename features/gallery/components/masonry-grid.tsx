"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { AlertCircle, Inbox } from "lucide-react";
import {
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
  estimateSize?: (item: T, index: number, columnWidth: number) => number;
  renderLoadingItem?: (index: number) => ReactNode;
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

function DefaultLoadingItem({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-border bg-card p-3"
      style={{ minHeight: 144 + (index % 3) * 36 }}
    >
      <div className="h-3 w-2/3 rounded-full bg-muted" />
      <div className="mt-3 h-2 w-full rounded-full bg-muted" />
      <div className="mt-2 h-2 w-4/5 rounded-full bg-muted" />
    </div>
  );
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
  estimateSize = () => 240,
  renderLoadingItem = (index) => <DefaultLoadingItem index={index} />,
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
    const observer = new ResizeObserver(updateScrollMargin);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const hasError = error !== undefined && error !== null;
  const tailCount = hasError ? 1 : loading ? columns : 0;
  const columnWidth =
    columns > 0 ? Math.max(0, (width - gap * (columns - 1)) / columns) : 0;
  const virtualizer = useWindowVirtualizer({
    count: items.length + tailCount,
    getItemKey: (index) =>
      index < items.length
        ? getItemKey(items[index], index)
        : `masonry-tail-${index - items.length}`,
    estimateSize: (index) =>
      index < items.length
        ? estimateSize(items[index], index, columnWidth)
        : 144 + ((index - items.length) % 3) * 36,
    gap,
    lanes: columns,
    overscan: overscan * columns,
    scrollMargin,
    useFlushSync: false,
  });

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
          const tailIndex = virtualItem.index - items.length;

          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
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
                hasError ? (
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
                  renderLoadingItem(tailIndex)
                )
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
      <span className="sr-only" aria-live="polite">
        {loading ? "Loading more items" : null}
      </span>
    </section>
  );
}
