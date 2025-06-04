// client/src/lib/utils.ts

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges Tailwind classes using tailwind-merge.
 * @param inputs - Class strings or conditionals.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
