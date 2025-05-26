import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Select controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the select is disabled
 * @param required - Whether the field is required
 * @param options - Array of options
 * @param emptyOption - Text for empty option
 *
 * @returns Controller result with processed state
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
