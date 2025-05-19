import type { FieldValues } from 'react-hook-form';

import { useForm } from '../hooks';
import type { BaseFieldProps } from '../types/fieldTypes';

type Props<TFieldValues extends FieldValues = FieldValues> = Pick<
  BaseFieldProps<TFieldValues>,
  'name' | 'disabled' | 'required'
> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};

type Result<TFieldValues extends FieldValues = FieldValues> = {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isDisabled: boolean;
  groupClasses: string;
};

export const useCheckbox = <TFieldValues extends FieldValues = FieldValues>({
  disabled,
  side = 'right',
}: Props<TFieldValues>): Result<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  // Determine layout classes based on side
  const groupClasses =
    side === 'top'
      ? 'flex flex-col-reverse gap-2'
      : side === 'left'
        ? 'flex flex-row-reverse justify-end gap-2'
        : side === 'bottom'
          ? 'flex flex-col gap-2'
          : 'flex items-center space-x-2'; // default (right)

  return {
    form,
    isDisabled,
    groupClasses,
  };
};
