import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';

import type { ZodType } from 'zod';

/**
 * Props für den Form-Controller
 * @template TFormValues - Der Typ der Formularwerte
 * @param schema - Zod-Schema für Formularvalidierung
 * @param onSubmit - Submit-Handler für Formulardaten
 * @param onError - Error-Handler für Validierungsfehler
 * @param mode - Validierungsmodus von React Hook Form
 * @param defaultValues - Standardwerte für Formularfelder
 * @param externalForm - Externe React Hook Form Instanz
 * @param disabled - Ob das gesamte Formular deaktiviert ist
 */
export type ControllerProps<TFormValues extends FieldValues = FieldValues> = {
  schema?: ZodType<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (errors: any) => void;
  mode?: UseFormProps<TFormValues>['mode'];
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  externalForm?: UseFormReturn<TFormValues>;
  disabled?: boolean;
};

/**
 * Rückgabewert des Form-Controllers
 * @template TFormValues - Der Typ der Formularwerte
 * @param form - React Hook Form Instanz
 * @param handleSubmit - Submit-Handler Funktion
 * @param isSubmitting - Ob das Formular gerade übermittelt wird
 * @param isDirty - Ob das Formular geändert wurde
 * @param isValid - Ob das Formular valide ist
 * @param hasErrors - Ob das Formular Fehler hat
 * @param submitCount - Anzahl der Submit-Versuche
 * @param isFormDisabled - Ob das Formular deaktiviert ist
 */
export type ControllerResult<TFormValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  hasErrors: boolean;
  submitCount: number;
  isFormDisabled: boolean;
};

/**
 * Props für die Form-Komponente
 * @template TFormValues - Der Typ der Formularwerte
 * @param children - Form-Inhalt (kann Funktion mit Form-Instanz sein)
 * @param formId - Eindeutige ID für das Formular
 * @param header - Header-Element für das Formular
 * @param footer - Footer-Element für das Formular
 */
export type Props<TFormValues extends FieldValues = FieldValues> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> &
  ControllerProps<TFormValues> & {
    children: ReactNode | ((form: UseFormReturn<TFormValues>) => ReactNode);
    formId?: string;
    header?: ReactNode;
    footer?: ReactNode;
  };
