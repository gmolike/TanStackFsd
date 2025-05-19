import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

import { format, isValid, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { useForm } from '../../form';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  dateFormat = 'dd.MM.yyyy',
  min,
  max,
  locale = de,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  const formatDate = useCallback(
    (date: Date | string | null): string => {
      if (!date) return '';

      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return '';
        return format(dateObj, dateFormat, { locale });
      } catch {
        return '';
      }
    },
    [dateFormat, locale],
  );

  const value = form.watch(name);
  const formattedValue = formatDate(value);

  const isDateDisabled = useCallback(
    (date: Date) => (!!min && date < min) || (!!max && date > max) || !!disabled,
    [min, max, disabled],
  );

  return {
    form,
    isDisabled,
    formattedValue,
    formatDate,
    isDateDisabled,
  };
};
