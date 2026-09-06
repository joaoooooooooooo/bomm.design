import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const user = {
  avatar: "https://github.com/shabanhr.png",
  email: "shaban@efferd.com",
  name: "Shaban Haider",
} as const;

export function NavUser() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-2 py-1.5">
        <Avatar className="size-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
