"use client";
import { Button } from "@/components/ui/button";
export default function GalleryError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="space-y-4 p-4 md:p-6">
      <p>We couldn&apos;t load this gallery.</p>
      <Button onClick={reset} variant="outline">Try again</Button>
    </div>
  );
}
