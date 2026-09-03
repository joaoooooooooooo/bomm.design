"use client";

import type * as React from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ArrowLink } from "./arrow-link";
import { AvatarBadge } from "./avatar-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MediaPreview } from "./media-preview";

export type MediaCardVariant = "default" | "hover" | "expanded";

export type MediaCardItem = {
  author: {
    avatar?: { alt: string; src: string };
    handle: string;
  };
  id: string;
  media:
    | { alt: string; height: number; src: string; type: "image"; width: number }
    | {
        alt: string;
        height: number;
        poster: string;
        src: string;
        type: "video";
        width: number;
      };
  source: { label?: string; url: string };
  title: string;
};

export interface MediaCardProps extends React.ComponentProps<"article"> {
  contentClassName?: string;
  debug?: boolean;
  item: MediaCardItem;
  variant?: MediaCardVariant;
}

/** A media-first card with overlay, hover, and expanded presentation variants. */
export function MediaCard({
  className,
  contentClassName,
  debug = false,
  item,
  variant = "default",
  ...props
}: MediaCardProps): React.ReactElement {
  const isExpanded = variant === "expanded";
  const sourceLabel = item.source.label ?? "See post";
  const mediaAspectRatio = `${item.media.width} / ${item.media.height}`;

  return (
    <article
      className={cn(
        "relative w-full items-center justify-center p-2",
        isExpanded && "flex min-h-dvh items-center justify-center gap-10",
        debug && "outline outline-1 outline-dashed outline-cyan-400",
        className,
      )}
      data-debug-level={debug ? "media-card" : undefined}
      data-slot="media-card"
      data-variant={variant}
      {...props}
    >
      <div
        className={cn(
          "relative w-full overflow-visible",
          isExpanded && "h-fit w-fit max-w-[100dvh]",
          debug && "outline outline-1 outline-dashed outline-fuchsia-400",
          contentClassName,
        )}
        data-debug-level={debug ? "media-card-frame" : undefined}
        style={isExpanded ? undefined : { aspectRatio: mediaAspectRatio }}
      >
        {debug ? (
          <span className="pointer-events-none absolute left-1 top-1 z-30 rounded bg-fuchsia-400 px-1 py-0.5 font-mono text-[10px] leading-none text-black">
            card frame
          </span>
        ) : null}
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-2xl",
            debug && "outline outline-1 outline-dashed outline-lime-400",
          )}
          data-debug-level={debug ? "media-card-shared-layout" : undefined}
        >
          {debug ? (
            <span className="pointer-events-none absolute left-1 top-5 z-30 rounded bg-lime-400 px-1 py-0.5 font-mono text-[10px] leading-none text-black">
              shared layout
            </span>
          ) : null}
          <MediaPreview
            autoPlay={variant === "default"}
            className={cn(
              isExpanded
                ? "block max-h-[90dvh]"
                : "absolute inset-0",
            )}
            fit={isExpanded ? "contain" : "cover"}
            media={item.media}
            preload={isExpanded ? "auto" : "metadata"}
          />
          {!isExpanded ? (
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
        </div>
      </div>
      {debug ? (
        <span className="pointer-events-none absolute left-3 top-3 z-30 rounded bg-cyan-400 px-1 py-0.5 font-mono text-[10px] leading-none text-black">
          media card
        </span>
      ) : null}
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
