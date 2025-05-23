import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for TextArea controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the textarea is disabled
 * @param required - Whether the field is required
 * @param rows - Number of visible text rows
 *
 * @returns Controller result with disabled state and ARIA props
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  required,
  rows = 3,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting, errors } = useFormState({ control });
  const fieldError = errors[name];

  const isDisabled = disabled || isSubmitting;

  const ariaProps = {
    'aria-invalid': !!fieldError,
    'aria-required': !!required,
    'aria-disabled': isDisabled,
  };

  return {
    isDisabled,
    rows,
    ariaProps,
  };
};
