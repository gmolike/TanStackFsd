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
export const useFormContext = <TFormValues extends FieldValues = FieldValues>() => {
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
 */
export const useForm = <TFormValues extends FieldValues = FieldValues>() => {
  const { form } = useFormContext<TFormValues>();
  return form;
};

/**
 * useFormField - Enhanced version that combines ShadCN's and our context
 */
export const useFormField = () => {
  // Get ShadCN's field context
  let fieldContext;
  try {
    fieldContext = useShadcnFormField();
  } catch (error) {
    console.error(error);
    throw new Error(
      'useFormField must be used within a FormField. ' +
        'Make sure your component is wrapped with <FormField>.',
    );
  }

  // Get our custom form context
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
 */
export const useFormId = () => {
  const { formId } = useFormContext();
  return formId;
};

/**
 * useFormState - Get form state with convenient boolean flags
 */
export const useFormState = () => {
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
 */
export const useFieldState = (name: string) => {
  const form = useForm();
  return form.getFieldState(name, form.formState);
};
