import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merges class names and handles Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a beautiful format.
 * Example: 26 Mar 2026, 14:30
 */
export function formatDate(date: string | Date) {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

/**
 * Formats a number into a currency string.
 */
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
