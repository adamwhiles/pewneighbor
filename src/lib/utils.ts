import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random 8-character join code (uppercase alphanumeric, no ambiguous chars)
 */
const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

export function generateJoinCode(): string {
  return nanoid();
}

/**
 * Format a relative timestamp for display
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Extract domain from email address
 */
export function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

/**
 * Check if an email uses a personal/free email domain
 */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "icloud.com", "aol.com", "protonmail.com", "mail.com",
]);

export function isFreeEmailDomain(email: string): boolean {
  return FREE_EMAIL_DOMAINS.has(getEmailDomain(email));
}
