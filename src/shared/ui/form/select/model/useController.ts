import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Select controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.disabled - Whether the select is disabled
 * @param props.required - Whether the field is required
 * @param props.options - Array of options
 * @param props.emptyOption - Text for empty option
 *
 * @returns Controller result with processed state and helper functions
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  options,
  emptyOption,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const fieldValue = useWatch({ control, name });
  const [open, setOpen] = useState(false);

  const isDisabled = disabled || isSubmitting;
  const normalizedValue = fieldValue ?? '';

  useEffect(() => {
    setOpen(false);
  }, [normalizedValue]);

  return {
    isDisabled,
    hasEmptyOption: !!emptyOption,
    selectOptions: options,
    emptyOptionText: emptyOption || '',
    normalizedValue,
    open,
    setOpen,
  };
};
