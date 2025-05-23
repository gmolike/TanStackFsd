import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

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
  disabled,
  options,
  emptyOption,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const isDisabled = disabled || isSubmitting;

  return {
    isDisabled,
    hasEmptyOption: !!emptyOption,
    selectOptions: options,
    emptyOptionText: emptyOption || '',
  };
};
