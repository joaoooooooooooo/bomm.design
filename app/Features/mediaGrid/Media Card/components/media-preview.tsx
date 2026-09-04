"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaCardItem } from "./media-card";

export type MediaDimensions = { height: number; width: number };

function VideoPreview({
  autoPlay,
  className,
  media,
  onDimensionsChange,
  preload,
}: {
  autoPlay: boolean;
  className: string;
  media: Extract<MediaCardItem["media"], { type: "video" }>;
  onDimensionsChange?: (dimensions: MediaDimensions) => void;
  preload: "auto" | "metadata" | "none";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [autoPlay]);

  if (hasError) {
    return (
      <img
        alt={media.alt}
        className={className}
        draggable={false}
        height={media.height}
        onLoad={(event) =>
          onDimensionsChange?.({
            height: event.currentTarget.naturalHeight,
            width: event.currentTarget.naturalWidth,
          })
        }
        src={media.poster}
        width={media.width}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      aria-label={media.alt}
      className={className}
      height={media.height}
      loop
      muted
      playsInline
      onError={() => setHasError(true)}
      onLoadedMetadata={(event) =>
        onDimensionsChange?.({
          height: event.currentTarget.videoHeight,
          width: event.currentTarget.videoWidth,
        })
      }
      preload={preload}
      src={media.src}
      width={media.width}
    />
  );
}

export function MediaPreview({
  autoPlay = false,
  className,
  fit = "cover",
  media,
  onDimensionsChange,
  preload = "metadata",
}: {
  autoPlay?: boolean;
  className?: string;
  fit?: "contain" | "cover";
  media: MediaCardItem["media"];
  onDimensionsChange?: (dimensions: MediaDimensions) => void;
  preload?: "auto" | "metadata" | "none";
}) {
  const objectFitClassName = fit === "contain" ? "object-contain" : "object-cover";

  if (media.type === "video") {
    return (
      <VideoPreview
        autoPlay={autoPlay}
        className={cn("h-full w-full", objectFitClassName, className)}
        media={media}
        onDimensionsChange={onDimensionsChange}
        preload={preload}
      />
    );
  }

  return (
    <img
      alt={media.alt}
      className={cn("h-full w-full", objectFitClassName, className)}
      draggable={false}
      height={media.height}
      onLoad={(event) =>
        onDimensionsChange?.({
          height: event.currentTarget.naturalHeight,
          width: event.currentTarget.naturalWidth,
        })
      }
      src={media.src}
      width={media.width}
    />
  );
}
