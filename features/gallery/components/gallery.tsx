"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  MediaCard,
} from "@/features/gallery/components/media-card";
import { MediaCardDialog } from "@/features/gallery/components/media-card-dialog";
import { captureVideoHandoff, type VideoHandoff } from "@/features/gallery/components/media-preview";
import { MasonryGrid } from "@/features/gallery/components/masonry-grid";

import type { GalleryPost, GalleryPage, SectionId } from "../types";
import { useGalleryDialogActivity } from "../dialog-activity";

export function Gallery({ section, category, initialPage }: {
  section: SectionId;
  category?: string;
  initialPage: GalleryPage;
}) {
  const onDialogActiveChange = useGalleryDialogActivity();
  const reduceMotion = useReducedMotion();
  const layoutGroupId = useId();
  const [items, setItems] = useState(initialPage.items);
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const requestInFlight = useRef<AbortController | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoHandoff, setVideoHandoff] = useState<VideoHandoff>();
  const hasMore = nextCursor !== null;

  useEffect(() => () => {
    requestInFlight.current?.abort();
    onDialogActiveChange(false);
  }, [onDialogActiveChange]);

  const getItemSize = useCallback((item: GalleryPost, _index: number, columnWidth: number) =>
    columnWidth > 0 ? columnWidth * item.media.height / item.media.width : 360,
  []);
  const getItemKey = useCallback((item: GalleryPost) => item.id, []);

  const loadMore = useCallback(async () => {
    if (requestInFlight.current || !nextCursor) return;
    const controller = new AbortController();
    requestInFlight.current = controller;
    setLoading(true);
    setError(undefined);
    try {
      const params = new URLSearchParams({ section, cursor: nextCursor, limit: "12" });
      if (category) params.set("category", category);
      const response = await fetch(`/api/gallery?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Couldn't load more posts. Please try again.");
      const page: GalleryPage = await response.json();
      if (controller.signal.aborted) return;
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(error instanceof Error ? error.message : "Couldn't load more posts.");
      }
    } finally {
      if (requestInFlight.current === controller) {
        requestInFlight.current = null;
        setLoading(false);
      }
    }
  }, [section, category, nextCursor]);

  return (
    <div className="w-full" data-gallery-section={section}>
      <MasonryGrid
        ariaLabel="Visual inspiration gallery"
        getItemSize={getItemSize}
        getItemKey={getItemKey}
        hasMore={hasMore}
        items={items}
        maxColumns={3}
        loading={loading}
        error={error}
        onRetry={loadMore}
        onLoadMore={loadMore}
        renderItem={(item, index) => (
          <LayoutGroup id={layoutGroupId}>
            <motion.div
              className="relative"
              tabIndex={-1}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <MediaCard
                autoPlay={selectedIndex === null}
                item={item}
                isOpening={index === selectedIndex}
                mediaLayoutId={`media-${item.id}`}
              />
              <button
                aria-label={`Open ${item.title}`}
                className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={(event) => {
                  const video = event.currentTarget.parentElement?.querySelector("video");
                  const handoff = video ? captureVideoHandoff(video) : undefined;
                  setVideoHandoff(handoff);
                  setSelectedIndex(index);
                  setIsDialogOpen(true);
                  onDialogActiveChange(true);
                }}
                type="button"
              />
            </motion.div>
          </LayoutGroup>
        )}
      />
      <LayoutGroup id={layoutGroupId}>
        <MediaCardDialog
          items={items}
          videoHandoff={videoHandoff}
          onExitComplete={() => {
            if (!isDialogOpen) {
              setSelectedIndex(null);
              setVideoHandoff(undefined);
              onDialogActiveChange(false);
            }
          }}
          onOpenChange={setIsDialogOpen}
          open={isDialogOpen}
          selectedIndex={selectedIndex ?? 0}
        />
      </LayoutGroup>
    </div>
  );
}
