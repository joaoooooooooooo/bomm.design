import type React from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

export type ArrowLinkVariant = "desktop" | "mobile";

export interface ArrowLinkProps
  extends Omit<React.ComponentProps<"a">, "children"> {
  variant?: ArrowLinkVariant;
}

/** An icon-only link for media card overlays. */
export function ArrowLink({
  "aria-label": ariaLabel = "Open media",
  className,
  variant = "desktop",
  ...props
}: ArrowLinkProps): React.ReactElement {
  const isMobile = variant === "mobile";

  return (
    <a
      aria-label={ariaLabel}
      className={cn(
        "inline-flex  items-center justify-center rounded-full bg-black/25 transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
        isMobile ? "size-8 text-white" : "size-8 text-white",
        className,
      )}
      data-slot="arrow-link"
      {...props}
    >
      <ArrowUpRightIcon
        aria-hidden="true"
        className={isMobile ? "size-[10]" : "size-[17]"}
        weight="regular"
      />
    </a>
  );
}
