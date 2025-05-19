import type { FieldValues } from 'react-hook-form';

import { useForm } from '../../form';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  disabled,
  side = 'right',
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  // Explizit den generischen Typen durchreichen
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
