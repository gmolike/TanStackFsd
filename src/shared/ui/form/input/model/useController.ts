import type { FieldPath, FieldValues } from 'react-hook-form';

import type { z } from 'zod';

import { useForm } from '../../form';

import type {
  ControllerProps,
  ControllerResult,
  InferFieldSchema,
  InputHTMLType,
  KnownZodTypeName,
} from './types';

// Vereinfachte Hilfsfunktion zur Extraktion von Metadaten
const extractSchemaMetadata = <TFieldValues extends FieldValues = FieldValues>(
  name: FieldPath<TFieldValues>,
  schema?: z.ZodTypeAny,
  fullSchema?: z.ZodObject<InferFieldSchema<TFieldValues>>,
): { isRequired: boolean; inputType: InputHTMLType } => {
  let fieldSchema: z.ZodTypeAny | undefined = schema;

  // Wenn kein direktes Schema übergeben wurde, versuche es aus dem vollständigen Schema zu extrahieren
  if (!fieldSchema && fullSchema) {
    try {
      const shape = fullSchema._def.shape();
      const fieldName = name.toString();
      fieldSchema = shape[fieldName as keyof typeof shape];
    } catch (error) {
      console.warn(`Konnte Schema für Feld "${name}" nicht extrahieren:`, error);
    }
  }

  // Standardwerte
  let isRequired = false;
  let inputType: InputHTMLType = 'text';

  if (fieldSchema) {
    // Prüfe Schema-Typ und Optionen
    isRequired = isSchemaRequired(fieldSchema);
    inputType = inferInputType(fieldSchema);
  }

  return { isRequired, inputType };
};

// Vereinfachte Hilfsfunktion zum Prüfen, ob ein Schema erforderlich ist
const isSchemaRequired = (schema: z.ZodTypeAny): boolean => {
  // Prüfe auf ZodOptional, ZodNullable, ZodDefault oder ZodUnion mit Null/Undefined
  const typeName = schema._def.typeName as KnownZodTypeName;

  if (typeName === 'ZodOptional' || typeName === 'ZodNullable') {
    return false;
  }

  if (typeName === 'ZodDefault') {
    return false;
  }

  if (typeName === 'ZodUnion') {
    return !schema._def.options.some(
      (option: z.ZodTypeAny) =>
        option._def.typeName === 'ZodNull' || option._def.typeName === 'ZodUndefined',
    );
  }

  return true;
};

// Vereinfachte Funktion zum Extrahieren des Basis-Schemas
const getBaseSchema = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  let current = schema;
  while (
    current._def.typeName === 'ZodOptional' ||
    current._def.typeName === 'ZodNullable' ||
    current._def.typeName === 'ZodDefault'
  ) {
    current = current._def.innerType;
  }
  return current;
};

// Vereinfachte Funktion zum Ableiten des Eingabetyps
const inferInputType = (schema: z.ZodTypeAny): InputHTMLType => {
  const baseSchema = getBaseSchema(schema);
  const typeName = baseSchema._def.typeName as KnownZodTypeName;

  switch (typeName) {
    case 'ZodString': {
      const checks = baseSchema._def.checks || [];
      for (const check of checks) {
        if (check.kind === 'email') return 'email';
        if (check.kind === 'url') return 'url';
      }
      return 'text';
    }

    case 'ZodNumber':
    case 'ZodInt':
      return 'number';

    case 'ZodDate':
      return 'date';

    default:
      return 'text';
  }
};

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  required: explicitRequired,
  startIcon,
  endIcon,
  type: explicitType,
  schema,
  fullSchema,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  // Schema-Metadaten extrahieren
  const { isRequired: schemaRequired, inputType: schemaType } = extractSchemaMetadata(
    name,
    schema,
    fullSchema,
  );

  // Bestimme finale Werte
  const isRequired = explicitRequired !== undefined ? explicitRequired : schemaRequired;
  const inputType = explicitType || schemaType;

  const fieldState = form.getFieldState(name, formState);
  const { error } = fieldState;

  const hasIcons = !!startIcon || !!endIcon;

  // Konstante Klassen
  const startIconClasses = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';
  const endIconClasses = 'absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';
  const inputClasses = `${startIcon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`.trim();

  const ariaProps = {
    'aria-invalid': !!error,
    'aria-required': isRequired,
    'aria-disabled': isDisabled,
  };

  return {
    form,
    isDisabled,
    hasIcons,
    startIconClasses,
    endIconClasses,
    inputClasses,
    isRequired,
    inputType,
    ariaProps,
  };
};
