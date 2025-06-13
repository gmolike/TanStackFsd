// src/shared/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with tailwind-merge
 * Combines clsx for conditional classes with tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object to a localized string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale = 'de-DE',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a number to a localized currency string
 */
export function formatCurrency(amount: number, currency = 'EUR', locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit the number of times a function can be called
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) {
    const clonedArr: any[] = [];
    obj.forEach((element, index) => {
      clonedArr[index] = deepClone(element);
    });
    return clonedArr as any;
  }
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Convert object to query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((value: any) => params.append(key, String(value)));
      } else {
        params.append(key, String(obj[key]));
      }
    }
  }

  return params.toString();
}

/**
 * Parse query string to object
 */
export function queryStringToObject(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
