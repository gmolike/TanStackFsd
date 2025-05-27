import { useCallback, useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

import { format, isValid, parse, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for DatePicker controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.disabled - Whether the date picker is disabled
 * @param props.required - Whether the field is required
 * @param props.dateFormat - Date format string
 * @param props.min - Minimum allowed date
 * @param props.max - Maximum allowed date
 * @param props.locale - Locale for date formatting
 *
 * @returns Controller result with formatted value, helper functions, and event handlers
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  dateFormat = 'dd.MM.yyyy',
  min,
  max,
  locale = de,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const value = useWatch({ control, name });
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const isDisabled = disabled || isSubmitting;

  useEffect(() => {
    if (!value) {
      setInputValue('');
    }
  }, [value]);

  const formatDate = useCallback(
    (date: Date | string | null | undefined): string => {
      if (!date) return '';

      try {
        let dateObj: Date;

        if (typeof date === 'string') {
          dateObj = parseISO(date);
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          return '';
        }

        if (!isValid(dateObj)) return '';

        return format(dateObj, dateFormat, { locale });
      } catch {
        return '';
      }
    },
    [dateFormat, locale],
  );

  const formattedValue = formatDate(value);

  const isDateDisabled = useCallback(
    (date: Date) => (!!min && date < min) || (!!max && date > max) || !!disabled,
    [min, max, disabled],
  );

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setInputValue('');
    }
  }, []);

  /**
   * Handle manual date input
   * Parses the input value and updates the form field if valid
   */
  const handleInputChange = useCallback(
    (value: string, onChange: (date: Date | null) => void) => {
      setInputValue(value);

      if (value === '') {
        onChange(null);
        return;
      }

      const parsedDate = parse(value, dateFormat, new Date(), { locale });
      if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
        onChange(parsedDate);
      }
    },
    [dateFormat, locale, isDateDisabled],
  );

  /**
   * Handle calendar date selection
   * Updates the form field and closes the popover
   */
  const handleCalendarSelect = useCallback(
    (date: Date | undefined, onChange: (date: Date | null) => void) => {
      onChange(date || null);
      setOpen(false);
      setInputValue('');
    },
    [],
  );

  /**
   * Handle clear button click
   * Clears the form field and input value
   */
  const handleClear = useCallback((onChange: (date: Date | null) => void) => {
    onChange(null);
    setInputValue('');
  }, []);

  return {
    isDisabled,
    formattedValue,
    formatDate,
    isDateDisabled,
    inputValue,
    setInputValue,
    open,
    setOpen: handleOpenChange,
    handleInputChange,
    handleCalendarSelect,
    handleClear,
  };
};
