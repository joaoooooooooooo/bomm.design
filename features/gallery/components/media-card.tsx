"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ArrowLink } from "./arrow-link";
import { AvatarBadge } from "./avatar-badge";
import { Button } from "@/components/ui/button";
import { buttonPressAnimation, cn } from "@/lib/utils";
import { MediaPreview } from "./media-preview";

export type MediaCardVariant = "default" | "hover" | "expanded";

import type { GalleryPost, MediaDimensions } from "../types";

export interface MediaCardProps extends ComponentProps<"article"> {
  autoPlay?: boolean;
  contentClassName?: string;
  item: GalleryPost;
  onMediaDimensionsChange?: (dimensions: MediaDimensions) => void;
  mediaLayoutId?: string;
  isOpening?: boolean;
  variant?: MediaCardVariant;
}

/** A media-first card with overlay, hover, and expanded presentation variants. */
export function MediaCard({
  autoPlay,
  className,
  contentClassName,
  item,
  onMediaDimensionsChange,
  mediaLayoutId,
  isOpening = false,
  variant = "default",
  ...props
}: MediaCardProps): React.ReactElement {
  const isExpanded = variant === "expanded";
  const media = !isExpanded && item.media.type === "image" && item.media.cardSrc
    ? { ...item.media, src: item.media.cardSrc }
    : item.media;
  const reduceMotion = useReducedMotion();
  const shouldAutoPlay = autoPlay ?? variant === "default";
  const isWebsite = item.section === "websites";
  const sourceLabel = isWebsite ? "Visit website" : item.source.label ?? "See post";
  const identityName = isWebsite ? item.website?.name ?? new URL(item.source.url).hostname.replace(/^www\./, "") : item.author?.handle ?? "";
  const identityImage = isWebsite ? item.website?.favicon ?? new URL("/favicon.ico", item.source.url).href : item.author?.avatar?.src ?? "";
  const identityAlt = isWebsite ? "" : item.author?.avatar?.alt ?? identityName;
  const [readySource, setReadySource] = useState<string>();
  const [requestedSource, setRequestedSource] = useState<string>();
  const mediaRef = useRef<HTMLDivElement>(null);
  const shouldLoad = isExpanded || requestedSource === media.src;
  const isReady = readySource === media.src;
  // The grid and its placeholder use the same metadata, before bytes are loaded.
  const mediaAspectRatio = `${item.media.width} / ${item.media.height}`;

  useEffect(() => {
    const element = mediaRef.current;
    if (!element || shouldLoad) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRequestedSource(media.src);
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [media.src, shouldLoad]);

  return (
    <article
      className={cn(
        "relative w-full",
        className,
      )}
      aria-busy={!isReady}
      data-slot="media-card"
      data-post-id={item.id}
      data-variant={variant}
      {...props}
    >
      <div
        className={cn(
          "relative w-full overflow-visible",
          isExpanded && "h-fit w-fit max-w-[100dvh]",
          contentClassName,
        )}
        style={isExpanded ? undefined : { aspectRatio: mediaAspectRatio }}
      >
        <motion.div
          ref={mediaRef}
          layoutId={reduceMotion ? undefined : mediaLayoutId}
          layoutDependency={isOpening}
          layoutCrossfade={false}
          transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
          className={cn(
            "w-full overflow-hidden rounded-2xl",
            isExpanded ? "relative h-full" : "absolute inset-0",
          )}
        >
          {!isReady && (
            <div aria-hidden="true" data-slot="media-placeholder" className="absolute inset-0 rounded-2xl bg-muted" />
          )}
          {shouldLoad && <MediaPreview
            autoPlay={shouldAutoPlay}
            className={cn(
              !isReady && "invisible",
              isExpanded
                ? "block max-h-[90dvh]"
                : "absolute inset-0",
            )}
            fit={isExpanded ? "contain" : "cover"}
            media={media}
            onDimensionsChange={item.media.type === "video" ? onMediaDimensionsChange : undefined}
            onReady={() => setReadySource(media.src)}
            preload={isExpanded ? "auto" : "metadata"}
          />}
          {!isExpanded && isReady ? (
            <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-between">
              <AvatarBadge
                avatarAlt={identityAlt}
                avatarSrc={identityImage}
                username={identityName}
                website={isWebsite}
              />
              {variant === "default" ? (
                <ArrowLink
                  aria-label={sourceLabel}
                  href={item.source.url}
                  rel="noreferrer"
                  target="_blank"
                />
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </div>
      {isExpanded ? (
        <div className="flex shrink-0 flex-col items-start justify-start gap-5 p-2 py-1 text-center">
          <AvatarBadge
            className="h-fit w-fit"
            avatarAlt={identityAlt}
            avatarSrc={identityImage}
            username={identityName}
            website={isWebsite}
            variant="secondary"
          />
          {item.title ? <h3 className="max-w-[264px] text-left text-3xl text-white">
            {item.title}
          </h3> : null}
          <Button
            className="h-fit w-fit"
            render={<motion.a {...buttonPressAnimation} whileTap={reduceMotion ? undefined : buttonPressAnimation.whileTap} href={item.source.url} rel="noreferrer" target="_blank" />}
            variant="outline"
          >
            {sourceLabel}
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </Button>
        </div>
      ) : null}
   
    </article>
  );
}
