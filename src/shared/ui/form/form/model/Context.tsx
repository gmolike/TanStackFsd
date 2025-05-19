import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider as RHFFormProvider } from 'react-hook-form';

// Form Context Type mit explizitem generischem Parameter
export type ContextValue<TFormValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFormValues>;
  formId: string;
};

// Create context with proper typing
export const FormContext = createContext<ContextValue<any> | null>(null);

// Provider Props mit explizitem generischem Parameter
export type ProviderProps<TFormValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFormValues>;
  formId?: string;
  children: ReactNode;
};

/**
 * FormProvider - Provides both our custom context and React Hook Form context
 */
export const Provider = <TFormValues extends FieldValues = FieldValues>({
  form,
  formId = 'form',
  children,
}: ProviderProps<TFormValues>) => (
  <FormContext.Provider value={{ form, formId } as ContextValue<TFormValues>}>
    <RHFFormProvider {...form}>{children}</RHFFormProvider>
  </FormContext.Provider>
);
