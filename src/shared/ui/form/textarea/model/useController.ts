import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for TextArea controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.disabled - Whether the textarea is disabled
 * @param props.required - Whether the field is required
 * @param props.rows - Number of visible text rows
 *
 * @returns Controller result with disabled state, rows, and ARIA props
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
