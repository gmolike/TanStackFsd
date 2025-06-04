// src/shared/lib/utils.ts
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ================= TYPES =================
// Keine spezifischen Typen benötigt

// ================= LOGIC =================
/**
 * Combines class names using clsx and tailwind-merge
 * @param {...ClassValue[]} inputs - Class values to combine
 * @returns {string} Combined class string
 */
export const cn = (...inputs: Array<ClassValue>) => twMerge(clsx(inputs));
