"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const STORAGE_KEY = "braza-theme";

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
  useEffect(() => {
    const nextTheme = getPreferredTheme();
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <Button
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      size="sm"
      variant="outline"
    >
      Toggle theme
    </Button>
  );
}
