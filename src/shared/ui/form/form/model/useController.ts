import { useCallback } from 'react';
import type { BaseSyntheticEvent } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useForm as useRHFForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFormValues extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  mode = 'onSubmit',
  defaultValues,
  externalForm,
  disabled = false,
}: ControllerProps<TFormValues>): ControllerResult<TFormValues> => {
  const internalForm = useRHFForm<TFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode,
    defaultValues,
  });

  const form = externalForm || internalForm;
  const { formState } = form;

  const handleSubmit = useCallback(
    (e?: BaseSyntheticEvent) => form.handleSubmit(onSubmit, onError)(e),
    [form, onSubmit, onError],
  );

  return {
    form,
    handleSubmit,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    isValid: formState.isValid,
    hasErrors: !formState.isValid && formState.isSubmitted,
    submitCount: formState.submitCount,
    isFormDisabled: disabled || formState.isSubmitting,
  };
};
