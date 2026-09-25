"use client";

import { ArrowUpRightIcon, GlobeIcon } from "@phosphor-icons/react/ssr";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogPrimitive } from "@/components/ui/dialog";
import { TabItem } from "@/components/ui/tab-items";
import { getCategoryPresentation } from "@/features/navigation/sections";
import { buttonPressAnimation } from "@/lib/utils";
import type { Category, GalleryPost } from "../types";

/** Category and collection-specific identity for the active gallery item. */
export function MediaDialogDetails({
  categories,
  closeControl,
  item,
}: {
  categories: readonly Category[];
  closeControl?: ReactNode;
  item: GalleryPost;
}) {
  const reduceMotion = useReducedMotion();
  const itemCategories = categories.filter((category) => item.categoryIds.includes(category.id));
  const isWebsite = item.section === "websites";
  const websiteName = isWebsite ? item.website?.name ?? new URL(item.source.url).hostname.replace(/^www\./, "") : "";
  const handle = item.author?.handle;

  return (
    <div className="flex min-w-0 flex-col items-start gap-12">
      {closeControl}

      {itemCategories.length > 0 && (
        <ul aria-label="Categories" className="flex max-w-full flex-wrap gap-2">
          {itemCategories.map((category) => (
            <li key={category.id} className="min-w-0 max-w-full">
              <TabItem
                {...getCategoryPresentation(category.section, category.slug)}
                label={category.name}
                size="md"
                variant="active"
                render={<span />}
                className="max-w-full [&_span]:whitespace-normal [&_span]:break-words"
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex w-full min-w-0 flex-col items-start gap-6">
        {isWebsite ? (
          <div className="flex max-w-full items-center gap-2 text-base leading-6">
            <Avatar className="size-5 rounded-sm">
              <AvatarImage alt="" src={item.website?.favicon ?? new URL("/favicon.ico", item.source.url).href} referrerPolicy="no-referrer" className="object-contain" />
              <AvatarFallback className="rounded-sm"><GlobeIcon aria-hidden="true" className="size-4" /></AvatarFallback>
            </Avatar>
            <p className="min-w-0 break-words text-foreground">{websiteName}</p>
          </div>
        ) : item.author && (
        <div className="flex max-w-full items-center gap-3 text-base leading-6">
          <Avatar className="size-12 rounded-md">
            <AvatarImage alt={item.author.avatar?.alt ?? item.author.name} src={item.author.avatar?.src} />
            <AvatarFallback className="rounded-md">{item.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-muted-foreground">Made By</p>
            <p className="break-all text-foreground">{handle?.startsWith("@") ? handle : `@${handle}`}</p>
          </div>
        </div>
        )}
        <DialogPrimitive.Title className={item.title ? "w-full break-words text-xl/normal font-normal tracking-tight lg:text-2xl lg:leading-8" : "sr-only"}>
          {item.title || item.media.alt}
        </DialogPrimitive.Title>
        {item.description && (
          <DialogPrimitive.Description className="whitespace-pre-line break-words text-xl/normal font-normal tracking-tight text-foreground lg:text-2xl lg:leading-8">
            {item.description}
          </DialogPrimitive.Description>
        )}
        <Button
          render={<motion.a {...buttonPressAnimation} whileTap={reduceMotion ? undefined : buttonPressAnimation.whileTap} href={item.source.url} rel="noreferrer" target="_blank" />}
          variant="secondary"
        >
          {isWebsite ? "Visit website" : "View Original"}
          <ArrowUpRightIcon aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
