"use client";

import type React from "react";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import {
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
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type ActiveIconVariant = Exclude<
  IconProps["variant"],
  "inactive" | null | undefined
>;
export type SidebarItemIconVariant = ActiveIconVariant;
export type SidebarItemIconName =
  | "bookmark-simple"
  | "book-open"
  | "briefcase"
  | "chart-bar"
  | "credit-card"
  | "gear"
  | "globe"
  | "hammer"
  | "key"
  | "pen-nib"
  | "plugs"
  | "question"
  | "squares-four"
  | "users";

const sidebarIcons = {
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

const sidebarItemVariants = cva(
  "h-auto min-h-0 w-full gap-2 p-1 text-left text-sm font-normal leading-5 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2",
  {
    defaultVariants: {
      state: "inactive",
    },
    variants: {
      state: {
        active: "bg-sidebar-accent text-foreground",
        inactive:
          "bg-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
        collapsed: "bg-sidebar-accent text-foreground",
        "collapsed-inactive":
          "bg-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      },
    },
  },
);

export interface SidebarItemProps
  extends React.ComponentProps<typeof SidebarMenuButton> {
  iconVariant?: ActiveIconVariant;
  iconName?: SidebarItemIconName;
  label: string;
  state?: "active" | "inactive" | "collapsed" | "collapsed-inactive";
}

export function SidebarItem({
  className,
  iconVariant = "pink",
  iconName = "bookmark-simple",
  label,
  state = "inactive",
  style,
  ...props
}: SidebarItemProps): React.ReactElement {
  const reduceMotion = useReducedMotion();
  const isCollapsed = state === "collapsed" || state === "collapsed-inactive";
  const isInactive = state === "inactive" || state === "collapsed-inactive";
  const glyph = sidebarIcons[iconName];
  const resolvedIconVariant: IconProps["variant"] =
    isInactive ? "inactive" : iconVariant;

  return (
    <SidebarMenuButton
      className={cn(
        "sidebar-squircle",
        sidebarItemVariants({ state }),
        className,
      )}
      isActive={state === "active" || state === "collapsed"}
      style={
        {
          "--sidebar-squircle-radius": "50px",
          ...style,
        } as React.CSSProperties
      }
      tooltip={label}
      {...props}
    >
      <motion.div
        className="flex w-full min-w-0 items-center gap-2"
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        <span
          className="relative inline-flex shrink-0"
          style={
            {
              "--sidebar-squircle-radius": "50px",
            } as React.CSSProperties
          }
        >
          <motion.span
            aria-hidden="true"
            className={cn(
              iconVariants({ variant: resolvedIconVariant }),
              "sidebar-squircle pointer-events-none absolute inset-0 p-0",
            )}
            initial={false}
            animate={{ transform: isInactive ? "scale(0)" : "scale(1)" }}
            transition={{ type: "spring", duration: reduceMotion ? 0 : 0.3, bounce: 0 }}
          />
          <Icon
            className="bg-transparent p-[4.5px]"
            icon={glyph}
            label={isCollapsed ? label : undefined}
            size="lg"
            variant={resolvedIconVariant}
          />
        </span>
        {!isCollapsed ? <span className="truncate">{label}</span> : null}
      </motion.div>
    </SidebarMenuButton>
  );
}
