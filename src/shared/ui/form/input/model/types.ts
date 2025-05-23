import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { z } from 'zod';

import type { InputShadcn } from '~/shared/shadcn/input';

/**
 * Unterstützte HTML Input-Typen
 */
export type InputHTMLType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week';

/**
 * Basis-Props für alle Formular-Felder
 * @template TFieldValues - Der Typ der Formularwerte
 * @param name - Feldname im Formular
 * @param label - Anzeigelabel für das Feld
 * @param description - Beschreibungstext unter dem Feld
 * @param required - Ob das Feld erforderlich ist
 * @param disabled - Ob das Feld deaktiviert ist
 * @param placeholder - Platzhaltertext
 * @param className - Zusätzliche CSS-Klassen
 */
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

/**
 * Zod-Schema-Typdefinitionen
 */
export type ZodSchemaOf<T> = z.ZodType<T, z.ZodTypeDef, T>;

export type InferFieldSchema<TFieldValues> =
  TFieldValues extends Record<string, unknown>
    ? { [K in keyof TFieldValues]: ZodSchemaOf<TFieldValues[K]> }
    : never;

export type FormSchema<TFieldValues extends FieldValues> = z.ZodObject<
  InferFieldSchema<TFieldValues>
>;

export type FieldSchema<TFieldValues extends FieldValues> = ZodSchemaOf<
  TFieldValues[keyof TFieldValues]
>;

/**
 * Props für die Input-Komponente
 * @template TFieldValues - Der Typ der Formularwerte
 * @param startIcon - Icon am Anfang des Inputs
 * @param endIcon - Icon am Ende des Inputs
 * @param type - HTML-Input-Typ
 * @param schema - Zod-Schema für Feldvalidierung
 * @param fullSchema - Vollständiges Formular-Schema
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  'required'
> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: InputHTMLType;
  schema?: FieldSchema<TFieldValues>;
  fullSchema?: FormSchema<TFieldValues>;
  required?: boolean;
} & Omit<React.ComponentPropsWithoutRef<typeof InputShadcn>, 'name' | 'type' | 'required'>;

/**
 * Props für den Input-Controller
 * @template TFieldValues - Der Typ der Formularwerte
 * @param name - Feldname im Formular
 * @param disabled - Ob das Feld deaktiviert ist
 * @param required - Ob das Feld erforderlich ist
 * @param startIcon - Icon am Anfang des Inputs
 * @param endIcon - Icon am Ende des Inputs
 * @param type - HTML-Input-Typ
 * @param schema - Zod-Schema für Feldvalidierung
 * @param fullSchema - Vollständiges Formular-Schema
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: InputHTMLType;
  schema?: FieldSchema<TFieldValues>;
  fullSchema?: FormSchema<TFieldValues>;
};

/**
 * Rückgabewert des Input-Controllers
 * @template TFieldValues - Der Typ der Formularwerte
 * @param form - React Hook Form Instanz
 * @param isDisabled - Ob das Feld deaktiviert ist
 * @param hasIcons - Ob Icons vorhanden sind
 * @param startIconClasses - CSS-Klassen für Start-Icon
 * @param endIconClasses - CSS-Klassen für End-Icon
 * @param inputClasses - CSS-Klassen für Input
 * @param isRequired - Ob das Feld erforderlich ist
 * @param inputType - HTML-Input-Typ
 * @param ariaProps - ARIA-Eigenschaften für Barrierefreiheit
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  isDisabled: boolean;
  hasIcons: boolean;
  startIconClasses: string;
  endIconClasses: string;
  inputClasses: string;
  isRequired: boolean;
  inputType: InputHTMLType;
  ariaProps: {
    'aria-invalid': boolean;
    'aria-required': boolean;
    'aria-disabled': boolean;
  };
};

/**
 * Bekannte Zod-Typnamen
 */
export type KnownZodTypeName =
  | 'ZodString'
  | 'ZodNumber'
  | 'ZodInt'
  | 'ZodDate'
  | 'ZodOptional'
  | 'ZodNullable'
  | 'ZodDefault'
  | 'ZodUnion'
  | 'ZodNull'
  | 'ZodUndefined';

export type ZodSchema = z.ZodTypeAny;
