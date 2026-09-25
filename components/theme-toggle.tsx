"use client";

import { useEffect, useSyncExternalStore } from "react";
import { TabItem } from "@/components/ui/tab-items";

type Theme = "light" | "dark";

const STORAGE_KEY = "braza-theme";

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
  return () => observer.disconnect();
}

const currentTheme = (): Theme => document.documentElement.classList.contains("dark") ? "dark" : "light";
const serverTheme = (): Theme => "light";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, serverTheme);
  useEffect(() => {
    const nextTheme = getPreferredTheme();
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const selectTheme = (nextTheme: Theme) => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <TabItem
      label={theme === "dark" ? "Light mode" : "Dark mode"}
      iconName={theme === "dark" ? "sun" : "moon"}
      iconWeight="regular"
      variant="inactive"
      className="w-full"
      onClick={() => selectTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
