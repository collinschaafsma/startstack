import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge class names with clsx and tailwind-merge
 * @param inputs - Class values to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an amount in cents to a formatted dollar string based on the currency code.
 * @param {number} cents - The amount in cents.
 * @param {string} currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR').
 * @returns {string} - The formatted dollar string.
 */
export function centsToCurrency(
  cents: number = 0,
  currencyCode: string = "USD"
): string {
  const dollars = cents / 100
  let formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(dollars)

  // Manually remove the .00 if present
  if (formattedAmount.includes(".00")) {
    formattedAmount = formattedAmount.replace(".00", "")
  }

  return formattedAmount
}
