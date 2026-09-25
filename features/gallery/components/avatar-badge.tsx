import type React from "react";
import { GlobeIcon } from "@phosphor-icons/react/ssr";
import avatarReference from "./assets/avatar-reference.jpeg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarBadgeVariant = "default" | "secondary";

export interface AvatarBadgeProps extends React.ComponentProps<"div"> {
  avatarAlt?: string;
  avatarSrc?: string;
  username?: string;
  variant?: AvatarBadgeVariant;
  website?: boolean;
}

/** Identifies the author or website in image-overlay and expanded-card contexts. */
export function AvatarBadge({
  avatarAlt = "Jonny Thelouc",
  avatarSrc = avatarReference.src,
  className,
  username = "@jonny_thelouc",
  variant = "default",
  website = false,
  ...props
}: AvatarBadgeProps): React.ReactElement {
  const isSecondary = variant === "secondary";

  return (
    <div
      className={cn(
        "inline-flex items-center",
        website ? "rounded-lg" : "rounded-full",
        isSecondary
          ? "gap-3 border border-border bg-background p-0.5"
          : "gap-2 bg-black/25 p-1 backdrop-blur-sm",
        className,
      )}
      data-slot="avatar-badge"
      {...props}
    >
      <Avatar className={cn(website ? "size-5 rounded-sm" : isSecondary ? "size-8" : "size-6")}>
        <AvatarImage alt={website ? "" : avatarAlt} src={avatarSrc} referrerPolicy="no-referrer" className={website ? "object-contain" : undefined} />
        <AvatarFallback className={website ? "rounded-sm" : undefined}>{website ? <GlobeIcon aria-hidden="true" className="size-4" /> : avatarAlt.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {isSecondary ? (
        <span className="flex gap-1.5 pr-4 text-base leading-6">
          {!website && <span className="text-muted-foreground">by</span>}
          <span className="text-foreground">{username}</span>
        </span>
      ) : (
        <span className="pr-2.5 text-xs leading-4 tracking-[0.12px] text-white">
          {username}
        </span>
      )}
    </div>
  );
}
