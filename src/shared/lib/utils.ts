import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ================= TYPES =================

export type Primitive = string | number | boolean | null | undefined;
export type DeepPartial<T> = T extends Primitive ? T : { [K in keyof T]?: DeepPartial<T[K]> };
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ArrayElement<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer E> ? E : never;
export type NonEmptyArray<T> = readonly [T, ...Array<T>];

// ================= CSS UTILITIES =================

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class values to combine
 * @returns Combined class string with Tailwind conflicts resolved
 */
export const cn = (...inputs: Array<ClassValue>): string => twMerge(clsx(inputs));

/**
 * Creates a conditional class name
 * @param condition - Boolean condition
 * @param truthyClass - Class to apply when condition is true
 * @param falsyClass - Class to apply when condition is false
 * @returns Conditional class string
 */
export const conditionalClass = (
  condition: boolean,
  truthyClass: string,
  falsyClass: string = '',
): string => (condition ? truthyClass : falsyClass);

/**
 * Creates variant-based class names
 * @param variants - Object mapping variant names to class names
 * @param activeVariant - Currently active variant
 * @param baseClass - Base class to always include
 * @returns Combined class string
 */
export const variantClass = <T extends string>(
  variants: Record<T, string>,
  activeVariant: T,
  baseClass: string = '',
): string => cn(baseClass, variants[activeVariant]);

// ================= STRING UTILITIES =================

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts string to title case
 * @param str - String to convert
 * @returns Title cased string
 */
export const titleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');

/**
 * Converts camelCase to kebab-case
 * @param str - CamelCase string
 * @returns kebab-case string
 */
export const camelToKebab = (str: string): string =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Converts kebab-case to camelCase
 * @param str - kebab-case string
 * @returns camelCase string
 */
export const kebabToCamel = (str: string): string =>
  str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Truncates string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Generates initials from a name
 * @param name - Full name string
 * @param maxInitials - Maximum number of initials
 * @returns Initials string
 */
export const getInitials = (name: string, maxInitials: number = 2): string =>
  name
    .split(' ')
    .slice(0, maxInitials)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

/**
 * Generates a slug from a string
 * @param str - String to slugify
 * @returns URL-safe slug
 */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ================= NUMBER UTILITIES =================

/**
 * Formats a number with thousand separators
 * @param num - Number to format
 * @param locale - Locale for formatting
 * @returns Formatted number string
 */
export const formatNumber = (num: number, locale: string = 'de-DE'): string =>
  new Intl.NumberFormat(locale).format(num);

/**
 * Formats a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE',
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);

/**
 * Formats a number as percentage
 * @param value - Value to format (0.1 = 10%)
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'de-DE',
): string =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/**
 * Clamps a number between min and max values
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Rounds a number to specified decimal places
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

// ================= ARRAY UTILITIES =================

/**
 * Removes duplicate values from array
 * @param array - Array to deduplicate
 * @param keyFn - Optional key function for complex objects
 * @returns Deduplicated array
 */
export const unique = <T>(array: Array<T>, keyFn?: (item: T) => unknown): Array<T> => {
  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Groups array elements by a key
 * @param array - Array to group
 * @param keyFn - Function to extract grouping key
 * @returns Grouped object
 */
export const groupBy = <T, K extends PropertyKey>(
  array: Array<T>,
  keyFn: (item: T) => K,
): Record<K, Array<T>> =>
  array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      (groups[key] ||= []).push(item);
      return groups;
    },
    {} as Record<K, Array<T>>,
  );

/**
 * Chunks array into smaller arrays
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export const chunk = <T>(array: Array<T>, size: number): Array<Array<T>> => {
  const chunks: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Moves array element from one index to another
 * @param array - Array to modify
 * @param fromIndex - Source index
 * @param toIndex - Destination index
 * @returns New array with moved element
 */
export const moveArrayElement = <T>(
  array: Array<T>,
  fromIndex: number,
  toIndex: number,
): Array<T> => {
  const newArray = [...array];
  const [movedElement] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedElement);
  return newArray;
};

// ================= OBJECT UTILITIES =================

/**
 * Deep clones an object
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(deepClone) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

/**
 * Picks specified keys from object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns Object with only picked keys
 */
export const pick = <T, K extends keyof T>(obj: T, keys: Array<K>): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omits specified keys from object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns Object without omitted keys
 */
export const omit = <T, K extends keyof T>(obj: T, keys: Array<K>): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

/**
 * Checks if object is empty
 * @param obj - Object to check
 * @returns True if object is empty
 */
export const isEmpty = (obj: object): boolean => Object.keys(obj).length === 0;

// ================= VALIDATION UTILITIES =================

/**
 * Checks if value is defined (not null or undefined)
 * @param value - Value to check
 * @returns True if value is defined
 */
export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/**
 * Checks if string is valid email
 * @param email - Email string to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if string is valid URL
 * @param url - URL string to validate
 * @returns True if valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if value is numeric
 * @param value - Value to check
 * @returns True if numeric
 */
export const isNumeric = (value: unknown): value is number =>
  !isNaN(Number(value)) && isFinite(Number(value));

// ================= ASYNC UTILITIES =================

/**
 * Creates a delay promise
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Debounces a function
 * @param fn - Function to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: Array<any>) => any>(
  fn: T,
  ms: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

/**
 * Throttles a function
 * @param fn - Function to throttle
 * @param ms - Throttle delay in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: Array<any>) => any>(
  fn: T,
  ms: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
};

// ================= RANDOM UTILITIES =================

/**
 * Generates a random ID
 * @param length - Length of the ID
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a UUID v4
 * @returns UUID v4 string
 */
export const generateUUID = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/**
 * Gets random element from array
 * @param array - Array to pick from
 * @returns Random element
 */
export const randomElement = <T>(array: Array<T>): T =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Shuffles array
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export const shuffle = <T>(array: Array<T>): Array<T> => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
