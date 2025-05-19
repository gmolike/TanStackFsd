import type { FieldValues } from 'react-hook-form';

import { useForm } from '../../form';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  required,
  rows = 3,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  const fieldState = form.getFieldState(name, formState);
  const { error } = fieldState;

  const ariaProps = {
    'aria-invalid': !!error,
    'aria-required': !!required,
    'aria-disabled': isDisabled,
  };

  return {
    form,
    isDisabled,
    rows,
    ariaProps,
  };
};
