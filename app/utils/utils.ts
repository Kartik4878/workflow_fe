import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name) return "?"

  // Split by spaces, dashes, underscores, or dots
  const parts = name.split(/[\s-_.]+/)

  if (parts.length === 1 && name.length > 0) {
    // If only one part, take first character
    return name.substring(0, 1).toUpperCase()
  } else if (parts.length > 1) {
    // Otherwise take first character of first two parts
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase()
  }
  return "?"
}

