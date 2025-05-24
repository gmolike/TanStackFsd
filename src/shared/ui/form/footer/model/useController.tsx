// src/shared/ui/form/footer/model/useController.tsx
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for simplified Footer controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param onReset - Reset handler called after form reset
 *
 * @returns Controller result with form state and reset handler
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  form: providedForm,
  onReset,
}: ControllerProps<TFieldValues>): ControllerResult => {
  // Always call useFormContext to comply with hooks rules
  const contextForm = useFormContext<TFieldValues>();
  const form = providedForm ?? contextForm;

  const { formState } = form;
  const { isSubmitting, isDirty, isValid } = formState;

  const handleReset = () => {
    // Reset to default values (not clear the form)
    form.reset();
    onReset?.();
  };

  return {
    formState: { isSubmitting, isDirty, isValid },
    handleReset,
  };
};
