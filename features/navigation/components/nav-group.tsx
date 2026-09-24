"use client";

import { TabItem } from "@/components/ui/tab-items";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import type {
  ShellNavGroup,
} from "@/features/navigation/sections";

export function NavGroup({ items, label, onNavigate, mobile = false }: ShellNavGroup & { onNavigate?: () => void; mobile?: boolean }) {
  const routeItemId = useSelectedLayoutSegment();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeItemId, setActiveItemId] = useOptimistic(routeItemId);

  return (
    <nav aria-label={label} data-navigation-pending={isPending} className="space-y-1 px-2 py-1">
      {items.map((item) => (
        <TabItem
          key={item.title}
          iconName={item.iconName}
          iconVariant={item.iconVariant}
          label={item.title}
          render={<Link href={item.href} onNavigate={(event) => {
            event.preventDefault();
            onNavigate?.();
            startTransition(() => {
              setActiveItemId(item.id);
              router.push(item.href);
            });
          }} />}
          aria-current={item.id === activeItemId ? "page" : undefined}
          variant={mobile
            ? item.id === activeItemId ? "mobile-active" : "mobile-inactive"
            : item.id === activeItemId ? "active" : "inactive"}
          className="w-full"
          data-sidebar="menu-button"
        />
      ))}
    </nav>
  );
}
