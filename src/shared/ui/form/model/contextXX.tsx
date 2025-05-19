import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider as RHFFormProvider } from 'react-hook-form';

// Form Context Type
export interface FormContextValue<TFormValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFormValues>;
  formId: string;
}

// Create context with proper typing
// eslint-disable-next-line react-refresh/only-export-components
export const FormContext = createContext<FormContextValue<any> | null>(null);

// Provider Props
export interface FormProviderProps<TFormValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFormValues>;
  formId?: string;
  children: ReactNode;
}

/**
 * FormProvider - Provides both our custom context and React Hook Form context
 */
export const FormProvider = <TFormValues extends FieldValues = FieldValues>({
  form,
  formId = 'form',
  children,
}: FormProviderProps<TFormValues>) => (
  <FormContext.Provider value={{ form, formId } as FormContextValue<TFormValues>}>
    <RHFFormProvider {...form}>{children}</RHFFormProvider>
  </FormContext.Provider>
);
