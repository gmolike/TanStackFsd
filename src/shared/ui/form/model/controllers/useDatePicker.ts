import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';
import { format, isValid, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { useForm } from '../hooks';
import type { BaseFieldProps } from '../types/fieldTypes';

type Props<TFieldValues extends FieldValues = FieldValues> = Pick<
  BaseFieldProps<TFieldValues>,
  'name' | 'disabled' | 'required'
> & {
  dateFormat?: string;
  min?: Date;
  max?: Date;
  locale?: Locale;
};

type Result<TFieldValues extends FieldValues = FieldValues> = {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isDisabled: boolean;
  formattedValue: string;
  formatDate: (date: Date | string | null) => string;
  isDateDisabled: (date: Date) => boolean;
};

export const useDatePicker = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  dateFormat = 'dd.MM.yyyy',
  min,
  max,
  locale = de,
}: Props<TFieldValues>): Result<TFieldValues> => {
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
