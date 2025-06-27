import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { useRouter } from '@tanstack/react-router';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for simplified Footer controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param onReset - Reset handler called after form reset
 * @param onCancel - Reset handler called after form cancel
 *
 * @returns Controller result with form state and reset handler
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  form: providedForm,
  onReset,
  onCancel,
}: ControllerProps<TFieldValues>): ControllerResult => {
  // Always call useFormContext to comply with hooks rules
  const contextForm = useFormContext<TFieldValues>();
  const router = useRouter();
  const form = providedForm ?? contextForm;

  const { formState } = form;
  const { isSubmitting, isDirty, isValid } = formState;

  const handleCancel = () => {
    if (!onCancel) {
      router.history.back();
    } else onCancel();
  };

  const handleReset = () => {
    form.reset();
    onReset?.();
  };

  return {
    formState: { isSubmitting, isDirty, isValid },
    handleReset,
    handleCancel,
  };
};
