"use client";

import { useCallback, useState } from "react";
import {
  MediaCard,
  type MediaCardItem,
} from "@/app/Features/mediaGrid/Media Card/components/media-card";
import { MediaCardDialog } from "@/app/Features/mediaGrid/Media Card/components/media-card-dialog";
import { InfiniteMasonry } from "@/app/Features/mediaGrid/MasonryGrid/components/infinite-masonry";

type GalleryItem = MediaCardItem;
type MediaDimensions = { height: number; width: number };

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
  {
    title: "Morpho half billion",
    category: "Finance",
    media: {
      alt: "Morpho half billion video",
      poster:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-morpho-2095511647481999483-morpho-half-billion.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "morpho" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Claude and Fable 5.1",
    category: "AI",
    media: {
      alt: "Higgsfield video about Claude and Fable 5.1",
      poster:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-higgsfield-2095484820474486832-higgsfield-ai-claude-fable-5-1.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "higgsfield_ai" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Aave app early access",
    category: "Finance",
    media: {
      alt: "Aave app early access video",
      poster:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-aave-2095183378848923902-early-access-aave-app-underway.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "aave" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Tag Lovable in Slack",
    category: "Creative tools",
    media: {
      alt: "Lovable Slack integration video",
      poster:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-lovable-2095180014257930633-tag-lovable-slack.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "lovable" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Granola in 32 languages",
    category: "Productivity",
    media: {
      alt: "Granola language support video",
      poster:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-meetgranola-2095177566739194179-granola-supports-32-languages.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "meetgranola" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Agent design in 3D",
    category: "Design",
    media: {
      alt: "Framer agent design in 3D video",
      poster:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-framer-2095161979925348811-taught-framers-agent-design-3d.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "framer" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "360 imaging for everyone",
    category: "Technology",
    media: {
      alt: "DJI 360 imaging video",
      poster:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=720&q=80",
      src: "https://posts.design/media/posts/x-twitter-djiglobal-2095105029136904374-dji-360-imaging-everyone.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "djiglobal" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Axel is hiring a brand designer",
    category: "Careers",
    media: {
      alt: "Axel hiring a brand designer",
      src: "https://posts.design/images/posts/responsive/x-twitter-vistcreates-2095045063370014860-axel-hiring-brand-designer-thestudioth-thumb-w768-2646bc527d3b.avif",
      type: "image",
      height: 512,
      width: 768,
    },
    author: { handle: "vistcreates" },
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
  const [items, setItems] = useState(() => createItems(0, 12));
  const [loading, setLoading] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState<Record<string, MediaDimensions>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasMore = items.length < MAX_ITEMS;

  const handleMediaDimensions = useCallback(
    (id: string, dimensions: MediaDimensions) => {
      setMediaDimensions((current) => {
        const previous = current[id];

        if (
          previous?.width === dimensions.width &&
          previous.height === dimensions.height
        ) {
          return current;
        }

        return { ...current, [id]: dimensions };
      });
    },
    [],
  );

  const getAspectRatio = (item: GalleryItem) => {
    const dimensions = mediaDimensions[item.id] ?? item.media;
    return dimensions.width / dimensions.height;
  };

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
      <InfiniteMasonry
        ariaLabel="Visual inspiration gallery"
        estimateSize={(item, _index, columnWidth) =>
          columnWidth > 0 ? columnWidth / getAspectRatio(item) : 360
        }
        getItemKey={(item) => item.id}
        hasMore={hasMore}
        items={items}
        maxColumns={3}
        loading={loading}
        onLoadMore={loadMore}
        renderItem={(item, index) => (
          <div className="relative">
            <MediaCard
              autoPlay={selectedIndex === null}
              item={item}
              onMediaDimensions={(dimensions) =>
                handleMediaDimensions(item.id, dimensions)
              }
              resolvedMediaDimensions={mediaDimensions[item.id]}
            />
            <button
              aria-label={`Open ${item.title}`}
              className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setSelectedIndex(index)}
              type="button"
            />
          </div>
        )}
      />
      <MediaCardDialog
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
