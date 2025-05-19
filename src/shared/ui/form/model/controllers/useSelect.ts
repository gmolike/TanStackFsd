import type { FieldValues } from 'react-hook-form';

import { useForm } from '../hooks';
import type { BaseFieldProps, SelectOption } from '../types/fieldTypes';

type Props<TFieldValues extends FieldValues = FieldValues> = Pick<
  BaseFieldProps<TFieldValues>,
  'name' | 'disabled' | 'required'
> & {
  options: Array<SelectOption>;
  emptyOption?: string;
};

type Result<TFieldValues extends FieldValues = FieldValues> = {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isDisabled: boolean;
  hasEmptyOption: boolean;
  options: Array<SelectOption>;
  emptyOption?: string;
};

export const useSelect = <TFieldValues extends FieldValues = FieldValues>({
  disabled,
  options,
  emptyOption,
}: Props<TFieldValues>): Result<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  return {
    form,
    isDisabled,
    hasEmptyOption: !!emptyOption,
    options,
    emptyOption,
  };
};
