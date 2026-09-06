import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogPrimitive } from "@/components/ui/dialog";
import { TabItem } from "@/components/ui/tab-items";
import { getCategoryPresentation } from "@/features/navigation/sections";
import type { Category, GalleryPost } from "../types";

/** Category and author metadata for the active gallery item. */
export function MediaDialogDetails({
  categories,
  closeControl,
  item,
}: {
  categories: readonly Category[];
  closeControl?: ReactNode;
  item: GalleryPost;
}) {
  const itemCategories = categories.filter((category) => item.categoryIds.includes(category.id));
  const handle = item.author.handle.startsWith("@") ? item.author.handle : `@${item.author.handle}`;

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
        <div className="flex max-w-full items-center gap-3 text-base leading-6">
          <Avatar className="size-12 rounded-md">
            <AvatarImage alt={item.author.avatar?.alt ?? item.author.name} src={item.author.avatar?.src} />
            <AvatarFallback className="rounded-md">{item.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-muted-foreground">Made By</p>
            <p className="break-all text-foreground">{handle}</p>
          </div>
        </div>
        <DialogPrimitive.Title className="w-full break-words text-2xl leading-8 font-normal tracking-tight">
          {item.title}
        </DialogPrimitive.Title>
        {item.description && (
          <DialogPrimitive.Description className="whitespace-pre-line break-words text-muted-foreground">
            {item.description}
          </DialogPrimitive.Description>
        )}
        <Button
          render={<a href={item.source.url} rel="noreferrer" target="_blank" />}
          variant="secondary"
        >
          View Original
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
