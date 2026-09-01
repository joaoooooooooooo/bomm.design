import { AppShell } from "@/app/Features/sidebar/components/app-shell";
import { InfiniteMasonryPreview } from "@/app/MediaGrid";
import { Agentation } from "agentation";

export default function Home() {
  return (
    <AppShell>
      <InfiniteMasonryPreview />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </AppShell>
  );
}
