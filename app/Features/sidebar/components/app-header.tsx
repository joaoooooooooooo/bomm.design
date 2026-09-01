import { AppBreadcrumbs } from "@/app/Features/sidebar/components/app-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader({
  page,
}: {
  page: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
      <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3">
        <SidebarTrigger />
        <Separator className="h-4" orientation="vertical" />
        <AppBreadcrumbs page={page} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
