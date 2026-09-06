"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { GalleryPost, MediaDimensions } from "../types";
export type { MediaDimensions } from "../types";

export type VideoHandoff = MediaDimensions & {
  frame: HTMLCanvasElement;
  currentTime: number;
};

export function captureVideoHandoff(video: HTMLVideoElement): VideoHandoff | undefined {
  if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
  const frame = document.createElement("canvas");
  frame.width = video.videoWidth;
  frame.height = video.videoHeight;
  const context = frame.getContext("2d");
  if (!context) return;
  // Display the canvas directly; no pixel readback or cross-origin export is needed.
  context.drawImage(video, 0, 0);
  return { frame, currentTime: video.currentTime, width: frame.width, height: frame.height };
}

function VideoPreview({
  autoPlay,
  controls,
  className,
  media,
  onDimensionsChange,
  onReady,
  preload,
  videoHandoff,
}: {
  autoPlay: boolean;
  controls: boolean;
  className: string;
  media: Extract<GalleryPost["media"], { type: "video" }>;
  onDimensionsChange?: (dimensions: MediaDimensions) => void;
  onReady?: () => void;
  preload: "auto" | "metadata" | "none";
  videoHandoff?: VideoHandoff;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoHandoff) return;
    let frameId: number | undefined;
    let animationFrame: number | undefined;
    let initialized = false;
    const revealFrame = () => {
      if (!initialized || video.seeking || video.readyState < 2) return;
      if (video.requestVideoFrameCallback) {
        if (frameId !== undefined) video.cancelVideoFrameCallback(frameId);
        frameId = video.requestVideoFrameCallback(() => setFrameReady(true));
      } else {
        animationFrame = requestAnimationFrame(() => setFrameReady(true));
      }
    };
    const restorePlayback = () => {
      if (initialized) return;
      initialized = true;
      video.currentTime = Number.isFinite(video.duration)
        ? Math.min(videoHandoff.currentTime, Math.max(0, video.duration - 0.01))
        : videoHandoff.currentTime;
      revealFrame();
    };
    video.addEventListener("loadedmetadata", restorePlayback);
    video.addEventListener("seeked", revealFrame);
    video.addEventListener("loadeddata", revealFrame);
    if (video.readyState >= 1) restorePlayback();
    return () => {
      video.removeEventListener("loadedmetadata", restorePlayback);
      video.removeEventListener("seeked", revealFrame);
      video.removeEventListener("loadeddata", revealFrame);
      if (frameId !== undefined) video.cancelVideoFrameCallback(frameId);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, [videoHandoff]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let visible = false;
    const updatePlayback = () => {
      if (autoPlay && !reduceMotion && visible && !document.hidden) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [autoPlay, reduceMotion]);

  if (hasError && !videoHandoff) {
    if (!media.poster) {
      return (
        <div
          aria-label={`${media.alt}: video unavailable`}
          className={cn("grid place-items-center bg-muted text-sm text-muted-foreground", className)}
          role="img"
        >
          Video unavailable
        </div>
      );
    }
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

  const video = (
    <video
      ref={videoRef}
      aria-label={media.alt}
      className={videoHandoff ? "h-full w-full [object-fit:inherit]" : className}
      height={media.height}
      controls={controls}
      loop
      muted
      playsInline
      poster={videoHandoff ? undefined : media.poster}
      onLoadedData={onReady}
      onError={() => {
        setHasError(true);
        onReady?.();
      }}
      onLoadedMetadata={(event) => {
        const element = event.currentTarget;
        onDimensionsChange?.({
          height: element.videoHeight,
          width: element.videoWidth,
        });
        // Decode a real preview frame even when this slide stays paused.
        if (!videoHandoff && !media.poster && element.currentTime === 0) {
          element.currentTime = Number.isFinite(element.duration)
            ? Math.min(0.001, element.duration / 2)
            : 0.001;
        }
      }}
      preload={preload}
      src={media.src}
      width={media.width}
    />
  );

  if (!videoHandoff) return video;

  return (
    <div className={cn("relative", className)}>
      {video}
      {(!frameReady || hasError) && (
        <canvas
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full [object-fit:inherit]"
          height={videoHandoff.height}
          width={videoHandoff.width}
          ref={(canvas) => {
            canvas?.getContext("2d")?.drawImage(videoHandoff.frame, 0, 0);
          }}
        />
      )}
    </div>
  );
}

export function MediaPreview({
  autoPlay = false,
  controls = false,
  className,
  fit = "cover",
  media,
  onDimensionsChange,
  onReady,
  preload = "metadata",
  videoHandoff,
}: {
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  fit?: "contain" | "cover";
  media: GalleryPost["media"];
  onDimensionsChange?: (dimensions: MediaDimensions) => void;
  onReady?: () => void;
  preload?: "auto" | "metadata" | "none";
  videoHandoff?: VideoHandoff;
}) {
  const objectFitClassName = fit === "contain" ? "object-contain" : "object-cover";

  if (media.type === "video") {
    return (
      <VideoPreview
        autoPlay={autoPlay}
        controls={controls}
        className={cn("h-full w-full", objectFitClassName, className)}
        media={media}
        onDimensionsChange={onDimensionsChange}
        onReady={onReady}
        preload={preload}
        videoHandoff={videoHandoff}
      />
    );
  }

  return (
    <img
      alt={media.alt}
      className={cn("h-full w-full", objectFitClassName, className)}
      draggable={false}
      height={media.height}
      onLoad={(event) => {
        onDimensionsChange?.({
          height: event.currentTarget.naturalHeight,
          width: event.currentTarget.naturalWidth,
        });
        onReady?.();
      }}
      onError={onReady}
      src={media.src}
      width={media.width}
    />
  );
}
