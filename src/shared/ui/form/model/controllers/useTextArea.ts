import type { FieldValues } from 'react-hook-form';

import { useForm } from '../hooks';
import type { BaseFieldProps } from '../types/fieldTypes';

type Props<TFieldValues extends FieldValues = FieldValues> = Pick<
  BaseFieldProps<TFieldValues>,
  'name' | 'disabled' | 'required'
> & {
  rows?: number;
};

type Result<TFieldValues extends FieldValues = FieldValues> = {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isDisabled: boolean;
  rows: number;
  ariaProps: {
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-disabled'?: boolean;
  };
};

export const useTextArea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  required,
  rows = 3,
}: Props<TFieldValues>): Result<TFieldValues> => {
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
