import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Checkbox controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the checkbox is disabled
 * @param required - Whether the field is required
 * @param side - Label position relative to checkbox
 *
 * @returns Controller result with disabled state and layout classes
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  disabled,
  side = 'right',
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const isDisabled = disabled || isSubmitting;

  // Determine layout classes based on side
  const groupClasses = useMemo(() => {
    switch (side) {
      case 'top':
        return 'flex flex-col-reverse gap-2';
      case 'left':
        return 'flex flex-row-reverse justify-end gap-2';
      case 'bottom':
        return 'flex flex-col gap-2';

      default:
        return 'flex items-center space-x-2';
    }
  }, [side]);

  return {
    isDisabled,
    groupClasses,
  };
};
