"use client";

import { useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ArrowLink } from "./arrow-link";
import { AvatarBadge } from "./avatar-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MediaPreview } from "./media-preview";

export type MediaCardVariant = "default" | "hover" | "expanded";

import type { GalleryPost } from "../types";

export interface MediaCardProps extends ComponentProps<"article"> {
  autoPlay?: boolean;
  contentClassName?: string;
  item: GalleryPost;
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
  mediaLayoutId,
  isOpening = false,
  variant = "default",
  ...props
}: MediaCardProps): React.ReactElement {
  const isExpanded = variant === "expanded";
  const reduceMotion = useReducedMotion();
  const shouldAutoPlay = autoPlay ?? variant === "default";
  const sourceLabel = item.source.label ?? "See post";
  const [readySource, setReadySource] = useState<string>();
  const isReady = readySource === item.media.src;
  // The grid and its placeholder use the same metadata, before bytes are loaded.
  const mediaAspectRatio = `${item.media.width} / ${item.media.height}`;

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
          layoutId={reduceMotion ? undefined : mediaLayoutId}
          layoutDependency={isOpening}
          layoutCrossfade={false}
          transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
          className={cn(
            "relative h-full w-full overflow-hidden rounded-2xl",
          )}
        >
          {!isReady && (
            <div aria-hidden="true" data-slot="media-placeholder" className="absolute inset-0 rounded-2xl bg-muted" />
          )}
          <MediaPreview
            autoPlay={shouldAutoPlay}
            className={cn(
              !isReady && "invisible",
              isExpanded
                ? "block max-h-[90dvh]"
                : "absolute inset-0",
            )}
            fit={isExpanded ? "contain" : "cover"}
            media={item.media}
            onReady={() => setReadySource(item.media.src)}
            preload={isExpanded ? "auto" : "metadata"}
          />
          {!isExpanded && isReady ? (
            <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-between">
              <AvatarBadge
                avatarAlt={item.author.avatar?.alt ?? item.author.handle}
                avatarSrc={item.author.avatar?.src}
                username={item.author.handle}
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
            avatarAlt={item.author.avatar?.alt ?? item.author.handle}
            avatarSrc={item.author.avatar?.src}
            username={item.author.handle}
            variant="secondary"
          />
          <h3 className="max-w-[264px] text-left text-3xl text-white">
            {item.title}
          </h3>
          <Button
            className="h-fit w-fit"
            render={<a href={item.source.url} rel="noreferrer" target="_blank" />}
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
