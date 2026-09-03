import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { AvatarBadge } from "./avatar-badge";
import type { MediaCardItem } from "./media-card";

export function MediaDialogDetails({
  item,
  position,
  total,
}: {
  item: MediaCardItem;
  position: number;
  total: number;
}) {
  const sourceLabel = item.source.label ?? "See post";

  return (
    <aside className="flex min-h-0 flex-col justify-between gap-8 overflow-y-auto bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 text-foreground md:px-10 md:py-10">
      <div className="space-y-6">
        <p className="text-sm tabular-nums text-muted-foreground">
          {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <AvatarBadge
          avatarAlt={item.author.avatar?.alt ?? item.author.handle}
          avatarSrc={item.author.avatar?.src}
          username={item.author.handle}
          variant="secondary"
        />
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
    </aside>
  );
}
