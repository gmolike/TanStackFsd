import { useCallback } from 'react';
import type { BaseSyntheticEvent } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm as useRHFForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

type Props<TFormValues extends FieldValues = FieldValues> = {
  schema?: ZodType<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  onError?: (errors: any) => void;
  mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
  defaultValues?: DefaultValues<TFormValues>;
  externalForm?: ReturnType<typeof useRHFForm<TFormValues>>;
  disabled?: boolean;
};

type Result<TFormValues extends FieldValues = FieldValues> = {
  form: ReturnType<typeof useRHFForm<TFormValues>>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  hasErrors: boolean;
  submitCount: number;
  isFormDisabled: boolean;
};

export const useForm = <TFormValues extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  mode = 'onSubmit',
  defaultValues,
  externalForm,
  disabled = false,
}: Props<TFormValues>): Result<TFormValues> => {
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
