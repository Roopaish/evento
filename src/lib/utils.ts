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

export function formatPrice(price: number): string {
  const priceStr = price.toString()

  const parts = priceStr.split(".")
  const integerPart = parts[0]!
  const decimalPart = parts[1] ?? ""

  let formattedInteger = ""
  let counter = 0
  for (let i = integerPart.length - 1; i >= 0; i--) {
    formattedInteger = integerPart[i] + formattedInteger
    counter++
    if (counter === 3 && i !== 0) {
      formattedInteger = "," + formattedInteger
      counter = 0
    }
  }

  let formattedPrice = formattedInteger
  if (decimalPart) {
    formattedPrice += "." + decimalPart
  }

  return "NPR " + formattedPrice
}
