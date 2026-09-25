import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const buttonPressAnimation = {
  whileTap: { scale: 0.95 },
  transition: { type: "spring", duration: 0.5, bounce: 0 },
} as const

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
