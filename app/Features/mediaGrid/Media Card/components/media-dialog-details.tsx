import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AvatarBadge } from "./avatar-badge";
import type { MediaCardItem } from "./media-card";
import { AnimatePresence, motion } from "motion/react";

export function MediaDialogDetails({
  closeControl,
  item,
}: {
  closeControl?: ReactNode;
  item: MediaCardItem;
  position: number;
  total: number;
}) {
  const sourceLabel = item.source.label ?? "See post";

  return (

      <div>
        {closeControl}
        <div className="space-y-6">
          <div>
            <AvatarBadge
              avatarAlt={item.author.avatar?.alt ?? item.author.handle}
              avatarSrc={item.author.avatar?.src}
              username={item.author.handle}
              variant="secondary"
            />
          </div>

          <h2 className="max-w-xl text-balance text-3xl leading-tight tracking-tight md:text-5xl">
            {item.title}
          </h2>
        </div>
        <Button
          className="w-fit"
          render={<a href={item.source.url} rel="noreferrer" target="_blank" />}
          variant="outline"
        >
          {sourceLabel}
          <ArrowUpRightIcon aria-hidden="true" className="size-5" />
        </Button>
      </div>
     
   
  );
}
