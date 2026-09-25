"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  SunIcon,
  MoonIcon,
  EnvelopeIcon,
  SignpostIcon,
  DiamondsFourIcon,
  BoundingBoxIcon,
  GraduationCapIcon,
  ImageIcon,
  ImageSquareIcon,
  TextAaIcon,
  BookBookmarkIcon,
  LightbulbFilamentIcon,
  CodeIcon,
  PencilCircleIcon,
  LightningIcon,
  BookOpenTextIcon,
  UsersFourIcon,
  UserIcon,
  UsersThreeIcon,
  GraphIcon,
  ArticleIcon,
  ShoppingBagIcon,
  SparkleIcon,
  PaletteIcon,
  CirclesFourIcon,
  CopyrightIcon,
  PrinterIcon,
  ScribbleLoopIcon,
  LayoutIcon,
  CubeIcon,
  ChairIcon,
  DeviceMobileSpeakerIcon,
  SquareLogoIcon,
  WaveSineIcon,
  BookOpenIcon,
  BookmarkSimpleIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CreditCardIcon,
  GearIcon,
  GlobeIcon,
  HammerIcon,
  KeyIcon,
  PenNibIcon,
  PlugsIcon,
  QuestionIcon,
  SquaresFourIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import { Icon, iconVariants, type IconProps } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const tabIcons = {
  sun: SunIcon,
  moon: MoonIcon,
  envelope: EnvelopeIcon,
  "signpost": SignpostIcon,
  "diamonds-four": DiamondsFourIcon,
  "bounding-box": BoundingBoxIcon,
  "graduation-cap": GraduationCapIcon,
  "image": ImageIcon,
  "image-square": ImageSquareIcon,
  "text-aa": TextAaIcon,
  "book-bookmark": BookBookmarkIcon,
  "lightbulb-filament": LightbulbFilamentIcon,
  "code": CodeIcon,
  "pencil-circle": PencilCircleIcon,
  "lightning": LightningIcon,
  "book-open-text": BookOpenTextIcon,
  "users-four": UsersFourIcon,
  user: UserIcon,
  "users-three": UsersThreeIcon,
  graph: GraphIcon,
  article: ArticleIcon,
  "shopping-bag": ShoppingBagIcon,
  sparkle: SparkleIcon,
  palette: PaletteIcon,
  "circles-four": CirclesFourIcon,
  copyright: CopyrightIcon,
  printer: PrinterIcon,
  "scribble-loop": ScribbleLoopIcon,
  layout: LayoutIcon,
  cube: CubeIcon,
  chair: ChairIcon,
  "device-mobile-speaker": DeviceMobileSpeakerIcon,
  "square-logo": SquareLogoIcon,
  "wave-sine": WaveSineIcon,
  "book-open": BookOpenIcon,
  "bookmark-simple": BookmarkSimpleIcon,
  briefcase: BriefcaseIcon,
  "chart-bar": ChartBarIcon,
  "credit-card": CreditCardIcon,
  gear: GearIcon,
  globe: GlobeIcon,
  hammer: HammerIcon,
  key: KeyIcon,
  "pen-nib": PenNibIcon,
  plugs: PlugsIcon,
  question: QuestionIcon,
  "squares-four": SquaresFourIcon,
  users: UsersIcon,
} as const;

export type TabItemIconName = keyof typeof tabIcons;
export type TabItemIconVariant = Exclude<IconProps["variant"], "inactive" | null | undefined>;

const desktopTabLayout = "gap-2 sidebar-squircle rounded-[var(--sidebar-squircle-radius)] [--sidebar-squircle-radius:50px] py-1 pl-1 pr-2 text-sm leading-5";
const mobileTabLayout = "gap-3.5 sidebar-squircle rounded-[var(--sidebar-squircle-radius)] [--sidebar-squircle-radius:var(--radius-md)] p-2.5 text-xl leading-7 tracking-[-0.01em]";

export const tabItemVariants = cva(
  "inline-flex min-w-0 shrink-0 cursor-pointer items-center text-left font-normal outline-none transition-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: { variant: "active", size: "default" },
    variants: {
      variant: {
        active: `${desktopTabLayout} bg-sidebar-accent text-foreground`,
        inactive: `${desktopTabLayout} bg-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground`,
        "mobile-active": `${mobileTabLayout} bg-sidebar-accent text-foreground`,
        "mobile-inactive": `${mobileTabLayout} bg-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground`,
      },
      size: {
        default: "w-[197px]",
        md: "w-fit",
      },
    },
    compoundVariants: [
      { variant: ["mobile-active", "mobile-inactive"], size: "default", className: "w-[211px]" },
    ],
  },
);

export interface TabItemProps extends useRender.ComponentProps<"button"> {
  iconName?: TabItemIconName;
  iconWeight?: IconProps["weight"];
  /** Active icon palette; inactive icons use the shared muted treatment. */
  iconVariant?: TabItemIconVariant;
  label: string;
  variant?: VariantProps<typeof tabItemVariants>["variant"];
  size?: VariantProps<typeof tabItemVariants>["size"];
}

/** Reusable navigation presentation. The consumer supplies link or tab semantics through render/props. */
export function TabItem({
  className,
  iconName = "bookmark-simple",
  iconWeight = "fill",
  iconVariant = "pink",
  label,
  variant = "active",
  size = "default",
  render,
  ...props
}: TabItemProps): React.ReactElement {
  const reduceMotion = useReducedMotion();
  const isMobile = variant === "mobile-active" || variant === "mobile-inactive";
  const isActive = variant === "active" || variant === "mobile-active";
  const iconSize = !isMobile && size === "md" ? "md" : "lg";
  const defaultProps = {
    className: cn(tabItemVariants({ variant, size, className })),
    "data-slot": "tab-item",
    "data-variant": variant,
    "data-size": size,
    type: render ? undefined : "button" as const,
    children: (
      <motion.span
        className={cn("flex w-full min-w-0 items-center", isMobile ? "gap-3.5" : size === "md" ? "gap-1" : "gap-2")}
        tabIndex={-1}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        <span className="relative inline-flex shrink-0">
          <motion.span
            aria-hidden="true"
            className={cn(iconVariants({ variant: iconVariant }), "sidebar-squircle pointer-events-none absolute inset-0 rounded-[var(--sidebar-squircle-radius)] p-0", isMobile && "[--sidebar-squircle-radius:var(--radius-sm)]")}
            initial={false}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ type: "spring", duration: reduceMotion ? 0 : 0.3, bounce: 0 }}
          />
          <Icon
            className={cn("sidebar-squircle rounded-[var(--sidebar-squircle-radius)] bg-transparent", isMobile && "[--sidebar-squircle-radius:var(--radius-sm)]")}
            icon={tabIcons[iconName]}
            weight={iconWeight}
            size={iconSize}
            variant={isActive ? iconVariant : "inactive"}
          />
        </span>
        <span className={size === "md" ? "whitespace-nowrap" : "min-w-0 flex-1 break-words"}>{label}</span>
      </motion.span>
    ),
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}
