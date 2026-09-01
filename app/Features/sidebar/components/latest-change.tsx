"use client";

import { Button } from "@/components/ui/button";

export function LatestChange() {
  return (
    <section className="border-t border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:hidden">
      <p className="text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Changelog
      </p>
      <h3 className="mt-2 text-sm font-medium text-foreground">Product update</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Performance boosts and UI polish across the workspace shell.
      </p>
      <Button
        className="mt-3 h-auto px-0 text-xs"
        render={<a href="#/changelog" />}
        variant="link"
      >
        Learn more
      </Button>
    </section>
  );
}
