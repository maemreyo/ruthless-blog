import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date based on locale
export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  
  if (locale === 'vi') {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate reading time
export function getReadingTime(content: string, locale: string = 'en'): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  if (locale === 'vi') {
    return `${minutes} phút đọc`;
  }
  
  return `${minutes} min read`;
}
