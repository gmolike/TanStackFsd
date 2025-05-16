// src/shared/ui/form/hooks.ts
import { useContext } from 'react';
import type { FieldValues } from 'react-hook-form';

// Import ShadCN's useFormField
import { useFormField as useShadcnFormField } from '~/shared/shadcn/form';

import type { FormContextValue } from './Context';
// Import our context
import { FormContext } from './Context';

/**
 * useFormContext - Access our custom form context
 */
const useFormContext = <TFormValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  return context as FormContextValue<TFormValues>;
};

/**
 * useForm - Get the form instance from our context
 */
const useForm = <TFormValues extends FieldValues = FieldValues>() => {
  const { form } = useFormContext<TFormValues>();
  return form;
};

/**
 * useFormField - Enhanced version that combines ShadCN's and our context
 * This gives access to both ShadCN's field state and our custom form context
 */
const useFormField = () => {
  // Get ShadCN's field context (provides name, error state, etc.)
  const fieldContext = useShadcnFormField();

  // Get our custom form context (provides form instance, formId, etc.)
  const customContext = useFormContext();

  return {
    // ShadCN field properties
    ...fieldContext,
    // Our custom properties
    form: customContext.form,
    formId: customContext.formId,
    // Additional computed properties
    isSubmitting: customContext.form.formState.isSubmitting,
    isDirty: customContext.form.formState.isDirty,
    isValid: customContext.form.formState.isValid,
  };
};

/**
 * useFormId - Get the current form ID
 */
const useFormId = () => {
  const { formId } = useFormContext();
  return formId;
};

/**
 * useFormState - Get form state with convenient boolean flags
 */
const useFormState = () => {
  const form = useForm();
  const { formState } = form;

  return {
    ...formState,
    // Convenience flags
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isLoading: formState.isLoading,
    hasErrors: !formState.isValid && formState.isSubmitted,
  };
};

/**
 * useFieldState - Get state for a specific field
 */
const useFieldState = (name: string) => {
  const form = useForm();
  return form.getFieldState(name, form.formState);
};

// Export all hooks
export { useFieldState, useForm, useFormContext, useFormField, useFormId, useFormState };
