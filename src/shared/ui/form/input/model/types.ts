import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { z } from 'zod';

import type { InputShadcn } from '~/shared/shadcn/input';

// Unterstützte HTML Input-Typen
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

// Basistyp für alle Formular-Felder
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

// Verbesserte Typen für Zod-Schemas
export type ZodSchemaOf<T> = z.ZodType<T, z.ZodTypeDef, T>;

export type InferFieldSchema<TFieldValues> =
  TFieldValues extends Record<string, unknown>
    ? { [K in keyof TFieldValues]: ZodSchemaOf<TFieldValues[K]> }
    : never;

// Typkompatible Schema-Typen
export type FormSchema<TFieldValues extends FieldValues> = z.ZodObject<
  InferFieldSchema<TFieldValues>
>;

export type FieldSchema<TFieldValues extends FieldValues> = ZodSchemaOf<
  TFieldValues[keyof TFieldValues]
>;

// Erweiterte Input-Props mit Zod-Schema-Integration
export type Props<TFieldValues extends FieldValues = FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  'required'
> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: InputHTMLType;
  schema?: FieldSchema<TFieldValues>; // Typsicher
  fullSchema?: FormSchema<TFieldValues>; // Typsicher
  required?: boolean; // Wichtig: required hier explizit hinzufügen
} & Omit<React.ComponentPropsWithoutRef<typeof InputShadcn>, 'name' | 'type' | 'required'>;

// Controller-Props
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: InputHTMLType;
  schema?: FieldSchema<TFieldValues>; // Typsicher
  fullSchema?: FormSchema<TFieldValues>; // Typsicher
};

// Controller-Rückgabetyp
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

// Zod-Typen, um die interne Schema-Struktur zu typisieren
// Bekannte Zod-Typnamen als literale Typen
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

// Einfach mit z.ZodTypeAny arbeiten statt eigene Typen zu definieren
export type ZodSchema = z.ZodTypeAny;
