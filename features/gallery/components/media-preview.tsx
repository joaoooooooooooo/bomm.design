"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { GalleryPost, MediaDimensions } from "../types";
export type { MediaDimensions } from "../types";

export type VideoHandoff = MediaDimensions & {
  video: HTMLVideoElement;
  home: HTMLElement;
};

/** Transfer the existing decoder and playback position without copying pixels. */
export function captureVideoHandoff(video: HTMLVideoElement): VideoHandoff | undefined {
  const home = video.parentElement;
  if (!home || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
  return { video, home, width: video.videoWidth, height: video.videoHeight };
}

const OWNERSHIP_CHANGE = "media-preview-ownership-change";

/** Release a lent decoder only when its original virtualized card is gone. */
export function releaseVideoHandoff(handoff: VideoHandoff) {
  if (handoff.home.isConnected) return;
  handoff.video.pause();
  handoff.video.removeAttribute("src");
  handoff.video.load();
}

function createVideo(src: string, poster?: string) {
  const video = document.createElement("video");
  video.className = "h-full w-full [object-fit:inherit]";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "none";
  video.src = src;
  if (poster) video.poster = poster;
  return video;
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
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visibleRef = useRef(false);
  const [hasError, setHasError] = useState(false);

  const updatePlayback = useEffectEvent(() => {
    const video = videoRef.current;
    // A gallery preview must not pause or reconfigure a video lent to the dialog.
    if (!video || video.parentElement !== hostRef.current) return;
    video.controls = controls;
    video.preload = preload;
    if (autoPlay && !reduceMotion && visibleRef.current && !document.hidden) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  });
  const reportMetadata = useEffectEvent(() => {
    const video = videoRef.current;
    if (!video || video.parentElement !== hostRef.current) return;
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      onDimensionsChange?.({ width: video.videoWidth, height: video.videoHeight });
    }
    // Decode a still preview for paused, posterless neighbors without starting
    // playback or seeking the live video transferred from the gallery.
    if (!videoHandoff && !media.poster && preload !== "none" && video.paused && video.currentTime === 0) {
      video.currentTime = Number.isFinite(video.duration)
        ? Math.min(0.001, video.duration / 2)
        : 0.001;
    }
  });
  const reportReady = useEffectEvent(() => {
    if (videoRef.current?.parentElement === hostRef.current) onReady?.();
  });

  // React owns the empty host; this effect owns its video child. Moving a React-
  // rendered video would break reconciliation when the virtualized card unmounts.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const video = videoHandoff?.video ?? createVideo(media.src, media.poster);
    videoRef.current = video;
    video.setAttribute("aria-label", media.alt);
    host.appendChild(video);
    video.dispatchEvent(new Event(OWNERSHIP_CHANGE));

    return () => {
      if (video.parentElement !== host) return;
      if (videoHandoff?.home.isConnected) {
        videoHandoff.home.appendChild(video);
        video.dispatchEvent(new Event(OWNERSHIP_CHANGE));
      } else {
        video.pause();
        video.remove();
        // A borrowed video can return when navigating back through the carousel.
        // The gallery releases it when the dialog session ends.
        if (!videoHandoff) {
          video.removeAttribute("src");
          video.load();
        }
      }
    };
  }, [media.src, media.poster, media.alt, videoHandoff]);

  useEffect(() => {
    const video = videoRef.current;
    const host = hostRef.current;
    if (!video || !host) return;
    const metadata = () => reportMetadata();
    const ready = () => reportReady();
    const error = () => {
      if (video.parentElement !== host) return;
      setHasError(true);
      reportReady();
    };
    const refresh = () => updatePlayback();
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      updatePlayback();
    });
    // Observe the stable host, not the video which can move to another preview.
    observer.observe(host);
    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("loadeddata", ready);
    video.addEventListener("error", error);
    video.addEventListener(OWNERSHIP_CHANGE, refresh);
    document.addEventListener("visibilitychange", refresh);
    if (video.readyState >= 1) reportMetadata();
    if (video.readyState >= 2) reportReady();
    updatePlayback();
    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("error", error);
      video.removeEventListener(OWNERSHIP_CHANGE, refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [media.src, media.poster, media.alt, videoHandoff]);

  // Prop changes update playback without rebuilding the observer and listeners.
  useEffect(() => { updatePlayback(); }, [autoPlay, controls, preload, reduceMotion]);

  return (
    <div className={cn("relative", className)}>
      <div ref={hostRef} className="h-full w-full [object-fit:inherit]" />
      {hasError && (
        <div role="img" aria-label={`${media.alt}: video unavailable`} className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
          Video unavailable
        </div>
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
        key={media.src}
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
