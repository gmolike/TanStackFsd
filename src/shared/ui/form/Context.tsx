import React, { createContext, useContext } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormContextValue | null>(null);

/**
 * Wrapper-Komponente die einen Context für ein Form-Feld bereitstellt.
 *
 * @param children - React-Komponenten die Zugriff auf den Field-Context benötigen
 * @param name - Eindeutiger Feldname für React Hook Form
 */
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  name,
}: {
  children: React.ReactNode;
  name: TName;
}) => (
  <FormFieldContext.Provider value={{ name } as FormContextValue}>
    {children}
  </FormFieldContext.Provider>
);

/**
 * Hook zum Zugriff auf Field-spezifische Form-Informationen innerhalb eines FormField-Kontexts.
 *
 * @returns Objekt mit Field-Name, IDs und Validierungsstatus
 * @throws Error wenn außerhalb eines FormField-Kontexts verwendet
 */
export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { name } = fieldContext;
  const { control, getFieldState, formState } = itemContext;
  const fieldState = getFieldState(name, formState);

  return {
    name,
    formItemId: `${name}-form-item`,
    formDescriptionId: `${name}-form-item-description`,
    formMessageId: `${name}-form-item-message`,
    ...fieldState,
  };
};
