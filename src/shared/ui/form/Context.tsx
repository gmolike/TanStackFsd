import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

// Types
type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  children: ReactNode;
  name: TName;
};

// Context
const FormFieldContext = createContext<FormContextValue | null>(null);

/**
 * FormField - Context provider for form field components
 *
 * @param props.children - React components that need access to field context
 * @param props.name - Unique field name for React Hook Form
 */
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  name,
}: FormFieldProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name } as FormContextValue}>
    {children}
  </FormFieldContext.Provider>
);

/**
 * useFormField - Access field-specific form information within FormField context
 *
 * @returns Object with field name, IDs and validation status
 * @throws Error when used outside FormField context
 */
export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>');
  }

  const { name } = fieldContext;
  const { getFieldState, formState } = itemContext;
  const fieldState = getFieldState(name, formState);

  return {
    name,
    formItemId: `${name}-form-item`,
    formDescriptionId: `${name}-form-item-description`,
    formMessageId: `${name}-form-item-message`,
    ...fieldState,
  };
};
