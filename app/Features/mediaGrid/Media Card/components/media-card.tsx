import type React from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ArrowLink } from "./arrow-link";
import { AvatarBadge } from "./avatar-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaCardVariant = "default" | "hover" | "expanded";

export type MediaCardItem = {
  author: {
    avatar?: {
      alt: string;
      src: string;
    };
    handle: string;
  };
  id: string;
  media:
    | {
        alt: string;
        aspectRatio?: number;
        src: string;
        type: "image";
      }
    | {
        alt: string;
        aspectRatio?: number;
        poster: string;
        src: string;
        type: "video";
      };
  source: {
    label?: string;
    url: string;
  };
  title: string;
};

export interface MediaCardProps extends React.ComponentProps<"article"> {
  contentClassName?: string;
  item: MediaCardItem;
  variant?: MediaCardVariant;
}

/** A media-first card with overlay, hover, and expanded presentation variants. */
export function MediaCard({
  className,
  contentClassName,
  item,
  variant = "default",
  ...props
}: MediaCardProps): React.ReactElement {
  const isExpanded = variant === "expanded";
  const mediaStyle = item.media.aspectRatio
    ? { aspectRatio: item.media.aspectRatio }
    : undefined;
  const sourceLabel = item.source.label ?? "See post";

  return (
    <article
      className={cn("w-full max-w-[700.5px]", className)}
      data-slot="media-card"
      data-variant={variant}
      {...props}
    >
      <div className="flex flex-col gap-5">
        {isExpanded ? (
          <h3 className="max-w-[264px] text-lg leading-7 tracking-[-0.18px] text-white">
            {item.title}
          </h3>
        ) : null}
        <div
          className={cn(
            "relative flex aspect-[700.5/588] w-full items-end overflow-hidden rounded-2xl border border-image-border p-2",
            contentClassName,
          )}
          style={mediaStyle}
        >
          {item.media.type === "video" ? (
            <video
              aria-label={item.media.alt}
              className="absolute inset-0 size-full object-cover"
              muted
              playsInline
              poster={item.media.poster}
              preload="metadata"
              src={item.media.src}
            />
          ) : (
            // CMS image URLs are not limited to configured Next Image domains.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={item.media.alt}
              className="absolute inset-0 size-full object-cover"
              src={item.media.src}
            />
          )}
          {!isExpanded ? (
            <div className="relative z-10 flex w-full items-center justify-between">
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
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <AvatarBadge
              avatarAlt={item.author.avatar?.alt ?? item.author.handle}
              avatarSrc={item.author.avatar?.src}
              username={item.author.handle}
              variant="secondary"
            />
            <Button
              render={
                <a
                  href={item.source.url}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              variant="outline"
            >
              {sourceLabel}
              <ArrowUpRightIcon aria-hidden="true" className="size-5" />
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
