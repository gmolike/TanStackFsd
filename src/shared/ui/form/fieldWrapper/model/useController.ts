import { useEffect, useRef } from 'react';
import type { FieldValues, PathValue } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Extract default value from nested path
 *
 * @param defaultValues - Default values object
 * @param path - Dot-separated path (e.g., "address.street")
 * @returns The value at the given path or undefined
 */
const getNestedDefaultValue = <T extends FieldValues>(defaultValues: T, path: string): unknown => {
  const pathParts = path.split('.');
  let value: unknown = defaultValues;

  for (const part of pathParts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
};

/**
 * Compare two values for equality, with special handling for dates
 *
 * @param current - Current value
 * @param defaultVal - Default value
 * @returns Whether the values are different
 */
const isValueDifferent = (current: unknown, defaultVal: unknown): boolean => {
  // Both null/undefined - they're equal
  if (current == null && defaultVal == null) return false;

  // One is null/undefined - they're different
  if (current == null || defaultVal == null) return true;

  // Date comparison
  if (current instanceof Date && defaultVal instanceof Date) {
    return current.getTime() !== defaultVal.getTime();
  }

  // String date comparison
  if (typeof current === 'string' && typeof defaultVal === 'string') {
    try {
      const currentDate = new Date(current);
      const defaultDate = new Date(defaultVal);
      if (!isNaN(currentDate.getTime()) && !isNaN(defaultDate.getTime())) {
        return currentDate.getTime() !== defaultDate.getTime();
      }
    } catch (error) {
      console.warn('Failed to parse date strings for comparison:', error);
    }
  }

  // Default comparison
  return current !== defaultVal;
};

/**
 * Hook for FieldWrapper controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.showReset - Whether to show reset button
 *
 * @returns Controller result with reset functionality
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  showReset = true,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useFormContext<TFieldValues>();
  const currentValue = useWatch({ control, name });

  const defaultValueRef = useRef<PathValue<TFieldValues, typeof name> | undefined>(undefined);

  // Extract and store default value
  useEffect(() => {
    const defaultValues = form.formState.defaultValues;
    if (defaultValues && defaultValueRef.current === undefined) {
      const value = getNestedDefaultValue(defaultValues, name as string);
      defaultValueRef.current = value as PathValue<TFieldValues, typeof name>;
    }
  }, [form.formState.defaultValues, name]);

  /**
   * Reset field to its default value
   */
  const handleReset = () => {
    form.setValue(name, defaultValueRef.current as PathValue<TFieldValues, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isDifferentFromDefault = showReset
    ? isValueDifferent(currentValue, defaultValueRef.current)
    : false;

  return {
    isDifferentFromDefault,
    handleReset,
    currentValue,
  };
};
