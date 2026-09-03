"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaCardItem } from "./media-card";

function VideoPreview({
  autoPlay,
  className,
  media,
  preload,
}: {
  autoPlay: boolean;
  className: string;
  media: Extract<MediaCardItem["media"], { type: "video" }>;
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
  preload = "metadata",
}: {
  autoPlay?: boolean;
  className?: string;
  fit?: "contain" | "cover";
  media: MediaCardItem["media"];
  preload?: "auto" | "metadata" | "none";
}) {
  const objectFitClassName = fit === "contain" ? "object-contain" : "object-cover";

  if (media.type === "video") {
    return (
      <VideoPreview
        autoPlay={autoPlay}
        className={cn("h-full w-full", objectFitClassName, className)}
        media={media}
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
      src={media.src}
      width={media.width}
    />
  );
}
