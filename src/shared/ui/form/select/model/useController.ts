import type { FieldValues } from 'react-hook-form';

import { useForm } from '../../form';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  disabled,
  options,
  emptyOption,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
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
