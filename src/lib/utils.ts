import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null) {
  const names = name?.split(" ") ?? [""]

  if (names.length > 0) {
    let initials = (names[0] ?? "").substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += (names[names.length - 1] ?? "").substring(0, 1).toUpperCase()
    }

    return initials
  } else {
    return ""
  }
}
