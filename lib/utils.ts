import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds: number): string {
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MINUTE = 60;

  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const remainingAfterHours = seconds - (hours * SECONDS_PER_HOUR);
  const minutes = Math.floor(remainingAfterHours / SECONDS_PER_MINUTE);
  const secs = Math.floor(remainingAfterHours - (minutes * SECONDS_PER_MINUTE));

  const parts: string[] = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`); 
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(" ");
}