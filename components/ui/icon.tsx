"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const iconVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-sm p-1 transition-colors",
  {
    defaultVariants: {
      size: "lg",
      variant: "blue",
    },
    variants: {
      size: {
        lg: "[&_svg]:size-[22px]",
        md: "[&_svg]:size-[14px]",
        sm: "[&_svg]:size-[10px]",
      },
      variant: {
        blue: "bg-blue-500/20 text-blue-500",
        pink: "bg-pink-500/20 text-pink-500",
        orange: "bg-orange-500/20 text-orange-500",
        teal: "bg-teal-500/20 text-teal-500",
        neutral: "bg-muted-foreground text-foreground",
        inactive: "bg-transparent text-muted-foreground opacity-25",
      },
    },
  },
);

export interface IconProps extends useRender.ComponentProps<"span"> {
  icon: PhosphorIcon;
  label?: string;
  size?: VariantProps<typeof iconVariants>["size"];
  variant?: VariantProps<typeof iconVariants>["variant"];
}

export function Icon({
  className,
  icon: Glyph,
  label,
  size,
  variant,
  render,
  ...props
}: IconProps): React.ReactElement {
  const defaultProps = {
    children: (
      <Glyph
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        weight="fill"
      />
    ),
    "aria-label": label,
    className: cn(iconVariants({ className, size, variant })),
    "data-slot": "icon",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}
