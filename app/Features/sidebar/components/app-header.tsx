import { AppBreadcrumbs } from "@/app/Features/sidebar/components/app-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "motion/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";

export function AppHeader({ page }: { page: string }) {
  return (
    <motion.div className = "flex flex-col h-fit pt-8 py-4 items-start justify-start gap-12"> 

    <div className="flex max-w-xl flex-col gap-4 px-4 md:px-6">
      <h1 className="font-normal text-3xl">Curadoria humana e sem compromisso de bons designs  e ferramentas do Brasil (e do mundo)</h1>
    </div>
    <motion.div className="flex flex-row w-full items-center justify-between border-b border-border bg-background h-14 sticky top-0 z-20 px-4 md:px-6">
      
          <Tabs defaultValue="overview" variant="underline">
  <TabsList >
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
</Tabs>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </motion.div></motion.div>
  );
}
