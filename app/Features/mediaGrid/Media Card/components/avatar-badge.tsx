import type React from "react";
import avatarReference from "./assets/avatar-reference.jpeg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarBadgeVariant = "default" | "secondary";

export interface AvatarBadgeProps extends React.ComponentProps<"div"> {
  avatarAlt?: string;
  avatarSrc?: string;
  username?: string;
  variant?: AvatarBadgeVariant;
}

/** Identifies the media author in image-overlay and expanded-card contexts. */
export function AvatarBadge({
  avatarAlt = "Jonny Thelouc",
  avatarSrc = avatarReference.src,
  className,
  username = "@jonny_thelouc",
  variant = "default",
  ...props
}: AvatarBadgeProps): React.ReactElement {
  const isSecondary = variant === "secondary";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full",
        isSecondary
          ? "gap-3 border border-border bg-background p-0.5"
          : "gap-2 bg-black/25 p-1",
        className,
      )}
      data-slot="avatar-badge"
      {...props}
    >
      <Avatar className={cn(isSecondary ? "size-8" : "size-6")}>
        <AvatarImage alt={avatarAlt} src={avatarSrc} />
        <AvatarFallback>{avatarAlt.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {isSecondary ? (
        <span className="flex gap-1.5 pr-4 text-base leading-6">
          <span className="text-muted-foreground">by</span>
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
