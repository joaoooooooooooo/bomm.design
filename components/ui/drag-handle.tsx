import type React from "react";
import { cn } from "@/lib/utils";

export interface DragHandleProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

export function DragHandle({
  className,
  orientation = "horizontal",
  ...props
}: DragHandleProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0 rounded-full bg-sidebar-border",
        orientation === "horizontal" ? "h-1 w-12" : "h-12 w-1",
        className,
      )}
      data-orientation={orientation}
      data-slot="drag-handle"
      {...props}
    />
  );
}
