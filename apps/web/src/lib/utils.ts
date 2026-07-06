import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Standard utility for merging Tailwind CSS classes safely.
 * Prevents class conflicts when overriding default component styles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
