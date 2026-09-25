"use client";

import { TabItem } from "@/components/ui/tab-items";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import type {
  ShellNavGroup,
} from "@/features/navigation/sections";

export function NavGroup({ items, label, mobile = false }: ShellNavGroup & { mobile?: boolean }) {
  const routeItemId = usePathname().split("/")[1];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeItemId, setActiveItemId] = useOptimistic(routeItemId);

  return (
    <nav aria-label={label} data-navigation-pending={isPending} className={mobile ? "flex flex-wrap items-center gap-x-3 gap-y-4 px-4 py-3" : "space-y-1 px-2 py-1"}>
      {items.map((item) => (
        <TabItem
          key={item.title}
          iconName={item.iconName}
          iconVariant={item.iconVariant}
          label={item.title}
          render={<Link href={item.href} onNavigate={(event) => {
            event.preventDefault();
            startTransition(() => {
              setActiveItemId(item.id);
              router.push(item.href);
            });
          }} />}
          aria-current={item.id === activeItemId ? "page" : undefined}
          variant={item.id === activeItemId ? "active" : "inactive"}
          size="default"
          className={mobile ? "relative w-fit before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2" : "w-full"}
          data-sidebar={mobile ? undefined : "menu-button"}
        />
      ))}
    </nav>
  );
}
