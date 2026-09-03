"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MediaCard,
  type MediaCardItem,
} from "@/app/Features/mediaGrid/Media Card/components/media-card";
import { MediaCardDialog } from "@/app/Features/mediaGrid/Media Card/components/media-card-dialog";
import { InfiniteMasonry } from "@/app/Features/mediaGrid/MasonryGrid/components/infinite-masonry";

type GalleryItem = MediaCardItem;

const PAGE_SIZE = 6;
const MAX_ITEMS = 42;

const gallerySource = [
  {
    title: "Soft geometry",
    category: "Architecture",
    media: {
      alt: "Soft geometry",
      src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 2565,
      width: 3848,
    },
    author: { handle: "studioform" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Open horizon",
    category: "Landscape",
    media: {
      alt: "Open horizon",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 5472,
      width: 3648,
    },
    author: { handle: "openfield" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Working rhythm",
    category: "Workspace",
    media: {
      alt: "Working rhythm",
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 1536,
      width: 2301,
    },
    author: { handle: "workplace" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Shared table",
    category: "Studio",
    media: {
      alt: "Shared table",
      src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 2508,
      width: 3762,
    },
    author: { handle: "tabletalk" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "In session",
    category: "People",
    media: {
      alt: "In session",
      src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 7952,
      width: 5304,
    },
    author: { handle: "peopleandco" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "After hours",
    category: "Office",
    media: {
      alt: "After hours",
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 3648,
      width: 5472,
    },
    author: { handle: "afterhours" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "ChatGPT solved marketing",
    category: "AI",
    media: {
      alt: "Higgsfield video about ChatGPT solving marketing",
      poster:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-higgsfield-2094463266210902369-higgsfield-ai-chatgpt-solved-marketing.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "higgsfield_ai" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Webflow Conf 26",
    category: "Design",
    media: {
      alt: "Webflow Conf 26 announcement video",
      poster:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-webflow-2094538321611395240-webflow-conf-26-kicks-off-wednesday.mp4",
      type: "video",
      height: 900,
      width: 720,
    },
    author: { handle: "webflow" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Nothing OS 5",
    category: "Technology",
    media: {
      alt: "Nothing OS 5 video announcement",
      poster:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-nothing-2093624711850721534-nothing-os-5-brings-two-clock.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "nothing" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Flora creative brief",
    category: "Creative tools",
    media: {
      alt: "Flora AI creative brief video",
      poster:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-floraai-2094457833978732851-flora-newest-creative-brief-5-000.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "floraai" },
    source: { label: "View post", url: "https://posts.design" },
  },
] as const;

function createItems(start: number, count: number): GalleryItem[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset;
    const source = gallerySource[index % gallerySource.length];

    return {
      id: `gallery-${index}`,
      title: `${source.title} ${Math.floor(index / gallerySource.length) + 1}`,
      author: source.author,
      source: source.source,
      media: source.media,
    };
  });
}

export function InfiniteMasonryPreview() {
  const [debug, setDebug] = useState(true);
  const [items, setItems] = useState(() => createItems(0, 12));
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasMore = items.length < MAX_ITEMS;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 650));
    setItems((current) => {
      const count = Math.min(PAGE_SIZE, MAX_ITEMS - current.length);
      return count > 0
        ? [...current, ...createItems(current.length, count)]
        : current;
    });
    setLoading(false);
  }, [hasMore, loading]);

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <Button
          aria-pressed={debug}
          onClick={() => setDebug((current) => !current)}
          size="sm"
          variant="outline"
        >
          {debug ? "Hide debug" : "Show debug"}
        </Button>
      </div>
      <InfiniteMasonry
        ariaLabel="Visual inspiration gallery"
        debug={debug}
        estimateSize={(item, _index, columnWidth) =>
          columnWidth > 0
            ? columnWidth / (item.media.width / item.media.height) + 16
            : 360
        }
        getItemKey={(item) => item.id}
        hasMore={hasMore}
        items={items}
        maxColumns={3}
        loading={loading}
        onLoadMore={loadMore}
        renderItem={(item, index) => (
          <div className="relative" data-debug={debug || undefined}>
            <MediaCard
              debug={debug}
              item={item}
            />
            <button
              aria-label={`Open ${item.title}`}
              className="absolute inset-0 z-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setSelectedIndex(index)}
              type="button"
            />
          </div>
        )}
      />
      <MediaCardDialog
        debug={debug}
        items={items}
        onOpenChange={(open) => {
          if (!open) setSelectedIndex(null);
        }}
        open={selectedIndex !== null}
        selectedIndex={selectedIndex ?? 0}
      />
    </div>
  );
}
