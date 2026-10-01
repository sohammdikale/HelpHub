import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts integer paise to formatted Indian Rupees string.
 * Example: 50000 paise -> "₹500", 15050 paise -> "₹150.50"
 */
export function formatPaiseToRupees(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Converts standard Rupees input to integer paise.
 * Example: 500 -> 50000
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Formats distance in kilometers.
 * Example: 0.85 -> "850 m", 3.42 -> "3.4 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Masks Indian Aadhaar number preserving only the last 4 digits.
 * Example: "123456789012" -> "•••• •••• 9012"
 */
export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\D/g, "");
  if (cleaned.length < 4) return "••••";
  const last4 = cleaned.slice(-4);
  return `•••• •••• ${last4}`;
}

/**
 * Masks PAN card preserving only the first 2 and last 2 characters.
 * Example: "ABCDE1234F" -> "AB••••••4F"
 */
export function maskPan(pan: string): string {
  const clean = pan.toUpperCase().trim();
  if (clean.length !== 10) return "••••••••••";
  return `${clean.slice(0, 2)}••••••${clean.slice(8)}`;
}

/**
 * Truncate long text with ellipsis.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
