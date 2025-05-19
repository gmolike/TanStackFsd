// src/shared/ui/form/hook.ts
import { useContext } from 'react';
import type { FieldValues } from 'react-hook-form';

// Import ShadCN's useFormField
import { useFormField as useShadcnFormField } from '~/shared/shadcn/form';

import type { FormContextValue } from './Context';
// Import our context
import { FormContext } from './Context';

/**
 * useFormContext - Access our custom form context
 * @throws Error if not used within a FormProvider
 */
const useFormContext = <TFormValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error(
      'useFormContext must be used within a FormProvider. ' +
        'Make sure your component is wrapped with <Form> or <FormProvider>.',
    );
  }

  return context as FormContextValue<TFormValues>;
};

/**
 * useForm - Get the form instance from our context
 * @throws Error if not used within a FormProvider
 */
const useForm = <TFormValues extends FieldValues = FieldValues>() => {
  const { form } = useFormContext<TFormValues>();
  return form;
};

/**
 * useFormField - Enhanced version that combines ShadCN's and our context
 * This gives access to both ShadCN's field state and our custom form context
 * @throws Error if not used within both FormProvider and FormField
 */
const useFormField = () => {
  // Get ShadCN's field context (provides name, error state, etc.)
  let fieldContext;
  try {
    fieldContext = useShadcnFormField();
  } catch (error) {
    console.error('Error in useShadcnFormField:', error);
    throw new Error(
      'useFormField must be used within a FormField. ' +
        'Make sure your component is wrapped with <FormField>.',
    );
  }

  // Get our custom form context (provides form instance, formId, etc.)
  const customContext = useFormContext();

  return {
    ...fieldContext,
    form: customContext.form,
    formId: customContext.formId,
    isSubmitting: customContext.form.formState.isSubmitting,
    isDirty: customContext.form.formState.isDirty,
    isValid: customContext.form.formState.isValid,
  };
};

/**
 * useFormId - Get the current form ID
 * @throws Error if not used within a FormProvider
 */
const useFormId = () => {
  const { formId } = useFormContext();
  return formId;
};

/**
 * useFormState - Get form state with convenient boolean flags
 * @throws Error if not used within a FormProvider
 */
const useFormState = () => {
  const form = useForm();
  const { formState } = form;

  return {
    ...formState,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isLoading: formState.isLoading,
    hasErrors: !formState.isValid && formState.isSubmitted,
    canSubmit: formState.isValid && !formState.isSubmitting,
    canReset: formState.isDirty && !formState.isSubmitting,
  };
};

/**
 * useFieldState - Get state for a specific field
 * @param name - Field name to get state for
 * @throws Error if not used within a FormProvider
 */
const useFieldState = (name: string) => {
  const form = useForm();
  return form.getFieldState(name, form.formState);
};

/**
 * useFieldError - Get error for a specific field
 * @param name - Field name to get error for
 * @returns Field error message or undefined
 */
const useFieldError = (name: string) => {
  const form = useForm();
  return form.formState.errors[name]?.message as string | undefined;
};

/**
 * useFieldValue - Get value for a specific field with type safety
 * @param name - Field name to get value for
 * @returns Current field value
 */
const useFieldValue = <T = any>(name: string): T => {
  const form = useForm();
  return form.watch(name) as T;
};

// Export all hooks
export {
  useFieldError,
  useFieldState,
  useFieldValue,
  useForm,
  useFormContext,
  useFormField,
  useFormId,
  useFormState,
};
