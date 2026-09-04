"use client";

import * as React from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstanceColor,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
} from "@rive-app/react-webgl2";

import { cn } from "@/lib/utils";

type BomboCharacterProps = {
  className?: string;
  colorVariant?: BomboColorVariant;
};

export type BomboColorVariant = "blue" | "orange" | "pink";

const MIN_DELTA = 3;
const MAX_POSITION = 500;
const COLOR_STEPS = [50, 200, 300, 400, 500, 600, 700, 800] as const;
const X_MAX_PERCENT = 100;
const X_MIN_PERCENT = 40;
const STATE_MACHINE = "BomboStateMachine";
const VIEW_MODEL = "ViewModel1";

const PALETTES: Record<
  BomboColorVariant,
  Record<(typeof COLOR_STEPS)[number], `#${string}`>
> = {
  blue: {
    50: "#eff6ff",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
  },
  orange: {
    50: "#fff7ed",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
  },
  pink: {
    50: "#fdf2f8",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
  },
};

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function mapPercentToJoystick(percent: number): number {
  const normalized = (percent + 100) / 200;
  return Math.round(clamp01(normalized) * MAX_POSITION);
}

function mapViewportX(clientX: number, unlockFullX: boolean): number {
  if (typeof window === "undefined") {
    return mapPercentToJoystick(X_MAX_PERCENT);
  }

  const safeViewportWidth = Math.max(window.innerWidth, 1);
  const viewportProgress = clamp01(clientX / safeViewportWidth);

  if (unlockFullX) {
    return Math.round(viewportProgress * MAX_POSITION);
  }

  const minX = mapPercentToJoystick(X_MIN_PERCENT);
  const maxX = mapPercentToJoystick(X_MAX_PERCENT);

  return Math.round(minX + viewportProgress * (maxX - minX));
}

function mapViewportY(clientY: number): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const safeViewportHeight = Math.max(window.innerHeight, 1);
  const viewportProgress = clamp01(clientY / safeViewportHeight);

  return Math.round(viewportProgress * MAX_POSITION);
}

function isInsideRect(clientX: number, clientY: number, rect: DOMRect): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function mapPointWithinRect(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const progressX = clamp01((clientX - rect.left) / Math.max(rect.width, 1));
  const progressY = clamp01((clientY - rect.top) / Math.max(rect.height, 1));

  return {
    x: Math.round(progressX * MAX_POSITION),
    y: Math.round(progressY * MAX_POSITION),
  };
}

function hexToRiveColor(hex: `#${string}`): number {
  const rgb = Number.parseInt(hex.slice(1), 16);
  return ((0xff << 24) | rgb) >>> 0;
}

function useBomboPalette(
  colorVariant: BomboColorVariant,
  viewModelInstance: ReturnType<typeof useViewModelInstance>,
) {
  const color50 = useViewModelInstanceColor("color50", viewModelInstance);
  const color200 = useViewModelInstanceColor("color200", viewModelInstance);
  const color300 = useViewModelInstanceColor("color300", viewModelInstance);
  const color400 = useViewModelInstanceColor("color400", viewModelInstance);
  const color500 = useViewModelInstanceColor("color500", viewModelInstance);
  const color600 = useViewModelInstanceColor("color600", viewModelInstance);
  const color700 = useViewModelInstanceColor("color700", viewModelInstance);
  const color800 = useViewModelInstanceColor("color800", viewModelInstance);

  React.useEffect(() => {
    const palette = PALETTES[colorVariant];
    const setters = {
      50: color50,
      200: color200,
      300: color300,
      400: color400,
      500: color500,
      600: color600,
      700: color700,
      800: color800,
    } as const;

    COLOR_STEPS.forEach((step) => {
      setters[step].setValue(hexToRiveColor(palette[step]));
    });
  }, [
    color50,
    color200,
    color300,
    color400,
    color500,
    color600,
    color700,
    color800,
    colorVariant,
  ]);
}

export function BomboCharacter({
  className,
  colorVariant = "blue",
}: BomboCharacterProps) {
  const { rive, RiveComponent } = useRive({
    src: "/braza_design.riv",
    stateMachine: STATE_MACHINE,
    autoplay: true,
    autoBind: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  const viewModel = useViewModel(rive, { name: VIEW_MODEL });
  const viewModelInstance = useViewModelInstance(viewModel, { rive });
  const moveX = useViewModelInstanceNumber("moveX", viewModelInstance);
  const move = useViewModelInstanceNumber("move", viewModelInstance);
  const moveY = useViewModelInstanceNumber("moveY", viewModelInstance);
  const { trigger: triggerBlink } = useViewModelInstanceTrigger(
    "triggerBlink",
    viewModelInstance,
  );
  const lastPositionRef = React.useRef({ x: -1, y: -1 });
  const sidebarRectRef = React.useRef<DOMRect | null>(null);
  const pendingPointerRef = React.useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  useBomboPalette(colorVariant, viewModelInstance);

  const writeValues = React.useEffectEvent((x: number, y: number) => {
    const lastPosition = lastPositionRef.current;

    if (lastPosition.x < 0 || Math.abs(x - lastPosition.x) >= MIN_DELTA) {
      moveX.setValue(x);
      lastPosition.x = x;
    }

    if (lastPosition.y < 0 || Math.abs(y - lastPosition.y) >= MIN_DELTA) {
      if (moveY.value !== null) {
        moveY.setValue(y);
      } else {
        move.setValue(y);
      }

      lastPosition.y = y;
    }
  });

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sidebar = document.querySelector<HTMLElement>(
      '[data-slot="sidebar-container"]',
    );
    const updateSidebarRect = () => {
      sidebarRectRef.current = sidebar?.getBoundingClientRect() ?? null;
    };

    const updateFromViewport = (clientX: number, clientY: number) => {
      const sidebarRect = sidebarRectRef.current;
      const isInsideSidebar =
        sidebarRect !== null && isInsideRect(clientX, clientY, sidebarRect);

      let nextX: number;
      let nextY: number;

      if (isInsideSidebar && sidebarRect) {
        const mappedPoint = mapPointWithinRect(clientX, clientY, sidebarRect);
        nextX = mappedPoint.x;
        nextY = mappedPoint.y;
      } else {
        nextX = mapViewportX(clientX, false);
        nextY = mapViewportY(clientY);
      }

      writeValues(nextX, nextY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      pendingPointerRef.current = { x: event.clientX, y: event.clientY };

      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        const pointer = pendingPointerRef.current;

        if (pointer) {
          updateFromViewport(pointer.x, pointer.y);
        }
      });
    };

    updateSidebarRect();
    updateFromViewport(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateSidebarRect);
    window.addEventListener("scroll", updateSidebarRect, true);

    const resizeObserver = new ResizeObserver(updateSidebarRect);
    if (sidebar) {
      resizeObserver.observe(sidebar);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateSidebarRect);
      window.removeEventListener("scroll", updateSidebarRect, true);
      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleClick = () => {
      triggerBlink();
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [triggerBlink]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-muted/30",
        className,
      )}
    >
      <RiveComponent className="size-full" />
    </div>
  );
}
