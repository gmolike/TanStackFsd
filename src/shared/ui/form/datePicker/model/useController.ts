import { useCallback, useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

import { format, isValid, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for DatePicker controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the date picker is disabled
 * @param required - Whether the field is required
 * @param dateFormat - Date format string
 * @param min - Minimum allowed date
 * @param max - Maximum allowed date
 * @param locale - Locale for date formatting
 *
 * @returns Controller result with formatted value and helper functions
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

  return {
    isDisabled,
    formattedValue,
    formatDate,
    isDateDisabled,
    inputValue,
    setInputValue,
    open,
    setOpen: handleOpenChange,
  };
};
